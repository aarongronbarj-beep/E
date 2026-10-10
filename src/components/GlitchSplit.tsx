import { Fragment, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { useStatic } from '../lib/motion';

gsap.registerPlugin(SplitText, useGSAP);

/** Cobalt only — the brand is single-hue, so no RGB channel split. */
const COBALT = '#002FD6';
const INK = '#0A0E1A';

/**
 * Poster heading that tears one character at a time.
 *
 * Where the SVG-filter version smears a whole line as one surface, this drives
 * every glyph independently: each character breaks on its own, in random
 * order. That is what SplitText buys — the heading comes apart rather than
 * wobbling as one surface.
 *
 * Nothing here moves or deforms a glyph. No skew, no scale, no offset: every
 * letter holds its exact position for the whole burst, so the headline never
 * loses its shape as a piece of typography.
 *
 * What is left are the three axes that can break without displacing anything —
 * the letter blanks out, flips to cobalt, and grows a cobalt echo beside it.
 * The echo is a text-shadow, so the copy is what sits off-register while the
 * glyph itself stays nailed down.
 *
 * The stepped quality comes from `steps()` easing rather than a hand-rolled
 * rAF loop. A glitch has to land in discrete jumps; a smooth tween between the
 * same values reads as a wobble.
 *
 * Everything runs on transforms and text-shadow, so it stays on the compositor
 * and never rasterises the type — unlike an SVG filter, which re-renders the
 * glyphs every frame it is applied.
 *
 * Accessibility: SplitText's default `aria: 'auto'` labels the container with
 * the original text and hides the generated per-character spans, so assistive
 * tech reads the heading as one string. Reduced motion (and `?static`) skips
 * the split entirely and renders plain text.
 */
export default function GlitchSplit({
  words,
  className = '',
}: {
  words: string[];
  className?: string;
}) {
  const isStatic = useStatic();
  const root = useRef<HTMLSpanElement>(null);
  const chars = useRef<Element[]>([]);
  const burst = useRef<gsap.core.Timeline | null>(null);
  // Assigned inside useGSAP via contextSafe — a handler that fires after the
  // hook has run is outside the context unless it is wrapped.
  const fire = useRef<() => void>(() => {});

  /** One tear across all characters, in random order. */
  const buildBurst = useCallback(() => {
    const tl = gsap.timeline({ paused: true });

    // Function-based values randomise per character. They are only recomputed
    // when the timeline is invalidated, so `fire()` invalidates before every
    // restart — otherwise each tear would replay the exact same offsets.
    tl.to(chars.current, {
      // Values are picked from fixed sets rather than continuous ranges, and
      // the resting value is weighted in: most glyphs break while some hold.
      // Randomising every character equally reads as noise across the whole
      // word; a signal error is selective.
      opacity: () => gsap.utils.random([0.15, 0.4, 1, 1]),
      color: () => gsap.utils.random([COBALT, INK, INK]),
      textShadow: () => {
        const d = gsap.utils.random([3, 5, 8, 11]);
        // Cobalt leads, a faint ink copy trails: a two-sided off-register echo
        // around a glyph that has not moved.
        return `-${d}px 0 0 ${COBALT}, ${Math.round(d * 0.5)}px 0 0 rgba(10,14,26,0.28)`;
      },
      duration: 0.3,
      // Few steps, hard cuts. More steps would blend the break into a fade.
      ease: 'steps(3)',
      stagger: { from: 'random', amount: 0.18 },
    }).to(chars.current, {
      opacity: 1,
      color: INK,
      textShadow: '0px 0 0 rgba(0,47,214,0), 0px 0 0 rgba(10,14,26,0)',
      duration: 0.3,
      ease: 'steps(3)',
      stagger: { from: 'random', amount: 0.14 },
      onComplete: () =>
        gsap.set(chars.current, { clearProps: 'color,textShadow,opacity' }),
    });

    return tl;
  }, []);

  useGSAP(
    (_context, contextSafe) => {
      if (isStatic || !root.current) return;

      fire.current = contextSafe
        ? contextSafe(() => burst.current?.invalidate().restart())
        : () => burst.current?.invalidate().restart();

      const split = SplitText.create(root.current, {
        type: 'lines,chars',
        mask: 'lines',
        charsClass: 'gchar',
        // Re-split when the font finishes loading or the line wrapping
        // changes. Doing this by hand is the part that makes character
        // animation painful without SplitText.
        autoSplit: true,
        onSplit: (self) => {
          chars.current = self.chars;

          const tl = gsap.timeline();
          // Entrance: lines rise out of their masks, then the type tears.
          tl.from(self.lines, {
            yPercent: 100,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.09,
          });

          burst.current = buildBurst();
          tl.add(() => burst.current?.invalidate().restart(), '-=0.35');

          // Returning the timeline lets SplitText clean it up on a re-split.
          return tl;
        },
      });

      return () => {
        burst.current?.kill();
        split.revert();
      };
    },
    { scope: root, dependencies: [isStatic] },
  );

  return (
    <span
      ref={root}
      className={`block ${className}`}
      // Splitting characters re-wraps each glyph, which drops the pair kerning
      // the browser applied to the whole word. Without this the heading visibly
      // shifts at split time — worse here, where .poster tracks at -0.03em.
      style={{ fontKerning: 'none', textRendering: 'optimizeSpeed' }}
      onPointerEnter={() => fire.current()}
      onFocus={() => fire.current()}
    >
      {words.map((w, i) => (
        <Fragment key={w}>
          {i > 0 && <br />}
          {w}
        </Fragment>
      ))}
    </span>
  );
}
