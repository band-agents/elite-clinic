/**
 * Landing page.
 *
 * Order, and why:
 *   hero → what we treat → why here → the visit → proof → the consultant
 *   → travelling to us → what men say → journal → book or sign in
 *
 * What we treat comes second, immediately under the hero. Almost everyone who
 * lands is asking one question — is this for my problem? — and the page used
 * to make them scroll past three bands of positioning before answering it.
 *
 * The international programme is a single band near the end rather than a
 * section competing with the clinical work. It matters to a minority of
 * visitors and it reads as a service, not as the headline.
 *
 * Every band goes through <Section>, which owns the gutters and the vertical
 * rhythm. Backgrounds run full width, content never does.
 *
 * Two builds come out of this file. VITE_HERO_PHOTO=1 gives the hero with the
 * consultant's portrait; without it the hero is typographic. Nothing else
 * differs between them.
 */

import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight, CalendarCheck, ChevronRight, Globe2, MessageCircle,
  Quote, ShieldCheck, Stethoscope, UserRound,
} from "lucide-react";

import { BRAND } from "@/lib/brand";
import { ARTICLES, JOURNEY, PROMISES, REVIEWS, STATS } from "@/data/clinic";
import { PASSAGE } from "@/data/international";
import { springy } from "@/lib/motion";
import {
  ButtonLink, Pill, Reveal, RevealGroup, RevealItem, Stars, cx,
} from "@/components/ui";
import { Section } from "@/components/Section";
import {
  CountUp, IndexNum, Kicker, LiveDot, RuleDraw, SplitText,
} from "@/components/editorial";
import { ServiceExplorer } from "@/components/ServiceExplorer";
import { Portrait } from "@/components/Portrait";
import { Logo } from "@/components/Logo";

/** Set at build time. Two deploys, one source. */
const WITH_PHOTO = import.meta.env.VITE_HERO_PHOTO === "1";

const TREATS = ["Erectile function", "Male fertility", "Testosterone", "Prostate & urology"];

export function Home() {
  return (
    <>
      <Hero />
      <QuickStrip />
      <ServiceExplorer />
      <Promises />
      <Journey />
      <Numbers />
      <Consultant />
      <Passage />
      <Voices />
      <JournalStrip />
      <TwoDoors />
    </>
  );
}

/* ── Hero ────────────────────────────────────────────────── */

