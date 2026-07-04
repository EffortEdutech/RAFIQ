<!--
Extracted from docs/RAFIQ_raw_info.md lines 22530-23295.
Extraction label: current master blueprint.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# RAFIQ Product Master Blueprint V1
The Constitution of RAFIQ

Version: 1.0
Status: Master Architecture Locked

Document Type: Executive Blueprint

Purpose:

This document consolidates all RAFIQ specifications into a single master blueprint that can be used by:

Founders
Product Managers
Designers
Developers
AI Engineers
Scholars
Investors
Future Team Members

This is the highest-level document in the RAFIQ ecosystem.

Executive Summary

RAFIQ is an AI-powered Islamic Companion that helps Muslims engage with the Quran and Sunnah through personalized guidance, reflection, and action.

RAFIQ is not a chatbot.

RAFIQ is not a fatwa engine.

RAFIQ is not a content library.

RAFIQ is a:

Personal Islamic Companion
+
Islamic Knowledge Intelligence Platform
+
Spiritual Growth System
1. Vision
Long-Term Vision

To become the world's most trusted AI-powered Islamic companion.

Helping Muslims:

Remember Allah
Understand Islam
Reflect deeply
Act consistently
Grow spiritually

Every day.

Mission

Deliver authentic, contextual, Quran-centered guidance to every Muslim through AI, knowledge, and reflection.

Product Promise

When a user opens RAFIQ:

I will receive guidance.
Not information overload.
2. Product Positioning
What RAFIQ Is

✅ Islamic Companion

✅ Daily Guidance Platform

✅ Quran Reflection Platform

✅ Hadith Discovery Platform

✅ Spiritual Growth Platform

What RAFIQ Is Not

❌ Social Network

❌ AI Chat App

❌ Fatwa Generator

❌ Islamic TikTok

❌ Islamic Content Marketplace

3. Core Product Philosophy

RAFIQ follows:

Guidance
↓
Reflection
↓
Action
↓
Growth

Not:

Content
↓
Consumption
↓
More Content
4. Product Architecture
Core Experience Stack
Companion

Daily Guidance

Quran

Hadith

Themes

Reflection

Journeys

Profile
User Experience Loop
Open RAFIQ

↓

Receive Guidance

↓

Read

↓

Reflect

↓

Act

↓

Return Tomorrow
5. User Personas
Daily Muslim

Needs:

Relevant guidance
Quick reading
Reflection
Growth Seeker

Needs:

Consistency
Learning journeys
Personal growth
Student of Knowledge

Needs:

Sources
Tafsir
Related knowledge
6. Knowledge Architecture

RAFIQ knowledge is built upon:

Quran Layer

Includes:

Arabic text
Translations
Transliterations
Audio
Themes
Tafsir Layer

Priority:

Al-Mukhtasar
Al-Muyassar
As-Sa'di
Ibn Kathir
Hadith Layer

Priority Collections:

Sahih al-Bukhari
Sahih Muslim
Riyad as-Salihin
Al-Adab Al-Mufrad
Theme Layer

Examples:

Tawakkul

Sabr

Shukr

Tawbah

Rahmah

Ikhlas

Yaqin

Rizq
Knowledge Graph Layer

Relationships:

Ayah ↔ Ayah

Ayah ↔ Hadith

Hadith ↔ Hadith

Theme ↔ Theme

Theme ↔ Ayah

Theme ↔ Hadith
7. AI Architecture
AI Principle

AI is never the source.

Knowledge is the source.

Guidance Pipeline
User Situation

↓

Intent Detection

↓

Theme Detection

↓

Retrieval

↓

Ranking

↓

Evidence Selection

↓

Guidance Generation

↓

Reflection

↓

Action
AI North Star
Understand

↓

Retrieve

↓

Verify

↓

Explain

↓

Reflect

↓

Act
8. Retrieval Architecture

RAFIQ uses Retrieval-Augmented Generation (RAG).

Retrieval Sources
Quran

Hadith

Tafsir

Knowledge Graph

User History
Ranking Factors
Theme Relevance

Source Authority

Hadith Grade

Graph Relationships

User Context
9. Companion System

The flagship RAFIQ experience.

Input

Examples:

I feel anxious

I feel lost

I need motivation

I am struggling with prayer
Output
Theme

Quran

Hadith

Reflection

Action
Companion Promise

Every response must contain:

