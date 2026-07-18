# CP28 - Retrieval Engine Integration From Refreshed Graph Acceptance Checklist

Date: 2026-07-17

Status: CP28 complete; recommended next scope CP29

Scope: Integrate graph-aware retrieval with CP27 refreshed graph/vault outputs.

## Status Legend

- Pass: implemented or documented and verified for the checkpoint.
- Fail: implemented or documented but verification failed.
- Not Started: planned but not yet implemented.
- Blocked: cannot proceed without missing input, data, or decision.
- Deferred: intentionally moved outside CP28.

## 1. Program Readiness

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP28-R00-01 | CP28 is documented as the post-CP27 refreshed retrieval integration sprint. | Pass | `CP28_RETRIEVAL_ENGINE_INTEGRATION_FROM_REFRESHED_GRAPH_SPRINT_PLAN.md`. |
| CP28-R00-02 | CP27 close-out is the controlling baseline. | Pass | `CP27_G07_COMBINED_VERIFICATION_AND_CLOSE_OUT.md`; `data/graphify/cp27-refresh/latest-verification.json`. |
| CP28-R00-03 | CP24 retrieval prototype is preserved as regression baseline. | Pass | `CP24_G09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`; `data/retrieval/cp24/manifest.json`. |
| CP28-R00-04 | CP28 remains private-only and does not approve public release. | Pass | CP28 sprint plan product boundaries. |
| CP28-R00-05 | CP28 public-safe counts are required to remain zero. | Pass | CP28 sprint plan acceptance gates. |

## 2. CP28-R01 Retrieval Architecture From Refreshed Graph/Vault

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP28-R01-01 | Architecture report is complete. | Pass | `CP28_R01_RETRIEVAL_ARCHITECTURE_FROM_REFRESHED_GRAPH_VAULT.md`; `scripts/check_cp28_r01_retrieval_architecture.mjs`. |
| CP28-R01-02 | CP24-to-CP28 migration map is documented. | Pass | `CP28_R01_RETRIEVAL_ARCHITECTURE_FROM_REFRESHED_GRAPH_VAULT.md`; migration map section. |
| CP28-R01-03 | CP27 graph/vault artifact map is documented. | Pass | `CP28_R01_RETRIEVAL_ARCHITECTURE_FROM_REFRESHED_GRAPH_VAULT.md`; artifact map section. |
| CP28-R01-04 | Refreshed retrieval fixture matrix is documented. | Pass | `CP28_R01_RETRIEVAL_ARCHITECTURE_FROM_REFRESHED_GRAPH_VAULT.md`; fixture matrix section. |
| CP28-R01-05 | Public-boundary and verifier plan is documented. | Pass | `CP28_R01_RETRIEVAL_ARCHITECTURE_FROM_REFRESHED_GRAPH_VAULT.md`; verifier plan and public-boundary sections. |

## 3. CP28-R02 Candidate Collection From Snapshot-Backed Graph Indexes

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP28-R02-01 | CP28 candidate collection generator exists. | Pass | `scripts/generate_cp28_r02_candidate_collection.mjs`; `data/retrieval/cp28/candidate-collection.json`. |
| CP28-R02-02 | CP27 graph indexes are used as candidate source metadata. | Pass | `candidate-collection.json`; source indexes include `by-ayah-key`, `by-hadith-key`, `by-topic-key`, `by-source-id`, `by-quality-state`, and `public-boundary`. |
| CP28-R02-03 | CP24 fixtures are preserved as regression labels. | Pass | `candidate-collection.json`; each CP28 fixture includes `regressionFixtureId`. |
| CP28-R02-04 | Unresolved refs and blockers remain visible. | Pass | CP28-R02 summary carries CP27 unresolved refs `77` and high/critical blockers `30`. |
| CP28-R02-05 | Public-safe candidate count remains zero. | Pass | `scripts/check_cp28_r02_candidate_collection.mjs`; public-safe candidate count `0`. |

