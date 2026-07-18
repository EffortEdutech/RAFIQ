# CP22-G08 - Internal UI Report

Date: 2026-07-12

Status: Complete

Scope: Add a private RAFIQ internal UI for inspecting the CP22 full private
resource graph and vault packs.

## Summary

CP22-G08 upgrades the internal Knowledge Graphify cockpit from a CP21C-only
prototype screen into a CP22 full-private graph and vault inspection screen.

The UI remains private and internal:

- it is served under the existing internal route `/knowledge-graphify`;
- it calls the private API endpoint
  `/api/private-content/knowledge-graphify/cp22`;
- it shows bounded summaries and samples, not every graph node;
- it keeps public-safe and public-release status visible;
- it does not expose CP22 artifacts through public RAFIQ routes.

## Implemented Files

Shared contract:

```text
packages/shared/src/private-content.ts
```

API endpoint:

```text
apps/api/src/modules/private-content/private-content.controller.ts
apps/api/src/modules/private-content/private-content.service.ts
apps/api/src/modules/private-content/private-content.openapi.ts
```

Mobile UI:

```text
apps/mobile/src/services/privateContentApi.ts
apps/mobile/app/knowledge-graphify.tsx
```

## UI Capabilities

The internal cockpit includes:

- graph/vault summary cards;
- CP22 graph and vault verification proof;
- partition selector for all full-private graph partitions;
- node sample list per partition;
- node detail panel with canonical refs, source refs, provenance refs, release
  refs, metadata, review state, quality state, release state, and public-safe
  state;
- edge detail panel for sampled edges;
- source/provenance panel within node detail;
- ayah, hadith, source, and topic lookup path section;
- vault pack index and private Markdown preview;
- release-state and quality-state filters;
- always-visible private/public boundary warning.

## Payload Boundary

The CP22 API response intentionally returns bounded inspection data:

- partition summaries;
- sampled nodes and edges per partition;
- aggregate type/release/review/quality counts;
- lookup path examples from graph indexes;
- sampled vault pack previews.

It does not return the full 79,657-node graph to the mobile UI.

## API Smoke Proof

Direct built-service payload proof:

```json
{
  "checkpoint": "CP22-G08",
  "graphNodes": 79657,
  "graphEdges": 147689,
  "partitions": 11,
  "vaultPacks": 158,
  "sampledPacks": 48,
  "lookupPaths": 27,
  "publicSafeNodes": 0,
  "publicSafePacks": 0,
  "firstPartition": "cp21c-reference"
}
```

## Verification Commands

Commands run:

```powershell
corepack pnpm build:shared
corepack pnpm build:api
corepack pnpm build:mobile:web
node scripts/check_cp22_guidance_evidence_graph.mjs
node scripts/check_cp22_vault_packs.mjs
.\scripts\graphify.ps1 update .
```

All CP22-G08 commands passed.

Graphify refresh result:

```text
Rebuilt: 6649 nodes, 7923 edges, 805 communities.
graph.json and GRAPH_REPORT.md updated in graphify-out.
graph.html skipped because the graph is above the 5000-node HTML visualization limit.
```

## Governance Boundary

CP22-G08 remains internal-only:

- `publicSafeNodes`: `0`
- `publicSafeEdges`: `0`
- `publicSafePacks`: `0`
- public release approved: `false`

The UI is for developer inspection, review, debugging, and product-owner
validation. It must not be treated as a public user-facing Islamic content
surface.

## Next Checkpoint

Recommended next checkpoint:

```text
CP22-G09 - Combined Verification
```

The next verifier should cover the full private graph, vault artifacts, UI
payload boundaries, public-safe metadata, source/provenance coverage, and
release-state rules in one command.
