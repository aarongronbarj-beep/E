import { ArrowUpRight, Mail, Phone } from 'lucide-react';
import { Container, Eyebrow } from './primitives';
import Reveal from './Reveal';

type Person = {
  name: string;
  role: string;
  /** Portrait in public/images. Without one, the card shows initials. */
  photo?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
};

// Personal emails, phone numbers, LinkedIn links and photos go here; each
// one appears on the card as soon as it is filled in.
const PEOPLE: Person[] = [
  { name: 'Lauri Parviainen', role: 'Co-founder', email: 'hello@ealize.fi' },
  { name: 'Aaron Grönbarj', role: 'Co-founder', email: 'hello@ealize.fi' },
];

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('');

const rowClass =
  'inline-flex items-center gap-3 font-body text-sm text-ink/70 transition-colors hover:text-blue';

export default function Team() {
  return (
    <section className="border-b border-line bg-paper py-20 md:py-28">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="poster mt-6 text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
            Talk to us <span className="text-blue">directly.</span>
          </h1>
          <p className="mt-6 max-w-lg font-body text-base leading-relaxed text-ink/60">
            No sales team, no ticket queue. You reach the two people who
            plan and build your project.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {PEOPLE.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <article className="flex h-full flex-col rounded-2xl border border-line bg-paper p-8 shadow-[0_1px_2px_rgba(10,14,26,0.04)]">
                <div className="flex items-center gap-5">
                  {p.photo ? (
                    <img
                      src={p.photo}
                      alt={p.name}
                      className="h-20 w-20 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-blue font-heading text-2xl font-semibold text-white"
                    >
                      {initials(p.name)}
                    </span>
                  )}
                  <div>
                    <h2 className="font-heading text-2xl font-semibold text-ink">
                      {p.name}
                    </h2>
                    <p className="mt-1 font-body text-sm text-ink/55">{p.role}</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6">
                  {p.email && (
                    <a href={`mailto:${p.email}`} className={rowClass}>
                      <Mail className="h-4 w-4" strokeWidth={1.75} />
                      {p.email}
                    </a>
                  )}
                  {p.phone && (
                    <a href={`tel:${p.phone.replace(/\s/g, '')}`} className={rowClass}>
                      <Phone className="h-4 w-4" strokeWidth={1.75} />
                      {p.phone}
                    </a>
                  )}
                  {p.linkedin && (
                    <a
                      href={p.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className={rowClass}
                    >
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                      LinkedIn
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
