# CP28 - Retrieval Engine Integration From Refreshed Graph Sprint Plan

Date: 2026-07-17

Status: CP28 complete; recommended next scope CP29

Owner: RAFIQ private retrieval, refreshed graph/vault, validation, reviewer, and product intelligence workstream

## 1. Objective

CP28 integrates graph-aware retrieval with the refreshed CP27 graph and vault outputs.

The purpose is to move the CP24 graph-aware retrieval prototype away from static CP24 fixture artifacts and toward snapshot-backed, refresh-aware graph/vault inputs. CP28 must preserve CP24's request/response, validation, reviewer handoff, and public-boundary discipline while changing the source graph/vault layer from CP22 static outputs to CP27 refreshed outputs.

CP28 does not approve public release. Public release remains blocked.

## 2. Baseline

CP28 starts after CP27 close-out.

| Baseline | Status | Evidence |
| --- | --- | --- |
| CP24 graph-aware retrieval prototype | Complete | `CP24_G09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`; `data/retrieval/cp24/manifest.json` |
| CP27 refresh-backed graph/vault rebuild | Complete | `CP27_G07_COMBINED_VERIFICATION_AND_CLOSE_OUT.md`; `data/graphify/cp27-refresh/latest-verification.json` |
| CP23 retrieval/reviewer contracts | Complete | `CP23_A02_GRAPH_AWARE_RETRIEVAL_CONTRACT.md`; `CP23_A03_EVIDENCE_ROUTE_AND_VALIDATION_CONTRACT.md`; `CP23_A04_REVIEWER_WORKFLOW_CONTRACT.md` |

Inherited CP24 prototype facts:

- fixtures: 10;
- candidates: 87;
- selected candidates: 15;
- evidence routes: 10;
- remediation items: 72;
- high/critical remediation items: 18;
- public-safe candidates: 0;
- public-safe route items: 0.

Inherited CP27 refreshed graph/vault facts:

- graph nodes: 147;
- graph edges: 125;
- graph partitions: 10;
- graph indexes: 12;
- vault artifacts: 26;
- vault categories: 4;
- graph nodes referenced by vault: 147;
- unresolved references: 77;
- high/critical blockers: 30;
- public-safe graph nodes: 0;
- public-safe graph edges: 0;
- public-safe vault artifacts: 0.

## 3. Product Boundaries

CP28 must preserve these boundaries:

1. Canonical Quran, tafsir, translation, hadith, grade, verification, guidance, provenance, release-state, and review data remain authoritative.
2. CP27 refreshed graph and vault artifacts are derived private metadata.
3. CP24 fixtures remain a regression baseline, not the future source of truth.
4. Retrieval may use refreshed graph/vault metadata to collect, expand, rank, explain, validate, and route evidence candidates.
5. Retrieval must not invent evidence, generate source text, upgrade authenticity, infer religious authority, or bypass validation gates.
6. Escalation-sensitive outcomes remain separate from ordinary ranking and averages.
7. Reviewer/remediation blockers remain visible.
8. Public-safe graph nodes, graph edges, vault artifacts, retrieval candidates, route items, and snapshot rows remain zero.
9. No public route can expose CP28 private retrieval, graph, vault, evidence route, validation, reviewer, remediation, or audit artifacts.
10. CP28 must not read or print `.env` values, secrets, service-role keys, private tokens, or credentials.

## 4. Implementation Surface

