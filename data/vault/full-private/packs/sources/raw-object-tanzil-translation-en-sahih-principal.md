---
artifact_id: "vault:source:raw_object:tanzil-translation-en-sahih:principal"
artifact_type: "source_approval_pack"
title: "Source Pack - data/raw/translations/tanzil/en.sahih.txt"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["ingest:raw_objects:tanzil-translation-en-sahih:principal"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:tanzil-translation-en-sahih", "provenance:source_snapshot:tanzil-translation-en-sahih:manifest", "release_state:source_snapshot:tanzil-translation-en-sahih:manifest"]
graph_node_ids: ["raw_object:tanzil-translation-en-sahih:principal"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "unverified"
---

# Source Pack - data/raw/translations/tanzil/en.sahih.txt

## Summary

Private source approval pack for `raw_object:tanzil-translation-en-sahih:principal`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- ingest:raw_objects:tanzil-translation-en-sahih:principal

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:tanzil-translation-en-sahih
- provenance:source_snapshot:tanzil-translation-en-sahih:manifest
- release_state:source_snapshot:tanzil-translation-en-sahih:manifest

## Evidence Graph

Graph node IDs:

- raw_object:tanzil-translation-en-sahih:principal

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| raw_object:tanzil-translation-en-sahih:principal | raw_object | sources | public_blocked | pending | unverified |

| Field | Value |
| --- | --- |
| snapshotId | "tanzil-translation-en-sahih" |
| objectRole | "principal" |
| logicalName | "Saheeh International English Translation" |
| pathOrObjectKey | "data/raw/translations/tanzil/en.sahih.txt" |
| checksumSha256 | "A1778A1A56695D9B59AE910809EC46D9F4A55F05961DE51CD56E6EBCF9040883" |
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
