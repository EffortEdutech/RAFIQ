# Day 5 Hadith Source Decision Register

Sprint: RAFIQ Resource Audit & Import Prototype  
Decision gate: Hadith Collection Sources  
Status: Finalized  
Audit date: 2026-06-13  
Decision date: 2026-06-14  
Approver: Product Owner

## Final Decisions

| ID | Decision | Final Status |
| --- | --- | --- |
| D5-DEC-001 | Acquisition objective | Comprehensive Multi-Source Collection Approved |
| D5-DEC-002 | Official Sunnah.com path | API And Export Request Remains Open |
| D5-DEC-003 | AhmedBaset hadith-json/API | Quarantined Raw Acquisition Approved |
| D5-DEC-004 | Fawaz Ahmed hadith-api | Complete Pinned Dataset Acquired |
| D5-DEC-005 | Canonical hadith identity | Source-Qualified Composite Identity Approved |
| D5-DEC-006 | Language editions | Separate Text Versions Required |
| D5-DEC-007 | Numbering and URNs | Preserve All Source References |
| D5-DEC-008 | Grades | Separate Attributed Assertions Required |
| D5-DEC-009 | Private platform use | All Technically Usable Resources Approved |
| D5-DEC-010 | Public release | Rights And Content Approval Required |
| D5-DEC-011 | Dataset validation gate | Passed With Registered Quality Defects |

## D5-DEC-001: Acquisition Objective

Acquire and preserve every technically available repository, dataset file, API
snapshot, seed database, and research corpus listed in
`hadith/COMPLETE_HADITH_RESOURCE_DOWNLOAD_MANIFEST.md`.

Direct acquisition completed with 24 snapshots, 654,970 files, and 18.442 GB
of raw resources. API and owner-supplied exports that require external access
remain parallel acquisition work and do not reopen this decision.

## D5-DEC-002: Official And Restricted Access

Continue the official Sunnah.com API request and requests for Dorar,
HadeethEnc, IslamHouse, and live SemakHadis exports.

For every later snapshot, record:

- source and access method
- retrieval date and version
- complete checksum
- stated terms and attribution
- collection, edition, language, and schema metadata

## D5-DEC-003: AhmedBaset

Keep AhmedBaset hadith-json `v1.2.0` and its related API repository in
quarantined immutable raw storage with scraping, rights, and provenance flags.

The content may be used for controlled private comparison, adapter
development, and testing. It must not be silently treated as authoritative or
publicly released while its source conflict remains unresolved.

## D5-DEC-004: Fawaz Ahmed

Retain the complete pinned version-1 dataset. The repository-level Unlicense
does not resolve rights or provenance for every incorporated edition.

Preserve author, source, language, edition, and upstream-reference gaps as
explicit metadata.

## D5-DEC-005: Canonical Identity

Use an internal RAFIQ identity with source-qualified mappings. Preserve:

- source and source version
- collection and collection edition
- language and translator
- source hadith number
- book and chapter references
- language-specific URNs where supplied
- printed-edition references
- raw and normalized text hashes

No distributor ID, row number, text hash, or hadith number is a universal
identity. Exact text overlap creates a candidate mapping only.

## D5-DEC-006: Language Editions

Store Arabic and every translation as separate text versions. Each version
must retain source, edition, translator where known, checksum, quality flags,
and approval status.

Translation differences must not overwrite Arabic identity or another
translation edition.

## D5-DEC-007: Numbering And References

Preserve every source numbering system and reference verbatim. Repeated
numbers, split narrations, combined narrations, and edition-specific numbering
must coexist until a reviewed source mapping resolves their relationship.

## D5-DEC-008: Grades

Store grades as attributed assertions containing:

- verbatim grade
- normalized grade where available
- grader or authority
- source and edition
- supporting reference
- review and approval status

Conflicting grades must coexist. Day 6 will audit grade authorities,
normalization, and verification sources.

## D5-DEC-009: Private Platform Use

Import every technically usable acquired resource into the complete private
platform for:

- schema and adapter development
- search and retrieval testing
- multilingual comparison
- grade and verification workflows
- AI/RAG testing
- rendering and end-to-end integration

Pending rights, attribution, or content approval do not disable content inside
the private development and testing environment.

## D5-DEC-010: Public Release

Public display, public APIs, public retrieval, public AI/RAG responses, and
commercial redistribution require:

- source provenance and rights evidence
- approved attribution
- grade provenance
- editorial quality review
- scholar/content review where required
- Product Owner approval
- deployment controls preventing accidental public exposure

## D5-DEC-011: Validation And Quality Defects

The principal-payload validation gate passed:

- 566 principal payloads profiled
- 563 parsed successfully
- 32 Parquet files and 620,550 Parquet rows validated
- five source families compared across the six major shared collections

The three malformed SemakHadis support files do not block private import:

- `narrator_seeder.csv` contains non-UTF-8 bytes
- `reference_seeder.csv` contains non-UTF-8 bytes and lossy Arabic text
- `tags.json` contains a trailing comma

Preserve the raw files unchanged. Any decoding, JSON repair, normalization, or
deduplication must occur in versioned derived staging with checksums, quality
flags, and transformation lineage.

See
`audits/VAL-HADITH-001_Downloaded_Dataset_Validation_Comparison.md`.

## Approval Effect

Approval closes Day 5, authorizes comprehensive private import and testing,
and locks the source-qualified hadith identity architecture.

It does not authorize public display, public retrieval, public API access, or
commercial redistribution.

## Day 5 Closure

Day 5 is formally closed.

External API/export acquisition, rights work, attribution, editorial review,
and scholar/content approval remain parallel activities. They do not block
private platform completion.

