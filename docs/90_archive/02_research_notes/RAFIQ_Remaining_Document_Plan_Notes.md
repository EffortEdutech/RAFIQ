<!--
Extracted from docs/RAFIQ_raw_info.md lines 19306-19615.
Extraction label: remaining document plan notes.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# The RAFIQ Figma Build Pack V2 is usually the last design document, but it is not the final architecture document.

Looking at everything we have designed, RAFIQ is now much larger than a normal mobile app. It is becoming an Islamic Knowledge Intelligence Platform.

I would divide the remaining work into three phases.

Phase 1 — Foundation (Completed)

✅ RAFIQ PRD V2

✅ RAFIQ UX Specification V2

✅ RAFIQ Knowledge Base Specification V2

✅ RAFIQ Knowledge Graph Specification V1

✅ RAFIQ AI Engine Specification V2

✅ RAFIQ Retrieval & Ranking Engine Specification V1

✅ RAFIQ Data Import Pipeline Specification V1

✅ RAFIQ Database Schema & ERD Specification V2

✅ RAFIQ Backend Blueprint V1

✅ RAFIQ Development Blueprint V1

✅ RAFIQ Node Catalog V2

At this point we already know:

What RAFIQ is
How it works
How knowledge is stored
How AI retrieves guidance
How the backend works
Phase 2 — Product Build Documents

These are what your developers and designers will use daily.

1. RAFIQ Figma Build Pack V2

Contains:

Design Tokens

Color System

Typography

Spacing

Components

Navigation

Screen Library

Interaction States

Dark Mode

Responsive Rules

Output:

Ready for Figma implementation
2. RAFIQ Screen Specification V1

Every screen documented.

Example:

Home

Companion

Quran

Ayah Detail

Hadith Detail

Library

Profile

Settings

Onboarding

Each screen contains:

Purpose

Components

API Dependencies

State Logic

UX Rules

Output:

Ready for Expo development
3. RAFIQ Design System V1

Design language.

Examples:

Cards

Buttons

Theme Tags

Ayah Components

Hadith Components

Reflection Components

Output:

Reusable UI system
Phase 3 — Engineering Build Documents

These are what make implementation significantly easier.

4. RAFIQ API Specification V1

NestJS APIs.

Example:

/auth

/companion

/quran

/hadith

/themes

/guidance

/journeys

Output:

Swagger-ready API blueprint
5. RAFIQ Supabase Specification V1

Defines:

Auth

Storage

Policies

Edge Functions

Realtime

Vector Search

Output:

Production database setup guide
6. RAFIQ AI Prompt Architecture V1

Very important.

Defines:

System Prompts

Retrieval Prompts

Reflection Prompts

Search Prompts

Safety Prompts

Localization Prompts

Without this document, AI quality becomes inconsistent.

7. RAFIQ Deployment Architecture V1

Defines:

Development

Staging

Production

CI/CD

Monitoring

Backups

Output:

Deployment-ready architecture
Phase 4 — Launch Documents

Often overlooked by founders.

8. RAFIQ Content Governance Specification V1

Defines:

Who can add knowledge

Who approves content

Scholar review workflow

Versioning

Audit trails

Critical for religious products.

9. RAFIQ Trust & Authenticity Framework V1

Defines:

Quran validation

Hadith validation

Source attribution

AI limitations

Disclaimer policies

This may become RAFIQ's strongest differentiator.

10. RAFIQ Product Master Blueprint V1

The final document.

This combines all previous documents into one master architecture.

Think of it as:

RAFIQ Constitution

Contains:

Vision

Product

UX

AI

Knowledge

Database

API

Deployment

Governance

Roadmap

One document that can be handed to:

Developers
Designers
Investors
Partners
Future team members
My recommendation

The best next sequence is:

1. RAFIQ Figma Build Pack V2
2. RAFIQ Screen Specification V1
3. RAFIQ API Specification V1
4. RAFIQ AI Prompt Architecture V1
5. RAFIQ Product Master Blueprint V1

After those five documents, RAFIQ will be essentially ready to move into implementation with:

NestJS
Supabase
Expo
OpenAI
Figma

and very little architectural uncertainty remaining.

Bismillah.

