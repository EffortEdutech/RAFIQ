---
artifact_id: "vault:cp27:partition:hadith-grades"
artifact_type: "graph_partition_review_pack"
title: "CP27 Partition Pack - hadith-grades"
category: "partitions"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-17T00:00:00.000Z"
generated_by: "scripts/generate_cp27_g04_vault_packs.mjs"
source_graph_id: "rafiq-cp27-refresh-private-resource-graph"
source_graph_checkpoint: "CP27-G03"
canonical_refs: ["data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/partitions/hadith-grades.json", "snapshot_group:hadith_quality:edge_family:grade_assertion_to_quality_state", "snapshot_group:hadith_quality:edge_family:hadith_record_to_grade_assertion", "snapshot_group:hadith_quality:edge_family:hadith_record_to_verification_claim", "snapshot_group:hadith_quality:hadith_grade_assertion", "snapshot_group:hadith_quality:hadith_verification_claim", "snapshot_group:hadith_quality:quality_finding", "snapshot_group:hadith_quality"]
source_refs: ["graph_manifest:rafiq-cp27-refresh-private-resource-graph", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/hadith-quality.snapshot.json", "cp26:s03:snapshot:hadith_quality", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json"]
graph_node_ids: ["cp27:hadith-grades:hadith_quality:edge_family:grade_assertion_to_quality_state", "cp27:hadith-grades:hadith_quality:edge_family:hadith_record_to_grade_assertion", "cp27:hadith-grades:hadith_quality:edge_family:hadith_record_to_verification_claim", "cp27:hadith-grades:hadith_quality:hadith_grade_assertion:hadith_grade_assertion", "cp27:hadith-grades:hadith_quality:hadith_verification_claim:hadith_verification_claim", "cp27:hadith-grades:hadith_quality:quality_finding:quality_finding", "cp27:hadith-grades:hadith_quality:snapshot_group:hadith_quality"]
release_states: ["private_blocked"]
quality_states: ["review_required"]
raw_text_bodies_exported: false
public_release_approved: false
---

# CP27 Partition Pack - hadith-grades

## Summary

Review pack for refreshed graph partition `hadith-grades` with 7 nodes and 6 edges.

This is a generated private RAFIQ Knowledge Vault artifact for the CP27 refreshed graph. It is a review and navigation pack, not canonical source data, not source text, and not public release approval.

## Graph Links

- cp27:hadith-grades:hadith_quality:edge_family:grade_assertion_to_quality_state
- cp27:hadith-grades:hadith_quality:edge_family:hadith_record_to_grade_assertion
- cp27:hadith-grades:hadith_quality:edge_family:hadith_record_to_verification_claim
- cp27:hadith-grades:hadith_quality:hadith_grade_assertion:hadith_grade_assertion
- cp27:hadith-grades:hadith_quality:hadith_verification_claim:hadith_verification_claim
- cp27:hadith-grades:hadith_quality:quality_finding:quality_finding
- cp27:hadith-grades:hadith_quality:snapshot_group:hadith_quality

## Canonical References

- data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/partitions/hadith-grades.json
- snapshot_group:hadith_quality:edge_family:grade_assertion_to_quality_state
- snapshot_group:hadith_quality:edge_family:hadith_record_to_grade_assertion
- snapshot_group:hadith_quality:edge_family:hadith_record_to_verification_claim
- snapshot_group:hadith_quality:hadith_grade_assertion
- snapshot_group:hadith_quality:hadith_verification_claim
- snapshot_group:hadith_quality:quality_finding
- snapshot_group:hadith_quality

## Source And Attribution

- graph_manifest:rafiq-cp27-refresh-private-resource-graph
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/hadith-quality.snapshot.json
- cp26:s03:snapshot:hadith_quality
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json

## Details

| Node Type | Count |
| --- | --- |
| edge_family | 3 |
| hadith_grade_assertion | 1 |
| hadith_verification_claim | 1 |
| quality_finding | 1 |
| snapshot_group | 1 |

## Release Boundary

- Public safe: `false`
- Public release approved: `false`
- Raw text bodies exported: `false`
- CP22 vault baseline overwritten: `false`

## Blockers

- Partition remains private-only and public-safe counts are zero.
- Public release remains blocked.
- Vault packs are generated review/navigation artifacts only.
