# VAL-DAY4-002: QUL Dataset File Validation

Status: Technical Validation Complete
Validation date: 2026-06-12

## Acquisition

Eight authenticated QUL files were preserved unchanged under:

`data/raw/tafsir/`

All files have SHA-256 entries and source manifests.

## Tafsir Results

| Resource | Rows | Main Passages | Pointer Rows | Missing Canonical Keys | Blank Main Passages | JSON/SQLite Match |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Arabic As-Saadi `308` | 6,236 | 6,236 | 0 | 0 | 59 | Exact |
| English Al-Mukhtasar `266` | 6,236 | 6,216 | 20 | 0 | 0 | Exact |
| English Ibn Kathir `35` | 6,236 | 1,902 | 4,334 | 0 | 0 | Exact |

All group pointers resolve. All group ayah lists contain valid canonical ayah keys. Maximum observed group size is four ayahs for Al-Mukhtasar and twenty ayahs for Ibn Kathir.

Arabic content is valid Unicode. The apparent mojibake seen in an earlier PowerShell preview was a console decoding artifact.

## Topic Results

| Check | Result |
| --- | ---: |
| Topic rows / unique IDs | 2,512 / 2,512 |
| Ayah links | 30,687 |
| Ayahs covered | 5,804 |
| Invalid ayah links | 0 |
| Missing parent references | 0 |
| Hierarchy cycles | 0 |
| Missing related-topic references | 0 |
| Duplicate normalized name groups | 87 |
| Missing descriptions | 2,225 |
| Missing Arabic names | 1,520 |

The actual schema differs from the public help page. It stores:

- `name`, not `topic_name`
- `parent_id`, `thematic_parent_id`, and `ontology_parent_id`
- comma-separated `ayahs`
- comma-separated `related_topics`
- `wiki_link`, `thematic`, and `ontology`

## Ayah Theme Results

| Check | Result |
| --- | ---: |
| Physical rows | 2,098 |
| Unique exact records | 1,049 |
| Duplicate extra rows | 1,049 |
| Valid ranges | 1,049 |
| Range/total mismatches | 0 |
| Overlapping unique ranges | 0 |
| Ayahs covered | 6,200 |
| Ayahs uncovered | 36 |
| Confidence field | Absent |

Every unique theme record appears exactly twice. At least five records contain the likely malformed keyword `Wai`.

## Decision

`Raw Acquisition And Technical Validation Complete`

Complete private-platform import and testing are approved. Public release
remains blocked pending rights resolution, attribution, and documented quality
transformations.
