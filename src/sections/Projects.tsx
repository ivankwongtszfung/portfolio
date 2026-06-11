import * as React from "react";
import { projects } from "../content/projects";
import { ArrowIcon, GitHubIcon } from "../components/icons";

const Projects = () => (
  <section
    className="panel"
    id="panel-projects"
    role="tabpanel"
    aria-labelledby="tab-projects"
  >
    <h2 className="section-title">Selected Projects</h2>
    <div className="projects">
      {projects.map((p) => (
        <article className="project" key={p.name}>
          <div className="project__top">
            <div>
              <h3 className="project__name">{p.name}</h3>
              <p className="project__blurb">{p.blurb}</p>
            </div>
            <span
              className={`badge badge--${p.visibility}`}
              title={
                p.visibility === "private"
                  ? "Private repository — available on request"
                  : "Public repository"
              }
            >
              {p.visibility}
            </span>
          </div>

          <p className="project__desc">{p.description}</p>

          {p.highlights && (
            <ul className="project__hl">
              {p.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          )}

          <div className="project__foot">
            <div className="project__stack">
              {p.stack.map((t) => (
                <span className="tech" key={t}>
                  {t}
                </span>
              ))}
            </div>
            {p.visibility === "public" && p.href ? (
              <a
                className="repo-link"
                href={p.href}
                target="_blank"
                rel="noreferrer"
              >
                <GitHubIcon style={{ width: 14, height: 14 }} />
                Repo
                <ArrowIcon style={{ width: 13, height: 13 }} />
              </a>
            ) : (
              <span className="repo-note">private · on request</span>
            )}
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default Projects;
