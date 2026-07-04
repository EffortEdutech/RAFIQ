# RAFIQ Supabase Specification V1

Status: Build Gate
Last updated: 2026-06-09

## Purpose

This document clarifies how RAFIQ uses Supabase before implementation starts.

Supabase features and CLI behavior change over time. Before implementation, verify current Supabase docs and changelog, especially for Auth, RLS, Storage, Edge Functions, and pgvector.

## Supabase Responsibilities

| Area | Responsibility |
| --- | --- |
| Auth | User authentication and identity. |
| Postgres | Primary relational database. |
| RLS | Row-level protection for user-owned data. |
| Storage | Future audio/assets/user exports if needed. |
| Realtime | Optional; not required for MVP unless UX requires live updates. |
| Vector Search | pgvector-backed embeddings where supported and approved. |

## NestJS Responsibilities

| Area | Responsibility |
| --- | --- |
| Business logic | Guidance assembly, content workflows, personalization. |
| AI orchestration | Prompts, retrieval, validation, response generation. |
| Admin operations | Imports, approvals, graph rebuilds, embedding rebuilds. |
| API security | Auth checks, rate limits, validation, logging. |

## RLS Rules

- Enable RLS on every user-owned table in exposed schemas.
- Do not authorize from user-editable metadata.
- Store roles/permissions in trusted app metadata or dedicated authorization tables.
- Service-role keys must never be exposed to mobile clients.
- Views exposed to clients must not bypass RLS.
- Update policies need matching select access where required by Postgres behavior.

## Table Classification

| Table Type | Example | Access Rule |
| --- | --- | --- |
| Public approved content | Quran, approved hadith, approved themes | Readable after approval/published state. |
| User-owned private content | journals, check-ins, companion history | Only owner can read/write. |
| Admin content workflow | imports, approval queues, source registry | Admin/editor/scholar roles only. |
| AI logs | validation logs, prompt runs | Admin/system only; avoid storing unnecessary private text. |

## MVP Supabase Checklist

- Auth configured.
- RLS enabled for user private tables.
- Policies tested for owner read/write isolation.
- Public content tables expose only approved/published records.
- Service key only used server-side.
- Database migrations versioned.
- pgvector availability confirmed before embedding implementation.
- Backup and restore approach documented.

