/**
 * The clinic's visual identity: editorial, not clinical.
 *
 * A general hospital earns trust by looking like a hospital — heart traces,
 * pulse rings, the medical cross. A private men's clinic does not. The men
 * this place is for are avoiding anything that looks like a hospital, and the
 * feeling to aim at is a quiet magazine or a members' club: oversized serif
 * display, hairline rules, big index numerals, wide-tracked small caps, and
 * type that arrives rather than pulses.
 *
 * So there is deliberately no ECG, no vitals, no floating stethoscopes here.
 * The motion vocabulary is drawn rules, masked type and slow drift.
 *
 * Everything below is decorative or progressive: each collapses to a still,
 * readable state under `prefers-reduced-motion`, and nothing is the only way
 * a piece of content reaches the screen.
 */

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion, useInView, useMotionValue, useReducedMotion, useScroll,
  useSpring, useTransform, type Variants,
} from "framer-motion";

import { EASE_SOFT } from "@/lib/motion";
import { cx } from "@/components/ui";

/* ── Masked type ─────────────────────────────────────────── */

/** One word riding up from behind its own mask. */
const wordUp: Variants = {
  hidden: { y: "118%" },
  show: { y: "0%", transition: { duration: 0.9, ease: EASE_SOFT } },
};

const wordFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
};

/**
 * A headline whose words rise one after another from behind a mask.
 *
 * **The viewport trigger lives on the heading, never on the words.** A masked
 * word starts translated 118% down inside an `overflow: hidden` wrapper, so
 * it has no visible area at all — put `whileInView` on the word itself and
 * IntersectionObserver reports it as permanently out of view, the reveal
 * never fires, and the headline stays blank forever. It is the same class of
 * bug as gating content on an animation, and it cost a blank hero once here
 * already. The heading is always visible (the word wrappers hold their
 * layout space from the first paint), so triggering there is reliable, and
 * the words inherit the state through variants.
 *
 * `as` lets the same component be an h1 on the home page and an h2 elsewhere,
 * because a page with three h1s is a page no screen reader can navigate.
 */
