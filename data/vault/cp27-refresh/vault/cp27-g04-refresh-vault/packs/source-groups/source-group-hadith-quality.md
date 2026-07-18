---
artifact_id: "vault:cp27:source-group:hadith_quality"
artifact_type: "source_group_review_pack"
title: "CP27 Source Group Pack - hadith_quality"
category: "source-groups"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-17T00:00:00.000Z"
generated_by: "scripts/generate_cp27_g04_vault_packs.mjs"
source_graph_id: "rafiq-cp27-refresh-private-resource-graph"
source_graph_checkpoint: "CP27-G03"
canonical_refs: ["snapshot_group:hadith_quality", "snapshot_group:hadith_quality:edge_family:grade_assertion_to_quality_state", "snapshot_group:hadith_quality:edge_family:hadith_record_to_grade_assertion", "snapshot_group:hadith_quality:edge_family:hadith_record_to_verification_claim", "snapshot_group:hadith_quality:hadith_grade_assertion", "snapshot_group:hadith_quality:hadith_verification_claim", "snapshot_group:hadith_quality:quality_finding", "snapshot_group:hadith_quality:edge_family:grade_assertion_to_normalization", "snapshot_group:hadith_quality:edge_family:verification_claim_to_reference", "snapshot_group:hadith_quality:hadith_grade_normalization", "snapshot_group:hadith_quality:hadith_verification_reference"]
source_refs: ["graph_manifest:rafiq-cp27-refresh-private-resource-graph", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/hadith-quality.snapshot.json", "cp26:s03:snapshot:hadith_quality", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json"]
graph_node_ids: ["cp27:hadith-grades:hadith_quality:edge_family:grade_assertion_to_quality_state", "cp27:hadith-grades:hadith_quality:edge_family:hadith_record_to_grade_assertion", "cp27:hadith-grades:hadith_quality:edge_family:hadith_record_to_verification_claim", "cp27:hadith-grades:hadith_quality:hadith_grade_assertion:hadith_grade_assertion", "cp27:hadith-grades:hadith_quality:hadith_verification_claim:hadith_verification_claim", "cp27:hadith-grades:hadith_quality:quality_finding:quality_finding", "cp27:hadith-grades:hadith_quality:snapshot_group:hadith_quality", "cp27:quality:hadith_quality:edge_family:grade_assertion_to_normalization", "cp27:quality:hadith_quality:edge_family:verification_claim_to_reference", "cp27:quality:hadith_quality:hadith_grade_normalization:hadith_grade_normalization", "cp27:quality:hadith_quality:hadith_verification_reference:hadith_verification_reference", "cp27:quality:hadith_quality:snapshot_group:hadith_quality"]
release_states: ["private_blocked"]
quality_states: ["review_required"]
raw_text_bodies_exported: false
public_release_approved: false
---

# CP27 Source Group Pack - hadith_quality

## Summary

Review pack for CP26 snapshot source group `hadith_quality` mapped into the CP27 refreshed graph.

This is a generated private RAFIQ Knowledge Vault artifact for the CP27 refreshed graph. It is a review and navigation pack, not canonical source data, not source text, and not public release approval.

## Graph Links

- cp27:hadith-grades:hadith_quality:edge_family:grade_assertion_to_quality_state
- cp27:hadith-grades:hadith_quality:edge_family:hadith_record_to_grade_assertion
- cp27:hadith-grades:hadith_quality:edge_family:hadith_record_to_verification_claim
- cp27:hadith-grades:hadith_quality:hadith_grade_assertion:hadith_grade_assertion
- cp27:hadith-grades:hadith_quality:hadith_verification_claim:hadith_verification_claim
- cp27:hadith-grades:hadith_quality:quality_finding:quality_finding
- cp27:hadith-grades:hadith_quality:snapshot_group:hadith_quality
- cp27:quality:hadith_quality:edge_family:grade_assertion_to_normalization
- cp27:quality:hadith_quality:edge_family:verification_claim_to_reference
- cp27:quality:hadith_quality:hadith_grade_normalization:hadith_grade_normalization
- cp27:quality:hadith_quality:hadith_verification_reference:hadith_verification_reference
- cp27:quality:hadith_quality:snapshot_group:hadith_quality

## Canonical References

- snapshot_group:hadith_quality
- snapshot_group:hadith_quality:edge_family:grade_assertion_to_quality_state
- snapshot_group:hadith_quality:edge_family:hadith_record_to_grade_assertion
- snapshot_group:hadith_quality:edge_family:hadith_record_to_verification_claim
- snapshot_group:hadith_quality:hadith_grade_assertion
- snapshot_group:hadith_quality:hadith_verification_claim
- snapshot_group:hadith_quality:quality_finding
- snapshot_group:hadith_quality:edge_family:grade_assertion_to_normalization
- snapshot_group:hadith_quality:edge_family:verification_claim_to_reference
- snapshot_group:hadith_quality:hadith_grade_normalization
- snapshot_group:hadith_quality:hadith_verification_reference

## Source And Attribution

- graph_manifest:rafiq-cp27-refresh-private-resource-graph
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/hadith-quality.snapshot.json
- cp26:s03:snapshot:hadith_quality
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json

## Details

| Signal | Value |
| --- | --- |
| linkedNodes | 12 |
| qualityWarnings | 91 |
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
