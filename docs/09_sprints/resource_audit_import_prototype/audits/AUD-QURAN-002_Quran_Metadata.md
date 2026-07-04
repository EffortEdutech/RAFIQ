# AUD-QURAN-002: Quran Metadata Sources

Status: Finalized
Audit date: 2026-06-10
Decision date: 2026-06-11

Controlling decision:

`../DAY_02_DECISION_REGISTER.md`

## Scope

Candidate sources:

- Tanzil Quran Metadata
- QUL Quran Metadata resources

## Official Sources

### Tanzil

- Documentation: https://tanzil.net/docs/Quran_Metadata
- XML: https://tanzil.net/res/text/metadata/quran-data.xml
- Change history: https://tanzil.net/docs/metadata_updates

Tanzil documents metadata version 1.0, released on 2008-02-28.

### QUL

- Category: https://qul.tarteel.ai/resources/quran-metadata
- Ayah resource: https://qul.tarteel.ai/resources/quran-metadata/69
- Surah names resource: https://qul.tarteel.ai/resources/quran-metadata/70
- Data model: https://qul.tarteel.ai/docs/data-model
- Ayah copyright page: https://qul.tarteel.ai/resources/69/copyright
- Surah names copyright page: https://qul.tarteel.ai/resources/70/copyright

QUL exposes eight metadata resources: surah names, ayah, juz, hizb, rub, manzil, ruku, and sajda. Authenticated JSON and SQLite files for all eight resources were acquired and validated on 2026-06-12.

The resource-specific copyright pages for QUL ayah metadata resource `69` and surah names resource `70` currently state that QUL does not have copyright information for those resources.

## Tanzil Raw Sample

Stored at:

`data/raw/quran/tanzil/quran-data.xml`

Manifest:

`data/manifests/tanzil-quran-metadata-v1.0.json`

SHA-256:

`8867C1D88191472ADEC9DB694B3CD9F135B1A2EF580574D32CF888DCB22C5C7A`

## Tanzil Validation Results

| Metadata Group | Count |
| --- | --- |
| Surahs | 114 |
| Declared ayah total | 6236 |
| Juz starts | 30 |
| Hizb-quarter starts | 240 |
| Manzil starts | 7 |
| Ruku starts | 556 |
| Page starts | 604 |
| Sajda records | 15 |

Tanzil surah records include:

- index
- ayah count
- global start offset
- Arabic name
- transliterated name
- English name
- revelation type
- revelation order
- ruku count

## QUL Published Structures

QUL ayah sample:

```json
{
  "1": {
    "id": 1,
    "surah_number": 1,
    "ayah_number": 1,
    "verse_key": "1:1",
    "words_count": 4,
    "text": "..."
  }
}
```

QUL surah sample includes:

- `id`
- `name`
- `name_simple`
- `name_arabic`
- `revelation_order`
- `revelation_place`
- `verses_count`
- `bismillah_pre`

QUL's general data model recommends:

- `surah_id + ayah_number` for ayah-level joins
- `surah_id + ayah_number + word_position` for word-level joins
- integer identity fields and indexes on common join keys

## Identifier Recommendation

RAFIQ should not adopt a source's opaque internal IDs as the only canonical identity.

Use:

- `surah_number`: integer 1-114
- `ayah_number`: integer within surah
- unique constraint: `(surah_number, ayah_number)`
- `verse_key`: generated string for interchange, e.g. `2:255`
- `global_ayah_number`: integer 1-6236 derived and validated from canonical ordering

Source-specific IDs should be retained in mapping tables.

## Metadata Modeling Recommendation

Core canonical tables:

- `quran_surahs`
- `quran_ayahs`
- `quran_partitions`
- `quran_sajdas`
- `source_record_mappings`

Suggested partition record:

- `partition_type`: `juz`, `hizb_quarter`, `manzil`, `ruku`, `page`
- `partition_number`
- `start_surah_number`
- `start_ayah_number`
- `source_id`

This is more flexible than separate tables for every partition type, though dedicated views can be provided.

## Risks

| Risk | Finding |
| --- | --- |
| License | Tanzil metadata-specific license applicability is not explicit. QUL resources `69` and `70` have no copyright information on their resource copyright pages. |
| Freshness | Tanzil metadata version 1.0 dates to 2008; stable Quran structure reduces concern, but source history should be retained. |
| QUL Access | Authenticated JSON/SQLite files for resources `63-70` were acquired and validated on 2026-06-12. |
| Naming | Revelation place labels differ in casing/spelling (`Meccan` vs `makkah`); normalize internally while preserving source value. |
| Bismillah | QUL's `bismillah_pre` is useful and should remain separate from ayah text. |
| Page Mapping | Mushaf page numbering depends on the selected mushaf tradition/layout and must be source-qualified. |

## Provisional Recommendation

1. Use Tanzil metadata as an immediately inspectable structural baseline.
2. Use QUL metadata structure as the preferred integration target after authenticated file download and license confirmation.
3. Keep source-qualified metadata and avoid silently merging conflicting values.
4. Model partition starts generically and retain source/layout context.
5. Treat `bismillah_pre` as presentation metadata, not part of canonical ayah identity.

## Decision

`Tanzil Metadata: Approve for Staging Only`

`QUL Metadata: Schema Verified; Blocked for Production Pending Provenance/Permission`

No production metadata source is approved yet.

## File Validation Amendment

See `VAL-QUL-001_Quran_Scripts_Metadata.md`.

All eight JSON/SQLite pairs match exactly. QUL provides 558 ruku records versus Tanzil's 556 and differs at one rub/hizb-quarter boundary. Partition metadata must therefore remain source-qualified.
