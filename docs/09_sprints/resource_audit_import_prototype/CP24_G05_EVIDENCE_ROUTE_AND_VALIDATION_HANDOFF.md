# CP24-G05 - Evidence Route And Validation Handoff

Date: 2026-07-14

Status: Complete

Scope: Private evidence route, validation gate linkage, citation coverage expectation, and remediation handoff artifact for CP24. This checkpoint does not execute validation, add an API route, add a UI panel, generate public answers, or approve public release.

## 1. Purpose

CP24-G05 converts the CP24-G04 ranked candidates into inspectable private workflow artifacts:

- evidence routes;
- selected, rejected/review, and escalation route items;
- validation gate results;
- validation handoff payloads;
- citation coverage expectations;
- remediation triggers.

The artifact makes later validation and reviewer work explicit without treating the route as religious authority.

## 2. Generated Artifact

| Artifact | Path | Purpose |
| --- | --- | --- |
| Validation handoff artifact | `data/retrieval/cp24/validation-handoff.json` | Evidence routes, validation handoffs, gate results, citation coverage expectations, remediation items, and public-boundary proof. |

Generator:

```powershell
node scripts\generate_cp24_validation_handoff.mjs
```

Verifier:

```powershell
node scripts\check_cp24_g05_validation_handoff.mjs
```

## 3. Evidence Route Structure

Each CP24 fixture now has one private evidence route with:

- selected evidence route items;
- rejected/review route items;
- escalation route items;
- validation gate results;
- escalation outcomes;
- review queue item IDs;
- remediation IDs.

Selected evidence route items are private workflow or validation items selected in CP24-G04. Religious content-bearing candidates remain held or escalated until validation and reviewer handoff rules are applied.

## 4. Validation Gates

Each route records these gates:

| Gate | Purpose |
| --- | --- |
| `intent` | Confirms ordinary vs escalation workflow. |
| `source_retrieval` | Checks source/provenance/release ref coverage. |
| `quran_reference` | Flags Quran candidates for canonical/source validation. |
| `translation` | Flags translation candidates for edition/source validation. |
| `tafsir` | Flags tafsir candidates for passage/source validation. |
| `hadith_reference` | Flags hadith candidates for reference/text validation. |
| `grade` | Flags hadith grade candidates for grade/reviewer validation. |
| `fatwa_boundary` | Separates scholar-sensitive outcomes. |
| `medical_legal_crisis` | Separates safety-sensitive outcomes. |
| `personalization` | Confirms no memory/personalization overrides source authority. |
| `final_citation` | Requires later citation coverage review before answer use. |

## 5. Current Results

| Count | Value |
| --- | ---: |
| Fixtures | 10 |
| Evidence routes | 10 |
| Selected route items | 15 |
| Rejected/review route items | 59 |
| Escalation route items | 13 |
| Validation gate results | 110 |
| Remediation items | 72 |
| High or critical remediation items | 18 |
| Unresolved references | 5 |
| Missing citation expectations | 59 |
| Escalation outcomes | 2 |
| Public-safe route items | 0 |

## 6. Remediation Rules

G05 creates remediation items when a candidate:

- lacks source refs;
- lacks provenance refs;
- lacks release-state refs;
- is unresolved or rejected;
- is withheld or rejected;
- requires escalation;
- needs citation coverage review.

Each remediation item records:

- remediation ID;
- evidence route ID;
- severity;
- issue type;
- graph node targets;
- canonical ref targets;
- recommended owner;
- recommended action;
- blocking status;
- `publicReleaseApproved: false`.

## 7. Public Boundary

G05 preserves:

- `privateOnly: true`;
- `publicSafeRouteItemCount: 0`;
- `publicReleaseApproved: false`;
- `publicRouteExposed: false`.

Evidence routes support private review and validation only. They do not make graph nodes, vault packs, citations, answers, or candidates public-safe.

## 8. Acceptance

CP24-G05 is complete when:

- evidence route output is implemented;
- selected evidence has source/provenance/release refs;
- validation gate linkage is implemented;
- remediation trigger mapping is implemented;
- public boundary remains false;
- `node scripts\check_cp24_g05_validation_handoff.mjs` passes.

Status: complete.
