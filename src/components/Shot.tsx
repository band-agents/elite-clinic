/**
 * A photography placeholder.
 *
 * The clinic has no shoot yet, and a stock photo of a stranger in a white
 * coat would be worse than an honest gap. Each Shot states what belongs in
 * the slot, so the photographer can shoot to the layout rather than the
 * layout being rebuilt around whatever comes back.
 *
 * Swap the whole component for an <img> when the real files land — every
 * usage already carries the crop and the subject.
 */

import { cx } from "@/components/ui";
import { Logo } from "@/components/Logo";

export function Shot({
  label, tone = "navy", className, ratio,
}: {
  /** What this image is, in the photographer's terms. */
  label: string;
  tone?: "navy" | "sand" | "mint";
  className?: string;
  /** e.g. "4/5". Omit when the parent controls the height. */
  ratio?: string;
}) {
  const tones = {
    navy: "bg-brand text-white/45",
    sand: "bg-sand text-ink-faint",
    mint: "bg-mint-wash text-mint",
  } as const;

  return (
    <div
      className={cx(
        "relative grid place-items-center overflow-hidden rounded-3xl",
        tones[tone], className,
      )}
      style={ratio ? { aspectRatio: ratio } : undefined}
      role="img"
      aria-label={`Photography placeholder: ${label}`}
    >
      {/* A faint monogram so the block reads as branded space, not a broken image. */}
      <Logo size={96} tone={tone === "navy" ? "light" : "brand"} className="opacity-[0.13]" />
      <span
        className={cx(
          "absolute bottom-4 left-4 right-4 text-[11px] font-semibold uppercase",
          "tracking-[0.14em] leading-relaxed",
        )}
      >
        {label}
      </span>
    </div>
  );
}
