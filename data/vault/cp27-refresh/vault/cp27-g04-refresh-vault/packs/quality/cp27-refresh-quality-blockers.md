---
artifact_id: "vault:cp27:quality:blockers"
artifact_type: "quality_blocker_pack"
title: "CP27 Refresh Quality And Blocker Summary"
category: "quality"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-17T00:00:00.000Z"
generated_by: "scripts/generate_cp27_g04_vault_packs.mjs"
source_graph_id: "rafiq-cp27-refresh-private-resource-graph"
source_graph_checkpoint: "CP27-G03"
canonical_refs: ["data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/manifest.json", "snapshot_group:cross_domain_links:edge_family:theme_to_hadith", "snapshot_group:cross_domain_links:quran_hadith_link", "snapshot_group:cross_domain_links", "snapshot_group:hadith_quality:edge_family:grade_assertion_to_quality_state", "snapshot_group:hadith_quality:edge_family:hadith_record_to_grade_assertion", "snapshot_group:hadith_quality:edge_family:hadith_record_to_verification_claim", "snapshot_group:hadith_quality:hadith_grade_assertion", "snapshot_group:hadith_quality:hadith_verification_claim", "snapshot_group:hadith_quality:quality_finding", "snapshot_group:hadith_quality", "snapshot_group:cross_domain_links:edge_family:related_ayah_to_ayah", "snapshot_group:cross_domain_links:related_hadith_link", "snapshot_group:private_audit:audit_event", "snapshot_group:private_audit:edge_family:audit_event_to_decision_ledger_entry", "snapshot_group:private_audit:edge_family:audit_event_to_review_queue_item", "snapshot_group:private_audit:remediation_transition", "snapshot_group:private_audit", "snapshot_group:private_retrieval:edge_family:candidate_to_evidence_route", "snapshot_group:private_retrieval:edge_family:evidence_route_to_validation_handoff", "snapshot_group:private_retrieval:edge_family:retrieval_trace_to_candidate", "snapshot_group:private_retrieval:edge_family:search_document_to_graph_ref", "snapshot_group:private_retrieval:edge_family:validation_handoff_to_validation_gate", "snapshot_group:private_retrieval:evidence_route", "snapshot_group:private_retrieval:private_retrieval_trace", "snapshot_group:private_retrieval:private_search_document", "snapshot_group:private_retrieval:retrieval_candidate", "snapshot_group:private_retrieval", "snapshot_group:private_retrieval:validation_handoff", "snapshot_group:private_review:edge_family:review_queue_item_to_blocker", "snapshot_group:private_review:edge_family:review_queue_item_to_graph_ref", "snapshot_group:private_review:edge_family:review_queue_item_to_review_state", "snapshot_group:private_review:private_review_queue_item", "snapshot_group:private_review:review_blocker", "snapshot_group:private_review:review_decision_context", "snapshot_group:private_review", "snapshot_group:hadith_quality:edge_family:grade_assertion_to_normalization", "snapshot_group:hadith_quality:edge_family:verification_claim_to_reference", "snapshot_group:hadith_quality:hadith_grade_normalization", "snapshot_group:hadith_quality:hadith_verification_reference", "snapshot_group:private_audit:audit_actor_reference", "snapshot_group:private_audit:decision_ledger_entry", "snapshot_group:private_audit:edge_family:audit_event_to_graph_ref", "snapshot_group:private_audit:edge_family:decision_ledger_entry_to_remediation_transition", "snapshot_group:private_review:edge_family:review_blocker_to_remediation_state", "snapshot_group:private_review:edge_family:review_queue_item_to_assignment", "snapshot_group:private_review:remediation_state", "snapshot_group:private_review:review_assignment", "snapshot_group:raw_lineage:edge_family:raw_lineage_summary_to_import_run", "snapshot_group:raw_lineage:edge_family:validation_finding_to_quality_state", "snapshot_group:raw_lineage:parser_assignment", "snapshot_group:raw_lineage:raw_lineage_summary", "snapshot_group:raw_lineage", "snapshot_group:raw_lineage:validation_finding", "snapshot_group:cross_domain_links:cross_domain_link", "snapshot_group:cross_domain_links:edge_family:ayah_to_hadith", "snapshot_group:cross_domain_links:edge_family:related_hadith_to_hadith", "snapshot_group:cross_domain_links:theme_resource_link", "snapshot_group:raw_lineage:edge_family:parser_assignment_to_source_snapshot", "snapshot_group:raw_lineage:edge_family:raw_lineage_summary_to_validation_finding", "snapshot_group:raw_lineage:import_run", "snapshot_group:raw_lineage:transformation_event", "snapshot_group:tafsir:edge_family:tafsir_edition_to_passage_reference", "snapshot_group:tafsir:edge_family:tafsir_passage_reference_to_ayah", "snapshot_group:tafsir:edge_family:tafsir_passage_reference_to_source", "snapshot_group:tafsir", "snapshot_group:tafsir:tafsir_ayah_link", "snapshot_group:tafsir:tafsir_edition", "snapshot_group:tafsir:tafsir_passage_reference", "snapshot_group:cross_domain_links:edge_family:theme_to_ayah", "snapshot_group:cross_domain_links:related_ayah_link"]
source_refs: ["graph_manifest:rafiq-cp27-refresh-private-resource-graph", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/cross-domain-links.snapshot.json", "cp26:s03:snapshot:cross_domain_links", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/hadith-quality.snapshot.json", "cp26:s03:snapshot:hadith_quality", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/private-audit.snapshot.json", "cp26:s03:snapshot:private_audit", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/private-retrieval.snapshot.json", "cp26:s03:snapshot:private_retrieval", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/private-review.snapshot.json", "cp26:s03:snapshot:private_review", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/raw-lineage.snapshot.json", "cp26:s03:snapshot:raw_lineage", "data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/tafsir.snapshot.json", "cp26:s03:snapshot:tafsir"]
graph_node_ids: ["cp27:hadith:cross_domain_links:edge_family:theme_to_hadith", "cp27:hadith:cross_domain_links:quran_hadith_link:quran_hadith_link", "cp27:hadith:cross_domain_links:snapshot_group:cross_domain_links", "cp27:hadith-grades:hadith_quality:edge_family:grade_assertion_to_quality_state", "cp27:hadith-grades:hadith_quality:edge_family:hadith_record_to_grade_assertion", "cp27:hadith-grades:hadith_quality:edge_family:hadith_record_to_verification_claim", "cp27:hadith-grades:hadith_quality:hadith_grade_assertion:hadith_grade_assertion", "cp27:hadith-grades:hadith_quality:hadith_verification_claim:hadith_verification_claim", "cp27:hadith-grades:hadith_quality:quality_finding:quality_finding", "cp27:hadith-grades:hadith_quality:snapshot_group:hadith_quality", "cp27:product-evidence:cross_domain_links:edge_family:related_ayah_to_ayah", "cp27:product-evidence:cross_domain_links:related_hadith_link:related_hadith_link", "cp27:product-evidence:cross_domain_links:snapshot_group:cross_domain_links", "cp27:product-evidence:private_audit:audit_event:audit_event", "cp27:product-evidence:private_audit:edge_family:audit_event_to_decision_ledger_entry", "cp27:product-evidence:private_audit:edge_family:audit_event_to_review_queue_item", "cp27:product-evidence:private_audit:remediation_transition:remediation_transition", "cp27:product-evidence:private_audit:snapshot_group:private_audit", "cp27:product-evidence:private_retrieval:edge_family:candidate_to_evidence_route", "cp27:product-evidence:private_retrieval:edge_family:evidence_route_to_validation_handoff", "cp27:product-evidence:private_retrieval:edge_family:retrieval_trace_to_candidate", "cp27:product-evidence:private_retrieval:edge_family:search_document_to_graph_ref", "cp27:product-evidence:private_retrieval:edge_family:validation_handoff_to_validation_gate", "cp27:product-evidence:private_retrieval:evidence_route:evidence_route", "cp27:product-evidence:private_retrieval:private_retrieval_trace:private_retrieval_trace", "cp27:product-evidence:private_retrieval:private_search_document:private_search_document", "cp27:product-evidence:private_retrieval:retrieval_candidate:retrieval_candidate", "cp27:product-evidence:private_retrieval:snapshot_group:private_retrieval", "cp27:product-evidence:private_retrieval:validation_handoff:validation_handoff", "cp27:product-evidence:private_review:edge_family:review_queue_item_to_blocker", "cp27:product-evidence:private_review:edge_family:review_queue_item_to_graph_ref", "cp27:product-evidence:private_review:edge_family:review_queue_item_to_review_state", "cp27:product-evidence:private_review:private_review_queue_item:private_review_queue_item", "cp27:product-evidence:private_review:review_blocker:review_blocker", "cp27:product-evidence:private_review:review_decision_context:review_decision_context", "cp27:product-evidence:private_review:snapshot_group:private_review", "cp27:quality:hadith_quality:edge_family:grade_assertion_to_normalization", "cp27:quality:hadith_quality:edge_family:verification_claim_to_reference", "cp27:quality:hadith_quality:hadith_grade_normalization:hadith_grade_normalization", "cp27:quality:hadith_quality:hadith_verification_reference:hadith_verification_reference", "cp27:quality:hadith_quality:snapshot_group:hadith_quality", "cp27:quality:private_audit:audit_actor_reference:audit_actor_reference", "cp27:quality:private_audit:decision_ledger_entry:decision_ledger_entry", "cp27:quality:private_audit:edge_family:audit_event_to_graph_ref", "cp27:quality:private_audit:edge_family:decision_ledger_entry_to_remediation_transition", "cp27:quality:private_audit:snapshot_group:private_audit", "cp27:quality:private_review:edge_family:review_blocker_to_remediation_state", "cp27:quality:private_review:edge_family:review_queue_item_to_assignment", "cp27:quality:private_review:remediation_state:remediation_state", "cp27:quality:private_review:review_assignment:review_assignment", "cp27:quality:private_review:snapshot_group:private_review", "cp27:quality:raw_lineage:edge_family:raw_lineage_summary_to_import_run", "cp27:quality:raw_lineage:edge_family:validation_finding_to_quality_state", "cp27:quality:raw_lineage:parser_assignment:parser_assignment", "cp27:quality:raw_lineage:raw_lineage_summary:raw_lineage_summary", "cp27:quality:raw_lineage:snapshot_group:raw_lineage", "cp27:quality:raw_lineage:validation_finding:validation_finding", "cp27:quran:cross_domain_links:cross_domain_link:cross_domain_link", "cp27:quran:cross_domain_links:edge_family:ayah_to_hadith", "cp27:quran:cross_domain_links:edge_family:related_hadith_to_hadith", "cp27:quran:cross_domain_links:snapshot_group:cross_domain_links", "cp27:quran:cross_domain_links:theme_resource_link:theme_resource_link", "cp27:sources:raw_lineage:edge_family:parser_assignment_to_source_snapshot", "cp27:sources:raw_lineage:edge_family:raw_lineage_summary_to_validation_finding", "cp27:sources:raw_lineage:import_run:import_run", "cp27:sources:raw_lineage:snapshot_group:raw_lineage", "cp27:sources:raw_lineage:transformation_event:transformation_event", "cp27:tafsir:tafsir:edge_family:tafsir_edition_to_passage_reference", "cp27:tafsir:tafsir:edge_family:tafsir_passage_reference_to_ayah", "cp27:tafsir:tafsir:edge_family:tafsir_passage_reference_to_source", "cp27:tafsir:tafsir:snapshot_group:tafsir", "cp27:tafsir:tafsir:tafsir_ayah_link:tafsir_ayah_link", "cp27:tafsir:tafsir:tafsir_edition:tafsir_edition", "cp27:tafsir:tafsir:tafsir_passage_reference:tafsir_passage_reference", "cp27:topics:cross_domain_links:edge_family:theme_to_ayah", "cp27:topics:cross_domain_links:related_ayah_link:related_ayah_link", "cp27:topics:cross_domain_links:snapshot_group:cross_domain_links"]
release_states: ["private_blocked"]
quality_states: ["review_required"]
raw_text_bodies_exported: false
public_release_approved: false
---

