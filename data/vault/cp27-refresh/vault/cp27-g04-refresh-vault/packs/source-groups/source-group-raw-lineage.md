---
artifact_id: "vault:cp27:source-group:raw_lineage"
artifact_type: "source_group_review_pack"
title: "CP27 Source Group Pack - raw_lineage"
category: "source-groups"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-17T00:00:00.000Z"
generated_by: "scripts/generate_cp27_g04_vault_packs.mjs"
source_graph_id: "rafiq-cp27-refresh-private-resource-graph"
source_graph_checkpoint: "CP27-G03"
canonical_refs: ["snapshot_group:raw_lineage", "snapshot_group:raw_lineage:edge_family:raw_lineage_summary_to_import_run", "snapshot_group:raw_lineage:edge_family:validation_finding_to_quality_state", "snapshot_group:raw_lineage:parser_assignment", "snapshot_group:raw_lineage:raw_lineage_summary", "snapshot_group:raw_lineage:validation_finding", "snapshot_group:raw_lineage:edge_family:parser_assignment_to_source_snapshot", "snapshot_group:raw_lineage:edge_family:raw_lineage_summary_to_validation_finding", "snapshot_group:raw_lineage:import_run", "snapshot_group:raw_lineage:transformation_event"]
source_refs: ["graph_manifest:rafiq-cp27-refresh-private-resource-graph", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/raw-lineage.snapshot.json", "cp26:s03:snapshot:raw_lineage", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json"]
graph_node_ids: ["cp27:quality:raw_lineage:edge_family:raw_lineage_summary_to_import_run", "cp27:quality:raw_lineage:edge_family:validation_finding_to_quality_state", "cp27:quality:raw_lineage:parser_assignment:parser_assignment", "cp27:quality:raw_lineage:raw_lineage_summary:raw_lineage_summary", "cp27:quality:raw_lineage:snapshot_group:raw_lineage", "cp27:quality:raw_lineage:validation_finding:validation_finding", "cp27:sources:raw_lineage:edge_family:parser_assignment_to_source_snapshot", "cp27:sources:raw_lineage:edge_family:raw_lineage_summary_to_validation_finding", "cp27:sources:raw_lineage:import_run:import_run", "cp27:sources:raw_lineage:snapshot_group:raw_lineage", "cp27:sources:raw_lineage:transformation_event:transformation_event"]
release_states: ["private_blocked"]
quality_states: ["review_required"]
raw_text_bodies_exported: false
public_release_approved: false
---

# CP27 Source Group Pack - raw_lineage

## Summary

Review pack for CP26 snapshot source group `raw_lineage` mapped into the CP27 refreshed graph.

This is a generated private RAFIQ Knowledge Vault artifact for the CP27 refreshed graph. It is a review and navigation pack, not canonical source data, not source text, and not public release approval.

## Graph Links

- cp27:quality:raw_lineage:edge_family:raw_lineage_summary_to_import_run
- cp27:quality:raw_lineage:edge_family:validation_finding_to_quality_state
- cp27:quality:raw_lineage:parser_assignment:parser_assignment
- cp27:quality:raw_lineage:raw_lineage_summary:raw_lineage_summary
- cp27:quality:raw_lineage:snapshot_group:raw_lineage
- cp27:quality:raw_lineage:validation_finding:validation_finding
- cp27:sources:raw_lineage:edge_family:parser_assignment_to_source_snapshot
- cp27:sources:raw_lineage:edge_family:raw_lineage_summary_to_validation_finding
- cp27:sources:raw_lineage:import_run:import_run
- cp27:sources:raw_lineage:snapshot_group:raw_lineage
- cp27:sources:raw_lineage:transformation_event:transformation_event

## Canonical References

- snapshot_group:raw_lineage
- snapshot_group:raw_lineage:edge_family:raw_lineage_summary_to_import_run
- snapshot_group:raw_lineage:edge_family:validation_finding_to_quality_state
- snapshot_group:raw_lineage:parser_assignment
- snapshot_group:raw_lineage:raw_lineage_summary
- snapshot_group:raw_lineage:validation_finding
- snapshot_group:raw_lineage:edge_family:parser_assignment_to_source_snapshot
- snapshot_group:raw_lineage:edge_family:raw_lineage_summary_to_validation_finding
- snapshot_group:raw_lineage:import_run
- snapshot_group:raw_lineage:transformation_event

## Source And Attribution

- graph_manifest:rafiq-cp27-refresh-private-resource-graph
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/raw-lineage.snapshot.json
- cp26:s03:snapshot:raw_lineage
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json

## Details

| Signal | Value |
| --- | --- |
| linkedNodes | 11 |
| qualityWarnings | 91 |
| unresolvedReferences | 0 |
| baselineComparisonMode | deferred |

## Release Boundary

- Public safe: `false`
- Public release approved: `false`
- Raw text bodies exported: `false`
- CP22 vault baseline overwritten: `false`

## Blockers

- Raw text bodies are not exported.
- Source group requires review.
- Public release remains blocked.
- Vault packs are generated review/navigation artifacts only.
