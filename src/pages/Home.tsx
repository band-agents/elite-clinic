/**
 * Landing page.
 *
 * The argument the page makes, in order: this is private → here is what we
 * treat → here is how a visit goes → here is the man treating you → here is
 * proof → book. Each section is one idea; a visitor who reads only the
 * headings still gets the whole pitch.
 */

import { Link } from "wouter";
import {
  ArrowRight, CalendarCheck, Clock, MessageCircle, ShieldCheck, Sparkles,
} from "lucide-react";

import { BRAND } from "@/lib/brand";
import { ARTICLES, JOURNEY, PROMISES, REVIEWS, SERVICES, STATS } from "@/data/clinic";
import {
  ButtonLink, Pill, Reveal, RevealGroup, RevealItem, SectionHead, Stars, cx,
} from "@/components/ui";
import { CountUp } from "@/components/CountUp";
import { Shot } from "@/components/Shot";
import { Logo } from "@/components/Logo";

export function Home() {
  return (
    <>
      <Hero />
      <Promises />
      <ServicesSection />
      <Journey />
      <DoctorStrip />
      <Numbers />
      <Reviews />
      <JournalStrip />
      <BookingBand />
    </>
  );
}

/* ── Hero ────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="u-aurora relative">
      <div className="u-wrap relative z-10 grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <Reveal>
            <Pill tone="mint" className="mb-6">
              <ShieldCheck size={13} /> By appointment only · Sheikh Zayed
            </Pill>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="text-[clamp(44px,7.4vw,82px)]">
              Men&apos;s health,
              <br />
              handled privately.
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-[17px] leading-[1.75] text-ink-soft">
              A men&apos;s clinic built around one idea: the reason men delay care is rarely the
              medicine. It is the waiting room. So there isn&apos;t one — a private entrance, one
              patient at a time, and {BRAND.doctor} for a full forty minutes.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="/book" size="lg">
                <CalendarCheck size={17} /> Book an appointment
              </ButtonLink>
              <ButtonLink href={BRAND.whatsappHref} tone="outline" size="lg" external>
                <MessageCircle size={17} /> Ask privately
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-7">
              {[
                { k: "40 min", v: "Standard consultation" },
                { k: "1", v: "Patient at a time" },
                { k: "48h", v: "Results in your portal" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="u-tnum font-display text-[26px] leading-none text-brand">{s.k}</dt>
                  <dd className="mt-1.5 text-[12.5px] leading-snug text-ink-faint">{s.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* The portrait, with two floating cards that carry the two facts a
            visitor most wants before booking: who, and how soon. */}
        <Reveal delay={0.1} className="relative">
          <Shot label="Dr. Osama Ghattas — portrait, consulting room, natural light" ratio="4/5" />

          <div className="u-glass absolute -left-3 bottom-24 rounded-2xl p-4 shadow-xl sm:-left-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              Next available
            </p>
            <p className="mt-1 font-display text-[22px] text-brand">Tomorrow, 18:00</p>
            <p className="mt-0.5 text-[12px] text-ink-soft">Men&apos;s health consultation</p>
          </div>

          <div className="u-glass absolute -right-2 top-10 flex items-center gap-2.5 rounded-2xl p-3.5 shadow-xl sm:-right-5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-mint-wash text-mint">
              <Clock size={16} />
            </span>
            <div>
              <p className="text-[13px] font-semibold text-ink">No waiting room</p>
              <p className="text-[11.5px] text-ink-faint">Private entrance</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Promises ────────────────────────────────────────────── */

