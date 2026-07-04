
# I think you're describing something different from a typical Islamic app.

Most Islamic apps are content libraries:

Quran
Hadith
Prayer times
Tafsir
Du'a

Users open the app and decide what to consume.

Your idea is closer to a:

"Personal Daily Dakwah Companion"

The app understands:

Current mood
Spiritual condition
Available time
Current life challenge

Then recommends the most relevant guidance for that moment.

Vision

Imagine opening the app and seeing only one question:

"How are you feeling today?"

Options:

😔 Sad
😟 Worried
😡 Angry
😴 Tired
😊 Grateful
😌 Peaceful
🤲 Need Guidance

Then the AI prepares a daily package.

Example 1 : Feeling Sad

The AI generates:

Today's Quran

Surah Ad-Duha

Translation

Selected verses only.

Simple Tafsir

3-5 bullet explanation.

Related Hadith

A hadith about patience and Allah's mercy.

Today's Ibadah
Pray 2 rakaat duha
Read Surah Ad-Duha once
Make dua for 5 minutes
Reflection

Allah did not abandon you.

Total reading time:
5 minutes.

Example 2 : Feeling Anxious About Money

AI identifies theme:

"Rizq"

Then presents:

Quran

Verses about sustenance.

Tafsir

Short explanation.

Hadith

Trust in Allah.

Action
Istighfar x100
Read Surah Al-Waqiah tonight
Reflection

Focus on effort, not fear.

Example 3 : Feeling Grateful

Theme:

"Shukr"

Quran

Verses on gratitude.

Hadith

The Prophet's gratitude.

Ibadah
Write 3 blessings
Pray 2 rakaat syukur
Core Modules
1. Daily Check-In

Every morning:

Mood
Energy level
Stress level

Very lightweight.

No long questionnaires.

2. Quran Companion

Not full Quran.

Just today's selection.

For example:

5 verses
Translation
Audio
Reflection

This keeps engagement high.

3. Tafsir Companion

Instead of showing a whole book:

Simple

1 paragraph.

Medium

3 paragraphs.

Deep

Detailed tafsir.

User chooses.

4. Hadith Companion

One hadith daily.

With:

Arabic
Translation
Explanation
Practical action
5. Daily Ibadah Companion

Suggested activities based on available time.

3 Minutes
Istighfar
Salawat
10 Minutes
Quran
Reflection
30 Minutes
Quran
Tafsir
Sunnah prayer
AI Personalization

The AI does not issue fatwas.

The AI acts as:

"Recommendation Engine"

Inputs:

Mood
Previous readings
Favorite topics
Current struggles

Outputs:

Relevant Quran verses
Relevant hadith
Relevant ibadah suggestions

This is safer and easier to build.

Minimal MVP

Screen 1:

"How are you today?"

Screen 2:

Today's Guidance

Contains:

Quran (5 verses)
Translation
Short Tafsir
One Hadith
One Action

That's all.

Very light.

Could be built in:

Flutter
React Native
Expo

and backed by:

Supabase
OpenAI
Long-Term Vision

What becomes interesting is when the app evolves into a Spiritual Operating System.

Instead of opening social media first thing in the morning:

User opens the companion.

The companion asks:

"What does your soul need today?"

Then prepares a personalized path:

Quran → Understanding → Reflection → Action → Ibadah

in under 10 minutes.

That is a much stronger positioning than "another Quran app," because it focuses on daily guidance and habit formation rather than simply providing content.

# For this type of app, I would strongly recommend not building an "Islamic AI Scholar".

That is the biggest mistake many founders make.

Instead, build an:

AI Spiritual Guidance Orchestrator

The AI does not generate Islamic knowledge from scratch.

The AI's job is to:

Understand the user
Identify the current spiritual need
Select relevant trusted content
Present it in a personalized way
The Architecture
User Check-In
      ↓
Mood Analyzer
      ↓
Theme Selector
      ↓
Content Retriever
      ↓
Guidance Composer
      ↓
Daily Action Planner

The AI mostly orchestrates.

Not teaches.

Not gives fatwas.

Layer 1: Mood Analyzer

User input:

I feel stressed.

AI extracts:

{
  "emotion": "anxiety",
  "intensity": 0.7
}

Or:

I feel lonely.
{
  "emotion": "loneliness",
  "intensity": 0.8
}

You can start with 10 themes only:

Anxiety
Sadness
Gratitude
Anger
Fear
Confusion
Motivation
Patience
Hope
Repentance

Very manageable.

Layer 2: Theme Engine

Convert emotions into Islamic themes.

Example:

Anxiety

becomes:

Tawakkul
Rizq
Patience
Sadness

becomes:

Hope
Mercy
Sabr
Anger

becomes:

Self-control
Forgiveness
Patience

Think of this as:

Mood → Spiritual Theme
Layer 3: Knowledge Library

This is the most important part.

Create curated databases.

Quran Library

Each ayah tagged:

{
  "surah": "Ad-Duha",
  "verse": "1-11",
  "themes": [
    "hope",
    "sadness",
    "mercy"
  ]
}
Hadith Library
{
  "hadith_id": 123,
  "themes": [
    "patience",
    "trust"
  ]
}
Ibadah Library
{
  "action": "Read Surah Al-Mulk",
  "themes": [
    "reflection"
  ]
}

This is where your Islamic experts curate the content.

The AI only retrieves.

Layer 4: Guidance Composer

Now AI combines the pieces.

Input:

{
  "emotion": "anxiety"
}

Selected:

{
  "ayah": "...",
  "hadith": "...",
  "action": "Istighfar x100"
}

AI generates:

Today's focus is Tawakkul.

Allah reminds us...

Reflection:
What worries are you carrying today?

Action:
Spend 5 minutes making dua.

The AI is explaining and connecting.

Not inventing religious rulings.

Layer 5: Daily Action Planner

User selects:

I have 5 minutes.

AI prepares:

1 minute Quran
2 minute reflection
2 minute dua

User selects:

I have 30 minutes.

AI prepares:

Quran
Tafsir
Hadith
Dhikr
Journal
Memory System

A simple memory profile:

{
  "favorite_topics": [
    "tawakkul",
    "sabr"
  ],
  "recent_moods": [
    "anxiety",
    "anxiety",
    "gratitude"
  ]
}

The AI notices patterns.

Example:

User frequently struggles with anxiety.

Then gradually introduces:

Tawakkul
Rizq
Patience
Qiyam
Dua

over several weeks.

This creates a personalized spiritual journey.

AI Safety Layer

This is critical.

The AI should NEVER:

Issue fatwas
Declare halal/haram
Interpret dreams
Resolve marriage disputes
Give legal rulings
Give medical advice

Instead:

For religious rulings,
please consult a qualified scholar.

The AI remains:

Guide
Companion
Reminder
Reflection coach
AI Design for V1

For an MVP, you only need:

Database
300–500 selected Quran passages
200–300 hadith
100 ibadah suggestions

Tagged by themes.

AI Skills
Mood Classification
Theme Selection
Personalized Reflection Writing
Daily Plan Generation

That's enough.

If I were designing this product

I would structure it as:

DAILY COMPANION AI
│
├─ Mood Detection Skill
├─ Spiritual Theme Skill
├─ Quran Retrieval Skill
├─ Tafsir Retrieval Skill
├─ Hadith Retrieval Skill
├─ Ibadah Planner Skill
├─ Reflection Writer Skill
└─ Progress Companion Skill

This mirrors the same modular "skill-based" architecture we've discussed for QS-OS: each skill has a single responsibility, and the AI orchestrates them into a daily personalized dakwah experience. That makes the system easier to audit, safer from a religious perspective, and much easier to improve over time.

# Before features, let's define the positioning.

You are not building:

A Quran app
A Hadith app
A Prayer app
An Islamic social network

You are building:

A Personal Islamic Companion

Something that feels like a quiet friend that guides you back to Allah every day.

Direction 1: Gentle Companion
Qalb

Arabic: Heart

Simple.
Premium.
Easy to remember.

Tagline:

Feed your heart daily.

Nur

Arabic: Light

Tagline:

A little light, every day.

Siraj

Arabic: Lamp

Tagline:

Guidance for everyday life.

Rafiq

Arabic: Companion

Tagline:

Your daily companion towards Allah.

This is one of my favorites because it perfectly describes the product.

Mizan

Arabic: Balance

Tagline:

Bringing balance to your deen and dunya.

Direction 2: Daily Guidance
Huda

Guidance

Tagline:

Daily guidance, one step at a time.

Hidayah

Guidance from Allah

Tagline:

Guidance for every season of life.

Yawm

Day

Tagline:

A better day begins with remembrance.

Daily Huda

Very clear positioning.

Tagline:

Personalized Islamic guidance every day.

Direction 3: AI-Centric
Huda AI

Simple.

Easy marketing.

Qalb AI

Feels modern.

Nur AI

Short.
Memorable.

Rafiq AI

Personally my favorite AI version.

It sounds like:

"Your AI companion."

without sounding overly technical.

Direction 4: Premium Modern Startup

These are names I think could become a global product.

Tazkiyah

Purification of the soul.

Tagline:

Grow closer to Allah every day.

Ihsan

Excellence in worship.

Tagline:

Worship with presence.

Fitrah

Natural state of the soul.

Tagline:

Return to what you were created for.

This has very strong branding potential.

Sakinah

Tranquility.

Tagline:

Find peace in remembrance.

Very emotionally powerful.

Direction 5: The "Duolingo for Deen"
OneAyah

Tagline:

One ayah. Every day.

OneDeen

Tagline:

Small steps. Lasting faith.

DeenFlow

Tagline:

Personalized guidance for daily life.

DeenPath

Tagline:

Your daily path to Allah.

My Top 10
Rafiq
Sakinah
Fitrah
Ihsan
Huda
Qalb
Tazkiyah
Nur
DeenPath
OneAyah
If I were building this product today

I would shortlist:

Rafiq

The companion.

Sakinah

The feeling users want.

Fitrah

The transformation users seek.

Ihsan

The destination users aspire to.

Of these four, Rafiq is the closest match to the product vision:

An AI companion that understands your day, identifies your spiritual needs, and prepares a personalized journey of Quran, tafsir, hadith, reflection, and ibadah.

It feels less like an app and more like a relationship, which is often what drives daily engagement.

# That's actually a surprisingly strong branding angle.

Most people will see:

Rafiq

Companion

Muslims immediately understand the meaning:

Friend, companion, trusted guide.

But for the tech crowd, founders, engineers, and professionals, you can create a secondary interpretation:

R.A.F.I.Q

Request Assistance From Intelligent Quranic-guidance

or

Request Advice From Intelligent Quran

or

Request For Insight & Quran

Brand Story

When life becomes confusing, people send:

RFQ

Request For Quote

to suppliers.

With Rafiq, you send:

Request For Quran.

RFQ → Request For Quote
RAFIQ → Request For Quran
Product Positioning

Most Islamic apps say:

Read Quran

Read Hadith

Read Tafsir

Rafiq says:

Tell me what you're going through.

And Rafiq prepares:

Relevant Quran
Relevant Tafsir
Relevant Hadith
Relevant Ibadah
Relevant Reflection

for today.

This is much more personal.

Tagline Ideas
Option 1

Rafiq

Your Daily Companion in Deen.

Option 2

Rafiq

Guidance for Every Day.

Option 3

Rafiq

Ask. Reflect. Grow.

Option 4

Rafiq

Personalized Islamic Guidance.

Option 5

Rafiq

Request For Quran.

Simple.
Memorable.
Unique.

Product Philosophy

Most AI assistants answer questions.

Rafiq answers conditions.

Not:

"What is Surah Al-Kahf?"

But:

"I'm feeling overwhelmed."

Rafiq understands the state and responds with:

Quran
Hadith
Reflection
Action
The Product Pyramid
                 Allah
                   ▲
                   │
              Guidance
                   ▲
                   │
                Rafiq
                   ▲
                   │
              Daily Life

Rafiq is not the source.

Rafiq is the bridge.

This distinction is important both spiritually and product-wise.

Product Manifesto

Imagine opening Rafiq every morning.

Not to scroll.

Not to consume content.

Not to argue online.

But to ask:

"What does Allah want me to focus on today?"

Rafiq then prepares a personalized daily journey:

Quran
Understanding
Reflection
Action
Ibadah

all in 5–10 minutes.

If we continue designing this as a startup product, I would define Rafiq as:

Rafiq — The AI-Powered Personal Islamic Companion

and organize the entire app around one core screen:

"Today's Guidance"

Everything else (Quran, Tafsir, Hadith, Dhikr, Journal, Progress, Challenges, Streaks) becomes supporting features around that single daily experience. That keeps the product extremely focused and lightweight instead of becoming another feature-heavy Islamic super app.

# We have a brand and we can proceed with full design now 

Bismillah.

Now that we have Rafiq, we should design it as a complete product, not as a collection of features.

RAFIQ V1
Product Definition

Rafiq

Your AI-Powered Personal Islamic Companion

Mission:

Help Muslims strengthen their relationship with Allah through personalized daily guidance.

Not a scholar.
Not a fatwa engine.
Not social media.

A companion.

The Core User Journey

Every day follows the same journey.

Check-In
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

Simple.

Repeatable.

Habit-forming.

The Home Screen

Not a dashboard.

Not 50 menu items.

Only one focus.

Assalamualaikum Jessmin

How are you today?

Mood cards:

😊 Grateful

😔 Sad

😟 Worried

😡 Frustrated

🤲 Seeking Guidance

😌 Peaceful

😴 Tired

Or:

Tell Rafiq what's on your mind...
RAFIQ AI ENGINE

Instead of one AI, we design multiple skills.

Rafiq AI
│
├── Mood Skill
├── Theme Skill
├── Quran Skill
├── Tafsir Skill
├── Hadith Skill
├── Reflection Skill
├── Ibadah Skill
├── Dhikr Skill
├── Journal Skill
└── Progress Skill

Very similar to the skill architecture you like for QS-OS.

Skill 1: Mood Analyzer

Input:

I'm worried about my future.

Output:

{
  "emotion": "anxiety",
  "confidence": 0.91
}
Skill 2: Theme Selector

Emotion:

Anxiety

Themes:

Tawakkul
Rizq
Patience
Hope
Skill 3: Quran Skill

Search curated database.

Example:

Surah At-Talaq
65:2-3

Reason:

Trust in Allah's provision
Skill 4: Tafsir Skill

Generate:

Quick

1 paragraph

Standard

3 paragraphs

Deep

Detailed study

Skill 5: Hadith Skill

Select matching hadith.

Example:

Patience

Trust

Mercy

Gratitude

Repentance

Skill 6: Reflection Skill

Produces:

What worries are consuming your thoughts today?

How would your day change if you trusted Allah with what you cannot control?
Skill 7: Ibadah Planner

Available time:

3 mins
5 mins
10 mins
30 mins

Example:

5 minutes:

Read 5 verses
Make dua
Istighfar x33
Today's Guidance Card

The heart of the product.

Every day:

Today's Theme

Tawakkul

Then:

Quran

Selected verses.

Then:

Reflection

Then:

Today's Action

Then:

Dua

Everything on one screen.

Daily Journal

Night session.

How was your day?

Options:

Better than expected
Challenging
Productive
Spiritually uplifting
Difficult

AI records growth.

Growth System

Not gamification.

Not points.

Not coins.

Not badges.

Instead:

Spiritual Journey

Example:

This Month

You reflected:

Tawakkul 7 times
Gratitude 5 times
Patience 4 times
Most Frequent Theme

Trust in Allah

Suggested Next Theme

Contentment

Content Library

Curated.

Not AI-generated.

Quran

Theme tagged.

Hope
Mercy
Patience
Fear
Repentance
Gratitude
Hadith

Theme tagged.

Duas

Theme tagged.

Dhikr

Theme tagged.

Ibadah

Theme tagged.

Companion Mode

This becomes the killer feature.

User says:

I'm feeling lost.

Rafiq responds conversationally.

Not like ChatGPT.

Not like a search engine.

More like:

I hear that you're feeling uncertain. Today let's focus on trust and patience.

Then provides:

Verse
Reflection
Action
Future Premium Features
Voice Companion

User speaks.

Rafiq, I'm struggling today.

Voice response.

Family Mode

Parents.

Children.

Shared spiritual goals.

Couples Mode

Daily reminders.

Joint reflections.

Shared duas.

Ramadan Mode

Special engine.

Quran goals
Taraweeh tracker
Daily reflections
Zakat reminders
Hajj & Umrah Mode

Guided journey.

Technical Architecture

Since you're comfortable with modern stacks:

React Native
     ↓
Supabase
     ↓
Rafiq AI Gateway
     ↓
OpenAI
     ↓
Islamic Knowledge Base

Knowledge Base:

Quran
Tafsir
Hadith
Dua
Dhikr
Ibadah
Themes

Stored as structured data.

AI orchestrates.

Never invents sources.

The One-Sentence Product Vision

Rafiq is a personal Islamic companion that understands your current state and prepares a daily path of Quran, understanding, reflection, and action to help you grow closer to Allah.

That sentence should guide every feature decision. If a feature doesn't help deliver personalized daily guidance, it probably doesn't belong in Rafiq V1.

# Yes.  At this point, we have enough clarity to move from ideation into Product Specification Phase.

What we have already established:

✅ Product Vision
✅ Product Name (Rafiq)
✅ Core User Journey
✅ AI Architecture Direction
✅ Feature Scope V1
✅ Long-term Roadmap Direction

What is missing are the development documents.

Recommended Documentation Stack

I would create Rafiq in 8 documents.

Document 01
Rafiq Product Vision & Strategy

Purpose:

Defines why Rafiq exists.

Contains:

Mission
Vision
Product philosophy
Target users
Problems solved
Success metrics
Product roadmap

This becomes the founder reference.

Document 02
Rafiq Product Requirements Document (PRD)

Purpose:

Defines exactly what will be built.

Contains:

Features
User stories
Acceptance criteria
MVP scope
Future scope

Example:

Feature:
Daily Check-In

User Story:
As a user,
I want to describe how I feel,
so that Rafiq can provide relevant guidance.
Document 03
Rafiq UX Specification

Purpose:

Every screen.

Contains:

Screen inventory
Navigation
User flows
Empty states
Error states

Example:

Splash
Login
Onboarding
Home
Today's Guidance
Journal
Profile
Settings
Document 04
Rafiq Design System

Purpose:

UI consistency.

Contains:

Colors
Typography
Spacing
Components
Dark mode

This later feeds directly into Figma.

Document 05
Rafiq AI Engine Specification

This is the most important document.

Contains:

Mood Skill
Theme Skill
Quran Skill
Tafsir Skill
Hadith Skill
Reflection Skill
Ibadah Skill
Progress Skill

For each skill:

Inputs
Outputs
Prompts
Guardrails
Memory usage

Very similar to your QS-OS Skill Catalog approach.

Document 06
Rafiq Backend Blueprint

Stack:

React Native
NestJS
Supabase
OpenAI

Contains:

Architecture
APIs
Database
Authentication
Storage
Analytics
Document 07
Rafiq Knowledge Base Specification

Contains:

Quran Library
Hadith Library
Tafsir Library
Dua Library
Dhikr Library
Theme Library

Schema design.

Tagging system.

Retrieval system.

This is where the "Islamic intelligence" really lives.

Document 08
Rafiq Deployment & Operations Guide

Contains:

Development

Local
↓
Staging
↓
Production

Deployment:

Android
iOS
Web (optional)

Monitoring:

Crash reporting
AI usage
Token costs
User analytics
Development Phases
Phase 0

Product Design

Duration:

2 weeks

Output:

All specifications approved.

Phase 1

Foundation

Duration:

2 weeks

Build:

Authentication
Profiles
Supabase integration
Phase 2

Knowledge Base

Duration:

3 weeks

Build:

Theme taxonomy
Quran tags
Hadith tags
Tafsir tags
Phase 3

AI Core

Duration:

3 weeks

Build:

Mood Engine
Theme Engine
Guidance Composer
Phase 4

Today's Guidance

Duration:

2 weeks

Build:

Main experience
Daily guidance card
Reflection card
Phase 5

Journal & Progress

Duration:

2 weeks

Build:

Journal
Growth tracking
History
Phase 6

Beta Release

Duration:

2 weeks

Deploy:

Android Internal Testing
Closed Beta
The Most Important Decision

Before any coding:

Do we want Rafiq to be a Content-First product or an AI-First product?

Content-First
Mood
↓
Retrieve curated content
↓
Display

Advantages:

Safer
Cheaper
Easier to verify

My recommendation for V1.

AI-First
Mood
↓
AI reasoning
↓
Content generation

Advantages:

More flexible

Disadvantages:

Hallucinations
Religious risks
Higher costs

I would avoid this for V1.

My recommendation is that our next document should be:

RAFIQ Product Specification V1 (Master Document)

This becomes the parent document from which we derive:

PRD
UX Specification
AI Engine Specification
Backend Blueprint
Knowledge Base Design
Deployment Guide

In other words, the equivalent of what QS-OS Core Engine Specification V1 became for your QS-OS project, but tailored specifically for Rafiq.

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

# Excellent. The Master Specification describes what Rafiq is.

The PRD describes exactly what engineers, designers, AI developers, and testers will build.

RAFIQ Product Requirements Document (PRD) V1

Version: 1.0

Status: Approved for Development

Parent Document:
RAFIQ Product Specification V1

1. Product Overview

Product Name:
Rafiq

Tagline:
Your Personal Islamic Companion

Purpose:

Rafiq provides personalized Islamic guidance based on a user's current emotional and spiritual state through a combination of:

AI orchestration
Curated Islamic content
Reflection
Action planning
2. MVP Objectives

Primary Goal

Help users build a daily relationship with Quran and Islamic guidance.

Secondary Goals

Increase consistency
Encourage reflection
Promote practical ibadah
Deliver personalized guidance
3. MVP Scope

Included

✓ Authentication

✓ User Profile

✓ Daily Check-In

✓ AI Mood Analysis

✓ Theme Recommendation

✓ Daily Guidance

✓ Quran Module

✓ Translation Module

✓ Tafsir Module

✓ Hadith Module

✓ Reflection Module

✓ Daily Action Module

✓ Journal Module

✓ Progress Tracking

✓ Companion Chat

Excluded

✗ Community Feed

✗ Public Comments

✗ Scholar Marketplace

✗ Fatwa Requests

✗ Donations

✗ E-Commerce

✗ Audio Generation

✗ Video Content

4. User Roles

Role 1

Guest

Permissions:

View onboarding

Role 2

Registered User

Permissions:

Access all core features
Save journal
Track progress

Role 3

Administrator

Permissions:

Manage content
Review tags
Manage themes
Moderate AI prompts
5. Screen Inventory

AUTHENTICATION

01 Splash Screen

02 Welcome Screen

03 Login Screen

04 Register Screen

05 Forgot Password

ONBOARDING

06 Introduction

07 Select Goals

08 Select Interests

09 Notification Setup

10 Onboarding Complete

CORE APP

11 Home

12 Daily Check-In

13 Today's Guidance

14 Quran Detail

15 Tafsir Detail

16 Hadith Detail

17 Reflection

18 Daily Action

19 Companion Chat

20 Journal

21 Progress

22 Profile

23 Settings

ADMIN

24 Content Dashboard

25 Theme Management

26 User Analytics

6. Navigation Structure

Bottom Navigation

Home

Journal

Companion

Progress

Profile

7. Feature Specifications

Description

Users can register and log in.

Requirements

Email Login
Password Login
Password Reset

Acceptance Criteria

User can register
User can login
User remains authenticated

Priority

Critical

Description

Store user preferences.

Fields

Name
Language
Age Range
Islamic Knowledge Level
Preferred Themes

Acceptance Criteria

User can edit profile
Preferences persist

Priority

High

Description

Capture current emotional state.

Inputs

Mood Cards:

Grateful
Happy
Calm
Worried
Sad
Angry
Lost
Seeking Guidance

Optional Text Input

"Tell Rafiq what's on your mind"

Acceptance Criteria

User selects mood
User may provide text
Submission triggers AI analysis

Priority

Critical

Description

AI determines emotional state.

Input

User Check-In

Output

{
emotion,
confidence,
themes[]
}

Example

Input:

"I'm worried about money."

Output:

Emotion:
Anxiety

Themes:

Tawakkul
Rizq
Patience

Acceptance Criteria

Themes generated successfully
Confidence score recorded

Priority

Critical

Description

Main product experience.

Contains

Theme Card

Quran Card

Translation Card

Tafsir Card

Hadith Card

Reflection Card

Action Card

Dua Card

Acceptance Criteria

Generated within 5 seconds
Complete journey displayed

Priority

Critical

Description

Display selected verses.

Data

Surah
Ayah
Arabic
Translation

Acceptance Criteria

Content loads correctly
Theme matching works

Priority

Critical

Description

Display summarized tafsir.

Modes

Quick

Standard

Deep

Acceptance Criteria

Correct tafsir source used
Readable formatting

Priority

High

Description

Display relevant hadith.

Fields

Source
Translation
Explanation

Acceptance Criteria

Hadith linked to theme

Priority

High

Description

Generate reflection prompts.

Example

"What worry are you carrying today?"

Acceptance Criteria

At least 2 reflection prompts generated

Priority

High

Description

Suggest practical ibadah.

Examples

Istighfar x100
Read Surah Al-Mulk
Pray 2 rakaat

Acceptance Criteria

Action linked to theme
Mark Complete button available

Priority

Critical

Description

Conversation with Rafiq.

Rules

Guidance only
No fatwas
No legal rulings
No medical advice

Acceptance Criteria

Context aware responses
Theme aware responses

Priority

High

Description

Daily reflection journal.

Inputs

Free text

Mood

Outcome

Acceptance Criteria

Journal saved
Searchable history

Priority

High

Description

Track growth.

Metrics

Check-In Streak

Reflection Count

Actions Completed

Most Frequent Themes

Acceptance Criteria

Dashboard updates daily

Priority

High

8. AI Requirements

