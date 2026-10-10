import { Check } from 'lucide-react';
import { Container, Eyebrow } from './primitives';
import Reveal from './Reveal';

/* NOTE: prices are editable placeholders. Adjust to your real rates. */
const PLANS = [
  {
    name: 'Website',
    price: 'from €199',
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
    name: 'Website + Data',
    price: 'from €199',
    note: '+ €50 / month for analysis',
    desc: 'Everything in Website, plus your tools and site visitor data combined into insight you can act on.',
    features: [
      'Everything in Website',
      'Business tool integrations',
      'Website visitor tracking',
      'Monthly insight report',
    ],
    featured: true,
    cta: 'Most popular',
  },
  {
    name: 'Full System',
    price: 'Custom',
    desc: 'Everything in Website + Data, plus AI automation and analysis across all of your business data, in one dashboard.',
    features: [
      'Everything in Website + Data',
      'AI automation of recurring tasks',
      'All your business data, not just the website',
      'Marketing, income, competitor analysis & forecasts',
      'Unified dashboard & priority support',
    ],
    featured: false,
    cta: 'Book a call',
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="border-y border-line bg-paper py-24 md:py-32">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="poster mt-6 text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
            Transparent. No surprises.
          </h2>
          <p className="mt-6 font-body text-base leading-relaxed text-ink/60">
            Start small with a website, or go all the way to a full system. Every
            plan is a fixed, honest quote after a free call. No agency overhead.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PLANS.map((p, i) => (
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
                      Popular
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
                <a
                  href="/contact"
                  className={`mt-8 inline-flex items-center justify-center rounded-[6px] px-5 py-3 text-sm font-medium transition-colors ${
                    p.featured
                      ? 'bg-white text-blue hover:bg-paper-2'
                      : 'bg-blue text-white hover:bg-blue-600'
                  }`}
                >
                  {p.featured ? 'Start a project' : p.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
