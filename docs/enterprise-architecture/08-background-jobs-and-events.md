# Background Jobs and Events

## Current state

No durable queue, scheduler or worker is present. Audit, activity and notifications are generally written synchronously. Collaboration and executive decision repositories transactionally couple many related writes; some workspace actions write audit/activity after the primary record mutation.

## When jobs are justified

- due-date and expiry processing;
- notification fan-out beyond small recipient sets;
- report generation that exceeds request budgets;
- integration retries and webhook delivery;
- data imports and reconciliation;
- backup verification and synthetic checks.

## Target pattern

Use a transactional outbox in PostgreSQL:

```text
domain transaction
→ authoritative record + outbox event
→ worker leases event
→ idempotent handler
→ side effect
→ completion/retry/dead-letter state
```

Required fields: event ID, organization ID, type, schema version, safe payload, created time, available time, attempt count, lease, idempotency key and terminal status.

## Vendor options

| Option | Fit | Tradeoff |
|---|---|---|
| PostgreSQL outbox + scheduled worker | Best pilot default | Operational polling and worker ownership |
| Hosting-provider scheduled functions | Good trigger | Provider coupling; not a durable queue alone |
| Managed workflow/queue | Later reliability | Cost and vendor dependency |
| Kafka/event streaming | Poor current fit | Excess complexity |

No vendor is selected or installed by EH0.

## Reliability rules

- At-least-once delivery; handlers must be idempotent.
- Retries use bounded exponential backoff with jitter.
- Dead letters are visible and replayable by authorized operators.
- Events contain identifiers and safe facts, not private comments or decision rationale.
- Tenant context is carried and revalidated by the handler.
- Activity/audit records are not treated as a queue.