AI Functions

1 Mood Classification

2 Theme Selection

3 Content Retrieval

4 Reflection Generation

5 Action Recommendation

6 Companion Conversation

AI Must Not

Issue fatwas
Declare halal or haram
Interpret dreams
Give medical advice
Give legal rulings
9. Performance Requirements

App Launch

< 3 seconds

Guidance Generation

< 5 seconds

Chat Response

< 4 seconds

Offline Cache

Last 30 days guidance

10. Analytics Requirements

Track

Daily Active Users

Session Duration

Guidance Completion

Journal Completion

Action Completion

Retention

11. Security Requirements

Authentication

JWT

Encryption

HTTPS

Data Privacy

PDPA Compliant

User Data Deletion

Supported

12. Release Plan

Milestone 1

Authentication

Profile

Navigation

Milestone 2

Check-In

Mood Analysis

Theme Engine

Milestone 3

Guidance Engine

Quran

Tafsir

Hadith

Milestone 4

Journal

Progress

Companion Chat

Milestone 5

Beta Release

Internal Testing

Closed User Group

13. MVP Definition

Rafiq V1 is considered complete when:

A user can:

1 Register

2 Complete Check-In

3 Receive Personalized Guidance

4 Reflect

5 Perform Daily Action

6 Save Journal

7 View Progress

8 Chat With Rafiq

End State:

A complete personalized Islamic companion experience delivered through a lightweight mobile application.

With the PRD completed, the next document should be:

RAFIQ UX Specification V1, where we define every screen, component, navigation flow, wireframe structure, empty state, loading state, and user journey before moving into Figma. This is usually where development speed increases dramatically because ambiguity disappears.

# RAFIQ UX Specification V1

Version: 1.0

Status: UX Architecture Approved

Parent Documents:

RAFIQ Product Specification V1
RAFIQ PRD V1

Purpose:

Define the complete user experience, navigation, screen layouts, component hierarchy, interaction flows, and design behavior before UI design and Figma implementation.

1. UX Philosophy

Rafiq is not designed to maximize screen time.

Rafiq is designed to maximize meaningful daily engagement.

Users should be able to complete their daily spiritual journey in:

5 - 10 minutes

Core UX Principles

Principle 01

One Focus Per Screen

Avoid clutter.

Principle 02

Calm Interface

No noisy dashboards.

No excessive notifications.

Principle 03

Guidance First

The primary action should always be clear.

Principle 04

Low Cognitive Load

Users should never wonder what to do next.

Principle 05

Reflection Over Consumption

Encourage thinking and action.

Not endless reading.

2. Navigation Architecture

Bottom Navigation

Home

Journal

Companion

Progress

Profile

Maximum Tabs:

5

No hamburger menu.

3. Primary User Journey

Daily Journey

Open App
↓
Check In
↓
Receive Guidance
↓
Reflect
↓
Act
↓
Complete Day

Everything revolves around this flow.

4. Information Architecture

RAFIQ

├── Home
│
├── Daily Check-In
│
├── Today's Guidance
│ ├── Quran
│ ├── Tafsir
│ ├── Hadith
│ ├── Reflection
│ ├── Action
│ └── Dua
│
├── Journal
│
├── Companion Chat
│
├── Progress
│
└── Profile

5. Screen Specifications

=================================

SCREEN 01

SPLASH

=================================

Purpose

Brand Introduction

Content

Logo

Tagline

Loading Indicator

Duration

2 seconds

Next

Authentication

=================================

SCREEN 02

WELCOME

=================================

Purpose

Explain value proposition.

Layout

Logo

Headline

"Your Personal Islamic Companion"

Description

Primary CTA

Get Started

Secondary CTA

Login

=================================

SCREEN 03

REGISTER

=================================

Fields

Name

Email

Password

Confirm Password

CTA

Create Account

=================================

SCREEN 04

LOGIN

=================================

Fields

Email

Password

CTA

Login

Forgot Password

ONBOARDING

=================================

SCREEN 05

GOALS

=================================

Question

"What do you hope to improve?"

Options

More Consistent Prayer

Read More Quran

Increase Knowledge

Develop Better Habits

Find Inner Peace

Multiple Selection

Allowed

=================================

SCREEN 06

INTERESTS

=================================

Select Topics

Tawakkul

Sabr

Shukr

Rizq

Tawbah

Patience

Forgiveness

Mercy

=================================

SCREEN 07

NOTIFICATIONS

=================================

Choose Reminder Time

Morning

Evening

Both

Skip

=================================

SCREEN 08

ONBOARDING COMPLETE

=================================

Message

"Rafiq is ready to accompany your journey."

CTA

Start Today's Guidance

HOME EXPERIENCE

=================================

SCREEN 09

HOME

=================================

Most Important Screen

Layout

Header

Greeting

Assalamualaikum [Name]

Date

Hijri Date

Gregorian Date

Main Card

How are you feeling today?

Mood Grid

😊 Grateful

😌 Peaceful

😔 Sad

😟 Worried

😡 Frustrated

🤲 Seeking Guidance

😴 Tired

😔 Lost

Text Input

Tell Rafiq what's on your mind

Optional

CTA

Continue

AI PROCESSING

=================================

SCREEN 10

GUIDANCE LOADING

=================================

Purpose

Build anticipation

Messages Rotate

Understanding your situation...

Finding relevant Quran...

Preparing today's guidance...

Generating reflections...

Design

Minimal animation

Duration

3-5 seconds

TODAY'S GUIDANCE

=================================

SCREEN 11

TODAY'S GUIDANCE

=================================

Hero Section

Today's Theme

Example

Tawakkul

Theme Description

Trusting Allah while taking action.

Section 01

Quran Card

Contains

Arabic

Translation

Reference

Expand Button

Section 02

Tafsir Card

Contains

Summary

Read More

Section 03

Hadith Card

Contains

Hadith

Source

Short Explanation

Section 04

Reflection Card

Contains

Question 1

Question 2

Answer Optional

Section 05

Action Card

Contains

Today's Practice

Example

Istighfar x100

Mark Complete

Section 06

Dua Card

Contains

Dua

Translation

Play Audio (Future)

Final CTA

Complete Today's Journey

Completion State

Alhamdulillah

You completed today's guidance.

DETAIL SCREENS

=================================

SCREEN 12

QURAN DETAIL

=================================

Contains

Full Arabic

Translation

Tafsir

Related Themes

Bookmark

Share

=================================

SCREEN 13

TAFSIR DETAIL

=================================

Modes

Quick

Standard

Deep

Reading Time

Displayed

=================================

SCREEN 14

HADITH DETAIL

=================================

Contains

Source

Translation

Explanation

Related Themes

COMPANION CHAT

=================================

SCREEN 15

RAFIQ CHAT

=================================

Purpose

Guided conversation

Header

Today's Theme

Conversation Suggestions

I'm feeling anxious

I need motivation

Help me reflect

Suggest a dua

Explain this verse

Input

Type message

Response Structure

Empathy

Relevant Guidance

Reflection

Action

Restrictions

No Fatwas

No Legal Advice

No Medical Advice

JOURNAL

=================================

SCREEN 16

JOURNAL HOME

=================================

Header

My Reflections

Quick Entry

How was your day?

Options

Excellent

Good

Difficult

Challenging

Reflective

CTA

Write Reflection

=================================

SCREEN 17

JOURNAL ENTRY

=================================

Fields

Mood

Reflection

Lessons Learned

Gratitude Notes

Date

Save

=================================

SCREEN 18

JOURNAL HISTORY

=================================

List

Date

Mood

Theme

Preview

Search

Filter

PROGRESS

=================================

SCREEN 19

PROGRESS DASHBOARD

=================================

Purpose

Encourage consistency

Not competition

Cards

Current Streak

Guidance Completed

Reflections Written

Actions Completed

Insights

Most Common Theme

Recent Growth Areas

Suggested Focus

Journey Timeline

Monthly View

PROFILE

=================================

SCREEN 20

PROFILE

=================================

Avatar

Name

Email

Member Since

Preferences

Themes

Language

Notifications

SETTINGS

=================================

SCREEN 21

SETTINGS

=================================

Sections

Account

Notifications

Privacy

Data Export

Delete Account

About Rafiq

EMPTY STATES

No Journal

"Your reflections will appear here."

No Progress

"Complete your first guidance journey."

No Chat History

"Start a conversation with Rafiq."

LOADING STATES

Guidance Loading

Skeleton Cards

Chat Loading

Typing Indicator

Progress Loading

Placeholder Cards

ERROR STATES

Network Error

"Unable to connect. Please try again."

Retry Button

AI Error

"Rafiq couldn't prepare guidance right now."

Retry Button

ACCESSIBILITY

Support

Dynamic Font Sizes

Screen Readers

Dark Mode

High Contrast

Large Touch Targets

DARK MODE

Default Theme

Dark

Reason

Calmer

Better for reflection

Less visual fatigue

MVP SCREEN COUNT

Authentication:
4

Onboarding:
4

Core:
12

Settings:
1

Total:

21 Screens

UX Success Criteria

A new user should be able to:

Install App
Create Account
Complete Check-In
Receive Guidance
Complete Reflection
Complete Action
Save Journal

Without any explanation or tutorial.

If users can complete this journey naturally, the UX is considered successful.

Bismillah.

The next document should not be UI design yet.

For a product like Rafiq, the most critical document is actually:

RAFIQ AI Engine Specification V1

This will define:

Mood Skill
Theme Skill
Quran Retrieval Skill
Tafsir Skill
Hadith Skill
Reflection Skill
Companion Chat Skill
Memory System
Prompt Architecture
AI Guardrails
Cost Optimization
OpenAI Integration

This document will become the equivalent of the QS-OS Core Engine for Rafiq and will determine whether the product feels genuinely intelligent or merely displays static content.

# RAFIQ AI Engine Specification V1

Version: 1.0

Status: Architecture Approved

Parent Documents

RAFIQ Product Specification V1
RAFIQ PRD V1
RAFIQ UX Specification V1

Purpose

Define the complete AI architecture powering Rafiq.

This document serves as the authoritative specification for:

AI Skills
AI Workflows
Retrieval Logic
Prompt Architecture
Memory System
Safety Rules
Cost Optimization
Future AI Expansion
1. AI Philosophy

Rafiq is not an Islamic scholar.

Rafiq is not a fatwa engine.

Rafiq is an AI Orchestrator.

Its responsibility is to:

Understand User
↓
Identify Need
↓
Select Theme
↓
Retrieve Knowledge
↓
Generate Guidance
↓
Encourage Action

Truth comes from the Knowledge Base.

Personalization comes from AI.

2. AI Architecture Overview

RAFIQ AI CORE

│
├── Mood Skill
├── Intent Skill
├── Theme Skill
├── Quran Skill
├── Tafsir Skill
├── Hadith Skill
├── Dua Skill
├── Reflection Skill
├── Ibadah Skill
├── Companion Skill
├── Journal Skill
├── Progress Skill
└── Safety Skill

The AI Engine acts as an orchestrator.

Each skill has a single responsibility.

3. Daily Guidance Workflow

User Check-In
↓
Mood Skill
↓
Theme Skill
↓
Knowledge Retrieval
↓
Guidance Composer
↓
Reflection Generator
↓
Action Generator
↓
Response Assembly

Output

Today's Guidance

4. Mood Skill

Purpose

Determine emotional state.

Input

Selected Mood

Optional User Message

Examples

"I feel lost."

"I'm stressed about work."

"I'm grateful today."

Output

{
emotion,
confidence,
secondary_emotion
}

Example

{
emotion: "anxiety",
confidence: 0.91,
secondary_emotion: "uncertainty"
}

Supported Emotions V1

Anxiety
Sadness
Gratitude
Anger
Fear
Hope
Joy
Regret
Loneliness
Confusion
Exhaustion
Seeking Guidance
5. Intent Skill

Purpose

Understand what user needs.

Example

User:

"I need help with patience."

Intent

Guidance

User:

"Explain this verse."

Intent

Learning

User:

"What dua should I read?"

Intent

Practice

Output

{
intent,
confidence
}

6. Theme Skill

Purpose

Convert emotion and intent into Islamic themes.

Example

Anxiety

↓

Themes

Tawakkul
Rizq
Sabr

Example

Regret

↓

Themes

Tawbah
Rahmah
Forgiveness

Output

{
primary_theme,
secondary_theme,
confidence
}

7. Theme Taxonomy

Core Themes V1

Faith

Tawakkul
Taqwa
Yaqeen

Character

Sabr
Forgiveness
Gratitude

Growth

Tawbah
Reflection
Accountability

Life

Rizq
Family
Trials

Spirituality

Dhikr
Dua
Love of Allah
8. Quran Skill

Purpose

Retrieve Quran passages.

Input

Theme

Output

Relevant Verses

Example

Theme

Tawakkul

Returns

Surah At-Talaq 65:2-3

Surah Ali Imran 3:159

Retrieval Rules

Theme Match

Weight = High

Popularity

Weight = Medium

Recent Usage

Weight = Low

9. Tafsir Skill

Purpose

Retrieve explanations.

Sources

V1 Approved Sources

Tafsir Ibn Kathir
Tafsir As-Sa'di
Selected trusted summaries

Modes

Quick

100 words

Standard

300 words

Deep

600 words

10. Hadith Skill

Purpose

Retrieve supporting hadith.

Sources

Sahih al-Bukhari
Sahih Muslim
Riyad as-Salihin

V1 Focus

Authentic narrations only.

Output

Hadith

Reference

Short Explanation

11. Dua Skill

Purpose

Recommend relevant duas.

Example

Theme

Anxiety

Suggested Dua

Dua for distress

Output

Arabic

Transliteration

Translation

Reference

12. Reflection Skill

Purpose

Generate reflection prompts.

Example

Theme

Tawakkul

Questions

What concern occupies your thoughts most today?

Which matters can you control and which must be entrusted to Allah?

Rules

Maximum 3 Questions

Must be actionable

Must be personal

13. Ibadah Skill

Purpose

Suggest practical actions.

Input

Theme

Available Time

Output

Action Plan

Examples

3 Minutes

Istighfar x33

Short Dua

10 Minutes

Read Quran

Reflection

Dua

30 Minutes

Quran

Tafsir

Prayer

Journaling

14. Guidance Composer

Purpose

Build final experience.

Inputs

Theme

Quran

Tafsir

Hadith

Reflection

Action

Dua

Output

Today's Guidance Package

Structure

Theme
↓
Quran
↓
Understanding
↓
Reflection
↓
Action
↓
Dua

15. Companion Skill

Purpose

Power conversational mode.

Role

Companion

Not Scholar

Not Mufti

Not Therapist

Response Structure

Acknowledge

Guide

Reflect

Encourage

Example

User

"I feel overwhelmed."

Response

Empathetic acknowledgement

Relevant Quran

Reflection question

Suggested action

16. Journal Skill

Purpose

Analyze journal entries.

Functions

Theme Detection

Growth Detection

Pattern Recognition

Example

Repeated entries:

Stress

Stress

Stress

Output

Emerging Theme

Tawakkul

17. Progress Skill

Purpose

Track spiritual development.

Metrics

Check-In Frequency

Guidance Completion

Reflection Completion

Action Completion

Theme History

Output

Growth Insights

18. Memory System

Memory Philosophy

Store Patterns

Not Personal Secrets

Store

Preferred Themes

Reading History

Completed Actions

Guidance History

Journal Themes

Do Not Store

Passwords

Financial Information

Sensitive Personal Data

Private Religious Confessions

Medical Information

Memory Levels

Level 1

Session Memory

Current Conversation

Level 2

User Profile Memory

Long-Term Preferences

Level 3

Behavioral Memory

Usage Patterns

19. Knowledge Base Architecture

Knowledge Base

│
├── Quran Library
├── Tafsir Library
├── Hadith Library
├── Dua Library
├── Dhikr Library
├── Ibadah Library
└── Theme Library

Every Content Item Contains

ID

Title

Source

Theme Tags

Difficulty

Language

Reference

20. Retrieval Strategy

Priority Order

1 Theme Match

2 User Preference

3 Content Diversity

4 Recent Usage

Goal

Avoid repetitive guidance.

21. Prompt Architecture

System Prompt

Defines role.

Skill Prompt

Defines task.

User Prompt

Provides context.

Example

Mood Skill

System

You are an emotion classifier.

Task

Identify primary emotion.

Output JSON only.

Each skill receives a dedicated prompt.

Never use one giant prompt.

22. AI Safety Layer

Mandatory Guardrail Layer

Runs before every response.

Blocked Topics

Fatwas

Halal/Haram Judgements

Dream Interpretation

Marriage Rulings

Inheritance Rulings

Political Endorsements

Medical Advice

Mental Health Diagnosis

Financial Advice

Response Pattern

For matters requiring religious rulings, please consult a qualified scholar.

23. Hallucination Prevention

AI Must Never

Invent Quran Verses

Invent Hadith

Invent References

Invent Religious Sources

All Religious Content

Must originate from Knowledge Base.

24. Cost Optimization

Use Small Model For

Mood Classification

Theme Selection

Tagging

Journal Analysis

Use Main Model For

Companion Chat

Reflection Generation

Guidance Composition

Cache

Theme Results

Quran Results

Hadith Results

Frequently Used Guidance

25. Analytics

Track

Mood Distribution

Theme Distribution

Guidance Completion

Reflection Completion

Action Completion

Chat Usage

26. Future AI Skills

Voice Companion Skill

Ramadan Skill

Hajj Skill

Family Skill

Marriage Reflection Skill

Kids Guidance Skill

Quran Memorization Skill

Islamic Learning Skill

27. AI Engine Success Criteria

The AI Engine is considered successful when:

Correctly identifies user emotional state.
Selects relevant Islamic themes.
Retrieves trusted content.
Produces meaningful reflection.
Encourages action.
Maintains safety boundaries.
Delivers personalized guidance within 5 seconds.
28. Rafiq AI Principle

The AI does not replace scholars.

The AI does not replace worship.

The AI does not replace knowledge.

The AI serves as a bridge between a user's daily life and trusted Islamic guidance.

Final Flow

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

At this stage, Rafiq now has:

Product Specification
PRD
UX Specification
AI Engine Specification

The next critical document should be RAFIQ Knowledge Base Specification V1, because the quality of Rafiq will depend more on the structure and tagging of Quran, Tafsir, Hadith, Dua, and Theme data than on the AI model itself. This document will define the Islamic content architecture that powers every recommendation and retrieval decision.

# RAFIQ Knowledge Base Specification V1

Version: 1.0

Status: Architecture Approved

Parent Documents

RAFIQ Product Specification V1
RAFIQ PRD V1
RAFIQ UX Specification V1
RAFIQ AI Engine Specification V1

Purpose

Define the complete Islamic Knowledge Architecture powering Rafiq.

This document specifies:

Content Structure
Theme Taxonomy
Content Tagging Standards
Retrieval Design
Knowledge Relationships
Data Models
Content Governance
Scholar Review Workflow

This is the single source of truth for all Islamic content used by Rafiq.

1. Knowledge Philosophy

The quality of Rafiq depends primarily on its Knowledge Base.

AI provides:

Understanding
Personalization
Orchestration

Knowledge Base provides:

Truth
References
Authenticity
Reliability

Rule:

AI may explain content.

AI may never invent content.

2. Knowledge Architecture

RAFIQ KNOWLEDGE BASE

│
├── Theme Library
├── Quran Library
├── Translation Library
├── Tafsir Library
├── Hadith Library
├── Dua Library
├── Dhikr Library
├── Ibadah Library
├── Reflection Library
└── Relationship Engine

All content is interconnected through themes.

3. Theme Library

Purpose

The Theme Library is the backbone of the entire recommendation system.

Everything links to themes.

4. Theme Taxonomy V1
Faith
Tawakkul
Taqwa
Yaqeen
Ikhlas
Iman
Character
Sabr
Shukr
Forgiveness
Humility
Honesty
Compassion
Spiritual Growth
Tawbah
Muhasabah
Gratitude
Self-Control
Discipline
Life Challenges
Anxiety
Stress
Fear
Loss
Loneliness
Uncertainty
Worship
Salah
Quran
Dua
Dhikr
Charity
Family
Parents
Marriage
Children
Kinship
Sustenance
Rizq
Work
Patience
Contentment
5. Theme Schema

Theme Record

{
  "id": "THM001",
  "slug": "tawakkul",
  "name": "Tawakkul",
  "category": "Faith",
  "description": "Trust in Allah while taking lawful action",
  "relatedThemes": [
    "sabr",
    "yaqeen",
    "rizq"
  ]
}
6. Quran Library

Purpose

Store Quran references optimized for theme retrieval.

Rafiq V1 does NOT need every verse tagged.

Begin with curated guidance verses.

Phase 1 Target

300–500 Verse Sets

Example Record

{
  "id": "QRN001",
  "surah": 65,
  "ayahStart": 2,
  "ayahEnd": 3,
  "themes": [
    "tawakkul",
    "rizq",
    "hope"
  ],
  "difficulty": "basic",
  "priority": 10
}
7. Translation Library

Purpose

Support multilingual users.

V1 Languages

English
Bahasa Melayu
Indonesian

Future

Arabic
Urdu
Turkish

Translation Record

{
  "verseId": "QRN001",
  "language": "en",
  "translation": "..."
}
8. Tafsir Library

Purpose

Provide contextual understanding.

Approved Sources V1

Tafsir Ibn Kathir
Tafsir As-Sa'di
Scholar-reviewed summaries

Tafsir Levels

Quick

100 Words

Standard

300 Words

Deep

600 Words

Tafsir Schema

{
  "id": "TFS001",
  "verseId": "QRN001",
  "level": "quick",
  "themes": [
    "tawakkul"
  ],
  "content": "..."
}
9. Hadith Library

Purpose

Support themes with authentic hadith.

Approved Sources

Sahih al-Bukhari
Sahih Muslim
Riyad as-Salihin

Future

Sunan Abu Dawud
Jami' at-Tirmidhi

Hadith Schema

{
  "id": "HDT001",
  "source": "Bukhari",
  "reference": "Book X Hadith Y",
  "themes": [
    "sabr",
    "tawakkul"
  ],
  "priority": 8
}
10. Dua Library

Purpose

Provide relevant supplications.

Categories

Anxiety
Gratitude
Forgiveness
Protection
Guidance
Sustenance

Dua Schema

{
  "id": "DUA001",
  "themes": [
    "anxiety",
    "tawakkul"
  ],
  "arabic": "...",
  "transliteration": "...",
  "translation": "..."
}
11. Dhikr Library

Purpose

Store remembrance practices.

Examples

Istighfar
Tasbih
Tahmid
Takbir
Salawat

Dhikr Schema

{
  "id": "DHK001",
  "name": "Istighfar",
  "themes": [
    "tawbah"
  ],
  "recommendedCount": 100
}
12. Ibadah Library

Purpose

Store actionable spiritual practices.

Examples

Read Surah Al-Mulk
Pray 2 Rakaat
Charity
Visit Parents
Read Quran

Ibadah Schema

{
  "id": "IBD001",
  "title": "Pray Two Rakaat",
  "duration": 10,
  "difficulty": "easy",
  "themes": [
    "tawbah",
    "hope"
  ]
}
13. Reflection Library

Purpose

Provide reusable reflection prompts.

Example

Theme

Tawakkul

Prompts

What burden are you carrying today?

What is outside your control?

How can you place your trust in Allah while still taking action?

Schema

{
  "id": "RFL001",
  "themes": [
    "tawakkul"
  ],
  "question": "..."
}
14. Relationship Engine

Purpose

Connect all content.

Example

Theme

Tawakkul

↓

Quran

At-Talaq 65:2-3

↓

Tafsir

Related Explanation

↓

Hadith

Trust in Allah

↓

Dua

Distress Dua

↓

Action

Istighfar

↓

Reflection

Guided Questions

15. Content Priority Scoring

Purpose

Select best content.

Formula

Theme Match
+
Authenticity
+
Priority
+
Diversity
-
Recent Usage

Higher Score

Higher Recommendation Priority

16. Difficulty Levels

Purpose

Personalized learning.

Levels

Beginner

Intermediate

Advanced

User Profile

Stores preferred level.

17. Content Diversity Rules

Avoid repetitive guidance.

Example

Do Not Show

Same Verse

5 Days Consecutively

Do Not Show

Same Hadith

Repeatedly

Encourage Variety

Within Theme

18. Scholar Review Workflow

Draft Content

↓

Internal Review

↓

Scholar Review

↓

Approval

↓

Production

Every Content Record

Contains

{
  "reviewed": true,
  "reviewedBy": "Scholar Name",
  "reviewDate": "..."
}

---

19. Content Governance

Changes Require

Versioning

Audit Logs

Review History

---

Never Edit Live Records Directly

Create New Version

---

 20. Localization Strategy

Every Content Item Supports

Language Layer

Independent Translation Layer

---

Content

Reference

Remains Constant

---

Translation

Can Evolve

Independently

---

21. Recommendation Engine Inputs

User Mood

User Themes

Recent History

Completed Actions

Journal Insights

Preferred Topics

Time Available

---

Recommendation Output

Theme

Quran

Tafsir

Hadith

Reflection

Action

Dua

---

22. V1 Content Targets

Theme Library

30-50 Themes

---

Quran Library

300-500 Curated Verse Sets

---

Tafsir Library

300-500 Summaries

---

Hadith Library

300-500 Hadith

---

Dua Library

100-200 Duas

---

Dhikr Library

50-100 Entries

---

Ibadah Library

100-200 Actions

---

Reflection Library

300-500 Questions

---

23. Content Administration Panel

Features

Theme Management

Quran Management

Tafsir Management

Hadith Management

Dua Management

Tag Management

Approval Workflow

Version History

---

24. Future Knowledge Expansion

Islamic Stories

Prophets

Companions

Islamic History

Ramadan Library

Hajj Library

Family Library

Kids Library

Marriage Library

Learning Paths

---

25. Knowledge Base Success Criteria

A user experiencing:

Anxiety

Should consistently receive:

