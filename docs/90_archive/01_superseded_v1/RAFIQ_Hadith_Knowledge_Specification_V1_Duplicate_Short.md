<!--
Extracted from docs/RAFIQ_raw_info.md lines 11456-12052.
Extraction label: shorter duplicate hadith specification.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# RAFIQ Hadith Knowledge Specification V1
Authentic Hadith Intelligence Layer

Version: 1.0

Status: Approved Architecture

Parent Documents:

RAFIQ PRD V1
RAFIQ AI Engine Specification V1
RAFIQ Knowledge Base Specification V1
RAFIQ Database Schema Specification V1
RAFIQ Node Catalog V1
1. Vision

RAFIQ should not merely quote hadith.

RAFIQ should:

Retrieve authentic hadith
Display source references
Display grading
Explain relevance
Connect hadith to Quran themes
Prevent unauthenticated narrations
Support Malay, English, Indonesian, and eventually Chinese users

Goal:

Every hadith shown in RAFIQ should be traceable, verifiable, and contextualized.

2. Design Principles
Principle 1

Authenticity Before Personalization

Never select a hadith solely because it matches a mood.

Authenticity is checked first.

Principle 2

Source Transparency

Every hadith must show:

Book
Chapter
Number
Grade
Source

Example:

Sahih al-Bukhari
Hadith 6463

Grade:
Sahih
Principle 3

No AI-Generated Hadith

AI may explain a hadith.

AI must never invent:

hadith text
grading
references
chains of narration
Principle 4

Verification Layer

All hadith displayed must pass:

Verification Node

before reaching users.

3. Knowledge Architecture
Canonical Collections
          ↓

Grade Database
          ↓

Verification Database
          ↓

Topic Classification
          ↓

Quran-Hadith Linking
          ↓

AI Retrieval Layer
4. Knowledge Sources
Tier A (Primary Sources)

Recommended collections:

P0

Sahih al-Bukhari

Sahih Muslim

P1

Riyad as-Salihin

Jami' at-Tirmidhi

Sunan Abu Dawud

Sunan an-Nasa'i

Sunan Ibn Majah

P2

Al-Adab Al-Mufrad

5. Verification Sources

Priority sources:

Malaysian Layer

SemakHadis

Purpose:

Malay explanations
Viral hadith verification
Fabricated narration detection
International Layer

Sunnah.com

Purpose:

Canonical references
English translations
Scholarly Verification

Dorar al-Sunniyyah

Purpose:

Grading verification
Scholarly authentication
6. Database Architecture
hadith_books
id
slug
name_ar
name_en
name_ms
name_id

author
total_hadith
priority
hadith_chapters
id

book_id

chapter_number

title_ar
title_en
title_ms
title_id
hadiths
id

book_id

chapter_id

hadith_number

text_ar

text_en

text_ms

text_id

narrator

source_url
7. Hadith Grading Model
hadith_grades
id

hadith_id

grade

scholar

source

notes

Supported grades

Sahih

Hasan

Daif

Mawdu

Munkar

Unknown

Display Rules

Grade	Show
Sahih	Yes
Hasan	Yes
Daif	Limited
Mawdu	Never
Unknown	Internal Only
8. Verification Layer
hadith_verifications
id

hadith_id

verification_source

status

explanation

verified_at

Statuses

verified

disputed

weak

fabricated
9. Hadith Topic Engine

Equivalent to QUL Topics.

hadith_topics
id

slug

name_en
name_ms
name_id
name_ar

Examples

Patience

Trust

Prayer

Family

Marriage

Children

Repentance

Provision

Hope

Gratitude

Character

Kindness

Mercy
hadith_topic_links
hadith_id

topic_id

confidence
10. Quran-Hadith Relationship Layer

One of RAFIQ's most valuable features.

quran_hadith_links
id

surah

ayah

hadith_id

relationship_type

Relationship Types

supports

explains

expands

example_of

Example

65:3

↓

Bukhari 6463

↓

Theme:
Tawakkul
11. Multi-Language Strategy

Supported Languages

Language	V1
Arabic	Yes
English	Yes
Malay	Yes
Indonesian	Yes
Chinese	Future

Fallback Rules

Requested Language

↓

Available?

↓

Yes → Display

No

↓

English

↓

Arabic
12. RAFIQ AI Retrieval Logic

Workflow

Theme

↓

Find Quran

↓

Find Tafsir

↓

Find Related Hadith

↓

Check Grade

↓

Check Verification

↓

Build Guidance

Example

Mood

Anxiety

Theme

Tawakkul

Retrieve

Quran
65:2-3

Retrieve

Hadith
Bukhari

Verify

Sahih

Deliver

Quran
+
Tafsir
+
Hadith
+
Reflection
13. New Node Catalog Entries
NODE-H101

Hadith Retrieval Node

Purpose

Find relevant hadith.

Input

{
  "theme": "tawakkul"
}

Output

{
  "hadithId": "BUKHARI_6463"
}
NODE-H102

Grade Verification Node

Purpose

Validate grading.

Output

{
  "grade": "sahih"
}
NODE-H103

Authenticity Filter Node

Purpose

Remove weak or fabricated narrations.

Output

{
  "approved": true
}
NODE-H104

Quran-Hadith Link Node

Purpose

Retrieve supporting hadith.

14. Guidance Package Structure

Updated response:

{
  "theme": {},
  "quran": {},
  "tafsir": {},
  "hadith": {
    "book": "",
    "number": "",
    "grade": "",
    "text": ""
  },
  "reflection": [],
  "action": {},
  "dua": {}
}
15. Safety Rules

Never:

❌ Invent hadith

❌ Invent references

❌ Invent grading

❌ Invent scholars

❌ Invent narrators

Always:

✅ Retrieve from database

✅ Verify source

✅ Verify grading

✅ Display references

16. Import Roadmap
Sprint 1

Import

Bukhari

Muslim
Sprint 2

Import

Riyad as-Salihin

Tirmidhi
Sprint 3

Import

Abu Dawud

Nasa'i

Ibn Majah
Sprint 4

Import

SemakHadis Verification Records
Sprint 5

Build

Topic Engine

Quran-Hadith Links
17. RAFIQ Hadith Core Mission

The Hadith Layer is not intended to become a searchable encyclopedia first.

Its primary role is:

User Situation
        ↓
Theme Detection
        ↓
Quran Guidance
        ↓
Authentic Hadith Support
        ↓
Reflection
        ↓
Action

The result is a guidance system grounded in:

Quran
Tafsir
Authentic Hadith
Verified scholarship
Personal reflection

while maintaining traceability, authenticity, and multilingual accessibility for RAFIQ users. Bismillah.


