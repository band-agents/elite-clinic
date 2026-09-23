/**
 * The consultant's portrait — only rendered in the photo build.
 *
 * The file is a studio shot supplied by the clinic with a real alpha channel,
 * so it drops onto the navy with no halo and no cutting. That is why it can
 * sit directly on the hero instead of needing a panel the colour of its own
 * background, which is what the previous, flat-backed photographs required.
 *
 * WebP only. The PNG fallback of an alpha image this size was 1.3MB against
 * 170KB, and every browser that matters has read WebP for years.
 */

import { cx } from "@/components/ui";

/* public/ assets must carry Vite's base or they break under a sub-path, which
   is exactly how this is served on GitHub Pages. */
const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path}`.replace(/([^:]\/)\/+/g, "$1");

export function Portrait({ className }: { className?: string }) {
  return (
    <img
      src={asset("media/dr-osama.webp")}
      alt="Dr. Osama Ghattas, consultant andrologist and urological surgeon"
      width={860}
      height={1230}
      /* Above the fold — never lazy, or it arrives after the hero has settled. */
      loading="eager"
      decoding="sync"
      className={cx("block h-auto w-full select-none", className)}
      draggable={false}
    />
  );
}
