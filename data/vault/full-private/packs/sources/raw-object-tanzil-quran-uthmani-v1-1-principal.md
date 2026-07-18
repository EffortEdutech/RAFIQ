---
artifact_id: "vault:source:raw_object:tanzil-quran-uthmani-v1.1:principal"
artifact_type: "source_approval_pack"
title: "Source Pack - data/raw/quran/tanzil/quran-uthmani-with-ayah-numbers.txt"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["ingest:raw_objects:tanzil-quran-uthmani-v1.1:principal"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:tanzil-quran-uthmani-v1.1", "provenance:source_snapshot:tanzil-quran-uthmani-v1.1:manifest", "release_state:source_snapshot:tanzil-quran-uthmani-v1.1:manifest"]
graph_node_ids: ["raw_object:tanzil-quran-uthmani-v1.1:principal"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "unverified"
---

# Source Pack - data/raw/quran/tanzil/quran-uthmani-with-ayah-numbers.txt

## Summary

Private source approval pack for `raw_object:tanzil-quran-uthmani-v1.1:principal`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- ingest:raw_objects:tanzil-quran-uthmani-v1.1:principal

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:tanzil-quran-uthmani-v1.1
- provenance:source_snapshot:tanzil-quran-uthmani-v1.1:manifest
- release_state:source_snapshot:tanzil-quran-uthmani-v1.1:manifest

## Evidence Graph

Graph node IDs:

- raw_object:tanzil-quran-uthmani-v1.1:principal

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| raw_object:tanzil-quran-uthmani-v1.1:principal | raw_object | sources | public_blocked | pending | unverified |

| Field | Value |
| --- | --- |
| snapshotId | "tanzil-quran-uthmani-v1.1" |
| objectRole | "principal" |
| logicalName | "Tanzil Quran Text - Uthmani" |
| pathOrObjectKey | "data/raw/quran/tanzil/quran-uthmani-with-ayah-numbers.txt" |
| checksumSha256 | "18C719BB3BA26D32EF457F40DAD77CD28C4C5A34156833E26A8E5FCFDD246FB1" |
| byteLength | null |
| mediaType | "pipe-delimited text" |
| parseEligibility | "manifest_registered" |

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
