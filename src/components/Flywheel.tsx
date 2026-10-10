import { Container, Eyebrow } from './primitives';
import Reveal from './Reveal';

const STEPS = [
  {
    n: '01',
    title: 'We build the website',
    body: 'A fast, professional site, planned, designed, launched and hosted.',
  },
  {
    n: '02',
    title: 'It starts collecting data',
    body: 'Analytics capture how real customers actually behave.',
  },
  {
    n: '03',
    title: 'We bring in the right people',
    body: 'SEO and digital marketing, aimed by what the data shows works.',
  },
  {
    n: '04',
    title: 'One dashboard, one view',
    body: 'Everything comes together in a single place instead of scattered tools.',
  },
];

export default function Flywheel() {
  return (
    <section className="border-b border-line py-24 md:py-32" style={{
        background: '#ffffff',
        backgroundImage: 'linear-gradient(#e8e9ec 1px, transparent 1px), linear-gradient(90deg, #e8e9ec 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }}>
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>From complexity to clarity</Eyebrow>
          <h2 className="poster mt-6 text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
            We bring everything <br className="hidden md:block" />
            together in one place.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-4 md:grid-cols-4" style={{ animation: 'slideRight 3s ease-in-out infinite' }}>
          {STEPS.map((s, i) => (
            <Reveal
              key={s.n}
              delay={i * 0.08}
              className="relative flex flex-col rounded-xl border border-line bg-paper p-7"
            >
              <span className="font-heading text-sm font-semibold text-ink/40">{s.n}</span>
              <h3 className="mt-6 font-heading text-lg font-semibold leading-snug text-ink">
                {s.title}
              </h3>
              <p className="mt-3 font-body text-[15px] leading-relaxed text-ink/60">
                {s.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
