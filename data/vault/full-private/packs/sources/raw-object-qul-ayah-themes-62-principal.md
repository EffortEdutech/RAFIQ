---
artifact_id: "vault:source:raw_object:qul-ayah-themes-62:principal"
artifact_type: "source_approval_pack"
title: "Source Pack - data/raw/tafsir/ayah-themes.db"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["ingest:raw_objects:qul-ayah-themes-62:principal"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:qul-ayah-themes-62", "provenance:source_snapshot:qul-ayah-themes-62:manifest", "release_state:source_snapshot:qul-ayah-themes-62:manifest"]
graph_node_ids: ["raw_object:qul-ayah-themes-62:principal"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "warning"
---

# Source Pack - data/raw/tafsir/ayah-themes.db

## Summary

Private source approval pack for `raw_object:qul-ayah-themes-62:principal`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- ingest:raw_objects:qul-ayah-themes-62:principal

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:qul-ayah-themes-62
- provenance:source_snapshot:qul-ayah-themes-62:manifest
- release_state:source_snapshot:qul-ayah-themes-62:manifest

## Evidence Graph

Graph node IDs:

- raw_object:qul-ayah-themes-62:principal

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| raw_object:qul-ayah-themes-62:principal | raw_object | sources | public_blocked | pending | warning |

| Field | Value |
| --- | --- |
| snapshotId | "qul-ayah-themes-62" |
| objectRole | "principal" |
| logicalName | "QUL Ayah Themes" |
| pathOrObjectKey | "data/raw/tafsir/ayah-themes.db" |
| checksumSha256 | "B3C20C4FAB472586904543ED12C87E2AC616CE629AC18A125357408E50927A42" |
| byteLength | null |
| mediaType | "SQLite" |
| parseEligibility | "manifest_registered" |

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
