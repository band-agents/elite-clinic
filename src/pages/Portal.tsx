/**
 * Patient portal — demo.
 *
 * A signed-in product wearing the marketing site's palette. It runs entirely
 * on local state and the fixtures in `data/portal.ts`: there is no account,
 * no server and no real medical record. The point is to let the clinic see
 * and price the portal before anyone builds the part that holds real data.
 *
 * Two things here are not decoration:
 *
 *  - **Discreet mode**, on by default. Service names and diagnoses blur until
 *    tapped, so a glance over your shoulder on a plane shows nothing. It is
 *    the single feature this clinic needs that a general hospital does not.
 *
 *  - **Reference ranges on every lab value**, with the out-of-range ones
 *    summarised in plain language at the top. A PDF of numbers a patient
 *    cannot interpret is not a result; it is homework.
 */

import { useMemo, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Bell, CalendarCheck, ChevronRight, Clock, CreditCard, Download,
  Eye, EyeOff, FileText, FlaskConical, ImageIcon, Loader2, LogOut, MapPin,
  Pill as PillIcon, Receipt, Scan, ShieldCheck, Stethoscope, TrendingDown,
  TrendingUp, User, X,
} from "lucide-react";

import { BRAND } from "@/lib/brand";
import {
  APPOINTMENTS, DOCUMENTS, HISTORY, INVOICES, PATIENT, PRESCRIPTIONS,
  isFlagged, type Analyte, type PortalDocument,
} from "@/data/portal";
import { soft, springy } from "@/lib/motion";
import { formatDayLong } from "@/lib/validate";
import { Button, Field, Input, Pill, cx } from "@/components/ui";
import { Logo, Wordmark } from "@/components/Logo";

type Tab = "home" | "appointments" | "results" | "history" | "medication" | "billing" | "settings";

const TABS: Array<{ id: Tab; label: string; icon: typeof User }> = [
  { id: "home", label: "Overview", icon: Stethoscope },
  { id: "appointments", label: "Appointments", icon: CalendarCheck },
  { id: "results", label: "Results & documents", icon: FileText },
  { id: "history", label: "Medical history", icon: Clock },
  { id: "medication", label: "Medication", icon: PillIcon },
  { id: "billing", label: "Invoices", icon: Receipt },
  { id: "settings", label: "Settings", icon: User },
];

export function Portal() {
  const [signedIn, setSignedIn] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [discreet, setDiscreet] = useState(true);
  const [openDoc, setOpenDoc] = useState<PortalDocument | null>(null);

  if (!signedIn) return <SignIn onDone={() => setSignedIn(true)} />;

  return (
    <div className="min-h-screen bg-surface">
      <PortalHeader
        discreet={discreet}
        onToggleDiscreet={() => setDiscreet((d) => !d)}
        onSignOut={() => setSignedIn(false)}
      />

      <div className="u-wrap grid gap-8 py-8 lg:grid-cols-[236px_1fr] lg:items-start">
        <SideNav tab={tab} onChange={setTab} />

        <div className="min-w-0">
          {tab === "home" && <Overview discreet={discreet} onOpenDoc={setOpenDoc} onGo={setTab} />}
          {tab === "appointments" && <Appointments discreet={discreet} />}
          {tab === "results" && <Results discreet={discreet} onOpenDoc={setOpenDoc} />}
          {tab === "history" && <History discreet={discreet} />}
          {tab === "medication" && <Medication />}
          {tab === "billing" && <Billing discreet={discreet} />}
          {tab === "settings" && (
            <Settings discreet={discreet} onToggleDiscreet={() => setDiscreet((d) => !d)} />
          )}
        </div>
      </div>

      <DocumentSheet doc={openDoc} onClose={() => setOpenDoc(null)} />

      <footer className="u-wrap border-t border-line py-8 text-center">
        <Pill tone="muted">
          Demo portal — all data on this screen is fabricated
        </Pill>
      </footer>
    </div>
  );
}

/* ── Sign in ─────────────────────────────────────────────── */

