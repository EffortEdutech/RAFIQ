---
artifact_id: "vault:cp27:source-group:private_retrieval"
artifact_type: "source_group_review_pack"
title: "CP27 Source Group Pack - private_retrieval"
category: "source-groups"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-17T00:00:00.000Z"
generated_by: "scripts/generate_cp27_g04_vault_packs.mjs"
source_graph_id: "rafiq-cp27-refresh-private-resource-graph"
source_graph_checkpoint: "CP27-G03"
canonical_refs: ["snapshot_group:private_retrieval", "snapshot_group:private_retrieval:edge_family:candidate_to_evidence_route", "snapshot_group:private_retrieval:edge_family:evidence_route_to_validation_handoff", "snapshot_group:private_retrieval:edge_family:retrieval_trace_to_candidate", "snapshot_group:private_retrieval:edge_family:search_document_to_graph_ref", "snapshot_group:private_retrieval:edge_family:validation_handoff_to_validation_gate", "snapshot_group:private_retrieval:evidence_route", "snapshot_group:private_retrieval:private_retrieval_trace", "snapshot_group:private_retrieval:private_search_document", "snapshot_group:private_retrieval:retrieval_candidate", "snapshot_group:private_retrieval:validation_handoff"]
source_refs: ["graph_manifest:rafiq-cp27-refresh-private-resource-graph", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/private-retrieval.snapshot.json", "cp26:s03:snapshot:private_retrieval", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json"]
graph_node_ids: ["cp27:product-evidence:private_retrieval:edge_family:candidate_to_evidence_route", "cp27:product-evidence:private_retrieval:edge_family:evidence_route_to_validation_handoff", "cp27:product-evidence:private_retrieval:edge_family:retrieval_trace_to_candidate", "cp27:product-evidence:private_retrieval:edge_family:search_document_to_graph_ref", "cp27:product-evidence:private_retrieval:edge_family:validation_handoff_to_validation_gate", "cp27:product-evidence:private_retrieval:evidence_route:evidence_route", "cp27:product-evidence:private_retrieval:private_retrieval_trace:private_retrieval_trace", "cp27:product-evidence:private_retrieval:private_search_document:private_search_document", "cp27:product-evidence:private_retrieval:retrieval_candidate:retrieval_candidate", "cp27:product-evidence:private_retrieval:snapshot_group:private_retrieval", "cp27:product-evidence:private_retrieval:validation_handoff:validation_handoff"]
release_states: ["private_blocked"]
quality_states: ["review_required"]
raw_text_bodies_exported: false
public_release_approved: false
---

# CP27 Source Group Pack - private_retrieval

## Summary

Review pack for CP26 snapshot source group `private_retrieval` mapped into the CP27 refreshed graph.

This is a generated private RAFIQ Knowledge Vault artifact for the CP27 refreshed graph. It is a review and navigation pack, not canonical source data, not source text, and not public release approval.

## Graph Links

- cp27:product-evidence:private_retrieval:edge_family:candidate_to_evidence_route
- cp27:product-evidence:private_retrieval:edge_family:evidence_route_to_validation_handoff
- cp27:product-evidence:private_retrieval:edge_family:retrieval_trace_to_candidate
- cp27:product-evidence:private_retrieval:edge_family:search_document_to_graph_ref
- cp27:product-evidence:private_retrieval:edge_family:validation_handoff_to_validation_gate
- cp27:product-evidence:private_retrieval:evidence_route:evidence_route
- cp27:product-evidence:private_retrieval:private_retrieval_trace:private_retrieval_trace
- cp27:product-evidence:private_retrieval:private_search_document:private_search_document
- cp27:product-evidence:private_retrieval:retrieval_candidate:retrieval_candidate
- cp27:product-evidence:private_retrieval:snapshot_group:private_retrieval
- cp27:product-evidence:private_retrieval:validation_handoff:validation_handoff

## Canonical References

- snapshot_group:private_retrieval
- snapshot_group:private_retrieval:edge_family:candidate_to_evidence_route
- snapshot_group:private_retrieval:edge_family:evidence_route_to_validation_handoff
- snapshot_group:private_retrieval:edge_family:retrieval_trace_to_candidate
- snapshot_group:private_retrieval:edge_family:search_document_to_graph_ref
- snapshot_group:private_retrieval:edge_family:validation_handoff_to_validation_gate
- snapshot_group:private_retrieval:evidence_route
- snapshot_group:private_retrieval:private_retrieval_trace
- snapshot_group:private_retrieval:private_search_document
- snapshot_group:private_retrieval:retrieval_candidate
- snapshot_group:private_retrieval:validation_handoff

## Source And Attribution

- graph_manifest:rafiq-cp27-refresh-private-resource-graph
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/private-retrieval.snapshot.json
- cp26:s03:snapshot:private_retrieval
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json

## Details

| Signal | Value |
| --- | --- |
| linkedNodes | 11 |
| qualityWarnings | 59 |
| unresolvedReferences | 5 |
| baselineComparisonMode | changed |

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
