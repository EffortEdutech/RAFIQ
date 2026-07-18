---
artifact_id: "vault:source:raw_object:tanzil-quran-metadata-v1.0:principal"
artifact_type: "source_approval_pack"
title: "Source Pack - data/raw/quran/tanzil/quran-data.xml"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["ingest:raw_objects:tanzil-quran-metadata-v1.0:principal"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:tanzil-quran-metadata-v1.0", "provenance:source_snapshot:tanzil-quran-metadata-v1.0:manifest", "release_state:source_snapshot:tanzil-quran-metadata-v1.0:manifest"]
graph_node_ids: ["raw_object:tanzil-quran-metadata-v1.0:principal"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "unverified"
---

# Source Pack - data/raw/quran/tanzil/quran-data.xml

## Summary

Private source approval pack for `raw_object:tanzil-quran-metadata-v1.0:principal`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- ingest:raw_objects:tanzil-quran-metadata-v1.0:principal

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:tanzil-quran-metadata-v1.0
- provenance:source_snapshot:tanzil-quran-metadata-v1.0:manifest
- release_state:source_snapshot:tanzil-quran-metadata-v1.0:manifest

## Evidence Graph

Graph node IDs:

- raw_object:tanzil-quran-metadata-v1.0:principal

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| raw_object:tanzil-quran-metadata-v1.0:principal | raw_object | sources | public_blocked | pending | unverified |

| Field | Value |
| --- | --- |
| snapshotId | "tanzil-quran-metadata-v1.0" |
| objectRole | "principal" |
| logicalName | "Tanzil Quran Metadata" |
| pathOrObjectKey | "data/raw/quran/tanzil/quran-data.xml" |
| checksumSha256 | "8867C1D88191472ADEC9DB694B3CD9F135B1A2EF580574D32CF888DCB22C5C7A" |
| byteLength | null |
| mediaType | "XML" |
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
