/**
 * Services index. Six cards and the FAQ, because the questions people ask
 * before booking are mostly about logistics rather than medicine.
 */

import { Link } from "wouter";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { FAQS, SERVICES } from "@/data/clinic";
import { soft } from "@/lib/motion";
import { ButtonLink, Reveal, RevealGroup, RevealItem, SectionHead, cx } from "@/components/ui";
import { PageHead } from "@/components/PageHead";

const ACCENT = {
  brand: "bg-brand-wash text-brand",
  gold: "bg-gold-wash text-gold-deep-deep",
  coral: "bg-coral-wash text-coral",
} as const;

export function Services() {
  return (
    <>
      <PageHead
        eyebrow="Services"
        title="What we treat"
        lead="Six areas of men's health, all of them handled by a consultant rather than passed down a chain. Ultrasound and laboratory are on site, so most investigations finish in a single visit."
      >
        <ButtonLink href="/book">Book an appointment</ButtonLink>
      </PageHead>

      <section className="u-wrap pb-20">
        <RevealGroup className="grid gap-4 md:grid-cols-2">
          {SERVICES.map((s) => (
            <RevealItem key={s.id}>
              <Link
                href={`/services/${s.id}`}
                className="group flex h-full flex-col rounded-3xl border border-line bg-white p-8
                           transition-all duration-300 hover:-translate-y-1 hover:border-brand/30
                           hover:shadow-[0_24px_60px_-40px] hover:shadow-brand/70"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className={cx("grid h-12 w-12 place-items-center rounded-2xl", ACCENT[s.accent])}>
                    <s.icon size={21} />
                  </span>
                  <span className="u-tnum text-right text-[12.5px] text-ink-faint">
                    {s.durationMin} min
                    <br />
                    <span className="font-semibold text-ink">
                      {s.priceEgp.toLocaleString("en-EG")} EGP
                    </span>
                  </span>
                </div>

                <h2 className="mt-6 font-sans text-[19px] font-semibold tracking-normal text-ink">
                  {s.name}
                </h2>
                <p className="mt-1 font-display text-[17px] text-ink-faint" dir="rtl">{s.nameAr}</p>
                <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-ink-soft">{s.body}</p>

                <span className="mt-7 inline-flex items-center gap-2 text-[13.5px] font-semibold text-brand">
                  What the visit involves
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="bg-sand py-20">
        <div className="u-wrap-narrow">
          <SectionHead eyebrow="Before you book" title="Questions we are asked most" />
          <div className="mt-10 divide-y divide-line border-y border-line">
            {FAQS.map((f) => (
              <Faq key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
      >
        <span className="text-[15.5px] font-semibold text-ink">{q}</span>
        <ChevronDown
          size={18}
          className={cx("shrink-0 text-brand transition-transform duration-300", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={soft(0.32)}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-10 text-[14.5px] leading-[1.8] text-ink-soft">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Reveal>
  );
}

