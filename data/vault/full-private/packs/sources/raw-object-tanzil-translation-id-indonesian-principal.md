---
artifact_id: "vault:source:raw_object:tanzil-translation-id-indonesian:principal"
artifact_type: "source_approval_pack"
title: "Source Pack - data/raw/translations/tanzil/id.indonesian.txt"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["ingest:raw_objects:tanzil-translation-id-indonesian:principal"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:tanzil-translation-id-indonesian", "provenance:source_snapshot:tanzil-translation-id-indonesian:manifest", "release_state:source_snapshot:tanzil-translation-id-indonesian:manifest"]
graph_node_ids: ["raw_object:tanzil-translation-id-indonesian:principal"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "unverified"
---

# Source Pack - data/raw/translations/tanzil/id.indonesian.txt

## Summary

Private source approval pack for `raw_object:tanzil-translation-id-indonesian:principal`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- ingest:raw_objects:tanzil-translation-id-indonesian:principal

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:tanzil-translation-id-indonesian
- provenance:source_snapshot:tanzil-translation-id-indonesian:manifest
- release_state:source_snapshot:tanzil-translation-id-indonesian:manifest

## Evidence Graph

Graph node IDs:

- raw_object:tanzil-translation-id-indonesian:principal

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| raw_object:tanzil-translation-id-indonesian:principal | raw_object | sources | public_blocked | pending | unverified |

| Field | Value |
| --- | --- |
| snapshotId | "tanzil-translation-id-indonesian" |
| objectRole | "principal" |
| logicalName | "Bahasa Indonesia Translation" |
| pathOrObjectKey | "data/raw/translations/tanzil/id.indonesian.txt" |
| checksumSha256 | "70428E875C50C3C42D3829654D2BD386E146F0FA68CC20C34FDD4EA3B53E21A8" |
| byteLength | null |
| mediaType | "pipe-delimited UTF-8 text" |
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
