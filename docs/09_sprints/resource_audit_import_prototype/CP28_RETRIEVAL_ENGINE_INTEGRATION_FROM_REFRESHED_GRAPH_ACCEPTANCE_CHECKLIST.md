# CP28 - Retrieval Engine Integration From Refreshed Graph Acceptance Checklist

Date: 2026-07-17

Status: CP28-R02 complete; CP28-R03 next

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
| CP28-R03-01 | CP28 ranking artifact exists. | Not Started | Planned. |
| CP28-R03-02 | Allowed operational signals are documented and enforced. | Not Started | Planned. |
| CP28-R03-03 | Prohibited inference checks pass. | Not Started | Planned. |
| CP28-R03-04 | Escalation outcomes stay separate from ordinary averages. | Not Started | Planned. |
| CP28-R03-05 | Public-safe candidate count remains zero. | Not Started | Planned. |

## 5. CP28-R04 Evidence Route Rebuild And Validation Handoff

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP28-R04-01 | CP28 evidence route artifact exists. | Not Started | Planned. |
| CP28-R04-02 | Validation handoff links refreshed candidates to validation gates. | Not Started | Planned. |
| CP28-R04-03 | Remediation triggers are generated for missing refs and blockers. | Not Started | Planned. |
| CP28-R04-04 | Reviewer handoff remains visible. | Not Started | Planned. |
| CP28-R04-05 | Public-safe route item count remains zero. | Not Started | Planned. |

## 6. CP28-R05 Retrieval API And Private UI Integration

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP28-R05-01 | Private CP28 API route exists if selected. | Not Started | Planned. |
| CP28-R05-02 | Private UI inspection surface exists if selected. | Not Started | Planned. |
| CP28-R05-03 | Response payload is bounded. | Not Started | Planned. |
| CP28-R05-04 | Full graph/vault/retrieval dumps are not sent to client. | Not Started | Planned. |
| CP28-R05-05 | No public CP28 retrieval route exists. | Not Started | Planned. |

## 7. CP28-R06 Retrieval Regression Suite And Public-Boundary Verifier

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP28-R06-01 | Combined CP28 verifier exists. | Not Started | Planned. |
| CP28-R06-02 | CP24 regression baseline checks pass. | Not Started | Planned. |
| CP28-R06-03 | CP27 refreshed graph/vault checks pass. | Not Started | Planned. |
| CP28-R06-04 | CP28 retrieval artifact checks pass. | Not Started | Planned. |
| CP28-R06-05 | Public-boundary checks pass. | Not Started | Planned. |

## 8. CP28-R07 Close-Out

| ID | Acceptance item | Status | Evidence |
| --- | --- | --- | --- |
| CP28-R07-01 | Close-out report exists. | Not Started | Planned. |
| CP28-R07-02 | Known limitations are documented. | Not Started | Planned. |
| CP28-R07-03 | Final checklist is complete. | Not Started | Planned. |
| CP28-R07-04 | Next scope decision is recorded. | Not Started | Planned. |
| CP28-R07-05 | Public release remains blocked. | Not Started | Planned. |

## 9. Overall Readiness

Current status: CP28-R02 is complete. CP28-R03 should start next.

Recommended next action:

1. Run `node scripts\check_cp28_r02_candidate_collection.mjs`.
2. Start `CP28-R03 - Ranking And Explanation Using Allowed Operational Signals`.
