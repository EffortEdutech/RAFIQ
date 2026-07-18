# CP24 - Graph-Aware Retrieval Prototype Acceptance Checklist

Date: 2026-07-13

Status: CP24 complete; recommended next scope CP25

Scope: Private graph-aware retrieval prototype after CP23 close-out.

## Status Legend

- Pass: implemented or documented and verified for the checkpoint.
- Fail: implemented or documented but verification failed.
- Not Started: planned but not yet implemented.
- Blocked: cannot proceed without missing input, data, or decision.
- Deferred: intentionally moved outside CP24.

## 1. Program Readiness

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP24-R01 | CP24 is documented as the post-CP23 graph-aware retrieval prototype. | Pass | `CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_SPRINT_PLAN.md`. |
| CP24-R02 | CP23 close-out is the controlling baseline. | Pass | `CP23_A10_CLOSE_OUT_AND_NEXT_SCOPE_DECISION_REPORT.md`. |
| CP24-R03 | CP24 remains private-only. | Pass | CP24 sprint plan product boundaries. |
| CP24-R04 | CP22 graph/vault counts and public-safe zero state are acknowledged. | Pass | CP24 sprint plan baseline section. |
| CP24-R05 | CP23 retrieval, evidence route, reviewer, and UI contracts are controlling inputs. | Pass | CP24 sprint plan controlling documents. |

## 2. CP24-G01 Retrieval Prototype Architecture And Fixture Plan

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP24-G01-01 | CP24 architecture note is complete. | Pass | `CP24_G01_RETRIEVAL_PROTOTYPE_ARCHITECTURE_AND_FIXTURE_PLAN.md`. |
| CP24-G01-02 | Fixture/query matrix is complete. | Pass | `CP24_G01_RETRIEVAL_PROTOTYPE_ARCHITECTURE_AND_FIXTURE_PLAN.md`. |
| CP24-G01-03 | Source graph/vault artifact map is complete. | Pass | `CP24_G01_RETRIEVAL_PROTOTYPE_ARCHITECTURE_AND_FIXTURE_PLAN.md`. |
| CP24-G01-04 | Private route naming and payload boundary are defined. | Pass | `CP24_G01_RETRIEVAL_PROTOTYPE_ARCHITECTURE_AND_FIXTURE_PLAN.md`. |
| CP24-G01-05 | Rollback and verifier plan is defined. | Pass | `CP24_G01_RETRIEVAL_PROTOTYPE_ARCHITECTURE_AND_FIXTURE_PLAN.md`; `scripts/check_cp24_g01_retrieval_prototype_plan.mjs`. |

## 3. CP24-G02 Request And Response Contracts

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP24-G02-01 | Shared request contract is implemented. | Pass | `packages/shared/src/private-content.ts`; `CP24_G02_REQUEST_AND_RESPONSE_CONTRACTS.md`. |
| CP24-G02-02 | Candidate/scoring/explanation contracts are implemented. | Pass | `packages/shared/src/private-content.ts`; `CP24_G02_REQUEST_AND_RESPONSE_CONTRACTS.md`. |
| CP24-G02-03 | Evidence route and validation handoff contracts are implemented. | Pass | `packages/shared/src/private-content.ts`; `CP24_G02_REQUEST_AND_RESPONSE_CONTRACTS.md`. |
| CP24-G02-04 | Reviewer handoff contract is implemented. | Pass | `packages/shared/src/private-content.ts`; `CP24_G02_REQUEST_AND_RESPONSE_CONTRACTS.md`. |
| CP24-G02-05 | Public-boundary contract is implemented. | Pass | `packages/shared/src/private-content.ts`; `CP24_G02_REQUEST_AND_RESPONSE_CONTRACTS.md`; `scripts/check_cp24_g02_request_response_contracts.mjs`. |

## 4. CP24-G03 Candidate Retrieval And Graph Expansion

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP24-G03-01 | Candidate collector is implemented against bounded fixtures. | Pass | `scripts/generate_cp24_candidate_graph_expansion.mjs`; `data/retrieval/cp24/candidate-expansion.json`. |
| CP24-G03-02 | Graph node/edge resolver is implemented. | Pass | `scripts/generate_cp24_candidate_graph_expansion.mjs`; `scripts/check_cp24_g03_candidate_graph_expansion.mjs`. |
| CP24-G03-03 | Max-depth expansion is enforced. | Pass | `data/retrieval/cp24/candidate-expansion.json`; `scripts/check_cp24_g03_candidate_graph_expansion.mjs`. |
| CP24-G03-04 | Vault pack resolver is implemented. | Pass | `data/retrieval/cp24/candidate-expansion.json`; `data/retrieval/cp24/manifest.json`. |
| CP24-G03-05 | Rejected/withheld/missing-ref candidates are blocked from selected evidence. | Pass | `scripts/check_cp24_g03_candidate_graph_expansion.mjs`; `CP24_G03_CANDIDATE_RETRIEVAL_AND_GRAPH_EXPANSION.md`. |

