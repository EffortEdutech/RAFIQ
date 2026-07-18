---
artifact_id: "vault:source:snapshot:qul-ayah-themes-62"
artifact_type: "source_approval_pack"
title: "Source Pack - QUL Ayah Themes"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["ingest:source_snapshots:qul-ayah-themes-62"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "source_manifest", "provenance:source_snapshot:qul-ayah-themes-62:manifest", "release_state:source_snapshot:qul-ayah-themes-62:manifest"]
graph_node_ids: ["snapshot:qul-ayah-themes-62"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "warning"
---

# Source Pack - QUL Ayah Themes

## Summary

Private source approval pack for `snapshot:qul-ayah-themes-62`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- ingest:source_snapshots:qul-ayah-themes-62

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- source_manifest
- provenance:source_snapshot:qul-ayah-themes-62:manifest
- release_state:source_snapshot:qul-ayah-themes-62:manifest

## Evidence Graph

Graph node IDs:

- snapshot:qul-ayah-themes-62

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| snapshot:qul-ayah-themes-62 | source_snapshot | sources | public_blocked | pending | warning |

| Field | Value |
| --- | --- |
| sourceId | "qul" |
| snapshotKey | "qul-ayah-themes-62" |
| versionLabel | "Downloaded 2026-06-12" |
| acquiredAt | "2026-06-12" |
| rightsStatus | "blocked_or_pending" |
| attributionStatus | "unknown" |
| technicalStatus | "raw_validated_quality_and_rights_blocked" |
| publicationStatus | "public_blocked" |
| officialUrl | "https://qul.tarteel.ai/resources/ayah-theme/62" |
| licenseUrl | "https://qul.tarteel.ai/resources/62/copyright" |
| licenseName | "No copyright information supplied by QUL" |
| attribution | "QUL Ayah Themes; original authorship, methodology, and required attribution remain unresolved" |

## Quality And Review State

- Review state: `pending`
- Quality state: `warning`
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