function SignIn({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  function sendCode() {
    setBusy(true);
    window.setTimeout(() => { setBusy(false); setPhase("otp"); }, 600);
  }

  function verify() {
    setBusy(true);
    window.setTimeout(() => { setBusy(false); onDone(); }, 600);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-14">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="inline-flex">
            <Wordmark />
          </Link>

          <h1 className="mt-12 text-[clamp(30px,4.6vw,42px)]">
            {phase === "phone" ? "Your records, privately" : "Check your phone"}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            {phase === "phone"
              ? "Sign in with the mobile number the clinic has on file. We send a six-digit code — no password to remember or leak."
              : `We sent a code to ${phone || "your number"}. It expires in ten minutes.`}
          </p>

          <div className="mt-8 flex flex-col gap-5">
            {phase === "phone" ? (
              <Field label="Mobile" required hint="Any number works in this demo.">
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01012345678"
                  inputMode="tel"
                  autoComplete="tel"
                  className="u-tnum"
                />
              </Field>
            ) : (
              <Field label="Six-digit code" required hint="Any six digits work in this demo.">
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="––––––"
                  inputMode="numeric"
                  className="u-tnum text-center text-[22px] tracking-[0.5em]"
                />
              </Field>
            )}

            <Button
              size="lg"
              onClick={phase === "phone" ? sendCode : verify}
              disabled={busy}
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : null}
              {phase === "phone" ? "Send code" : "Sign in"}
            </Button>

            {phase === "otp" && (
              <button
                type="button"
                onClick={() => setPhase("phone")}
                className="text-[13px] font-medium text-ink-soft hover:text-brand"
              >
                Use a different number
              </button>
            )}
          </div>

          <div className="mt-10 flex items-start gap-3 rounded-2xl border border-line bg-white p-5">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-gold-deep" />
            <p className="text-[13px] leading-relaxed text-ink-soft">
              Discreet mode is on by default: service names and diagnoses stay blurred on screen
              until you tap them.
            </p>
          </div>

          <p className="mt-8 text-[13px] text-ink-faint">
            Not a patient yet?{" "}
            <Link href="/book" className="font-semibold text-brand hover:underline">
              Book an appointment
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-brand lg:block">
        <Logo size={520} tone="light" className="absolute -bottom-24 -right-24 opacity-[0.07]" />
        <div className="relative flex h-full flex-col justify-end p-14 text-white">
          <p className="font-display text-[clamp(28px,3vw,40px)] leading-tight">
            Everything from your last visit, waiting.
          </p>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/60">
            Scans, blood results, prescriptions and your written plan — in one place, on any
            device, readable by you and your treating physician and no one else.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Chrome ──────────────────────────────────────────────── */

function PortalHeader({
  discreet, onToggleDiscreet, onSignOut,
}: {
  discreet: boolean; onToggleDiscreet: () => void; onSignOut: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-xl">
      <div className="u-wrap flex h-[68px] items-center gap-4">
        <Link href="/" aria-label={`${BRAND.name} — home`}>
          <Wordmark size={32} />
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleDiscreet}
            className={cx(
              "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[13px] font-semibold transition-colors",
              discreet
                ? "border-gold/40 bg-gold-wash text-gold-deep-deep"
                : "border-line bg-white text-ink-soft hover:border-brand/40",
            )}
            aria-pressed={discreet}
          >
            {discreet ? <EyeOff size={15} /> : <Eye size={15} />}
            <span className="hidden sm:inline">Discreet {discreet ? "on" : "off"}</span>
          </button>

          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink-soft"
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-coral" />
          </button>

          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-[13px] font-semibold text-white">
            {PATIENT.initials}
          </span>

          <button
            type="button"
            onClick={onSignOut}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink-soft
                       transition-colors hover:border-coral/40 hover:text-coral"
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

function SideNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav
      className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-2 lg:sticky lg:top-24 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
      aria-label="Portal sections"
    >
      {TABS.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={cx(
              "flex shrink-0 items-center gap-2.5 rounded-2xl px-4 py-2.5 text-[13.5px] font-semibold transition-colors lg:w-full",
              active ? "bg-brand text-white" : "text-ink-soft hover:bg-white hover:text-brand",
            )}
          >
            <t.icon size={16} className="shrink-0" />
            <span className="whitespace-nowrap">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ── Shared bits ─────────────────────────────────────────── */

/** Blurs its children until tapped, when discreet mode is on. */
function Veil({
  children, on, className,
}: {
  children: React.ReactNode; on: boolean; className?: string;
}) {
  const [shown, setShown] = useState(false);
  if (!on) return <span className={className}>{children}</span>;
  return (
    <span
      role="button"
      tabIndex={0}
      data-shown={shown || undefined}
      onClick={(e) => { e.stopPropagation(); setShown((s) => !s); }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setShown((s) => !s); }
      }}
      aria-label={shown ? "Hide" : "Reveal"}
      className={cx("u-discreet rounded", className)}
    >
      {children}
    </span>
  );
}

function Card({
  title, action, children, className,
}: {
  title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string;
}) {
  return (
    <section className={cx("rounded-3xl border border-line bg-white p-6 sm:p-7", className)}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-4">
          {title && (
            <h2 className="font-sans text-[15px] font-semibold tracking-normal text-ink">{title}</h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

const KIND_ICON = {
  lab: FlaskConical,
  imaging: Scan,
  report: FileText,
  prescription: PillIcon,
  invoice: Receipt,
  consent: ShieldCheck,
} as const;

const KIND_TONE = {
  lab: "bg-gold-wash text-gold-deep-deep",
  imaging: "bg-brand-wash text-brand",
  report: "bg-sand text-ink-soft",
  prescription: "bg-coral-wash text-coral",
  invoice: "bg-black/5 text-ink-soft",
  consent: "bg-brand-wash text-brand",
} as const;

const STATUS_TONE = {
  ready: "bg-gold-wash text-gold-deep-deep",
  reviewed: "bg-black/5 text-ink-soft",
  pending: "bg-coral-wash text-coral",
  confirmed: "bg-gold-wash text-gold-deep-deep",
  completed: "bg-black/5 text-ink-soft",
  cancelled: "bg-coral-wash text-coral",
  paid: "bg-gold-wash text-gold-deep-deep",
  unpaid: "bg-coral-wash text-coral",
} as const;

function Status({ value }: { value: keyof typeof STATUS_TONE }) {
  return (
    <span className={cx(
      "rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize",
      STATUS_TONE[value],
    )}>
      {value}
    </span>
  );
}

/** Triggers a real download so the clinic can see the interaction work. */
function downloadStub(doc: PortalDocument) {
  const lines = [
    `${BRAND.name} — ${BRAND.line}`,
    `${BRAND.doctor}`,
    "",
    `Document: ${doc.title}`,
    `Patient:  ${PATIENT.firstName} ${PATIENT.lastName} (file ${PATIENT.fileNo})`,
    `Date:     ${doc.dateISO}`,
    `Clinician: ${doc.doctor}`,
    "",
  ];
  if (doc.analytes) {
    lines.push("RESULTS", "");
    for (const a of doc.analytes) {
      const flag = isFlagged(a);
      lines.push(
        `${a.name.padEnd(26)} ${String(a.value).padStart(7)} ${a.unit.padEnd(9)} ` +
        `ref ${a.low}–${a.high}${flag ? `  [${flag.toUpperCase()}]` : ""}`,
      );
    }
    lines.push("");
  }
  if (doc.note) lines.push("CLINICIAN'S NOTE", "", doc.note, "");
  lines.push("— This is a demo document. It is not a medical record.");

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${doc.title.replace(/[^\w]+/g, "-").toLowerCase()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Overview ────────────────────────────────────────────── */

function Overview({
  discreet, onOpenDoc, onGo,
}: {
  discreet: boolean; onOpenDoc: (d: PortalDocument) => void; onGo: (t: Tab) => void;
}) {
  const next = APPOINTMENTS.find((a) => a.status === "confirmed");
  const ready = DOCUMENTS.filter((d) => d.status === "ready");
  const unpaid = INVOICES.filter((i) => i.status === "unpaid");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-[clamp(28px,4vw,40px)]">Good evening, {PATIENT.firstName}</h1>
        <p className="mt-2 text-[15px] text-ink-soft">
          File {PATIENT.fileNo} · with the clinic since{" "}
          {new Date(PATIENT.since).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
        </p>
      </div>

      {next && (
        <section className="overflow-hidden rounded-3xl bg-brand text-white">
          <div className="flex flex-wrap items-start justify-between gap-6 p-7 sm:p-8">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
                Next appointment
              </p>
              <p className="mt-2 font-display text-[clamp(24px,3vw,34px)] leading-tight">
                {formatDayLong(next.dateISO)} at {next.time}
              </p>
              <p className="mt-2 text-[14.5px] text-white/70">
                <Veil on={discreet}>{next.service}</Veil> · <Veil on={discreet}>{next.doctor}</Veil>
              </p>
              <p className="mt-4 flex items-center gap-2 text-[13px] text-white/50">
                <MapPin size={14} /> {next.location}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button tone="light" onClick={() => onGo("appointments")}>
                View details
              </Button>
              <button
                type="button"
                className="rounded-full px-4 py-2 text-[13px] font-medium text-white/60 hover:text-white"
              >
                Reschedule
              </button>
            </div>
          </div>

          {next.prep && (
            <div className="border-t border-white/10 px-7 py-5 sm:px-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                Before you come
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {next.prep.map((p) => (
                  <li key={p} className="flex gap-2.5 text-[13.5px] leading-relaxed text-white/75">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/40" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          title="Results ready"
          action={
            <button
              type="button"
              onClick={() => onGo("results")}
              className="text-[13px] font-semibold text-brand hover:underline"
            >
              All documents
            </button>
          }
        >
          <ul className="flex flex-col divide-y divide-line">
            {ready.slice(0, 3).map((d) => {
              const Icon = KIND_ICON[d.kind];
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => onOpenDoc(d)}
                    className="flex w-full items-center gap-3.5 py-3.5 text-left"
                  >
                    <span className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-xl", KIND_TONE[d.kind])}>
                      <Icon size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-semibold text-ink">
                        <Veil on={discreet}>{d.title}</Veil>
                      </span>
                      <span className="u-tnum block text-[12px] text-ink-faint">
                        {new Date(d.dateISO).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short",
                        })}
                      </span>
                    </span>
                    <ChevronRight size={16} className="shrink-0 text-ink-faint" />
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card title="Needs your attention">
          <ul className="flex flex-col gap-3">
            {unpaid.map((i) => (
              <li
                key={i.id}
                className="flex items-center justify-between gap-4 rounded-2xl bg-coral-wash px-4 py-3.5"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-semibold text-ink">
                    <Veil on={discreet}>{i.description}</Veil>
                  </span>
                  <span className="u-tnum block text-[12px] text-ink-soft">{i.ref}</span>
                </span>
                <span className="u-tnum shrink-0 text-[14px] font-semibold text-coral">
                  {i.amountEgp.toLocaleString("en-EG")} EGP
                </span>
              </li>
            ))}
            <li className="flex items-center justify-between gap-4 rounded-2xl bg-sand px-4 py-3.5">
              <span className="text-[13.5px] font-semibold text-ink">
                Pituitary MRI report pending
              </span>
              <Status value="pending" />
            </li>
          </ul>
        </Card>
      </div>

      <Card title="Quick actions">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: CalendarCheck, label: "Book a visit", href: "/book" },
            { icon: FileText, label: "Download a report", tab: "results" as Tab },
            { icon: PillIcon, label: "Request a refill", tab: "medication" as Tab },
            { icon: CreditCard, label: "Pay an invoice", tab: "billing" as Tab },
          ].map((a) =>
            a.href ? (
              <Link
                key={a.label}
                href={a.href}
                className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3.5
                           text-[13.5px] font-semibold text-ink transition-colors hover:border-brand/40 hover:text-brand"
              >
                <a.icon size={17} className="text-brand" /> {a.label}
              </Link>
            ) : (
              <button
                key={a.label}
                type="button"
                onClick={() => a.tab && onGo(a.tab)}
                className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3.5
                           text-left text-[13.5px] font-semibold text-ink transition-colors hover:border-brand/40 hover:text-brand"
              >
                <a.icon size={17} className="text-brand" /> {a.label}
              </button>
            ),
          )}
        </div>
      </Card>
    </div>
  );
}

/* ── Appointments ────────────────────────────────────────── */

function Appointments({ discreet }: { discreet: boolean }) {
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");
  const list = APPOINTMENTS.filter((a) =>
    filter === "upcoming" ? a.status === "confirmed" : a.status !== "confirmed",
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[clamp(26px,3.6vw,36px)]">Appointments</h1>
        <Link
          href="/book"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-5 text-[13.5px] font-semibold text-white"
        >
          <CalendarCheck size={15} /> Book another
        </Link>
      </div>

      <div className="flex gap-1.5">
        {(["upcoming", "past"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cx(
              "rounded-full px-4 py-2 text-[13px] font-semibold capitalize transition-colors",
              filter === f ? "bg-brand text-white" : "bg-white text-ink-soft hover:text-brand",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <Empty
          icon={CalendarCheck}
          title="Nothing here yet"
          body="When you book, the appointment and everything that comes with it appears here."
        />
      ) : (
        list.map((a) => (
          <Card key={a.id}>
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <Status value={a.status} />
                  <span className="u-tnum text-[12.5px] text-ink-faint">
                    {formatDayLong(a.dateISO)} · {a.time}
                  </span>
                </div>
                <h2 className="mt-3 font-sans text-[17px] font-semibold tracking-normal text-ink">
                  <Veil on={discreet}>{a.service}</Veil>
                </h2>
                <p className="mt-1 text-[13.5px] text-ink-soft">
                  <Veil on={discreet}>{a.doctor}</Veil>
                </p>
                <p className="mt-3 flex items-center gap-2 text-[13px] text-ink-faint">
                  <MapPin size={14} /> {a.location}
                </p>
              </div>

              {a.status === "confirmed" && (
                <div className="flex gap-2">
                  <Button tone="outline" size="sm">Reschedule</Button>
                  <Button tone="ghost" size="sm">Cancel</Button>
                </div>
              )}
            </div>

            {a.summary && (
              <div className="mt-5 rounded-2xl bg-sand p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                  Visit summary
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                  <Veil on={discreet}>{a.summary}</Veil>
                </p>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
}

/* ── Results ─────────────────────────────────────────────── */

function Results({
  discreet, onOpenDoc,
}: {
  discreet: boolean; onOpenDoc: (d: PortalDocument) => void;
}) {
  const [kind, setKind] = useState<"all" | PortalDocument["kind"]>("all");
  const kinds = useMemo(
    () => ["all", ...Array.from(new Set(DOCUMENTS.map((d) => d.kind)))] as const,
    [],
  );
  const list = kind === "all" ? DOCUMENTS : DOCUMENTS.filter((d) => d.kind === kind);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[clamp(26px,3.6vw,36px)]">Results & documents</h1>
          <p className="mt-2 text-[14.5px] text-ink-soft">
            Everything the clinic has produced for you. Results usually land within 24 hours.
          </p>
        </div>
        <Button
          tone="outline"
          onClick={() => DOCUMENTS.filter((d) => d.status !== "pending").forEach(downloadStub)}
        >
          <Download size={15} /> Download all
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {kinds.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k as typeof kind)}
            className={cx(
              "rounded-full px-4 py-2 text-[13px] font-semibold capitalize transition-colors",
              kind === k ? "bg-brand text-white" : "bg-white text-ink-soft hover:text-brand",
            )}
          >
            {k}
          </button>
        ))}
      </div>

      <Card className="!p-0">
        <ul className="flex flex-col divide-y divide-line">
          {list.map((d) => {
            const Icon = KIND_ICON[d.kind];
            const pending = d.status === "pending";
            const flagged = d.analytes?.filter(isFlagged).length ?? 0;
            return (
              <li key={d.id}>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => onOpenDoc(d)}
                  className={cx(
                    "flex w-full items-center gap-4 px-6 py-4 text-left transition-colors sm:px-7",
                    pending ? "cursor-not-allowed opacity-60" : "hover:bg-surface",
                  )}
                >
                  <span className={cx("grid h-11 w-11 shrink-0 place-items-center rounded-2xl", KIND_TONE[d.kind])}>
                    <Icon size={18} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-[14.5px] font-semibold text-ink">
                        <Veil on={discreet}>{d.title}</Veil>
                      </span>
                      <Status value={d.status} />
                      {flagged > 0 && (
                        <span className="rounded-full bg-coral-wash px-2.5 py-1 text-[11px] font-semibold text-coral">
                          {flagged} outside range
                        </span>
                      )}
                    </span>
                    <span className="u-tnum mt-1 block text-[12.5px] text-ink-faint">
                      <Veil on={discreet}>{d.service}</Veil> ·{" "}
                      {new Date(d.dateISO).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                      {d.sizeKb > 0 && ` · ${(d.sizeKb / 1024).toFixed(1)} MB`}
                    </span>
                  </span>

                  {!pending && (
                    <span
                      role="button"
                      tabIndex={-1}
                      onClick={(e) => { e.stopPropagation(); downloadStub(d); }}
                      className="hidden h-9 w-9 shrink-0 place-items-center rounded-full
                                 text-ink-faint transition-colors hover:bg-brand-wash hover:text-brand sm:grid"
                      aria-label={`Download ${d.title}`}
                    >
                      <Download size={16} />
                    </span>
                  )}
                  <ChevronRight size={16} className="shrink-0 text-ink-faint" />
                </button>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

/* ── Document sheet ──────────────────────────────────────── */

function DocumentSheet({ doc, onClose }: { doc: PortalDocument | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {doc && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={soft(0.25)}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={springy}
            role="dialog"
            aria-modal="true"
            aria-label={doc.title}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-surface shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-line bg-white px-6 py-5 sm:px-8">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <Status value={doc.status} />
                  <span className="u-tnum text-[12.5px] text-ink-faint">
                    {new Date(doc.dateISO).toLocaleDateString("en-GB", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="mt-2.5 font-sans text-[20px] font-semibold tracking-normal text-ink">
                  {doc.title}
                </h2>
                <p className="mt-1 text-[13px] text-ink-soft">
                  {doc.service} · {doc.doctor}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line
                           bg-white text-ink-soft transition-colors hover:text-coral"
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              {doc.analytes ? (
                <LabTable analytes={doc.analytes} />
              ) : (
                <div className="grid h-64 place-items-center rounded-3xl border border-dashed border-line bg-white">
                  <div className="text-center">
                    <ImageIcon size={28} className="mx-auto text-ink-faint" />
                    <p className="mt-3 text-[13.5px] text-ink-soft">
                      Document preview appears here
                    </p>
                    <p className="u-tnum mt-1 text-[12px] text-ink-faint">
                      {(doc.sizeKb / 1024).toFixed(1)} MB · {doc.kind}
                    </p>
                  </div>
                </div>
              )}

              {doc.note && (
                <div className="mt-6 rounded-3xl border border-line bg-white p-6">
                  <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
                    <Stethoscope size={14} /> What your consultant says
                  </p>
                  <p className="mt-3 text-[14.5px] leading-[1.8] text-ink-soft">{doc.note}</p>
                  <p className="mt-4 text-[12.5px] text-ink-faint">— {doc.doctor}</p>
                </div>
              )}
            </div>

            <footer className="flex flex-wrap gap-2 border-t border-line bg-white px-6 py-5 sm:px-8">
              <Button onClick={() => downloadStub(doc)}>
                <Download size={15} /> Download
              </Button>
              <Button tone="outline">Share securely</Button>
              <Button tone="ghost">Print</Button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function LabTable({ analytes }: { analytes: Analyte[] }) {
  const flagged = analytes.filter(isFlagged);

  return (
    <div>
      {flagged.length > 0 && (
        <div className="mb-6 rounded-3xl border border-coral/25 bg-coral-wash p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-coral">
            Outside the reference range
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {flagged.map((a) => {
              const dir = isFlagged(a);
              return (
                <li key={a.name} className="flex items-center gap-2.5 text-[14px] text-ink">
                  {dir === "low"
                    ? <TrendingDown size={15} className="shrink-0 text-coral" />
                    : <TrendingUp size={15} className="shrink-0 text-coral" />}
                  <span className="font-semibold">{a.name}</span>
                  <span className="u-tnum text-ink-soft">
                    {a.value} {a.unit} — {dir === "low" ? "below" : "above"} {dir === "low" ? a.low : a.high}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-[12.5px] leading-relaxed text-ink-soft">
            A value outside the range is not a diagnosis on its own. Read your consultant&apos;s
            note below before drawing conclusions.
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-line bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-line bg-surface">
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                Test
              </th>
              <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                Result
              </th>
              <th className="hidden px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint sm:table-cell">
                Reference
              </th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                Range
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {analytes.map((a) => {
              const flag = isFlagged(a);
              return (
                <tr key={a.name} className={flag ? "bg-coral-wash/40" : undefined}>
                  <td className="px-5 py-3.5">
                    <span className="text-[14px] font-medium text-ink">{a.name}</span>
                    {a.history && a.history.length > 1 && (
                      <span className="u-tnum mt-0.5 block text-[11.5px] text-ink-faint">
                        was {a.history[a.history.length - 2].value} on{" "}
                        {new Date(a.history[a.history.length - 2].dateISO)
                          .toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </span>
                    )}
                  </td>
                  <td className="u-tnum whitespace-nowrap px-3 py-3.5 text-right">
                    <span className={cx("text-[14.5px] font-semibold", flag ? "text-coral" : "text-ink")}>
                      {a.value}
                    </span>
                    <span className="ml-1 text-[12px] text-ink-faint">{a.unit}</span>
                  </td>
                  <td className="u-tnum hidden whitespace-nowrap px-3 py-3.5 text-right text-[12.5px] text-ink-faint sm:table-cell">
                    {a.low}–{a.high}
                  </td>
                  <td className="px-5 py-3.5">
                    <RangeBar analyte={a} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Where a reading sits inside its reference range, as a bar.
 *
 * The band is drawn at 20–80% of the track so there is room to render a value
 * that falls outside it; the marker is clamped to the track so an extreme
 * result cannot escape the component's bounds.
 */
function RangeBar({ analyte }: { analyte: Analyte }) {
  const { value, low, high } = analyte;
  const span = high - low || 1;
  const raw = 20 + ((value - low) / span) * 60;
  const pos = Math.min(97, Math.max(3, raw));
  const flag = isFlagged(analyte);

  return (
    <div className="ml-auto w-[88px]" aria-hidden>
      <div className="relative h-1.5 rounded-full bg-line">
        <span className="absolute inset-y-0 left-[20%] right-[20%] rounded-full bg-gold/35" />
        <span
          className={cx(
            "absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white",
            flag ? "bg-coral" : "bg-gold",
          )}
          style={{ left: `${pos}%` }}
        />
      </div>
    </div>
  );
}

/* ── History ─────────────────────────────────────────────── */

const HISTORY_TONE = {
  visit: "bg-brand-wash text-brand",
  diagnosis: "bg-coral-wash text-coral",
  procedure: "bg-gold-wash text-gold-deep-deep",
  prescription: "bg-sand text-ink-soft",
  result: "bg-brand-wash text-brand",
} as const;

function History({ discreet }: { discreet: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[clamp(26px,3.6vw,36px)]">Medical history</h1>
          <p className="mt-2 text-[14.5px] text-ink-soft">
            Everything in your file, newest first.
          </p>
        </div>
        <Button tone="outline">
          <Download size={15} /> Export as PDF
        </Button>
      </div>

      <Card>
        <ol className="relative flex flex-col">
          {HISTORY.map((h, i) => (
            <li key={h.id} className="relative flex gap-5 pb-8 last:pb-0">
              {i < HISTORY.length - 1 && (
                <span className="absolute left-[19px] top-10 bottom-0 w-px bg-line" aria-hidden />
              )}
              <span className={cx(
                "z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full text-[10px] font-bold uppercase",
                HISTORY_TONE[h.kind],
              )}>
                {h.kind.slice(0, 2)}
              </span>
              <div className="min-w-0 pt-1">
                <p className="u-tnum text-[12px] text-ink-faint">
                  {new Date(h.dateISO).toLocaleDateString("en-GB", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
                <h3 className="mt-1 font-sans text-[15.5px] font-semibold tracking-normal text-ink">
                  <Veil on={discreet}>{h.title}</Veil>
                </h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
                  <Veil on={discreet}>{h.detail}</Veil>
                </p>
                {h.doctor && <p className="mt-2 text-[12.5px] text-ink-faint">{h.doctor}</p>}
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

/* ── Medication ──────────────────────────────────────────── */

function Medication() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[clamp(26px,3.6vw,36px)]">Medication</h1>

      <Card title="Current">
        <ul className="flex flex-col divide-y divide-line">
          {PRESCRIPTIONS.filter((p) => p.active).map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-coral-wash text-coral">
                <PillIcon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-ink">{p.drug}</p>
                <p className="u-tnum text-[13px] text-ink-soft">{p.dose} · {p.schedule}</p>
                <p className="u-tnum mt-0.5 text-[12px] text-ink-faint">
                  Started {new Date(p.startedISO).toLocaleDateString("en-GB", {
                    day: "numeric", month: "long", year: "numeric",
                  })} · {p.doctor}
                </p>
              </div>
              <Button tone="outline" size="sm">Request refill</Button>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Reminders">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 accent-[hsl(211_67%_17%)]" />
          <span>
            <span className="block text-[14px] font-semibold text-ink">Daily reminder</span>
            <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-soft">
              A notification at 21:00. It says &ldquo;{BRAND.name} — reminder&rdquo; and never
              names the medication.
            </span>
          </span>
        </label>
      </Card>
    </div>
  );
}

/* ── Billing ─────────────────────────────────────────────── */

function Billing({ discreet }: { discreet: boolean }) {
  const total = INVOICES.filter((i) => i.status === "unpaid")
    .reduce((s, i) => s + i.amountEgp, 0);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[clamp(26px,3.6vw,36px)]">Invoices</h1>

      {total > 0 && (
        <Card className="!bg-brand !border-brand">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
                Outstanding
              </p>
              <p className="u-tnum mt-1.5 font-display text-[34px] leading-none text-white">
                {total.toLocaleString("en-EG")} EGP
              </p>
            </div>
            <Button tone="light"><CreditCard size={15} /> Pay now</Button>
          </div>
        </Card>
      )}

      <Card className="!p-0">
        <ul className="flex flex-col divide-y divide-line">
          {INVOICES.map((i) => (
            <li key={i.id} className="flex flex-wrap items-center gap-4 px-6 py-4 sm:px-7">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-black/5 text-ink-soft">
                <Receipt size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14.5px] font-semibold text-ink">
                  <Veil on={discreet}>{i.description}</Veil>
                </p>
                <p className="u-tnum text-[12.5px] text-ink-faint">
                  {i.ref} · {new Date(i.dateISO).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                  {i.method && ` · ${i.method}`}
                </p>
              </div>
              <span className="u-tnum text-[15px] font-semibold text-ink">
                {i.amountEgp.toLocaleString("en-EG")} EGP
              </span>
              <Status value={i.status} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* ── Settings ────────────────────────────────────────────── */

function Settings({
  discreet, onToggleDiscreet,
}: {
  discreet: boolean; onToggleDiscreet: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[clamp(26px,3.6vw,36px)]">Settings</h1>

      <Card title="Privacy">
        <button
          type="button"
          onClick={onToggleDiscreet}
          className="flex w-full items-center justify-between gap-5 rounded-2xl border border-line p-5 text-left"
        >
          <span>
            <span className="block text-[14.5px] font-semibold text-ink">Discreet mode</span>
            <span className="mt-1 block text-[13px] leading-relaxed text-ink-soft">
              Blurs service names, diagnoses and results until you tap them.
            </span>
          </span>
          <span className={cx(
            "relative h-6 w-11 shrink-0 rounded-full transition-colors",
            discreet ? "bg-gold" : "bg-line",
          )}>
            <motion.span
              layout
              transition={springy}
              className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
              style={{ left: discreet ? 22 : 2 }}
            />
          </span>
        </button>
      </Card>

      <Card title="Your details">
        <dl className="flex flex-col divide-y divide-line">
          {[
            { k: "Name", v: `${PATIENT.firstName} ${PATIENT.lastName}` },
            { k: "File number", v: PATIENT.fileNo },
            { k: "Mobile", v: PATIENT.phone },
            { k: "Email", v: PATIENT.email },
            { k: "Date of birth", v: new Date(PATIENT.dob).toLocaleDateString("en-GB", {
              day: "numeric", month: "long", year: "numeric" }) },
          ].map((r) => (
            <div key={r.k} className="flex items-center justify-between gap-4 py-3.5">
              <dt className="text-[13px] text-ink-faint">{r.k}</dt>
              <dd className="u-tnum text-[14px] font-semibold text-ink">{r.v}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card title="Notifications">
        {[
          { label: "Appointment reminders", sub: "The day before, by WhatsApp", on: true },
          { label: "Results ready", sub: "As soon as a document lands", on: true },
          { label: "Journal and clinic news", sub: "Occasional, never more than monthly", on: false },
        ].map((n) => (
          <label key={n.label} className="flex cursor-pointer items-start gap-3 border-b border-line py-4 last:border-0">
            <input type="checkbox" defaultChecked={n.on} className="mt-1 h-4 w-4 accent-[hsl(211_67%_17%)]" />
            <span>
              <span className="block text-[14px] font-semibold text-ink">{n.label}</span>
              <span className="mt-0.5 block text-[13px] text-ink-soft">{n.sub}</span>
            </span>
          </label>
        ))}
      </Card>

      <Card title="Your data">
        <div className="flex flex-wrap gap-3">
          <Button tone="outline"><Download size={15} /> Download everything</Button>
          <Button tone="ghost" className="text-coral hover:bg-coral-wash">Delete my account</Button>
        </div>
        <p className="mt-4 text-[12.5px] leading-relaxed text-ink-faint">
          Deleting removes your login and personal details. Medical records are retained for the
          period Egyptian medical practice requires. [PLACEHOLDER — confirm with counsel.]
        </p>
      </Card>
    </div>
  );
}

/* ── Empty ───────────────────────────────────────────────── */

function Empty({
  icon: Icon, title, body,
}: {
  icon: typeof User; title: string; body: string;
}) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-wash text-brand">
        <Icon size={22} />
      </span>
      <h2 className="mt-5 font-sans text-[17px] font-semibold tracking-normal text-ink">{title}</h2>
      <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-ink-soft">{body}</p>
      <Link
        href="/book"
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-brand px-5 text-[13.5px] font-semibold text-white"
      >
        <ArrowLeft size={15} className="rotate-180" /> Book an appointment
      </Link>
    </div>
  );
}
