---
artifact_id: "vault:source:snapshot:tanzil-quran-uthmani-v1.1"
artifact_type: "source_approval_pack"
title: "Source Pack - Tanzil Quran Text - Uthmani"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["ingest:source_snapshots:tanzil-quran-uthmani-v1.1"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "source_manifest", "provenance:source_snapshot:tanzil-quran-uthmani-v1.1:manifest", "release_state:source_snapshot:tanzil-quran-uthmani-v1.1:manifest"]
graph_node_ids: ["snapshot:tanzil-quran-uthmani-v1.1"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "unverified"
---

# Source Pack - Tanzil Quran Text - Uthmani

## Summary

Private source approval pack for `snapshot:tanzil-quran-uthmani-v1.1`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- ingest:source_snapshots:tanzil-quran-uthmani-v1.1

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- source_manifest
- provenance:source_snapshot:tanzil-quran-uthmani-v1.1:manifest
- release_state:source_snapshot:tanzil-quran-uthmani-v1.1:manifest

## Evidence Graph

Graph node IDs:

- snapshot:tanzil-quran-uthmani-v1.1

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| snapshot:tanzil-quran-uthmani-v1.1 | source_snapshot | sources | public_blocked | pending | unverified |

| Field | Value |
| --- | --- |
| sourceId | "tanzil" |
| snapshotKey | "tanzil-quran-uthmani-v1.1" |
| versionLabel | "1.1" |
| acquiredAt | "2026-06-10" |
| rightsStatus | "unknown" |
| attributionStatus | "unknown" |
| technicalStatus | "staging_only" |
| publicationStatus | "public_blocked" |
| officialUrl | "https://tanzil.net/download/" |
| licenseUrl | "https://tanzil.net/docs/Text_License" |
| licenseName | "Creative Commons Attribution 3.0 with Tanzil text terms" |
| attribution | "Tanzil Quran Text, Tanzil Project, https://tanzil.net" |

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
