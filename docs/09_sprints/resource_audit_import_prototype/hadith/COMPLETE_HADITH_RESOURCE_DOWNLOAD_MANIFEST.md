# Complete Hadith Resource Download Manifest

Status: Direct Downloads Complete; API/Export Requests Pending  
Created: 2026-06-13
Completed: 2026-06-14

## Completion Summary

- all 15 numbered direct-download items completed
- all nine listed secondary Hugging Face candidates completed
- 24 repository/dataset snapshots acquired
- large Arabic Quran/Hadith ASR batch completed
- exact revisions and sizes recorded in
  `data/manifests/hadith-acquisition-resources-2026-06-14.csv`
- 163 principal payload checksums recorded in
  `data/checksums/HADITH_PRINCIPAL_SHA256_2026-06-14.csv`
- API/export request queue remains open

## Objective

Acquire every technically available hadith dataset relevant to RAFIQ for
private platform construction, comparison, validation, and testing.

Rights, provenance, quality, and religious approval are metadata and
public-release gates. They are not reasons to omit an available resource from
the private research corpus.

Do not alter downloaded files. Preserve repository commit/tag, URL, download
date, checksum, declared licence, upstream claims, and risk status.

## Landing Zones

```text
data/raw/hadith/
  official/
  collections/
  multilingual/
  research/
  verification/
  grades/
  api_snapshots/
  quarantined/
  evidence/
```

Use `quarantined/` for datasets with scraping, rights, provenance, or quality
concerns. Quarantine means private acquisition with warnings, not deletion.

## Queue A: Download Complete Repository Snapshots

| ID | Resource | Download | Target | Approx. repository size | Status |
| --- | --- | --- | --- | ---: | --- |
| HAD-DL-001 | Sunnah.com official API code and sample DB | https://github.com/sunnah-com/api | `official/sunnah-com-api/` | Small plus 1.5 MB sample SQL | Download |
| HAD-DL-002 | Fawaz Ahmed Hadith API, branch `1` | https://github.com/fawazahmed0/hadith-api/tree/1 | `collections/fawaz-hadith-api-v1/` | 1.65 GB | Download |
| HAD-DL-003 | AhmedBaset hadith-json, tag `v1.2.0` | https://github.com/AhmedBaset/hadith-json/tree/v1.2.0 | `quarantined/ahmedbaset-hadith-json-v1.2.0/` | 76 MB | Download with scraping/provenance flag |
| HAD-DL-004 | AhmedBaset hadith-api | https://github.com/AhmedBaset/hadith-api | `quarantined/ahmedbaset-hadith-api/` | Small | Download with upstream flag |
| HAD-DL-005 | LK Hadith Corpus | https://github.com/ShathaTm/LK-Hadith-Corpus | `research/lk-hadith-corpus/` | 14 MB | Download |
| HAD-DL-006 | SemakHadis API | https://github.com/semakhadis/semakhadis-api | `verification/semakhadis-api/` | 0.34 MB | Download archived repository |
| HAD-DL-007 | SemakHadis frontend and mock records | https://github.com/semakhadis/semakhadis-frontend | `verification/semakhadis-frontend/` | 8.6 MB | Download archived repository |
| HAD-DL-008 | Six-book JSON dataset | https://github.com/AbdullahNaseer01/hadith-books-data | `collections/abdullah-naseer-six-books/` | 22 MB repository; about 126 MB JSON | Download |

Important SemakHadis files:

- `database/seeds/seeder_csv/hadith_seeder.xlsx`
- `database/seeds/seeder_csv/narrator_seeder.csv`
- `database/seeds/seeder_csv/reference_seeder.csv`
- `src/mock/mock.json` from the frontend repository

## Queue B: Download Hugging Face Dataset Snapshots

Download the complete dataset repository, including README and metadata.

