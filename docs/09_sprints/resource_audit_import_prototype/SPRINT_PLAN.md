# RAFIQ Resource Audit & Import Prototype Sprint

Status: Complete And Closed
Recommended duration: 10 working days
Created: 2026-06-09

## Sprint Purpose

Before RAFIQ builds the app experience, database, retrieval engine, or AI graph at full scale, we must understand the real structure, licensing, reliability, and quirks of the resources we intend to import.

This sprint answers:

- Which resources can RAFIQ legally and safely use?
- What exact data structures do those resources provide?
- What identifiers can be used to link Quran, translations, tafsir, topics, hadith, grades, and verification records?
- What staging tables and import jobs are needed?
- What should the canonical RAFIQ content model look like after real data inspection?

## Sprint Principle

Do not force resources into an imagined schema.

First audit, land, inspect, and prototype imports. Then lock the canonical schema.

## Sprint Outcomes

By the end of this sprint, RAFIQ should have:

- completed resource audit records for priority sources
- license and attribution status for each candidate source
- raw data landing-zone rules
- source metadata and checksum requirements
- staging import table design
- import prototype workflow
- schema discovery notes
- canonical data model recommendations
- production import go/no-go decision per resource

## Scope

### In Scope

- QUL resource audit
- Quran text source audit
- translation source audit
- tafsir source audit
- topic/theme source audit
- hadith source audit
- hadith grade/verification source audit
- raw landing-zone design
- staging-table design
- import prototype design
- validation checklist
- import job logging design

### Out of Scope

- full production import
- production AI guidance generation
- public launch
- unresolved legal/content approval decisions

Mobile UI, backend, retrieval, and knowledge-graph implementation may proceed
in parallel outside this audit sprint using private staging content under
`BUILD_PENDING_CONTENT_APPROVAL_DECISION.md`.

## Workstreams

| Workstream | Goal | Primary Output |
| --- | --- | --- |
| WS1 Source Discovery | Identify exact source URLs, repos, files, formats, and maintainers. | Completed source audit forms. |
| WS2 License & Attribution | Determine allowed usage, attribution, and restrictions. | Updated source/licensing register. |
| WS3 Data Structure Audit | Inspect schemas, IDs, languages, counts, and quality issues. | Dataset structure reports. |
| WS4 Raw Landing Zone | Define how raw resources are stored unchanged. | Landing-zone spec. |
| WS5 Import Prototype | Design and test staging imports for representative datasets. | Prototype import report. |
| WS6 Canonical Model Recommendation | Recommend final RAFIQ tables and relationships based on real data. | Canonical model recommendation. |

## Priority Sources

| Priority | Source Group | Reason |
| --- | --- | --- |
| P0 | Arabic Quran text | Foundation for all Quran-linked content. |
| P0 | Quran metadata | Required for validation and navigation. |
| P0 | English translation | Launch language and AI/user explanation layer. |
| P0 | Malay translation | Important for target audience if Malay launch is planned. |
| P0 | QUL topics/themes | Core guidance retrieval layer. |
| P0 | Ayah themes | Directly powers mood-to-guidance matching. |
| P1 | Tafsir | Needed for explanation quality and source-grounded guidance. |
| P1 | Hadith collections | Needed for Sunnah support in guidance. |
| P1 | Hadith grades/verifications | Needed for trust and authenticity. |
| P2 | Indonesian translation/tafsir | Useful if bilingual/regional expansion is planned. |
| P2 | Similar ayahs | Useful for graph expansion, not first import lock. |
| P3 | Audio, morphology, grammar, mushaf layouts | Defer unless required by a later feature. |

## Sprint Timeline

| Day | Focus | Deliverables |
| --- | --- | --- |
| Day 1 | Sprint setup and source shortlist | Source shortlist, audit assignments, folder/data rules. |
| Day 2 | QUL and Quran text audit | QUL audit forms, Quran text source decision draft. |
| Day 3 | Translation audit | English/Malay/Indonesian translation audit forms. |
| Day 4 | Tafsir and topic/theme audit | Tafsir, topics, ayah themes structure notes. |
| Day 5 | Hadith source audit | Hadith collection source forms and risk notes. |
| Day 6 | Hadith grade/verification audit | SemakHadis/Dorar/grade source assessment. |
| Day 7 | Raw landing-zone and staging schema | Landing-zone spec and staging table draft. |
| Day 8 | Import prototype design | Prototype scripts plan and sample import acceptance criteria. |
| Day 9 | Canonical schema recommendation | Production schema delta recommendations. |
| Day 10 | Sprint review and go/no-go | Resource decision matrix, import roadmap, build readiness update. |

## Definition of Done

The sprint is complete when:

- every P0 source has an audit status
- every P0 source has license/attribution status
- every P0 source has a known data format and access method
- every P0 source has an import decision: approve, block, defer, or needs review
- staging import schemas are documented
- validation rules are documented
- canonical model changes are documented
- unresolved risks are recorded in the correction register

## Go/No-Go Rules

### Go To Import Prototype

A source can enter local/staging import prototype if:

- official source or repository is identified
- format is known
- content scope is known
- the resource is technically obtainable or an access request can be recorded
- raw file can be preserved unchanged

Pending rights, attribution, provenance, quality, or scholar approval do not
remove a resource from private acquisition scope. Record the status and isolate
the source where necessary.

### Go To Production Import

A source can enter production import only if:

- license and attribution are approved
- religious/content reliability is reviewed
- integrity checks are defined
- schema mapping is documented
- source versioning is captured
- publication workflow exists

## Key Risk

The greatest risk is not technical import difficulty. It is importing content whose license, source provenance, translation rights, or religious reliability is unclear.

The sprint must prioritize trust over speed.
