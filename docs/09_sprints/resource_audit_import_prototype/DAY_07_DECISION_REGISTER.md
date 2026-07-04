# Day 7 Raw Landing-Zone And Staging Schema Decision Register

Sprint: RAFIQ Resource Audit & Import Prototype  
Decision gate: Raw Landing Zone And Staging Architecture  
Status: Finalized  
Design date: 2026-06-14  
Decision date: 2026-06-14  
Approver: Product Owner

## Final Decisions

| ID | Decision | Final Status |
| --- | --- | --- |
| D7-DEC-001 | Raw storage | Immutable Objects Approved |
| D7-DEC-002 | Registry identity | Source, Snapshot, And Object Separated |
| D7-DEC-003 | Existing raw paths | Grandfathered And Registered |
| D7-DEC-004 | Staging strategy | Source-Shaped Before Canonical |
| D7-DEC-005 | Import execution | Versioned And Idempotent Runs |
| D7-DEC-006 | Corrections | Derived Transformations With Lineage |
| D7-DEC-007 | Quality defects | Additive Findings; No Silent Deletion |
| D7-DEC-008 | Approval state | Independent Version-Specific Dimensions |
| D7-DEC-009 | Database security | Private Ingest And Staging Schemas |
| D7-DEC-010 | Reference DDL | Approved For Prototype Implementation Only |

## D7-DEC-001: Immutable Raw Storage

Preserve every registered raw byte sequence unchanged. Any corrected, decoded,
normalized, deduplicated, expanded, or reformatted form is a derived staging
artifact with separate identity and lineage.

A successful import does not authorize deletion or modification of raw
evidence.

## D7-DEC-002: Source Identity

Use three distinct identities:

- continuing source/provider identity
- acquired version or snapshot
- immutable file, response, database, or archive-member object

Do not overload one manifest row with all three identities.

## D7-DEC-003: Existing Paths

Do not move or rename the existing Day 2-Day 6 raw files merely to match the
new folder convention. Register their current paths as legacy raw-object
locators.

Use the versioned provider/source/snapshot layout for future acquisitions.

## D7-DEC-004: Source-Shaped Staging

Parse every dataset into source-shaped staging before canonical mapping.
Staging must preserve source IDs, numbering, editions, grouping, duplicates,
conflicts, blanks, and packed relationships.

Canonical constraints must not cause source evidence to be discarded during
staging.

## D7-DEC-005: Import Runs

Every parser execution is a versioned import run. Its idempotency identity
includes:

- source snapshot
- parser name and version
- code revision
- configuration hash
- input raw objects

A changed parser or configuration creates a new run and does not overwrite
prior findings.

## D7-DEC-006: Corrections And Lineage

Perform encoding repair, malformed JSON repair, normalization, deduplication,
range expansion, splitting, merging, and source mapping only through
versioned transformation events.

Every derived record must retain all relevant parent records and raw-object
lineage.

## D7-DEC-007: Quality Findings

Represent defects as additive findings. Preserve:

- exact duplicates
- coverage gaps
- blank text
- malformed keywords
- invalid encodings
- unreliable source fields
- grade disagreements
- missing attribution and rights evidence

No import rule may silently delete or overwrite these conditions.

## D7-DEC-008: Approval Dimensions

Track technical validation, rights, attribution, editorial review,
scholar/content review, and publication status independently for each exact
source snapshot.

Private mode uses every technically usable record. Public-release mode exposes
only records that pass the required gates. Derived records inherit the
strictest restriction of their source parents.

## D7-DEC-009: Database Security

Place source registry, raw-object metadata, import runs, findings, lineage, and
source-shaped staging records in private `ingest` and `staging` schemas.

Client Data API roles must not access those schemas. Only server-side importers
and approved administrative services may read or write them.

## D7-DEC-010: Reference DDL

Approve `schemas/day7_ingest_staging_reference.sql` as the implementation
contract for Day 8 prototyping.

It is not a production migration. A formal migration requires:

- executable loader and validation tests
- schema review
- Supabase/PostgreSQL compatibility verification
- security review
- migration-generation and rollback planning

## Raw-Object Inventory Gap

The Hadith acquisition has repository-level snapshot metadata and 163
principal checksums, but not one object-registry row for every file in the
654,000-plus-file tree.

Day 8 must either:

1. produce a complete per-file raw-object inventory; or
2. approve a reproducible aggregate-manifest policy for generated subtrees,
   while retaining per-file identity for every principal parse input.

This gap does not invalidate Day 7 design, but it must remain visible.

## Approval Effect

Approval closes Day 7 and authorizes Day 8 implementation of representative
loaders, validation rules, raw-object inventory tooling, and import acceptance
tests against this architecture.

It does not lock the final canonical production schema or deploy a database
migration.

## Day 7 Closure

Day 7 is formally closed.

Day 8 begins with the Hadith raw-object inventory policy/tool, followed by
representative source loaders and executable validation rules.

