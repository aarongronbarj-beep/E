import { Link } from 'react-router-dom';
import { Container } from './primitives';
import Wordmark from './Wordmark';
import { SERVICES } from '../lib/services';

type FooterLink = { label: string; to?: string; href?: string };

const COLS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Services',
    links: SERVICES.map((s) => ({
      label: s.title,
      to: `/services/${s.slug}`,
    })),
  },
  {
    title: 'Company',
    links: [
      { label: 'Work', to: '/work' },
      { label: 'About', to: '/about' },
      { label: 'Pricing', to: '/pricing' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'hello@ealize.fi', href: 'mailto:hello@ealize.fi' },
      { label: 'Book a call', to: '/contact' },
      { label: 'Helsinki, Finland', to: '/contact' },
    ],
  },
];

const linkClass =
  'font-body text-sm text-white/70 transition-colors hover:text-white';

export default function Footer() {
  return (
    <footer className="bg-ink py-16 text-white">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" aria-label="Ealize home">
              <Wordmark dark showMark={false} />
            </Link>
            <p className="mt-5 max-w-xs font-body text-sm leading-relaxed text-white/55">
              Websites, data analytics and AI automation for small businesses.
              Built in Helsinki, for all of Finland.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h4 className="eyebrow text-white/40">{col.title}</h4>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link to={l.to} className={linkClass}>
                        {l.label}
                      </Link>
                    ) : (
                      <a href={l.href} className={linkClass}>
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center">
          <span className="font-body text-xs text-white/45">
            © {new Date().getFullYear()} Ealize. All rights reserved.
          </span>
          <span className="font-body text-xs text-white/45">
            Made in Helsinki 🇫🇮
          </span>
        </div>
      </Container>
    </footer>
  );
}
