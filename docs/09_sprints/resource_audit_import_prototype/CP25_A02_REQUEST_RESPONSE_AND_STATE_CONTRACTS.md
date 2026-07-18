# CP25-A02 - Request, Response, And State Contracts

Date: 2026-07-15

Checkpoint: CP25-A02 - Request, Response, And State Contracts

Status: Complete

## 1. Purpose

CP25-A02 turns the CP25-A01 reviewer action workflow into explicit shared TypeScript contracts.

The contracts define the private reviewer action request, reviewer action response, review queue item, remediation state, audit event, workbench state response, and public-boundary shape required before API, export, or UI implementation begins.

## 2. Implementation Surface

Primary contract file:

```text
packages/shared/src/private-content.ts
```

Added CP25 contract family:

| Contract | Purpose |
| --- | --- |
| `PrivateCp25ReviewerRole` | Role union for technical, knowledge, scholar, Product Owner, admin, and private developer reviewers. |
| `PrivateCp25ReviewStatus` | Review queue status union from queued through retired. |
| `PrivateCp25ReviewerAction` | Allowed reviewer action union. |
| `PrivateCp25ReviewQueueType` | Queue type union for retrieval, source, grade, validation, graph, vault, release, escalation, remediation, and hadith-record review. |
| `PrivateCp25ReviewSubjectType` | Action target subject union. |
| `PrivateCp25RemediationStatus` | Remediation workflow state union. |
| `PrivateCp25PublicBoundary` | Private/public-safe boundary contract. |
| `PrivateCp25ReviewQueueItem` | Workbench queue item contract. |
| `PrivateCp25RemediationState` | Remediation workflow state contract. |
| `PrivateCp25ReviewerActionRequest` | Private action request contract. |
| `PrivateCp25ReviewerActionValidation` | Transition and notes validation result. |
| `PrivateCp25ReviewAuditEvent` | Append-only audit event contract. |
| `PrivateCp25ReviewerActionResponse` | Private action response contract. |
| `PrivateCp25WorkbenchStateResponse` | Bounded workbench state response contract. |

## 3. Contract Rules

CP25 contracts preserve the CP25-A01 rules:

- action target IDs are explicit;
- `fromStatus`, `toStatus`, `reviewerRole`, and `notes` are represented;
- notes validation is represented through `notesRequired` and `missingRequiredNotes`;
- invalid transitions are represented through `invalidTransition` and `blockedReasons`;
- public boundary fields are explicit and false by type;
- public-safe candidate, route item, graph node, graph edge, and vault artifact counts remain zero by type;
- graph/vault refs remain separate from canonical/source refs;
- `approved_public_candidate` remains a review status, not release approval;
- API routes are private namespace contracts only.

## 4. Request Contract

`PrivateCp25ReviewerActionRequest` requires:

- queue item ID,
- subject type and subject ID,
- action,
- from status,
- reviewer role,
- affected source, graph, vault, route, candidate, and remediation IDs,
- boundary acknowledgement.

The boundary acknowledgement requires:

```ts
{
  privateOnly: true;
  publicReleaseApproved: false;
  publicSafeChangeRequested: false;
}
```

## 5. Response Contract

`PrivateCp25ReviewerActionResponse` returns:

- private notice,
- CP25 checkpoint,
- private route,
- original request,
- validation result,
- queue item,
- optional remediation state,
- audit event,
- public boundary.

This response shape allows later API implementation to show the action outcome without publishing or mutating public content.

## 6. State Contracts

`PrivateCp25ReviewQueueItem` records:

- queue type,
- subject type and ID,
- severity,
- review status,
- assigned role,
- refs to source, graph, vault, evidence route, route item, candidate, and remediation IDs,
- required actions,
- whether notes are required,
- public release approved flag fixed to false.

`PrivateCp25RemediationState` records:

- source CP24 remediation ID,
- evidence route,
- issue type,
- owner role,
- status,
- required action,
- target refs,
- closure notes/proof,
- public release approved flag fixed to false.

## 7. Audit Contract

`PrivateCp25ReviewAuditEvent` is append-only by design and includes:

- action,
- from status,
- to status,
- reviewer role,
- reviewer ID when available,
- notes,
- affected source, graph, vault, evidence route, route item, candidate, and remediation IDs,
- created timestamp,
- public release approved flag fixed to false.

Every later CP25 state-changing action must create one audit event.

## 8. Public Boundary Contract

`PrivateCp25PublicBoundary` keeps CP25 private by type:

- `privateOnly: true`
- `publicReleaseApproved: false`
- `publicRouteExposed: false`
- `publicSafeChangeRequested: false`
- `publicSafeCandidateCount: 0`
- `publicSafeRouteItemCount: 0`
- `publicSafeGraphNodeCount: 0`
- `publicSafeGraphEdgeCount: 0`
- `publicSafeVaultArtifactCount: 0`

CP25 cannot publish content or mark artifacts public-safe. Later public-release work must use a separate release-gate checkpoint.

## 9. Verification

Verifier:

```powershell
node scripts\check_cp25_a02_contracts.mjs
```

Inherited baseline:

```powershell
node scripts\check_cp25_a01_action_workflow_plan.mjs
node scripts\check_cp24_close_out.mjs
```

Build check:

```powershell
corepack pnpm -C packages/shared build
```

## 10. Acceptance

CP25-A02 is complete when the reviewer action request, reviewer action response, review queue item, remediation state, audit event, and public-boundary contracts are implemented, documented, verified, and kept private-only.

Status: complete.
