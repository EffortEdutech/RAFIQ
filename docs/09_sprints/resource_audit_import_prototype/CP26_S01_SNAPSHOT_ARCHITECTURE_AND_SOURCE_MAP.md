# CP26-S01 - Snapshot Architecture And Source Map

Date: 2026-07-15

Checkpoint: CP26-S01 - Snapshot Architecture And Source Map

Status: Complete

## 1. Purpose

CP26-S01 locks the private snapshot architecture and source map for CP26 before any export or refresh implementation begins.

The purpose is to move RAFIQ from checked-in generated CP22, CP24, and CP25 prototype artifacts toward repeatable private snapshot export and refresh, while preserving canonical source authority, provenance, release boundaries, reviewer auditability, and the public-release block.

CP26-S01 does not export live database rows. It does not refresh graph, vault, retrieval, reviewer, audit, or remediation artifacts. It defines the architecture, source groups, dependency map, naming policy, rollback policy, and verifier plan that later CP26 checkpoints must follow.

## 2. Baseline

CP26-S01 inherits the CP25 close-out decision:

```powershell
node scripts\check_cp25_a09_close_out.mjs
```

Relevant inherited artifact state:

| Area | Baseline |
| --- | ---: |
| CP22 graph nodes | 79,657 |
| CP22 graph edges | 147,689 |
| CP22 vault artifacts | 158 |
| CP22 public-safe graph nodes | 0 |
| CP22 public-safe graph edges | 0 |
| CP22 public-safe vault artifacts | 0 |
| CP24 fixtures | 10 |
| CP24 selected candidates | 15 |
| CP24 remediation items | 72 |
| CP25 review queue items | 72 |
| CP25 remediation states | 72 |
| CP25 audit events | 72 |
| CP25 decision ledger entries | 72 |
| CP25 unresolved actions | 66 |
| CP25 high/critical open blockers | 12 |
| CP25 public-safe graph, vault, retrieval, review, audit, and remediation artifacts | 0 |

Primary baseline files:

| File | Role |
| --- | --- |
| `data/graphify/full-private/manifest.json` | CP22 full private graph manifest and partition/index checksum source. |
| `data/vault/full-private/manifest.json` | CP22 full private vault manifest and vault-pack checksum source. |
| `data/retrieval/cp24/manifest.json` | CP24 retrieval, ranking, validation handoff, graph, and vault dependency manifest. |
| `data/review/cp25/manifest.json` | CP25 review queue and remediation state manifest. |
| `data/review/cp25/audit-decision-ledger-manifest.json` | CP25 audit event and decision ledger manifest. |
| `data/review/cp25/a07-export-manifest.json` | CP25 final audit/remediation export proof manifest. |

## 3. Snapshot Architecture

CP26 will use a batch-oriented private snapshot architecture.

```text
canonical/source layers
  -> CP26 bounded source snapshots
  -> CP26 snapshot batch manifest and checksum ledger
  -> refresh inputs for CP22 graph, CP22 vault, CP24 retrieval, CP25 reviewer workflow
  -> refreshed private outputs with sourceSnapshotBatchId
  -> CP26 combined verifier
```

The architecture has five layers:

| Layer | Purpose | Public boundary |
| --- | --- | --- |
| Source authority layer | Canonical `content.*`, `ingest.*`, `staging.*`, manifests, checksums, and generated proof artifacts. | Private; canonical authority stays here. |
| Snapshot input layer | Bounded CP26 JSON snapshots grouped by source domain and workflow domain. | Private; not a full database dump. |
| Manifest and checksum layer | Batch manifest, per-file checksums, source scope, counts, and public boundary state. | Private; public-safe defaults to false. |
| Refresh layer | Rebuilds private graph, vault, retrieval, review, audit, and remediation working artifacts from snapshot inputs. | Private; no public routes. |
| Verification and rollback layer | Verifies manifest integrity, compares before/after outputs, reports unresolved refs, and records rollback targets. | Private; blocks public release. |

## 4. Source Table And Export Map

CP26 snapshots must preserve the CP22-G01 source map while grouping it into safe export families.

