---
artifact_id: "vault:source:raw_object:qul-tafsir-arabic-saadi-308:principal"
artifact_type: "source_approval_pack"
title: "Source Pack - data/raw/tafsir/ar-tafseer-al-saddi.json"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["ingest:raw_objects:qul-tafsir-arabic-saadi-308:principal"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:qul-tafsir-arabic-saadi-308", "provenance:source_snapshot:qul-tafsir-arabic-saadi-308:manifest", "release_state:source_snapshot:qul-tafsir-arabic-saadi-308:manifest"]
graph_node_ids: ["raw_object:qul-tafsir-arabic-saadi-308:principal"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "warning"
---

# Source Pack - data/raw/tafsir/ar-tafseer-al-saddi.json

## Summary

Private source approval pack for `raw_object:qul-tafsir-arabic-saadi-308:principal`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- ingest:raw_objects:qul-tafsir-arabic-saadi-308:principal

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:qul-tafsir-arabic-saadi-308
- provenance:source_snapshot:qul-tafsir-arabic-saadi-308:manifest
- release_state:source_snapshot:qul-tafsir-arabic-saadi-308:manifest

## Evidence Graph

Graph node IDs:

- raw_object:qul-tafsir-arabic-saadi-308:principal

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| raw_object:qul-tafsir-arabic-saadi-308:principal | raw_object | sources | public_blocked | pending | warning |

| Field | Value |
| --- | --- |
| snapshotId | "qul-tafsir-arabic-saadi-308" |
| objectRole | "principal" |
| logicalName | "QUL Arabic Tafsir As-Saadi" |
| pathOrObjectKey | "data/raw/tafsir/ar-tafseer-al-saddi.json" |
| checksumSha256 | "DFE6DB95A2AF4A3D22524A30F3D54CE4A7741D5937064FF7A8EDDECCFC1A098A" |
| byteLength | null |
| mediaType | "JSON and SQLite" |
| parseEligibility | "manifest_registered" |

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