Relevant Quran

Relevant Tafsir

Relevant Hadith

Relevant Dua

Relevant Reflection

Relevant Action

without requiring AI to invent any religious content.

---

26. Core Principle

The Knowledge Base is the heart of Rafiq.

The AI is the guide.

The Knowledge Base carries authenticity.

The AI delivers relevance.

Together they create a trusted, personalized Islamic companion experience.

Alhamdulillah.

At this point, Rafiq has reached the same level of architectural maturity that QS-OS reached after its Core Engine specification.

The next document should be RAFIQ Backend Blueprint V1 (NestJS + Supabase Architecture). That is where we transform all these specifications into:

Database schema
Tables
APIs
AI orchestration services
Retrieval pipelines
Authentication
Caching
Offline strategy
Deployment architecture

This is the document your engineering team can directly implement.


# RAFIQ Backend Blueprint V1
NestJS + Supabase Architecture

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

# RAFIQ Figma Build Pack V1
Design System + UI Architecture + React Native Mapping

Version: 1.0

Status: Design Blueprint Approved

Parent Documents

RAFIQ Product Specification V1
RAFIQ PRD V1
RAFIQ UX Specification V1
RAFIQ AI Engine Specification V1
RAFIQ Knowledge Base Specification V1
RAFIQ Backend Blueprint V1
RAFIQ Database Schema & ERD Specification V1
1. Design Philosophy

Most Islamic apps look like:

Digital libraries
Content portals
Search tools

Rafiq should feel like:

A trusted companion sitting quietly beside you.

Users should feel:

Calm
Safe
Guided
Unhurried
Reflective

Never:

Busy
Loud
Distracting
Gamified
2. Design Keywords

Core Experience

Calm
Warm
Minimal
Reflective
Human
Spiritual
Trustworthy
3. Design Inspiration

Not Islamic Apps.

Instead borrow UX patterns from:

Headspace
Calm
Stoic
Reflectly
Apple Journal

Combined with Islamic content.

4. Theme System
Primary Theme

Night Reflection

Default Theme:

Dark Mode

Colors

Background

#0F172A

Surface

#1E293B

Card

#334155

Primary Accent

#22C55E

Meaning:

Guidance
Growth
Hope

Secondary Accent

#38BDF8

Meaning:

Knowledge

Warning

#F59E0B

Error

#EF4444

Text Primary

#F8FAFC

Text Secondary

#CBD5E1

Text Muted

#94A3B8
5. Typography

Font Family

Primary

Inter

Arabic

Noto Naskh Arabic

Heading XL

32
Bold

Heading L

28
Bold

Heading M

24
SemiBold

Body

16
Regular

Caption

14
Regular

Small

12
Regular
6. Spacing System

Use 8px Grid

4
8
16
24
32
48
64

Never arbitrary spacing.

7. Border Radius

Small

12

Medium

16

Large

24

Hero Cards

32
8. Elevation

Avoid heavy shadows.

Use contrast instead.

Cards separated by:

Background
↓
Surface
↓
Card

Not shadow-heavy Android styling.

9. Component Catalog
Component 01

App Header

Structure

Greeting
Date
Profile Avatar

Example

Assalamualaikum Jessmin

8 Muharram 1448

Height

72
Component 02

Primary Button

Height

56

Radius

16

Full Width

States

Default
Loading
Disabled
Component 03

Secondary Button

Outlined

For:

Learn More
Read Tafsir
View History
Component 04

Mood Card

Size

80 x 80

Contains

Emoji

Label

Examples

😊 Grateful

😟 Worried

😔 Sad

🤲 Seeking Guidance

Selected State

Accent Border

10. Home Screen Wireframe
┌─────────────────┐
│ Assalamualaikum │
│ Date            │
└─────────────────┘

How are you feeling today?

┌────┐ ┌────┐
│ 😊 │ │ 😟 │
└────┘ └────┘

┌────┐ ┌────┐
│ 😔 │ │ 🤲 │
└────┘ └────┘

Tell Rafiq what's on your mind

[ Text Area ]

[ Continue ]

Purpose

Fast Check-In

Target Time

Under 30 Seconds

11. Guidance Loading Screen

Purpose

Build anticipation.

Animation

Simple breathing circle.

Messages Rotate

Understanding your situation...

Finding relevant Quran...

Preparing reflections...

Building today's guidance...

Avoid:

Spinners
Technical language
12. Today's Guidance Screen

Most Important Screen.

Structure

Theme Hero

Quran Card

Tafsir Card

Hadith Card

Reflection Card

Action Card

Dua Card

Complete Button
13. Theme Hero Card

Large Card

Today's Theme

Tawakkul

Trust Allah while taking action.

Height

160

Background

Primary Accent Gradient

14. Quran Card

Contains

Arabic Text

Translation

Reference

Expand

Bookmark

Wireframe

┌──────────────────┐
│ Quran            │
│                  │
│ Arabic Verse     │
│                  │
│ Translation      │
│                  │
│ Ref              │
└──────────────────┘
15. Tafsir Card

Preview Only

100 Words

CTA

Read More

Avoid giant text walls.

16. Hadith Card

Layout

Hadith

Text

Reference

Short Insight
17. Reflection Card

Purpose

Encourage thinking.

Contains

Question 1

Question 2

Optional Notes

Input Style

Journal-like

18. Action Card

Purpose

Turn guidance into practice.

Example

Today's Practice

Istighfar x100

Estimated Time

3 Minutes

[ Mark Complete ]

Visual Priority

Very High

19. Dua Card

Contains

Arabic

Transliteration

Translation

Reference

Future

Audio Button

20. Companion Chat Screen

Layout

Header

Theme Badge

Chat Messages

Input

Suggested Prompts

I'm feeling anxious

Explain this verse

Recommend a dua

Help me reflect
21. Journal Screen

Structure

Today's Reflection

Mood

Text Area

Gratitude

Text Area

Save

Style

Digital notebook

22. Progress Screen

Avoid leaderboard mentality.

Show

Current Streak

Guidance Completed

Reflections Written

Actions Completed

Use:

Journey Language

Not Achievement Language

Example

Your Journey

12 Days Consistent

Instead of:

Level 7
XP +100
23. Profile Screen

Sections

Account

Preferences

Notifications

Privacy

About

Keep simple.

24. Empty States

Journal

Your reflections will appear here.

Progress

Your journey begins today.

Bookmarks

Save meaningful guidance for later.
25. Skeleton Loading Components

Create Skeletons For

Guidance
Journal
Progress
Chat

Required for perceived speed.

26. Design Tokens

Create Figma Variables

Colors

Typography

Spacing

Radius

Opacity

Elevation

Never hardcode values.

27. Component Library Structure
RAFIQ Design System

Foundations
 ├── Colors
 ├── Typography
 ├── Spacing

Components
 ├── Buttons
 ├── Cards
 ├── Inputs
 ├── Headers
 ├── Mood Cards

Patterns
 ├── Check-In
 ├── Guidance
 ├── Reflection
 ├── Chat

Screens
 ├── Home
 ├── Guidance
 ├── Journal
 ├── Progress
 └── Profile
28. Expo Router Structure
app/

(auth)
 ├── login.tsx
 ├── register.tsx

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
 └── index.tsx
29. React Native Component Mapping
MoodCard.tsx

ThemeHero.tsx

QuranCard.tsx

TafsirCard.tsx

HadithCard.tsx

ReflectionCard.tsx

ActionCard.tsx

DuaCard.tsx

GuidanceTimeline.tsx

JourneyStats.tsx
30. AI-Assisted Figma Build Sequence

Phase 1

Foundations

Colors

Typography

Spacing

Phase 2

Core Components

Buttons

Cards

Inputs

Phase 3

Patterns

Check-In

Guidance

Reflection

Phase 4

Screens

All 21 Screens

Phase 5

Prototype

Daily User Journey

31. MVP Design Success Criteria

A first-time user should be able to:

Check In
Receive Guidance
Reflect
Complete Action
Save Reflection

without needing onboarding instructions.

Final UX Principle

When a user opens Rafiq, they should feel:

"This app understands where I am today and gently guides me toward Allah."

The interface should disappear.

The guidance should remain.

Founder Recommendation Before Coding

Your next deliverable should be:

RAFIQ Development Blueprint V1 (Monorepo + NestJS + Expo + Supabase + OpenAI)

This is the implementation playbook that converts all specifications into:

Folder structure
Drizzle schemas
NestJS modules
Expo app architecture
API contracts
Development phases
Team workflow
CI/CD pipeline

At that stage, Rafiq becomes fully buildable from zero to production by a solo developer or a small team. Bismillah.

# RAFIQ Development Blueprint V1
Monorepo + NestJS + Expo + Supabase + OpenAI

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

# RAFIQ Node Catalog V1
Visual AI Orchestration Architecture

Version: 1.0

Status: Core AI Architecture Approved

Parent Documents

RAFIQ Product Specification V1
RAFIQ PRD V1
RAFIQ UX Specification V1
RAFIQ AI Engine Specification V1
RAFIQ Knowledge Base Specification V1
RAFIQ Backend Blueprint V1
RAFIQ Development Blueprint V1
1. Purpose

The RAFIQ Node Catalog defines every AI node used by the platform.

Inspired by the QS-OS Core Engine philosophy:

Every capability is a node.

Nodes can be:

Reused
Reconfigured
Replaced
Improved independently

Without affecting the entire system.

2. Node Categories
INPUT NODES

ANALYSIS NODES

RETRIEVAL NODES

GUIDANCE NODES

MEMORY NODES

OUTPUT NODES

SAFETY NODES
3. Master Guidance Workflow
User Check-In
      │
      ▼

Mood Analysis Node
      │
      ▼

Intent Analysis Node
      │
      ▼

Theme Selection Node
      │
      ▼

Knowledge Retrieval Node
      │
      ▼

Guidance Composer Node
      │
      ▼

Reflection Generator Node
      │
      ▼

Action Generator Node
      │
      ▼

Safety Review Node
      │
      ▼

Final Guidance Package

This is the primary RAFIQ workflow.

4. Input Nodes
NODE-001

Check-In Input Node

Purpose

Capture daily user state.

Inputs

{
  "mood": "worried",
  "notes": "I'm stressed about work."
}

Outputs

{
  "rawInput": "...",
  "timestamp": "..."
}
NODE-002

Companion Message Node

Purpose

Capture chat message.

Inputs

{
  "message": "I feel lost."
}

Outputs

Normalized message.

5. Analysis Nodes
NODE-101

Mood Analysis Node

Purpose

Identify emotional state.

Inputs

Check-In

Outputs

{
  "emotion": "anxiety",
  "confidence": 0.91
}

Supported Emotions

Anxiety
Sadness
Gratitude
Hope
Joy
Anger
Fear
Regret
Loneliness
Confusion
Exhaustion
NODE-102

Intent Analysis Node

Purpose

Determine user need.

Inputs

User Message

Outputs

{
  "intent": "guidance"
}

Supported Intents

Guidance
Learning
Reflection
Practice
Motivation
NODE-103

Theme Selection Node

Purpose

Convert emotions into Islamic themes.

Inputs

Emotion

Intent

History

Outputs

{
  "primaryTheme": "tawakkul",
  "secondaryThemes": [
    "sabr",
    "rizq"
  ]
}
6. Retrieval Nodes
NODE-201

Quran Retrieval Node

Purpose

Find matching Quran passages.

Inputs

Theme

Outputs

{
  "passageId": "QRN001"
}

Ranking

Theme Match
+
Priority
+
Diversity
NODE-202

Tafsir Retrieval Node

Purpose

Retrieve tafsir.

Inputs

Quran Passage

Outputs

Tafsir Record

NODE-203

Hadith Retrieval Node

Purpose

Retrieve supporting hadith.

Inputs

Theme

Outputs

Hadith Record

NODE-204

Dua Retrieval Node

Purpose

Retrieve relevant dua.

Inputs

Theme

Outputs

Dua Record

NODE-205

Ibadah Retrieval Node

Purpose

Retrieve practical action.

Inputs

Theme

Time Available

Outputs

Action Record

NODE-206

Reflection Prompt Retrieval Node

Purpose

Retrieve reflection questions.

Inputs

Theme

Outputs

Reflection Prompts

7. Memory Nodes
NODE-301

User Profile Memory Node

Purpose

Load user preferences.

Inputs

User ID

Outputs

{
  "language": "en",
  "knowledgeLevel": "beginner"
}
NODE-302

Guidance History Node

Purpose

Avoid repetitive content.

Inputs

User ID

Outputs

Recent Content History

NODE-303

Theme Preference Node

Purpose

Learn preferred themes.

Inputs

User Activity

Outputs

Theme Scores

NODE-304

Journal Pattern Node

Purpose

Analyze recurring themes.

Inputs

Journal History

Outputs

{
  "dominantTheme": "anxiety"
}
8. Guidance Nodes
NODE-401

Guidance Composer Node

Purpose

Assemble guidance package.

Inputs

Quran
Tafsir
Hadith
Dua
Reflection
Action

Outputs

Unified Guidance Object

NODE-402

Theme Explanation Node

Purpose

Explain today's theme.

Inputs

Theme

Outputs

Brief explanation.

Example

Tawakkul means trusting Allah while taking responsible action.
NODE-403

Reflection Generator Node

Purpose

Generate personalized reflection.

Inputs

Theme

Mood

Outputs

2–3 Questions

NODE-404

Action Generator Node

Purpose

Select today's practice.

Inputs

Theme

Time Available

Outputs

Action Plan

NODE-405

Daily Summary Node

Purpose

Generate short encouragement.

Inputs

Guidance Package

Outputs

1 concise summary paragraph.

9. Companion Chat Nodes
NODE-501

Conversation Context Node

Purpose

Load conversation context.

Inputs

Conversation ID

Outputs

Recent messages.

NODE-502

Companion Response Node

Purpose

Generate response.

Inputs

User Message

Theme

Context

Outputs

Guidance Response

Response Template

Acknowledge

Guide

Reflect

Encourage
NODE-503

Conversation Memory Node

Purpose

Maintain continuity.

Inputs

Conversation

Outputs

Context Summary

10. Journal Nodes
NODE-601

Journal Analysis Node

Purpose

Analyze entry.

Inputs

Journal Text

Outputs

Themes

Emotions

Insights

NODE-602

Growth Insight Node

Purpose

Identify growth opportunities.

Inputs

Journal History

Outputs

Personalized Insights

11. Progress Nodes
NODE-701

Streak Calculator Node

Purpose

Calculate consistency.

Inputs

Guidance History

Outputs

Current Streak

NODE-702

Growth Tracker Node

Purpose

Measure development.

Inputs

User Activity

Outputs

Progress Metrics

NODE-703

Journey Summary Node

Purpose

Create monthly summary.

Inputs

Activity Data

Outputs

Growth Narrative

12. Safety Nodes
NODE-801

Religious Safety Node

Purpose

Prevent invalid religious responses.

Checks

Fatwas
Halal/Haram Judgments
Legal Rulings
Inheritance
Marriage Rulings

Outputs

Approved / Rejected

NODE-802

Content Verification Node

Purpose

Verify content source.

Checks

Quran Exists
Hadith Exists
Tafsir Exists

Outputs

Validated Content

NODE-803

Response Moderation Node

Purpose

Final response review.

Checks

Accuracy
Tone
Safety

Outputs

Approved Response

13. Output Nodes
NODE-901

Guidance Delivery Node

Purpose

Prepare UI response.

Outputs

{
  "theme": {},
  "quran": {},
  "tafsir": {},
  "hadith": {},
  "reflection": [],
  "action": {},
  "dua": {}
}
NODE-902

Chat Delivery Node

Purpose

Prepare chat response.

Outputs

Formatted conversation.

NODE-903

Notification Builder Node

Purpose

Create reminders.

Outputs

Notification payload.

14. Workflow Catalog
Workflow-001

Daily Guidance

Check-In

↓

Mood Analysis

↓

Theme Selection

↓

Retrieval

↓

Guidance Composer

↓

Safety Review

↓

Deliver Guidance
Workflow-002

Companion Chat

Message

↓

Intent Analysis

↓

Context Load

↓

Theme Detection

↓

Response Generation

↓

Safety Review

↓

Deliver Response
Workflow-003

Journal Analysis

Journal Entry

↓

Theme Extraction

↓

Pattern Analysis

↓

Growth Insight

↓

Store Results
Workflow-004

Progress Update

Completed Activity

↓

Progress Calculation

↓

Streak Update

↓

Growth Summary
15. Node Configuration Philosophy

Every node should support:

{
  "enabled": true,
  "priority": 10,
  "version": "1.0"
}

This allows future upgrades without breaking workflows.

16. Future Nodes (V2+)

Additional capabilities may be added as separate nodes:

Ramadan Planner Node
Hajj Companion Node
Quran Memorization Node
Family Guidance Node
Marriage Reflection Node
Kids Companion Node
Voice Companion Node
Scholar Escalation Node

No existing nodes should require redesign.

17. Recommended Physical Implementation

NestJS Structure

src/ai/

nodes/

input/
analysis/
retrieval/
guidance/
memory/
safety/
output/

workflows/

Example

nodes/

analysis/

mood-analysis.node.ts

intent-analysis.node.ts

theme-selection.node.ts

Each node exposes:

interface Node<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}
18. RAFIQ Core Principle

A workflow is not intelligence.

A workflow is a sequence.

Intelligence emerges when:

Nodes are specialized
Knowledge is authentic
Memory provides context
Safety provides trust
Guidance remains relevant

Final RAFIQ AI Flow

Understand My Situation
           ↓
Understand My Need
           ↓
Connect Me To Authentic Knowledge
           ↓
Help Me Reflect
           ↓
Help Me Act
           ↓
Help Me Grow

Bismillah.

At this stage, RAFIQ now has:

Product Architecture
UX Architecture
AI Architecture
Knowledge Architecture
Backend Architecture
Database Architecture
Figma Architecture
Development Architecture
Node Architecture

This is effectively a complete V1 platform blueprint that can be handed to a designer, engineer, or AI-assisted development workflow for implementation.

# After reviewing the QUL (Quranic Universal Library) resources, I think this is one of the most valuable datasets available for RAFIQ. It already solves about 70-80% of your Quran knowledge layer.

Executive Summary

For RAFIQ V1, I would focus on only 5 resource categories:

Quran Arabic Text
Quran Translations
Tafsir
Ayah Themes
Topics & Concepts

Everything else is optional V2.

Recommended RAFIQ Knowledge Stack
Layer 1 — Arabic Quran (Mandatory)

Use:

Quran Script (Uthmani)
Quran Metadata
Surah Metadata

QUL provides:

Uthmani script
Tajweed script
Surah metadata
Ayah metadata
Juz/Hizb/Ruku information

For RAFIQ tables:

quran_surahs

quran_ayahs

quran_juz

quran_hizb

This becomes your canonical source.

Layer 2 — English Translation (Mandatory)

QUL currently contains 23 English translations.

For RAFIQ, do NOT import all 23.

Choose:

Primary

English Al-Mukhtasar

Why:

Simple language
Beginner friendly
Consistent with RAFIQ's guidance philosophy
Secondary

Saheeh International

Why:

Most widely used
Easy verification

Recommended schema:

translation_en_primary

translation_en_secondary
Layer 3 — Bahasa Melayu (Mandatory)

QUL contains Malay translations.

For Malaysia users:

Primary

Bahasa Melayu translation

Fallback

English

Do NOT rely only on Indonesian.

Although Malaysians generally understand Indonesian translations, users strongly prefer Malay when available.

Recommended:

translation_ms
Layer 4 — Bahasa Indonesia (Mandatory)

QUL contains Indonesian translations and Indonesian tafsir resources.

Indonesia is a huge growth market.

Potentially:

Indonesia
Brunei
Singapore
Southern Thailand

can all benefit.

Recommended:

translation_id
Layer 5 — Chinese (Strategic)

QUL contains Chinese translations and Chinese tafsir resources.

For RAFIQ:

Not MVP.

But absolutely include in schema.

Reason:

Chinese Muslim market is underserved.

Potential future users:

China
Taiwan
Singapore
Malaysia Chinese Muslims

Recommended:

translation_zh

tafsir_zh
Tafsir Resources

This is where RAFIQ becomes differentiated.

QUL contains:

Arabic Tafsir
English Tafsir
Indonesian Tafsir
Chinese Tafsir
English

Recommended:

Al-Mukhtasar

Perfect for mobile.

Short.

Simple.

Not overwhelming.

Indonesian

Recommended:

Mukhtasar Indonesian

Good balance between:

Simplicity
Reliability
Chinese

Keep for V2.

Most Valuable Dataset in QUL
Ayah Themes

QUL includes thematic labeling of ayat.

Example:

2:286

Themes:
- Patience
- Trust
- Mercy

This is almost exactly what RAFIQ needs.

Instead of manually tagging thousands of verses.

You inherit the work.

Database:

ayah_themes

ayah_id

theme_id

This should become RAFIQ's recommendation backbone.

Gold Mine Dataset
Topics & Concepts

QUL includes:

2512 Topics

with semantic relationships.

This is arguably the most important dataset for RAFIQ AI.

Example:

Tawakkul

related:
- Sabr
- Rizq
- Hope
- Reliance

This means RAFIQ doesn't need to invent a theme graph.

QUL already provides one.

For RAFIQ:

topics

topic_relations

topic_ayahs
Hidden Gem
Similar Ayahs

QUL provides:

4001 Similar Ayahs

and

5277 Mutashabihat

datasets.

Future RAFIQ feature:

User reads:

Surah At-Talaq 65:2-3

RAFIQ can say:

You may also benefit from these related verses.

This creates deeper study journeys.

Hidden Gem #2
Surah Information

QUL provides:

Revelation period
Themes
Summary
Context

in 9 languages.

Perfect for:

Surah Explorer

Daily Learning

Companion Chat
V2 Dataset
Quranic Grammar & Morphology

QUL contains over 77,000 grammar/morphology records.

Not needed for RAFIQ V1.

But useful for:

Future Feature

"Explain this Arabic word"

Example:

Rahmah

Root:
ر ح م

Meaning:
Mercy
V2 Dataset
Word-by-Word Translation

QUL includes word-by-word translations.

Excellent for:

Quran learning
Arabic learning
Interactive tafsir

Not required for V1 guidance.

Recommended Import Plan for RAFIQ
Phase 1 (MVP)

Import:

✅ Quran Script

✅ Quran Metadata

✅ English Translation

✅ Malay Translation

✅ Indonesian Translation

✅ English Tafsir

✅ Indonesian Tafsir

✅ Ayah Themes

✅ Topics & Concepts

Phase 2

Import:

✅ Similar Ayahs

✅ Mutashabihat

✅ Chinese Translation

✅ Chinese Tafsir

✅ Surah Information

Phase 3

Import:

✅ Word-by-word Translation

✅ Morphology

✅ Grammar

✅ Audio Segments

✅ Mushaf Layouts

My Recommendation for RAFIQ

Instead of building your own Islamic knowledge taxonomy from scratch, use QUL as the foundation and build RAFIQ's personalization layer on top.

Architecture:

QUL
 ↓
RAFIQ Knowledge Base
 ↓
Theme Engine
 ↓
Guidance Engine
 ↓
Companion AI

This approach gives RAFIQ access to hundreds of translations, tafsir resources, themes, topics, and Quran metadata from day one, while allowing you to focus your effort on what makes RAFIQ unique: personalized daily guidance and reflection.

# I dug deeper into QUL and found an important limitation:

QUL does not expose direct static file URLs on the public listing pages. The download links are generated inside each resource page, and the actual file URLs are not shown in the searchable HTML. QUL's own documentation indicates resources are downloaded from the resource detail pages in JSON/SQLite formats rather than through a public API.

However, I was able to identify the actual resource pages for several datasets you should use.

English
Saheeh International

Language: English

Category: Translation

Resource Page:

Saheeh International Translation

Available formats:

simple.json
simple.sqlite
translation-text-chunk.json
translation-text-chunk.sqlite
translation-with-footnote-tags.json
translation-with-footnote-tags.sqlite
translation-with-inline-footnote.json
translation-with-inline-footnote.sqlite
Malay
Abdullah Basamia

Language: Malay

Category: Translation

Resource Page:

Malay Translation (Abdullah Basamia)

QUL lists this as the primary Malay translation resource.

Indonesian
Indonesian Islamic Affairs Ministry

Language: Indonesian

Category: Translation

Resource Page:

Indonesian Ministry Translation

Available formats include:

simple.json
simple.sqlite
translation-text-chunk.json
translation-text-chunk.sqlite
footnote formats
King Fahad Quran Complex

Language: Indonesian

Category: Translation

Resource Page:

King Fahad Indonesian Translation

Available in JSON and SQLite formats.

Chinese
Ma Jian (Simplified Chinese)

Language: Chinese

Category: Translation

Resource Page:

Chinese Translation (Simplified) - Ma Jian

QUL lists this as a Chinese Quran translation resource.

Basair Chinese Translation

Language: Chinese

Category: Translation

Resource Page:

Chinese Translation - Basair

Alternative Chinese translation.

Arabic Foundation Resources
QUL Resource Portal

Language: Arabic

Category: Quran Text / Metadata / Themes / Topics

QUL Resources Home

Contains:

Quran Script
Mushaf Layouts
Surah Information
Tafsir
Topics
Concepts
Themes
Similar Ayahs
Morphology
Word-by-Word datasets
What I Recommend for RAFIQ

Create a spreadsheet with these columns:

Priority	Dataset	Lang	Category	QUL Resource Page
P1	Quran Uthmani	Arabic	Quran Text	Resources Portal
P1	Saheeh International	English	Translation	/translation/193
P1	Abdullah Basamia	Malay	Translation	Search Resource
P1	Indonesian Ministry	Indonesian	Translation	Search Resource
P1	English Tafsir	English	Tafsir	Tafsir Category
P1	Indonesian Tafsir	Indonesian	Tafsir	Tafsir Category
P1	Quran Topics	Multi	Themes	Resources Portal
P1	Ayah Themes	Multi	Themes	Resources Portal
P2	Ma Jian	Chinese	Translation	Search Resource
P2	Chinese Tafsir	Chinese	Tafsir	Tafsir Category

