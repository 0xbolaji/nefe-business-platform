# Scalability and Performance

## Scale bands

| Band | Organizations | Users | Businesses | Goal |
|---|---:|---:|---:|---|
| Controlled pilot | 3–10 | 250 | 10,000 | Safe learning and supportability |
| Early commercial | 100 | 5,000 | 250,000 | Predictable response and operations |
| Regional | 1,000 | To be measured | To be measured | Capacity plan based on actual workloads |

These are planning assumptions, not tested capacity claims.

## Current risks

[`getWorkspaceData`](../../app/lib/data/workspace-repository.ts) runs roughly thirty queries and hydrates most tenant records for the shared workspace layout. It then performs repeated in-memory filtering to assemble nested view models. React request caching prevents some duplicate calls in one render, but does not make the payload or database work scalable.

The database client limits each runtime instance to ten connections. Total production connections therefore depend on instance concurrency, which is unverified.

## Necessary now

- Instrument route latency, query count, query duration, result row count and serialized payload size.
- Replace layout-wide hydration with small shell summaries and route-specific reads.
- Add bounded pagination to businesses, opportunities, campaigns, journeys, pilots, notifications and activity.
- Review tenant-leading indexes with `EXPLAIN (ANALYZE, BUFFERS)` in staging.
- Remove repeated in-memory joins only after profiles identify material cost.
- Test 3–5 pilot companies with realistic record distribution and concurrency.
- Define connection-budget alerts and database saturation behavior.

## Premature now

- Microservices.
- Read replicas.
- Sharding.
- Kafka.
- Redis solely for speed.
- Elasticsearch/OpenSearch.
- Graph database.

## Performance objectives

Initial pilot targets, subject to baseline measurement:

- p95 authenticated server response under 1.5 seconds for ordinary reads.
- p95 mutations under 2 seconds excluding exports.
- error rate below 1% excluding user validation.
- no route returns unbounded tenant collections.
- database connection utilization below 70% sustained.

These become commitments only after staging load validation.

