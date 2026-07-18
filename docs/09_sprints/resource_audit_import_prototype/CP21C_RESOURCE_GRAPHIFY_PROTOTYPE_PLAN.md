# CP21C - Resource Graphify Prototype Plan

Date: 2026-07-10
Status: Prototype Plan Draft

Parent Documents:

- `../../04_knowledge/RAFIQ_KNOWLEDGE_GRAPHIFY_AND_VAULT_ARCHITECTURE_V1.md`
- `../../04_knowledge/RAFIQ_KNOWLEDGE_GRAPHIFY_GRAPH_CONTRACT_V1.md`
- `../../04_knowledge/RAFIQ_KNOWLEDGE_VAULT_ARTIFACT_CONTRACT_V1.md`
- `CP21C_SEMANTIC_RANKING_AND_CROSS_SOURCE_SELECTION_CONTRACT.md`

## Objective

Define the first implementation plan for RAFIQ Product Knowledge Graphify in
support of CP21C Semantic Ranking And Cross-Source Selection.

The prototype must improve ranking evidence and explainability without changing
the user-facing guidance experience yet.

## Product Boundary

This prototype uses RAFIQ Product Knowledge Graphify, not the current developer
`graphify-out/` code graph.

It must not depend on:

- `C:\Users\user\Documents\00 AI agent`;
- the central AI-Knowledge Obsidian vault;
- developer-only Graphify outputs;
- private `.env` values.

It may use RAFIQ private-local APIs, canonical database content, existing
GuidanceSession responses, source-search responses, quality flags, release
states, and validation results.

## CP21C Problem

RAFIQ currently has a conditional private MVP GO, but semantic ranking remains
too dependent on deterministic theme expansion.

CP21C must prove:

- Quran-first guidance is selected for general needs;
- tafsir matches the selected ayah;
- hadith support is relevant and safe;
- direct ayah input preserves the requested ayah;
- opened hadith guidance keeps the opened narration first;
- source search avoids repeated low-value rows;
- no-evidence, scholar, safety, and medical/legal cases are not optimized into
  unsafe answers.

## Prototype Output

The prototype should produce:

1. A private CP21C graph export.
2. At least 20 ranking case packs.
3. A scoring summary.
4. A remediation list for weak ranking cases.
5. A verification script proving the graph and packs meet this plan.

No public user-facing feature is approved by this prototype.

## Minimum Matrix

The CP21C matrix must include at least 20 cases.

| Group | Minimum Cases | Notes |
| --- | --- | --- |
| Quran-first needs | 6 | Anxiety, patience, gratitude, hope, reliance, sadness or similar. |
| Worship/prayer needs | 3 | Prayer focus, consistency, sincerity, worship boundaries. |
| Emotional/spiritual reflection | 3 | Fear, guilt, motivation, confusion, loneliness or similar. |
| Direct ayah references | 3 | Preserve requested ayah as anchor. |
| Hadith-record anchored guidance | 2 | Preserve opened narration first. |
| Source Search research queries | 2 | Avoid duplicate source crowding; route to study rooms. |
| Blocked/no-evidence prompts | 1 | Must block without invented evidence. |

Sensitive scholar, safety, medical, legal, and self-harm prompts must either be
excluded from ordinary ranking or scored separately as escalation cases.

## Graph Scope

This graph scope is intentionally small.

CP21C exports a ranking-evidence graph for the CP21C case matrix only. It is
not the full RAFIQ resource graph over all Quran ayahs, translations, tafsir
passages, hadith records, source topics, provenance records, review states, and
release states. The prototype graph is a focused explainability sample used to
prove ranking, selection, rejection, and blocking behavior.

The full RAFIQ resource graph must be planned as a separate checkpoint after
the CP21C prototype proves the graph and vault contracts. Future readers must
not treat `data/graphify/cp21c/resource-graph.json` as the complete RAFIQ
knowledge graph.

The graph export must include:

- ranking case nodes;
- generated or inspected GuidanceSession nodes;
- selected Quran anchor nodes;
- candidate Quran anchor nodes where available;
- selected tafsir passage nodes;
- candidate tafsir passage nodes where available;
- selected hadith support nodes;
- rejected hadith support nodes where available;
- quality finding nodes;
- release state nodes;
- validation gate nodes where available;
- source nodes for selected evidence.

## Required Edges

The prototype graph must include edges that show:

- case -> selected GuidanceSession;
- case -> selected Quran anchor;
- case -> candidate Quran anchors;
- case -> selected tafsir;
- case -> selected hadith;
- case -> rejected candidates, when available;
- evidence -> source;
- evidence -> quality finding, when present;
- evidence -> release state;
- GuidanceSession -> validation gate result, when available.

## Ranking Case Pack Shape

Each ranking case pack should follow the Knowledge Vault artifact contract for
`ranking_case_pack`.

Minimum fields:

