import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP, ScrollTrigger, SplitText } from '../lib/gsap';
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
    head: ['Nettisivut jotka tekevät ', 'tulosta', ''],
    lead: 'Ealize on erikoistunut Google löydettävyyteen ja hakukoneoptimointiin',
    home: 'Ealize etusivu',
  },
  en: {
    services: 'Services',
    about: 'About us',
    work: 'Our work',
    cta: 'Contact us',
    head: ['Websites that deliver ', 'results', ''],
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

/**
 * "Ota yhteyttä" button under the slogan: a rectangle with rounded corners.
 * Idle: a lime rim spins around it and a ripple rings out (index.css).
 * Hover / focus: lime wells up from the bottom, the label turns ink and the
 * arrow tilts out. HomeHero adds the entrance and the magnetic pull toward
 * the cursor (on `.hero-cta`).
 */
function HeroCta({ label, size }: { label: string; size: (n: number) => string }) {
  const radius = size(18);
  return (
    <Link
      to="/contact"
      className="hero-cta group relative inline-block focus-visible:outline-none"
      style={{ borderRadius: radius }}
    >
      <span
        aria-hidden
        className="hero-cta-ripple pointer-events-none absolute inset-0"
        style={{ borderRadius: radius }}
      />
      <span
        aria-hidden
        className="hero-cta-ring pointer-events-none absolute"
        style={{ inset: size(-5), borderRadius: size(23) }}
      />
      <span
        className="relative block overflow-hidden transition-transform duration-200 ease-out group-active:scale-[0.96]"
        style={{ background: COBALT, borderRadius: radius }}
      >
        <span
          aria-hidden
          className="absolute inset-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
          style={{ background: LIME }}
        />
        <span
          className="hero-cta-label relative flex items-center font-body font-semibold text-white transition-colors duration-300 group-hover:text-[#0a0e1a] group-focus-visible:text-[#0a0e1a]"
          style={{
            fontSize: size(19),
            gap: size(14),
            paddingLeft: size(32),
            paddingRight: size(28),
            height: size(68),
          }}
        >
          <span className="whitespace-nowrap">{label}</span>
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 ease-out group-hover:-rotate-45 group-hover:translate-x-[15%] group-focus-visible:-rotate-45"
            style={{ width: size(24), height: size(24) }}
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </span>
    </Link>
  );
}

/**
 * One word per line; the middle part is the cobalt accent with a lime
 * underline. Each word sits in its own mask so it can rise into place
 * (`.hero-word-inner`), and drift on scroll (`.hero-word`). The visual words
 * are aria-hidden; screen readers get the plain sentence from the sr-only copy.
 */
function Headline({ parts, style, className = '' }: { parts: string[]; style?: CSSProperties; className?: string }) {
  const word = (text: string, key: string, accent = false) => (
    <span key={key} className="hero-word block">
      <span
        className="block pb-[0.14em] -mb-[0.14em]"
        style={{ clipPath: 'inset(-0.3em -50% 0 -50%)' }}
      >
        <span className="hero-word-inner block">
          {accent ? (
            <span className="hero-accent-wrap relative inline-block" style={{ color: COBALT }}>
              <span className="hero-accent inline-block" style={{ fontKerning: 'none', textRendering: 'optimizeSpeed' }}>
                {text}
              </span>
              {/* Green glow copy that follows the cursor on hover (index.css). */}
              <span aria-hidden className="hero-accent-fill" style={{ fontKerning: 'none', textRendering: 'optimizeSpeed' }}>
                {text}
              </span>
            </span>
          ) : (
            text
          )}
        </span>
      </span>
    </span>
  );
  const words = (text: string, accent = false) =>
    text
      .split(/\s+/)
      .filter(Boolean)
      .map((w, i) => word(w, `${w}-${i}`, accent));
  return (
    <h1 className={`hero-headline m-0 font-heading font-bold text-black ${className}`} style={style}>
      <span className="sr-only">{parts.join('').trim()}</span>
      <span aria-hidden className="block">
        {words(parts[0])}
        {words(parts[1], true)}
        {words(parts[2])}
      </span>
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

  /*
   * Motion, all skipped under reduced motion (the static layout is the
   * finished state). Each element gets its own transform channel so the
   * layers never fight: entrance on y / yPercent of the inner pieces, scroll
   * on the outer wrappers, pointer parallax on x.
   */
  useGSAP(
    () => {
      if (reducedMotion() || !root.current) return;
      const q = gsap.utils.selector(root);

      // "tulosta" split into letters, once per copy (desktop + mobile).
      const splits = q('.hero-accent').map((el) => SplitText.create(el, { type: 'chars', aria: 'none' }));
      const allChars = splits.flatMap((s) => s.chars);

      /* ---- entrance ---- */
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-slab', { xPercent: -100, duration: 0.9, stagger: 0.06 })
        .from('.hero-navitem', { y: -16, opacity: 0, duration: 0.6, stagger: 0.07 }, 0.25)
        .from('.hero-logo', { y: 14, opacity: 0, duration: 0.6 }, 0.35)
        .from('.logo-mark', { rotate: -200, scale: 0, duration: 1.2, ease: 'back.out(1.8)' }, 0.45)
        // Words rise out of their masks, one line after another.
        .from('.hero-word-inner', { yPercent: 115, rotate: 5, duration: 1.1, stagger: 0.1, ease: 'power4.out' }, 0.4)
        // The accent letters hop in a wave and flash lime before settling blue.
        .from(allChars, { color: LIME, duration: 0.6, stagger: 0.04, ease: 'power1.in' }, 1.05)
        .to(allChars, { y: '-0.18em', duration: 0.22, stagger: 0.04, yoyo: true, repeat: 1, ease: 'power2.out' }, 1.05)
        // Once the slogan has landed the CTA stretches open from the left,
        // then its label slides in.
        .from('.hero-cta', { scaleX: 0, transformOrigin: 'left center', duration: 0.9, ease: 'expo.out' }, 1.35)
        .from('.hero-cta-label', { opacity: 0, x: -14, duration: 0.5 }, 1.7)
        .from('.hero-streaks', { opacity: 0, x: -60, duration: 1.4 }, 0.2)
        .from('.hero-flowers', { y: 80, scale: 0.92, transformOrigin: '60% 100%', opacity: 0, duration: 1.4 }, 0.35);

      /* ---- ambient loops ---- */
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
      // The light streaks breathe.
      gsap.to('.hero-streaks-img', { opacity: 0.6, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.6 });

      /* ---- "tulosta": a green glow that trails the cursor through the
         letters. The fill layer (index.css) paints a radial gradient centred
         on --mx / --my; here those glide after the pointer. ---- */
      const glowCleanups = q('.hero-accent-wrap').map((wrap) => {
        const fill = wrap.querySelector<HTMLElement>('.hero-accent-fill');
        if (!fill) return () => {};
        const pos = { x: 0, y: 0 };
        const paint = () => {
          fill.style.setProperty('--mx', `${pos.x}px`);
          fill.style.setProperty('--my', `${pos.y}px`);
        };
        const glide = { duration: 0.45, ease: 'power3.out', onUpdate: paint };
        const toX = gsap.quickTo(pos, 'x', glide);
        const toY = gsap.quickTo(pos, 'y', glide);
        const local = (e: PointerEvent) => {
          const r = wrap.getBoundingClientRect();
          return [e.clientX - r.left, e.clientY - r.top] as const;
        };
        // Enter: start the glow right under the cursor, no slide-in.
        const onEnter = (e: PointerEvent) => {
          const [x, y] = local(e);
          toX(x, x);
          toY(y, y);
        };
        const onFollow = (e: PointerEvent) => {
          const [x, y] = local(e);
          toX(x);
          toY(y);
        };
        wrap.addEventListener('pointerenter', onEnter);
        wrap.addEventListener('pointermove', onFollow);
        return () => {
          wrap.removeEventListener('pointerenter', onEnter);
          wrap.removeEventListener('pointermove', onFollow);
        };
      });

      /* ---- scroll: words drift apart and fade, the art parallaxes ---- */
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
        })
        .to('.hero-word', { x: (i: number) => (i % 2 ? 1 : -1) * 70, opacity: 0.2, ease: 'none' }, 0)
        .to('.hero-flowers', { yPercent: -14, ease: 'none' }, 0)
        .to('.hero-streaks', { yPercent: 20, ease: 'none' }, 0);

      /* ---- pointer parallax (mouse / trackpad only) ---- */
      let onMove: ((e: PointerEvent) => void) | undefined;
      if (window.matchMedia('(pointer: fine)').matches) {
        const follow = (sel: string, prop: 'x' | 'y') =>
          gsap.quickTo(q(sel), prop, { duration: 0.9, ease: 'power3.out' });
        const flowersX = follow('.hero-flowers', 'x');
        const streaksX = follow('.hero-streaks-img', 'x');
        const streaksY = follow('.hero-streaks-img', 'y');
        const headX = follow('.hero-headline', 'x');
        const headY = follow('.hero-headline', 'y');
        onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          flowersX(nx * 36);
          streaksX(nx * -50);
          streaksY(ny * -24);
          headX(nx * -14);
          headY(ny * -10);
        };
        root.current.addEventListener('pointermove', onMove);
      }

      /* ---- magnetic CTA: the button leans toward the cursor inside a
         padded zone around it, then eases back when the cursor leaves ---- */
      const magnetCleanups = window.matchMedia('(pointer: fine)').matches
        ? q('.hero-cta-wrap').map((wrap) => {
            const btn = wrap.querySelector<HTMLElement>('.hero-cta');
            if (!btn) return () => {};
            const toX = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
            const toY = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
            let pulled = false;
            const onRelease = () => {
              if (!pulled) return;
              pulled = false;
              toX(0);
              toY(0);
            };
            const onPull = (e: PointerEvent) => {
              const r = btn.getBoundingClientRect();
              // Measure from the resting centre, not the pulled one.
              const cx = r.left + r.width / 2 - Number(gsap.getProperty(btn, 'x'));
              const cy = r.top + r.height / 2 - Number(gsap.getProperty(btn, 'y'));
              const dx = e.clientX - cx;
              const dy = e.clientY - cy;
              // Pull zone: the button plus a margin on every side.
              const margin = r.height * 0.9;
              if (Math.abs(dx) > r.width / 2 + margin || Math.abs(dy) > r.height / 2 + margin) return onRelease();
              pulled = true;
              toX(dx * 0.25);
              toY(dy * 0.35);
            };
            const host = root.current!;
            host.addEventListener('pointermove', onPull);
            host.addEventListener('pointerleave', onRelease);
            return () => {
              host.removeEventListener('pointermove', onPull);
              host.removeEventListener('pointerleave', onRelease);
            };
          })
        : [];

      const el = root.current;
      return () => {
        glowCleanups.forEach((off) => off());
        magnetCleanups.forEach((off) => off());
        if (onMove) el.removeEventListener('pointermove', onMove);
        splits.forEach((s) => s.revert());
      };
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
            className="hero-streaks-img absolute max-w-none"
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
            ...box(33, 179),
            fontSize: u(104),
            lineHeight: u(98),
          }}
        />

        <div className="hero-cta-wrap" style={box(38, 612)}>
          <HeroCta label={t.cta} size={u} />
        </div>
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
          <Headline parts={t.head} className="mt-2 text-[52px] leading-[52px]" />
          <div className="hero-cta-wrap mt-8 w-fit pl-1">
            <HeroCta label={t.cta} size={(n) => `${n}px`} />
          </div>
          <div className="hero-navitem mt-5 flex gap-6 text-lg">
            <TextLink to="/about">{t.about}</TextLink>
            <TextLink to="/work">{t.work}</TextLink>
          </div>
        </div>

        <div className="relative -mt-4 h-[78vw]">
          <div className="hero-streaks pointer-events-none absolute inset-x-0 bottom-0 h-[60%] overflow-hidden">
            <img src={`${A}/lime-streaks.png`} alt="" className="hero-streaks-img absolute inset-0 h-full w-full max-w-none object-cover" />
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
