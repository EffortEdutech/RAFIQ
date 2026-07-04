# RAFIQ Privacy & Safety Policy V1

Status: Build Gate
Last updated: 2026-06-09

## Purpose

RAFIQ handles sensitive personal and spiritual data. This document defines minimum privacy and safety expectations before development begins.

## Sensitive Data Classes

| Data | Sensitivity | Handling |
| --- | --- | --- |
| Account details | High | Protected by Supabase Auth; never expose service keys to client. |
| Mood/check-in history | High | User-owned; RLS required. |
| Journal reflections | Very High | Private by default; no admin casual browsing. |
| Companion messages | Very High | Store only as needed; support deletion/export. |
| Guidance history | High | User-owned; used for personalization only with consent. |
| Source/content records | Medium | Public/readable only after approval. |

## User Rights For MVP

MVP should support:

- view profile data
- edit preferences
- delete journal entries
- delete companion history
- request/export personal data
- delete account or request deletion

## Safety Routing

RAFIQ must not treat the following as ordinary guidance:

- self-harm or suicide
- abuse or immediate danger
- medical diagnosis or treatment
- legal advice
- financial rulings
- divorce, inheritance, and marriage disputes
- worship rulings requiring fiqh detail

These cases should route to safe support language, emergency/professional resources where relevant, or qualified scholar referral.

## Data Retention Defaults

- Journal and companion history: retain until user deletes or account is deleted.
- AI validation logs: retain only the minimum needed for safety/debugging.
- Imported content audit logs: retain indefinitely for traceability.
- Raw prompts containing user private text: avoid storing unless required; if stored, protect as sensitive data.

## Build Rule

Any table containing user reflections, moods, messages, or history must have RLS enabled before it is exposed to the API.

