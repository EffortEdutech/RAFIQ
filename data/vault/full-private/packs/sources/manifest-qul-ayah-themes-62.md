---
artifact_id: "vault:source:manifest:qul-ayah-themes-62"
artifact_type: "source_approval_pack"
title: "Source Pack - qul-ayah-themes-62.json"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["data:manifests:data/manifests/qul-ayah-themes-62.json"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:qul-ayah-themes-62", "provenance:source_snapshot:qul-ayah-themes-62:manifest", "release_state:source_snapshot:qul-ayah-themes-62:manifest"]
graph_node_ids: ["manifest:qul-ayah-themes-62"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "warning"
---

# Source Pack - qul-ayah-themes-62.json

## Summary

Private source approval pack for `manifest:qul-ayah-themes-62`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- data:manifests:data/manifests/qul-ayah-themes-62.json

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:qul-ayah-themes-62
- provenance:source_snapshot:qul-ayah-themes-62:manifest
- release_state:source_snapshot:qul-ayah-themes-62:manifest

## Evidence Graph

Graph node IDs:

- manifest:qul-ayah-themes-62

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| manifest:qul-ayah-themes-62 | source_manifest | sources | public_blocked | pending | warning |

| Field | Value |
| --- | --- |
| sourceId | "qul-ayah-themes-62" |
| manifestPath | "data/manifests/qul-ayah-themes-62.json" |
| status | "raw_validated_quality_and_rights_blocked" |
| recordCountExpected | 1049 |
| recordCountActual | 2098 |
| checksumSha256 | "080BA8140363C30CC92CE0B526FC0A0BBEA6267ADA8A6AC5D4102D29F6F8BC81" |
| rawFilePath | "data/raw/tafsir/ayah-themes.db" |

## Quality And Review State

- Review state: `pending`
- Quality state: `warning`
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
