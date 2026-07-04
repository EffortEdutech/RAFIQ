# Phase 3 Loader Checkpoint 03 Report

Status: Complete  
Checkpoint date: 2026-06-16  
Phase status: In Progress  
Environment: Local RAFIQ Supabase/PostgreSQL

## Decision

Phase 3 Checkpoint 03 is complete. After the QUL, tafsir, topics, themes,
grades, and verification work in Checkpoint 02, this checkpoint adds three
additional Hadith JSON source families into private staging:

- Abdullah Naseer six-books JSON;
- MeeAtif multilingual Hadith JSON;
- AhmedBaset quarantined hadith-json by-book JSON.

These records are source-qualified. Similar collection names and Hadith
numbers are not merged across source families.

## Implemented

- Added `scripts/parse_hadith_json_text_sources.py`.
- Added `scripts/verify_phase3_checkpoint_03.sql`.
- Loaded six Abdullah JSON files with Arabic, English, and Urdu text versions.
- Loaded six MeeAtif JSON files with Arabic and English text versions.
- Loaded six AhmedBaset by-book JSON files with Arabic and English text
  versions.
- Preserved dataset-specific collection keys under `source_edition_key` values:
  `abdullah`, `meeatif`, and `ahmedbaset`.
- Corrected the loader to allow repeated Hadith numbers in a source file by
  assigning text-version identities at source-row level.

## Loader Results

| Loader | Version | Import runs | Parsed | Staged | Warnings | Rejected |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Abdullah six-books JSON | 1.0.0 | 6 | 34,265 | 136,996 | 0 | 0 |
| MeeAtif and AhmedBaset JSON | 1.0.1 | 12 | 67,916 | 202,640 | 0 | 0 |

## Verification Results

| Check | Result |
| --- | ---: |
| Completed import runs | 66 |
| Failed import runs | 0 |
| Staging source records | 646,545 |
| Quran ayah text rows | 18,708 |
| Quran partition rows | 2,590 |
| Translation text rows | 49,888 |
| Tafsir passage rows | 18,708 |
| Source topic rows | 2,512 |
| Ayah theme group rows | 2,098 |
| Hadith record rows | 137,347 |
| Hadith text-version rows | 340,719 |
| Hadith grade assertion rows | 67,711 |
| Hadith verification claim rows | 28 |
| Validation findings | 66 |

## New Hadith Records By Source Family

| Source family | Collection | Hadith records |
| --- | --- | ---: |
| abdullah | abu-dawood | 5,274 |
| abdullah | al-tirmidhi | 3,956 |
| abdullah | ibn-e-majah | 4,341 |
| abdullah | sahih-bukhari | 7,433 |
| abdullah | sahih-muslim | 7,561 |
| abdullah | sunan-nasai | 5,700 |
| ahmedbaset | abudawud | 5,276 |
| ahmedbaset | bukhari | 7,277 |
| ahmedbaset | ibnmajah | 4,345 |
| ahmedbaset | muslim | 7,459 |
| ahmedbaset | nasai | 5,768 |
| ahmedbaset | tirmidhi | 4,053 |
| meeatif | jami-at-tirmidhi | 3,950 |
| meeatif | sahih-al-bukhari | 7,249 |
| meeatif | sahih-muslim | 6,418 |
| meeatif | sunan-abi-dawud | 5,274 |
| meeatif | sunan-an-nasai | 5,672 |
| meeatif | sunan-ibn-majah | 4,069 |

## Remaining Phase 3 Work

1. Load remaining CSV, JSONL, GZIP JSONL, XLSX, Parquet, Fawaz metadata, and
   Fawaz originals where technically appropriate.
2. Add streaming/profiled loaders for large Parquet and research corpora.
3. Expand validation findings for duplicate numbering, blank text, encoding
   markers, source-family differences, and quarantined-source status.
4. Prepare canonical promotion with source-specific provenance and no automatic
   cross-source Hadith merge.
