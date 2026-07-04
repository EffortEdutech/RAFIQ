<!--
Extracted from docs/RAFIQ_raw_info.md lines 14602-15158.
Extraction label: current AI engine specification.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# RAFIQ AI Engine Specification V2
Personal Islamic Guidance Intelligence System

Build note:

Use `RAFIQ_AI_Validation_Gates_V1.md` and `../07_governance/RAFIQ_Trust_Authenticity_Framework_V1.md` as mandatory implementation overlays. Retrieval and generation flows are not production-ready unless the validation gates pass.

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

