# CP21C - Resource Graphify Implementation Sprint Plan

Date: 2026-07-10
Status: Completed

## Objective

Implement the first RAFIQ Product Knowledge Graphify prototype for CP21C
Semantic Ranking And Cross-Source Selection.

This sprint turns the locked architecture and contracts into a small private
ranking-evidence system:

```text
case matrix
-> private graph export
-> ranking case vault packs
-> scoring summary
-> verification script
-> CP21C evidence update
```

## Controlling Documents

- `../../04_knowledge/RAFIQ_KNOWLEDGE_GRAPHIFY_AND_VAULT_ARCHITECTURE_V1.md`
- `../../04_knowledge/RAFIQ_KNOWLEDGE_GRAPHIFY_GRAPH_CONTRACT_V1.md`
- `../../04_knowledge/RAFIQ_KNOWLEDGE_VAULT_ARTIFACT_CONTRACT_V1.md`
- `CP21C_RESOURCE_GRAPHIFY_PROTOTYPE_PLAN.md`
- `CP21C_SEMANTIC_RANKING_AND_CROSS_SOURCE_SELECTION_CONTRACT.md`

## Product Boundary

This sprint builds the RAFIQ product Knowledge Graphify prototype.

It does not use the current developer Graphify code graph as product data.
It does not use the central developer Obsidian vault as a product vault.
It must not depend on absolute developer workspace paths.

## Scope

In scope:

- CP21C case matrix with at least 20 cases.
- Private graph export following the Graph Contract.
- Private ranking case vault packs following the Vault Artifact Contract.
- Ranking score and remediation summary.
- Verification script for the graph, vault packs, and score thresholds.
- CP21C documentation/checklist updates after evidence exists.

Out of scope:

- public graph or vault surfaces;
- public release approval;
- backend Growth Memory implementation;
- Hadith replacement workflow implementation;
- new mobile route chrome;
- production Graphify deployment;
- changes to canonical content schema unless a blocker is discovered.

## Implementation Checkpoints

| CP | Name | Output | Acceptance |
| --- | --- | --- | --- |
| CP21C-G01 | Case Matrix | Machine-readable 20+ case matrix. | Covers required groups and excludes/escalates sensitive prompts correctly. |
| CP21C-G02 | Evidence Collector | Current private API/search/orchestrator evidence captured per case. | Every case has response state and selected evidence or blocked reason. |
| CP21C-G03 | Graph Export | Private `resource-graph.json`. | Manifest, nodes, edges, statuses, release states, access levels pass contract checks. |
| CP21C-G04 | Vault Packs | Private ranking case markdown packs. | Every pack has required front matter and scoring sections. |
| CP21C-G05 | Score Summary | Ranking summary and remediation list. | Average score >= 85, no critical case < 75, remediation exists for defects. |
| CP21C-G06 | Verification | `check_cp21c_resource_graphify` script. | Script verifies matrix, graph, packs, scores, and no unsafe ordinary guidance. |
| CP21C-G07 | Close-Out | CP21C docs/checklist/decision updates. | Completed, next planned, ad-hoc first, checklist update, documentation update recorded. |

## Completion Summary

CP21C Resource Graphify prototype is complete.

Final verified state:

- 23 total cases.
- 20 ordinary ranking cases.
- 3 separate escalation boundary cases.
- 253 private graph nodes after CP21C-R01 remediation.
- 292 private graph edges after CP21C-R01 remediation.
- 23 private vault ranking case packs.
- 0 public-safe graph nodes.
- 0 public-safe graph edges.
- 0 public-safe vault packs.
- Ordinary ranking average score: `98.25`.
- Critical ordinary cases below `75`: 0.
- Low-scoring ordinary cases: 0.
- Remediation entries: 4.
- Combined verifier: `scripts/check_cp21c_resource_graphify.mjs`.
- Remediation report: `CP21C_R01_RANKING_REMEDIATION_REPORT.md`.

CP21C remains a private ranking-evidence prototype slice. It is not the full
RAFIQ resource graph and it does not approve public release.

## Proposed Artifact Paths

Implementation may create:

```text
data/graphify/cp21c/cases.json
data/graphify/cp21c/resource-graph.json
data/graphify/cp21c/ranking-summary.json
data/vault/cp21c/ranking-cases/*.md
scripts/check_cp21c_resource_graphify.mjs
```

If implementation discovers a better product-owned storage path, update this
plan before writing broad artifacts.

## Required Case Groups

| Group | Minimum |
| --- | --- |
| Quran-first needs | 6 |
| Worship/prayer needs | 3 |
| Emotional/spiritual reflection | 3 |
| Direct ayah references | 3 |
| Hadith-record anchored guidance | 2 |
| Source Search research queries | 2 |
| Blocked/no-evidence prompts | 1 |

## Scoring Gate

The prototype passes only if:

- at least 20 cases exist;
- average score is at least `85`;
- no critical case scores below `75`;
- every failed signal has remediation;
- sensitive/scholar/safety/medical/legal cases are blocked or escalated, not
  optimized into ordinary guidance.

## Public Release Rule

This sprint cannot approve public release.

All graph and vault outputs are private by default and must carry access and
release-state metadata.

## Verification Plan

Minimum checks before close-out:

- graph/vault contract verification script;
- CP21C scoring verification;
- existing build/runtime checks only if implementation touches API/shared/mobile
  code;
- Graphify refresh only if meaningful code structure changes occur.

## Close-Out Rule

The sprint close-out must report:

- Completed;
- Next planned;
- Ad-hoc first;
- Checklist update;
- Documentation update;
- Checks run.

## Next

Move to CP21C remediation or the next planned knowledge-graph checkpoint:

- CP21C-R01 remediated the low-scoring ordinary cases from
  `data/graphify/cp21c/ranking-summary.json`;
- plan the future full private RAFIQ resource graph expansion separately from
  CP21C;
- continue CP21D/CP21E only after preserving CP21C private/public boundaries.

Bismillah.
