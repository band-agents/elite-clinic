/**
 * Dr. Osama Ghattas, and the clinic behind him.
 *
 * Everything on this page is marked placeholder in `data/clinic.ts` until the
 * clinic supplies a real CV. Inventing credentials for a doctor is the one
 * thing on this site that could genuinely cause harm, so the copy states
 * plainly where it is unverified rather than filling the gap convincingly.
 */

import { CalendarCheck, Check, MessageCircle, Quote } from "lucide-react";

import { BRAND } from "@/lib/brand";
import { DOCTORS, PROMISES } from "@/data/clinic";
import { Avatar, ButtonLink, Pill, Reveal, RevealGroup, RevealItem } from "@/components/ui";
import { PageHead } from "@/components/PageHead";
import { Kicker } from "@/components/editorial";

export function Doctor() {
  const lead = DOCTORS.find((d) => d.lead)!;
  const team = DOCTORS.filter((d) => !d.lead);

  return (
    <>
      <PageHead
        eyebrow="Your consultant"
        title={BRAND.doctor}
        lead={lead.title + " — " + lead.focus + "."}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/book">
            <CalendarCheck size={16} /> Book with {BRAND.doctor.split(" ")[0]} {BRAND.doctor.split(" ")[1]}
          </ButtonLink>
          <ButtonLink href={BRAND.whatsappHref} tone="outline" external>
            <MessageCircle size={16} /> Ask privately
          </ButtonLink>
        </div>
      </PageHead>

      <section className="u-wrap pb-20">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          {/* No portrait. The record is the argument; a face on a men's
              sexual-health page mostly serves the clinic, not the patient. */}
          <Reveal>
            <div className="bg-brand p-9 text-white sm:p-11">
              <Kicker tone="text-gold" rule="bg-gold/40">The record</Kicker>
              <ul className="mt-8 flex flex-col divide-y divide-white/12 border-t border-white/12">
                {[
                  ["~20", "years in men's health"],
                  ["10,000+", "penile implant procedures"],
                  ["1", "consultant, start to finish"],
                  ["40", "minutes, every consultation"],
                ].map(([n, l]) => (
                  <li key={l} className="flex items-baseline gap-4 py-4">
                    <span className="u-tnum font-display text-[28px] leading-none text-gold">{n}</span>
                    <span className="text-[14.5px] text-white/70">{l}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-7 text-[12px] leading-relaxed text-white/40">
                Supplied by the clinic and not independently verified. The source states both
                eighteen and twenty years in different places.
              </p>
            </div>

            <div className="mt-4 border border-line bg-sand p-8">
              <Kicker>Known for</Kicker>
              <p className="mt-5 font-display text-[22px] leading-[1.25] text-ink">
                The Ghattas Modification
              </p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
                His own refinement of hydraulic implant placement — a fixation suture that
                shortens the operation and makes reservoir placement in the abdominal wall safer.
              </p>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <Pill tone="coral">Credentials from the clinic&apos;s own site — to verify against his CV</Pill>
            </Reveal>

            {lead.bio?.map((para, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p className="mt-6 text-[16.5px] leading-[1.85] text-ink-soft">{para}</p>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <div className="mt-10 rounded-3xl border border-line bg-white p-8">
                <Quote size={22} className="text-brand/30" />
                <p className="mt-4 font-display text-[clamp(20px,2.4vw,27px)] leading-snug text-ink">
                  &ldquo;Men don&apos;t avoid the doctor because they don&apos;t care. They avoid
                  the part where they have to say it out loud in a room full of people.&rdquo;
                </p>
                <p className="mt-5 text-[13px] text-ink-faint">
                  {BRAND.doctor} · [PLACEHOLDER quote]
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.26}>
              <h2 className="mt-12 text-[clamp(22px,2.8vw,30px)]">Credentials</h2>
              <ul className="mt-6 flex flex-col gap-3">
                {lead.credentials?.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-[15px] text-ink-soft">
                    <span className="mt-1 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-gold-wash text-gold-deep-deep">
                      <Check size={11} strokeWidth={3} />
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-sand py-20">
        <div className="u-wrap">
          <Reveal className="max-w-2xl">
            <p className="u-eyebrow mb-3">The clinic</p>
            <h2 className="text-[clamp(28px,4vw,44px)]">Built around the visit, not the building</h2>
            <p className="mt-5 text-[16.5px] leading-[1.8] text-ink-soft">
              Four operational decisions define {BRAND.name}. None of them are about equipment —
              every good clinic has the equipment. They are about what the hour you spend here
              feels like.
            </p>
          </Reveal>

          <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROMISES.map((p) => (
              <RevealItem key={p.title} className="rounded-3xl border border-line bg-white p-7">
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
        </div>
      </section>

      <section className="u-wrap py-20">
        <Reveal className="max-w-2xl">
          <p className="u-eyebrow mb-3">The team</p>
          <h2 className="text-[clamp(28px,4vw,44px)]">Consultants, not registrars</h2>
          <p className="mt-5 text-[16.5px] leading-[1.8] text-ink-soft">
            Specialist input where a case needs it, without the referral and the six-week wait.
            [PLACEHOLDER — the clinic to confirm names and credentials.]
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 md:grid-cols-2">
          {team.map((d) => (
            <RevealItem
              key={d.id}
              className="flex items-start gap-5 rounded-3xl border border-line bg-white p-7"
            >
              <Avatar initials={d.initials} accent={d.accent} size={56} />
              <div>
                <p className="text-[16px] font-semibold text-ink">{d.name}</p>
                <p className="text-[13.5px] text-ink-soft">{d.title}</p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-faint">{d.focus}</p>
                <p className="mt-3 flex flex-wrap gap-1.5">
                  {d.days.map((day) => (
                    <span
                      key={day}
                      className="rounded-md bg-brand-wash px-2 py-0.5 text-[11px] font-semibold text-brand"
                    >
                      {day}
                    </span>
                  ))}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
