/**
 * Appointment booking.
 *
 * Four steps rather than one long form, because the questions genuinely
 * depend on each other: which consultants exist depends on the service, and
 * which slots exist depends on the consultant and the day.
 *
 * Decisions worth keeping:
 *
 *  - **You can always go back, and nothing is lost.** State lives in one
 *    object at the top; steps only read and write it. Going back to change a
 *    service keeps your name and phone number.
 *
 *  - **Validation is per-step and on submit, never on keystroke.** Being told
 *    your number is invalid while you are typing the third digit is the most
 *    disliked pattern in form design. Errors clear as soon as the field
 *    changes, so a correction feels immediate.
 *
 *  - **No `AnimatePresence mode="wait"`.** On the Al-Madinah build it held
 *    the next step until the previous one's exit finished, so an interrupted
 *    tween froze the form with nothing on screen. Steps cross-fade instead.
 *
 *  - **The step can be deep-linked.** `/book?service=andrology` from a
 *    service page lands on step 2 with the choice already made.
 *
 *  - **Slots are generated deterministically from the date**, so the same day
 *    always offers the same grid. A random grid that reshuffles on re-render
 *    makes a form feel broken.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSearch } from "wouter";
import {
  ArrowLeft, ArrowRight, CalendarCheck, Check, Clock, Loader2, MapPin,
  MessageCircle, ShieldCheck, Sparkles, Wallet,
} from "lucide-react";

import { BRAND } from "@/lib/brand";
import {
  DOCTORS, SERVICES, VISIT_TYPES, doctorById, doctorsForService, serviceById, visitTypeById,
} from "@/data/clinic";
import { soft, springy } from "@/lib/motion";
import { formatDayLong, isEgyptianMobile, isEmail, localISO } from "@/lib/validate";
import {
  Avatar, Button, ButtonLink, ChoiceCard, Field, Input, Pill, Select, Textarea, cx,
} from "@/components/ui";
import { Logo } from "@/components/Logo";

/* ── Model ───────────────────────────────────────────────── */

interface Draft {
  visitTypeId: string;
  serviceId: string;
  doctorId: string;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  visitCount: "first" | "returning";
  referral: string;
  notes: string;
  discreet: boolean;
}

const EMPTY: Draft = {
  visitTypeId: "", serviceId: "", doctorId: "", date: "", time: "",
  firstName: "", lastName: "", phone: "", email: "",
  visitCount: "first", referral: "", notes: "", discreet: true,
};

type Errors = Partial<Record<keyof Draft, string>>;

const STEPS = [
  { n: 1, label: "What you need" },
  { n: 2, label: "Consultant" },
  { n: 3, label: "Date & time" },
  { n: 4, label: "Your details" },
] as const;

/* ── Slot generation ─────────────────────────────────────── */

/** Clinic runs 11:00–20:30 on the half hour. */
const ALL_SLOTS = Array.from({ length: 20 }, (_, i) => {
  const minutes = 11 * 60 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});

/**
 * Which slots are taken, derived from the date and doctor so the grid is
 * stable across renders. A real deployment replaces this with a read from
 * the clinic's scheduler; the shape stays the same.
 */
function bookedSlots(dateISO: string, doctorId: string): Set<string> {
  let seed = 0;
  for (const ch of dateISO + doctorId) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const taken = new Set<string>();
  for (const slot of ALL_SLOTS) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    if (seed % 100 < 45) taken.add(slot);
  }
  return taken;
}

