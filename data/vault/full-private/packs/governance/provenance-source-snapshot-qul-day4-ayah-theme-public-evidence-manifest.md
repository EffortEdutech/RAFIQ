---
artifact_id: "vault:governance:provenance:source_snapshot:qul-day4-ayah-theme-public-evidence:manifest"
artifact_type: "release_gate_pack"
title: "Governance Pack - source_snapshot qul-day4-ayah-theme-public-evidence manifest provenance"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["manifest:source_manifest:data/manifests/qul-day4-ayah-theme-public-evidence.json"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "source:qul", "snapshot:qul-day4-ayah-theme-public-evidence"]
graph_node_ids: ["provenance:source_snapshot:qul-day4-ayah-theme-public-evidence:manifest"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "unverified"
---

# Governance Pack - source_snapshot qul-day4-ayah-theme-public-evidence manifest provenance

## Summary

Private governance pack for `provenance:source_snapshot:qul-day4-ayah-theme-public-evidence:manifest`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- manifest:source_manifest:data/manifests/qul-day4-ayah-theme-public-evidence.json

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- source:qul
- snapshot:qul-day4-ayah-theme-public-evidence

## Evidence Graph

Graph node IDs:

- provenance:source_snapshot:qul-day4-ayah-theme-public-evidence:manifest

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| provenance:source_snapshot:qul-day4-ayah-theme-public-evidence:manifest | entity_provenance | governance | public_blocked | pending | unverified |

| Field | Value |
| --- | --- |
| entityType | "source_snapshot" |
| entityId | "qul-day4-ayah-theme-public-evidence" |
| stagingTable | null |
| stagingId | null |
| sourceSnapshotId | "qul-day4-ayah-theme-public-evidence" |
| mappingMethod | "manifest_backbone_export" |
| manifestPath | "data/manifests/qul-day4-ayah-theme-public-evidence.json" |
| sourceManifestChecksumSha256 | "C51AB5E7FC942200FB547D217524C1F72405315EF1110B42178FA0E93C22F9A0" |

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

- Governance pack preserves release blockers rather than clearing them.
- Vault packs are review/navigation artifacts only and must not be treated as canonical source data.
- Public-safe status remains false until source licensing, attribution, editorial, and scholar review gates approve release.
