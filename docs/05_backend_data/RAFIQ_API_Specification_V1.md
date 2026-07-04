<!--
Extracted from docs/RAFIQ_raw_info.md lines 21004-21786.
Extraction label: current API specification.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# RAFIQ API Specification V1
NestJS + OpenAPI + Supabase Architecture

Build note:

Use `RAFIQ_API_Build_Contract_Addendum_V1.md` before implementation. Endpoint names alone are not sufficient; every endpoint needs auth, role, schema, error, pagination, and rate-limit definitions.

Version: 1.0
Status: Backend Contract Locked

Parent Documents:

RAFIQ PRD V2
RAFIQ Screen Specification V1
RAFIQ Database Schema & ERD Specification V2
RAFIQ AI Engine Specification V2
RAFIQ Knowledge Graph Specification V1
RAFIQ Retrieval & Ranking Engine Specification V1
1. Purpose

This document defines the complete API contract between:

Expo Mobile App
        ↓
NestJS API Gateway
        ↓
RAFIQ Services
        ↓
Supabase
        ↓
OpenAI

Goals:

Stable API contracts
Clear service boundaries
OpenAPI/Swagger generation
Mobile-first architecture
AI-ready backend
2. High Level Architecture
Expo App
    ↓

API Gateway

    ↓

Auth Module

Companion Module

Guidance Module

Quran Module

Hadith Module

Theme Module

Journey Module

Journal Module

Profile Module

Search Module

Knowledge Graph Module

Admin Module
3. API Standards
Base URL

Production

https://api.rafiq.app/v1

Development

http://localhost:3000/api/v1
Response Format

Success:

{
  "success": true,
  "data": {},
  "meta": {}
}

Error:

{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Resource not found"
  }
}
4. Authentication Module

Prefix:

/auth

Provider:

Supabase Auth
POST /auth/login

Purpose:

Authenticate user.

Request:

{
  "email": "user@email.com",
  "password": "******"
}

Response:

{
  "accessToken": "",
  "refreshToken": ""
}
POST /auth/register

Request:

{
  "email": "",
  "password": "",
  "language": "en"
}

Creates:

users
user_preferences
POST /auth/logout

Invalidate session.

GET /auth/me

Returns:

{
  "id": "",
  "email": "",
  "profile": {}
}
5. Guidance Module

Prefix:

/guidance

Purpose:

Daily guidance delivery.

GET /guidance/today

Returns:

{
  "theme": {},
  "ayah": {},
  "hadith": {},
  "reflection": {},
  "action": {}
}

Used by:

HM-01
GET /guidance/:id

Detailed guidance package.

Used by:

HM-02
POST /guidance/save

Request:

{
  "guidanceId": ""
}

Creates:

saved_guidance
6. Companion Module

Prefix:

/companion

Purpose:

AI-powered guidance.

POST /companion/analyze

Input:

{
  "message": "I feel anxious"
}

Output:

{
  "intent": "guidance",
  "theme": "tawakkul",
  "confidence": 0.91
}

Maps to:

NODE-U101
NODE-U102
NODE-U103
POST /companion/generate

Input:

{
  "message": "I feel anxious"
}

Output:

{
  "guidancePackage": {}
}

Pipeline:

Theme Detection
↓
Retrieval
↓
Ranking
↓
Guidance Builder
POST /companion/feedback

Purpose:

Collect relevance feedback.

Request:

{
  "guidanceId": "",
  "rating": 5
}
7. Quran Module

Prefix:

/quran
GET /quran/home

Returns:

{
  "continueReading": {},
  "recentSurahs": [],
  "themes": []
}
GET /quran/surahs

Returns:

[
  {
    "id": 1,
    "name": "Al-Fatihah"
  }
]
GET /quran/surah/:id

Returns:

{
  "surah": {},
  "ayahs": []
}
GET /quran/ayah/:id

Returns:

{
  "ayah": {},
  "translations": [],
  "audio": {}
}
GET /quran/ayah/:id/tafsir

Query:

?source=mukhtasar

Returns:

{
  "source": "Mukhtasar",
  "content": ""
}
GET /quran/ayah/:id/related

Returns:

{
  "relatedAyahs": []
}

Knowledge Graph powered.

GET /quran/ayah/:id/hadith

Returns:

{
  "relatedHadiths": []
}
8. Hadith Module

Prefix:

/hadith
GET /hadith/home

Returns:

{
  "collections": [],
  "topics": []
}
GET /hadith/collections

Returns all collections.

GET /hadith/collection/:id

Returns:

{
  "collection": {},
  "chapters": []
}
GET /hadith/:id

Returns:

{
  "hadith": {},
  "grade": {},
  "translations": []
}
GET /hadith/:id/related

