# CP25 - Reviewer Workbench Action Workflow Sprint Plan

Date: 2026-07-14

Status: CP25 complete; recommended next scope CP26

Owner: RAFIQ review, validation, private-content, and knowledge graph workstream

## 1. Objective

CP25 turns the CP24 private graph-aware retrieval prototype into a private reviewer workbench action workflow.

The sprint should let internal reviewers inspect CP24 retrieval traces, evidence routes, validation handoffs, and remediation items; record bounded reviewer actions; create audit events; update remediation workflow states; and prove that no reviewer action publishes content or marks any artifact public-safe without a separate public-release gate.

CP25 does not approve public release. CP25 does not make reviewer actions equivalent to scholar approval. CP25 does not make graph/vault evidence canonical. CP25 only creates private workflow controls and auditability around CP24 outputs.

## 2. Baseline

CP25 starts after:

| Baseline | Status | Evidence |
| --- | --- | --- |
| CP22 full private resource graph and vault | Complete | `CP22_G10_CLOSE_OUT_REPORT.md` |
| CP23 reviewer workflow and internal UI contracts | Complete | `CP23_A04_REVIEWER_WORKFLOW_CONTRACT.md`; `CP23_A05_INTERNAL_UI_WORKBENCH_PLAN.md` |
| CP23 close-out | Complete | `CP23_A10_CLOSE_OUT_AND_NEXT_SCOPE_DECISION_REPORT.md` |
| CP24 graph-aware retrieval prototype | Complete | `CP24_G09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md` |
| CP24 combined verifier | Passing | `scripts/check_cp24_close_out.mjs` |

Inherited facts:

- CP22 graph nodes: 79,657.
- CP22 graph edges: 147,689.
- CP22 vault artifacts: 158.
- CP22 public-safe graph nodes: 0.
- CP22 public-safe graph edges: 0.
- CP22 public-safe vault artifacts: 0.
- CP24 fixtures: 10.
- CP24 selected candidates: 15.
- CP24 evidence routes: 10.
- CP24 route items: 87.
- CP24 remediation items: 72.
- CP24 public-safe candidates and route items: 0.
- Public release remains blocked.

## 3. Product Boundaries

CP25 must preserve these boundaries:

1. Reviewer actions are private workflow records, not public publication actions.
2. `approve_private` can clear an item for private/internal workflow use only.
3. `mark_public_candidate` can only create a public-release candidate for a later release-gate simulation; it cannot publish content.
4. Scholar, content, technical, Product Owner, and admin roles remain distinct.
5. Remediation closure must not erase the audit trail or original issue.
6. CP24 evidence routes remain private artifacts.
7. Graph/vault IDs remain derived metadata and do not replace canonical source refs.
8. Any action affecting high, critical, scholar, ruling, safety, source, provenance, release, or public-boundary issues requires notes.
9. Public-safe counts remain zero throughout CP25.
10. No `.env` files or secrets are required, read, printed, or embedded in artifacts.

## 4. Controlling Documents

CP25 is governed by:

- `docs/09_sprints/resource_audit_import_prototype/CP24_G09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`
- `docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_SPRINT_PLAN.md`
- `docs/09_sprints/resource_audit_import_prototype/CP23_A04_REVIEWER_WORKFLOW_CONTRACT.md`
- `docs/09_sprints/resource_audit_import_prototype/CP23_A05_INTERNAL_UI_WORKBENCH_PLAN.md`
- `docs/09_sprints/resource_audit_import_prototype/CP23_A10_CLOSE_OUT_AND_NEXT_SCOPE_DECISION_REPORT.md`
- `docs/09_sprints/resource_audit_import_prototype/CP22_G10_CLOSE_OUT_REPORT.md`
- `docs/04_knowledge/RAFIQ_KNOWLEDGE_GRAPHIFY_AND_VAULT_ARCHITECTURE_V1.md`
- `docs/04_knowledge/RAFIQ_KNOWLEDGE_GRAPHIFY_GRAPH_CONTRACT_V1.md`
- `docs/04_knowledge/RAFIQ_KNOWLEDGE_VAULT_ARTIFACT_CONTRACT_V1.md`
- `docs/03_ai_engine/RAFIQ_AI_Validation_Gates_V1.md`
- `docs/07_governance/RAFIQ_Content_Governance_Specification_V1.md`
- `docs/07_governance/RAFIQ_Trust_Authenticity_Framework_V1.md`