# CP27 Refresh Quality And Blocker Summary

## Summary

Quality pack for 77 refreshed graph nodes that remain in review-required state.

This is a generated private RAFIQ Knowledge Vault artifact for the CP27 refreshed graph. It is a review and navigation pack, not canonical source data, not source text, and not public release approval.

## Graph Links

- cp27:hadith:cross_domain_links:edge_family:theme_to_hadith
- cp27:hadith:cross_domain_links:quran_hadith_link:quran_hadith_link
- cp27:hadith:cross_domain_links:snapshot_group:cross_domain_links
- cp27:hadith-grades:hadith_quality:edge_family:grade_assertion_to_quality_state
- cp27:hadith-grades:hadith_quality:edge_family:hadith_record_to_grade_assertion
- cp27:hadith-grades:hadith_quality:edge_family:hadith_record_to_verification_claim
- cp27:hadith-grades:hadith_quality:hadith_grade_assertion:hadith_grade_assertion
- cp27:hadith-grades:hadith_quality:hadith_verification_claim:hadith_verification_claim
- cp27:hadith-grades:hadith_quality:quality_finding:quality_finding
- cp27:hadith-grades:hadith_quality:snapshot_group:hadith_quality
- cp27:product-evidence:cross_domain_links:edge_family:related_ayah_to_ayah
- cp27:product-evidence:cross_domain_links:related_hadith_link:related_hadith_link
- cp27:product-evidence:cross_domain_links:snapshot_group:cross_domain_links
- cp27:product-evidence:private_audit:audit_event:audit_event
- cp27:product-evidence:private_audit:edge_family:audit_event_to_decision_ledger_entry
- cp27:product-evidence:private_audit:edge_family:audit_event_to_review_queue_item
- cp27:product-evidence:private_audit:remediation_transition:remediation_transition
- cp27:product-evidence:private_audit:snapshot_group:private_audit
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
- cp27:product-evidence:private_review:edge_family:review_queue_item_to_blocker
- cp27:product-evidence:private_review:edge_family:review_queue_item_to_graph_ref
- cp27:product-evidence:private_review:edge_family:review_queue_item_to_review_state
- cp27:product-evidence:private_review:private_review_queue_item:private_review_queue_item
- cp27:product-evidence:private_review:review_blocker:review_blocker
- cp27:product-evidence:private_review:review_decision_context:review_decision_context
- cp27:product-evidence:private_review:snapshot_group:private_review
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
- cp27:quran:cross_domain_links:cross_domain_link:cross_domain_link
- cp27:quran:cross_domain_links:edge_family:ayah_to_hadith
- cp27:quran:cross_domain_links:edge_family:related_hadith_to_hadith
- cp27:quran:cross_domain_links:snapshot_group:cross_domain_links
- cp27:quran:cross_domain_links:theme_resource_link:theme_resource_link
- cp27:sources:raw_lineage:edge_family:parser_assignment_to_source_snapshot
- cp27:sources:raw_lineage:edge_family:raw_lineage_summary_to_validation_finding
- cp27:sources:raw_lineage:import_run:import_run
- cp27:sources:raw_lineage:snapshot_group:raw_lineage
- cp27:sources:raw_lineage:transformation_event:transformation_event
- cp27:tafsir:tafsir:edge_family:tafsir_edition_to_passage_reference
- cp27:tafsir:tafsir:edge_family:tafsir_passage_reference_to_ayah
- cp27:tafsir:tafsir:edge_family:tafsir_passage_reference_to_source
- cp27:tafsir:tafsir:snapshot_group:tafsir
- cp27:tafsir:tafsir:tafsir_ayah_link:tafsir_ayah_link
- cp27:tafsir:tafsir:tafsir_edition:tafsir_edition
- cp27:tafsir:tafsir:tafsir_passage_reference:tafsir_passage_reference
- cp27:topics:cross_domain_links:edge_family:theme_to_ayah
- cp27:topics:cross_domain_links:related_ayah_link:related_ayah_link
- cp27:topics:cross_domain_links:snapshot_group:cross_domain_links

