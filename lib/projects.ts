import raw from "@/data/projects.json";
import { event } from "@/data/event";
import type { Project } from "./types";

/** "Honorable Mention: Funniest App" belongs to the "Honorable Mention" prize. */
export const wonPrize = (award: string | undefined, prize: string) =>
  award === prize || Boolean(award?.startsWith(`${prize}:`));

/** The text after "Prize name:", if any. */
export const awardReason = (award: string, prize: string) => award.slice(prize.length + 1).trim();

const prizeRank = (p: Project) => {
  if (!p.award) return Infinity;
  const i = event.prizes.findIndex((prize) => wonPrize(p.award, prize.name));
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
