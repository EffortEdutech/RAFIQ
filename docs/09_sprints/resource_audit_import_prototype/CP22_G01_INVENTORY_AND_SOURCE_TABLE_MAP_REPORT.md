# CP22-G01 - Inventory And Source Table Map Report

Date: 2026-07-11

Status: Complete for CP22-G01 planning

Scope: Full private RAFIQ resource graph inventory and source table map.

## 1. Purpose

CP22-G01 identifies the concrete RAFIQ sources, manifests, scripts, database tables, and generated artifacts that can feed the full private RAFIQ resource graph.

This report does not generate the graph. It defines the source map that CP22-G02 and later exporter checkpoints must follow.

## 2. Method

Loaded project guidance:

- `AGENTS.md`
- `docs/README.md`
- `docs/09_sprints/resource_audit_import_prototype/CP22_FULL_PRIVATE_RESOURCE_GRAPH_IMPLEMENTATION_SPRINT_PLAN.md`
- `docs/09_sprints/resource_audit_import_prototype/CP22_FULL_PRIVATE_RESOURCE_GRAPH_ACCEPTANCE_CHECKLIST.md`

Used Graphify before manual source inspection:

```powershell
.\scripts\graphify.ps1 query "CP22 G01 inventory source table map canonical Quran translation tafsir hadith source registry licensing import manifests Supabase tables" --graph "graphify-out\graph.json"
```

Graphify identified these relevant anchors:

- `docs/09_sprints/resource_audit_import_prototype/SOURCE_REGISTRY_CONTRACT_V2.md`
- `docs/09_sprints/resource_audit_import_prototype/canonical_schema_recommendation.md`
- `docs/09_sprints/resource_audit_import_prototype/staging_table_recommendation.md`
- `docs/09_sprints/resource_audit_import_prototype/PRIVATE_PLATFORM_IMPORT_ROADMAP.md`
- `docs/04_knowledge/RAFIQ_Source_Licensing_Register_V1.md`
- `scripts/inventory_hadith_raw_objects.py`
- CP21C graph, vault, and case-matrix docs.

Manually inspected:

- `data/README.md`
- `data/manifests/`
- `data/checksums/`
- `supabase/migrations/`
- Phase 3 parser scripts
- Phase 4 promotion scripts
- Phase 5 private retrieval, search, answer, and review migrations
- `scripts/verify_phase4_final.sql`

No `.env` files were read.

## 3. Current Documented Platform Status

The private platform import roadmap records:

| Phase | Status | CP22 relevance |
| --- | --- | --- |
| Phase 1 database implementation foundation | Complete on 2026-06-15 | Provides `ingest`, `staging`, and `content` schemas. |
| Phase 2 source registry and raw registration | Complete on 2026-06-16 | Provides source registry, snapshots, raw objects, checksums, parser assignments. |
| Phase 3 source loaders | Complete on 2026-06-17 | Provides staging rows for Quran, translations, tafsir, topics, themes, hadith, grades, and verification. |
| Phase 4 canonical promotion | Complete on 2026-06-17 | Provides canonical private content tables and release/provenance records. |
| Phase 5 private retrieval and product integration | Complete on 2026-06-19 | Provides private search, retrieval traces, review queues, answer drafts, validation runs, and app-facing private APIs. |
| Phase 6 public promotion | Design complete, public release NO-GO on 2026-06-20 | Confirms CP22 artifacts must remain private unless a separate public release plan approves otherwise. |

CP22 should therefore use the canonical `content` schema as the primary graph input, with `ingest` and `staging` retained as provenance and lineage backtrace layers.

## 4. Source Layers

| Layer | Location | Role in CP22 |
| --- | --- | --- |
| Raw manifests | `data/manifests/` | Source identity, raw file paths, checksums, counts, status, license and attribution notes. |
| Checksums | `data/checksums/` | Integrity verification and raw-object identity support. |
| Ingest schema | `ingest.*` | Source registry, snapshots, raw objects, import runs, findings, transformations, lineage. |
| Staging schema | `staging.*` | Source-shaped parsed records and candidate mappings. |
| Content schema | `content.*` | Canonical private graph input layer. |
| Private API schema/functions | `private_api.*` | App-facing private query and review surface. |
| Phase scripts | `scripts/parse_*`, `scripts/promote_phase4_*`, `scripts/verify_phase4_final.sql` | Parser, promotion, and count-verification evidence. |
| CP21C artifacts | `data/graphify/cp21c/`, `data/vault/cp21c/` | Prototype evidence only; not the full resource graph. |

