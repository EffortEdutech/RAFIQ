<!--
Extracted from docs/RAFIQ_raw_info.md lines 13340-13933.
Extraction label: current knowledge base specification.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# RAFIQ Knowledge Base Specification V2

Hadith source-audit override, 2026-06-13:

Any later section naming one repository as RAFIQ's primary hadith source is
superseded by the Day 5 Resource Audit decision. RAFIQ will collect all
technically available candidates for private comparison while preserving
source-specific identity and quarantining risk-flagged datasets.
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


