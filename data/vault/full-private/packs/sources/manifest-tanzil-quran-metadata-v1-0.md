---
artifact_id: "vault:source:manifest:tanzil-quran-metadata-v1.0"
artifact_type: "source_approval_pack"
title: "Source Pack - tanzil-quran-metadata-v1.0.json"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["data:manifests:data/manifests/tanzil-quran-metadata-v1.0.json"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:tanzil-quran-metadata-v1.0", "provenance:source_snapshot:tanzil-quran-metadata-v1.0:manifest", "release_state:source_snapshot:tanzil-quran-metadata-v1.0:manifest"]
graph_node_ids: ["manifest:tanzil-quran-metadata-v1.0"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "unverified"
---

# Source Pack - tanzil-quran-metadata-v1.0.json

## Summary

Private source approval pack for `manifest:tanzil-quran-metadata-v1.0`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- data:manifests:data/manifests/tanzil-quran-metadata-v1.0.json

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:tanzil-quran-metadata-v1.0
- provenance:source_snapshot:tanzil-quran-metadata-v1.0:manifest
- release_state:source_snapshot:tanzil-quran-metadata-v1.0:manifest

## Evidence Graph

Graph node IDs:

- manifest:tanzil-quran-metadata-v1.0

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| manifest:tanzil-quran-metadata-v1.0 | source_manifest | sources | public_blocked | pending | unverified |

| Field | Value |
| --- | --- |
| sourceId | "tanzil-quran-metadata-v1.0" |
| manifestPath | "data/manifests/tanzil-quran-metadata-v1.0.json" |
| status | "staging_only" |
| recordCountExpected | 114 |
| recordCountActual | 114 |
| checksumSha256 | "E0E7479B96AC8C078A01997A8D4525786989FA977E729EFF3E7A69DF6B092B4D" |
| rawFilePath | "data/raw/quran/tanzil/quran-data.xml" |

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
