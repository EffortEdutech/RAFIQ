# Day 2 Decision Register

Sprint: RAFIQ Resource Audit & Import Prototype  
Decision gate: Quran Foundation  
Status: Finalized  
Decision date: 2026-06-11  
Approver: Product Owner  

## Purpose

This register closes the Day 2 Quran Foundation audit by converting its evidence into binding architecture and source-use decisions.

These decisions remain controlling unless later evidence triggers a documented change decision.

## Decision Statuses

| Status | Meaning |
| --- | --- |
| `Approved` | Adopt immediately. |
| `Approved With Conditions` | Adopt within the stated limits. |
| `Deferred` | Deliberately postponed until named evidence or review exists. |
| `Blocked` | Must not proceed. |

## D2-DEC-001: Canonical Ayah Identity

**Question:** What identifier should RAFIQ use to join Quran text, translations, tafsir, themes, and related resources?

**Evidence:**

- Tanzil provides stable surah and ayah numbers across 6,236 validated records.
- QUL recommends `surah_id + ayah_number` for ayah-level joins and exposes `verse_key`.
- Source-internal numeric IDs may differ between datasets.

**Decision:** `Approved`

RAFIQ will use:

- canonical natural key: `(surah_number, ayah_number)`
- generated interchange key: `verse_key`, such as `2:255`
- derived global ordering key: `global_ayah_number`, validated from 1 to 6,236

Source-specific IDs must be preserved in mapping records and must not replace the canonical natural key.

**Affected architecture:**

- `quran_surahs`
- `quran_ayahs`
- translations
- tafsir
- ayah themes
- knowledge graph links
- source record mappings

## D2-DEC-002: Raw Source Preservation

**Question:** May RAFIQ alter imported Quran source files or overwrite one source representation with another?

**Decision:** `Approved`

All raw Quran resources must remain immutable and source-specific.

Required rules:

- preserve downloaded files unchanged
- record SHA-256 checksum
- record source, version, access date, license, and attribution
- never overwrite one source with another
- store transformations as separate derived records
- retain a clear lineage from every derived record to its raw source

For Tanzil, the copyright block and no-change requirements must be preserved.

## D2-DEC-003: Tanzil Usage

**Question:** How may RAFIQ use Tanzil Quran Text v1.1 and Quran Metadata v1.0?

**Decision:** `Approved With Conditions`

### Quran Text

Approved for:

- staging imports
- integrity validation
- source comparison
- canonical Quran count and key verification

Conditions:

- preserve text verbatim
- show required Tanzil attribution and link when used
- preserve the copyright notice where required
- do not silently strip or alter Bismillah prefixes

Not yet approved as RAFIQ's production display script.

### Quran Metadata

Approved for:

- staging schema discovery
- count and partition validation

Production use remains conditional on confirming metadata-specific license and attribution terms.

## D2-DEC-004: QUL Usage

**Question:** How may RAFIQ use the audited QUL Quran script and metadata resources?

**Decision:** `Approved With Conditions` for schema discovery; `Blocked` for production content use.

Approved for:

- public schema inspection
- resource discovery
- data-model comparison
- planning staging adapters

Blocked for:

- production import
- public display
- redistribution
- treating QUL as the copyright owner

Reasons:

- authenticated JSON/SQLite acquisition and technical validation do not establish production rights
- copyright pages for audited resources `88`, `86`, `69`, and `70` state that copyright information is unavailable

Production use requires:

- original source provenance
- permission or applicable license
- attribution requirements
- final script selection and scholar/content approval

## D2-DEC-005: Bismillah Storage and Presentation

**Question:** How should RAFIQ handle the difference between Tanzil's prefixed Bismillah representation and QUL's separate presentation metadata?

**Decision:** `Approved` for storage architecture; final UI rendering is `Deferred`.

Storage rules:

- preserve every source's verbatim ayah text
- never derive a production display variant by altering licensed Tanzil text
- store whether a source record includes a Bismillah prefix
- model Bismillah presentation separately from canonical ayah identity
- retain source and script attribution for any Bismillah text
- treat Surah At-Tawbah as an explicit policy case

Recommended fields:

- `includes_bismillah_prefix`
- `bismillah_pre`
- `bismillah_source_id`
- `display_policy`

Final UI rendering requires:

- comparison with an approved display-text source
- scholar/content review
- license confirmation
- testing for Surah Al-Fatihah, At-Tawbah, and ordinary surah openings

Until then, no implementation may silently remove, duplicate, or synthesize Bismillah text.

## Final Day 2 Source Decisions

| Source/Area | Final Status |
| --- | --- |
| Canonical ayah identity | Approved |
| Raw source preservation | Approved |
| Tanzil Quran Text v1.1 | Approved for staging with conditions |
| Tanzil Quran Metadata v1.0 | Approved for staging; production license confirmation required |
| QUL audited Quran resources | Schema discovery only; production blocked |
| Bismillah storage architecture | Approved |
| Final Bismillah UI rendering | Deferred pending source, license, and scholar review |
| Production Quran display script | Not approved yet |

## Change Control

Any future change to these decisions must include:

- new evidence
- affected source and version
- impact analysis
- replacement decision ID
- approver and date

## Day 2 Closure

Day 2 is formally closed.

The remaining items are tracked conditions and blockers, not reasons to keep the Day 2 audit open.

## Amendment: Authenticated QUL Files

Amendment date: 2026-06-12

Authenticated files for resources `63-70`, `86`, and `88` were acquired and technically validated.

Amended effect on `D2-DEC-004`:

- raw acquisition condition: satisfied
- checksum and file-level validation condition: satisfied
- schema discovery: complete
- production use: still blocked pending provenance, license, attribution, script selection, and scholar/content approval

Additional binding findings:

- QUL script variants remain source-specific and must not overwrite Tanzil.
- Bismillah remains separate presentation metadata in QUL.
- partition values must be source-qualified because QUL and Tanzil disagree on ruku and one rub/hizb-quarter boundary.
- QPC Hafs rendering must retain its required font and ayah-end numeral behavior.
