<!--
Extracted from docs/RAFIQ_raw_info.md lines 18544-19305.
Extraction label: current UX specification.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

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

