import { ButtonLink } from "@/components/ui";
import { Logo } from "@/components/Logo";

export function NotFound() {
  return (
    <section className="u-wrap flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <Logo size={64} className="opacity-25" />
      <h1 className="mt-8 text-[clamp(36px,6vw,64px)]">This page doesn&apos;t exist</h1>
      <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ink-soft">
        The link may be old, or the address may have a typo in it. Everything on the site is
        reachable from the home page.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Back to the clinic</ButtonLink>
        <ButtonLink href="/book" tone="outline">Book an appointment</ButtonLink>
      </div>
    </section>
  );
}
