# CP26 - Live Snapshot Export And Refresh Sprint Plan

Date: 2026-07-15

Status: CP26 complete; recommended next scope CP27

Owner: RAFIQ private resource graph, reviewer workflow, validation, and operations workstream

## 1. Objective

CP26 moves RAFIQ from checked-in generated prototype artifacts toward repeatable private live snapshot export and refresh.

The sprint should define and prototype safe snapshot inputs for source content, provenance, release state, graph state, vault state, retrieval state, reviewer queue state, remediation state, audit state, and blocker state. It should then prove that CP22, CP24, and CP25 style private outputs can be refreshed from those snapshot inputs with manifest, checksum, rollback, and public-boundary verification.

CP26 does not approve public release. CP26 does not expose live private source rows to public routes. CP26 does not replace canonical Quran, tafsir, translation, hadith, grade, verification, or guidance tables with graph/vault files. CP26 only creates a safer repeatable export and refresh layer for private internal development and review.

## 2. Baseline

CP26 starts after:

| Baseline | Status | Evidence |
| --- | --- | --- |
| CP22 full private resource graph and vault | Complete | `CP22_G10_CLOSE_OUT_REPORT.md`; `scripts/check_cp22_combined_verification.mjs` |
| CP23 retrieval integration and reviewer workflow architecture | Complete | `CP23_A10_CLOSE_OUT_AND_NEXT_SCOPE_DECISION_REPORT.md`; `scripts/check_cp23_close_out.mjs` |
| CP24 graph-aware retrieval prototype | Complete | `CP24_G09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`; `scripts/check_cp24_close_out.mjs` |
| CP25 reviewer workbench action workflow | Complete | `CP25_A09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`; `scripts/check_cp25_a09_close_out.mjs` |

Inherited facts:

- CP22 graph nodes: 79,657.
- CP22 graph edges: 147,689.
- CP22 vault artifacts: 158.
- CP22 public-safe graph nodes: 0.
- CP22 public-safe graph edges: 0.
- CP22 public-safe vault artifacts: 0.
- CP24 fixtures: 10.
- CP24 selected candidates: 15.
- CP24 remediation items: 72.
- CP25 review queue items: 72.
- CP25 remediation states: 72.
- CP25 audit events: 72.
- CP25 decision ledger entries: 72.
- CP25 unresolved actions: 66.
- CP25 high/critical open blockers: 12.
- Public release remains blocked.

## 3. Product Boundaries

CP26 must preserve these boundaries:

1. Snapshot exports are private operational artifacts, not public content products.
2. Canonical source tables remain the authority for Quran, tafsir, translation, hadith, grade, verification, provenance, licensing, and release state.
3. Graph, vault, retrieval, reviewer, remediation, and audit artifacts remain derived private metadata.
4. Public-safe fields remain false by default unless a later public-release gate explicitly approves otherwise.
5. Live snapshot export must not read, print, or embed `.env` values, secrets, service-role keys, private tokens, or credentials.
6. Snapshot rows must be bounded and typed; no full private database dump is acceptable.
7. Refresh commands must be repeatable and must produce manifests and checksums.
8. Refresh must preserve source-to-graph-to-retrieval-to-reviewer traceability.
9. Reviewer audit and remediation history must not be overwritten silently.
10. CP26 must not introduce public API routes or public mobile routes for private snapshot data.

## 4. Controlling Documents

CP26 is governed by:

- `docs/09_sprints/resource_audit_import_prototype/CP25_A09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`
- `docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_SPRINT_PLAN.md`
- `docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_ACCEPTANCE_CHECKLIST.md`
- `docs/09_sprints/resource_audit_import_prototype/CP24_G09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`
- `docs/09_sprints/resource_audit_import_prototype/CP23_A10_CLOSE_OUT_AND_NEXT_SCOPE_DECISION_REPORT.md`
- `docs/09_sprints/resource_audit_import_prototype/CP22_G10_CLOSE_OUT_REPORT.md`
- `docs/04_knowledge/RAFIQ_KNOWLEDGE_GRAPHIFY_AND_VAULT_ARCHITECTURE_V1.md`
- `docs/04_knowledge/RAFIQ_KNOWLEDGE_GRAPHIFY_GRAPH_CONTRACT_V1.md`
- `docs/04_knowledge/RAFIQ_KNOWLEDGE_VAULT_ARTIFACT_CONTRACT_V1.md`
- `docs/03_ai_engine/RAFIQ_AI_Validation_Gates_V1.md`
- `docs/07_governance/RAFIQ_Content_Governance_Specification_V1.md`
- `docs/07_governance/RAFIQ_Trust_Authenticity_Framework_V1.md`
- `docs/04_knowledge/RAFIQ_Source_Licensing_Register_V1.md`

