import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight } from 'lucide-react';
import { useServices } from '../lib/services';
import { useCopy } from '../lib/i18n';

/**
 * Services mega menu that drops out of the home nav's "Palvelut" button.
 *
 * Laid out after a "what we can do" reference: a big heading on the right,
 * then one numbered row per service. The hovered (or focused) row opens like
 * an accordion to show a short caption, a "leave a request" button framed by
 * lime corner brackets, and a few lines about the service; the others stay a
 * single line with a lime arrow. Cobalt instead of the reference's black.
 *
 * Sizes follow the nav's `--u` unit (1 design px = 100vw / 1440) with a
 * floor, so the menu scales with the hero but never gets unreadably small.
 */

const LIME = '#acff12';
const COBALT = '#002fd6';
const INK = '#0a0e1a';

const COPY = {
  fi: {
    tag: '(palvelut)',
    heading: ['Mitä voimme', 'tehdä'],
    caption: 'Kokonaisratkaisu alusta loppuun',
    cta: 'Jätä yhteydenotto',
    open: 'Avaa palvelu',
  },
  en: {
    tag: '(services)',
    heading: ['What we', 'can do'],
    caption: 'Complete solution from start to finish',
    cta: 'Leave a request',
    open: 'Open service',
  },
};

/** Design px in CSS, never smaller than `min` px. */
const s = (n: number, min: number) => `max(${min}px, calc(var(--u) * ${n}))`;

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

