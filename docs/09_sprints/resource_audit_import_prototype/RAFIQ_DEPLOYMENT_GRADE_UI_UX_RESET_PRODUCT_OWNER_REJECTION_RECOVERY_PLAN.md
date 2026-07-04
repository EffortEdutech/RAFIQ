# RAFIQ Product Owner Rejection Recovery Plan

Date: 2026-06-28  
Status: Superseded by V2 rebuild plan  
Decision: CP12 GO retracted; rebuild from `RAFIQ_MOBILE_COMPANION_UIUX_REBUILD_PLAN_V2.md`

> Product Owner rejected the recovery direction after seeing no meaningful UI/UX improvement. Continue from the V2 Mobile Companion UI/UX Rebuild Plan, not from this recovery pass.

## Product Owner Rejection

The Product Owner rejected the CP12 acceptance state because the RAFIQ UI/UX still speaks like a development surface instead of a mobile companion or special companion device. The visible product experience explains process, review state, source plumbing, and implementation boundaries instead of delivering knowledge and guidance to the user.

## Recovery Objective

RAFIQ must feel like a daily Islamic companion and knowledge delivery system. The user should open the app and receive:

- a clear need or theme;
- Quran-first guidance;
- meaning and tafsir where useful;
- Sunnah support with reference and grade;
- one reflection;
- one action;
- a return path for growth memory.

## Non-Negotiables

- Remove developer/process language from product routes.
- Do not show terms such as payload, validation console, private review, deployment, approval gates, trace, source shelves, or "RAFIQ should" in user-facing product screens.
- Keep operational review and source-detail language inside internal routes only.
- Make Today, Companion, Quran, Library, Hadith, and Profile speak in direct user benefit language.
- Preserve authenticity cues, but present them as source, reference, grade, and reading details instead of internal review state.
- Optimize mobile-first density: guidance first, fewer explanatory panels, clear actions.

## Recovery Scope

Product routes:

- `/`
- `/answer`
- `/quran/1`
- `/hadith`
- `/search`
- `/profile`

Internal routes remain separated:

- `/review`
- `/source-detail`

## Acceptance For Recovery

- Product route scan has no developer-facing phrases listed above.
- Browser QA passes mobile and desktop smoke checks for the product routes.
- Each route clearly answers: What guidance is here? What source supports it? What should I reflect on? What action can I take?
- CP12 remains NO-GO until Product Owner accepts the recovered experience.
