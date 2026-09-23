/**
 * The consultant's portraits — only rendered in the photo build.
 *
 * Both are studio shots supplied by the clinic with real alpha channels, so
 * they drop onto any background with no halo and no cutting.
 *
 * There are two, and which one goes where is the whole point:
 *
 *   seated  — the complete figure, chair legs and shoes included. It touches
 *             none of its own edges, so nothing about it is cut. This is the
 *             one that can float free on the hero. The previous hero used a
 *             half-body shot bled to the bottom of the band, and a hard
 *             horizontal edge through a man's thigh reads as a mistake no
 *             matter how clean the cutout is.
 *
 *   portrait — head and torso, cut at mid-thigh. It only works inside a
 *             defined panel, where the crop is obviously the frame's doing
 *             rather than a broken image.
 *
 * WebP only. A PNG fallback for alpha images this size runs to megabytes, and
 * every browser that matters has read WebP for years.
 */

import { cx } from "@/components/ui";

/* public/ assets must carry Vite's base or they break under a sub-path, which
   is exactly how this is served on GitHub Pages. */
const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path}`.replace(/([^:]\/)\/+/g, "$1");

const FILES = {
  seated: { file: "media/dr-seated.webp", w: 727, h: 1489 },
  portrait: { file: "media/dr-portrait.webp", w: 680, h: 780 },
} as const;

export function Portrait({
  name, className, eager,
}: {
  name: keyof typeof FILES;
  className?: string;
  eager?: boolean;
}) {
  const f = FILES[name];
  return (
    <img
      src={asset(f.file)}
      alt="Dr. Osama Ghattas, consultant andrologist and urological surgeon"
      width={f.w}
      height={f.h}
      loading={eager ? "eager" : "lazy"}
      decoding={eager ? "sync" : "async"}
      className={cx("block h-auto select-none", className)}
      draggable={false}
    />
  );
}
