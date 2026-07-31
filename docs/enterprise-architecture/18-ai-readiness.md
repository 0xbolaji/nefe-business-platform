# AI Readiness

## Current state

NEFE uses deterministic commercial and pilot intelligence, with repeatability tests in [`tests/deterministic-intelligence.test.ts`](../../tests/deterministic-intelligence.test.ts). No production model provider, prompt pipeline, vector store or autonomous decision-making path was found.

## Classification

| Capability | State | Rule |
|---|---|---|
| Deterministic scoring | Implemented | Preserve as explainable baseline |
| Generated summaries | Future | Human-reviewed; no new facts |
| Retrieval assistant | Future | Permission-filter before retrieval |
| Recommendations | Future | Evaluation and human decision required |
| Autonomous approvals/execution | Prohibited target | Not appropriate |

## Prerequisites

- Data classification and approved model-provider policy.
- Tenant-isolated retrieval and prompt construction.
- No private comments/rationale in telemetry or training by default.
- Ground-truth evaluation dataset and deterministic baseline.
- Hallucination, bias, privacy and prompt-injection tests.
- Source citations and confidence presentation.
- Human approval for commercial outcomes.
- Model/version/prompt traceability without logging private content.
- Cost, latency, fallback and outage controls.
- Data deletion and retention behavior.

## Governance

Every AI feature needs a named owner, intended use, prohibited use, evaluation threshold, fallback, review cadence and kill switch. “AI-powered” is not a substitute for measured usefulness.

