# CP28-R04 - Evidence Route Rebuild And Validation Handoff

Date: 2026-07-18

Status: Complete

Scope: Rebuild private evidence routes and validation handoff from CP28-R03 ranked candidates. This checkpoint does not expose a public route, export source text bodies, or approve any candidate for public use.

## 1. Purpose

CP28-R04 converts `data/retrieval/cp28/ranking-selection.json` into remediation-first evidence routes.

Because CP28-R03 selected zero candidates, CP28-R04 creates review and escalation handoff routes only. The result is still useful: it tells reviewers exactly which gates, references, and remediation families block validation handoff.

## 2. Generated Artifacts

| Artifact | Path | Purpose |
| --- | --- | --- |
| Validation handoff | `data/retrieval/cp28/validation-handoff.json` | Evidence routes, route items, validation gates, remediation records, escalation split, and public-boundary status. |
| Retrieval manifest | `data/retrieval/cp28/manifest.json` | Adds CP28-R04 validation handoff path, checksum, counts, and verifier pointer. |
| Latest retrieval pointer | `data/retrieval/cp28/latest-retrieval.json` | Advances the CP28 retrieval pointer to CP28-R04. |
| Generator | `scripts/generate_cp28_r04_validation_handoff.mjs` | Rebuilds validation handoff from CP28-R03 ranking. |
| Verifier | `scripts/check_cp28_r04_validation_handoff.mjs` | Verifies R03 baseline, route/gate/remediation links, counts, docs, and public boundary. |

## 3. Evidence Route Structure

Each route contains:

- `selectedEvidence`, which is empty for CP28-R04;
- `reviewEvidence`, containing candidates held for review;
- `escalationEvidence`, containing hadith-grade and safety escalation candidates;
- `validationGateResults`, one result per required validation gate;
- route-linked remediation IDs;
- operational metadata boundaries on route items and gates.

## 4. Validation Gates

The required gates are:

- `intent`;
- `source_retrieval`;
- `quran_reference`;
- `translation`;
- `tafsir`;
- `hadith_reference`;
- `grade`;
- `authority_boundary`;
- `medical_legal_crisis`;
- `personalization`;
- `final_citation`.

The `final_citation` gate is blocked for every route because there are no selected evidence route items.

## 5. Current Results

| Metric | Count |
| --- | ---: |
| Fixtures | 10 |
| Evidence routes | 10 |
| Selected route items | 0 |
| Review route items | 55 |
| Escalation route items | 15 |
| Validation gate results | 110 |
| Remediation items | 70 |
| High/critical remediation items | 38 |
| Unresolved references visible | 70 |
| Missing citation route items | 55 |
| Public-safe route items | 0 |

## 6. Remediation Rules

R04 creates remediation records for every CP28 candidate because no candidate is selected yet.

Primary remediation actions:

- resolve CP27 graph/vault references and rerun CP27/CP28 artifacts;
- complete private quality review for `review_required` candidates;
- repair source/provenance linkage;
- route hadith grade uncertainty to scholar review;
- route safety-sensitive cases to product-owner escalation.

## 7. Public Boundary

CP28-R04 remains private-only:

- public release is not approved;
- no public route is added;
- public-safe route item count remains zero;
- public-safe graph/vault/snapshot counts remain zero;
- raw Quran, translation, tafsir, and hadith text bodies are not exported;
- evidence routes and validation gates are operational metadata only.

## 8. Verification

Run:

```powershell
node scripts\check_cp28_r04_validation_handoff.mjs
```

The verifier regenerates R03 and R04, checks artifact checksums, verifies route/gate/remediation links, confirms zero selected route items, confirms escalation separation, and confirms public-safe route item count remains zero.

## 9. Next Checkpoint

Proceed next with:

```text
CP28-R05 - Retrieval API And Private UI Integration
```

Status: complete.
