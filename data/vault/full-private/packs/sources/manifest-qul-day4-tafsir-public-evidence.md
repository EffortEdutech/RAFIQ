---
artifact_id: "vault:source:manifest:qul-day4-tafsir-public-evidence"
artifact_type: "source_approval_pack"
title: "Source Pack - qul-day4-tafsir-public-evidence.json"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["data:manifests:data/manifests/qul-day4-tafsir-public-evidence.json"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:qul-day4-tafsir-public-evidence", "provenance:source_snapshot:qul-day4-tafsir-public-evidence:manifest", "release_state:source_snapshot:qul-day4-tafsir-public-evidence:manifest"]
graph_node_ids: ["manifest:qul-day4-tafsir-public-evidence"]
release_state: "private_available"
review_state: "pending"
quality_state: "unverified"
---

# Source Pack - qul-day4-tafsir-public-evidence.json

## Summary

Private source approval pack for `manifest:qul-day4-tafsir-public-evidence`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- data:manifests:data/manifests/qul-day4-tafsir-public-evidence.json

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:qul-day4-tafsir-public-evidence
- provenance:source_snapshot:qul-day4-tafsir-public-evidence:manifest
- release_state:source_snapshot:qul-day4-tafsir-public-evidence:manifest

## Evidence Graph

Graph node IDs:

- manifest:qul-day4-tafsir-public-evidence

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| manifest:qul-day4-tafsir-public-evidence | source_manifest | sources | private_available | pending | unverified |

| Field | Value |
| --- | --- |
| sourceId | "qul-day4-tafsir-public-evidence" |
| manifestPath | "data/manifests/qul-day4-tafsir-public-evidence.json" |
| status | "schema_discovery_only" |
| recordCountExpected | null |
| recordCountActual | null |
| checksumSha256 | "0BE1B38EE26E9A155E207365508CC039834CD079720481836DF36C04B919E7BE" |
| rawFilePath | "data/raw/day4/qul-evidence/" |

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
