import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLink } from "@/components/CopyLink";
import { buildLabel } from "@/components/ProjectCard";
import { event } from "@/data/event";
import { projectBySlug, projects } from "@/lib/projects";

// One page per build, so a builder can share their own project with its own link preview
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = projectBySlug((await params).slug);
  if (!p) return {};
  const title = `${p.title} by ${p.creator.name} | Built with Replit at ${event.school}`;
  return {
    title,
    description: p.description,
    openGraph: {
      title,
      description: p.description,
      type: "website",
      url: `/p/${p.slug}`,
      siteName: `${event.school} Learnathon`,
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title, description: p.description },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();

  const i = projects.indexOf(p);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  return (
    <main className="placard">
      <header className="placardTop">
        <Link className="ctaGhost" href={`/#${p.slug}`}>
          ← BACK TO THE WALL
        </Link>
        <span>
          {event.name.toUpperCase()} · {event.school} · {event.dateShort}
        </span>
      </header>

      <section className="tourStage">
        <a
          className="screen tourScreen"
          href={p.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${p.title}`}
        >
          {p.screenshot ? (
            <img src={p.screenshot} alt={`Screenshot of ${p.title}`} />
          ) : (
            <div className="screenFallback" aria-hidden="true">
              {p.title}
            </div>
          )}
        </a>
        <div className="tourInfo">
          <p className="tourMeta">
            {buildLabel(i)}
            <span>
              {" "}
              · {i + 1} OF {projects.length}
            </span>
          </p>
          {p.award && <span className="tourAward">🏆 {p.award.toUpperCase()}</span>}
          <h1>{p.title}</h1>
          <p className="tourDesc">{p.description}</p>
          <p className="tourBy">
            BY{" "}
            {p.creator.linkedin ? (
              <a href={p.creator.linkedin} target="_blank" rel="noreferrer">
                {p.creator.name} <b>in ↗</b>
              </a>
            ) : (
              p.creator.name
            )}
          </p>
          <div className="tourActions">
            <a className="cta" href={p.url} target="_blank" rel="noreferrer">
              <span>RUN</span>
              LAUNCH PROJECT
              <b>↗</b>
            </a>
            <CopyLink slug={p.slug} className="ctaGhost" />
          </div>
        </div>
      </section>

      {projects.length > 1 && (
        <nav className="placardNav" aria-label="More builds">
          <Link href={`/p/${prev.slug}`}>← {prev.title}</Link>
          <Link href={`/p/${next.slug}`}>{next.title} →</Link>
        </nav>
      )}
    </main>
  );
}
