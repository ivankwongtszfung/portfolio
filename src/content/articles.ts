import { Article } from "./types";

// Each article is a learning distilled from real work. The `source` field cites
// where it came from; figures quoted in the body trace to the resume or to
// Ivan's own project documentation. These are lessons, not marketing.
export const articles: Article[] = [
  {
    slug: "kafka-to-pulsar-zero-downtime",
    title: "Migrating event streaming from Kafka to Pulsar with zero downtime",
    source: "Intuit · TurboTax DataX",
    period: "2024 – present",
    tags: ["Distributed Systems", "Streaming", "Migration"],
    summary:
      "How a Tax Data Acquisition pipeline moved off Kafka onto Pulsar without dropping a message — and pushed throughput from 30 TPS to over 900.",
    body: `Overhauling the Tax Data Acquisition infrastructure meant changing the
messaging backbone underneath a system that could not stop. The bar was a
zero-downtime migration from Kafka to Pulsar while the pipeline kept serving
production traffic.

**What worked**

- **Run both in parallel.** The new Pulsar path ran alongside Kafka rather than
  replacing it in a single cutover. Traffic shifted gradually, and the old path
  stayed as a fallback until the new one had proven itself.
- **Throughput came from topology, not just the broker.** The result —
  **30 TPS → >900 TPS across 3 pods** — came from partitioning work correctly
  and letting consumers scale, not from swapping one queue for another.
- **Measure the business metric, not only the system metric.** The migration
  was tied to a **3% improvement in product conversion**; throughput was the
  means, conversion was the point.

**The lesson:** a messaging migration is a reliability project first. The
interesting engineering is the parallel-run and the gradual shift — the broker
swap is almost incidental once you can move traffic safely.`,
  },
  {
    slug: "native-memory-leak-jvm-nmt",
    title: "Hunting a native-memory leak with JVM Native Memory Tracking",
    source: "Intuit · TurboTax DataX",
    period: "2024 – present",
    tags: ["Performance", "JVM", "Reliability"],
    summary:
      "A reactive HTTP client was leaking memory the heap profiler couldn't see. Native Memory Tracking found it before it became a P0.",
    body: `Memory was growing under production load and heading toward an out-of-memory
crash, but the usual heap tooling came back clean. That mismatch is the tell:
when heap dumps look healthy and the process still bloats, the leak is in
**native** memory, not the Java heap.

**What worked**

- **JVM Native Memory Tracking (NMT).** Enabling NMT and diffing baselines over
  time exposed the category of native memory that kept climbing — invisible to a
  heap profiler because it never lived on the heap.
- **A reactive HTTP client was the culprit.** Native buffers tied to the
  reactive client were the source. Once the growth was attributed to the right
  subsystem, the fix stabilized memory growth and **eliminated an imminent P0
  OOM risk.**

**The lesson:** "the heap looks fine" is not "memory is fine." Reactive and
NIO-heavy clients allocate off-heap, so off-heap is where you have to look. NMT
baseline-and-diff is the fastest way to turn "it's leaking somewhere" into "it's
leaking *here*."`,
  },
  {
    slug: "llm-reliability-patterns",
    title: "Reliability patterns that make non-deterministic LLMs production-grade",
    source: "FinTrack · FinAI / Intuit",
    period: "2024 – present",
    tags: ["AI / LLM", "Reliability", "Architecture"],
    summary:
      "Structured outputs, schema-repair retries, deterministic fallbacks, timeouts, and a critic loop — the patterns that turn a flaky model into a dependable component.",
    body: `A model that is right 95% of the time is a 1-in-20 outage generator if you ship
it raw. The work that makes LLMs production-grade is almost entirely the
scaffolding around the call.

**The patterns that earned their keep**

- **Strict structured outputs.** Constrain the model to a \`json_schema\` so the
  output is a typed object, not prose to be parsed. Validation moves to the edge
  of the call.
- **Schema-repair retries.** When validation fails, feed the error back and let
  the model repair its own output — bounded, not infinite.
- **Deterministic fallbacks.** If the model can't produce something valid in the
  retry budget, fall back to a deterministic path instead of failing the request.
- **Per-call timeouts and reasoning-effort tuning.** Reasoning-family models can
  hang; explicit timeouts and tuned \`reasoning_effort\` keep latency bounded.
- **A separate critic.** An independent pass scores the output and can veto it.
  Crucially, the critic doesn't share the creative agent's reasoning, so it
  catches confident mistakes the producer can't see.
- **A deterministic security/policy gate at the end.** Some checks must *not* be
  an LLM — PII and policy enforcement run as deterministic validation that the
  creative agents cannot "reason away."

**The lesson:** treat the model as one unreliable component in a reliable
system. The determinism lives in the harness — validation gates, repair loops,
fallbacks, timeouts — not in the prompt.`,
  },
  {
    slug: "dsl-as-llm-contract",
    title: "A domain-specific query language as the contract between LLMs and a Go backend",
    source: "FinTrack · FinAI",
    period: "2024 – present",
    tags: ["AI / LLM", "API Design", "Go"],
    summary:
      "Instead of letting a model emit SQL or free text, it emits a typed query plan in a small DSL — making model output type-safe, executable, and testable.",
    body: `When an LLM talks to a backend, the interface between them is the whole ballgame.
Free text is unparseable; raw SQL is a security and correctness liability. The
answer was a narrow, typed contract.

**The design**

- **A domain-specific query language** with a deliberately small surface:
  **16 time modes, 18 operators, and 9 chart types.** The model's job is to emit
  a valid plan in this language, nothing more.
- **The plan is the boundary.** The Planner agent produces a typed query plan;
  the Go execution backend consumes it. Because the vocabulary is fixed and
  typed, the backend can validate every plan before executing it.
- **Type-safe and testable.** A constrained DSL means model output can be
  unit-tested like any other input — golden plans, invalid-plan rejection, the
  works — rather than hoping a prompt holds.

**The lesson:** don't ask a model to produce a general-purpose artifact (SQL,
code, prose) when a narrow typed one will do. Shrinking the output space shrinks
the failure space, and a small DSL turns "trust the model" into "validate the
plan."`,
  },
  {
    slug: "deployment-review-agent",
    title: "An AI deployment-review agent: enrichment, sequential reviewers, parallel blast-radius",
    source: "Intuit · TurboTax DataX",
    period: "2024 – present",
    tags: ["AI / LLM", "Multi-Agent", "Risk"],
    summary:
      "A multi-agent workflow that reads deployment documents across teams and scores their risk — replacing hours of manual review.",
    body: `Deployment reviews are high-stakes and slow: someone senior reads a document,
imagines what could go wrong, and signs off. That's exactly the shape of work a
specialized multi-agent system can take on.

**The topology**

- **An enrichment layer** first augments each deployment document with the
  context reviewers would otherwise gather by hand.
- **Sequential reviewers** pass the enriched document down a chain, each adding a
  layer of judgment.
- **Parallel specialist agents** then perform **blast-radius analysis** on every
  change — fanning out so each specialist examines a different failure dimension
  at once.

The system produced automated risk scoring and **cut operational risk by ~10%**
across reviewed deployments, with org-wide reach across Intuit product teams.

**The lesson:** match the agent topology to the work. Enrichment is a pipeline
stage, review is sequential judgment, and blast-radius is embarrassingly
parallel — using the right shape for each is what makes the whole thing faster
*and* better than a single prompt.`,
  },
  {
    slug: "adversarial-blue-red-critic",
    title: "Adversarial QA: Blue vs Red agents with a Critic adjudicator",
    source: "Intuit · GenAI Genesis (UofT)",
    period: "2024 – present",
    tags: ["AI / LLM", "Multi-Agent", "Evaluation"],
    summary:
      "An internal bug-bash turned into an adversarial multi-agent pattern: defenders, attackers, and a neutral judge.",
    body: `An internal AI bug-bash workshop became a reusable evaluation pattern — and a
project for **GenAI Genesis at the University of Toronto**.

**The pattern**

- **Blue-team agents (defenders)** try to keep a system correct and safe.
- **Red-team agents (attackers)** actively try to break it.
- **A critic agent adjudicates** the outcome, scoring who won each round without
  being on either side.

Framed this way, adversarial multi-agent evaluation becomes a practical QA
technique: the attackers surface failure modes a single test suite wouldn't
think to write, and the independent critic keeps the scoring honest.

**The lesson:** for systems where "is this correct?" is fuzzy, set agents
*against* each other and judge with a third. Adversarial pressure plus an
independent adjudicator finds more than a checklist — and it scales, because the
attackers generate the test cases for you.`,
  },
  {
    slug: "airflow-to-celery-provisioning",
    title: "From Airflow to Celery: redesigning orchestration for I/O-bound provisioning at scale",
    source: "Société Générale",
    period: "2019 – 2022",
    tags: ["Distributed Systems", "Reliability", "Python"],
    summary:
      "Provisioning ~30K bare-metal servers and ~50K VMs meant orchestration that could survive partial failure — Celery with the right reliability primitives.",
    body: `An asynchronous provisioning platform for APAC trading systems automated
data-center checks, procurement, network and firewall allocation, OS install,
and post-deployment validation. At scale — **~30K bare-metal servers, ~50K VMs,
hundreds of thousands of tasks/day at ~300 TPS peak** — orchestration choice and
failure semantics dominate everything else.

**What the redesign changed**

- **Airflow → Celery.** Moving to Celery gave finer control over how work was
  queued and executed for this I/O-bound, long-running workload.
- **Partitioned queues + tuned thread pools.** Provisioning is I/O-bound
  (waiting on hardware, network, installs), so queues were partitioned and
  thread pools sized for waiting, not computing.
- **Reliability primitives that mattered:** circuit breakers to stop hammering
  failing dependencies, **idempotent tasks** so retries are safe, **update
  locks** to prevent concurrent mutation, and database connection safeguards.

The payoff was operational: **bare-metal provisioning went from weeks to days,
VMs from days to hours.**

**The lesson:** at scale, the orchestrator's failure model is the system's
failure model. Idempotency and circuit breakers aren't nice-to-haves — they're
what let a long-running, I/O-bound pipeline retry without making things worse.`,
  },
  {
    slug: "kubernetes-istio-staged-migration",
    title: "Staged migration to Kubernetes/Istio while keeping the lights on",
    source: "Société Générale",
    period: "2019 – 2022",
    tags: ["Kubernetes", "Migration", "Infrastructure"],
    summary:
      "Moving critical infrastructure services from physical servers to Kubernetes/Istio by running both worlds in parallel.",
    body: `Critical infrastructure services don't get a maintenance window generous enough
for a big-bang migration. The move from physical servers to **Kubernetes/Istio**
was deliberately staged.

**The approach**

- **Run old and new in parallel.** Both environments served traffic during the
  transition, so the new platform had to earn each workload rather than inherit
  it.
- **Istio for traffic control and observability.** The service mesh made it
  possible to shift and observe traffic precisely, which is what makes a parallel
  migration safe rather than scary.
- **Consistency as the goal.** The wins were scalability, deployment
  consistency, observability, and traffic control — operational properties, not
  features.

**The lesson:** the same principle as the Kafka→Pulsar move — *parallel run, then
shift.* For anything load-bearing, the migration strategy (run both, shift
gradually, keep a fallback) matters more than the destination technology.`,
  },
  {
    slug: "protobuf-factory-library",
    title: "A Protobuf factory library: killing serialization boilerplate",
    source: "Wave Financial",
    period: "2022 – 2023",
    tags: ["API Design", "Developer Platform", "gRPC"],
    summary:
      "Standardizing nested schema construction, defaults, and FieldMask updates removed ~40% of serialization boilerplate across services.",
    body: `Across a set of gRPC services, the same tedious code kept reappearing: building
deeply nested Protobuf messages, setting default values, and assembling
\`FieldMask\` updates by hand. Repetitive boilerplate isn't just ugly — it's where
integration bugs hide.

**What the library did**

- **Standardized nested schema construction** so building a complex message was
  one consistent call instead of bespoke wiring each time.
- **Centralized default values** so services stopped disagreeing about what
  "unset" means.
- **Made \`FieldMask\` updates first-class**, which is exactly the error-prone
  part of partial updates.

The result: **~40% less serialization boilerplate**, better testability, and
fewer integration errors across services.

**The lesson:** a developer-platform library pays for itself when it removes a
*class* of bug, not just keystrokes. Centralizing defaults and FieldMask
handling meant whole categories of serialization mistakes simply stopped
happening.`,
  },
  {
    slug: "async-ocr-pipeline",
    title: "An async OCR pipeline with retries and timeouts",
    source: "Wave Financial",
    period: "2022 – 2023",
    tags: ["Distributed Systems", "Reliability", "Django"],
    summary:
      "Receipt OCR is slow and flaky — so the pipeline was queue-based, with retries and timeout controls instead of blocking requests.",
    body: `Receipt OCR for an accounting platform is the classic case for asynchronous
processing: it's slow, it depends on external work, and it occasionally fails.
Doing it inline would block requests and tie reliability to the slowest receipt.

**The design**

- **Queue-based and asynchronous.** Built with Django, gRPC, SQS, Redis, and
  PostgreSQL, the OCR work was decoupled from the request path so user-facing
  responsiveness didn't depend on OCR latency.
- **Retries and timeout controls.** External, failure-prone work needs bounded
  retries and hard timeouts so a stuck job can't stall the pipeline or pile up.

Together these improved responsiveness and operational reliability for
receipt-processing workloads, supporting scalable document-classification
across the platform.

**The lesson:** any task that is slow, external, and occasionally-failing
belongs off the request path. Once it's on a queue, retries and timeouts are the
two controls that keep "occasionally fails" from becoming "occasionally falls
over."`,
  },
  {
    slug: "validation-simulation-platform",
    title: "A validation & simulation platform for 12+ tax forms",
    source: "Intuit · TurboTax DataX",
    period: "2024 – present",
    tags: ["Testing", "Developer Experience", "Reliability"],
    summary:
      "Tooling that let engineers simulate and validate tax-form data cut onboarding from 5 days to 2 hours and pre-production defects by 60%.",
    body: `Tax data is unforgiving: forms are intricate, edge cases are everywhere, and a
defect that reaches production is expensive. The leverage was in tooling — a
production-grade validation and simulation platform.

**What it delivered**

- **Coverage for 12+ tax forms**, so engineers could validate against the
  shapes that actually matter.
- **Simulation, not guesswork.** Being able to simulate form data locally turned
  a slow, error-prone manual process into something fast and repeatable.
- **The numbers:** onboarding dropped from **5 days to 2 hours**, and
  pre-production defects fell by **60%.**

**The lesson:** the highest-leverage testing work often isn't more tests — it's
the platform that makes correct testing *easy*. Cutting onboarding from days to
hours means every engineer after you starts faster, and the defect reduction
compounds across the team.`,
  },
];
