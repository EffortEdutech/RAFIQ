<!--
Extracted from docs/RAFIQ_raw_info.md lines 6834-7606.
Extraction label: superseded Figma build pack v1.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

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

