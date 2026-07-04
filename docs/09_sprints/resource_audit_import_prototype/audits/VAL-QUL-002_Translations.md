# VAL-QUL-002: QUL English And Malay Translations

Status: Technical Validation Complete
Validation date: 2026-06-12

## File Integrity

| Variant | Records | Canonical Keys | Blank Text | JSON/SQLite Match |
| --- | ---: | --- | ---: | --- |
| Malay simple | 6,236 | Complete | 0 | Exact |
| Saheeh simple | 6,236 | Complete | 0 | Exact |
| Saheeh inline footnotes | 6,236 | Complete | 0 | Exact |
| Saheeh footnote tags | 6,236 | Complete | 0 | Exact |
| Saheeh text chunks | 6,236 | Complete | 0 | Exact |

## Footnotes

- footnote references: 1,904
- ayahs with footnotes: 1,613
- missing referenced definitions: 0
- orphan definitions: 0
- inline opening/closing markers: 1,904 / 1,904
- stripping footnotes from all three rich variants reproduces simple text for all 6,236 ayahs

One source-format difference exists at `4:12`: the tagged footnote preserves paragraph HTML and spacing, while the chunk variant flattens it and joins `fromthe`. Preserve both raw variants and do not treat chunks as lossless rich-text storage.

## Tanzil Comparison

QUL and Tanzil are different editions:

| Translation | Exact Matches | Different Records | Estimated Substantive Differences After Aggressive Typography Normalization |
| --- | ---: | ---: | ---: |
| Saheeh English | 3,168 | 3,068 | 1,166 |
| Malay Basmeih/Basamia | 4,144 | 2,092 | 52 |

These estimates are comparison aids, not editorial judgments. No source may overwrite another.

## Decision

`Raw Acquisition And Technical Validation Complete`

Production use remains blocked pending original-source rights and attribution confirmation.
