import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Container, Button } from './primitives';
import Wordmark from './Wordmark';
import { LANGS, useCopy, useLang } from '../lib/i18n';

const COPY = {
  fi: {
    links: [
      { label: 'Palvelut', href: '/services' },
      { label: 'Työt', href: '/work' },
      { label: 'Meistä', href: '/about' },
      { label: 'Hinnasto', href: '/pricing' },
    ],
    cta: 'Ota yhteyttä',
    home: 'Ealize etusivu',
    menu: 'Valikko',
    language: 'Kieli',
  },
  en: {
    links: [
      { label: 'Services', href: '/services' },
      { label: 'Work', href: '/work' },
      { label: 'About', href: '/about' },
      { label: 'Pricing', href: '/pricing' },
    ],
    cta: 'Contact us',
    home: 'Ealize home',
    menu: 'Menu',
    language: 'Language',
  },
};

/** FI / EN toggle. Each option names itself in its own language for screen readers. */
function LangSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLang();
  const t = useCopy(COPY);
  return (
    <div role="group" aria-label={t.language} className={`flex items-center gap-1 ${className}`}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-label={l === 'fi' ? 'Suomeksi' : 'In English'}
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          className={`rounded px-1.5 py-1 font-body text-xs font-semibold uppercase tracking-wide transition-colors ${
            lang === l ? 'text-blue' : 'text-ink/45 hover:text-ink'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const t = useCopy(COPY);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-line bg-paper/85 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" aria-label={t.home}>
          <Wordmark showMark={false} />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {t.links.map((l) => (
            <NavLink
              key={l.href}
              to={l.href}
              className={({ isActive }) =>
                `font-body text-sm transition-colors hover:text-ink ${
                  isActive ? 'text-blue' : 'text-ink/65'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <LangSwitch />
          <Button href="/contact">{t.cta}</Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LangSwitch />
          <button
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px]"
            aria-label={t.menu}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`h-[2px] w-5 bg-ink transition-transform ${open ? 'translate-y-[7px] rotate-45' : ''}`}
            />
            <span className={`h-[2px] w-5 bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span
              className={`h-[2px] w-5 bg-ink transition-transform ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
            />
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-line bg-paper md:hidden">
          <Container className="flex flex-col py-4">
            {t.links.map((l) => (
              <NavLink
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-3 font-body text-sm ${isActive ? 'text-blue' : 'text-ink/75'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Button href="/contact" className="mt-2 justify-center">
              {t.cta}
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
