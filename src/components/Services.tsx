import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container, Eyebrow } from './primitives';
import Reveal from './Reveal';
import GradientWord from './GradientWord';
import { useServices } from '../lib/services';
import { useCopy } from '../lib/i18n';

/** Pointer-following glow like the hero's "tulosta", with a lime centre:
 *  lime at the pointer, through cobalt, settling into black (ink). */
const LIME_GLOW = '#acff12 0%, #1d07e0 35%, #0A0E1A 80%';

const COPY = {
  fi: {
    eyebrow: 'Miten autamme',
    title: 'Tuo lisää asiakkaita',
    accent: 'palveluidemme avulla',
    body: 'Siististä, ammattimaisesta ja edullisesta nettisivu-uudistuksesta, suuremmin kehitettyyn ja optimoituun digitaaliseen myyntitykkiin, jolla kilpaillaan maailman markkinoiden jättien kanssa. Meiltä löytyy vastaus, jokaiseen tarpeeseesi.',
    more: 'Lue lisää',
    imgAlt: 'työesimerkkejä',
  },
  en: {
    eyebrow: 'How we help',
    title: 'Acquire more customers',
    accent: 'with our services',
    body: "From a clean, professional and affordable website refresh to a fully developed, optimised digital sales machine that competes with the world's biggest players. We have an answer for your every need.",
    more: 'Learn more',
    imgAlt: 'work examples',
  },
};

export default function Services() {
  const t = useCopy(COPY);
  const services = useServices();
  return (
    <section id="services" className="border-b border-line bg-paper py-24 md:py-32">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">{t.eyebrow}</Eyebrow>
          <h2 className="poster mt-6 text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
            {t.title} <GradientWord stops={LIME_GLOW}>{t.accent}</GradientWord>
          </h2>
          <p className="mx-auto mt-6 max-w-lg font-body text-base leading-relaxed text-ink/60">
            {t.body}
          </p>
        </Reveal>

        <ol className="mt-16 border-t border-line md:mt-20">
          {services.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <li key={s.slug} className="border-b border-line">
                <Reveal delay={0.05}>
                  <Link
                    to={`/services/${s.slug}`}
                    className="group grid items-center gap-10 py-14 md:grid-cols-12 md:gap-12 md:py-20"
                  >
                    <div className={`md:col-span-6 ${flip ? 'md:order-2 md:col-start-7' : ''}`}>
                      <h3 className="poster text-[clamp(2.125rem,4.4vw,3.5rem)] leading-[1.02] text-ink transition-colors duration-300 group-hover:text-blue">
                        {s.title}
                      </h3>
                      <p className="mt-5 max-w-md font-body text-base leading-relaxed text-ink/60">
                        {s.body}
                      </p>

                      <ul className="mt-8 max-w-md border-t border-line">
                        {s.features.slice(0, 4).map((f) => (
                          <li
                            key={f.slug}
                            className="border-b border-line py-3 font-body text-[15px] text-ink/75"
                          >
                            {f.title}
                          </li>
                        ))}
                      </ul>

                      <span className="mt-8 inline-flex items-center gap-2 font-body text-sm font-medium text-blue">
                        {t.more}
                        <ArrowRight
                          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                          strokeWidth={2.25}
                        />
                      </span>
                    </div>

                    <div className={`md:col-span-6 ${flip ? 'md:order-1 md:col-start-1' : 'md:col-start-7'}`}>
                      <img
                        src={s.img}
                        alt={`${s.title}: ${t.imgAlt}`}
                        loading="lazy"
                        className="mx-auto w-full max-w-[560px] rounded-2xl object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      />
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