export function SplitText({
  text, className, as = "h1", delay = 0, animate = true,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "p";
  delay?: number;
  /** False renders plain text — for places that animate their own parent. */
  animate?: boolean;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  const Tag = motion[as];

  if (!animate) {
    const Plain = as;
    return <Plain className={className}>{text}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.07, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        /* The space between wrappers is a real text node, not padding.
           Spacing the words with `pr` alone renders correctly but leaves the
           heading's textContent as "Men'shealth,handledprivately." — which is
           what a screen reader announces, what a copy-paste produces, and
           what a crawler indexes. The padding that remains is only there to
           keep the clip box off overhanging glyphs. */
        <Fragment key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden pb-[0.09em] pr-[0.04em] align-bottom">
            <motion.span
              className="inline-block"
              variants={reduced ? wordFade : wordUp}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/* ── Drawn rule ──────────────────────────────────────────── */

/**
 * A hairline that draws itself across when it scrolls into view. The site's
 * substitute for a decorative graphic: it is structure that happens to move,
 * which is what an editorial layout uses instead of ornament.
 */
export function RuleDraw({
  className, tone = "bg-line", delay = 0, vertical = false,
}: {
  className?: string; tone?: string; delay?: number; vertical?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className={cx("block", vertical ? "w-px" : "h-px", tone, className)}
      style={{ transformOrigin: vertical ? "top" : "left" }}
      initial={{ scaleX: vertical ? 1 : 0, scaleY: vertical ? 0 : 1 }}
      whileInView={{ scaleX: 1, scaleY: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={reduced ? { duration: 0 } : { duration: 1, ease: EASE_SOFT, delay }}
    />
  );
}

/* ── Index numeral ───────────────────────────────────────── */

/**
 * The oversized section number a magazine puts in the margin. Sits behind
 * content at low opacity, so it reads as paper texture rather than as data.
 */
export function IndexNum({
  n, className, tone = "text-brand/10",
}: {
  n: number | string; className?: string; tone?: string;
}) {
  return (
    <span
      aria-hidden
      className={cx(
        "u-tnum pointer-events-none select-none font-display leading-none",
        tone, className,
      )}
    >
      {typeof n === "number" ? String(n).padStart(2, "0") : n}
    </span>
  );
}

/* ── Kicker ──────────────────────────────────────────────── */

/** Wide-tracked small caps with a short rule. The site's section label. */
export function Kicker({
  children, tone = "text-brand", rule = "bg-brand/30", className,
}: {
  children: ReactNode; tone?: string; rule?: string; className?: string;
}) {
  return (
    <p className={cx("flex items-center gap-3", className)}>
      <RuleDraw tone={rule} className="w-8 shrink-0" />
      <span className={cx(
        "text-[11px] font-semibold uppercase tracking-[0.22em]", tone,
      )}>
        {children}
      </span>
    </p>
  );
}

/* ── Drift ───────────────────────────────────────────────── */

/**
 * Wraps a block and drifts it against the scroll. Used on the hero image and
 * the offset portrait panels — a magazine spread's sense of depth without a
 * parallax library.
 */
export function Drift({
  children, amount = 60, className,
}: {
  children: ReactNode; amount?: number; className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: reduced ? 0 : y }}>{children}</motion.div>
    </div>
  );
}

/* ── Word marquee ────────────────────────────────────────── */

/**
 * A slow band of words. Editorial rather than promotional — it is a list of
 * places or specialties, not a sales ticker.
 *
 * The track is duplicated in the markup so translating by -50% lands exactly
 * on the seam; a single copy leaves a visible gap at the wrap.
 */
export function WordMarquee({
  words, className, itemClassName, separator = "·",
}: {
  words: readonly string[];
  className?: string;
  itemClassName?: string;
  separator?: string;
}) {
  const doubled = [...words, ...words];
  return (
    <div className={cx("u-rail-fade overflow-hidden", className)} aria-hidden>
      <div className="u-marquee items-center gap-5">
        {doubled.map((w, i) => (
          <span key={`${w}-${i}`} className="flex shrink-0 items-center gap-5">
            <span className={cx("whitespace-nowrap", itemClassName)}>{w}</span>
            <span className="opacity-30">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Count up ────────────────────────────────────────────── */

/**
 * Counts to `value` once it scrolls into view.
 *
 * A spring rather than a linear tween, so the last digits slow down — that is
 * what makes a counter feel like it is arriving somewhere instead of just
 * spinning. Under reduced motion it renders the final value at once: a
 * spinning number is exactly the motion that setting asks to be spared.
 */
export function CountUp({
  value, prefix = "", suffix = "", className,
}: {
  value: number; prefix?: string; suffix?: string; className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(reduced ? value : 0);

  const raw = useMotionValue(0);
  const spring = useSpring(raw, { stiffness: 70, damping: 20, mass: 0.8 });
  const rounded = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    if (reduced) { setDisplay(value); return; }
    if (seen) raw.set(value);
  }, [seen, value, raw, reduced]);

  useEffect(() => {
    if (reduced) return;
    return rounded.on("change", (v) => setDisplay(v as number));
  }, [rounded, reduced]);

  return (
    <span ref={ref} className={cx("u-tnum", className)}>
      {prefix}{display}{suffix}
    </span>
  );
}

/* ── Live dot ────────────────────────────────────────────── */

/** A small pinging dot for status pills. Mint by default. */
export function LiveDot({ className = "bg-mint" }: { className?: string }) {
  return (
    <span className="relative flex h-1.5 w-1.5" aria-hidden>
      <span className={cx("absolute inline-flex h-full w-full animate-ping rounded-full opacity-70", className)} />
      <span className={cx("relative inline-flex h-1.5 w-1.5 rounded-full", className)} />
    </span>
  );
}
