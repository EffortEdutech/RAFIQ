<!--
Extracted from docs/RAFIQ_raw_info.md lines 5322-6021.
Extraction label: backend blueprint, no later replacement found.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# RAFIQ Backend Blueprint V1
NestJS + Supabase Architecture

Build note:

This backend blueprint predates some later V2 knowledge and graph decisions. Use it with `RAFIQ_API_Build_Contract_Addendum_V1.md`, `RAFIQ_Supabase_Specification_V1.md`, and the current V2 database/AI documents.

Version: 1.0

Status: Engineering Blueprint Approved

Parent Documents

RAFIQ Product Specification V1
RAFIQ PRD V1
RAFIQ UX Specification V1
RAFIQ AI Engine Specification V1
RAFIQ Knowledge Base Specification V1

Purpose

This document translates all previous specifications into a production-ready backend architecture.

Target Outcomes:

Scalable Architecture
AI Orchestration Layer
Knowledge Retrieval Layer
Mobile-Optimized APIs
Offline-Friendly Design
Low Operating Cost
PDPA Compliance
1. System Architecture
React Native App
        │
        ▼
API Gateway (NestJS)
        │
 ┌──────┼──────┐
 ▼      ▼      ▼
Auth   AI    Content
Svc    Svc   Svc
 │      │      │
 └──────┼──────┘
        ▼
Supabase PostgreSQL
        │
        ▼
Supabase Storage

        ▼
OpenAI API
2. Architectural Principles
Principle 1

Content First

AI never invents religious content.

AI retrieves content.

Principle 2

Mobile First

Minimize payload size.

Principle 3

Offline First

Cache important content locally.

Principle 4

Stateless APIs

Every request self-contained.

Principle 5

Modular Services

Each service has one responsibility.

3. Technology Stack

Frontend

React Native
Expo
TypeScript

Backend

NestJS
TypeScript

Database

Supabase PostgreSQL

Authentication

Supabase Auth

Storage

Supabase Storage

AI

OpenAI

Analytics

PostHog

Monitoring

Sentry

Caching

Redis (Optional V2)
4. Backend Modules
src/

auth/
users/
profiles/
checkins/
themes/
guidance/
quran/
tafsir/
hadith/
dua/
ibadah/
journal/
progress/
companion/
knowledge/
ai/
analytics/
admin/
5. Core Services
Auth Service

Responsibilities

Login
Register
Password Reset
Session Validation
User Service

Responsibilities

User Profile
Preferences
Theme Interests
Check-In Service

Responsibilities

Daily Mood Capture
Check-In History
Guidance Service

Responsibilities

Build Today's Guidance

Main orchestration service.

Companion Service

Responsibilities

Chat
Memory Retrieval
AI Conversations
Knowledge Service

Responsibilities

Content Retrieval
Theme Matching
Search
Progress Service

Responsibilities

Streaks
Insights
Metrics
6. Database Design
users
id UUID PK
email
created_at
updated_at
profiles
id UUID PK
user_id FK
name
language
knowledge_level
created_at
themes
id UUID PK
slug
name
category
description
user_theme_preferences
id UUID PK
user_id FK
theme_id FK
checkins
id UUID PK
user_id FK
mood
notes
created_at
guidance_sessions
id UUID PK
user_id FK
theme_id FK
generated_at
completed_at
journal_entries
id UUID PK
user_id FK
mood
reflection
gratitude
created_at
user_actions
id UUID PK
user_id FK
action_id FK
completed
completed_at
7. Knowledge Tables
quran_verses
id UUID PK
surah
ayah_start
ayah_end
theme_ids[]
priority
translations
id UUID PK
verse_id FK
language
content
tafsir
id UUID PK
verse_id FK
level
content
hadith
id UUID PK
source
reference
content
theme_ids[]
duas
id UUID PK
title
arabic
translation
theme_ids[]
ibadah_actions
id UUID PK
title
description
duration
difficulty
theme_ids[]
reflection_prompts
id UUID PK
question
theme_ids[]
8. AI Orchestration Layer
AI Gateway

Single entry point.

AI Gateway
     │
     ├── Mood Skill
     ├── Theme Skill
     ├── Reflection Skill
     ├── Journal Skill
     └── Companion Skill
9. Guidance Generation Pipeline
Check-In
   ↓
Mood Analysis
   ↓
Theme Selection
   ↓
