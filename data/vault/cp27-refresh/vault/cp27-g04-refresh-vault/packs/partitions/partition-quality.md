---
artifact_id: "vault:cp27:partition:quality"
artifact_type: "graph_partition_review_pack"
title: "CP27 Partition Pack - quality"
category: "partitions"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-17T00:00:00.000Z"
generated_by: "scripts/generate_cp27_g04_vault_packs.mjs"
source_graph_id: "rafiq-cp27-refresh-private-resource-graph"
source_graph_checkpoint: "CP27-G03"
canonical_refs: ["data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/partitions/quality.json", "snapshot_group:hadith_quality:edge_family:grade_assertion_to_normalization", "snapshot_group:hadith_quality:edge_family:verification_claim_to_reference", "snapshot_group:hadith_quality:hadith_grade_normalization", "snapshot_group:hadith_quality:hadith_verification_reference", "snapshot_group:hadith_quality", "snapshot_group:private_audit:audit_actor_reference", "snapshot_group:private_audit:decision_ledger_entry", "snapshot_group:private_audit:edge_family:audit_event_to_graph_ref", "snapshot_group:private_audit:edge_family:decision_ledger_entry_to_remediation_transition", "snapshot_group:private_audit", "snapshot_group:private_review:edge_family:review_blocker_to_remediation_state", "snapshot_group:private_review:edge_family:review_queue_item_to_assignment", "snapshot_group:private_review:remediation_state", "snapshot_group:private_review:review_assignment", "snapshot_group:private_review", "snapshot_group:raw_lineage:edge_family:raw_lineage_summary_to_import_run", "snapshot_group:raw_lineage:edge_family:validation_finding_to_quality_state", "snapshot_group:raw_lineage:parser_assignment", "snapshot_group:raw_lineage:raw_lineage_summary", "snapshot_group:raw_lineage", "snapshot_group:raw_lineage:validation_finding"]
source_refs: ["graph_manifest:rafiq-cp27-refresh-private-resource-graph", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/hadith-quality.snapshot.json", "cp26:s03:snapshot:hadith_quality", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/private-audit.snapshot.json", "cp26:s03:snapshot:private_audit", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/private-review.snapshot.json", "cp26:s03:snapshot:private_review", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/raw-lineage.snapshot.json", "cp26:s03:snapshot:raw_lineage"]
graph_node_ids: ["cp27:quality:hadith_quality:edge_family:grade_assertion_to_normalization", "cp27:quality:hadith_quality:edge_family:verification_claim_to_reference", "cp27:quality:hadith_quality:hadith_grade_normalization:hadith_grade_normalization", "cp27:quality:hadith_quality:hadith_verification_reference:hadith_verification_reference", "cp27:quality:hadith_quality:snapshot_group:hadith_quality", "cp27:quality:private_audit:audit_actor_reference:audit_actor_reference", "cp27:quality:private_audit:decision_ledger_entry:decision_ledger_entry", "cp27:quality:private_audit:edge_family:audit_event_to_graph_ref", "cp27:quality:private_audit:edge_family:decision_ledger_entry_to_remediation_transition", "cp27:quality:private_audit:snapshot_group:private_audit", "cp27:quality:private_review:edge_family:review_blocker_to_remediation_state", "cp27:quality:private_review:edge_family:review_queue_item_to_assignment", "cp27:quality:private_review:remediation_state:remediation_state", "cp27:quality:private_review:review_assignment:review_assignment", "cp27:quality:private_review:snapshot_group:private_review", "cp27:quality:raw_lineage:edge_family:raw_lineage_summary_to_import_run", "cp27:quality:raw_lineage:edge_family:validation_finding_to_quality_state", "cp27:quality:raw_lineage:parser_assignment:parser_assignment", "cp27:quality:raw_lineage:raw_lineage_summary:raw_lineage_summary", "cp27:quality:raw_lineage:snapshot_group:raw_lineage", "cp27:quality:raw_lineage:validation_finding:validation_finding"]
release_states: ["private_blocked"]
quality_states: ["review_required"]
raw_text_bodies_exported: false
public_release_approved: false
---

# CP27 Partition Pack - quality

## Summary

Review pack for refreshed graph partition `quality` with 21 nodes and 17 edges.

