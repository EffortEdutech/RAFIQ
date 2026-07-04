# Staging Table Recommendation

Status: Day 7 Design Finalized  
Design date: 2026-06-14

## Shared Staging Columns

Every domain table includes:

- generated staging ID
- source, snapshot, raw object, and import run IDs
- source record key and source locator
- raw record JSON where practical
- source sequence
- parse status
- raw text hash and optional normalized text hash
- created timestamp

Staging uniqueness is source-qualified. Canonical uniqueness is not enforced in
staging.

## Ingest Tables

- `ingest.source_registry`
- `ingest.source_snapshots`
- `ingest.raw_objects`
- `ingest.import_runs`
- `ingest.validation_findings`
- `ingest.transformation_events`
- `ingest.record_lineage`

## Quran And Metadata

### `staging.quran_ayah_texts`

Preserves every source script separately:

- surah and ayah number
- source ayah key
- script/orthography label
- text
- Bismillah representation
- ayah-end marker behavior

### `staging.quran_partitions`

- partition type: juz, hizb, rub, ruku, manzil, sajda
- source partition ID
- start/end ayah
- source label and classification

Partition disagreements remain source-qualified.

## Translations

### `staging.translation_texts`

- ayah key
- language
- translator/edition labels
- variant type: simple, inline footnote, tagged, chunks
- text and source markup

### `staging.translation_footnotes`

- source footnote ID
- ayah text record
- marker
- rich text
- plain derived text

### `staging.translation_chunks`

Preserves retrieval-oriented chunks separately from lossless translation and
footnote content.

## Tafsir

### `staging.tafsir_passages`

- source/group ayah key
- language and source edition
- from/to ayah
- passage text and raw HTML
- blank-text flag

### `staging.tafsir_passage_ayahs`

Many-to-many passage coverage:

- passage
- ayah key
- source order
- pointer/main-record role

This replaces the incorrect one-tafsir-row-per-ayah assumption.

## Topics And Ayah Themes

### `staging.source_topics`

- source topic ID
- namespace flags
- names and description
- source hierarchy identifiers
- raw packed relationships

### `staging.source_topic_relations`

- parent/child or related-topic relation
- source-provided relation type

### `staging.source_topic_ayahs`

- source topic
- ayah key

### `staging.ayah_theme_groups`

- source range
- theme text
- raw keywords
- total ayahs
- physical-row identity
- exact-duplicate group

### `staging.ayah_theme_group_ayahs`

- theme group
- expanded ayah key

No source confidence column is created for QUL resource 62.

## Hadith Collections

### Identity And Structure

- `staging.hadith_collections`
- `staging.hadith_editions`
- `staging.hadith_books`
- `staging.hadith_chapters`
- `staging.hadith_records`

`hadith_records` retains source number, URN, printed reference, and raw
collection/book/chapter keys. It does not assume source numbers are universal.

### Text And References

- `staging.hadith_text_versions`
- `staging.hadith_references`
- `staging.hadith_record_references`

Arabic and each translation are separate text versions. Isnad, matn, narrator
prefix, source HTML, and normalized hashes remain distinct.

### Intelligence

- `staging.hadith_isnad_segments`
- `staging.hadith_matn_segments`
- `staging.hadith_narrators`
- `staging.hadith_annotations`

LK segmentation confidence/provenance is retained independently of grade.

## Grades And Verification

### `staging.hadith_grade_assertions`

- source hadith record
- grader raw name
- raw grade
- normalized grade
- claim scope
- citation
- normalization version
- review state

Conflicting assertions coexist.

### `staging.hadith_verification_claims`

- claim text and explanation
- verbatim and normalized conclusion
- claim scope
- scholar/researcher
- references
- source publication state
- editorial workflow state

SemakHadis classification and workflow fields are separate.

## Cross-Domain Quality And Mapping

### `ingest.validation_findings`

Findings can target:

- raw object
- import run
- staging table and staging row

### `staging.candidate_entity_mappings`

Stores proposed cross-source matches:

- left and right source record
- mapping type
- method and score
- evidence JSON
- review state

Hashes and numbers create candidates only.

## Canonical Promotion Boundary

A staging row may be promoted privately when:

- parser succeeded;
- required structural fields are present;
- source references resolve or carry an explicit unresolved flag;
- blocking technical defects are absent;
- snapshot is not marked unusable.

Public promotion additionally requires the exact snapshot's rights,
attribution, content, and publication gates.

## Required Canonical Schema Deltas

The current V2 canonical model must later be amended to support:

- source snapshots and record mappings
- Quran script versions rather than one `text_ar`
- source-qualified partition boundaries
- translation editions, footnotes, and chunks
- tafsir passages with many-to-many ayah coverage
- source topic namespaces separate from RAFIQ themes
- theme groups without invented confidence
- hadith editions and text versions
- source-qualified references and URNs
- attributed grade assertions with scope
- verification claims separate from workflow state
- record-level approval inheritance and lineage

These deltas will be finalized during Day 9.