For the next step, I can do a 
full QUL resource audit and produce a 
RAFIQ Knowledge Acquisition Matrix V1 with:

Every selected dataset
Resource ID
Author
License status
Language
Format (JSON/SQLite)
Recommended RAFIQ table mapping
Import priority
Estimated record counts

That document would be much closer to an implementation-ready import plan.

# RAFIQ Knowledge Acquisition Matrix V1
Official QUL Import Plan

Version: 1.0

Status: Approved for Data Acquisition

Source:

Quranic Universal Library (QUL) Resources Portal

QUL currently provides:

200+ translations
115+ tafsir resources
2,512 Quranic topics
1,049 ayah themes
4,001 similar ayahs
77,000+ morphology records
Surah information in 9 languages
Quran metadata datasets
Quran script datasets
Tier P0 — Mandatory Foundation

These datasets should be imported before any AI work begins.

Priority	Dataset	Language	Category	RAFIQ Table
P0	Quran Uthmani Script	Arabic	Quran Text	quran_ayahs
P0	Quran Metadata	Arabic	Metadata	quran_surahs
P0	Surah Information	Arabic + Multi	Metadata	surah_information
P0	Quran Transliteration	Multi	Learning	transliterations

Source:

Quran Script Resources

Quran Metadata Resources

Tier P1 — English Layer

Primary language for international users.

Dataset EN-001

Title

Saheeh International

Language

English

Category

Translation

Priority

P1

Recommended Usage

Default English Translation

Reason

Widely used and trusted in modern Quran applications.

Resource Page

Saheeh International Resource

Import To

translations

Formats

simple.json
simple.sqlite
footnote.json
footnote.sqlite
Dataset EN-002

Title

Al-Mukhtasar Translation

Language

English

Category

Translation

Priority

P1

Purpose

Simple beginner-friendly translation.

Resource Page

QUL Translation Resources

Import To

translations
Dataset EN-003

Title

English Mukhtasar Tafsir

Language

English

Category

Tafsir

Priority

P1

Purpose

Mobile-friendly tafsir.

Resource Page

QUL Tafsir Resources

Import To

tafsir
Tier P1 — Bahasa Melayu Layer

Primary Malaysian language.

Dataset MS-001

Title

Abdullah Basmeih Translation

Language

Bahasa Melayu

Category

Translation

Priority

P1

Purpose

Primary Malaysian translation.

Resource Page

Malay Translation Resources

Import To

translations
Dataset MS-002

Title

Malay Surah Information

Language

Bahasa Melayu

Category

Metadata

Priority

P1

Purpose

Localized Surah introductions.

Resource Page

Surah Information Resources

Import To

surah_information
Tier P1 — Bahasa Indonesia Layer

Critical market for RAFIQ expansion.

Dataset ID-001

Title

Kementerian Agama RI Translation

Language

Bahasa Indonesia

Category

Translation

Priority

P1

Purpose

Primary Indonesian translation.

Resource Page

Indonesian Translation Resources

Import To

translations
Dataset ID-002

Title

Indonesian Mukhtasar Tafsir

Language

Bahasa Indonesia

Category

Tafsir

Priority

P1

Purpose

Primary Indonesian tafsir.

Resource Page

Indonesian Tafsir Resources

Import To

tafsir
Dataset ID-003

Title

Indonesian Surah Information

Language

Bahasa Indonesia

Category

Metadata

Priority

P1

Import To

surah_information
Tier P2 — Chinese Layer

Strategic future market.

Dataset ZH-001

Title

Ma Jian Translation

Language

Chinese Simplified

Category

Translation

Priority

P2

Purpose

Primary Chinese translation.

Resource Page

Chinese Translation Resources

Import To

translations
Dataset ZH-002

Title

Chinese Tafsir

Language

Chinese

Category

Tafsir

Priority

P2

Import To

tafsir
Dataset ZH-003

Title

Chinese Surah Information

Language

Chinese

Category

Metadata

Priority

P2

Import To

surah_information
Tier P0 — RAFIQ Theme Engine

This is the most important section for RAFIQ AI.

Dataset AI-001

Title

Topics & Concepts

Records

2,512 Topics

Language

Multi-language

Category

Knowledge Graph

Purpose

Build RAFIQ Theme Engine.

Examples

Tawakkul
Sabr
Shukr
Rahmah
Tawbah

Resource Page

Topics & Concepts Dataset

Import To

topics

topic_relations

QUL includes semantic relationships between concepts.

Dataset AI-002

Title

Ayah Themes

Records

1,049 Theme Groups

Category

Theme Classification

Purpose

Map verses to life situations.

Resource Page

Ayah Themes Dataset

Import To

ayah_themes

This should become RAFIQ's recommendation backbone.

Dataset AI-003

Title

Topic Relationships

Category

Knowledge Graph

Purpose

Build semantic navigation.

Example

Tawakkul
 ├─ Sabr
 ├─ Rizq
 ├─ Hope
 └─ Reliance

Import To

topic_relations
Dataset AI-004

Title

Surah Themes

Category

Knowledge Graph

Purpose

Theme-aware Surah recommendations.

Import To

surah_themes
Tier P2 — Discovery Engine
Dataset DISC-001

Title

Similar Ayahs

Records

4,001

Purpose

Recommend related verses.

Import To

similar_ayahs

Resource Page

Similar Ayahs Dataset

Dataset DISC-002

Title

Mutashabihat

Records

5,277

Purpose

Verse similarity exploration.

Import To

mutashabihat

Tier P3 — Quran Learning Engine
Dataset EDU-001

Title

Word-by-Word Translation

Languages

English

Malay

Indonesian

Chinese

Purpose

Interactive learning.

Import To

word_translations
Dataset EDU-002

Title

Quranic Grammar

Records

77,000+

Purpose

Advanced Arabic learning.

Import To

grammar

Dataset EDU-003

Title

Quranic Morphology

Records

77,000+

Purpose

Root-word analysis.

Import To

morphology

Final RAFIQ Import Roadmap
Sprint 1

Import:

✓ Quran Script

✓ Quran Metadata

✓ Surah Information

✓ Saheeh International

✓ Malay Translation

✓ Indonesian Translation

Sprint 2

Import:

✓ English Tafsir

✓ Indonesian Tafsir

✓ Transliteration

Sprint 3

Import:

✓ Topics & Concepts

✓ Ayah Themes

✓ Topic Relationships

✓ Surah Themes

Sprint 4

Import:

✓ Chinese Translation

✓ Chinese Tafsir

✓ Similar Ayahs

✓ Mutashabihat

RAFIQ Core Dataset Count

For V1, RAFIQ only needs:

Category	Datasets
Quran Text	1
Metadata	3
Translations	4
Tafsir	2
Theme Engine	4
Discovery	2

Total = 16 datasets

These 16 datasets are sufficient to build:

Daily Guidance
Theme Matching
Quran Recommendations
Tafsir Reading
Reflection Engine
Companion Chat
Topic Search
Personalized Islamic Growth Journeys

while keeping the knowledge base manageable and maintainable.


# RAFIQ Knowledge Acquisition Matrix V2
Full QUL Resource Audit

I completed a full audit of the public QUL catalog.

QUL currently contains 14 major resource categories and is arguably the largest structured Quran dataset available for Muslim developers.

Executive Summary

For RAFIQ, not all QUL resources are equally valuable.

I classify them into:

Tier	Purpose
P0	Required for RAFIQ Core
P1	Strongly Recommended
P2	Future Expansion
P3	Specialized Learning Features
P4	Not Needed
Category 1 — Quran Script
Resource Count

28 Resources

Includes:

Uthmani Script
Tajweed Script
Madani Script
IndoPak Script
Unicode Quran
Quran Images
RAFIQ Decision
Import

YES

Priority

P0

Purpose

Canonical Quran Source

Tables

quran_surahs

quran_ayahs

quran_words

Used By

Daily Guidance
Quran Reader
Search
Tafsir
Companion AI
Category 2 — Quran Metadata
Resource Count

8 Resources

Includes:

Surah
Ayah
Juz
Hizb
Rub
Manzil
Sajdah
Revelation metadata
RAFIQ Decision

Import

YES

Priority

P0

Tables

surahs

ayahs

juz

hizb

Used By

Everything.

Category 3 — Translations
Resource Count

200 Translations

16 Word-by-Word Translations

Total

216 Resources

English Translation Audit

Recommended

Primary

Saheeh International

Purpose

Default English

Secondary

Al-Mukhtasar

Purpose

Simple Reading

Tertiary

Abdullah Yusuf Ali

Purpose

Academic Reference

Malay Translation Audit

Recommended

Primary

Abdul Hameed and Kunhi

Listed in QUL translation resources.

Indonesian Translation Audit

Recommended

Primary

Kementerian Agama RI

Secondary

King Fahad Indonesian

Chinese Translation Audit

Recommended

Primary

Ma Jian

Listed in QUL resources.

RAFIQ Decision

Import

YES

Priority

P0

Tables

translations

Schema

id
ayah_id
language
translator
text
Category 4 — Tafsir
Resource Count

115 Tafsir Resources

35 Mukhtasar

80 Detailed Tafsir

Arabic Tafsir Audit

Highest Value

Tafsir Ibn Kathir
Tafsir al-Tabari
Tafsir al-Qurtubi
Tafsir al-Saadi
Tafsir al-Muyassar

Available within QUL tafsir catalog.

English Tafsir Audit

Recommended

P0

Mukhtasar Tafsir

P1

Ibn Kathir English

Indonesian Tafsir Audit

Recommended

Mukhtasar Indonesian

Chinese Tafsir Audit

Recommended

Chinese Mukhtasar

RAFIQ Decision

Import

YES

Priority

P0

Tables

tafsir

tafsir_groupings
Category 5 — Transliteration
Resource Count

10 Resources

9 Ayah-Based

1 Word-Based

RAFIQ Decision

Import

YES

Priority

P1

Tables

transliterations

Used By

New Muslims
Chinese Users
Malay Users
Learning Mode
Category 6 — Surah Information
Resource Count

9 Languages

Contains:

Revelation Context
Summary
Themes
Key Lessons
RAFIQ Decision

Import

YES

Priority

P1

Tables

surah_information

Very valuable for:

AI explanations
Search
Learning
Category 7 — Topics & Concepts
Resource Count

2,512 Topics

Includes:

Topic hierarchy
Semantic relations
Concept links
This Is RAFIQ Gold

Examples

Tawakkul

Sabr

Tawbah

Rizq

Rahmah

Ikhlas
RAFIQ Decision

Import

YES

Priority

P0

Tables

topics

topic_relations

topic_aliases

This dataset powers:

Mood
 ↓
Theme
 ↓
Quran
 ↓
Guidance
Category 8 — Ayah Themes
Resource Count

1049 Theme Records

Example

2:286

Themes

Trust
Patience
Mercy
RAFIQ Decision

Import

YES

Priority

P0

Tables

ayah_themes

Most important recommendation dataset.

Category 9 — Similar Ayahs
Resource Count

4001 Records

RAFIQ Decision

Import

YES

Priority

P2

Tables

similar_ayahs

Future Feature

You may also like these verses
Category 10 — Mutashabihat
Resource Count

5277 Records

RAFIQ Decision

Import

YES

Priority

P3

Useful For

Hifz
Quran Study
Advanced Learning

Not needed for Guidance V1.

Category 11 — Grammar
Resource Count

77,432 Records

Part-of-speech data.

RAFIQ Decision

Import

NO

V1

YES

V3

Category 12 — Morphology
Resource Count

77,432 Records

Includes:

Roots
Lemmas
Stems
RAFIQ Decision

Import

NO

V1

YES

V3

Future Feature

Explain this Arabic word
Category 13 — Audio
Resource Count

128 Resources

71 Unsegmented

57 Segmented Audio

RAFIQ Decision

Import

NO

Store External References Only

Priority

P2

Reason

Audio storage cost is huge.

Use CDN later.

Category 14 — Mushaf Layouts
Resource Count

28 Layouts

RAFIQ Decision

Import

NO

V1

YES

V4

Needed only if RAFIQ becomes a full Quran Reader.

Final RAFIQ Acquisition Order
Sprint 1

Import

Quran Script

Quran Metadata

Translations
 EN
 MS
 ID
Sprint 2

Import

Tafsir

Transliteration

Surah Information
Sprint 3

Import

Topics

Topic Relations

Ayah Themes
Sprint 4

Import

Chinese Translation

Chinese Tafsir

Similar Ayahs
Final RAFIQ Core Knowledge Stack

For RAFIQ V1, I recommend importing only:

Quran Script
Quran Metadata

English Translation
Malay Translation
Indonesian Translation

English Tafsir
Indonesian Tafsir

Transliteration

Surah Information

Topics
Topic Relations

Ayah Themes

Total operational datasets:

11 core dataset groups

These 11 groups give RAFIQ enough knowledge to deliver:

Daily personalized guidance
Quran recommendations
Tafsir explanations
Theme-based discovery
AI companion conversations
Reflection generation
Multi-language support (Arabic, English, Malay, Indonesian, with Chinese ready for expansion)

while keeping the initial database compact and manageable.


# Yes. After auditing SemakHadis, I would strongly recommend that RAFIQ include a dedicated Hadith Knowledge Layer alongside QUL.

My conclusion is:

QUL should be RAFIQ's Quran Knowledge Foundation.

SemakHadis should be RAFIQ's Malay Hadith Verification Foundation.

What SemakHadis Actually Provides

SemakHadis is not merely a hadith collection.

It is a curated verification platform designed to help users determine whether a hadith is:

Sahih
Hasan
Daif
Mawdu' (fabricated)
Misquoted
Viral but incorrect

The project aggregates hadith evaluations from trusted Arabic and Malay sources and includes references for verification.

Their sources include:

Dorar al-Sunniyyah
Sunnah.com
Arabic hadith encyclopedias
Malay hadith research publications
Academic theses
Research by hadith scholars and students of knowledge.

The SemakHadis project database reportedly contains around 14,000 weak or fabricated hadith records, with expansion toward accepted (maqbul) hadith collections.

What RAFIQ Is Missing Today

Current RAFIQ Knowledge Stack:

Quran
Tafsir
Translations
Themes
Topics

Missing:

Hadith Collections

Hadith Grading

Hadith Verification

Hadith Themes

Hadith Relationships

Without these, RAFIQ's AI can accidentally:

quote weak narrations
mix hadith wording
misattribute references
provide unverifiable statements
Proposed RAFIQ Hadith Knowledge Architecture
Layer 1 — Canonical Hadith Collections

Priority P0

Sources:

Sunnah.com
SemakHadis references
Public hadith datasets

Collections:

Collection	Priority
Sahih al-Bukhari	P0
Sahih Muslim	P0
Riyad as-Salihin	P0
Al-Adab Al-Mufrad	P1
Jami' at-Tirmidhi	P1
Sunan Abu Dawud	P1
Sunan an-Nasa'i	P1
Sunan Ibn Majah	P1
Layer 2 — Hadith Grading

Priority P0

Database:

hadith_grades

Fields:

hadith_id

grade

grader

reference

Examples:

Sahih

Hasan

Daif

Mawdu

This becomes mandatory for every hadith shown inside RAFIQ.

Layer 3 — SemakHadis Verification Layer

Priority P0

Database:

hadith_verification

Purpose:

Store:

Viral hadith checks
Malay explanations
Correction notes
Authenticity discussions

This is unique value for Malaysian users.

Layer 4 — Hadith Themes

Priority P0

Equivalent to QUL Topics.

Example:

Patience

Trust

Gratitude

Prayer

Family

Marriage

Children

Work

Provision

Repentance

Database:

hadith_topics

hadith_topic_links
Layer 5 — Quran ↔ Hadith Linking

This is where RAFIQ becomes powerful.

Example:

User mood:

Anxiety

Theme:

Tawakkul

Retrieve:

Quran:

65:3

Tafsir:

Mukhtasar

Hadith:

Bukhari

Reflection:

Trust Allah while taking means.

This creates a complete guidance package.

New RAFIQ Dataset Group

We should extend the Knowledge Acquisition Matrix.

Category H — Hadith Knowledge
HAD-001

Canonical Hadith Collections

Priority:

P0

Tables:

hadith_books

hadith_chapters

hadiths
HAD-002

Hadith Grades

Priority:

P0

Tables:

hadith_grades
HAD-003

SemakHadis Verification Records

Priority:

P0

Tables:

hadith_verifications

Source:

SemakHadis

HAD-004

Hadith Topics

Priority:

P1

Tables:

hadith_topics
HAD-005

Quran-Hadith Links

Priority:

P1

Tables:

quran_hadith_links
Revised RAFIQ Core Knowledge Stack

I would now define RAFIQ V1 Knowledge Base as:

Quran Text

Quran Metadata

Translations
 EN
 MS
 ID

Tafsir
 EN
 ID

Transliteration

Surah Information

Quran Topics

Ayah Themes

Hadith Collections

Hadith Grades

SemakHadis Verification

Quran-Hadith Links

This changes RAFIQ from a Quran guidance app into a much more complete Islamic guidance platform while maintaining strong source verification and authenticity controls.

My next recommendation would be to 
produce a RAFIQ Hadith Knowledge Specification V1, defining the exact database schema, import strategy, grading model, verification workflow, and AI retrieval logic for all hadith-related content.


# RAFIQ Hadith Knowledge Specification V1
Authentic Hadith Intelligence Layer

Version: 1.0

Status: Approved Architecture

Parent Documents:

RAFIQ PRD V1
RAFIQ AI Engine Specification V1
RAFIQ Knowledge Base Specification V1
RAFIQ Database Schema Specification V1
RAFIQ Node Catalog V1
1. Vision

RAFIQ should not merely quote hadith.

RAFIQ should:

Retrieve authentic hadith
Display source references
Display grading
Explain relevance
Connect hadith to Quran themes
Prevent unauthenticated narrations
Support Malay, English, Indonesian, and eventually Chinese users

Goal:

Every hadith shown in RAFIQ should be traceable, verifiable, and contextualized.

2. Design Principles
Principle 1

Authenticity Before Personalization

Never select a hadith solely because it matches a mood.

Authenticity is checked first.

Principle 2

Source Transparency

Every hadith must show:

Book
Chapter
Number
Grade
Source

Example:

Sahih al-Bukhari
Hadith 6463

Grade:
Sahih
Principle 3

No AI-Generated Hadith

AI may explain a hadith.

AI must never invent:

hadith text
grading
references
chains of narration
Principle 4

Verification Layer

All hadith displayed must pass:

Verification Node

before reaching users.

3. Knowledge Architecture
Canonical Collections
          ↓

Grade Database
          ↓

Verification Database
          ↓

Topic Classification
          ↓

Quran-Hadith Linking
          ↓

AI Retrieval Layer
4. Knowledge Sources
Tier A (Primary Sources)

Recommended collections:

P0

Sahih al-Bukhari

Sahih Muslim

P1

Riyad as-Salihin

Jami' at-Tirmidhi

Sunan Abu Dawud

Sunan an-Nasa'i

Sunan Ibn Majah

P2

Al-Adab Al-Mufrad

5. Verification Sources

Priority sources:

Malaysian Layer

SemakHadis

Purpose:

Malay explanations
Viral hadith verification
Fabricated narration detection
International Layer

Sunnah.com

Purpose:

Canonical references
English translations
Scholarly Verification

Dorar al-Sunniyyah

Purpose:

Grading verification
Scholarly authentication
6. Database Architecture
hadith_books
id
slug
name_ar
name_en
name_ms
name_id

author
total_hadith
priority
hadith_chapters
id

book_id

chapter_number

title_ar
title_en
title_ms
title_id
hadiths
id

book_id

chapter_id

hadith_number

text_ar

text_en

text_ms

text_id

narrator

source_url
7. Hadith Grading Model
hadith_grades
id

hadith_id

grade

scholar

source

notes

Supported grades

Sahih

Hasan

Daif

Mawdu

Munkar

Unknown

Display Rules

Grade	Show
Sahih	Yes
Hasan	Yes
Daif	Limited
Mawdu	Never
Unknown	Internal Only
8. Verification Layer
hadith_verifications
id

hadith_id

verification_source

status

explanation

verified_at

Statuses

verified

disputed

weak

fabricated
9. Hadith Topic Engine

Equivalent to QUL Topics.

hadith_topics
id

slug

name_en
name_ms
name_id
name_ar

Examples

Patience

Trust

Prayer

Family

Marriage

Children

Repentance

Provision

Hope

Gratitude

Character

Kindness

Mercy
hadith_topic_links
hadith_id

topic_id

confidence
10. Quran-Hadith Relationship Layer

One of RAFIQ's most valuable features.

quran_hadith_links
id

surah

ayah

hadith_id

relationship_type

Relationship Types

supports

explains

expands

example_of

Example

65:3

↓

Bukhari 6463

↓

Theme:
Tawakkul
11. Multi-Language Strategy

Supported Languages

Language	V1
Arabic	Yes
English	Yes
Malay	Yes
Indonesian	Yes
Chinese	Future

Fallback Rules

Requested Language

↓

Available?

↓

Yes → Display

No

↓

English

↓

Arabic
12. RAFIQ AI Retrieval Logic

Workflow

Theme

↓

Find Quran

↓

Find Tafsir

↓

Find Related Hadith

↓

Check Grade

↓

Check Verification

↓

Build Guidance

Example

Mood

Anxiety

Theme

Tawakkul

Retrieve

Quran
65:2-3

Retrieve

Hadith
Bukhari

Verify

Sahih

Deliver

Quran
+
Tafsir
+
Hadith
+
Reflection
13. New Node Catalog Entries
NODE-H101

Hadith Retrieval Node

Purpose

Find relevant hadith.

Input

{
  "theme": "tawakkul"
}

Output

{
  "hadithId": "BUKHARI_6463"
}
NODE-H102

Grade Verification Node

Purpose

Validate grading.

Output

{
  "grade": "sahih"
}
NODE-H103

Authenticity Filter Node

Purpose

Remove weak or fabricated narrations.

Output

{
  "approved": true
}
NODE-H104

Quran-Hadith Link Node

Purpose

Retrieve supporting hadith.

14. Guidance Package Structure

Updated response:

{
  "theme": {},
  "quran": {},
  "tafsir": {},
  "hadith": {
    "book": "",
    "number": "",
    "grade": "",
    "text": ""
  },
  "reflection": [],
  "action": {},
  "dua": {}
}
15. Safety Rules

Never:

❌ Invent hadith

❌ Invent references

❌ Invent grading

❌ Invent scholars

❌ Invent narrators

Always:

✅ Retrieve from database

✅ Verify source

✅ Verify grading

✅ Display references

16. Import Roadmap
Sprint 1

Import

Bukhari

Muslim
Sprint 2

Import

Riyad as-Salihin

Tirmidhi
Sprint 3

Import

Abu Dawud

Nasa'i

Ibn Majah
Sprint 4

Import

SemakHadis Verification Records
Sprint 5

Build

Topic Engine

Quran-Hadith Links
17. RAFIQ Hadith Core Mission

The Hadith Layer is not intended to become a searchable encyclopedia first.

Its primary role is:

User Situation
        ↓
Theme Detection
        ↓
Quran Guidance
        ↓
Authentic Hadith Support
        ↓
Reflection
        ↓
Action

The result is a guidance system grounded in:

Quran
Tafsir
Authentic Hadith
Verified scholarship
Personal reflection

while maintaining traceability, authenticity, and multilingual accessibility for RAFIQ users. Bismillah.


# RAFIQ Hadith Knowledge Specification V1
Authentic Hadith Intelligence Layer

Version: 1.0

Status: Approved Architecture

Parent Documents:

RAFIQ PRD V1
RAFIQ AI Engine Specification V1
RAFIQ Knowledge Base Specification V1
RAFIQ Database Schema Specification V1
RAFIQ Node Catalog V1
1. Vision

RAFIQ should not merely quote hadith.

RAFIQ should:

Retrieve authentic hadith
Display source references
Display grading
Explain relevance
Connect hadith to Quran themes
Prevent unauthenticated narrations
Support Malay, English, Indonesian, and eventually Chinese users

Goal:

Every hadith shown in RAFIQ should be traceable, verifiable, and contextualized.

2. Design Principles
Principle 1

Authenticity Before Personalization

Never select a hadith solely because it matches a mood.

Authenticity is checked first.

Principle 2

Source Transparency

Every hadith must show:

Book
Chapter
Number
Grade
Source

Example:

Sahih al-Bukhari
Hadith 6463

Grade:
Sahih
Principle 3

No AI-Generated Hadith

AI may explain a hadith.

AI must never invent:

hadith text
grading
references
chains of narration
Principle 4

Verification Layer

All hadith displayed must pass:

Verification Node

before reaching users.

3. Knowledge Architecture
Canonical Collections
          ↓

Grade Database
          ↓

Verification Database
          ↓

Topic Classification
          ↓

Quran-Hadith Linking
          ↓

AI Retrieval Layer
4. Knowledge Sources
Tier A (Primary Sources)

Recommended collections:

P0

Sahih al-Bukhari

Sahih Muslim

P1

Riyad as-Salihin

Jami' at-Tirmidhi

Sunan Abu Dawud

Sunan an-Nasa'i

Sunan Ibn Majah

P2

Al-Adab Al-Mufrad

5. Verification Sources

Priority sources:

Malaysian Layer

SemakHadis

Purpose:

Malay explanations
Viral hadith verification
Fabricated narration detection
International Layer

Sunnah.com

Purpose:

Canonical references
English translations
Scholarly Verification

Dorar al-Sunniyyah

Purpose:

Grading verification
Scholarly authentication
6. Database Architecture
hadith_books
id
slug
name_ar
name_en
name_ms
name_id

author
total_hadith
priority
hadith_chapters
id

book_id

chapter_number

