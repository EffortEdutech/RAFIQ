<!--
Extracted from docs/RAFIQ_raw_info.md lines 1683-2152.
Extraction label: superseded product specification v1.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# I'll start with the executive section and core architecture. This is the foundation document from which all future PRD, UX, AI, Backend, and Figma documents will derive.

RAFIQ Product Specification V1

Version: 1.0

Status: Founder Draft

Project Name: Rafiq

Tagline:
Your Personal Islamic Companion

Alternative Brand Positioning:
Rafiq — Request For Quran

1. Executive Summary

Rafiq is an AI-powered personal Islamic companion designed to provide personalized daily guidance based on a user's current emotional, spiritual, and life circumstances.

Unlike traditional Islamic applications that primarily function as content libraries, Rafiq focuses on delivering the right guidance at the right moment.

The system understands the user's current state, identifies relevant Islamic themes, retrieves trusted Islamic content, and assembles a personalized guidance experience consisting of:

Quran
Translation
Tafsir
Hadith
Reflection
Daily Ibadah Actions

The objective is to help users develop a consistent relationship with Allah through small, meaningful daily interactions.

2. Product Vision

To become the world's most trusted personal Islamic companion.

3. Product Mission

Help Muslims strengthen their connection with Allah through personalized daily guidance powered by AI and trusted Islamic knowledge.

4. Product Philosophy

Rafiq is not:

A fatwa engine
A mufti replacement
A scholar replacement
A debate platform
A social network

Rafiq is:

A companion
A reminder
A reflection coach
A guidance assistant
A daily habit builder
5. Core User Problem

Modern Muslims face:

Information overload
Lack of consistency
Lack of personalization
Difficulty connecting Islamic knowledge to daily life

Most Islamic applications provide content.

Few provide context.

Rafiq bridges the gap between Islamic knowledge and personal circumstances.

6. Product Positioning

Traditional Islamic App

User searches for:

Quran
Hadith
Tafsir

Rafiq

User shares:

Feelings
Concerns
Challenges
Goals

Rafiq prepares:

Relevant Quran
Relevant Tafsir
Relevant Hadith
Relevant Reflection
Relevant Ibadah
7. Success Definition

Success is not measured by:

Time spent
Number of clicks
Content consumed

Success is measured by:

Daily engagement
Reflection completion
Ibadah completion
Spiritual consistency
User retention
8. Core User Journey

Daily Flow

Check In
↓
Understand Me
↓
Guide Me
↓
Reflect
↓
Act
↓
Grow

This flow represents the entire product.

9. User Personas

Persona 01

The Busy Professional

Needs:

Quick guidance
Time-efficient ibadah plans
Emotional support

Persona 02

The Young Muslim

Needs:

Learning
Understanding
Daily reminders

Persona 03

The Returning Muslim

Needs:

Gentle guidance
Non-judgmental support
Structured growth

Persona 04

The Consistent Worshipper

Needs:

Reflection
Deeper understanding
Long-term growth tracking
10. Product Principles

Principle 1

Daily Before Deep

Consistency is more important than volume.

Principle 2

Personal Before Generic

Guidance should feel relevant.

Principle 3

Action Before Information

Knowledge should lead to action.

Principle 4

Simplicity Before Features

The product should remain lightweight.

Principle 5

Trust Before Intelligence

Accuracy is more important than sophistication.

11. Product Scope V1

Included

Authentication
User Profiles
Daily Check-In
Mood Analysis
Theme Selection
Quran Guidance
Translation
Tafsir Summary
Hadith Recommendation
Reflection Questions
Daily Ibadah Suggestions
Journal
Progress Tracking

Excluded

Social Feed
Public Community
Fatwa Engine
Marketplace
Live Scholar Chat
Donations
Advertising
12. Core Experience

Every day the user receives:

Today's Theme

Examples:

Tawakkul
Sabr
Shukr
Rahmah
Tawbah

The system then delivers:

Quran
Translation
Tafsir
Hadith
Reflection
Action
Dua

All within a single focused experience.

13. Product Modules

Module A

Today's Guidance

Purpose:
Primary daily experience.

Priority:
Critical

Module B

Companion Chat

Purpose:
Conversation with Rafiq.

Priority:
Critical

Module C

Reflection Journal

Purpose:
Capture daily reflections.

Priority:
High

Module D

Progress Journey

Purpose:
Track spiritual growth.

Priority:
High

Module E

Profile & Preferences

Purpose:
Personalization.

Priority:
Medium

14. Rafiq AI Architecture

Rafiq AI is a Skill-Based System.

Rafiq AI
│
├── Mood Skill
├── Theme Skill
├── Quran Skill
├── Tafsir Skill
├── Hadith Skill
├── Reflection Skill
├── Ibadah Skill
├── Dua Skill
├── Journal Skill
└── Progress Skill

The AI orchestrates.

The knowledge base provides truth.

15. AI Safety Principles

The AI must never:

Issue fatwas
Declare halal or haram
Interpret dreams
Give legal rulings
Give medical advice
Replace qualified scholars

The AI may:

Recommend content
Explain context
Encourage reflection
Suggest ibadah
Guide daily habits
16. Knowledge Base Strategy

Content-First Architecture

The AI retrieves trusted content.

The AI does not invent religious content.

Knowledge Sources:

Quran
Translation
Tafsir
Hadith
Dua
Dhikr
Ibadah Library

All content is tagged by themes.

17. Theme Taxonomy V1

Core Themes

Tawakkul
Sabr
Shukr
Tawbah
Rahmah
Rizq
Hope
Gratitude
Patience
Forgiveness
Contentment
Trust
Fear of Allah
Love of Allah
Reflection

These themes become the backbone of the recommendation engine.

18. MVP Success Criteria

Within 90 Days

Goals:

Daily Active Users
7-Day Retention
Reflection Completion Rate
Ibadah Completion Rate
User Satisfaction

Primary KPI

Daily Guidance Completion

This measures whether users complete the daily journey.

19. Technical Stack

Frontend

React Native

Backend

NestJS

Database

Supabase PostgreSQL

Authentication

Supabase Auth

AI

OpenAI

Storage

Supabase Storage

Analytics

PostHog

Monitoring

Sentry

20. Long-Term Vision

Rafiq evolves into a complete Islamic Companion Platform.

Future Modules

Voice Companion
Ramadan Companion
Hajj Companion
Family Companion
Couples Companion
Kids Companion
Offline Guidance Packs

The foundation remains unchanged:

Understand Me
Guide Me
Reflect With Me
Grow With Me

Bismillah.

This Master Specification is sufficiently mature to begin the next document:

RAFIQ PRD V1 (Product Requirements Document), where we will break every module into screens, user stories, acceptance criteria, APIs, and development tasks suitable for implementation.

