# VAL-QURAN-001: Tanzil Quran Text Validation

Status: Passed for Staging
Validation date: 2026-06-10

## Import Job

- Source ID: `tanzil-quran-uthmani-v1.1`
- Raw file: `data/raw/quran/tanzil/quran-uthmani-with-ayah-numbers.txt`
- SHA-256: `18C719BB3BA26D32EF457F40DAD77CD28C4C5A34156833E26A8E5FCFDD246FB1`

## Counts

- File lines: 6266
- Quran data rows: 6236
- Unique verse keys: 6236
- Duplicate verse keys: 0
- Surahs represented: 114
- First verse key: `1:1`
- Last verse key: `114:6`

## Validation Results

| Check | Result | Notes |
| --- | --- | --- |
| Required fields | Pass | Every data row contains surah, ayah, and text. |
| Duplicate keys | Pass | No duplicate `(surah, ayah)` keys. |
| Reference validity | Pass | Range begins at `1:1` and ends at `114:6`; metadata sum is 6236. |
| Encoding | Pass | UTF-8 Arabic text read successfully. |
| License block | Pass | Copyright and license block is included in downloaded file. |
| Attribution metadata | Pass | Tanzil Project and tanzil.net are stated. |
| Bismillah representation | Warning | Prefix is included in first ayah of most surahs. Preserve verbatim; presentation decision pending. |

## Recommendation

Accept for staging and cross-source comparison.

Do not publish or transform the text until the Bismillah presentation strategy and attribution implementation are approved.