## 4. CP28-R03 Ranking And Explanation Using Allowed Operational Signals

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP28-R03-01 | CP28 ranking artifact exists. | Pass | `data/retrieval/cp28/ranking-selection.json`; `scripts/generate_cp28_r03_ranking_explanation.mjs`. |
| CP28-R03-02 | Allowed operational signals are documented and enforced. | Pass | `CP28_R03_RANKING_AND_EXPLANATION_USING_ALLOWED_OPERATIONAL_SIGNALS.md`; `scripts/check_cp28_r03_ranking_explanation.mjs`. |
| CP28-R03-03 | Prohibited inference checks pass. | Pass | `ranking-selection.json`; prohibited inference finding count `0`. |
| CP28-R03-04 | Escalation outcomes stay separate from ordinary averages. | Pass | `ranking-selection.json`; 15 escalation candidates have `ordinaryScore: null`; ordinary scored count is 55. |
| CP28-R03-05 | Public-safe candidate count remains zero. | Pass | `ranking-selection.json`; public-safe candidate count `0`. |

## 5. CP28-R04 Evidence Route Rebuild And Validation Handoff

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP28-R04-01 | CP28 evidence route artifact exists. | Pass | `data/retrieval/cp28/validation-handoff.json`; `scripts/generate_cp28_r04_validation_handoff.mjs`. |
| CP28-R04-02 | Validation handoff links refreshed candidates to validation gates. | Pass | `validation-handoff.json`; 10 routes and 110 validation gate results. |
| CP28-R04-03 | Remediation triggers are generated for missing refs and blockers. | Pass | `validation-handoff.json`; 70 remediation items and 38 high/critical items. |
| CP28-R04-04 | Reviewer handoff remains visible. | Pass | `validation-handoff.json`; review route items `55`, escalation route items `15`. |
| CP28-R04-05 | Public-safe route item count remains zero. | Pass | `scripts/check_cp28_r04_validation_handoff.mjs`; public-safe route items `0`. |

## 6. CP28-R05 Retrieval API And Private UI Integration

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP28-R05-01 | Private CP28 API route exists if selected. | Pass | R05 selected contract payload proof and deferred source route because selected route items are `0`. |
| CP28-R05-02 | Private UI inspection surface exists if selected. | Pass | `data/retrieval/cp28/private-api-ui-proof.json`; bounded private UI payload shape is generated. |
| CP28-R05-03 | Response payload is bounded. | Pass | `private-api-ui-proof.json`; fixture payload caps limit candidate, route, and remediation summaries. |
| CP28-R05-04 | Full graph/vault/retrieval dumps are not sent to client. | Pass | `scripts/check_cp28_r05_private_api_ui_proof.mjs`; full graph/vault dumps are false. |
| CP28-R05-05 | No public CP28 retrieval route exists. | Pass | Verifier scans private API/mobile surfaces; public route exposed is false. |

## 7. CP28-R06 Retrieval Regression Suite And Public-Boundary Verifier

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP28-R06-01 | Combined CP28 verifier exists. | Pass | `scripts/check_cp28_combined_verification.mjs`; `data/retrieval/cp28/combined-verification.json`. |
| CP28-R06-02 | CP24 regression baseline checks pass. | Pass | Combined verification records CP24 candidates `87`, selected `15`, public-safe `0`. |
| CP28-R06-03 | CP27 refreshed graph/vault checks pass. | Pass | Combined verification records CP27 graph nodes `147`, unresolved references `77`, high/critical blockers `30`. |
| CP28-R06-04 | CP28 retrieval artifact checks pass. | Pass | R02-R05 artifacts are verified through `scripts/check_cp28_combined_verification.mjs`. |
| CP28-R06-05 | Public-boundary checks pass. | Pass | Public-safe candidate and route item counts remain `0`; public route exposed is false. |

## 8. CP28-R07 Close-Out

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP28-R07-01 | Close-out report exists. | Pass | `CP28_R07_CLOSE_OUT.md`. |
| CP28-R07-02 | Known limitations are documented. | Pass | `CP28_R07_CLOSE_OUT.md`; known limitations section. |
| CP28-R07-03 | Final checklist is complete. | Pass | This checklist; all CP28 rows are pass. |
| CP28-R07-04 | Next scope decision is recorded. | Pass | Recommended next scope: CP29 - Retrieval Remediation And Selected-Candidate Unlock. |
| CP28-R07-05 | Public release remains blocked. | Pass | `CP28_R07_CLOSE_OUT.md`; public-safe candidate and route item counts remain `0`. |

## 9. Overall Readiness

Current status: CP28 is complete. CP29 should start next.

Recommended next action:

1. Run `node scripts\check_cp28_close_out.mjs`.
2. Start `CP29 - Retrieval Remediation And Selected-Candidate Unlock`.
