# RAFIQ CP07.6A Dakwah Experience Correction

Date: 2026-06-25  
Status: Implemented after Product Owner rejection of generic CP07.6 delivery

## Product Owner Feedback

The delivered CP07.6 UI still felt like a normal Islamic app and was far behind the RAFIQ documentation promise. It did not clearly deliver dakwah, learning, guidance, reflection, and action. The default route header also exposed route naming such as `index`, which made the product feel unfinished.

## Root Cause

Implementation drifted toward:

- content navigation;
- search/read/ask structure;
- approval/status explanations;
- generic Islamic app layout.

The original RAFIQ objective is different:

> Personal Daily Dakwah Companion: user condition -> Quran guidance -> tafsir -> Hadith -> reflection -> ibadah/action -> growth.

## Corrections Implemented

- Removed the default Expo/Stack header so route titles such as `index` no longer appear.
- Rebuilt the Home screen around `What does your heart need today?`
- Added mood/situation check-in chips: anxious, sad, grateful, lost.
- Added a dynamic guidance package with theme, Quran-first evidence, simple tafsir, related Hadith, and one meaningful action.
- Repositioned navigation as Today, Companion, Quran, Hadith, Library.
- Reworded Companion as the flagship condition-to-guidance experience.
- Reworded Quran as Daily Quran Layer for guidance and action, not a mushaf clone.
- Reworded Hadith as Sunnah Support for guidance and practice, not a collection browser.
- Reworded Search as Knowledge Library supporting the companion experience.

## Verification

Passed:

- `corepack pnpm build`
- `corepack pnpm -C apps/mobile exec expo export --platform web`
- `scripts/check_phase5_runtime.ps1`
- Browser verification confirmed:
  - no `index` header;
  - home shows `PERSONAL DAILY DAKWAH COMPANION`;
  - home asks `What does your heart need today?`;
  - home shows `TODAY'S GUIDANCE PACKAGE`;
  - Companion route shows `RAFIQ COMPANION`;
  - Quran route shows `DAILY QURAN LAYER`;
  - Hadith route shows `SUNNAH SUPPORT`;
  - Search route shows `KNOWLEDGE LIBRARY`;
  - no browser console errors.

## Current Decision

This correction is a stronger first move, but Product Owner visual review is still required.

Do not proceed to CP08 until Product Owner confirms whether this corrected direction is acceptable or requests a deeper redesign.
