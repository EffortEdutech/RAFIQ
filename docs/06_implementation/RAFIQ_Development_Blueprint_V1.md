<!--
Extracted from docs/RAFIQ_raw_info.md lines 7607-8417.
Extraction label: development blueprint, no later replacement found.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# RAFIQ Development Blueprint V1
Monorepo + NestJS + Expo + Supabase + OpenAI

Build note:

This implementation blueprint remains useful, but it must be read with the build-gate documents added on 2026-06-09: MVP scope lock, AI validation gates, source licensing register, governance, privacy/safety, Supabase specification, API build contract, and deployment architecture.

Version: 1.0

Status: Development Architecture Approved

Purpose:

Transform all RAFIQ specifications into a production-ready implementation architecture.

This document answers:

"If we start coding tomorrow, exactly how should we build RAFIQ?"

1. Engineering Philosophy

For RAFIQ, speed and maintainability are more important than enterprise complexity.

Avoid:

Microservices
Kubernetes
Event buses
Premature optimization

Start with:

Expo App
     ↓
NestJS API
     ↓
Supabase PostgreSQL
     ↓
OpenAI

Simple.

Scalable.

Affordable.

2. Recommended Architecture
Monorepo

Single repository.

Benefits:

Shared Types
Shared Validation
Shared API Contracts
Easier Development

Repository

rafiq/

apps/
 ├── mobile/
 └── api/

packages/
 ├── shared/
 ├── ui/
 ├── types/
 ├── prompts/
 └── knowledge/

docs/

infra/
3. Technology Stack
Mobile
Expo SDK
React Native
TypeScript
Expo Router
React Query
Zustand
NativeWind
Backend
NestJS
TypeScript
Drizzle ORM
Zod
Database
Supabase PostgreSQL
Authentication
Supabase Auth
AI
OpenAI
Analytics
PostHog
Error Tracking
Sentry
4. Monorepo Structure
rafiq/

apps/
│
├── mobile/
│
└── api/

packages/
│
├── shared/
├── types/
├── prompts/
├── ui/
└── knowledge/

docs/
infra/
5. Mobile Application Structure
mobile/

app/
components/
hooks/
services/
stores/
features/
theme/
assets/
6. Expo Router Structure
app/

(auth)
 ├── login.tsx
 ├── register.tsx

(onboarding)
 ├── goals.tsx
 ├── interests.tsx

(tabs)
 ├── home.tsx
 ├── journal.tsx
 ├── companion.tsx
 ├── progress.tsx
 └── profile.tsx

guidance/
 ├── index.tsx
 ├── quran.tsx
 ├── tafsir.tsx
 ├── hadith.tsx

settings/
7. Feature-Based Mobile Architecture
features/

auth/
guidance/
journal/
chat/
progress/
profile/
checkin/

Each feature contains:

components/
hooks/
services/
types/
screens/
8. State Management

Use Zustand.

Stores

auth.store.ts

profile.store.ts

guidance.store.ts

chat.store.ts

journal.store.ts

Keep stores small.

9. API Layer
services/

api.ts

auth.service.ts

guidance.service.ts

journal.service.ts

chat.service.ts

React Query handles:

Caching
Refetching
Synchronization
10. Backend Structure
src/

modules/
common/
config/
database/
ai/

Modules

auth
users
profiles
checkins
guidance
journal
progress
companion
knowledge
admin
analytics
11. NestJS Module Layout

Example

guidance/

guidance.module.ts

guidance.controller.ts

guidance.service.ts

guidance.repository.ts

dto/

entities/

Repeat for all modules.

12. Shared Package

Purpose

Shared types between frontend and backend.

packages/types

Example

export interface GuidanceResponse {
  theme: Theme;
  quran: QuranPassage;
  tafsir: Tafsir;
  hadith: Hadith;
}
13. Prompt Package

Purpose

Store AI prompts.

packages/prompts

mood/
theme/
reflection/
journal/
companion/

Example

mood-classifier.prompt.ts
14. Knowledge Package

Purpose

Shared retrieval logic.

packages/knowledge

theme-engine/
retrieval/
ranking/
15. Database Layer

Use Drizzle ORM.

Structure

database/

schema/
migrations/
seeds/

Schema Files

users.ts

profiles.ts

themes.ts

quran.ts

hadith.ts

journals.ts
16. AI Architecture

Create dedicated AI layer.

src/ai

ai.module.ts

skills/

orchestrator/

prompts/
17. AI Skills
skills/

mood.skill.ts

theme.skill.ts

reflection.skill.ts

journal.skill.ts

companion.skill.ts

Each skill:

Single responsibility.

18. AI Orchestrator

Purpose

Coordinate skills.

checkin
  ↓
mood skill
  ↓
theme skill
  ↓
retrieval
  ↓
guidance builder

Only one entry point.

19. Guidance Generation Flow
POST /guidance/generate

↓
Check-In

↓
Mood Skill

↓
Theme Skill

