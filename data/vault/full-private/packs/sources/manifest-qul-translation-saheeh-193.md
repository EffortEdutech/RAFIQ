---
artifact_id: "vault:source:manifest:qul-translation-saheeh-193"
artifact_type: "source_approval_pack"
title: "Source Pack - qul-translation-saheeh-193.json"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["data:manifests:data/manifests/qul-translation-saheeh-193.json"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:qul-translation-saheeh-193", "provenance:source_snapshot:qul-translation-saheeh-193:manifest", "release_state:source_snapshot:qul-translation-saheeh-193:manifest"]
graph_node_ids: ["manifest:qul-translation-saheeh-193"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "clean"
---

# Source Pack - qul-translation-saheeh-193.json

## Summary

Private source approval pack for `manifest:qul-translation-saheeh-193`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- data:manifests:data/manifests/qul-translation-saheeh-193.json

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:qul-translation-saheeh-193
- provenance:source_snapshot:qul-translation-saheeh-193:manifest
- release_state:source_snapshot:qul-translation-saheeh-193:manifest

## Evidence Graph

Graph node IDs:

- manifest:qul-translation-saheeh-193

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| manifest:qul-translation-saheeh-193 | source_manifest | sources | public_blocked | pending | clean |

| Field | Value |
| --- | --- |
| sourceId | "qul-translation-saheeh-193" |
| manifestPath | "data/manifests/qul-translation-saheeh-193.json" |
| status | "raw_validated_rights_blocked" |
| recordCountExpected | 6236 |
| recordCountActual | 6236 |
| checksumSha256 | "3F43617311C8F95AC6003FC33DC01D676837A2A30490796370FA529B3A711F14" |
| rawFilePath | "data/raw/translations/qul/" |

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
