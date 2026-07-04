<!--
Extracted from docs/RAFIQ_raw_info.md lines 2805-3724.
Extraction label: superseded UX specification v1.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

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

