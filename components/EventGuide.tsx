import { event } from "@/data/event";
import { googleCalendarUrl, icsPath } from "@/lib/calendar";
import { awardReason, projects, wonPrize } from "@/lib/projects";

const STEPS = [
  {
    key: "rsvp",
    tag: "REQUIRED TO ATTEND",
    title: "RSVP on Luma",
    copy: "Reserve your spot before Nov 7. Bring your laptop and an idea, we'll handle the rest.",
    cta: "RSVP ↗",
    pending: "OPENS SOON",
    required: true,
  },
  {
    key: "pre",
    tag: "REQUIRED · BEFORE NOV 7",
    title: "Pre-event form",
    copy: "Fill this out after you RSVP so we know who's coming. You need it to come build with us.",
    cta: "FILL IT OUT ↗",
    pending: "OPENS SOON",
    required: true,
  },
  {
    key: "post",
    tag: "REQUIRED · AT 2:10 PM",
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
          {event.dateLabel.toUpperCase()} // {event.time} //{" "}
          {event.location.toUpperCase()}
        </span>
      </div>

      <div className="steps">
        {STEPS.map((step, i) => {
          const url = event.forms[step.key];
          return (
            <article className="guideCard" key={step.key}>
              <span className="stepNum">{String(i + 1).padStart(2, "0")}</span>
              <span className={step.required ? "stepTag req" : "stepTag"}>
                {step.tag}
              </span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
              {url ? (
                <a
                  className="stepBtn"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                >
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
              <li className="itinWhere">
                <b>WHERE</b>
                <span>
                  <a href={event.mapsUrl} target="_blank" rel="noreferrer">
                    {event.location} ↗
                  </a>
                  <small>{event.locationDetail}</small>
                </span>
              </li>
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
                Full schedule drops before Nov 7. Block off {event.time} at the{" "}
                {event.location}.
              </p>
            </>
          )}
          <div className="calRow">
            <a
              className="calBtn"
              href={googleCalendarUrl}
              target="_blank"
              rel="noreferrer"
            >
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
            <>
              <ul className="prizeList">
                {prizes.map((prize) => {
                  const winners = projects.filter((p) => wonPrize(p.award, prize.name));
                  // opens the build's card on the wall (WallBrowser listens for data-open-build)
                  const links = winners.map((winner) => {
                    const reason = awardReason(winner.award!, prize.name);
                    return (
                      <a key={winner.slug} href={`#${winner.slug}`} data-open-build={winner.slug}>
                        → {winner.title} · {winner.creator.name}
                        {reason && <small>{reason}</small>}
                      </a>
                    );
                  });
                  const heading = `🏆 ${prize.title ?? prize.name}`;
                  return (
                    <li key={prize.name}>
                      {winners.length > 1 ? (
                        // several winners (honorable mentions): tap to see them, then pick one
                        <details className="prizeGroup">
                          <summary>
                            <b>{heading}</b>
                            <small>
                              {winners.length} builds <i aria-hidden="true">▾</i>
                            </small>
                          </summary>
                          {links}
                        </details>
                      ) : (
                        <>
                          <b>{heading}</b>
                          {prize.reward && !winners.length && <small>{prize.reward}</small>}
                          {links}
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
              <p className="prizeNote">
                $150 in prizes. Winners get a 🏆 ribbon and the top spot on the
                wall.
              </p>
            </>
          ) : (
            <>
              <span className="tba">TBA</span>
              <p>
                Winners take home awards, plus a 🏆 ribbon and the top spot on
                the wall.
              </p>
            </>
          )}
        </article>

        {/* two short cards share the third column so neither stretches to the tall ones */}
        <div className="infoStack">
          <article className="guideCard">
            <span className="infoLabel">PERKS</span>
            <p className="foodLine">{food ?? "Free lunch"}</p>
            <p>{event.perks}</p>
          </article>

          <article className="guideCard">
            <span className="infoLabel">SPECIAL GUEST</span>
            <div className="guest">
              <img src={event.guest.photo} alt={event.guest.name} width={64} height={64} />
              <div>
                <a className="foodLine" href={event.guest.linkedin} target="_blank" rel="noreferrer">
                  {event.guest.name}
                </a>
                <small>{event.guest.role}</small>
              </div>
            </div>
            <p>{event.guest.detail}</p>
            <div className="calRow">
              <a className="calBtn" href={event.guest.linkedin} target="_blank" rel="noreferrer">
                LINKEDIN ↗
              </a>
            </div>
          </article>
        </div>

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
