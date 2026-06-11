import { Project } from "./types";

// Featured projects. Private flagship work is sourced from the resume's Projects
// section and Ivan's own design docs; public entries link to original (non-fork)
// repositories under github.com/ivankwongtszfung.
export const projects: Project[] = [
  {
    name: "FinTrack — FinAI",
    blurb: "AI-powered personal finance analytics platform",
    visibility: "private",
    description:
      "FinAI is a LangGraph multi-agent pipeline (Planner → Executor → Critic → Renderer) that turns natural-language questions like \"show my top spending categories this quarter\" into typed query plans, executes them against Postgres, and renders ECharts dashboards — with a critic loop that scores outputs and triggers repair iterations when quality thresholds aren't met.",
    stack: [
      "Go",
      "TypeScript",
      "LangGraph",
      "PostgreSQL",
      "ECharts",
      "OpenAI / Anthropic",
    ],
    highlights: [
      "Tool-calling agent layer where the Critic invokes typed tools (data lookups, schema validators, chart re-renderers) to fix its own outputs — bounded self-correction instead of brittle single-shot prompting.",
      "Reliability patterns for non-deterministic output: strict json_schema structured outputs, schema-repair retries, deterministic fallbacks, per-call timeouts, and reasoning_effort tuning to prevent production hangs.",
      "A domain-specific query language (16 time modes, 18 operators, 9 chart types) used as the type-safe contract between the LLM agents and the Go execution backend.",
      "A BDD-style evaluation harness with golden datasets and per-stage scoring (planner accuracy, chart-type correctness, axis/label quality) so prompt and model changes ship with regression coverage.",
    ],
  },
  {
    name: "Multi-Strategy Trading Research Platform",
    blurb: "Strategy-research system built around Claude Code",
    visibility: "private",
    description:
      "A research system for evaluating trade setups across multiple strategies. It layers an always-available market foundation, pluggable strategy modules, and shared infrastructure for risk management and a structured learning loop.",
    stack: ["Claude Code", "JSON Schema", "Markdown"],
    highlights: [
      "Layer 1 — market foundation: market regime, sector rotation, breadth, and positioning analysis available to every strategy.",
      "Layer 2 — pluggable strategy modules: episodic-pivot earnings catalysts, technical breakouts (VCP, cup-and-handle, flat base), momentum / RS leaders, mean reversion, and event-driven setups.",
      "Layer 3 — shared infrastructure: risk management, a post-trade postmortem loop that compounds learnings, and a vendor / data-source safety review.",
    ],
  },
  {
    name: "Topic Notification System",
    blurb: "REST job-status notifications with mobile push",
    visibility: "private",
    description:
      "A REST-based system where a local job producer creates jobs and posts status updates, and a mobile app receives push notifications for the topics it has subscribed to. Designed Just-Enough-Design-First with reliability and test coverage as first-class goals.",
    stack: ["Go", "PostgreSQL", "FCM / APNs"],
    highlights: [
      "Producer → Backend → Mobile push flow with an async outbox worker for reliable, at-least-once delivery.",
      "Single provider abstraction over FCM/APNs, Postgres-backed, targeting < 3 s p95 end-to-end latency.",
      "≥ 80% test coverage with a clean CI pipeline as an explicit success criterion.",
    ],
  },
  {
    name: "Engineering-Blog Web Crawler",
    blurb: "Concurrent crawler for engineering blogs",
    visibility: "public",
    href: "https://github.com/ivankwongtszfung/engineering-blog-web-crawler",
    description:
      "A web crawler written in Go that scrapes and processes content from engineering blogs. It can be configured to follow links, extract information, and store the results in a structured format.",
    stack: ["Go"],
  },
  {
    name: "Engineering-Blog Summary (LLM)",
    blurb: "LLM summarizer + architecture visualizer",
    visibility: "public",
    href: "https://github.com/ivankwongtszfung/engineering-blog-summary-llm",
    description:
      "A Python web application that uses LLMs to summarize multiple engineering-blog articles from a tech company and visualize how the company's architecture evolved over a chosen period — a companion to the crawler above.",
    stack: ["Python", "LLMs"],
  },
  {
    name: "Free-Tier Multi-Cloud VMs",
    blurb: "Personal multi-cloud footprint as Terraform",
    visibility: "public",
    href: "https://github.com/ivankwongtszfung/all-my-free-vm",
    description:
      "Terraform projects that provision VMs across several cloud providers — all on free-tier resources. Infrastructure-as-code for a personal, reproducible multi-cloud setup.",
    stack: ["Terraform", "HCL"],
  },
];
