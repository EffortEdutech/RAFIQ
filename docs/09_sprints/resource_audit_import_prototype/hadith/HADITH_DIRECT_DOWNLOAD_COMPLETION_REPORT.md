# Hadith Direct Download Completion Report

Status: Complete  
Acquisition date: 2026-06-14

## Summary

All directly downloadable resources in the approved Day 5 acquisition scope
were downloaded.

| Measure | Result |
| --- | ---: |
| Repository/dataset snapshots | 24 |
| Files including Git metadata | 654,970 |
| Total disk use | 18.442 GB |
| Principal payload SHA-256 records | 163 |
| Unresolved Git LFS repositories | 0 |
| Remaining drive space after acquisition | Approximately 739 GB |

The total disk size includes shallow Git metadata and local Git LFS object
copies. The large Arabic Quran/Hadith ASR dataset alone uses approximately
13.67 GB locally after checkout and LFS storage.

## Acquired Categories

| Category | Resources | Files | Disk use |
| --- | ---: | ---: | ---: |
| Official | 1 | 47 | 0.002 GB |
| Collections | 9 | 653,047 | 4.006 GB |
| Multilingual | 3 | 113 | 0.213 GB |
| Research | 5 | 558 | 13.926 GB |
| Verification | 2 | 422 | 0.009 GB |
| Quarantined | 4 | 783 | 0.285 GB |

`grades`, `api_snapshots`, and `evidence` remain available for the next
acquisition and audit stages.

## Audit Artifacts

- resource revisions and sizes:
  `data/manifests/hadith-acquisition-resources-2026-06-14.csv`
- category summary:
  `data/manifests/hadith-acquisition-category-summary-2026-06-14.csv`
- principal payload checksums:
  `data/checksums/HADITH_PRINCIPAL_SHA256_2026-06-14.csv`

Every snapshot records its exact Git commit. The AhmedBaset tag checkout is
detached at commit `ca32fd72aa16eeeb9a819c80bb65c9e78766532d`.

## Completed Direct Sources

- Sunnah.com official API repository and sample SQL
- Fawaz Ahmed complete branch `1`
- AhmedBaset hadith JSON tag `v1.2.0`
- AhmedBaset hadith API
- LK-Hadith-Corpus
- SemakHadis API and seed files
- SemakHadis frontend and mock data
- Abdullah Naseer six-book JSON
- six primary Hugging Face datasets
- nine secondary Hugging Face datasets
- large Arabic Quran/Hadith 14-books ASR dataset

## Remaining External Requests

Direct downloading is complete. These require API credentials, maintainer
responses, or official exports:

- Sunnah.com complete API/export
- SemakHadis live database/export
- Dorar al-Sunniyyah API/bulk access
- HadeethEnc multilingual export
- IslamHouse multilingual resource inventory/export

## Next Validation Stage

1. parse every payload format
2. count records and collections
3. inventory languages, narrators, grades, and references
4. detect broken records and duplicate texts
5. compare repeated collections across sources
6. produce source-specific staging mappings

