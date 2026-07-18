---
artifact_id: "vault:cp27:source-group:private_audit"
artifact_type: "source_group_review_pack"
title: "CP27 Source Group Pack - private_audit"
category: "source-groups"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-17T00:00:00.000Z"
generated_by: "scripts/generate_cp27_g04_vault_packs.mjs"
source_graph_id: "rafiq-cp27-refresh-private-resource-graph"
source_graph_checkpoint: "CP27-G03"
canonical_refs: ["snapshot_group:private_audit", "snapshot_group:private_audit:audit_event", "snapshot_group:private_audit:edge_family:audit_event_to_decision_ledger_entry", "snapshot_group:private_audit:edge_family:audit_event_to_review_queue_item", "snapshot_group:private_audit:remediation_transition", "snapshot_group:private_audit:audit_actor_reference", "snapshot_group:private_audit:decision_ledger_entry", "snapshot_group:private_audit:edge_family:audit_event_to_graph_ref", "snapshot_group:private_audit:edge_family:decision_ledger_entry_to_remediation_transition"]
source_refs: ["graph_manifest:rafiq-cp27-refresh-private-resource-graph", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/private-audit.snapshot.json", "cp26:s03:snapshot:private_audit", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json"]
graph_node_ids: ["cp27:product-evidence:private_audit:audit_event:audit_event", "cp27:product-evidence:private_audit:edge_family:audit_event_to_decision_ledger_entry", "cp27:product-evidence:private_audit:edge_family:audit_event_to_review_queue_item", "cp27:product-evidence:private_audit:remediation_transition:remediation_transition", "cp27:product-evidence:private_audit:snapshot_group:private_audit", "cp27:quality:private_audit:audit_actor_reference:audit_actor_reference", "cp27:quality:private_audit:decision_ledger_entry:decision_ledger_entry", "cp27:quality:private_audit:edge_family:audit_event_to_graph_ref", "cp27:quality:private_audit:edge_family:decision_ledger_entry_to_remediation_transition", "cp27:quality:private_audit:snapshot_group:private_audit"]
release_states: ["private_blocked"]
quality_states: ["review_required"]
raw_text_bodies_exported: false
public_release_approved: false
---

# CP27 Source Group Pack - private_audit

## Summary

Review pack for CP26 snapshot source group `private_audit` mapped into the CP27 refreshed graph.

This is a generated private RAFIQ Knowledge Vault artifact for the CP27 refreshed graph. It is a review and navigation pack, not canonical source data, not source text, and not public release approval.

## Graph Links

- cp27:product-evidence:private_audit:audit_event:audit_event
- cp27:product-evidence:private_audit:edge_family:audit_event_to_decision_ledger_entry
- cp27:product-evidence:private_audit:edge_family:audit_event_to_review_queue_item
- cp27:product-evidence:private_audit:remediation_transition:remediation_transition
- cp27:product-evidence:private_audit:snapshot_group:private_audit
- cp27:quality:private_audit:audit_actor_reference:audit_actor_reference
- cp27:quality:private_audit:decision_ledger_entry:decision_ledger_entry
- cp27:quality:private_audit:edge_family:audit_event_to_graph_ref
- cp27:quality:private_audit:edge_family:decision_ledger_entry_to_remediation_transition
- cp27:quality:private_audit:snapshot_group:private_audit

## Canonical References

- snapshot_group:private_audit
- snapshot_group:private_audit:audit_event
- snapshot_group:private_audit:edge_family:audit_event_to_decision_ledger_entry
- snapshot_group:private_audit:edge_family:audit_event_to_review_queue_item
- snapshot_group:private_audit:remediation_transition
- snapshot_group:private_audit:audit_actor_reference
- snapshot_group:private_audit:decision_ledger_entry
- snapshot_group:private_audit:edge_family:audit_event_to_graph_ref
- snapshot_group:private_audit:edge_family:decision_ledger_entry_to_remediation_transition

## Source And Attribution

- graph_manifest:rafiq-cp27-refresh-private-resource-graph
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/private-audit.snapshot.json
- cp26:s03:snapshot:private_audit
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json

## Details

| Signal | Value |
| --- | --- |
| linkedNodes | 10 |
| qualityWarnings | 12 |
| unresolvedReferences | 66 |
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
