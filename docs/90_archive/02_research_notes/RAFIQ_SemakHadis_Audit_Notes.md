<!--
Extracted from docs/RAFIQ_raw_info.md lines 11148-11455.
Extraction label: SemakHadis audit notes.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# Yes. After auditing SemakHadis, I would strongly recommend that RAFIQ include a dedicated Hadith Knowledge Layer alongside QUL.

My conclusion is:

QUL should be RAFIQ's Quran Knowledge Foundation.

SemakHadis should be RAFIQ's Malay Hadith Verification Foundation.

What SemakHadis Actually Provides

SemakHadis is not merely a hadith collection.

It is a curated verification platform designed to help users determine whether a hadith is:

Sahih
Hasan
Daif
Mawdu' (fabricated)
Misquoted
Viral but incorrect

The project aggregates hadith evaluations from trusted Arabic and Malay sources and includes references for verification.

Their sources include:

Dorar al-Sunniyyah
Sunnah.com
Arabic hadith encyclopedias
Malay hadith research publications
Academic theses
Research by hadith scholars and students of knowledge.

The SemakHadis project database reportedly contains around 14,000 weak or fabricated hadith records, with expansion toward accepted (maqbul) hadith collections.

What RAFIQ Is Missing Today

Current RAFIQ Knowledge Stack:

Quran
Tafsir
Translations
Themes
Topics

Missing:

Hadith Collections

Hadith Grading

Hadith Verification

Hadith Themes

Hadith Relationships

Without these, RAFIQ's AI can accidentally:

quote weak narrations
mix hadith wording
misattribute references
provide unverifiable statements
Proposed RAFIQ Hadith Knowledge Architecture
Layer 1 — Canonical Hadith Collections

Priority P0

Sources:

Sunnah.com
SemakHadis references
Public hadith datasets

Collections:

Collection	Priority
Sahih al-Bukhari	P0
Sahih Muslim	P0
Riyad as-Salihin	P0
Al-Adab Al-Mufrad	P1
Jami' at-Tirmidhi	P1
Sunan Abu Dawud	P1
Sunan an-Nasa'i	P1
Sunan Ibn Majah	P1
Layer 2 — Hadith Grading

Priority P0

Database:

hadith_grades

Fields:

hadith_id

grade

grader

reference

Examples:

Sahih

Hasan

Daif

Mawdu

This becomes mandatory for every hadith shown inside RAFIQ.

Layer 3 — SemakHadis Verification Layer

Priority P0

Database:

hadith_verification

Purpose:

Store:

Viral hadith checks
Malay explanations
Correction notes
Authenticity discussions

This is unique value for Malaysian users.

Layer 4 — Hadith Themes

Priority P0

Equivalent to QUL Topics.

Example:

Patience

Trust

Gratitude

Prayer

Family

Marriage

Children

Work

Provision

Repentance

Database:

hadith_topics

hadith_topic_links
Layer 5 — Quran ↔ Hadith Linking

This is where RAFIQ becomes powerful.

Example:

User mood:

Anxiety

Theme:

Tawakkul

Retrieve:

Quran:

65:3

Tafsir:

Mukhtasar

Hadith:

Bukhari

Reflection:

Trust Allah while taking means.

This creates a complete guidance package.

New RAFIQ Dataset Group

We should extend the Knowledge Acquisition Matrix.

Category H — Hadith Knowledge
HAD-001

Canonical Hadith Collections

Priority:

P0

Tables:

hadith_books

hadith_chapters

hadiths
HAD-002

Hadith Grades

Priority:

P0

Tables:

hadith_grades
HAD-003

SemakHadis Verification Records

Priority:

P0

Tables:

hadith_verifications

Source:

SemakHadis

HAD-004

Hadith Topics

Priority:

P1

Tables:

hadith_topics
HAD-005

Quran-Hadith Links

Priority:

P1

Tables:

quran_hadith_links
Revised RAFIQ Core Knowledge Stack

I would now define RAFIQ V1 Knowledge Base as:

Quran Text

Quran Metadata

Translations
 EN
 MS
 ID

Tafsir
 EN
 ID

Transliteration

Surah Information

Quran Topics

Ayah Themes

Hadith Collections

Hadith Grades

SemakHadis Verification

Quran-Hadith Links

This changes RAFIQ from a Quran guidance app into a much more complete Islamic guidance platform while maintaining strong source verification and authenticity controls.

My next recommendation would be to 
produce a RAFIQ Hadith Knowledge Specification V1, defining the exact database schema, import strategy, grading model, verification workflow, and AI retrieval logic for all hadith-related content.


