<!--
Extracted from docs/RAFIQ_raw_info.md lines 9350-9736.
Extraction label: QUL initial audit notes.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# After reviewing the QUL (Quranic Universal Library) resources, I think this is one of the most valuable datasets available for RAFIQ. It already solves about 70-80% of your Quran knowledge layer.

Executive Summary

For RAFIQ V1, I would focus on only 5 resource categories:

Quran Arabic Text
Quran Translations
Tafsir
Ayah Themes
Topics & Concepts

Everything else is optional V2.

Recommended RAFIQ Knowledge Stack
Layer 1 — Arabic Quran (Mandatory)

Use:

Quran Script (Uthmani)
Quran Metadata
Surah Metadata

QUL provides:

Uthmani script
Tajweed script
Surah metadata
Ayah metadata
Juz/Hizb/Ruku information

For RAFIQ tables:

quran_surahs

quran_ayahs

quran_juz

quran_hizb

This becomes your canonical source.

Layer 2 — English Translation (Mandatory)

QUL currently contains 23 English translations.

For RAFIQ, do NOT import all 23.

Choose:

Primary

English Al-Mukhtasar

Why:

Simple language
Beginner friendly
Consistent with RAFIQ's guidance philosophy
Secondary

Saheeh International

Why:

Most widely used
Easy verification

Recommended schema:

translation_en_primary

translation_en_secondary
Layer 3 — Bahasa Melayu (Mandatory)

QUL contains Malay translations.

For Malaysia users:

Primary

Bahasa Melayu translation

Fallback

English

Do NOT rely only on Indonesian.

Although Malaysians generally understand Indonesian translations, users strongly prefer Malay when available.

Recommended:

translation_ms
Layer 4 — Bahasa Indonesia (Mandatory)

QUL contains Indonesian translations and Indonesian tafsir resources.

Indonesia is a huge growth market.

Potentially:

Indonesia
Brunei
Singapore
Southern Thailand

can all benefit.

Recommended:

translation_id
Layer 5 — Chinese (Strategic)

QUL contains Chinese translations and Chinese tafsir resources.

For RAFIQ:

Not MVP.

But absolutely include in schema.

Reason:

Chinese Muslim market is underserved.

Potential future users:

China
Taiwan
Singapore
Malaysia Chinese Muslims

Recommended:

translation_zh

tafsir_zh
Tafsir Resources

This is where RAFIQ becomes differentiated.

QUL contains:

Arabic Tafsir
English Tafsir
Indonesian Tafsir
Chinese Tafsir
English

Recommended:

Al-Mukhtasar

Perfect for mobile.

Short.

Simple.

Not overwhelming.

Indonesian

Recommended:

Mukhtasar Indonesian

Good balance between:

Simplicity
Reliability
Chinese

Keep for V2.

Most Valuable Dataset in QUL
Ayah Themes

QUL includes thematic labeling of ayat.

Example:

2:286

Themes:
- Patience
- Trust
- Mercy

This is almost exactly what RAFIQ needs.

Instead of manually tagging thousands of verses.

You inherit the work.

Database:

ayah_themes

ayah_id

theme_id

This should become RAFIQ's recommendation backbone.

Gold Mine Dataset
Topics & Concepts

QUL includes:

2512 Topics

with semantic relationships.

This is arguably the most important dataset for RAFIQ AI.

Example:

Tawakkul

related:
- Sabr
- Rizq
- Hope
- Reliance

This means RAFIQ doesn't need to invent a theme graph.

QUL already provides one.

For RAFIQ:

topics

topic_relations

topic_ayahs
Hidden Gem
Similar Ayahs

QUL provides:

4001 Similar Ayahs

and

5277 Mutashabihat

datasets.

Future RAFIQ feature:

User reads:

Surah At-Talaq 65:2-3

RAFIQ can say:

You may also benefit from these related verses.

This creates deeper study journeys.

Hidden Gem #2
Surah Information

QUL provides:

Revelation period
Themes
Summary
Context

in 9 languages.

Perfect for:

Surah Explorer

Daily Learning

Companion Chat
V2 Dataset
Quranic Grammar & Morphology

QUL contains over 77,000 grammar/morphology records.

Not needed for RAFIQ V1.

But useful for:

Future Feature

"Explain this Arabic word"

Example:

Rahmah

Root:
ر ح م

Meaning:
Mercy
V2 Dataset
Word-by-Word Translation

QUL includes word-by-word translations.

Excellent for:

Quran learning
Arabic learning
Interactive tafsir

Not required for V1 guidance.

Recommended Import Plan for RAFIQ
Phase 1 (MVP)

Import:

✅ Quran Script

✅ Quran Metadata

✅ English Translation

✅ Malay Translation

✅ Indonesian Translation

✅ English Tafsir

✅ Indonesian Tafsir

✅ Ayah Themes

✅ Topics & Concepts

Phase 2

Import:

✅ Similar Ayahs

✅ Mutashabihat

✅ Chinese Translation

✅ Chinese Tafsir

✅ Surah Information

Phase 3

Import:

✅ Word-by-word Translation

✅ Morphology

✅ Grammar

✅ Audio Segments

✅ Mushaf Layouts

My Recommendation for RAFIQ

Instead of building your own Islamic knowledge taxonomy from scratch, use QUL as the foundation and build RAFIQ's personalization layer on top.

Architecture:

QUL
 ↓
RAFIQ Knowledge Base
 ↓
Theme Engine
 ↓
Guidance Engine
 ↓
Companion AI

This approach gives RAFIQ access to hundreds of translations, tafsir resources, themes, topics, and Quran metadata from day one, while allowing you to focus your effort on what makes RAFIQ unique: personalized daily guidance and reflection.

