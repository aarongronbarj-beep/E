import { motion } from 'motion/react';
import GlitchLines from './GlitchText';
import GlitchButton from './GlitchButton';
import { reveal, useStatic } from '../lib/motion';
import { IMG } from '../lib/assets';

const POSTER = ['Nettisivut', 'jotka', 'tekevät', 'tulosta'];

/** Figma "Hero card" (Ealize – Etusivu, node 2:15), drawn on a 1440×820 frame.
 *  From md up every position is in `cqw` of the card (1cqw = 14.4 design px),
 *  so the whole composition scales with the card exactly as laid out. */
const stripeMask = {
  WebkitMaskImage: `url(${IMG.hero.stripesMask})`,
  maskImage: `url(${IMG.hero.stripesMask})`,
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: '3.347cqw 0',
  maskPosition: '3.347cqw 0',
  WebkitMaskSize: '42.228cqw 34.028cqw',
  maskSize: '42.228cqw 34.028cqw',
} as const;

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
      <div className="relative overflow-hidden rounded-3xl bg-paper-2 [container-type:inline-size] md:aspect-[1440/820]">
        {/* Artwork: two masked halftone stripe bands behind the flowers. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
          {[
            { left: '63.319cqw', top: '-9.653cqw' },
            { left: '51.653cqw', top: '21.25cqw' },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute h-[34.957cqw] w-[62.476cqw]"
              style={{ ...pos, ...stripeMask }}
            >
              <img src={IMG.hero.stripes} alt="" className="absolute inset-0 h-full w-full max-w-none object-cover" />
            </div>
          ))}
          <div className="absolute left-[41.042cqw] top-[4.653cqw] h-[50.625cqw] w-[53.264cqw] overflow-hidden">
            <img src={IMG.hero.flowers} alt="" className="absolute left-[-121.58%] top-0 h-full w-[221.58%] max-w-none" />
          </div>
        </div>

        <div className="relative flex flex-col gap-10 px-6 py-12 md:static md:block md:p-0">
          <h1 className="poster text-[clamp(3rem,13vw,5rem)] text-ink md:absolute md:left-[6.597cqw] md:top-[6.111cqw] md:w-[44.236cqw] md:text-[7.222cqw]">
            <GlitchLines
              delay={0.15}
              lines={POSTER.map((w, i) => (
                <span key={i}>{w}</span>
              ))}
            />
          </h1>

          <motion.div
            {...fadeProps(0.4)}
            className="flex items-center gap-3 md:pointer-events-none md:absolute md:inset-0 md:block"
          >
            <span className="font-['Imbue'] text-[4.5rem] font-semibold leading-none text-[#1d07e0] md:absolute md:left-[7.222cqw] md:top-[32.639cqw] md:text-[8.109cqw] md:leading-normal">
              ealize
            </span>
            <img
              src={IMG.hero.rose}
              alt=""
              aria-hidden
              className="h-[3.75rem] w-auto md:absolute md:left-[23.361cqw] md:top-[35.917cqw] md:h-[7.076cqw] md:w-[6.22cqw]"
            />
          </motion.div>

          <motion.div {...fadeProps(0.55)} className="md:absolute md:left-[6.597cqw] md:top-[47.361cqw]">
            <GlitchButton href="/contact" label="Book a free call" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
