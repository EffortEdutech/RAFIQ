---
artifact_id: "vault:source:manifest:tanzil-quran-uthmani-v1.1"
artifact_type: "source_approval_pack"
title: "Source Pack - tanzil-quran-uthmani-v1.1.json"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["data:manifests:data/manifests/tanzil-quran-uthmani-v1.1.json"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:tanzil-quran-uthmani-v1.1", "provenance:source_snapshot:tanzil-quran-uthmani-v1.1:manifest", "release_state:source_snapshot:tanzil-quran-uthmani-v1.1:manifest"]
graph_node_ids: ["manifest:tanzil-quran-uthmani-v1.1"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "unverified"
---

# Source Pack - tanzil-quran-uthmani-v1.1.json

## Summary

Private source approval pack for `manifest:tanzil-quran-uthmani-v1.1`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- data:manifests:data/manifests/tanzil-quran-uthmani-v1.1.json

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:tanzil-quran-uthmani-v1.1
- provenance:source_snapshot:tanzil-quran-uthmani-v1.1:manifest
- release_state:source_snapshot:tanzil-quran-uthmani-v1.1:manifest

## Evidence Graph

Graph node IDs:

- manifest:tanzil-quran-uthmani-v1.1

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| manifest:tanzil-quran-uthmani-v1.1 | source_manifest | sources | public_blocked | pending | unverified |

| Field | Value |
| --- | --- |
| sourceId | "tanzil-quran-uthmani-v1.1" |
| manifestPath | "data/manifests/tanzil-quran-uthmani-v1.1.json" |
| status | "staging_only" |
| recordCountExpected | 6236 |
| recordCountActual | 6236 |
| checksumSha256 | "091AE1BAA7F2D86C0B8F0915D490B181B1B8550442B28C2B1A6892D81C9A6D21" |
| rawFilePath | "data/raw/quran/tanzil/quran-uthmani-with-ayah-numbers.txt" |

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
