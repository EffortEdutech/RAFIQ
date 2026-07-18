---
artifact_id: "vault:cp27:source-group:graph_vault_baseline"
artifact_type: "source_group_review_pack"
title: "CP27 Source Group Pack - graph_vault_baseline"
category: "source-groups"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-17T00:00:00.000Z"
generated_by: "scripts/generate_cp27_g04_vault_packs.mjs"
source_graph_id: "rafiq-cp27-refresh-private-resource-graph"
source_graph_checkpoint: "CP27-G03"
canonical_refs: ["snapshot_group:graph_vault_baseline", "snapshot_group:graph_vault_baseline:baseline_graph_manifest", "snapshot_group:graph_vault_baseline:baseline_graph_partition", "snapshot_group:graph_vault_baseline:baseline_vault_artifact", "snapshot_group:graph_vault_baseline:edge_family:baseline_graph_manifest_to_partition", "snapshot_group:graph_vault_baseline:edge_family:baseline_to_refresh_mapper", "snapshot_group:graph_vault_baseline:edge_family:baseline_vault_manifest_to_artifact", "snapshot_group:graph_vault_baseline:baseline_graph_index", "snapshot_group:graph_vault_baseline:baseline_vault_manifest", "snapshot_group:graph_vault_baseline:edge_family:baseline_graph_manifest_to_index", "snapshot_group:graph_vault_baseline:edge_family:baseline_to_snapshot_batch"]
source_refs: ["graph_manifest:rafiq-cp27-refresh-private-resource-graph", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/graph-vault-baseline.snapshot.json", "cp26:s03:snapshot:graph_vault_baseline", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json"]
graph_node_ids: ["cp27:governance:graph_vault_baseline:baseline_graph_manifest:baseline_graph_manifest", "cp27:governance:graph_vault_baseline:baseline_graph_partition:baseline_graph_partition", "cp27:governance:graph_vault_baseline:baseline_vault_artifact:baseline_vault_artifact", "cp27:governance:graph_vault_baseline:edge_family:baseline_graph_manifest_to_partition", "cp27:governance:graph_vault_baseline:edge_family:baseline_to_refresh_mapper", "cp27:governance:graph_vault_baseline:edge_family:baseline_vault_manifest_to_artifact", "cp27:governance:graph_vault_baseline:snapshot_group:graph_vault_baseline", "cp27:sources:graph_vault_baseline:baseline_graph_index:baseline_graph_index", "cp27:sources:graph_vault_baseline:baseline_vault_manifest:baseline_vault_manifest", "cp27:sources:graph_vault_baseline:edge_family:baseline_graph_manifest_to_index", "cp27:sources:graph_vault_baseline:edge_family:baseline_to_snapshot_batch", "cp27:sources:graph_vault_baseline:snapshot_group:graph_vault_baseline"]
release_states: ["private_blocked"]
quality_states: ["private_reviewed"]
raw_text_bodies_exported: false
public_release_approved: false
---

# CP27 Source Group Pack - graph_vault_baseline

## Summary

Review pack for CP26 snapshot source group `graph_vault_baseline` mapped into the CP27 refreshed graph.

This is a generated private RAFIQ Knowledge Vault artifact for the CP27 refreshed graph. It is a review and navigation pack, not canonical source data, not source text, and not public release approval.

## Graph Links

- cp27:governance:graph_vault_baseline:baseline_graph_manifest:baseline_graph_manifest
- cp27:governance:graph_vault_baseline:baseline_graph_partition:baseline_graph_partition
- cp27:governance:graph_vault_baseline:baseline_vault_artifact:baseline_vault_artifact
- cp27:governance:graph_vault_baseline:edge_family:baseline_graph_manifest_to_partition
- cp27:governance:graph_vault_baseline:edge_family:baseline_to_refresh_mapper
- cp27:governance:graph_vault_baseline:edge_family:baseline_vault_manifest_to_artifact
- cp27:governance:graph_vault_baseline:snapshot_group:graph_vault_baseline
- cp27:sources:graph_vault_baseline:baseline_graph_index:baseline_graph_index
- cp27:sources:graph_vault_baseline:baseline_vault_manifest:baseline_vault_manifest
- cp27:sources:graph_vault_baseline:edge_family:baseline_graph_manifest_to_index
- cp27:sources:graph_vault_baseline:edge_family:baseline_to_snapshot_batch
- cp27:sources:graph_vault_baseline:snapshot_group:graph_vault_baseline

## Canonical References

- snapshot_group:graph_vault_baseline
- snapshot_group:graph_vault_baseline:baseline_graph_manifest
- snapshot_group:graph_vault_baseline:baseline_graph_partition
- snapshot_group:graph_vault_baseline:baseline_vault_artifact
- snapshot_group:graph_vault_baseline:edge_family:baseline_graph_manifest_to_partition
- snapshot_group:graph_vault_baseline:edge_family:baseline_to_refresh_mapper
- snapshot_group:graph_vault_baseline:edge_family:baseline_vault_manifest_to_artifact
- snapshot_group:graph_vault_baseline:baseline_graph_index
- snapshot_group:graph_vault_baseline:baseline_vault_manifest
- snapshot_group:graph_vault_baseline:edge_family:baseline_graph_manifest_to_index
- snapshot_group:graph_vault_baseline:edge_family:baseline_to_snapshot_batch

## Source And Attribution

- graph_manifest:rafiq-cp27-refresh-private-resource-graph
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/graph-vault-baseline.snapshot.json
- cp26:s03:snapshot:graph_vault_baseline
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json

## Details

| Signal | Value |
| --- | --- |
| linkedNodes | 12 |
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
