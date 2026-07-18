---
artifact_id: "vault:cp27:partition:tafsir"
artifact_type: "graph_partition_review_pack"
title: "CP27 Partition Pack - tafsir"
category: "partitions"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-17T00:00:00.000Z"
generated_by: "scripts/generate_cp27_g04_vault_packs.mjs"
source_graph_id: "rafiq-cp27-refresh-private-resource-graph"
source_graph_checkpoint: "CP27-G03"
canonical_refs: ["data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/partitions/tafsir.json", "snapshot_group:tafsir:edge_family:tafsir_edition_to_passage_reference", "snapshot_group:tafsir:edge_family:tafsir_passage_reference_to_ayah", "snapshot_group:tafsir:edge_family:tafsir_passage_reference_to_source", "snapshot_group:tafsir", "snapshot_group:tafsir:tafsir_ayah_link", "snapshot_group:tafsir:tafsir_edition", "snapshot_group:tafsir:tafsir_passage_reference"]
source_refs: ["graph_manifest:rafiq-cp27-refresh-private-resource-graph", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/tafsir.snapshot.json", "cp26:s03:snapshot:tafsir", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json"]
graph_node_ids: ["cp27:tafsir:tafsir:edge_family:tafsir_edition_to_passage_reference", "cp27:tafsir:tafsir:edge_family:tafsir_passage_reference_to_ayah", "cp27:tafsir:tafsir:edge_family:tafsir_passage_reference_to_source", "cp27:tafsir:tafsir:snapshot_group:tafsir", "cp27:tafsir:tafsir:tafsir_ayah_link:tafsir_ayah_link", "cp27:tafsir:tafsir:tafsir_edition:tafsir_edition", "cp27:tafsir:tafsir:tafsir_passage_reference:tafsir_passage_reference"]
release_states: ["private_blocked"]
quality_states: ["review_required"]
raw_text_bodies_exported: false
public_release_approved: false
---

# CP27 Partition Pack - tafsir

## Summary

Review pack for refreshed graph partition `tafsir` with 7 nodes and 6 edges.

This is a generated private RAFIQ Knowledge Vault artifact for the CP27 refreshed graph. It is a review and navigation pack, not canonical source data, not source text, and not public release approval.

## Graph Links

- cp27:tafsir:tafsir:edge_family:tafsir_edition_to_passage_reference
- cp27:tafsir:tafsir:edge_family:tafsir_passage_reference_to_ayah
- cp27:tafsir:tafsir:edge_family:tafsir_passage_reference_to_source
- cp27:tafsir:tafsir:snapshot_group:tafsir
- cp27:tafsir:tafsir:tafsir_ayah_link:tafsir_ayah_link
- cp27:tafsir:tafsir:tafsir_edition:tafsir_edition
- cp27:tafsir:tafsir:tafsir_passage_reference:tafsir_passage_reference

## Canonical References

- data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/partitions/tafsir.json
- snapshot_group:tafsir:edge_family:tafsir_edition_to_passage_reference
- snapshot_group:tafsir:edge_family:tafsir_passage_reference_to_ayah
- snapshot_group:tafsir:edge_family:tafsir_passage_reference_to_source
- snapshot_group:tafsir
- snapshot_group:tafsir:tafsir_ayah_link
- snapshot_group:tafsir:tafsir_edition
- snapshot_group:tafsir:tafsir_passage_reference

## Source And Attribution

- graph_manifest:rafiq-cp27-refresh-private-resource-graph
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/tafsir.snapshot.json
- cp26:s03:snapshot:tafsir
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json

## Details

| Node Type | Count |
| --- | --- |
| edge_family | 3 |
| snapshot_group | 1 |
| tafsir_ayah_link | 1 |
| tafsir_edition | 1 |
| tafsir_passage_reference | 1 |

## Release Boundary

- Public safe: `false`
- Public release approved: `false`
- Raw text bodies exported: `false`
- CP22 vault baseline overwritten: `false`

## Blockers

- Partition remains private-only and public-safe counts are zero.
- Public release remains blocked.
- Vault packs are generated review/navigation artifacts only.
