/**
 * Site footer. Navy panel — the one place on the site that goes dark, which
 * is what makes it read as the end of the page rather than another section.
 */

import { Link } from "wouter";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { BRAND } from "@/lib/brand";
import { SERVICES } from "@/data/clinic";
import { Wordmark } from "@/components/Logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-brand text-white/80">
      <div className="u-wrap grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Wordmark tone="light" />
          <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-white/60">
            {BRAND.promise} A private men's health clinic in Sheikh Zayed, by appointment only.
          </p>
          <p className="mt-4 font-display text-[20px] text-white/90" dir="rtl">
            {BRAND.nameAr}
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Services
          </h3>
          <ul className="flex flex-col gap-2.5 text-[14px]">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/services/${s.id}`}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Clinic
          </h3>
          <ul className="flex flex-col gap-2.5 text-[14px]">
            {[
              { href: "/doctor", label: "Dr. Osama Ghattas" },
              { href: "/services", label: "All services" },
              { href: "/journal", label: "Journal" },
              { href: "/contact", label: "Contact & directions" },
              { href: "/book", label: "Book an appointment" },
              { href: "/portal", label: "Patient portal" },
              { href: "/privacy", label: "Privacy & confidentiality" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/70 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Reach us
          </h3>
          <ul className="flex flex-col gap-3 text-[14px]">
            <li className="flex items-start gap-2.5">
              <Phone size={15} className="mt-1 shrink-0 text-white/40" />
              <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} className="u-tnum text-white/70 hover:text-white">
                {BRAND.phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MessageCircle size={15} className="mt-1 shrink-0 text-white/40" />
              <a href={BRAND.whatsappHref} target="_blank" rel="noreferrer" className="text-white/70 hover:text-white">
                WhatsApp — discreet
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail size={15} className="mt-1 shrink-0 text-white/40" />
              <a href={`mailto:${BRAND.email}`} className="text-white/70 hover:text-white">
                {BRAND.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-1 shrink-0 text-white/40" />
              <span className="text-white/70">{BRAND.address}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock size={15} className="mt-1 shrink-0 text-white/40" />
              <span className="text-white/70">
                {BRAND.hours}
                <br />
                <span className="text-white/45">{BRAND.hoursNote}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="u-wrap flex flex-col gap-2 py-6 text-[12.5px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {BRAND.name}. All rights reserved.</p>
          <p>
            Nothing on this site is medical advice. For an emergency, call 123.
          </p>
        </div>
      </div>
    </footer>
  );
}
