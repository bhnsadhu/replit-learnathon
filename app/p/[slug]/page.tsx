import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectStage } from "@/components/Stage";
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
        <ProjectStage project={p} number={i} position={i} total={projects.length} Heading="h1" />
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
