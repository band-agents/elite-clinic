/**
 * The clinic's mark: a single G.
 *
 * Drawn rather than set in a typeface so it holds its weight at 24px in a
 * favicon and at 96px in the footer without the optical sizing of a text font
 * fighting us. The gap in the ring and the inward bar are the two things that
 * make it read as a G and not an O — keep both if the shape is ever edited.
 */

import { cx } from "@/components/ui";

export function Logo({
  size = 40, tone = "brand", className,
}: {
  size?: number;
  /** `brand` draws navy on transparent; `light` draws white, for dark panels. */
  tone?: "brand" | "light" | "solid";
  className?: string;
}) {
  const stroke = tone === "light" ? "white" : "currentColor";

  if (tone === "solid") {
    return (
      <span
        className={cx("grid place-items-center rounded-xl bg-brand text-white", className)}
        style={{ width: size, height: size }}
        aria-hidden
      >
        <Glyph size={size * 0.58} stroke="white" />
      </span>
    );
  }

  return (
    <span
      className={cx(tone === "brand" ? "text-brand" : "text-white", className)}
      style={{ display: "inline-grid", placeItems: "center", width: size, height: size }}
      aria-hidden
    >
      <Glyph size={size} stroke={stroke} />
    </span>
  );
}

function Glyph({ size, stroke }: { size: number; stroke: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      {/* The ring, opened at the 3 o'clock position. */}
      <path
        d="M40 17.5A18 18 0 1 0 42 26"
        stroke={stroke}
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      {/* The crossbar that closes the G. */}
      <path
        d="M42 26H29.5"
        stroke={stroke}
        strokeWidth="3.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Mark plus wordmark, for the header and the footer. */
export function Wordmark({
  tone = "brand", className, size = 36,
}: {
  tone?: "brand" | "light"; className?: string; size?: number;
}) {
  const ink = tone === "light" ? "text-white" : "text-brand";
  const sub = tone === "light" ? "text-white/60" : "text-ink-faint";
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <Logo size={size} tone={tone} />
      <span className="flex flex-col leading-none">
        <span
          className={cx("font-display text-[19px] tracking-[-0.01em]", ink)}
          style={{ lineHeight: 1 }}
        >
          Elite Clinic
        </span>
        <span className={cx("mt-[3px] text-[9.5px] font-semibold uppercase tracking-[0.2em]", sub)}>
          Men's Health
        </span>
      </span>
    </span>
  );
}