This is a generated private RAFIQ Knowledge Vault artifact for the CP27 refreshed graph. It is a review and navigation pack, not canonical source data, not source text, and not public release approval.

## Graph Links

- cp27:quality:hadith_quality:edge_family:grade_assertion_to_normalization
- cp27:quality:hadith_quality:edge_family:verification_claim_to_reference
- cp27:quality:hadith_quality:hadith_grade_normalization:hadith_grade_normalization
- cp27:quality:hadith_quality:hadith_verification_reference:hadith_verification_reference
- cp27:quality:hadith_quality:snapshot_group:hadith_quality
- cp27:quality:private_audit:audit_actor_reference:audit_actor_reference
- cp27:quality:private_audit:decision_ledger_entry:decision_ledger_entry
- cp27:quality:private_audit:edge_family:audit_event_to_graph_ref
- cp27:quality:private_audit:edge_family:decision_ledger_entry_to_remediation_transition
- cp27:quality:private_audit:snapshot_group:private_audit
- cp27:quality:private_review:edge_family:review_blocker_to_remediation_state
- cp27:quality:private_review:edge_family:review_queue_item_to_assignment
- cp27:quality:private_review:remediation_state:remediation_state
- cp27:quality:private_review:review_assignment:review_assignment
- cp27:quality:private_review:snapshot_group:private_review
- cp27:quality:raw_lineage:edge_family:raw_lineage_summary_to_import_run
- cp27:quality:raw_lineage:edge_family:validation_finding_to_quality_state
- cp27:quality:raw_lineage:parser_assignment:parser_assignment
- cp27:quality:raw_lineage:raw_lineage_summary:raw_lineage_summary
- cp27:quality:raw_lineage:snapshot_group:raw_lineage
- cp27:quality:raw_lineage:validation_finding:validation_finding

## Canonical References

- data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/partitions/quality.json
- snapshot_group:hadith_quality:edge_family:grade_assertion_to_normalization
- snapshot_group:hadith_quality:edge_family:verification_claim_to_reference
- snapshot_group:hadith_quality:hadith_grade_normalization
- snapshot_group:hadith_quality:hadith_verification_reference
- snapshot_group:hadith_quality
- snapshot_group:private_audit:audit_actor_reference
- snapshot_group:private_audit:decision_ledger_entry
- snapshot_group:private_audit:edge_family:audit_event_to_graph_ref
- snapshot_group:private_audit:edge_family:decision_ledger_entry_to_remediation_transition
- snapshot_group:private_audit
- snapshot_group:private_review:edge_family:review_blocker_to_remediation_state
- snapshot_group:private_review:edge_family:review_queue_item_to_assignment
- snapshot_group:private_review:remediation_state
- snapshot_group:private_review:review_assignment
- snapshot_group:private_review
- snapshot_group:raw_lineage:edge_family:raw_lineage_summary_to_import_run
- snapshot_group:raw_lineage:edge_family:validation_finding_to_quality_state
- snapshot_group:raw_lineage:parser_assignment
- snapshot_group:raw_lineage:raw_lineage_summary
- snapshot_group:raw_lineage
- snapshot_group:raw_lineage:validation_finding

## Source And Attribution

- graph_manifest:rafiq-cp27-refresh-private-resource-graph
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/hadith-quality.snapshot.json
- cp26:s03:snapshot:hadith_quality
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/private-audit.snapshot.json
- cp26:s03:snapshot:private_audit
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/private-review.snapshot.json
- cp26:s03:snapshot:private_review
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/raw-lineage.snapshot.json
- cp26:s03:snapshot:raw_lineage

## Details

| Node Type | Count |
| --- | --- |
| audit_actor_reference | 1 |
| decision_ledger_entry | 1 |
| edge_family | 8 |
| hadith_grade_normalization | 1 |
| hadith_verification_reference | 1 |
| parser_assignment | 1 |
| raw_lineage_summary | 1 |
| remediation_state | 1 |
| review_assignment | 1 |
| snapshot_group | 4 |
| validation_finding | 1 |

## Release Boundary

- Public safe: `false`
- Public release approved: `false`
- Raw text bodies exported: `false`
- CP22 vault baseline overwritten: `false`

## Blockers

- Partition remains private-only and public-safe counts are zero.
- Public release remains blocked.
- Vault packs are generated review/navigation artifacts only.
