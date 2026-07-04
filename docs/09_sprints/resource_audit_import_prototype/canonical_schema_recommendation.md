# RAFIQ Canonical Schema Recommendation

Status: Day 9 Recommendation Complete  
Recommendation date: 2026-06-14  
Basis: Days 2-8 audits, Day 7 staging design, and Day 8 executable import

## Decision

Replace the content portion of `RAFIQ_Database_Schema_ERD_Specification_V2`
with an edition-aware, provenance-linked canonical model. Retain the existing
user, guidance, and operational domains for later implementation review.

The canonical layer is not a copy of staging. It contains stable RAFIQ
identities and reviewed relationships while preserving links to every source
record used to create them.

## Schema Boundaries

| Schema | Purpose | Client access |
| --- | --- | --- |
| `ingest` | Sources, snapshots, raw objects, runs, findings, lineage | Private |
| `staging` | Source-shaped parsed records and candidate mappings | Private |
| `content` | Canonical Quran, translation, tafsir, taxonomy, theme, Hadith, and claim records | Server controlled |
| `public_api` | Reviewed release views or RPC surface | Exposed only when configured and approved |

Do not expose base `ingest`, `staging`, or `content` tables directly to
anonymous clients. Public views must use security-invoker behavior where
supported and must filter by explicit release state.

## Identity Rules

### Quran

- `quran_surahs`: stable identity by `surah_number`.
- `quran_ayahs`: stable identity by `(surah_number, ayah_number)`.
- `verse_key` and `global_ayah_number` are validated interchange fields.
- Arabic text is not stored directly on the ayah identity row.
- Script, orthography, Bismillah behavior, and end-marker behavior belong to
  editioned ayah text.
- Juz, hizb, rub, ruku, page, manzil, and sajda metadata remain
  source/layout-qualified.

### Translation

- An edition identifies language, translator, publisher, source snapshot, and
  version.
- Text variants are separate rows: simple, inline footnote, tagged, and chunk.
- Footnotes and chunks remain structured child records.
- A preferred display edition is configuration, not canonical identity.

### Tafsir

- A tafsir passage may cover one or many ayahs.
- Passage-to-ayah membership is many-to-many and ordered.
- Pointer/group structure is preserved through provenance and source role.
- Retrieval chunks are derived records and do not replace the passage.

### Taxonomies And Themes

- Imported source topics belong to a named source taxonomy.
- RAFIQ themes are governed product concepts with independent identity.
- Source topic to RAFIQ theme mappings require method, evidence, and review.
- Source ayah-theme groups are imported separately from governed
  `theme_ayah_links`.
- Confidence is nullable and must never be invented where a source provides
  none.

### Hadith

- Collection, edition, book, chapter, record, and text version are separate.
- Record identity is source-qualified; hadith numbers are not universal IDs.
- Arabic and translations are separate text versions.
- Cross-source equivalence is a reviewed mapping, not an automatic merge.
- References and URNs remain source-qualified.

### Grades And Verification

- Every grade is an attributed assertion.
- Raw grade text is immutable at the canonical claim level.
- Normalization is a versioned derived mapping and may remain null.
- Claim scope supports narration, matn, isnad, wording, supporting chain,
  source absence, and edition metadata.
- Conflicting assertions coexist.
- Verification classification and editorial workflow are separate.
- Any display summary is a separately reviewed derived record.

## Cross-Cutting Tables

### `content.entity_provenance`

Links a canonical entity to one or more staging records and source snapshots.
It records the mapping method, transformation event, and whether the source
record is primary, supporting, or conflicting evidence.

### `content.entity_release_states`

Stores technical, rights, attribution, editorial, scholar/content, and
publication states independently for an exact canonical entity version.

Private platform queries may include technically usable content. Public API
queries require the release policy to pass every configured public gate.

## Required Changes To V2

| V2 assumption | Day 9 replacement |
| --- | --- |
| `quran_ayahs.text_ar` | `quran_text_editions` + `quran_ayah_texts` |
| partition columns on ayah | source-qualified partition schemes and ranges |
| one translation row shape | edition, variant, footnote, and chunk tables |
| one tafsir row per ayah | passages plus many-to-many ayah membership |
| QUL topics equal RAFIQ themes | source taxonomies plus reviewed mappings |
| required theme confidence | nullable confidence with explicit origin |
| one Hadith row with language columns | editioned record plus text versions |
| short grade enum | raw attributed assertions plus versioned normalization |
| one verification status | classification and workflow dimensions |
| implicit source/version fields | record-level provenance and release state |
| direct public content access | release-filtered API views/RPC only |

## Relationship Model

Keep typed canonical relationship tables for high-value joins:

- `theme_ayah_links`
- `theme_hadith_links`
- `quran_hadith_links`
- `related_ayahs`
- `related_hadiths`

Every relationship records:

- source-provided, reviewed mapping, algorithmic, or editorial origin;
- nullable confidence;
- method/version;
- review state;
- provenance;
- release state.

This is preferable to making one generic graph-edge table the only source of
truth. A graph projection may be generated later for retrieval.

## Promotion Rules

A staging record may become private canonical content when:

1. required identity fields resolve;
2. parser and blocking structural validation pass;
3. canonical mapping is deterministic or explicitly reviewed;
4. all parent staging records are linked in provenance;
5. source defects remain represented as findings;
6. the entity receives an explicit private release state.

Public eligibility is evaluated separately. It is never inferred merely from
successful canonical promotion.

## Migration Strategy

1. Approve this recommendation and table ownership.
2. Create a clean Supabase migration from the reviewed reference DDL.
3. Deploy private `ingest`, `staging`, and `content` schemas first.
4. Import canonical Quran identities.
5. Promote editioned Quran and translation content.
6. Promote tafsir, taxonomies, and source theme groups.
7. Promote Hadith collections, editions, records, text versions, and claims.
8. Build reviewed mappings and relationship records.
9. Add public API views only after release-policy and RLS review.
10. Migrate application reads; remove obsolete direct-column assumptions only
    after parity tests pass.

## Day 9 Reference Artifact

`schemas/day9_canonical_content_reference.sql` expresses the recommended
PostgreSQL structure. It is intentionally not a production migration and does
not create public content policies or seed data.

## Day 10 Questions

- Is the canonical recommendation approved for implementation planning?
- Which source editions become the first private canonical promotion batch?
- Which public API views are required for the first visible RAFIQ pages?
- Is a full migration implementation part of the next build sprint?