| Snapshot group | Source tables/files | CP26 snapshot role | Required handling |
| --- | --- | --- | --- |
| `source_registry` | `ingest.source_registry`, `ingest.source_snapshots`, `data/manifests/*.json`, `data/checksums/*` | Source identity, licensing, attribution, checksum, and raw snapshot backbone. | Bounded metadata only; no secret-bearing config; public-safe false. |
| `raw_lineage` | `ingest.raw_objects`, `ingest.import_runs`, `ingest.validation_findings`, `ingest.transformation_events`, `ingest.record_lineage`, `ingest.raw_object_parser_assignments` | Import and lineage traceability. | Include IDs, checksums, parser assignment, validation status, and lineage refs; omit raw bodies unless explicitly approved later. |
| `quran` | `content.quran_surahs`, `content.quran_ayahs`, `content.quran_text_editions`, `content.quran_ayah_texts`, `content.quran_partition_schemes`, `content.quran_partitions` | Quran identity, edition, and partition snapshot inputs for private graph refresh. | Preserve source/provenance/release refs; public-safe false. |
| `translations` | `content.translation_editions`, `content.translation_texts`, `content.translation_footnotes`, `content.translation_chunks` | Translation edition and ayah-linked translation snapshot inputs. | Preserve rights/attribution and release state; public-safe false. |
| `tafsir` | `content.tafsir_editions`, `content.tafsir_passages`, `content.tafsir_passage_ayahs` | Tafsir edition, passage, and ayah-link snapshot inputs. | Preserve quality warnings and source/release refs; public-safe false. |
| `topics_themes` | `content.source_taxonomies`, `content.source_topics`, `content.source_topic_relations`, `content.source_topic_ayahs`, `content.themes`, `content.theme_labels`, `content.theme_relations`, `content.source_topic_theme_mappings`, `content.source_ayah_theme_groups`, `content.source_ayah_theme_group_ayahs` | Topic, theme, and ayah grouping snapshot inputs. | Label source taxonomy versus RAFIQ-reviewed mapping; do not imply religious authority. |
| `hadith` | `content.hadith_collections`, `content.hadith_editions`, `content.hadith_books`, `content.hadith_chapters`, `content.hadith_records`, `content.hadith_text_versions`, `content.hadith_references`, `content.hadith_record_mappings` | Hadith collection, structure, record, text-version, and reference snapshot inputs. | Preserve source and release warnings; public-safe false. |
| `hadith_quality` | `content.hadith_grade_assertions`, `content.hadith_grade_normalizations`, `content.hadith_verification_claims`, `content.hadith_verification_references` | Grade, normalization, verification, and quality snapshot inputs. | Keep claims attributed and conflicting assertions visible. |
| `cross_domain_links` | `content.theme_ayah_links`, `content.theme_hadith_links`, `content.quran_hadith_links`, `content.related_ayahs`, `content.related_hadiths` | Cross-resource relationship refresh inputs. | Include origin, method, confidence/review state where available; unresolved refs must be reported. |
| `private_retrieval` | `content.private_search_documents`, `content.private_retrieval_traces`, `data/retrieval/cp24/*` | Private retrieval trace, candidate, ranking, route, and validation handoff snapshot inputs. | Operational relevance only; no religious authority upgrade. |
| `private_review` | `content.private_review_queue_items`, `data/review/cp25/review-queue.json`, `data/review/cp25/remediation-state.json` | Reviewer queue, assignment, blocker, and remediation state snapshot inputs. | Preserve open/high/critical blockers. |
| `private_audit` | `data/review/cp25/audit-events.json`, `data/review/cp25/decision-ledger.json`, `data/review/cp25/a07-*.json` | Reviewer action, decision ledger, audit export, and remediation transition snapshot inputs. | Append-aware; never overwrite history silently. |
| `graph_vault_baseline` | `data/graphify/full-private/manifest.json`, `data/graphify/full-private/partitions/*`, `data/graphify/full-private/indexes/*`, `data/vault/full-private/manifest.json` | Existing private graph/vault baseline for diff, checksum, and rollback. | Derived metadata only; canonical source refs remain separate. |

## 5. Private Artifact Dependency Map

Later CP26 refresh work must preserve this dependency chain:

| Output family | Depends on | Refresh rule |
| --- | --- | --- |
| CP22 graph partitions | `source_registry`, `raw_lineage`, `quran`, `translations`, `tafsir`, `topics_themes`, `hadith`, `hadith_quality`, `cross_domain_links`, `private_retrieval`, `private_review`, `private_audit` | Rebuild from snapshot batches and keep partition/index checksums. |
| CP22 vault packs | CP22 graph manifest and selected source/provenance/release refs | Regenerate from refreshed graph metadata; do not copy raw source text bodies by default. |
| CP24 retrieval artifacts | CP22 graph manifest, CP22 vault manifest, retrieval snapshots, validation snapshots | Recompute candidate/route/handoff summaries from bounded snapshot inputs. |
| CP25 review queue/remediation state | CP24 validation handoff and reviewer snapshot inputs | Preserve CP24 remediation IDs or provide deterministic replacement mapping. |
| CP25 audit/decision ledger | CP25 review queue/remediation state and audit snapshots | Append-aware refresh; never erase audit history. |
| CP26 checksum/diff/rollback artifacts | All snapshot inputs and refreshed outputs | Compare against the prior manifest chain and record rollback target. |

