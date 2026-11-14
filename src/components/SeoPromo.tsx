import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import GlitchIn from "./GlitchIn";
import { useCopy } from "../lib/i18n";
import { IMG } from "../lib/assets";
import { EASE, useStatic } from "../lib/motion";

const A = IMG.seoPromo;
const LIME = "#acff12";
/** The bright blue of this Figma frame's price and button dot. */
const SIGNAL = "#1154f4";
const INK = "#0a0e1a";
const HREF = "/services/seo";
const PRICE = 50;

const COPY = {
  fi: {
    lead: "Google on helpoin",
    accent: "näkyvyyden",
    tail: "lähde",
    points: [
      "Sinun yrityksesi Google-haussa ykkösenä",
      "Asiakkaat löytävät sinut ennen kilpailijoita",
      "Jatkuvaa optimointia, ei kertaprojektia",
    ],
    from: "Jatkuva optimointi alkaen",
    unit: "€/h",
    more: "Lue lisää",
    moreName: "Hakukoneoptimointi",
  },
  en: {
    lead: "Google is the easiest",
    accent: "source of",
    tail: "visibility",
    points: [
      "Your business first in Google search",
      "Customers find you before your competitors",
      "Ongoing optimisation, not a one-off project",
    ],
    from: "Ongoing optimisation from",
    unit: "€/h",
    more: "Read more",
    moreName: "Search engine optimisation",
  },
};
type Copy = (typeof COPY)["fi"];

/**
 * Figma "Frame 8" (Ealize – Etusivu, node 62:272): the SEO promo band. A dark
 * field with a tab cut into its top edge holds the headline, three selling
 * points beside a phone showing the client ranked first, and a sky-blue price
 * card over a lime tab, all sinking into a bank of cloud that fades the band
 * back into the white page below.
 *
 * From md up the frame is drawn at its design size and scaled with the
 * section (`--p` is one design pixel). The Figma frame is 1440×1452 but empty
 * below the clouds, so it is cut at 962, where they fade to white.
 *
 * Motion, all skipped under reduced motion or `?static`: the headline glitches
 * in and its underline draws; the points slide in along a lime rule that grows
 * down; the phone springs up and floats; the price card opens from the top,
 * its blue backing slides out from behind it and the price counts up; the lime
 * tab slides in under the button; the rose fades up and sways; the clouds
 * drift and rise with the scroll.
 */
const p = (n: number) => `calc(var(--p) * ${n})`;
const box = (
  left: number,
  top: number,
  width?: number,
  height?: number,
): CSSProperties => ({
  position: "absolute",
  left: p(left),
  top: p(top),
  ...(width !== undefined && { width: p(width) }),
  ...(height !== undefined && { height: p(height) }),
});

/* ---- Motion vocabulary ------------------------------------------------- */

const at = (delay: number, duration = 0.9) => ({ delay, duration, ease: EASE });
const rise = (delay: number, y = 24, x = 0): Variants => ({
  hidden: { opacity: 0, y, x },
  show: { opacity: 1, y: 0, x: 0, transition: at(delay, 0.8) },
});
const drawX = (delay: number): Variants => ({
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: at(delay) },
});
const drawY = (delay: number): Variants => ({
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: at(delay, 1.1) },
});
const pop = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 20, scale: 0.85 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay, type: "spring", stiffness: 260, damping: 18 },
  },
});
const springUp = (delay: number): Variants => ({
  hidden: { opacity: 0, y: "40%", rotate: -6 },
  show: {
    opacity: 1,
    y: "0%",
    rotate: 0,
    transition: { delay, type: "spring", stiffness: 110, damping: 16 },
  },
});
const openDown: Variants = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  show: { clipPath: "inset(0% 0% 0% 0%)", transition: at(0.35, 1.1) },
};
/** The blue backing starts tucked behind the card, then slides out to its offset. */
const backOut: Variants = {
  hidden: { x: "-4.6%", y: "-3.3%", opacity: 0 },
  show: { x: "0%", y: "0%", opacity: 1, transition: at(0.95, 0.8) },
};
const slideIn: Variants = {
  hidden: { x: "-30%", opacity: 0 },
  show: { x: "0%", opacity: 1, transition: at(0.9, 0.9) },
};
const settle: Variants = {
  hidden: { scale: 1.2 },
  show: { scale: 1, transition: { duration: 1.8, ease: EASE } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: at(0.2, 1.6) },
};
const fromLeft = { transformOrigin: "left center" } as const;
const fromTop = { transformOrigin: "center top" } as const;

const play = (isStatic: boolean, amount = 0.25) =>
  isStatic
    ? { initial: false as const, animate: "show" }
    : {
        initial: "hidden",
        whileInView: "show",
        viewport: { once: true, amount },
      };

