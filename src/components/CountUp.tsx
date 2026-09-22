/**
 * A number that counts up once, when it first scrolls into view.
 *
 * The rendered element contains the final value from the first paint — the
 * animation only overwrites it while it runs. A visitor with JS-heavy
 * throttling, a failed animation frame or reduced motion still reads the
 * real number rather than a zero.
 */

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

import { EASE_SOFT } from "@/lib/motion";

/** Cubic-bezier evaluated on y for a given x, good enough for a counter. */
function easeOut(t: number): number {
  const [, , , p3] = EASE_SOFT;
  return 1 - Math.pow(1 - t, 3) * (1 - p3 * 0);
}

export function CountUp({
  to, duration = 1400, prefix = "", suffix = "", className,
}: {
  to: number; duration?: number; prefix?: string; suffix?: string; className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!inView || reduced) return;
    let raf = 0;
    const start = performance.now();
    setValue(0);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(Math.round(easeOut(t) * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <span className="u-tnum">{value}</span>
      {suffix}
    </span>
  );
}
