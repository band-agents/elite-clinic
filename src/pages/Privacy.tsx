/**
 * Privacy and confidentiality.
 *
 * Written as a promise with specifics rather than as a policy. A legal
 * privacy policy is a separate document and a separate job; this page is the
 * clinic's operational commitments, each one concrete enough that a patient
 * could catch us breaking it.
 */

import { Bell, DoorClosed, Eye, FileLock, MessageCircle, UserCheck } from "lucide-react";

import { BRAND } from "@/lib/brand";
import { ButtonLink, Pill, Reveal, RevealGroup, RevealItem } from "@/components/ui";
import { PageHead } from "@/components/PageHead";

const COMMITMENTS = [
  {
    icon: DoorClosed,
    title: "One patient in the clinic at a time",
    body:
      "Appointments are spaced so you do not pass another patient coming in or going out. There " +
      "is a separate entrance and a separate exit. This costs us slots every day; it is the " +
      "reason the clinic exists in this form.",
  },
  {
    icon: Bell,
    title: "Nothing we send you names the service",
    body:
      "Confirmations, reminders and result notifications say " + BRAND.name + " and the time. No " +
      "message we send will name a service, a test or a diagnosis — not by SMS, not by WhatsApp, " +
      "not by email.",
  },
  {
    icon: Eye,
    title: "Your file has one reader",
    body:
      "Your medical record is visible to your treating physician. Reception can see that you " +
      "have an appointment and nothing about what it is for. Access is logged, and you can ask " +
      "to see the log.",
  },
  {
    icon: FileLock,
    title: "Discreet mode in the portal",
    body:
      "Service names, diagnoses and doctor names are blurred on screen until you tap them, so a " +
      "glance over your shoulder on a plane or in an office shows nothing. It is on by default.",
  },
  {
    icon: UserCheck,
    title: "A chaperone, always offered",
    body:
      "For any examination, a chaperone is offered and never assumed. Declining one is recorded " +
      "as your decision, not as an omission.",
  },
  {
    icon: MessageCircle,
    title: "You can ask before you book",
    body:
      "The WhatsApp line is answered by the clinic's own staff, not an agency. You can ask what " +
      "a visit involves and what it costs without giving your name.",
  },
] as const;

export function Privacy() {
  return (
    <>
      <PageHead
        eyebrow="Privacy & confidentiality"
        title="What we mean when we say private"
        lead="Privacy is a set of specific operational decisions, not a sentence on a homepage. These are ours, written plainly enough that you could catch us breaking one."
      >
        <Pill tone="muted">
          A separate legal privacy policy will be published before launch — [PLACEHOLDER]
        </Pill>
      </PageHead>

      <section className="u-wrap pb-20">
        <RevealGroup className="grid gap-4 md:grid-cols-2">
          {COMMITMENTS.map((c) => (
            <RevealItem
              key={c.title}
              className="rounded-3xl border border-line bg-white p-8"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-wash text-brand">
                <c.icon size={19} />
              </span>
              <h2 className="mt-5 font-sans text-[17px] font-semibold tracking-normal text-ink">
                {c.title}
              </h2>
              <p className="mt-2.5 text-[14.5px] leading-[1.75] text-ink-soft">{c.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-12">
          <div className="rounded-[28px] bg-brand p-10 text-white sm:p-14">
            <h2 className="max-w-lg text-[clamp(26px,3.4vw,38px)] text-white">
              Where your data actually lives
            </h2>
            <p className="mt-5 max-w-2xl text-[15.5px] leading-[1.8] text-white/70">
              [PLACEHOLDER — this section must be completed with the clinic and its counsel before
              launch.] Medical records, imaging and laboratory results are held on
              [hosting/jurisdiction to be confirmed], retained for [period to be confirmed], and
              are never shared with insurers, employers or family members without your written
              consent. You can request a full copy or ask for your record to be deleted, subject
              to the retention period Egyptian medical practice requires.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/contact" tone="white">Ask us about your data</ButtonLink>
              <ButtonLink href="/book" tone="light">Book an appointment</ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
