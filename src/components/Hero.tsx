import { motion } from 'motion/react';
import { Container, Eyebrow } from './primitives';
import GlitchLines from './GlitchText';
import GlitchSplit from './GlitchSplit';
import GlitchScramble from './GlitchScramble';
import DotField from './DotField';
import GlitchButton from './GlitchButton';
import { reveal, useStatic } from '../lib/motion';
import { IMG } from '../lib/assets';

const POSTER = ['Websites.', 'Data.', 'Automation.', 'Growth.'];

/** Temporary A/B/C switch so the three treatments can be compared live:
 *    (none)     SVG-filter line tear
 *    ?gsap      SplitText per-character tear
 *    ?scramble  ScrambleText churn under the same filter */
const variant = () => {
  if (typeof window === 'undefined') return 'filter';
  const q = new URLSearchParams(window.location.search);
  if (q.has('scramble')) return 'scramble';
  if (q.has('gsap')) return 'split';
  return 'filter';
};

export default function Hero() {
  const isStatic = useStatic();
  const fadeProps = (delay: number) => ({
    variants: reveal,
    initial: isStatic ? false : ('hidden' as const),
    animate: 'show' as const,
    transition: { delay: isStatic ? 0 : delay, duration: 0.6 },
  });
  return (
    <section id="top" className="bg-paper px-3 pb-3 pt-[4.75rem] md:px-5 md:pb-5 md:pt-[5.25rem]">
      {/* The hero is a card: inset from the page edge, rounded, and clipping.
          Both artwork layers are absolutely positioned children of this box, so
          the wash and the dot field are cut off by its corners instead of
          running to the window edge. */}
      <div className="relative overflow-hidden rounded-3xl border border-line bg-paper-2">
      {/* Grainy screen-print gradient field. Generated Higgsfield asset, held
          at 45%: at full strength the field carries both near-white and deep
          cobalt under the headline, and no single text colour survives both. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-left-bottom bg-no-repeat opacity-45 [mask-image:linear-gradient(to_right,#000_0%,#000_28%,transparent_62%)] [-webkit-mask-image:linear-gradient(to_right,#000_0%,#000_28%,transparent_62%)]"
        style={{ backgroundImage: `url(${IMG.heroRiso})` }}
      />

      {/* Blue-noise signal field bleeding from the top-right.
          Generated Higgsfield asset, masked to fade into the white canvas. */}
      {variant() === 'split' ? (
        <DotField
          image="/images/hero-bloom-last.webp"
          imageZoom={1.7}
          focal={[0.68, 0.52]}
          shapeY={0.52}
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-[58%] md:block [mask-image:linear-gradient(to_left,#000_50%,transparent_92%)] [-webkit-mask-image:linear-gradient(to_left,#000_50%,transparent_92%)]"
        />
      ) : (
        <div
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-[58%] bg-cover bg-right-top bg-no-repeat md:block"
          style={{
            backgroundImage: `url(${IMG.heroNoise})`,
            WebkitMaskImage: 'linear-gradient(to left, #000 50%, transparent 92%)',
            maskImage: 'linear-gradient(to left, #000 50%, transparent 92%)',
          }}
          aria-hidden
        />
      )}

      <Container className="relative">
        <div className="grid min-h-[calc(100svh-6.5rem)] grid-cols-1 items-center gap-10 py-10 md:grid-cols-12 md:py-14">
          <div className="md:col-span-7">
            <motion.div {...fadeProps(0)}>
              <Eyebrow>Digital solutions for small businesses</Eyebrow>
            </motion.div>

            <h1 className="poster mt-7 text-[clamp(3rem,9vw,6.5rem)] text-ink">
              {variant() === 'scramble' ? (
                <GlitchScramble words={POSTER} />
              ) : variant() === 'split' ? (
                <GlitchSplit words={POSTER} />
              ) : (
                <GlitchLines
                  delay={0.15}
                  lines={POSTER.map((w, i) => (
                    <span key={i}>{w}</span>
                  ))}
                />
              )}
            </h1>

            <motion.div {...fadeProps(0.55)} className="mt-10">
              <GlitchButton href="#contact" label="Book a free call" />
            </motion.div>
          </div>

          <div className="md:col-span-5" aria-hidden />
        </div>
      </Container>
      </div>
    </section>
  );
}
