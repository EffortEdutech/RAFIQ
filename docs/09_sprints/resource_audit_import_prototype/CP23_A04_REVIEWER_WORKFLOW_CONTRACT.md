# CP23-A04 - Reviewer Workflow Contract

Date: 2026-07-13

Status: Complete

Scope: Private reviewer workflow contract for retrieval, validation, graph, vault, remediation, and release-boundary review. No implementation is started by this document.

## 1. Purpose

This contract defines how RAFIQ reviewers should inspect graph-aware retrieval and validation outcomes.

The workflow must support technical review, knowledge editing, scholar/content review, Product Owner decisions, remediation, auditability, and future public-release gates without mixing those decisions together.

## 2. Current Baseline

The current shared private content contract already includes review queue items, retrieval trace detail, answer validation runs, and reviewer action status for answer validation.

Current queue/action types are intentionally narrower than the CP23 target. CP23-A04 defines the future expansion contract.

## 3. Reviewer Roles

| Role | Primary responsibility |
| --- | --- |
| `technical_reviewer` | Checks IDs, references, source links, graph integrity, imports, and verifier findings. |
| `knowledge_editor` | Checks attribution wording, topics, source metadata, and remediation preparation. |
| `scholar_reviewer` | Reviews religious accuracy, hadith usage, tafsir usage, and ruling boundaries. |
| `product_owner` | Approves product scope, private readiness, and public-release candidate decisions. |
| `admin` | Publishes approved public content only after release gates pass; manages rollback. |
| `developer_private` | Debugs private workflow behavior without approving religious/public use. |

## 4. Queue Types

Recommended CP23 queue types:

| Queue type | Purpose |
| --- | --- |
| `retrieval_trace` | Review evidence selection, rejected candidates, and graph expansion behavior. |
| `source_gap` | Review missing source, provenance, licensing, attribution, or release refs. |
| `grade_assertion` | Review hadith grade claims and methodology context. |
| `verification_claim` | Review hadith/source verification evidence. |
| `answer_validation` | Review guided answer validation failures or private-review-required passes. |
| `graph_quality` | Review CP22 graph quality warnings, withheld nodes, or broken candidates. |
| `vault_pack` | Review generated vault packs for readability, traceability, and non-canonical warning. |
| `release_boundary` | Review public/private blockers and public-release candidate readiness. |
| `escalation` | Review scholar, safety, legal, medical, crisis, or ruling escalation paths. |
| `remediation` | Review proposed fixes and confirm they were resolved. |

## 5. Queue Item Contract

```ts
type Cp23ReviewQueueItem = {
  queueItemId: string;
  queueType: string;
  subjectType: 'retrieval_trace' | 'evidence_route' | 'graph_node' | 'graph_edge' | 'vault_pack' | 'guided_answer' | 'answer_validation_run' | 'remediation';
  subjectId: string;
  title: string;
  summary?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reviewStatus: Cp23ReviewStatus;
  assignedRole: 'technical_reviewer' | 'knowledge_editor' | 'scholar_reviewer' | 'product_owner' | 'admin' | 'developer_private';
  sourceIds: string[];
  graphNodeIds: string[];
  graphEdgeIds: string[];
  vaultPackIds: string[];
  evidenceRouteIds: string[];
  remediationIds: string[];
  createdAt: string;
  updatedAt: string;
};
```

## 6. Review Statuses

| Status | Meaning |
| --- | --- |
| `queued` | Awaiting review. |
| `in_review` | Claimed or actively being reviewed. |
| `technical_review` | Needs structural/source/import review. |
| `content_review` | Needs editorial or knowledge-editor review. |
| `scholar_review` | Needs qualified religious review. |
| `product_owner_review` | Needs Product Owner scope/release decision. |
| `remediation_required` | Specific fix is required. |
| `resolved_private` | Cleared for private/internal use. |
| `approved_public_candidate` | Candidate for public-release gate review only. |
| `rejected` | Must not be used. |
| `retired` | Closed but retained for audit. |
| `deferred` | Intentionally postponed. |

## 7. Reviewer Actions

| Action | Allowed target status | Required notes |
| --- | --- | --- |
| `claim` | `in_review` | Optional |
| `request_technical_review` | `technical_review` | Required |
| `request_content_review` | `content_review` | Required |
| `request_scholar_review` | `scholar_review` | Required |
| `request_product_owner_review` | `product_owner_review` | Required |
| `request_remediation` | `remediation_required` | Required |
| `approve_private` | `resolved_private` | Required |
| `mark_public_candidate` | `approved_public_candidate` | Required |
| `reject` | `rejected` | Required |
| `defer` | `deferred` | Required |
| `retire` | `retired` | Required |

No action publishes content. Public publication remains a separate release-gate operation.

## 8. State Transition Rules

| From | Allowed next states |
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

## 9. Audit Event Contract

Every reviewer action must create an audit event.

```ts
type Cp23ReviewAuditEvent = {
  auditEventId: string;
  queueItemId: string;
  action: string;
  fromStatus: string;
  toStatus: string;
  reviewerRole: string;
  reviewerId?: string;
  notes: string;
  sourceIds: string[];
  graphNodeIds: string[];
  vaultPackIds: string[];
  remediationIds: string[];
  createdAt: string;
};
```

Audit events must not include secrets, service keys, raw private prompts, or private user reflections unless a separate privacy design approves it.

## 10. Remediation Handoff

A remediation item must identify:

- issue type,
- target canonical refs,
- target graph nodes/edges,
- target vault packs,
- responsible role,
- required action,
- blocking status,
- verification command or review method,
- closure notes.

Remediation closure must link back to the original queue item and evidence route.

## 11. Source And Provenance Display Requirements

Reviewer screens must show:

- canonical source IDs,
- graph node IDs,
- graph edge IDs where relevant,
- vault pack IDs,
- release states,
- quality states,
- review states,
- selected/rejected evidence status,
- non-canonical vault warning.

## 12. Verifier Requirements

The future CP23 verifier must fail when:

- a queue item lacks assigned role,
- a high or critical item lacks notes,
- a state transition is not allowed,
- an audit event lacks from/to status,
- a remediation item lacks owner or closure path,
- a queue item references unresolved graph/vault IDs,
- a public candidate skips Product Owner review.

## 13. Acceptance

CP23-A04 is complete when queue types, reviewer roles, actions, state transitions, audit event requirements, remediation handoff, source/provenance display requirements, and verifier requirements are documented.

Status: complete.

