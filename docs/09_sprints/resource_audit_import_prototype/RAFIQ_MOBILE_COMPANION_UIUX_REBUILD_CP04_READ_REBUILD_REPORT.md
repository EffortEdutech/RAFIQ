# RAFIQ Mobile Companion UI/UX Rebuild CP04 Read Rebuild Report

Date: 2026-06-28  
Status: Complete  
Plan: `RAFIQ_MOBILE_COMPANION_UIUX_REBUILD_PLAN_V2.md`

## Objective

Rebuild Read as a mobile Quran Reading Room where Arabic remains primary and meaning, tafsir, Sunnah, reflection, action, themes, and sources are supporting layers.

## Implemented

- Replaced the old wide Quran reading-room layout.
- Added a mobile-first reader:
  - surah hero with Arabic name;
  - reading intention selector;
  - layer controls for Translation, Tafsir, Sunnah, Themes, and Sources;
  - Start Here passage;
  - Arabic-first ayah cards;
  - translation layer;
  - tafsir layer;
  - Sunnah support layer;
  - reflection input per ayah;
  - one action per ayah;
  - Ask and Learn continuation actions;
  - quiet optional source links.
- Removed old reading control/status-strip pattern.

## Acceptance

- Quran is visually primary.
- Arabic text has spacious reading treatment.
- Translation and tafsir support reading without taking over.
- Sunnah support is present as practice guidance.
- Reflection and one action are available per ayah.
- Sources are optional and quiet.
- No developer/process language appears in the product screen.

## Verification

- `corepack pnpm build` passed.
- `corepack pnpm -C apps/mobile exec expo export --platform web` passed.
- `scripts/check_phase5_runtime.ps1` passed after restart readiness.
- Browser QA at `390x844` confirmed:
  - rebuilt Read screen is live;
  - old reading-room dashboard sections are absent;
  - Quran, translation, tafsir, Sunnah, reflection, action, Ask, and Learn are present;
  - no browser console errors were reported.

## Files

- `apps/mobile/app/quran/[surahNumber].tsx`