## 5. Implementation Surface

Expected private implementation surfaces:

| Surface | Expected role |
| --- | --- |
| `packages/shared/src/private-content.ts` | Add CP25 reviewer action, remediation state, audit event, and workbench response contracts. |
| `apps/api/src/modules/private-content/private-content.service.ts` | Implement private action workflow prototype logic and bounded state transitions. |
| `apps/api/src/modules/private-content/private-content.controller.ts` | Add private reviewer action and remediation workflow routes only. |
| `apps/api/src/modules/private-content/private-content.dto.ts` | Validate action requests, required notes, role, target IDs, and allowed transitions. |
| `apps/api/src/modules/private-content/private-content.openapi.ts` | Document private CP25 DTOs and routes. |
| `apps/mobile/src/services/privateContentApi.ts` | Add private CP25 reviewer action and remediation workflow client calls. |
| `apps/mobile/app/review-workbench.tsx` and/or `apps/mobile/app/graph-aware-retrieval.tsx` | Add private action controls, audit preview, remediation state display, and blocked public boundary indicators. |
| `data/review/cp25/` | Store bounded private prototype action workflow outputs, audit events, and manifests if generated artifacts are needed. |
| `scripts/` | Add generators/checkers for action matrix, state transitions, audit export, remediation workflow, UI proof, and combined verification. |

## 6. Checkpoints

### CP25-A01 - Action Workflow Architecture And Case Matrix

Purpose: define the reviewer action workflow before implementation.

Status: Complete. See `CP25_A01_ACTION_WORKFLOW_ARCHITECTURE_AND_CASE_MATRIX.md`.

Deliverables:

- action workflow architecture note,
- action and role matrix,
- CP24 fixture-to-review-case map,
- allowed state transition table,
- required notes policy,
- rollback and verifier plan.

Acceptance:

- CP24 close-out is the controlling baseline;
- reviewer actions are private-only;
- public publication is explicitly out of scope;
- high/critical/escalation/public-boundary actions require notes;
- CP23 role/action/status contract is preserved or explicitly extended.

### CP25-A02 - Request, Response, And State Contracts

Purpose: turn CP23-A04 and CP24 handoff outputs into concrete CP25 shared contracts.

Status: Complete. See `CP25_A02_REQUEST_RESPONSE_AND_STATE_CONTRACTS.md`.

Deliverables:

- reviewer action request contract,
- reviewer action response contract,
- review queue item contract extension,
- remediation state contract,
- audit event contract,
- public-boundary contract.

Acceptance:

- action target IDs are explicit;
- from/to status and actor role are required;
- required notes are enforceable;
- public-safe and publication fields remain false by default;
- graph/vault refs remain separate from canonical refs.

### CP25-A03 - Review Queue And Remediation State Export

Purpose: generate bounded private workbench state from CP24 outputs.

Status: Complete. See `CP25_A03_REVIEW_QUEUE_AND_REMEDIATION_STATE_EXPORT.md`.

Deliverables:

- review queue export,
- remediation state export,
- role assignment summary,
- severity and blocker summary,
- unresolved reference report,
- manifest and checksums.

Acceptance:

- all 72 CP24 remediation items are represented or explicitly deferred;
- high/critical blockers remain visible;
- queue items reference CP24 route/candidate/remediation IDs;
- graph/vault IDs resolve through CP22/CP24 indexes;
- public-safe counts remain zero.

### CP25-A04 - Audit Event And Decision Ledger

Purpose: create a bounded audit trail model for reviewer actions.

Status: Complete. See `CP25_A04_AUDIT_EVENT_AND_DECISION_LEDGER.md`.

Deliverables:

- audit event schema,
- decision ledger artifact,
- action-to-transition verifier,
- required notes verifier,
- previous/new status diff model,
- immutable event ordering rules.

Acceptance:

- every action creates an audit event;
- each event records actor role, action, target, from status, to status, reason/notes, timestamp, and affected refs;
- invalid transitions fail verification;
- missing required notes fail verification;
- no event publishes content.

### CP25-A05 - Private API Prototype

Purpose: expose CP25 action workflow behind private API only.

Status: Complete. See `CP25_A05_PRIVATE_API_PROTOTYPE.md`.

Deliverables:

