# CP24-G03 - Candidate Retrieval And Graph Expansion

Date: 2026-07-13

Status: Complete

Scope: Bounded private candidate retrieval fixture generation and graph expansion artifact for CP24. This checkpoint does not add API routes, UI panels, ranking selection, validation execution, or public exposure.

## 1. Purpose

CP24-G03 implements the first executable private artifact for graph-aware retrieval.

The generator reads the CP22 full private Product Knowledge Graphify outputs and vault manifest, resolves the CP24-G01 fixture seeds through real graph indexes and partitions, expands graph neighborhoods to a bounded depth, attaches vault pack IDs where available, and records stop conditions.

## 2. Generated Artifacts

| Artifact | Path | Purpose |
| --- | --- | --- |
| Candidate expansion artifact | `data/retrieval/cp24/candidate-expansion.json` | Private fixture requests, candidates, graph node/edge slices, vault pack refs, route shells, and boundary proofs. |
| Retrieval artifact manifest | `data/retrieval/cp24/manifest.json` | Checkpoint metadata, checksum, counts, source graph/vault facts, and verifier command. |

Generator:

```powershell
node scripts\generate_cp24_candidate_graph_expansion.mjs
```

Verifier:

```powershell
node scripts\check_cp24_g03_candidate_graph_expansion.mjs
```

## 3. Fixture Coverage

The generated artifact contains all CP24-G01 fixtures:

| Fixture | Coverage |
| --- | --- |
| `cp24-fixture-quran-anchor-001` | Resolves Quran ayah `1:1` through `by-ayah-key`; expands text, translation, tafsir, and surah adjacency where available. |
| `cp24-fixture-translation-context-001` | Resolves the first translation node for ayah `1:1`. |
| `cp24-fixture-tafsir-context-001` | Resolves the first tafsir passage node for ayah `1:1`. |
| `cp24-fixture-hadith-support-001` | Resolves `collections_abdullah-naseer-six-books_src:aggregate` through `by-hadith-key`. |
| `cp24-fixture-hadith-grade-escalation-001` | Resolves a grade assertion for `collections_fawaz-hadith-api-v1_database_linebyline:aggregate`. |
| `cp24-fixture-topic-001` | Resolves `source_ayah_theme_group:qul-ayah-themes-62:1` through `by-topic-key`. |
| `cp24-fixture-validation-history-001` | Resolves `cp21c_case:cp21c-ay-001`. |
| `cp24-fixture-source-gap-001` | Records an intentional unresolved missing-reference seed and holds it for review. |
| `cp24-fixture-public-boundary-001` | Proves public-safe graph/vault/candidate counts remain zero. |
| `cp24-fixture-safety-escalation-001` | Separates crisis intent into escalation candidates. |

## 4. Bounded Expansion Rules

G03 enforces these caps:

| Cap | Value |
| --- | ---: |
| Initial candidates per fixture | 8 |
| Expanded candidates per fixture | 12 |
| Graph expansion depth | 2 |
| Graph nodes per fixture | 40 |
| Graph edges per fixture | 80 |
| Evidence route items per fixture | 12 |
| Vault pack refs per fixture | 8 |
| Public-safe candidates | 0 |

Expansion uses adjacency from CP22 graph partitions. It stops at max depth, max node cap, max edge cap, unresolved seed nodes, rejected or withheld nodes, and rejected or retired edges.

## 5. Candidate Boundary

G03 does not perform final ranking selection. It collects and expands candidates only.

Any candidate missing source, provenance, or release refs is held for review and is not selected. Candidates with warning review states are also held for review. Hadith grade uncertainty and crisis intent fixtures are separated into escalation outcomes.

Current generated summary:

| Count | Value |
| --- | ---: |
| Fixtures | 10 |
| Candidates | 87 |
| Selected candidates | 0 |
| Requires review candidates | 74 |
| Requires escalation candidates | 13 |
| Rejected candidates | 0 |
| Unresolved seeds | 1 |
| Public-safe candidates | 0 |

The selected count is intentionally zero in G03 because final candidate scoring and selection belongs to CP24-G04.

## 6. Source Graph And Vault Proof

The artifact records:

| Field | Value |
| --- | --- |
| Source graph | `rafiq-full-private-resource-graph` |
| Source graph nodes | 79,657 |
| Source graph edges | 147,689 |
| Source vault | `rafiq-full-private-knowledge-vault` |
| Source vault artifacts | 158 |
| Public-safe graph nodes | 0 |
| Public-safe graph edges | 0 |
| Public-safe vault artifacts | 0 |

Vault pack refs are IDs only. G03 does not copy vault pack bodies into the candidate expansion artifact.

## 7. Acceptance

CP24-G03 is complete when:

- fixture candidate collector is implemented;
- graph node/edge resolver is implemented;
- max-depth expansion is enforced;
- vault pack resolver is implemented;
- rejected/withheld/missing-ref candidates are blocked from selected evidence;
- `node scripts\check_cp24_g03_candidate_graph_expansion.mjs` passes.

Status: complete.
