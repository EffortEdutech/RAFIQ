---
artifact_id: "vault:cp27:source-group:source_registry"
artifact_type: "source_group_review_pack"
title: "CP27 Source Group Pack - source_registry"
category: "source-groups"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-17T00:00:00.000Z"
generated_by: "scripts/generate_cp27_g04_vault_packs.mjs"
source_graph_id: "rafiq-cp27-refresh-private-resource-graph"
source_graph_checkpoint: "CP27-G03"
canonical_refs: ["snapshot_group:source_registry", "snapshot_group:source_registry:edge_family:source_snapshot_to_checksum", "snapshot_group:source_registry:edge_family:source_snapshot_to_release_state", "snapshot_group:source_registry:licensing_boundary", "snapshot_group:source_registry:source_checksum", "snapshot_group:source_registry:source_registry_entry", "snapshot_group:source_registry:attribution_policy", "snapshot_group:source_registry:edge_family:source_registry_entry_to_manifest", "snapshot_group:source_registry:edge_family:source_snapshot_to_provenance", "snapshot_group:source_registry:edge_family:source_to_licensing_boundary", "snapshot_group:source_registry:source_manifest", "snapshot_group:source_registry:source_snapshot"]
source_refs: ["graph_manifest:rafiq-cp27-refresh-private-resource-graph", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/source-registry.snapshot.json", "cp26:s03:snapshot:source_registry", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json"]
graph_node_ids: ["cp27:governance:source_registry:edge_family:source_snapshot_to_checksum", "cp27:governance:source_registry:edge_family:source_snapshot_to_release_state", "cp27:governance:source_registry:licensing_boundary:licensing_boundary", "cp27:governance:source_registry:snapshot_group:source_registry", "cp27:governance:source_registry:source_checksum:source_checksum", "cp27:governance:source_registry:source_registry_entry:source_registry_entry", "cp27:sources:source_registry:attribution_policy:attribution_policy", "cp27:sources:source_registry:edge_family:source_registry_entry_to_manifest", "cp27:sources:source_registry:edge_family:source_snapshot_to_provenance", "cp27:sources:source_registry:edge_family:source_to_licensing_boundary", "cp27:sources:source_registry:snapshot_group:source_registry", "cp27:sources:source_registry:source_manifest:source_manifest", "cp27:sources:source_registry:source_snapshot:source_snapshot"]
release_states: ["private_blocked"]
quality_states: ["private_reviewed"]
raw_text_bodies_exported: false
public_release_approved: false
---

# CP27 Source Group Pack - source_registry

## Summary

Review pack for CP26 snapshot source group `source_registry` mapped into the CP27 refreshed graph.

This is a generated private RAFIQ Knowledge Vault artifact for the CP27 refreshed graph. It is a review and navigation pack, not canonical source data, not source text, and not public release approval.

## Graph Links

- cp27:governance:source_registry:edge_family:source_snapshot_to_checksum
- cp27:governance:source_registry:edge_family:source_snapshot_to_release_state
- cp27:governance:source_registry:licensing_boundary:licensing_boundary
- cp27:governance:source_registry:snapshot_group:source_registry
- cp27:governance:source_registry:source_checksum:source_checksum
- cp27:governance:source_registry:source_registry_entry:source_registry_entry
- cp27:sources:source_registry:attribution_policy:attribution_policy
- cp27:sources:source_registry:edge_family:source_registry_entry_to_manifest
- cp27:sources:source_registry:edge_family:source_snapshot_to_provenance
- cp27:sources:source_registry:edge_family:source_to_licensing_boundary
- cp27:sources:source_registry:snapshot_group:source_registry
- cp27:sources:source_registry:source_manifest:source_manifest
- cp27:sources:source_registry:source_snapshot:source_snapshot

## Canonical References

- snapshot_group:source_registry
- snapshot_group:source_registry:edge_family:source_snapshot_to_checksum
- snapshot_group:source_registry:edge_family:source_snapshot_to_release_state
- snapshot_group:source_registry:licensing_boundary
- snapshot_group:source_registry:source_checksum
- snapshot_group:source_registry:source_registry_entry
- snapshot_group:source_registry:attribution_policy
- snapshot_group:source_registry:edge_family:source_registry_entry_to_manifest
- snapshot_group:source_registry:edge_family:source_snapshot_to_provenance
- snapshot_group:source_registry:edge_family:source_to_licensing_boundary
- snapshot_group:source_registry:source_manifest
- snapshot_group:source_registry:source_snapshot

## Source And Attribution

- graph_manifest:rafiq-cp27-refresh-private-resource-graph
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/source-registry.snapshot.json
- cp26:s03:snapshot:source_registry
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json

## Details

| Signal | Value |
| --- | --- |
| linkedNodes | 13 |
| qualityWarnings | 0 |
| unresolvedReferences | 0 |
| baselineComparisonMode | matched |

## Release Boundary

- Public safe: `false`
- Public release approved: `false`
- Raw text bodies exported: `false`
- CP22 vault baseline overwritten: `false`

## Blockers

- Raw text bodies are not exported.
- Source group remains private even when reviewed.
- Public release remains blocked.
- Vault packs are generated review/navigation artifacts only.
