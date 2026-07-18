# CP21C-G02 - Resource Graphify Evidence Collector Report

Date: 2026-07-10
Status: Pass

## Objective

Collect current private RAFIQ orchestrator, Source Search, tafsir, hadith,
quality, release, and escalation evidence for the CP21C Resource Graphify case
matrix.

## Completed

- Added `scripts/collect_cp21c_resource_graphify_evidence.mjs`.
- Read the CP21C case matrix from `data/graphify/cp21c/cases.json`.
- Queried the private local API for all guidance-session cases.
- Queried Source Search cases.
- Collected supplemental tafsir passage evidence where a tafsir route was
  selected.
- Collected supplemental hadith detail evidence where a hadith record was
  opened or selected.
- Wrote evidence to `data/graphify/cp21c/evidence.json`.
- Preserved the product boundary:
  - private-local graph evidence;
  - `developer_private` access;
  - no public release approval;
  - no dependency on developer Graphify;
  - no dependency on the central Obsidian vault.

## Evidence Summary

| Field | Value |
| --- | --- |
| Total cases | 23 |
| Collected cases | 23 |
| Ordinary ranking cases | 20 |
| Separate escalation cases | 3 |
| Error count | 0 |

## Checks Run

Started local runtime with:

```powershell
scripts\start_phase5_apps.ps1
```

Verified runtime with:

```powershell
scripts\check_phase5_runtime.ps1
```

Result:

```text
Status: pass
ApiUrl: http://127.0.0.1:8056
ExpoUrl: http://127.0.0.1:8057
DeploymentMode: private_local
PublicContentEnabled: False
PublicSearchResults: 0
PublicAnswerState: source_unavailable
PublicGuidedPromptStatus: blocked_no_public_evidence
```

Collected evidence with:

```powershell
node scripts\collect_cp21c_resource_graphify_evidence.mjs
```

Result:

```json
{
  "status": "pass",
  "outputPath": "data/graphify/cp21c/evidence.json",
  "summary": {
    "totalCases": 23,
    "collectedCases": 23,
    "ordinaryRankingCases": 20,
    "separateEscalationCases": 3,
    "errorCount": 0
  }
}
```

Validated evidence file with:

```powershell
node -e "const fs=require('fs'); const p='data/graphify/cp21c/evidence.json'; const data=JSON.parse(fs.readFileSync(p,'utf8')); if(data.summary.errorCount!==0) throw new Error('errors present'); if(data.summary.collectedCases!==23) throw new Error('case count mismatch'); console.log(JSON.stringify({status:'valid', collectedCases:data.summary.collectedCases, ordinary:data.summary.ordinaryRankingCases, escalation:data.summary.separateEscalationCases, errorCount:data.summary.errorCount}, null, 2));"
```

Result:

```json
{
  "status": "valid",
  "collectedCases": 23,
  "ordinary": 20,
  "escalation": 3,
  "errorCount": 0
}
```

## Next Planned

CP21C-G03 - Graph Export.

The next step is to transform the evidence file into a private
`resource-graph.json` that follows the RAFIQ Knowledge Graphify Graph Contract.

## Ad-Hoc First

- Keep evidence private.
- Do not expose graph or vault outputs through public routes.
- Do not score CP21C until graph export and ranking packs exist.

## Checklist Update

- `RG-I04` marked `Pass`.
- Evidence collection artifact marked `Pass`.

## Documentation Update

- Acceptance checklist updated.
- This G02 report added.

Bismillah.
