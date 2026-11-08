import type { Prize } from "@/lib/types";

const school = "UIUC";

export type ItineraryItem = { time: string; title: string; detail?: string };

export const event = {
  /** Live URL. Change this when the site moves to a new domain (link previews + calendar use it). */
  siteUrl: "https://learnathon.bhanusadhu.com",
  name: "Disruption Lab × Replit Learnathon",
  shortName: `${school} Learnathon`,
  host: `Disruption Lab @ ${school}`,
  school,
  date: "2026-11-07",
  /** Champaign is on CST (UTC-6) by Nov 7. Used by the countdown and calendar links. */
  start: "2026-11-07T12:00:00-06:00",
  end: "2026-11-07T14:45:00-06:00",
  dateLabel: "Saturday, Nov 7, 2026",
  dateShort: "NOV 2026",
  dateStamp: "11.07",
  time: "12:00 – 2:45 PM",
  location: "CIF Monumental Steps",
  locationDetail: `Campus Instructional Facility, ${school}`,
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Campus+Instructional+Facility+University+of+Illinois+Urbana-Champaign",
  replitUrl: "https://replit.com",

  /** Disruption Lab contact links (footer, FAQ, brand chip). */
  links: {
    website: "https://giesgroups.illinois.edu/disruptionlab/home/",
    instagram: "https://www.instagram.com/uiuc_disruption",
    instagramHandle: "@uiuc_disruption",
    linkedin: "https://www.linkedin.com/company/disruption-lab-at-gies/",
    /** This site's source code */
    repo: "https://github.com/bhnsadhu/disruption-lab-replit-learnathon",
  },

  faq: [
    {
      q: "Did you need coding experience?",
      a: "Nope. That was the whole point. Everyone learned by building with Replit, from idea to live app.",
    },
    { q: "What did people bring?", a: "A laptop and a charger." },
    {
      q: "Did it cost anything?",
      a: "No. It was free, and lunch was on us.",
    },
    {
      q: "What did builders get?",
      a: "Pizza + Coke, Replit credits and merch. The best builds split $150 in prizes.",
    },
    { q: "Who could come?", a: "Any UIUC student, any major, any skill level." },
    {
      q: "How did sign-up work?",
      a: "RSVP on Luma, then the pre-event form (steps 01 and 02 above). Both were required.",
    },
    {
      q: "How did a project get on the wall?",
      a: "Builders published their app on Replit, then submitted the post-event form (step 03) at 2:10.",
    },
  ],

  /** Sign-up links. null = shows "opens soon". */
  forms: {
    /** Luma RSVP. Required. */
    rsvp: "https://luma.com/vei2b7gt" as string | null,
    /** Google Form, before the event. Required. */
    pre: "https://docs.google.com/forms/d/e/1FAIpQLSc21c8WoF-1-V1iz3byfTWJiTs9PG5Yp7hODP8SuR9RsUqg0A/viewform" as
      | string
      | null,
    /** Google Form, at 2:10 on the day. Required, and it's how a build gets on the wall. */
    post: "https://docs.google.com/forms/d/e/1FAIpQLSeDv1ETCDcHpNPI2XM758u5vAyUb7QZJAQIsAFjsET_JLL01w/viewform" as
      | string
      | null,
  },

  /** Special guest, shown in the details popover and the guide. */
  guest: {
    name: "Brandon Middleton",
    role: "Head of Education at Replit",
    detail: "Opened the day with a talk and a live demo of Replit Agent.",
    linkedin: "https://www.linkedin.com/in/brmiddle/",
    /** Path under /public */
    photo: "/guest/brandon-middleton.jpg",
  },

  /** Where the credits button goes. The event coupon link is retired, so it points at replit.com. null hides the button. */
  creditsUrl: "https://replit.com" as string | null,

  /** What every attendee got, on top of food. */
  perks: "Lunch was on us. Plus Replit credits and merch for every builder.",

  /** e.g. { time: "12:00 PM", title: "Kickoff", detail: "Intro to Replit Agent" }. Empty = TBA. */
  itinerary: [
    { time: "12:00–12:45", title: "Welcome, Replit intro, Brandon's talk + live demo" },
    { time: "12:45–2:10", title: "Build time, lunch + hands-on support" },
    { time: "2:10–2:20", title: "Publish and submit your app + post-event survey" },
    { time: "2:20–2:45", title: "Showcase, awards + closing" },
  ] as ItineraryItem[],

  /** e.g. "Pizza + drinks". null = TBA. */
  food: "Pizza + Coke" as string | null,

  /** In display order (Grand Prize first). Set a project's `award` to one of these names. Empty = TBA. */
  prizes: [
    { name: "Best Overall App" },
    { name: "Most Innovative Idea" },
    { name: "Best Social Impact" },
    { name: "Best Design & UX" },
    { name: "Best Business Potential" },
    { name: "Best Beginner Build" },
    /** Goes to a few builds, picked on the day. Set `award` to "Honorable Mention: <reason>". */
    {
      name: "Honorable Mention",
      title: "Honorable Mentions",
      reward: "A few more, picked on the day for standout builds.",
    },
  ] as Prize[],
};

/** The form the main "sign up" buttons should point at right now. */
export const signupForm = event.forms.rsvp;

/** True once the event has finished. Flips the invite copy (RSVP, countdown, calendar) to a recap. */
export const eventOver = Date.now() > Date.parse(event.end);
