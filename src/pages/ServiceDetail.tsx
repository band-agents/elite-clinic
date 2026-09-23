/**
 * One service.
 *
 * The page answers, in order, the four questions a man actually has before
 * booking: what is this, what will happen to me, what do I have to do
 * beforehand, and what does it cost. Clinical detail comes after all four.
 */

import { Link, useParams } from "wouter";
import { ArrowLeft, CalendarCheck, Clock, Info, MessageCircle, Wallet } from "lucide-react";

import { BRAND } from "@/lib/brand";
import { SERVICES, serviceById, doctorsForService } from "@/data/clinic";
import { Avatar, ButtonLink, Pill, Reveal, RevealGroup, RevealItem, cx } from "@/components/ui";
import { NotFound } from "@/pages/NotFound";

const ACCENT = {
  brand: "bg-brand-wash text-brand",
  gold: "bg-gold-wash text-gold-deep-deep",
  coral: "bg-coral-wash text-coral",
} as const;

export function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const service = serviceById(id ?? "");

  if (!service) return <NotFound />;

  const doctors = doctorsForService(service.id);
  const others = SERVICES.filter((s) => s.id !== service.id).slice(0, 3);

  return (
    <>
      <header className="u-aurora relative">
        <div className="u-wrap relative z-10 py-12 lg:py-16">
          <Reveal>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-[13.5px] font-medium text-ink-soft
                         transition-colors hover:text-brand"
            >
              <ArrowLeft size={15} /> All services
            </Link>
          </Reveal>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <Reveal>
              <span className={cx("grid h-14 w-14 place-items-center rounded-2xl", ACCENT[service.accent])}>
                <service.icon size={24} />
              </span>
              <h1 className="mt-6 text-[clamp(34px,5.4vw,60px)]">{service.name}</h1>
              <p className="mt-2 font-display text-[24px] text-ink-faint" dir="rtl">
                {service.nameAr}
              </p>
              <p className="mt-6 max-w-2xl text-[17px] leading-[1.8] text-ink-soft">
                {service.body}
              </p>
            </Reveal>

            {/* The booking card. Sticky on desktop so the price and the CTA
                stay with the reader through a long page. */}
            <Reveal delay={0.1} className="lg:sticky lg:top-24">
              <div className="rounded-3xl border border-line bg-white p-7 shadow-[0_24px_60px_-48px] shadow-brand/60">
                <dl className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="flex items-center gap-2 text-[13.5px] text-ink-soft">
                      <Clock size={15} className="text-ink-faint" /> Appointment
                    </dt>
                    <dd className="u-tnum text-[14px] font-semibold text-ink">
                      {service.durationMin} minutes
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="flex items-center gap-2 text-[13.5px] text-ink-soft">
                      <Wallet size={15} className="text-ink-faint" /> Price
                    </dt>
                    <dd className="u-tnum font-display text-[24px] leading-none text-brand">
                      {service.priceEgp.toLocaleString("en-EG")} EGP
                    </dd>
                  </div>
                </dl>

                <p className="mt-5 rounded-2xl bg-sand p-4 text-[12.5px] leading-relaxed text-ink-soft">
                  Tests beyond the consultation are quoted before they are done. Nothing is added
                  to your bill without you agreeing to it first.
                </p>

                <ButtonLink href={`/book?service=${service.id}`} size="lg" className="mt-6 w-full">
                  <CalendarCheck size={17} /> Book this
                </ButtonLink>
                <ButtonLink
                  href={BRAND.whatsappHref}
                  tone="ghost"
                  className="mt-2 w-full"
                  external
                >
                  <MessageCircle size={15} /> Ask a question first
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      <section className="u-wrap pb-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Reveal>
              <h2 className="text-[clamp(24px,3.2vw,34px)]">What the visit involves</h2>
            </Reveal>
            <RevealGroup className="mt-8 flex flex-col">
              {service.visit.map((step, i) => (
                <RevealItem key={step} className="flex gap-5 border-b border-line py-5 last:border-0">
                  <span className="u-tnum font-display text-[22px] leading-none text-brand/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[15px] leading-relaxed text-ink-soft">{step}</p>
                </RevealItem>
              ))}
            </RevealGroup>

            {service.prep.length > 0 && (
              <Reveal className="mt-10">
                <div className="rounded-3xl border border-coral/25 bg-coral-wash p-7">
                  <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-coral">
                    <Info size={15} /> Before you come
                  </p>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {service.prep.map((p) => (
                      <li key={p} className="flex gap-3 text-[14.5px] leading-relaxed text-ink">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[12.5px] text-ink-soft">
                    We send these with your confirmation and again the day before.
                  </p>
                </div>
              </Reveal>
            )}
          </div>

          <div>
            <Reveal>
              <h2 className="text-[clamp(22px,2.6vw,28px)]">Who you&apos;ll see</h2>
            </Reveal>
            <RevealGroup className="mt-6 flex flex-col gap-3">
              {doctors.map((d) => (
                <RevealItem
                  key={d.id}
                  className="flex items-start gap-4 rounded-3xl border border-line bg-white p-5"
                >
                  <Avatar initials={d.initials} accent={d.accent} size={48} />
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-semibold text-ink">{d.name}</p>
                    <p className="text-[12.5px] text-ink-soft">{d.title}</p>
                    <p className="mt-2 flex flex-wrap gap-1.5">
                      {d.days.map((day) => (
                        <span
                          key={day}
                          className="rounded-md bg-brand-wash px-1.5 py-0.5 text-[10.5px] font-semibold text-brand"
                        >
                          {day}
                        </span>
                      ))}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      <section className="bg-sand py-16">
        <div className="u-wrap">
          <Reveal>
            <p className="u-eyebrow mb-6">Related</p>
          </Reveal>
          <RevealGroup className="grid gap-4 md:grid-cols-3">
            {others.map((s) => (
              <RevealItem key={s.id}>
                <Link
                  href={`/services/${s.id}`}
                  className="group flex h-full items-start gap-4 rounded-3xl border border-line
                             bg-white p-6 transition-colors hover:border-brand/30"
                >
                  <span className={cx("grid h-11 w-11 shrink-0 place-items-center rounded-2xl", ACCENT[s.accent])}>
                    <s.icon size={18} />
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold text-ink">{s.name}</span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-ink-soft">
                      {s.summary}
                    </span>
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-10">
            <Pill tone="muted">All prices are placeholders pending the clinic&apos;s sign-off</Pill>
          </Reveal>
        </div>
      </section>
    </>
  );
}
