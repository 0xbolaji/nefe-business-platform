---
title: Security Overview
summary: Security principles and responsibility boundaries for NEFE deployments.
category: Security
order: 1
status: live
updated: 2026-07-24
---

# Security Overview

> **Summary:** NEFE security is based on risk-appropriate controls, least privilege, data minimization, accountable operations, and deployment-specific verification.

## Security principles

- Authenticate users and services according to deployment risk.
- Authorize access with least privilege.
- Separate environments and protect secrets.
- Minimize collection and exposure of sensitive data.
- Log material administrative and security events.
- Maintain incident reporting and recovery procedures.
- Review third parties and integrations before use.

## Status and assurance

These principles are **Live** as documentation requirements. The following must be verified for the relevant environment:

- Specific technical controls.
- Certifications.
- Penetration-test results.
- Service levels.
- Hosting locations.
- Compliance claims.

They must not be inferred from this page.

## Shared responsibility

- **NEFE product operators** are responsible for configured platform controls.
- **Network operators** govern participation and access.
- **Merchants** protect their accounts, devices, and submitted content.
- **Integration owners** secure connected systems and credentials.

## Reporting concerns

- Use the approved private security channel for suspected vulnerabilities or incidents.
- Do not include credentials, personal data, or exploit details in public support channels.

## Related pages

Read [privacy and data protection](./privacy-data-protection.md), [roles and permissions](./roles-permissions.md), and [enterprise deployment](../business/enterprise-deployment.md).
