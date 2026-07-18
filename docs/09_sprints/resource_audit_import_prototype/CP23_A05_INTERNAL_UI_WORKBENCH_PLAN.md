# CP23-A05 - Internal UI Workbench Plan

Date: 2026-07-13

Status: Complete

Scope: Private internal UI plan for graph-aware retrieval, evidence route inspection, validation triage, reviewer actions, graph/vault context, and remediation review. No implementation is started by this document.

## 1. Purpose

CP23-A05 defines the internal workbench RAFIQ needs before implementing CP23-A06.

The workbench should help internal reviewers see how graph-aware retrieval selected evidence, why validation passed or failed, which graph/vault artifacts explain the route, and what action is required next.

## 2. Current UI Baseline

Current internal surfaces include:

- private search and source search services,
- review queue service calls,
- guided answer and validation service calls,
- CP22 `/knowledge-graphify` screen with bounded graph/vault summaries,
- private navigation components and private workspace shell.

CP23-A05 plans new workbench surfaces without changing them yet.

## 3. Screen Map

Recommended internal routes:

| Route | Purpose |
| --- | --- |
| `/knowledge-graphify` | Existing CP22 graph/vault explorer remains available. |
| `/review-workbench` | New CP23 landing screen for queue, filters, and workload summary. |
| `/review-workbench/trace/[traceId]` | Retrieval trace and graph-aware evidence route review. |
| `/review-workbench/validation/[answerValidationRunId]` | Guided answer validation triage and reviewer action. |
| `/review-workbench/queue/[queueItemId]` | Queue item detail with source, graph, vault, and remediation context. |
| `/review-workbench/remediation/[remediationId]` | Remediation detail and closure proof. |

Initial implementation may place all panels under one route if routing would delay the prototype, but the UI model should preserve these conceptual screens.

## 4. Workbench Landing

The landing screen should show:

- queue summary by status,
- queue summary by type,
- high/critical item count,
- validation failures,
- remediation-required count,
- scholar escalation count,
- public-release boundary blockers,
- recent evidence routes,
- link to CP22 graph/vault explorer.

Required filters:

- queue type,
- review status,
- severity,
- assigned role,
- source ID,
- graph node ID,
- validation status,
- release state,
- quality state.

## 5. Retrieval Trace Review

The trace screen should show:

- query text or safe query summary,
- intent and domain,
- retrieval trace metadata,
- selected evidence route items,
- rejected evidence route items,
- graph expansion depth and rules,
- ranking signals,
- source/provenance/release refs,
- quality and review states,
- vault pack links,
- validation outcomes connected to the trace.

Reviewer actions available from this screen:

- request technical review,
- request content review,
- request scholar review,
- request remediation,
- approve private,
- reject,
- defer.

## 6. Evidence Route Inspection

Evidence route panels should make selected and rejected evidence equally visible.

Required panels:

| Panel | Contents |
| --- | --- |
| Selected evidence | Quran anchors, tafsir context, translations, hadith support, source context. |
| Rejected evidence | Candidate refs, rejection reason, quality/release blockers. |
| Graph path | Node IDs, edge IDs, edge statuses, expansion depth. |
| Vault context | Vault pack title, artifact ID, category, non-canonical warning. |
| Source proof | Source IDs, provenance IDs, release-state IDs. |
| Risk boundary | scholar/safety/ruling/public-release blockers. |

## 7. Validation Triage

Validation screen should show:

- guided answer ID,
- model adapter run ID,
- answer validation run ID,
- candidate answer,
- citation IDs,
- cited source IDs,
- missing citations,
- uncited claim findings,
- validation status,
- validation gate table,
- reviewer action status and notes,
- linked evidence route,
- linked queue item.

Validation triage must never present the candidate answer as user-approved guidance.

## 8. Reviewer Action UX

Reviewer action controls should include:

- action selector,
- required notes field for review-changing actions,
- role indicator,
- affected graph/vault/source summary,
- confirmation step for reject, public candidate, or remediation closure,
- audit preview before submit.

Actions that should require notes:

- request review,
- request remediation,
- approve private,
- mark public candidate,
- reject,
- defer,
- retire.

## 9. Remediation View

Remediation view should show:

- issue type,
- severity,
- source IDs,
- canonical refs,
- graph node IDs,
- graph edge IDs,
- vault pack IDs,
- recommended owner,
- recommended action,
- blocking status,
- closure proof,
- verifier command or manual review method.

## 10. Payload Boundary

The UI must use bounded payloads:

| Payload | Boundary |
| --- | --- |
| Queue list | paginated and filterable |
| Retrieval route | selected trace only |
| Graph context | selected nodes/edges only |
| Vault preview | selected pack preview only |
| Validation run | selected validation run only |
| Audit trail | selected queue item or remediation only |

The UI must not load all 79,657 graph nodes or all 147,689 edges into the client.

## 11. Empty, Error, And Escalation States

Required states:

- no queue items,
- no evidence found,
- graph node missing,
- vault pack missing,
- validation blocked,
- source unavailable,
- scholar escalation,
- safety escalation,
- public release blocked,
- remediation required,
- verifier failed.

Each state should be operational and calm. It should explain the next review action, not improvise religious guidance.

## 12. Verification Checklist

CP23-A06 or later UI implementation should verify:

- workbench route loads,
- queue filters work,
- trace detail loads selected route only,
- graph/vault panels show selected context only,
- validation status and reviewer action are visible,
- required notes are enforced,
- public/private warning remains visible,
- no public route exposes CP23 workbench data,
- mobile and desktop layouts do not overlap,
- CP22 combined verifier still passes.

## 13. Acceptance

CP23-A05 is complete when the screen map, primary workflows, evidence route inspection, validation triage, reviewer action UX, remediation view, payload boundaries, empty/error/escalation states, and verification checklist are documented.

Status: complete.

