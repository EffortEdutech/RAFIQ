---
artifact_id: "vault:source:raw_object:tanzil-translation-ms-basmeih:principal"
artifact_type: "source_approval_pack"
title: "Source Pack - data/raw/translations/tanzil/ms.basmeih.txt"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["ingest:raw_objects:tanzil-translation-ms-basmeih:principal"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:tanzil-translation-ms-basmeih", "provenance:source_snapshot:tanzil-translation-ms-basmeih:manifest", "release_state:source_snapshot:tanzil-translation-ms-basmeih:manifest"]
graph_node_ids: ["raw_object:tanzil-translation-ms-basmeih:principal"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "unverified"
---

# Source Pack - data/raw/translations/tanzil/ms.basmeih.txt

## Summary

Private source approval pack for `raw_object:tanzil-translation-ms-basmeih:principal`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- ingest:raw_objects:tanzil-translation-ms-basmeih:principal

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:tanzil-translation-ms-basmeih
- provenance:source_snapshot:tanzil-translation-ms-basmeih:manifest
- release_state:source_snapshot:tanzil-translation-ms-basmeih:manifest

## Evidence Graph

Graph node IDs:

- raw_object:tanzil-translation-ms-basmeih:principal

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| raw_object:tanzil-translation-ms-basmeih:principal | raw_object | sources | public_blocked | pending | unverified |

| Field | Value |
| --- | --- |
| snapshotId | "tanzil-translation-ms-basmeih" |
| objectRole | "principal" |
| logicalName | "Basmeih Malay Translation" |
| pathOrObjectKey | "data/raw/translations/tanzil/ms.basmeih.txt" |
| checksumSha256 | "51548B7D7C65F36C4B26B58D81C9C994D96869D06577EFB350968968B4AB01B6" |
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
