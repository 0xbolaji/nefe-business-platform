# Commercial Graph Foundation

## Current foundation

The relational model already contains businesses, relationships, opportunity/campaign participants, journey stages, pilot participants and recommendations. This is a useful graph-shaped domain, but not yet a governed Commercial Graph.

## Required model qualities

- Stable entity identity and source-system keys.
- Typed, directed relationships.
- Organization ownership and visibility policy.
- Provenance: who/what asserted the edge.
- Effective-from/effective-to timestamps.
- Confidence and verification status.
- Consent and permitted-use classification.
- Deduplication and entity-resolution policy.
- Historical preservation and correction workflow.

## Relational-first model

Use PostgreSQL tables and indexes for initial graph workloads. Benchmark actual questions:

- Which businesses participate in the same opportunities, campaigns or pilots?
- Which journey stages lack coverage?
- Which relationships generated measurable outcomes?
- What is the shortest relevant path between two businesses?

Only evaluate a graph database when multi-hop query complexity, latency and volume are measured and relational approaches fail accepted objectives.

## Before launch

- Repair known relationship gaps described in [data architecture](06-data-and-database-architecture.md).
- Define canonical business identity and merge policy.
- Separate observed facts from modeled recommendations.
- Attach provenance and temporal validity.
- Establish graph quality metrics and human correction.
- Complete tenant and cross-organization data-sharing policy.

