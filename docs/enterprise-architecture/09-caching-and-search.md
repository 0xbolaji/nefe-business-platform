# Caching and Search

## Current state

- React `cache()` deduplicates workspace-context and workspace-data calls within a server render.
- No distributed cache was found.
- Workspace search is assembled from persisted workspace data in the client command palette, rather than a dedicated search API.
- PostgreSQL provides current filtering and ordering.

## Search evolution

1. **Pilot:** relational queries with tenant predicates, bounded limits and appropriate indexes.
2. **Early scale:** PostgreSQL full-text/trigram indexes, ranked results and a versioned search endpoint.
3. **External engine:** only when measured corpus size, relevance needs, typo handling, faceting or latency exceed PostgreSQL’s acceptable envelope.

Search results must contain type, label, concise context, status and direct route. Permission filtering occurs before results leave the server.

## Cache policy

Cache only data with an explicit owner, key, TTL, invalidation event and authorization model.

- Never cache role/permission decisions beyond the current server request.
- Key tenant data by organization and, where applicable, user.
- Avoid caching private comments, decision rationale and exports at shared edges.
- Invalidate summaries after mutations; do not rely solely on TTL.
- Introduce a distributed cache only after measurement proves database or computation pressure.

## Immediate recommendation

Reduce the broad workspace payload before adding cache. Caching an oversized tenant snapshot would preserve stale authorization and amplify invalidation complexity.

