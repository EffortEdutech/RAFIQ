<!--
Extracted from docs/RAFIQ_raw_info.md lines 2153-2804.
Extraction label: superseded PRD v1.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

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

