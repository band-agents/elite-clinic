/**
 * Site header.
 *
 * **The header has no entry animation, on purpose.** In the Al-Madinah build
 * it slid in from `y: -70`, and an interrupted tween left it stranded off
 * screen with no navigation at all. Nothing load-bearing gets animated in.
 *
 * It has two skins. Over a dark hero it is transparent with white type; once
 * scrolled past it — or on any page whose top is light — it goes solid with
 * ink type. `DARK_HERO` is the list of routes that start dark; getting a
 * route wrong here costs the whole navigation, because white links on a white
 * page are invisible rather than merely ugly.
 */

import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarCheck, Menu, MessageCircle, Phone, X } from "lucide-react";

import { BRAND } from "@/lib/brand";
import { soft, springy } from "@/lib/motion";
import { ButtonLink, cx } from "@/components/ui";
import { Wordmark } from "@/components/Logo";

const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/international", label: "International" },
  { href: "/doctor", label: "Dr. Osama" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * Routes whose first screenful is a full-bleed dark hero.
 *
 * Shared with App, which must NOT pad the main element on these routes — the
 * hero is meant to run under the fixed header, and 72px of surface above it
 * reads as a broken layout.
 */
export const DARK_HERO = ["/", "/international"];

export function Nav() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close the drawer on navigation. Without this, tapping a link on mobile
     navigates behind a drawer that stays open over the new page. */
  useEffect(() => { setOpen(false); }, [location]);

  /* Lock the page behind the drawer, and restore on unmount rather than on a
     state change, so an unmount mid-transition cannot leave the body locked. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const solid = scrolled || open;
  const light = DARK_HERO.includes(location) && !solid;

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid
          ? "border-b border-line bg-surface/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="u-wrap flex h-[72px] items-center gap-6">
        <Link href="/" className="shrink-0" aria-label={`${BRAND.name} — home`}>
          <Wordmark tone={light ? "light" : "brand"} />
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Main">
          {LINKS.map((l) => {
            const active = location === l.href || location.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cx(
                  "relative rounded-full px-4 py-2 text-[14px] font-medium transition-colors",
                  light
                    ? active ? "text-white" : "text-white/65 hover:text-white"
                    : active ? "text-brand" : "text-ink-soft hover:text-brand",
                )}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className={cx("absolute inset-x-3 -bottom-0.5 h-px", light ? "bg-white" : "bg-brand")}
                    transition={springy}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <a
            href={BRAND.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className={cx(
              "hidden h-10 items-center gap-2 rounded-full px-4 text-[13.5px] font-medium transition-colors md:inline-flex",
              light
                ? "text-white/70 hover:bg-white/10 hover:text-white"
                : "text-ink-soft hover:bg-mint-wash hover:text-mint",
            )}
          >
            <MessageCircle size={15} /> Ask privately
          </a>

          <ButtonLink href="/book" tone={light ? "light" : "primary"} size="sm" className="h-10 px-5">
            <CalendarCheck size={15} /> Book
          </ButtonLink>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={cx(
              "grid h-10 w-10 place-items-center rounded-full border transition-colors lg:hidden",
              light
                ? "border-white/25 bg-white/10 text-white backdrop-blur-sm"
                : "border-line bg-white text-ink hover:border-brand/40",
            )}
          >
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer. `AnimatePresence` is safe here because the drawer is
          not load-bearing — if its exit is interrupted the page underneath is
          still complete and navigable. */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={soft(0.28)}
            className="border-t border-line bg-surface lg:hidden"
          >
            <nav className="u-wrap flex flex-col py-4" aria-label="Mobile">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="border-b border-line/70 py-3.5 text-[16px] font-medium text-ink last:border-0"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                <ButtonLink href="/portal" tone="outline" size="md">
                  Patient portal
                </ButtonLink>
                <a
                  href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 py-2 text-[14px] text-ink-soft"
                >
                  <Phone size={14} /> {BRAND.phone}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
