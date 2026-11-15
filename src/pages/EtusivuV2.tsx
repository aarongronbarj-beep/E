import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "../components/primitives";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pixel-exact copy of the Figma frame "Frame 3" (node 45:213) from
 * "Ealize – Etusivu". The design is an absolutely-positioned 1440x5170
 * canvas built from overlapping boolean shapes, masks and rotated polygons,
 * so the geometry is kept in design pixels and the whole canvas is scaled to
 * the viewport width instead of being re-flowed.
 *
 * On top of the static copy sits a GSAP layer: a scroll-reactive nav, entrance
 * reveals driven by ScrollTrigger, light parallax in the hero, and hover /
 * press reactions on everything clickable. All of it is skipped when the
 * visitor asks for reduced motion.
 */

const A = "/figma/etusivu";
const DESIGN_W = 1440;

/**
 * The "Nuoret tekijät" block and the Services section read oversized on wide
 * monitors, so both are scaled down about their own top centre. Services
 * losing height would leave a hole above the Google section, so everything
 * below it is pulled up by exactly what Services gave back, and the canvas
 * shortens by the same amount.
 */
const ABOUT_SCALE = 0.8;
const SERVICES_SCALE = 0.8;
/** Figma height of the Services frame (node 3:23). */
const SERVICES_H = 1820;
const GOOGLE_SHIFT = SERVICES_H * (1 - SERVICES_SCALE);

const DESIGN_H = 5170 - GOOGLE_SHIFT;

const LIME = "#acff12";
const COBALT = "#002fd6";
const INK = "#0a0e1a";

const SG = "'Space Grotesk', sans-serif";
const INTER = "'Inter', sans-serif";
const PLAYFAIR = "'Playfair Display', serif";

/* ------------------------------------------------------------------ */
/* Motion helpers                                                      */
/* ------------------------------------------------------------------ */

const EASE = "power3.out";

function reduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Fire-and-forget hover tween that never queues behind an earlier one. */
function tween(
  el: Element | null | undefined,
  vars: gsap.TweenVars,
  duration = 0.35,
) {
  if (!el || reduced()) return;
  gsap.to(el, { duration, ease: EASE, overwrite: "auto", ...vars });
}

/** Starting states for the `data-reveal` scroll entrances. */
const REVEALS: Record<string, gsap.TweenVars> = {
  up: { opacity: 0, y: 48 },
  left: { opacity: 0, x: -48 },
  right: { opacity: 0, x: 48 },
  pop: { opacity: 0, scale: 0.6 },
  growX: { scaleX: 0, transformOrigin: "left center" },
  growY: { scaleY: 0, transformOrigin: "top center" },
};

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */

/** Component 1 — the small "ealize" wordmark used inside the nav. */
function NavWordmark({
  markRef,
  textRef,
}: {
  markRef?: RefObject<HTMLImageElement | null>;
  textRef?: RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div className="relative shrink-0" style={{ width: 88.439, height: 35 }}>
      <img
        ref={markRef}
        src={`${A}/45ff1.svg`}
        alt=""
        className="absolute block"
        style={{ left: 61.571, top: 4.477, width: 26.868, height: 30.523 }}
      />
      <p
        ref={textRef}
        className="absolute m-0 whitespace-nowrap"
        style={{
          left: 0,
          top: 0,
          width: 56,
          height: 30,
          fontFamily: PLAYFAIR,
          fontWeight: 700,
          fontSize: 22.389,
          letterSpacing: "-0.5597px",
          color: COBALT,
        }}
      >
        ealize
      </p>
    </div>
  );
}

/** Nav item with a rule that wipes in from the left and out to the right. */
function NavLink({ label }: { label: string }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);

  const enter = () => {
    tween(textRef.current, { y: -3 }, 0.3);
    gsap.set(ruleRef.current, { transformOrigin: "left center" });
    tween(ruleRef.current, { scaleX: 1 }, 0.4);
  };
  const leave = () => {
    tween(textRef.current, { y: 0 });
    gsap.set(ruleRef.current, { transformOrigin: "right center" });
    tween(ruleRef.current, { scaleX: 0 }, 0.3);
  };

  return (
    <span
      className="relative inline-block shrink-0 cursor-pointer"
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <span ref={textRef} className="inline-block">
        {label}
      </span>
      <span
        ref={ruleRef}
        className="absolute left-0 block w-full"
        style={{
          bottom: "-0.14em",
          height: "0.07em",
          background: INK,
          transform: "scaleX(0)",
          transformOrigin: "left center",
        }}
      />
    </span>
  );
}

/** Design geometry of the nav, in canvas pixels. */
const NAV = {
  /** Component 3 spans y -41..94 in canvas coords; that is the clip window. */
  wrapH: 94,
  barTop: -6.993,
  barH: 100.993,
  barW: 1110.097,
  padX: 123.379,
  linkFs: 23.693,
  gap: 54.155,
  logoW: 88.439,
  logoH: 35,
  ctaFs: 10.8,
  ctaPadX: 15.422,
  ctaPadY: 9.253,
  ctaRadius: 4.627,
  notchLeft: 945.885,
  notchTop: -41,
  notchW: 328.115,
  notchH: 135,
};

