/**
 * Landing page.
 *
 * Structure, in the order a stranger needs it:
 *   hero → the four doors → why this clinic → what we treat → proof
 *   → how a visit works → coming from abroad → the consultant → voices
 *   → journal → book or sign in
 *
 * The identity is editorial rather than clinical. No heart traces, no pulse
 * rings, no floating stethoscopes: the men this place is for are avoiding
 * anything that looks like a hospital. What carries the page instead is
 * magazine furniture — oversized Fraunces display, hairline rules that draw
 * themselves in, index numerals in the margin, wide-tracked small caps, and
 * a contents strip under the hero.
 *
 * The hero's atmosphere is a CSS-animated navy field rather than a video. The
 * hospital build rendered an mp4 with Remotion; that is a 6MB asset, a render
 * step, and a path that 404s the moment the site is not served from "/".
 */

import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight, CalendarCheck, ChevronRight, Globe2, MessageCircle,
  Quote, ShieldCheck, Stethoscope,
} from "lucide-react";

import { BRAND } from "@/lib/brand";
import { ARTICLES, JOURNEY, PROMISES, REVIEWS, STATS } from "@/data/clinic";
import { PASSAGE, PASSAGE_COUNTRIES } from "@/data/international";
import { springy } from "@/lib/motion";
import {
  ButtonLink, Pill, Reveal, RevealGroup, RevealItem, Stars, cx,
} from "@/components/ui";
import {
  CountUp, Drift, IndexNum, Kicker, LiveDot, RuleDraw, SplitText, WordMarquee,
} from "@/components/editorial";
import { ServiceExplorer } from "@/components/ServiceExplorer";
import { Shot } from "@/components/Shot";
import { Logo } from "@/components/Logo";

export function Home() {
  return (
    <>
      <Hero />
      <QuickAccess />
      <Manifesto />
      <ServiceExplorer />
      <Numbers />
      <Journey />
      <PassageStrip />
      <Consultant />
      <Voices />
      <JournalStrip />
      <TwoDoors />
    </>
  );
}

/* ── Hero ────────────────────────────────────────────────── */

/** The contents strip under the hero — a magazine's front-of-book listing. */
const CONTENTS = [
  { n: "01", label: "What we treat", href: "/services" },
  { n: "02", label: "The consultant", href: "/doctor" },
  { n: "03", label: "International", href: "/international" },
  { n: "04", label: "Journal", href: "/journal" },
];

