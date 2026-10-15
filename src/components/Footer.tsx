import { Link } from 'react-router-dom';
import { Container } from './primitives';
import Wordmark from './Wordmark';
import { useServices } from '../lib/services';
import { useCopy } from '../lib/i18n';

type FooterLink = { label: string; to?: string; href?: string };

const COPY = {
  fi: {
    home: 'Ealize etusivu',
    blurb:
      'Verkkosivut, data-analyysi, digitaalinen markkinointi ja hakukoneoptimointi pienyrityksille. Helsingistä, koko Suomelle.',
    services: 'Palvelut',
    company: 'Yritys',
    companyLinks: [
      { label: 'Työt', to: '/work' },
      { label: 'Meistä', to: '/about' },
      { label: 'Hinnasto', to: '/pricing' },
    ],
    contact: 'Yhteystiedot',
    call: 'Varaa puhelu',
    place: 'Helsinki, Suomi',
    rights: 'Kaikki oikeudet pidätetään.',
    made: 'Tehty Helsingissä 🇫🇮',
  },
  en: {
    home: 'Ealize home',
    blurb:
      'Websites, data analysis, digital marketing and SEO for small businesses. Built in Helsinki, for all of Finland.',
    services: 'Services',
    company: 'Company',
    companyLinks: [
      { label: 'Work', to: '/work' },
      { label: 'About', to: '/about' },
      { label: 'Pricing', to: '/pricing' },
    ],
    contact: 'Contact',
    call: 'Book a call',
    place: 'Helsinki, Finland',
    rights: 'All rights reserved.',
    made: 'Made in Helsinki 🇫🇮',
  },
};

const linkClass =
  'font-body text-sm text-white/70 transition-colors hover:text-white';

export default function Footer() {
  const t = useCopy(COPY);
  const services = useServices();

  const cols: { title: string; links: FooterLink[] }[] = [
    {
      title: t.services,
      links: services.map((s) => ({
        label: s.title,
        to: `/services/${s.slug}`,
      })),
    },
    { title: t.company, links: t.companyLinks },
    {
      title: t.contact,
      links: [
        { label: 'hello@ealize.fi', href: 'mailto:hello@ealize.fi' },
        { label: t.call, to: '/contact' },
        { label: t.place, to: '/contact' },
      ],
    },
  ];

  return (
    <footer className="bg-ink py-16 text-white">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" aria-label={t.home}>
              <Wordmark dark showMark={false} />
            </Link>
            <p className="mt-5 max-w-xs font-body text-sm leading-relaxed text-white/55">
              {t.blurb}
            </p>
          </div>

          {cols.map((col) => (
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
            © {new Date().getFullYear()} Ealize. {t.rights}
          </span>
          <span className="font-body text-xs text-white/45">
            {t.made}
          </span>
        </div>
      </Container>
    </footer>
  );
}
