import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useStatic } from '../lib/motion';

/**
 * How a panel moves against the fixed artwork while it crosses the viewport.
 *   rise — starts a touch low and lifts into place as it climbs. The block
 *          appears to slide up over the artwork.
 *   lag  — trails the scroll and sinks slightly as it leaves. Used on the hero
 *          so it drifts down while the artwork below is revealed.
 * `from` / `to` are multiples of the panel's `distance`.
 */
const MOTION = {
  rise: { offset: ['start end', 'start start'], from: 1, to: 0 },
  lag: { offset: ['start start', 'end start'], from: 0, to: 1 },
} as const;

export default function Panel({
  children,
  mode = 'rise',
  distance = 48,
  gap,
  className = '',
}: {
  children: ReactNode;
  mode?: keyof typeof MOTION;
  /** Travel in px across the whole crossing. Keep it a nudge, not a slide. */
  distance?: number;
  /** Transparent space above the panel where the artwork shows through. */
  gap?: string;
  className?: string;
}) {
  const isStatic = useStatic();
  const ref = useRef<HTMLDivElement>(null);
  const cfg = MOTION[mode];

  // Measured on the untransformed wrapper so the translate below can't feed
  // back into its own scroll range.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: cfg.offset as unknown as ['start end', 'start start'],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [cfg.from * distance, cfg.to * distance],
  );

  return (
    <div ref={ref} className="relative z-10" style={{ marginTop: gap }}>
      {/* Opaque by default: the artwork must not bleed through a block. */}
      <motion.div
        className={`bg-paper ${className}`}
        style={isStatic ? undefined : { y }}
      >
        {children}
      </motion.div>
    </div>
  );
}