title_ar
title_en
title_ms
title_id
hadiths
id

book_id

chapter_id

hadith_number

text_ar

text_en

text_ms

text_id

narrator

source_url
7. Hadith Grading Model
hadith_grades
id

hadith_id

grade

scholar

source

notes

Supported grades

Sahih

Hasan

Daif

Mawdu

Munkar

Unknown

Display Rules

Grade	Show
Sahih	Yes
Hasan	Yes
Daif	Limited
Mawdu	Never
Unknown	Internal Only
8. Verification Layer
hadith_verifications
id

hadith_id

verification_source

status

explanation

verified_at

Statuses

verified

disputed

weak

fabricated
9. Hadith Topic Engine

Equivalent to QUL Topics.

hadith_topics
id

slug

name_en
name_ms
name_id
name_ar

Examples

Patience

Trust

Prayer

Family

Marriage

Children

Repentance

Provision

Hope

Gratitude

Character

Kindness

Mercy
hadith_topic_links
hadith_id

topic_id

confidence
10. Quran-Hadith Relationship Layer

One of RAFIQ's most valuable features.

quran_hadith_links
id

surah

ayah

hadith_id

relationship_type

Relationship Types

supports

explains

expands

example_of

Example

65:3

↓

Bukhari 6463

↓

Theme:
Tawakkul
11. Multi-Language Strategy

Supported Languages

Language	V1
Arabic	Yes
English	Yes
Malay	Yes
Indonesian	Yes
Chinese	Future

Fallback Rules

Requested Language

↓

Available?

↓

Yes → Display

No

↓

English

↓

Arabic
12. RAFIQ AI Retrieval Logic

Workflow

Theme

↓

Find Quran

↓

Find Tafsir

↓

Find Related Hadith

↓

Check Grade

↓

Check Verification

↓

Build Guidance

Example

Mood

Anxiety

Theme

Tawakkul

Retrieve

Quran
65:2-3

Retrieve

Hadith
Bukhari

Verify

Sahih

Deliver

Quran
+
Tafsir
+
Hadith
+
Reflection
13. New Node Catalog Entries
NODE-H101

Hadith Retrieval Node

Purpose

Find relevant hadith.

Input

{
  "theme": "tawakkul"
}

Output

{
  "hadithId": "BUKHARI_6463"
}
NODE-H102

Grade Verification Node

Purpose

Validate grading.

Output

{
  "grade": "sahih"
}
NODE-H103

Authenticity Filter Node

Purpose

Remove weak or fabricated narrations.

Output

{
  "approved": true
}
NODE-H104

Quran-Hadith Link Node

Purpose

Retrieve supporting hadith.

14. Guidance Package Structure

Updated response:

{
  "theme": {},
  "quran": {},
  "tafsir": {},
  "hadith": {
    "book": "",
    "number": "",
    "grade": "",
    "text": ""
  },
  "reflection": [],
  "action": {},
  "dua": {}
}
15. Safety Rules

Never:

❌ Invent hadith

❌ Invent references

❌ Invent grading

❌ Invent scholars

❌ Invent narrators

Always:

✅ Retrieve from database

✅ Verify source

✅ Verify grading

✅ Display references

16. Import Roadmap
Sprint 1

Import

Bukhari

Muslim
Sprint 2

Import

Riyad as-Salihin

Tirmidhi
Sprint 3

Import

Abu Dawud

Nasa'i

Ibn Majah
Sprint 4

Import

SemakHadis Verification Records
Sprint 5

Build

Topic Engine

Quran-Hadith Links
17. RAFIQ Hadith Core Mission

The Hadith Layer is not intended to become a searchable encyclopedia first.

Its primary role is:

User Situation
        ↓
Theme Detection
        ↓
Quran Guidance
        ↓
Authentic Hadith Support
        ↓
Reflection
        ↓
Action

The result is a guidance system grounded in:

Quran
Tafsir
Authentic Hadith
Verified scholarship
Personal reflection

while maintaining traceability, authenticity, and multilingual accessibility for RAFIQ users. Bismillah.

4. Fawaz Ahmed Hadiths

Repository:

fawazahmed0 Hadiths Repository

What It Contains

This repository is extremely interesting for RAFIQ because it focuses on:

JSON structured hadith datasets
Multiple languages
API-friendly organization
Easy filtering and distribution
Lightweight deployment

It includes collections and metadata that are easier to consume than many traditional hadith datasets.

RAFIQ Score

⭐⭐⭐⭐☆

Why It Matters

The AhmedBaset dataset is the best master source.

The Fawaz dataset is an excellent distribution source.

Think of it this way:

AhmedBaset
    ↓
Master Database

Fawaz
    ↓
Alternative Validation
RAFIQ Decision

P1

Import selected metadata.

Do not use as primary source.

Use for:

Cross validation
Language comparison
Data quality checks
Comparison of All Sources
Quran Layer
Source	Status
QUL	Master Source
Others	Not Needed

Winner:

✅ QUL

Hadith Layer
Source	Status
hadith-json	Master Source
LK-Hadith-Corpus	AI Layer
SemakHadis	Verification Layer
Fawaz Hadiths	Validation Layer
Sunnah API	Reference Only

Winner:

✅ Combined Architecture

Revised RAFIQ Hadith Architecture

Instead of:

Hadith Database

We should now build:

Canonical Hadith Layer
        ↓
Hadith Grade Layer
        ↓
Hadith Verification Layer
        ↓
Hadith Topic Layer
        ↓
AI Semantic Layer
New Knowledge Sources
Layer 1 — Canonical Collections

Source:

hadith-json Repository

Contains:

50,884 Hadiths
17 Collections
Arabic
English

This becomes:

hadiths
hadith_books
hadith_chapters
Layer 2 — AI Semantic Corpus

Source:

LK-Hadith-Corpus Repository

Contains:

39,038 Hadiths

Matn

Isnad

Grades

Annotations

This becomes:

hadith_matn

hadith_isnad

hadith_embeddings

hadith_annotations
Layer 3 — Verification Layer

Source:

SemakHadis

Purpose:

Weak Hadith Detection

Fabricated Hadith Detection

Malay Explanations

This becomes:

hadith_verifications
Layer 4 — Scholar Grading Layer

Sources:

Dorar al-Sunniyyah
SemakHadis

Tables:

hadith_grades
Layer 5 — Topic Engine

Generated by RAFIQ.

Tables:

hadith_topics

hadith_topic_links

Examples:

Patience

Trust

Prayer

Family

Marriage

Children

Provision

Repentance

Hope

Gratitude
New RAFIQ Knowledge Base Structure
QURAN DOMAIN

quran_surahs
quran_ayahs

translations
tafsir

surah_information

topics
topic_relations

ayah_themes

similar_ayahs


HADITH DOMAIN

hadith_books
hadith_chapters
hadiths

hadith_grades

hadith_verifications

hadith_topics

hadith_topic_links

hadith_embeddings

hadith_annotations

hadith_isnad

quran_hadith_links
Most Important Discovery

The biggest change from the original RAFIQ design is this:

Originally:

AI
 ↓
Theme
 ↓
Quran
 ↓
Reflection

Now:

AI
 ↓
Theme
 ↓
Quran
 ↓
Tafsir
 ↓
Hadith
 ↓
Verification
 ↓
Reflection
 ↓
Action

This is much stronger Islamically.

My Final Recommendation Before Locking RAFIQ V1
Adopt

✅ QUL (Quran Foundation)

✅ hadith-json (Canonical Hadith Foundation)

✅ LK-Hadith-Corpus (AI & Semantic Search)

✅ SemakHadis (Malay Verification Layer)

✅ Dorar al-Sunniyyah (Grading Verification)

Do Not Depend On

❌ Third-party runtime APIs

❌ External retrieval during user requests

❌ AI-generated religious content

RAFIQ Knowledge Foundation V1 (Final)

If I were the system architect, I would lock RAFIQ V1 around five pillars:

1. Quran Text
   (QUL)

2. Quran Knowledge
   (QUL)

3. Hadith Collections
   (hadith-json)

4. Hadith Intelligence
   (LK-Hadith-Corpus)

5. Hadith Verification
   (SemakHadis + Dorar)

With these five pillars, RAFIQ has a knowledge foundation strong enough to support:

Daily Guidance
AI Companion
Theme-Based Recommendations
Reflection Engine
Hadith Discovery
Quran-Hadith Linking
Multilingual Support (Arabic, English, Malay, Indonesian, Chinese)
Future Scholar Mode
Future Quran Study Mode
Future Hadith Study Mode

without needing a major redesign later. Bismillah.

# Yes. The recent QUL audit and Hadith ecosystem audit have significantly expanded RAFIQ's scope. Several documents are now partially outdated and should be revised before we lock RAFIQ V1.

I would classify them into three groups:

Group A — Must Update Immediately

These documents now contain architectural gaps because we originally designed RAFIQ as mostly a Quran + Tafsir platform.

1. RAFIQ Knowledge Base Specification V1

Status:

🔴 Major Update Required

Reason:

Originally included:

Quran
Translations
Tafsir
Themes
Topics

Now must include:

QUL Resources

Hadith Collections

Hadith Grades

SemakHadis Verification

Dorar Verification

LK-Hadith Corpus

Quran-Hadith Links

Hadith Topics

Hadith Embeddings

New Version:

RAFIQ Knowledge Base Specification V2
2. RAFIQ Database Schema & ERD Specification V1

Status:

🔴 Major Update Required

Reason:

Current schema lacks:

hadith_books

hadith_chapters

hadiths

hadith_grades

hadith_verifications

hadith_topics

hadith_topic_links

hadith_embeddings

hadith_annotations

hadith_isnad

quran_hadith_links

This is the biggest database change.

New Version:

Database Schema V2
3. RAFIQ AI Engine Specification V1

Status:

🔴 Major Update Required

Reason:

Current AI flow:

Mood
 ↓
Theme
 ↓
Quran
 ↓
Reflection

New flow:

Mood
 ↓
Theme
 ↓
Quran
 ↓
Tafsir
 ↓
Hadith
 ↓
Verification
 ↓
Reflection
 ↓
Action

The retrieval engine changes substantially.

New Version:

AI Engine Specification V2
4. RAFIQ Node Catalog V1

Status:

🔴 Major Update Required

Reason:

We introduced:

NODE-H101

Hadith Retrieval

NODE-H102

Grade Verification

NODE-H103

Authenticity Filter

NODE-H104

Quran-Hadith Linking

These need to be merged into the official catalog.

New Version:

Node Catalog V2
Group B — Recommended Updates

These are still valid but should be enhanced.

5. RAFIQ Product Requirements Document (PRD) V1

Status:

🟡 Enhancement

Add new capabilities:

Verified Hadith Guidance

Hadith Search

Hadith Verification

Quran-Hadith Discovery

Scholar Mode (Future)
6. RAFIQ UX Specification V1

Status:

🟡 Enhancement

Add screens:

Hadith Card

Hadith Details

Verification Badge

Source References

Quran ↔ Hadith Links
7. RAFIQ Figma Build Pack V1

Status:

🟡 Enhancement

New components:

Hadith Card

Grade Badge

Verification Banner

Source Citation Card

Related Hadith Carousel

Quran-Hadith Link Card
8. RAFIQ Backend Blueprint V1

Status:

🟡 Enhancement

Add modules:

hadith

verification

grading

topic-engine
9. RAFIQ Development Blueprint V1

Status:

🟡 Enhancement

Add import pipelines:

QUL Import

Hadith JSON Import

LK Corpus Import

SemakHadis Import
Group C — New Documents That Did Not Exist Before

These should be created.

10. RAFIQ Hadith Knowledge Specification V1

✅ Completed

11. RAFIQ Knowledge Acquisition Matrix V2

Status:

Needs formal release

Contains:

QUL Audit

Hadith Audit

Dataset Inventory

Import Priority
12. RAFIQ Data Import Pipeline Specification V1

Not yet created.

Purpose:

Download

Transform

Validate

Import

Version

for:

QUL
hadith-json
LK Corpus
SemakHadis
13. RAFIQ Knowledge Graph Specification V1

Not yet created.

Purpose:

Topic Graph

Theme Graph

Quran ↔ Topic

Hadith ↔ Topic

Quran ↔ Hadith

This will become the intelligence layer behind guidance.

14. RAFIQ Retrieval & Ranking Engine Specification V1

Not yet created.

Purpose:

How RAFIQ chooses:

Mood

↓

Theme

↓

Best Quran

↓

Best Tafsir

↓

Best Hadith

↓

Best Reflection

This is arguably the most important AI document after the Knowledge Base.

Recommended Update Order

If we continue tomorrow, I would update in this sequence:

Phase 1 (Critical)
RAFIQ Knowledge Base Specification V2
RAFIQ Database Schema & ERD Specification V2
RAFIQ AI Engine Specification V2
RAFIQ Node Catalog V2
Phase 2 (New Core Documents)
RAFIQ Knowledge Graph Specification V1
RAFIQ Retrieval & Ranking Engine Specification V1
RAFIQ Data Import Pipeline Specification V1
Phase 3 (Product Layer)
RAFIQ PRD V2
RAFIQ UX Specification V2
RAFIQ Figma Build Pack V2

At this point, RAFIQ would have a complete architecture built on:

Quran (QUL)
Tafsir (QUL)
Topics & Themes (QUL)
Hadith Collections (hadith-json)
Hadith Intelligence (LK-Hadith-Corpus)
Hadith Verification (SemakHadis + Dorar)
AI Personalization Layer (RAFIQ)

which is a much stronger foundation than the original V1 design. Bismillah.


# RAFIQ Knowledge Base Specification V2
Quran + Hadith Intelligence Foundation

Version: 2.0
Status: Architecture Locked
Supersedes: RAFIQ Knowledge Base Specification V1

1. Purpose

The RAFIQ Knowledge Base is the trusted religious foundation behind all AI guidance, recommendations, reflections, and learning experiences.

RAFIQ shall not rely on generative AI as a source of religious knowledge.

Instead:

Knowledge Base
      ↓
Retrieval Engine
      ↓
AI Reasoning Layer
      ↓
Personalized Guidance

AI explains.

Knowledge Base provides truth.

2. Core Principles
Principle 1 — Source First

Every answer must originate from:

Quran
Tafsir
Authentic Hadith
Verified Scholarly Sources

Never from AI-generated religious content.

Principle 2 — Traceability

Every religious statement must be traceable.

Example:

Surah:
Al-Baqarah

Ayah:
2:286

Translation:
Saheeh International

Tafsir:
Mukhtasar

Hadith:
Sahih Muslim 2699

Grade:
Sahih
Principle 3 — Verification Before Delivery

Every hadith passes:

Hadith
   ↓
Grade Check
   ↓
Verification Check
   ↓
Display
Principle 4 — Multilingual Foundation

Supported V1 Languages:

Language	Status
Arabic	Core
English	Core
Malay	Core
Indonesian	Core
Chinese	Future Ready
3. Knowledge Domains

RAFIQ V2 consists of six major domains.

Quran Domain

Tafsir Domain

Hadith Domain

Verification Domain

Theme Domain

Relationship Domain
4. Quran Domain

Primary Source:

QUL Resources Portal

quran_surahs

Stores:

Surah Number
Arabic Name
English Name
Malay Name
Indonesian Name

Revelation Type

Ayah Count
quran_ayahs

Stores:

Surah
Ayah

Arabic Text

Juz

Hizb

Page

Ruku
quran_transliterations

Stores:

Ayah

Transliteration

Language
quran_metadata

Stores:

Juz

Hizb

Rub

Manzil

Sajdah
5. Translation Domain

Purpose:

Localized Quran understanding.

translations

Schema

id

ayah_id

language

translator

text

version
Initial Translation Set
English
Saheeh International
Al-Mukhtasar
Yusuf Ali
Malay
Abdullah Basmeih
Indonesian
Kementerian Agama RI
Chinese
Ma Jian (Future)
6. Tafsir Domain

Purpose:

Contextual understanding.

tafsir_sources

Stores:

Source

Author

Language

Methodology
tafsir_entries

Stores:

Ayah

Source

Language

Commentary
Initial Tafsir Set
Arabic
Tafsir al-Muyassar
Tafsir al-Saadi
Tafsir Ibn Kathir
English
Mukhtasar Tafsir
Indonesian
Mukhtasar Tafsir
7. Hadith Domain

Primary Source:

hadith-json Repository

hadith_books

Stores:

Book Name

Author

Collection Type

Priority
hadith_chapters

Stores:

Book

Chapter Number

Title
hadiths

Stores:

Book

Chapter

Number

Arabic Text

English Text

Narrator
Initial Collections

P0:

Sahih al-Bukhari
Sahih Muslim

P1:

Riyad as-Salihin
Jami' at-Tirmidhi
Sunan Abu Dawud
Sunan an-Nasa'i
Sunan Ibn Majah
8. Hadith Intelligence Domain

Primary Source:

LK-Hadith-Corpus Repository

hadith_isnad

Stores:

Narration Chain
Narrators
Structure
hadith_matn

Stores:

Hadith Text

Normalized Text

Keywords
hadith_annotations

Stores:

Metadata

Sections

Topics

Relationships
hadith_embeddings

Stores:

Embedding Vector

Language

Model Version

Purpose:

Semantic retrieval.

9. Verification Domain

Purpose:

Protect authenticity.

hadith_grades

Sources:

Dorar al-Sunniyyah
Collection Metadata

Stores:

Hadith

Grade

Scholar

Reference
hadith_verifications

Primary Source:

SemakHadis

Stores:

Claim

Verification

Explanation

Reference

Status

Statuses

Verified

Weak

Fabricated

Disputed
10. Theme Domain

Primary Source:

QUL Topics & Concepts

topics

Stores:

Topic

Description

Language

Examples:

Sabr

Tawakkul

Shukr

Tawbah

Rahmah

Ikhlas
topic_relations

Stores:

Parent Topic

Child Topic

Relationship
ayah_themes

Stores:

Ayah

Theme

Confidence
hadith_topics

Stores:

Hadith

Theme

Confidence
11. Relationship Domain

The most important RAFIQ innovation.

quran_hadith_links

Stores:

Ayah

Hadith

Relationship

Types:

Explains

Supports

Expands

Example Of
related_ayahs

Source:

QUL Similar Ayahs

Stores:

Ayah

Related Ayah

Similarity
related_hadiths

Generated

Stores:

Hadith

Related Hadith

Similarity
12. Guidance Knowledge Package

Every RAFIQ recommendation is built from:

Theme
  ↓

Quran
  ↓

Translation
  ↓

Tafsir
  ↓

Hadith
  ↓

Verification
  ↓

Reflection
  ↓

Action
13. Knowledge Acquisition Sources
Quran Stack
Source	Role
QUL	Quran Foundation
QUL Topics	Theme Engine
QUL Tafsir	Commentary
QUL Similar Ayahs	Discovery
Hadith Stack
Source	Role
hadith-json	Canonical Collections
LK-Hadith-Corpus	Semantic Intelligence
SemakHadis	Verification
Dorar al-Sunniyyah	Grading
14. Content Governance

Every record in RAFIQ must include:

Source

Source Version

Imported Date

Language

License

Last Validation Date

This enables future updates, audits, and scholarly review.

15. RAFIQ Knowledge Base V2 Architecture
QUL
(Quran)

          +
          
Hadith JSON
(Hadith)

          +

LK Corpus
(Intelligence)

          +

SemakHadis
(Verification)

          +

Dorar
(Grading)

          ↓

RAFIQ Knowledge Graph

          ↓

Retrieval Engine

          ↓

AI Companion

          ↓

Personalized Guidance
V2 Outcome

The RAFIQ Knowledge Base is no longer a Quran content repository.

It becomes a structured Islamic Knowledge Graph containing:

Quran text
Multi-language translations
Tafsir
Authentic hadith collections
Hadith grading
Hadith verification
Quran themes
Hadith themes
Quran–Hadith relationships
Semantic retrieval intelligence

This provides the foundation for every future RAFIQ capability, from daily guidance and companion chat to study mode, scholar mode, and advanced Islamic knowledge discovery. Bismillah.


# RAFIQ Database Schema & ERD Specification V2
Quran + Hadith Intelligence Platform

Version: 2.0
Status: Architecture Design
Supersedes: Database Schema & ERD Specification V1

1. Database Philosophy

RAFIQ is not a CRUD application.

RAFIQ is a Knowledge Retrieval System.

The database must support:

Knowledge Storage

Knowledge Relationships

Knowledge Retrieval

AI Personalization

Future Semantic Search

Therefore we separate the database into:

Foundation Layer
Knowledge Layer
Relationship Layer
Personalization Layer
System Layer
2. High-Level ERD
USERS
 │
 ├── user_profiles
 ├── user_preferences
 ├── user_moods
 ├── user_journeys
 │
 ▼

THEMES
 │
 ├── topics
 ├── topic_relations
 │
 ▼

QURAN
 │
 ├── surahs
 ├── ayahs
 ├── translations
 ├── tafsir
 ├── ayah_themes
 │
 ▼

HADITH
 │
 ├── hadith_books
 ├── hadith_chapters
 ├── hadiths
 ├── hadith_grades
 ├── hadith_topics
 │
 ▼

KNOWLEDGE GRAPH
 │
 ├── quran_hadith_links
 ├── related_ayahs
 ├── related_hadiths
 │
 ▼

GUIDANCE ENGINE
 │
 ├── guidance_packages
 ├── reflections
 ├── actions
3. Foundation Layer
users

Managed by Supabase Auth.

id UUID PK

email

created_at
user_profiles
id UUID PK

user_id UUID FK

display_name

language

country

timezone

created_at
updated_at
user_preferences
id UUID PK

user_id UUID FK

preferred_language

translation_source

tafsir_source

daily_reminder_enabled

theme_preferences
4. Quran Domain
quran_surahs
id BIGINT PK

surah_number

name_ar

name_en

name_ms

name_id

revelation_type

ayah_count

description
quran_ayahs
id BIGINT PK

surah_id FK

ayah_number

text_ar

juz

hizb

rub

manzil

page

sajdah

Index:

surah_id
ayah_number
quran_translations
id BIGINT PK

ayah_id FK

language

translator

text

version

Indexes:

ayah_id

language
quran_tafsir
id BIGINT PK

ayah_id FK

source

language

content

Indexes:

ayah_id

source
surah_information
id BIGINT PK

surah_id FK

language

summary

themes

revelation_context
5. Theme Domain
topics
id BIGINT PK

slug

name_ar

name_en

name_ms

name_id

description

Examples:

sabr

tawakkul

rahmah

shukr

tawbah
topic_relations
id BIGINT PK

parent_topic_id FK

child_topic_id FK

relationship_type

Example:

Tawakkul
 └─ Sabr
ayah_themes
id BIGINT PK

ayah_id FK

topic_id FK

confidence_score
6. Hadith Domain
hadith_books
id BIGINT PK

slug

name_ar

name_en

author

total_hadiths

priority

Examples:

Bukhari
Muslim
Tirmidhi
hadith_chapters
id BIGINT PK

book_id FK

chapter_number

title_ar

title_en

title_ms

title_id
hadiths
id BIGINT PK

book_id FK

chapter_id FK

hadith_number

text_ar

text_en

text_ms

text_id

narrator

source_reference

Indexes:

book_id

chapter_id

hadith_number
hadith_grades
id BIGINT PK

hadith_id FK

grade

scholar

reference

Allowed grades:

SAHIH

HASAN

DAIF

MAWDU

UNKNOWN
hadith_topics
id BIGINT PK

hadith_id FK

topic_id FK

confidence_score
7. Hadith Intelligence Domain

From LK-Hadith-Corpus.

hadith_isnad
id BIGINT PK

hadith_id FK

chain_text

narrators_json
hadith_annotations
id BIGINT PK

hadith_id FK

section

chapter

keywords_json

metadata_json
hadith_embeddings
id UUID PK

hadith_id FK

embedding vector(1536)

model_version

For PostgreSQL + pgvector.

8. Verification Domain
hadith_verifications
id BIGINT PK

hadith_id FK NULL

claim_text

source

status

explanation

reference_url

verified_at

Status:

VERIFIED

WEAK

FABRICATED

DISPUTED
9. Relationship Domain
quran_hadith_links

This table is the heart of RAFIQ.

id BIGINT PK

ayah_id FK

hadith_id FK

relationship_type

confidence_score

Types:

SUPPORTS

EXPLAINS

EXPANDS

EXAMPLE_OF
related_ayahs
id BIGINT PK

ayah_id FK

related_ayah_id FK

similarity_score

Source:

QUL Similar Ayahs

related_hadiths
id BIGINT PK

hadith_id FK

related_hadith_id FK

similarity_score

Generated by RAFIQ.

10. Guidance Domain
guidance_sessions

Stores user interactions.

id UUID PK

user_id FK

detected_theme

mood

created_at
guidance_packages

Generated recommendations.

id UUID PK

session_id FK

ayah_id FK

hadith_id FK

reflection

action_item

created_at
saved_guidance

Bookmarks.

id UUID PK

user_id FK

guidance_id FK

saved_at
11. Personalization Domain
user_moods
id UUID PK

user_id FK

mood

confidence

captured_at

Examples:

anxious

sad

grateful

hopeful

confused
user_journeys

Tracks growth.

id UUID PK

user_id FK

theme

progress

started_at
12. AI Retrieval Layer Tables
retrieval_logs
id UUID PK

user_id FK

query

detected_theme

result_count

created_at
ranking_feedback
id UUID PK

user_id FK

guidance_id FK

rating

feedback
13. Recommended Supabase Extensions
pgvector

Required.

CREATE EXTENSION vector;

Used by:

hadith_embeddings
future ayah_embeddings
pg_trgm

Required.

CREATE EXTENSION pg_trgm;

Used for:

Arabic Search

Malay Search

English Search
14. Future V3 Tables

Not required initially.

ayah_embeddings
ayah_id

embedding
scholar_notes
scholar

commentary
learning_paths
topic

milestones
15. Final ERD (Simplified)
TOPICS
 │
 ├─ ayah_themes
 │
 ▼

