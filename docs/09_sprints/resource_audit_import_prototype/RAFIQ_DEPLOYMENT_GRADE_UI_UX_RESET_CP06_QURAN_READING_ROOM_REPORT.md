# RAFIQ Deployment-Grade UI/UX Reset CP06 Quran Reading Room Report

Date: 2026-06-27  
Sprint: RAFIQ Deployment-Grade UI/UX Reset  
Checkpoint: CP06 - Quran Reading Room Rebuild  
Status: Complete

## Purpose

CP06 rebuilds the Quran surface so it feels like a reading room:

```text
Surah intention
->
Arabic-first ayah display
->
Translation
->
Tafsir
->
Reflection
->
Related themes / Sunnah support
->
One action
->
Source trust as secondary detail
```

The page should honor Quran text first and avoid making source/review metadata the main reading experience.

## Implemented

File:

`apps/mobile/app/quran/[surahNumber].tsx`

The rebuilt Quran route now includes:

- reading intention selector;
- Surah hero with Arabic title and private/full-content context;
- reading controls for translation, tafsir, themes, and source trust;
- edition/source trust strip;
- focused opening ayah panel;
- Arabic-first ayah cards;
- translation layer;
- tafsir meaning layer;
- related Sunnah support card;
- themes/topics support panel;
- per-ayah reflection composer;
- per-ayah one-action card;
- Companion and Library continuation links;
- optional source-trust panel per ayah.

## Key UX Changes

| Area | Change |
| --- | --- |
| Arabic hierarchy | Arabic text is visually dominant in the hero, focus panel, and each ayah card. |
| Reading controls | Controls now feel like reading layers instead of debug filters. |
| Translation/tafsir | Meaning layers support reading without overtaking Quran text. |
| Reflection/action | Each ayah can lead to private reflection and one action. |
| Sunnah support | Hadith is framed as related Sunnah support, not a separate collection-browser detour. |
| Source trust | Source details are hidden behind an explicit source-trust control and appear as compact links. |

## Acceptance Check

| CP06 Acceptance Item | Status | Evidence |
| --- | --- | --- |
| Surah header with meaning and reading intention. | Implemented | Surah hero and reading intention selector. |
| Arabic-first ayah display. | Implemented | Arabic-first focus panel and ayah cards. |
| Translation and transliteration controls. | Partial | Translation control implemented; transliteration not available in current payload. |
| Tafsir layer. | Implemented | `Tafsir Meaning` cards. |
| Reflection prompt per ayah or section. | Implemented | `Ayah Reflection` composer per ayah. |
| Related themes. | Implemented | Themes/topics panel. |
| Related Hadith support. | Implemented | `Related Sunnah Support` card with Hadith route link. |
| Source trust in secondary placement. | Implemented | Source trust toggle and compact trust links. |

## Verification

| Check | Result |
| --- | --- |
| Root build | Passed: `corepack pnpm build` |
| Expo web export | Passed: `corepack pnpm -C apps/mobile exec expo export --platform web` |

## Browser QA

| Check | Result |
| --- | --- |
| Runtime check after dev-server restart | Passed: `scripts/check_phase5_runtime.ps1` |
| Desktop browser smoke on `/quran/1` | Passed: Quran Reading Room, reading intention, controls, start-here panel, Arabic ayah text, tafsir meaning, related Sunnah support, ayah reflection, one action, and Companion continuation link are visible. |
| Surah header | Passed: Surah 1 / Al-Fatihah visible; no undefined header values. |
| Source-trust toggle smoke | Passed: Source trust control reveals Quran text, translation, and tafsir trust links. |
| Primary nav boundary | Passed: Profile is in top nav and Hadith is not top-level nav. |
| Mobile browser smoke on `/quran/1` | Passed at 390px width: reading room, Arabic ayah text, ayah reflection, and one action render with no document-level horizontal overflow. |
| Console errors | Passed: no browser console errors found during smoke checks. |

## Decision

CP06 is complete.

Proceed to CP07 - Library Knowledge Path Rebuild.
