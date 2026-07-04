# AUD-TAFSIR-001: QUL Tafsir Candidates

Status: Finalized
Audit date: 2026-06-12

## Scope

Audited public resources:

- English Al-Mukhtasar, resource `266`
- English Tafsir Ibn Kathir, resource `35`
- Arabic Tafsir As-Saadi, resource `308`
- QUL tafsir catalog: https://qul.tarteel.ai/resources/tafsir

The public catalog currently displays 108 entries, while the QUL resources overview reports 115 tafsir resources. This catalog-count difference must be resolved from an authenticated export or source registry.

## Access And Rights

Authenticated JSON and SQLite exports were acquired on 2026-06-12 and preserved under `data/raw/tafsir/`.

The copyright pages for resources `266`, `35`, and `308` state that QUL has no copyright information. Original work, translation, edition, publisher, redistribution, commercial use, and summarization rights therefore remain unresolved.

Decision boundary: raw acquisition and technical validation are complete.
Complete private-platform import and testing are approved. Public release
remains blocked pending rights.

## Published Structure

Tafsir is grouped by one or more ayahs, not necessarily one record per ayah.

```json
{
  "2:3": {
    "text": "tafsir text",
    "ayah_keys": ["2:3", "2:4"]
  },
  "2:4": "2:3"
}
```

The object key is the main group record. String values point to the group key. SQLite fields include:

- `ayah_key`
- `group_ayah_key`
- `from_ayah`
- `to_ayah`
- `ayah_keys`
- `text`

Tafsir text may contain HTML. Public samples show materially different grouping sizes: Al-Mukhtasar may address a single ayah, while Ibn Kathir and As-Saadi may span long passages.

## RAFIQ Mapping

Recommended entities:

- `tafsir_sources`
- `tafsir_passages`
- `tafsir_passage_ayahs`
- `tafsir_chunks`
- `tafsir_derived_summaries`

Required rules:

- preserve source passage verbatim
- model many-to-many passage-to-ayah coverage
- sanitize HTML for display without changing the archived source
- keep derived summaries separate with model, prompt, reviewer, and source passage lineage
- never present an AI summary as original tafsir
- require scholar/content approval for summaries used in guidance

## Validation Still Required

- [x] authenticated JSON/SQLite acquisition
- [x] group-pointer integrity
- [x] ayah-key validity and coverage
- [x] blank group text checks
- [x] initial HTML inventory
- source edition and translator identification
- rights and attribution confirmation

## File Validation Findings

- Each tafsir export contains all 6,236 canonical ayah keys.
- JSON and SQLite versions match exactly.
- Al-Mukhtasar has 6,216 main passages and 20 pointers.
- Ibn Kathir has 1,902 main passages and 4,334 pointers.
- As-Saadi is verse-level but contains 59 blank tafsir records.
- All SQLite files pass integrity checks.
- Arabic text is valid Unicode.

## Decision Recommendation

`Private Platform Approved; Public Release Blocked Pending Rights`
