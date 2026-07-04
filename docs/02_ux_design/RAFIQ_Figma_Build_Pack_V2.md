<!--
Extracted from docs/RAFIQ_raw_info.md lines 19616-20397.
Extraction label: current Figma build pack.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

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


