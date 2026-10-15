import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container, Eyebrow } from './primitives';
import Reveal from './Reveal';
import { useServices } from '../lib/services';
import { useCopy } from '../lib/i18n';

const COPY = {
  fi: {
    eyebrow: 'Miten autamme',
    title: 'Neljä asiaa.',
    accent: 'Yksi ratkaisu.',
    body: 'Verkkosivut, jotka tuovat yhteydenottoja. Data, joka kertoo mitä tehdä seuraavaksi. Markkinointi, joka tavoittaa oikeat ihmiset. Hakukoneoptimointi, jolla sinut löydetään. Yhdessä, ei erillisinä siiloina.',
    more: 'Lue lisää',
    imgAlt: 'työesimerkkejä',
  },
  en: {
    eyebrow: 'How we help',
    title: 'Four things.',
    accent: 'One solution.',
    body: 'Websites that convert. Data that tells you what to do next. Marketing that reaches the right people. SEO that gets you found. Together, not in separate silos.',
    more: 'Learn more',
    imgAlt: 'work examples',
  },
};

/** Subtle dotted texture behind each card, matching the reference layout. */
const dots = {
  backgroundImage:
    'radial-gradient(circle, rgba(10,14,26,0.06) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
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
            {t.title} <span className="text-blue">{t.accent}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg font-body text-base leading-relaxed text-ink/60">
            {t.body}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.08}>
              <Link
                to={`/services/${s.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper p-8 shadow-[0_1px_2px_rgba(10,14,26,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(10,14,26,0.08)]"
                style={dots}
              >
                <div className="text-center">
                  <h3 className="font-heading text-2xl font-semibold text-ink">
                    {s.title}
                  </h3>
                  <p className="mx-auto mt-3 max-w-xs font-body text-[15px] leading-relaxed text-ink/55">
                    {s.body}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 font-body text-sm font-medium text-blue transition-colors group-hover:bg-blue group-hover:text-white">
                    {t.more}
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-blue text-white transition-colors group-hover:bg-white group-hover:text-blue">
                      <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
                    </span>
                  </span>
                </div>

                <div className="mt-8 flex flex-1 items-end">
                  <img
                    src={s.img}
                    alt={`${s.title}: ${t.imgAlt}`}
                    loading="lazy"
                    className="w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
