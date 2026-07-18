---
artifact_id: "vault:hadith:grade_assertion:collections_fawaz-hadith-api-v1_editions_ara-bukhari.json:aggregate"
artifact_type: "hadith_verification_pack"
title: "Hadith Pack - Collections Fawaz Hadith Api V1 Editions Ara Bukhari Json source grade assertion"
status: "generated"
environment: "private_local"
access_level: "developer_private"
public_safe: false
generated_at: "2026-07-12T08:34:17.884Z"
generated_by: "scripts/generate_cp22_vault_packs.mjs"
source_graph_id: "rafiq-full-private-resource-graph"
canonical_refs: ["data:hadith_raw_subtrees:collections/fawaz-hadith-api-v1/editions/ara-bukhari.json:grade"]
source_refs: ["graph_manifest:rafiq-full-private-resource-graph", "source:hadith-category:collections", "snapshot:hadith-resource:collections_fawaz-hadith-api-v1", "provenance:source_snapshot:hadith-resource:collections_fawaz-hadith-api-v1:manifest", "release_state:source_snapshot:hadith-resource:collections_fawaz-hadith-api-v1:manifest"]
graph_node_ids: ["grade_assertion:collections_fawaz-hadith-api-v1_editions_ara-bukhari.json:aggregate"]
release_state: "public_blocked"
review_state: "content_review"
quality_state: "warning"
---

# Hadith Pack - Collections Fawaz Hadith Api V1 Editions Ara Bukhari Json source grade assertion

## Summary

Private hadith verification pack for `grade_assertion:collections_fawaz-hadith-api-v1_editions_ara-bukhari.json:aggregate`.

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

- data:hadith_raw_subtrees:collections/fawaz-hadith-api-v1/editions/ara-bukhari.json:grade

## Source And Attribution

- graph_manifest:rafiq-full-private-resource-graph
- source:hadith-category:collections
- snapshot:hadith-resource:collections_fawaz-hadith-api-v1
- provenance:source_snapshot:hadith-resource:collections_fawaz-hadith-api-v1:manifest
- release_state:source_snapshot:hadith-resource:collections_fawaz-hadith-api-v1:manifest

## Evidence Graph

Graph node IDs:

- grade_assertion:collections_fawaz-hadith-api-v1_editions_ara-bukhari.json:aggregate

| Node ID | Type | Partition | Release | Review | Quality |
| --- | --- | --- | --- | --- | --- |
| grade_assertion:collections_fawaz-hadith-api-v1_editions_ara-bukhari.json:aggregate | hadith_grade_assertion | hadith-grades | public_blocked | content_review | warning |

| Field | Value |
| --- | --- |
| hadithRecordId | "hadith_record:collections_fawaz-hadith-api-v1_editions_ara-bukhari.json:aggregate" |
| sourceSnapshotId | "hadith-resource:collections_fawaz-hadith-api-v1" |
| graderNameRaw | "source dataset" |
| rawGrade | null |
| claimScope | "aggregate_subtree_grade_capable" |
| rawGradeExported | false |

## Quality And Review State

- Review state: `content_review`
- Quality state: `warning`
- Release state: `public_blocked`
- Public safe: `false`



## Release Boundary

This pack is private-local and developer-private. It must not be exposed through
public RAFIQ routes, public APIs, or public vault exports without a separate
release approval plan.

## Open Questions Or Blockers

- Hadith grade and verification claims remain source-qualified and need human review before public use.
- Vault packs are review/navigation artifacts only and must not be treated as canonical source data.
- Public-safe status remains false until source licensing, attribution, editorial, and scholar review gates approve release.
