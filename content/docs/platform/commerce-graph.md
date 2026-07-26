---
title: Commerce Graph
summary: How NEFE represents business relationships, customer journeys, and commercial signals.
category: Platform
order: 2
status: pilot
updated: 2026-07-24
---

# Commerce Graph

> **Summary:** The Commerce Graph is NEFE’s governed model of participating businesses, relevant relationships, and permitted commercial activity.

## What it represents

The graph may represent:

- Merchants and locations.
- Commercial categories.
- Campaigns and offers.
- Observed commercial connections.

It is intended to make network structure understandable and support opportunity analysis.

```text
Business → Location → Offer
    ↘ Partner relationship ↗
Customer journey → Outcome signal
```

This conceptual diagram is not an API or physical database schema.

## Status

- **Pilot:** Graph-backed views and relationship analysis may be available in configured pilot environments. Exact entities, signals, and refresh behavior depend on the deployment.
- **Proposed:** Automated graph expansion, cross-network portability, and generalized external graph APIs are not represented as implemented.

## Governance

Only approved data should contribute to graph analysis. What each role can see or use is determined by:

- Participation agreements.
- Access controls.
- Purpose limitation.
- Retention rules.

See [privacy and data protection](../security/privacy-data-protection.md).

## Business uses

- Identify complementary participants.
- Understand gaps in a customer journey.
- Evaluate concentration and dependency.
- Provide context to the [Opportunity Engine](./opportunity-engine.md).
- Support network-level [analytics](./analytics.md).

## Interpretation

A graph connection indicates a modeled commercial relationship or signal. It does not establish:

- Guaranteed causation.
- Endorsement.
- A legal partnership.