Knowledge Retrieval
   ↓
Reflection Generation
   ↓
Action Selection
   ↓
Guidance Assembly
10. Guidance API

Endpoint

POST /guidance/generate

Input

{
  "mood": "anxiety",
  "message": "I'm worried about work."
}

Output

{
  "theme": {},
  "quran": {},
  "tafsir": {},
  "hadith": {},
  "reflection": [],
  "action": {},
  "dua": {}
}
11. Companion Chat API

Endpoint

POST /companion/chat

Input

{
  "message": "I feel lost."
}

Output

{
  "response": "...",
  "theme": "hope"
}
12. AI Skill Services
Mood Skill

Input

User Message

Output

Emotion

Confidence

Theme Skill

Input

Emotion

Output

Themes

Reflection Skill

Input

Theme

Output

Questions

Journal Skill

Input

Journal Entry

Output

Insights

13. Memory Architecture
Session Memory

Temporary

Current Conversation

User Memory

Persistent

Preferences

Theme History

Completed Actions

Behavioral Memory

Aggregated Patterns

Frequently Selected Themes

Recurring Emotions

Guidance Completion

14. Offline Strategy

Mobile Cache

Store:

Last 30 Guidance Sessions
Journal Entries
Theme Data

Sync Strategy

Local
 ↓
Queue
 ↓
Sync
 ↓
Server
15. Security

Authentication

JWT

Encryption

HTTPS

TLS

Database

Row-Level Security

Supabase RLS

Data Isolation

User can only access own records.

16. Row Level Security

Example

auth.uid() = user_id

Applied To

Journal
Check-Ins
Progress
Guidance History
17. Notifications

V1

Daily Reminder

Morning Reminder

Evening Reminder

Stored Table

notification_preferences
18. Analytics Events

Track

checkin_completed
guidance_generated
guidance_completed
journal_created
action_completed
chat_started
19. Admin Architecture

Admin Roles

Content Manager

Scholar Reviewer

Super Admin

Admin Modules

Theme Management

Quran Management

Tafsir Management

Hadith Management

User Analytics

Content Approval

20. Deployment Architecture

Development

Developer Machine

Staging

Supabase Staging
NestJS Staging

Production

Supabase Production
NestJS Production
21. Infrastructure

Recommended

Backend

Railway
or
Render

Initial Stage

Future Scale

AWS ECS

or

Google Cloud Run
22. Cost Optimization

Cache Theme Results

Cache Quran Retrieval

Cache Hadith Retrieval

Cache Reflection Templates

Reduce AI Calls

Use AI only when needed.

Use database retrieval whenever possible.

23. V1 Development Sequence

Phase 1

Auth

Users

Profiles

Phase 2

Knowledge Base

Themes

Quran

Hadith

Tafsir

Phase 3

Guidance Engine

Mood Skill

Theme Skill

Retrieval

Phase 4

Companion Chat

Journal

Progress

Phase 5

Analytics

Notifications

Beta Release

24. API Inventory

Authentication

POST /auth/register
POST /auth/login
POST /auth/logout

Profile

GET /profile
PUT /profile

Check-In

POST /checkins
GET /checkins/history

Guidance

POST /guidance/generate
GET /guidance/history

Journal

POST /journal
GET /journal

Progress

GET /progress

Companion

POST /companion/chat
25. Success Criteria

The backend is considered complete when:

✓ User authentication works

✓ Knowledge retrieval works

✓ Guidance generation works

✓ Companion chat works

✓ Journal works

✓ Progress tracking works

✓ Mobile app functions offline

✓ Average response time < 5 seconds

Final Architecture Statement

Rafiq is built as a Content-First AI Platform.

Knowledge Base provides authenticity.

AI provides personalization.

NestJS orchestrates workflows.

Supabase stores knowledge and user growth.

Together they create a trusted, scalable, and maintainable personal Islamic companion platform.

Alhamdulillah.

At this point, the architecture chain is complete:

Product Specification V1
PRD V1
UX Specification V1
AI Engine Specification V1
Knowledge Base Specification V1
Backend Blueprint V1

The next logical document is RAFIQ Database Schema & ERD Specification V1, where we design every table, relationship, indexes, Supabase RLS policy, and migration plan in implementation-level detail before coding begins. This will become the blueprint for your NestJS entities, Prisma/Drizzle models, and Supabase migrations.

