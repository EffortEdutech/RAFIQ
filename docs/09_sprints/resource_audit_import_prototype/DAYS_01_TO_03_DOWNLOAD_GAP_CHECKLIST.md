# Days 1-3 Download Gap Checklist

Status: Complete
Audit date: 2026-06-12
Completion date: 2026-06-12

## Summary

- Day 1 required no content downloads.
- Tanzil Quran text, metadata, and English/Malay/Indonesian translations are complete.
- All shortlisted QUL Quran scripts, metadata, and English/Malay translation files were acquired.
- Complete acquisition: 30 files.
- All files were inventoried, checksummed, and validated.

Preserve every downloaded file unchanged. Do not rename files until the original QUL filename has been recorded.

## Day 2: Quran Scripts

### Resource 88: Uthmani Ayah By Ayah

Page: https://qul.tarteel.ai/resources/quran-script/88

- [x] JSON
- [x] SQLite

### Resource 86: QPC Hafs Ayah By Ayah

Page: https://qul.tarteel.ai/resources/quran-script/86

- [x] JSON
- [x] SQLite

## Day 2: Quran Metadata

Download both JSON and SQLite for every resource.

| ID | Resource | Page | JSON | SQLite |
| --- | --- | --- | --- | --- |
| 63 | Rub | https://qul.tarteel.ai/resources/quran-metadata/63 | [x] | [x] |
| 64 | Sajda | https://qul.tarteel.ai/resources/quran-metadata/64 | [x] | [x] |
| 65 | Ruku | https://qul.tarteel.ai/resources/quran-metadata/65 | [x] | [x] |
| 66 | Manzil | https://qul.tarteel.ai/resources/quran-metadata/66 | [x] | [x] |
| 67 | Hizb | https://qul.tarteel.ai/resources/quran-metadata/67 | [x] | [x] |
| 68 | Juz | https://qul.tarteel.ai/resources/quran-metadata/68 | [x] | [x] |
| 69 | Ayah | https://qul.tarteel.ai/resources/quran-metadata/69 | [x] | [x] |
| 70 | Surah Names | https://qul.tarteel.ai/resources/quran-metadata/70 | [x] | [x] |

## Day 3: English Translation

### Resource 193: Saheeh International

Page: https://qul.tarteel.ai/resources/translation/193

- [x] `simple.json`
- [x] `simple.sqlite`
- [x] `translation-with-footnote-tags.json`
- [x] `translation-with-footnote-tags.sqlite`
- [x] `translation-with-inline-footnote.json`
- [x] `translation-with-inline-footnote.sqlite`
- [x] `translation-text-chunk.json`
- [x] `translation-text-chunk.sqlite`

All variants are recommended because Day 3 approved separate translation, footnote, and chunk structures.

## Day 3: Malay Translation

### Resource 292: Abdullah Basamia

Page: https://qul.tarteel.ai/resources/translation/292

- [x] `simple.json`
- [x] `simple.sqlite`

Retain the QUL label as source metadata. RAFIQ continues to treat `Abdullah Muhammad Basmeih` as the audited attribution candidate and `Abdullah Basamia` as an unresolved alias.

## Already Complete

- [x] Tanzil Quran Uthmani text
- [x] Tanzil Quran metadata XML
- [x] Tanzil text license evidence
- [x] Tanzil Saheeh International translation
- [x] Tanzil Basmeih Malay translation
- [x] Tanzil Indonesian Ministry translation

## Optional, Not Required To Close Days 1-3

- QUL Indonesian translation candidate
- alternative QUL Quran scripts beyond resources `88` and `86`
- metadata outside resources `63` through `70`
- translation sources other than resources `193` and `292`

## Landing Recommendation

Place the files under:

```text
data/raw/quran/qul/
data/raw/translations/qul/
```

Completed after acquisition:

1. [x] inventory original filenames and sizes
2. [x] calculate SHA-256 checksums
3. [x] compare JSON against SQLite
4. [x] validate Quran counts and canonical ayah keys
5. [x] compare QUL scripts against Tanzil without altering either source
6. [x] validate Bismillah representation
7. [x] validate translation footnotes and chunks
8. [x] update Days 2 and 3 manifests, audits, and decision conditions

File acquisition does not resolve licensing or production permission.
