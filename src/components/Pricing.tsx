import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container, Eyebrow } from './primitives';
import Reveal from './Reveal';
import { useCopy } from '../lib/i18n';

type Plan = {
  name: string;
  price: string;
  note?: string;
  desc: string;
  features: string[];
  featured: boolean;
  cta: string;
};

/* NOTE: prices are editable placeholders. Adjust to your real rates. */
const PLANS_EN: Plan[] = [
  {
    name: 'Website',
    price: 'from €399',
    note: '+ maintenance',
    desc: 'A clean, fast, professional site, planned, built, launched and hosted.',
    features: [
      'Custom design, mobile-first',
      'Copy & on-page SEO basics',
      'Hosting & domain setup',
      'Ongoing maintenance available',
    ],
    featured: false,
    cta: 'Start a project',
  },
  {
    name: 'Digital Marketing',
    price: 'Monthly',
    note: 'priced after a free call',
    desc: 'Campaigns and SEO that bring the right people to your business, with the results reported every month.',
    features: [
      'Campaign strategy',
      'Google & social media ads',
      'SEO & Google Business Profile',
      'Monthly results report',
    ],
    featured: false,
    cta: 'Get started',
  },
  {
    name: 'Full System',
    price: 'Custom',
    desc: 'Everything in Website and Digital Marketing, plus data analysis across all of your business data, in one dashboard.',
    features: [
      'Everything in Website + Digital Marketing',
      'Business tool integrations & visitor tracking',
      'Marketing, income, competitor analysis & forecasts',
      'Unified dashboard & priority support',
    ],
    featured: true,
    cta: 'Most popular',
  },
];

const PLANS_FI: Plan[] = [
  {
    name: 'Verkkosivut',
    price: 'alk. 399 €',
    note: '+ ylläpito',
    desc: 'Siistit, nopeat ja ammattimaiset sivut suunniteltuina, toteutettuina, julkaistuina ja ylläpidettyinä.',
    features: [
      'Räätälöity ulkoasu, mobiili edellä',
      'Tekstit ja hakukoneoptimoinnin perusteet',
      'Palvelin ja verkkotunnus valmiiksi',
      'Jatkuva ylläpito saatavilla',
    ],
    featured: false,
    cta: 'Aloita projekti',
  },
  {
    name: 'Digitaalinen markkinointi',
    price: 'Kuukausittain',
    note: 'hinta ilmaisen puhelun jälkeen',
    desc: 'Kampanjat ja hakukoneoptimointi, jotka tuovat oikeat ihmiset yritykseesi, ja tulokset raportoituna joka kuukausi.',
    features: [
      'Kampanjastrategia',
      'Google- ja somemainonta',
      'Hakukoneoptimointi ja Google-yritysprofiili',
      'Kuukausittainen tulosraportti',
    ],
    featured: false,
    cta: 'Aloitetaan',
  },
  {
    name: 'Kokonaisratkaisu',
    price: 'Räätälöity',
    desc: 'Kaikki Verkkosivut- ja Digitaalinen markkinointi -paketeista sekä data-analyysi koko yrityksesi datasta yhdessä näkymässä.',
    features: [
      'Kaikki Verkkosivut + Digitaalinen markkinointi -paketeista',
      'Liiketoiminnan työkalujen integraatiot ja kävijäseuranta',
      'Markkinointi-, tulo- ja kilpailija-analyysi sekä ennusteet',
      'Yhtenäinen näkymä ja ensisijainen tuki',
    ],
    featured: true,
    cta: 'Suosituin',
  },
];

const COPY = {
  fi: {
    plans: PLANS_FI,
    eyebrow: 'Hinnasto',
    title: 'Läpinäkyvä. Ei yllätyksiä.',
    body: 'Aloita pienesti verkkosivuilla tai mene suoraan kokonaisratkaisuun. Jokainen paketti on kiinteä ja rehellinen tarjous ilmaisen puhelun jälkeen. Ei toimiston yleiskuluja.',
    popular: 'Suosittu',
    start: 'Aloita projekti',
  },
  en: {
    plans: PLANS_EN,
    eyebrow: 'Pricing',
    title: 'Transparent. No surprises.',
    body: 'Start small with a website, or go all the way to a full system. Every plan is a fixed, honest quote after a free call. No agency overhead.',
    popular: 'Popular',
    start: 'Start a project',
  },
};

export default function Pricing() {
  const t = useCopy(COPY);
  return (
    <section id="pricing" className="border-y border-line bg-paper py-24 md:py-32">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="poster mt-6 text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
            {t.title}
          </h2>
          <p className="mt-6 font-body text-base leading-relaxed text-ink/60">
            {t.body}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {t.plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <div
                className={`flex h-full flex-col rounded-2xl border p-8 ${
                  p.featured
                    ? 'border-blue bg-blue text-white shadow-[0_24px_60px_-24px_rgba(0,47,214,0.55)]'
                    : 'border-line bg-paper text-ink'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-semibold">{p.name}</h3>
                  {p.featured && (
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                      {t.popular}
                    </span>
                  )}
                </div>
                <div className="mt-5 font-heading text-3xl font-bold">{p.price}</div>
                {p.note && (
                  <div
                    className={`mt-1 font-body text-sm ${
                      p.featured ? 'text-white/70' : 'text-ink/50'
                    }`}
                  >
                    {p.note}
                  </div>
                )}
                <p
                  className={`mt-4 font-body text-[15px] leading-relaxed ${
                    p.featured ? 'text-white/80' : 'text-ink/60'
                  }`}
                >
                  {p.desc}
                </p>
                <ul className="mt-7 flex flex-1 flex-col gap-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 font-body text-sm">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          p.featured ? 'text-white' : 'text-blue'
                        }`}
                        strokeWidth={2.5}
                      />
                      <span className={p.featured ? 'text-white/90' : 'text-ink/75'}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`mt-8 inline-flex items-center justify-center rounded-[6px] px-5 py-3 text-sm font-medium transition-colors ${
                    p.featured
                      ? 'bg-white text-blue hover:bg-paper-2'
                      : 'bg-blue text-white hover:bg-blue-600'
                  }`}
                >
                  {p.featured ? t.start : p.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