QURAN_AYAHS
 │
 ├─ translations
 ├─ tafsir
 │
 ▼

QURAN_HADITH_LINKS
 │
 ▼

HADITHS
 │
 ├─ grades
 ├─ topics
 ├─ isnad
 ├─ annotations
 │
 ▼

GUIDANCE_PACKAGES
 │
 ▼

USERS
Database Sizing Estimate (V1)
Domain	Records
Quran Ayahs	6,236
Translations	25,000+
Tafsir	10,000+
Topics	2,500+
Ayah Themes	1,000+
Hadiths	~50,000
Hadith Grades	~50,000
Quran-Hadith Links	10,000–30,000
Embeddings	50,000+

Estimated Supabase Postgres size:

1–3 GB initially, which is very manageable.

Architecture Decision

RAFIQ V2 should be built as a Knowledge Graph backed by PostgreSQL + pgvector, not as a traditional relational app.

This decision enables future capabilities such as:

AI Companion
Semantic Quran Search
Semantic Hadith Search
Theme-Based Guidance
Quran ↔ Hadith Discovery
Personalized Growth Journeys
Scholar Mode

without redesigning the database later. Bismillah.


# RAFIQ AI Engine Specification V2
Personal Islamic Guidance Intelligence System

Version: 2.0
Status: Architecture Locked
Supersedes: RAFIQ AI Engine Specification V1

1. Vision

RAFIQ is not a chatbot.

RAFIQ is an Islamic Guidance Engine.

The objective is not to answer questions.

The objective is to help a Muslim:

Strengthen relationship with Allah
Build daily Quran engagement
Develop consistent ibadah
Navigate life situations with Islamic guidance
Reflect and act
RAFIQ Core Mission
User State
      ↓
Understand Situation
      ↓
Find Relevant Guidance
      ↓
Provide Reflection
      ↓
Suggest Action
      ↓
Encourage Consistency
2. AI Design Philosophy
Traditional Chatbot
User Question
      ↓
LLM
      ↓
Answer

Problems:

Hallucinations
Weak sourcing
Inconsistent guidance
RAFIQ Approach
User Input
      ↓
Theme Detection
      ↓
Knowledge Retrieval
      ↓
Verification
      ↓
Guidance Assembly
      ↓
AI Personalization
      ↓
Response

The AI does not create religious knowledge.

The AI organizes trusted knowledge.

3. RAFIQ Intelligence Layers
Layer 1
User Understanding

Layer 2
Theme Engine

Layer 3
Knowledge Retrieval

Layer 4
Verification

Layer 5
Guidance Builder

Layer 6
Personalization

Layer 7
Companion Response
4. Layer 1 — User Understanding Engine

Purpose:

Understand what the user needs.

Inputs
Explicit
I feel anxious.

I lost my job.

I am struggling to pray.
Implicit
Reading history

Saved verses

Recent themes

Time of day

Engagement behavior
Output
{
  "situation": "anxiety",
  "confidence": 0.93
}
5. Layer 2 — Theme Engine

The heart of RAFIQ.

Purpose:

Convert user situations into Islamic themes.

Example Mapping
Situation	Theme
Anxiety	Tawakkul
Sadness	Sabr
Gratitude	Shukr
Sin	Tawbah
Anger	Akhlaq
Family Conflict	Rahmah
Financial Stress	Rizq
Fear	Yaqin
Confusion	Hidayah
Output
{
  "primaryTheme": "tawakkul",
  "secondaryThemes": [
    "sabr",
    "yaqin"
  ]
}
6. Layer 3 — Knowledge Retrieval Engine

Purpose:

Find the most relevant Quran and Hadith.

Retrieval Sequence
Theme
   ↓

Topics

   ↓

Ayah Themes

   ↓

Quran

   ↓

Tafsir

   ↓

Hadith Topics

   ↓

Hadith
Sources
Quran

From:

QUL Ayah Themes
QUL Topics
Hadith

From:

hadith-json
LK-Hadith-Corpus
Retrieval Output
{
  "ayahs": [],
  "tafsir": [],
  "hadiths": []
}
7. Layer 4 — Verification Engine

Most important safety layer.

Quran Validation

Always trusted.

Quran
    ↓
Approved
Hadith Validation
Hadith
   ↓
Grade Check
   ↓
Verification Check
   ↓
Approved
Allowed
Sahih

Hasan
Restricted
Daif

May be shown only:

educational mode
clearly labeled
Blocked
Mawdu

Fabricated

Never shown.

Verification Sources
SemakHadis
Dorar al-Sunniyyah
Collection metadata
8. Layer 5 — Guidance Builder

Purpose:

Create a structured guidance package.

Guidance Package Structure
{
  "theme": {},
  "quran": {},
  "translation": {},
  "tafsir": {},
  "hadith": {},
  "reflection": {},
  "action": {}
}
Example

Theme:

Tawakkul

Retrieve:

Quran
65:2-3

Retrieve:

Sahih Muslim

Build:

Trust Allah.

Take lawful means.

Remain patient.

Continue effort.
9. Layer 6 — Personalization Engine

Purpose:

Adapt guidance to the user.

Personalization Inputs
Language

Saved Guidance

Reading History

Favorite Themes

Journey Progress
Example

New User:

Short Reflection

Advanced User:

Long Reflection

Additional Tafsir

Additional Hadith
10. Layer 7 — Companion Engine

The RAFIQ personality layer.

RAFIQ Is
Supportive

Gentle

Reflective

Encouraging

Grounded
RAFIQ Is Not
Scholar

Mufti

Fatwa Authority

Debater
11. Daily Guidance Engine

Automatic recommendation system.

Trigger

Morning

After Fajr

Lunch

Evening

Before Sleep

Inputs
Recent Themes

Reading Activity

Mood History
Output
{
  "dailyGuidance": {}
}
12. Reflection Engine

Purpose:

Generate personal reflections.

Sources
Quran

Tafsir

Hadith
AI Role

Allowed:

Summarize

Explain

Connect

Reflect

Not Allowed:

Invent Rulings

Invent Hadith

Invent Tafsir
Example Reflection

User:

I am worried about my future.

Theme:

Tawakkul

Reflection:

This verse reminds us that provision
comes from Allah in ways we may not
expect. Trust does not mean inaction.
It means continuing to strive while
placing the outcome in Allah's hands.
13. Action Recommendation Engine

Purpose:

Convert reflection into action.

Examples

Theme:

Sabr

Actions:

Read Surah Al-Inshirah

Make dua after Maghrib

Write 3 blessings today

Theme:

Tawbah

Actions:

Pray 2 rakaat

Seek forgiveness 100 times

Reflect on one habit to improve
14. AI Retrieval Ranking Formula

Candidate Score:

Score=(0.35×ThemeMatch)+(0.25×Verification)+(0.20×UserRelevance)+(0.10×Recency)+(0.10×Engagement)

Ranking Priorities
Theme Match
Authenticity
User Relevance
User Engagement

Authenticity always outranks popularity.

15. AI Safety Rules
Never Generate

❌ Quran verses

❌ Hadith text

❌ Hadith grading

❌ Fatwas

❌ Legal rulings

❌ Scholarly consensus claims

Always Retrieve

✅ Quran

✅ Tafsir

✅ Hadith

✅ Verification

from Knowledge Base.

16. Future V3 AI Capabilities
Semantic Search

User:

Show me verses about loneliness.

Engine:

Loneliness
  ↓
Themes
  ↓
Related Quran
Conversational Study
Explain this verse.

Show tafsir.

Show related hadith.
Guided Journeys

Examples:

30 Days of Tawakkul

30 Days of Sabr

Ramadan Journey
17. RAFIQ AI Flow
User Input
      ↓

User Understanding
      ↓

Theme Detection
      ↓

Quran Retrieval
      ↓

Tafsir Retrieval
      ↓

Hadith Retrieval
      ↓

Verification
      ↓

Guidance Builder
      ↓

Reflection
      ↓

Action Recommendation
      ↓

Companion Response
18. Success Definition

A successful RAFIQ response is not one that gives the longest answer.

A successful response helps the user:

Understand

Reflect

Act

Grow

using:

Quran
Tafsir
Authentic Hadith
Verified scholarship
Personalized context

while ensuring that all religious content remains sourced, traceable, and authentic.

Bismillah.

# RAFIQ Node Catalog V2
Quran + Hadith Guidance Engine

Version: 2.0
Status: Architecture Locked
Supersedes: Node Catalog V1

1. Purpose

The RAFIQ AI Engine is built from modular nodes.

A node is a self-contained processing unit with:

Input
 ↓
Logic
 ↓
Output

Benefits:

Easier maintenance
Easier testing
Easier AI upgrades
Easier workflow design
Future no-code workflow builder
2. RAFIQ Engine Architecture
USER
 ↓

Understanding Layer

 ↓

Theme Layer

 ↓

Knowledge Retrieval Layer

 ↓

Verification Layer

 ↓

Guidance Layer

 ↓

Personalization Layer

 ↓

Response Layer
3. Node Categories
Prefix	Category
U	User Understanding
T	Theme Engine
Q	Quran Engine
H	Hadith Engine
V	Verification Engine
G	Guidance Engine
P	Personalization Engine
R	Response Engine
S	System Nodes
USER UNDERSTANDING LAYER
NODE-U101
User Input Parser

Purpose:

Normalize user input.

Input:

{
  "message": "I feel worried."
}

Output:

{
  "cleanedText": "I feel worried"
}
NODE-U102
Intent Detection

Purpose:

Identify user intent.

Outputs:

guidance

question

study

reflection

search
NODE-U103
Situation Detection

Purpose:

Identify life situation.

Examples:

anxiety

stress

grief

gratitude

anger

confusion

hope

Output:

{
  "situation": "anxiety",
  "confidence": 0.93
}
NODE-U104
Mood Detection

Purpose:

Detect emotional state.

Input:

I am overwhelmed.

Output:

{
  "mood": "anxious"
}
THEME ENGINE
NODE-T201
Primary Theme Detection

Purpose:

Convert situation into Islamic theme.

Example:

anxiety
 ↓
tawakkul

Output:

{
  "theme": "tawakkul"
}
NODE-T202
Secondary Theme Expansion

Purpose:

Find related themes.

Example:

tawakkul
 ↓
sabr
 ↓
yaqin

Output:

{
  "themes": [
    "tawakkul",
    "sabr",
    "yaqin"
  ]
}
NODE-T203
Topic Graph Retrieval

Purpose:

Retrieve topic hierarchy.

Sources:

QUL Topics
Topic Relations
QURAN ENGINE
NODE-Q301
Ayah Theme Search

Purpose:

Find verses matching themes.

Input:

{
  "theme": "tawakkul"
}

Output:

{
  "ayahs": []
}
NODE-Q302
Quran Retrieval

Purpose:

Retrieve full ayah data.

Sources:

Quran
Translation
Metadata
NODE-Q303
Tafsir Retrieval

Purpose:

Retrieve tafsir entries.

Sources:

Mukhtasar
Ibn Kathir
Saadi
Muyassar
NODE-Q304
Related Ayah Retrieval

Purpose:

Find similar verses.

Source:

QUL Similar Ayahs

HADITH ENGINE
NODE-H401
Hadith Topic Search

Purpose:

Find hadith by topic.

Input:

{
  "theme": "tawakkul"
}

Output:

{
  "hadiths": []
}
NODE-H402
Hadith Retrieval

Purpose:

Retrieve full hadith record.

Sources:

hadith-json

Output:

{
  "book": "",
  "number": "",
  "text": ""
}
NODE-H403
Hadith Grade Retrieval

Purpose:

Retrieve grading.

Sources:

Collection metadata
Dorar

Output:

{
  "grade": "sahih"
}
NODE-H404
Hadith Verification Retrieval

Purpose:

Check SemakHadis records.

Output:

{
  "status": "verified"
}
NODE-H405
Hadith Isnad Retrieval

Purpose:

Retrieve chain information.

Source:

LK-Hadith-Corpus

NODE-H406
Related Hadith Retrieval

Purpose:

Find semantically similar hadith.

Source:

Embeddings

VERIFICATION ENGINE
NODE-V501
Quran Validation

Purpose:

Validate Quran source integrity.

Always approved.

NODE-V502
Hadith Grade Validation

Rules:

Sahih → Allow

Hasan → Allow

Daif → Restricted

Mawdu → Reject
NODE-V503
Authenticity Filter

Purpose:

Remove fabricated narrations.

Output:

{
  "approved": true
}
NODE-V504
Source Traceability Check

Purpose:

Ensure source references exist.

Required fields:

source

reference

version
GUIDANCE ENGINE
NODE-G601
Guidance Package Builder

Purpose:

Assemble guidance.

Output:

{
  "theme": {},
  "quran": {},
  "tafsir": {},
  "hadith": {}
}
NODE-G602
Reflection Generator

Purpose:

Generate reflection from retrieved sources.

Important:

May explain.

May summarize.

May not invent religious content.

NODE-G603
Action Recommendation Generator

Purpose:

Generate practical next steps.

Example:

Read Surah Al-Inshirah

Make dua after Maghrib

Write 3 blessings
NODE-G604
Dua Recommendation Node

Purpose:

Retrieve relevant duas.

Future source:

Hisnul Muslim dataset.

PERSONALIZATION ENGINE
NODE-P701
User Profile Retrieval

Purpose:

Load preferences.

Output:

{
  "language": "en"
}
NODE-P702
Reading History Analysis

Purpose:

Analyze user engagement.

NODE-P703
Journey Progress Evaluation

Purpose:

Track growth path.

Examples:

Tawakkul Journey

Sabr Journey

Ramadan Journey
NODE-P704
Recommendation Personalization

Purpose:

Adjust ranking.

Factors:

history

favorites

language

engagement
RESPONSE ENGINE
NODE-R801
Language Localization

Purpose:

Prepare language output.

Supported:

Arabic

English

Malay

Indonesian
NODE-R802
Response Formatting

Purpose:

Build final response structure.

Output:

{
  "guidance": {}
}
NODE-R803
Citation Builder

Purpose:

Attach references.

Example:

Quran 65:2-3

Sahih Muslim 2699
NODE-R804
Companion Tone Engine

Purpose:

Apply RAFIQ personality.

Traits:

Gentle

Encouraging

Reflective

Respectful
SYSTEM NODES
NODE-S901
Retrieval Logging

Purpose:

Track retrieval activity.

NODE-S902
Ranking Engine

Purpose:

Score candidates.

Inputs:

theme_match

verification

user_relevance

engagement

Output:

{
  "score": 0.92
}
NODE-S903
Embedding Search

Purpose:

Semantic retrieval.

Sources:

Hadith embeddings
Future Quran embeddings
NODE-S904
Knowledge Graph Traversal

Purpose:

Navigate relationships.

Examples:

Theme
 ↓
Ayah
 ↓
Hadith
Primary Workflow
Guidance Flow
U101
 ↓
U102
 ↓
U103
 ↓
T201
 ↓
T202
 ↓
Q301
 ↓
Q302
 ↓
Q303
 ↓
H401
 ↓
H402
 ↓
H403
 ↓
V502
 ↓
V503
 ↓
G601
 ↓
G602
 ↓
G603
 ↓
P704
 ↓
R804
 ↓
R802
Study Mode Workflow
User
 ↓
Q302
 ↓
Q303
 ↓
Q304
 ↓
H402
 ↓
H405
 ↓
R803
Search Workflow
User Query
 ↓
S903
 ↓
S904
 ↓
Q302
 ↓
H402
 ↓
R802
Node Inventory Summary
Layer	Nodes
User Understanding	4
Theme Engine	3
Quran Engine	4
Hadith Engine	6
Verification Engine	4
Guidance Engine	4
Personalization Engine	4
Response Engine	4
System Engine	4

Total Nodes: 37

Architecture Decision

RAFIQ V2 is no longer a simple AI assistant.

It is a modular Islamic Guidance Operating System built around:

Quran Knowledge Graph
Hadith Knowledge Graph
Verification Layer
Personalization Layer
Retrieval-Augmented Guidance

This node catalog becomes the blueprint for implementing RAFIQ workflows in:

NestJS services
LangGraph workflows
Custom workflow engines
Future QS-OS style node orchestration

Bismillah.


# RAFIQ Knowledge Graph Specification V1
The Islamic Intelligence Layer

Version: 1.0
Status: Architecture Locked
Parent Documents:

RAFIQ Knowledge Base Specification V2
RAFIQ Database Schema & ERD Specification V2
RAFIQ AI Engine Specification V2
RAFIQ Node Catalog V2
1. Vision

Most Islamic apps store content.

RAFIQ stores knowledge relationships.

Traditional approach:

Quran
Hadith
Tafsir

Stored separately

RAFIQ approach:

Quran
   ↔
Themes
   ↔
Hadith
   ↔
Tafsir
   ↔
Guidance
   ↔
User Journey

This interconnected structure becomes the RAFIQ Knowledge Graph.

2. Why a Knowledge Graph?

Without a graph:

User asks:
"I feel worried"

Search returns:

Keyword:
worried

Poor results.

With a graph:

Worried
 ↓

Anxiety
 ↓

Tawakkul
 ↓

Sabr
 ↓

Yaqin
 ↓

Relevant Quran
 ↓

Relevant Hadith

This enables true guidance instead of simple search.

3. Graph Layers

RAFIQ V1 contains six graph layers.

Theme Graph

Quran Graph

Hadith Graph

Relationship Graph

Guidance Graph

User Graph
4. Theme Graph

The Theme Graph is the center of the entire system.

Every retrieval starts from themes.

Core Themes

Examples:

Tawakkul

Sabr

Shukr

Tawbah

Rahmah

Ikhlas

Rizq

Hidayah

Yaqin

Akhlaq
Theme Relationships

Example:

Tawakkul
 ├─ Sabr
 ├─ Yaqin
 └─ Rizq

Stored in:

topics

topic_relations
Theme Types
Type	Example
Emotional	Fear
Spiritual	Tawakkul
Ethical	Akhlaq
Worship	Salah
Family	Rahmah
Financial	Rizq
5. Quran Graph

Connects verses to themes.

Structure
Theme
 ↓
Ayah
 ↓
Surah

Example

Tawakkul

 ↓

65:2-3

 ↓

At-Talaq
Stored In
ayah_themes

Example Record

{
  "ayah": "65:2-3",
  "theme": "tawakkul",
  "confidence": 0.98
}
6. Similar Ayah Graph

Source:

QUL Similar Ayahs

Purpose:

Connect verses discussing similar concepts.

Example

65:2-3
  ↔
3:159
  ↔
8:2

Stored In

related_ayahs

Benefits

Study Mode

Deep Research

Guided Reflection
7. Hadith Graph

Connects hadith to themes.

Example

Tawakkul
 ↓

Bukhari 6463
 ↓

Related Hadith

Stored In

hadith_topics

Example

{
  "hadith": "Bukhari 6463",
  "theme": "tawakkul",
  "confidence": 0.96
}
8. Hadith Similarity Graph

Generated using:

Embeddings
LK-Hadith-Corpus
Semantic Search

Example

Hadith A
 ↓
Trust Allah

 ↔

Hadith B
 ↓
Reliance on Allah

Stored In

related_hadiths
9. Quran ↔ Hadith Graph

Most important RAFIQ relationship.

Purpose

Connect revelation and prophetic explanation.

Example

Quran

65:2-3

↓

Theme:
Tawakkul

↓

Hadith

Bukhari 6463

Stored In

quran_hadith_links

Relationship Types

Type	Meaning
Supports	Reinforces
Explains	Clarifies
Expands	Adds details
Example Of	Demonstrates implementation

Example

{
  "ayah": "65:2-3",
  "hadith": "Bukhari 6463",
  "relationship": "supports"
}
10. Tafsir Graph

Connects verses to scholarly explanations.

Structure

Ayah
 ↓
Tafsir
 ↓
Themes

Example

65:2-3

 ↓

Mukhtasar

 ↓

Tawakkul

 ↓

Rizq

Benefits

Allows AI to retrieve context instead of isolated verses.

11. Guidance Graph

Transforms knowledge into actionable guidance.

Structure

Theme
 ↓
Quran
 ↓
Hadith
 ↓
Reflection
 ↓
Action

Example

Anxiety

 ↓

Tawakkul

 ↓

65:2-3

 ↓

Bukhari 6463

 ↓

Reflection

 ↓

Action Plan

Stored In

guidance_packages
12. User Graph

The personalization layer.

Structure

User
 ↓

Mood

 ↓

Themes

 ↓

Guidance

 ↓

Progress

Example

User

 ↓

Anxiety

 ↓

Tawakkul

 ↓

Read 65:2-3

 ↓

Completed Reflection

Stored In

user_moods

user_journeys

saved_guidance
13. Graph Traversal Rules

The AI never searches randomly.

It traverses the graph.

Example 1

User:

I am afraid of the future.

Traversal:

Fear

 ↓

Tawakkul

 ↓

Ayahs

 ↓

Tafsir

 ↓

Hadith

 ↓

Reflection

Example 2

User:

Show me verses about gratitude.

Traversal:

Shukr

 ↓

Ayah Themes

 ↓

Quran

 ↓

Related Ayahs
14. Confidence Scores

Every relationship carries confidence.

Example

{
  "theme": "tawakkul",
  "ayah": "65:2-3",
  "confidence": 0.98
}

Score Sources

Source	Confidence
Human Curated	1.00
QUL Themes	0.95
Scholar Mapping	0.95
AI Assisted	0.70
Embedding Similarity	0.60
15. Graph Expansion Strategy

V1

Themes

Ayahs

Hadith

Tafsir

V2

Duas

Asmaul Husna

Stories of Prophets

Fiqh Topics

V3

Scholarly Opinions

Learning Paths

Islamic Courses

Knowledge Maps
16. Knowledge Graph Nodes

Current estimated graph size:

RAFIQ knowledge graph estimate

Projected node counts for initial V1 knowledge graph.

0
15,000
30,000
45,000
60,000
Quran Ayahs
Hadiths
Topics
Tafsir Entries
Quran-Hadith Links
User Journey Nodes

This will grow continuously as relationships are added.

17. Knowledge Graph API

Future internal API:

GET /graph/theme/{slug}

GET /graph/ayah/{id}

GET /graph/hadith/{id}

GET /graph/related/ayah/{id}

GET /graph/related/hadith/{id}
18. Integration with RAFIQ Nodes

Graph-aware nodes:

NODE-T203
Topic Graph Retrieval

NODE-Q304
Related Ayah Retrieval

NODE-H406
Related Hadith Retrieval

NODE-S904
Knowledge Graph Traversal

These nodes become the graph gateway for the AI engine.

19. Retrieval Philosophy

Traditional Search:

Keyword
 ↓
Results

RAFIQ Graph Retrieval:

Situation
 ↓

Theme
 ↓

Quran
 ↓

Tafsir
 ↓

Hadith
 ↓

Reflection
 ↓

Action

This is the core intellectual advantage of RAFIQ.

20. Architecture Decision

The RAFIQ Knowledge Graph is the central intelligence layer that connects:

Quran

↕

Themes

↕

Hadith

↕

Tafsir

↕

Guidance

↕

Users

Everything in RAFIQ should eventually be reachable through graph traversal rather than direct keyword lookup.

This transforms RAFIQ from a content application into an Islamic Knowledge Intelligence Platform capable of delivering personalized, traceable, and authentic guidance. Bismillah.


# RAFIQ Retrieval & Ranking Engine Specification V1
The Guidance Selection Brain

Version: 1.0
Status: Architecture Locked

Parent Documents:

RAFIQ Knowledge Base Specification V2
RAFIQ Database Schema & ERD Specification V2
RAFIQ AI Engine Specification V2
RAFIQ Knowledge Graph Specification V1
RAFIQ Node Catalog V2
1. Vision

The Retrieval & Ranking Engine is the most important component in RAFIQ.

The Knowledge Base stores knowledge.

The Knowledge Graph stores relationships.

The AI Engine understands users.

The Retrieval & Ranking Engine decides:

Which Quran verse, which tafsir, which hadith, which reflection, and which action should be shown to this specific user at this specific moment.

2. Core Philosophy

Most AI systems work like:

Question
 ↓
Search
 ↓
Results

RAFIQ works like:

Situation
 ↓
Theme
 ↓
Knowledge Graph
 ↓
Verification
 ↓
Ranking
 ↓
Guidance Package

The goal is not to retrieve everything.

The goal is to retrieve the most beneficial guidance.

3. Engine Architecture
User Input
      ↓

Theme Detection
      ↓

Candidate Retrieval
      ↓

Authenticity Filtering
      ↓

Knowledge Graph Expansion
      ↓

Candidate Scoring
      ↓

Ranking
      ↓

Guidance Assembly
      ↓

Personalization
      ↓

Final Response
4. Retrieval Layers

RAFIQ retrieval occurs in stages.

Layer 1 — Theme Retrieval

Input:

I am worried about my future.

Detected:

Fear

Mapped:

Tawakkul
Sabr
Yaqin

Output:

{
  "primaryTheme": "tawakkul",
  "secondaryThemes": [
    "sabr",
    "yaqin"
  ]
}
Layer 2 — Quran Candidate Retrieval

Sources:

ayah_themes
QUL topics
related_ayahs

Example:

Theme
 ↓

Tawakkul

 ↓

Candidates

65:2-3
3:159
8:2
29:69
Layer 3 — Tafsir Retrieval

Retrieve tafsir only for candidate verses.

Sources:

Mukhtasar
Ibn Kathir
Saadi
Muyassar
Layer 4 — Hadith Retrieval

Sources:

hadith_topics
quran_hadith_links
semantic search

Example:

65:2-3
 ↓

Linked Hadith

Bukhari 6463

Muslim XXXX
Layer 5 — Graph Expansion

Expand beyond direct matches.

Example:

Tawakkul
 ↓

Related Theme

Yaqin

 ↓

Additional Ayahs

This improves recommendation quality.

5. Candidate Types

The engine ranks multiple candidate types.

