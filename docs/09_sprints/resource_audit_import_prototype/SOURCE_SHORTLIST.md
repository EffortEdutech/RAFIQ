# Source Shortlist

Status: Accepted
Last updated: 2026-06-12

## Purpose

This shortlist defines which content resources RAFIQ will audit first.

Priority means audit priority, not production approval.

## P0: Foundation Sources

These must be audited before the canonical RAFIQ content model can be locked.

| Source Group | Candidate Source | Why It Matters | Day | Status |
| --- | --- | --- | --- | --- |
| Quran Text | QUL Quran Script, Tanzil Quran Text | Canonical ayah text and ayah validation. | Day 2 | Complete |
| Quran Metadata | QUL Quran Metadata, Tanzil Quran Metadata | Surah, ayah, juz, hizb, sajdah, navigation. | Day 2 | Complete |
| English Translation | QUL Saheeh resource 193, Tanzil `en.sahih` | Launch translation and guidance display. | Day 3 | Complete; Staging Only |
| Malay Translation | QUL resource 292, Tanzil `ms.basmeih` | Key target audience support. | Day 3 | Complete; Staging Only |
| Topics & Concepts | QUL resource 45 | Theme retrieval and mood-to-guidance mapping. | Day 4 | Private Import Approved; Public Release Pending |
| Ayah Themes | QUL resource 62 | Direct Quran recommendation layer. | Day 4 | Private Import Approved With Quality Flags; Public Release Pending |

## P1: Guidance Depth Sources

These should be audited during the same sprint, but may not all be production-approved by sprint end.

| Source Group | Candidate Source | Why It Matters | Day | Status |
| --- | --- | --- | --- | --- |
| Tafsir | QUL English Al-Mukhtasar 266, English Ibn Kathir 35, Arabic As-Sa'di 308 | Source-grounded explanation. | Day 4 | Private Import Approved; Public Release Pending |
| Hadith Collections | Sunnah.com API/export; Fawaz Ahmed; AhmedBaset; LK corpus; SemakHadis; Hugging Face candidates | Sunnah evidence, comparison, multilingual coverage, and retrieval testing. | Day 5 | Direct Acquisition And Principal Validation Complete |
| Hadith Grades | Fawaz, MeeAtif, LK, collection metadata, official APIs | Source-attributed authenticity assertions. | Day 6 | Audit And Architecture Approved |
| Hadith Verification | SemakHadis, Dorar | Weak/fabricated/verification layer. | Day 6 | Local Architecture Approved; External Access Pending |

## P2: Regional/Future Sources

| Source Group | Candidate Source | Why It Matters | Day | Status |
| --- | --- | --- | --- | --- |
| Indonesian Translation | Tanzil `id.indonesian`; QUL candidates remain for later comparison | Regional expansion and bilingual support. | Day 3 or Deferred | Optional Audit Complete |
| Indonesian Tafsir | QUL Indonesian tafsir resources | Regional explanation layer. | Day 4 or Deferred | Pending |
| Similar Ayahs | QUL Similar Ayahs | Graph expansion and discovery. | Day 9 or Deferred | Pending |
| Transliteration | QUL Transliteration resources | Beginner/new Muslim support. | Deferred | Pending |

## Deferred Sources

| Source Group | Reason Deferred |
| --- | --- |
| Audio Recitations | Licensing/storage/CDN complexity; not required for import schema lock. |
| Morphology | Valuable later for Arabic learning, not required for guidance MVP. |
| Grammar | Valuable later for study mode, not required for guidance MVP. |
| Mushaf Layouts | Needed only if RAFIQ becomes a full mushaf reader. |
| Fonts | Design/runtime concern, not core content import. |

## Current Recommendation

Audit Quran/QUL foundation first, then translations, then topics/themes/tafsir, then hadith and verification sources.

Do not choose the production database schema until P0 source structures have been inspected.
