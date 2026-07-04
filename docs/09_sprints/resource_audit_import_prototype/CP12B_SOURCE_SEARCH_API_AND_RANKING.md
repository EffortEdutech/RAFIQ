# CP12B Source Search API And Ranking

Date: 2026-07-03  
Sprint: RAFIQ Orchestrator-First Product Sprint  
Checkpoint: CP12B - Source Search API And Ranking  
Status: Pass for current backend scope

## Objective

Turn CP12A's Source Search contract into a real backend endpoint that returns grouped, ranked, route-ready source results for future mobile research UI.

Source Search is not Guidance Search. It is for users who want to research the evidence across Quran, tafsir, topics/themes, and Hadith, then open a source or turn it into guidance.

## Implemented

### Backend Endpoint

Added:

```text
GET /api/private-content/search/sources
```

Query:

- `q`;
- `domain`;
- `limit`;
- `offset`.

Response:

- `query.mode = sources`;
- grouped source results;
- enriched result deep links;
- `openGuidanceTarget` on each result where possible;
- source-search facets based on returned groups.

### Source Search Grouping

Results are grouped into:

- Quran;
- Translations;
- Tafsir;
- Hadith;
- Topics;
- Themes;
- Verification.

The current database index has source documents for Quran, tafsir, topics, themes, and Hadith. Translation and verification groups are contract-ready but depend on future source/index rows.

### Ranking And Enrichment

Each result is enriched with:

- primary open route;
- `Open guidance` target;
- source-detail route when a source target exists;
- Quran-to-Sunnah or Sunnah-to-Quran research link;
- source-to-guidance target for Quran ayahs, Hadith records, and themes/topics.

Ranking now considers:

- database score;
- requested-domain match;
- available route;
- available guidance target;
- domain usefulness for source study.

### Ayah Reference Search

Added direct ayah-reference handling for inputs such as:

```text
2:255
```

When an ayah reference is searched, RAFIQ can construct exact source results from the Quran surah payload:

- Quran ayah result;
- tafsir result when available;
- translation result when translation data is attached.

## Mobile Contract

Updated `searchPrivateSources()` so the mobile app calls:

```text
/api/private-content/search/sources
```

instead of grouping generic search results locally.

## Acceptance Evidence

| Case | Status | Evidence |
| --- | --- | --- |
| `mercy`, domain `all` | Pass | Returns `mode=sources`, 12 results, grouped as tafsir/topics, first result has 4 deep links and guidance target. |
| `intention`, domain `hadith` | Pass | Returns 12 Hadith results, first result has 4 deep links and guidance target. |
| Arabic Quran query `ٱللَّهِ`, domain `quran` | Pass | Returns 12 Quran results, first result has 4 deep links and guidance target. |
| Ayah reference `2:255`, domain `all` | Pass | Returns Quran and tafsir groups with deep links and guidance targets. |
| Ayah reference `2:255`, domain `tafsir` | Pass | Returns tafsir group with `Tafsir 2:255`. |
| `translation` domain | Blocked by data/index | Contract and endpoint support the domain, but current private Quran payload checked for `2:255` has no translation attached. |
| `verification` domain | Blocked by data/index | Contract and endpoint support the domain, but current private search index has no verification documents. |
| Build | Pass | `corepack pnpm build` passed. |
| Mobile export | Pass | `corepack pnpm -C apps/mobile exec expo export --platform web` passed. |
| Runtime | Pass | `scripts/check_phase5_runtime.ps1` passed. |

## Known Limits

- The database search index still does not contain separate translation documents.
- The database search index still does not contain separate verification/grade claim documents.
- English keyword search in `domain=quran` searches Quran text documents, not translations.
- Source Detail currently points to an internal trust/provenance page; CP12E should split user-facing study detail from internal source-trust review.
- Ranking is service-layer ranking on top of the current indexed search RPC. Deeper semantic ranking remains future work.

## Close-Out

- Completed: `/search/sources` endpoint, service-layer grouping/ranking/enrichment, ayah-reference handling, mobile source-search helper update, build/export/runtime/API checks.
- Next planned: CP12C - Source Search Mobile UI.
- Ad-hoc first: none blocking. Future data work should add translation and verification documents to `content.private_search_documents`.
- Checklist update: CP12B marked Pass for current backend scope; translation and verification indexing marked as blocked data follow-up; TECH-016 added.
- Documentation update: CP12B report created; sprint plan, checklist, dual-search plan, and decision register updated.
