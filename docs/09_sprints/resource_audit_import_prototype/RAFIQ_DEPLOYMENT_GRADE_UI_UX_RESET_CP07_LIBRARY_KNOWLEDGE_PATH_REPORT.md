# RAFIQ Deployment-Grade UI/UX Reset CP07 Library Knowledge Path Report

Date: 2026-06-27  
Sprint: RAFIQ Deployment-Grade UI/UX Reset  
Checkpoint: CP07 - Library Knowledge Path Rebuild  
Status: Complete

## Purpose

CP07 rebuilds `/search` from a flat result list into a Library Knowledge Path Explorer.

The intended flow is:

```text
Search or choose theme
->
RAFIQ frames the topic
->
Quran evidence group
->
Tafsir context group
->
Sunnah support group
->
Themes/topics group
->
Next actions: read, ask, reflect, save
```

## Implemented

File:

`apps/mobile/app/search.tsx`

The rebuilt Library route now includes:

- Knowledge Path Explorer hero;
- search/question input;
- curated theme starters;
- path map showing search -> Quran -> context -> next step;
- domain filters;
- RAFIQ topic-framing panel;
- trust strip with private result count, evidence count, filter, and trace status;
- path highlights for Quran evidence, tafsir context, and Sunnah support;
- grouped result sections;
- source trust links as secondary actions;
- next-action panel pointing to Companion, Quran, and Profile.

## Key UX Changes

| Area | Change |
| --- | --- |
| Entry | Search starts from meaning/theme instead of result mechanics. |
| Topic framing | RAFIQ explains what it is tracing before showing grouped evidence. |
| Result grouping | Quran, tafsir, Sunnah, topics, and ayah themes are separated into path groups. |
| Highlights | Top Quran/tafsir/Sunnah anchors appear before detailed result lists. |
| Next action | User is guided to ask, read, or save instead of endlessly browsing. |
| Source trust | Source trust remains available from each result, but does not dominate the page. |

## Acceptance Check

| CP07 Acceptance Item | Status | Evidence |
| --- | --- | --- |
| Search is not a flat list. | Implemented | Hero, curated themes, path map, framing panel, highlights, grouped evidence, and next actions surround the result list. |
| Results show relationships. | Implemented | Results are grouped by Quran, tafsir, Sunnah, topics, and ayah themes. |
| User always has a next step after search. | Implemented | Next-action panel links to Companion, Quran, and Profile. |
| Quran evidence group exists. | Implemented | `Quran Evidence` group and highlight. |
| Tafsir context group exists. | Implemented | `Tafsir Context` group and highlight. |
| Hadith/Sunnah support group exists. | Implemented | `Sunnah Support` group and highlight. |
| Themes/topics group exists. | Implemented | `Topics` and `Ayah Themes` groups. |

## Verification

| Check | Result |
| --- | --- |
| Root build | Passed: `corepack pnpm build` |
| Expo web export | Passed: `corepack pnpm -C apps/mobile exec expo export --platform web` |

## Browser QA

| Check | Result |
| --- | --- |
| Runtime check after dev-server restart | Passed: `scripts/check_phase5_runtime.ps1` |
| Desktop browser smoke on `/search` | Passed: Knowledge Path Explorer, curated theme starters, path map, topic framing panel, trust strip, path highlights, Quran group, tafsir group, Sunnah group, source-trust links, and next-action panel are visible. |
| Curated theme click smoke | Passed: clicking `Guidance` updates the input and topic framing to guidance. |
| Primary nav boundary | Passed: Profile is in top nav and Hadith is not top-level nav. |
| Mobile browser smoke on `/search` | Passed at 390px width: Knowledge Path Explorer, theme starters, framing panel, and next-action panel render with no document-level horizontal overflow. |
| Console errors | Passed: no browser console errors found during smoke checks. |

## Decision

CP07 is complete.

Proceed to CP08 - Hadith As Sunnah Support.
