/**
 * Services, as a two-pane explorer rather than a grid of six cards.
 *
 * A grid says "we do six things" and then makes the eye choose between six
 * equally loud tiles. This says the same thing in a list you can scan in one
 * sweep, and spends the space on answering the question the list raises:
 * what actually happens if I book this.
 *
 * Interaction notes, all carried from the hospital build:
 *   - It is a **listbox**, not a set of links. Selecting previews; the panel's
 *     button navigates. An accidental arrow-key press should not yank you to
 *     another page.
 *   - Hover previews on a pointer, because on desktop the cheapest way to
 *     browse six things is to sweep a mouse down them. Hover never steals the
 *     selection from a keyboard user — it only fires on real pointer movement.
 *   - Up/Down/Home/End move the selection, following the listbox pattern.
 *   - On mobile the panes stack and the list becomes a horizontal rail.
 */

import { useRef, useState, type KeyboardEvent } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock, Wallet } from "lucide-react";

import { SERVICES } from "@/data/clinic";
import { soft, springy } from "@/lib/motion";
import { Reveal, cx } from "@/components/ui";
import { Section } from "@/components/Section";
import { Kicker } from "@/components/editorial";

const ACCENT = {
  brand: "bg-brand-wash text-brand",
  gold: "bg-gold-wash text-gold-deep-deep",
  coral: "bg-coral-wash text-coral",
} as const;

export function ServiceExplorer() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const active = SERVICES[index];
  const ActiveIcon = active.icon;

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const last = SERVICES.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = index === last ? 0 : index + 1;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setIndex(next);
    listRef.current
      ?.querySelectorAll<HTMLElement>('[role="option"]')[next]
      ?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <Section tone="white" className="u-aurora">
      <>
        <Reveal className="max-w-2xl">
          <Kicker className="mb-6">What we treat</Kicker>
          <h2 className="text-[clamp(30px,4.6vw,50px)]">Six areas, one consultant</h2>
          <p className="mt-4 text-[16.5px] leading-[1.75] text-ink-soft">
            Imaging and laboratory sit on the same floor as the consulting rooms. An
            investigation that normally spans three appointments finishes in one.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-10">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-5">

            {/* ── The list ── */}
            <div
              ref={listRef}
              role="listbox"
              aria-label="Services"
              aria-activedescendant={`svc-${active.id}`}
              tabIndex={0}
              onKeyDown={onKeyDown}
              className={cx(
                "u-rail rounded-3xl border border-line bg-white p-1.5",
                "focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/15",
                "flex gap-1 lg:block lg:overflow-visible",
              )}
            >
              {SERVICES.map((s, i) => {
                const selected = i === index;
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    id={`svc-${s.id}`}
                    role="option"
                    aria-selected={selected}
                    tabIndex={-1}
                    onClick={() => setIndex(i)}
                    onPointerEnter={(e) => { if (e.pointerType === "mouse") setIndex(i); }}
                    className={cx(
                      "relative flex shrink-0 items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left transition-colors",
                      "lg:w-full",
                      selected ? "text-brand" : "text-ink-soft hover:text-brand",
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="svc-active"
                        className="absolute inset-0 rounded-2xl bg-brand-wash"
                        transition={springy}
                      />
                    )}
                    <span className={cx(
                      "relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-xl transition-colors",
                      selected ? "bg-brand text-white" : "bg-surface text-ink-faint",
                    )}>
                      <Icon size={15} />
                    </span>
                    <span className="relative z-10 whitespace-nowrap text-[13.5px] font-semibold lg:whitespace-normal">
                      {s.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ── The panel ── */}
            <div className="relative overflow-hidden rounded-3xl border border-line bg-white">
              {/* Cross-fade, no `mode="wait"`: an interrupted exit must never
                  leave the panel empty. */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12, position: "absolute", inset: 0 }}
                  transition={soft(0.4)}
                  className="w-full p-7 sm:p-9"
                >
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                      <span className={cx("grid h-13 w-13 place-items-center rounded-2xl p-3", ACCENT[active.accent])}>
                        <ActiveIcon size={24} />
                      </span>
                      <h3 className="mt-5 font-display text-[clamp(24px,3vw,32px)] text-ink">
                        {active.name}
                      </h3>
                      <p className="mt-1 font-display text-[19px] text-ink-faint" dir="rtl">
                        {active.nameAr}
                      </p>
                    </div>

                    <dl className="flex gap-6 rounded-2xl bg-sand px-5 py-4">
                      <div>
                        <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                          <Clock size={12} /> Visit
                        </dt>
                        <dd className="u-tnum mt-1 font-display text-[21px] leading-none text-ink">
                          {active.durationMin}<span className="text-[13px]"> min</span>
                        </dd>
                      </div>
                      <div>
                        <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                          <Wallet size={12} /> From
                        </dt>
                        <dd className="u-tnum mt-1 font-display text-[21px] leading-none text-brand">
                          {active.priceEgp.toLocaleString("en-EG")}
                          <span className="text-[13px]"> EGP</span>
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <p className="mt-6 max-w-2xl text-[15px] leading-[1.8] text-ink-soft">
                    {active.body}
                  </p>

                  <div className="mt-7 border-t border-line pt-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                      What the visit involves
                    </p>
                    <ol className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {active.visit.map((step, i) => (
                        <li key={step} className="flex gap-3 text-[13.5px] leading-snug text-ink-soft">
                          <span className="u-tnum mt-px font-display text-[15px] leading-none text-brand/40">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      href={`/book?service=${active.id}`}
                      className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6
                                 text-[14px] font-semibold text-white transition-colors hover:bg-brand-deep"
                    >
                      Book this <ArrowRight size={15} />
                    </Link>
                    <Link
                      href={`/services/${active.id}`}
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-brand/25
                                 px-6 text-[14px] font-semibold text-brand transition-colors hover:bg-brand-wash"
                    >
                      Read more
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </>
    </Section>
  );
}
