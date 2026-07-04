# CP01 GuidanceSession Contract

Date: 2026-06-29  
Status: Implemented for shared contract review  
Sprint: RAFIQ Orchestrator-First Product Sprint

## Purpose

`GuidanceSession` is the central product object for RAFIQ.

It exists so Today, Ask, Read, Learn, and Growth do not invent separate card stacks or disconnected guidance flows.

Every accepted RAFIQ guidance experience must render from one session shape:

```text
need
-> Quran anchor
-> meaning or tafsir layer
-> Sunnah support
-> verification
-> guidance message
-> reflection
-> one action
-> memory
-> next step
```

## Shared Code Contract

The TypeScript contract is defined in:

```text
packages/shared/src/guidance-session.ts
```

It is exported from:

```text
packages/shared/src/index.ts
```

## Required Session Fields

- `sessionId`: stable session identifier.
- `status`: draft, ready, blocked, saved, or completed.
- `need`: user state, question, theme, ayah, or resume reason.
- `quranAnchor`: Quran-first anchor with Arabic text, reference, simple meaning, and optional tafsir.
- `sunnahSupport`: verified Sunnah support connected to the theme/action.
- `verification`: response state, evidence counts, review status, and evidence list.
- `guidance`: title, message, reflection prompt, one action, and next step.
- `memory`: saved state, reflection text, journal id, resume link.
- `sourceMap`: retrieval trace, search results, and source detail targets.

## Route Mapping

| Route | Entry Point | Session Use |
| --- | --- | --- |
| `/` Today | `today` | Create or resume today's session from check-in. |
| `/answer` Ask | `ask` | Create session from natural language question. |
| `/quran/:surahNumber` Read | `quran_ayah` | Turn selected ayah into a session without breaking reading-first UI. |
| `/search` Learn | `learn_theme` | Build a knowledge path from a theme. |
| `/profile` Growth | `growth_resume` | Resume saved/unfinished sessions and memory. |

## Product Owner Acceptance For CP01

CP01 passes only if one object can represent:

- Today guidance;
- Ask guidance;
- Quran-derived guidance;
- Learn/theme knowledge path;
- Growth resume;
- evidence-before-answer;
- reflection and one action;
- saved memory.

## CP02 Handoff

CP02 must create the orchestrator service that returns:

```text
GuidanceSessionResponse
```

The UI rebuild must wait for that service instead of creating more screen-specific guidance structures.

