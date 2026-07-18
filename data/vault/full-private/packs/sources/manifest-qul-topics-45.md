---
artifact_id: "vault:source:manifest:qul-topics-45"
artifact_type: "source_approval_pack"
title: "Source Pack - qul-topics-45.json"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["data:manifests:data/manifests/qul-topics-45.json"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:qul-topics-45", "provenance:source_snapshot:qul-topics-45:manifest", "release_state:source_snapshot:qul-topics-45:manifest"]
graph_node_ids: ["manifest:qul-topics-45"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "clean"
---

# Source Pack - qul-topics-45.json

## Summary

Private source approval pack for `manifest:qul-topics-45`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- data:manifests:data/manifests/qul-topics-45.json

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:qul-topics-45
- provenance:source_snapshot:qul-topics-45:manifest
- release_state:source_snapshot:qul-topics-45:manifest

## Evidence Graph

Graph node IDs:

- manifest:qul-topics-45

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| manifest:qul-topics-45 | source_manifest | sources | public_blocked | pending | clean |

| Field | Value |
| --- | --- |
| sourceId | "qul-topics-45" |
| manifestPath | "data/manifests/qul-topics-45.json" |
| status | "raw_validated_rights_blocked" |
| recordCountExpected | 2512 |
| recordCountActual | 2512 |
| checksumSha256 | "D52AB080321A270D65C90F2C4892833E60A2C77002BCE9F22209451BCBB1BAB7" |
| rawFilePath | "data/raw/tafsir/topics.db" |

## Quality And Review State

- Review state: `pending`
- Quality state: `clean`
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
