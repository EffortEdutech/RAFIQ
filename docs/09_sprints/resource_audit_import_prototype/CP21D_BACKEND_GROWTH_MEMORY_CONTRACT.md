# CP21D - Backend Growth Memory Contract

Date: 2026-07-07  
Status: Contract Pass; implementation pending

## Objective

Define backend-backed Growth Memory so RAFIQ can preserve private companion continuity beyond local device state.

## Memory Objects

| Object | Purpose |
| --- | --- |
| `guidance_session_memory` | Saved or resumed guidance sessions. |
| `reflection_entry` | User reflection text tied to guidance, ayah, tafsir, or narration. |
| `action_completion` | One-action completion state and timestamp. |
| `reading_preference` | Language, rhythm, guidance lens, and Arabic font preference. |
| `journal_event` | Private return-history event without gamification. |

## Privacy Boundaries

- Memory is private by default.
- Memory may improve relevance, not authenticity.
- Memory must not override Quran, Hadith, tafsir, source status, or scholar boundaries.
- Sensitive reflections must not be exposed in logs or public APIs.
- Export/delete design is required before broader release.

## API Contract Draft

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/private-content/memory/sessions` | `GET` | List saved/resumable sessions. |
| `/api/private-content/memory/sessions` | `POST` | Save a guidance session. |
| `/api/private-content/memory/sessions/:sessionId/action` | `POST` | Mark one action complete. |
| `/api/private-content/memory/reflections` | `POST` | Save reflection text. |
| `/api/private-content/memory/preferences` | `GET/PUT` | Read/update private reading preferences. |

## Implementation Acceptance

CP21D passes only when:

- shared contracts exist in `packages/shared`;
- API endpoints are documented and implemented;
- mobile Growth reads from backend when available and falls back safely to local state;
- privacy/no-public exposure is verified;
- runtime check includes memory API health.

## Next

Implement after CP21A UAT and before broader companion-device testing.
