# CP21C-G06 - Resource Graphify Verification Report

Date: 2026-07-10
Status: Pass

## Objective

Create the combined one-command verifier for CP21C Resource Graphify.

The verifier checks the case matrix, collected evidence, graph export, vault
packs, ranking summary, score thresholds, escalation boundaries, cross-artifact
case coverage, and public-safe metadata together.

## Scale Boundary

This verifier validates the CP21C ranking-evidence prototype only.

It does not validate a full RAFIQ resource graph, full Quran/hadith/tafsir
vault, or public release package. It explicitly confirms that CP21C artifacts
remain private and are not the full RAFIQ resource graph.

## Completed

- Added `scripts/check_cp21c_resource_graphify.mjs`.
- Reused the existing narrow graph, vault, and ranking-summary validators.
- Added direct case-matrix coverage validation.
- Added direct evidence boundary validation.
- Added cross-artifact case-count and case-ID validation.
- Added public-safe/private-release boundary validation.
- Updated the CP21C acceptance checklist.

## Verification Summary

| Area | Result |
| --- | --- |
| Case matrix | Pass |
| Evidence collection | Pass |
| Graph contract | Pass |
| Vault pack contract | Pass |
| Ranking summary gates | Pass |
| Cross-artifact case coverage | Pass |
| Escalation boundary | Pass |
| Public-safe metadata | Pass |

## One-Command Verifier

```powershell
node scripts\check_cp21c_resource_graphify.mjs
```

Expected result:

```json
{
  "status": "pass",
  "checkpoint": "CP21C-G06",
  "matrix": {
    "caseCount": 23,
    "ordinaryCaseCount": 20,
    "escalationCaseCount": 3
  },
  "rankingSummary": {
    "ordinaryAverageScore": 89.25,
    "lowScoringCaseCount": 3,
    "remediationCount": 16
  },
  "publicSafeBoundary": {
    "graphPublicSafeNodeCount": 0,
    "graphPublicSafeEdgeCount": 0,
    "summaryPublicSafe": false,
    "publicReleaseApproved": false
  }
}
```

## Current Verified Counts

| Field | Value |
| --- | --- |
| Matrix cases | 23 |
| Ordinary cases | 20 |
| Escalation cases | 3 |
| Graph nodes | 249 |
| Graph edges | 275 |
| Vault packs | 23 |
| Public-safe packs | 0 |
| Ordinary average score | 89.25 |
| Low-scoring ordinary cases | 3 |
| Remediation entries | 16 |

## Checks Run

Syntax check:

```powershell
node --check scripts\check_cp21c_resource_graphify.mjs
```

Combined verification:

```powershell
node scripts\check_cp21c_resource_graphify.mjs
```

The combined verifier internally runs:

```powershell
node scripts\check_cp21c_resource_graph.mjs
node scripts\check_cp21c_vault_packs.mjs
node scripts\check_cp21c_ranking_summary.mjs
```

## Next Planned

CP21C-G07 - Close-Out.

Record completed work, next planned action, ad-hoc first notes, checklist
state, decision updates if needed, and final verification evidence.

## Ad-Hoc First

- Keep the verifier strict about private/public metadata.
- Keep CP21C separate from the future full RAFIQ resource graph.
- Do not treat a passing CP21C verifier as public release approval.
- Use the low-scoring ordinary cases from G05 as remediation targets after
  CP21C close-out.

## Checklist Update

- `RG-I19` marked `Pass`.
- Verification script artifact marked `Pass`.
- Build/runtime check marked `Pass` because G06 changed only scripts/docs and
  narrow Node checks were run.

## Documentation Update

- Acceptance checklist updated.
- This G06 report added.

Bismillah.