## 5. Resource Inventory By Domain

| Domain | Existing manifest/file evidence | Ingest/staging inputs | Canonical inputs | Availability for CP22 |
| --- | --- | --- | --- | --- |
| Source registry and provenance | `data/manifests/*.json`, `data/manifests/hadith-raw-objects-2026-06-14.csv`, `data/manifests/hadith-raw-subtrees-2026-06-14.csv`, `data/checksums/SHA256SUMS.txt` | `ingest.source_registry`, `ingest.source_snapshots`, `ingest.raw_objects`, `ingest.import_runs`, `ingest.validation_findings`, `ingest.transformation_events`, `ingest.record_lineage`, `ingest.raw_object_parser_assignments` | `content.entity_provenance`, `content.entity_release_states` | Ready as graph backbone. |
| Quran identities and Arabic text | `tanzil-quran-uthmani-v1.1.json`, `tanzil-quran-metadata-v1.0.json`, `qul-quran-script-qpc-hafs-86.json`, `qul-quran-script-uthmani-88.json`, `qul-quran-metadata-63-70.json` | `staging.quran_ayah_texts`, `staging.quran_partitions` | `content.quran_surahs`, `content.quran_ayahs`, `content.quran_text_editions`, `content.quran_ayah_texts`, `content.quran_partition_schemes`, `content.quran_partitions` | Ready for private graph export. Public release remains gated by source/release status. |
| Translations | `tanzil-translation-en-sahih.json`, `tanzil-translation-ms-basmeih.json`, `tanzil-translation-id-indonesian.json`, `qul-translation-saheeh-193.json`, `qul-translation-malay-292.json` | `staging.translation_texts`, `staging.translation_footnotes`, `staging.translation_chunks` | `content.translation_editions`, `content.translation_texts`, `content.translation_footnotes`, `content.translation_chunks` | Ready for private graph export. Rights and attribution constraints must stay visible. |
| Tafsir | `qul-tafsir-english-mukhtasar-266.json`, `qul-tafsir-english-ibn-kathir-35.json`, `qul-tafsir-arabic-saadi-308.json`, `qul-day4-tafsir-public-evidence.json` | `staging.tafsir_passages`, `staging.tafsir_passage_ayahs` | `content.tafsir_editions`, `content.tafsir_passages`, `content.tafsir_passage_ayahs` | Ready for private graph export with quality and rights warnings. |
| Source topics and ayah themes | `qul-topics-45.json`, `qul-ayah-themes-62.json`, `qul-day4-topics-public-evidence.json`, `qul-day4-ayah-theme-public-evidence.json` | `staging.source_topics`, `staging.source_topic_relations`, `staging.source_topic_ayahs`, `staging.ayah_theme_groups`, `staging.ayah_theme_group_ayahs` | `content.source_taxonomies`, `content.source_topics`, `content.source_topic_relations`, `content.source_topic_ayahs`, `content.themes`, `content.theme_labels`, `content.theme_relations`, `content.source_topic_theme_mappings`, `content.source_ayah_theme_groups`, `content.source_ayah_theme_group_ayahs` | Ready for private graph export. Topic/theme links must be labeled as source metadata or reviewed product mappings, not authoritative interpretation. |
| Hadith collections and texts | `hadith-acquisition-category-summary-2026-06-14.csv`, `hadith-acquisition-resources-2026-06-14.csv`, `hadith-raw-subtrees-2026-06-14.csv`, `hadith-raw-objects-2026-06-14.csv` | `staging.hadith_collections`, `staging.hadith_editions`, `staging.hadith_books`, `staging.hadith_chapters`, `staging.hadith_records`, `staging.hadith_text_versions`, `staging.hadith_references`, `staging.hadith_record_references` | `content.hadith_collections`, `content.hadith_editions`, `content.hadith_books`, `content.hadith_chapters`, `content.hadith_records`, `content.hadith_text_versions`, `content.hadith_references`, `content.hadith_record_mappings` | Ready for private graph export at large scale. Public rights and provenance warnings must remain visible. |
| Hadith grades and verification | Hadith raw inventories plus SemakHadis and related verification resources | `staging.hadith_grade_assertions`, `staging.hadith_verification_claims`, `staging.hadith_annotations`, `staging.hadith_isnad_segments`, `staging.hadith_matn_segments`, `staging.hadith_narrators` | `content.hadith_grade_assertions`, `content.hadith_grade_normalizations`, `content.hadith_verification_claims`, `content.hadith_verification_references` | Ready for private graph export, but grade assertions must remain attributed and conflicting assertions must coexist. |
| Cross-domain relationships | Canonical schema and Phase 4 promotion scripts | `staging.candidate_entity_mappings` | `content.theme_ayah_links`, `content.theme_hadith_links`, `content.quran_hadith_links`, `content.related_ayahs`, `content.related_hadiths` | Partly ready. Relationship rows must be exported only with origin, method, review state, and confidence where available. |
| Retrieval/search evidence | Phase 5 search and retrieval migrations | Not a staging source | `content.private_search_documents`, `content.private_retrieval_traces` | Ready for private evidence graph and UI inspection. Not a religious source of truth. |
| Review queues | Phase 5 review queue migrations | Not a staging source | `content.private_review_queue_items` | Ready for governance and remediation graph links. |
| Guidance/answer validation | Phase 5 answer and validation migrations | Not a staging source | `content.private_answer_drafts`, `content.private_guided_answer_runs`, `content.private_model_adapter_runs`, `content.private_answer_validation_runs` | Ready for private validation/evidence graph links. Must not become public guidance artifacts. |
| CP21C validation prototype | `data/graphify/cp21c/*`, `data/vault/cp21c/*` | None | None | Reference-only. Do not mix with the full CP22 resource graph except as a test/prototype lineage node. |

