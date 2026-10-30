import type { Project } from "@/lib/types";
import { CopyLink } from "./CopyLink";
import { buildLabel } from "./ProjectCard";

/** The big screenshot + info layout. Goes inside a .tourStage (tour view and /p/slug pages). */
export function ProjectStage({
  project: p,
  number,
  position,
  total,
  Heading = "h3",
}: {
  project: Project;
  /** Position on the full wall, so BUILD_07 stays BUILD_07 while searching */
  number: number;
  position: number;
  total: number;
  Heading?: "h1" | "h3";
}) {
  return (
    <>
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
          {buildLabel(number)}
          <span>
            {" "}
            · {position + 1} OF {total}
          </span>
        </p>
        {p.award && <span className="tourAward">🏆 {p.award.toUpperCase()}</span>}
        <Heading>{p.title}</Heading>
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
    </>
  );
}

/** Same layout for a reserved slot before the event. */
export function SlotStage({
  position,
  total,
  href,
  label,
}: {
  position: number;
  total: number;
  href?: string | null;
  label: string;
}) {
  const screen = (
    <div className="slotScreen" aria-hidden="true">
      <span>
        <b>$</b> replit deploy
      </span>
      <span>
        awaiting build… <em>▮</em>
      </span>
    </div>
  );

  return (
    <>
      {href ? (
        <a className="screen tourScreen tourSlot" href={href} target="_blank" rel="noreferrer" tabIndex={-1}>
          {screen}
        </a>
      ) : (
        <div className="screen tourScreen tourSlot">{screen}</div>
      )}
      <div className="tourInfo">
        <p className="tourMeta">
          {buildLabel(position)}
          <span>
            {" "}
            · {position + 1} OF {total}
          </span>
        </p>
        <h3 className="tourSlotTitle">Your build here</h3>
        <p className="tourDesc">This slot is reserved. Ship something on Nov 7 and it lands on the wall.</p>
        <p className="tourBy">BY YOU, PROBABLY</p>
        {href && (
          <div className="tourActions">
            <a className="cta" href={href} target="_blank" rel="noreferrer">
              <span>I&apos;M IN</span>
              {label.replace(" ↗", "")}
              <b>↗</b>
            </a>
          </div>
        )}
      </div>
    </>
  );
}
