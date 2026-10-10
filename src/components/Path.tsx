import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { Container, Eyebrow } from './primitives';
import { useStatic } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

/** The four stops, in the order the work actually runs. */
const STOPS = [
  { label: 'Websites', note: 'A site built to convert, not just to exist.' },
  { label: 'Data', note: 'Analytics wired in from day one.' },
  { label: 'Automation', note: 'The repetitive work stops being yours.' },
  { label: 'Growth', note: 'Decisions from numbers, not hunches.' },
];

const W = 460;
const H = 860;

/**
 * The pipe: straight runs joined by half-circle bends, ending in a short drop
 * so the marker has somewhere to fall out of. One path drives both the drawn
 * tube and the marker's travel, so the two cannot disagree.
 */
const ROUTE = `M 110 70
  H 300 A 90 90 0 0 1 300 250
  H 160 A 90 90 0 0 0 160 430
  H 300 A 90 90 0 0 1 300 610
  H 170 A 60 60 0 0 0 110 670
  V 760`;

/** Where the numbered stops sit, in viewBox coordinates. */
const STOP_XY: [number, number][] = [
  [110, 70],
  [300, 250],
  [160, 430],
  [300, 610],
];

/** Where along the pipe each stop sits, as a fraction of the run. */
const STOP_AT = [0.02, 0.3, 0.58, 0.85];

/** Scroll distance the section stays pinned for. Longer = slower travel. */
const RUN = 3200;

/**
 * A pinned run through the pipe, then a panel that opens where the marker
 * lands.
 *
 * The section pins for `RUN` pixels of scroll, so the marker crosses the whole
 * route over that distance rather than over the height of the section. That is
 * the only reason the travel reads as slow and deliberate instead of flicking
 * past — the scroll distance sets the pace, not the easing.
 *
 * The last stretch is a handover: the marker drops out of the pipe's open end,
 * and the panel opens as a circle growing from exactly that point, so the thing
 * that fell is what opens the next view.
 *
 * Requires `smoothScroll.ts` forwarding Lenis's position to ScrollTrigger.
 * Lenis moves the page without the browser firing a scroll event for most of
 * the travel, and neither a pin nor a scrub hears anything without it.
 *
 * Reduced motion (and `?static`) skips the pin entirely: the pipe is drawn,
 * every stop is lit, and the panel sits in normal flow underneath as an
 * ordinary block. Nothing moves and nothing is hidden behind a scroll.
 */
