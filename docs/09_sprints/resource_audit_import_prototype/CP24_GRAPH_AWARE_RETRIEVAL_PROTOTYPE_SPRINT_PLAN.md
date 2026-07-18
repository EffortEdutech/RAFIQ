# CP24 - Graph-Aware Retrieval Prototype Sprint Plan

Date: 2026-07-13

Status: CP24 complete; recommended next scope CP25

Owner: RAFIQ retrieval, validation, review, and knowledge graph workstream

## 1. Objective

CP24 turns the completed CP23 retrieval/reviewer bridge into a private graph-aware retrieval prototype.

The prototype should execute bounded private retrieval requests, score and explain evidence candidates using CP22 graph/vault metadata, construct evidence routes, connect outputs to validation and reviewer handoff structures, and prove that no private graph evidence reaches public answer surfaces.

CP24 does not approve public release. CP24 does not make the graph canonical. CP24 does not generate religious evidence. It uses graph/vault metadata to improve private candidate selection, explanation, validation linkage, and reviewer routing.

## 2. Baseline

CP24 starts after:

| Baseline | Status | Evidence |
| --- | --- | --- |
| CP22 full private resource graph and vault | Complete | `CP22_G10_CLOSE_OUT_REPORT.md` |
| CP23 retrieval/reviewer contracts | Complete | `CP23_A02_GRAPH_AWARE_RETRIEVAL_CONTRACT.md`; `CP23_A03_EVIDENCE_ROUTE_AND_VALIDATION_CONTRACT.md`; `CP23_A04_REVIEWER_WORKFLOW_CONTRACT.md` |
| CP23 private reviewer prototype | Complete | `CP23_A06_PRIVATE_PROTOTYPE_IMPLEMENTATION_REPORT.md` |
| CP23 reviewer exports | Complete | `CP23_A07_REVIEWER_AUDIT_TRAIL_AND_REMEDIATION_EXPORT_REPORT.md` |
| CP23 combined verification and UX proof | Complete | `CP23_A08_COMBINED_VERIFICATION_REPORT.md`; `CP23_A09_INTERNAL_UX_PROOF_REPORT.md` |
| CP23 close-out decision | Complete | `CP23_A10_CLOSE_OUT_AND_NEXT_SCOPE_DECISION_REPORT.md` |

Inherited facts:

- CP22 graph nodes: 79,657.
- CP22 graph edges: 147,689.
- CP22 vault artifacts: 158.
- CP22 public-safe graph nodes: 0.
- CP22 public-safe graph edges: 0.
- CP22 public-safe vault artifacts: 0.
- CP23 reviewer exports have 8 open blocking remediation items.
- Public release remains blocked.

## 3. Product Boundaries

CP24 must preserve these boundaries:

1. Canonical Quran, tafsir, translation, hadith, grade, verification, and guidance content remains in canonical/source data layers, not graph/vault files.
2. CP22 graph and vault artifacts remain private derived metadata.
3. Retrieval ranking may explain operational relevance, not religious authority.
4. Graph expansion must stop at rejected, withheld, missing-source, missing-provenance, missing-release, or max-depth boundaries.
5. Evidence routes are private workflow artifacts and cannot make any node, edge, vault pack, answer, or citation public-safe.
6. Reviewer handoff remains required for warnings, unverified states, escalation cases, and public-release blockers.
7. Public answer surfaces must not use CP24 private graph evidence.
8. No `.env` files or secrets are required, read, printed, or embedded in artifacts.

## 4. Controlling Documents

CP24 is governed by:

- `docs/09_sprints/resource_audit_import_prototype/CP23_A10_CLOSE_OUT_AND_NEXT_SCOPE_DECISION_REPORT.md`
- `docs/09_sprints/resource_audit_import_prototype/CP23_A02_GRAPH_AWARE_RETRIEVAL_CONTRACT.md`
- `docs/09_sprints/resource_audit_import_prototype/CP23_A03_EVIDENCE_ROUTE_AND_VALIDATION_CONTRACT.md`
- `docs/09_sprints/resource_audit_import_prototype/CP23_A04_REVIEWER_WORKFLOW_CONTRACT.md`
- `docs/09_sprints/resource_audit_import_prototype/CP23_A05_INTERNAL_UI_WORKBENCH_PLAN.md`
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
| `packages/shared/src/private-content.ts` | Add CP24 request, response, scoring, explanation, evidence route, and validation handoff contracts. |
| `apps/api/src/modules/private-content/private-content.service.ts` | Implement bounded graph-aware retrieval prototype service logic. |
| `apps/api/src/modules/private-content/private-content.controller.ts` | Add private CP24 retrieval route only. |
| `apps/api/src/modules/private-content/private-content.openapi.ts` | Document private CP24 DTOs. |
| `apps/mobile/src/services/privateContentApi.ts` | Add private CP24 retrieval client call. |
| `apps/mobile/app/review-workbench.tsx` or a focused internal screen | Expose CP24 retrieval trace proof without public route exposure. |
| `scripts/` | Add generator/checker scripts for CP24 retrieval fixtures, evidence routes, validation handoff, and combined verification. |
| `data/review/cp24/` or `data/retrieval/cp24/` | Store bounded private prototype outputs and manifests if generated artifacts are needed. |

## 6. Checkpoints

### CP24-G01 - Retrieval Prototype Architecture And Fixture Plan

Purpose: define the exact private retrieval prototype shape before implementation.

Status: Complete. See `CP24_G01_RETRIEVAL_PROTOTYPE_ARCHITECTURE_AND_FIXTURE_PLAN.md`.

Deliverables:

- architecture note,
- fixture/query matrix,
- source graph/vault artifact map,
- private route naming,
- bounded output policy,
- rollback and verifier plan.

Acceptance:

- CP23 close-out is used as baseline;
- CP24 route is explicitly private;
- public surfaces are out of scope;
- fixture matrix covers Quran, tafsir, translation, hadith, topic, validation, and escalation-sensitive cases.

### CP24-G02 - Request And Response Contracts

Purpose: turn CP23-A02/A03 contracts into concrete shared TypeScript types for CP24.

Status: Complete. See `CP24_G02_REQUEST_AND_RESPONSE_CONTRACTS.md`.

Deliverables:

- request contract,
- candidate contract,
- scoring/explanation contract,
- evidence route contract,
- validation handoff contract,
- reviewer handoff contract,
- public-boundary contract.

Acceptance:

- canonical refs and graph IDs remain separate;
- source/provenance/release refs are required where applicable;
- public-safe candidate count remains zero;
- ranking explanations cannot imply religious approval.

### CP24-G03 - Candidate Retrieval And Graph Expansion

Purpose: implement bounded candidate collection from private canonical/search outputs plus CP22 graph indexes.

Status: Complete. See `CP24_G03_CANDIDATE_RETRIEVAL_AND_GRAPH_EXPANSION.md`.

Deliverables:

- fixture candidate collector,
- graph node/edge resolver,
- depth-limited expansion,
- vault pack resolver,
- stop-condition handling,
- unresolved reference report.

Acceptance:

- selected graph node IDs resolve through CP22 indexes;
- expansion max depth is enforced;
- rejected/withheld/missing-source candidates are not selected;
- the client does not load the full graph.

### CP24-G04 - Ranking, Explanation, And Selection

Purpose: score candidates using allowed operational signals.

Status: Complete. See `CP24_G04_RANKING_EXPLANATION_AND_SELECTION.md`.

Deliverables:

- scoring model,
- ranking signal list,
- selection reason generator,
- selected/held/rejected/escalated candidate split,
- prohibited inference verifier.

Acceptance:

- scoring uses provenance, release state, review state, quality state, graph neighborhood, validation history, and vault availability;
- graph centrality is not treated as authenticity;
- weak/unverified/escalation-sensitive evidence is held or escalated;
- selection reasons stay operational.

### CP24-G05 - Evidence Route And Validation Handoff

Purpose: build evidence routes that can feed validation and reviewer workflows.

Status: Complete. See `CP24_G05_EVIDENCE_ROUTE_AND_VALIDATION_HANDOFF.md`.

Deliverables:

- evidence route artifact or response section,
- selected/rejected/escalation route items,
- validation gate linkage,
- citation coverage expectations,
- remediation trigger mapping.