- private reviewer action route,
- private remediation transition route,
- private audit/ledger preview route,
- service methods,
- OpenAPI private DTOs,
- verifier.

Acceptance:

- routes live under private content namespace;
- no public route is introduced;
- invalid actions fail safely;
- payloads are bounded and do not dump full graph/vault data;
- reviewer actions cannot mark public-safe artifacts.

### CP25-A06 - Internal UI Action Controls

Purpose: make CP25 actions usable in RAFIQ internal UI.

Status: Complete. See `CP25_A06_INTERNAL_UI_ACTION_CONTROLS.md`.

Deliverables:

- action selector,
- required notes field,
- role/status display,
- audit preview,
- remediation state controls,
- public-boundary warning,
- mobile/desktop layout proof.

Acceptance:

- private mode ribbon remains visible;
- action controls are private-only;
- required notes are visible before submit;
- risky actions have confirmation copy;
- public-release blocked state remains visible;
- no public route exposes CP25 workflow data.

### CP25-A07 - Audit Export And Remediation Review Proof

Purpose: prove reviewer actions and remediation workflow outputs can be exported and inspected.

Status: Complete. See `CP25_A07_AUDIT_EXPORT_AND_REMEDIATION_REVIEW_PROOF.md`.

Deliverables:

- audit event export,
- remediation transition export,
- reviewer workload summary,
- blocker summary,
- unresolved action report,
- checksum manifest.

Acceptance:

- audit exports are private-only;
- remediation transitions link back to original CP24 items;
- open blockers remain visible;
- resolved/deferred/rejected states preserve history;
- public-safe counts remain zero.

### CP25-A08 - Combined Verification

Purpose: provide one command that verifies CP22, CP23, CP24, and CP25 workflow boundaries.

Status: Complete. See `CP25_A08_COMBINED_VERIFICATION.md`.

Deliverables:

- combined verifier,
- inherited CP24 close-out verifier,
- CP25 contract checks,
- transition/audit checks,
- private API/UI checks,
- public boundary checks.

Acceptance:

- CP24 close-out still passes;
- all CP25 generated action/audit/remediation artifacts pass schema checks;
- invalid transitions and missing required notes are rejected;
- no public CP25 route exists;
- public-safe counts remain zero;
- no secrets or `.env` values are printed.

### CP25-A09 - Close-Out And Next Scope Decision

Purpose: close CP25 and decide whether to proceed to CP26 live snapshot export, CP27 public release gate simulation, or CP28 approved public study pack track.

Status: Complete. See `CP25_A09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`.

Deliverables:

- close-out report,
- final checklist,
- known limitations,
- next scope recommendation.

Acceptance:

- CP25 combined verifier passes;
- action workflow limits are documented;
- public release remains blocked unless a separate public-release track explicitly approves otherwise;
- next scope is selected with rationale.

## 7. Acceptance Gates

CP25 cannot close unless:

- `node scripts\check_cp24_close_out.mjs` remains passing;
- CP25 combined verifier exists and passes;
- reviewer actions produce audit events;
- invalid transitions are rejected;
- required notes are enforced;
- remediation state changes preserve history;
- high/critical/escalation/public-boundary blockers remain visible;
- no public route exposes CP25 private workflow data;
- public-safe counts remain zero;
- docs and verifier commands are updated.

## 8. Risks

| Risk | Mitigation |
| --- | --- |
| Reviewer action is mistaken for public approval | Keep public release separate and verifier-enforced. |
| `approve_private` is interpreted as religious approval | Label it as private workflow clearance only. |
| Audit trail can be overwritten | Use append-only event model for prototype exports. |
| Required notes are skipped | Fail verifier for note-required actions without notes. |
| Remediation closure hides unresolved issues | Preserve original issue, closure proof, and audit event chain. |
| Full graph/vault payload reaches client | Use bounded selected IDs and summaries only. |
| CP25 drifts from CP23 workflow contract | Use CP23 and CP24 close-out verifiers as inherited gates. |

## 9. Recommended First Action

Proceed next with:

```text
CP26 - Live Snapshot Export And Refresh
```

Reason: CP25 is complete and has clarified the reviewer action, audit, remediation, blocker, and private boundary shapes that need to join a repeatable source/export pipeline. CP26 should move RAFIQ from checked-in generated artifacts toward safe live snapshot export and refresh.
