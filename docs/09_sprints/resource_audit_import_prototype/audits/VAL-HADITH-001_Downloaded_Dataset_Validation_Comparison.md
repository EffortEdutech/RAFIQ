# VAL-HADITH-001: Downloaded Dataset Validation And Comparison

Status: Raw Validation Complete; Three Seed Defects Registered  
Validation date: 2026-06-14

## Scope

The validation covered all principal downloaded hadith payloads while excluding
generated per-hadith mirrors where the same source provides canonical bulk
edition files.

- 566 principal JSON, CSV, XLSX, SQL, JSONL/GZIP, and Parquet payloads
- 8.893 GB of directly profiled payloads
- 32 Parquet files containing 620,550 rows
- five comparable collection families: MeeAtif, AhmedBaset, Fawaz, LK, and
  Abdullah Naseer
- six shared major collections: Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasai,
  and Ibn Majah

Generated evidence:

- `data/staging_reports/hadith/payload_validation.csv`
- `data/staging_reports/hadith/collection_metrics.csv`
- `data/staging_reports/hadith/cross_source_comparison.csv`
- `data/staging_reports/hadith/validation_summary.json`

The reproducible validator is
`scripts/validate_hadith_datasets.py`.

## Structural Results

| Result | Count |
| --- | ---: |
| Principal payloads profiled | 566 |
| Passed parsing and structural inspection | 563 |
| Failed | 3 |
| Parquet payloads | 32 |
| Parquet rows | 620,550 |
| Source/collection profiles | 37 |
| Pairwise comparison rows | 122 |

The three failures are isolated to SemakHadis seed support files:

| File | Finding | Staging treatment |
| --- | --- | --- |
| `narrator_seeder.csv` | Contains byte `0xA0`; not valid UTF-8 | Decode using an explicitly detected legacy encoding, normalize non-breaking spaces, and retain the raw checksum. |
| `reference_seeder.csv` | Contains byte `0xA0` and already-replaced Arabic characters | Quarantine lossy text, derive a normalized copy, and seek a cleaner upstream export. |
| `tags.json` | Invalid JSON because of a trailing comma | Preserve raw; parse only through a documented repair transform. |

These defects do not invalidate the other SemakHadis files and do not justify
discarding the source.

## Comparable Collection Totals

These totals describe the selected bulk collection views used for comparison,
not every downloaded research or machine-learning row.

| Source family | Collections | Records | Arabic nonblank | English nonblank | Grade-bearing |
| --- | ---: | ---: | ---: | ---: | ---: |
| Abdullah Naseer | 6 | 34,265 | 34,262 | 34,214 | 34,265 |
| AhmedBaset | 9 | 40,943 | 40,818 | 37,507 | 0 |
| Fawaz | 10 | 36,512 | 36,104 | 36,097 | 21,185 |
| LK-Hadith-Corpus | 6 | 34,088 | 34,086 | 33,916 | 33,676 |
| MeeAtif | 6 | 33,738 | 33,738 | 33,737 | 18,056 |

Counts differ because sources use different edition boundaries, numbering,
split/combined narrations, omitted translations, and collection coverage.
Record counts must never be used alone to merge identities.

## Cross-Source Findings

Strong exact normalized Arabic overlap confirms that several repositories
share upstream text lineages:

| Collection | Source pair | Exact overlap | Jaccard |
| --- | --- | ---: | ---: |
| Bukhari | AhmedBaset / MeeAtif | 7,270 | 1.000000 |
| Abu Dawud | AhmedBaset / MeeAtif | 5,270 | 0.999621 |
| Tirmidhi | AhmedBaset / MeeAtif | 4,046 | 0.997043 |
| Muslim | AhmedBaset / MeeAtif | 7,366 | 0.987797 |
| Nasai | AhmedBaset / LK | 5,663 | 0.980946 |
| Ibn Majah | AhmedBaset / LK | 4,268 | 0.953956 |

English overlap is less uniform. Examples include Fawaz/MeeAtif Abu Dawud at
0.986807, Fawaz/MeeAtif Muslim at 0.954694, and Fawaz/MeeAtif Bukhari at
0.660075. This confirms that Arabic and translation editions require separate
source-qualified text-version records.

The comparison also found source-level duplicate text hashes and, in the LK
Bukhari view, 20 duplicate hadith numbers. These are audit flags, not automatic
deletions: repeated matn, repeated numbering, commentary rows, and
split/combined records must be distinguished during normalization.

## Unicode And Text Quality

No mojibake markers were detected in the five normalized comparison families.
The broader payload profile flagged concentrated marker candidates in several
Fawaz Turkish editions and a small number of LK Bukhari chapter files. These
must be reviewed at character level before automated repair because the marker
heuristic can also match legitimate multilingual punctuation.

## Canonical Import Direction

1. Preserve every raw source and checksum unchanged.
2. Create source-qualified collection, edition, language, book, chapter,
   number, URN, and printed-reference identities.
3. Store Arabic and every translation as separate text versions.
4. Store every grade as an attributed assertion; do not overwrite conflicts.
5. Use normalized hashes for candidate matching only, never as universal
   hadith identity.
6. Import malformed or uncertain records with quality flags and transformation
   lineage rather than silently dropping them.
7. Keep AhmedBaset in quarantined raw storage while still allowing controlled
   private comparison and import testing.

## Remaining Validation Boundary

Raw structural validation and representative cross-source comparison are
complete. Full book/chapter foreign-key integrity, official URN uniqueness,
and source-to-canonical mapping require the Day 6 grade/verification work and
the import prototype loaders. Those checks cannot be truthfully completed from
file profiling alone.

