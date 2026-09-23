/**
 * One band of the page.
 *
 * Every section on the site goes through this, and that is the point: the
 * gutters and the vertical rhythm are decided here once instead of being
 * retyped per section. Before it existed some bands wrapped their content and
 * some did not, so the left and right edges wandered as you scrolled — the
 * single thing that made the page feel unbuilt.
 *
 * The background always runs full width; only the content is constrained. So
 * a navy band and a sand band sit edge to edge on the screen while their text
 * still lines up with everything above and below.
 */

import type { ReactNode } from "react";

import { cx } from "@/components/ui";

export type SectionTone = "surface" | "white" | "sand" | "navy" | "navyDeep";

const BG: Record<SectionTone, string> = {
  surface: "bg-surface text-ink",
  white: "bg-white text-ink",
  sand: "bg-sand text-ink",
  navy: "u-grain bg-brand text-white",
  navyDeep: "u-grain bg-brand-deep text-white",
};

export function Section({
  tone = "surface", id, className, innerClassName, children, flush,
}: {
  tone?: SectionTone;
  id?: string;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
  /** Drops the vertical padding — for bands that set their own. */
  flush?: boolean;
}) {
  return (
    <section id={id} className={cx("relative overflow-hidden", BG[tone], className)}>
      <div
        className={cx(
          "u-wrap relative z-10",
          !flush && "py-20 sm:py-24",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
