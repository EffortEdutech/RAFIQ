# CP21C-G03 - Resource Graphify Graph Export Report

Date: 2026-07-10
Status: Pass

## Objective

Transform CP21C private evidence into a RAFIQ Product Knowledge Graphify graph
export that follows the Graph Contract.

## Completed

- Added `scripts/generate_cp21c_resource_graph.mjs`.
- Generated `data/graphify/cp21c/resource-graph.json`.
- Added `scripts/check_cp21c_resource_graph.mjs`.
- Validated the graph manifest, nodes, edges, required fields, node references,
  access levels, release states, quality states, review states, and public-safe
  flags.

## Graph Summary

## Scale Boundary

This export is a CP21C ranking-evidence prototype slice, not the full RAFIQ
resource graph.

The 249 nodes and 275 edges below represent only the 23 CP21C test cases,
their generated private GuidanceSession/source-search evidence, and the
selected/candidate Quran, tafsir, hadith, quality, release, validation, source,
theme, and translation entities touched by those cases.

Do not compare this count to the eventual full RAFIQ resource graph for Quran,
tafsir, translations, hadith, topics, sources, provenance, grades, review
queues, and release states. A full private RAFIQ resource graph is expected to
be orders of magnitude larger and must be built under a later checkpoint.

The `0` public-safe nodes and edges are correct for CP21C because public
release remains blocked.

| Field | Value |
| --- | --- |
| Graph ID | `cp21c-resource-graph-v1` |
| Graph kind | `ranking_graph` |
| Environment | `private_local` |
| Access level | `developer_private` |
| Public safe | `false` |
| Source evidence | `cp21c-resource-graphify-evidence-v1` |
| Case count | 23 |
| Node count | 249 |
| Edge count | 275 |
| Public-safe node count | 0 |
| Public-safe edge count | 0 |

## Node Types

- `GuidanceSession`
- `HadithRecord`
- `HadithTextVersion`
- `QualityFinding`
- `QuranAyah`
- `RafiqTheme`
- `RankingCase`
- `ReleaseState`
- `Source`
- `TafsirPassage`
- `TranslationText`
- `ValidationGateResult`

## Edge Types

- `case_candidate_result`
- `case_has_guidance_session`
- `case_selected_hadith`
- `case_selected_quran_anchor`
- `case_selected_tafsir`
- `entity_has_quality_finding`
- `entity_has_release_state`
- `guidance_cites`
- `guidance_has_validation_gate`
- `hadith_has_text_version`
- `session_detected_theme`
- `source_provides`
- `tafsir_explains_ayah`

## Checks Run

Syntax checks:

```powershell
node --check scripts\generate_cp21c_resource_graph.mjs
node --check scripts\check_cp21c_resource_graph.mjs
```

Graph generation:

```powershell
node scripts\generate_cp21c_resource_graph.mjs
```

Result:

```json
{
  "status": "pass",
  "outputPath": "data/graphify/cp21c/resource-graph.json",
  "summary": {
    "sourceEvidenceId": "cp21c-resource-graphify-evidence-v1",
    "caseCount": 23,
    "nodeCount": 249,
    "edgeCount": 275,
    "publicSafeNodeCount": 0,
    "publicSafeEdgeCount": 0
  }
}
```

Graph validation:

```powershell
node scripts\check_cp21c_resource_graph.mjs
```

Result:

```json
{
  "status": "pass",
  "graphPath": "data/graphify/cp21c/resource-graph.json",
  "nodeCount": 249,
  "edgeCount": 275
}
```

## Next Planned

CP21C-G04 - Vault Packs.

Generate private ranking case markdown packs from the evidence and graph export.

## Ad-Hoc First

- Keep all graph artifacts private.
- Do not expose this graph through public routes.
- Do not treat graph success as public release approval.

## Checklist Update

- `RG-I05` marked `Pass`.
- `RG-I06` marked `Pass`.
- `RG-I07` marked `Pass`.
- `RG-I08` marked `Pass`.
- `RG-I09` marked `Pass`.
- Graph contract check marked `Pass`.

## Documentation Update

- Acceptance checklist updated.
- This G03 report added.

Bismillah.