## 6. Table-To-Node Map

CP22-G02 should refine exact node names, but CP22-G01 identifies the following direct mappings.

| Table or file source | Candidate graph node types |
| --- | --- |
| `ingest.source_registry` | `source` |
| `ingest.source_snapshots` | `source_snapshot` |
| `ingest.raw_objects` | `raw_object` |
| `ingest.import_runs` | `import_run` |
| `ingest.validation_findings` | `validation_finding` |
| `ingest.transformation_events` | `transformation_event` |
| `ingest.record_lineage` | `record_lineage_event` |
| `ingest.raw_object_parser_assignments` | `parser_assignment` |
| `content.quran_surahs` | `quran_surah` |
| `content.quran_ayahs` | `quran_ayah` |
| `content.quran_text_editions` | `quran_text_edition` |
| `content.quran_ayah_texts` | `quran_ayah_text` |
| `content.quran_partition_schemes` | `quran_partition_scheme` |
| `content.quran_partitions` | `quran_partition` |
| `content.translation_editions` | `translation_edition` |
| `content.translation_texts` | `translation_text` |
| `content.translation_footnotes` | `translation_footnote` |
| `content.translation_chunks` | `translation_chunk` |
| `content.tafsir_editions` | `tafsir_edition` |
| `content.tafsir_passages` | `tafsir_passage` |
| `content.source_taxonomies` | `source_taxonomy` |
| `content.source_topics` | `source_topic` |
| `content.themes` | `rafiq_theme` |
| `content.theme_labels` | `theme_label` |
| `content.source_ayah_theme_groups` | `source_ayah_theme_group` |
| `content.hadith_collections` | `hadith_collection` |
| `content.hadith_editions` | `hadith_edition` |
| `content.hadith_books` | `hadith_book` |
| `content.hadith_chapters` | `hadith_chapter` |
| `content.hadith_records` | `hadith_record` |
| `content.hadith_text_versions` | `hadith_text_version` |
| `content.hadith_references` | `hadith_reference` |
| `content.hadith_grade_assertions` | `hadith_grade_assertion` |
| `content.hadith_grade_normalizations` | `hadith_grade_normalization` |
| `content.hadith_verification_claims` | `hadith_verification_claim` |
| `content.hadith_verification_references` | `hadith_verification_reference` |
| `content.private_search_documents` | `private_search_document` |
| `content.private_retrieval_traces` | `private_retrieval_trace` |
| `content.private_review_queue_items` | `private_review_queue_item` |
| `content.private_answer_drafts` | `private_answer_draft` |
| `content.private_guided_answer_runs` | `private_guided_answer_run` |
| `content.private_model_adapter_runs` | `private_model_adapter_run` |
| `content.private_answer_validation_runs` | `private_answer_validation_run` |
| `content.entity_provenance` | `entity_provenance` or provenance edges, depending on CP22-G02 contract decision |
| `content.entity_release_states` | `entity_release_state` or release-state edges, depending on CP22-G02 contract decision |
| `data/manifests/*.json` | `source_manifest` |
| `data/checksums/*` | `checksum_manifest` |

