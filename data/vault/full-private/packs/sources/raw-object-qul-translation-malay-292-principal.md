---
artifact_id: "vault:source:raw_object:qul-translation-malay-292:principal"
artifact_type: "source_approval_pack"
title: "Source Pack - data/raw/translations/qul/abdullah-basamia-simple.json"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["ingest:raw_objects:qul-translation-malay-292:principal"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:qul-translation-malay-292", "provenance:source_snapshot:qul-translation-malay-292:manifest", "release_state:source_snapshot:qul-translation-malay-292:manifest"]
graph_node_ids: ["raw_object:qul-translation-malay-292:principal"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "clean"
---

# Source Pack - data/raw/translations/qul/abdullah-basamia-simple.json

## Summary

Private source approval pack for `raw_object:qul-translation-malay-292:principal`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- ingest:raw_objects:qul-translation-malay-292:principal

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:qul-translation-malay-292
- provenance:source_snapshot:qul-translation-malay-292:manifest
- release_state:source_snapshot:qul-translation-malay-292:manifest

## Evidence Graph

Graph node IDs:

- raw_object:qul-translation-malay-292:principal

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| raw_object:qul-translation-malay-292:principal | raw_object | sources | public_blocked | pending | clean |

| Field | Value |
| --- | --- |
| snapshotId | "qul-translation-malay-292" |
| objectRole | "principal" |
| logicalName | "QUL Abdullah Basamia Malay Translation" |
| pathOrObjectKey | "data/raw/translations/qul/abdullah-basamia-simple.json" |
| checksumSha256 | "E01351D5826A6D97EAC05FD76ABB9EECC66A331CF86C2C9FADFC667E06E38E9D" |
| byteLength | null |
| mediaType | "Simple JSON and SQLite" |
| parseEligibility | "manifest_registered" |

## Quality And Review State

- Review state: `pending`
- Quality state: `clean`
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
