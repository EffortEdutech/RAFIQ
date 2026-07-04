# CP12E Ayah And Narration Study Rooms

Date: 2026-07-03  
Sprint: RAFIQ Orchestrator-First Product Sprint  
Checkpoint: CP12E - Ayah And Narration Study Rooms  
Status: Pass for current mobile scope

## Objective

Make deep links land on user-facing study rooms, not shallow route jumps or internal trust pages.

CP12A-D created dual search, grouped source search, source-search UI, and guidance deep links. CP12E provides the study destinations.

## Implemented

### Ayah Study Room

Added:

```text
/quran/[surahNumber]/[ayahNumber]
```

The ayah study room shows:

- Quran Arabic text;
- verse reference;
- translation when available;
- tafsir when available;
- themes/topics when available;
- links to tafsir source search;
- links to Sunnah support source search;
- source detail links;
- `Open guidance from this ayah`;
- rendered guidance deep links after guidance opens.

### Quran Reader Integration

Updated `/quran/[surahNumber]`:

- each ayah now links to `Study ayah`;
- Sunnah layer links to `/sources?q={verseKey}&domain=hadith`.

### API Route Targets

Updated backend guidance/source-search route targets:

- Quran deep links now point to `/quran/:surahNumber/:ayahNumber`;
- Quran learning-path steps point to the ayah study room;
- tafsir learning-path steps point to the ayah study room;
- exact ayah source-search results such as `2:255` point to `/quran/2/255`;
- indexed Quran, translation, tafsir, and theme results with ayah references are normalized to ayah study-room routes.

### Narration Study Room Upgrade

Upgraded `/hadith/[hadithRecordId]`:

- keeps reliability first;
- shows original/meaning text;
- keeps practice map;
- adds Quran connection research;
- renders `GuidanceDeepLinks` for related Sunnah support;
- adds related narrations, Quran link, and source actions.

## Acceptance Evidence

| Gate | Status | Evidence |
| --- | --- | --- |
| Quran lens opens an ayah study room. | Pass | Guidance API for `mercy/all` now returns `/quran/7/155` for Quran deep link and learning-path Quran step. |
| Tafsir opens ayah study with context. | Pass | Guidance API tafsir learning-path route now returns `/quran/7/155`. |
| Ayah reference source search opens ayah study. | Pass | Source search for `2:255` returns first result route `/quran/2/255`. |
| Indexed source results open ayah study. | Pass | Source search for `2:255` returns indexed Quran and tafsir routes such as `/quran/2/255` and `/quran/20/109`, not surah-only routes. |
| Ayah study route exists and exports. | Pass | Mobile export includes new nested route and bundle `index-e4b49037ad91d4d91b8d01e165926e0f.js`. |
| Narration detail acts as a study room. | Pass | `/hadith/[hadithRecordId]` now includes reliability, narration, practice map, related guidance deep links, related narrations, Quran link, and source action. |
| Build passes. | Pass | `corepack pnpm build` passed. |
| Mobile export passes. | Pass | `corepack pnpm -C apps/mobile exec expo export --platform web` passed. |
| Runtime passes. | Pass | `scripts/check_phase5_runtime.ps1` passed after API restart. |

## Known Limits

- Translation can only appear where the private Quran payload has a translation attached.
- Source detail still uses the internal source-trust/provenance route; a future refinement should create a calmer user-facing source attribution panel.
- Automated Playwright visual QA remains unavailable because the local Playwright browser binary is missing.
- Narration related-rank quality still depends on current source-search ranking and available indexed Hadith text.

## Close-Out

- Completed: ayah study route, Quran reader study links, backend ayah route targets including indexed source-result normalization, narration study-room deep links/research actions, build/export/runtime/API checks.
- Next planned: CP13 - Product Owner Study UX Review And Mobile QA, or data-first checkpoint for translation and verification indexing if Product Owner wants to improve resource coverage before visual QA.
- Ad-hoc first: none blocking. Data follow-up remains translation and verification index documents.
- Checklist update: CP12E marked Pass for current mobile scope; TECH-019 added.
- Documentation update: CP12E report created; sprint plan, checklist, dual-search plan, and decision register updated.