Quran Candidate
{
  "type": "ayah",
  "id": "65:2-3"
}
Hadith Candidate
{
  "type": "hadith",
  "id": "bukhari_6463"
}
Guidance Candidate
{
  "type": "guidance",
  "theme": "tawakkul"
}
6. Authenticity Filtering

No candidate proceeds without validation.

Quran

Always valid.

Quran
 ↓
Pass
Hadith

Validation flow:

Hadith
 ↓

Grade Check
 ↓

Verification Check
 ↓

Pass

Allowed:

Sahih

Hasan

Restricted:

Daif

Only in educational contexts.

Blocked:

Mawdu

Fabricated

Removed immediately.

7. Ranking Framework

Each candidate receives a score.

Scoring Factors
Factor	Weight
Theme Match	35%
Authenticity	25%
Knowledge Graph Strength	15%
User Relevance	10%
Engagement History	10%
Freshness / Diversity	5%

Total:

100%
8. Theme Match Score

Most important factor.

Measures:

Candidate

vs

Current Theme

Example:

Candidate	Theme Score
Tawakkul Ayah	1.00
Sabr Ayah	0.85
Shukr Ayah	0.20
9. Authenticity Score

Purpose:

Reward trustworthy content.

Example

Source	Score
Quran	1.00
Sahih Hadith	0.95
Hasan Hadith	0.85
Daif Hadith	0.40
10. Knowledge Graph Strength

Measures connectedness.

Example:

65:2-3

Links to:
- Tawakkul
- Rizq
- Bukhari 6463
- Related Ayahs

High score

Weakly connected nodes receive lower scores.

11. User Relevance Score

Personalization factor.

Signals:

Language

Favorite Themes

Saved Guidance

Current Journey

Reading History

Example:

User repeatedly studies Tawakkul.

Future Tawakkul content receives a boost.

12. Engagement Score

Measures usefulness.

Signals:

Bookmarks

Shares

Reads

Completion Rate

Example:

Read Fully

receives higher score than:

Skipped
13. Diversity Score

Purpose:

Avoid repetitive guidance.

Problem:

65:2-3

every day

Solution:

Reduce score if recently shown.

Example:

Shown yesterday

Penalty
14. Ranking Formula

Core ranking formula:

Score=(0.35T)+(0.25A)+(0.15G)+(0.10U)+(0.10E)+(0.05D)

Where:

T = Theme Match

A = Authenticity

G = Graph Strength

U = User Relevance

E = Engagement

D = Diversity
15. Multi-Stage Ranking

RAFIQ does not rank everything at once.

Stage 1

Theme Ranking

Situation
 ↓
Themes
Stage 2

Quran Ranking

Theme
 ↓
Best Ayahs
Stage 3

Hadith Ranking

Ayah
 ↓
Best Hadith
Stage 4

Guidance Ranking

Ayah
+
Hadith
 ↓
Best Reflection
16. Guidance Package Assembly

Top-ranked items become:

{
  "theme": {},
  "ayah": {},
  "tafsir": {},
  "hadith": {},
  "reflection": {},
  "action": {}
}
17. Daily Guidance Ranking

Special workflow.

Input:

User Profile

No explicit question.

Signals:

Recent Themes

Mood History

Journey Progress

Time of Day

Example:

Morning:

Hope

Tawakkul

Productivity

Before Sleep:

Muhasabah

Tawbah

Gratitude
18. Search Ranking

User:

Show me verses about patience.

Workflow:

Query
 ↓
Theme
 ↓
Graph
 ↓
Ayahs
 ↓
Ranking

Not keyword matching alone.

19. Study Mode Ranking

User:

Explain Surah Al-Asr.

Workflow:

Surah
 ↓
Ayahs
 ↓
Tafsir
 ↓
Related Themes
 ↓
Related Hadith

Priority:

Completeness

instead of personalization.

20. Semantic Retrieval

Powered by embeddings.

Tables:

hadith_embeddings

future:
ayah_embeddings

Example:

User:

I feel lonely.

No explicit keyword match.

Semantic retrieval discovers:

Hope

Allah's Nearness

Patience

Companionship

and surfaces relevant guidance.

21. Learning-to-Rank (Future V2)

The engine can improve over time.

Signals:

Saved

Read

Shared

Completed Actions

Ignored

Used to refine rankings.

22. Ranking Safety Rules

Never boost content because:

❌ Popularity alone

❌ Virality

❌ Social trends

❌ User preference over authenticity

Always prioritize:

✅ Authenticity

✅ Relevance

✅ Benefit

23. Failure Recovery Strategy

If retrieval confidence is low:

Theme Confidence < 0.60

Fallback:

General Guidance

Examples:

Tawakkul
Sabr
Dua
Hope
24. Node Integration

Primary ranking nodes:

NODE-T201
Theme Detection

NODE-Q301
Ayah Search

NODE-H401
Hadith Search

NODE-S902
Ranking Engine

NODE-S903
Embedding Search

NODE-S904
Graph Traversal

NODE-G601
Guidance Builder
25. Success Metrics

The engine succeeds when users:

Understand the message
Reflect on it
Complete actions
Return consistently
Grow in their Islamic journey

Not when the system produces the longest response.

26. Final Architecture
User
 ↓

Understanding
 ↓

Theme Detection
 ↓

Knowledge Graph
 ↓

Quran Retrieval
 ↓

Tafsir Retrieval
 ↓

Hadith Retrieval
 ↓

Verification
 ↓

Ranking
 ↓

Guidance Package
 ↓

Reflection
 ↓

Action
 ↓

Growth
Architecture Decision

The RAFIQ Retrieval & Ranking Engine is the decision-making brain of the platform.

It transforms a massive Quran + Hadith knowledge graph into:

The right guidance
For the right person
At the right time
With verified sources
In the most beneficial order

This engine is the key differentiator between RAFIQ and a traditional Islamic content library or chatbot. Bismillah.


# RAFIQ Data Import Pipeline Specification V1
Quran, Tafsir, Hadith & Knowledge Graph Acquisition System

Version: 1.0
Status: Architecture Locked

Parent Documents:

RAFIQ Knowledge Base Specification V2
RAFIQ Database Schema & ERD Specification V2
RAFIQ Knowledge Graph Specification V1
RAFIQ Retrieval & Ranking Engine Specification V1
RAFIQ Backend Blueprint V1
1. Vision

The RAFIQ Data Import Pipeline is responsible for acquiring, validating, transforming, enriching, and publishing Islamic knowledge into the RAFIQ platform.

Its purpose is to ensure that every piece of knowledge inside RAFIQ is:

Authentic
Traceable
Structured
Searchable
Relationship-aware
AI-ready
Core Principle

AI should never be the source of knowledge.

AI only consumes knowledge that has already passed through the RAFIQ Import Pipeline.

External Sources
       ↓
Import Pipeline
       ↓
Validation
       ↓
Normalization
       ↓
Enrichment
       ↓
Knowledge Graph
       ↓
RAFIQ AI
2. Data Domains

The pipeline manages six domains.

Quran

Translations

Tafsir

Hadith

Verification

Knowledge Graph
3. Import Architecture
Source Connectors
        ↓

Raw Import Layer
        ↓

Validation Layer
        ↓

Transformation Layer
        ↓

Enrichment Layer
        ↓

Knowledge Graph Builder
        ↓

Publishing Layer
        ↓

Production Database
4. Pipeline Stages
Stage	Purpose
Extract	Acquire source data
Validate	Verify integrity
Transform	Normalize format
Enrich	Add metadata
Link	Build relationships
Publish	Push to production
5. Source Registry

Every source must be registered.

source_registry
id

name

domain

version

license

source_url

status

last_imported_at

Example:

Source	Domain
QUL Quran	Quran
QUL Topics	Themes
Hadith JSON	Hadith
LK Corpus	Hadith Intelligence
SemakHadis	Verification
6. Quran Import Pipeline

Primary source:

QUL Resources Portal

Stage 1

Acquire:

Surahs

Ayahs

Metadata
Stage 2

Validate:

6236 ayahs

114 surahs

Integrity checks:

Missing ayahs

Duplicate ayahs

Corrupted text
Stage 3

Transform:

Convert to RAFIQ schema:

quran_surahs

quran_ayahs
Stage 4

Publish

Production Database
7. Translation Import Pipeline

Sources:

English
Malay
Indonesian
Chinese
Import Flow
Translation File
      ↓

Language Validation
      ↓

Ayah Matching
      ↓

Normalization
      ↓

Database Insert

Validation Rules:

Ayah exists

Language valid

Translator identified

Target Table:

quran_translations
8. Tafsir Import Pipeline

Sources:

Mukhtasar
Ibn Kathir
Saadi
Muyassar
Flow
Tafsir Source
      ↓

Ayah Mapping
      ↓

Language Mapping
      ↓

Metadata Enrichment
      ↓

Database Insert

Target:

quran_tafsir
9. Hadith Import Pipeline

Primary Source:

hadith-json Repository

Collections:

Sahih al-Bukhari
Sahih Muslim
Jami' at-Tirmidhi
Sunan Abu Dawud
Sunan an-Nasa'i
Sunan Ibn Majah
Flow
Raw JSON
      ↓

Collection Validation
      ↓

Chapter Extraction
      ↓

Hadith Extraction
      ↓

Normalization
      ↓

Database Insert

Tables:

hadith_books

hadith_chapters

hadiths
10. Hadith Grade Pipeline

Sources:

SemakHadis
Dorar
Collection metadata
Flow
Hadith
      ↓

Grade Lookup
      ↓

Validation
      ↓

Normalization
      ↓

Database Insert

Target:

hadith_grades

Allowed:

Sahih

Hasan

Daif

Mawdu
11. Hadith Intelligence Pipeline

Source:

LK-Hadith-Corpus Repository

Imports:

Isnad

Narrators

Annotations

Metadata

Tables:

hadith_isnad

hadith_annotations
12. Verification Pipeline

Source:

SemakHadis

Purpose:

Import public verification references.

Flow:

Verification Record
      ↓

Claim Extraction
      ↓

Status Mapping
      ↓

Reference Mapping
      ↓

Insert

Target:

hadith_verifications

Statuses:

VERIFIED

WEAK

FABRICATED

DISPUTED
13. Theme Import Pipeline

Sources:

QUL Topics
Internal RAFIQ Taxonomy
Flow
Topic
      ↓

Normalization
      ↓

Hierarchy Detection
      ↓

Insert

Tables:

topics

topic_relations

Example

Tawakkul
 ├─ Sabr
 └─ Yaqin
14. Ayah Theme Linking Pipeline

Purpose:

Create Quran → Theme relationships.

Flow

Ayah
 ↓

Theme

 ↓

Confidence

 ↓

Insert

Target

ayah_themes

Example

{
  "ayah": "65:2-3",
  "theme": "tawakkul",
  "confidence": 0.98
}
15. Hadith Theme Linking Pipeline

Purpose:

Create Hadith → Theme relationships.

Flow

Hadith
 ↓

Theme
 ↓

Confidence
 ↓

Insert

Target

hadith_topics
16. Quran ↔ Hadith Link Pipeline

Most important enrichment stage.

Purpose:

Build the core Knowledge Graph.

Flow

Ayah
 ↓

Theme

 ↓

Related Hadith

 ↓

Relationship Type

 ↓

Confidence

Target:

quran_hadith_links

Relationship Types

SUPPORTS

EXPLAINS

EXPANDS

EXAMPLE_OF
17. Similar Ayah Pipeline

Source:

QUL Similar Ayahs

Flow

Ayah
 ↓

Related Ayah
 ↓

Similarity

Target

related_ayahs
18. Similar Hadith Pipeline

Generated internally.

Method

Embedding Creation
 ↓

Vector Search
 ↓

Similarity Detection
 ↓

Relationship Creation

Target

related_hadiths
19. Embedding Pipeline

Purpose:

Enable semantic search.

Sources:

Quran

Hadith

Tafsir

Flow

Text
 ↓

Chunking
 ↓

Embedding Model
 ↓

Vector Creation
 ↓

Storage

Tables

hadith_embeddings

future:
ayah_embeddings
20. Import Validation Framework

Every imported record must pass:

Schema Validation

Example

Required fields exist
Reference Validation

Example

Ayah exists

Hadith exists
Duplicate Detection

Example

Same source

Same reference
Language Validation

Example

en

ar

ms

id
21. Import Audit Framework

Every import produces logs.

import_jobs
id

source

started_at

completed_at

status
import_job_details
id

job_id

record_count

errors

warnings
22. Versioning Strategy

Every imported record includes:

source

version

import_date

validation_date

Example

{
  "source": "QUL",
  "version": "2026-06",
  "importDate": "2026-06-07"
}
23. Scheduling Strategy
Daily
Verification updates
Weekly
Metadata refresh
Monthly
Full source audit
Manual
Major source upgrades
24. Pipeline Nodes

Future NestJS workers:

IMPORT-QURAN

IMPORT-TRANSLATIONS

IMPORT-TAFSIR

IMPORT-HADITH

IMPORT-GRADES

IMPORT-VERIFICATION

IMPORT-THEMES

BUILD-QURAN-HADITH-LINKS

BUILD-SIMILAR-AYAHS

BUILD-SIMILAR-HADITHS

GENERATE-EMBEDDINGS
25. Deployment Architecture
Source Connectors
         ↓

Import Workers
         ↓

Validation Workers
         ↓

Transformation Workers
         ↓

Graph Builders
         ↓

Embedding Workers
         ↓

Publishing Workers
         ↓

Supabase PostgreSQL
         ↓

RAFIQ Retrieval Engine
26. Initial Import Roadmap
Phase 1

Foundation

Quran

Translations

Topics
Phase 2

Guidance

Tafsir

Hadith

Grades
Phase 3

Knowledge Graph

Ayah Themes

Hadith Themes

Quran-Hadith Links
Phase 4

Intelligence

Embeddings

Semantic Search

Recommendations
27. Success Definition

The Data Import Pipeline succeeds when every knowledge object inside RAFIQ is:

Authentic

Traceable

Versioned

Validated

Linked

Searchable

AI Ready
Architecture Decision

The RAFIQ Data Import Pipeline is not an ETL process.

It is a Knowledge Acquisition System that transforms raw Quran, Tafsir, Hadith, verification data, and thematic relationships into a living Islamic Knowledge Graph.

This pipeline becomes the foundation upon which every future RAFIQ capability is built:

Daily Guidance
Companion Chat
Study Mode
Semantic Search
Guided Journeys
Scholar Mode

Bismillah.

# RAFIQ PRD V2 (Product Requirements Document)
Your Personal Islamic Companion

Version: 2.0
Status: Product Definition Locked

Parent Documents:

RAFIQ Knowledge Base Specification V2
RAFIQ AI Engine Specification V2
RAFIQ Knowledge Graph Specification V1
RAFIQ Retrieval & Ranking Engine Specification V1
RAFIQ Data Import Pipeline Specification V1
1. Product Vision
What is RAFIQ?

RAFIQ is an AI-powered Islamic companion that helps Muslims strengthen their relationship with Allah through personalized Quran, authentic Hadith, reflection, and daily guidance.

Unlike traditional Islamic apps that focus on content consumption, RAFIQ focuses on:

Understanding
↓
Reflection
↓
Action
↓
Growth
Product Mission

Help Muslims engage with Islam daily through:

Personalized guidance
Quran-centric reflection
Authentic Hadith
Consistent ibadah habits
Lifelong spiritual growth
Product Positioning
RAFIQ is NOT

❌ Quran Reader

❌ Hadith Library

❌ Fatwa App

❌ Islamic Search Engine

❌ Generic AI Chatbot

RAFIQ IS

✅ Personal Islamic Companion

✅ Daily Guidance System

✅ Quran Reflection Assistant

✅ Spiritual Growth Platform

✅ Islamic Knowledge Intelligence Platform

2. Target Users
User Type 1: Daily Muslim

Profile:

Busy
Working
Limited Islamic study time

Needs:

Quick guidance
Daily reminders
Relevant Quran
User Type 2: Growth Seeker

Profile:

Actively improving deen

Needs:

Learning journeys
Reflection
Habit building
User Type 3: Student of Knowledge

Profile:

Studies Quran and Hadith

Needs:

Tafsir

Sources

References

Relationships
3. Product Pillars
Pillar 1

Guidance

Help users navigate life situations.

Pillar 2

Learning

Help users understand Islam.

Pillar 3

Reflection

Help users internalize knowledge.

Pillar 4

Consistency

Help users build habits.

Pillar 5

Growth

Help users improve over time.

4. Product Architecture
RAFIQ

├── Companion
├── Daily Guidance
├── Quran
├── Hadith
├── Journeys
├── Reflection
├── Library
├── Profile
5. Core Module 1 — RAFIQ Companion

The flagship experience.

User Input

Examples:

I am worried.

I feel lost.

I need motivation.

I am struggling to pray.
RAFIQ Flow
User
 ↓

Understanding
 ↓

Theme Detection
 ↓

Knowledge Retrieval
 ↓

Guidance Package
 ↓

Reflection
 ↓

Action Plan
Output Structure
Theme

Quran

Translation

Tafsir

Hadith

Reflection

Action
6. Core Module 2 — Daily Guidance

The home screen experience.

Purpose

Deliver one meaningful guidance package daily.

Inputs
Mood

History

Journey

Recent Topics
Outputs
Today's Theme

Today's Ayah

Today's Reflection

Today's Action
7. Core Module 3 — Quran

Purpose:

Quran engagement.

Features
Read Quran
Arabic
Translation
Transliteration
Ayah Details
Tafsir
Related Themes
Related Ayahs
Related Hadith
Reflection Mode

Generate guided reflections.

8. Core Module 4 — Hadith

Purpose:

Authentic Sunnah discovery.

Features
Browse Collections
Sahih al-Bukhari
Sahih Muslim
Riyad as-Salihin
View Details

Show:

Arabic

Translation

Grade

Theme

Related Quran
9. Core Module 5 — Guided Journeys

One of RAFIQ's strongest differentiators.

Examples
30 Days of Tawakkul
Day 1

Ayah

Reflection

Action
30 Days of Sabr
30 Days of Gratitude
Ramadan Journey
New Muslim Journey

Future release.

10. Core Module 6 — Reflection

Purpose:

Help users internalize guidance.

Daily Reflection

Prompt:

What did you learn today?
Reflection Journal

Stores:

Date

Theme

Reflection

Mood
11. Core Module 7 — Library

Knowledge exploration.

Sections
Themes
Tawakkul

Sabr

Rahmah

Tawbah
Quran Topics
Hadith Topics
Collections
12. Core Module 8 — Profile
Features
Language

Supported:

Arabic

English

Malay

Indonesian
Preferences
Translation

Tafsir

Notifications
Journey Progress

Track growth.

13. AI Features
AI Guidance

Input:

I am anxious.

Output:

Theme

Ayah

Hadith

Reflection

Action
AI Reflection

Explain retrieved knowledge.

AI Search

Input:

Show verses about patience.
AI Discovery

Suggest related knowledge.

14. Knowledge Graph Features

Powered by RAFIQ Knowledge Graph.

Related Ayahs
65:2-3

↔

3:159
Related Hadith
Hadith A

↔

Hadith B
Quran-Hadith Links
Ayah

↔

Hadith
15. Notifications
Daily Guidance

Morning.

Reflection Reminder

Evening.

Journey Reminder

Progress tracking.

16. User Onboarding
Step 1

Language

Step 2

Goals

Examples:

Reduce anxiety

Improve prayer

Learn Quran

Build consistency
Step 3

Preferred Topics

Step 4

Start First Guidance

17. Gamification (Lightweight)

Purpose:

Encourage consistency.

Streaks
Daily Reflection

Daily Quran
Milestones
7 Days

30 Days

100 Days

Avoid excessive game mechanics.

The focus remains sincerity and growth.

18. Monetization Strategy
Free

Includes:

Daily Guidance

Quran

Hadith

Reflections
RAFIQ Plus

Includes:

Unlimited Companion

Advanced Journeys

Semantic Search

Deep Study Mode

Advanced Insights
19. Success Metrics
Engagement
Daily Active Users

Weekly Active Users
Spiritual Habits
Reflection Completion

Journey Completion

Reading Consistency
Guidance Quality
Saved Guidance

User Ratings

Return Rate
20. V1 MVP Scope

Launch with:

Companion
Daily Guidance
Quran
Hadith
Themes
Reflection Journal
Profile

Exclude:

❌ Community

❌ Scholar Marketplace

❌ Video Courses

❌ Social Feed

❌ Discussion Forums

21. V2 Roadmap

Add:

Guided Journeys
Semantic Search
Advanced Study Mode
Knowledge Graph Explorer
Asmaul Husna Module
Dua Library
22. V3 Vision

Transform RAFIQ into:

Islamic Knowledge Intelligence Platform
+
Personal Islamic Companion
+
Spiritual Growth System

Where every user receives:

Personalized guidance
Authentic sources
Continuous learning
Consistent reflection
Long-term growth

through a trusted Quran and Hadith knowledge graph.

Product North Star

A user opens RAFIQ every day not because they need information,

but because RAFIQ helps them:

Remember Allah
Understand Islam
Reflect Deeply
Act Consistently
Grow Spiritually

This is the product RAFIQ V2 is being designed to become.

Bismillah.

# RAFIQ UX Specification V2
Personal Islamic Companion Experience System

Version: 2.0
Status: UX Architecture Locked

Parent Documents:

RAFIQ PRD V2
RAFIQ AI Engine Specification V2
RAFIQ Knowledge Graph Specification V1
RAFIQ Retrieval & Ranking Engine Specification V1
1. UX Vision

Most Islamic apps are designed around content.

RAFIQ is designed around guidance.

Traditional Islamic App:

Open App
 ↓
Browse Content
 ↓
Read
 ↓
Exit

RAFIQ:

Open App
 ↓
Receive Guidance
 ↓
Reflect
 ↓
Act
 ↓
Grow
2. UX Principles
Principle 1 — Calm

RAFIQ should feel peaceful.

Avoid:

❌ Busy dashboards

❌ Too many cards

❌ Too many colors

❌ Information overload

Principle 2 — Guided

Never make users wonder:

"What should I do next?"

RAFIQ always provides:

Read
↓
Reflect
↓
Act
Principle 3 — Personal

Every screen should feel:

For Me
Not For Everyone
Principle 4 — Quran First

Whenever possible:

Theme
 ↓
Quran
 ↓
Explanation
 ↓
Action

Not:

AI
 ↓
Opinion
Principle 5 — One Meaningful Action

Every session should end with:

One Reflection

or

One Action
3. Experience Pillars

RAFIQ UX is built around five experiences.

Receive

Learn

Reflect

Practice

Grow
4. Information Architecture
Primary Navigation
Home

Companion

Quran

Library

Profile

Only 5 tabs.

5. Home Experience
Purpose

The Home screen is the heart of RAFIQ.

Not a dashboard.

A daily guidance experience.

Layout
━━━━━━━━━━━━━━

Assalamualaikum Jessmin

Today's Theme

Tawakkul

━━━━━━━━━━━━━━

Today's Ayah

65:2-3

Read Reflection

━━━━━━━━━━━━━━

Today's Action

Continue striving while
placing trust in Allah

━━━━━━━━━━━━━━

Continue Journey

━━━━━━━━━━━━━━
Home Priority Order
1 Guidance

2 Reflection

3 Action

4 Journey

Never statistics first.

6. Companion Experience

The flagship feature.

Purpose

Help users navigate life situations.

Entry State
How are you feeling today?

Suggestions:

Anxious

Lost

Grateful

Motivated

Confused

Hopeful
Conversation UX

Avoid chatbot appearance.

Instead:

User Reflection

↓

Theme

↓

Quran

↓

Hadith

↓

Reflection

↓

Action
Example
I feel overwhelmed.

Result:

Theme

Tawakkul

↓

Ayah

↓

Hadith

↓

Reflection

↓

Action
7. Quran Experience

Purpose:

Deep engagement with Quran.

Quran Home
Continue Reading

Recently Viewed

Themes

Surahs
Ayah Screen

Layout:

Arabic

Translation

Transliteration

━━━━━━━━━━

Reflection

━━━━━━━━━━

Tafsir

━━━━━━━━━━

Related Ayahs

━━━━━━━━━━

Related Hadith
Reading Mode

Options:

Arabic Only

Arabic + Translation

Arabic + Translation + Audio
8. Theme Experience

One of RAFIQ's differentiators.

Theme Screen

Example:

Tawakkul

Contains:

Description

Related Ayahs

Related Hadith

Related Journeys

Related Themes
Theme Graph View

Future V2.

Tawakkul

↔ Sabr

↔ Yaqin

↔ Rizq
9. Hadith Experience

Purpose:

Discover Sunnah through themes.

Hadith Detail Screen
Arabic

Translation

Grade

Narrator

━━━━━━━━━━

Related Quran

━━━━━━━━━━

Related Themes
Authenticity Display

Highly visible.

Example:

Grade

SAHIH

Users should immediately know reliability.

10. Reflection Experience

Purpose:

Transform reading into internalization.

Reflection Prompt

After guidance:

What resonates with you today?
Journal Entry
Mood

Reflection

Action
Daily Reflection Flow
Read

↓

Reflect

↓

Save
11. Guided Journey Experience

Purpose:

Long-term growth.

Journey Home

Examples:

30 Days Tawakkul

30 Days Sabr

30 Days Gratitude
Daily Lesson
Theme

Ayah

Hadith

Reflection

Action
Completion Screen
Day Complete

Alhamdulillah
12. Search Experience

Purpose:

Knowledge discovery.

Search Modes
Search by Theme
Patience

Gratitude

Trust
Search by Question
Verses about anxiety
Search by Quran
65:2
Search by Hadith
Bukhari 6463
13. Library Experience

Purpose:

Structured exploration.

Sections
Themes

Quran Topics

Hadith Topics

Collections

Journeys

Not a content dump.

Should feel curated.

14. Profile Experience

Simple.

Sections
My Progress

Saved Guidance

