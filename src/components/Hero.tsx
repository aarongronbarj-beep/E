import { motion } from 'motion/react';
import GlitchLines from './GlitchText';
import CtaButton from './CtaButton';
import GradientWord from './GradientWord';
import { reveal, useStatic } from '../lib/motion';
import { IMG } from '../lib/assets';
import { useCopy } from '../lib/i18n';

const COPY = {
  fi: { poster: ['Nettisivut', 'jotka', 'tekevät', 'tulosta'], cta: 'Varaa ilmainen puhelu' },
  en: { poster: ['Websites', 'that', 'deliver', 'results'], cta: 'Book a free call' },
};

/** Figma "Hero card" (Ealize – Etusivu, node 2:15), drawn on a 1440×820 frame.
 *  From md up every position is a multiple of `--u` (1 unit = 14.4 design px).
 *  `--u` tracks 1cqw of the card up to a ~1400px card, then grows at half rate,
 *  so on large screens the type and artwork come out somewhat smaller.
 *  The artwork is anchored right and the text left, so on a wide card the gap opens in the middle. */
const stripeMask = {
  WebkitMaskImage: `url(${IMG.hero.stripesMask})`,
  maskImage: `url(${IMG.hero.stripesMask})`,
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'calc(var(--u)*3.347) 0',
  maskPosition: 'calc(var(--u)*3.347) 0',
  WebkitMaskSize: 'calc(var(--u)*42.228) calc(var(--u)*34.028)',
  maskSize: 'calc(var(--u)*42.228) calc(var(--u)*34.028)',
} as const;

export default function Hero() {
  const isStatic = useStatic();
  const t = useCopy(COPY);
  const fadeProps = (delay: number) => ({
    variants: reveal,
    initial: isStatic ? false : ('hidden' as const),
    animate: 'show' as const,
    transition: { delay: isStatic ? 0 : delay, duration: 0.6 },
  });
  return (
    <section id="top" className="bg-paper px-3 pb-3 pt-[4.75rem] md:px-5 md:pb-5 md:pt-[5.25rem]">
      <div className="relative overflow-hidden rounded-3xl bg-paper-2 [container-type:inline-size] [--u:min(1cqw,0.5cqw_+_7px)]">
        {/* Artwork: two masked halftone stripe bands behind the flowers. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
          {[
            { right: 'calc(var(--u)*-25.795)', top: 'calc(var(--u)*-9.653)' },
            { right: 'calc(var(--u)*-14.129)', top: 'calc(var(--u)*21.25)' },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute h-[calc(var(--u)*34.957)] w-[calc(var(--u)*62.476)]"
              style={{ ...pos, ...stripeMask }}
            >
              <img src={IMG.hero.stripes} alt="" className="absolute inset-0 h-full w-full max-w-none object-cover" />
            </div>
          ))}
          <div className="absolute right-[calc(var(--u)*5.694)] top-[calc(var(--u)*4.653)] h-[calc(var(--u)*50.625)] w-[calc(var(--u)*53.264)] overflow-hidden">
            <img src={IMG.hero.flowers} alt="" className="absolute left-[-121.58%] top-0 h-full w-[221.58%] max-w-none" />
          </div>
        </div>

        <div className="relative flex flex-col gap-10 px-6 py-12 md:static md:block md:h-[calc(var(--u)*56.944)] md:p-0">
          <h1 className="poster text-[clamp(3rem,13vw,5rem)] text-ink md:absolute md:left-[calc(var(--u)*6.597)] md:top-[calc(var(--u)*6.111)] md:w-[calc(var(--u)*44.236)] md:text-[calc(var(--u)*7.222)]">
            <GlitchLines
              delay={0.15}
              lines={t.poster.map((w, i) =>
                i === t.poster.length - 1 ? (
                  <GradientWord key={i}>{w}</GradientWord>
                ) : (
                  <span key={i}>{w}</span>
                ),
              )}
            />
          </h1>

          <motion.div
            {...fadeProps(0.4)}
            className="flex items-center gap-3 md:pointer-events-none md:absolute md:inset-0 md:block"
          >
            <span className="font-['Imbue'] text-[4.5rem] font-semibold leading-none text-[#1d07e0] md:absolute md:left-[calc(var(--u)*7.222)] md:top-[calc(var(--u)*32.639)] md:text-[calc(var(--u)*8.109)] md:leading-normal">
              ealize
            </span>
            <img
              src={IMG.hero.rose}
              alt=""
              aria-hidden
              className="h-[3.75rem] w-auto md:absolute md:left-[calc(var(--u)*23.361)] md:top-[calc(var(--u)*35.917)] md:h-[calc(var(--u)*7.076)] md:w-[calc(var(--u)*6.22)]"
            />
          </motion.div>

          <motion.div {...fadeProps(0.55)} className="md:absolute md:left-[calc(var(--u)*6.597)] md:top-[calc(var(--u)*47.361)]">
            <CtaButton href="/contact" label={t.cta} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