## 5. CP24-G04 Ranking, Explanation, And Selection

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP24-G04-01 | Ranking model uses allowed operational signals. | Pass | `scripts/generate_cp24_ranking_selection.mjs`; `data/retrieval/cp24/ranking-selection.json`. |
| CP24-G04-02 | Selection reasons are operational and non-authoritative. | Pass | `data/retrieval/cp24/ranking-selection.json`; `scripts/check_cp24_g04_ranking_selection.mjs`. |
| CP24-G04-03 | Candidate split includes selected, held, rejected, and escalated groups. | Pass | `data/retrieval/cp24/ranking-selection.json`; `CP24_G04_RANKING_EXPLANATION_AND_SELECTION.md`. |
| CP24-G04-04 | Escalation outcomes stay outside ordinary score averages. | Pass | `scripts/check_cp24_g04_ranking_selection.mjs`; `data/retrieval/cp24/ranking-selection.json`. |
| CP24-G04-05 | Prohibited inference verifier is implemented. | Pass | `scripts/check_cp24_g04_ranking_selection.mjs`. |

## 6. CP24-G05 Evidence Route And Validation Handoff

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP24-G05-01 | Evidence route output is implemented. | Pass | `scripts/generate_cp24_validation_handoff.mjs`; `data/retrieval/cp24/validation-handoff.json`. |
| CP24-G05-02 | Selected evidence has source/provenance/release refs. | Pass | `scripts/check_cp24_g05_validation_handoff.mjs`; `data/retrieval/cp24/validation-handoff.json`. |
| CP24-G05-03 | Validation gate linkage is implemented. | Pass | `data/retrieval/cp24/validation-handoff.json`; `CP24_G05_EVIDENCE_ROUTE_AND_VALIDATION_HANDOFF.md`. |
| CP24-G05-04 | Remediation trigger mapping is implemented. | Pass | `data/retrieval/cp24/validation-handoff.json`; `scripts/check_cp24_g05_validation_handoff.mjs`. |
| CP24-G05-05 | Public boundary remains false. | Pass | `scripts/check_cp24_g05_validation_handoff.mjs`; `CP24_G05_EVIDENCE_ROUTE_AND_VALIDATION_HANDOFF.md`. |

## 7. CP24-G06 Private API Prototype

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP24-G06-01 | Private CP24 API route is implemented. | Pass | `apps/api/src/modules/private-content/private-content.controller.ts`; `scripts/check_cp24_g06_private_api_prototype.mjs`. |
| CP24-G06-02 | Service method returns bounded response. | Pass | `apps/api/src/modules/private-content/private-content.service.ts`; `corepack pnpm build:api`. |
| CP24-G06-03 | OpenAPI private DTOs are documented. | Pass | `apps/api/src/modules/private-content/private-content.openapi.ts`. |
| CP24-G06-04 | Invalid requests fail safely. | Pass | `PrivateCp24GraphAwareRetrievalRequestDto`; service `BadRequestException` checks. |
| CP24-G06-05 | No public CP24 route is introduced. | Pass | `scripts/check_cp24_g06_private_api_prototype.mjs`. |

## 8. CP24-G07 Internal UI Prototype

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP24-G07-01 | Internal CP24 UI panel or route loads. | Pass | `apps/mobile/app/graph-aware-retrieval.tsx`; `corepack pnpm build:mobile:web`. |
| CP24-G07-02 | Query fixture selector is visible. | Pass | `apps/mobile/app/graph-aware-retrieval.tsx`; `scripts/check_cp24_g07_internal_ui_prototype.mjs`. |
| CP24-G07-03 | Candidate ranking and explanation view is visible. | Pass | `apps/mobile/app/graph-aware-retrieval.tsx`. |
| CP24-G07-04 | Evidence route and validation handoff view is visible. | Pass | `apps/mobile/app/graph-aware-retrieval.tsx`. |
| CP24-G07-05 | Mobile/desktop layout proof is recorded if UI changes. | Pass | `corepack pnpm build:mobile:web`; `CP24_G07_INTERNAL_UI_PROTOTYPE.md`. |

## 9. CP24-G08 Combined Verification

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP24-G08-01 | Combined verifier exists. | Pass | `scripts/check_cp24_combined_verification.mjs`. |
| CP24-G08-02 | CP23 close-out verifier is inherited. | Pass | `scripts/check_cp24_combined_verification.mjs`; `scripts/check_cp23_close_out.mjs`. |
| CP24-G08-03 | Graph/vault reference checks pass. | Pass | `scripts/check_cp24_combined_verification.mjs`; CP22 combined verifier. |
| CP24-G08-04 | Public boundary checks pass. | Pass | `scripts/check_cp24_combined_verification.mjs`. |
| CP24-G08-05 | Generated CP24 artifact checks pass if artifacts exist. | Pass | `data/retrieval/cp24/manifest.json`; `scripts/check_cp24_combined_verification.mjs`. |

## 10. CP24-G09 Close-Out And Next Scope Decision

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP24-G09-01 | CP24 close-out report is complete. | Pass | `CP24_G09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`. |
| CP24-G09-02 | Final checklist is complete. | Pass | This checklist; `scripts/check_cp24_close_out.mjs`. |
| CP24-G09-03 | Known limitations are documented. | Pass | `CP24_G09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`. |
| CP24-G09-04 | Next scope decision is recorded. | Pass | Recommended next scope: CP25 - Reviewer Workbench Action Workflow. |
| CP24-G09-05 | Public release remains blocked unless separately approved. | Pass | CP24 close-out governance status and public-boundary verifier. |

## 11. Overall Readiness

Current status: CP24 is complete. Recommended next scope is CP25 - Reviewer Workbench Action Workflow.

Recommended next action:

1. Run `node scripts\check_cp24_close_out.mjs`.
2. Start `CP25 - Reviewer Workbench Action Workflow`.

Inherited gate for implementation work:

```powershell
node scripts\check_cp24_close_out.mjs
node scripts\check_cp23_close_out.mjs
```
