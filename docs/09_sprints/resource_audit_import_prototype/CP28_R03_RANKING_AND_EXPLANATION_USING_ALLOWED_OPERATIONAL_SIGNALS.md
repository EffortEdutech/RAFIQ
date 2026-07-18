# CP28-R03 - Ranking And Explanation Using Allowed Operational Signals

Date: 2026-07-18

Status: Complete

Scope: Rank CP28-R02 snapshot-backed retrieval candidates for private reviewer triage using allowed operational metadata only. This checkpoint does not approve public release, expose public routes, export raw source text bodies, or make religious authority claims.

## 1. Purpose

CP28-R03 applies a deterministic ranking and explanation layer to `data/retrieval/cp28/candidate-collection.json`.

The ranking output is useful for private reviewer ordering and later validation handoff. It is not an authenticity decision, source approval, religious ruling, or public-release decision.

## 2. Generated Artifacts

| Artifact | Path | Purpose |
| --- | --- | --- |
| Ranking selection | `data/retrieval/cp28/ranking-selection.json` | Scores CP28-R02 candidates, records operational scoring components, selection states, ordinary averages, escalation separation, and prohibited-inference scan status. |
| Retrieval manifest | `data/retrieval/cp28/manifest.json` | Adds the CP28-R03 ranking artifact path, checksum, counts, and verifier pointer. |
| Latest retrieval pointer | `data/retrieval/cp28/latest-retrieval.json` | Advances the CP28 retrieval pointer to CP28-R03. |
| Generator | `scripts/generate_cp28_r03_ranking_explanation.mjs` | Rebuilds CP28-R03 ranking artifacts from CP28-R02 candidate collection. |
| Verifier | `scripts/check_cp28_r03_ranking_explanation.mjs` | Verifies CP28-R02 baseline, R03 ranking artifact, signal boundaries, escalation separation, docs, and public-safe counts. |

## 3. Allowed Operational Signals

CP28-R03 allows only these operational signals:

- `source_refs_available`;
- `canonical_refs_available`;
- `graph_neighbor_available`;
- `vault_context_available`;
- `private_reviewed_quality`;
- `review_required_quality`;
- `private_blocked_release`;
- `cp27_unresolved_references_present`;
- `cp27_high_or_critical_blockers_present`;
- `remediation_reason_count`;
- `regression_fixture_coverage`;
- `direct_index_seed`;
- `escalation_required`.

These signals are reviewer-routing metadata. They do not rank religious truth, textual authenticity, scholarly strength, or public suitability.

## 4. Selection Rules

CP28-R03 enforces these rules:

1. Escalation candidates receive `ordinaryScore: null`.
2. Escalation candidates are excluded from ordinary averages.
3. Candidates with CP27 unresolved references or high/critical blockers remain held.
4. Candidates with `review_required` quality remain held.
5. Candidates with remediation reasons remain held.
6. `private_blocked` release state remains blocked from public use.
7. Public-safe candidate count must remain zero.

## 5. Current Results

| Metric | Count |
| --- | ---: |
| Fixtures | 10 |
| Candidates | 70 |
| Selected candidates | 0 |
| Held candidates | 55 |
| Requires escalation | 15 |
| Ordinary scored candidates | 55 |
| Ordinary average score | 15.4 |
| Remediation reason families | 5 |
| CP27 unresolved references visible | 77 |
| CP27 high/critical blockers visible | 30 |
| Public-safe candidates | 0 |
| Prohibited inference findings | 0 |

## 6. Why Zero Candidates Are Selected

Zero selected candidates is the correct CP28-R03 result.

CP28 is now reading from the CP27 refreshed graph/vault layer. That refreshed layer still exposes 77 unresolved references and 30 high/critical blockers. The ranking artifact can therefore order candidates for internal review, but it must not promote them as selected validation-handoff candidates yet.

This preserves the CP24/CP27 boundary: CP24 remains a regression baseline, CP27 remains a private refreshed metadata graph/vault, and CP28-R03 remains a private ranking proof.

## 7. Remediation Summary

The generated ranking artifact includes `remediationSummary` so CP28-R04 can build evidence routes and validation handoff around known blockers instead of hiding them.

Primary remediation families:

- resolve CP27 graph/vault references;
- complete quality review for `review_required` candidates;
- repair source/provenance gaps;
- route hadith grade uncertainty to escalation review;
- route safety-sensitive cases through escalation workflow.

## 8. Public Boundary

CP28-R03 remains private-only:

- public release is not approved;
- no public route is added;
- public-safe candidates remain zero;
- public-safe route items remain zero;
- public-safe graph/vault/snapshot counts remain zero;
- raw Quran, translation, tafsir, and hadith text bodies are not exported;
- ranking explanations remain operational metadata only.

## 9. Verification

Run:

```powershell
node scripts\check_cp28_r03_ranking_explanation.mjs
```

The verifier runs CP28-R02 verification first, regenerates CP28-R03, verifies checksums and latest pointers, checks allowed signal use, confirms prohibited-inference scan status, confirms escalation candidates are excluded from ordinary averages, and confirms public-safe candidate count remains zero.

## 10. Next Checkpoint

Proceed next with:

```text
CP28-R04 - Evidence Route Rebuild And Validation Handoff
```

Status: complete.
