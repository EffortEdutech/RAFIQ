# CP02 Orchestrator Service

Date: 2026-06-29  
Status: Implemented and verified  
Sprint: RAFIQ Orchestrator-First Product Sprint

## Purpose

CP02 creates the backend service that turns a user state, question, theme, ayah, or resume request into one `GuidanceSessionResponse`.

This checkpoint does not rebuild UI screens. It creates the backend object that the UI must render in later checkpoints.

## Endpoint

```text
GET /api/private-content/guidance/session
```

Query:

- `entryPoint`: `today`, `ask`, `quran_ayah`, `learn_theme`, or `growth_resume`
- `input`: user state, question, theme, or ayah context
- `language`: optional guidance language
- `domain`: optional retrieval domain
- `surahNumber`: optional Quran source
- `ayahNumber`: optional Quran source
- `verseKey`: optional Quran source
- `resumeSessionId`: optional memory resume source

Response:

```text
GuidanceSessionResponse
```

## Service Behavior

The service now:

- searches private Quran, tafsir, themes, topics, and Hadith content;
- creates a guarded guided-answer package;
- selects a Quran anchor when evidence supports it;
- adds Sunnah support when Hadith evidence is retrieved;
- records verification status, evidence count, review status, and source targets;
- creates one reflection prompt;
- creates one action;
- creates memory fields for save/resume;
- blocks sessions when evidence is unavailable instead of inventing guidance.

## Verified Examples

Evidence-backed theme:

```text
input=mercy
entryPoint=learn_theme
status=ready
quranAnchor=7:155
evidenceCount=6
next=/quran/7
```

Insufficient evidence:

```text
input=I feel anxious about rizq
entryPoint=ask
status=blocked_no_evidence
quranAnchor=false
evidenceCount=0
next=/answer
```

## Product Rule

RAFIQ must not fabricate Islamic guidance when evidence is unavailable.

A blocked session is acceptable. A confident uncited answer is not acceptable.

## CP03 Handoff

CP03 must rebuild Today so it creates or resumes a `GuidanceSessionResponse`.

The Today screen should not render dashboard sections. It should render the active session:

```text
need
-> Quran anchor
-> meaning
-> Sunnah support if available
-> verification
-> reflection
-> one action
-> memory
```

