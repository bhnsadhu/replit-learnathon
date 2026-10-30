"use client";

import { useEffect, useRef, useState } from "react";
import { event, signupForm } from "@/data/event";
import { googleCalendarUrl, icsPath } from "@/lib/calendar";
import { ReplitMark } from "./ReplitMark";

export function EventPromo() {
  const prizes = event.prizes;
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const sticker = useRef<HTMLButtonElement>(null);

  // Escape or a tap anywhere else closes it, like any popover
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      sticker.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div className={open ? "eventPromo open" : "eventPromo"} ref={root}>
      <button
        type="button"
        className="eventSticker"
        ref={sticker}
        aria-expanded={open}
        aria-controls="event-details"
        onClick={() => setOpen((o) => !o)}
      >
        {/* the visible words are the accessible name; the braces are decoration */}
        <span>
          <span aria-hidden="true">{"{ "}</span>build day: nov 7<span aria-hidden="true">{" }"}</span>
        </span>
        <small>
          <i aria-hidden="true">▾</i> {open ? "CLOSE" : "SEE DETAILS"}
        </small>
      </button>
      <div
        className="eventPopover"
        id="event-details"
        role="dialog"
        data-lenis-prevent
        aria-label={`${event.name} details`}
      >
        <div className="eventInfo">
          <span className="eventPill">LEARNATHON</span>
          <strong>{event.name}</strong>
          <dl className="eventFacts">
            <dt>DATE</dt>
            <dd>{event.dateLabel}</dd>
            <dt>TIME</dt>
            <dd>{event.time}</dd>
            <dt>WHERE</dt>
            <dd>
              {event.location}
              <small>{event.locationDetail}</small>
            </dd>
            <dt>SAVE IT</dt>
            <dd className="calLinks">
              <a href={googleCalendarUrl} target="_blank" rel="noreferrer">
                + Google Calendar
              </a>
              <a href={icsPath} download>
                + Apple / Outlook
              </a>
            </dd>
            <dt>FOOD</dt>
            <dd>{event.food ?? "To be announced"}</dd>
            <dt>AWARDS</dt>
            <dd>
              {prizes.length === 0
                ? "To be announced"
                : prizes.map((p) => (
                    <span key={p.name} style={{ display: "block" }}>
                      {p.name}
                      {p.reward ? ` · ${p.reward}` : ""}
                    </span>
                  ))}
            </dd>
          </dl>
          <span className="eventActions">
            {signupForm && (
              <a href={signupForm} target="_blank" rel="noreferrer">
                {event.forms.pre ? "REGISTER ↗" : "I'M INTERESTED ↗"}
              </a>
            )}
            <a className="secondary" href="#guide" onClick={() => setOpen(false)}>
              FULL GUIDE ↓
            </a>
            <a className="secondary" href={event.mapsUrl} target="_blank" rel="noreferrer">
              GET DIRECTIONS ↗
            </a>
          </span>
        </div>
        <span className="eventArt" aria-hidden="true">
          <ReplitMark />
          <b>{event.dateStamp}</b>
          <small>BUILD DAY</small>
        </span>
      </div>
    </div>
  );
}
