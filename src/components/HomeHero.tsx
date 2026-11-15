import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP, ScrollTrigger } from '../lib/gsap';
import { useCopy } from '../lib/i18n';
import ServicesMegaMenu from './ServicesMegaMenu';

/**
 * Home hero from Figma (Ealize – Etusivu, node 105:3575, "Frame 11").
 *
 * The frame is a 1440x740 composition: a blue nav slab with a lime offset
 * edge, the headline, and a vector flower illustration over a lime light-
 * streak photo. From md up it is laid out in design pixels through a single
 * `--u` unit (1 design px = 100vw / 1440), so it matches Figma exactly at
 * 1440 and scales proportionally either side. Below md the same pieces
 * stack, since a scaled 1440 frame would be unreadable on a phone.
 *
 * From md up the nav pieces live in a fixed layer (FixedNav) so they can stay
 * on screen and re-arrange into a compact bar once the page scrolls. The
 * frame carries its own nav, so the site-wide Nav is not rendered on home.
 */

const A = '/figma/home';
const LIME = '#acff12';
const COBALT = '#002fd6';
const INK = '#0a0e1a';

type Copy = {
  services: string;
  about: string;
  work: string;
  cta: string;
  head: string[];
  lead: string;
  home: string;
};

const COPY: Record<'fi' | 'en', Copy> = {
  fi: {
    services: 'Palvelut',
    about: 'Lue meistä',
    work: 'Referenssit',
    cta: 'Ota yhteyttä',
    head: ['Nettisivut, ', 'löydettävyys', ' ja design edellä'],
    lead: 'Ealize on erikoistunut Google löydettävyyteen ja hakukoneoptimointiin',
    home: 'Ealize etusivu',
  },
  en: {
    services: 'Services',
    about: 'About us',
    work: 'Our work',
    cta: 'Contact us',
    head: ['Websites, ', 'findability', ' and design first'],
    lead: 'Ealize specialises in Google findability and search engine optimisation',
    home: 'Ealize home',
  },
};

/** One design pixel, in CSS. */
const u = (n: number) => `calc(var(--u) * ${n})`;

