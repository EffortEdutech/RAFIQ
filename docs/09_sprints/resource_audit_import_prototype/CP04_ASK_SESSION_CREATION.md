# CP04 Ask As Session Creation

Date: 2026-06-29  
Status: Implemented and verified  
Sprint: RAFIQ Orchestrator-First Product Sprint

## Purpose

CP04 rebuilds Ask so user questions create a `GuidanceSessionResponse`.

Ask no longer renders answer drafts, prompt packages, citation lists, or internal answer-generation language.

## Route

```text
/answer
```

## User Flow

The user asks in natural language or chooses a starter.

Ask calls:

```text
GET /api/private-content/guidance/session?entryPoint=ask&input=<question>&language=en&domain=all
```

Then Ask renders:

- the user's question;
- Quran anchor or evidence gate;
- Arabic ayah with selected Quran font when available;
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

Evidence-backed path:

- Ask renders `QUESTION`.
- Ask renders `QURAN ANCHOR`.
- Ask renders `REFLECT ONCE`.
- Ask renders `ONE ACTION`.
- No answer draft, guided answer, citation, prompt package, model, API, endpoint, payload, private, or preview wording.
- No horizontal overflow.
- No console errors.

Blocked path:

```text
I feel anxious about rizq
```

- Ask renders `EVIDENCE GATE`.
- The blocked message appears once only.
- Ask does not fabricate guidance.
- Reflection and one action remain visible.
- No internal wording.
- No horizontal overflow.
- No console errors.

## CP05 Handoff

CP05 must rebuild Quran Reading To Guidance.

The Quran page must remain reading-first, but an ayah should be able to become a `GuidanceSessionResponse` without turning the reading room into a dashboard.

