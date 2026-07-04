# CP05 Quran Reading To Guidance

Date: 2026-06-29  
Status: Implemented and verified  
Sprint: RAFIQ Orchestrator-First Product Sprint

## Purpose

CP05 keeps Quran reading primary while allowing an ayah to become a `GuidanceSessionResponse`.

The Quran page must not become a dashboard. The user reads first, opens meaning only when needed, and can open guidance from a specific ayah.

## Route

```text
/quran/:surahNumber
```

## User Flow

The user reads an ayah, then taps:

```text
Open guidance
```

The page calls:

```text
GET /api/private-content/guidance/session
  ?entryPoint=quran_ayah
  &input=<verseKey>
  &surahNumber=<surahNumber>
  &ayahNumber=<ayahNumber>
  &verseKey=<verseKey>
  &language=en
  &domain=all
```

Then the ayah card renders a quiet inline session:

- guidance from this ayah;
- session guidance message;
- reflection prompt;
- one action.

## Verified Browser Result

Mobile viewport:

```text
390 x 844
```

Verification:

- Quran reading room remains first.
- Arabic ayah is visible before guidance.
- Arabic text uses `RafiqKfgqpcHafs`.
- `Open guidance` appears on each ayah.
- Opening guidance for `1:1` creates inline `GUIDANCE FROM THIS AYAH`.
- The inline session includes reflection and one action.
- No internal words such as API, endpoint, payload, private, or preview.
- No horizontal overflow.
- Runtime check passed.

## CP06 Handoff

CP06 must rebuild Learn as a knowledge path.

Learn should not render raw search results. It should create a theme-led guidance path from `GuidanceSessionResponse` or a related `KnowledgePath` surface:

```text
theme
-> Quran anchor
-> meaning
-> tafsir/Sunnah support
-> reflection
-> one action
```

