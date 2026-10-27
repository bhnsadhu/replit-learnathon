"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { scrollToEl } from "./SmoothScroll";
import { Tour } from "./Tour";

const matches = (p: Project, q: string) =>
  [p.title, p.description, p.creator.name, p.award ?? ""].some((f) => f.toLowerCase().includes(q));

/** The live wall: search, wall/tour views and "surprise me". Only rendered once projects exist. */
export function WallBrowser({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"wall" | "tour">("wall");
  const [tourIndex, setTourIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const bar = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();
  const shown = q ? projects.filter((p) => matches(p, q)) : projects;
  const visible = new Set(shown.map((p) => p.slug));
  const buildIndex = new Map(projects.map((p, i) => [p.slug, i]));
  const tourAt = Math.min(tourIndex, Math.max(shown.length - 1, 0));

  // the highlight is a one-shot flash
  useEffect(() => {
    if (!picked) return;
    const t = setTimeout(() => setPicked(null), 2200);
    return () => clearTimeout(t);
  }, [picked]);

  // the grid and the tour are very different heights, so jump back to the top of the wall
  // (the toolbar itself is sticky, so the section is what tells us we've scrolled past)
  const lastView = useRef(view);
  useEffect(() => {
    if (lastView.current === view) return;
    lastView.current = view;
    const wall = bar.current?.closest("section");
    if (wall && wall.getBoundingClientRect().top < 0) scrollToEl(wall);
  }, [view]);

  const surprise = () => {
    const current = view === "tour" ? shown[tourAt]?.slug : picked;
    const pool = shown.length > 1 ? shown.filter((p) => p.slug !== current) : shown;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (!pick) return;
    if (view === "tour") return setTourIndex(shown.indexOf(pick));
    setPicked(pick.slug);
    const el = document.getElementById(pick.slug);
    if (el) scrollToEl(el);
  };

  return (
    <>
      <div className="wallBar" ref={bar}>
        <label className="wallSearch">
          <span aria-hidden="true">$ grep</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="builds, ideas, builders"
            aria-label="Search builds"
          />
        </label>
        <div className="viewToggle" role="group" aria-label="View">
          <button type="button" aria-pressed={view === "wall"} onClick={() => setView("wall")}>
            WALL
          </button>
          <button type="button" aria-pressed={view === "tour"} onClick={() => setView("tour")}>
            TOUR
          </button>
        </div>
        <button type="button" className="surprise" onClick={surprise} disabled={!shown.length}>
          SURPRISE ME ⤨
        </button>
        <span className="wallCount" aria-live="polite">
          {q ? `${shown.length} OF ${projects.length}` : projects.length} BUILDS
        </span>
      </div>

      {view === "tour" && shown.length > 0 && (
        <Tour projects={shown} index={tourAt} onIndex={setTourIndex} buildIndex={buildIndex} />
      )}

      {/* stays mounted in tour view so Reveal's scroll animations keep their elements */}
      <div className="grid" hidden={view === "tour"}>
        {projects.map((p, i) => (
          <ProjectCard
            key={p.slug}
            project={p}
            index={i}
            hidden={!visible.has(p.slug)}
            picked={picked === p.slug}
          />
        ))}
      </div>

      {shown.length === 0 && (
        <div className="noMatch">
          <p>
            <b>grep:</b> no builds match &ldquo;{query.trim()}&rdquo;
          </p>
          <button type="button" onClick={() => setQuery("")}>
            CLEAR SEARCH
          </button>
        </div>
      )}
    </>
  );
}
