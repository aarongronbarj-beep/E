import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Container, Button } from './primitives';
import Wordmark from './Wordmark';

const LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
        <Link to="/" aria-label="Ealize home">
          <Wordmark showMark={false} />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
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

        <div className="hidden md:block">
          <Button href="/contact">Contact us</Button>
        </div>

        <button
          className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
          aria-label="Menu"
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
      </Container>

      {open && (
        <div className="border-t border-line bg-paper md:hidden">
          <Container className="flex flex-col py-4">
            {LINKS.map((l) => (
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
              Contact us
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
