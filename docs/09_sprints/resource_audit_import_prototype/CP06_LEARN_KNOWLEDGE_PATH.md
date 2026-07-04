# CP06 Learn As Knowledge Path

Date: 2026-06-29  
Status: Implemented and verified  
Sprint: RAFIQ Orchestrator-First Product Sprint

## Purpose

CP06 rebuilds Learn so it is no longer a search-result surface.

Learn now opens a theme-led `GuidanceSessionResponse` and presents one knowledge path:

```text
theme
-> Quran anchor
-> meaning
-> guidance
-> reflection
-> one action
-> next step
```

## Route

```text
/search
```

## User Flow

The user chooses or enters a theme:

- Mercy
- Guidance
- Patience
- Gratitude

Learn calls:

```text
GET /api/private-content/guidance/session?entryPoint=learn_theme&input=<theme>&language=en&domain=all
```

Then Learn renders:

- knowledge path title;
- Quran anchor or evidence gate;
- Arabic ayah with selected Quran font;
- meaning;
- quiet evidence status;
- Sunnah support when available;
- reflection prompt;
- one action;
- next step.

## Verified Browser Result

Mobile viewport:

```text
390 x 844
```

Verification:

- Learn renders `KNOWLEDGE PATH`.
- Learn renders `QURAN ANCHOR`.
- Learn renders `GUIDANCE`.
- Learn renders `REFLECT ONCE`.
- Learn renders `ONE ACTION`.
- Arabic text uses `RafiqKfgqpcHafs`.
- Old search-result sections are removed.
- No internal words such as API, endpoint, payload, private, preview, or search results.
- No horizontal overflow.
- Runtime check passed.

## CP07 Handoff

CP07 must rebuild Hadith/Sunnah support so reliability is clear before practice or sharing.

Hadith should support the Quran/theme/action path, not behave as a disconnected browser.

