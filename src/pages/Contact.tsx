/**
 * Contact and directions.
 *
 * The message form deliberately does not ask what the enquiry is about. A
 * dropdown of sexual-health categories on a public page is exactly the kind
 * of thing this clinic exists to avoid — free text, and the clinic asks in
 * private if it needs to know.
 */

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Car, Check, Clock, Mail, MapPin, MessageCircle, Phone, ShieldCheck,
} from "lucide-react";

import { BRAND } from "@/lib/brand";
import { soft } from "@/lib/motion";
import { isEgyptianMobile } from "@/lib/validate";
import {
  Button, ButtonLink, Field, Input, Pill, Reveal, RevealGroup, RevealItem, Textarea,
} from "@/components/ui";
import { PageHead } from "@/components/PageHead";
import { Shot } from "@/components/Shot";

export function Contact() {
  return (
    <>
      <PageHead
        eyebrow="Contact"
        title="Finding us, quietly"
        lead="The clinic is in Beverly Hills, Sheikh Zayed, with parking that leads straight to a private entrance. Directions go out with every confirmation."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={BRAND.whatsappHref} external>
            <MessageCircle size={16} /> WhatsApp the clinic
          </ButtonLink>
          <ButtonLink href={`tel:${BRAND.phone.replace(/\s/g, "")}`} tone="outline" external>
            <Phone size={16} /> {BRAND.phone}
          </ButtonLink>
        </div>
      </PageHead>

      <section className="u-wrap pb-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <RevealGroup className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: MapPin, title: "Address", body: BRAND.address, sub: BRAND.addressAr, rtl: true },
                { icon: Clock, title: "Hours", body: BRAND.hours, sub: BRAND.hoursNote },
                { icon: Phone, title: "Reception", body: BRAND.phone, sub: "Saturday to Thursday" },
                { icon: Mail, title: "Email", body: BRAND.email, sub: "Replies within one working day" },
              ].map((c) => (
                <RevealItem key={c.title} className="rounded-3xl border border-line bg-white p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-wash text-brand">
                    <c.icon size={17} />
                  </span>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                    {c.title}
                  </p>
                  <p className="u-tnum mt-1.5 text-[15px] font-semibold text-ink">{c.body}</p>
                  <p
                    className="mt-1 text-[12.5px] text-ink-soft"
                    dir={c.rtl ? "rtl" : undefined}
                  >
                    {c.sub}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal className="mt-4">
              <Shot label="Clinic exterior — private entrance, evening, warm interior light" ratio="16/10" />
            </Reveal>

            <Reveal className="mt-4">
              <div className="flex items-start gap-4 rounded-3xl border border-mint/25 bg-mint-wash p-6">
                <Car size={19} className="mt-0.5 shrink-0 text-mint" />
                <div>
                  <p className="text-[14.5px] font-semibold text-ink">Parking and the private entrance</p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
                    Underground parking connects directly to the clinic&apos;s own door — you do
                    not pass through a shared lobby. The exact bay and the door code are in your
                    confirmation. [PLACEHOLDER — confirm with the clinic.]
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal className="lg:sticky lg:top-24">
              <MessageForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Form ────────────────────────────────────────────────── */

type State = "idle" | "sending" | "sent";

function MessageForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; message?: string }>({});
  const [state, setState] = useState<State>("idle");

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = "We need a name to reply to.";
    if (!isEgyptianMobile(phone)) next.phone = "Enter a mobile number, e.g. 01012345678.";
    if (message.trim().length < 10) next.message = "A sentence or two is enough.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    /* No backend yet. The clinic's inbox, a CRM or a WhatsApp Business API
       call all slot in here without the form changing. */
    setState("sending");
    window.setTimeout(() => setState("sent"), 700);
  }

  if (state === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={soft(0.4)}
        className="rounded-3xl border border-mint/30 bg-white p-10 text-center"
      >
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-mint-wash text-mint">
          <Check size={24} strokeWidth={2.5} />
        </span>
        <h2 className="mt-6 text-[26px]">Message received</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          Someone from the clinic will reply within one working day. The reply will come from
          {" "}{BRAND.name} and will not mention what you asked about.
        </p>
        <ButtonLink href="/book" className="mt-7">Book an appointment instead</ButtonLink>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-line bg-white p-8 shadow-[0_24px_60px_-48px] shadow-brand/60"
      noValidate
    >
      <Pill tone="mint"><ShieldCheck size={12} /> Read only by the clinic</Pill>
      <h2 className="mt-5 text-[28px]">Send a message</h2>
      <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">
        You do not have to say what it is about. Tell us as much or as little as you want — we
        will ask the rest in private.
      </p>

      <div className="mt-7 flex flex-col gap-5">
        <Field label="Your name" required error={errors.name}>
          <Input
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
            placeholder="How should we address you?"
            autoComplete="name"
          />
        </Field>

        <Field label="Mobile" required error={errors.phone} hint="We reply on WhatsApp unless you ask us not to.">
          <Input
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: undefined })); }}
            placeholder="01012345678"
            inputMode="tel"
            autoComplete="tel"
            className="u-tnum"
          />
        </Field>

        <Field label="Message" required error={errors.message}>
          <Textarea
            value={message}
            onChange={(e) => { setMessage(e.target.value); setErrors((p) => ({ ...p, message: undefined })); }}
            placeholder="A sentence is enough."
            rows={5}
          />
        </Field>
      </div>

      <Button type="submit" size="lg" className="mt-7 w-full" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send message"}
      </Button>

      <p className="mt-4 text-center text-[12px] leading-relaxed text-ink-faint">
        For anything urgent, call the clinic. In an emergency, call 123.
      </p>
    </form>
  );
}
