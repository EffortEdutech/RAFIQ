# Phase 3 Loader Checkpoint 02 Report

Status: Complete  
Checkpoint date: 2026-06-16  
Phase status: In Progress  
Environment: Local RAFIQ Supabase/PostgreSQL

## Decision

Phase 3 Checkpoint 02 is complete. The private staging database now includes
QUL Quran metadata, QUL tafsir, QUL topics, QUL ayah themes, Fawaz grade
assertions, SemakHadis mock verification claims, and explicit validation
findings for the known source-quality issues.

This checkpoint does not close Phase 3. Remaining Phase 3 work includes
additional Hadith source-family loaders, richer verification/research exports
when obtained, canonical promotion, and product-facing private content queries.

## Implemented

- Added `scripts/parse_qul_metadata.py`.
- Added `scripts/parse_qul_tafsir_topics_themes.py`.
- Added `scripts/parse_hadith_grades_verification.py`.
- Added `scripts/verify_phase3_checkpoint_02.sql`.
- Loaded QUL ayah metadata as source records.
- Loaded QUL juz, hizb, rub, ruku, manzil, sajda, and surah partitions.
- Loaded three QUL tafsir files into passage and passage-to-ayah staging.
- Loaded QUL Topics and Concepts, including ayah links and source relations.
- Loaded QUL Ayah Themes with duplicate, gap, and malformed-keyword findings.
- Loaded Fawaz Arabic edition grade assertions as attributed, reversible grade
  claims.
- Loaded SemakHadis frontend mock records as unreviewed verification claims.
- Loaded Day 6 Hadith quality summary findings.

## Loader Results

| Loader | Import runs | Parsed | Staged | Warnings | Rejected |
| --- | ---: | ---: | ---: | ---: | ---: |
| QUL Quran metadata | 8 | 7,260 | 7,260 | 0 | 0 |
| QUL tafsir | 3 | 18,708 | 18,708 | 59 | 0 |
| QUL topics | 1 | 2,512 | 2,512 | 0 | 0 |
| QUL ayah themes | 1 | 2,098 | 2,098 | 3 | 0 |
| Fawaz grade assertions | 5 | 67,716 | 67,711 | 0 | 5 |
| SemakHadis mock verification claims | 1 | 28 | 28 | 1 | 0 |
| Day 6 quality findings | 1 | 3 | 0 | 3 | 0 |

The five rejected Fawaz grade rows are duplicate source-record keys in the raw
grade data. They are counted as rejected records rather than merged silently.

## Verification Results

| Check | Result |
| --- | ---: |
| Completed import runs | 48 |
| Failed import runs | 0 |
| Staging source records | 306,909 |
| Quran ayah text rows | 18,708 |
| Quran partition rows | 2,590 |
| Translation text rows | 49,888 |
| Tafsir passage rows | 18,708 |
| Tafsir passage-to-ayah rows | 18,708 |
| Source topic rows | 2,512 |
| Source topic-to-ayah rows | 30,687 |
| Source topic relation rows | 1,759 |
| Ayah theme group rows | 2,098 |
| Ayah theme group-to-ayah rows | 12,400 |
| Hadith record rows | 36,272 |
| Hadith text-version rows | 102,158 |
| Hadith grade assertion rows | 67,711 |
| Hadith verification claim rows | 28 |
| Validation findings | 66 |

## Grade Normalization Snapshot

| Normalized grade | Rows |
| --- | ---: |
| daif | 11,425 |
| hasan | 7,943 |
| hasan_sahih | 3,461 |
| mawdu | 145 |
| sahih | 44,247 |
| unmapped | 490 |

## Verification Claim Snapshot

| Normalized conclusion | Rows |
| --- | ---: |
| fabricated_or_false | 9 |
| hasan | 2 |
| not_found_or_not_hadith | 2 |
| sahih | 2 |
| unmapped | 7 |
| very_weak | 1 |
| weak | 5 |

## Validation Findings

| Finding code | Severity | Rows |
| --- | --- | ---: |
| abdullah_grade_field_unreliable | warning | 1 |
| ayah_theme_coverage_gaps | warning | 1 |
| ayah_theme_exact_duplicates | warning | 1 |
| ayah_theme_malformed_keyword_wai | warning | 1 |
| blank_tafsir_text | warning | 59 |
| fawaz_multi_grader_conflicts | warning | 1 |
| semakhadis_mock_not_authoritative_export | warning | 1 |
| verification_exports_incomplete | warning | 1 |

## Next Phase 3 Work

1. Implement remaining Hadith source-family loaders beyond Fawaz line-by-line
   and Fawaz grade assertions.
2. Expand validation rules for Hadith numbering, language editions, blanks,
   encoding markers, and duplicate references.
3. Load authorized verification/research exports when available.
4. Prepare canonical promotion scripts with full provenance from staging.
5. Build the first private RAFIQ Quran/Hadith pages against canonical content.
