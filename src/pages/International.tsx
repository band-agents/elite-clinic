/**
 * Elite Passage — the international patients programme.
 *
 * The page answers, in order, the questions a man in Riyadh or Lagos actually
 * has: can you look at my reports before I spend money on a ticket, how long
 * will I be away, who meets me, where do I sleep, what does it cost, and what
 * happens after I go home.
 *
 * Deliberately not written as a travel brochure. The reason someone is
 * getting on a plane is a medical problem, and the copy stays on that.
 */

import { useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, Check, ChevronDown, MessageCircle, Send, ShieldCheck,
} from "lucide-react";

import { BRAND } from "@/lib/brand";
import {
  PASSAGE, PASSAGE_COUNTRIES, PASSAGE_FAQS, PASSAGE_INCLUDED,
  PASSAGE_STEPS, PASSAGE_TIERS,
} from "@/data/international";
import { soft, springy, stagger } from "@/lib/motion";
import { isEmail } from "@/lib/validate";
import {
  Button, ButtonLink, Field, Input, Pill, Reveal, RevealGroup, RevealItem,
  SectionHead, Select, Textarea, cx,
} from "@/components/ui";
import { Kicker, LiveDot, RuleDraw, SplitText, WordMarquee } from "@/components/editorial";
import { Logo } from "@/components/Logo";
import { Shot } from "@/components/Shot";

export function International() {
  return (
    <>
      <PassageHero />
      <Included />
      <Timeline />
      <Tiers />
      <Enquiry />
      <Faq />
    </>
  );
}

/* ── Hero ────────────────────────────────────────────────── */

