import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useStatic, EASE } from '../lib/motion';

/** How long one glitch burst runs, in ms. Short — it's punctuation, not decor. */
const BURST = 620;
/** Redraw cadence. Glitch has to look stepped, not eased. */
const STEP_MS = 45;

/**
 * Stagger-revealed heading lines that tear through a liquid glitch on entrance.
 *
 * The distortion is an SVG feTurbulence -> feDisplacementMap pair, which smears
 * the glyphs horizontally in wavy vertical bands — the same treatment the
 * `art-seam` artwork puts on its own typography, so the heading and the artwork
 * read as one language.
 *
 * The fringe is cobalt, not the usual red/cyan channel split: the brand is
 * single-hue and a stock RGB glitch would drag off-brand colour into the hero.
 *
 * The filter is torn down the instant the burst ends. Text under an SVG filter
 * is rasterised and loses subpixel AA, so it must not be the resting state —
 * settled type is plain, crisp DOM text, still selectable and readable to
 * screen readers throughout.
 */
export default function GlitchLines({
  lines,
  className = '',
  delay = 0,
  step = 0.09,
  hover = true,
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  step?: number;
  /** Re-fire the burst on pointer-enter. */
  hover?: boolean;
}) {
  const isStatic = useStatic();
  const filterId = `glitch-${useId().replace(/:/g, '')}`;

  const turb = useRef<SVGFETurbulenceElement>(null);
  const disp = useRef<SVGFEDisplacementMapElement>(null);
  const ghost = useRef<SVGFEOffsetElement>(null);
  const raf = useRef(0);
  const [active, setActive] = useState(false);

  const burst = useCallback(() => {
    if (isStatic) return;
    cancelAnimationFrame(raf.current);
    setActive(true);

    const start = performance.now();
    let painted = 0;

    const frame = (now: number) => {
      const t = (now - start) / BURST;

      if (t >= 1) {
        // Settle clean, then drop the filter so the type goes crisp again.
        setActive(false);
        return;
      }

      // Only repaint on the step cadence, so the tearing lands in discrete
      // jumps rather than sliding smoothly between states.
      if (now - painted >= STEP_MS) {
        painted = now;

        // Energy decays across the burst, and each step either fires hard or
        // sits at rest — a constant medium wobble reads as a broken render,
        // not as a glitch.
        const decay = 1 - t;
        const firing = Math.random() < 0.55 * decay + 0.12;
        const energy = firing ? decay * (0.4 + Math.random() * 0.6) : 0;

        turb.current?.setAttribute(
          'baseFrequency',
          `0.000001 ${(0.02 + Math.random() * 0.09).toFixed(5)}`,
        );
        turb.current?.setAttribute('seed', String((Math.random() * 100) | 0));
        disp.current?.setAttribute('scale', (energy * 34).toFixed(2));
        ghost.current?.setAttribute('dx', (-energy * 9).toFixed(2));
      }

      raf.current = requestAnimationFrame(frame);
    };

    raf.current = requestAnimationFrame(frame);
  }, [isStatic]);

  useEffect(() => {
    if (isStatic) return;
    // Let the lines start rising first; the tear lands mid-reveal.
    const id = setTimeout(burst, (delay + 0.1) * 1000);
    return () => {
      clearTimeout(id);
      cancelAnimationFrame(raf.current);
    };
  }, [burst, delay, isStatic]);

  return (
    <span
      className={`relative block ${className}`}
      onPointerEnter={hover ? burst : undefined}
      style={active ? { filter: `url(#${filterId})` } : undefined}
    >
      {/* Zero-box SVG carrying only the filter definition. */}
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
          {/* Cobalt fringe: a displaced copy shifted sideways and flooded with
              the brand blue, laid under the real glyphs. */}
          <feOffset ref={ghost} in="torn" dx={0} dy={0} result="shifted" />
          <feFlood floodColor="#002FD6" result="cobalt" />
          <feComposite in="cobalt" in2="shifted" operator="in" result="fringe" />
          <feMerge>
            <feMergeNode in="fringe" />
            <feMergeNode in="torn" />
          </feMerge>
        </filter>
      </svg>

      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={
              isStatic ? false : { filter: 'blur(12px)', opacity: 0, y: '0.5em' }
            }
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{
              delay: isStatic ? 0 : delay + i * step,
              duration: 0.7,
              ease: EASE,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