Journal

Settings
Progress

Show:

Journey Progress

Reading Consistency

Reflection Consistency

Avoid:

Points

Coins

Leaderboards
15. Notification UX

Purpose:

Gentle reminders.

Examples

Morning:

Today's guidance is ready.

Evening:

Take a moment to reflect.

Journey:

Day 12 of Tawakkul awaits.

Avoid guilt-driven notifications.

16. Empty States

Should inspire.

Example

No Reflections Yet:

Your reflections will appear here.

Begin today's guidance.

No Saved Guidance:

Save meaningful guidance
for future reflection.
17. Personalization UX

Users should feel:

This understands me.

Examples

Recent anxiety-related guidance:

Continue your Tawakkul journey.

Recent gratitude reflections:

Today's theme builds on Shukr.
18. Accessibility

Must support:

✅ Large Text

✅ Screen Readers

✅ High Contrast

✅ Reduced Motion

Languages:

✅ Arabic

✅ English

✅ Malay

✅ Indonesian

Future:

✅ Chinese

19. Visual Design System
Mood
Calm

Warm

Reflective

Trustworthy
Color Philosophy

Primary:

Deep Green

Meaning:

Growth

Faith

Calm

Secondary:

Sand

Cream

Soft Grey

Avoid:

Neon

Aggressive colors

Gamified colors
20. Typography

Primary Goal:

Readability.

Arabic:

Readable Quranic font.

Latin Languages:

Clean modern sans-serif.

Hierarchy:

Theme

Ayah

Reflection

Action
21. UX Safety Rules

Never allow AI responses without sources.

Every guidance must show:

Theme

Quran

Reference

Hadith Reference

Users must always know:

Source

Grade

Authenticity
22. First-Time User Journey
Screen 1

Welcome to RAFIQ

Screen 2

Choose Language

Screen 3

Select Goals

Examples:

Reduce Anxiety

Improve Salah

Learn Quran

Build Consistency
Screen 4

Receive First Guidance

Immediate value.

23. Core UX Flow
Daily User
Open App

↓

Today's Guidance

↓

Read

↓

Reflect

↓

Save

↓

Exit

Target:

Less than 3 minutes.

Deep Study User
Theme

↓

Ayah

↓

Tafsir

↓

Related Hadith

↓

Related Ayahs

Target:

15–30 minutes.

24. Success Definition

The UX succeeds when users:

Open RAFIQ daily
Understand guidance quickly
Reflect consistently
Build habits
Feel spiritually supported

without being overwhelmed by information.

25. UX North Star

When a user opens RAFIQ, the experience should feel like:

A trusted companion
reminding me of Allah,
guiding me through Quran,
helping me reflect,
and encouraging me
to take one meaningful step today.

Not a social network.

Not a content marketplace.

Not a chatbot.

A calm, trustworthy, Quran-centered companion for daily growth.

Bismillah.

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

# RAFIQ Figma Build Pack V2
Design System & Screen Architecture

Version: 2.0
Status: Design Architecture Locked

Parent Documents:

RAFIQ PRD V2
RAFIQ UX Specification V2
RAFIQ AI Engine Specification V2
RAFIQ Knowledge Graph Specification V1

Purpose:

This document serves as the complete blueprint for building RAFIQ inside Figma before Expo development begins.

1. Design Philosophy

RAFIQ should not feel like:

❌ Social Media

❌ Productivity App

❌ AI Chat App

❌ Content Marketplace

❌ Learning Management System

RAFIQ should feel like:

✅ Calm

✅ Reflective

✅ Trustworthy

✅ Spiritual

✅ Personal

User emotion after opening RAFIQ:

Peace
↓
Reflection
↓
Action
↓
Growth
2. Design Principles
Principle 1

One Primary Action Per Screen

Avoid:

10 buttons
20 cards

Prefer:

One clear next step
Principle 2

Content Breathes

Generous whitespace.

Principle 3

Quran First

Visual hierarchy:

Theme
↓
Ayah
↓
Reflection
↓
Action
Principle 4

Companion Not Chatbot

The AI experience should feel like guidance.

Not like chatting with a machine.

3. Design Foundations
Grid System

Mobile-first.

Base Grid = 8px

Spacing Scale:

Token	Value
XS	4
SM	8
MD	16
LG	24
XL	32
XXL	48
Border Radius
Token	Value
Small	8
Medium	16
Large	24
Pill	999
4. Color System
Primary

Deep Islamic Green

#1B5E20

Meaning:

Faith
Growth
Calm
Secondary

Warm Sand

#E7DCC8
Accent

Gold

#C9A227

Used sparingly.

Neutral Scale
#FFFFFF

#F8F8F8

#EFEFEF

#DADADA

#777777

#333333

#111111
Semantic Colors

Success

#2E7D32

Warning

#ED6C02

Error

#D32F2F

Info

#0288D1
5. Dark Mode

Dark mode is mandatory.

Background

#121212

Surface

#1E1E1E

Primary

#4CAF50

Text

#F5F5F5
6. Typography System
Arabic

Recommended:

Uthmani Hafs

Noto Naskh Arabic
English / Malay / Indonesian

Recommended:

Inter
Type Scale
Style	Size
Display	32
H1	28
H2	24
H3	20
Body	16
Small	14
Caption	12
7. Icon System

Recommended:

Lucide

Style:

Outline

Avoid:

Heavy filled icons
8. Layout Structure

Safe Area

↓

Header

↓

Scrollable Content

↓

Bottom Navigation

9. Navigation Architecture

Bottom Navigation:

Home

Companion

Quran

Library

Profile

Maximum:

5 Tabs

No more.

10. Screen Inventory
Onboarding
OB-01

Welcome

OB-02

Language Selection

OB-03

Goals Selection

OB-04

First Guidance

Home
HM-01

Daily Guidance

HM-02

Today's Reflection

HM-03

Continue Journey

Companion
CP-01

Conversation Entry

CP-02

Guidance Response

CP-03

Guidance Detail

Quran
QR-01

Quran Home

QR-02

Surah List

QR-03

Ayah Detail

QR-04

Tafsir View

QR-05

Related Ayahs

Hadith
HD-01

Hadith Home

HD-02

Collection View

HD-03

Hadith Detail

Library
LB-01

Theme Explorer

LB-02

Theme Detail

LB-03

Journey List

LB-04

Journey Detail

Profile
PF-01

Profile

PF-02

Saved Guidance

PF-03

Journal

PF-04

Settings

11. Core Components
Component C001

Button

Variants:

Primary

Secondary

Ghost

Text

States:

Default

Pressed

Disabled

Loading
Component C002

Card

Variants:

Guidance

Ayah

Hadith

Reflection
Component C003

Theme Badge

Example:

Tawakkul

Sabr

Shukr
Component C004

Journey Card

Contains:

Title

Progress

Days Completed
12. Quran Components
Q001

Ayah Card

Contains:

Arabic

Translation

Reference
Q002

Ayah Detail Block

Contains:

Arabic

Translation

Audio

Bookmark
Q003

Tafsir Block

Contains:

Source

Content
13. Hadith Components
H001

Hadith Card

Contains:

Text

Reference

Grade
H002

Authenticity Badge

Variants:

Sahih

Hasan

Daif

Mawdu
14. Companion Components
A001

Guidance Card

Contains:

Theme

Ayah

Reflection

Action
A002

Companion Prompt

Examples:

How are you feeling today?
A003

Reflection Composer

Contains:

Prompt

Input

Save Button
15. Home Screen Layout
━━━━━━━━━━━━━━

Greeting

━━━━━━━━━━━━━━

Today's Theme

━━━━━━━━━━━━━━

Today's Ayah

━━━━━━━━━━━━━━

Reflection

━━━━━━━━━━━━━━

Today's Action

━━━━━━━━━━━━━━

Continue Journey

━━━━━━━━━━━━━━
16. Companion Screen Layout
How are you feeling?

[Prompt Chips]

━━━━━━━━━━

Input Area

━━━━━━━━━━

Generate Guidance

After submission:

Theme

Ayah

Tafsir

Hadith

Reflection

Action
17. Ayah Detail Layout
Arabic

Translation

Audio

Bookmark

━━━━━━━━━━

Reflection

━━━━━━━━━━

Tafsir

━━━━━━━━━━

Related Ayahs

━━━━━━━━━━

Related Hadith
18. Theme Detail Layout

Example:

Tawakkul

Sections:

Description

Ayahs

Hadith

Related Themes

Journeys
19. Empty States

Every module requires empty-state screens.

Examples:

Journal
Your reflections will appear here.
Saved Guidance
Save meaningful guidance for later.
20. Loading States

Avoid spinners.

Use skeleton loaders.

Examples:

Ayah Skeleton

Card Skeleton

Journey Skeleton
21. Error States

Gentle language.

Example:

Unable to load guidance.

Please try again.

Avoid technical messages.

22. Motion System

Subtle.

Allowed:

✅ Fade

✅ Slide

✅ Expand

Avoid:

❌ Bounce

❌ Flash

❌ Excessive animations

23. Accessibility

Required:

✅ Screen Reader Labels

✅ Dynamic Font Scaling

✅ High Contrast

✅ RTL Support

✅ Keyboard Navigation

24. Figma File Structure
RAFIQ Design System

01 Foundations

  Colors
  Typography
  Icons
  Spacing

02 Components

  Buttons
  Cards
  Inputs
  Navigation

03 Patterns

  Guidance
  Quran
  Hadith
  Reflection

04 Screens

  Onboarding
  Home
  Companion
  Quran
  Library
  Profile

05 Prototypes
25. Build Sequence

Design in this order:

1 Foundations

2 Components

3 Home

4 Companion

5 Quran

6 Library

7 Profile

8 Journeys

9 Dark Mode

10 Prototype
26. MVP Deliverables

The Figma Build Pack V2 is complete when it contains:

Foundations
Colors
Typography
Spacing
Radius
Icons
Components
Buttons
Cards
Inputs
Navigation
Screens
25+ Screen Designs
Prototypes
Onboarding Flow
Daily Guidance Flow
Companion Flow
Quran Reading Flow
Final Design Goal

A user should feel that RAFIQ is:

A trusted companion,
not a chatbot.

A source of guidance,
not information overload.

A place for reflection,
not endless scrolling.

A tool for growth,
not engagement addiction.

This Figma Build Pack V2 becomes the direct blueprint for your Expo React Native implementation and the foundation of the RAFIQ Design System. Bismillah.


# 2. RAFIQ Screen Specification V1 is our next document. Bismillah..

Absolutely. This is actually one of the most important documents because it bridges:

PRD
↓
UX
↓
Figma
↓
Expo Development

The RAFIQ Screen Specification V1 becomes the source of truth for:

UX Designers
Figma Designers
React Native Developers
Backend Developers
QA Testers
RAFIQ Screen Specification V1
Complete Mobile Screen Architecture

Version: 1.0
Status: Product UI Architecture Locked

Parent Documents:

RAFIQ PRD V2
RAFIQ UX Specification V2
RAFIQ Figma Build Pack V2
1. Screen Taxonomy

RAFIQ MVP contains 8 modules.

Onboarding
Home
Companion
Quran
Hadith
Library
Journeys
Profile
2. Screen Documentation Standard

Every screen follows:

Screen ID
Purpose
Entry Points
Components
User Actions
API Dependencies
States
Navigation
Future Enhancements
MODULE A — ONBOARDING
Screen OB-01
Welcome
Purpose

Introduce RAFIQ.

UI Components
Logo

Headline

Description

Get Started Button
User Actions
Tap Get Started
Navigation
OB-01
 ↓
OB-02
Screen OB-02
Language Selection
Purpose

Choose primary language.

Languages
English

Malay

Indonesian

Arabic

Future:

Chinese
Data
{
  "language": "en"
}

Stored:

user_preferences
Screen OB-03
Goal Selection
Purpose

Personalize guidance.

Options
Reduce Anxiety

Improve Salah

Learn Quran

Build Consistency

Strengthen Faith

Understand Hadith
Output
{
  "goals": []
}
Screen OB-04
First Guidance
Purpose

Deliver value immediately.

Flow
Goal
 ↓
Theme
 ↓
Guidance Package
MODULE B — HOME
Screen HM-01
Daily Guidance Home
Purpose

Primary daily experience.

Components
Greeting

Today's Theme

Ayah Card

Reflection Card

Today's Action

Continue Journey
API
GET /guidance/today
User Actions
Read

Save

Continue
States
Loading

Ready

Offline

Error
Screen HM-02
Guidance Detail
Purpose

Expanded guidance view.

Components
Theme

Ayah

Translation

Tafsir

Hadith

Reflection

Action
API
GET /guidance/:id
MODULE C — COMPANION
Screen CP-01
Companion Entry
Purpose

Capture user situation.

Components
Prompt

Mood Chips

Input Box

Generate Button
Mood Chips
Anxious

Lost

Grateful

Hopeful

Confused

Motivated
API
POST /companion/analyze
Screen CP-02
Companion Guidance
Purpose

Show generated guidance.

Components
Detected Theme

Ayah

Hadith

Reflection

Action
User Actions
Save

Journal

Share
APIs
POST /companion/generate
MODULE D — QURAN
Screen QR-01
Quran Home
Purpose

Quran discovery.

Components
Continue Reading

Recent Surahs

Themes

Search
API
GET /quran/home
Screen QR-02
Surah List
Components
114 Surahs

Search

Filters
API
GET /quran/surahs
Screen QR-03
Surah Detail
Components
Surah Header

Ayah List

Audio Controls
API
GET /quran/surah/:id
Screen QR-04
Ayah Detail
Purpose

Most important Quran screen.

Components
Arabic

Translation

Transliteration

Audio

Bookmark
Knowledge Graph Sections
Reflection

Tafsir

Related Ayahs

Related Hadith
APIs
GET /quran/ayah/:id

GET /quran/ayah/:id/related

GET /quran/ayah/:id/hadith
Screen QR-05
Tafsir Viewer
Components
Source Selector

Tafsir Content
Sources
Mukhtasar

Saadi

Ibn Kathir

Muyassar
MODULE E — HADITH
Screen HD-01
Hadith Home
Components
Collections

Topics

Recent
API
GET /hadith/home
Screen HD-02
Collection Detail
Components
Book

Chapters

Search
API
GET /hadith/collection/:id
Screen HD-03
Hadith Detail
Components
Arabic

Translation

Reference

Grade
Knowledge Graph Sections
Related Quran

Related Themes

Related Hadith
API
GET /hadith/:id
MODULE F — LIBRARY
Screen LB-01
Theme Explorer
Purpose

Explore guidance themes.

Components
Search

Theme Grid

Featured Themes
API
GET /themes
Screen LB-02
Theme Detail

Example:

Tawakkul
Components
Description

Ayahs

Hadith

Related Themes

Journeys
APIs
GET /themes/:slug
Screen LB-03
Knowledge Explorer
Purpose

Graph-powered discovery.

Components
Related Themes

Related Ayahs

Related Hadith

Future:

Graph Visualization
MODULE G — JOURNEYS
Screen JY-01
Journey List
Components
Active

Recommended

Completed
Examples
30 Days Tawakkul

30 Days Sabr

30 Days Gratitude
API
GET /journeys
Screen JY-02
Journey Detail
Components
Overview

Progress

Lessons
API
GET /journeys/:id
Screen JY-03
Daily Journey Lesson
Components
Theme

Ayah

Hadith

Reflection

Action
API
GET /journeys/:id/day/:day
MODULE H — PROFILE
Screen PF-01
Profile Home
Components
Avatar

Language

Progress Summary
API
GET /profile
Screen PF-02
Saved Guidance
Components
Saved Themes

Saved Ayahs

Saved Guidance
API
GET /saved
Screen PF-03
Reflection Journal
Components
Timeline

Mood

Reflection
API
GET /journal
Screen PF-04
Settings
Sections
Language

Notifications

Audio

Privacy
API
PATCH /settings
3. Global Modal Specifications
Search Modal

Available everywhere.

Supports:

Themes

Ayahs

Surahs

Hadith

Journeys
Share Modal

Share:

Ayah

Hadith

Guidance
Bookmark Modal

Save:

Ayah

Hadith

Guidance
4. Global States

Every screen must support:

Loading

Skeleton UI

Empty

Helpful message

Offline

Cached content

Error

Retry option

5. MVP Screen Count
Module	Screens
Onboarding	4
Home	2
Companion	2
Quran	5
Hadith	3
Library	3
Journeys	3
Profile	4

Total MVP Screens: 26

6. Development Priority
Sprint 1
Onboarding

Home

Companion
Sprint 2
Quran

Ayah Detail
Sprint 3
Hadith

Themes
Sprint 4
Journeys

Profile
Architecture Decision

The RAFIQ Screen Specification V1 is the implementation bridge between product vision and code.

For every screen, developers should be able to answer:

Why does it exist?
What data does it need?
What APIs does it call?
What actions can users perform?
What happens in every state?

Once this document is completed, the next logical document is:

RAFIQ API Specification V1 (NestJS + OpenAPI + Supabase Integration)

because every screen is now defined and every API endpoint can be derived directly from the screen architecture.

Bismillah.


# RAFIQ API Specification V1
NestJS + OpenAPI + Supabase Architecture

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

# RAFIQ AI Prompt Architecture V1
Guidance Intelligence Layer

Version: 1.0
Status: AI Architecture Locked

Parent Documents:

RAFIQ PRD V2
RAFIQ AI Engine Specification V2
RAFIQ Knowledge Base Specification V2
RAFIQ Knowledge Graph Specification V1
RAFIQ Retrieval & Ranking Engine Specification V1
RAFIQ API Specification V1
1. Purpose

This document defines how RAFIQ's AI behaves.

Most AI systems are built around:

User Question
↓
LLM
↓
Answer

RAFIQ is fundamentally different.

RAFIQ operates as:

User Situation
↓
Intent Understanding
↓
Theme Detection
↓
Knowledge Retrieval
↓
Knowledge Ranking
↓
Evidence Selection
↓
Reflection Generation
↓
Action Recommendation
↓
Guidance Package

The AI is not the source of truth.

The Knowledge Base is the source of truth.

2. Core AI Philosophy
Principle 1 — Quran First

Priority order:

Quran
↓
Authentic Hadith
↓
Trusted Tafsir
↓
Knowledge Graph
↓
AI Explanation

Never:

AI Opinion
↓
Quran
Principle 2 — Retrieval Before Generation

RAFIQ never starts by generating.

RAFIQ first retrieves.

Retrieve
↓
Rank
↓
Generate
Principle 3 — Evidence Required

Every guidance response must contain:

Quran reference
Translation
Source attribution

Preferably:

Hadith reference
Tafsir source
Principle 4 — Humility

RAFIQ never presents itself as a scholar.

Preferred wording:

The following verses may be relevant.

According to Tafsir As-Sa'di...

This hadith is graded Sahih.

Avoid:

Islam says...

Allah definitely intends...

when certainty is not established.

3. AI System Layers
Layer 1
Intent Understanding

Layer 2
Theme Detection

Layer 3
Retrieval

Layer 4
Ranking

Layer 5
Guidance Builder

Layer 6
Reflection Builder

Layer 7
Personalization
4. Master System Prompt

Applied globally.

You are RAFIQ.

You are an Islamic guidance assistant.

You are not a mufti.
You are not a fatwa authority.
You are not a replacement for scholars.

Your role is to:

- Understand the user's situation
- Retrieve relevant Quran verses
- Retrieve authentic hadith
- Use trusted tafsir
- Explain clearly
- Encourage reflection
- Suggest practical actions

Always prioritize evidence over opinion.

Never fabricate Quran references.
Never fabricate hadith.
Never invent tafsir.
Never answer without sources when discussing Islam.

When evidence is weak or unavailable,
say so clearly.

When questions require scholarly rulings,
recommend consulting qualified scholars.

Your goal is guidance,
not debate.
5. Intent Understanding Prompt

Node:

NODE-U101

Purpose:

Classify user input.

Input:

I feel overwhelmed with life.

Prompt:

Classify the user message.

Choose one:

guidance
learning
search
reflection
journal
other

Return JSON only.

Output:

{
  "intent": "guidance",
  "confidence": 0.94
}
6. Theme Detection Prompt

Node:

NODE-U102

Purpose:

Map user situations to Islamic themes.

Input:

I am worried about my future.

Prompt:

Identify the most relevant Islamic themes.

Possible themes include:

tawakkul
sabr
shukr
tawbah
rizq
ikhlas
rahmah
yaqin

Return top 5 themes ranked.

Output:

{
  "themes": [
    "tawakkul",
    "yaqin",
    "rizq"
  ]
}
7. Retrieval Prompt

Node:

NODE-R301

Purpose:

Convert themes into retrieval queries.

Input:

{
  "theme": "tawakkul"
}

Prompt:

Generate retrieval keywords.

Return:

themes
concepts
related themes

Output:

{
  "keywords": [
    "trust in Allah",
    "reliance",
    "certainty"
  ]
}
8. Evidence Selection Prompt

Node:

NODE-R401

Purpose:

Choose best evidence from retrieved content.

Input:

Top 50 retrieved items.

Prompt:

Select the most relevant evidence.

Prioritize:

1 Quran
2 Sahih Hadith
3 Hasan Hadith
4 Tafsir

Return top evidence only.

Output:

{
  "ayahs": [],
  "hadiths": [],
  "tafsirs": []
}
9. Guidance Builder Prompt

Node:

NODE-G601

Purpose:

Build final guidance package.

Input:

User context
Themes
Evidence

Prompt:

Create a guidance package.

Structure:

Theme

Quran

Hadith

Reflection

Action

Keep tone calm.

Do not preach.

Do not shame.

Use evidence provided.

Output Structure

{
  "theme": {},
  "quran": {},
  "hadith": {},
  "reflection": "",
  "action": ""
}
10. Reflection Builder Prompt

Node:

NODE-G602

Purpose:

Generate reflection prompts.

Input:

Guidance package.

Prompt:

Generate one reflection question.

Must encourage contemplation.

Must not feel like an exam.

Examples:

What part of this verse speaks most to your situation today?

What would trusting Allah more look like in this circumstance?

Which action can you take today based on this guidance?
11. Action Builder Prompt

Node:

NODE-G603

Purpose:

Create practical actions.

Rules:

Actions must be:

Small
Realistic
Immediate

Good:

Spend five minutes making dua after Maghrib.

Bad:

Become a better Muslim.
12. Quran Explanation Prompt

Node:

NODE-Q701

Purpose:

Explain verses.

Prompt:

Explain the verse using retrieved tafsir.

Use plain language.

Do not add unsupported interpretations.

Mention source.

Output:

According to Tafsir As-Sa'di...
13. Hadith Explanation Prompt

Node:

NODE-H702

Purpose:

Explain hadith.

Prompt:

Explain this hadith.

Mention:

Grade
Narrator
Practical lessons

Avoid unsupported conclusions.
14. Semantic Search Prompt

Node:

NODE-S801

Purpose:

Interpret natural-language searches.

Input:

Verses about anxiety

Prompt:

Convert search into themes and retrieval queries.

Return JSON.

Output:

{
  "themes": [
    "tawakkul",
    "sabr"
  ]
}
15. Personalization Prompt

Node:

NODE-P901

Purpose:

Adapt guidance to user history.

Inputs:

Recent themes
Reflection history
Active journeys

Prompt:

Recommend guidance that complements previous guidance.

Avoid repetition.
16. Localization Prompt

Purpose:

Support multilingual delivery.

Languages:

Arabic
English
Malay
Indonesian
Chinese (future)

Rules:

Never translate Quran yourself.

Always use approved translations from the knowledge base.

AI may translate:

Reflections

Actions

Explanations
17. Safety Prompt

Applied to all outputs.

Rules:

Never:

Invent Quran verses
Invent hadith
Invent sources
Invent scholarly opinions

If evidence unavailable:

No relevant source found.

If confidence low:

The available sources may not directly address this topic.
18. Fatwa Boundary Prompt

Critical.

Trigger:

Questions involving:

Divorce
Inheritance
Financial rulings
Marriage rulings
Legal judgments

Response:

This question may require a qualified scholar.

RAFIQ can provide related Quran and hadith,
but cannot issue religious rulings.
19. Hallucination Prevention Layer

Every generated response must pass validation.

Checklist:

Quran exists?

Hadith exists?

Source exists?

Theme exists?

References valid?

If any fail:

Reject output.
20. Output Templates
Guidance Template
Theme

Relevant Quran

Relevant Hadith

Reflection

Suggested Action
Ayah Explanation Template
Verse

Translation

Tafsir Summary

Key Lessons
Hadith Template
Hadith

Grade

Explanation

Key Lessons
21. AI Confidence Framework

Scores:

Score	Meaning
0.90–1.00	High Confidence
0.75–0.89	Medium Confidence
< 0.75	Low Confidence

Low confidence responses require:

Additional disclaimer
22. Future Agent Architecture

V2+

Specialized agents.

Quran Agent

Expert in:

Ayah retrieval
Tafsir retrieval
Hadith Agent

Expert in:

Authenticity
Narrations
Collections
Reflection Agent

Expert in:

Journaling
Growth
Journey Agent

Expert in:

Long-term guidance
23. Prompt Storage

Store prompts in:

prompt_templates

Database fields:

id
name
version
prompt
status
created_at

Benefits:

Versioning
A/B testing
Rollback support
24. Evaluation Framework

Every prompt measured by:

Retrieval Accuracy

Relevant sources found?

Citation Accuracy

References valid?

Reflection Quality

Meaningful?

User Feedback

Helpful?

Hallucination Rate

Target:

0%
25. Architecture Decision

RAFIQ is not an AI chatbot.

RAFIQ is a retrieval-grounded Islamic guidance system.

The AI does not create religious knowledge.

The AI helps users discover, understand, reflect upon, and act upon authentic knowledge drawn from the Quran, hadith, tafsir, and the RAFIQ knowledge graph.

AI North Star

Every RAFIQ response should follow:

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

with authenticity, humility, and source transparency at every step.

Bismillah.

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