/** Counts from 0 to `to` once on screen; the final figure stays in the DOM for readers. */
function CountUp({ to, delay = 0 }: { to: number; delay?: number }) {
  const isStatic = useStatic();
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.8 });
  const value = useMotionValue(isStatic ? to : 0);
  const shown = useTransform(value, (v) => Math.round(v).toString());
  useEffect(() => {
    if (isStatic || !seen) return;
    const controls = animate(value, to, { delay, duration: 1.4, ease: EASE });
    return () => controls.stop();
  }, [isStatic, seen, value, to, delay]);
  return (
    <span ref={ref}>
      <span className="sr-only">{to}</span>
      <motion.span aria-hidden>{shown}</motion.span>
    </span>
  );
}

export default function SeoPromo() {
  const t = useCopy(COPY);
  return (
    <section aria-labelledby="seo-promo-heading" className="bg-white">
      <Desktop t={t} />
      <Mobile t={t} />
    </section>
  );
}

function Heading({ t }: { t: Copy }) {
  return (
    <GlitchIn>
      {t.lead} <span style={{ color: LIME }}>{t.accent}</span> {t.tail}
    </GlitchIn>
  );
}

function Desktop({ t }: { t: Copy }) {
  const isStatic = useStatic();
  const frame = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: frame,
    offset: ["start end", "end start"],
  });
  const cloudsY = useTransform(scrollYProgress, [0, 1], [70, -50]);
  const roseY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  return (
    <div className="hidden md:block">
      <motion.div
        ref={frame}
        {...play(isStatic)}
        className="relative mx-auto aspect-[1440/962] max-w-[1440px] overflow-hidden [container-type:inline-size] [--p:calc(100cqw/1440)]"
      >
        <img
          src={A.band}
          alt=""
          aria-hidden
          className="max-w-none"
          style={box(0, 57, 1440, 903)}
        />
        <motion.div
          aria-hidden
          variants={drawX(0.1)}
          style={{
            ...box(210, 68, 397, 9),
            ...fromLeft,
            background: INK,
            borderRadius: p(3),
          }}
        />

        <motion.div
          aria-hidden
          variants={fadeUp}
          style={{ ...box(19.143, 304, 661.026, 645.001), ...(!isStatic && { y: roseY }) }}
        >
          <motion.img
            src={A.rose}
            alt=""
            className="h-full w-full max-w-none"
            animate={isStatic ? undefined : { rotate: [0, 3, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <h2
          id="seo-promo-heading"
          className="whitespace-nowrap font-heading font-bold text-white"
          style={{
            ...box(28, 151),
            fontSize: p(56),
            lineHeight: 0.95,
            letterSpacing: p(-1.68),
          }}
        >
          <Heading t={t} />
        </h2>
        <motion.div
          aria-hidden
          variants={drawX(0.45)}
          style={{
            ...box(28, 225, 517, 7),
            ...fromLeft,
            background: LIME,
            borderRadius: p(3),
          }}
        />

        <motion.div
          aria-hidden
          variants={drawY(0.4)}
          style={{ ...box(506, 304, 5, 268), ...fromTop, background: LIME }}
        />
        <ul>
          {t.points.map((point, i) => (
            <motion.li
              key={point}
              variants={rise(0.6 + i * 0.15, 0, -16)}
              className="font-body font-bold text-white"
              style={{
                ...box(523, [322, 404, 476][i], 310),
                fontSize: p(16),
                lineHeight: 1.2,
              }}
            >
              {point}
            </motion.li>
          ))}
        </ul>

        <motion.div variants={springUp(0.3)} style={box(52, 259, 471, 625)}>
          <motion.img
            src={IMG.servicesMenu.phone}
            alt=""
            aria-hidden
            className="h-full w-full max-w-none object-cover"
            animate={isStatic ? undefined : { y: ["0%", "-1.4%", "0%"] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
          />
        </motion.div>

        {/* Price card: blue backing, sky card, fold, then the copy. */}
        <motion.img
          src={A.cardBack}
          alt=""
          aria-hidden
          variants={backOut}
          style={box(903, 322, 368, 461)}
        />
        <motion.div
          className="overflow-hidden"
          variants={openDown}
          style={box(886, 307, 362, 462)}
        >
          <SkyArt />
        </motion.div>
        <motion.img
          src={A.limeTab}
          alt=""
          aria-hidden
          className="max-w-none"
          variants={slideIn}
          style={box(707, 562, 437, 137)}
        />
        <motion.p
          className="whitespace-nowrap font-body font-bold text-black"
          variants={rise(0.7, 14)}
          style={{ ...box(886, 346), fontSize: p(24), lineHeight: 1.2 }}
        >
          {t.from}
        </motion.p>
        <motion.p
          className="whitespace-nowrap font-heading font-bold"
          variants={rise(0.8, 18)}
          style={{
            ...box(892, 375),
            fontSize: p(74.483),
            lineHeight: 1.2,
            color: SIGNAL,
          }}
        >
          <CountUp to={PRICE} delay={0.9} />
          {" "}
          {t.unit}
        </motion.p>
        <motion.div
          aria-hidden
          variants={{
            hidden: { scaleY: 0 },
            show: { scaleY: 1, transition: at(1.1, 0.6) },
          }}
          style={{ ...box(1151.42, 299, 238.157, 114), ...fromTop }}
        >
          <img src={A.fold} alt="" className="h-full w-full -scale-y-100" />
        </motion.div>

        <motion.div
          aria-hidden
          className="pointer-events-none"
          style={{ ...box(-28.8, 182, 1497.6, 780), ...(!isStatic && { y: cloudsY }) }}
        >
          <motion.img
            src={A.clouds}
            alt=""
            className="h-full w-full max-w-none object-cover"
            animate={isStatic ? undefined : { x: ["0%", "-1.5%", "0%"] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.div variants={pop(1.25)} style={box(847, 597)}>
          <MoreButton t={t} style={{ fontSize: p(24) }} />
        </motion.div>
      </motion.div>
    </div>
  );
}

/** The sky artwork as Figma masks it: a 362×462 window into a 1064×595 image. */
function SkyArt() {
  const isStatic = useStatic();
  return (
    <motion.div className="absolute inset-0" variants={settle}>
      <motion.img
        src={A.sky}
        alt=""
        aria-hidden
        className="absolute max-w-none"
        style={{
          left: "-146.96%",
          top: "-21%",
          width: "293.92%",
          height: "128.79%",
        }}
        animate={isStatic ? undefined : { x: ["0%", "-1%", "0%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

/**
 * Figma "Component 4": an ink pill with a blue dot carrying the arrow. Sized in
 * em from its 199×59 design at 24px. The dot turns the arrow to point right
 * on hover.
 */
function MoreButton({
  t,
  style,
  className = "",
}: {
  t: Copy;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <Link
      to={HREF}
      aria-label={`${t.more}: ${t.moreName}`}
      className={`group/btn relative inline-flex h-[2.458em] w-[8.29em] items-center rounded-[1.04em] pl-[0.958em] font-heading font-bold leading-[1.2] text-white transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0e1a] motion-reduce:transition-none ${className}`}
      style={{ background: INK, ...style }}
    >
      <span className="whitespace-nowrap">{t.more}</span>
      <span className="absolute right-[0.583em] top-1/2 h-[1.667em] w-[1.667em] -translate-y-1/2">
        <span className="block h-full w-full transition-transform duration-300 group-hover/btn:rotate-[40.77deg] group-hover/btn:scale-110 motion-reduce:transition-none">
          <img
            src={A.btnDot}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full"
          />
          <img
            src={A.btnArrow}
            alt=""
            aria-hidden
            className="absolute left-1/2 top-1/2 w-[1.007em] max-w-none -translate-x-1/2 -translate-y-1/2 -rotate-[40.77deg]"
          />
        </span>
      </span>
    </Link>
  );
}

function Mobile({ t }: { t: Copy }) {
  const isStatic = useStatic();
  return (
    <div className="relative overflow-hidden md:hidden" style={{ background: INK }}>
      <motion.div {...play(isStatic, 0.2)} className="relative px-4 pt-14">
        <h2 className="font-heading text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] text-white">
          <Heading t={t} />
        </h2>
        <motion.div
          aria-hidden
          variants={drawX(0.4)}
          className="mt-3 h-[5px] w-[70%] rounded-[3px]"
          style={{ ...fromLeft, background: LIME }}
        />
        <ul className="mt-8 flex flex-col gap-4 border-l-[4px] pl-4" style={{ borderColor: LIME }}>
          {t.points.map((point, i) => (
            <motion.li
              key={point}
              variants={rise(0.5 + i * 0.12, 0, -12)}
              className="font-body text-base font-bold leading-snug text-white"
            >
              {point}
            </motion.li>
          ))}
        </ul>

        <div className="relative mx-auto mt-10 max-w-[362px] pr-4">
          <motion.img
            src={A.cardBack}
            alt=""
            aria-hidden
            variants={backOut}
            className="absolute left-4 top-4 h-full w-[calc(100%-1rem)]"
          />
          <motion.div
            variants={openDown}
            className="relative aspect-[362/215] overflow-hidden"
          >
            <SkyArt />
            <div className="relative p-5">
              <p className="font-body text-lg font-bold leading-tight text-black">
                {t.from}
              </p>
              <p
                className="font-heading text-[3.5rem] font-bold leading-[1.1]"
                style={{ color: SIGNAL }}
              >
                <CountUp to={PRICE} delay={0.8} />
                {" "}
          {t.unit}
              </p>
            </div>
          </motion.div>
          <motion.div variants={pop(1)} className="relative -mt-7 ml-5">
            <MoreButton t={t} className="text-lg" />
          </motion.div>
        </div>

        <motion.img
          src={IMG.servicesMenu.phone}
          alt=""
          aria-hidden
          variants={springUp(0.3)}
          className="relative mx-auto mt-10 block w-[70%] max-w-[300px]"
        />
      </motion.div>
      <img
        src={A.clouds}
        alt=""
        aria-hidden
        className="pointer-events-none relative -mt-40 block w-full"
      />
    </div>
  );
}
