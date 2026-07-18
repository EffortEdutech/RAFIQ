# CP25-A04 - Audit Event And Decision Ledger

Date: 2026-07-15

Status: Complete

Owner: RAFIQ reviewer workbench, private-content, and knowledge graph workstream

## 1. Purpose

CP25-A04 creates the bounded private audit event and decision ledger model for reviewer actions.

The checkpoint starts from CP25-A03 review queue and remediation state exports. It generates prototype reviewer action events, validates state transitions, records previous/new status diffs, and proves invalid transitions and missing required notes fail verification.

CP25-A04 does not expose an API route. It does not change public release status. It does not publish any graph, vault, Quran, hadith, tafsir, translation, or answer artifact.

## 2. Inputs

| Input | Purpose |
| --- | --- |
| `data/review/cp25/review-queue.json` | Source queue items from CP25-A03. |
| `data/review/cp25/remediation-state.json` | Source remediation state from CP25-A03. |
| `data/review/cp25/manifest.json` | CP25-A03 manifest and checksums. |
| `packages/shared/src/private-content.ts` | CP25 audit event, action, role, status, remediation, and public-boundary contracts. |

## 3. Outputs

| Output | Purpose |
| --- | --- |
| `data/review/cp25/audit-events.json` | 72 audit events, one per A03 queue item. |
| `data/review/cp25/decision-ledger.json` | 72 ledger entries linking events, validation, status diffs, and affected refs. |
| `data/review/cp25/invalid-action-fixtures.json` | Negative fixtures for invalid transitions, missing required notes, public-candidate misuse, and public-safe requests. |
| `data/review/cp25/transition-rules.json` | Action target statuses, allowed transition matrix, required notes policy, and immutable ordering rules. |
| `data/review/cp25/audit-decision-ledger-manifest.json` | A04 manifest, counts, summaries, checksums, and public boundary. |
| `scripts/generate_cp25_audit_decision_ledger.mjs` | Deterministic A04 generator. |
| `scripts/check_cp25_a04_audit_decision_ledger.mjs` | A04 verifier. |

## 4. Ledger Rules

The generator applies these rules:

1. Every valid prototype action creates an audit event.
2. Every audit event has a matching decision ledger entry.
3. Every ledger entry records action, actor role, previous status, new status, validation result, timestamp, and affected refs.
4. Event ordering is append-only and contiguous.
5. Notes are required for all generated actions.
6. Invalid transitions fail verification.
7. Missing required notes fail verification.
8. Public-safe change requests fail verification.
9. Public release remains false on every event and ledger entry.

## 5. Generated Counts

| Count | Value |
| --- | ---: |
| A03 queue items | 72 |
| Audit events | 72 audit events |
| Decision ledger entries | 72 |
| Valid action entries | 72 |
| Invalid action fixtures | 4 |
| Invalid transition fixtures | 3 |
| Missing required notes fixtures | 1 |
| Public boundary fixtures | 1 |
| Public-release approved events | 0 |
| Public-safe candidates | 0 |
| Public-safe route items | 0 |

## 6. Decision Model

The A04 decision ledger records private reviewer workflow movement only.

Examples of valid movement:

- `technical_review -> remediation_required`
- `content_review -> remediation_required`
- `scholar_review -> remediation_required`
- `remediation_required -> technical_review`
- `remediation_required -> content_review`
- `remediation_required -> scholar_review`
- `remediation_required -> rejected` for Product Owner safety blockers that must remain unusable until a later API workflow models a richer Product Owner remediation loop.

The ledger does not execute permanent state changes. It provides auditable prototype events and status diffs for CP25-A05 API implementation.

## 7. Negative Fixtures

The invalid fixture artifact proves:

- invalid transitions fail verification;
- missing required notes fail verification;
- public-candidate routing without Product Owner status fails verification;
- public-safe change requests fail verification.

These fixtures are intentionally rejected and are not included in `audit-events.json`.

## 8. Governance Boundary

The A04 export is private-only.

- `publicReleaseApproved` remains `false`.
- `publicRouteExposed` remains `false`.
- `publicSafeChangeRequested` remains `false`.
- Public-safe graph node, graph edge, vault artifact, candidate, and route item counts remain zero.
- `approved_public_candidate` remains a review status for a later release-gate simulation, not publication.

## 9. Verification

Run:

```powershell
node scripts\check_cp25_a04_audit_decision_ledger.mjs
```

The verifier checks:

- inherited CP25-A03 verifier still passes;
- 72 audit events and 72 ledger entries exist;
- every ledger entry has a matching audit event;
- every action records actor role, target, from status, to status, notes, timestamp, and affected refs;
- event ordering is append-only;
- invalid transitions fail verification;
- missing required notes fail verification;
- public-safe requests fail verification;
- checksums match generated artifacts;
- public-safe counts remain zero;
- sprint plan and checklist status are updated.

## 10. Limitations

CP25-A04 does not expose private API routes. That is CP25-A05.

CP25-A04 does not create UI controls. That is CP25-A06.

CP25-A04 does not resolve real remediation items or approve public content. It creates prototype events and a ledger model for later action workflow implementation.

## 11. Next Checkpoint

Proceed next with:

```text
CP25-A05 - Private API Prototype
```

Reason: CP25-A04 now has a deterministic private audit event and decision ledger model. CP25-A05 should expose bounded private routes that validate action requests, create audit events, return state diffs, and preserve public-release boundaries.
