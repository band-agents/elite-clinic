/**
 * A real photograph, as opposed to the `Shot` placeholders.
 *
 * Both portraits come from the clinic's own existing site (darelzokora.com)
 * and are the doctor's own images. They arrived on a saturated teal that sits
 * at hsl(167 71% 44%) — within a couple of degrees of this site's mint
 * accent, hsl(168 62% 40%) — so the backdrop was remapped to the exact brand
 * mint rather than cut out. It reads as art direction instead of a borrowed
 * asset, and it avoids a background removal that would have had to separate a
 * white suit from a white page.
 *
 * Source files are 600×600, which is all the clinic's site has. They are
 * displayed small enough to stay sharp, but a proper shoot is still on the
 * list of things the clinic owes before launch.
 */

import { cx } from "@/components/ui";

/* Assets live in public/, so the URL has to carry Vite's base or it breaks the
   moment the site is served from a sub-path — which it is, on GitHub Pages. */
const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path}`.replace(/([^:]\/)\/+/g, "$1");

export type PortraitName = "suit" | "coat";

const FILES: Record<PortraitName, { base: string; alt: string }> = {
  suit: {
    base: "media/dr-osama",
    alt: "Dr. Osama Ghattas, consultant andrologist and urologist",
  },
  coat: {
    base: "media/dr-osama-coat",
    alt: "Dr. Osama Ghattas in the clinic",
  },
};

export function Portrait({
  name = "suit", className, imgClassName, priority,
}: {
  name?: PortraitName;
  className?: string;
  imgClassName?: string;
  /** The hero portrait; skips lazy-loading so it is not late to the fold. */
  priority?: boolean;
}) {
  const f = FILES[name];
  return (
    <picture className={cx("block overflow-hidden", className)}>
      <source srcSet={asset(`${f.base}.webp`)} type="image/webp" />
      <img
        src={asset(`${f.base}.png`)}
        alt={f.alt}
        width={name === "suit" ? 296 : 300}
        height={name === "suit" ? 504 : 430}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        className={cx("h-full w-full object-cover", imgClassName)}
      />
    </picture>
  );
}