Evidence
References
Reflection
Action
10. Guidance Engine

Daily personalized guidance.

Inputs
User Goals

Recent Themes

Journeys

Reflection History
Outputs
Today's Theme

Today's Ayah

Today's Reflection

Today's Action
11. Journey System

Structured growth programs.

Initial Journeys
30 Days of Tawakkul
30 Days of Sabr
30 Days of Gratitude
Ramadan Journey
Journey Structure
Theme

↓

Ayah

↓

Hadith

↓

Reflection

↓

Action
12. UX Philosophy

RAFIQ should feel:

Calm

Personal

Trustworthy

Reflective

Never:

Noisy

Addictive

Competitive

Overwhelming
13. Screen Architecture

MVP:

26 Screens

Modules:

Onboarding

Home

Companion

Quran

Hadith

Library

Journeys

Profile
14. Design System
Visual Identity

Mood:

Peace

Clarity

Reflection
Color System

Primary:

Deep Islamic Green

Secondary:

Warm Sand

Accent:

Gold
Typography

Arabic:

Noto Naskh Arabic

Latin:

Inter
15. Technical Architecture
Frontend
Expo
React Native
TypeScript
Backend
NestJS
PostgreSQL
REST API
OpenAPI
Infrastructure
Supabase

Responsibilities:

Auth

Database

Storage

Realtime

Vector Search
AI Layer
OpenAI Platform

Responsibilities:

Intent Detection

Theme Detection

Reasoning

Reflection Generation

Guidance Assembly
16. Security Architecture

Authentication:

Supabase Auth

Roles:

USER

MODERATOR

SCHOLAR

ADMIN
Privacy Principles

Store:

Preferences
Reflections
Progress

Do not expose:

Personal journals
Private reflections
User guidance history
17. Content Governance
Content Sources

Must be:

Authenticated
Traceable
Versioned
Every Record Requires
Source

Language

Version

Import Date
Content Workflow
Import

↓

Validation

↓

Approval

↓

Publication
18. Trust & Authenticity Framework

The most important RAFIQ principle.

Quran

Must originate from verified source datasets.

Hadith

Must display:

Collection

Reference

Grade
AI

Must never:

Invent verses
Invent hadith
Invent tafsir
Invent scholarly rulings
19. Deployment Architecture
Environments
Development

Staging

Production
CI/CD
GitHub

↓

Tests

↓

Build

↓

Deploy
Monitoring
API

Database

AI Usage

Errors
20. Monetization
Free Tier

Includes:

Daily Guidance
Quran
Hadith
Reflections
RAFIQ Plus

Includes:

Unlimited Companion
Advanced Journeys
Deep Study Mode
Semantic Search
Advanced Insights
21. Roadmap
Phase 1 — MVP

Launch:

Companion
Daily Guidance
Quran
Hadith
Themes
Reflection Journal
Phase 2

Add:

Journeys
Knowledge Explorer
Semantic Search
Deep Study Mode
Phase 3

Add:

Knowledge Graph Explorer
Scholar Review Layer
Multi-Language Expansion
Community Learning Features
22. Success Metrics
Product
DAU

WAU

Retention
Learning
Reading Consistency

Reflection Completion

Journey Completion
Guidance Quality
Saved Guidance

Positive Feedback

Return Rate
23. Organizational Architecture

As RAFIQ grows:

Founder

├── Product
├── Engineering
├── AI
├── Knowledge
├── Scholars
├── Design
└── Operations
24. Strategic Moat

Most Islamic apps have:

Content

Most AI apps have:

Conversation

RAFIQ combines:

Knowledge Graph

+

Authentic Sources

+

Retrieval AI

+

Personalized Guidance

+

Reflection System

This becomes RAFIQ's long-term competitive advantage.

25. The RAFIQ Constitution

Every future feature must pass five questions:

1. Does it bring users closer to Allah?
2. Does it improve understanding of Quran and Sunnah?
3. Does it encourage reflection?
4. Does it encourage action?
5. Does it preserve authenticity?

If the answer to any is "No", the feature should not be built.

RAFIQ North Star

The ultimate goal of RAFIQ is not engagement.

The goal is:

A Muslim opens RAFIQ,

finds authentic guidance,

reflects upon it,

acts upon it,

and becomes slightly closer to Allah today than yesterday.

Everything in RAFIQ — product, design, AI, knowledge, backend, and governance — exists to serve that mission.

Bismillah.
