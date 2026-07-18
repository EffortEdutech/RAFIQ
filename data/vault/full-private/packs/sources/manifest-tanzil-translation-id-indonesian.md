---
artifact_id: "vault:source:manifest:tanzil-translation-id-indonesian"
artifact_type: "source_approval_pack"
title: "Source Pack - tanzil-translation-id-indonesian.json"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["data:manifests:data/manifests/tanzil-translation-id-indonesian.json"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:tanzil-translation-id-indonesian", "provenance:source_snapshot:tanzil-translation-id-indonesian:manifest", "release_state:source_snapshot:tanzil-translation-id-indonesian:manifest"]
graph_node_ids: ["manifest:tanzil-translation-id-indonesian"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "unverified"
---

# Source Pack - tanzil-translation-id-indonesian.json

## Summary

Private source approval pack for `manifest:tanzil-translation-id-indonesian`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- data:manifests:data/manifests/tanzil-translation-id-indonesian.json

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:tanzil-translation-id-indonesian
- provenance:source_snapshot:tanzil-translation-id-indonesian:manifest
- release_state:source_snapshot:tanzil-translation-id-indonesian:manifest

## Evidence Graph

Graph node IDs:

- manifest:tanzil-translation-id-indonesian

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| manifest:tanzil-translation-id-indonesian | source_manifest | sources | public_blocked | pending | unverified |

| Field | Value |
| --- | --- |
| sourceId | "tanzil-translation-id-indonesian" |
| manifestPath | "data/manifests/tanzil-translation-id-indonesian.json" |
| status | "staging_only" |
| recordCountExpected | 6236 |
| recordCountActual | 6236 |
| checksumSha256 | "2D3F762E002E815E7C500D06D70CD49DE29CF9F889BEFE8D147EB0AF5D02DF7B" |
| rawFilePath | "data/raw/translations/tanzil/id.indonesian.txt" |

## Quality And Review State

- Review state: `pending`
- Quality state: `unverified`
- Release state: `public_blocked`
- Public safe: `false`



## Release Boundary

This pack is private-local and developer-private. It must not be exposed through
public RAFIQ routes, public APIs, or public vault exports without a separate
release approval plan.

## Open Questions Or Blockers

- Source node is not public safe.
- Vault packs are review/navigation artifacts only and must not be treated as canonical source data.
- Public-safe status remains false until source licensing, attribution, editorial, and scholar review gates approve release.
