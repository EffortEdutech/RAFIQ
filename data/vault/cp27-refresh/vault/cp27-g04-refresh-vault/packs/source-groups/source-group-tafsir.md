---
artifact_id: "vault:cp27:source-group:tafsir"
artifact_type: "source_group_review_pack"
title: "CP27 Source Group Pack - tafsir"
category: "source-groups"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-17T00:00:00.000Z"
generated_by: "scripts/generate_cp27_g04_vault_packs.mjs"
source_graph_id: "rafiq-cp27-refresh-private-resource-graph"
source_graph_checkpoint: "CP27-G03"
canonical_refs: ["snapshot_group:tafsir", "snapshot_group:tafsir:edge_family:tafsir_edition_to_passage_reference", "snapshot_group:tafsir:edge_family:tafsir_passage_reference_to_ayah", "snapshot_group:tafsir:edge_family:tafsir_passage_reference_to_source", "snapshot_group:tafsir:tafsir_ayah_link", "snapshot_group:tafsir:tafsir_edition", "snapshot_group:tafsir:tafsir_passage_reference"]
source_refs: ["graph_manifest:rafiq-cp27-refresh-private-resource-graph", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/tafsir.snapshot.json", "cp26:s03:snapshot:tafsir", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json"]
graph_node_ids: ["cp27:tafsir:tafsir:edge_family:tafsir_edition_to_passage_reference", "cp27:tafsir:tafsir:edge_family:tafsir_passage_reference_to_ayah", "cp27:tafsir:tafsir:edge_family:tafsir_passage_reference_to_source", "cp27:tafsir:tafsir:snapshot_group:tafsir", "cp27:tafsir:tafsir:tafsir_ayah_link:tafsir_ayah_link", "cp27:tafsir:tafsir:tafsir_edition:tafsir_edition", "cp27:tafsir:tafsir:tafsir_passage_reference:tafsir_passage_reference"]
release_states: ["private_blocked"]
quality_states: ["review_required"]
raw_text_bodies_exported: false
public_release_approved: false
---

# CP27 Source Group Pack - tafsir

## Summary

Review pack for CP26 snapshot source group `tafsir` mapped into the CP27 refreshed graph.

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

- snapshot_group:tafsir
- snapshot_group:tafsir:edge_family:tafsir_edition_to_passage_reference
- snapshot_group:tafsir:edge_family:tafsir_passage_reference_to_ayah
- snapshot_group:tafsir:edge_family:tafsir_passage_reference_to_source
- snapshot_group:tafsir:tafsir_ayah_link
- snapshot_group:tafsir:tafsir_edition
- snapshot_group:tafsir:tafsir_passage_reference

## Source And Attribution

- graph_manifest:rafiq-cp27-refresh-private-resource-graph
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/tafsir.snapshot.json
- cp26:s03:snapshot:tafsir
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json

## Details

| Signal | Value |
| --- | --- |
| linkedNodes | 7 |
| qualityWarnings | 2 |
| unresolvedReferences | 0 |
| baselineComparisonMode | matched |

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