| ID | Dataset | Exact principal files | Approx. data size | Target |
| --- | --- | --- | ---: | --- |
| HAD-DL-009 | https://huggingface.co/datasets/meeAtif/hadith_datasets | Six collections in both CSV and JSON | 107 MB | `multilingual/hf-meeatif-hadith-datasets/` |
| HAD-DL-010 | https://huggingface.co/datasets/arbml/LK_Hadith | `data/train-00000-of-00001-0433f24f87697771.parquet` | 38.6 MB | `research/hf-arbml-lk-hadith/` |
| HAD-DL-011 | https://huggingface.co/datasets/M-AI-C/all_hadith | `data/train-00000-of-00001-6b65a39e54b5260f.parquet` | 15.8 MB | `collections/hf-maic-all-hadith/` |
| HAD-DL-012 | https://huggingface.co/datasets/fawazahmed0/hadith-data | `data/train-00000-of-00001-ada9a2a41dc08d71.parquet` | 95.8 MB | `collections/hf-fawaz-hadith-data/` |
| HAD-DL-013 | https://huggingface.co/datasets/gurgutan/sunnah_ar_en_dataset | `sunnah_ar_en_dataset.jsonl.gz` | 16.7 MB | `quarantined/hf-sunnah-ar-en/` |
| HAD-DL-014 | https://huggingface.co/datasets/freococo/sunnah_dataset | `sunnah_com_dataset.parquet` | 45.2 MB | `quarantined/hf-sunnah-dataset/` |

Additional discovered datasets to inventory and snapshot:

- https://huggingface.co/datasets/Abdo1Kamr/Arabic_Hadith
- https://huggingface.co/datasets/arbml/Quran_Hadith
- https://huggingface.co/datasets/arbml/Hadith
- https://huggingface.co/datasets/sarfarazmir/hadith_dataset
- https://huggingface.co/datasets/JimLam/hadith_data
- https://huggingface.co/datasets/JimLam/hadith-data
- https://huggingface.co/datasets/Mahadih534/all-hadiths-cleaned
- https://huggingface.co/datasets/sarnsrun/hadiths
- https://huggingface.co/datasets/ronnieaban/sunnah

These secondary datasets may duplicate upstream collections. Download them
because comparison and duplication analysis are part of the platform audit.

## Queue C: Large Audio/ASR Research Dataset

| ID | Dataset | Size | Decision |
| --- | --- | ---: | --- |
| HAD-DL-015 | https://huggingface.co/datasets/siddiqiya/ar-quran-hadith14books-MSA | Approximately 6.3 GB across Parquet shards | Download in a separate `research/audio-asr/` batch after confirming storage capacity |

This dataset supports Arabic speech/ASR research rather than canonical hadith
text, but it remains part of the complete resource inventory.

## Queue D: API And Export Requests

These resources do not currently expose a complete anonymous bulk download.
Record and pursue them rather than removing them from scope.

| ID | Resource | Acquisition action | Target |
| --- | --- | --- | --- |
| HAD-REQ-001 | Sunnah.com official API | Submit API-key request and request authorized snapshot/offline dump | `api_snapshots/sunnah-com/` |
| HAD-REQ-002 | SemakHadis live dataset | Contact maintainers for complete database/export beyond repository seed samples | `verification/semakhadis-live-export/` |
| HAD-REQ-003 | Dorar al-Sunniyyah | Request API/bulk research access and terms | `verification/dorar/` |
| HAD-REQ-004 | HadeethEnc | Request API/export for multilingual hadith texts and explanations | `multilingual/hadeethenc/` |
| HAD-REQ-005 | IslamHouse | Inventory official multilingual APIs/downloads relevant to hadith | `multilingual/islamhouse/` |

## Queue E: Evidence Captures

Preserve:

- repository README, licence, releases/tags, and upstream reference files
- official API schemas and developer pages
- copying/scraping/redistribution terms
- collection and translator lists
- issue/request URLs and responses
- dataset cards and declared licences

Store under:

```text
data/raw/hadith/evidence/
```

## Validation Order

1. inventory every file and byte size
2. calculate SHA-256
3. record repository commit or dataset revision
4. parse JSON, CSV, XLSX, SQL, Parquet, and compressed files
5. inventory collections, languages, books, chapters, narrators, grades, and
   references
6. identify exact and normalized duplicates across all datasets
7. map source-specific identifiers without merging records
8. preserve conflicting texts, numbering systems, and grades
9. generate provenance and risk flags
10. import all technically usable content into the complete private platform

No dataset is discarded solely because its rights, approval, provenance, or
quality status is unresolved.
