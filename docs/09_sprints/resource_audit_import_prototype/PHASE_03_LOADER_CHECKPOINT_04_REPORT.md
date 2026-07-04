# Phase 3 Loader Checkpoint 04 Report

Status: Complete  
Checkpoint date: 2026-06-17  
Phase status: In Progress  
Environment: Local RAFIQ Supabase/PostgreSQL

## Decision

Phase 3 Checkpoint 04 is complete. The remaining CSV, JSONL, GZIP JSONL,
XLSX, Fawaz metadata, Fawaz original-text, and Parquet assignment groups have
been processed.

Direct text sources were loaded into private Hadith staging. Large Parquet and
research corpora were profiled as raw-object profile records instead of being
blindly promoted into Hadith text staging. This preserves their schemas,
counts, and sample metadata while preventing audio/sentence research datasets
from being mistaken for canonical Hadith text collections.

## Implemented

- Added `scripts/parse_hadith_remaining_sources.py`.
- Added `scripts/verify_phase3_checkpoint_04.sql`.
- Loaded 8 CSV files into source-qualified Hadith records and text versions.
- Loaded Sarnsrun JSONL and quarantined Sunnah Arabic/English GZIP JSONL.
- Loaded SemakHadis XLSX seed workbook into unreviewed verification claims.
- Profiled 3 Fawaz metadata JSON files.
- Profiled 29 Fawaz original text files.
- Profiled 32 Parquet files using metadata/sample extraction through
  `pyarrow`, including large research/audio shards.
- Updated parser assignment status for completed routes.

## Loader Results

| Loader | Import runs | Parsed | Staged | Warnings | Rejected |
| --- | ---: | ---: | ---: | ---: | ---: |
| CSV generic Hadith text | 8 | 106,280 | 315,241 | 0 | 0 |
| Sarnsrun JSONL Hadith text | 1 | 33,976 | 67,188 | 0 | 0 |
| Sunnah Arabic/English GZIP JSONL | 1 | 50,762 | 148,719 | 0 | 0 |
| SemakHadis XLSX verification claims | 1 | 60 | 60 | 0 | 0 |
| Fawaz metadata profiles | 3 | 3 | 3 | 0 | 0 |
| Fawaz original-text profiles | 29 | 29 | 29 | 0 | 0 |
| Parquet raw-object profiles | 32 | 32 | 32 | 0 | 0 |

## Verification Results

| Check | Result |
| --- | ---: |
| Completed import runs | 141 |
| Failed import runs | 0 |
| Staging source records | 1,177,817 |
| Hadith record rows | 324,866 |
| Hadith text-version rows | 684,348 |
| Hadith grade assertion rows | 67,711 |
| Hadith verification claim rows | 88 |
| Raw-object profile records | 64 |
| Validation findings | 66 |
| Parser assignments implemented | 132 |
| Parser assignments still assigned | 54 |
| Supabase DB lint | No schema errors |
| Security advisor | No issues |
| Performance advisor | No issues |

## Remaining Assigned Work

The remaining assigned items are:

- 53 Fawaz edition JSON files under `parse_hadith_fawaz_editions_json`;
- 1 manual parser-review item.

The Fawaz edition JSON files overlap with already loaded Fawaz line-by-line and
grade resources. They need a source-specific decision before import: load as
separate edition text versions, profile-only duplicates, or selectively import
fields not already captured.

## Next Phase 3 Work

1. Decide how to handle Fawaz edition JSON overlap.
2. Review the one manual parser-review item.
3. Add validation findings for duplicate numbering, source overlap, profile-only
   Parquet decisions, and quarantined-source status.
4. Begin canonical promotion planning from staging to `content` with full
   provenance and no automatic cross-source Hadith merge.