/** The next 14 selectable days, skipping Friday (the clinic's closed day). */
function upcomingDays(count = 14) {
  const out: Array<{ iso: string; weekday: string; day: string; month: string }> = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1); // earliest is tomorrow
  while (out.length < count) {
    if (cursor.getDay() !== 5) {
      out.push({
        iso: localISO(cursor),
        weekday: cursor.toLocaleDateString("en-GB", { weekday: "short" }),
        day: String(cursor.getDate()),
        month: cursor.toLocaleDateString("en-GB", { month: "short" }),
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

/* ── Page ────────────────────────────────────────────────── */

export function Book() {
  const search = useSearch();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  /* Deep link: /book?service=andrology lands on the consultant step with the
     service already chosen. Runs once — a later state change must not reset
     the form under the patient. */
  useEffect(() => {
    const params = new URLSearchParams(search);
    const serviceId = params.get("service");
    if (serviceId && serviceById(serviceId)) {
      setDraft((d) => ({ ...d, visitTypeId: "consultation", serviceId }));
      setStep(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const visitType = visitTypeById(draft.visitTypeId);
  const needsService = visitType?.needsService ?? false;
  const service = serviceById(draft.serviceId);
  const doctor = doctorById(draft.doctorId);

  const availableDoctors = useMemo(
    () => (needsService && draft.serviceId ? doctorsForService(draft.serviceId) : DOCTORS),
    [needsService, draft.serviceId],
  );

  const days = useMemo(() => upcomingDays(14), []);
  const taken = useMemo(
    () => (draft.date ? bookedSlots(draft.date, draft.doctorId || "any") : new Set<string>()),
    [draft.date, draft.doctorId],
  );

  function validate(which: number): boolean {
    const next: Errors = {};
    if (which === 1) {
      if (!draft.visitTypeId) next.visitTypeId = "Pick what you need.";
      else if (needsService && !draft.serviceId) next.serviceId = "Pick a service.";
    }
    if (which === 2 && !draft.doctorId) next.doctorId = "Pick a consultant, or choose first available.";
    if (which === 3) {
      if (!draft.date) next.date = "Pick a day.";
      else if (!draft.time) next.time = "Pick a time.";
    }
    if (which === 4) {
      if (!draft.firstName.trim()) next.firstName = "Required.";
      if (!draft.lastName.trim()) next.lastName = "Required.";
      if (!isEgyptianMobile(draft.phone)) next.phone = "Enter a mobile number, e.g. 01012345678.";
      if (draft.email.trim() && !isEmail(draft.email)) next.email = "That address looks incomplete.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validate(step)) return;
    setStep((s) => Math.min(4, s + 1));
    topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
    topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function submit() {
    if (!validate(4)) return;
    setSubmitting(true);
    /* No backend yet. A real deployment posts the draft here and gets the
       reference back; nothing above this line changes. */
    window.setTimeout(() => {
      const n = Math.floor(100000 + Math.random() * 899999);
      setReference(`EC-${n}`);
      setSubmitting(false);
    }, 900);
  }

  if (reference) {
    return <Confirmation draft={draft} reference={reference} />;
  }

  return (
    <div className="u-aurora relative">
      <div className="u-wrap relative z-10 py-12 lg:py-16" ref={topRef}>
        <div className="max-w-2xl">
          <p className="u-eyebrow mb-3">Booking</p>
          <h1 className="text-[clamp(32px,5vw,54px)]">Four questions, about a minute</h1>
          <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
            Nothing is confirmed until the last step, and you can go back at any point without
            losing what you have entered.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
          <div>
            <Stepper current={step} />

            {/* Steps cross-fade. There is no `mode="wait"`: an interrupted
                exit must never leave the form empty. */}
            <div className="relative mt-8">
              <AnimatePresence initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, position: "absolute", inset: 0 }}
                  transition={soft(0.35)}
                  className="w-full"
                >
                  {step === 1 && (
                    <StepVisit
                      draft={draft} set={set} errors={errors} needsService={needsService}
                    />
                  )}
                  {step === 2 && (
                    <StepDoctor draft={draft} set={set} errors={errors} doctors={availableDoctors} />
                  )}
                  {step === 3 && (
                    <StepWhen
                      draft={draft} set={set} errors={errors} days={days} taken={taken}
                    />
                  )}
                  {step === 4 && <StepDetails draft={draft} set={set} errors={errors} />}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-10 flex items-center gap-3">
              {step > 1 && (
                <Button type="button" tone="ghost" onClick={goBack}>
                  <ArrowLeft size={15} /> Back
                </Button>
              )}
              <div className="ml-auto">
                {step < 4 ? (
                  <Button type="button" size="lg" onClick={goNext}>
                    Continue <ArrowRight size={16} />
                  </Button>
                ) : (
                  <Button type="button" size="lg" onClick={submit} disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Confirming…
                      </>
                    ) : (
                      <>
                        <CalendarCheck size={16} /> Confirm appointment
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Summary
            draft={draft}
            visitLabel={visitType?.label}
            serviceName={service?.name}
            servicePrice={service?.priceEgp}
            doctorName={doctor?.name}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Stepper ─────────────────────────────────────────────── */

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Booking progress">
      {STEPS.map((s) => {
        const done = current > s.n;
        const active = current === s.n;
        return (
          <li key={s.n} className="flex flex-1 items-center gap-2">
            <span
              className={cx(
                "grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12.5px] font-semibold transition-colors",
                done && "bg-mint text-white",
                active && "bg-brand text-white",
                !done && !active && "bg-white text-ink-faint border border-line",
              )}
            >
              {done ? <Check size={14} strokeWidth={3} /> : s.n}
            </span>
            <span
              className={cx(
                "hidden text-[12.5px] font-semibold sm:block",
                active ? "text-brand" : "text-ink-faint",
              )}
            >
              {s.label}
            </span>
            {s.n < STEPS.length && (
              <span className={cx("h-px flex-1", done ? "bg-mint" : "bg-line")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ── Step 1 — what you need ──────────────────────────────── */

type SetFn = <K extends keyof Draft>(key: K, value: Draft[K]) => void;

function StepVisit({
  draft, set, errors, needsService,
}: {
  draft: Draft; set: SetFn; errors: Errors; needsService: boolean;
}) {
  return (
    <div>
      <h2 className="text-[24px]">What do you need?</h2>
      <div role="radiogroup" className="mt-5 grid gap-3 sm:grid-cols-2">
        {VISIT_TYPES.map((v) => (
          <ChoiceCard
            key={v.id}
            selected={draft.visitTypeId === v.id}
            onSelect={() => {
              set("visitTypeId", v.id);
              if (!v.needsService) set("serviceId", "");
            }}
          >
            <span className="flex items-start gap-3.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-wash text-brand">
                <v.icon size={18} />
              </span>
              <span className="min-w-0 pr-6">
                <span className="block text-[15px] font-semibold text-ink">{v.label}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-ink-soft">{v.hint}</span>
              </span>
            </span>
          </ChoiceCard>
        ))}
      </div>
      {errors.visitTypeId && (
        <p className="mt-3 text-[13px] font-medium text-coral" role="alert">{errors.visitTypeId}</p>
      )}

      {/* The service picker appears only when the visit type needs one. A
          follow-up or a lab visit does not, and asking anyway is how booking
          forms get abandoned. */}
      {needsService && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={soft(0.35)}
          className="mt-10"
        >
          <h2 className="text-[24px]">Which area?</h2>
          <p className="mt-2 text-[14px] text-ink-soft">
            Not sure? Pick the consultation — Dr. Osama will place you correctly.
          </p>
          <div role="radiogroup" className="mt-5 grid gap-3 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <ChoiceCard
                key={s.id}
                selected={draft.serviceId === s.id}
                onSelect={() => set("serviceId", s.id)}
              >
                <span className="flex items-start gap-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sand text-brand">
                    <s.icon size={18} />
                  </span>
                  <span className="min-w-0 pr-6">
                    <span className="block text-[15px] font-semibold text-ink">{s.name}</span>
                    <span className="u-tnum mt-0.5 block text-[12.5px] text-ink-faint">
                      {s.durationMin} min · {s.priceEgp.toLocaleString("en-EG")} EGP
                    </span>
                  </span>
                </span>
              </ChoiceCard>
            ))}
          </div>
          {errors.serviceId && (
            <p className="mt-3 text-[13px] font-medium text-coral" role="alert">{errors.serviceId}</p>
          )}
        </motion.div>
      )}
    </div>
  );
}

/* ── Step 2 — consultant ─────────────────────────────────── */

function StepDoctor({
  draft, set, errors, doctors,
}: {
  draft: Draft; set: SetFn; errors: Errors; doctors: typeof DOCTORS;
}) {
  return (
    <div>
      <h2 className="text-[24px]">Who would you like to see?</h2>
      <p className="mt-2 text-[14px] text-ink-soft">
        Follow-ups stay with the same consultant unless you ask otherwise.
      </p>

      <div role="radiogroup" className="mt-5 flex flex-col gap-3">
        <ChoiceCard
          selected={draft.doctorId === "any"}
          onSelect={() => set("doctorId", "any")}
        >
          <span className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mint-wash text-mint">
              <Sparkles size={19} />
            </span>
            <span className="pr-6">
              <span className="block text-[15px] font-semibold text-ink">First available</span>
              <span className="mt-0.5 block text-[13px] text-ink-soft">
                Usually the soonest slot — often the same week.
              </span>
            </span>
          </span>
        </ChoiceCard>

        {doctors.map((d) => (
          <ChoiceCard
            key={d.id}
            selected={draft.doctorId === d.id}
            onSelect={() => set("doctorId", d.id)}
          >
            <span className="flex items-center gap-4">
              <Avatar initials={d.initials} accent={d.accent} size={48} />
              <span className="min-w-0 pr-6">
                <span className="block text-[15px] font-semibold text-ink">{d.name}</span>
                <span className="block text-[13px] text-ink-soft">{d.title}</span>
                <span className="mt-1.5 flex flex-wrap gap-1">
                  {d.days.map((day) => (
                    <span
                      key={day}
                      className="rounded-md bg-brand-wash px-1.5 py-0.5 text-[10.5px] font-semibold text-brand"
                    >
                      {day}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          </ChoiceCard>
        ))}
      </div>
      {errors.doctorId && (
        <p className="mt-3 text-[13px] font-medium text-coral" role="alert">{errors.doctorId}</p>
      )}
    </div>
  );
}

/* ── Step 3 — when ───────────────────────────────────────── */

function StepWhen({
  draft, set, errors, days, taken,
}: {
  draft: Draft; set: SetFn; errors: Errors;
  days: ReturnType<typeof upcomingDays>; taken: Set<string>;
}) {
  const reduced = useReducedMotion();
  return (
    <div>
      <h2 className="text-[24px]">Pick a day</h2>
      <p className="mt-2 text-[14px] text-ink-soft">The clinic is closed on Fridays.</p>

      <div
        role="radiogroup"
        className="mt-5 flex gap-2.5 overflow-x-auto pb-2 [scrollbar-width:thin]"
      >
        {days.map((d) => {
          const selected = draft.date === d.iso;
          return (
            <button
              key={d.iso}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => { set("date", d.iso); set("time", ""); }}
              className={cx(
                "flex w-[68px] shrink-0 flex-col items-center gap-0.5 rounded-2xl border px-2 py-3 transition-colors",
                selected
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-white text-ink hover:border-brand/40",
              )}
            >
              <span className={cx("text-[11px] font-semibold uppercase tracking-wide",
                selected ? "text-white/60" : "text-ink-faint")}>
                {d.weekday}
              </span>
              <span className="u-tnum font-display text-[22px] leading-none">{d.day}</span>
              <span className={cx("text-[10.5px]", selected ? "text-white/60" : "text-ink-faint")}>
                {d.month}
              </span>
            </button>
          );
        })}
      </div>
      {errors.date && (
        <p className="mt-3 text-[13px] font-medium text-coral" role="alert">{errors.date}</p>
      )}

      {draft.date && (
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={soft(0.35)}
          className="mt-9"
        >
          <h2 className="text-[24px]">Pick a time</h2>
          <p className="mt-2 flex items-center gap-2 text-[14px] text-ink-soft">
            <Clock size={14} className="text-ink-faint" />
            {formatDayLong(draft.date)} · greyed slots are taken
          </p>

          <div
            role="radiogroup"
            className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5"
          >
            {ALL_SLOTS.map((slot) => {
              const isTaken = taken.has(slot);
              const selected = draft.time === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={isTaken}
                  onClick={() => set("time", slot)}
                  className={cx(
                    "u-tnum rounded-xl border py-2.5 text-[14px] font-semibold transition-colors",
                    isTaken && "cursor-not-allowed border-line bg-surface text-ink-faint/50 line-through",
                    !isTaken && selected && "border-brand bg-brand text-white",
                    !isTaken && !selected && "border-line bg-white text-ink hover:border-brand/40",
                  )}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          {errors.time && (
            <p className="mt-3 text-[13px] font-medium text-coral" role="alert">{errors.time}</p>
          )}
        </motion.div>
      )}
    </div>
  );
}

/* ── Step 4 — details ────────────────────────────────────── */

function StepDetails({ draft, set, errors }: { draft: Draft; set: SetFn; errors: Errors }) {
  return (
    <div>
      <h2 className="text-[24px]">Your details</h2>
      <p className="mt-2 text-[14px] text-ink-soft">
        We need a legal name for the medical record. Nothing else in the clinic is filed under it.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="First name" required error={errors.firstName}>
          <Input
            value={draft.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            autoComplete="given-name"
          />
        </Field>
        <Field label="Last name" required error={errors.lastName}>
          <Input
            value={draft.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            autoComplete="family-name"
          />
        </Field>
        <Field
          label="Mobile" required error={errors.phone}
          hint="Your confirmation comes here. It will not name the service."
        >
          <Input
            value={draft.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="01012345678"
            inputMode="tel"
            autoComplete="tel"
            className="u-tnum"
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <Input
            type="email"
            value={draft.email}
            onChange={(e) => set("email", e.target.value)}
            autoComplete="email"
            placeholder="Optional"
          />
        </Field>

        <Field label="Have you been before?">
          <Select
            value={draft.visitCount}
            onChange={(e) => set("visitCount", e.target.value as Draft["visitCount"])}
          >
            <option value="first">First visit</option>
            <option value="returning">I&apos;ve been before</option>
          </Select>
        </Field>
        <Field label="How did you hear about us?">
          <Select value={draft.referral} onChange={(e) => set("referral", e.target.value)}>
            <option value="">Prefer not to say</option>
            <option value="search">Google</option>
            <option value="instagram">Instagram</option>
            <option value="friend">A friend or family</option>
            <option value="doctor">Referred by a doctor</option>
          </Select>
        </Field>

        <Field
          label="Anything you want the clinic to know"
          className="sm:col-span-2"
          hint="Read only by your treating physician."
        >
          <Textarea
            value={draft.notes}
            onChange={(e) => set("notes", e.target.value)}
            rows={4}
            placeholder="Optional — symptoms, medication, or a question you want answered."
          />
        </Field>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-white p-5">
        <input
          type="checkbox"
          checked={draft.discreet}
          onChange={(e) => set("discreet", e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[hsl(211_67%_17%)]"
        />
        <span>
          <span className="block text-[14px] font-semibold text-ink">Discreet messages</span>
          <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-soft">
            Confirmations and reminders will say only &ldquo;{BRAND.name}&rdquo; and the time —
            never the service or the consultant. On by default.
          </span>
        </span>
      </label>
    </div>
  );
}

/* ── Summary rail ────────────────────────────────────────── */

function Summary({
  draft, visitLabel, serviceName, servicePrice, doctorName,
}: {
  draft: Draft; visitLabel?: string; serviceName?: string;
  servicePrice?: number; doctorName?: string;
}) {
  const rows = [
    { k: "Visit", v: visitLabel },
    { k: "Service", v: serviceName },
    { k: "Consultant", v: draft.doctorId === "any" ? "First available" : doctorName },
    { k: "Day", v: draft.date ? formatDayLong(draft.date) : undefined },
    { k: "Time", v: draft.time },
  ].filter((r) => r.v);

  return (
    <aside className="rounded-3xl border border-line bg-white p-7 lg:sticky lg:top-24">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
        Your appointment
      </p>

      {rows.length === 0 ? (
        <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">
          Nothing chosen yet. Your selections appear here as you go.
        </p>
      ) : (
        <dl className="mt-4 flex flex-col divide-y divide-line">
          {rows.map((r) => (
            <div key={r.k} className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="text-[12.5px] text-ink-faint">{r.k}</dt>
              <dd className="u-tnum text-right text-[13.5px] font-semibold text-ink">{r.v}</dd>
            </div>
          ))}
        </dl>
      )}

      {servicePrice && (
        <div className="mt-5 flex items-center justify-between rounded-2xl bg-sand px-4 py-3.5">
          <span className="flex items-center gap-2 text-[13px] text-ink-soft">
            <Wallet size={14} /> Today
          </span>
          <span className="u-tnum font-display text-[22px] leading-none text-brand">
            {servicePrice.toLocaleString("en-EG")} EGP
          </span>
        </div>
      )}

      <ul className="mt-6 flex flex-col gap-2.5 border-t border-line pt-5">
        {[
          { icon: ShieldCheck, t: "One patient in the clinic at a time" },
          { icon: Clock, t: "Seen at your slot, not after it" },
          { icon: MessageCircle, t: "Nothing we send names the service" },
        ].map((f) => (
          <li key={f.t} className="flex items-start gap-2.5 text-[12.5px] leading-snug text-ink-soft">
            <f.icon size={14} className="mt-0.5 shrink-0 text-mint" />
            {f.t}
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[11.5px] leading-relaxed text-ink-faint">
        Payment is taken at the clinic. Free to cancel or move up to 12 hours before.
      </p>
    </aside>
  );
}

/* ── Confirmation ────────────────────────────────────────── */

function Confirmation({ draft, reference }: { draft: Draft; reference: string }) {
  const service = serviceById(draft.serviceId);
  const doctor = doctorById(draft.doctorId);

  return (
    <div className="u-wrap py-16 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={soft(0.5)}
        className="mx-auto max-w-2xl"
      >
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={springy}
          className="grid h-16 w-16 place-items-center rounded-3xl bg-mint text-white"
        >
          <Check size={30} strokeWidth={2.5} />
        </motion.span>

        <h1 className="mt-8 text-[clamp(32px,5vw,52px)]">You&apos;re booked</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
          A confirmation is on its way to{" "}
          <span className="u-tnum font-semibold text-ink">{draft.phone}</span>. It says
          {" "}{BRAND.name} and the time, and nothing else.
        </p>

        <div className="mt-9 overflow-hidden rounded-3xl border border-line bg-white">
          <div className="flex items-center justify-between gap-4 bg-brand px-7 py-5 text-white">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
                Reference
              </p>
              <p className="u-tnum font-display text-[26px] leading-tight">{reference}</p>
            </div>
            <Logo size={44} tone="light" className="opacity-50" />
          </div>

          <dl className="flex flex-col divide-y divide-line px-7">
            {[
              { k: "Name", v: `${draft.firstName} ${draft.lastName}` },
              { k: "Service", v: service?.name ?? visitTypeById(draft.visitTypeId)?.label },
              { k: "Consultant", v: draft.doctorId === "any" ? "First available" : doctor?.name },
              { k: "When", v: `${formatDayLong(draft.date)} at ${draft.time}` },
              { k: "Where", v: BRAND.address },
            ].map((r) => (
              <div key={r.k} className="flex items-baseline justify-between gap-6 py-4">
                <dt className="text-[13px] text-ink-faint">{r.k}</dt>
                <dd className="u-tnum text-right text-[14.5px] font-semibold text-ink">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {service && service.prep.length > 0 && (
          <div className="mt-6 rounded-3xl border border-coral/25 bg-coral-wash p-7">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-coral">
              Before you come
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {service.prep.map((p) => (
                <li key={p} className="flex gap-3 text-[14.5px] leading-relaxed text-ink">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/portal" size="lg">Open your portal</ButtonLink>
          <ButtonLink href="/contact" tone="outline" size="lg">
            <MapPin size={16} /> Directions
          </ButtonLink>
          <ButtonLink href={BRAND.whatsappHref} tone="ghost" size="lg" external>
            <MessageCircle size={16} /> Message the clinic
          </ButtonLink>
        </div>

        <Pill tone="muted" className="mt-8">
          Demo booking — no appointment has actually been made
        </Pill>
      </motion.div>
    </div>
  );
}
