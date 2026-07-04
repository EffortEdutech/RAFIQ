# CP03 Today As Session Entry

Date: 2026-06-29  
Status: Implemented and verified  
Sprint: RAFIQ Orchestrator-First Product Sprint

## Purpose

CP03 rebuilds Today so the first screen is no longer a hardcoded dashboard or static demo.

Today now creates a live `GuidanceSessionResponse` from the CP02 orchestrator and renders the session:

```text
need
-> Quran anchor
-> meaning
-> verification
-> reflection
-> one action
-> next step
```

## Route

```text
/
```

## User Flow

The user chooses one need:

- Mercy
- Guidance
- Patience
- Gratitude

Today calls:

```text
GET /api/private-content/guidance/session?entryPoint=today&input=<need>&language=en&domain=all
```

Then Today renders:

- Quran anchor;
- Arabic ayah with selected Quran font;
- simple meaning;
- quiet evidence status;
- reflection prompt;
- one action;
- next step.

## Verified Browser Result

Mobile viewport:

```text
390 x 844
```

Verification:

- Today renders session-led content.
- Quran anchor is visible.
- Arabic text uses `RafiqKfgqpcHafs`.
- Reflection prompt is visible.
- One action is visible.
- No old hardcoded Today content.
- No internal words such as API, endpoint, payload, private, or preview.
- No horizontal overflow.
- No console errors.

## CP04 Handoff

CP04 must rebuild Ask so user questions create the same `GuidanceSessionResponse`.

Ask must not show a disconnected answer draft. It must show:

```text
question
-> Quran anchor
-> evidence/verification
-> guidance
-> reflection
-> one action
```

