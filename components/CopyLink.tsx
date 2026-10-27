"use client";

import { useState } from "react";
import { event } from "@/data/event";

/** Copies a project's share page URL (/p/slug), which has its own link-preview card. */
export function CopyLink({ slug, className = "copyLink" }: { slug: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${event.siteUrl}/p/${slug}`);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 1800);
  };

  return (
    <button type="button" className={className} onClick={copy} aria-live="polite">
      {state === "copied" ? "COPIED ✓" : state === "failed" ? "COPY FAILED" : "COPY LINK"}
    </button>
  );
}
