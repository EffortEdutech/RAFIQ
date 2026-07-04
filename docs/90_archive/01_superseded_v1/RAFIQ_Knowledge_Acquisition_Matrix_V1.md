<!--
Extracted from docs/RAFIQ_raw_info.md lines 9885-10540.
Extraction label: superseded acquisition matrix v1.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# RAFIQ Knowledge Acquisition Matrix V1
Official QUL Import Plan

Version: 1.0

Status: Approved for Data Acquisition

Source:

Quranic Universal Library (QUL) Resources Portal

QUL currently provides:

200+ translations
115+ tafsir resources
2,512 Quranic topics
1,049 ayah themes
4,001 similar ayahs
77,000+ morphology records
Surah information in 9 languages
Quran metadata datasets
Quran script datasets
Tier P0 — Mandatory Foundation

These datasets should be imported before any AI work begins.

Priority	Dataset	Language	Category	RAFIQ Table
P0	Quran Uthmani Script	Arabic	Quran Text	quran_ayahs
P0	Quran Metadata	Arabic	Metadata	quran_surahs
P0	Surah Information	Arabic + Multi	Metadata	surah_information
P0	Quran Transliteration	Multi	Learning	transliterations

Source:

Quran Script Resources

Quran Metadata Resources

Tier P1 — English Layer

Primary language for international users.

Dataset EN-001

Title

Saheeh International

Language

English

Category

Translation

Priority

P1

Recommended Usage

Default English Translation

Reason

Widely used and trusted in modern Quran applications.

Resource Page

Saheeh International Resource

Import To

translations

Formats

simple.json
simple.sqlite
footnote.json
footnote.sqlite
Dataset EN-002

Title

Al-Mukhtasar Translation

Language

English

Category

Translation

Priority

P1

Purpose

Simple beginner-friendly translation.

Resource Page

QUL Translation Resources

Import To

translations
Dataset EN-003

Title

English Mukhtasar Tafsir

Language

English

Category

Tafsir

Priority

P1

Purpose

Mobile-friendly tafsir.

Resource Page

QUL Tafsir Resources

Import To

tafsir
Tier P1 — Bahasa Melayu Layer

Primary Malaysian language.

Dataset MS-001

Title

Abdullah Basmeih Translation

Language

Bahasa Melayu

Category

Translation

Priority

P1

Purpose

Primary Malaysian translation.

Resource Page

Malay Translation Resources

Import To

translations
Dataset MS-002

Title

Malay Surah Information

Language

Bahasa Melayu

Category

Metadata

Priority

P1

Purpose

Localized Surah introductions.

Resource Page

Surah Information Resources

Import To

surah_information
Tier P1 — Bahasa Indonesia Layer

Critical market for RAFIQ expansion.

Dataset ID-001

Title

Kementerian Agama RI Translation

Language

Bahasa Indonesia

Category

Translation

Priority

P1

Purpose

Primary Indonesian translation.

Resource Page

Indonesian Translation Resources

Import To

translations
Dataset ID-002

Title

Indonesian Mukhtasar Tafsir

Language

Bahasa Indonesia

Category

Tafsir

Priority

P1

Purpose

Primary Indonesian tafsir.

Resource Page

Indonesian Tafsir Resources

Import To

tafsir
Dataset ID-003

Title

Indonesian Surah Information

Language

Bahasa Indonesia

Category

Metadata

Priority

P1

Import To

surah_information
Tier P2 — Chinese Layer

Strategic future market.

Dataset ZH-001

Title

Ma Jian Translation

Language

Chinese Simplified

Category

Translation

Priority

P2

Purpose

Primary Chinese translation.

Resource Page

Chinese Translation Resources

Import To

translations
Dataset ZH-002

Title

Chinese Tafsir

Language

Chinese

Category

Tafsir

Priority

P2

Import To

tafsir
Dataset ZH-003

Title

Chinese Surah Information

Language

Chinese

Category

Metadata

Priority

P2

Import To

surah_information
Tier P0 — RAFIQ Theme Engine

This is the most important section for RAFIQ AI.

Dataset AI-001

Title

Topics & Concepts

Records

2,512 Topics

Language

Multi-language

Category

Knowledge Graph

Purpose

Build RAFIQ Theme Engine.

Examples

Tawakkul
Sabr
Shukr
Rahmah
Tawbah

Resource Page

Topics & Concepts Dataset

Import To

topics

topic_relations

QUL includes semantic relationships between concepts.

Dataset AI-002

Title

Ayah Themes

Records

1,049 Theme Groups

Category

Theme Classification

Purpose

Map verses to life situations.

Resource Page

Ayah Themes Dataset

Import To

ayah_themes

This should become RAFIQ's recommendation backbone.

Dataset AI-003

Title

Topic Relationships

Category

Knowledge Graph

Purpose

Build semantic navigation.

Example

Tawakkul
 ├─ Sabr
 ├─ Rizq
 ├─ Hope
 └─ Reliance

Import To

topic_relations
Dataset AI-004

Title

Surah Themes

Category

Knowledge Graph

Purpose

Theme-aware Surah recommendations.

Import To

surah_themes
Tier P2 — Discovery Engine
Dataset DISC-001

Title

Similar Ayahs

Records

4,001

Purpose

Recommend related verses.

Import To

similar_ayahs

Resource Page

Similar Ayahs Dataset

Dataset DISC-002

Title

Mutashabihat

Records

5,277

Purpose

Verse similarity exploration.

Import To

mutashabihat

Tier P3 — Quran Learning Engine
Dataset EDU-001

Title

Word-by-Word Translation

Languages

English

Malay

Indonesian

Chinese

Purpose

Interactive learning.

Import To

word_translations
Dataset EDU-002

Title

Quranic Grammar

Records

77,000+

Purpose

Advanced Arabic learning.

Import To

grammar

Dataset EDU-003

Title

Quranic Morphology

Records

77,000+

Purpose

Root-word analysis.

Import To

morphology

Final RAFIQ Import Roadmap
Sprint 1

Import:

✓ Quran Script

✓ Quran Metadata

✓ Surah Information

✓ Saheeh International

✓ Malay Translation

✓ Indonesian Translation

Sprint 2

Import:

✓ English Tafsir

✓ Indonesian Tafsir

✓ Transliteration

Sprint 3

Import:

✓ Topics & Concepts

✓ Ayah Themes

✓ Topic Relationships

✓ Surah Themes

Sprint 4

Import:

✓ Chinese Translation

✓ Chinese Tafsir

✓ Similar Ayahs

✓ Mutashabihat

RAFIQ Core Dataset Count

For V1, RAFIQ only needs:

Category	Datasets
Quran Text	1
Metadata	3
Translations	4
Tafsir	2
Theme Engine	4
Discovery	2

Total = 16 datasets

These 16 datasets are sufficient to build:

Daily Guidance
Theme Matching
Quran Recommendations
Tafsir Reading
Reflection Engine
Companion Chat
Topic Search
Personalized Islamic Growth Journeys

while keeping the knowledge base manageable and maintainable.


