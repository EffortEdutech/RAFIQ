---
artifact_id: "vault:source:snapshot:qul-tafsir-arabic-saadi-308"
artifact_type: "source_approval_pack"
title: "Source Pack - QUL Arabic Tafsir As-Saadi"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["ingest:source_snapshots:qul-tafsir-arabic-saadi-308"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "source_manifest", "provenance:source_snapshot:qul-tafsir-arabic-saadi-308:manifest", "release_state:source_snapshot:qul-tafsir-arabic-saadi-308:manifest"]
graph_node_ids: ["snapshot:qul-tafsir-arabic-saadi-308"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "warning"
---

# Source Pack - QUL Arabic Tafsir As-Saadi

## Summary

Private source approval pack for `snapshot:qul-tafsir-arabic-saadi-308`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- ingest:source_snapshots:qul-tafsir-arabic-saadi-308

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- source_manifest
- provenance:source_snapshot:qul-tafsir-arabic-saadi-308:manifest
- release_state:source_snapshot:qul-tafsir-arabic-saadi-308:manifest

## Evidence Graph

Graph node IDs:

- snapshot:qul-tafsir-arabic-saadi-308

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| snapshot:qul-tafsir-arabic-saadi-308 | source_snapshot | sources | public_blocked | pending | warning |

| Field | Value |
| --- | --- |
| sourceId | "qul" |
| snapshotKey | "qul-tafsir-arabic-saadi-308" |
| versionLabel | "Downloaded 2026-06-12" |
| acquiredAt | "2026-06-12" |
| rightsStatus | "blocked_or_pending" |
| attributionStatus | "unknown" |
| technicalStatus | "raw_validated_quality_and_rights_blocked" |
| publicationStatus | "public_blocked" |
| officialUrl | "https://qul.tarteel.ai/resources/tafsir/308" |
| licenseUrl | "https://qul.tarteel.ai/resources/308/copyright" |
| licenseName | "No copyright information supplied by QUL" |
| attribution | "Arabic Tafsir As-Saadi; exact edition, publisher, and required attribution remain unresolved" |

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
