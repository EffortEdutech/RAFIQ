<!--
Extracted from docs/RAFIQ_raw_info.md lines 3725-4584.
Extraction label: superseded AI engine specification v1.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

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