export default function Path() {
  const isStatic = useStatic();
  const section = useRef<HTMLElement>(null);
  const marker = useRef<SVGGElement>(null);
  const tube = useRef<SVGPathElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isStatic || !section.current) return;

      const dots = gsap.utils.toArray<SVGGElement>(
        '[data-stop]',
        section.current,
      );
      const rows = gsap.utils.toArray<HTMLElement>(
        '[data-row]',
        section.current,
      );

      gsap.set(dots, { scale: 0.4, transformOrigin: 'center' });
      gsap.set(rows, { opacity: 0.25 });
      gsap.set(panel.current, { clipPath: 'circle(0% at 72% 88%)' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: `+=${RUN}`,
          pin: true,
          scrub: 1,
          // Start and end are measured once; lazy images and the web font land
          // afterwards and move this section down the page.
          invalidateOnRefresh: true,
        },
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      document.fonts?.ready.then(refresh);

      // 0 → 0.72 of the run: the marker travels the pipe.
      tl.to(
        marker.current,
        {
          motionPath: {
            // Both read from the element, so the drawn tube and the travel
            // cannot drift apart — and a raw `d` string here would be treated
            // as a CSS selector.
            path: tube.current!,
            align: tube.current!,
            alignOrigin: [0.5, 0.5],
          },
          ease: 'none',
          duration: 0.72,
        },
        0,
      );

      // Each stop lights as the marker reaches it.
      STOP_AT.forEach((at, i) => {
        const t = at * 0.72;
        tl.to(dots[i], { scale: 1, duration: 0.03, ease: 'back.out(2)' }, t).to(
          rows[i],
          { opacity: 1, duration: 0.03, ease: 'none' },
          t,
        );
      });

      // 0.72 → 0.84: it drops out of the open end and accelerates away.
      tl.to(
        marker.current,
        { y: '+=260', duration: 0.12, ease: 'power2.in' },
        0.72,
      ).to(marker.current, { opacity: 0, duration: 0.05 }, 0.79);

      // 0.8 → 1: the panel opens from the point it fell through.
      tl.to(
        panel.current,
        {
          clipPath: 'circle(150% at 72% 88%)',
          duration: 0.2,
          ease: 'power2.inOut',
        },
        0.8,
      );

      return () => window.removeEventListener('load', refresh);
    },
    { scope: section, dependencies: [isStatic] },
  );

  return (
    <section
      ref={section}
      id="path"
      className={`relative overflow-hidden border-b border-line bg-paper ${
        isStatic ? 'py-24' : ''
      }`}
      // Inline rather than a Tailwind class: the pinned frame must be exactly
      // the viewport, and a utility that fails to generate fails silently —
      // the section just grows to fit the artwork and the marker travels off
      // the bottom of the screen.
      style={isStatic ? undefined : { height: '100svh' }}
    >
      <div className="flex h-full items-center">
        <Container>
          <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-12">
            <div className="md:col-span-5">
              <Eyebrow>How it runs</Eyebrow>
              <h2 className="poster mt-6 text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
                One route,
                <br className="hidden md:block" /> four stops.
              </h2>

              <ol className="mt-10 space-y-5">
                {STOPS.map((s, i) => (
                  <li key={s.label} data-row className="flex gap-4">
                    <span className="mt-1 font-heading text-sm tabular-nums text-blue">
                      0{i + 1}
                    </span>
                    <span>
                      <span className="block font-heading text-base font-semibold text-ink">
                        {s.label}
                      </span>
                      <span className="mt-1 block font-body text-sm text-ink/60">
                        {s.note}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="md:col-span-7">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="mx-auto block"
                style={
                  isStatic
                    ? { height: 'auto', width: '100%', maxWidth: 340 }
                    : { height: '62svh', width: 'auto' }
                }
                aria-hidden
                focusable="false"
              >
                {/* The tube: one thick stroke for the wall and a thinner pale
                    one over it for the bore, so it reads as a pipe without
                    needing two hand-matched paths that could drift apart. */}
                <path
                  ref={tube}
                  d={ROUTE}
                  fill="none"
                  stroke="#002FD6"
                  strokeWidth={54}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={ROUTE}
                  fill="none"
                  stroke="#E8ECFF"
                  strokeWidth={38}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {STOP_XY.map(([cx, cy], i) => (
                  <g key={i} data-stop>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={17}
                      fill="#FFFFFF"
                      stroke="#002FD6"
                      strokeWidth={3}
                    />
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={13}
                      fontWeight={700}
                      fill="#002FD6"
                    >
                      {i + 1}
                    </text>
                  </g>
                ))}

                <g ref={marker}>
                  <circle r={15} fill="#002FD6" />
                </g>
              </svg>
            </div>
          </div>
        </Container>
      </div>

      {/* The view that opens where the marker lands. In normal flow for
          reduced motion, an overlay otherwise. */}
      <div
        ref={panel}
        className={
          isStatic
            ? 'mt-24 bg-navy py-24'
            : 'absolute inset-0 z-10 flex items-center bg-navy'
        }
      >
        <Container>
          <div className="max-w-2xl">
            <Eyebrow dark>Where it ends up</Eyebrow>
            <h2 className="poster mt-6 text-[clamp(2.25rem,5vw,3.5rem)] text-white">
              Four things.
              <br className="hidden md:block" /> One partner.
            </h2>
            <p className="mt-6 font-body text-base leading-relaxed text-white/70">
              The route is not four separate projects with four invoices. It is
              one engagement that keeps compounding: every stop makes the next
              one cheaper and the one after it obvious.
            </p>
            <a
              href="#contact"
              className="mt-10 inline-flex items-center gap-3 bg-white px-8 py-4 font-body text-base font-medium text-ink transition-colors hover:bg-blue-100"
            >
              Book a free call
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Container>
      </div>
    </section>
  );
}
