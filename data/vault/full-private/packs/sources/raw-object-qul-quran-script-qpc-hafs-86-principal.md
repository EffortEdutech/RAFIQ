---
artifact_id: "vault:source:raw_object:qul-quran-script-qpc-hafs-86:principal"
artifact_type: "source_approval_pack"
title: "Source Pack - data/raw/quran/qul/qpc-hafs.json"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["ingest:raw_objects:qul-quran-script-qpc-hafs-86:principal"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:qul-quran-script-qpc-hafs-86", "provenance:source_snapshot:qul-quran-script-qpc-hafs-86:manifest", "release_state:source_snapshot:qul-quran-script-qpc-hafs-86:manifest"]
graph_node_ids: ["raw_object:qul-quran-script-qpc-hafs-86:principal"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "clean"
---

# Source Pack - data/raw/quran/qul/qpc-hafs.json

## Summary

Private source approval pack for `raw_object:qul-quran-script-qpc-hafs-86:principal`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- ingest:raw_objects:qul-quran-script-qpc-hafs-86:principal

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:qul-quran-script-qpc-hafs-86
- provenance:source_snapshot:qul-quran-script-qpc-hafs-86:manifest
- release_state:source_snapshot:qul-quran-script-qpc-hafs-86:manifest

## Evidence Graph

Graph node IDs:

- raw_object:qul-quran-script-qpc-hafs-86:principal

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| raw_object:qul-quran-script-qpc-hafs-86:principal | raw_object | sources | public_blocked | pending | clean |

| Field | Value |
| --- | --- |
| snapshotId | "qul-quran-script-qpc-hafs-86" |
| objectRole | "principal" |
| logicalName | "QUL QPC Hafs Ayah by Ayah" |
| pathOrObjectKey | "data/raw/quran/qul/qpc-hafs.json" |
| checksumSha256 | "93864197A949DAC54F324875F41348875455BB138B7ABDFDE43DAEFE87230403" |
| byteLength | null |
| mediaType | "JSON and SQLite" |
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