## 7. Table-To-Edge Map

| Source relationship | Candidate graph edge type |
| --- | --- |
| `source_snapshot.source_id -> source_registry.id` | `snapshot_of` |
| `raw_objects.snapshot_id -> source_snapshots.id` | `raw_object_of_snapshot` |
| `import_runs.snapshot_id -> source_snapshots.id` | `run_against_snapshot` |
| `validation_findings` target fields | `flags` |
| `transformation_events.import_run_id -> import_runs.id` | `transformed_by_run` |
| `record_lineage.parent_* -> child_*` | `derived_from` |
| `entity_provenance.entity_id -> staging/source snapshot` | `has_provenance` |
| `entity_release_states.entity_id -> entity` | `has_release_state` |
| `quran_ayahs.surah_number -> quran_surahs.surah_number` | `ayah_in_surah` |
| `quran_ayah_texts.ayah_id -> quran_ayahs.id` | `text_of_ayah` |
| `quran_ayah_texts.edition_id -> quran_text_editions.id` | `uses_quran_text_edition` |
| `quran_partitions.scheme_id -> quran_partition_schemes.id` | `partition_in_scheme` |
| `quran_partitions.start_ayah_id/end_ayah_id -> quran_ayahs.id` | `partition_spans_ayah` |
| `translation_texts.ayah_id -> quran_ayahs.id` | `translates_ayah` |
| `translation_texts.edition_id -> translation_editions.id` | `uses_translation_edition` |
| `translation_footnotes.translation_text_id -> translation_texts.id` | `footnote_of_translation` |
| `translation_chunks.translation_text_id -> translation_texts.id` | `chunk_of_translation` |
| `tafsir_passages.edition_id -> tafsir_editions.id` | `uses_tafsir_edition` |
| `tafsir_passage_ayahs.passage_id -> tafsir_passages.id` | `passage_covers_ayah` |
| `tafsir_passage_ayahs.ayah_id -> quran_ayahs.id` | `explains_ayah` |
| `source_topics.taxonomy_id -> source_taxonomies.id` | `topic_in_taxonomy` |
| `source_topic_relations.parent_topic_id/child_topic_id` | `source_topic_related_to` |
| `source_topic_ayahs.topic_id -> source_topics.id` | `topic_tags_ayah` |
| `source_topic_ayahs.ayah_id -> quran_ayahs.id` | `ayah_tagged_by_source_topic` |
| `theme_labels.theme_id -> themes.id` | `label_of_theme` |
| `theme_relations.parent_theme_id/child_theme_id` | `theme_related_to` |
| `source_topic_theme_mappings.source_topic_id -> source_topics.id` | `mapped_from_source_topic` |
| `source_topic_theme_mappings.theme_id -> themes.id` | `mapped_to_rafiq_theme` |
| `source_ayah_theme_group_ayahs.group_id -> source_ayah_theme_groups.id` | `theme_group_contains_ayah` |
| `hadith_editions.collection_id -> hadith_collections.id` | `edition_of_collection` |
| `hadith_books.edition_id -> hadith_editions.id` | `book_in_hadith_edition` |
| `hadith_chapters.book_id -> hadith_books.id` | `chapter_in_hadith_book` |
| `hadith_records.edition/book/chapter` | `hadith_record_in_structure` |
| `hadith_text_versions.hadith_record_id -> hadith_records.id` | `text_version_of_hadith` |
| `hadith_record_mappings.left/right_hadith_id` | `hadith_mapped_to_hadith` |
| `hadith_references.hadith_record_id -> hadith_records.id` | `has_hadith_reference` |
| `hadith_grade_assertions.hadith_record_id -> hadith_records.id` | `grades_hadith` |
| `hadith_grade_normalizations.assertion_id -> hadith_grade_assertions.id` | `normalizes_grade_assertion` |
| `hadith_verification_claims.hadith_record_id -> hadith_records.id` | `verifies_or_comments_on_hadith` |
| `hadith_verification_references.claim_id -> hadith_verification_claims.id` | `reference_for_verification_claim` |
| `theme_ayah_links.theme_id/ayah_id` | `theme_linked_to_ayah` |
| `theme_hadith_links.theme_id/hadith_id` | `theme_linked_to_hadith` |
| `quran_hadith_links.ayah_id/hadith_id` | `quran_linked_to_hadith` |
| `related_ayahs.ayah_id/related_ayah_id` | `ayah_related_to_ayah` |
| `related_hadiths.hadith_id/related_hadith_id` | `hadith_related_to_hadith` |
| `private_retrieval_traces` result payloads | `retrieval_used_evidence` |
| `private_review_queue_items.subject_type/subject_id` | `review_item_targets_entity` |
| `private_answer_validation_runs` references | `validation_run_checks_answer` |