function Promises() {
  return (
    <section className="u-wrap py-10">
      <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PROMISES.map((p) => (
          <RevealItem
            key={p.title}
            className="rounded-3xl border border-line bg-white p-6 transition-colors hover:border-brand/30"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-wash text-brand">
              <p.icon size={19} />
            </span>
            <h3 className="mt-5 font-sans text-[15.5px] font-semibold tracking-normal text-ink">
              {p.title}
            </h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{p.body}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

/* ── Services ────────────────────────────────────────────── */

const ACCENT_CHIP = {
  brand: "bg-brand-wash text-brand",
  mint: "bg-mint-wash text-mint",
  coral: "bg-coral-wash text-coral",
} as const;

function ServicesSection() {
  return (
    <section className="u-wrap py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHead
          eyebrow="What we treat"
          title="Six areas, one consultant"
          lead="Imaging and laboratory are on the same floor as the consulting rooms, so an investigation that usually spans three appointments takes one."
        />
        <Reveal delay={0.1}>
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 text-[14px] font-semibold text-brand"
          >
            All services
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>

      <RevealGroup className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <RevealItem key={s.id}>
            <Link
              href={`/services/${s.id}`}
              className="group flex h-full flex-col rounded-3xl border border-line bg-white p-7
                         transition-all duration-300 hover:-translate-y-1 hover:border-brand/30
                         hover:shadow-[0_20px_50px_-30px] hover:shadow-brand/60"
            >
              <span className={cx("grid h-12 w-12 place-items-center rounded-2xl", ACCENT_CHIP[s.accent])}>
                <s.icon size={20} />
              </span>
              <h3 className="mt-6 font-sans text-[17px] font-semibold tracking-normal text-ink">
                {s.name}
              </h3>
              <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-soft">{s.summary}</p>
              <span className="mt-6 flex items-center justify-between border-t border-line pt-4 text-[12.5px]">
                <span className="u-tnum text-ink-faint">
                  {s.durationMin} min · {s.priceEgp.toLocaleString("en-EG")} EGP
                </span>
                <ArrowRight
                  size={15}
                  className="text-brand transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

/* ── Journey ─────────────────────────────────────────────── */

function Journey() {
  return (
    <section className="relative overflow-hidden bg-sand py-20">
      <div className="u-wrap">
        <SectionHead
          eyebrow="What to expect"
          title="A visit, start to finish"
          lead="We publish the steps because knowing exactly what happens next is most of what makes a first visit bearable."
        />

        <RevealGroup className="mt-14 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {JOURNEY.map((j) => (
            <RevealItem key={j.n} className="relative">
              <span className="font-display text-[46px] leading-none text-brand/20">{j.n}</span>
              <h3 className="mt-3 font-sans text-[16px] font-semibold tracking-normal text-ink">
                {j.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{j.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ── Doctor ──────────────────────────────────────────────── */

function DoctorStrip() {
  return (
    <section className="u-wrap py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <Shot label="Dr. Osama Ghattas — half length, in the consulting room" ratio="3/4" tone="sand" />
        </Reveal>

        <div>
          <Reveal>
            <p className="u-eyebrow mb-3">Your consultant</p>
            <h2 className="text-[clamp(30px,4.6vw,50px)]">
              You will know who you&apos;re seeing
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 text-[16.5px] leading-[1.8] text-ink-soft">
              Follow-ups stay with the doctor who saw you first. Your file has one reader, your
              plan has one author, and you never re-explain your history to a stranger.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {["Andrology", "Male fertility", "Hormonal health", "General urology"].map((t) => (
                <Pill key={t} tone="muted">{t}</Pill>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/doctor" tone="outline">
                About {BRAND.doctor}
              </ButtonLink>
              <ButtonLink href="/book">
                <CalendarCheck size={16} /> Book with him
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Numbers ─────────────────────────────────────────────── */

function Numbers() {
  return (
    <section className="u-wrap py-10">
      <div className="rounded-[32px] bg-brand px-8 py-14 text-white sm:px-14">
        <Reveal>
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-white/45">
            By the numbers
          </p>
          <h2 className="mt-3 max-w-xl text-[clamp(26px,3.8vw,40px)] text-white">
            Measured, not estimated
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <RevealItem key={s.label}>
              <p className="font-display text-[clamp(38px,5vw,54px)] leading-none text-white">
                <CountUp to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-3 text-[14px] font-semibold text-white/85">{s.label}</p>
              <p className="mt-1 text-[12.5px] text-white/45">{s.note}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ── Reviews ─────────────────────────────────────────────── */

function Reviews() {
  return (
    <section className="u-wrap py-20">
      <SectionHead
        eyebrow="In their words"
        title="What patients say afterwards"
        lead="Reviews are published only from patients with a completed visit, and initials are used unless a patient asks otherwise."
      />

      <RevealGroup className="mt-12 grid gap-4 md:grid-cols-3">
        {REVIEWS.map((r) => (
          <RevealItem
            key={r.id}
            className="flex flex-col rounded-3xl border border-line bg-white p-7"
          >
            <Stars rating={r.rating} />
            <p className="mt-5 flex-1 text-[14.5px] leading-[1.75] text-ink-soft">
              &ldquo;{r.body}&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
              <span
                className={cx(
                  "grid h-10 w-10 place-items-center rounded-xl text-[12px] font-semibold",
                  ACCENT_CHIP[r.accent],
                )}
              >
                {r.initials}
              </span>
              <div>
                <p className="text-[13.5px] font-semibold text-ink">{r.name}</p>
                <p className="text-[12px] text-ink-faint">{r.context}</p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

/* ── Journal ─────────────────────────────────────────────── */

function JournalStrip() {
  return (
    <section className="bg-sand py-20">
      <div className="u-wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            eyebrow="Journal"
            title="Written by the clinic, not by a marketing agency"
          />
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

        <RevealGroup className="mt-12 grid gap-4 md:grid-cols-3">
          {ARTICLES.map((a) => (
            <RevealItem key={a.slug}>
              <Link
                href={`/journal/${a.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-line bg-white p-7
                           transition-all duration-300 hover:-translate-y-1 hover:border-brand/30"
              >
                <Pill tone={a.accent}>{a.category}</Pill>
                <h3 className="mt-5 font-sans text-[16.5px] font-semibold leading-snug tracking-normal text-ink">
                  {a.title}
                </h3>
                <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-ink-soft">
                  {a.excerpt}
                </p>
                <span className="u-tnum mt-6 text-[12px] text-ink-faint">{a.readMin} min read</span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ── Booking band ────────────────────────────────────────── */

function BookingBand() {
  return (
    <section className="u-wrap py-20">
      <RevealGroup className="grid gap-4 lg:grid-cols-2">
        <RevealItem className="relative overflow-hidden rounded-[32px] bg-brand p-10 text-white sm:p-14">
          <Logo size={120} tone="light" className="absolute -right-6 -top-6 opacity-10" />
          <Pill tone="light">New patient</Pill>
          <h2 className="mt-6 text-[clamp(26px,3.4vw,38px)] text-white">
            Book without picking up the phone
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/65">
            Pick what you need, a day and a time. Confirmation is immediate, and nothing we send
            you names the service.
          </p>
          <ButtonLink href="/book" tone="light" size="lg" className="mt-8">
            <CalendarCheck size={17} /> Start booking
          </ButtonLink>
        </RevealItem>

        <RevealItem className="rounded-[32px] border border-line bg-white p-10 sm:p-14">
          <Pill tone="mint"><Sparkles size={12} /> Returning</Pill>
          <h2 className="mt-6 text-[clamp(26px,3.4vw,38px)]">
            Everything from your last visit, waiting
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink-soft">
            Scans, blood results, prescriptions and your written plan — in one place, on any
            device, with discreet mode on by default.
          </p>
          <ButtonLink href="/portal" tone="outline" size="lg" className="mt-8">
            Open the patient portal
          </ButtonLink>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
