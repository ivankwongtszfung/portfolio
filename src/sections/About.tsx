import * as React from "react";
import { profile, skills, education } from "../content/profile";

const About = () => (
  <section className="panel" id="panel-about" role="tabpanel" aria-labelledby="tab-about">
    <h2 className="section-title">About</h2>
    <p className="lead">{profile.summary}</p>

    <h2 className="section-title">Skills</h2>
    <div className="skills">
      {skills.map((group) => (
        <div className="skillgroup" key={group.label}>
          <div className="skillgroup__label">{group.label}</div>
          <div className="chips">
            {group.items.map((item) => (
              <span className="chip" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="edu">
      <h2 className="section-title">Education</h2>
      {education.map((e) => (
        <div className="edu__row" key={e.school}>
          <div>
            <div className="edu__school">{e.school}</div>
            <div className="edu__cred">{e.credential}</div>
          </div>
          <div className="edu__period">{e.period}</div>
        </div>
      ))}
    </div>
  </section>
);

export default About;
