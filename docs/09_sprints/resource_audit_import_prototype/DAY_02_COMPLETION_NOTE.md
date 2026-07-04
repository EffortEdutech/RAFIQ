# Day 2 Completion Note

Status: Closed
Audit date: 2026-06-10
Decision date: 2026-06-11

## Completed

- Verified QUL official documentation, FAQ, credits, data model, and Quran resource pages.
- Verified Tanzil official download, license, updates, and metadata documentation.
- Downloaded Tanzil Quran Text Uthmani v1.1.
- Downloaded Tanzil Quran Metadata v1.0.
- Preserved raw files, manifests, and SHA-256 checksums.
- Validated 6236 unique ayah keys across 114 surahs.
- Validated Tanzil metadata counts.
- Documented Tanzil/QUL Bismillah representation differences.
- Created Quran text and metadata audit reports.
- Created text and metadata validation reports.

## Key Findings

1. Tanzil has clear text provenance, versioning, and license terms.
2. Tanzil raw text must remain unchanged.
3. Tanzil's selected text export includes Bismillah as a prefix in most first ayahs.
4. QUL's views separate Bismillah from ayah text and expose `bismillah_pre`.
5. QUL JSON/SQLite downloads required sign-in and were acquired on 2026-06-12.
6. QUL copyright pages for resources `88`, `86`, `69`, and `70` state that copyright information is unavailable.

## Final Decisions

See `DAY_02_DECISION_REGISTER.md`.

- Canonical RAFIQ ayah identity approved as `(surah_number, ayah_number)`.
- Raw source preservation and lineage rules approved.
- Tanzil Quran Text approved for staging with conditions.
- Tanzil Metadata approved for staging; production licensing remains conditional.
- QUL audited Quran resources approved for schema discovery only and blocked for production.
- Bismillah storage architecture approved.
- Final Bismillah UI rendering deferred pending source, license, and scholar review.
- Production display script remains unapproved.

## Tracked Conditions And Blockers

- Confirm Tanzil metadata license.
- Resolve QUL resource provenance/permission.
- Resolve QUL/Tanzil ruku and rub boundary differences through source-qualified storage and scholar/content review.
- Complete final Bismillah UI rendering review.

## Next Scheduled Batch

Day 3: Translation audit

- English translation candidates
- Malay translation candidates
- Indonesian translation optional
