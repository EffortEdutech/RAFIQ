<!--
Extracted from docs/RAFIQ_raw_info.md lines 6022-6833.
Extraction label: superseded database schema specification v1.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# RAFIQ Database Schema & ERD Specification V1

Version: 1.0

Status: Database Architecture Approved

Parent Documents

RAFIQ Product Specification V1
RAFIQ PRD V1
RAFIQ UX Specification V1
RAFIQ AI Engine Specification V1
RAFIQ Knowledge Base Specification V1
RAFIQ Backend Blueprint V1

Purpose

Define the complete relational database architecture for Rafiq.

This document serves as the implementation blueprint for:

Supabase PostgreSQL
NestJS Entities
Drizzle ORM Models
Prisma Models
SQL Migrations
Row Level Security
Analytics Queries
1. Database Philosophy

Separate data into three domains.

USER DOMAIN
Knowledge of User

CONTENT DOMAIN
Knowledge of Islam

AI DOMAIN
Knowledge of Interaction

This separation simplifies scaling and maintenance.

2. Database Overview
AUTH DOMAIN
│
├── profiles
├── user_preferences
└── user_devices

CONTENT DOMAIN
│
├── themes
├── quran_passages
├── translations
├── tafsir
├── hadith
├── duas
├── dhikr
├── ibadah_actions
├── reflection_prompts
└── content_tags

USER DOMAIN
│
├── checkins
├── guidance_sessions
├── journals
├── user_actions
├── bookmarks
└── progress_snapshots

AI DOMAIN
│
├── ai_conversations
├── ai_messages
├── mood_analysis
└── theme_recommendations
3. Authentication Strategy

Authentication handled by Supabase Auth.

Primary Key Source

auth.users.id

Every user table references:

user_id UUID
4. Profiles Table

Purpose

Store user profile.

profiles

id UUID PK
user_id UUID UNIQUE
name TEXT
avatar_url TEXT

language VARCHAR(10)

knowledge_level VARCHAR(20)

timezone VARCHAR(50)

created_at TIMESTAMP
updated_at TIMESTAMP

Indexes

idx_profiles_user_id
5. User Preferences

Purpose

Personalization.

user_preferences

id UUID PK
user_id UUID

daily_reminder_time TIME

morning_reminder BOOLEAN
evening_reminder BOOLEAN

dark_mode BOOLEAN

created_at TIMESTAMP
updated_at TIMESTAMP
6. Themes Table

Purpose

Master taxonomy.

themes

id UUID PK

slug TEXT UNIQUE

name TEXT

category TEXT

description TEXT

priority INTEGER

created_at TIMESTAMP

Example

tawakkul
sabr
shukr
rizq
tawbah
7. Theme Relationships

Purpose

Theme graph.

theme_relationships

id UUID PK

theme_id UUID

related_theme_id UUID

strength INTEGER

Example

tawakkul
 ↔ sabr

tawakkul
 ↔ yaqeen
8. Quran Passages

Purpose

Theme-oriented retrieval.

Not every verse.

Curated passages.

quran_passages

id UUID PK

surah_number INTEGER

ayah_start INTEGER

ayah_end INTEGER

title TEXT

difficulty VARCHAR(20)

priority INTEGER

created_at TIMESTAMP
9. Quran Theme Mapping

Many-to-many.

quran_passage_themes

id UUID PK

passage_id UUID

theme_id UUID
10. Quran Translations
translations

id UUID PK

passage_id UUID

language VARCHAR(10)

translation TEXT

Languages

en
ms
id
11. Tafsir
tafsir

id UUID PK

passage_id UUID

source TEXT

level VARCHAR(20)

content TEXT

reviewed BOOLEAN

Levels

quick
standard
deep
12. Hadith
hadith

id UUID PK

source TEXT

reference TEXT

arabic TEXT

translation TEXT

authenticity VARCHAR(20)

priority INTEGER

reviewed BOOLEAN
13. Hadith Theme Mapping
hadith_themes

id UUID PK

hadith_id UUID

theme_id UUID
14. Dua Library
duas

id UUID PK

title TEXT

arabic TEXT

transliteration TEXT

translation TEXT

priority INTEGER
15. Dua Themes
dua_themes

id UUID PK

dua_id UUID

theme_id UUID
16. Dhikr Library
dhikr

id UUID PK

name TEXT

arabic TEXT

translation TEXT

recommended_count INTEGER
17. Ibadah Actions
ibadah_actions

id UUID PK

title TEXT

description TEXT

duration_minutes INTEGER

difficulty VARCHAR(20)

priority INTEGER
18. Ibadah Themes
ibadah_action_themes

id UUID PK

action_id UUID

theme_id UUID
19. Reflection Prompts
reflection_prompts

id UUID PK

question TEXT

difficulty VARCHAR(20)
20. Reflection Themes
reflection_prompt_themes

id UUID PK

prompt_id UUID

theme_id UUID
21. Daily Check-Ins

Purpose

Store user mood.

checkins

id UUID PK

user_id UUID

selected_mood TEXT

notes TEXT

created_at TIMESTAMP
22. Mood Analysis

Purpose

Store AI result.

mood_analysis

id UUID PK

checkin_id UUID

primary_emotion TEXT

