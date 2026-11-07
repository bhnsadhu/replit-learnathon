export type Creator = {
  name: string;
  linkedin?: string;
  /** Path under /public, e.g. "/avatars/jane-doe.jpg" */
  avatar?: string;
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  url: string;
  /** Path under /public, e.g. "/project-shots/my-app.png" */
  screenshot?: string;
  creator: Creator;
  /** Must match a prize name in data/event.ts to get a ribbon + sort to the top */
  award?: string;
};

export type Prize = {
  /** What a project's `award` is set to. Can be followed by ": reason", e.g. "Honorable Mention: Funniest App". */
  name: string;
  /** Heading in the guide, if different from `name` (e.g. plural). */
  title?: string;
  reward?: string;
};
