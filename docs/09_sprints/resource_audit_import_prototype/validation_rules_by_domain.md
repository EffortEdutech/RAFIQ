# Day 8 Executable Validation Rules By Domain

Status: Implemented and Passed  
Execution date: 2026-06-14  
Runner: `scripts/run_day8_import_prototype.py`

## Validation Contract

The Day 8 prototype imports complete representative datasets into a local
SQLite staging database. It preserves raw records, source locators, hashes,
source-shaped records, attributed claims, known duplicates, and coverage gaps.

Rule severities:

- `error`: an unexpected failure blocks prototype acceptance.
- `warning`: a known source defect is preserved and checked against its
  expected baseline.
- `info`: a known source structure or limitation is measured and retained.

The run is accepted only when every executable rule passes and no `error`
rule fails.

## Quran

- exactly 6,236 records and unique ayah keys;
- every key is within the canonical 114-surah ayah range;
- Arabic text is nonblank;
- source identity and JSON pointer are retained for every row.

## Translation

- simple, inline-footnote, tagged-footnote, and chunk variants each contain
  6,236 rows;
- every variant has exact key equality with the Quran key set;
- translation text is nonblank;
- chunk footnote references resolve to their local definitions;
- footnotes remain separate structured records.

## Tafsir

- 6,236 source records are retained;
- 6,216 passages and 20 pointer rows match the source structure;
- every pointer resolves to an existing passage;
- grouped `ayah_keys` and pointer links cover all 6,236 ayahs;
- passages are not forced into one-row-per-ayah storage.

## Topics

- exactly 2,512 unique source topics;
- parent and related-topic references resolve inside the source namespace;
- all packed ayah references resolve to canonical Quran keys;
- packed values are expanded into 1,759 relations and 30,687 ayah links.

## Ayah Themes

- all 2,098 physical source rows are preserved;
- the expected 1,049 exact duplicate rows remain visible;
- the source yields 1,049 unique exact groups;
- ranges and `total_ayahs` values are internally consistent;
- 6,200 ayahs are covered and the expected 36 gaps remain explicit.

## Hadith Collection And Grades

- Abu Dawud contains 5,274 unique source-qualified records;
- every record maps to exactly one source section;
- all 18,818 attributed grade assertions are retained independently;
- blank texts at hadith numbers 907 and 4290 are preserved as a checked
  warning baseline; no replacement text is synthesized.

## Hadith Verification

- all 60 SemakHadis workbook rows are retained;
- Arabic text, Malay text, and raw status are present;
- repeated `RUJUKAN` columns become ordered reference records;
- raw status spelling and capitalization remain unchanged.

## Outputs

- `data/staging_reports/day8/import_prototype.sqlite`
- `data/staging_reports/day8/import_summary.json`
- `data/staging_reports/day8/validation_results.csv`

The SQLite database is a disposable prototype artifact, not a production
migration or canonical content database.
