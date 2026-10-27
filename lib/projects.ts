import raw from "@/data/projects.json";
import { event } from "@/data/event";
import type { Project } from "./types";

const prizeRank = (p: Project) => {
  if (!p.award) return Infinity;
  const i = event.prizes.findIndex((prize) => prize.name === p.award);
  return i === -1 ? event.prizes.length : i;
};

/** Winners first (in prize order), everyone else keeps their submission order. */
export const projects: Project[] = (raw as Project[])
  .map((p, i) => ({ p, i }))
  .sort((a, b) => prizeRank(a.p) - prizeRank(b.p) || a.i - b.i)
  .map(({ p }) => p);

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
