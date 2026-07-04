# Day 3 Translation Audit Checklist

Status: Closed
Audit date: 2026-06-11
Decision date: 2026-06-12

## Source Discovery

- [x] Identify English launch candidate.
- [x] Identify Malay launch candidate.
- [x] Inspect optional Indonesian candidate.
- [x] Record official distributor IDs and URLs.
- [x] inspect available QUL export structures.

## Rights And Provenance

- [x] Review Tanzil translation catalog terms.
- [x] Confirm Tanzil Quran Text license does not govern translations.
- [x] Review QUL resource copyright pages.
- [x] Record QUL download authentication requirement.
- [x] Identify unresolved original publisher/rights-holder permission.
- [x] Record Malay attribution inconsistency.

## Raw Files And Integrity

- [x] Download representative English, Malay, and Indonesian files.
- [x] Preserve raw files unchanged.
- [x] Create SHA-256 checksums.
- [x] Create source manifests.
- [x] Validate 6,236 ayah records per language.
- [x] Check duplicates, blanks, key range, and cross-language key equality.
- [x] Inspect markup and footnote representation.
- [x] Acquire and validate authenticated QUL English and Malay files.
- [x] Compare QUL translation variants with Tanzil.

## Architecture

- [x] Reuse canonical ayah key `(surah_number, ayah_number)`.
- [x] Add source-specific translation identity.
- [x] Require verbatim source preservation.
- [x] Separate footnotes and chunks from translation text.
- [x] Reaffirm prohibition on AI-generated Quran translation substitution.

## Decision Gate

- [x] Draft Day 3 decision register.
- [x] Product owner approves or amends Day 3 decisions.
- [ ] Obtain original rights-holder evidence before any production import.
- [ ] Resolve Basmeih/Basamia attribution before production.

## Exit Status

Technical audit and decision gate are complete. Production translation sources remain unapproved.
