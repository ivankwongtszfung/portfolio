import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { articles } from "../content/articles";

// All distinct tags, with an "All" pseudo-filter first.
const allTags = Array.from(
  articles.reduce((set, a) => {
    a.tags.forEach((t) => set.add(t));
    return set;
  }, new Set<string>())
).sort();

const readingMinutes = (body: string) =>
  Math.max(1, Math.round(body.trim().split(/\s+/).length / 200));

// Open external links in a new tab.
const mdComponents = {
  a: ({ node, children, ...props }: any) => {
    const href: string = props.href || "";
    const external = /^https?:/.test(href);
    return external ? (
      <a {...props} target="_blank" rel="noreferrer">
        {children}
      </a>
    ) : (
      <a {...props}>{children}</a>
    );
  },
};

const Articles = () => {
  const [filter, setFilter] = React.useState<string>("All");
  const [open, setOpen] = React.useState<Set<string>>(new Set());

  const toggle = (slug: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });

  const visible =
    filter === "All"
      ? articles
      : articles.filter((a) => a.tags.includes(filter));

  return (
    <section
      className="panel"
      id="panel-articles"
      role="tabpanel"
      aria-labelledby="tab-articles"
    >
      <h2 className="section-title">Articles — learnings from the work</h2>
      <p className="lead">
        Engineering write-ups distilled from real systems I've built. Each one
        cites the work it came from — no abstractions invented after the fact.
      </p>

      <div className="filterbar" role="group" aria-label="Filter articles by topic">
        {["All", ...allTags].map((t) => (
          <button
            key={t}
            className={`filter ${filter === t ? "filter--active" : ""}`}
            aria-pressed={filter === t}
            onClick={() => setFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="articles">
        {visible.map((a) => {
          const isOpen = open.has(a.slug);
          return (
            <article
              className={`article ${isOpen ? "article--open" : ""}`}
              key={a.slug}
            >
              <button
                className="article__btn"
                aria-expanded={isOpen}
                onClick={() => toggle(a.slug)}
              >
                <div className="article__meta">
                  <span className="article__source">{a.source}</span>
                  <span className="article__period">{a.period}</span>
                  <span className="article__read">
                    {readingMinutes(a.body)} min read
                  </span>
                </div>
                <h3 className="article__title">
                  <span>{a.title}</span>
                  <span className="article__chev">▶</span>
                </h3>
                <p className="article__summary">{a.summary}</p>
                <div className="article__tags">
                  {a.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </button>

              {isOpen && (
                <div className="article__body">
                  <div className="prose">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={mdComponents}
                    >
                      {a.body}
                    </ReactMarkdown>
                  </div>
                  <button
                    className="article__collapse"
                    onClick={() => toggle(a.slug)}
                  >
                    ↑ Collapse
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Articles;
