# CP21C - Private Graphify UI Test Report

Date: 2026-07-10
Status: Pass

Update: CP21C-R01 and the internal explorer upgrade are now reflected in this
screen. Current verified state is `98.25` ordinary average, zero low-scoring
ordinary cases, 253 graph nodes, and 292 graph edges.

## Objective

Expose and verify the CP21C RAFIQ Product Knowledge Graphify output in the
current private RAFIQ UI/UX.

This is an internal review surface only. It is not a public feature and does
not make CP21C the full RAFIQ resource graph.

## Implemented

- Added private API endpoint:

```text
GET /api/private-content/knowledge-graphify/cp21c
```

- Added private mobile/web route:

```text
/knowledge-graphify
```

- Added internal navigation item:

```text
Graphify
```

The screen displays:

- verifier proof command and pass status;
- matrix case counts;
- graph node/edge counts;
- vault pack count;
- ordinary average score;
- case detail explorer;
- connected graph node and edge samples;
- graph node type counts;
- selected vault pack preview;
- low-scoring cases;
- remediation preview;
- private/public boundary warnings;
- artifact paths for matrix, evidence, graph, vault packs, and ranking summary.

## Proof Command

The backend verifier still passes:

```powershell
node scripts\check_cp21c_resource_graphify.mjs
```

Verified result:

```json
{
  "status": "pass",
  "matrix": {
    "caseCount": 23,
    "ordinaryCaseCount": 20,
    "escalationCaseCount": 3
  },
  "graph": {
    "nodeCount": 253,
    "edgeCount": 292
  },
  "vault": {
    "packCount": 23,
    "publicSafeCount": 0
  },
  "rankingSummary": {
    "ordinaryAverageScore": 98.25,
    "lowScoringCaseCount": 0,
    "remediationCount": 4
  }
}
```

## API Verification

Command:

```powershell
Invoke-WebRequest -Uri http://127.0.0.1:8056/api/private-content/knowledge-graphify/cp21c -UseBasicParsing
```

Verified response includes:

- `verifier.status: pass`;
- `matrix.caseCount: 23`;
- `graph.nodeCount: 253`;
- `graph.edgeCount: 292`;
- `vault.packCount: 23`;
- `rankingSummary.ordinaryAverageScore: 98.25`;
- `rankingSummary.lowScoringCaseCount: 0`;
- `caseExplorer.length: 23`;
- `vaultExplorer.packs.length: 23`;
- `publicSafeBoundary.publicReleaseApproved: false`.

## UI Verification

Route:

```text
http://127.0.0.1:8057/knowledge-graphify
```

Browser verification confirmed visible text:

- `CP21C verification cockpit`;
- `node scripts\check_cp21c_resource_graphify.mjs -> PASS`;
- `98.25`;
- `Ranking Case Inspector`;
- `Connected Graph Nodes`;
- `Vault Pack Preview`;
- `Graph Node Types`;
- `No low-scoring ordinary cases after CP21C-R01`;
- `NOT FULL RESOURCE GRAPH`;
- `PUBLIC SAFE FALSE`.

Interaction verification confirmed selecting `CP21C-ES-001` displays:

- `I feel guilty and want to make tawbah`;
- `ask:Tawbah`;
- `/sources?q=mercy&domain=all`;
- `CP21C Ranking Case CP21C-ES-001`.

Browser console errors:

```text
none
```

## Boundary

This screen is for developer/private review only.

It must not be exposed as a public RAFIQ route. It must not be treated as:

- public release approval;
- the full RAFIQ resource graph;
- a replacement for source, scholar, or content review.

Bismillah.
