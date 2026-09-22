/**
 * A single article.
 *
 * Typeset for actual reading: a 68-character measure, 1.85 line height, and
 * headings that come from the body array rather than from a rich-text editor.
 * A paragraph prefixed with "## " renders as an H2 — enough structure for a
 * clinic's writing without introducing a markdown dependency.
 */

import { Link, useParams } from "wouter";
import { ArrowLeft, CalendarCheck, ShieldCheck } from "lucide-react";

import { BRAND } from "@/lib/brand";
import { ARTICLES, articleBySlug } from "@/data/clinic";
import { Avatar, ButtonLink, Pill, Reveal, RevealGroup, RevealItem } from "@/components/ui";
import { NotFound } from "@/pages/NotFound";

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = articleBySlug(slug ?? "");

  if (!article) return <NotFound />;

  const related = ARTICLES.filter((a) => a.slug !== article.slug);

  return (
    <>
      <header className="u-aurora relative">
        <div className="u-wrap-narrow relative z-10 py-12 lg:py-16">
          <Reveal>
            <Link
              href="/journal"
              className="inline-flex items-center gap-2 text-[13.5px] font-medium text-ink-soft
                         transition-colors hover:text-brand"
            >
              <ArrowLeft size={15} /> Journal
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Pill tone={article.accent}>{article.category}</Pill>
              <span className="u-tnum text-[12.5px] text-ink-faint">
                {article.readMin} min read ·{" "}
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString("en-GB", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </time>
              </span>
            </div>
            <h1 className="mt-5 text-[clamp(32px,5.2vw,56px)]">{article.title}</h1>
            <p className="mt-5 text-[17.5px] leading-[1.8] text-ink-soft">{article.excerpt}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 flex items-center gap-3.5 border-y border-line py-5">
              <Avatar initials="OG" size={44} />
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-ink">
                  Reviewed by {BRAND.doctor}
                </p>
                <p className="flex items-center gap-1.5 text-[12.5px] text-mint">
                  <ShieldCheck size={13} /> Clinically reviewed ·{" "}
                  <span className="u-tnum text-ink-faint">
                    {new Date(article.date).toLocaleDateString("en-GB", {
                      month: "short", year: "numeric",
                    })}
                  </span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      <article className="u-wrap-narrow pb-16">
        {article.body.map((para, i) => {
          if (para.startsWith("## ")) {
            return (
              <Reveal key={i}>
                <h2 className="mt-12 text-[clamp(24px,3.2vw,34px)]">{para.slice(3)}</h2>
              </Reveal>
            );
          }
          /* The placeholder marker is styled as a notice rather than as body
             copy, so it cannot be mistaken for the clinic's own words if a
             screenshot of this page ends up in front of the client. */
          if (para.startsWith("[PLACEHOLDER")) {
            return (
              <Reveal key={i}>
                <p className="mt-8 rounded-2xl border border-coral/25 bg-coral-wash p-5 text-[13.5px] leading-relaxed text-ink-soft">
                  {para}
                </p>
              </Reveal>
            );
          }
          return (
            <Reveal key={i}>
              <p className="mt-6 max-w-[68ch] text-[17px] leading-[1.85] text-ink-soft">{para}</p>
            </Reveal>
          );
        })}

        <Reveal>
          <div className="mt-16 rounded-[28px] bg-brand p-9 text-white sm:p-12">
            <h2 className="max-w-lg text-[clamp(24px,3.2vw,34px)] text-white">
              If any of this sounds like you, the first step is a conversation
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/65">
              Forty minutes with {BRAND.doctor}, in private, with no obligation to go further.
            </p>
            <ButtonLink href="/book" tone="white" size="lg" className="mt-8">
              <CalendarCheck size={17} /> Book a consultation
            </ButtonLink>
          </div>
        </Reveal>
      </article>

      <section className="bg-sand py-16">
        <div className="u-wrap">
          <Reveal>
            <p className="u-eyebrow mb-6">Keep reading</p>
          </Reveal>
          <RevealGroup className="grid gap-4 md:grid-cols-2">
            {related.map((a) => (
              <RevealItem key={a.slug}>
                <Link
                  href={`/journal/${a.slug}`}
                  className="flex h-full flex-col rounded-3xl border border-line bg-white p-7
                             transition-colors hover:border-brand/30"
                >
                  <Pill tone={a.accent}>{a.category}</Pill>
                  <h3 className="mt-4 font-sans text-[16.5px] font-semibold leading-snug tracking-normal text-ink">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{a.excerpt}</p>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
