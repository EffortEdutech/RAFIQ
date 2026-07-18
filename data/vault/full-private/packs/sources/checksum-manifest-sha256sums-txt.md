---
artifact_id: "vault:source:checksum_manifest:sha256sums.txt"
artifact_type: "source_approval_pack"
title: "Source Pack - SHA256SUMS.txt"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["data:checksums:data/checksums/SHA256SUMS.txt"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph"]
graph_node_ids: ["checksum_manifest:sha256sums.txt"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "clean"
---

# Source Pack - SHA256SUMS.txt

## Summary

Private source approval pack for `checksum_manifest:sha256sums.txt`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- data:checksums:data/checksums/SHA256SUMS.txt

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph

## Evidence Graph

Graph node IDs:

- checksum_manifest:sha256sums.txt

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| checksum_manifest:sha256sums.txt | checksum_manifest | sources | public_blocked | pending | clean |

| Field | Value |
| --- | --- |
| path | "data/checksums/SHA256SUMS.txt" |
| checksumCount | 56 |
| generatedAt | null |
| checksumSha256 | "B759C1E00A150B9FCAC3B326AD6021013F67861FE80CE83A6716EEE1AC289411" |

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
