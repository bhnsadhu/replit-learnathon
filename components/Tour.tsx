"use client";

import { useEffect, useState } from "react";

const SECONDS = 8;

/**
 * One build at a time, auto-advancing. Made for a projector at demos and awards.
 * The progress bar's CSS animation is the timer: pausing it pauses the tour, and its end advances it.
 * `children` is the current stage (a ProjectStage or SlotStage).
 */
export function Tour({
  items,
  index,
  onIndex,
  children,
}: {
  items: { key: string; label: string }[];
  index: number;
  onIndex: (i: number) => void;
  children: React.ReactNode;
}) {
  const [playing, setPlaying] = useState(true);
  const n = items.length;
  const current = items[index].key;
  const go = (i: number) => onIndex((i + n) % n);

  // reduced-motion users get a manual slideshow (and the global rule kills the timer animation anyway)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.key === "ArrowRight") go(index + 1);
      else if (e.key === "ArrowLeft") go(index - 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <section className="tour" aria-roledescription="carousel" aria-label="Project tour">
      <div className="tourStage" key={current} aria-live={playing ? "off" : "polite"}>
        {children}
      </div>

      <div className="tourControls">
        <button type="button" onClick={() => go(index - 1)} aria-label="Previous build">
          ←
        </button>
        <button
          type="button"
          className="tourPlay"
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? "Pause tour" : "Play tour"}
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <button type="button" onClick={() => go(index + 1)} aria-label="Next build">
          →
        </button>
        <div className="tourProgress" aria-hidden="true">
          <i
            key={current}
            style={{ animationDuration: `${SECONDS}s`, animationPlayState: playing ? "running" : "paused" }}
            onAnimationEnd={() => go(index + 1)}
          />
        </div>
        <span className="tourStatus">{playing ? `TOURING · ${SECONDS}S EACH` : "PAUSED · ← → TO BROWSE"}</span>
      </div>

      {n > 1 && (
        <div className="tourDots">
          {items.map((item, i) => (
            <button
              key={item.key}
              type="button"
              aria-label={`Go to ${item.label}`}
              aria-current={i === index || undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
