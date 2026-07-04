# AUD-HADITH-001: Hadith Collection Sources

Status: Source Audit, Raw Acquisition, And Principal Validation Complete  
Audit date: 2026-06-13

## Scope

- official Sunnah.com API
- `fawazahmed0/hadith-api`
- `AhmedBaset/hadith-json`
- `AhmedBaset/hadith-api`

Day 6 will separately audit grade and verification authorities.

## Official Sunnah.com API

Official sources:

- https://sunnah.com/about
- https://sunnah.com/developers
- https://github.com/sunnah-com/api
- https://sunnah.stoplight.io/docs/api/

Sunnah.com identifies this as its official API. Access requires an API key
requested through its GitHub repository. The developer page says the API
currently exposes a portion of data as manual checks are completed.

Sunnah.com prohibits website scraping and mass reproduction of complete books
or collections. It directs developers to use the API for data access.

The official schema exposes collections, books, chapters, hadiths, source
hadith numbers, language-specific URNs and bodies, and attributed grade
assertions. Arabic and English can have different URNs, chapter numbering, and
references because translations may split or combine source structures.

Decision recommendation:

`Official Reference And API Candidate; Acquire When Access Is Available`

Request API access and clarify snapshot storage, private testing, caching,
future public display, attribution, embeddings, and update terms.

## Fawaz Ahmed Hadith API

Repository:

https://github.com/fawazahmed0/hadith-api

Pinned metadata:

https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions.json

Version-1 metadata contains:

- 10 book groups
- 74 language editions
- 9 languages
- Arabic 20, English 10, French 9, Bengali 8, Turkish 8
- Urdu 7, Indonesian 7, Russian 3, Tamil 2
- no Malay edition

The repository has an Unlicense file, but its reference list identifies many
upstream websites, repositories, publications, and backup copies. The
repository-level licence does not establish rights to every incorporated text,
translation, or grade.

Metadata provenance is weak:

- 63 of 74 editions identify the author as `Unknown`
- 71 of 74 editions have a blank source field

Decision recommendation:

`Acquire Complete Dataset; Preserve Provenance Gaps; Not Automatically Canonical`

## AhmedBaset Hadith JSON/API

Repositories:

- https://github.com/AhmedBaset/hadith-json
- https://github.com/AhmedBaset/hadith-api

The project claims 50,884 Arabic/English hadith records across 17 books. It
states that the dataset was scraped from Sunnah.com and publishes no licence.
The latest documented tag is `v1.2.0`, dated 2024-04-06.

This conflicts with Sunnah.com's published prohibition on scraping and mass
reproduction. Its internal IDs are also repository-specific and do not retain
the full official API reference and grade model.

Decision recommendation:

`Acquire Into Quarantined Raw Storage For Private Comparison`

## Canonical Modeling Recommendation

Recommended entities:

- `hadith_collections`
- `hadith_collection_editions`
- `hadith_books`
- `hadith_chapters`
- `hadith_records`
- `hadith_text_versions`
- `hadith_references`
- `hadith_grade_assertions`
- `source_record_mappings`

Do not use a distributor's numeric ID or one hadith number as RAFIQ's universal
identity. Preserve source, collection, edition/language, source hadith number,
book, chapter, language-specific URN, and printed-edition references.

Store grade as a separate assertion containing grader, verbatim grade,
normalized grade, source, edition, and review status. Conflicting assertions
must coexist.

## Decision Boundary

The source and schema audit is complete. Acquire all available candidates,
including risk-flagged datasets, then validate and import every technically
usable source into the complete private platform. Public release remains a
separate later decision.

Acquisition and principal-payload validation were completed on 2026-06-14.
See `VAL-HADITH-001_Downloaded_Dataset_Validation_Comparison.md` for parsing,
counts, duplication, Unicode findings, and cross-source overlap evidence.