Acceptance:

- selected religious evidence has source/provenance/release refs;
- escalation outcomes remain separate from ordinary scoring;
- missing citation/source/provenance/release cases generate remediation handoff;
- public boundary remains false.

### CP24-G06 - Private API Prototype

Purpose: expose the CP24 prototype behind private API only.

Status: Complete. See `CP24_G06_PRIVATE_API_PROTOTYPE.md`.

Deliverables:

- private API route,
- service method,
- OpenAPI private DTOs,
- bounded response,
- error states,
- verifier.

Acceptance:

- route lives under private content namespace;
- no public route is introduced;
- payload is bounded and does not dump the graph;
- invalid requests fail safely.

### CP24-G07 - Internal UI Prototype

Purpose: make CP24 retrieval outputs inspectable in RAFIQ internal UI.

Status: Complete. See `CP24_G07_INTERNAL_UI_PROTOTYPE.md`.

Deliverables:

- internal route/panel,
- query fixture selector,
- candidate ranking view,
- evidence route view,
- validation handoff view,
- reviewer handoff/remediation summary,
- mobile/desktop layout proof if UI changes.

Acceptance:

- private mode ribbon remains visible;
- candidate status and selection reasons are visible;
- graph/vault IDs are visible but bounded;
- public-release blocked state is visible;
- no public route exposes CP24 data.

### CP24-G08 - Combined Verification

Purpose: provide one command that verifies CP22, CP23, and CP24 prototype boundaries.

Status: Complete. See `CP24_G08_COMBINED_VERIFICATION.md`.

Deliverables:

- `scripts/check_cp24_combined_verification.mjs`,
- inherited CP23 close-out verifier,
- CP24 contracts/artifact checks,
- public boundary checks,
- generated output checks.

Acceptance:

- CP23 close-out still passes;
- CP24 candidates resolve graph/vault references;
- selected evidence has required refs;
- public-safe counts remain zero;
- no secrets or `.env` values are printed.

### CP24-G09 - Close-Out And Next Scope Decision

Purpose: close CP24 and decide whether to proceed to CP25 reviewer workbench implementation, CP26 live snapshot export, or CP27 public release gate simulation.

Status: Complete. See `CP24_G09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`.

Deliverables:

- close-out report,
- final checklist,
- known limitations,
- next scope recommendation.

Acceptance:

- CP24 verifier passes;
- implementation limits are documented;
- public release remains blocked unless a separate public-release track explicitly approves otherwise;
- next scope is selected with rationale.

## 7. Acceptance Gates

CP24 cannot close unless:

- `node scripts\check_cp23_close_out.mjs` remains passing;
- `node scripts\check_cp24_close_out.mjs` passes after G09;
- CP24 combined verifier exists and passes;
- graph IDs resolve through CP22 indexes;
- selected religious evidence has source/provenance/release refs;
- vault pack IDs resolve through the vault manifest;
- scoring explanations use only allowed operational signals;
- escalation outcomes are not averaged into ordinary scores;
- open reviewer/remediation blockers remain visible;
- no public route exposes CP24 private retrieval data;
- public-safe counts remain zero;
- docs and verifier commands are updated.

## 8. Risks

| Risk | Mitigation |
| --- | --- |
| Graph ranking appears like religious authority | Use operational selection reasons and explicit non-authority language. |
| Full graph payload reaches client | Use bounded fixtures, selected node/edge slices, and verifier caps. |
| Public routes accidentally expose private candidates | Add explicit public route negative checks. |
| Escalation-sensitive cases get ordinary scores | Keep escalation as separate outcome and verifier failure condition. |
| Missing refs are hidden by ranking | Fail verifier when selected candidates lack source/provenance/release refs. |
| CP24 drifts from CP23 contracts | Use CP23 close-out verifier as inherited gate. |

## 9. Recommended First Action

Proceed next with:

```text
CP25 - Reviewer Workbench Action Workflow
```

Reason: CP24 is closed and has produced private graph-aware retrieval outputs, validation handoffs, and remediation items. CP25 should now turn those outputs into reviewer actions, audit events, remediation state changes, and private-only workflow controls while preserving the public-release block.