/** Height-animating wrapper: grid rows 0fr → 1fr, no measuring needed. */
function Reveal({ open, children, className = '' }: { open: boolean; children: ReactNode; className?: string }) {
  return (
    <div
      className={`grid ${className}`}
      style={{
        gridTemplateRows: open ? '1fr' : '0fr',
        opacity: open ? 1 : 0,
        transition: `grid-template-rows 500ms ${EASE}, opacity 400ms ${EASE} ${open ? '120ms' : '0ms'}`,
      }}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

/** Lime button inside four corner brackets that spread apart on hover. */
function BracketButton({ to, children }: { to: string; children: ReactNode }) {
  const corner = 'absolute h-2 w-2 border-[#acff12] transition-all duration-300 ease-out';
  return (
    <Link
      to={to}
      className="group/cta relative inline-flex items-center font-heading font-bold uppercase transition-transform duration-200 active:scale-95"
      style={{
        background: LIME,
        color: INK,
        fontSize: s(12, 11),
        letterSpacing: '0.04em',
        padding: `${s(11, 9)} ${s(20, 16)}`,
      }}
    >
      <span aria-hidden className={`${corner} -left-1.5 -top-1.5 border-l-2 border-t-2 group-hover/cta:-left-2.5 group-hover/cta:-top-2.5`} />
      <span aria-hidden className={`${corner} -right-1.5 -top-1.5 border-r-2 border-t-2 group-hover/cta:-right-2.5 group-hover/cta:-top-2.5`} />
      <span aria-hidden className={`${corner} -bottom-1.5 -left-1.5 border-b-2 border-l-2 group-hover/cta:-bottom-2.5 group-hover/cta:-left-2.5`} />
      <span aria-hidden className={`${corner} -bottom-1.5 -right-1.5 border-b-2 border-r-2 group-hover/cta:-bottom-2.5 group-hover/cta:-right-2.5`} />
      {children}
    </Link>
  );
}

export default function ServicesMegaMenu({
  open,
  top,
  onEnter,
  onLeave,
}: {
  open: boolean;
  /** Distance from the viewport top, i.e. the current nav bar height. */
  top: number;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const t = useCopy(COPY);
  const services = useServices();
  const [active, setActive] = useState(0);

  return (
    <div
      id="services-mega-menu"
      role="region"
      aria-label={t.heading.join(' ')}
      // Lenis would otherwise swallow the wheel while the pointer is on the menu.
      data-lenis-prevent
      className="absolute left-0 right-0 overflow-y-auto"
      style={{
        top,
        maxHeight: `calc(100vh - ${top}px)`,
        pointerEvents: open ? 'auto' : 'none',
        visibility: open ? 'visible' : 'hidden',
        clipPath: open ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
        transition: `clip-path 550ms ${EASE}, top 700ms ${EASE}, visibility 0s linear ${open ? '0s' : '550ms'}`,
        background: COBALT,
        boxShadow: '0 30px 60px rgba(10,14,26,0.25)',
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <div
        className="text-white"
        style={{ padding: `${s(36, 24)} ${s(52, 24)} ${s(44, 28)}` }}
      >
        {/* Heading, right-aligned like the reference */}
        <div className="flex justify-end">
          <div
            className="flex items-start"
            style={{
              gap: s(14, 10),
              width: '42%',
              transform: open ? 'none' : 'translateY(12px)',
              opacity: open ? 1 : 0,
              transition: `transform 600ms ${EASE} 150ms, opacity 500ms ${EASE} 150ms`,
            }}
          >
            <span className="font-body italic text-white/70" style={{ fontSize: s(12, 11), marginTop: s(6, 4) }}>
              {t.tag}
            </span>
            <h2
              className="m-0 font-heading font-bold uppercase"
              style={{ fontSize: s(56, 32), lineHeight: 0.95, letterSpacing: '-0.02em' }}
            >
              {t.heading[0]}
              <br />
              {t.heading[1]}
            </h2>
          </div>
        </div>

        <ul className="m-0 list-none p-0" style={{ marginTop: s(40, 24) }}>
          {services.map((svc, i) => {
            const isOpen = active === i;
            const paras = [svc.intro, ...svc.features.slice(0, 2).map((f) => f.body)];
            return (
              <li
                key={svc.slug}
                className="relative"
                style={{
                  transform: open ? 'none' : 'translateY(14px)',
                  opacity: open ? 1 : 0,
                  transition: `transform 600ms ${EASE} ${200 + i * 60}ms, opacity 500ms ${EASE} ${200 + i * 60}ms, background-color 300ms`,
                  backgroundColor: isOpen ? 'rgba(255,255,255,0.04)' : 'transparent',
                }}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                {/* Divider: draws in from the left as the menu opens (each a
                    beat after the one above), and turns lime over the open row. */}
                <span
                  aria-hidden
                  className="absolute left-0 right-0 top-0 origin-left"
                  style={{
                    height: isOpen ? 2 : 1,
                    background: isOpen ? LIME : 'rgba(255,255,255,0.28)',
                    transform: open ? 'scaleX(1)' : 'scaleX(0)',
                    transition: [
                      `transform 900ms ${EASE} ${open ? 180 + i * 110 : 0}ms`,
                      `background-color 350ms ${EASE}`,
                      `height 350ms ${EASE}`,
                    ].join(', '),
                  }}
                />
                <div
                  className="grid items-stretch"
                  style={{
                    gridTemplateColumns: 'minmax(0,2fr) minmax(0,3.2fr) minmax(0,3.6fr) auto',
                    columnGap: s(24, 16),
                    padding: `${s(22, 14)} 0`,
                  }}
                >
                  {/* Number + caption pinned to the bottom of the open row */}
                  <div className="flex flex-col justify-between">
                    <span className="font-heading font-medium" style={{ fontSize: s(24, 18), lineHeight: 1 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <Reveal open={isOpen}>
                      <p className="m-0 font-body text-white/70" style={{ fontSize: s(11, 11), lineHeight: 1.3, paddingTop: s(48, 24) }}>
                        {t.caption}
                      </p>
                    </Reveal>
                  </div>

                  {/* Title + CTA */}
                  <div className="flex flex-col justify-between">
                    <Link
                      to={`/services/${svc.slug}`}
                      className="font-heading font-medium uppercase text-white transition-colors duration-200 hover:text-[#acff12]"
                      style={{ fontSize: s(26, 18), lineHeight: 1.05 }}
                    >
                      {svc.title}
                    </Link>
                    <Reveal open={isOpen}>
                      {/* Padding leaves room for the brackets outside the button. */}
                      <div style={{ padding: `${s(44, 22)} 12px 12px 10px` }}>
                        <BracketButton to="/contact">{t.cta}</BracketButton>
                      </div>
                    </Reveal>
                  </div>

                  {/* Description */}
                  <Reveal open={isOpen}>
                    <div className="flex flex-col" style={{ gap: s(12, 8) }}>
                      {paras.map((para) => (
                        <p key={para} className="m-0 font-body text-white/90" style={{ fontSize: s(14, 13), lineHeight: 1.45 }}>
                          {para}
                        </p>
                      ))}
                    </div>
                  </Reveal>

                  {/* Arrow: ↘ when closed, turns to ↗ when the row opens */}
                  <Link
                    to={`/services/${svc.slug}`}
                    aria-label={`${t.open}: ${svc.title}`}
                    className="self-start"
                    style={{ color: LIME }}
                  >
                    <ArrowDownRight
                      strokeWidth={1.75}
                      style={{
                        width: s(28, 20),
                        height: s(28, 20),
                        transform: isOpen ? 'rotate(-90deg)' : 'none',
                        transition: `transform 450ms ${EASE}`,
                      }}
                    />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
