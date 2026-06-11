import * as React from "react";
import { profile } from "./content/profile";
import { iconFor } from "./components/icons";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Articles from "./sections/Articles";

type TabId = "about" | "experience" | "projects" | "articles";

const TABS: { id: TabId; label: string }[] = [
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "projects", label: "projects" },
  { id: "articles", label: "articles" },
];

const isTab = (v: string): v is TabId =>
  TABS.some((t) => t.id === v);

const readHash = (): TabId => {
  const h = window.location.hash.replace("#", "");
  return isTab(h) ? h : "about";
};

function App() {
  const [tab, setTab] = React.useState<TabId>(readHash);

  React.useEffect(() => {
    const onHash = () => setTab(readHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const select = (id: TabId) => {
    setTab(id);
    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, "", `#${id}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="wrap">
      <header className="masthead">
        <h1 className="masthead__name">
          <span className="status-dot" aria-hidden />
          {profile.name}
        </h1>
        <p className="masthead__role">{profile.title}</p>
        <p className="masthead__tagline">{profile.tagline}</p>

        <div className="masthead__meta">
          <span className="pill">
            <span style={{ color: "var(--accent)" }}>◉</span>
            {profile.location}
          </span>
          <span className="pill">@{profile.handle}</span>
          <span style={{ flex: 1 }} />
          <nav className="social" aria-label="Social links">
            {profile.links.map((l) => {
              const Icon = iconFor(l.kind);
              return (
                <a
                  key={l.kind}
                  href={l.href}
                  aria-label={l.label}
                  title={l.label}
                  target={l.kind === "email" ? undefined : "_blank"}
                  rel="noreferrer"
                >
                  <Icon />
                </a>
              );
            })}
          </nav>
        </div>
      </header>

      <nav className="tabs" role="tablist" aria-label="Sections">
        {TABS.map((t, i) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            className={`tab ${tab === t.id ? "tab--active" : ""}`}
            onClick={() => select(t.id)}
          >
            <span className="tab__idx">0{i + 1}</span>
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "about" && <About />}
      {tab === "experience" && <Experience />}
      {tab === "projects" && <Projects />}
      {tab === "articles" && <Articles />}

      <footer className="foot">
        <span>
          © {profile.name} · built with React, deployed on GitHub Pages
        </span>
        <a href="https://github.com/ivankwongtszfung" target="_blank" rel="noreferrer">
          github.com/{profile.handle}
        </a>
      </footer>
    </div>
  );
}

export default App;
