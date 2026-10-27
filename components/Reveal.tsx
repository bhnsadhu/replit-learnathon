"use client";

import { useEffect } from "react";

/** Things that rise into view on scroll. Hero has its own load-in animation in CSS. */
const SELECTOR = ".wallHeader, .guideCard, .card, footer > *";

export function Reveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = [...document.querySelectorAll<HTMLElement>(SELECTOR)];
    // stagger siblings in the same row of a 3-column grid
    for (const el of els) {
      const i = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
      el.style.setProperty("--d", `${(i % 3) * 90}ms`);
    }
    document.documentElement.classList.add("reveal-ready");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          // a data attribute, not a class: React rewrites className on re-render and would drop it
          (e.target as HTMLElement).dataset.in = "";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
