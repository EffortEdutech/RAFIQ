# Audit Batch Plan

Status: Active
Last updated: 2026-06-12

## Purpose

This file groups source audits into batches so progress can be monitored during the sprint.

## Batch 1: Quran Foundation

Target day: Day 2

| Audit ID | Source Group | Candidate Sources | Output Audit File | Status |
| --- | --- | --- | --- | --- |
| AUD-QURAN-001 | Quran Text | QUL Quran Script, Tanzil Quran Text | `audits/AUD-QURAN-001_Quran_Text.md` | Complete |
| AUD-QURAN-002 | Quran Metadata | QUL Quran Metadata, Tanzil Quran Metadata | `audits/AUD-QURAN-002_Quran_Metadata.md` | Complete |

Acceptance criteria:

- canonical ayah ID strategy documented
- 114/6236 validation plan documented
- script variant decision path documented
- license/attribution status recorded

## Batch 2: Translations

Target day: Day 3

| Audit ID | Source Group | Candidate Sources | Output Audit File | Status |
| --- | --- | --- | --- | --- |
| AUD-TRANS-001 | English Translation | QUL resource 193, Tanzil `en.sahih` | `audits/AUD-TRANS-001_English_Translation.md` | Complete |
| AUD-TRANS-002 | Malay Translation | QUL resource 292, Tanzil `ms.basmeih` | `audits/AUD-TRANS-002_Malay_Translation.md` | Complete |
| AUD-TRANS-003 | Indonesian Translation | Tanzil `id.indonesian` | `audits/AUD-TRANS-003_Indonesian_Translation.md` | Optional Audit Complete |

Acceptance criteria:

- translator/source names documented
- license and attribution status recorded
- footnote handling identified
- ayah mapping confirmed
- AI translation boundary reaffirmed

## Batch 3: Tafsir, Topics, and Ayah Themes

Target day: Day 4

| Audit ID | Source Group | Candidate Sources | Output Audit File | Status |
| --- | --- | --- | --- | --- |
| AUD-TAFSIR-001 | Tafsir | QUL resources 266, 35, and 308 | `audits/AUD-TAFSIR-001_Tafsir.md` | Finalized; Private Import Approved |
| AUD-TOPIC-001 | Topics & Concepts | QUL resource 45 | `audits/AUD-TOPIC-001_Topics_Concepts.md` | Finalized; Private Import Approved |
| AUD-THEME-001 | Ayah Themes | QUL resource 62 | `audits/AUD-THEME-001_Ayah_Themes.md` | Finalized; Private Import Approved With Quality Flags |

Acceptance criteria:

- topic IDs and hierarchy inspected
- ayah-theme confidence fields inspected
- tafsir mapping method documented
- source/summary rules documented

## Batch 4: Hadith Collections

Target day: Day 5

| Audit ID | Source Group | Candidate Sources | Output Audit File | Status |
| --- | --- | --- | --- | --- |
| AUD-HADITH-001 | Hadith Collections | Official Sunnah.com API, Fawaz Ahmed, AhmedBaset, LK, SemakHadis, multilingual and research corpora | `audits/AUD-HADITH-001_Hadith_Collections.md` | Source Audit, Direct Acquisition, And Principal Validation Complete |

Acceptance criteria:

- exact repository/source selected for deeper review
- collection coverage documented
- Arabic/translation availability documented
- reference format documented
- provenance and scraping risk recorded

## Batch 5: Hadith Grades and Verification

Target day: Day 6

| Audit ID | Source Group | Candidate Sources | Output Audit File | Status |
| --- | --- | --- | --- | --- |
| AUD-GRADE-001 | Hadith Grades | Hadith source metadata, grade candidates | `audits/AUD-GRADE-001_Hadith_Grades.md` | Finalized |
| AUD-VERIFY-001 | Hadith Verification | SemakHadis, Dorar | `audits/AUD-VERIFY-001_Hadith_Verification.md` | Finalized Locally; External Acquisition Pending |

Acceptance criteria:

- grade source identified
- grade join method documented
- weak/fabricated handling documented
- external terms/API/storage risk recorded

## Batch 6: Prototype Design and Schema Recommendation

Target days: Day 7-Day 10

| Audit ID | Area | Output File | Status |
| --- | --- | --- | --- |
| PROTO-001 | Raw landing zone | `IMPORT_PROTOTYPE_DESIGN.md` | Finalized |
| PROTO-002 | Staging tables | `staging_table_recommendation.md` | Finalized |
| PROTO-003 | Validation rules | `validation_rules_by_domain.md` | Finalized |
| PROTO-004 | Canonical schema recommendation | `canonical_schema_recommendation.md` | Finalized |

Acceptance criteria:

- staging-before-canonical design confirmed
- raw manifest requirements confirmed
- validation rules per domain documented
- production schema deltas documented