function PassageHero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const fieldY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  return (
    <section
      ref={ref}
      className="u-grain relative flex min-h-[78svh] items-center overflow-hidden bg-brand-deep"
    >
      <motion.div
        className="u-hero-field absolute inset-0"
        style={{ y: reduced ? 0 : fieldY }}
        aria-hidden
      />
      <div className="u-scrim absolute inset-0" aria-hidden />

      <motion.div
        className="u-wrap relative z-10 py-28"
        initial="hidden"
        animate="show"
        variants={stagger(0.09, 0.12)}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
          transition={soft(0.7)}>
          <Pill tone="light">
            <LiveDot /> International patients
          </Pill>
        </motion.div>

        <SplitText
          text={PASSAGE.name}
          as="h1"
          delay={0.1}
          className="mt-7 max-w-3xl text-[clamp(44px,8vw,96px)] leading-[0.98] text-white"
        />

        <motion.p
          className="mt-5 font-display text-[clamp(20px,2.8vw,32px)] italic text-mint"
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          transition={soft(0.85)}
        >
          {PASSAGE.line}
        </motion.p>

        <motion.p
          className="mt-7 max-w-2xl text-[17px] leading-[1.8] text-white/70"
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          transition={soft(0.9)}
        >
          {PASSAGE.lead}
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap gap-3"
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          transition={soft(0.9)}
        >
          <ButtonLink href="#enquiry" tone="white" size="lg" external>
            <Send size={16} /> Send your reports
          </ButtonLink>
          <ButtonLink href={BRAND.whatsappHref} tone="light" size="lg" external>
            <MessageCircle size={16} /> WhatsApp the coordinator
          </ButtonLink>
        </motion.div>

        {/* Country marquee, in the hero rather than buried lower down: the
            first thing a foreign visitor wants is evidence that people like
            them already come here. */}
        <motion.div
          className="mt-16"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          transition={soft(1.1)}
        >
          <RuleDraw tone="bg-white/15" delay={0.6} />
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
            Patients travel here from
          </p>
          <WordMarquee
            words={PASSAGE_COUNTRIES}
            className="mt-3"
            itemClassName="font-display text-[clamp(20px,2.8vw,32px)] text-white/45"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── What is included ────────────────────────────────────── */

function Included() {
  return (
    <section className="u-aurora relative py-24">
      <div className="u-wrap relative z-10 grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div>
          <SectionHead
            eyebrow="What the programme covers"
            title="Everything except the medicine is our problem"
            lead="The clinical fees are quoted separately and in writing. Everything on this list is part of the programme itself."
          />

          <RevealGroup className="mt-10 grid gap-x-8 gap-y-3 sm:grid-cols-2" each={0.04}>
            {PASSAGE_INCLUDED.map((item) => (
              <RevealItem key={item} className="flex gap-3">
                <span className="mt-1 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-mint-wash text-mint">
                  <Check size={11} strokeWidth={3} />
                </span>
                <span className="text-[14.5px] leading-relaxed text-ink-soft">{item}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <Reveal delay={0.1}>
          <Shot
            label="Arrivals hall — clinic coordinator meeting a patient, discreet"
            ratio="4/5"
          />
          <div className="mt-4 rounded-3xl border border-line bg-white p-7">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-wash text-brand">
              <ShieldCheck size={19} />
            </span>
            <h3 className="mt-5 font-sans text-[16px] font-semibold tracking-normal text-ink">
              As private abroad as it is at home
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
              Transfers are unmarked. The hotel booking carries your name and nothing else. No
              message we send names a service or a diagnosis, and your coordinator is clinic
              staff — not an agency reselling your file.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Timeline ────────────────────────────────────────────── */

function Timeline() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.65"] });

  return (
    <section className="bg-sand py-24">
      <div className="u-wrap">
        <SectionHead
          eyebrow="The journey"
          title="Ten steps, from your first message to your first follow-up at home"
          lead="Nothing on this list is something you have to arrange yourself."
        />

        <div ref={ref} className="relative mt-14">
          <div className="absolute inset-y-0 left-[27px] hidden w-px bg-line md:block" aria-hidden>
            <motion.div
              className="h-full w-full origin-top bg-brand"
              style={{ scaleY: reduced ? 1 : scrollYProgress }}
            />
          </div>

          <RevealGroup className="space-y-3" each={0.06}>
            {PASSAGE_STEPS.map((s) => (
              <RevealItem key={s.n}>
                <div className="relative rounded-3xl border border-line bg-white p-6 md:pl-[78px]">
                  <span className="mb-4 grid h-[55px] w-[55px] shrink-0 place-items-center rounded-2xl
                                   bg-brand text-white md:absolute md:left-0 md:top-6 md:mb-0">
                    <s.icon size={21} />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-3">
                      <span className="u-tnum font-display text-[15px] text-brand/40">{s.n}</span>
                      <Pill tone="muted">{s.when}</Pill>
                    </div>
                    <h3 className="mt-2.5 font-display text-[21px] text-ink">{s.title}</h3>
                    <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-soft">{s.body}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

/* ── Tiers ───────────────────────────────────────────────── */

const TIER_ACCENT = {
  brand: "bg-brand-wash text-brand",
  mint: "bg-mint-wash text-mint",
  coral: "bg-coral-wash text-coral",
} as const;

function Tiers() {
  return (
    <section className="u-wrap py-24">
      <SectionHead
        eyebrow="Programmes"
        title="Three ways to do it"
        lead="Programme fees cover the travel and the arrangements. Medical fees are quoted separately, in writing, before you book anything."
        align="center"
      />

      <RevealGroup className="mt-14 grid gap-4 lg:grid-cols-3 lg:items-start" each={0.08}>
        {PASSAGE_TIERS.map((t) => (
          <RevealItem
            key={t.id}
            className={cx(
              "relative flex h-full flex-col rounded-[28px] border p-8",
              t.featured
                ? "border-brand bg-brand text-white shadow-[0_30px_70px_-50px] shadow-brand lg:-mt-6 lg:pb-12"
                : "border-line bg-white",
            )}
          >
            {t.featured && (
              <span className="absolute -top-3 left-8 rounded-full bg-mint px-4 py-1 text-[11px] font-semibold text-white">
                Most chosen
              </span>
            )}

            <div className="flex items-center justify-between gap-4">
              <h3 className={cx("font-display text-[28px]", t.featured ? "text-white" : "text-ink")}>
                {t.name}
              </h3>
              <span className={cx(
                "rounded-full px-3 py-1 text-[11.5px] font-semibold",
                t.featured ? "bg-white/15 text-white" : TIER_ACCENT[t.accent],
              )}>
                {t.nights}
              </span>
            </div>

            <p className={cx(
              "mt-3 text-[14px] leading-relaxed",
              t.featured ? "text-white/65" : "text-ink-soft",
            )}>
              {t.tagline}
            </p>

            <div className={cx(
              "mt-7 border-t pt-6",
              t.featured ? "border-white/15" : "border-line",
            )}>
              <p className={cx(
                "text-[11px] font-semibold uppercase tracking-[0.14em]",
                t.featured ? "text-white/45" : "text-ink-faint",
              )}>
                Programme fee from
              </p>
              <p className={cx(
                "u-tnum mt-1.5 font-display text-[40px] leading-none",
                t.featured ? "text-white" : "text-brand",
              )}>
                ${t.fromUsd.toLocaleString("en-US")}
              </p>
              <p className={cx(
                "mt-1.5 text-[12px]",
                t.featured ? "text-white/45" : "text-ink-faint",
              )}>
                Excludes medical fees. [PLACEHOLDER pricing.]
              </p>
            </div>

            <ul className="mt-7 flex flex-1 flex-col gap-2.5">
              {t.features.map((f) => (
                <li key={f} className="flex gap-3">
                  <span className={cx(
                    "mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full",
                    t.featured ? "bg-white/15 text-white" : "bg-mint-wash text-mint",
                  )}>
                    <Check size={10} strokeWidth={3} />
                  </span>
                  <span className={cx(
                    "text-[13.5px] leading-relaxed",
                    t.featured ? "text-white/80" : "text-ink-soft",
                  )}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <ButtonLink
              href="#enquiry"
              tone={t.featured ? "white" : "outline"}
              size="lg"
              className="mt-8 w-full"
              external
            >
              Enquire <ArrowRight size={15} />
            </ButtonLink>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

/* ── Enquiry ─────────────────────────────────────────────── */

type State = "idle" | "sending" | "sent";

function Enquiry() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [contact, setContact] = useState("");
  const [about, setAbout] = useState("");
  const [tier, setTier] = useState("complete");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [state, setState] = useState<State>("idle");

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string | undefined> = {};
    if (!name.trim()) next.name = "We need a name to reply to.";
    if (!country) next.country = "Where are you travelling from?";
    /* Accepts a phone or an email: an international enquiry may not have an
       Egyptian number, so the national phone rule cannot apply here. */
    if (!contact.trim()) next.contact = "A WhatsApp number or an email address.";
    else if (!isEmail(contact) && contact.replace(/\D/g, "").length < 7) {
      next.contact = "That does not look like a number or an email.";
    }
    if (about.trim().length < 10) next.about = "A sentence or two is enough.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setState("sending");
    window.setTimeout(() => setState("sent"), 800);
  }

  return (
    <section id="enquiry" className="u-grain relative overflow-hidden bg-brand py-24 text-white">
      <Logo size={520} tone="light" className="absolute -left-28 -bottom-32 opacity-[0.05]" />

      <div className="u-wrap relative z-10 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <Reveal>
          <Kicker tone="text-mint" rule="bg-mint/40" className="mb-7">Step one</Kicker>
          <h2 className="text-[clamp(30px,4.4vw,48px)] text-white">
            Send your reports before you spend anything
          </h2>
          <p className="mt-5 max-w-lg text-[16.5px] leading-[1.8] text-white/70">
            {BRAND.doctor} reads them himself. You get back what he thinks is going on, what the
            visit would involve, how many days it needs and what it costs — before a ticket is
            bought and before you commit to anything.
          </p>

          <ul className="mt-9 flex flex-col gap-3">
            {[
              "Reply within one working day",
              "Reviewed by the consultant, not by an agent",
              "A written quote, fixed before you travel",
              "No obligation, and nothing charged for the review",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-[14.5px] text-white/75">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/12 text-mint">
                  <Check size={11} strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          {state === "sent" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={soft(0.45)}
              className="rounded-[28px] bg-white p-10 text-center text-ink"
            >
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={springy}
                className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-mint text-white"
              >
                <Check size={26} strokeWidth={2.5} />
              </motion.span>
              <h3 className="mt-6 text-[26px]">Enquiry received</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                The international coordinator will reply within one working day. The reply comes
                from {BRAND.name} and does not mention what you asked about.
              </p>
              <ButtonLink href={BRAND.whatsappHref} className="mt-7" external>
                <MessageCircle size={16} /> Send your scans on WhatsApp
              </ButtonLink>
              <Pill tone="muted" className="mt-6">Demo form — nothing was sent</Pill>
            </motion.div>
          ) : (
            <form
              onSubmit={submit}
              noValidate
              className="rounded-[28px] bg-white p-8 text-ink sm:p-10"
            >
              <h3 className="text-[24px]">International enquiry</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                You do not have to say what it is about in detail. Tell us as much as you want to.
              </p>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <Field label="Your name" required error={errors.name}>
                  <Input
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
                    autoComplete="name"
                  />
                </Field>

                <Field label="Travelling from" required error={errors.country}>
                  <Select
                    value={country}
                    onChange={(e) => { setCountry(e.target.value); setErrors((p) => ({ ...p, country: undefined })); }}
                  >
                    <option value="">Select a country</option>
                    {PASSAGE_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    <option value="other">Somewhere else</option>
                  </Select>
                </Field>

                <Field
                  label="WhatsApp or email"
                  required
                  error={errors.contact}
                  className="sm:col-span-2"
                  hint="Whichever you prefer to be reached on."
                >
                  <Input
                    value={contact}
                    onChange={(e) => { setContact(e.target.value); setErrors((p) => ({ ...p, contact: undefined })); }}
                    placeholder="+966 5x xxx xxxx  ·  or  you@example.com"
                  />
                </Field>

                <Field label="Programme" className="sm:col-span-2">
                  <Select value={tier} onChange={(e) => setTier(e.target.value)}>
                    {PASSAGE_TIERS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} — {t.nights}, from ${t.fromUsd.toLocaleString("en-US")}
                      </option>
                    ))}
                    <option value="unsure">Not sure yet</option>
                  </Select>
                </Field>

                <Field
                  label="What brings you"
                  required
                  error={errors.about}
                  className="sm:col-span-2"
                  hint="Reports and scans can follow on WhatsApp — nothing is uploaded here."
                >
                  <Textarea
                    value={about}
                    onChange={(e) => { setAbout(e.target.value); setErrors((p) => ({ ...p, about: undefined })); }}
                    rows={4}
                    placeholder="A sentence is enough. Include rough dates if you have them."
                  />
                </Field>
              </div>

              <Button type="submit" size="lg" className="mt-7 w-full" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : <>Send enquiry <ArrowRight size={16} /></>}
              </Button>

              <p className="mt-4 text-center text-[12px] leading-relaxed text-ink-faint">
                Read only by the clinic&apos;s international coordinator and {BRAND.doctor}.
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ── FAQ ─────────────────────────────────────────────────── */

function Faq() {
  return (
    <section className="u-wrap-narrow py-24">
      <SectionHead eyebrow="Before you travel" title="Questions we are asked most" />
      <div className="mt-10 divide-y divide-line border-y border-line">
        {PASSAGE_FAQS.map((f) => <FaqRow key={f.q} q={f.q} a={f.a} />)}
      </div>

      <Reveal className="mt-12 rounded-3xl border border-line bg-white p-8 text-center">
        <p className="text-[15px] leading-relaxed text-ink-soft">
          Anything not answered here, ask the coordinator directly. There is no script and no
          call centre — it is clinic staff on the other end.
        </p>
        <ButtonLink href={BRAND.whatsappHref} className="mt-6" external>
          <MessageCircle size={16} /> WhatsApp the coordinator
        </ButtonLink>
      </Reveal>
    </section>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
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
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={soft(0.32)}
        className="overflow-hidden"
      >
        <p className="pb-6 pr-10 text-[14.5px] leading-[1.8] text-ink-soft">{a}</p>
      </motion.div>
    </Reveal>
  );
}