## 8. Documented Scale Baseline

`scripts/verify_phase4_final.sql` documents the expected Phase 4 canonical counts:

| Metric | Expected count |
| --- | ---: |
| `content.quran_surahs` | 114 |
| `content.quran_ayahs` | 6,236 |
| `content.quran_text_editions` | 3 |
| `content.quran_ayah_texts` | 18,708 |
| `content.quran_partition_schemes` | 2 |
| `content.quran_partitions` | 2,590 |
| `content.translation_editions` | 8 |
| `content.translation_texts` | 49,888 |
| `content.tafsir_editions` | 3 |
| `content.tafsir_passages` | 18,708 |
| `content.tafsir_passage_ayahs` | 18,708 |
| `content.source_topics` | 2,512 |
| `content.hadith_collections` | 70 |
| `content.hadith_editions` | 70 |
| `content.hadith_records` | 324,866 |
| `content.hadith_text_versions` | 684,348 |
| `content.hadith_grade_assertions` | 67,711 |
| `content.hadith_grade_normalizations` | 67,711 |
| `content.hadith_verification_claims` | 88 |
| `content.entity_provenance` | 1,177,867 |
| `content.entity_release_states` | 1,245,735 |

These are documented expected counts, not live DB counts from this CP22-G01 pass. CP22-G03 and later should query the active database or exported snapshots when building the graph.

## 9. Blocked Or Caution Sources

| Area | Status | Handling rule for CP22 |
| --- | --- | --- |
| Public release for most QUL-derived resources | Public release blocked or rights unresolved | Export privately only; preserve rights and attribution metadata. |
| Tanzil translation production/commercial use | Production blocked pending permission | Export privately only; do not mark public-safe. |
| QUL Malay Basamia/Basmeih attribution mismatch | Attribution unresolved | Preserve alias warning and source distinction. |
| QUL Ayah Themes 62 | Quality flags, duplicate rows, 36 ayah gaps, no confidence field | Export source groups as source metadata; do not invent confidence. |
| Arabic As-Sa'di tafsir | Quality flags including blank records | Export quality flags and blank-record findings. |
| Sunnah.com official API/export | Request pending | Do not claim full official coverage unless source data is present in canonical tables. |
| Fawaz Ahmed hadith-api | Complete private acquisition, public rights unresolved | Export privately with source and rights warnings. |
| AhmedBaset hadith-json/API | Quarantined private acquisition | Export only if canonical rows exist and quarantine metadata is explicit. |
| LK-Hadith-Corpus | Research corpus, public review pending | Export privately with research/provenance classification. |
| SemakHadis | Archived private adapter import approved, live export pending | Export private verification claims; do not imply live official coverage. |
| Dorar | Access request and adapter candidate | Do not export as covered unless authorized data appears in canonical inputs. |
| CP21C graph | Prototype graph only | Keep separate from full CP22 resource graph. |

## 10. Licensing And Release Assumptions

CP22 must assume:

1. Private graph export is allowed only as an internal derived artifact from existing private platform data.
2. Public-safe metadata defaults to false.
3. Every content-bearing graph node must include or link to `content.entity_release_states`.
4. Every content-bearing graph node must include or link to `content.entity_provenance`.
5. Source license and attribution fields must remain visible from manifests, ingest snapshots, or release-state/provenance joins.
6. Public release requires separate Phase 6/public-scope approval and is outside CP22-G01.

## 11. CP22-G02 Inputs

CP22-G02 should use this report to lock:

- final node type names,
- final edge type names,
- partition boundaries,
- stable graph ID rules,
- cross-partition reference format,
- required source/provenance/release metadata fields,
- which `content.entity_provenance` and `content.entity_release_states` rows become nodes versus attached metadata,
- whether private product evidence tables are exported in the first CP22 graph or delayed to a second product-evidence partition.

## 12. CP22-G01 Completion Statement

CP22-G01 is complete as an inventory and source table map checkpoint.

Implementation should not proceed directly to exporters yet. The next checkpoint remains CP22-G02 - Graph Schema Expansion And Partition Plan.

