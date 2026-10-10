import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

/** Height of the fixed nav, so anchored sections don't land underneath it. */
const NAV_OFFSET = -88;

let instance: Lenis | null = null;

/** The live Lenis instance, or null when smooth scrolling is off. */
export const getLenis = () => instance;

/** Scroll to the top, going through Lenis so its target doesn't fight us. */
export function jumpToTop() {
  if (instance) instance.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

/**
 * Lerped page scroll. The wheel no longer moves the page directly — it feeds a
 * target that the page eases toward on every frame, which is what reads as
 * heavy, unhurried scrolling. Skipped entirely for reduced-motion users, who
 * then get the browser's native scroll.
 */
export function useSmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      // Lower lerp = longer glide. 0.075 is slow and weighty without feeling
      // disconnected from the wheel.
      lerp: 0.075,
      wheelMultiplier: 0.9,
      smoothWheel: true,
      // Touch keeps the OS's own momentum — hijacking it feels wrong on phones.
      syncTouch: false,
    });
    instance = lenis;

    // Lenis keeps its own rAF loop. Driving it from gsap.ticker is the pattern
    // GSAP documents, but it was not worth the risk here: this loop is known
    // to work, and the ticker's idle behaviour is not.
    let frame = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    // Lenis moves the page without the browser firing a scroll event for most
    // of the movement — measured here at one event for 1438px of travel. That
    // is what ScrollTrigger listens to, so without this line a scrubbed
    // trigger simply never hears that the page moved.
    lenis.on('scroll', ScrollTrigger.update);

    // GSAP's lag smoothing rescues dropped frames by lying about elapsed time.
    // Lenis already eases on its own, so the two corrections fight.
    gsap.ticker.lagSmoothing(0);

    // Same-page hash links have to go through Lenis or they snap instantly.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const link = (e.target as HTMLElement)?.closest?.('a');
      if (!link || link.target === '_blank') return;
      if (!link.hash || link.pathname !== window.location.pathname) return;

      const target = document.querySelector(link.hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: NAV_OFFSET });
      history.pushState(null, '', link.hash);
    };
    document.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(frame);
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.lagSmoothing(500, 33);
      document.removeEventListener('click', onClick);
      lenis.destroy();
      instance = null;
    };
  }, [reduced]);
}
