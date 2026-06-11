import { EducationItem, Profile, SkillGroup } from "./types";

// Source: Ivan_Kwong_23042026.md (resume), SUMMARY section.
export const profile: Profile = {
  name: "Ivan Kwong",
  handle: "ivankwongtszfung",
  title: "AI Engineer / Software Engineer",
  location: "Toronto, ON",
  tagline:
    "7+ years building distributed systems and production-grade AI workflows.",
  summary:
    "AI Engineer / Software Engineer with 7+ years of experience building distributed systems and production-grade AI workflows. I specialize in LLM application architecture — multi-agent pipelines, tool-calling, structured outputs, evaluation harnesses, and reliability patterns (validation, repair retries, deterministic fallbacks, timeouts) that turn non-deterministic models into dependable production systems. A strong backend foundation in Go, Python, and Kubernetes complements the AI work end-to-end.",
  links: [
    {
      label: "GitHub",
      href: "https://github.com/ivankwongtszfung",
      kind: "github",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/ivan-kwong-tsz-fung/",
      kind: "linkedin",
    },
    {
      label: "Email",
      href: "mailto:ivankwongtszfung@gmail.com",
      kind: "email",
    },
  ],
};

// Source: resume, EDUCATION section.
export const education: EducationItem[] = [
  {
    school: "The Chinese University of Hong Kong",
    credential: "Bachelor of Science in Computer Science",
    period: "2014 – 2018",
  },
];

// Source: resume, TECHNICAL SKILLS section (verbatim grouping).
export const skills: SkillGroup[] = [
  {
    label: "AI / LLM Engineering",
    items: [
      "LangGraph",
      "OpenAI / Anthropic APIs",
      "Multi-agent orchestration",
      "Tool-calling",
      "Structured outputs (json_schema)",
      "Critic / self-correction loops",
      "Prompt engineering",
      "RAG",
      "Reasoning-model tuning",
      "Streaming",
      "Eval harnesses",
      "Golden-dataset regression testing",
    ],
  },
  {
    label: "AI Reliability Patterns",
    items: [
      "Schema-repair retries",
      "Deterministic fallbacks",
      "Timeouts",
      "Validation gates",
      "Hallucination guardrails",
      "Observability for non-deterministic systems",
    ],
  },
  {
    label: "Languages",
    items: ["Python", "Go", "Java", "TypeScript", "Kotlin", "C#"],
  },
  {
    label: "Backend & APIs",
    items: [
      "Spring Boot",
      "Django",
      "Flask",
      "FastAPI",
      "REST",
      "gRPC",
      "GraphQL",
      "Protobuf",
    ],
  },
  {
    label: "Distributed Systems & Infra",
    items: [
      "Kafka",
      "Pulsar",
      "Celery",
      "SQS",
      "Kubernetes",
      "Docker",
      "Redis",
      "PostgreSQL",
      "Cassandra",
      "MySQL",
    ],
  },
  {
    label: "Reliability",
    items: [
      "Concurrency",
      "Backpressure",
      "Retries",
      "Timeouts",
      "Idempotency",
      "Observability",
      "CI/CD",
    ],
  },
];
