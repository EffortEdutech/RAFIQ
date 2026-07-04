# Day 7 Raw Landing-Zone And Staging Schema Checklist

Status: Closed  
Design date: 2026-06-14

## Landing Zone

- [x] Confirm immutable raw-object rule.
- [x] Separate source, snapshot, and raw-object identity.
- [x] Define versioned folder convention for future acquisitions.
- [x] Preserve existing Day 2-Day 6 paths as registered legacy paths.
- [x] Define principal, mirror, generated, metadata, evidence, archive, and
  support object roles.
- [x] Define archive/member lineage.
- [x] Define checksum, byte-length, format, encoding, and locator requirements.

## Source Registry

- [x] Define source registry fields.
- [x] Define acquisition snapshot fields.
- [x] Define raw object fields.
- [x] Separate technical, rights, attribution, content, and publication state.
- [x] Define V1 manifest compatibility.
- [x] Create V2 manifest template.

## Import Runs And Lineage

- [x] Define parser/import run identity.
- [x] Define idempotency key.
- [x] Define row-level source locators.
- [x] Define validation findings.
- [x] Define transformation events.
- [x] Define multi-parent record lineage.

## Staging Schema

- [x] Quran scripts and source-qualified partitions.
- [x] Translation editions, footnotes, and chunks.
- [x] Tafsir passages and passage-to-ayah links.
- [x] Source topic namespaces, relations, and ayah links.
- [x] Ayah-theme groups and expanded ayah links.
- [x] Hadith collections, editions, books, chapters, and records.
- [x] Hadith text versions, references, isnad, matn, narrators, and annotations.
- [x] Grade assertions and verification claims.
- [x] Candidate cross-source mappings.

## Security And Approval

- [x] Keep `ingest` and `staging` outside client-facing schemas.
- [x] Revoke `anon` and `authenticated` access in reference DDL.
- [x] Permit all technically usable content in private mode.
- [x] Keep public-release approval version-specific.
- [x] Require derived records to inherit parent restrictions.

## Evidence

- `IMPORT_PROTOTYPE_DESIGN.md`
- `SOURCE_REGISTRY_CONTRACT_V2.md`
- `staging_table_recommendation.md`
- `templates/SOURCE_MANIFEST_TEMPLATE_V2.json`
- `schemas/day7_ingest_staging_reference.sql`

## Exit Status

Day 7 design is approved and complete. The SQL remains reference DDL, not a
production migration. Day 8 will build representative loaders and executable
validation rules.

The Hadith acquisition currently has repository-level snapshot identity and
163 principal checksums, not a complete raw-object registry for every generated
file. Day 8 must generate that inventory or explicitly register generated
subtrees through an aggregate manifest policy.

The Product Owner finalized the Day 7 Decision Register on 2026-06-14.