/** What the bar collapses to once scrolling starts — viewport px, not scaled. */
const NAV_COMPACT = {
  wrapH: 64,
  barTop: 0,
  barH: 64,
  padX: 40,
  linkFs: 15,
  gap: 32,
  logoScale: 0.78,
  ctaFs: 13,
  ctaPadX: 18,
  ctaPadY: 10,
  ctaRadius: 6,
  notch: 0,
  shadow: "0px 6px 24px rgba(10,14,26,0.16)",
};

const LINKS = ["Services", "Work", "About", "Pricing"];

/**
 * Component 3 — the lime nav bar. It lives outside the scaled canvas as a
 * fixed layer so it can stay put while the page scrolls.
 *
 * At rest it reproduces the Figma geometry exactly (1110x101 bar sitting 7px
 * above the canvas top, with the Polygon 5 notch hanging off its right end).
 * Once the page starts scrolling, GSAP tweens it to a compact full-width bar.
 */
function StickyNav({ width, scale }: { width: number; scale: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const notchRef = useRef<HTMLDivElement>(null);
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLImageElement>(null);
  const wordRef = useRef<HTMLParagraphElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaTextRef = useRef<HTMLParagraphElement>(null);
  const compact = useRef(false);
  const introDone = useRef(false);

  useLayoutEffect(() => {
    const rest = {
      wrapH: NAV.wrapH * scale,
      barTop: NAV.barTop * scale,
      barH: NAV.barH * scale,
      barW: NAV.barW * scale,
      padX: NAV.padX * scale,
      linkFs: NAV.linkFs * scale,
      gap: NAV.gap * scale,
      logoScale: scale,
      ctaFs: NAV.ctaFs * scale,
      ctaPadX: NAV.ctaPadX * scale,
      ctaPadY: NAV.ctaPadY * scale,
      ctaRadius: NAV.ctaRadius * scale,
      notch: 1,
      shadow: "0px 0px 0px rgba(10,14,26,0)",
    };
    const small = { ...NAV_COMPACT, barW: width };

    const paint = (on: boolean, duration: number) => {
      const t = on ? small : rest;
      const go = (el: Element | null, vars: gsap.TweenVars) =>
        duration ? gsap.to(el, { ...vars, duration, ease: EASE }) : gsap.set(el, vars);

      go(wrapRef.current, { height: t.wrapH });
      go(barRef.current, {
        top: t.barTop,
        height: t.barH,
        width: t.barW,
        paddingLeft: t.padX,
        paddingRight: t.padX,
        boxShadow: t.shadow,
      });
      go(notchRef.current, { opacity: t.notch });
      go(logoBoxRef.current, {
        width: NAV.logoW * t.logoScale,
        height: NAV.logoH * t.logoScale,
      });
      go(logoRef.current, { scale: t.logoScale });
      // `gap` is not in GSAP's unit-aware property list, so it has to carry
      // its own unit — a bare number is dropped by the browser.
      go(linksRef.current, { fontSize: t.linkFs, gap: `${t.gap}px` });
      go(ctaRef.current, {
        paddingLeft: t.ctaPadX,
        paddingRight: t.ctaPadX,
        paddingTop: t.ctaPadY,
        paddingBottom: t.ctaPadY,
        borderRadius: t.ctaRadius,
      });
      go(ctaTextRef.current, { fontSize: t.ctaFs });
    };

    compact.current = window.scrollY > 8;
    paint(compact.current, 0);

    if (!introDone.current) {
      introDone.current = true;
      if (!reduced()) {
        gsap.from(wrapRef.current, {
          yPercent: -130,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.1,
        });
      }
    }

    const onScroll = () => {
      const next = window.scrollY > 8;
      if (next === compact.current) return;
      compact.current = next;
      paint(next, 0.5);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [width, scale]);

  /* ---- logo reaction ---- */
  const logoEnter = () => {
    tween(markRef.current, { rotate: 180, scale: 1.12 }, 0.6);
    tween(wordRef.current, { x: -2 }, 0.4);
  };
  const logoLeave = () => {
    tween(markRef.current, { rotate: 0, scale: 1 }, 0.6);
    tween(wordRef.current, { x: 0 }, 0.4);
  };

  /* ---- magnetic CTA ---- */
  const ctaMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ctaRef.current;
    if (!el || reduced()) return;
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - (r.left + r.width / 2)) * 0.28,
      y: (e.clientY - (r.top + r.height / 2)) * 0.34,
      duration: 0.4,
      ease: EASE,
      overwrite: "auto",
    });
  };
  const ctaEnter = () => tween(ctaRef.current, { scale: 1.08 }, 0.3);
  const ctaLeave = () => {
    if (!ctaRef.current || reduced()) return;
    gsap.to(ctaRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: "elastic.out(1, 0.45)",
      overwrite: "auto",
    });
  };

  return (
    <div ref={wrapRef} className="fixed left-0 top-0 z-50 w-full overflow-hidden">
      {/* Polygon 5 — the notch hanging off the right end of the bar */}
      <div
        ref={notchRef}
        className="absolute flex items-center justify-center"
        style={{
          left: NAV.notchLeft * scale,
          top: NAV.notchTop * scale,
          width: NAV.notchW * scale,
          height: NAV.notchH * scale,
        }}
      >
        <div
          style={{
            transform: "rotate(180deg) scaleX(-1)",
            width: NAV.notchW * scale,
            height: NAV.notchH * scale,
          }}
        >
          <div className="relative h-full w-full">
            <img
              src={`${A}/667ef.svg`}
              alt=""
              className="absolute block"
              style={{ left: "6.7%", top: 0, width: "86.6%", height: "75%" }}
            />
          </div>
        </div>
      </div>

      <div
        ref={barRef}
        className="absolute left-0 flex items-center justify-between overflow-hidden"
        style={{ background: LIME }}
      >
        <div
          ref={logoBoxRef}
          className="relative shrink-0 cursor-pointer"
          onMouseEnter={logoEnter}
          onMouseLeave={logoLeave}
        >
          <div
            ref={logoRef}
            className="absolute left-0 top-0"
            style={{
              transformOrigin: "top left",
              width: NAV.logoW,
              height: NAV.logoH,
            }}
          >
            <NavWordmark markRef={markRef} textRef={wordRef} />
          </div>
        </div>

        <div
          ref={linksRef}
          className="flex shrink-0 items-start overflow-hidden whitespace-nowrap"
          style={{
            // Seeds a parseable starting value for the gap tween.
            gap: NAV.gap * scale,
            fontSize: NAV.linkFs * scale,
            fontFamily: INTER,
            fontWeight: 400,
            lineHeight: 1.5,
            color: INK,
          }}
        >
          {LINKS.map((l) => (
            <NavLink key={l} label={l} />
          ))}
        </div>

        <div
          ref={ctaRef}
          className="flex shrink-0 cursor-pointer items-center"
          style={{ background: COBALT }}
          onMouseEnter={ctaEnter}
          onMouseMove={ctaMove}
          onMouseLeave={ctaLeave}
          onMouseDown={() => tween(ctaRef.current, { scale: 0.94 }, 0.12)}
          onMouseUp={() => tween(ctaRef.current, { scale: 1.08 }, 0.2)}
        >
          <p
            ref={ctaTextRef}
            className="m-0 shrink-0 whitespace-nowrap"
            style={{
              fontFamily: INTER,
              fontWeight: 500,
              lineHeight: 1.4,
              color: LIME,
            }}
          >
            Contact us
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

/** Component 4 — the dark pill "Lue lisää" button. */
function LueLisaaButton({ style }: { style: CSSProperties }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  const enter = () => {
    tween(rootRef.current, { y: -4, scale: 1.04 }, 0.4);
    tween(fillRef.current, { backgroundColor: COBALT }, 0.4);
    tween(ringRef.current, { scale: 1.18, rotate: 90 }, 0.5);
    tween(arrowRef.current, { x: 4 }, 0.4);
    tween(textRef.current, { x: -3 }, 0.4);
  };
  const leave = () => {
    tween(rootRef.current, { y: 0, scale: 1 }, 0.45);
    tween(fillRef.current, { backgroundColor: INK }, 0.45);
    tween(ringRef.current, { scale: 1, rotate: 0 }, 0.5);
    tween(arrowRef.current, { x: 0 }, 0.4);
    tween(textRef.current, { x: 0 }, 0.4);
  };

  return (
    <div
      ref={rootRef}
      data-reveal="pop"
      className="pointer-events-auto absolute cursor-pointer border border-solid border-black"
      style={style}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onMouseDown={() => tween(rootRef.current, { scale: 0.96 }, 0.12)}
      onMouseUp={() => tween(rootRef.current, { scale: 1.04 }, 0.2)}
    >
      <div
        ref={fillRef}
        className="absolute"
        style={{ inset: -1, background: INK, borderRadius: 25 }}
      />
      <p
        ref={textRef}
        className="absolute m-0 whitespace-nowrap"
        style={{
          left: 22.23,
          right: 74.75,
          top: 14.51,
          bottom: 14.51,
          fontFamily: SG,
          fontWeight: 700,
          fontSize: 24,
          lineHeight: 1.2,
          color: "#ffffff",
        }}
      >
        Lue lisää
      </p>
      <div
        ref={ringRef}
        className="absolute"
        style={{ left: 145.46, top: 9.34, width: 40.4, height: 41.35 }}
      >
        <img
          src={`${A}/ec85a.svg`}
          alt=""
          className="absolute block h-full w-full"
          style={{ inset: 0 }}
        />
      </div>
      <div
        ref={arrowRef}
        className="absolute flex items-center justify-center"
        style={{ left: 156.57, top: 22.78, width: 17.72, height: 15.64 }}
      >
        <div
          style={{
            width: 23.64,
            height: 1.02,
            transform: "rotate(-40.77deg)",
            flex: "none",
          }}
        >
          <div className="relative h-full w-full">
            <div
              className="absolute"
              style={{ top: -7.36, bottom: -7.36, left: 0, right: "-4.32%" }}
            >
              <img
                src={`${A}/a1294.svg`}
                alt=""
                className="block h-full w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Service cards                                                       */
/* ------------------------------------------------------------------ */

type Card = { title: string; body: string; img: string };

const CARDS: Card[] = [
  {
    title: "Websites",
    body: "Custom-built, fast and easy to manage, from first plan to launch and hosting.",
    img: `${A}/49316.png`,
  },
  {
    title: "Data Analytics",
    body: "We connect the tools you already use with visitor data from your site, turned into one clear, plain-language picture.",
    img: `${A}/640c9.png`,
  },
  {
    title: "AI Automation",
    body: "We automate the repetitive work that eats your week, so your time goes to customers.",
    img: `${A}/b111e.png`,
  },
  {
    title: "Graphic Design",
    body: "Logos, animated ads, banners and full rebrands, sharp, on-brand visuals ready to ship.",
    img: `${A}/2be0e.png`,
  },
];

function ServiceCard({ card, index }: { card: Card; index: number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const pillTextRef = useRef<HTMLParagraphElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);

  const enter = () => {
    tween(
      rootRef.current,
      {
        y: -12,
        boxShadow: "0px 28px 60px rgba(10,14,26,0.16)",
        borderColor: COBALT,
      },
      0.45,
    );
    tween(imgRef.current, { scale: 1.06, y: -6 }, 0.6);
    tween(pillRef.current, { backgroundColor: COBALT, scale: 1.04 }, 0.4);
    tween(pillTextRef.current, { color: LIME }, 0.4);
    tween(dotRef.current, { backgroundColor: LIME }, 0.4);
    // The icon ships as a white stroke, so it needs inverting on lime.
    tween(arrowRef.current, { filter: "brightness(0)", x: 2 }, 0.4);
    tween(titleRef.current, { color: COBALT }, 0.4);
  };

  const leave = () => {
    tween(
      rootRef.current,
      {
        y: 0,
        rotateX: 0,
        rotateY: 0,
        boxShadow: "0px 0px 0px rgba(10,14,26,0)",
        borderColor: "#e5e7ef",
      },
      0.5,
    );
    tween(imgRef.current, { scale: 1, y: 0 }, 0.6);
    tween(
      pillRef.current,
      { backgroundColor: "rgba(151,245,255,0.5)", scale: 1 },
      0.4,
    );
    tween(pillTextRef.current, { color: COBALT }, 0.4);
    tween(dotRef.current, { backgroundColor: COBALT }, 0.4);
    tween(arrowRef.current, { filter: "brightness(1)", x: 0 }, 0.4);
    tween(titleRef.current, { color: INK }, 0.4);
  };

  /** Subtle pointer-following tilt. */
  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = rootRef.current;
    if (!el || reduced()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, {
      rotateY: px * 6,
      rotateX: -py * 6,
      transformPerspective: 900,
      transformOrigin: "center",
      duration: 0.5,
      ease: EASE,
      overwrite: "auto",
    });
  };

  return (
    <div
      ref={rootRef}
      data-reveal="up"
      data-reveal-delay={index * 0.08}
      className="flex shrink-0 cursor-pointer flex-col items-center border border-solid bg-white"
      style={{
        width: 548,
        gap: 32,
        padding: 32,
        borderRadius: 16,
        borderColor: "#e5e7ef",
        filter: "drop-shadow(0px 1px 1px rgba(10,14,26,0.04))",
        willChange: "transform",
      }}
      onMouseEnter={enter}
      onMouseMove={move}
      onMouseLeave={leave}
    >
      <div
        className="flex shrink-0 flex-col items-center overflow-hidden"
        style={{ gap: 12 }}
      >
        <p
          ref={titleRef}
          className="m-0 shrink-0 whitespace-nowrap text-center"
          style={{
            fontFamily: SG,
            fontWeight: 500,
            fontSize: 24,
            lineHeight: 1.3,
            color: INK,
          }}
        >
          {card.title}
        </p>
        <p
          className="m-0 shrink-0 text-center"
          style={{
            fontFamily: INTER,
            fontWeight: 400,
            fontSize: 15,
            lineHeight: 1.65,
            color: INK,
            width: 320,
          }}
        >
          {card.body}
        </p>
        <div className="shrink-0" style={{ height: 8, width: 1 }} />
        <div
          ref={pillRef}
          className="flex shrink-0 items-center overflow-hidden"
          style={{
            gap: 8,
            paddingLeft: 16,
            paddingRight: 12,
            paddingTop: 8,
            paddingBottom: 8,
            borderRadius: 999,
            background: "rgba(151,245,255,0.5)",
          }}
        >
          <p
            ref={pillTextRef}
            className="m-0 shrink-0 whitespace-nowrap"
            style={{
              fontFamily: INTER,
              fontWeight: 500,
              fontSize: 14,
              lineHeight: 1.4,
              color: COBALT,
            }}
          >
            Learn more
          </p>
          <div
            ref={dotRef}
            className="flex shrink-0 items-center justify-center overflow-hidden"
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              background: COBALT,
            }}
          >
            <div className="relative shrink-0" style={{ width: 12, height: 12 }}>
              <img
                ref={arrowRef}
                src={`${A}/fc7be.svg`}
                alt=""
                className="absolute block h-full w-full"
                style={{ inset: 0 }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative shrink-0" style={{ width: 484, height: 361 }}>
        <img
          ref={imgRef}
          src={card.img}
          alt={`${card.title} examples`}
          className="pointer-events-none absolute h-full w-full object-contain"
          style={{ inset: 0, maxWidth: "none" }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Static layers                                                       */
/* ------------------------------------------------------------------ */

/** "pilvia" cloud overlay — two stacked copies, exactly as exported. */
function Clouds({
  top,
  secondLeft,
  secondTop,
  innerRef,
}: {
  top: number;
  secondLeft: string;
  secondTop: string;
  innerRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={innerRef}
      className="pointer-events-none absolute"
      style={{ left: 0, top, width: 1440, height: 780 }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{ inset: 0 }}
      >
        <img
          src={`${A}/739df.png`}
          alt=""
          className="absolute h-full w-full object-cover"
          style={{ maxWidth: "none" }}
        />
        <div className="absolute overflow-hidden" style={{ inset: 0 }}>
          <img
            src={`${A}/739df.png`}
            alt=""
            className="absolute"
            style={{
              height: "108.46%",
              width: "105%",
              left: secondLeft,
              top: secondTop,
              maxWidth: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/** The cobalt sky photo, reused as a fill in several places. */
function Sky() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute"
      style={{ inset: 0 }}
    >
      <div className="absolute overflow-hidden" style={{ inset: 0 }}>
        <img
          src={`${A}/ae25f.png`}
          alt=""
          className="absolute h-full w-full"
          style={{ left: 0, top: "0.03%", maxWidth: "none" }}
        />
      </div>
      <div className="absolute overflow-hidden" style={{ inset: 0 }}>
        <img
          src={`${A}/ae25f.png`}
          alt=""
          className="absolute h-full w-full"
          style={{ left: 0, top: "0.03%", maxWidth: "none" }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function EtusivuV2() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLParagraphElement>(null);
  const limeWordRef = useRef<HTMLSpanElement>(null);
  const bigMarkRef = useRef<HTMLDivElement>(null);
  const heroCloudsRef = useRef<HTMLDivElement>(null);

  // "Meistä" button parts, animated together from an invisible hit area.
  const meistaShapeRef = useRef<HTMLImageElement>(null);
  const meistaTextRef = useRef<HTMLParagraphElement>(null);
  const meistaArrowRef = useRef<HTMLDivElement>(null);

  const dashRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(DESIGN_W);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const apply = () => setWidth(el.clientWidth || DESIGN_W);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = width / DESIGN_W;

  /** The canvas height changes with the scale, so triggers must re-measure. */
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [width]);

  useLayoutEffect(() => {
    if (reduced()) return;

    const ctx = gsap.context(() => {
      /* ---- hero entrance ---- */
      const tl = gsap.timeline({ delay: 0.15 });
      tl.from(headlineRef.current, {
        y: 70,
        opacity: 0,
        duration: 1.1,
        ease: EASE,
      })
        .from(
          bigMarkRef.current,
          { scale: 1.08, opacity: 0, duration: 1.6, ease: EASE },
          0,
        )
        .fromTo(
          limeWordRef.current,
          { color: "#ffffff" },
          { color: LIME, duration: 0.5, ease: "none" },
          0.75,
        );

      /* ---- hero parallax ---- */
      gsap.to([bigMarkRef.current, heroCloudsRef.current], {
        y: 70,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      /* ---- scroll reveals ---- */
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const from = REVEALS[el.dataset.reveal ?? "up"] ?? REVEALS.up;
        gsap.from(el, {
          ...from,
          duration: 1,
          ease: EASE,
          delay: Number(el.dataset.revealDelay ?? 0),
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    }, canvasRef);

    return () => ctx.revert();
  }, []);

  /* ---- "Meistä" ---- */
  const meistaEnter = () => {
    tween(meistaShapeRef.current, { scale: 1.05, x: 6 }, 0.4);
    tween(meistaTextRef.current, { x: 10 }, 0.4);
    tween(meistaArrowRef.current, { x: 26 }, 0.45);
  };
  const meistaLeave = () => {
    tween(meistaShapeRef.current, { scale: 1, x: 0 }, 0.45);
    tween(meistaTextRef.current, { x: 0 }, 0.45);
    tween(meistaArrowRef.current, { x: 0 }, 0.5);
  };

  return (
    <>
      <StickyNav width={width} scale={scale} />
      <div
        ref={hostRef}
        className="w-full overflow-hidden bg-white"
        style={{ height: DESIGN_H * scale }}
      >
        <div
          ref={canvasRef}
          className="relative bg-white"
          style={{
            width: DESIGN_W,
            height: DESIGN_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {/* ---- Hero (Frame 2) ---- */}
          <div
            ref={heroRef}
            className="absolute overflow-hidden bg-white"
            style={{ left: 0, top: 0, width: 1440, height: 768 }}
          >
            <div
              className="absolute"
              style={{ left: 0, top: 0, width: 1440, height: 805.714 }}
            >
              <Sky />
            </div>

            <p
              ref={headlineRef}
              className="absolute m-0"
              style={{
                left: 27,
                top: 160,
                width: 601,
                height: 267,
                fontFamily: SG,
                fontWeight: 700,
                fontSize: 85.923,
                lineHeight: 0,
                color: "#ffffff",
              }}
            >
              <span style={{ lineHeight: "90px" }}>
                {"Nettisivut, jotka tekevät "}
              </span>
              <span ref={limeWordRef} style={{ lineHeight: "90px", color: LIME }}>
                tulosta
              </span>
            </p>

            <div
              className="absolute flex items-center justify-center"
              style={{
                left: -59.188,
                top: -428.526,
                width: 249.163,
                height: 135.753,
              }}
            >
              <div style={{ transform: "rotate(-179.66deg)", flex: "none" }}>
                <div
                  className="relative"
                  style={{ width: 248.381, height: 134.301 }}
                >
                  <img
                    src={`${A}/9ce61.svg`}
                    alt=""
                    className="absolute block h-full w-full"
                    style={{ inset: 0 }}
                  />
                </div>
              </div>
            </div>

            {/* Giant "ealize" wordmark, masked out of the sky photo */}
            <div
              ref={bigMarkRef}
              className="absolute"
              style={{
                left: 26.85,
                top: -1135.412,
                width: 3322.212,
                height: 1858.857,
                WebkitMaskImage: `url("${A}/fcd18.svg")`,
                maskImage: `url("${A}/fcd18.svg")`,
                WebkitMaskPosition: "321.853px 1473.612px",
                maskPosition: "321.853px 1473.612px",
                WebkitMaskSize: "876.808px 273.606px",
                maskSize: "876.808px 273.606px",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
              }}
            >
              <Sky />
            </div>

            <Clouds
              innerRef={heroCloudsRef}
              top={0}
              secondLeft="115.84%"
              secondTop="-89.63%"
            />

            <div
              className="absolute overflow-hidden bg-white"
              style={{ left: -1019, top: 1031, width: 1440, height: 746 }}
            >
              <div
                className="absolute"
                style={{ left: -371, top: 0, width: 371, height: 199 }}
              />
            </div>
          </div>

          {/* ---- "Nuoret tekijät" block (Frame 6) ---- */}
          <div
            className="absolute overflow-hidden bg-white"
            style={{
              left: -13,
              top: 892,
              width: 1440,
              height: 855,
              transform: `scale(${ABOUT_SCALE})`,
              transformOrigin: "center top",
            }}
          >
            <div
              className="absolute flex items-center justify-center"
              style={{ left: 76, top: 38, width: 1064, height: 595 }}
            >
              <div
                style={{ transform: "rotate(180deg) scaleY(-1)", flex: "none" }}
              >
                <div className="relative" style={{ width: 1064, height: 595 }}>
                  <img
                    src={`${A}/61ab4.png`}
                    alt=""
                    width={1064}
                    height={595}
                    className="absolute block h-full w-full"
                    style={{ inset: 0, maxWidth: "none" }}
                  />
                </div>
              </div>
            </div>

            <div
              className="absolute"
              style={{
                left: 299,
                top: 205,
                width: 977,
                height: 379,
                background: LIME,
              }}
            />

            <img
              src={`${A}/12d7c.svg`}
              alt=""
              className="absolute block"
              style={{ left: 341.368, top: 73, width: 1098.981, height: 470 }}
            />

            <p
              data-reveal="up"
              className="absolute m-0 whitespace-nowrap"
              style={{
                left: 397,
                top: 160,
                fontFamily: SG,
                fontWeight: 700,
                fontSize: 85.923,
                lineHeight: "90px",
                color: "#ffffff",
              }}
            >
              Nuoret tekijät
            </p>

            <div
              className="absolute bg-white"
              style={{
                left: 976,
                top: 146,
                width: 409,
                height: 500,
                borderRadius: 10,
              }}
            />

            <div
              ref={dashRef}
              data-reveal="right"
              data-reveal-delay="0.15"
              className="absolute"
              style={{ left: 976, top: 250, width: 395, height: 293 }}
              onMouseEnter={() =>
                tween(dashRef.current, { y: -10, scale: 1.03 }, 0.5)
              }
              onMouseLeave={() =>
                tween(dashRef.current, { y: 0, scale: 1 }, 0.55)
              }
            >
              <img
                src={`${A}/640c9.png`}
                alt="Ealize dashboard mockup"
                className="pointer-events-none absolute h-full w-full object-contain"
                style={{ inset: 0, maxWidth: "none" }}
              />
            </div>

            <p
              data-reveal="up"
              data-reveal-delay="0.1"
              className="absolute m-0 whitespace-nowrap"
              style={{
                left: 397,
                top: 235,
                fontFamily: SG,
                fontWeight: 700,
                fontSize: 24,
                lineHeight: "64.856px",
                color: "#ffffff",
              }}
            >
              -vakuuttavat tulokset
            </p>

            <img
              ref={meistaShapeRef}
              src={`${A}/b0e61.svg`}
              alt=""
              className="absolute block"
              style={{ left: 392, top: 420, width: 292, height: 82 }}
            />

            <p
              ref={meistaTextRef}
              className="absolute m-0"
              style={{
                left: 410,
                top: 396,
                width: 161,
                fontFamily: INTER,
                fontWeight: 700,
                fontSize: 44.051,
                lineHeight: "119.039px",
                color: "#000000",
              }}
            >
              Meistä
            </p>

            <div
              ref={meistaArrowRef}
              className="absolute flex items-center justify-center"
              style={{ left: 413, top: 471, width: 181, height: 1.006 }}
            >
              <div style={{ transform: "rotate(0.32deg)", flex: "none" }}>
                <div className="relative" style={{ width: 181.003, height: 0 }}>
                  <div
                    className="absolute"
                    style={{
                      top: -7.36,
                      bottom: -7.36,
                      left: 0,
                      right: "-0.55%",
                    }}
                  >
                    <img
                      src={`${A}/dcc42.svg`}
                      alt=""
                      className="block h-full w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Hit area covering the whole "Meistä" affordance */}
            <div
              className="absolute cursor-pointer"
              style={{ left: 392, top: 396, width: 292, height: 119 }}
              onMouseEnter={meistaEnter}
              onMouseLeave={meistaLeave}
            />
          </div>

          <img
            src={`${A}/12234.svg`}
            alt=""
            className="absolute block"
            style={{ left: 453, top: 1860, width: 265, height: 118 }}
          />

          {/* ---- Services ---- */}
          <div
            className="absolute flex flex-col items-center overflow-hidden border-b border-solid bg-white"
            style={{
              transform: `scale(${SERVICES_SCALE})`,
              transformOrigin: "center top",
              left: 0,
              top: 1646,
              width: 1440,
              gap: 56,
              paddingLeft: 160,
              paddingRight: 160,
              paddingTop: 128,
              paddingBottom: 128,
              borderColor: "#e5e7ef",
            }}
          >
            <div
              className="flex shrink-0 flex-col items-center overflow-hidden"
              style={{ gap: 24 }}
            >
              <div data-reveal="up">
                <Eyebrow>How we help</Eyebrow>
              </div>
              <p
                data-reveal="up"
                data-reveal-delay="0.08"
                className="m-0 shrink-0 whitespace-nowrap text-center"
                style={{
                  fontFamily: SG,
                  fontWeight: 700,
                  fontSize: 56,
                  lineHeight: 0,
                  letterSpacing: "-1.68px",
                  color: INK,
                }}
              >
                <span style={{ lineHeight: 0.95 }}>{"Four things. "}</span>
                <span style={{ lineHeight: 0.95, color: LIME }}>
                  One solution.
                </span>
              </p>
              <p
                data-reveal="up"
                data-reveal-delay="0.16"
                className="m-0 shrink-0 text-center"
                style={{
                  fontFamily: INTER,
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: 1.65,
                  color: INK,
                  width: 512,
                }}
              >
                Websites that convert. Design that gets noticed. Data that tells
                you what to do next. Automation that gives you your time back.
                Together, not in separate silos.
              </p>
            </div>

            <div
              className="relative flex w-full shrink-0 flex-wrap items-start overflow-hidden"
              style={{ gap: 24 }}
            >
              {CARDS.map((c, i) => (
                <ServiceCard key={c.title} card={c} index={i} />
              ))}
            </div>
          </div>

          {/* ---- Google / SEO section ----
              Keeps its Figma coordinates; the group as a whole is pulled up by
              the height Services gave back when it was scaled down. */}
          <div
            className="pointer-events-none absolute"
            style={{
              left: 0,
              top: 0,
              width: 1440,
              height: 5170,
              transform: `translateY(${-GOOGLE_SHIFT}px)`,
            }}
          >
            {/* Base shapes behind the section */}
            <img
              src={`${A}/c6368.svg`}
              alt=""
              className="absolute block"
              style={{ left: 0, top: 3485, width: 1440, height: 903 }}
            />
            <img
              src={`${A}/54dbd.svg`}
              alt=""
              className="absolute block"
              style={{ left: 903, top: 3750, width: 368, height: 461 }}
            />
            <img
              src={`${A}/4eda3.svg`}
              alt=""
              className="absolute block"
              style={{ left: 19.143, top: 3732, width: 661.027, height: 645 }}
            />
            <div
              className="absolute"
              style={{
                left: 210,
                top: 3496,
                width: 397,
                height: 9,
                borderRadius: 3,
                background: INK,
              }}
            />

            <p
              data-reveal="up"
              className="absolute m-0 whitespace-nowrap"
              style={{
                left: 28,
                top: 3579,
                fontFamily: SG,
                fontWeight: 700,
                fontSize: 56,
                lineHeight: 0,
                letterSpacing: "-1.68px",
                color: "#ffffff",
              }}
            >
              <span style={{ lineHeight: 0.95 }}>{"Google on helpoin "}</span>
              <span style={{ lineHeight: 0.95, color: LIME }}>näkyvyyden</span>
              <span style={{ lineHeight: 0.95 }}>{" lähde"}</span>
            </p>

            <div
              data-reveal="growX"
              data-reveal-delay="0.15"
              className="absolute"
              style={{
                left: 28,
                top: 3653,
                width: 517,
                height: 7,
                borderRadius: 3,
                background: LIME,
              }}
            />

            {[3750, 3832, 3904].map((top, i) => (
              <p
                key={top}
                data-reveal="left"
                data-reveal-delay={0.1 + i * 0.1}
                className="absolute m-0"
                style={{
                  left: 523,
                  top,
                  width: 310,
                  height: i === 2 ? 39 : 72,
                  fontFamily: INTER,
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: 1.2,
                  color: "#ffffff",
                }}
              >
                Sinun yrityksesi google haussa ykkösemä
              </p>
            ))}

            <div
              data-reveal="growY"
              className="absolute"
              style={{
                left: 511,
                top: 3732,
                width: 5,
                height: 268,
                background: LIME,
              }}
            />

            <div
              ref={phoneRef}
              data-reveal="left"
              className="pointer-events-auto absolute"
              style={{ left: 52, top: 3687, width: 471, height: 625 }}
              onMouseEnter={() =>
                tween(phoneRef.current, { y: -14, rotate: -1.5 }, 0.6)
              }
              onMouseLeave={() =>
                tween(phoneRef.current, { y: 0, rotate: 0 }, 0.7)
              }
            >
              <img
                src={`${A}/da25b.png`}
                alt="Phone mockup of a Google search result"
                className="pointer-events-none absolute h-full w-full object-cover"
                style={{ inset: 0, maxWidth: "none" }}
              />
            </div>

            <div
              className="absolute"
              style={{
                left: 354,
                top: 3638,
                width: 1064,
                height: 595,
                WebkitMaskImage: `url("${A}/c0484.svg")`,
                maskImage: `url("${A}/c0484.svg")`,
                WebkitMaskPosition: "532px 97px",
                maskPosition: "532px 97px",
                WebkitMaskSize: "362px 462px",
                maskSize: "362px 462px",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
              }}
            >
              <img
                src={`${A}/b6e4a.png`}
                alt=""
                width={1064}
                height={595}
                className="absolute block h-full w-full"
                style={{ inset: 0, maxWidth: "none" }}
              />
            </div>

            <div
              className="absolute"
              style={{ left: 658, top: 3991, width: 429, height: 129 }}
            >
              <div
                className="absolute"
                style={{
                  top: 0,
                  left: "-0.23%",
                  right: "-1.63%",
                  bottom: "-6.2%",
                }}
              >
                <img
                  src={`${A}/9f2df.svg`}
                  alt=""
                  className="block h-full w-full"
                  style={{ maxWidth: "none" }}
                />
              </div>
            </div>

            <p
              data-reveal="pop"
              data-reveal-delay="0.1"
              className="absolute m-0 whitespace-nowrap"
              style={{
                left: 892,
                top: 3803,
                fontFamily: SG,
                fontWeight: 700,
                fontSize: 74.483,
                lineHeight: 1.2,
                color: "#1154f4",
              }}
            >
              50e/h
            </p>

            <p
              data-reveal="up"
              className="absolute m-0 whitespace-nowrap"
              style={{
                left: 886,
                top: 3774,
                fontFamily: INTER,
                fontWeight: 700,
                fontSize: 24,
                lineHeight: 1.2,
                color: "#000000",
              }}
            >
              Jatkuva optimointi alkaen
            </p>

            <LueLisaaButton
              style={{ left: 861, top: 4033, width: 199, height: 59 }}
            />

            <div
              className="absolute flex items-center justify-center"
              style={{ left: 1133, top: 3689, width: 275, height: 152 }}
            >
              <div style={{ transform: "scaleY(-1)", flex: "none" }}>
                <div className="relative" style={{ width: 275, height: 152 }}>
                  <img
                    src={`${A}/7618d.svg`}
                    alt=""
                    className="absolute block"
                    style={{
                      left: "6.7%",
                      top: 0,
                      width: "86.6%",
                      height: "75%",
                    }}
                  />
                </div>
              </div>
            </div>

            <Clouds top={3610} secondLeft="115.01%" secondTop="-90.53%" />
          </div>
        </div>
      </div>
    </>
  );
}
