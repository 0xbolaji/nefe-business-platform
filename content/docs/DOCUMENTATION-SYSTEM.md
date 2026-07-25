---
title: Documentation System
summary: Governance, structure, and publishing rules for NEFE Business Network documentation.
category: Documentation
order: 0
status: live
updated: 2026-07-24
---

# Documentation System

> **Summary:** This guide defines how NEFE documentation is organized, maintained, and interpreted. It is the editorial source of truth for the documentation package.

## Purpose

NEFE Business Network is documented as a business-first commercial platform. Documentation should explain the commercial outcome first, then the workflow, data, and technology that support it.

## Capability labels

Every product statement must use one of these maturity labels when status could be ambiguous:

| Label | Meaning |
| --- | --- |
| **Live** | Available in the current approved product environment. |
| **Pilot** | Available only within a controlled pilot or configured deployment. |
| **Proposed** | A product direction or design concept; not implemented or contractually committed. |

The frontmatter `status` field describes the documentation page, not every capability mentioned on it. Page content remains responsible for labeling capabilities accurately.

## Information architecture

- [Getting Started](./getting-started/index.md) introduces the network and adoption path.
- [Platform](./platform/overview.md) explains core commercial concepts.
- [Merchants](./merchants/onboarding.md) covers merchant operations.
- [Consumers](./consumers/onboarding.md) covers customer experiences.
- [Business](./business/business-model.md) covers commercial architecture and deployment.
- [Ecosystem](./ecosystem/token-utility.md) covers optional participation layers.
- [Security](./security/overview.md) covers controls, privacy, and access.
- [Developers](./developers/overview.md) sets safe integration expectations.
- [Reference](./reference/faq.md) provides definitions, changes, and answers.

## Authoring rules

1. Use sentence-case headings and plain business language.
2. Keep YAML frontmatter complete and accurate.
3. Use relative Markdown links and verify each target.
4. Never describe a proposed API, token mechanism, or automated decision as live.
5. Record material documentation changes in the [changelog](./reference/changelog.md).

## Page frontmatter

```yaml
---
title: Page title
summary: One-sentence description.
category: Platform
order: 1
status: live
updated: 2026-07-24
---
```

## Ownership and review

- Business owners validate commercial claims.
- Product owners validate capability status.
- Security owners validate control language.
- Documentation maintainers validate structure and links.

Release notes should identify changes without exposing confidential implementation details.
