import { event } from "@/data/event";
import { googleCalendarUrl, icsPath } from "@/lib/calendar";
import { projects } from "@/lib/projects";

const STEPS = [
  {
    key: "interest",
    tag: "OPEN TO ANYONE",
    title: "Interest form",
    copy: "Curious? Drop your name and we'll keep you posted.",
    cta: "FILL IT OUT ↗",
    pending: "OPENS SOON",
    required: false,
  },
  {
    key: "pre",
    tag: "REQUIRED TO ATTEND",
    title: "Pre-event form",
    copy: "Fill this out before Nov 7. You need it to come build with us.",
    cta: "REGISTER ↗",
    pending: "OPENS SOON",
    required: true,
  },
  {
    key: "post",
    tag: "REQUIRED FOR THE WALL",
    title: "Post-event form",
    copy: "Shipped something? Submit your Replit link. No form, no spot on the wall.",
    cta: "SUBMIT YOUR BUILD ↗",
    pending: "OPENS NOV 7",
    required: true,
  },
] as const;

export function EventGuide() {
  const { itinerary, prizes, food, faq, links } = event;

  return (
    <section className="guide" id="guide" aria-label="Event guide">
      <div className="wallHeader">
        <h2>EVENT GUIDE</h2>
        <span>
          {event.dateLabel.toUpperCase()} // {event.time} // {event.location.toUpperCase()}
        </span>
      </div>

      <div className="steps">
        {STEPS.map((step, i) => {
          const url = event.forms[step.key];
          return (
            <article className="guideCard" key={step.key}>
              <span className="stepNum">{String(i + 1).padStart(2, "0")}</span>
              <span className={step.required ? "stepTag req" : "stepTag"}>{step.tag}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
              {url ? (
                <a className="stepBtn" href={url} target="_blank" rel="noreferrer">
                  {step.cta}
                </a>
              ) : (
                <span className="stepBtn off">{step.pending}</span>
              )}
            </article>
          );
        })}
      </div>

      <div className="infoGrid">
        <article className="guideCard">
          <span className="infoLabel">ITINERARY</span>
          {itinerary.length ? (
            <ol className="itinList">
              {itinerary.map((item) => (
                <li key={`${item.time}-${item.title}`}>
                  <b>{item.time}</b>
                  <span>
                    {item.title}
                    {item.detail && <small>{item.detail}</small>}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <>
              <span className="tba">TBA</span>
              <p>
                Full schedule drops before Nov 7. Block off {event.time} at the {event.location}.
              </p>
            </>
          )}
          <div className="calRow">
            <a className="calBtn" href={googleCalendarUrl} target="_blank" rel="noreferrer">
              + GOOGLE CALENDAR
            </a>
            <a className="calBtn" href={icsPath} download>
              + APPLE / OUTLOOK
            </a>
          </div>
        </article>

        <article className="guideCard">
          <span className="infoLabel">PRIZES + AWARDS</span>
          {prizes.length ? (
            <ul className="prizeList">
              {prizes.map((prize) => {
                const winner = projects.find((p) => p.award === prize.name);
                return (
                  <li key={prize.name}>
                    <b>🏆 {prize.name}</b>
                    {prize.reward && <small>{prize.reward}</small>}
                    {winner && (
                      <a href={winner.url} target="_blank" rel="noreferrer">
                        → {winner.title} · {winner.creator.name}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <>
              <span className="tba">TBA</span>
              <p>Winners take home awards, plus a 🏆 ribbon and the top spot on the wall.</p>
            </>
          )}
        </article>

        <article className="guideCard">
          <span className="infoLabel">FOOD</span>
          {food ? (
            <p className="foodLine">{food}</p>
          ) : (
            <>
              <span className="tba">TBA</span>
              <p>There will be food. Menu coming soon.</p>
            </>
          )}
        </article>

        <article className="guideCard faqCard">
          <span className="infoLabel">FAQ</span>
          <dl className="faqList">
            {faq.map((item) => (
              <div key={item.q}>
                <dt>{item.q}</dt>
                <dd>{item.a}</dd>
              </div>
            ))}
          </dl>
          <p className="faqMore">
            Still have questions? DM{" "}
            <a href={links.instagram} target="_blank" rel="noreferrer">
              {links.instagramHandle}
            </a>{" "}
            on Instagram.
          </p>
        </article>
      </div>
    </section>
  );
}
