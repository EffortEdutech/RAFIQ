# AUD-THEME-001: QUL Ayah Themes

Status: Finalized
Audit date: 2026-06-12

## Source Identity

- QUL resource `62`
- URL: https://qul.tarteel.ai/resources/ayah-theme/62
- Advertised format: SQLite
- Public count: 1,049 theme groups
- Language tag: English

## Access And Rights

The authenticated SQLite file was acquired on 2026-06-12. QUL's copyright page states that it has no copyright information. Original authorship, editorial method, license, attribution, and production permission remain unresolved.

## Published Structure

The resource represents a concise theme for a contiguous ayah group.

Published columns:

- `theme`
- `surah_number`
- `ayah_from`
- `ayah_to`
- `keywords`
- `total_ayahs`

The actual SQLite field is `ayah_to`.

No confidence field is listed or found in the preserved public page. Earlier RAFIQ assumptions that QUL supplies ayah-theme confidence values are therefore incorrect.

At least five records contain the likely malformed or truncated keyword `Wai`.

## File Validation Findings

- physical rows: 2,098
- unique exact records: 1,049
- every unique record is duplicated exactly once
- valid, non-overlapping ranges: 1,049
- ayahs covered: 6,200
- ayahs uncovered: 36
- range and `total_ayahs` mismatches: 0
- confidence field: absent

## RAFIQ Mapping

Recommended entities:

- `source_ayah_theme_groups`
- `source_ayah_theme_group_ayahs`
- `source_ayah_theme_keywords`
- `rafiq_themes`
- `rafiq_theme_source_mappings`

Required rules:

- store the source range and theme text verbatim
- expand group-to-ayah links in a separate mapping table
- never interpret missing confidence as high confidence
- any RAFIQ confidence score must be explicitly derived, versioned, and reviewed
- do not merge source keywords directly into the governed RAFIQ taxonomy

## Validation Still Required

- [x] actual record and unique-group counts
- [x] range bounds and `total_ayahs` consistency
- [x] overlap and gap analysis
- [x] field-name confirmation
- [x] initial malformed-keyword checks
- language and editorial quality review
- provenance and rights confirmation

## Decision Recommendation

`Private Platform Approved With Quality Flags; Public Release Blocked`