Every refreshed output must carry:

- `sourceSnapshotBatchId`,
- `sourceSnapshotManifestPath`,
- `sourceSnapshotManifestSha256`,
- `generatedAt`,
- `generatedBy`,
- `privateOnly: true`,
- `publicReleaseApproved: false`,
- public-safe counts set to zero unless a later approved public gate changes them.

## 6. Folder And Manifest Naming Policy

CP26 implementation should use this folder shape:

```text
data/snapshots/cp26/
  batches/
    cp26-snapshot-YYYYMMDD-HHMMSS/
      manifest.json
      checksum-ledger.json
      source-registry.snapshot.json
      raw-lineage.snapshot.json
      quran.snapshot.json
      translations.snapshot.json
      tafsir.snapshot.json
      topics-themes.snapshot.json
      hadith.snapshot.json
      hadith-quality.snapshot.json
      cross-domain-links.snapshot.json
      private-retrieval.snapshot.json
      private-review.snapshot.json
      private-audit.snapshot.json
      graph-vault-baseline.snapshot.json
  latest-manifest.json
  rollback/
    rollback-manifest-YYYYMMDD-HHMMSS.json
  diff/
    diff-summary-YYYYMMDD-HHMMSS.json
```

Manifest rules:

| Field | Requirement |
| --- | --- |
| `schemaVersion` | Must start as `cp26.snapshot-batch-manifest.v1`. |
| `snapshotBatchId` | Stable batch ID, preferably `cp26-snapshot-YYYYMMDD-HHMMSS`. |
| `checkpoint` | CP26 checkpoint that produced the batch. |
| `privateOnly` | Must be `true`. |
| `publicReleaseApproved` | Must be `false`. |
| `sourceGroups` | Must list all included snapshot groups with paths, counts, and checksums. |
| `derivedOutputs` | Must list any refreshed graph, vault, retrieval, review, audit, remediation, diff, or rollback outputs. |
| `publicBoundary` | Must include public-safe counts and public route exposure status. |
| `warnings` | Must retain source licensing, provenance, release, and quality cautions. |

## 7. Public Boundary Policy

CP26 artifacts are private by default and must not be exposed to public routes.

Verifier rules:

- fail if any CP26 manifest has `privateOnly !== true`;
- fail if any CP26 manifest has `publicReleaseApproved !== false`;
- fail if any public-safe count is above zero;
- fail if any public route or public mobile screen is introduced for CP26 snapshot data;
- fail if graph/vault/retrieval/review/audit artifacts are described as canonical source data;
- fail if snapshot export reads or requires `.env` files, secrets, service-role keys, private tokens, or credentials.

## 8. Rollback And Diff Policy

CP26 refresh must be reversible at the artifact level.

Each refresh run should produce:

| Artifact | Purpose |
| --- | --- |
| `checksum-ledger.json` | Per-input and per-output checksums. |
| `diff-summary-*.json` | Counts for added, changed, unchanged, removed, unresolved, and blocked items. |
| `rollback-manifest-*.json` | Prior manifest paths, prior checksums, and restore target IDs. |
| `unresolved-reference-report.json` | Missing or mismatched source, graph, vault, retrieval, review, audit, and remediation references. |

Rollback is not a git reset. It is an explicit artifact restore plan for generated private outputs.

## 9. CP26-S02 Inputs

CP26-S02 should turn this architecture into typed contracts for:

- `Cp26SnapshotBatchManifest`,
- `Cp26SnapshotSourceGroup`,
- `Cp26SnapshotArtifactRef`,
- `Cp26ChecksumLedger`,
- `Cp26RefreshRun`,
- `Cp26PublicBoundaryStatus`,
- `Cp26RollbackManifest`,
- `Cp26UnresolvedReferenceReport`.

## 10. Verification Plan

CP26-S01 is verified by:

```powershell
node scripts\check_cp26_s01_snapshot_architecture_source_map.mjs
```

The verifier must confirm:

- CP26-S01 report exists and records complete status;
- snapshot architecture note exists;
- source table/export map covers source, Quran, translation, tafsir, topic/theme, hadith, quality, retrieval, review, audit, graph, and vault groups;
- private artifact dependency map exists;
- folder and manifest naming policy exists;
- public-boundary policy exists;
- rollback and diff policy exists;
- CP26 sprint plan marks S01 complete and S02 next;
- CP26 checklist marks all S01 rows as Pass;
- CP25 close-out remains the inherited baseline.

## 11. Completion Statement

CP26-S01 is complete.

Next checkpoint:

```text
CP26-S02 - Snapshot Contracts And Manifest Schema
```
