# VAL-QURAN-002: Tanzil Quran Metadata Validation

Status: Passed for Staging
Validation date: 2026-06-10

## Import Job

- Source ID: `tanzil-quran-metadata-v1.0`
- Raw file: `data/raw/quran/tanzil/quran-data.xml`
- SHA-256: `8867C1D88191472ADEC9DB694B3CD9F135B1A2EF580574D32CF888DCB22C5C7A`

## Counts

- Surahs: 114
- Declared ayahs: 6236
- Juz starts: 30
- Hizb-quarter starts: 240
- Manzil starts: 7
- Ruku starts: 556
- Page starts: 604
- Sajda records: 15

## Validation Results

| Check | Result | Notes |
| --- | --- | --- |
| XML parse | Pass | Root element is `quran`. |
| Surah count | Pass | 114. |
| Ayah total | Pass | Surah ayah counts sum to 6236. |
| Partition records | Pass | Expected groups are present. |
| Encoding | Pass | Arabic names parse correctly. |
| Version metadata | Pass | Documentation identifies metadata v1.0. |
| License metadata | Warning | Metadata-specific license applicability needs explicit confirmation. |

## Recommendation

Accept for staging schema discovery.

Do not approve for production until metadata licensing/attribution is confirmed.