/** Absolutely positioned box in design pixels (md and up only). */
function box(left: number, top: number, width?: number, height?: number): CSSProperties {
  return {
    position: 'absolute',
    left: u(left),
    top: u(top),
    ...(width !== undefined && { width: u(width) }),
    ...(height !== undefined && { height: u(height) }),
  };
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------------- */

function Wordmark({ size }: { size: (n: number) => string }) {
  return (
    <span className="relative block" style={{ width: size(88.439), height: size(35) }}>
      <img
        src={`${A}/logo-mark.svg`}
        alt=""
        className="logo-mark absolute block"
        style={{ left: '69.62%', top: '12.79%', width: '30.38%', height: '87.21%' }}
      />
      <span
        className="logo-text absolute whitespace-nowrap"
        style={{
          left: 0,
          top: 0,
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: size(22.389),
          letterSpacing: size(-0.5597),
          lineHeight: 'normal',
          color: INK,
        }}
      >
        ealize
      </span>
    </span>
  );
}

/** "Palvelut ↑" — white label on the blue slab, arrow nudges up on hover. */
function ServicesLink({ label, size }: { label: string; size: (n: number) => string }) {
  return (
    <Link
      to="/services"
      className="group relative block"
      style={{ width: size(102.129), height: size(28) }}
    >
      <span
        className="absolute whitespace-nowrap font-body text-white"
        style={{ left: 0, top: 0, fontSize: size(23), fontWeight: 400, lineHeight: 'normal' }}
      >
        {label}
      </span>
      {/* Arrow 4 points right in the export; Figma rotates it -89.47° to point up. */}
      <img
        src={`${A}/arrow-up.svg`}
        alt=""
        className="absolute block transition-transform duration-300 ease-out group-hover:-translate-y-[20%]"
        style={{
          left: size(102.06 - 7.509),
          top: size(14 - 7.364),
          width: size(15.018),
          height: size(14.728),
          rotate: '-89.47deg',
        }}
      />
    </Link>
  );
}

/** Black nav text link with an underline that wipes in from the left. */
function TextLink({
  to,
  children,
  style,
  className = '',
}: {
  to: string;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={`group block whitespace-nowrap font-body font-medium text-black ${className}`}
      style={style}
    >
      <span className="relative inline-block">
        {children}
        <span
          aria-hidden
          className="absolute -bottom-[0.12em] left-0 h-[0.08em] w-full origin-right scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100"
        />
      </span>
    </Link>
  );
}

function CtaButton({ label, size }: { label: string; size: (n: number) => string }) {
  return (
    <Link
      to="/contact"
      className="inline-flex items-center whitespace-nowrap font-body font-medium text-white transition-[transform,box-shadow,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-[0_10px_24px_rgba(0,47,214,0.35)] active:translate-y-0 active:scale-[0.97]"
      style={{
        background: COBALT,
        paddingLeft: size(21.818),
        paddingRight: size(21.818),
        paddingTop: size(13.091),
        paddingBottom: size(13.091),
        borderRadius: size(6.545),
        fontSize: size(15.273),
        lineHeight: 1.4,
      }}
    >
      {label}
    </Link>
  );
}

function Headline({ parts, style, className = '' }: { parts: string[]; style?: CSSProperties; className?: string }) {
  return (
    <h1 className={`hero-headline m-0 font-heading font-bold text-black ${className}`} style={style}>
      {parts[0]}
      <span style={{ color: LIME }}>{parts[1]}</span>
      {parts[2]}
    </h1>
  );
}

/* ---------------------------------------------------------------- */
/* Fixed nav (md and up)                                             */
/* ---------------------------------------------------------------- */

/** Bar heights and offsets, in design px. */
const BAR_H = 97;
const BAR_H_COMPACT = 70;
/**
 * How far the blue slab slides toward the centre once scrolled. Enough to
 * clear the logo (which lands at 36..124), small enough that its diagonal
 * end (top edge reaches 739 + shift) stays left of the right-hand links.
 */
const SLAB_SHIFT = 160;
/** "Palvelut" travels with the slab but 40px less, so it drifts left inside it. */
const SERVICES_SHIFT = SLAB_SHIFT - 40;
/** Nav labels and the CTA shrink a touch in the compact bar. */
const TEXT_SCALE_COMPACT = 0.85;
/** Where the lime fill starts: under the body of the shifted blue slab. */
const FILL_LEFT = SLAB_SHIFT + 500;

/** Rest position (Figma) and compact target for each moving piece. */
const LOGO = { left: 35, top: 149, toLeft: 36, toTop: (BAR_H_COMPACT - 35) / 2 };
const SERVICES = { left: 52, top: 41, h: 28 };
/**
 * The right-hand items also slide right a little in the compact bar, so the
 * shifted slab's diagonal never runs under "Lue meistä". `dx` is in design px.
 */
const ABOUT = { left: 801, top: 27, h: 70, dx: 122 };
const WORK = { left: 995, top: 27, h: 70, dx: 88 };
const CTA = { left: 1181, top: 38, h: 47.182, dx: 75 };

/** Vertical offset that centres a box of height `h` in the compact bar. */
const centreDy = (top: number, h: number) => (BAR_H_COMPACT - h) / 2 - top;

/**
 * At rest this reproduces the Figma nav exactly. After the first few pixels
 * of scroll it softly re-arranges: the bar gets shorter, blue fills in behind
 * the logo, a lime field sweeps across the right side from left to right, the
 * blue slab slides toward the centre, the logo flies up into the top-left
 * corner turning white, and "Palvelut" eases a little to the left.
 */
function FixedNav({ t }: { t: Copy }) {
  const root = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(() => window.innerWidth);
  const [isCompact, setIsCompact] = useState(() => window.scrollY > 8);

  /* ---- services mega menu: opens on hover / focus, closes with a grace
     period so the pointer can travel from the button down to the panel ---- */
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const openMenu = () => {
    window.clearTimeout(closeTimer.current);
    setMenuOpen(true);
  };
  const closeMenuSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenuOpen(false), 250);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useLayoutEffect(() => {
    const px = vw / 1440;
    const q = gsap.utils.selector(root);

    const paint = (compact: boolean, duration: number) => {
      const h = (compact ? BAR_H_COMPACT : BAR_H) * px;
      const vars = (v: gsap.TweenVars, d = duration) =>
        d ? { ...v, duration: d, ease: 'power3.inOut', overwrite: 'auto' as const } : v;
      const go = (target: string, v: gsap.TweenVars, d?: number) =>
        (duration ? gsap.to : gsap.set)(q(target), vars(v, d));

      go('.nav-backdrop', { height: h, scaleX: compact ? 1 : 0 });
      go('.nav-fill', { height: h, scaleX: compact ? 1 : 0 });
      // White logo on the blue. The mark is a dark SVG, so it is recoloured
      // with a filter; both ends list the same functions so GSAP can blend.
      go('.logo-text', { color: compact ? '#ffffff' : INK });
      go('.logo-mark', { filter: compact ? 'brightness(0) invert(1)' : 'brightness(1) invert(0)' });
      go('.nav-slab', { height: h, x: compact ? SLAB_SHIFT * px : 0 });
      const textScale = compact ? TEXT_SCALE_COMPACT : 1;
      go('.nav-services', {
        x: compact ? SERVICES_SHIFT * px : 0,
        y: compact ? centreDy(SERVICES.top, SERVICES.h) * px : 0,
        scale: textScale,
        transformOrigin: 'left center',
      });
      // Scaling about each box's vertical centre keeps it centred in the bar.
      // The CTA shrinks toward its right edge so it stays aligned to the right.
      for (const [cls, item, origin] of [
        ['.nav-about', ABOUT, 'left center'],
        ['.nav-work', WORK, 'left center'],
        ['.nav-cta', CTA, 'right center'],
      ] as const) {
        go(cls, {
          x: compact ? item.dx * px : 0,
          y: compact ? centreDy(item.top, item.h) * px : 0,
          scale: textScale,
          transformOrigin: origin,
        });
      }
      // The logo travels furthest, so it gets a little longer to land.
      go(
        '.nav-logo',
        {
          x: compact ? (LOGO.toLeft - LOGO.left) * px : 0,
          y: compact ? (LOGO.toTop - LOGO.top) * px : 0,
        },
        duration ? duration + 0.15 : 0,
      );
    };

    let compact = window.scrollY > 8;
    paint(compact, 0);
    setIsCompact(compact);

    const set = (next: boolean) => {
      if (next === compact) return;
      compact = next;
      setIsCompact(next);
      paint(next, reducedMotion() ? 0 : 0.7);
    };

    // ScrollTrigger rather than a window scroll listener: Lenis moves the page
    // without firing scroll events for most of the travel, but it feeds
    // ScrollTrigger.update on every frame.
    const st = ScrollTrigger.create({
      start: 8,
      end: 'max',
      onEnter: () => set(true),
      onLeaveBack: () => set(false),
    });

    return () => st.kill();
  }, [vw]);

  return (
    <div
      ref={root}
      className="pointer-events-none fixed left-0 top-0 z-50 hidden w-full md:block"
      style={{ height: u(LOGO.top + 35) }}
    >
      {/* Blue field behind the logo, running in under the slab */}
      <div
        className="nav-backdrop absolute left-0 top-0"
        style={{
          width: u(FILL_LEFT),
          height: u(BAR_H),
          background: COBALT,
          transform: 'scaleX(0)',
          transformOrigin: 'left center',
        }}
      />

      {/* Lime field filling the right side; grows from left to right */}
      <div
        className="nav-fill absolute top-0"
        style={{
          left: u(FILL_LEFT),
          right: 0,
          height: u(BAR_H),
          background: LIME,
          transform: 'scaleX(0)',
          transformOrigin: 'left center',
        }}
      />

      {/* Lime offset edge behind the blue union */}
      <img src={`${A}/nav-lime.svg`} alt="" className="nav-slab hero-slab block" style={box(23, 0, 739.439, BAR_H)} />
      <img src={`${A}/nav-blue.svg`} alt="" className="nav-slab hero-slab block" style={box(0, 0, 739.439, BAR_H)} />

      <div
        className="nav-services pointer-events-auto"
        style={box(SERVICES.left, SERVICES.top)}
        aria-haspopup="true"
        aria-expanded={menuOpen}
        aria-controls="services-mega-menu"
        onMouseEnter={openMenu}
        onMouseLeave={closeMenuSoon}
        onFocus={openMenu}
        onBlur={closeMenuSoon}
      >
        <div className="hero-navitem">
          <ServicesLink label={t.services} size={u} />
        </div>
      </div>

      <div className="nav-about pointer-events-auto" style={box(ABOUT.left, ABOUT.top, undefined, ABOUT.h)}>
        <TextLink to="/about" className="hero-navitem" style={{ fontSize: u(23), lineHeight: u(70) }}>
          {t.about}
        </TextLink>
      </div>

      <div className="nav-work pointer-events-auto" style={box(WORK.left, WORK.top, undefined, WORK.h)}>
        <TextLink to="/work" className="hero-navitem" style={{ fontSize: u(23), lineHeight: u(70) }}>
          {t.work}
        </TextLink>
      </div>

      <div className="nav-cta pointer-events-auto" style={box(CTA.left, CTA.top)}>
        <div className="hero-navitem">
          <CtaButton label={t.cta} size={u} />
        </div>
      </div>

      <div className="nav-logo pointer-events-auto" style={box(LOGO.left, LOGO.top)}>
        <Link to="/" aria-label={t.home} className="hero-logo block">
          <Wordmark size={u} />
        </Link>
      </div>

      {/* Last, so it covers the resting logo and headline while open. */}
      <ServicesMegaMenu
        open={menuOpen}
        top={(isCompact ? BAR_H_COMPACT : BAR_H) * (vw / 1440)}
        onEnter={openMenu}
        onLeave={closeMenuSoon}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- */

export default function HomeHero() {
  const t = useCopy(COPY);
  const root = useRef<HTMLElement>(null);

  // Entrance: slab slides in, copy rises, flowers bloom up out of the streaks.
  useGSAP(
    () => {
      if (reducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-slab', { xPercent: -100, duration: 0.9, stagger: 0.06 })
        .from('.hero-navitem', { y: -16, opacity: 0, duration: 0.6, stagger: 0.07 }, 0.25)
        .from('.hero-logo', { y: 14, opacity: 0, duration: 0.6 }, 0.35)
        .from('.hero-headline', { y: 48, opacity: 0, duration: 1 }, 0.4)
        .from('.hero-rule', { scaleX: 0, transformOrigin: 'left center', duration: 0.8 }, 0.7)
        .from('.hero-lead', { y: 16, opacity: 0, duration: 0.7 }, 0.8)
        .from('.hero-streaks', { opacity: 0, x: -60, duration: 1.4 }, 0.2)
        .from('.hero-flowers', { y: 80, opacity: 0, duration: 1.4 }, 0.35);

      // Flowers sway gently, like grass in wind.
      gsap.to('.hero-flowers', {
        rotate: 0.8,
        transformOrigin: '60% 100%',
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.8,
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-label={t.home}
      className="relative overflow-hidden bg-white"
      style={{ '--u': 'calc(100vw / 1440)' } as CSSProperties}
    >
      <FixedNav t={t} />

      {/* ---------------- md and up: exact Figma geometry ---------------- */}
      <div className="relative hidden md:block" style={{ height: u(740) }}>
        {/* Lime light streaks (Widescreen-16-9 image, 105:3577) */}
        <div className="hero-streaks pointer-events-none absolute overflow-hidden" style={box(52, 371, 1388, 369)}>
          <img
            src={`${A}/lime-streaks.png`}
            alt=""
            className="absolute max-w-none"
            style={{ left: '-4.6%', top: '-106.5%', width: '124.9%', height: '262.87%' }}
          />
        </div>

        {/* Flower illustration (105:380), exported as one vector */}
        <img
          src={`${A}/flowers.svg`}
          alt=""
          className="hero-flowers pointer-events-none block"
          style={box(430, 218, 1010, 522)}
        />

        <Headline
          parts={t.head}
          style={{
            ...box(33, 179, 596, 210),
            fontSize: u(64),
            lineHeight: u(70),
          }}
        />

        <p
          className="hero-lead m-0 font-body font-medium"
          style={{ ...box(33, 441, 373.316, 42), fontSize: u(17.263), lineHeight: 'normal', color: INK }}
        >
          {t.lead}
        </p>

        <div className="hero-rule" style={{ ...box(35, 425, 395, 2), background: INK }} />
      </div>

      {/* ---------------- below md: stacked ---------------- */}
      <div className="relative md:hidden">
        <div className="relative flex h-16 items-center justify-between pr-4">
          <div className="hero-slab absolute inset-y-0 left-0 w-[72%]">
            <img src={`${A}/nav-lime.svg`} alt="" className="absolute left-[3%] top-0 h-full w-full" />
            <img src={`${A}/nav-blue.svg`} alt="" className="absolute left-0 top-0 h-full w-full" />
          </div>
          <div className="hero-navitem relative pl-5">
            <ServicesLink label={t.services} size={(n) => `${n * 0.78}px`} />
          </div>
          <div className="hero-navitem relative">
            <CtaButton label={t.cta} size={(n) => `${n * 0.85}px`} />
          </div>
        </div>

        <div className="relative z-10 px-5 pt-10">
          <Link to="/" aria-label={t.home} className="hero-logo block">
            <Wordmark size={(n) => `${n}px`} />
          </Link>
          <Headline parts={t.head} className="mt-2 text-[40px] leading-[44px]" />
          <div className="hero-rule mt-6 h-[2px] w-full max-w-[395px]" style={{ background: INK }} />
          <p className="hero-lead mt-4 max-w-[340px] font-body text-base font-medium" style={{ color: INK }}>
            {t.lead}
          </p>
          <div className="hero-navitem mt-5 flex gap-6 text-lg">
            <TextLink to="/about">{t.about}</TextLink>
            <TextLink to="/work">{t.work}</TextLink>
          </div>
        </div>

        <div className="relative -mt-4 h-[78vw]">
          <div className="hero-streaks pointer-events-none absolute inset-x-0 bottom-0 h-[60%] overflow-hidden">
            <img src={`${A}/lime-streaks.png`} alt="" className="absolute inset-0 h-full w-full max-w-none object-cover" />
          </div>
          <img
            src={`${A}/flowers.svg`}
            alt=""
            className="hero-flowers pointer-events-none absolute bottom-0 right-0 w-[130%] max-w-none"
          />
        </div>
      </div>
    </section>
  );
}
