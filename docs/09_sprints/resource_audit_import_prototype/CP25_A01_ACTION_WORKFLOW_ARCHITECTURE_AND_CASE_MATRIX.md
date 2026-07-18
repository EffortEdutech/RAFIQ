# CP25-A01 - Action Workflow Architecture And Case Matrix

Date: 2026-07-14

Checkpoint: CP25-A01 - Action Workflow Architecture And Case Matrix

Status: Complete

## 1. Purpose

CP25-A01 locks the private reviewer action workflow before implementation.

The goal is to convert CP24 graph-aware retrieval outputs into reviewer workbench cases with explicit action rules, role ownership, state transitions, required notes, audit requirements, remediation handling, and public-boundary constraints.

CP25-A01 does not implement API, UI, database, or persistence changes. It defines the action workflow that CP25-A02 and later checkpoints must follow.

## 2. Baseline Inputs

| Input | Status | Use in CP25-A01 |
| --- | --- | --- |
| CP24 close-out | Complete | Governing baseline and inherited verifier. |
| CP23 reviewer workflow contract | Complete | Role, status, action, transition, and audit-event source. |
| CP23 internal UI workbench plan | Complete | Reviewer action UX and remediation view source. |
| CP24 validation handoff | Complete | Source of routes, route items, validation gate results, and remediation items. |
| CP24 manifest | Complete | Source of counts, checksums, public-safe zero state, graph/vault refs. |

Inherited proof command:

```powershell
node scripts\check_cp24_close_out.mjs
```

## 3. CP24 Case Baseline

| Metric | Value |
| --- | ---: |
| CP24 fixtures | 10 |
| Evidence routes | 10 |
| Selected route items | 15 |
| Review/rejected route items | 59 |
| Escalation route items | 13 |
| Total route items | 87 |
| Remediation items | 72 |
| High/critical remediation items | 18 |
| Validation gate results | 110 |
| Unresolved references | 5 |
| Missing citation count | 59 |
| Public-safe candidates | 0 |
| Public-safe route items | 0 |

CP25 must represent these CP24 outputs without changing their religious, release, or public-safe status.

## 4. Workflow Architecture

CP25 reviewer workflow has six private stages:

| Stage | Purpose | Output |
| --- | --- | --- |
| Case intake | Convert CP24 route/remediation outputs into bounded review cases. | Review case matrix and queue seed. |
| Claim/review | Assign a role and move an item into active review. | Audit event with from/to status. |
| Decision routing | Request technical, content, scholar, Product Owner, or remediation follow-up. | Status transition and required notes. |
| Remediation action | Track proposed fixes, blockers, closure proof, and history. | Remediation state transition. |
| Private closure | Resolve, reject, defer, retire, or mark as public-release candidate. | Append-only audit event. |
| Boundary verification | Prove no action publishes content or marks public-safe artifacts. | CP25 verifier output. |

Every state-changing action must create an audit event. Audit events are append-only prototype records.

## 5. Reviewer Roles

| Role | CP25 responsibility | May approve public release? |
| --- | --- | --- |
| `technical_reviewer` | IDs, source/provenance/release refs, graph/vault integrity, verifier failures, unresolved references. | No |
| `knowledge_editor` | Attribution wording, translation/tafsir/topic context, source metadata, remediation preparation. | No |
| `scholar_reviewer` | Religious accuracy, hadith usage, tafsir usage, grade/ruling boundaries. | No |
| `product_owner` | Product scope, safety/public-boundary blockers, private readiness, public-candidate routing. | No |
| `admin` | Future release-gate administration and rollback only after a separate public-release checkpoint. | No in CP25 |
| `developer_private` | Debugs private workflow behavior and verifier outputs. | No |

No CP25 role can publish content. Public publication remains outside CP25.

## 6. Reviewer Actions

