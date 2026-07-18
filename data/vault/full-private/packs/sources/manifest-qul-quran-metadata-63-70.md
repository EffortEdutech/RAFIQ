---
artifact_id: "vault:source:manifest:qul-quran-metadata-63-70"
artifact_type: "source_approval_pack"
title: "Source Pack - qul-quran-metadata-63-70.json"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["data:manifests:data/manifests/qul-quran-metadata-63-70.json"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:qul-quran-metadata-63-70", "provenance:source_snapshot:qul-quran-metadata-63-70:manifest", "release_state:source_snapshot:qul-quran-metadata-63-70:manifest"]
graph_node_ids: ["manifest:qul-quran-metadata-63-70"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "clean"
---

# Source Pack - qul-quran-metadata-63-70.json

## Summary

Private source approval pack for `manifest:qul-quran-metadata-63-70`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- data:manifests:data/manifests/qul-quran-metadata-63-70.json

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:qul-quran-metadata-63-70
- provenance:source_snapshot:qul-quran-metadata-63-70:manifest
- release_state:source_snapshot:qul-quran-metadata-63-70:manifest

## Evidence Graph

Graph node IDs:

- manifest:qul-quran-metadata-63-70

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| manifest:qul-quran-metadata-63-70 | source_manifest | sources | public_blocked | pending | clean |

| Field | Value |
| --- | --- |
| sourceId | "qul-quran-metadata-63-70" |
| manifestPath | "data/manifests/qul-quran-metadata-63-70.json" |
| status | "raw_validated_rights_blocked" |
| recordCountExpected | null |
| recordCountActual | null |
| checksumSha256 | "DF993B0DF1929FCB9C2B57E4396AEBC7A2CE55B71A14C7FC57A343087295DC83" |
| rawFilePath | "data/raw/quran/qul/" |

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
