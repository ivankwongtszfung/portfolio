import { ExperienceItem } from "./types";

// Source: Ivan_Kwong_23042026.md (resume), EXPERIENCE section. Wording condensed
// from the resume bullets; every figure (TPS, %, counts) is quoted from it.
export const experience: ExperienceItem[] = [
  {
    company: "Intuit",
    role: "Software Engineer",
    team: "TurboTax DataX",
    start: "Sep 2024",
    end: "Present",
    location: "Toronto, ON",
    highlights: [
      "Technical leadership & migration: led a 7-person team to overhaul Tax Data Acquisition infrastructure; migrated event-driven workloads from Kafka to Pulsar with zero downtime, increasing throughput from 30 TPS to >900 TPS across 3 pods and improving product conversion by 3%.",
      "Testing infrastructure & reliability: architected a production-grade validation and simulation platform supporting 12+ tax forms; cut onboarding time from 5 days to 2 hours and reduced pre-production defects by 60%.",
      "Performance engineering: diagnosed and resolved a native-memory leak in a reactive HTTP client using JVM Native Memory Tracking under production load, eliminating imminent P0 OOM risk and stabilizing memory growth.",
      "AI Deployment Review Agent (org-wide impact): built a multi-agent workflow that ingests deployment documents across Intuit product teams through an enrichment layer, sequential reviewers, and parallel specialist agents performing blast-radius analysis — cutting operational risk by ~10% across reviewed deployments.",
      "AI Bug Bash (Blue / Red / Critic agents): hosted an internal AI bug-bash workshop and turned it into a project for GenAI Genesis at UofT, pitting blue-team defenders against red-team attackers with a critic agent adjudicating outcomes.",
      "AI workflow automation: developed an Auto-Attribution System with multi-strategy name matching for MFJ returns (pending patent application); prototyped LLM engineering tooling including a Jira-to-PR CLI agent that reads tickets, plans changes, and drafts PRs.",
      "Security & architecture: designed a compatibility facade for a zero-downtime storage migration and completed STRIDE threat modeling plus production-readiness compliance.",
    ],
  },
  {
    company: "SimplifyVMS",
    role: "Software Engineer",
    start: "Jun 2023",
    end: "Apr 2024",
    location: "Toronto, ON",
    highlights: [
      "Built cloud-native workforce-management microservices and scheduling pipelines using Django, Kafka, and PySpark for enterprise HR workflows.",
      "Architected a fault-tolerant scheduling platform processing 5,000+ daily transactions at 99.95% uptime.",
      "Reduced peak-load latency through Kafka consumer tuning and batch-pipeline optimization.",
    ],
  },
  {
    company: "Wave Financial Inc.",
    role: "Software Engineer",
    start: "May 2022",
    end: "Mar 2023",
    location: "Toronto, ON",
    highlights: [
      "Distributed backend engineering: built backend services for receipt OCR and expense tracking using Django, gRPC, SQS, Redis, and PostgreSQL, supporting scalable document-classification workflows for Wave's accounting platform.",
      "Async architecture & throughput: designed a queue-based asynchronous OCR pipeline with retries and timeout controls, improving responsiveness and operational reliability for receipt-processing workloads.",
      "Developer platform & API quality: built a Protobuf factory library that standardized nested schema construction, default values, and FieldMask updates, removing ~40% of serialization boilerplate and reducing integration errors across services.",
    ],
  },
  {
    company: "Société Générale",
    role: "Software Engineer",
    start: "Oct 2019",
    end: "Apr 2022",
    location: "Hong Kong",
    highlights: [
      "Infrastructure automation at scale: built an asynchronous provisioning platform for APAC trading systems that automated data-center checks, procurement, network and firewall allocation, OS installation, and post-deployment validation.",
      "Scale & throughput engineering: scaled the platform to provision ~30K bare-metal servers and ~50K VMs, processing hundreds of thousands of tasks per day at ~300 TPS peak — reducing bare-metal provisioning from weeks to days and VM provisioning from days to hours.",
      "Distributed workflow reliability: redesigned orchestration from Airflow to Celery, partitioning queues, tuning thread pools for I/O-bound workloads, and introducing circuit breakers, idempotent tasks, update locks, and database connection safeguards.",
      "Kubernetes migration & platform operations: led a staged migration from physical servers to Kubernetes/Istio, running old and new environments in parallel while improving scalability, deployment consistency, observability, and traffic control.",
    ],
  },
  {
    company: "Crédit Agricole CIB",
    role: "Software Engineer",
    team: "Capital Markets IT",
    start: "Aug 2018",
    end: "Oct 2019",
    location: "Hong Kong",
    highlights: [
      "Built pricing automation for structured products using C# and MS SQL Server; automated 5,000+ orders and saved ~2–3 hours/day for trading teams.",
      "Improved portfolio monitoring with internal dashboards and metrics using VBA and Bloomberg.",
    ],
  },
];