| Action | Target status | Notes | Boundary |
| --- | --- | --- | --- |
| `claim` | `in_review` | Optional unless item is high/critical. | Private workflow only. |
| `request_technical_review` | `technical_review` | Required. | Does not approve content. |
| `request_content_review` | `content_review` | Required. | Does not approve content. |
| `request_scholar_review` | `scholar_review` | Required. | Requests review; does not become scholar approval. |
| `request_product_owner_review` | `product_owner_review` | Required. | Requests scope/boundary review only. |
| `request_remediation` | `remediation_required` | Required. | Creates or links remediation work. |
| `approve_private` | `resolved_private` | Required. | Clears private workflow use only. |
| `mark_public_candidate` | `approved_public_candidate` | Required. | Candidate for later release-gate simulation only. |
| `reject` | `rejected` | Required. | Keeps item unusable and auditable. |
| `defer` | `deferred` | Required. | Keeps item out of active workflow. |
| `retire` | `retired` | Required. | Closes item while preserving audit trail. |

## 7. State Transition Matrix

| From status | Allowed next statuses |
| --- | --- |
| `queued` | `in_review`, `technical_review`, `content_review`, `scholar_review`, `deferred`, `rejected` |
| `in_review` | `technical_review`, `content_review`, `scholar_review`, `product_owner_review`, `remediation_required`, `resolved_private`, `rejected`, `deferred` |
| `technical_review` | `content_review`, `scholar_review`, `remediation_required`, `resolved_private`, `rejected` |
| `content_review` | `scholar_review`, `product_owner_review`, `remediation_required`, `resolved_private`, `rejected` |
| `scholar_review` | `product_owner_review`, `remediation_required`, `resolved_private`, `rejected` |
| `product_owner_review` | `approved_public_candidate`, `resolved_private`, `rejected`, `deferred` |
| `remediation_required` | `technical_review`, `content_review`, `scholar_review`, `resolved_private`, `rejected` |
| `resolved_private` | `product_owner_review`, `retired` |
| `approved_public_candidate` | `retired`, `rejected` |
| `rejected` | `retired` |
| `deferred` | `queued`, `retired` |

`approved_public_candidate` is not public release. It only means a later public-release gate may inspect the item.

## 8. Required Notes Policy

Notes are required when any of these conditions are true:

- action is not `claim`;
- severity is `high` or `critical`;
- action requests scholar, Product Owner, remediation, rejection, deferral, retirement, private approval, or public-candidate routing;
- case includes escalation evidence;
- case includes missing source, provenance, release state, citation, or unresolved reference;
- case affects hadith grade, verification claim, tafsir, ruling, safety, public boundary, or release boundary;
- transition changes an item out of active review or into closure.

Notes must be operational and auditable. Notes must not include secrets, service keys, raw private prompts, or private user reflections.

## 9. CP24 Fixture-To-Review-Case Matrix

| CP24 fixture | Domain | Selected | Review items | Escalation items | Remediation | High/critical | Initial queue types | Primary roles | Required first action |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| `cp24-fixture-quran-anchor-001` | quran | 3 | 10 | 0 | 10 | 2 | `retrieval_trace`, `source_gap`, `remediation` | `technical_reviewer`, `knowledge_editor` | `request_technical_review` |
| `cp24-fixture-translation-context-001` | translation | 3 | 10 | 0 | 10 | 1 | `retrieval_trace`, `source_gap`, `remediation` | `technical_reviewer`, `knowledge_editor` | `request_content_review` |
| `cp24-fixture-tafsir-context-001` | tafsir | 3 | 10 | 0 | 10 | 1 | `retrieval_trace`, `source_gap`, `remediation` | `technical_reviewer`, `knowledge_editor` | `request_content_review` |
| `cp24-fixture-hadith-support-001` | hadith | 0 | 7 | 0 | 7 | 0 | `hadith_record`, `verification_claim`, `remediation` | `scholar_reviewer`, `technical_reviewer` | `request_scholar_review` |
| `cp24-fixture-hadith-grade-escalation-001` | hadith | 0 | 0 | 7 | 7 | 7 | `grade_assertion`, `escalation`, `remediation` | `scholar_reviewer` | `request_scholar_review` |
| `cp24-fixture-topic-001` | topic | 0 | 1 | 0 | 1 | 0 | `retrieval_trace`, `remediation` | `knowledge_editor` | `request_content_review` |
| `cp24-fixture-validation-history-001` | validation | 3 | 10 | 0 | 10 | 0 | `answer_validation`, `retrieval_trace`, `remediation` | `technical_reviewer` | `request_technical_review` |
| `cp24-fixture-source-gap-001` | source | 0 | 1 | 0 | 1 | 1 | `source_gap`, `remediation` | `technical_reviewer` | `request_remediation` |
| `cp24-fixture-public-boundary-001` | validation | 3 | 10 | 0 | 10 | 0 | `release_boundary`, `answer_validation`, `remediation` | `technical_reviewer` | `request_product_owner_review` |
| `cp24-fixture-safety-escalation-001` | validation | 0 | 0 | 6 | 6 | 6 | `escalation`, `release_boundary`, `remediation` | `product_owner` | `request_product_owner_review` |

