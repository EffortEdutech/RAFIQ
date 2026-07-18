---
artifact_id: "vault:source:source:tanzil"
artifact_type: "source_approval_pack"
title: "Source Pack - Tanzil resources"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["ingest:source_registry:tanzil"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph"]
graph_node_ids: ["source:tanzil"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "unverified"
---

# Source Pack - Tanzil resources

## Summary

Private source approval pack for `source:tanzil`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- ingest:source_registry:tanzil

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph

## Evidence Graph

Graph node IDs:

- source:tanzil

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| source:tanzil | source | sources | public_blocked | pending | unverified |

| Field | Value |
| --- | --- |
| sourceKey | "tanzil" |
| name | "Tanzil resources" |
| provider | "Tanzil Project" |
| domain | "quran_metadata" |
| authorityClassification | "manifest_derived" |
| activeState | "active" |

## Quality And Review State

- Review state: `pending`
- Quality state: `unverified`
- Release state: `public_blocked`
- Public safe: `false`



## Release Boundary

This pack is private-local and developer-private. It must not be exposed through
public RAFIQ routes, public APIs, or public vault exports without a separate
release approval plan.

## Open Questions Or Blockers

- Source node is not public safe.
- Vault packs are review/navigation artifacts only and must not be treated as canonical source data.
- Public-safe status remains false until source licensing, attribution, editorial, and scholar review gates approve release.
