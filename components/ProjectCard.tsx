import type { Project } from "@/lib/types";
import { initials } from "@/lib/projects";
import { CopyLink } from "./CopyLink";

const TILTS = ["-0.65deg", "0deg", "0.65deg", "0deg"];

export const tiltFor = (index: number) => TILTS[index % TILTS.length];

export const buildLabel = (index: number) => `BUILD_${String(index + 1).padStart(2, "0")}`;

export function ProjectCard({
  project,
  index,
  hidden,
  picked,
}: {
  project: Project;
  index: number;
  hidden?: boolean;
  /** Just landed on by "Surprise me" */
  picked?: boolean;
}) {
  const { creator } = project;
  const hasAvatar = Boolean(creator.avatar);

  return (
    <article
      id={project.slug}
      hidden={hidden}
      className={["card", project.award && "winner", picked && "picked"].filter(Boolean).join(" ")}
      style={{ "--tilt": tiltFor(index) } as React.CSSProperties}
    >
      {project.award && <span className="award">🏆 {project.award.toUpperCase()}</span>}
      <a
        className="projectLink"
        href={project.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${project.title}`}
      >
        <div className="screen">
          {project.screenshot ? (
            <img loading="lazy" src={project.screenshot} alt={`Screenshot of ${project.title}`} />
          ) : (
            <div className="screenFallback" aria-hidden="true">
              {project.title}
            </div>
          )}
          <span className="screenLabel">{buildLabel(index)}</span>
        </div>
        <div className="cardBody">
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <span className="launch">LAUNCH PROJECT ↗</span>
        </div>
      </a>
      <CopyLink slug={project.slug} />
      {creator.linkedin ? (
        <a
          className={hasAvatar ? "creator creatorWithAvatar" : "creator"}
          href={creator.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label={`${creator.name} on LinkedIn`}
        >
          <span>{initials(creator.name)}</span>
          {creator.name}
          <b>in ↗</b>
        </a>
      ) : (
        <div className={hasAvatar ? "creator creatorWithAvatar" : "creator"}>
          <span>{initials(creator.name)}</span>
          {creator.name}
        </div>
      )}
      {hasAvatar && (
        <img className="avatar" src={creator.avatar} alt={`${creator.name} profile photo`} />
      )}
    </article>
  );
}

export function SlotCard({
  index,
  href,
  label,
}: {
  index: number;
  href?: string | null;
  label: string;
}) {
  const body = (
    <>
      <div className="screen">
        <div className="slotScreen" aria-hidden="true">
          <span>
            <b>$</b> replit deploy
          </span>
          <span>
            awaiting build… <em>▮</em>
          </span>
        </div>
        <span className="screenLabel">{buildLabel(index)}</span>
      </div>
      <div className="cardBody">
        <h2>Your build here</h2>
        <p>This slot is reserved. Ship something on Nov 7 and it lands on the wall.</p>
        {href && <span className="launch">{label}</span>}
      </div>
      <div className="creator">
        <span>?</span>
        you, probably
      </div>
    </>
  );

  return (
    <article
      className="card slot"
      style={{ "--tilt": tiltFor(index) } as React.CSSProperties}
      aria-label="Empty project slot"
    >
      {href ? (
        <a
          className="projectLink"
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label.replace(" ↗", "")}
        >
          {body}
        </a>
      ) : (
        body
      )}
    </article>
  );
}
