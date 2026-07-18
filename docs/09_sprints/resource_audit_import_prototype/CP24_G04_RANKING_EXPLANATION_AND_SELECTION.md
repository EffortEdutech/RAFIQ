# CP24-G04 - Ranking, Explanation, And Selection

Date: 2026-07-14

Status: Complete

Scope: Private operational ranking, explanation, and selection artifact for CP24. This checkpoint does not add an API route, UI panel, validation execution, public answer usage, or public-release approval.

## 1. Purpose

CP24-G04 scores the bounded candidates generated in CP24-G03 and separates them into selected, held, rejected, and escalation groups.

The ranking model is operational only. It helps RAFIQ decide which private workflow and validation candidates should move forward to later evidence-route and validation-handoff work. It does not approve religious content, does not infer authenticity, does not treat graph centrality as authority, and does not make any candidate public-safe.

## 2. Generated Artifact

| Artifact | Path | Purpose |
| --- | --- | --- |
| Ranking selection artifact | `data/retrieval/cp24/ranking-selection.json` | Scores CP24-G03 candidates, records scoring components, selection states, selected/held/rejected/escalated IDs, ordinary averages, and prohibited-inference scan result. |

Generator:

```powershell
node scripts\generate_cp24_ranking_selection.mjs
```

Verifier:

```powershell
node scripts\check_cp24_g04_ranking_selection.mjs
```

## 3. Scoring Model

Model ID:

```text
cp24-operational-ranking-v1
```

Allowed signals:

| Signal group | Meaning |
| --- | --- |
| Text match | Private fixture/query relation, not authority. |
| Source refs | Source refs are present or missing. |
| Provenance refs | Provenance refs are present or missing. |
| Release refs | Release-state refs are present or missing. |
| Graph neighborhood | Bounded graph neighbors exist for review. |
| Validation history | Prior validation workflow evidence exists. |
| Vault context | Vault pack IDs exist for reviewer navigation. |
| Quality/review state | Warning, pending, rejected, withheld, or unverified states remain visible. |
| Release blocker | Candidate remains private/public-blocked. |
| Escalation intent | Candidate is removed from ordinary scoring and routed to escalation. |

Prohibited inferences:

- graph centrality as authenticity;
- ranking score as religious approval;
- vault pack as canonical source data;
- public-safe state inferred from private metadata;
- escalation hidden inside ordinary scoring;
- weak/unverified hadith selected as primary guidance;
- topic relation converted into ruling.

## 4. Selection Rules

G04 selection is intentionally conservative:

1. Missing source/provenance/release refs cannot be selected.
2. Rejected or withheld candidates cannot be selected.
3. Escalation candidates stay outside ordinary scoring.
4. Religious content-bearing candidates remain held until validation and reviewer handoff.
5. Selected candidates must be private workflow or validation candidates with complete refs, clean quality state, and operational selection reasons.
6. Selection reasons must include the operational boundary and must not imply religious/public approval.

## 5. Current Results

| Count | Value |
| --- | ---: |
| Fixtures | 10 |
| Candidates | 87 |
| Selected candidates | 15 |
| Held candidates | 58 |
| Rejected candidates | 1 |
| Escalation candidates | 13 |
| Ordinary scored candidates | 74 |
| Ordinary average score | 62.86 |
| Escalation outcome count | 13 |
| Public-safe candidates | 0 |
| Prohibited inference findings | 0 |

Selected candidates are private workflow or validation candidates only. Quran, translation, tafsir, hadith, hadith grade, and topic candidates remain held or escalated until CP24-G05 validation handoff and reviewer rules are applied.

## 6. Public Boundary

G04 preserves:

- `privateOnly: true`;
- `publicSafeCandidateCount: 0`;
- `publicReleaseApproved: false`;
- `publicRouteExposed: false`.

Escalation outcomes are excluded from ordinary average score calculations.

## 7. Acceptance

CP24-G04 is complete when:

- ranking model uses allowed operational signals;
- selection reasons are operational and non-authoritative;
- candidate split includes selected, held, rejected, and escalated groups;
- escalation outcomes stay outside ordinary score averages;
- prohibited inference verifier is implemented;
- `node scripts\check_cp24_g04_ranking_selection.mjs` passes.

Status: complete.
