# RAFIQ Source & Licensing Register V1

Status: Build Gate
Last updated: 2026-06-14

## Purpose

RAFIQ acquires technically available candidate resources for private research,
platform construction, comparison, and testing. Authenticity, licensing,
access method, attribution, and approval status determine handling and public
release, not whether an available candidate is preserved.

This register starts as a checklist. It must be completed before public
release.

## Verification Notes

Partial web verification was performed on 2026-06-09. These notes do not replace a legal/content review.

- QUL documentation says it provides downloadable datasets and recommends JSON or SQLite for resource use. Its FAQ says commercial users should check repository license terms and dataset-specific licensing before production use: https://qul.tarteel.ai/docs and https://qul.tarteel.ai/docs/faq
- QUL credits state that many resources were created or curated by community contributors rather than Tarteel, so attribution and per-resource licensing must be tracked: https://qul.tarteel.ai/credits
- Tanzil Quran Text license states Creative Commons Attribution 3.0, allows use in applications with clear source indication and a link to tanzil.net, and does not allow changing the text: https://tanzil.net/docs/Text_License
- Fawaz Ahmed's hadith-api repository presents an Unlicense license and JSON endpoints, but religious reliability, translation provenance, and grade provenance still require review: https://github.com/fawazahmed0/hadith-api
- AhmedBaset's hadith-api says its data comes from the AhmedBaset hadith-json repository and was scraped from sunnah.com; this needs license and provenance review before RAFIQ use: https://github.com/AhmedBaset/hadith-api

## Source Status Key

| Status | Meaning |
| --- | --- |
| `Candidate` | Mentioned in docs, not verified. |
| `Verified` | Source, license, format, and attribution checked. |
| `Approved` | Verified and approved for RAFIQ import/use. |
| `Quarantined` | Acquired privately with prominent rights, provenance, reliability, or quality warnings. |
| `Public Release Blocked` | May be retained and tested privately but cannot be exposed publicly. |
| `Deferred` | Useful but not needed for MVP. |

## Register

| Source | Content Type | MVP Need | Status | Checks Required |
| --- | --- | --- | --- | --- |
| QUL / Quranic Universal Library | Quran text, translations, tafsir, topics, metadata | High | Raw Validated / Approval Packs In Progress / Production Blocked | Authenticated files for audited Days 2-4 resources were acquired for immutable raw audit and technical validation. Production rights approval packs for resources `86`, `88`, `193`, and `292` started on 2026-06-12. Copyright pages for audited resources report no copyright information. No QUL content is production-approved until all approval gates pass. |
| Tanzil Quran Text v1.1 | Arabic Quran text | High | Approved for Staging With Conditions | Day 2 decision finalized. Use for staging, integrity validation, and comparison. Preserve verbatim; comply with attribution/link/copyright requirements. Not approved as production display script. |
| Tanzil Quran Metadata v1.0 | Quran metadata | High | Approved for Staging With Conditions | Day 2 decision finalized. Use for schema discovery and validation. Production use requires metadata-specific license and attribution confirmation. |
| Saheeh International via Tanzil `en.sahih` / QUL 193 | Translation | High | Approved for Staging / Production Blocked | 6,236 records validated. Tanzil terms allow non-commercial use only unless translator/publisher permission is obtained. QUL reports no copyright information and requires sign-in for downloads. |
| Abdullah Muhammad Basmeih via Tanzil `ms.basmeih` / QUL 292 | Translation | High for Malay launch | Approved for Staging / Production Blocked | 6,236 records validated. Resolve production rights and QUL's inconsistent `Abdullah Basamia` label before public use. |
| Indonesian Ministry translation via Tanzil `id.indonesian` | Translation | Medium | Optional Staging / Production Blocked | 6,236 records validated. Confirm original ministry source, current rights, and attribution before production use. |
| QUL English Al-Mukhtasar 266 / English Ibn Kathir 35 / Arabic As-Sa'di 308 | Tafsir | Medium | Private Platform Approved / Public Release Blocked | Authenticated JSON/SQLite acquired and validated. Complete private import is approved. Confirm original edition, translator, text rights, summary rights, and attribution before public release. Import 59 blank As-Sa'di records with quality flags. |
| QUL Topics and Concepts 45 | Quran topics | High | Private Platform Approved / Public Release Blocked | 2,512 IDs and 30,687 ayah links validated. Complete private import is approved. Composite upstream provenance and rights require per-namespace review before public release. |
| QUL Ayah Theme 62 | Ayah themes | High | Private Platform Approved With Quality Flags / Public Release Blocked | Actual file has 2,098 rows representing 1,049 exact duplicate pairs, covers 6,200 ayahs, leaves 36 gaps, and has no confidence field. Preserve raw data and apply documented derived-staging quality handling. |
| Sunnah.com official API | Hadith collections | High | API/Export Request Pending | Official API supports source-qualified collection, book, chapter, hadith, language URN, and grade data. Acquire every dataset made available through the API/export process. |
| Fawaz Ahmed hadith-api | Hadith collections and grades | Medium | Complete Private Acquisition / Public Rights Unresolved | Pinned branch `1` acquired and validated. Metadata has major author/source gaps; repository licensing does not establish rights for every incorporated edition. |
| AhmedBaset hadith-json/API | Hadith collections | Low | Quarantined Private Acquisition / Public Release Blocked | Tag `v1.2.0` and API repository acquired. The project states the dataset was scraped from Sunnah.com; retain scraping, rights, and provenance warnings. |
| LK-Hadith-Corpus | Hadith intelligence/research corpus | Medium | Private Acquisition And Technical Audit Complete / Public Review Pending | Acquired and profiled for structure, annotations, segmentation, grades, and shared-text comparison. Verify exact rights and public suitability before release. |
| SemakHadis | Malay hadith verification | Medium | Archived Private Adapter Import Approved / Live Export Pending | API/frontend repositories, 60-row workbook, and mock records acquired and audited. Request official live export, terms, attribution, and cleaner source data. |
| Dorar | Hadith verification | Medium | Access Request And Adapter Candidate | Methodology and endpoint documented; automated endpoint returned HTTP 403. Do not bypass access controls or claim coverage before authorized access. |
| Audio reciters | Quran audio | Post-MVP | Deferred | Confirm streaming/download rights and attribution. |

## Approval Requirements

Before any source becomes `Approved`, record:

- official source URL
- license or terms URL
- permitted use: private, public, commercial, non-commercial
- attribution wording
- data format
- import method
- update cadence
- checksum or integrity method
- reviewer name and date
- scholar/content approval where relevant

## Build Rule

All technically available candidates may be acquired and used in the complete
private platform with source and risk labels. Only `Approved` source versions
may be exposed through a public-release deployment.
