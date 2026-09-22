/**
 * The top of every page that isn't the home page. One component so the
 * vertical rhythm under the fixed header stays identical everywhere.
 */

import type { ReactNode } from "react";

import { Reveal, cx } from "@/components/ui";

export function PageHead({
  eyebrow, title, lead, children, className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cx("u-aurora relative", className)}>
      <div className="u-wrap relative z-10 py-14 lg:py-20">
        <Reveal className="max-w-3xl">
          {eyebrow && <p className="u-eyebrow mb-3">{eyebrow}</p>}
          <h1 className="text-[clamp(36px,6vw,66px)]">{title}</h1>
          {lead && (
            <p className="mt-5 max-w-2xl text-[17px] leading-[1.8] text-ink-soft">{lead}</p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </Reveal>
      </div>
    </header>
  );
}