| Surface | Expected role |
| --- | --- |
| `docs/09_sprints/resource_audit_import_prototype/` | CP28 architecture, contracts, generated retrieval artifacts, verification, and close-out docs. |
| `scripts/` | CP28 fixture mapping, candidate collection, ranking, validation handoff, API/UI verifier, and combined verifier scripts. |
| `data/graphify/cp27-refresh/` | Refreshed graph pointer, manifest, summary, partitions, indexes, diff, and verification inputs. |
| `data/vault/cp27-refresh/` | Refreshed vault pointer, manifest, summary, packs, and checksum inputs. |
| `data/retrieval/cp24/` | CP24 fixture regression baseline and prototype comparison input only. |
| `data/retrieval/cp28/` | Planned CP28 refreshed retrieval outputs. |
| `packages/shared/src/private-content.ts` | Later CP28 request/response extensions if CP28-R02/R05 require versioned contracts. |
| `apps/api/src/modules/private-content/` | Later private CP28 route/service if CP28-R05 selects API proof. |
| `apps/mobile/app/graph-aware-retrieval.tsx` | Later internal UI update to inspect refreshed retrieval outputs. |

## 5. Checkpoints

### CP28-R01 - Retrieval Architecture From Refreshed Graph/Vault

Purpose: define the CP28 integration architecture and fixture migration plan before implementation.

Status: Complete. See `CP28_R01_RETRIEVAL_ARCHITECTURE_FROM_REFRESHED_GRAPH_VAULT.md`.

Deliverables:

- CP28 architecture report;
- CP24-to-CP28 migration map;
- CP27 graph/vault artifact map;
- refreshed retrieval fixture matrix;
- output folder and manifest policy;
- public-boundary and verifier plan.

Acceptance:

- CP27 close-out is the controlling baseline;
- CP24 fixture outputs are preserved as regression baseline only;
- CP28 private route and artifact naming are planned;
- public release remains blocked;
- no implementation claims are made before CP28-R02.

### CP28-R02 - Candidate Collection From Snapshot-Backed Graph Indexes

Purpose: map CP24 candidate collection to CP27 refreshed graph indexes and generated retrieval artifacts.

Status: Complete. See `CP28_R02_CANDIDATE_COLLECTION_FROM_SNAPSHOT_BACKED_GRAPH_INDEXES.md`.

Deliverables:

- `scripts/generate_cp28_r02_candidate_collection.mjs`;
- `scripts/check_cp28_r02_candidate_collection.mjs`;
- `data/retrieval/cp28/candidate-collection.json`;
- `data/retrieval/cp28/manifest.json`;
- `data/retrieval/cp28/latest-retrieval.json`;
- CP28-R02 report.

Acceptance:

- CP27 refreshed graph indexes are used for candidate source metadata;
- CP24 fixture IDs are preserved as regression labels;
- CP27 unresolved refs and high/critical blockers remain visible;
- candidates remain private operational metadata only;
- raw Quran, translation, tafsir, and hadith text bodies are not exported;
- public-safe candidate count remains zero.

### CP28-R03 - Ranking And Explanation Using Allowed Operational Signals

Purpose: rerun ranking and explanations against CP27 refreshed graph/vault evidence while preserving prohibited-inference gates.

Status: Complete. See `CP28_R03_RANKING_AND_EXPLANATION_USING_ALLOWED_OPERATIONAL_SIGNALS.md`.

Deliverables:

- `scripts/generate_cp28_r03_ranking_explanation.mjs`;
- `scripts/check_cp28_r03_ranking_explanation.mjs`;
- `data/retrieval/cp28/ranking-selection.json`;
- updated `data/retrieval/cp28/manifest.json`;
- updated `data/retrieval/cp28/latest-retrieval.json`;
- CP28-R03 report.

Acceptance:

- ranking uses allowed operational metadata signals only;
- prohibited-inference scan passes;
- escalation candidates are excluded from ordinary averages;
- CP27 unresolved references and high/critical blockers keep candidates held;
- public-safe candidate count remains zero.

### CP28-R04 - Evidence Route Rebuild And Validation Handoff

Purpose: rebuild evidence routes and validation handoff from CP28 refreshed candidates.

Status: Complete. See `CP28_R04_EVIDENCE_ROUTE_REBUILD_AND_VALIDATION_HANDOFF.md`.

Deliverables:

