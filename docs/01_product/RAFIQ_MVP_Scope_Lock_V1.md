# RAFIQ MVP Scope Lock V1

Status: Build Gate
Last updated: 2026-06-09

## Purpose

This document resolves the main scope ambiguity in the extracted RAFIQ specifications.

The raw discussion uses `V1` in two different ways:

- early lightweight MVP: daily check-in plus one guidance package
- later platform architecture: Quran, hadith, tafsir, graph, journeys, search, and governance

For build purposes, RAFIQ now uses four scope labels.

## Scope Labels

| Label | Meaning | Build Decision |
| --- | --- | --- |
| `MVP Core` | Must exist for the first usable RAFIQ release. | Build first. |
| `MVP Support` | Useful in first release but can be reduced if time is tight. | Build after core flow works. |
| `Platform Foundation` | Needed for safe architecture, imports, and authenticity, even if hidden from users. | Build only where required by MVP. |
| `Post-MVP` | Valuable but not required for first release. | Do not build until MVP is stable. |

## MVP Core User Promise

A user can open RAFIQ, share their current state, receive sourced Islamic guidance, reflect on it, complete a small action, and return later with their progress preserved.

## MVP Core Modules

| Module | Scope | Notes |
| --- | --- | --- |
| Authentication | MVP Core | Email/password or supported Supabase Auth method. Social auth is optional. |
| Onboarding | MVP Core | Collect language, goals, and basic preferences only. |
| Daily Check-In | MVP Core | Mood/state input, available time, optional free text. |
| Companion Guidance | MVP Core | Retrieval-grounded response with Quran, hadith where available, reflection, action, and safety boundary. |
| Daily Guidance Home | MVP Core | Show today's theme, evidence, reflection, and action. |
| Reflection Journal | MVP Core | Save private reflections and completion state. |
| Profile & Settings | MVP Core | Language, privacy, account, and data controls. |

## MVP Support Modules

| Module | Scope | Notes |
| --- | --- | --- |
| Quran Browse | MVP Support | Start with basic surah/ayah browse and ayah detail. Deep Quran explorer is Post-MVP. |
| Hadith Browse | MVP Support | Start with hadith detail and verification display. Full hadith search is Post-MVP unless data is ready. |
| Library | MVP Support | Saved guidance and saved evidence only. Topic explorer can wait. |
| Journeys | MVP Support | One simple journey may ship if content is approved. Multi-journey system is Post-MVP. |

## Platform Foundation For MVP

These are not all user-facing, but they protect the product.

- content source registry
- license registry
- scholar/content approval status
- Quran reference validation
- hadith reference and grade validation
- blocked-topic routing
- RLS policies for user-owned data
- prompt version tracking
- basic audit trail for imported content

## Post-MVP

- Knowledge Graph Explorer
- Deep Study Mode
- Semantic Search across all sources
- Scholar Mode
- Family or Couples Mode
- Voice Companion
- Ramadan, Hajj, and Umrah modes
- Community or social features
- Advanced learning-to-rank
- Multi-language expansion beyond approved launch languages

## Screen Priority

| Priority | Screens |
| --- | --- |
| `MVP Core` | OB-01, OB-02, OB-03, OB-04, HM-01, HM-02, CP-01, CP-02, PF-01, PF-04 |
| `MVP Support` | QR-01, QR-02, QR-03, QR-04, HD-01, HD-02, HD-03, LB-01 |
| `Post-MVP` | QR-05, LB-02, LB-03, JY-01, JY-02, JY-03, PF-02, PF-03 |

## Build Rule

Do not start Post-MVP screens until the MVP Core guidance loop works end to end:

`check-in -> retrieval -> verification -> guidance package -> reflection -> action completion -> journal/history`

