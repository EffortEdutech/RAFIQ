---
artifact_id: "vault:source:snapshot:tanzil-translation-id-indonesian"
artifact_type: "source_approval_pack"
title: "Source Pack - Bahasa Indonesia Translation"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["ingest:source_snapshots:tanzil-translation-id-indonesian"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "source_manifest", "provenance:source_snapshot:tanzil-translation-id-indonesian:manifest", "release_state:source_snapshot:tanzil-translation-id-indonesian:manifest"]
graph_node_ids: ["snapshot:tanzil-translation-id-indonesian"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "unverified"
---

# Source Pack - Bahasa Indonesia Translation

## Summary

Private source approval pack for `snapshot:tanzil-translation-id-indonesian`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- ingest:source_snapshots:tanzil-translation-id-indonesian

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- source_manifest
- provenance:source_snapshot:tanzil-translation-id-indonesian:manifest
- release_state:source_snapshot:tanzil-translation-id-indonesian:manifest

## Evidence Graph

Graph node IDs:

- snapshot:tanzil-translation-id-indonesian

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| snapshot:tanzil-translation-id-indonesian | source_snapshot | sources | public_blocked | pending | unverified |

| Field | Value |
| --- | --- |
| sourceId | "tanzil" |
| snapshotKey | "tanzil-translation-id-indonesian" |
| versionLabel | "Tanzil update dated 2010-06-04" |
| acquiredAt | "2026-06-11" |
| rightsStatus | "unknown" |
| attributionStatus | "unknown" |
| technicalStatus | "staging_only" |
| publicationStatus | "public_blocked" |
| officialUrl | "https://tanzil.net/trans/" |
| licenseUrl | "https://tanzil.net/trans/" |
| licenseName | "Tanzil translation catalog terms: non-commercial use only unless separate permission is obtained" |
| attribution | "Indonesian Ministry of Religious Affairs; distributed by Tanzil Project, https://tanzil.net/trans/" |

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
