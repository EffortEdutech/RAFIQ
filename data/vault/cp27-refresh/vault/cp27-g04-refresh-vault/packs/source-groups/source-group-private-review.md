---
artifact_id: "vault:cp27:source-group:private_review"
artifact_type: "source_group_review_pack"
title: "CP27 Source Group Pack - private_review"
category: "source-groups"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-17T00:00:00.000Z"
generated_by: "scripts/generate_cp27_g04_vault_packs.mjs"
source_graph_id: "rafiq-cp27-refresh-private-resource-graph"
source_graph_checkpoint: "CP27-G03"
canonical_refs: ["snapshot_group:private_review", "snapshot_group:private_review:edge_family:review_queue_item_to_blocker", "snapshot_group:private_review:edge_family:review_queue_item_to_graph_ref", "snapshot_group:private_review:edge_family:review_queue_item_to_review_state", "snapshot_group:private_review:private_review_queue_item", "snapshot_group:private_review:review_blocker", "snapshot_group:private_review:review_decision_context", "snapshot_group:private_review:edge_family:review_blocker_to_remediation_state", "snapshot_group:private_review:edge_family:review_queue_item_to_assignment", "snapshot_group:private_review:remediation_state", "snapshot_group:private_review:review_assignment"]
source_refs: ["graph_manifest:rafiq-cp27-refresh-private-resource-graph", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/private-review.snapshot.json", "cp26:s03:snapshot:private_review", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json"]
graph_node_ids: ["cp27:product-evidence:private_review:edge_family:review_queue_item_to_blocker", "cp27:product-evidence:private_review:edge_family:review_queue_item_to_graph_ref", "cp27:product-evidence:private_review:edge_family:review_queue_item_to_review_state", "cp27:product-evidence:private_review:private_review_queue_item:private_review_queue_item", "cp27:product-evidence:private_review:review_blocker:review_blocker", "cp27:product-evidence:private_review:review_decision_context:review_decision_context", "cp27:product-evidence:private_review:snapshot_group:private_review", "cp27:quality:private_review:edge_family:review_blocker_to_remediation_state", "cp27:quality:private_review:edge_family:review_queue_item_to_assignment", "cp27:quality:private_review:remediation_state:remediation_state", "cp27:quality:private_review:review_assignment:review_assignment", "cp27:quality:private_review:snapshot_group:private_review"]
release_states: ["private_blocked"]
quality_states: ["review_required"]
raw_text_bodies_exported: false
public_release_approved: false
---

# CP27 Source Group Pack - private_review

## Summary

Review pack for CP26 snapshot source group `private_review` mapped into the CP27 refreshed graph.

This is a generated private RAFIQ Knowledge Vault artifact for the CP27 refreshed graph. It is a review and navigation pack, not canonical source data, not source text, and not public release approval.

## Graph Links

- cp27:product-evidence:private_review:edge_family:review_queue_item_to_blocker
- cp27:product-evidence:private_review:edge_family:review_queue_item_to_graph_ref
- cp27:product-evidence:private_review:edge_family:review_queue_item_to_review_state
- cp27:product-evidence:private_review:private_review_queue_item:private_review_queue_item
- cp27:product-evidence:private_review:review_blocker:review_blocker
- cp27:product-evidence:private_review:review_decision_context:review_decision_context
- cp27:product-evidence:private_review:snapshot_group:private_review
- cp27:quality:private_review:edge_family:review_blocker_to_remediation_state
- cp27:quality:private_review:edge_family:review_queue_item_to_assignment
- cp27:quality:private_review:remediation_state:remediation_state
- cp27:quality:private_review:review_assignment:review_assignment
- cp27:quality:private_review:snapshot_group:private_review

## Canonical References

- snapshot_group:private_review
- snapshot_group:private_review:edge_family:review_queue_item_to_blocker
- snapshot_group:private_review:edge_family:review_queue_item_to_graph_ref
- snapshot_group:private_review:edge_family:review_queue_item_to_review_state
- snapshot_group:private_review:private_review_queue_item
- snapshot_group:private_review:review_blocker
- snapshot_group:private_review:review_decision_context
- snapshot_group:private_review:edge_family:review_blocker_to_remediation_state
- snapshot_group:private_review:edge_family:review_queue_item_to_assignment
- snapshot_group:private_review:remediation_state
- snapshot_group:private_review:review_assignment

## Source And Attribution

- graph_manifest:rafiq-cp27-refresh-private-resource-graph
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/private-review.snapshot.json
- cp26:s03:snapshot:private_review
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json

## Details

| Signal | Value |
| --- | --- |
| linkedNodes | 12 |
| qualityWarnings | 18 |
| unresolvedReferences | 1 |
| baselineComparisonMode | added |

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
