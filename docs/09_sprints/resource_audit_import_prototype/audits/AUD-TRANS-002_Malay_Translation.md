# AUD-TRANS-002: Malay Translation

Status: Finalized
Audit date: 2026-06-11
Decision date: 2026-06-12

Controlling decision:

`../DAY_03_DECISION_REGISTER.md`

## Source Identity

- Tanzil name: Basmeih
- Tanzil translator: Abdullah Muhammad Basmeih
- Tanzil ID: `ms.basmeih`
- QUL label: Abdullah Basamia
- QUL resource: `292`
- Tanzil catalog: https://tanzil.net/trans/
- Tanzil change log: https://tanzil.net/trans/log/ms.basmeih
- QUL resource: https://qul.tarteel.ai/resources/translation/292
- QUL copyright page: https://qul.tarteel.ai/resources/292/copyright

## Attribution Finding

The two distributors use inconsistent names. Tanzil explicitly identifies `Abdullah Muhammad Basmeih`; QUL labels its resource `Abdullah Basamia`.

RAFIQ should use the Tanzil attribution as the audited canonical candidate and retain `Abdullah Basamia` only as a source alias until the original publication or rights holder confirms the exact attribution.

## Rights And Access

Tanzil's catalog permits translations for non-commercial purposes only unless separate translator or publisher permission is obtained.

QUL says it has no copyright information for resource `292`. Its authenticated simple JSON/SQLite files were acquired and validated on 2026-06-12.

Result: local audit and staging use only. Production display is blocked pending original-source rights and attribution verification.

## Data Structure And Validation

| Check | Result |
| --- | --- |
| Records | 6,236 |
| Unique ayah keys | 6,236 |
| Duplicate keys | 0 |
| Blank translations | 0 |
| First/last keys | `1:1` / `114:6` |
| HTML or formal footnote markers | None |
| Last Tanzil update | 2012-09-07 |

The key set exactly matches the audited English and Indonesian files. QUL resource `292` advertises simple JSON and SQLite only, unlike QUL's richer Saheeh footnote variants.

## RAFIQ Mapping

- identity: `(translation_source_id, surah_number, ayah_number)`
- preserve Malay spelling and punctuation verbatim
- store source aliases separately from canonical attribution
- preserve language as `ms`
- do not AI-translate Quran verses into Malay as a substitute for a licensed translation

## Decision

`Approved for Staging Only`

Production approval requires rights-holder verification and resolution of the Basmeih/Basamia attribution inconsistency.

## File Validation Amendment

See `VAL-QUL-002_Translations.md`.

The QUL JSON and SQLite files match exactly and contain all 6,236 keys. QUL and Tanzil Malay files differ in 2,092 records, confirming that source and edition identity must be preserved.