function Hero() {
  return (
    <section className="u-grain relative overflow-hidden bg-brand-deep">
      <div className="u-hero-field absolute inset-0" aria-hidden />
      <div className="u-scrim absolute inset-0" aria-hidden />

      <div className="u-wrap relative z-10 pt-32 pb-0 lg:pt-40">
        <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="pb-4">
            <Reveal>
              <Pill tone="light">
                <LiveDot />
                By appointment only · Sheikh Zayed
              </Pill>
            </Reveal>

            <SplitText
              text="Men's health, handled privately."
              as="h1"
              delay={0.12}
              className="mt-7 max-w-[15ch] text-[clamp(44px,8.6vw,104px)] text-white"
            />

            <Reveal delay={0.3}>
              <div className="mt-8 flex max-w-xl items-start gap-5">
                <RuleDraw tone="bg-white/25" className="mt-3 w-12 shrink-0" delay={0.4} />
                <p className="text-[17px] leading-[1.8] text-white/75">
                  The reason men delay care is rarely the medicine. It is the waiting room. So
                  there isn&apos;t one — a private entrance, one patient in the clinic at a time,
                  and {BRAND.doctor} for a full forty minutes.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.38}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <ButtonLink href="/book" tone="white" size="lg">
                  <CalendarCheck size={18} /> Book an appointment
                </ButtonLink>
                <ButtonLink href={BRAND.whatsappHref} tone="light" size="lg" external>
                  <MessageCircle size={17} /> Ask privately
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          {/* The cover image, offset and drifting — a spread, not a banner. */}
          <Reveal delay={0.2} className="hidden lg:block">
            <Drift amount={34}>
              <div className="relative">
                <Shot
                  label="Dr. Osama Ghattas — cover portrait, navy suit, low key"
                  ratio="3/4"
                  className="!rounded-none"
                />
                <span
                  className="pointer-events-none absolute -inset-3 border border-white/15"
                  aria-hidden
                />
              </div>
            </Drift>
          </Reveal>
        </div>

        {/* Contents strip. */}
        <div className="mt-16 border-t border-white/12 lg:mt-20">
          <ul className="grid divide-y divide-white/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
            {CONTENTS.map((c, i) => (
              <li key={c.n}>
                <Link
                  href={c.href}
                  className={cx(
                    "group flex items-baseline gap-4 py-6 transition-colors lg:px-7",
                    i === 0 && "lg:pl-0",
                  )}
                >
                  <span className="u-tnum text-[11px] font-semibold tracking-[0.2em] text-mint">
                    {c.n}
                  </span>
                  <span className="font-display text-[19px] text-white/80 transition-colors group-hover:text-white">
                    {c.label}
                  </span>
                  <ArrowRight
                    size={15}
                    className="ml-auto self-center text-white/25 transition-all group-hover:translate-x-1 group-hover:text-white/70"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ── Quick access ────────────────────────────────────────── */

const QUICK = [
  { icon: CalendarCheck, title: "Book a visit", text: "Six services, real slots.", href: "/book" },
  { icon: Globe2, title: "Coming from abroad", text: "Flights, visa, hotel, transfers.", href: "/international" },
  { icon: Stethoscope, title: "What we treat", text: "Andrology to hormonal health.", href: "/services" },
  { icon: ShieldCheck, title: "Patient portal", text: "Results, scans, prescriptions.", href: "/portal" },
];

function QuickAccess() {
  return (
    <section className="relative z-20 -mt-14">
      <div className="u-wrap">
        <RevealGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" each={0.06}>
          {QUICK.map(({ icon: Icon, title, text, href }) => (
            <RevealItem key={title}>
              <Link href={href} asChild>
                <motion.a
                  className="group flex h-full items-start gap-4 border border-white/70 bg-white/94
                             p-6 shadow-[0_20px_50px_-30px_rgba(14,42,71,0.7)] backdrop-blur-xl"
                  whileHover={{ y: -4 }}
                  transition={springy}
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center bg-brand-wash text-brand
                                   transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                    <Icon size={19} />
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold text-ink">{title}</span>
                    <span className="mt-0.5 block text-[13.5px] leading-snug text-ink-soft">{text}</span>
                  </span>
                  <ChevronRight
                    size={16}
                    className="ml-auto mt-3 shrink-0 text-ink-faint transition-transform duration-300
                               group-hover:translate-x-1 group-hover:text-brand"
                  />
                </motion.a>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ── Manifesto ───────────────────────────────────────────── */

function Manifesto() {
  return (
    <section className="u-wrap pt-24">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <Kicker>Why this clinic exists</Kicker>
          <h2 className="mt-6 text-[clamp(30px,4.4vw,52px)]">
            Four decisions, not four slogans
          </h2>
          <p className="mt-5 max-w-sm text-[16px] leading-[1.8] text-ink-soft">
            Every one of these costs us slots or money. That is what makes them true rather
            than marketing.
          </p>
        </Reveal>

        <RevealGroup className="grid gap-px bg-line sm:grid-cols-2">
          {PROMISES.map((p, i) => (
            <RevealItem
              key={p.title}
              className="group relative bg-surface p-8 transition-colors duration-300 hover:bg-white"
            >
              <IndexNum n={i + 1} className="absolute right-6 top-5 text-[44px]" />
              <p.icon size={22} className="text-brand" />
              <h3 className="mt-6 font-display text-[22px] text-ink">{p.title}</h3>
              <p className="mt-2.5 max-w-xs text-[14px] leading-relaxed text-ink-soft">{p.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ── Numbers ─────────────────────────────────────────────── */

function Numbers() {
  return (
    <section className="u-grain relative overflow-hidden bg-brand py-24 text-white">
      <Logo size={520} tone="light" className="absolute -right-28 top-1/2 -translate-y-1/2 opacity-[0.04]" />
      <div className="u-wrap relative z-10">
        <Reveal className="max-w-xl">
          <Kicker tone="text-mint" rule="bg-mint/40">By the numbers</Kicker>
          <h2 className="mt-6 text-[clamp(28px,3.8vw,44px)] text-white">
            Measured, not estimated
          </h2>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4" each={0.08}>
          {STATS.map((s) => (
            <RevealItem key={s.label}>
              <RuleDraw tone="bg-white/20" />
              <div className="pt-6">
                <div className="font-display text-[clamp(40px,5.2vw,62px)] leading-none text-white">
                  <CountUp value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-4 text-[14.5px] font-medium text-white/85">{s.label}</div>
                <div className="mt-1 text-[13px] text-white/45">{s.note}</div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ── Journey ─────────────────────────────────────────────── */

function Journey() {
  return (
    <section className="u-wrap py-24">
      <Reveal className="max-w-2xl">
        <Kicker>What to expect</Kicker>
        <h2 className="mt-6 text-[clamp(30px,4.4vw,52px)]">A visit, start to finish</h2>
        <p className="mt-5 text-[16.5px] leading-[1.8] text-ink-soft">
          We publish the steps because knowing exactly what happens next is most of what makes a
          first visit bearable.
        </p>
      </Reveal>

      {/* Four columns separated by hairlines that draw themselves in — the
          magazine version of a process diagram. */}
      <RevealGroup className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4" each={0.1}>
        {JOURNEY.map((j) => (
          <RevealItem key={j.n}>
            <RuleDraw tone="bg-brand/25" />
            <div className="pt-6">
              <span className="u-tnum font-display text-[15px] tracking-[0.1em] text-brand">
                {j.n}
              </span>
              <h3 className="mt-4 font-display text-[23px] leading-tight text-ink">{j.title}</h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">{j.body}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

/* ── Elite Passage ───────────────────────────────────────── */

function PassageStrip() {
  return (
    <section className="u-grain relative overflow-hidden bg-brand-deep py-24 text-white">
      <div className="u-wrap relative z-10">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal>
            <Kicker tone="text-mint" rule="bg-mint/40">International patients</Kicker>
            <h2 className="mt-7 text-[clamp(38px,6vw,76px)] leading-[0.98] text-white">
              {PASSAGE.name}
            </h2>
            <p className="mt-5 font-display text-[clamp(19px,2.4vw,27px)] italic text-mint">
              {PASSAGE.line}
            </p>
            <p className="mt-7 max-w-lg text-[16px] leading-[1.85] text-white/65">
              {PASSAGE.lead}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/international" tone="white" size="lg">
                See the programme <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink
                href={BRAND.whatsappHref} tone="light" size="lg" external
              >
                <MessageCircle size={16} /> Send your reports
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="grid gap-px bg-white/10 sm:grid-cols-2">
              {[
                { n: "01", t: "Flights & visa letter", s: "Booked around the treatment dates." },
                { n: "02", t: "Met at arrivals", s: "Cairo International, inside the hall." },
                { n: "03", t: "Hotel five minutes away", s: "Sheikh Zayed, companion included." },
                { n: "04", t: "Days, not weeks", s: "Everything scheduled back to back." },
              ].map((c) => (
                <li key={c.n} className="bg-brand-deep p-7">
                  <span className="u-tnum text-[11px] font-semibold tracking-[0.2em] text-mint">
                    {c.n}
                  </span>
                  <p className="mt-4 font-display text-[20px] text-white">{c.t}</p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/55">{c.s}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <RuleDraw tone="bg-white/15" />
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
            Patients travel to this clinic from
          </p>
          <WordMarquee
            words={PASSAGE_COUNTRIES}
            className="mt-4"
            itemClassName="font-display text-[clamp(22px,3vw,34px)] text-white/45"
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ── Consultant ──────────────────────────────────────────── */

function Consultant() {
  return (
    <section className="u-wrap py-24">
      <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <Reveal>
            <Kicker>Your consultant</Kicker>
          </Reveal>
          <SplitText
            text="You will know who you're seeing"
            as="h2"
            className="mt-6 max-w-[14ch] text-[clamp(32px,4.8vw,58px)]"
          />
          <Reveal delay={0.1}>
            <div className="mt-8 flex max-w-xl items-start gap-5">
              <RuleDraw tone="bg-brand/30" className="mt-3 w-12 shrink-0" />
              <p className="text-[16.5px] leading-[1.85] text-ink-soft">
                Follow-ups stay with the doctor who saw you first. Your file has one reader, your
                plan has one author, and you never re-explain your history to a stranger.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-9 flex flex-wrap gap-2.5">
              {["Andrology", "Male fertility", "Hormonal health", "General urology"].map((t) => (
                <Pill key={t} tone="muted">{t}</Pill>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/doctor" tone="outline">About {BRAND.doctor}</ButtonLink>
              <ButtonLink href="/book"><CalendarCheck size={16} /> Book with him</ButtonLink>
            </div>
          </Reveal>
        </div>

        {/* Offset frame + drift: the magazine portrait treatment. */}
        <Reveal delay={0.08}>
          <Drift amount={28} className="relative">
            <div className="relative">
              <Shot
                label="Dr. Osama Ghattas — half length, consulting room"
                ratio="4/5"
                tone="sand"
                className="!rounded-none"
              />
              <span className="pointer-events-none absolute -inset-4 border border-brand/20" aria-hidden />
              <div className="absolute -bottom-6 -left-6 max-w-[200px] bg-brand p-5 text-white">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Consultant
                </p>
                <p className="mt-1.5 font-display text-[20px] leading-tight">{BRAND.doctor}</p>
                <p className="mt-1 text-[12px] text-white/55">Andrology & urology</p>
              </div>
            </div>
          </Drift>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Voices ──────────────────────────────────────────────── */

function Voices() {
  return (
    <section className="bg-sand py-24">
      <div className="u-wrap">
        <Reveal className="max-w-2xl">
          <Kicker>In their words</Kicker>
          <h2 className="mt-6 text-[clamp(30px,4.4vw,52px)]">What patients say afterwards</h2>
          <p className="mt-5 text-[16.5px] leading-[1.8] text-ink-soft">
            Published only from patients with a completed visit. Initials unless someone asks
            otherwise.
          </p>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-px bg-line md:grid-cols-3">
          {REVIEWS.map((r) => (
            <RevealItem key={r.id} className="flex flex-col bg-sand p-8">
              <Quote size={24} className="text-brand/25" />
              <p className="mt-5 flex-1 font-display text-[19px] leading-[1.55] text-ink">
                {r.body}
              </p>
              <div className="mt-7 flex items-center gap-3 border-t border-line pt-5">
                <span className={cx(
                  "grid h-10 w-10 place-items-center text-[12px] font-semibold",
                  r.accent === "brand" ? "bg-brand-wash text-brand"
                    : r.accent === "mint" ? "bg-mint-wash text-mint" : "bg-coral-wash text-coral",
                )}>
                  {r.initials}
                </span>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold text-ink">{r.name}</p>
                  <p className="text-[12px] text-ink-faint">{r.context}</p>
                </div>
                <Stars rating={r.rating} size={12} />
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ── Journal ─────────────────────────────────────────────── */

function JournalStrip() {
  return (
    <section className="u-wrap py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <Kicker>Journal</Kicker>
          <h2 className="mt-6 max-w-[16ch] text-[clamp(30px,4.4vw,52px)]">
            Written by the clinic, not by an agency
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Link
            href="/journal"
            className="group inline-flex items-center gap-2 text-[14px] font-semibold text-brand"
          >
            All articles
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>

      <RevealGroup className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-3">
        {ARTICLES.map((a, i) => (
          <RevealItem key={a.slug}>
            <Link href={`/journal/${a.slug}`} className="group block">
              <RuleDraw tone="bg-line" />
              <div className="pt-6">
                <div className="flex items-baseline gap-4">
                  <IndexNum n={i + 1} tone="text-brand/25" className="text-[15px]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                    {a.category}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-[24px] leading-[1.2] text-ink transition-colors group-hover:text-brand">
                  {a.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{a.excerpt}</p>
                <span className="u-tnum mt-5 inline-flex items-center gap-2 text-[12.5px] text-ink-faint">
                  {a.readMin} min read
                  <ArrowRight size={13} className="text-brand transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

/* ── Two doors ───────────────────────────────────────────── */

function TwoDoors() {
  return (
    <section className="u-wrap pb-24">
      <RevealGroup className="grid gap-px bg-line lg:grid-cols-2">
        <RevealItem className="u-grain relative overflow-hidden bg-brand p-10 text-white sm:p-14">
          <Logo size={160} tone="light" className="absolute -right-10 -top-10 opacity-[0.08]" />
          <Kicker tone="text-mint" rule="bg-mint/40">New patient</Kicker>
          <h2 className="mt-7 max-w-[14ch] text-[clamp(28px,3.4vw,42px)] text-white">
            Book without picking up the phone
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/65">
            Pick what you need, a day and a time. Confirmation is immediate, and nothing we send
            you names the service.
          </p>
          <ButtonLink href="/book" tone="white" size="lg" className="mt-9">
            <CalendarCheck size={17} /> Start booking
          </ButtonLink>
        </RevealItem>

        <RevealItem className="bg-surface p-10 sm:p-14">
          <Kicker>Returning</Kicker>
          <h2 className="mt-7 max-w-[14ch] text-[clamp(28px,3.4vw,42px)]">
            Everything from your last visit, waiting
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-soft">
            Scans, blood results, prescriptions and your written plan — in one place, on any
            device, with discreet mode on by default.
          </p>
          <ButtonLink href="/portal" tone="outline" size="lg" className="mt-9">
            Open the patient portal
          </ButtonLink>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