## 5. Expected Implementation Surface

Expected private implementation surfaces:

| Surface | Expected role |
| --- | --- |
| `packages/shared/src/private-content.ts` | Add CP26 snapshot manifest, source snapshot, refresh result, checksum, and boundary status contracts if needed. |
| `apps/api/src/modules/private-content/` | Add private snapshot status and refresh preview routes only if API proof is required. |
| `apps/mobile/app/review-workbench.tsx` or a focused internal route | Display snapshot manifest, refresh status, checksum chain, unresolved blockers, and public boundary status if UI proof is required. |
| `apps/mobile/src/services/privateContentApi.ts` | Add private snapshot status client calls only if API/UI work is included. |
| `scripts/` | Add snapshot export, refresh, checksum, rollback, and combined verification scripts. |
| `data/snapshots/cp26/` | Store bounded private snapshot inputs, refresh manifests, checksum ledgers, and rollback metadata. |
| `data/graphify/full-private/`, `data/retrieval/cp24/`, `data/review/cp25/` | Continue as generated/private outputs refreshed from CP26 snapshot inputs. |
| `docs/09_sprints/resource_audit_import_prototype/` | Record each checkpoint report and update acceptance status. |

## 6. Checkpoints

### CP26-S01 - Snapshot Architecture And Source Map

Purpose: define the snapshot architecture before implementation.

Status: Complete. See `CP26_S01_SNAPSHOT_ARCHITECTURE_AND_SOURCE_MAP.md`.

Deliverables:

- snapshot architecture note,
- source table/export map,
- private artifact dependency map,
- snapshot folder and manifest naming policy,
- public-boundary policy,
- rollback and verifier plan.

Acceptance:

- CP25 close-out is the controlling baseline;
- live snapshot export is explicitly private;
- source tables and derived graph/vault/reviewer artifacts are separated;
- no public release approval is implied;
- no secrets or `.env` values are required.

### CP26-S02 - Snapshot Contracts And Manifest Schema

Purpose: define typed request, response, snapshot row, manifest, checksum, and refresh result contracts.

Status: Complete. See `CP26_S02_SNAPSHOT_CONTRACTS_AND_MANIFEST_SCHEMA.md`.

Deliverables:

- snapshot batch manifest contract,
- source snapshot metadata contract,
- checksum ledger contract,
- refresh run contract,
- public-boundary status contract,
- error and rollback status contract.

Acceptance:

- every snapshot batch has an ID, timestamp, source scope, checksum summary, and public boundary status;
- canonical refs remain separate from graph/vault IDs;
- private/public classification is explicit;
- invalid or missing manifest fields fail verification.

### CP26-S03 - Private Snapshot Export Prototype

Purpose: generate bounded private snapshot inputs from current RAFIQ fixture/source artifacts without exposing secrets or full private dumps.

Status: Complete. See `CP26_S03_PRIVATE_SNAPSHOT_EXPORT_PROTOTYPE.md`.

Deliverables:

- source content snapshot fixture,
- provenance and release-state snapshot fixture,
- graph/vault dependency snapshot fixture,
- reviewer/remediation/audit snapshot fixture,
- export manifest,
- checksum ledger.

Acceptance:

- exported rows are typed and bounded;
- source/provenance/release/review state are traceable;
- private-only classification is enforced;
- public-safe counts remain zero;
- export can be rerun deterministically against the same inputs.

### CP26-S04 - Refresh Pipeline Prototype

Purpose: rebuild private graph/retrieval/reviewer working artifacts from CP26 snapshot inputs.

Status: Complete. See `CP26_S04_REFRESH_PIPELINE_PROTOTYPE.md`.

Deliverables:

- refresh script,
- refresh run manifest,
- refreshed graph input summary,
- refreshed retrieval handoff summary,
- refreshed reviewer queue/remediation summary,
- unresolved reference report.

Acceptance:

- refresh consumes CP26 snapshots instead of hard-coded one-off fixture assumptions where practical;
- refreshed outputs preserve CP22/CP24/CP25 IDs or provide deterministic replacement mapping;
- unresolved references are reported, not hidden;
- high/critical blockers remain visible;
- public-safe counts remain zero.

