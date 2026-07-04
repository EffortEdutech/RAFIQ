# RAFIQ Mobile Companion UI/UX Rebuild - Link Text Rendering Fix Report

Date: 2026-06-28

## Issue

The mobile web UI displayed repeated or collapsed link text in several rebuilt screens, for example:

- `MercyMercy`
- `TopicMercyMercy`
- `TafsirTafsir 21:105`
- collapsed header/nav text such as `RAFIQQURAN...`

This made RAFIQ feel like a broken developer surface instead of a user-facing companion experience.

## Cause

Several card-style links were composed with nested React Native `Pressable` children inside Expo Router links. On web, this produced fragile anchor rendering and collapsed accessible text. Some search results also returned identical title and snippet values, so the UI printed both without distinction.

## Fix

- Rebuilt the bottom companion nav as direct styled Expo links.
- Removed the clickable RAFIQ brand wrapper in the device header.
- Rebuilt related-theme, study, result, and hadith record cards as direct styled links.
- Added a snippet guard so duplicate title/snippet values are not printed twice.
- Removed corrupted mojibake/legacy symbol text from the affected private mobile surfaces.

## Files Changed

- `apps/mobile/src/components/BottomDeviceNav.tsx`
- `apps/mobile/src/components/CompanionDeviceShell.tsx`
- `apps/mobile/app/search.tsx`
- `apps/mobile/app/answer.tsx`
- `apps/mobile/app/hadith.tsx`

## Verification

- `corepack pnpm build` passed.
- `corepack pnpm -C apps/mobile exec expo export --platform web` passed.
- `scripts/check_phase5_runtime.ps1` passed.
- Browser QA at `390x844` passed on:
  - `/`
  - `/search`
  - `/hadith`
  - `/answer`
  - `/quran/1`
- Browser scan found none of:
  - `MercyMercy`
  - `TopicMercy`
  - `TafsirTafsir`
  - `RAFIQQURAN`
  - corrupted `Â` / `â` characters
- Browser console error count: `0`

## Follow-Up Correction

The first fix removed broken anchor rendering, but the bottom navigation still used placeholder letter icons that read as `TToday`, `AAsk`, `RRead`, `LLearn`, and `GGrowth` when flattened by the browser. This looked unprofessional for RAFIQ.

Follow-up changes:

- Removed the letter-icon navigation model.
- Rebuilt the bottom nav as direct pressable navigation with only destination names.
- Converted search, answer, and hadith card links to pressable router navigation where the card is an app control, not a flattened web anchor.
- Normalized duplicated result titles such as `TafsirTafsir 21:105`.
- Removed `Topic:` title prefixing from related-theme cards and moved the domain into a small metadata line.
- Reduced the `/search` knowledge-path title from `27px` to `18px` to avoid sudden font jumps inside the page.

Follow-up browser QA at `390x844` on `/search` confirmed:

- No `TToday`, `AAsk`, `RRead`, `LLearn`, or `GGrowth`.
- No `TopicMercy`, `TafsirTafsir`, or `MercyMercy`.
- `More To Study` now reads as metadata/title/body, for example `TOPIC / Mercy` and `TAFSIR / Tafsir 21:105`.
- Selected path title `Mercy` renders at `18px`.
- Browser console error count: `0`.

## Typography And Tap Target Correction

A second review found that several private companion pages still used marketing-scale typography inside the mobile shell. Profile was the clearest example, with a small label followed by oversized slogan text, then normal body text, repeated across the page. Some inline actions such as `Study Sunnah` also looked like plain text instead of tappable controls.

Correction:

- Reduced the private mobile shell screen title to `21px` and subtitle to `15px`.
- Rewrote Profile page copy into direct user labels:
  - `Profile / My Growth`
  - `Growth Memory / Your return path`
  - `Saved for later`
  - `A note for next time`
  - `Remember completed actions`
- Reduced Profile marketing-scale font sizes from `42px` and `54px` down to the mobile companion scale.
- Reduced shared guidance component headings from `58px`, `34px`, and `32px` to calm mobile sizes.
- Reduced Hadith, Answer, and Quran non-Arabic heading sizes.
- Kept Quran Arabic text intentionally larger for reading, while reducing surrounding non-Arabic UI text.
- Converted `Study Sunnah` inline links into visible dark pill buttons with `48px` minimum touch height.

Browser QA at `390x844` on `/profile`, `/answer`, `/quran/1`, `/hadith`, and `/search` confirmed:

- No stale slogan text such as `RAFIQ remembers the path`.
- No non-Arabic content above `24px` except RAFIQ branding and the Profile memory count.
- `Study Sunnah` appears as a dark button with white text and `48px` minimum height.
- No corrupted text markers.
- Browser console error count: `0`.