- `scripts/generate_cp28_r04_validation_handoff.mjs`;
- `scripts/check_cp28_r04_validation_handoff.mjs`;
- `data/retrieval/cp28/validation-handoff.json`;
- updated `data/retrieval/cp28/manifest.json`;
- updated `data/retrieval/cp28/latest-retrieval.json`;
- CP28-R04 report.

Acceptance:

- evidence routes are rebuilt from CP28-R03 ranking output;
- validation handoff keeps all gates explicit;
- remediation records are generated for held/escalation candidates;
- selected route item count remains zero while CP27 blockers remain;
- public-safe route item count remains zero.

### CP28-R05 - Retrieval API And Private UI Integration

Purpose: expose CP28 refreshed retrieval through bounded private API/UI proof.

Status: Complete. See `CP28_R05_RETRIEVAL_API_AND_PRIVATE_UI_INTEGRATION.md`.

Deliverables:

- `scripts/generate_cp28_r05_private_api_ui_proof.mjs`;
- `scripts/check_cp28_r05_private_api_ui_proof.mjs`;
- `data/retrieval/cp28/private-api-ui-proof.json`;
- updated `data/retrieval/cp28/manifest.json`;
- updated `data/retrieval/cp28/latest-retrieval.json`;
- CP28-R05 report.

Acceptance:

- bounded private API/UI payload shape is proven;
- source CP28 route is explicitly deferred while selected route item count is zero;
- full graph/vault dumps are not exposed;
- raw source text bodies are not exported;
- public route exposure remains false.

### CP28-R06 - Retrieval Regression Suite And Public-Boundary Verifier

Purpose: provide one verifier for CP24 regression, CP27 refreshed inputs, CP28 artifacts, API/UI boundaries, and public-safe metadata.

Status: Complete. See `CP28_R06_RETRIEVAL_REGRESSION_SUITE_AND_PUBLIC_BOUNDARY_VERIFIER.md`.

Deliverables:

- `scripts/generate_cp28_r06_combined_verification.mjs`;
- `scripts/check_cp28_combined_verification.mjs`;
- `data/retrieval/cp28/combined-verification.json`;
- updated `data/retrieval/cp28/manifest.json`;
- updated `data/retrieval/cp28/latest-retrieval.json`;
- CP28-R06 report.

Acceptance:

- CP24 regression baseline checks pass;
- CP27 refreshed graph/vault checks pass;
- CP28 artifacts are verified end to end;
- source route deferral remains explicit;
- public-boundary checks pass.

### CP28-R07 - Close-Out

Purpose: close CP28 and select the next private scope.

Status: Complete. See `CP28_R07_CLOSE_OUT.md`.

Deliverables:

- `scripts/check_cp28_close_out.mjs`;
- CP28-R07 close-out report;
- final CP28 sprint plan status;
- final CP28 acceptance checklist status;
- next scope decision.

Acceptance:

- CP28-R06 combined verification passes;
- known limitations are documented;
- final artifact counts are recorded;
- next private scope is selected;
- public release remains blocked.

## 6. Acceptance Gates

CP28 cannot close unless:

- CP27-G07 close-out verification passes;
- CP24 close-out remains usable as a regression baseline;
- refreshed graph and vault pointers are used for CP28 retrieval artifacts;
- CP28 retrieval artifacts have manifests and checksums;
- candidate, evidence-route, validation, reviewer, and remediation boundaries remain visible;
- graph and vault IDs remain derived private metadata;
- canonical refs remain separate from graph/vault IDs;
- public-safe graph/vault/snapshot/retrieval/route counts remain zero;
- no public route exposes private retrieval or graph/vault data;
- no `.env` values, secrets, service-role keys, private tokens, or credentials are read or printed.

## 7. Recommended Next Action

Proceed next with:

```text
CP29 - Retrieval Remediation And Selected-Candidate Unlock
```

Reason: CP28 closes with selected candidate and selected route item counts at zero because CP27 unresolved references and high/critical blockers remain visible. CP29 should remediate those blocker families and rerun CP27/CP28 until selected candidates can be unlocked without bypassing validation gates.
