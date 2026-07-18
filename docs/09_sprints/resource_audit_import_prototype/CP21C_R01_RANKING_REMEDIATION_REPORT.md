# CP21C-R01 - Ranking Remediation Report

Date: 2026-07-10
Status: Pass

## Objective

Remediate the three low-scoring CP21C ordinary ranking cases recorded during
CP21C-G07 without relaxing scoring gates, weakening escalation boundaries, or
changing the private/public release boundary.

## Remediation Scope

The failing cases were:

| Case | Prompt | Previous State | R01 Action |
| --- | --- | --- | --- |
| `CP21C-ES-001` | `I feel guilty and want to make tawbah` | `blocked_no_evidence` | Map tawbah/guilt language to mercy evidence. |
| `CP21C-ES-002` | `I feel spiritually unmotivated` | `blocked_no_evidence` | Map spiritual motivation language to guidance evidence. |
| `CP21C-QF-004` | `I need hope after a hard week` | `blocked_no_evidence` | Map hard-week/hope language to hope evidence. |

The implementation changed only the private API deterministic guidance intent
expansion table in `apps/api/src/modules/private-content/private-content.service.ts`.
The ranking scorer, CP21C thresholds, escalation cases, and public-safe metadata
were not relaxed.

## Result

| Field | Before R01 | After R01 |
| --- | --- | --- |
| Ordinary average score | `89.25` | `98.25` |
| Low-scoring ordinary cases | `3` | `0` |
| Remediation entries | `16` | `4` |
| Graph nodes | `249` | `253` |
| Graph edges | `275` | `292` |
| Public-safe graph nodes | `0` | `0` |
| Public-safe graph edges | `0` | `0` |
| Public-safe vault packs | `0` | `0` |

## Case Proof

| Case | Score | Status | Verification | Evidence | Quran Anchor | Tafsir Route | Search Route |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `CP21C-ES-001` | `100` | `ready` | `approved_with_disclaimer` | `6` | `7:155` | `/tafsir/942e96db-7f29-4260-b921-e94db0d5f3db` | `/sources?q=mercy&domain=all` |
| `CP21C-ES-002` | `100` | `ready` | `approved_with_disclaimer` | `6` | `2:2` | `/tafsir/8add7e11-c0db-4878-92ef-46dac32d0f66` | `/sources?q=guidance&domain=all` |
| `CP21C-QF-004` | `100` | `ready` | `approved_with_disclaimer` | `6` | `12:110` | `/tafsir/cfb2cfce-26fa-454b-b988-9459b7403c08` | `/sources?q=hope&domain=all` |

## Checks Run

API build:

```powershell
corepack pnpm build:api
```

Runtime restart:

```powershell
scripts\start_phase5_apps.ps1
```

Artifact regeneration:

```powershell
node scripts\collect_cp21c_resource_graphify_evidence.mjs
node scripts\generate_cp21c_resource_graph.mjs
node scripts\generate_cp21c_vault_packs.mjs
node scripts\generate_cp21c_ranking_summary.mjs
```

Combined verifier:

```powershell
node scripts\check_cp21c_resource_graphify.mjs
```

Result:

```json
{
  "status": "pass",
  "graph": {
    "nodeCount": 253,
    "edgeCount": 292
  },
  "rankingSummary": {
    "ordinaryAverageScore": 98.25,
    "ordinaryCaseCount": 20,
    "escalationCaseCount": 3,
    "lowScoringCaseCount": 0,
    "remediationCount": 4
  },
  "publicSafeBoundary": {
    "graphPublicSafeNodeCount": 0,
    "graphPublicSafeEdgeCount": 0,
    "summaryPublicSafe": false,
    "publicReleaseApproved": false
  }
}
```

Runtime check:

```powershell
scripts\check_phase5_runtime.ps1
```

Result: `Status: pass`.

Private UI-facing API proof:

```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:8056/api/private-content/knowledge-graphify/cp21c" -UseBasicParsing
```

Result: endpoint reported `ordinaryAverageScore: 98.25`,
`lowScoringCaseCount: 0`, graph `253` nodes / `292` edges, and
`publicReleaseApproved: false`.

## Boundary

CP21C-R01 improves the private ranking-evidence prototype only.

It is still not:

- the full RAFIQ resource graph;
- a public-safe graph or vault;
- public release approval;
- a replacement for source licensing, content review, scholar review, or
  canonical Supabase/Postgres content.

Bismillah.
