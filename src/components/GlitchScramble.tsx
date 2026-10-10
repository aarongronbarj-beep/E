import { useCallback, useId, useRef } from 'react';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { useGSAP } from '@gsap/react';
import { useStatic } from '../lib/motion';

gsap.registerPlugin(ScrambleTextPlugin, useGSAP);

/** Cobalt only — the brand is single-hue, so no RGB channel split. */
const COBALT = '#002FD6';

/**
 * Scrambled character churn under a liquid tear.
 *
 * ScrambleTextPlugin and SplitText cannot share an element: Scramble rewrites
 * the target's innerHTML on every frame, which would wipe SplitText's
 * per-character spans. So the two effects are stacked at different DOM levels
 * instead — Scramble owns each line's text, and the displacement filter is
 * applied to the container above them, where a child's innerHTML churn cannot
 * reach it.
 *
 * The scramble gives per-character noise; the filter smears the whole block the
 * way the `art-seam` artwork smears its own typography. Together they read as
 * one signal breaking up rather than two effects stacked.
 *
 * Accessibility: the cycling glyphs are nonsense mid-tween, so the animated
 * lines are aria-hidden and the real heading is carried by visually-hidden
 * text. Reduced motion (and `?static`) renders plain words with no scramble
 * and no filter.
 */
export default function GlitchScramble({
  words,
  className = '',
}: {
  words: string[];
  className?: string;
}) {
  const isStatic = useStatic();
  const filterId = `scramble-${useId().replace(/:/g, '')}`;

  const root = useRef<HTMLSpanElement>(null);
  const stage = useRef<HTMLSpanElement>(null);
  const turb = useRef<SVGFETurbulenceElement>(null);
  const disp = useRef<SVGFEDisplacementMapElement>(null);
  const ghost = useRef<SVGFEOffsetElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  // Assigned inside useGSAP via contextSafe — a handler that fires after the
  // hook has run is outside the context unless it is wrapped.
  const fire = useRef<() => void>(() => {});

  /** Push one energy level, 0..1, into the filter. */
  const applyEnergy = useCallback((e: number) => {
    if (!stage.current) return;

    if (e <= 0.001) {
      // Drop the filter entirely at rest: text under an SVG filter is
      // rasterised and loses subpixel AA.
      stage.current.style.filter = '';
      return;
    }
    stage.current.style.filter = `url(#${filterId})`;
    turb.current?.setAttribute(
      'baseFrequency',
      `0.000001 ${(0.02 + Math.random() * 0.09).toFixed(5)}`,
    );
    turb.current?.setAttribute('seed', String((Math.random() * 100) | 0));
    disp.current?.setAttribute('scale', (e * 30).toFixed(2));
    ghost.current?.setAttribute('dx', (-e * 8).toFixed(2));
  }, [filterId]);

  useGSAP(
    (_context, contextSafe) => {
      if (isStatic || !root.current) return;

      fire.current = contextSafe
        ? contextSafe(() => tl.current?.invalidate().restart())
        : () => tl.current?.invalidate().restart();

      const lines = gsap.utils.toArray<HTMLElement>('[data-line]', root.current);

      // The filter is driven by tweening a plain object and pushing its value
      // in on update — the stepped ease is what makes it read as a glitch
      // rather than a wobble.
      const energy = { v: 0 };

      const build = () => {
        const t = gsap.timeline();

        t.to(energy, {
          v: 1,
          duration: 0.2,
          ease: 'steps(6)',
          onUpdate: () => applyEnergy(energy.v),
        })
;

        // One tween per line rather than one staggered tween over all of them.
        // Each line scrambles back to its own word, and `scrambleText.text` is
        // typed as a plain string — a function-based value resolves at runtime
        // but does not type-check, so the word is read here instead.
        lines.forEach((line, i) => {
          t.to(
            line,
            {
              duration: 0.62,
              ease: 'none',
              scrambleText: {
                text: line.getAttribute('data-line') ?? '',
                // ASCII only: block and box-drawing glyphs are missing from
                // most grotesks and would render as tofu.
                chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>{}',
                // Faster churn, since there is far less time to fill.
                speed: 1.1,
                // Keep the length fixed so a line cannot reflow mid-scramble.
                tweenLength: false,
              },
            },
            // Same cadence the stagger gave.
            0.05 + i * 0.09,
          );
        });

        t
          .to(
            energy,
            {
              v: 0,
              duration: 0.42,
              ease: 'steps(8)',
              onUpdate: () => applyEnergy(energy.v),
              onComplete: () => applyEnergy(0),
            },
            0.28,
          );

        return t;
      };

      tl.current = build();

      return () => {
        tl.current?.kill();
        applyEnergy(0);
      };
    },
    { scope: root, dependencies: [isStatic] },
  );

  if (isStatic) {
    return (
      <span className={`block ${className}`}>
        {words.map((w) => (
          <span key={w} className="block">
            {w}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span
      ref={root}
      className={`relative block ${className}`}
      onPointerEnter={() => fire.current()}
      onFocus={() => fire.current()}
    >
      <svg aria-hidden className="absolute h-0 w-0" focusable="false">
        <filter
          id={filterId}
          x="-15%"
          y="-15%"
          width="130%"
          height="130%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            ref={turb}
            type="fractalNoise"
            baseFrequency="0.000001 0.05"
            numOctaves={1}
            seed={7}
            result="noise"
          />
          <feDisplacementMap
            ref={disp}
            in="SourceGraphic"
            in2="noise"
            scale={0}
            xChannelSelector="R"
            yChannelSelector="G"
            result="torn"
          />
          <feOffset ref={ghost} in="torn" dx={0} dy={0} result="shifted" />
          <feFlood floodColor={COBALT} result="cobalt" />
          <feComposite in="cobalt" in2="shifted" operator="in" result="fringe" />
          <feMerge>
            <feMergeNode in="fringe" />
            <feMergeNode in="torn" />
          </feMerge>
        </filter>
      </svg>

      {/* The real heading, for assistive tech and crawlers. */}
      <span className="sr-only">{words.join(' ')}</span>

      <span ref={stage} aria-hidden className="block">
        {words.map((w) => (
          <span key={w} data-line={w} className="block">
            {w}
          </span>
        ))}
      </span>
    </span>
  );
}
