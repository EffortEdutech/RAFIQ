# CP23-A03 - Evidence Route And Validation Contract

Date: 2026-07-13

Status: Complete

Scope: Private evidence route and validation linkage contract for graph-aware retrieval. No implementation is started by this document.

## 1. Purpose

This contract defines how CP23 graph-aware retrieval should connect retrieval traces, evidence routes, guided answers, model adapter runs, validation runs, reviewer queues, graph nodes, and vault packs.

The goal is to make every answer path inspectable without presenting generated evidence routes as religious authority.

## 2. Evidence Route Model

An evidence route is a private workflow artifact that records how RAFIQ moved from a query to selected and rejected evidence.

```ts
type Cp23EvidenceRoute = {
  evidenceRouteId: string;
  retrievalTraceId: string;
  queryText: string;
  intent: string;
  domain: string;
  graphMode: 'off' | 'explain_only' | 'expand_candidates' | 'rank_and_explain';
  selectedEvidence: Cp23EvidenceRouteItem[];
  rejectedEvidence: Cp23EvidenceRouteItem[];
  escalationEvidence: Cp23EvidenceRouteItem[];
  validationGateResults: Cp23ValidationGateResult[];
  answerDraftId?: string;
  guidedAnswerId?: string;
  modelAdapterRunId?: string;
  answerValidationRunId?: string;
  reviewQueueItemIds: string[];
  createdAt: string;
};
```

## 3. Evidence Route Item

```ts
type Cp23EvidenceRouteItem = {
  routeItemId: string;
  role: 'quran_anchor' | 'translation_context' | 'tafsir_context' | 'hadith_support' | 'topic_context' | 'source_context' | 'quality_context' | 'release_context';
  canonicalRef: string;
  graphNodeIds: string[];
  graphEdgeIds: string[];
  sourceIds: string[];
  provenanceIds: string[];
  releaseStateIds: string[];
  vaultPackIds: string[];
  selectionState: 'selected' | 'rejected' | 'requires_review' | 'requires_escalation';
  selectionReason: string;
  validationImpact: 'supports' | 'blocks' | 'warns' | 'escalates' | 'informational';
};
```

Required rule:

```text
Every selected religious evidence item must resolve to canonical source data
and at least one source/provenance/release reference.
```

## 4. Validation Gate Linkage

CP23 must preserve the existing validation gates:

| Gate | Graph/vault linkage |
| --- | --- |
| Intent Gate | Stores intent and escalation category on evidence route. |
| Source Retrieval Gate | Requires selected evidence source refs. |
| Quran Reference Gate | Requires selected Quran refs to resolve to canonical ayah nodes. |
| Translation Gate | Requires translation edition/source refs. |
| Tafsir Gate | Requires tafsir passage/source refs. |
| Hadith Reference Gate | Requires collection/reference/text source refs. |
| Grade Gate | Requires grade assertion or verification context when hadith is used. |
| Fatwa Boundary Gate | Creates escalation evidence and reviewer queue item. |
| Medical/Legal/Crisis Gate | Blocks ordinary religious guidance route and creates safety escalation route. |
| Personalization Gate | Records whether personalization was ignored or used only for relevance. |
| Final Citation Gate | Requires cited source IDs to match selected evidence refs. |

## 5. Citation Coverage

Each answer validation run should be able to compare:

- citation IDs in the candidate answer,
- cited source IDs,
- selected evidence route item IDs,
- selected graph node IDs,
- selected canonical refs,
- missing citation IDs,
- uncited claim findings,
- escalation findings.

Validation must fail or require review when:

- a religious claim is uncited,
- a citation does not match selected evidence,
- a Quran reference is invalid,
- a translation is not source-backed,
- tafsir is inferred rather than sourced,
- hadith lacks collection/reference/grade or verification context,
- the answer uses rejected, withheld, or public-blocked evidence in a public context,
- the answer crosses scholar, medical, legal, crisis, or ruling boundaries.

## 6. Escalation Outcomes

Escalation outcomes must remain separate from ordinary pass/fail scoring.

| Outcome | Meaning | Required workflow |
| --- | --- | --- |
| `scholar_escalation` | Topic may require qualified religious judgment. | Create reviewer queue item with scholar review state. |
| `safety_escalation` | Topic includes crisis, medical, legal, abuse, or emergency risk. | Block ordinary guidance and show safety path. |
| `source_unavailable` | No suitable evidence found. | Do not generate Islamic claims. |
| `blocked` | Validation failed after retry or hard gate. | Queue remediation or reject route. |
| `approved_with_disclaimer` | Evidence is valid but sensitivity or confidence requires warning. | Allow private testing with review visibility. |
| `approved` | Gates pass for private internal use. | Still not public release approval. |

## 7. Remediation Rules

Validation failures should generate remediation items instead of silent retries when:

- selected evidence lacks source refs,
- selected evidence lacks provenance refs,
- selected evidence lacks release refs,
- hadith support lacks grade/verification context,
- tafsir support lacks source passage refs,
- quality state is `withheld`,
- review state is `rejected`,
- citation coverage is incomplete,
- escalation path is missing.

Recommended remediation fields:

```ts
type Cp23ValidationRemediation = {
  remediationId: string;
  evidenceRouteId: string;
  answerValidationRunId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  issueType: 'missing_source' | 'missing_provenance' | 'missing_release_state' | 'missing_citation' | 'uncited_claim' | 'invalid_reference' | 'withheld_content' | 'rejected_content' | 'escalation_required';
  targetGraphNodeIds: string[];
  targetCanonicalRefs: string[];
  recommendedOwner: 'technical_reviewer' | 'knowledge_editor' | 'scholar_reviewer' | 'product_owner' | 'admin';
  recommendedAction: string;
};
```

## 8. Public Boundary

Evidence routes are private artifacts by default.

Required invariant:

```text
An evidence route can support private review and validation, but it cannot
make any node, edge, vault pack, answer, or citation public-safe.
```

## 9. Verifier Requirements

The future CP23 verifier must fail when:

- selected route items lack source/provenance/release refs,
- selected graph IDs do not resolve in CP22 indexes,
- selected vault pack IDs do not resolve in the vault manifest,
- validation gates are missing for guided answer routes,
- escalation outcomes are merged into ordinary average scores,
- remediation items lack owner/action fields,
- public-safe metadata is set without public-release approval.

## 10. Acceptance

CP23-A03 is complete when the evidence route schema, validation linkage, citation coverage rules, escalation outcome mapping, remediation rules, public boundary, and verifier requirements are documented.

Status: complete.