## 10. Initial Queue Type Mapping

| Condition | Queue type |
| --- | --- |
| Selected and held route items need evidence-selection review | `retrieval_trace` |
| Missing source, provenance, release state, citation, or unresolved reference | `source_gap` |
| Hadith grade assertion or hadith verification claim | `grade_assertion` or `verification_claim` |
| Validation gate requires review or blocks final citation coverage | `answer_validation` |
| Graph node, edge, vault, or unresolved ID needs inspection | `graph_quality` |
| Vault context needs readability/non-canonical warning review | `vault_pack` |
| Public/private blocker or public-candidate request | `release_boundary` |
| Scholar, safety, ruling, legal, medical, crisis, or Product Owner escalation | `escalation` |
| Any generated CP24 remediation item | `remediation` |

## 11. Remediation State Model

| State | Meaning | Allowed next states |
| --- | --- | --- |
| `open` | Remediation item is newly generated from CP24. | `assigned`, `deferred`, `rejected` |
| `assigned` | Owner role has accepted responsibility. | `in_progress`, `deferred`, `rejected` |
| `in_progress` | Fix/review work is active. | `resolved_private`, `blocked`, `deferred`, `rejected` |
| `blocked` | Cannot proceed without source/provenance/release/scholar/Product Owner input. | `in_progress`, `deferred`, `rejected` |
| `resolved_private` | Cleared for private workflow use only. | `retired`, `product_owner_review` |
| `deferred` | Intentionally postponed. | `open`, `retired` |
| `rejected` | Fix or item is not acceptable. | `retired` |
| `retired` | Closed while preserving history. | None |

Remediation closure requires closure notes and an audit event.

## 12. Audit Event Requirements

Every reviewer action must create an audit event with:

- audit event ID,
- queue item ID or remediation ID,
- action,
- from status,
- to status,
- reviewer role,
- reviewer ID if available,
- notes,
- affected source IDs,
- affected graph node IDs,
- affected graph edge IDs where applicable,
- affected vault pack IDs,
- affected evidence route IDs,
- affected remediation IDs,
- created timestamp,
- public release approved flag set to false.

## 13. Public Boundary Rules

CP25 actions cannot:

- publish content;
- mark a graph node public-safe;
- mark a graph edge public-safe;
- mark a vault pack public-safe;
- mark a route item public-safe;
- bypass validation gates;
- convert `approved_public_candidate` into release approval;
- remove source/provenance/release requirements;
- erase unresolved blocker history.

Any future public release must be handled by a separate public-release checkpoint after CP25.

## 14. Rollback Plan

CP25-A01 is documentation-only. Rollback is limited to reverting:

- this CP25-A01 report,
- CP25 sprint/checklist status updates,
- the CP25-A01 verifier.

If later implementation checkpoints fail, CP25 must keep `node scripts\check_cp24_close_out.mjs` as the first inherited proof command and can return to this A01 matrix without changing CP24 artifacts.

## 15. Verifier Plan

The CP25-A01 verifier must check:

- CP24 close-out verifier still passes;
- CP25 sprint status is `CP25-A01 complete; CP25-A02 pending`;
- checklist A01 rows are `Pass`;
- this report includes action workflow architecture, role matrix, action matrix, transition matrix, required notes policy, fixture-to-case matrix, remediation state model, public boundary rules, rollback plan, and verifier plan;
- CP24 counts remain 10 routes, 87 route items, 72 remediations, 18 high/critical remediations, and zero public-safe route items;
- `approved_public_candidate` is documented as not public release;
- no `.env` path or secret handling is introduced.

## 16. Acceptance

CP25-A01 is complete when the action workflow architecture, action and role matrix, CP24 fixture-to-review-case map, allowed transition table, required notes policy, rollback plan, and verifier plan are documented and verified.

Status: complete.
