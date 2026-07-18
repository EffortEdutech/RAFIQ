# CP28-R02 - Candidate Collection From Snapshot-Backed Graph Indexes

Date: 2026-07-18

Status: Complete

Scope: Generate private CP28 candidate collection artifacts from CP27 refreshed graph indexes while preserving CP24 retrieval fixtures as regression labels. This checkpoint does not implement ranking, final selection, evidence route rebuild, validation handoff, API exposure, or UI exposure.

## 1. Purpose

CP28-R02 starts the implementation path defined in CP28-R01 by generating `data/retrieval/cp28/candidate-collection.json` from CP27 snapshot-backed graph indexes.

For avoidance of doubt: CP28-R02 candidates are private operational metadata. They are not canonical Quran, translation, tafsir, hadith, grade, verification, guidance, provenance, release-state, or review records. Canonical source data remains authoritative.

## 2. Generated Artifacts

| Artifact | Path | Purpose |
| --- | --- | --- |
| Candidate collection | `data/retrieval/cp28/candidate-collection.json` | Fixture-by-fixture candidate collection from CP27 graph indexes and bounded graph expansion. |
| Retrieval manifest | `data/retrieval/cp28/manifest.json` | Checksums, counts, CP27 graph/vault pointers, and CP24 regression baseline. |
| Latest retrieval pointer | `data/retrieval/cp28/latest-retrieval.json` | Current CP28 retrieval artifact pointer. |
| Generator | `scripts/generate_cp28_r02_candidate_collection.mjs` | Rebuilds R02 artifacts. |
| Verifier | `scripts/check_cp28_r02_candidate_collection.mjs` | Verifies R01 baseline, R02 artifacts, public boundary, and docs. |

## 3. Candidate Collection Boundary

CP28-R02 collects candidates from CP27 graph indexes only:

- `by-ayah-key`;
- `by-hadith-key`;
- `by-topic-key`;
- `by-source-id`;
- `by-quality-state`;
- `public-boundary`;
- `by-node-id` for bounded expansion resolution.

The generator loads CP27 graph partitions only to resolve node metadata and local adjacency. It does not export full partitions, full indexes, vault Markdown bodies, or raw Quran, translation, tafsir, or hadith text bodies.

## 4. Snapshot-Backed Index Usage

Each CP28 fixture is rebound to one or more CP27 index entries. These are snapshot-backed metadata handles generated through CP26 and CP27; they are not raw source bodies and not final public retrieval payloads.

## 5. Fixture Coverage

| CP28 fixture | CP24 regression label | Source index strategy | Boundary |
| --- | --- | --- | --- |
| `cp28-fixture-quran-anchor-001` | `cp24-fixture-quran-anchor-001` | `by-ayah-key:quran` | Quran candidate requires source/provenance/release visibility. |
| `cp28-fixture-translation-context-001` | `cp24-fixture-translation-context-001` | `by-source-id:translations` | Translation remains context and is not treated as Quran text. |
| `cp28-fixture-tafsir-context-001` | `cp24-fixture-tafsir-context-001` | `by-source-id:tafsir` | Tafsir remains explanatory context and not a ruling. |
| `cp28-fixture-hadith-support-001` | `cp24-fixture-hadith-support-001` | `by-hadith-key:hadith` | Hadith requires grade, verification, and review context. |
| `cp28-fixture-hadith-grade-escalation-001` | `cp24-fixture-hadith-grade-escalation-001` | `by-hadith-key:hadith_quality` | Grade uncertainty routes to escalation/review, not ordinary scoring. |
| `cp28-fixture-topic-001` | `cp24-fixture-topic-001` | `by-topic-key:topics_themes` | Topic relation may expand candidates but cannot create authority. |
| `cp28-fixture-validation-history-001` | `cp24-fixture-validation-history-001` | `by-source-id:private_audit` | Validation history is operational, not public approval. |
| `cp28-fixture-source-gap-001` | `cp24-fixture-source-gap-001` | `by-quality-state:review_required` | Unresolved refs and blockers remain visible. |
| `cp28-fixture-public-boundary-001` | `cp24-fixture-public-boundary-001` | `public-boundary:publicReleaseApproved` | Public-safe candidate and route item counts remain zero. |
| `cp28-fixture-safety-escalation-001` | `cp24-fixture-safety-escalation-001` | `by-source-id:private_review` | Safety escalation remains separate from ordinary ranking. |

## 6. Generated Counts

| Metric | Count |
| --- | ---: |
| Fixtures | 10 |
| Candidates | 70 |
| Collected without review | 0 |
| Requires review | 55 |
| Requires escalation | 15 |
| Unresolved seeds | 0 |
| Remediation reason families | 5 |
| Source index families used | 6 |
| CP27 unresolved references visible | 77 |
| CP27 high/critical blockers visible | 30 |
| Public-safe candidates | 0 |

## 7. Why CP28-R02 Is Smaller Than CP24

CP24-G03 used the CP22 full private resource graph baseline and produced 87 prototype candidates from a much larger graph.

CP28-R02 intentionally uses the CP27 refreshed graph, which currently contains 147 nodes, 125 edges, 10 partitions, and 12 indexes. CP27 is a snapshot-backed refreshed metadata graph, not the full CP22 resource graph and not the final RAFIQ resource graph. The smaller CP28-R02 result is expected and correct for this checkpoint.

This means CP28-R02 proves the retrieval engine can collect candidates from the refreshed graph/vault layer. It does not prove full Quran, translation, tafsir, hadith, or topic retrieval coverage.

## 8. Public Boundary

CP28-R02 remains private-only:

- public release is not approved;
- no public route is added;
- public-safe candidates remain zero;
- public-safe graph nodes remain zero;
- public-safe graph edges remain zero;
- public-safe vault artifacts remain zero;
- raw source text bodies are not exported;
- ranking and explanation are deferred to CP28-R03.

## 9. Verification

Run:

```powershell
node scripts\check_cp28_r02_candidate_collection.mjs
```

The verifier runs CP28-R01 verification first, regenerates CP28-R02 artifacts, checks CP27 graph/vault pointers, verifies CP24 regression labels, confirms unresolved refs and blockers remain visible, and confirms public-safe candidate count remains zero.

## 10. Next Checkpoint

Proceed next with:

```text
CP28-R03 - Ranking And Explanation Using Allowed Operational Signals
```

Status: complete.