function HeroCopy() {
  return (
    <>
      <Reveal>
        <Pill tone="light">
          <LiveDot className="bg-gold" />
          By appointment only · Sheikh Zayed
        </Pill>
      </Reveal>

      <SplitText
        text="Men's health, handled privately."
        as="h1"
        delay={0.12}
        className="mt-7 max-w-[13ch] text-[clamp(44px,8vw,96px)] leading-[0.95] text-white"
      />

      <Reveal delay={0.28}>
        <div className="mt-8 flex max-w-xl items-start gap-5">
          <RuleDraw tone="bg-gold/50" className="mt-3 w-12 shrink-0" delay={0.4} />
          <p className="text-[17px] leading-[1.8] text-white/75">
            Men do not delay care because of the medicine. They delay it because of the waiting
            room &mdash; so there isn&apos;t one. A private entrance, one patient in the clinic at
            a time, and forty unhurried minutes.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.36}>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <ButtonLink href="/book" tone="white" size="lg">
            <CalendarCheck size={18} /> Book an appointment
          </ButtonLink>
          <ButtonLink href={BRAND.whatsappHref} tone="light" size="lg" external>
            <MessageCircle size={17} /> Ask privately
          </ButtonLink>
        </div>
      </Reveal>

      <Reveal delay={0.44}>
        <ul className="mt-9 flex flex-wrap gap-x-5 gap-y-2">
          {TREATS.map((t) => (
            <li key={t} className="flex items-center gap-2 text-[13.5px] text-white/60">
              <span className="h-1 w-1 rounded-full bg-gold" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </Reveal>
    </>
  );
}

function Hero() {
  return (
    <section className="u-grain relative overflow-hidden bg-brand-deep">
      <div className="u-hero-field absolute inset-0" aria-hidden />
      <div className="u-scrim absolute inset-0" aria-hidden />

      <div className="u-wrap relative z-10">
        {WITH_PHOTO ? (
          /* The portrait carries a real alpha channel, so it sits straight on
             the navy — no panel the colour of its own background, no cutting.
             It is bottom-aligned and the column loses its padding at lg so he
             meets the edge of the band rather than floating above it. */
          <div className="grid items-end gap-8 pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pt-36">
            <div className="pb-14 lg:pb-24">
              <HeroCopy />
            </div>
            <Reveal
              delay={0.2}
              className="mx-auto w-full max-w-[360px] self-end lg:mx-0 lg:ml-auto lg:max-w-[440px]"
            >
              <Portrait />
            </Reveal>
          </div>
        ) : (
          <div className="py-28 lg:py-36">
            <div className="max-w-3xl">
              <HeroCopy />
            </div>

            {/* The promise, in gold type rather than a colour block. A field of
                accent that size read as decoration; a sentence reads as a
                claim. */}
            <Reveal delay={0.5}>
              <div className="mt-16 border-t border-white/12 pt-10">
                <p className="max-w-3xl font-display text-[clamp(24px,3.4vw,42px)] leading-[1.18] text-gold">
                  No waiting room. No shared corridor. No one asking what you are here for.
                </p>
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Quick strip ─────────────────────────────────────────── */

const QUICK = [
  { icon: CalendarCheck, title: "Book a visit", text: "Six services, real slots.", href: "/book" },
  { icon: Stethoscope, title: "What we treat", text: "Andrology to hormonal health.", href: "/services" },
  { icon: UserRound, title: "Your consultant", text: "The same doctor, every visit.", href: "/doctor" },
  { icon: ShieldCheck, title: "Patient portal", text: "Results, scans, prescriptions.", href: "/portal" },
];

function QuickStrip() {
  return (
    <Section tone="white" innerClassName="py-0">
      <RevealGroup
        className="grid divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4"
        each={0.06}
      >
        {QUICK.map(({ icon: Icon, title, text, href }, i) => (
          <RevealItem key={title}>
            <Link href={href} asChild>
              <motion.a
                className={cx(
                  "group flex h-full items-start gap-4 py-7 transition-colors lg:px-8",
                  i === 0 && "lg:pl-0",
                  i === QUICK.length - 1 && "lg:pr-0",
                  i > 0 && "lg:border-l lg:border-line",
                )}
                whileHover={{ y: -2 }}
                transition={springy}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center bg-brand-wash text-brand
                                 transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                  <Icon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold text-ink">{title}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-ink-soft">{text}</span>
                </span>
                <ChevronRight
                  size={16}
                  className="ml-auto mt-2.5 shrink-0 text-ink-faint transition-transform duration-300
                             group-hover:translate-x-1 group-hover:text-brand"
                />
              </motion.a>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/* ── Promises ────────────────────────────────────────────── */

function Promises() {
  return (
    <Section tone="sand">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <Kicker>Why here</Kicker>
          <h2 className="mt-6 text-[clamp(30px,4.2vw,48px)]">Four decisions, not four slogans</h2>
          <p className="mt-5 max-w-sm text-[16px] leading-[1.8] text-ink-soft">
            Each one costs us slots or money. That is what makes them true rather than marketing.
          </p>
        </Reveal>

        <RevealGroup className="grid gap-px bg-line sm:grid-cols-2">
          {PROMISES.map((p, i) => (
            <RevealItem
              key={p.title}
              className="group relative bg-sand p-8 transition-colors duration-300 hover:bg-white"
            >
              <IndexNum n={i + 1} className="absolute right-6 top-5 text-[44px]" />
              <p.icon size={22} className="text-brand" />
              <h3 className="mt-6 font-display text-[22px] text-ink">{p.title}</h3>
              <p className="mt-2.5 max-w-xs text-[14px] leading-relaxed text-ink-soft">{p.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

/* ── Journey ─────────────────────────────────────────────── */

function Journey() {
  return (
    <Section tone="surface">
      <Reveal className="max-w-2xl">
        <Kicker>The visit</Kicker>
        <h2 className="mt-6 text-[clamp(30px,4.2vw,48px)]">A visit, start to finish</h2>
        <p className="mt-5 text-[16.5px] leading-[1.8] text-ink-soft">
          Published because knowing exactly what happens next is most of what makes a first visit
          bearable.
        </p>
      </Reveal>

      <RevealGroup className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4" each={0.1}>
        {JOURNEY.map((j) => (
          <RevealItem key={j.n}>
            <RuleDraw tone="bg-brand/25" />
            <div className="pt-6">
              <span className="u-tnum font-display text-[15px] tracking-[0.1em] text-brand">{j.n}</span>
              <h3 className="mt-4 font-display text-[23px] leading-tight text-ink">{j.title}</h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">{j.body}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/* ── Numbers ─────────────────────────────────────────────── */

function Numbers() {
  return (
    <Section tone="navy">
      <Logo
        size={460}
        tone="light"
        className="absolute -right-24 top-1/2 -translate-y-1/2 opacity-[0.04]"
      />
      <Reveal className="max-w-xl">
        <Kicker tone="text-gold" rule="bg-gold/40">By the numbers</Kicker>
        <h2 className="mt-6 text-[clamp(28px,3.8vw,44px)] text-white">Measured, not estimated</h2>
      </Reveal>

      <RevealGroup className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4" each={0.08}>
        {STATS.map((s) => (
          <RevealItem key={s.label}>
            <RuleDraw tone="bg-white/20" />
            <div className="pt-6">
              <div className="font-display text-[clamp(38px,5vw,58px)] leading-none text-white">
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-4 text-[14.5px] font-medium text-white/85">{s.label}</div>
              <div className="mt-1 text-[13px] text-white/45">{s.note}</div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/* ── Consultant ──────────────────────────────────────────── */

function Consultant() {
  return (
    <Section tone="white">
      <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div>
          <Reveal><Kicker>Your consultant</Kicker></Reveal>
          <SplitText
            text="You will know who you're seeing"
            as="h2"
            className="mt-6 max-w-[14ch] text-[clamp(30px,4.2vw,52px)]"
          />
          <Reveal delay={0.1}>
            <div className="mt-8 flex max-w-xl items-start gap-5">
              <RuleDraw tone="bg-brand/30" className="mt-3 w-12 shrink-0" />
              <p className="text-[16.5px] leading-[1.85] text-ink-soft">
                Follow-ups stay with the man who saw you first. Your file has one reader, your plan
                has one author, and you never repeat your history to a stranger.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap gap-2.5">
              {["Andrology", "Male fertility", "Hormonal health", "General urology"].map((t) => (
                <Pill key={t} tone="muted">{t}</Pill>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/doctor" tone="outline">About {BRAND.doctor}</ButtonLink>
              <ButtonLink href="/book"><CalendarCheck size={16} /> Book with him</ButtonLink>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div className="bg-brand p-9 text-white sm:p-10">
            <Kicker tone="text-gold" rule="bg-gold/40">The record</Kicker>
            <p className="mt-6 font-display text-[clamp(26px,3.2vw,36px)] leading-[1.1]">
              {BRAND.doctor}
            </p>
            <p className="mt-2 text-[14px] text-white/55">
              Consultant andrologist &amp; urological surgeon
            </p>
            <ul className="mt-8 flex flex-col divide-y divide-white/12 border-t border-white/12">
              {[
                ["~20", "years in men's health"],
                ["10,000+", "implant procedures"],
                ["1", "consultant, start to finish"],
              ].map(([n, l]) => (
                <li key={l} className="flex items-baseline gap-4 py-4">
                  <span className="u-tnum font-display text-[26px] leading-none text-gold">{n}</span>
                  <span className="text-[14px] text-white/70">{l}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[12px] leading-relaxed text-white/40">
              Figures supplied by the clinic and not independently verified.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ── Elite Passage ───────────────────────────────────────── */

/**
 * One band, not a section competing with the clinical work. It says what the
 * programme is, proves it with four concrete things, and links out.
 */
function Passage() {
  return (
    <Section tone="navyDeep">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <Reveal>
          <Kicker tone="text-gold" rule="bg-gold/40">
            <span className="inline-flex items-center gap-2">
              <Globe2 size={12} /> Coming from abroad
            </span>
          </Kicker>
          <h2 className="mt-7 text-[clamp(30px,4.4vw,52px)] leading-[1.02] text-white">
            {PASSAGE.name}
          </h2>
          <p className="mt-5 max-w-lg text-[16px] leading-[1.8] text-white/65">
            Men fly in from across the Gulf, Africa and Europe. We handle the visa letter, the
            flights, the airport, the hotel and the car &mdash; and compress the clinical work into
            consecutive days, so the trip is as short as the medicine allows.
          </p>
          <div className="mt-9">
            <ButtonLink href="/international" tone="white">
              See the programme <ArrowRight size={16} />
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="grid gap-px bg-white/10 sm:grid-cols-2">
            {[
              { n: "01", t: "Reviewed before you fly", s: "Send your scans; get a plan and a fixed quote." },
              { n: "02", t: "Visa letter & flights", s: "Issued and booked around the treatment dates." },
              { n: "03", t: "Met at arrivals", s: "Cairo International, then a car for every visit." },
              { n: "04", t: "Days, not weeks", s: "Everything scheduled back to back." },
            ].map((c) => (
              <li key={c.n} className="bg-brand-deep p-7">
                <span className="u-tnum text-[11px] font-semibold tracking-[0.2em] text-gold">{c.n}</span>
                <p className="mt-4 font-display text-[19px] text-white">{c.t}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/55">{c.s}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

/* ── Voices ──────────────────────────────────────────────── */

function Voices() {
  return (
    <Section tone="sand">
      <Reveal className="max-w-2xl">
        <Kicker>In their words</Kicker>
        <h2 className="mt-6 text-[clamp(30px,4.2vw,48px)]">What men say afterwards</h2>
        <p className="mt-5 text-[16.5px] leading-[1.8] text-ink-soft">
          Published only from patients with a completed visit. Initials unless someone asks
          otherwise.
        </p>
      </Reveal>

      <RevealGroup className="mt-14 grid gap-px bg-line md:grid-cols-3">
        {REVIEWS.map((r) => (
          <RevealItem key={r.id} className="flex flex-col bg-sand p-8">
            <Quote size={22} className="text-brand/25" />
            <p className="mt-5 flex-1 font-display text-[19px] leading-[1.55] text-ink">{r.body}</p>
            <div className="mt-7 flex items-center gap-3 border-t border-line pt-5">
              <span className={cx(
                "grid h-10 w-10 place-items-center text-[12px] font-semibold",
                r.accent === "brand" ? "bg-brand-wash text-brand"
                  : r.accent === "gold" ? "bg-gold-wash text-gold-deep" : "bg-coral-wash text-coral",
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
    </Section>
  );
}

/* ── Journal ─────────────────────────────────────────────── */

function JournalStrip() {
  return (
    <Section tone="surface">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <Kicker>Journal</Kicker>
          <h2 className="mt-6 max-w-[16ch] text-[clamp(30px,4.2vw,48px)]">
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
    </Section>
  );
}

/* ── Two doors ───────────────────────────────────────────── */

function TwoDoors() {
  return (
    <Section tone="surface" innerClassName="pt-0 pb-20 sm:pb-24">
      <RevealGroup className="grid gap-px bg-line lg:grid-cols-2">
        <RevealItem className="u-grain relative overflow-hidden bg-brand p-10 text-white sm:p-12">
          <Logo size={150} tone="light" className="absolute -right-10 -top-10 opacity-[0.08]" />
          <Kicker tone="text-gold" rule="bg-gold/40">New patient</Kicker>
          <h2 className="mt-7 max-w-[14ch] text-[clamp(26px,3.2vw,38px)] text-white">
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

        <RevealItem className="bg-white p-10 sm:p-12">
          <Kicker>Returning</Kicker>
          <h2 className="mt-7 max-w-[14ch] text-[clamp(26px,3.2vw,38px)]">
            Everything from your last visit, waiting
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-soft">
            Scans, blood results, prescriptions and your written plan &mdash; in one place, on any
            device, with discreet mode on by default.
          </p>
          <ButtonLink href="/portal" tone="outline" size="lg" className="mt-9">
            Open the patient portal
          </ButtonLink>
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}
