<!--
Extracted from docs/RAFIQ_raw_info.md lines 10541-11147.
Extraction label: current acquisition matrix.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# RAFIQ Knowledge Acquisition Matrix V2
Full QUL Resource Audit

Build note:

Treat all source claims in this matrix as acquisition candidates until verified in `RAFIQ_Source_Licensing_Register_V1.md`. No candidate source should be used in production guidance before license, access, attribution, and integrity checks are complete.

I completed a full audit of the public QUL catalog.

QUL currently contains 14 major resource categories and is arguably the largest structured Quran dataset available for Muslim developers.

Executive Summary

For RAFIQ, not all QUL resources are equally valuable.

I classify them into:

Tier	Purpose
P0	Required for RAFIQ Core
P1	Strongly Recommended
P2	Future Expansion
P3	Specialized Learning Features
P4	Not Needed
Category 1 — Quran Script
Resource Count

28 Resources

Includes:

Uthmani Script
Tajweed Script
Madani Script
IndoPak Script
Unicode Quran
Quran Images
RAFIQ Decision
Import

YES

Priority

P0

Purpose

Canonical Quran Source

Tables

quran_surahs

quran_ayahs

quran_words

Used By

Daily Guidance
Quran Reader
Search
Tafsir
Companion AI
Category 2 — Quran Metadata
Resource Count

8 Resources

Includes:

Surah
Ayah
Juz
Hizb
Rub
Manzil
Sajdah
Revelation metadata
RAFIQ Decision

Import

YES

Priority

P0

Tables

surahs

ayahs

juz

hizb

Used By

Everything.

Category 3 — Translations
Resource Count

200 Translations

16 Word-by-Word Translations

Total

216 Resources

English Translation Audit

Recommended

Primary

Saheeh International

Purpose

Default English

Secondary

Al-Mukhtasar

Purpose

Simple Reading

Tertiary

Abdullah Yusuf Ali

Purpose

Academic Reference

Malay Translation Audit

Recommended

Primary

Abdul Hameed and Kunhi

Listed in QUL translation resources.

Indonesian Translation Audit

Recommended

Primary

Kementerian Agama RI

Secondary

King Fahad Indonesian

Chinese Translation Audit

Recommended

Primary

Ma Jian

Listed in QUL resources.

RAFIQ Decision

Import

YES

Priority

P0

Tables

translations

Schema

id
ayah_id
language
translator
text
Category 4 — Tafsir
Resource Count

115 Tafsir Resources

35 Mukhtasar

80 Detailed Tafsir

Arabic Tafsir Audit

Highest Value

Tafsir Ibn Kathir
Tafsir al-Tabari
Tafsir al-Qurtubi
Tafsir al-Saadi
Tafsir al-Muyassar

Available within QUL tafsir catalog.

English Tafsir Audit

Recommended

P0

Mukhtasar Tafsir

P1

Ibn Kathir English

Indonesian Tafsir Audit

Recommended

Mukhtasar Indonesian

Chinese Tafsir Audit

Recommended

Chinese Mukhtasar

RAFIQ Decision

Import

YES

Priority

P0

Tables

tafsir

tafsir_groupings
Category 5 — Transliteration
Resource Count

10 Resources

9 Ayah-Based

1 Word-Based

RAFIQ Decision

Import

YES

Priority

P1

Tables

transliterations

Used By

New Muslims
Chinese Users
Malay Users
Learning Mode
Category 6 — Surah Information
Resource Count

9 Languages

Contains:

Revelation Context
Summary
Themes
Key Lessons
RAFIQ Decision

Import

YES

Priority

P1

Tables

surah_information

Very valuable for:

AI explanations
Search
Learning
Category 7 — Topics & Concepts
Resource Count

2,512 Topics

Includes:

Topic hierarchy
Semantic relations
Concept links
This Is RAFIQ Gold

Examples

Tawakkul

Sabr

Tawbah

Rizq

Rahmah

Ikhlas
RAFIQ Decision

Import

YES

Priority

P0

Tables

topics

topic_relations

topic_aliases

This dataset powers:

Mood
 ↓
Theme
 ↓
Quran
 ↓
Guidance
Category 8 — Ayah Themes
Resource Count

1049 Theme Records

Example

2:286

Themes

Trust
Patience
Mercy
RAFIQ Decision

Import

YES

Priority

P0

Tables

ayah_themes

Most important recommendation dataset.

Category 9 — Similar Ayahs
Resource Count

4001 Records

RAFIQ Decision

Import

YES

Priority

P2

Tables

similar_ayahs

Future Feature

You may also like these verses
Category 10 — Mutashabihat
Resource Count

5277 Records

RAFIQ Decision

Import

YES

Priority

P3

Useful For

Hifz
Quran Study
Advanced Learning

Not needed for Guidance V1.

Category 11 — Grammar
Resource Count

77,432 Records

Part-of-speech data.

RAFIQ Decision

Import

NO

V1

YES

V3

Category 12 — Morphology
Resource Count

77,432 Records

Includes:

Roots
Lemmas
Stems
RAFIQ Decision

Import

NO

V1

YES

V3

Future Feature

Explain this Arabic word
Category 13 — Audio
Resource Count

128 Resources

71 Unsegmented

57 Segmented Audio

RAFIQ Decision

Import

NO

Store External References Only

Priority

P2

Reason

Audio storage cost is huge.

Use CDN later.

Category 14 — Mushaf Layouts
Resource Count

28 Layouts

RAFIQ Decision

Import

NO

V1

YES

V4

Needed only if RAFIQ becomes a full Quran Reader.

Final RAFIQ Acquisition Order
Sprint 1

Import

Quran Script

Quran Metadata

Translations
 EN
 MS
 ID
Sprint 2

Import

Tafsir

Transliteration

Surah Information
Sprint 3

Import

Topics

Topic Relations

Ayah Themes
Sprint 4

Import

Chinese Translation

Chinese Tafsir

Similar Ayahs
Final RAFIQ Core Knowledge Stack

For RAFIQ V1, I recommend importing only:

Quran Script
Quran Metadata

English Translation
Malay Translation
Indonesian Translation

English Tafsir
Indonesian Tafsir

Transliteration

Surah Information

Topics
Topic Relations

Ayah Themes

Total operational datasets:

11 core dataset groups

These 11 groups give RAFIQ enough knowledge to deliver:

Daily personalized guidance
Quran recommendations
Tafsir explanations
Theme-based discovery
AI companion conversations
Reflection generation
Multi-language support (Arabic, English, Malay, Indonesian, with Chinese ready for expansion)

while keeping the initial database compact and manageable.


