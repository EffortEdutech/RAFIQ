---
artifact_id: "vault:source:snapshot:qul-day4-topics-public-evidence"
artifact_type: "source_approval_pack"
title: "Source Pack - QUL Topics and Concepts Public Schema Evidence"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["ingest:source_snapshots:qul-day4-topics-public-evidence"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "source_manifest", "provenance:source_snapshot:qul-day4-topics-public-evidence:manifest", "release_state:source_snapshot:qul-day4-topics-public-evidence:manifest"]
graph_node_ids: ["snapshot:qul-day4-topics-public-evidence"]
release_state: "private_available"
review_state: "pending"
quality_state: "unverified"
---

# Source Pack - QUL Topics and Concepts Public Schema Evidence

## Summary

Private source approval pack for `snapshot:qul-day4-topics-public-evidence`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- ingest:source_snapshots:qul-day4-topics-public-evidence

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- source_manifest
- provenance:source_snapshot:qul-day4-topics-public-evidence:manifest
- release_state:source_snapshot:qul-day4-topics-public-evidence:manifest

## Evidence Graph

Graph node IDs:

- snapshot:qul-day4-topics-public-evidence

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| snapshot:qul-day4-topics-public-evidence | source_snapshot | sources | private_available | pending | unverified |

| Field | Value |
| --- | --- |
| sourceId | "qul" |
| snapshotKey | "qul-day4-topics-public-evidence" |
| versionLabel | "Public page accessed 2026-06-12" |
| acquiredAt | "2026-06-12" |
| rightsStatus | "unknown" |
| attributionStatus | "unknown" |
| technicalStatus | "schema_discovery_only" |
| publicationStatus | "public_blocked" |
| officialUrl | "https://qul.tarteel.ai/resources/ayah-topics/45" |
| licenseUrl | "https://qul.tarteel.ai/resources/45/copyright" |
| licenseName | "No copyright information supplied by QUL" |
| attribution | "QUL topic resource; ontology attribution includes Quranic Arabic Corpus and thematic attribution includes The Clear Quran" |

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
