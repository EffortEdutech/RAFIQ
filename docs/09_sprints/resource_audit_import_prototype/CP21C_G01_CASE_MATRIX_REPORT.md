# CP21C-G01 - Resource Graphify Case Matrix Report

Date: 2026-07-10
Status: Pass

## Objective

Create the CP21C Resource Graphify case matrix for semantic ranking and
cross-source selection.

## Completed

- Added `data/graphify/cp21c/cases.json`.
- Defined 20 ordinary ranking cases.
- Added 3 separate escalation-boundary cases.
- Covered all required CP21C groups:
  - Quran-first needs;
  - worship/prayer needs;
  - emotional/spiritual reflection;
  - direct ayah references;
  - hadith-record anchored guidance;
  - Source Search research queries;
  - blocked/no-evidence prompts.
- Preserved public-release NO-GO in matrix metadata.
- Marked all graph/vault output as private-local and `developer_private`.
- Kept Product Graphify separate from developer Graphify and central Obsidian.

## Matrix Summary

| Category | Count |
| --- | --- |
| Ordinary ranking cases | 20 |
| Separate escalation cases | 3 |
| Total cases | 23 |

## Checks Run

```powershell
node -e "const fs=require('fs'); const p='data/graphify/cp21c/cases.json'; const data=JSON.parse(fs.readFileSync(p,'utf8')); const ordinary=data.cases.filter(c=>c.scoringMode!=='separate_escalation').length; const escalation=data.cases.filter(c=>c.scoringMode==='separate_escalation').length; console.log(JSON.stringify({status:'valid', total:data.cases.length, ordinary, escalation, requiredGroupsSatisfied:data.coverage.requiredGroupsSatisfied}, null, 2));"
```

Result:

```json
{
  "status": "valid",
  "total": 23,
  "ordinary": 20,
  "escalation": 3,
  "requiredGroupsSatisfied": true
}
```

## Next Planned

CP21C-G02 - Evidence Collector.

The next step is to collect current private orchestrator, source-search,
tafsir, hadith, quality, and release-state evidence for each matrix case.

## Ad-Hoc First

- Do not start graph export until evidence collection shape is clear.
- Keep all CP21C outputs private.
- Do not write vault artifacts to the central AI-Knowledge vault.

## Checklist Update

- `RG-I01` marked `Pass`.
- `RG-I02` marked `Pass`.
- `RG-I03` marked `Pass`.
- Case matrix artifact marked `Pass`.

## Documentation Update

- Acceptance checklist updated.
- This G01 report added.

Bismillah.
