---
artifact_id: "vault:source:raw_object:qul-topics-45:principal"
artifact_type: "source_approval_pack"
title: "Source Pack - data/raw/tafsir/topics.db"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["ingest:raw_objects:qul-topics-45:principal"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:qul-topics-45", "provenance:source_snapshot:qul-topics-45:manifest", "release_state:source_snapshot:qul-topics-45:manifest"]
graph_node_ids: ["raw_object:qul-topics-45:principal"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "clean"
---

# Source Pack - data/raw/tafsir/topics.db

## Summary

Private source approval pack for `raw_object:qul-topics-45:principal`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- ingest:raw_objects:qul-topics-45:principal

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:qul-topics-45
- provenance:source_snapshot:qul-topics-45:manifest
- release_state:source_snapshot:qul-topics-45:manifest

## Evidence Graph

Graph node IDs:

- raw_object:qul-topics-45:principal

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| raw_object:qul-topics-45:principal | raw_object | sources | public_blocked | pending | clean |

| Field | Value |
| --- | --- |
| snapshotId | "qul-topics-45" |
| objectRole | "principal" |
| logicalName | "QUL Topics and Concepts" |
| pathOrObjectKey | "data/raw/tafsir/topics.db" |
| checksumSha256 | "1190772E8735965A8035B3F886C2F44CAB04A204352F16EDCE59B7A5ACF760AD" |
| byteLength | null |
| mediaType | "SQLite" |
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
