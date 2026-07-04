<!--
Extracted from docs/RAFIQ_raw_info.md lines 4585-5321.
Extraction label: superseded knowledge base specification v1.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

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


