<!--
Extracted from docs/RAFIQ_raw_info.md lines 20398-21003.
Extraction label: current screen specification.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# 2. RAFIQ Screen Specification V1 is our next document. Bismillah..

Build note:

Use `../01_product/RAFIQ_MVP_Scope_Lock_V1.md` for screen priority. The 26-screen inventory is the complete product UI architecture, not a requirement that every screen ships in the first build.

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


