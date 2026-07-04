# AUD-TRANS-001: English Translation

Status: Finalized
Audit date: 2026-06-11
Decision date: 2026-06-12

Controlling decision:

`../DAY_03_DECISION_REGISTER.md`

## Source Identity

- Candidate: Saheeh International
- Tanzil ID: `en.sahih`
- QUL resource: `193`
- Tanzil catalog: https://tanzil.net/trans/
- Tanzil change log: https://tanzil.net/trans/log/en.sahih
- QUL resource: https://qul.tarteel.ai/resources/translation/193
- QUL copyright page: https://qul.tarteel.ai/resources/193/copyright

## Rights And Access

Tanzil permits downloaded translations for non-commercial purposes only. Other use requires permission from the translator or publisher. This differs from the separate Tanzil Quran Text license.

QUL's copyright page says it has no copyright information for resource `193`. Authenticated JSON and SQLite files were acquired and validated on 2026-06-12.

Result: local audit and staging use only. Production, commercial display, and redistribution are blocked until original publisher permission and attribution requirements are documented.

## Data Structure

The downloaded Tanzil file uses:

```text
surah_number|ayah_number|translation
```

| Check | Result |
| --- | --- |
| Records | 6,236 |
| Unique ayah keys | 6,236 |
| Duplicate keys | 0 |
| Blank translations | 0 |
| First/last keys | `1:1` / `114:6` |
| HTML or formal footnote markers | None |
| Last Tanzil update | 2011-04-24 |

QUL publishes richer alternatives: simple text, separate footnote tags, inline footnotes, and text chunks. These structures must not be flattened into the canonical translation text.

## RAFIQ Mapping

- identity: `(translation_source_id, surah_number, ayah_number)`
- preserve source text verbatim
- keep footnotes and styled chunks in child records
- map to the Day 2 canonical ayah key
- never use AI to replace or silently rewrite Quran translation text

## Decision

`Approved for Staging Only`

Production approval requires original-source permission, confirmed attribution wording, and an explicit editorial choice between the distinct QUL and Tanzil editions.

## File Validation Amendment

See `VAL-QUL-002_Translations.md`.

All four QUL Saheeh structures contain 6,236 valid keys. They contain 1,904 valid footnotes across 1,613 ayahs. QUL and Tanzil Saheeh are different editions, with 3,068 non-identical records.
