import { BrandLockup } from "@/components/BrandLockup";
import { EventPromo } from "@/components/EventPromo";
import { EventGuide } from "@/components/EventGuide";
import { Reveal } from "@/components/Reveal";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Terminal } from "@/components/Terminal";
import { WallBrowser } from "@/components/WallBrowser";
import { event, signupForm } from "@/data/event";
import { projects } from "@/lib/projects";

const TICKER =
  `BUILT TO LEARN ✦ BUILT TO SHARE ✦ BUILT WITH REPLIT ✦ BUILT AT ${event.school.toUpperCase()} ✦ SHIPPED FROM THE CIF STEPS ✦ DISRUPTION LAB × REPLIT ✦ `;

const EMPTY_SLOTS = 6;

export default function Home() {
  const count = projects.length;
  const live = count > 0;
  const winners = projects.filter((p) => p.award).length;

  return (
    <main>
      <Reveal />
      <SmoothScroll />
      <div className="ticker" aria-hidden="true">
        <span>{TICKER}</span>
        <span>{TICKER}</span>
      </div>

      <section className="hero">
        <BrandLockup />
        <div className="signalRow">
          <a className="signal" href={event.mapsUrl} target="_blank" rel="noreferrer">
            <i /> LIVE FROM THE {event.location.toUpperCase()} · NOV 7 · {event.time}
            <b>↗</b>
          </a>
        </div>
        <EventPromo />
        {/* .li closes Geist's side-bearing so REPLIT's L+I touch (see globals.css) */}
        <h1 aria-label="Built with Replit">
          <span aria-hidden="true" className="h1Line">
            Built with
          </span>
          <span aria-hidden="true" className="accent">
            Rep<span className="li">l</span>it
          </span>
        </h1>
        {/* heroStack is as wide as the hero line, so the terminal's edges match the text */}
        <div className="heroStack">
          <p className="heroCopy">
            {live ? `${count} experiments. ${count} live builds.` : "One afternoon. Zero experience needed."}
            <br />
            {live ? "One wall of ideas, all built by you." : "Bring an idea, leave with a live app."}
          </p>
          <Terminal builds={count} />
          <div className="ctaRow">
            {signupForm && (
              <a className="cta" href={signupForm} target="_blank" rel="noreferrer">
                <span>I&apos;M IN</span>
                {event.forms.pre ? "REGISTER (REQUIRED TO ATTEND)" : "FILL OUT THE INTEREST FORM"}
                <b>↗</b>
              </a>
            )}
            <a className="ctaGhost" href="#guide">
              EVENT GUIDE ↓
            </a>
          </div>
        </div>
        <a className="jump" href="#projects">
          ENTER THE WALL <span>↓</span>
        </a>
      </section>

      <EventGuide />

      <section className="wall" id="projects" aria-label="Learnathon project showcase">
        <div className="wallHeader">
          <p>PROJECT DIRECTORY</p>
          <span>
            {live
              ? `${count} BUILDS${winners ? ` · ${winners} WINNER${winners === 1 ? "" : "S"}` : ""} // ${event.dateShort}`
              : "WALL OPENS // NOV 7 2026"}
          </span>
        </div>
        <WallBrowser
          projects={projects}
          slots={{
            count: EMPTY_SLOTS,
            href: event.forms.post ?? signupForm,
            label: event.forms.post ? "SUBMIT YOUR BUILD ↗" : "SAVE YOUR SPOT ↗",
          }}
        />
      </section>

      <footer>
        <div>
          <b>{live ? count : event.dateStamp}</b>
          <span>{live ? "LIVE BUILDS" : "BUILD DAY"}</span>
        </div>
        <div className="footerMid">
          <p>
            Shipped from the CIF steps at the {event.name}, {event.school}
            <br />
            <strong>Powered by curiosity + Replit.</strong>
          </p>
          <nav className="socials" aria-label="Disruption Lab links">
            <a href={event.links.instagram} target="_blank" rel="noreferrer">
              INSTAGRAM ↗
            </a>
            <a href={event.links.linkedin} target="_blank" rel="noreferrer">
              LINKEDIN ↗
            </a>
            <a href={event.links.website} target="_blank" rel="noreferrer">
              DISRUPTION LAB ↗
            </a>
            <a href={event.links.repo} target="_blank" rel="noreferrer">
              REPOSITORY ↗
            </a>
          </nav>
        </div>
        <a href="#">BACK TO TOP ↑</a>
      </footer>
    </main>
  );
}