secondary_emotion TEXT

confidence NUMERIC
23. Theme Recommendations
theme_recommendations

id UUID PK

checkin_id UUID

theme_id UUID

confidence NUMERIC
24. Guidance Sessions

Purpose

Track daily guidance.

guidance_sessions

id UUID PK

user_id UUID

checkin_id UUID

primary_theme_id UUID

completed BOOLEAN

generated_at TIMESTAMP

completed_at TIMESTAMP
25. Guidance Content Snapshot

Critical table.

Stores what user saw.

guidance_content

id UUID PK

guidance_session_id UUID

quran_passage_id UUID

tafsir_id UUID

hadith_id UUID

dua_id UUID

action_id UUID

This allows future auditing.

26. User Actions

Purpose

Track completion.

user_actions

id UUID PK

user_id UUID

action_id UUID

completed BOOLEAN

completed_at TIMESTAMP
27. Journals
journals

id UUID PK

user_id UUID

guidance_session_id UUID

mood TEXT

reflection TEXT

gratitude TEXT

created_at TIMESTAMP
28. Progress Snapshots

Purpose

Avoid expensive calculations.

progress_snapshots

id UUID PK

user_id UUID

streak_days INTEGER

guidance_completed INTEGER

journal_count INTEGER

actions_completed INTEGER

updated_at TIMESTAMP
29. Bookmarks

Purpose

Save favorite content.

bookmarks

id UUID PK

user_id UUID

content_type TEXT

content_id UUID

created_at TIMESTAMP
30. AI Conversations
ai_conversations

id UUID PK

user_id UUID

created_at TIMESTAMP
31. AI Messages
ai_messages

id UUID PK

conversation_id UUID

role TEXT

content TEXT

created_at TIMESTAMP

Roles

user
assistant
system
32. User Theme Preferences

Purpose

Personalization.

user_theme_preferences

id UUID PK

user_id UUID

theme_id UUID

score INTEGER

Score increases when user engages.

33. User Content History

Purpose

Avoid repetition.

user_content_history

id UUID PK

user_id UUID

content_type TEXT

content_id UUID

viewed_at TIMESTAMP
34. Analytics Events
analytics_events

id UUID PK

user_id UUID

event_name TEXT

event_data JSONB

created_at TIMESTAMP
35. Admin Users
admin_users

id UUID PK

email TEXT

role TEXT

created_at TIMESTAMP

Roles

content_manager
scholar
super_admin
36. Content Review Workflow
content_reviews

id UUID PK

content_type TEXT

content_id UUID

reviewed_by UUID

status TEXT

reviewed_at TIMESTAMP

Status

draft
reviewed
approved
rejected
37. ERD Overview
USER
 │
 ├── PROFILE
 ├── PREFERENCES
 ├── CHECKINS
 │       │
 │       ├── MOOD_ANALYSIS
 │       └── THEME_RECOMMENDATIONS
 │
 ├── GUIDANCE_SESSIONS
 │       │
 │       └── GUIDANCE_CONTENT
 │
 ├── JOURNALS
 │
 ├── USER_ACTIONS
 │
 ├── BOOKMARKS
 │
 └── AI_CONVERSATIONS
          │
          └── AI_MESSAGES

THEMES
 │
 ├── QURAN
 ├── HADITH
 ├── DUAS
 ├── DHIKR
 ├── IBADAH
 └── REFLECTIONS
38. Indexing Strategy

Create indexes on:

user_id

theme_id

created_at

completed

guidance_session_id

High-frequency queries only.

39. Row Level Security

Every user-owned table:

auth.uid() = user_id

Applied to:

profiles
journals
checkins
progress
bookmarks
conversations
40. V1 Database Size Estimate

10,000 Users

Expected

Profiles:
10,000

Check-Ins:
1,000,000+

Journals:
500,000+

AI Messages:
5,000,000+

Knowledge Content:
< 10,000 Records

Supabase handles comfortably.

41. Migration Sequence

Migration 001

Themes

Migration 002

Quran

Translations

Tafsir

Migration 003

Hadith

Duas

Dhikr

Actions

Migration 004

Profiles

Preferences

Migration 005

Checkins

Guidance

Journal

Migration 006

AI Conversations

Analytics

Admin

42. Database Success Criteria

The database is considered production-ready when:

✓ Supports complete daily guidance workflow

✓ Supports AI personalization

✓ Supports journal history

✓ Supports progress tracking

✓ Supports content retrieval

✓ Supports future expansion

✓ Enforces user privacy through RLS

✓ Maintains content auditability

Final Database Principle

User data and Islamic knowledge must remain independent.

Knowledge provides guidance.

User data provides personalization.

AI connects the two.

This separation ensures Rafiq remains trustworthy, scalable, maintainable, and extensible for future generations of features.

Alhamdulillah.

With this document, the core architecture stack is now complete.

The next document I would create is not another technical document. It is the one that will save the most development time:

RAFIQ Figma Build Pack V1

This would contain:

Screen-by-screen wireframes
Component catalog
Design tokens
Spacing system
Typography system
Dark theme specification
React Native component mapping
Expo Router page structure

Essentially a blueprint that lets a designer or AI-assisted Figma workflow generate the entire UI consistently before coding begins.

