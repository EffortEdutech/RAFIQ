---
artifact_id: "vault:source:raw_object:qul-day4-topics-public-evidence:principal"
artifact_type: "source_approval_pack"
title: "Source Pack - data/raw/day4/qul-evidence/topics-45.html"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["ingest:raw_objects:qul-day4-topics-public-evidence:principal"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:qul-day4-topics-public-evidence", "provenance:source_snapshot:qul-day4-topics-public-evidence:manifest", "release_state:source_snapshot:qul-day4-topics-public-evidence:manifest"]
graph_node_ids: ["raw_object:qul-day4-topics-public-evidence:principal"]
release_state: "private_available"
review_state: "pending"
quality_state: "unverified"
---

# Source Pack - data/raw/day4/qul-evidence/topics-45.html

## Summary

Private source approval pack for `raw_object:qul-day4-topics-public-evidence:principal`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- ingest:raw_objects:qul-day4-topics-public-evidence:principal

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:qul-day4-topics-public-evidence
- provenance:source_snapshot:qul-day4-topics-public-evidence:manifest
- release_state:source_snapshot:qul-day4-topics-public-evidence:manifest

## Evidence Graph

Graph node IDs:

- raw_object:qul-day4-topics-public-evidence:principal

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| raw_object:qul-day4-topics-public-evidence:principal | raw_object | sources | private_available | pending | unverified |

| Field | Value |
| --- | --- |
| snapshotId | "qul-day4-topics-public-evidence" |
| objectRole | "principal" |
| logicalName | "QUL Topics and Concepts Public Schema Evidence" |
| pathOrObjectKey | "data/raw/day4/qul-evidence/topics-45.html" |
| checksumSha256 | "045D027B26FA3872D7A989F09114D37F17518045096203424E9705DB65015754" |
| byteLength | null |
| mediaType | "HTML audit evidence; advertised dataset format is SQLite" |
| parseEligibility | "manifest_registered" |

## Quality And Review State

- Review state: `pending`
- Quality state: `unverified`
- Release state: `private_available`
- Public safe: `false`



## Release Boundary

This pack is private-local and developer-private. It must not be exposed through
public RAFIQ routes, public APIs, or public vault exports without a separate
release approval plan.

## Open Questions Or Blockers

- Source node is not public safe.
- Vault packs are review/navigation artifacts only and must not be treated as canonical source data.
- Public-safe status remains false until source licensing, attribution, editorial, and scholar review gates approve release.
