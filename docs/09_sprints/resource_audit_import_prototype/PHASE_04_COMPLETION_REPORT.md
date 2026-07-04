# Phase 4 Canonical Promotion Completion Report

Date: 2026-06-17  
Status: Complete  
Scope: Private canonical promotion only. Public release remains blocked until
rights, attribution, editorial, scholar/content, and Product Owner approvals
are completed.

## Completed Work

- Promoted canonical Quran identities: 114 surahs and 6,236 ayahs.
- Promoted editioned Quran text: 3 editions and 18,708 ayah text rows.
- Promoted Quran partitions: 2 schemes and 2,590 partition rows.
- Promoted translations: 8 editions and 49,888 translation text rows.
- Promoted tafsir: 3 editions, 18,708 passages, and 18,708 passage-ayah links.
- Promoted source topics and themes: 2,512 topics, 30,687 topic-ayah links,
  1,758 topic relations, 2,098 ayah-theme groups, and 12,400 theme-ayah links.
- Promoted source-qualified Hadith: 70 collections, 70 editions, 324,866
  records, and 684,348 text versions.
- Promoted Hadith grades and verification claims: 67,711 grade assertions,
  67,711 grade normalizations, and 88 verification claims.
- Created complete private release states for promoted content.
- Preserved source-qualified Hadith identity; no automatic cross-source merge
  was performed by number, text hash, or collection name alone.

## Verification Evidence

Executable verifier:

- `scripts/verify_phase4_final.sql`

Verifier result:

- 26/26 canonical count checks passed.
- 4/4 Phase 4 import runs completed.
- 0 Phase 4 warnings.
- 0 Phase 4 rejected records.
- 0 Phase 4 assertion failures.
- Supabase `db lint --local`: no schema errors found.
- Supabase `db advisors --local`: no issues found.

## Canonical Totals

| Area | Count |
| --- | ---: |
| Quran surahs | 114 |
| Quran ayahs | 6,236 |
| Quran ayah texts | 18,708 |
| Quran partitions | 2,590 |
| Translation editions | 8 |
| Translation texts | 49,888 |
| Tafsir editions | 3 |
| Tafsir passages | 18,708 |
| Tafsir passage-ayah links | 18,708 |
| Source topics | 2,512 |
| Source topic-ayah links | 30,687 |
| Source topic relations | 1,758 |
| Source ayah-theme groups | 2,098 |
| Source ayah-theme group-ayah links | 12,400 |
| Hadith collections | 70 |
| Hadith editions | 70 |
| Hadith records | 324,866 |
| Hadith text versions | 684,348 |
| Hadith grade assertions | 67,711 |
| Hadith grade normalizations | 67,711 |
| Hadith verification claims | 88 |
| Entity provenance rows | 1,177,867 |
| Entity release-state rows | 1,245,735 |

## Validation Finding Added

`phase4_source_topic_relation_duplicate_canonical_key` was recorded as an
informational resolved finding. The source has 1,759 staged topic relations,
but 1 duplicate canonical relation key collapses to 1,758 promoted relations.
No target topic is missing.

## Gate Decision

Phase 4 is approved as complete for private RAFIQ development. The project may
proceed to Phase 5: private retrieval, internal APIs, and first visible RAFIQ
content pages.
