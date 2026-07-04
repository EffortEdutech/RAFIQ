# RAFIQ Deployment-Grade Product Polish CP06 Quran And Hadith Reading Experience Report

Date completed: 2026-06-25  
Sprint: RAFIQ Deployment-Grade Product Polish  
Checkpoint: CP06 - Quran And Hadith Reading Experience Polish  
Status: Complete

## Objective

Upgrade the public Quran and Hadith preview routes from simple gated placeholders into deployment-grade reading surfaces.

## Changes Implemented

| Area | Upgrade |
| --- | --- |
| Quran page positioning | Reframed `/public/quran` as a calm Quran reading room ready for approved sources. |
| Quran reader controls | Added preview controls for surah, ayah, juz, page, translation, and tafsir. |
| Quran safe preview | Added a no-public-text reader card that demonstrates reading rhythm without exposing pending Quran text. |
| Quran context layers | Documented future Arabic text, translation, and tafsir layers with approval boundaries. |
| Quran reading flow | Added user journey from passage selection to context to guided answer. |
| Hadith page positioning | Reframed `/public/hadith` as source-aware Hadith browsing with visible trust status. |
| Hadith filters | Added preview controls for collection, book, chapter, grade, language, and source status. |
| Hadith list-to-detail | Added result-list and detail-preview surfaces without exposing pending Hadith text. |
| Hadith detail layers | Documented future text, grade context, and related evidence layers. |
| Shared trust posture | Added source approval gates, public text hidden states, and next paths to search, answer, Quran/Hadith, and sources. |

## Verification

Passed:

- `corepack pnpm build`;
- `corepack pnpm -C apps/mobile exec expo export --platform web`;
- `scripts/check_phase5_runtime.ps1`;
- browser desktop verification for `/public/quran`;
- browser desktop verification for `/public/hadith`;
- browser mobile `390x844` verification for `/public/quran`;
- browser mobile `390x844` verification for `/public/hadith`.

Browser verification confirmed:

- Quran title visible: `A calm Quran reading room, ready for approved sources.`;
- Hadith title visible: `Hadith browsing that keeps source trust visible.`;
- safe hidden-text states visible for both Quran and Hadith;
- public release gate visible on both pages;
- next journey links visible on both pages;
- old placeholder titles no longer visible;
- no horizontal overflow on desktop;
- no horizontal overflow on mobile `390x844`;
- no visible private route, review queue, retrieval trace, or raw JSON leaks.

## React Review

The TSX edits were checked against the React best-practices checklist:

- mapped lists use stable text keys;
- no hooks were added;
- links remain semantic `Link` elements;
- touch targets use at least 44px minimum height where interactive;
- no real Quran or Hadith source text is embedded in the public pages.

## Decision

CP06 is approved as complete.

The Quran and Hadith public reading previews now feel like deliberate product surfaces while public content remains release-gated.

## Next Step

Proceed to CP07: Source Trust And Attribution Experience Polish.
