# VAL-QUL-001: QUL Quran Scripts And Metadata

Status: Technical Validation Complete
Validation date: 2026-06-12

## Quran Scripts

| Resource | JSON Rows | SQLite Rows | Pair Match | Canonical Keys | Blank Text |
| --- | ---: | ---: | --- | --- | ---: |
| Uthmani `88` | 6,236 | 6,236 | Exact | Complete | 0 |
| QPC Hafs `86` | 6,236 | 6,236 | Exact | Complete | 0 |

QPC Hafs includes ayah-end numerals. QUL Uthmani and QPC Hafs are different source representations and are not text-identical.

Tanzil and QUL Uthmani are also not text-identical. Tanzil embeds Bismillah in the first ayah of 112 surahs where QUL stores `bismillah_pre=true`, excluding Al-Fatihah and At-Tawbah. Script orthography also differs beyond Bismillah.

## Metadata

| Resource | Records | Full Ayah Coverage | JSON/SQLite Match |
| --- | ---: | --- | --- |
| Rub `63` | 240 | Yes | Exact |
| Sajda `64` | 15 | N/A | Exact |
| Ruku `65` | 558 | Yes | Exact |
| Manzil `66` | 7 | Yes | Exact |
| Hizb `67` | 60 | Yes | Exact |
| Juz `68` | 30 | Yes | Exact |
| Ayah `69` | 6,236 | Yes | Exact |
| Surah Names `70` | 114 | Yes | Exact |

Every partition range has a valid count, no invalid keys, no overlap within its partition type, and complete 6,236-ayah coverage.

The Ayah metadata text equals QPC Hafs text for all 6,236 records.

## Cross-Source Findings

- Juz starts: QUL and Tanzil agree completely.
- Manzil starts: QUL and Tanzil agree completely.
- Sajda ayahs: QUL and Tanzil agree completely; labels differ as `optional/required` versus `recommended/obligatory`.
- Rub/hizb-quarter starts: 239 of 240 agree; QUL uses `15:49`, Tanzil uses `15:50`.
- Ruku: QUL has 558 and Tanzil has 556.
- QUL-only ruku starts: `26:52`, `26:69`, `28:83`, `31:31`.
- Tanzil-only ruku starts: `26:53`, `26:70`.

## Decision

`Raw Acquisition And Technical Validation Complete`

Production use remains blocked pending provenance, licensing, attribution, script selection, and scholar/content review.
