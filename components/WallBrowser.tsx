"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/types";
import { ProjectCard, SlotCard } from "./ProjectCard";
import { scrollToEl } from "./SmoothScroll";
import { ProjectStage, SlotStage } from "./Stage";
import { Tour } from "./Tour";

const matches = (p: Project, q: string) =>
  [p.title, p.description, p.creator.name, p.award ?? ""].some((f) => f.toLowerCase().includes(q));

type Slots = { count: number; href?: string | null; label: string };

/**
 * The wall: search, wall/tour views and "surprise me".
 * Before the event it's reserved slots: tour and surprise work on them, search waits for real builds.
 */
export function WallBrowser({ projects, slots }: { projects: Project[]; slots: Slots }) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"wall" | "tour">("wall");
  const [tourIndex, setTourIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const bar = useRef<HTMLDivElement>(null);

  const preview = projects.length === 0;
  const q = preview ? "" : query.trim().toLowerCase();
  const shown = q ? projects.filter((p) => matches(p, q)) : projects;
  const visible = new Set(shown.map((p) => p.slug));
  const buildIndex = new Map(projects.map((p, i) => [p.slug, i]));
  // what the tour and "surprise me" move through: slot-1..slot-N before the event, else the search results
  const items = preview
    ? Array.from({ length: slots.count }, (_, i) => ({ key: `slot-${i + 1}`, label: `slot ${i + 1}` }))
    : shown.map((p) => ({ key: p.slug, label: p.title }));
  const tourAt = Math.min(tourIndex, Math.max(items.length - 1, 0));

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
    const current = view === "tour" ? items[tourAt]?.key : picked;
    const pool = items.length > 1 ? items.filter((it) => it.key !== current) : items;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (!pick) return;
    if (view === "tour") return setTourIndex(items.indexOf(pick));
    setPicked(pick.key);
    const el = document.getElementById(pick.key);
    if (el) scrollToEl(el);
  };

  return (
    <>
      <div className="wallBar" ref={bar}>
        <label className="wallSearch">
          <span aria-hidden="true">$ grep</span>
          <input
            type="search"
            value={preview ? "" : query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={preview ? "search opens once builds land" : "builds, ideas, builders"}
            aria-label="Search builds"
            disabled={preview}
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
        <button type="button" className="surprise" onClick={surprise} disabled={!items.length}>
          SURPRISE ME ⤨
        </button>
        <span className="wallCount" aria-live="polite">
          {preview
            ? `${slots.count} SLOTS OPEN`
            : `${q ? `${shown.length} OF ${projects.length}` : projects.length} BUILDS`}
        </span>
      </div>

      {view === "tour" && items.length > 0 && (
        <Tour items={items} index={tourAt} onIndex={setTourIndex}>
          {preview ? (
            <SlotStage position={tourAt} total={slots.count} href={slots.href} label={slots.label} />
          ) : (
            <ProjectStage
              project={shown[tourAt]}
              number={buildIndex.get(shown[tourAt].slug) ?? tourAt}
              position={tourAt}
              total={shown.length}
            />
          )}
        </Tour>
      )}

      {/* stays mounted in tour view so Reveal's scroll animations keep their elements */}
      <div className="grid" hidden={view === "tour"}>
        {preview
          ? items.map((it, i) => (
              <SlotCard
                key={it.key}
                id={it.key}
                index={i}
                href={slots.href}
                label={slots.label}
                picked={picked === it.key}
              />
            ))
          : projects.map((p, i) => (
              <ProjectCard
                key={p.slug}
                project={p}
                index={i}
                hidden={!visible.has(p.slug)}
                picked={picked === p.slug}
              />
            ))}
      </div>

      {!preview && shown.length === 0 && (
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
