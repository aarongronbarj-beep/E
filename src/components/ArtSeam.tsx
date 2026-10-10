import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'motion/react';
import { useStatic } from '../lib/motion';
import { IMG } from '../lib/assets';

/** How far in from each side the band is cropped at rest, in percent. */
const SIDE = 9;
/** How much is cropped off the bottom at rest, in percent. */
const BOTTOM = 14;
/** Corner radius while cropped, in px. */
const RADIUS = 28;

/**
 * Artwork band that splits the page into blocks. Sits in normal flow and
 * scrolls with the page; the panels above and below drift over it.
 *
 * The band opens as it crosses the viewport: cropped in from the sides and
 * bottom at the edges of its travel, full width in the middle, then closing
 * again on the way out.
 *
 * That is done with `clip-path`, not by animating width or height. Changing
 * the element's size would rescale the image and change the section's own
 * height on every frame, which shifts everything below it while you scroll.
 * Clipping moves only the visible window: the artwork never moves a pixel and
 * the page's layout is identical at every point of the animation.
 *
 * With no `height` the band takes the artwork's own proportions, so nothing is
 * cropped by the layout — right when the artwork carries type that has to stay
 * readable. Give it a `height` to crop-to-fill instead, and `focus` to choose
 * the crop.
 *
 * Inset by the same gutter as Container, so it lines up with the page's text
 * instead of bleeding to the window edge.
 */
export default function ArtSeam({
  height,
  focus = 'center',
}: {
  height?: string;
  focus?: string;
}) {
  const isStatic = useStatic();
  const ref = useRef<HTMLElement>(null);

  // 0 as the band enters the viewport, 1 as it leaves.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // A plateau rather than a single peak, so the band actually rests at full
  // width for part of the crossing instead of only touching it for one frame.
  const stops = [0, 0.42, 0.58, 1];
  const side = useTransform(scrollYProgress, stops, [SIDE, 0, 0, SIDE]);
  const bottom = useTransform(scrollYProgress, stops, [BOTTOM, 0, 0, BOTTOM]);
  const radius = useTransform(scrollYProgress, stops, [RADIUS, 0, 0, RADIUS]);

  const clipPath = useMotionTemplate`inset(0% ${side}% ${bottom}% ${side}% round ${radius}px)`;

  return (
    <section
      ref={ref}
      aria-hidden
      className="relative z-0 overflow-hidden px-6 md:px-10"
      style={height ? { height } : undefined}
    >
      <motion.img
        src={IMG.artSeam}
        alt=""
        className={height ? 'h-full w-full object-cover' : 'block w-full'}
        style={{
          ...(height ? { objectPosition: focus } : {}),
          ...(isStatic ? {} : { clipPath }),
        }}
      />
    </section>
  );
}
