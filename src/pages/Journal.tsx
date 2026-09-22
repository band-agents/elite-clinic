/**
 * Journal index.
 *
 * The clinic's search traffic comes from here, not from the service pages —
 * a man searching a symptom at one in the morning is not searching the word
 * "andrology". Categories are a filter rather than separate pages, because
 * three articles do not justify a taxonomy.
 */

import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

import { ARTICLES } from "@/data/clinic";
import { Pill, Reveal, RevealGroup, RevealItem, cx } from "@/components/ui";
import { PageHead } from "@/components/PageHead";

export function Journal() {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(ARTICLES.map((a) => a.category)))],
    [],
  );
  const [active, setActive] = useState("All");

  const shown = active === "All" ? ARTICLES : ARTICLES.filter((a) => a.category === active);

  return (
    <>
      <PageHead
        eyebrow="Journal"
        title="Plain answers, written by the clinic"
        lead="Short pieces on the things men actually search for at one in the morning. Every article is reviewed by Dr. Osama before it is published, and dated so you can see how current it is."
      />

      <section className="u-wrap pb-20">
        <Reveal className="mb-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={cx(
                "rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors",
                active === c
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-white text-ink-soft hover:border-brand/40 hover:text-brand",
              )}
            >
              {c}
            </button>
          ))}
        </Reveal>

        <RevealGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((a) => (
            <RevealItem key={a.slug}>
              <Link
                href={`/journal/${a.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-line bg-white p-8
                           transition-all duration-300 hover:-translate-y-1 hover:border-brand/30
                           hover:shadow-[0_24px_60px_-40px] hover:shadow-brand/70"
              >
                <div className="flex items-center gap-3">
                  <Pill tone={a.accent}>{a.category}</Pill>
                  <span className="u-tnum text-[12px] text-ink-faint">{a.readMin} min</span>
                </div>
                <h2 className="mt-5 font-sans text-[18px] font-semibold leading-snug tracking-normal text-ink">
                  {a.title}
                </h2>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink-soft">{a.excerpt}</p>
                <span className="mt-7 flex items-center justify-between border-t border-line pt-4 text-[12.5px] text-ink-faint">
                  <time dateTime={a.date} className="u-tnum">
                    {new Date(a.date).toLocaleDateString("en-GB", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </time>
                  <ArrowRight
                    size={15}
                    className="text-brand transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