↓
Content Retrieval

↓
Reflection Generation

↓
Action Selection

↓
Response Builder
20. OpenAI Integration

Create single gateway.

OpenAiGateway

Responsibilities:

API calls
Retries
Rate limits
Logging

Never call OpenAI directly from services.

21. Knowledge Retrieval Layer

Create:

KnowledgeService

Responsibilities

Retrieve:

Quran
Tafsir
Hadith
Dua
Reflection

Based on theme.

22. Caching Strategy

V1

In-memory cache.

Cache:

themes

quran passages

hadith

duas

TTL

1 hour

V2

Redis

23. Offline Strategy

Mobile Stores

last_guidance

journal_entries

theme_cache

Persist using:

MMKV

Recommended over AsyncStorage.

24. Authentication Flow
Login

↓
Supabase Auth

↓
JWT

↓
NestJS Validation

↓
Access Granted
25. API Contracts
Check-In
POST /checkins

Request

{
  "mood": "worried",
  "notes": "Concerned about work"
}
Generate Guidance
POST /guidance/generate
Chat
POST /companion/chat
Journal
POST /journal
26. Environment Variables

Backend

DATABASE_URL=

SUPABASE_URL=
SUPABASE_SERVICE_KEY=

OPENAI_API_KEY=

POSTHOG_KEY=

SENTRY_DSN=

Mobile

EXPO_PUBLIC_API_URL=

EXPO_PUBLIC_SUPABASE_URL=

EXPO_PUBLIC_SUPABASE_ANON_KEY=
27. CI/CD Pipeline

GitHub

↓

Pull Request

↓

Lint

↓

Tests

↓

Build

↓

Deploy

28. Deployment
Mobile
Expo EAS

Deploy to:

Android
iOS
Backend

Recommended

Railway

Alternative

Render

Database

Supabase

29. Development Phases
Phase 1

Foundation

Duration

1 Week

Build

Monorepo
Auth
Navigation
Database
Phase 2

Knowledge Base

Duration

2 Weeks

Build

Themes
Quran
Hadith
Tafsir
Phase 3

Guidance Engine

Duration

2 Weeks

Build

Mood Skill
Theme Skill
Retrieval
Phase 4

Daily Guidance

Duration

1 Week

Build

Guidance UI
Reflection
Actions
Phase 5

Companion Chat

Duration

1 Week

Build

AI Chat
Context
Safety Layer
Phase 6

Journal & Progress

Duration

1 Week

Build

Journal
Analytics
Progress
Phase 7

Beta Launch

Duration

1 Week

Build

Testing
Bug Fixes
Optimization
30. Solo Founder Development Order

If you are building alone:

Priority 1

Auth
Profile
Check-In

Priority 2

Theme Engine
Knowledge Retrieval

Priority 3

Guidance Screen

Priority 4

Journal

Priority 5

Companion Chat

Priority 6

Progress

Do not build everything at once.

31. AI Cost Optimization

Avoid generating everything with AI.

Example:

Bad

Generate Quran
Generate Hadith
Generate Dua

Good

Retrieve Quran
Retrieve Hadith
Retrieve Dua

Generate Reflection
Generate Guidance Summary

AI should orchestrate.

Database should provide content.

32. Testing Strategy

Unit Tests

NestJS Services

Integration Tests

API Endpoints

E2E Tests

Critical Flows

Login

Check-In

Guidance

Journal
33. Security Checklist

✓ HTTPS

✓ JWT Validation

✓ Supabase RLS

✓ Input Validation

✓ Rate Limiting

✓ Audit Logging

✓ Secret Management

34. Launch Readiness Checklist

Before Beta:

✓ 100+ Quran Passages

✓ 100+ Tafsir Entries

✓ 100+ Hadith

✓ 50+ Duas

✓ 100+ Reflection Prompts

✓ Daily Guidance Working

✓ Chat Safety Layer Working

✓ Analytics Working

✓ Error Monitoring Working

35. RAFIQ V1 Definition of Done

A user can:

Sign Up
Check In
Receive Personalized Guidance
Read Quran
Read Tafsir
Read Hadith
Reflect
Complete Action
Save Journal
Chat With Rafiq
View Progress

All within a lightweight mobile application.

Final Development Principle

Build Rafiq as a Guidance Platform, not an AI Chatbot.

The chatbot is a feature.

The daily guidance journey is the product.

Everything in the architecture should reinforce:

Understand Me
     ↓
Guide Me
     ↓
Reflect With Me
     ↓
Act With Purpose
     ↓
Grow Closer To Allah

Bismillah.

At this point, RAFIQ has a complete product-to-engineering blueprint covering vision, UX, AI, knowledge architecture, database, backend, frontend, and deployment. The next highest-value artifact would be a RAFIQ Node Catalog V1 (similar to QS-OS), defining every AI node, workflow node, input/output contract, and orchestration chain used by the AI engine. This would make the AI system visual, modular, and configurable without rewriting prompts.