Knowledge graph relationships.

GET /hadith/:id/quran

Returns:

{
  "ayahs": []
}
9. Theme Module

Prefix:

/themes
GET /themes

Returns:

[
  {
    "slug": "tawakkul"
  }
]
GET /themes/:slug

Returns:

{
  "theme": {},
  "ayahs": [],
  "hadiths": [],
  "relatedThemes": []
}
GET /themes/:slug/journeys

Returns journeys.

10. Journey Module

Prefix:

/journeys
GET /journeys

Returns:

{
  "active": [],
  "recommended": []
}
GET /journeys/:id

Journey detail.

GET /journeys/:id/day/:day

Returns lesson package.

POST /journeys/:id/start

Creates:

user_journeys
POST /journeys/:id/complete

Marks lesson complete.

11. Reflection Journal Module

Prefix:

/journal
GET /journal

Returns:

{
  "entries": []
}
POST /journal

Request:

{
  "theme": "tawakkul",
  "reflection": ""
}

Creates:

journal_entries
GET /journal/:id

Retrieve entry.

DELETE /journal/:id

Delete entry.

12. Search Module

Prefix:

/search

Purpose:

Unified search.

GET /search

Parameters:

?q=patience

Returns:

{
  "themes": [],
  "ayahs": [],
  "hadiths": []
}
POST /search/semantic

Request:

{
  "query": "I feel lonely"
}

Returns:

{
  "themes": [],
  "guidance": []
}

Uses:

Embeddings
Knowledge Graph
13. Knowledge Graph Module

Prefix:

/graph

Internal and advanced mode.

GET /graph/theme/:slug

Returns:

{
  "theme": {},
  "relationships": []
}
GET /graph/ayah/:id

Returns graph relationships.

GET /graph/hadith/:id

Returns graph relationships.

14. Profile Module

Prefix:

/profile
GET /profile

Returns profile.

PATCH /profile

Updates:

{
  "language": "ms"
}
GET /profile/stats

Returns:

{
  "streak": 14,
  "reflections": 42
}
15. Settings Module

Prefix:

/settings
GET /settings

Retrieve settings.

PATCH /settings

Update settings.

16. Notification Module

Prefix:

/notifications
GET /notifications

Returns notifications.

POST /notifications/token

Register device.

17. Admin Module

Prefix:

/admin

Protected.

Source Management
/admin/sources
Import Jobs
/admin/import-jobs
Knowledge Graph Rebuild
/admin/graph/rebuild
Embedding Generation
/admin/embeddings/rebuild
18. AI Internal Endpoints

Not exposed publicly.

Prefix:

/internal
POST /internal/retrieval

Used by:

NODE-S904
POST /internal/ranking

Used by:

NODE-S902
POST /internal/guidance

Used by:

NODE-G601
19. OpenAPI Structure

Swagger groups:

Authentication

Guidance

Companion

Quran

Hadith

Themes

Journeys

Journal

Search

Graph

Profile

Admin
20. Supabase Integration
Supabase Responsibilities
Authentication

PostgreSQL

Storage

Realtime

Vector Search
NestJS Responsibilities
Business Logic

Retrieval

Ranking

Knowledge Graph

AI Integration

Security
21. Security Architecture

Authentication:

JWT

Authorization:

Supabase Claims

Role Types:

USER

MODERATOR

ADMIN

SCHOLAR
22. Rate Limiting

Companion:

30 requests/hour

Free Tier.

Search:

120 requests/hour

Authenticated APIs:

Standard throttling
23. API Versioning

Version strategy:

/v1

/v2

/v3

Example:

/api/v1/quran/surah/1
24. NestJS Module Structure
src

modules

 auth

 guidance

 companion

 quran

 hadith

 themes

 journeys

 journal

 profile

 search

 graph

 admin

 ai
25. Architecture Decision

The RAFIQ API is not a simple CRUD backend.

It is a Guidance Delivery Platform built around:

Knowledge Graph
↓
Retrieval
↓
Ranking
↓
Guidance Assembly
↓
Personalization

Every endpoint ultimately exists to help the RAFIQ AI Engine deliver authentic, contextual, Quran-centered guidance to users.

API Readiness Status

After completing:

✅ PRD V2
✅ UX Specification V2
✅ Figma Build Pack V2
✅ Screen Specification V1
✅ API Specification V1

RAFIQ is now approximately 85–90% architecturally defined.

The highest-value next document is:

RAFIQ AI Prompt Architecture V1

because it defines exactly how the AI reasons, retrieves, cites Quran/Hadith, generates reflections, and avoids hallucinations. This is where RAFIQ becomes truly different from a generic AI chatbot.

Bismillah.