## Canonical References

- data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/manifest.json
- snapshot_group:cross_domain_links:edge_family:theme_to_hadith
- snapshot_group:cross_domain_links:quran_hadith_link
- snapshot_group:cross_domain_links
- snapshot_group:hadith_quality:edge_family:grade_assertion_to_quality_state
- snapshot_group:hadith_quality:edge_family:hadith_record_to_grade_assertion
- snapshot_group:hadith_quality:edge_family:hadith_record_to_verification_claim
- snapshot_group:hadith_quality:hadith_grade_assertion
- snapshot_group:hadith_quality:hadith_verification_claim
- snapshot_group:hadith_quality:quality_finding
- snapshot_group:hadith_quality
- snapshot_group:cross_domain_links:edge_family:related_ayah_to_ayah
- snapshot_group:cross_domain_links:related_hadith_link
- snapshot_group:private_audit:audit_event
- snapshot_group:private_audit:edge_family:audit_event_to_decision_ledger_entry
- snapshot_group:private_audit:edge_family:audit_event_to_review_queue_item
- snapshot_group:private_audit:remediation_transition
- snapshot_group:private_audit
- snapshot_group:private_retrieval:edge_family:candidate_to_evidence_route
- snapshot_group:private_retrieval:edge_family:evidence_route_to_validation_handoff
- snapshot_group:private_retrieval:edge_family:retrieval_trace_to_candidate
- snapshot_group:private_retrieval:edge_family:search_document_to_graph_ref
- snapshot_group:private_retrieval:edge_family:validation_handoff_to_validation_gate
- snapshot_group:private_retrieval:evidence_route
- snapshot_group:private_retrieval:private_retrieval_trace
- snapshot_group:private_retrieval:private_search_document
- snapshot_group:private_retrieval:retrieval_candidate
- snapshot_group:private_retrieval
- snapshot_group:private_retrieval:validation_handoff
- snapshot_group:private_review:edge_family:review_queue_item_to_blocker
- snapshot_group:private_review:edge_family:review_queue_item_to_graph_ref
- snapshot_group:private_review:edge_family:review_queue_item_to_review_state
- snapshot_group:private_review:private_review_queue_item
- snapshot_group:private_review:review_blocker
- snapshot_group:private_review:review_decision_context
- snapshot_group:private_review
- snapshot_group:hadith_quality:edge_family:grade_assertion_to_normalization
- snapshot_group:hadith_quality:edge_family:verification_claim_to_reference
- snapshot_group:hadith_quality:hadith_grade_normalization
- snapshot_group:hadith_quality:hadith_verification_reference
- snapshot_group:private_audit:audit_actor_reference
- snapshot_group:private_audit:decision_ledger_entry
- snapshot_group:private_audit:edge_family:audit_event_to_graph_ref
- snapshot_group:private_audit:edge_family:decision_ledger_entry_to_remediation_transition
- snapshot_group:private_review:edge_family:review_blocker_to_remediation_state
- snapshot_group:private_review:edge_family:review_queue_item_to_assignment
- snapshot_group:private_review:remediation_state
- snapshot_group:private_review:review_assignment
- snapshot_group:raw_lineage:edge_family:raw_lineage_summary_to_import_run
- snapshot_group:raw_lineage:edge_family:validation_finding_to_quality_state
- snapshot_group:raw_lineage:parser_assignment
- snapshot_group:raw_lineage:raw_lineage_summary
- snapshot_group:raw_lineage
- snapshot_group:raw_lineage:validation_finding
- snapshot_group:cross_domain_links:cross_domain_link
- snapshot_group:cross_domain_links:edge_family:ayah_to_hadith
- snapshot_group:cross_domain_links:edge_family:related_hadith_to_hadith
- snapshot_group:cross_domain_links:theme_resource_link
- snapshot_group:raw_lineage:edge_family:parser_assignment_to_source_snapshot
- snapshot_group:raw_lineage:edge_family:raw_lineage_summary_to_validation_finding
- snapshot_group:raw_lineage:import_run
- snapshot_group:raw_lineage:transformation_event
- snapshot_group:tafsir:edge_family:tafsir_edition_to_passage_reference
- snapshot_group:tafsir:edge_family:tafsir_passage_reference_to_ayah
- snapshot_group:tafsir:edge_family:tafsir_passage_reference_to_source
- snapshot_group:tafsir
- snapshot_group:tafsir:tafsir_ayah_link
- snapshot_group:tafsir:tafsir_edition
- snapshot_group:tafsir:tafsir_passage_reference
- snapshot_group:cross_domain_links:edge_family:theme_to_ayah
- snapshot_group:cross_domain_links:related_ayah_link

## Source And Attribution

- graph_manifest:rafiq-cp27-refresh-private-resource-graph
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/cross-domain-links.snapshot.json
- cp26:s03:snapshot:cross_domain_links
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/hadith-quality.snapshot.json
- cp26:s03:snapshot:hadith_quality
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/private-audit.snapshot.json
- cp26:s03:snapshot:private_audit
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/private-retrieval.snapshot.json
- cp26:s03:snapshot:private_retrieval
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/private-review.snapshot.json
- cp26:s03:snapshot:private_review
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/raw-lineage.snapshot.json
- cp26:s03:snapshot:raw_lineage
- data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/tafsir.snapshot.json
- cp26:s03:snapshot:tafsir

## Details

| Signal | Value |
| --- | --- |
| unresolvedReferences | 77 |
| highOrCriticalBlockers | 30 |
| reviewRequiredNodes | 77 |
| deferredItems | 3 |
| blockedItems | 1 |

## Release Boundary

- Public safe: `false`
- Public release approved: `false`
- Raw text bodies exported: `false`
- CP22 vault baseline overwritten: `false`

## Blockers

- Unresolved references and high/critical blockers remain visible and unresolved in CP27-G04.
- Public release remains blocked.
- Vault packs are generated review/navigation artifacts only.
