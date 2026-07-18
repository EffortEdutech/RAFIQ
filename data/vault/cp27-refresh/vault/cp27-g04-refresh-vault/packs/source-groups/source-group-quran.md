---
artifact_id: "vault:cp27:source-group:quran"
artifact_type: "source_group_review_pack"
title: "CP27 Source Group Pack - quran"
category: "source-groups"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-17T00:00:00.000Z"
generated_by: "scripts/generate_cp27_g04_vault_packs.mjs"
source_graph_id: "rafiq-cp27-refresh-private-resource-graph"
source_graph_checkpoint: "CP27-G03"
canonical_refs: ["snapshot_group:quran", "snapshot_group:quran:edge_family:quran_ayah_to_partition", "snapshot_group:quran:edge_family:quran_ayah_to_text_edition", "snapshot_group:quran:edge_family:quran_partition_scheme_to_partition", "snapshot_group:quran:edge_family:quran_surah_to_ayah", "snapshot_group:quran:quran_ayah_text_reference", "snapshot_group:quran:quran_ayah", "snapshot_group:quran:quran_partition_scheme", "snapshot_group:quran:quran_partition", "snapshot_group:quran:quran_surah", "snapshot_group:quran:quran_text_edition"]
source_refs: ["graph_manifest:rafiq-cp27-refresh-private-resource-graph", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/quran.snapshot.json", "cp26:s03:snapshot:quran", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json"]
graph_node_ids: ["cp27:quran:quran:edge_family:quran_ayah_to_partition", "cp27:quran:quran:edge_family:quran_ayah_to_text_edition", "cp27:quran:quran:edge_family:quran_partition_scheme_to_partition", "cp27:quran:quran:edge_family:quran_surah_to_ayah", "cp27:quran:quran:quran_ayah_text_reference:quran_ayah_text_reference", "cp27:quran:quran:quran_ayah:quran_ayah", "cp27:quran:quran:quran_partition_scheme:quran_partition_scheme", "cp27:quran:quran:quran_partition:quran_partition", "cp27:quran:quran:quran_surah:quran_surah", "cp27:quran:quran:quran_text_edition:quran_text_edition", "cp27:quran:quran:snapshot_group:quran"]
release_states: ["private_blocked"]
quality_states: ["private_reviewed"]
raw_text_bodies_exported: false
public_release_approved: false
---

# CP27 Source Group Pack - quran

## Summary

Review pack for CP26 snapshot source group `quran` mapped into the CP27 refreshed graph.

This is a generated private RAFIQ Knowledge Vault artifact for the CP27 refreshed graph. It is a review and navigation pack, not canonical source data, not source text, and not public release approval.

## Graph Links

- cp27:quran:quran:edge_family:quran_ayah_to_partition
- cp27:quran:quran:edge_family:quran_ayah_to_text_edition
- cp27:quran:quran:edge_family:quran_partition_scheme_to_partition
- cp27:quran:quran:edge_family:quran_surah_to_ayah
- cp27:quran:quran:quran_ayah_text_reference:quran_ayah_text_reference
- cp27:quran:quran:quran_ayah:quran_ayah
- cp27:quran:quran:quran_partition_scheme:quran_partition_scheme
- cp27:quran:quran:quran_partition:quran_partition
- cp27:quran:quran:quran_surah:quran_surah
- cp27:quran:quran:quran_text_edition:quran_text_edition
- cp27:quran:quran:snapshot_group:quran

## Canonical References

- snapshot_group:quran
- snapshot_group:quran:edge_family:quran_ayah_to_partition
- snapshot_group:quran:edge_family:quran_ayah_to_text_edition
- snapshot_group:quran:edge_family:quran_partition_scheme_to_partition
- snapshot_group:quran:edge_family:quran_surah_to_ayah
- snapshot_group:quran:quran_ayah_text_reference
- snapshot_group:quran:quran_ayah
- snapshot_group:quran:quran_partition_scheme
- snapshot_group:quran:quran_partition
- snapshot_group:quran:quran_surah
- snapshot_group:quran:quran_text_edition

## Source And Attribution

- graph_manifest:rafiq-cp27-refresh-private-resource-graph
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/quran.snapshot.json
- cp26:s03:snapshot:quran
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json

## Details

| Signal | Value |
| --- | --- |
| linkedNodes | 11 |
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
