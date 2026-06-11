import * as React from "react";
import { experience } from "../content/experience";

const Experience = () => (
  <section
    className="panel"
    id="panel-experience"
    role="tabpanel"
    aria-labelledby="tab-experience"
  >
    <h2 className="section-title">Experience</h2>
    <div className="timeline">
      {experience.map((xp) => (
        <article className="xp" key={`${xp.company}-${xp.start}`}>
          <span className="xp__dot" />
          <div className="xp__head">
            <span className="xp__company">{xp.company}</span>
            <span className="xp__role">
              {xp.role}
              {xp.team ? ` · ${xp.team}` : ""}
            </span>
            <span className="xp__when">
              {xp.start} – {xp.end} · {xp.location}
            </span>
          </div>
          <ul className="xp__list">
            {xp.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  </section>
);

export default Experience;