| Field | Requirement |
| --- | --- |
| `caseId` | Stable CP21C case ID. |
| `caseGroup` | One of the minimum matrix groups. |
| `input` | Prompt, ayah reference, hadith record ID, or source query. |
| `expectedBehavior` | What the ranking should preserve or block. |
| `responseState` | Guidance or search result state. |
| `selectedQuranAnchor` | Ayah selected or null if not applicable. |
| `selectedTafsir` | Tafsir route selected or null if unavailable. |
| `selectedHadithSupport` | Hadith selected or null if not applicable. |
| `candidateSummary` | Count and short labels for candidate evidence. |
| `rejectionReasons` | Why candidates were rejected, if available. |
| `qualityBlockers` | Damaged/withheld/weak/unverified blockers. |
| `releaseBlockers` | Public release blockers, if relevant. |
| `score` | 0-100 score. |
| `pass` | Boolean. |
| `remediation` | Required fix when below threshold. |

## Scoring Rubric

Each case is scored out of 100.

| Signal | Points |
| --- | --- |
| Correct response state | 20 |
| Quran anchor suitable where expected | 20 |
| Tafsir route available and relevant | 15 |
| Hadith support relevant and verified where expected | 15 |
| Reflection and one action present | 10 |
| Source links open study rooms | 10 |
| No duplicate exact source rows crowd first results | 5 |
| No internal/developer/release language | 5 |

Pass requirements:

- average score at least `85`;
- no critical case below `75`;
- no unsafe case optimized into ordinary guidance;
- no public-release claim produced;
- remediation list generated for every failing signal.

## Candidate Rejection Reasons

Allowed rejection reason labels:

| Label | Meaning |
| --- | --- |
| `lower_theme_match` | Candidate was less related to detected need/theme. |
| `missing_tafsir` | Candidate lacked usable tafsir support. |
| `weak_or_unknown_hadith` | Hadith quality/grade was not strong enough. |
| `withheld_text` | Candidate had withheld or damaged text. |
| `duplicate_source_row` | Candidate repeated the same exact source result. |
| `public_release_blocked` | Candidate cannot be used publicly. |
| `not_quran_first` | Candidate would weaken Quran-first ordering. |
| `direct_anchor_required` | Direct ayah or hadith input required preserving opened evidence. |
| `risk_escalation` | Prompt should escalate instead of rank ordinary guidance. |
| `no_evidence` | No suitable evidence found. |

## Access And Release Boundary

All CP21C graph and vault outputs are private by default.

Expected access level:

```text
developer_private
```

Public exposure is not allowed unless a later release-gate graph proves all
nodes, edges, and artifact content are public-approved.

## Implementation Steps

### Step 1 - Case Matrix

Create a machine-readable CP21C matrix with at least 20 cases.

### Step 2 - Evidence Collection

For each case, collect current orchestrator, source-search, ayah-study,
tafsir, hadith, quality, and release-state evidence using existing private
APIs or repository scripts.

### Step 3 - Graph Export

Build a small graph export that follows the Graph Contract:

- graph manifest;
- nodes;
- edges;
- statuses;
- release states;
- access levels.

### Step 4 - Vault Packs

Generate private ranking case packs following the Vault Artifact Contract.

### Step 5 - Score And Remediate

Score every case and generate a remediation list.

### Step 6 - Verification Script

Add a CP21C verification script that checks:

- at least 20 cases exist;
- graph manifest exists;
- every node and edge has required fields;
- every ranking pack has required fields;
- average score threshold is met;
- no critical case fails below threshold;
- escalation cases are not treated as ordinary guidance.

## Proposed Files

Implementation may later add:

| File | Purpose |
| --- | --- |
| `data/graphify/cp21c/cases.json` | CP21C matrix cases. |
| `data/graphify/cp21c/resource-graph.json` | Private product graph export. |
| `data/graphify/cp21c/ranking-summary.json` | Scores and remediation summary. |
| `data/vault/cp21c/ranking-cases/*.md` | Private ranking case packs. |
| `scripts/check_cp21c_resource_graphify.mjs` | Verification script. |

Final paths may change during implementation if a better product-owned graph
storage location is selected. The implementation must not write to the central
developer Obsidian vault.

## Acceptance Criteria

CP21C Resource Graphify prototype passes only when:

- architecture, graph contract, vault contract, and this plan are present;
- at least 20 CP21C cases are represented;
- graph export follows the Graph Contract;
- ranking packs follow the Vault Artifact Contract;
- average score is at least `85`;
- no critical case scores below `75`;
- no unsafe/escalation case is converted into ordinary guidance;
- no public release readiness claim is made;
- remediation list exists for ranking defects.

## Non-Goals

This prototype does not:

- replace the canonical database;
- build the full RAFIQ resource graph;
- replace the orchestrator;
- launch public graph or vault surfaces;
- approve any source for public use;
- implement backend Growth Memory;
- implement Hadith replacement workflow;
- add new mobile route chrome;
- depend on the current developer Graphify/Obsidian workspace.

## Next Planned After This Plan

Once this plan is approved:

1. Create the CP21C case matrix.
2. Implement the private graph export script.
3. Generate ranking case packs.
4. Run the CP21C score and verification script.
5. Update the CP21C decision/checklist docs with evidence.

Bismillah.