### CP26-S05 - Checksum, Diff, And Rollback Proof

Purpose: prove refresh changes can be audited, compared, and rolled back safely.

Status: Complete. See `CP26_S05_CHECKSUM_DIFF_AND_ROLLBACK_PROOF.md`.

Deliverables:

- before/after checksum ledger,
- snapshot diff summary,
- artifact diff summary,
- rollback manifest,
- stale artifact detection,
- verifier.

Acceptance:

- every generated snapshot and refreshed artifact has a checksum entry;
- changed, unchanged, added, removed, and unresolved items are counted;
- rollback target is explicit;
- audit/remediation history is not overwritten silently;
- stale or mismatched manifests fail verification.

### CP26-S06 - Private API And Internal UI Status Proof

Purpose: make live snapshot export and refresh status inspectable in RAFIQ internal UX if needed for reviewer/product owner visibility.

Status: Complete. See `CP26_S06_PRIVATE_API_AND_INTERNAL_UI_STATUS_PROOF.md`.

Deliverables:

- private snapshot status API route or static proof artifact,
- internal snapshot status panel,
- manifest/checksum summary display,
- blocker and unresolved reference display,
- public-boundary display,
- verifier.

Acceptance:

- route or screen is private-only;
- no full graph, vault, source table, or audit dump is sent to the client;
- refresh status, manifest IDs, and public boundary are visible;
- public-release blocked state remains visible.

### CP26-S07 - Combined Verification

Purpose: provide one command that verifies CP22, CP23, CP24, CP25, and CP26 snapshot boundaries.

Status: Complete. See `CP26_S07_COMBINED_VERIFICATION.md`.

Deliverables:

- combined CP26 verifier,
- inherited CP25 close-out verifier,
- snapshot contract checks,
- export/refresh manifest checks,
- checksum/diff/rollback checks,
- public-boundary checks.

Acceptance:

- `node scripts\check_cp25_a09_close_out.mjs` remains passing;
- CP26 snapshot export and refresh checks pass;
- public-safe counts remain zero;
- no public snapshot route exists;
- no secrets or `.env` values are printed.

### CP26-S08 - Close-Out And Next Scope Decision

Purpose: close CP26 and decide the next scope.

Status: Complete. See `CP26_S08_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`.

Deliverables:

- close-out report,
- final checklist update,
- known limitations,
- next scope recommendation.

Acceptance:

- CP26 combined verifier passes;
- snapshot export and refresh limits are documented;
- rollback and checksum proof are documented;
- public release remains blocked unless a separate public-release track explicitly approves otherwise;
- next scope is selected with rationale.

## 7. Acceptance Gates

CP26 cannot close unless:

- `node scripts\check_cp25_a09_close_out.mjs` remains passing;
- CP26 combined verifier exists and passes;
- snapshot manifests and checksum ledgers exist and pass verification;
- refresh outputs can be traced back to snapshot batch IDs;
- unresolved source, provenance, release, graph, vault, retrieval, reviewer, audit, and remediation references are reported;
- high/critical blockers remain visible;
- public-safe graph, vault, retrieval, review, and snapshot counts remain zero;
- no public route exposes private snapshot data;
- no `.env` values, secrets, service-role keys, private tokens, or credentials are read, printed, or embedded;
- docs and verifier commands are updated.

## 8. Risks

| Risk | Mitigation |
| --- | --- |
| Snapshot export is mistaken for public release readiness | Keep public release blocked and verifier-enforced. |
| Snapshot logic becomes a hidden database dump | Use bounded typed exports, row caps where needed, and manifest scope checks. |
| Canonical content authority shifts into graph/vault artifacts | Keep canonical refs separate and document graph/vault as derived metadata. |
| Refresh overwrites reviewer audit history | Use append-aware ledgers, checksum proof, and rollback manifests. |
| Missing references are hidden by refresh success | Generate unresolved reference reports and fail where required refs are missing. |
| Private source rows leak to UI/API | Use bounded status summaries and negative public route checks. |
| Secrets enter snapshot logs | Do not read `.env`; verify artifacts for forbidden secret/config markers. |

## 9. Recommended First Action

Proceed next with:

```text
CP27 - Refresh-Backed Graph And Vault Rebuild
```

Reason: CP26 is complete. The next product-development step is to rebuild the full private graph and vault from CP26 snapshot batches, compare the refreshed outputs against the CP22 baseline, and keep public-safe graph/vault counts at zero.
