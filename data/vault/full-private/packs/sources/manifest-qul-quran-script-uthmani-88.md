---
artifact_id: "vault:source:manifest:qul-quran-script-uthmani-88"
artifact_type: "source_approval_pack"
title: "Source Pack - qul-quran-script-uthmani-88.json"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["data:manifests:data/manifests/qul-quran-script-uthmani-88.json"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "snapshot:qul-quran-script-uthmani-88", "provenance:source_snapshot:qul-quran-script-uthmani-88:manifest", "release_state:source_snapshot:qul-quran-script-uthmani-88:manifest"]
graph_node_ids: ["manifest:qul-quran-script-uthmani-88"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "clean"
---

# Source Pack - qul-quran-script-uthmani-88.json

## Summary

Private source approval pack for `manifest:qul-quran-script-uthmani-88`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- data:manifests:data/manifests/qul-quran-script-uthmani-88.json

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- snapshot:qul-quran-script-uthmani-88
- provenance:source_snapshot:qul-quran-script-uthmani-88:manifest
- release_state:source_snapshot:qul-quran-script-uthmani-88:manifest

## Evidence Graph

Graph node IDs:

- manifest:qul-quran-script-uthmani-88

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| manifest:qul-quran-script-uthmani-88 | source_manifest | sources | public_blocked | pending | clean |

| Field | Value |
| --- | --- |
| sourceId | "qul-quran-script-uthmani-88" |
| manifestPath | "data/manifests/qul-quran-script-uthmani-88.json" |
| status | "raw_validated_rights_blocked" |
| recordCountExpected | 6236 |
| recordCountActual | 6236 |
| checksumSha256 | "74B3267FE6594B5A0897A285214331428BCD667FCA81CE0D3C43AB7F9394267D" |
| rawFilePath | "data/raw/quran/qul/uthmani.json" |

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
