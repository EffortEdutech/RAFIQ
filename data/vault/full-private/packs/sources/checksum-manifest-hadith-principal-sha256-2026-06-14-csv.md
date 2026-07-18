---
artifact_id: "vault:source:checksum_manifest:hadith_principal_sha256_2026-06-14.csv"
artifact_type: "source_approval_pack"
title: "Source Pack - HADITH_PRINCIPAL_SHA256_2026-06-14.csv"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["data:checksums:data/checksums/HADITH_PRINCIPAL_SHA256_2026-06-14.csv"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph"]
graph_node_ids: ["checksum_manifest:hadith_principal_sha256_2026-06-14.csv"]
release_state: "public_blocked"
review_state: "pending"
quality_state: "clean"
---

# Source Pack - HADITH_PRINCIPAL_SHA256_2026-06-14.csv

## Summary

Private source approval pack for `checksum_manifest:hadith_principal_sha256_2026-06-14.csv`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- data:checksums:data/checksums/HADITH_PRINCIPAL_SHA256_2026-06-14.csv

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph

## Evidence Graph

Graph node IDs:

- checksum_manifest:hadith_principal_sha256_2026-06-14.csv

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| checksum_manifest:hadith_principal_sha256_2026-06-14.csv | checksum_manifest | sources | public_blocked | pending | clean |

| Field | Value |
| --- | --- |
| path | "data/checksums/HADITH_PRINCIPAL_SHA256_2026-06-14.csv" |
| checksumCount | 164 |
| generatedAt | null |
| checksumSha256 | "23F084885905BCD23E80DADDB0B18A7F3CE664AA8744B880719428C5F4F3CAED" |

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
