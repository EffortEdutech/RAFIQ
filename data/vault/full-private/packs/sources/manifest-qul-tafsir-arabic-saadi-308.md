---
artifact_id: "vault:source:manifest:qul-tafsir-arabic-saadi-308"
artifact_type: "source_approval_pack"
title: "Source Pack - qul-tafsir-arabic-saadi-308.json"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["data:manifests:data/manifests/qul-tafsir-arabic-saadi-308.json"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:qul-tafsir-arabic-saadi-308", "provenance:source_snapshot:qul-tafsir-arabic-saadi-308:manifest", "release_state:source_snapshot:qul-tafsir-arabic-saadi-308:manifest"]
graph_node_ids: ["manifest:qul-tafsir-arabic-saadi-308"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "warning"
---

# Source Pack - qul-tafsir-arabic-saadi-308.json

## Summary

Private source approval pack for `manifest:qul-tafsir-arabic-saadi-308`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- data:manifests:data/manifests/qul-tafsir-arabic-saadi-308.json

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:qul-tafsir-arabic-saadi-308
- provenance:source_snapshot:qul-tafsir-arabic-saadi-308:manifest
- release_state:source_snapshot:qul-tafsir-arabic-saadi-308:manifest

## Evidence Graph

Graph node IDs:

- manifest:qul-tafsir-arabic-saadi-308

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| manifest:qul-tafsir-arabic-saadi-308 | source_manifest | sources | public_blocked | pending | warning |

| Field | Value |
| --- | --- |
| sourceId | "qul-tafsir-arabic-saadi-308" |
| manifestPath | "data/manifests/qul-tafsir-arabic-saadi-308.json" |
| status | "raw_validated_quality_and_rights_blocked" |
| recordCountExpected | 6236 |
| recordCountActual | 6236 |
| checksumSha256 | "6FF887DD949C48F41D9AAC89B41F8CB7643DC51BC21E975A905167F55E08F07A" |
| rawFilePath | "data/raw/tafsir/ar-tafseer-al-saddi.json" |

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
