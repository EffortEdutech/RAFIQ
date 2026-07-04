# AUD-TOPIC-001: QUL Topics And Concepts

Status: Finalized
Audit date: 2026-06-12

## Source Identity

- QUL resource `45`
- URL: https://qul.tarteel.ai/resources/ayah-topics/45
- Advertised format: SQLite
- Public count: 2,512 topics

QUL describes three overlapping topic classes:

- ontology topics
- thematic topics
- general topics

Ontology content is attributed to the Quranic Arabic Corpus. Thematic content is attributed to The Clear Quran. General-topic provenance is not fully identified on the resource page.

## Access And Rights

The authenticated SQLite file was acquired on 2026-06-12. QUL's resource copyright page states that it has no copyright information.

Because this is a composite dataset, RAFIQ must track provenance and rights per topic or topic namespace rather than assigning one blanket QUL license.

## Actual File Structure

Fields:

- `topic_id`
- `name`
- `arabic_name`
- `parent_id`
- `thematic_parent_id`
- `ontology_parent_id`
- `description`
- `wiki_link`
- `thematic`
- `ontology`
- `ayahs`
- `related_topics`

The public table shows that topics may:

- belong to more than one class
- have parents and children
- link directly to ayahs
- have similar or duplicate labels across namespaces

Ayah and related-topic references are stored as comma-separated lists rather than normalized relation tables.

## RAFIQ Mapping

Do not treat QUL `topic_id` as RAFIQ's universal theme ID.

Recommended entities:

- `source_topics`
- `source_topic_namespaces`
- `source_topic_hierarchy`
- `source_topic_relations`
- `source_topic_ayahs`
- `rafiq_themes`
- `rafiq_theme_source_mappings`

RAFIQ's user-facing mood/theme taxonomy must remain a governed layer mapped to source topics. Source-provided and RAFIQ-generated relationships must be distinguishable.

## Validation Still Required

- [x] actual 2,512-row count
- [x] uniqueness of `topic_id`
- [x] parent existence and cycle detection
- [x] ayah-key validity
- [x] duplicate label inventory
- namespace provenance
- [x] relationship storage discovery
- [x] missing-name and description inventory

Results include 30,687 valid ayah links, no broken parents, no cycles, no broken related-topic references, 87 duplicate normalized-name groups, 2,225 missing descriptions, and 1,520 missing Arabic names.

## Decision Recommendation

`Private Platform Approved; Public Release Blocked Pending Rights`
