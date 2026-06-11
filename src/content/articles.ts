import { Article } from "./types";

// Each article is a full technical write-up of a learning from real work. The
// `source` field cites where it came from; every metric (TPS, %, counts) traces
// to the resume or to Ivan's own design docs. Code blocks are illustrative of
// the pattern being described, not verbatim proprietary source.
export const articles: Article[] = [
  {
    slug: "kafka-to-pulsar-zero-downtime",
    title: "Migrating event streaming from Kafka to Pulsar with zero downtime",
    source: "Intuit · TurboTax DataX",
    period: "2024 – present",
    tags: ["Distributed Systems", "Streaming", "Migration"],
    summary:
      "How a Tax Data Acquisition pipeline moved off Kafka onto Pulsar without dropping a message — and pushed throughput from 30 TPS to over 900.",
    body: `Overhauling the Tax Data Acquisition infrastructure meant replacing the
messaging backbone underneath a pipeline that could not stop. The mandate: move
event-driven workloads from Kafka to Pulsar with **zero downtime** while
production traffic kept flowing.

## Why a broker swap is really a reliability project

A system that ingests tax data doesn't get a generous maintenance window. A
big-bang cutover — stop producers, drain consumers, repoint everything, restart
— trades a weekend of risk for a single irreversible moment. If anything is
wrong, you find out in production with no fallback. So the interesting
engineering was never "Pulsar vs Kafka"; it was *how do you move traffic without
a moment where the system is down or unrecoverable.*

## Run both backbones in parallel

The Pulsar path was stood up **alongside** Kafka rather than in place of it. A
thin, backbone-agnostic publisher let producers write to either system by
configuration, so the migration was a config rollout, not a code rewrite:

    // illustrative: producers depend on the interface, not the broker
    type EventBus interface {
        Publish(ctx context.Context, topic string, e Event) error
    }

    // during cutover, write to the new backbone while the old one still serves
    func (b *DualBus) Publish(ctx context.Context, topic string, e Event) error {
        if err := b.primary.Publish(ctx, topic, e); err != nil {
            return err            // primary is the source of truth
        }
        if b.shadow != nil {
            _ = b.shadow.Publish(ctx, topic, e)   // best-effort during cutover
        }
        return nil
    }

Consumers were migrated **topic by topic**. Each topic could be rolled forward
to Pulsar or rolled back to Kafka independently, so a problem with one workload
never blocked the others.

## Throughput came from topology, not the broker

The headline numbers came from how work was partitioned and how consumers
scaled — not from the broker swap itself:

| Metric | Before (Kafka) | After (Pulsar) |
|---|---|---|
| Sustained throughput | 30 TPS | **>900 TPS** |
| Consumer pods | — | 3 |
| Product conversion | baseline | **+3%** |

Pushing past 900 TPS across 3 pods was a matter of partitioning the topics so
consumers could run in parallel without contending, then sizing the consumer
pool to the work. The broker enabled it; the topology delivered it.

## Verifying the cutover

Because both backbones ran together, correctness was verifiable *before*
committing: the same events flowed through both paths, so the new path had to
match the old one before any topic was switched over for real. The old path
stayed as a fallback until the new one had earned the traffic.

## Takeaways

- **Parallel-run beats big-bang** for anything load-bearing. The migration
  strategy — run both, shift gradually, keep a fallback — matters more than the
  destination technology.
- **Make the swap a config change.** Hiding the broker behind an interface turns
  a risky rewrite into an incremental, reversible rollout.
- **Throughput is a topology property.** A faster broker doesn't help if the work
  isn't partitioned to exploit it.

## Further reading

- [Apache Pulsar — Messaging concepts](https://pulsar.apache.org/docs/concepts-messaging/)
- [Kafka vs Pulsar architecture](https://pulsar.apache.org/docs/concepts-architecture-overview/)`,
  },
  {
    slug: "native-memory-leak-jvm-nmt",
    title: "Hunting a native-memory leak with JVM Native Memory Tracking",
    source: "Intuit · TurboTax DataX",
    period: "2024 – present",
    tags: ["Performance", "JVM", "Reliability"],
    summary:
      "A reactive HTTP client was leaking memory the heap profiler couldn't see. Native Memory Tracking found it before it became a P0.",
    body: `Memory was climbing under production load and heading toward an out-of-memory
crash. The usual move — take a heap dump, find the retained objects — came back
clean. That contradiction is itself a diagnosis: when the heap looks healthy but
the process keeps growing, the leak is in **native** memory, outside the Java
heap entirely.

## Heap memory is only part of the RSS

A JVM's resident memory is heap *plus* a lot of off-heap territory: thread
stacks, code cache, GC structures, and — critically here — direct byte buffers
allocated by NIO and reactive clients. A heap profiler never sees those, so a
leak there is invisible to the tool everyone reaches for first.

## Native Memory Tracking, baseline-and-diff

JVM Native Memory Tracking (NMT) accounts for those off-heap categories. Turn it
on, take a baseline, then diff over time as the process grows:

    # enable NMT (summary is enough to localize the category)
    -XX:NativeMemoryTracking=summary

    # capture a baseline once the app is warm
    jcmd <pid> VM.native_memory baseline

    # later, under load, see what grew
    jcmd <pid> VM.native_memory summary.diff

The diff is the whole game. Instead of "memory is growing somewhere," you get a
per-category delta — and one category kept climbing while the rest were flat.

## The culprit: reactive client buffers

The growth tracked to native buffers held by a reactive HTTP client. Reactive
and NIO-heavy clients pool direct buffers off-heap for performance; if buffers
aren't released back to the pool on every path (including error and cancellation
paths), they accumulate as native memory that no heap dump will ever show.

Once the growth was attributed to the right subsystem, the fix **stabilized
memory growth and eliminated an imminent P0 OOM risk.**

## Takeaways

- **"The heap looks fine" is not "memory is fine."** RSS = heap + off-heap.
  Reactive/NIO clients allocate off-heap, so that's where you look.
- **NMT baseline-and-diff** is the fastest way to turn "leaking somewhere" into
  "leaking *here*" — it localizes the category before you read a line of code.
- **Watch buffer lifecycles on error paths.** Pooled direct buffers leak when a
  cancellation or exception skips the release.

## Further reading

- [Java Native Memory Tracking](https://docs.oracle.com/en/java/javase/17/troubleshoot/diagnostic-tools.html)
- [Netty reference-counted buffers](https://netty.io/wiki/reference-counted-objects.html)`,
  },
  {
    slug: "llm-reliability-patterns",
    title: "Reliability patterns that make non-deterministic LLMs production-grade",
    source: "FinTrack · FinAI / Intuit",
    period: "2024 – present",
    tags: ["AI / LLM", "Reliability", "Architecture"],
    summary:
      "Structured outputs, schema-repair retries, deterministic fallbacks, timeouts, and an independent critic — the scaffolding that turns a flaky model into a dependable component.",
    body: `A model that is right 95% of the time is a 1-in-20 outage generator if you ship
it raw. The work that makes an LLM production-grade is almost entirely the
scaffolding around the call. These are the patterns that earned their keep in
FinAI's multi-agent pipeline.

## 1. Constrain the output to a schema

The first decision is to stop parsing prose. Force the model to return a typed
object against a strict JSON schema, so validation happens at the boundary
instead of with regexes downstream:

    {
      "name": "spending_insight",
      "schema": {
        "type": "object",
        "additionalProperties": false,
        "required": ["title", "severity", "evidence", "confidence"],
        "properties": {
          "title":      { "type": "string", "maxLength": 80 },
          "severity":   { "enum": ["info", "warning", "critical"] },
          "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
          "evidence":   { "type": "object" }
        }
      },
      "strict": true
    }

## 2. Repair, don't retry blindly

When validation fails, feed the validation error back to the model and ask it to
fix *its own* output — bounded, not infinite:

    async function generateValidated(prompt, schema, maxRepairs = 2) {
        let messages = [{ role: "user", content: prompt }];
        for (let attempt = 0; attempt <= maxRepairs; attempt++) {
            const out = await callModel(messages, schema);
            const { ok, errors } = validate(out, schema);
            if (ok) return out;
            messages.push({ role: "assistant", content: JSON.stringify(out) });
            messages.push({ role: "user", content: "Invalid: " + errors });
        }
        return deterministicFallback();   // give up gracefully, never hang
    }

## 3. Always have a deterministic fallback

If the repair budget is exhausted, fall back to a deterministic path rather than
failing the request. In FinAI, the financial **health score is computed
deterministically** (a weighted average of components) — the LLM only narrates
it. The number is never at the mercy of a model.

## 4. Bound latency explicitly

Reasoning-family models can stall. Every call gets a hard timeout, and
reasoning effort is tuned so the model doesn't over-think a simple task into a
production hang.

## 5. Judge with an independent critic

A separate critic pass scores the output and can veto it. Crucially the critic
does **not** share the producing agent's reasoning, so it catches confident
mistakes the producer cannot see. It runs read-only and cannot override the
security gate.

## 6. Make the security gate deterministic

Some checks must never be an LLM. PII redaction and policy enforcement run as a
deterministic validation pass that the creative agents cannot "reason away".

## The patterns at a glance

| Pattern | Failure it prevents | LLM? |
|---|---|---|
| Structured outputs | Unparseable / off-schema output | n/a |
| Schema-repair retries | One bad generation = failed request | yes |
| Deterministic fallback | Model unavailable / still wrong | no |
| Timeouts + effort tuning | Unbounded latency / hangs | n/a |
| Independent critic | Confident hallucinations ship | yes |
| Deterministic gate | PII / policy leak into output | no |

## Takeaway

Treat the model as one unreliable component in a reliable system. The
determinism lives in the harness — validation gates, repair loops, fallbacks,
timeouts, an independent judge — not in the prompt.

## Further reading

- [OpenAI — Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs)
- [Anthropic — Tool use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [LangGraph](https://langchain-ai.github.io/langgraph/)`,
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
Free text is unparseable. Raw SQL is a security and correctness liability — you
do not want a model writing arbitrary queries against a finance database. FinAI's
answer was a narrow, typed contract: a small query DSL.

## Shrink the output space

The DSL has a deliberately small surface. The model's only job is to emit a
valid plan within it:

| Dimension | Surface |
|---|---|
| Time modes | 16 (e.g. last_30d, mtd, ytd, prior_period) |
| Operators | 18 (sum, avg, top_k, percent_change, …) |
| Chart types | 9 (kpi, line, bar, donut, …) |

A smaller output space is a smaller *failure* space. The model can't ask for a
chart that doesn't exist or a window the backend can't compute.

## The plan is the boundary

The Planner agent produces a typed query plan; the Go backend consumes it.
Because the vocabulary is fixed, the plan can be validated before it ever
executes:

    {
      "metric": "spend_by_category",
      "time":   { "mode": "last_90d" },
      "op":     "top_k",
      "args":   { "k": 5 },
      "chart":  "donut"
    }

    // backend rejects anything outside the contract before touching the DB
    func (p QueryPlan) Validate() error {
        if !timeModes[p.Time.Mode]   { return fmt.Errorf("bad time mode") }
        if !operators[p.Op]          { return fmt.Errorf("bad operator") }
        if !chartTypes[p.Chart]      { return fmt.Errorf("bad chart type") }
        return nil
    }

## Now it's testable

A constrained DSL means model output can be unit-tested like any other input —
golden plans for known questions, invalid-plan rejection, round-trip checks —
instead of hoping a prompt holds across model versions:

    test("'top spending categories this quarter' -> plan", () => {
        const plan = planner(question);
        expect(plan).toEqual(GOLDEN.top_categories_quarter);
        expect(validate(plan).ok).toBe(true);
    });

## Takeaways

- **Don't ask a model for a general-purpose artifact** (SQL, code, prose) when a
  narrow typed one will do. Shrinking the output space shrinks the failure space.
- **Validate at the consumer.** The Go side checks every plan against the same
  registries the prompt was built from, so producer and consumer can't drift.
- **A DSL turns "trust the model" into "validate the plan"** — and makes the LLM
  layer regression-testable.`,
  },
  {
    slug: "deployment-review-agent",
    title: "An AI deployment-review agent: enrichment, sequential reviewers, parallel blast-radius",
    source: "Intuit · TurboTax DataX",
    period: "2024 – present",
    tags: ["AI / LLM", "Multi-Agent", "Risk"],
    summary:
      "A multi-agent workflow that reads deployment documents across teams and scores their risk — replacing hours of manual review with automated blast-radius analysis.",
    body: `Deployment reviews are high-stakes and slow: someone senior reads a change
document, imagines what could go wrong, and signs off. That shape of work — read,
contextualize, reason about consequences — is exactly what a *specialized*
multi-agent system can take on, as long as you match the topology to the work.

## Match the topology to the work

Three stages, three different execution shapes:

| Stage | Shape | Why |
|---|---|---|
| Enrichment | pipeline | augment each doc with context a reviewer would gather |
| Reviewers | sequential | layered judgment, each builds on the last |
| Blast-radius | parallel | every change examined on an independent axis at once |

## Enrich first

Before any reasoning, an enrichment layer attaches the context reviewers would
otherwise hunt down by hand — what the change touches, its dependencies, recent
related incidents. A reviewer agent with context beats a smarter agent without it.

## Sequential reviewers, then parallel specialists

The enriched document flows down a chain of reviewers, each adding a layer of
judgment. Then specialist agents fan out to perform **blast-radius analysis** on
every change — each specialist blind to the others, examining a different failure
dimension simultaneously:

    // enrichment + sequential review are a pipeline; blast-radius fans out
    const enriched = await enrich(deployDoc);
    let review = enriched;
    for (const reviewer of REVIEWERS) {
        review = await reviewer(review);          // sequential, layered
    }
    const radius = await Promise.all(
        SPECIALISTS.map((s) => s.analyze(review)) // parallel, independent
    );
    const risk = score(review, radius);           // automated risk score

## The payoff

The system produced automated risk scoring with org-wide reach across Intuit
product teams and **cut operational risk by ~10%** across reviewed deployments —
replacing hours of manual review per deployment.

## Takeaways

- **Topology is the design.** Enrichment is a pipeline, review is sequential
  judgment, blast-radius is embarrassingly parallel. Using the right shape for
  each is what makes the whole thing faster *and* better than one big prompt.
- **Context before cleverness.** The enrichment layer does more for review
  quality than a bigger model would.
- **Independent specialists** surface failure modes a single reviewer rationalizes
  away.`,
  },
  {
    slug: "adversarial-blue-red-critic",
    title: "Adversarial QA: Blue vs Red agents with a Critic adjudicator",
    source: "Intuit · GenAI Genesis (UofT)",
    period: "2024 – present",
    tags: ["AI / LLM", "Multi-Agent", "Evaluation"],
    summary:
      "An internal bug-bash turned into an adversarial multi-agent pattern — defenders, attackers, and a neutral judge — and then into a project for GenAI Genesis at UofT.",
    body: `For systems where "is this correct?" is fuzzy, a checklist of tests only finds
the failure modes you already thought of. An internal AI bug-bash workshop became
a reusable evaluation pattern that generates its own test cases — and a project
for **GenAI Genesis at the University of Toronto**.

## Three roles, in tension

- **Blue-team agents (defenders)** try to keep the system correct and safe.
- **Red-team agents (attackers)** actively try to break it.
- **A critic agent adjudicates** each round — scoring who won without being on
  either side.

The attackers generate the adversarial inputs a static suite wouldn't think to
write; the independent critic keeps the scoring honest.

## The round loop

    // one adversarial round; repeat and accumulate findings
    function round(system) {
        const attack  = red.craft(system);        // attacker proposes a break
        const defense = blue.handle(attack);      // defender responds
        const verdict = critic.judge(attack, defense); // neutral adjudication
        return { attack, defense, verdict };      // verdict: who won, and why
    }

## Why the critic must be independent

If the agent that produced an answer also grades it, it grades its own reasoning
and rubber-stamps confident mistakes. A third agent that sees only the
attack and the defense — not the internal reasoning of either — is what makes
the score trustworthy. It's the same principle behind a separate reviewer in
code review: distance from the work is the point.

## Takeaways

- **Set agents against each other** for fuzzy-correctness systems. Adversarial
  pressure finds more than a checklist.
- **Adjudicate with a neutral third.** Independence is what keeps the evaluation
  from confirming itself.
- **It scales,** because the attackers manufacture the test cases for you — the
  suite grows itself instead of waiting on a human to imagine the next edge case.`,
  },
  {
    slug: "airflow-to-celery-provisioning",
    title: "From Airflow to Celery: redesigning orchestration for I/O-bound provisioning at scale",
    source: "Société Générale",
    period: "2019 – 2022",
    tags: ["Distributed Systems", "Reliability", "Python"],
    summary:
      "Provisioning ~30K bare-metal servers and ~50K VMs meant orchestration that survives partial failure — Celery with idempotency, locks, and circuit breakers.",
    body: `An asynchronous provisioning platform for APAC trading systems automated
data-center checks, procurement, network and firewall allocation, OS install,
and post-deployment validation. At this scale — **~30K bare-metal servers, ~50K
VMs, hundreds of thousands of tasks/day at ~300 TPS peak** — the orchestrator's
failure model *is* the system's failure model.

## Why move off Airflow

The workload is long-running and overwhelmingly **I/O-bound**: most tasks spend
their time waiting on hardware, network gear, and OS installs, not computing.
Moving to Celery gave finer control over queuing and execution semantics for
exactly that shape of work — partitioned queues and thread pools sized for
waiting, not for CPU.

## The reliability primitives that mattered

At hundreds of thousands of tasks a day, *something* is always failing. The job
is to make retries safe and stop failures from cascading.

    @app.task(bind=True, max_retries=5)
    def provision_host(self, host_id):
        # 1) idempotency: a retried task must not double-provision
        if already_provisioned(host_id):
            return

        # 2) update lock: no two workers mutate the same host
        with host_lock(host_id):
            try:
                allocate_network(host_id)
                install_os(host_id)
            except TransientError as exc:
                # 3) bounded, backed-off retry — safe because we're idempotent
                raise self.retry(exc=exc, countdown=backoff(self.request.retries))

    # 4) circuit breaker: stop hammering a dependency that's already down
    @breaker(failure_threshold=10, reset_timeout=60)
    def allocate_network(host_id):
        ...

- **Idempotent tasks** so a retry can't double-provision.
- **Update locks** so two workers never mutate the same host.
- **Circuit breakers** so a failing dependency isn't hammered into a worse state.
- **Database connection safeguards** so the orchestrator doesn't exhaust the pool
  under burst.

## The payoff

| Workload | Before | After |
|---|---|---|
| Bare-metal provisioning | weeks | **days** |
| VM provisioning | days | **hours** |
| Peak throughput | — | **~300 TPS** |

## Takeaways

- **Idempotency and circuit breakers aren't nice-to-haves.** They're what let a
  long-running, I/O-bound pipeline retry without making things worse.
- **Size the pool for the bottleneck.** I/O-bound work wants concurrency for
  waiting; CPU-sized pools leave throughput on the table.
- **The orchestrator choice is a reliability decision,** not a convenience one.

## Further reading

- [Celery — Tasks & retries](https://docs.celeryq.dev/en/stable/userguide/tasks.html)
- [Release It! — circuit breaker pattern](https://pragprog.com/titles/mnee2/release-it-second-edition/)`,
  },
  {
    slug: "kubernetes-istio-staged-migration",
    title: "Staged migration to Kubernetes/Istio while keeping the lights on",
    source: "Société Générale",
    period: "2019 – 2022",
    tags: ["Kubernetes", "Migration", "Infrastructure"],
    summary:
      "Moving critical infrastructure services from physical servers to Kubernetes/Istio by running both worlds in parallel and shifting traffic with the mesh.",
    body: `Critical infrastructure services don't get a maintenance window generous enough
for a big-bang migration. The move from physical servers to **Kubernetes/Istio**
was deliberately staged: run both worlds, shift traffic gradually, keep a
fallback.

## Run old and new in parallel

Both environments served traffic during the transition, so the new platform had
to **earn** each workload rather than inherit it. If the Kubernetes path
misbehaved for a service, traffic stayed on the physical path — no rollback
scramble, just a weight change.

## Let the mesh shift traffic

Istio made the shift precise and observable. Instead of an all-or-nothing DNS
cutover, traffic moved a few percent at a time, watched the whole way:

    apiVersion: networking.istio.io/v1beta1
    kind: VirtualService
    metadata:
      name: pricing-svc
    spec:
      hosts: ["pricing-svc"]
      http:
        - route:
            - destination: { host: pricing-legacy }   # physical servers
              weight: 90
            - destination: { host: pricing-k8s }       # new on Kubernetes
              weight: 10

Bump the weight, watch the metrics, repeat. A bad signal means dialing the new
destination back to zero in seconds.

## What actually improved

The wins were operational properties, not features: scalability, deployment
consistency, observability, and traffic control. The mesh's telemetry made the
parallel run *safe* — you could compare error rates and latency between old and
new for the same traffic before committing.

## Takeaways

- **Parallel run, then shift** — the same principle as a messaging migration.
  For anything load-bearing, the migration strategy beats the destination tech.
- **A service mesh turns a scary cutover into a dial.** Weighted routing plus
  telemetry lets you move 1% at a time and prove it before moving more.
- **Migrations are won on observability.** If you can't compare old vs new under
  the same traffic, you're guessing.

## Further reading

- [Istio — Traffic management](https://istio.io/latest/docs/concepts/traffic-management/)`,
  },
  {
    slug: "protobuf-factory-library",
    title: "A Protobuf factory library: killing serialization boilerplate",
    source: "Wave Financial",
    period: "2022 – 2023",
    tags: ["API Design", "Developer Platform", "gRPC"],
    summary:
      "Standardizing nested schema construction, defaults, and FieldMask updates removed ~40% of serialization boilerplate and a whole class of integration bugs.",
    body: `Across a set of gRPC services, the same tedious code kept reappearing: building
deeply nested Protobuf messages by hand, setting default values inconsistently,
and assembling FieldMask updates field by field. Repetitive boilerplate isn't
just ugly — it's where integration bugs hide.

## The before

Constructing a nested message by hand is verbose and easy to get subtly wrong —
especially defaults, which different services would set differently:

    # before: hand-built, defaults scattered, easy to drift
    req = CreateReceiptRequest(
        receipt=Receipt(
            merchant=Merchant(name=name, address=Address(country="US")),
            amount=Money(currency="USD", units=units, nanos=0),
            status=Receipt.Status.PENDING,
        ),
    )

## The factory

The library centralized three things: nested construction, default values, and
FieldMask updates — the error-prone part of partial updates.

    # after: one consistent builder; defaults defined once, centrally
    req = receipts.build_create(merchant=name, amount=(units, "USD"))

    # FieldMask updates become first-class instead of hand-assembled
    update, mask = receipts.build_update(receipt_id, status="SETTLED")
    # mask -> paths: ["status"]   (only what changed travels the wire)

Making **FieldMask a first-class output** is the high-leverage piece: partial
updates are where teams accidentally clobber fields they didn't mean to touch,
and a generated mask only ever contains the paths that actually changed.

## The payoff

- **~40% less serialization boilerplate** across services.
- Defaults defined once, so services stopped disagreeing about what "unset"
  means.
- Fewer integration errors, and messages became far easier to test.

## Takeaways

- **A platform library pays for itself when it removes a *class* of bug,** not
  just keystrokes. Centralizing defaults and FieldMask handling meant whole
  categories of serialization mistakes simply stopped happening.
- **Make the dangerous thing the easy thing.** Partial updates are risky;
  generating the mask makes the safe path the default path.

## Further reading

- [Protobuf — FieldMask](https://protobuf.dev/reference/protobuf/google.protobuf/#field-mask)`,
  },
  {
    slug: "async-ocr-pipeline",
    title: "An async OCR pipeline with retries and timeouts",
    source: "Wave Financial",
    period: "2022 – 2023",
    tags: ["Distributed Systems", "Reliability", "Django"],
    summary:
      "Receipt OCR is slow, external, and occasionally fails — so the pipeline was queue-based, with retries and timeout controls instead of blocking requests.",
    body: `Receipt OCR for an accounting platform is the textbook case for asynchronous
processing: it's slow, it depends on external work, and it occasionally fails.
Doing it inline would block the request and tie the whole platform's
responsiveness to the slowest receipt.

## Get it off the request path

The upload handler does almost nothing — it persists the file and enqueues a
job, then returns immediately. The user isn't waiting on OCR:

    def upload_receipt(request):
        receipt = Receipt.objects.create(file=request.FILES["file"],
                                         status="queued")
        process_receipt.delay(receipt.id)      # enqueue, don't block
        return JsonResponse({"id": receipt.id, "status": "queued"})

Built on Django, gRPC, SQS, Redis, and PostgreSQL, the OCR work runs on a queue,
decoupled from the request entirely.

## Retries and timeouts are the two controls that matter

External, failure-prone work needs **bounded retries** and **hard timeouts** so a
stuck job can't stall the pipeline or pile up behind itself:

    @task(bind=True, max_retries=3, soft_time_limit=30)
    def process_receipt(self, receipt_id):
        try:
            text = ocr_client.extract(receipt_id, timeout=25)   # hard timeout
            classify_and_store(receipt_id, text)
        except SoftTimeLimitExceeded:
            mark_failed(receipt_id, "ocr timeout")               # don't retry forever
        except TransientError as exc:
            raise self.retry(exc=exc, countdown=2 ** self.request.retries)

## Takeaways

- **Any task that is slow, external, and occasionally-failing belongs off the
  request path.** Responsiveness shouldn't depend on the slowest dependency.
- **Once it's on a queue, retries and timeouts are the controls** that keep
  "occasionally fails" from becoming "occasionally falls over."
- **Make failure a state, not a hang.** A timed-out job that's marked failed is
  recoverable; one that's stuck holds a worker hostage.`,
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
defect that reaches production is expensive. The highest-leverage work wasn't
writing more tests — it was building the platform that makes correct testing
*easy*: a production-grade validation and simulation layer covering **12+ tax
forms.**

## Simulation, not guesswork

Before the platform, validating a change meant assembling realistic form data by
hand — slow and error-prone. The platform let engineers generate and run
form-shaped scenarios locally, so the feedback loop was fast and repeatable:

    # describe a scenario declaratively; the platform builds + validates it
    scenario = simulate(form="1099-INT", cases=[
        {"interest_income": 1500, "expect": "valid"},
        {"interest_income": -1,    "expect": "reject:negative_amount"},
        {"payer_tin": "",          "expect": "reject:missing_tin"},
    ])
    assert scenario.matches_expected()      # runs in the dev loop, no prod data

Engineers could validate against the shapes that actually matter, including the
edge cases that previously only showed up in production.

## The payoff

| Metric | Before | After |
|---|---|---|
| Onboarding time | 5 days | **2 hours** |
| Pre-production defects | baseline | **−60%** |

## Takeaways

- **The highest-leverage testing work is often the platform, not the tests.**
  Make correct testing easy and the whole team gets faster and safer at once.
- **Cutting onboarding from days to hours compounds** — every engineer who comes
  after starts faster, forever.
- **Simulation beats hand-built fixtures** for intricate domains: declare the
  case and the expectation, and let the platform construct and check it.`,
  },
];
