<p align="center"><img src="app/apple-icon.png" width="112" height="112" alt="Illinois Block I"></p>

# Built with Replit: UIUC Learnathon Wall

[![Live site](https://img.shields.io/badge/live-learnathon.bhanusadhu.com-FF5F05?style=flat)](https://learnathon.bhanusadhu.com)
![Next.js 16](https://img.shields.io/badge/Next.js-16-13294B?style=flat)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-13294B?style=flat)
![Deploys on Vercel](https://img.shields.io/badge/deploys%20on-Vercel-13294B?style=flat)

The website for the **Disruption Lab × Replit Learnathon**, a free, no experience needed build day at UIUC: **Saturday, Nov 7, 2026 · 12:00–2:45 PM · CIF Monumental Steps.** Before the event it is the event page. After the event it becomes a wall of every app people built.

**See it live: [learnathon.bhanusadhu.com](https://learnathon.bhanusadhu.com)**

![The landing page: Disruption Lab and Replit branding, a "Built with Replit" headline, a countdown terminal, and the sign-up button](docs/images/hero.png)

## At a glance

* **A product for a real event.** It has two audiences, students deciding whether to show up and the organizers running the day, and one job in each phase: get people to sign up, then show off what they shipped. It follows a funnel (interest → pre-event → post-event), and the post-event form is what gets an app onto the wall.
* **One site, two phases.** Pre-event it shows a countdown, three sign-up steps and an FAQ. Post-event the same page turns into a project wall with a screenshot, a one-liner, a live link and the builder's name and LinkedIn for each app. The headline copy, link preview and footer switch on their own once projects exist.
* **Built to be run by non-engineers.** Dates, forms, schedule, food, prizes and FAQ all live in [`data/event.ts`](data/event.ts). Leave a value empty and the site shows "TBA" or "opens soon" in its place. No CMS and no database.
* **Real engineering underneath.** A Google Form CSV becomes the wall in two commands: a dependency-free CSV parser, header matching that tolerates reworded questions, idempotent re-imports, and a Chrome screenshot pass that detects unpublished apps. Calendar invites, the link-preview image and the `.ics` file are generated from the same event data.

Written in TypeScript on Next.js 16, deployed on Vercel from `main`.

## What is on the site

| Section | What it shows |
| --- | --- |
| **Hero** | Disruption Lab @ UIUC × Replit branding, a live countdown ("LIVE NOW" during the event, "SHIPPED" after), and a button to whichever sign-up form is current |
| **Date sticker** (top right) | Click to open the event details: date, time, location, add to calendar, directions |
| **Event Guide** | The three forms in order (interest → pre-event → post-event), itinerary, awards, food, FAQ |
| **Project wall** | Six "your build here" placeholders before the event; every submitted app after it. Winners get a 🏆 ribbon and move to the top. A toolbar with **Surprise me** and a **Tour** view that auto-advances one build at a time (for the projector at demos) works on the placeholder slots now; search turns on once builds land |
| **Project pages** (`/p/<slug>`) | One page per build with its own link-preview image, so builders can share their project. Every card has a **Copy link** button |
| **Footer** | Disruption Lab Instagram, LinkedIn, website, and this repository |

Extras: add to calendar (Google Calendar, plus an `.ics` file for Apple and Outlook), a generated link-preview card for texts and social posts, a favicon and iPhone icon, a themed 404 page, and load-in and scroll animations that turn off for anyone with reduced motion enabled.

| Event Guide | Project wall |
| --- | --- |
| ![The Event Guide: three numbered form steps, then itinerary, prizes and food cards](docs/images/guide.png) | ![The project wall before the event: reserved "your build here" slots with a save-your-spot link](docs/images/wall.png) |

*Captured from the live site while the pre-event form, itinerary, food and prizes were still to be announced.*

## How it works

```mermaid
flowchart LR
  subgraph edit["You edit"]
    event["data/event.ts<br/>dates, forms, schedule, prizes, FAQ"]
    projects["data/projects.json<br/>the wall"]
  end
  csv["Google Form<br/>responses.csv"]
  importer["npm run import-form"]
  shots["npm run screenshots<br/>Chrome via playwright-core"]
  next["Next.js App Router<br/>static page, OG image, .ics route"]
  vercel["Vercel<br/>push to main deploys"]

  csv --> importer --> projects
  projects --> shots -->|"public/project-shots"| projects
  event --> next
  projects --> next
  next --> vercel
```

Event info and projects are plain files read at build time, so every change is a git commit and the live site is just `main`. The home page switches between its pre-event and post-event copy based on whether `data/projects.json` has any entries, and the project sort ([`lib/projects.ts`](lib/projects.ts)) puts winners first in prize order.

## Product decisions

* **Three forms, in order, with one required at each gate.** The interest form is open to anyone, the pre-event form is required to attend, and the post-event form is required to get on the wall. Each step stays "opens soon" until its link exists, and the main hero button always points at the furthest-along form (pre-event once it exists, interest until then).
* **The wall is the incentive.** Submitting a published Replit app is the only way onto it, which gives people a reason to finish and publish rather than stop at a half-built prototype. Winners get a 🏆 ribbon and move to the top.
* **Nothing to fill in by hand.** The form asks for a name, project name, one line, a `.replit.app` link, and optionally LinkedIn and a headshot. It does not ask for screenshots, because those are captured from the link.
* **Honest empty states.** Unannounced details show "TBA" or "opens soon" rather than invented placeholders, and the wall shows six reserved "your build here" slots that link to sign-up, so the page works as a call to action before any app exists.
* **The link is the marketing channel.** It gets texted and posted in bios, so the preview card is a product surface: pre-event it says "Free · No experience needed" and the date, post-event it shows the build count.
* **Accessible by default.** Scroll and load-in animations switch off for anyone with reduced motion enabled.

## Engineering

* **Static by design.** Event info and projects are typed files read at build time. There is no database, no API and no runtime server logic, so there is nothing to scale or secure on build day, and every content change is a reviewable git commit.
* **One source of truth.** The page, the preview image, the page metadata, the Google Calendar link and the `.ics` file all read [`data/event.ts`](data/event.ts), so a changed date or location cannot go out of sync across them.
* **A countdown that survives server rendering.** [`components/Terminal.tsx`](components/Terminal.tsx) renders a fixed placeholder on the server and starts ticking after mount, so there is no hydration mismatch. It moves through before, during and after states against the event's CST timestamps.
* **Standards-compliant calendar file.** [`lib/calendar.ts`](lib/calendar.ts) builds the `.ics` itself: UTC conversion of the CST start and end, RFC 5545 text escaping, and 75-octet line folding that counts bytes, not characters, so non-ASCII text cannot split mid-character. It is served from a statically generated route.
* **A form importer that tolerates edits.** [`scripts/import-form.mjs`](scripts/import-form.mjs) has its own RFC 4180 CSV parser (quoted fields, escaped quotes, newlines inside quotes, BOM stripping). Columns are matched by keyword, so rewording a question does not break the import, and a missing required column fails loudly with the headers it saw.
* **Safe to re-run.** Slugs come from the project title, a later submission replaces an earlier one, and existing screenshots, avatars and awards carry over. Incomplete rows are skipped and reported, never silently dropped.
* **A screenshot pass that reports what it could not do.** [`scripts/screenshots.mjs`](scripts/screenshots.mjs) drives the installed Chrome through `playwright-core`, allows for Replit cold starts, recognizes Replit's "this app isn't live yet" page, and ends with two lists: apps to ask to hit Publish, and slugs to retry.
* **Typed end to end.** Strict TypeScript, with the project and prize shapes in [`lib/types.ts`](lib/types.ts).

## Updating event info

**Almost everything lives in one file: [`data/event.ts`](data/event.ts).** Leave a value empty (`null` or `[]`) and the site shows "TBA" or "opens soon".

| Setting | What it controls |
| --- | --- |
| `forms.interest` | Interest form link. Live now. |
| `forms.pre` | Pre-event form (**required to attend**). Once set, it becomes the main hero button and step 02 goes live. |
| `forms.post` | Post-event form (**required to get on the wall**). Step 03 goes live and the empty wall slots link to it. |
| `itinerary` | Schedule rows, e.g. `{ time: "12:00 PM", title: "Kickoff", detail: "Intro to Replit Agent" }` |
| `food` | e.g. `"Pizza + drinks"` |
| `prizes` | Awards in display order, e.g. `{ name: "Grand Prize", reward: "Trophy + $200" }` |
| `faq` | Question and answer pairs in the FAQ card |
| `links` | Disruption Lab Instagram, LinkedIn, website, and this repo |
| `start` / `end` | Event time. Drives the countdown and the calendar links. |
| `siteUrl` | The live URL. Change it when the domain changes (see [Moving to a new domain](#moving-to-a-new-domain)). |

Push to `main` and the live site updates in about 30 seconds.

## Post-event form

This is the form people fill out to get their app on the wall. The importer reads its responses, so use these questions (the exact wording can vary, but keep the keywords in **bold**):

| Question | Type | Required | Tip |
| --- | --- | --- | --- |
| Full **name** | Short answer | ✓ | Don't put "project" or "app" in this title |
| **Project name** | Short answer | ✓ | |
| One-line **description** | Short answer | ✓ | Response validation → Length → max 120 characters |
| **Replit** app link | Short answer | ✓ | Response validation → Contains → `.replit.app` |
| **LinkedIn** profile URL | Short answer | | |
| **Headshot** | File upload (images, 1 file) | | Requires respondents to sign in with Google |

Put this in the form description: *"Before submitting, open your app in Replit and hit **Publish** so you have a `.replit.app` link. Unpublished apps can't go on the wall."*

You don't need to ask for screenshots. They are taken automatically from the Replit link.

## After the event: putting projects on the wall

```bash
# 1. Google Form → Responses → ⋮ → Download responses (.csv)
#    Save it as form-data/responses.csv
#    (Optional) Download the headshot uploads folder from Drive and unzip it to form-data/uploads
#    form-data/ is gitignored because it contains emails.

npm run import-form -- form-data/responses.csv --uploads form-data/uploads

# 2. Screenshot every app (uses your installed Chrome).
#    Lists anyone whose app isn't published on Replit yet, so you can follow up.
npm run screenshots

# 3. Check it locally, then commit + push.
npm run dev
```

* **Resubmissions:** run the import again. The latest submission per project title wins, and existing screenshots and awards are kept.
* **Retry failed screenshots:** `npm run screenshots -- <slug> <slug>`. Redo all of them with `-- --all`.

### Winners

1. Add the awards to `prizes` in `data/event.ts`.
2. Add `"award": "<award name>"` to each winning project in `data/projects.json`.

Winners get a 🏆 ribbon, move to the top of the wall, and are listed under their award in the Event Guide.

### Editing a project by hand

Each entry in [`data/projects.json`](data/projects.json):

```json
{
  "slug": "quad-eats",
  "title": "Quad Eats",
  "description": "Finds the shortest dining hall line on campus.",
  "url": "https://quad-eats.replit.app",
  "screenshot": "/project-shots/quad-eats.png",
  "creator": {
    "name": "Priya Natarajan",
    "linkedin": "https://www.linkedin.com/in/priya",
    "avatar": "/avatars/priya-natarajan.jpg"
  },
  "award": "Grand Prize"
}
```

`screenshot`, `linkedin`, `avatar` and `award` are optional. A missing screenshot shows the title on a dark screen, and a missing avatar shows initials.

## Link previews and icons

When the link is texted (iMessage, WhatsApp) or posted (Instagram bio, Discord, LinkedIn, X), apps show a preview card. It comes from:

| File | What it is |
| --- | --- |
| [`app/opengraph-image.tsx`](app/opengraph-image.tsx) | The 1200×630 preview image. Before the event it shows "Free · No experience needed" and the date; after, the number of builds. |
| [`app/layout.tsx`](app/layout.tsx) | The preview title and description. These also switch automatically once projects are added. |
| [`app/favicon.ico`](app/favicon.ico) | Browser tab icon (official Illinois Block I from cdn.brand.illinois.edu) |
| [`app/apple-icon.png`](app/apple-icon.png) | iPhone icon, used for Messages previews and home-screen shortcuts |

Apps cache previews, so after changing them, test with a fresh link such as `https://learnathon.bhanusadhu.com/?v=2`, or use [opengraph.xyz](https://www.opengraph.xyz).

## Moving to a new domain

1. In Vercel: **Project → Settings → Domains → Add**, and enter the new domain.
2. At the domain's registrar, add the DNS record Vercel shows. A subdomain is usually a `CNAME` to `cname.vercel-dns.com`; a root domain takes an `A` record.
3. Change `siteUrl` in `data/event.ts` to the new URL, then push. This keeps link previews and calendar invites pointing at the right place.
4. Optional: in Vercel, redirect the old domain to the new one.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Plain CSS in [`app/globals.css`](app/globals.css) on the Illinois palette (Illini blue and orange), Tailwind 4 for its base reset only, Geist for type |
| Data | Files in [`data/`](data/), no database |
| Tooling | Node scripts, `playwright-core` driving your installed Chrome for screenshots |
| Hosting | Vercel, with every push to `main` deployed to production |

```
app/            page, layout, 404, preview image, icons, calendar file route
components/     hero pieces, event guide, project cards, countdown terminal, scroll animations
data/           event.ts (event info) + projects.json (the wall)
docs/images/    screenshots used in this README
lib/            project sorting, calendar links, shared types
scripts/        import-form.mjs (CSV → projects.json), screenshots.mjs
public/         avatars/, project-shots/, brand/
```

## Run it locally

Requires Node 20+.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build, same as Vercel runs
```

The screenshot script needs Google Chrome installed; it does not download a browser.

## Credits

Built for [Disruption Lab @ UIUC](https://giesgroups.illinois.edu/disruptionlab/home/) and Replit.
