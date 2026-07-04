# RAFIQ Quran And Hadith Display Reference Notes

Date: 2026-06-28

## References Reviewed

- Tanzil: Quran reading and clean ayah-focused display reference.
- Quran Android: mobile Quran reading reference with Madani-compliant pages, translations, tafsir, bookmarks, tags, audio, and ayah highlighting.
- Semak Hadis: Hadith verification reference focused on checking authenticity before sharing, collection browsing, and source clarity.

## Quran Display Principles For RAFIQ

- Quran reading must be reading-first, not card-first.
- Arabic Quran text needs a dedicated Quran font, generous line height, and right-aligned RTL layout.
- Translation, tafsir, Sunnah, themes, and sources should be optional layers under the ayah, not competing hero blocks.
- Ayah references should remain visible but quiet.
- Actions must support the reading loop: read, understand, reflect, act.

## Hadith Display Principles For RAFIQ

- Hadith screens should lead with the narration, collection, reference, and grading/verification status.
- The interface should make source confidence clear before encouraging action or sharing.
- Supporting metadata should be structured and calm, not scattered across decorative cards.
- The Semak Hadis pattern confirms that verification and source traceability must be part of the visible reading experience.

## Current Implementation Status

- Profile overflow was fixed by converting wide strips and grids into mobile-safe single-column layouts.
- Quran Arabic now uses a bundled Uthmani/Hafs font copied from the local IQRA font folder:
  - Source: `C:\Users\user\Documents\00 iqra by qiraatec\IQRA\deploy\Font\kfgqpc-hafs-uthmanic-script-font`
  - App asset: `apps/mobile/assets/fonts/KfgqpcHafsUthmanicScriptRegular.ttf`
  - Web export asset: `apps/mobile/public/fonts/KfgqpcHafsUthmanicScriptRegular.woff2`
- Amiri Quran was also copied as fallback:
  - `apps/mobile/assets/fonts/AmiriQuran-Regular.ttf`
  - `apps/mobile/public/fonts/AmiriQuran-Regular.woff2`
- RAFIQ loads the font through `expo-font` as `RafiqKfgqpcHafs`.

## Font QA

Browser QA on `/quran/1` confirmed Quran leaf text renders with:

- `fontFamily: RafiqKfgqpcHafs`
- `direction: rtl`
- Quran ayah text size: `26px` to `28px`

Parent containers may still compute fallback fonts, but the actual Quran ayah text nodes are using the bundled Uthmani/Hafs font.
