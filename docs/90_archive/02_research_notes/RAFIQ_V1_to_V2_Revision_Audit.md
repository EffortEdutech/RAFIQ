<!--
Extracted from docs/RAFIQ_raw_info.md lines 12971-13339.
Extraction label: revision audit explaining superseded docs.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# Yes. The recent QUL audit and Hadith ecosystem audit have significantly expanded RAFIQ's scope. Several documents are now partially outdated and should be revised before we lock RAFIQ V1.

I would classify them into three groups:

Group A — Must Update Immediately

These documents now contain architectural gaps because we originally designed RAFIQ as mostly a Quran + Tafsir platform.

1. RAFIQ Knowledge Base Specification V1

Status:

🔴 Major Update Required

Reason:

Originally included:

Quran
Translations
Tafsir
Themes
Topics

Now must include:

QUL Resources

Hadith Collections

Hadith Grades

SemakHadis Verification

Dorar Verification

LK-Hadith Corpus

Quran-Hadith Links

Hadith Topics

Hadith Embeddings

New Version:

RAFIQ Knowledge Base Specification V2
2. RAFIQ Database Schema & ERD Specification V1

Status:

🔴 Major Update Required

Reason:

Current schema lacks:

hadith_books

hadith_chapters

hadiths

hadith_grades

hadith_verifications

hadith_topics

hadith_topic_links

hadith_embeddings

hadith_annotations

hadith_isnad

quran_hadith_links

This is the biggest database change.

New Version:

Database Schema V2
3. RAFIQ AI Engine Specification V1

Status:

🔴 Major Update Required

Reason:

Current AI flow:

Mood
 ↓
Theme
 ↓
Quran
 ↓
Reflection

New flow:

Mood
 ↓
Theme
 ↓
Quran
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

The retrieval engine changes substantially.

New Version:

AI Engine Specification V2
4. RAFIQ Node Catalog V1

Status:

🔴 Major Update Required

Reason:

We introduced:

NODE-H101

Hadith Retrieval

NODE-H102

Grade Verification

NODE-H103

Authenticity Filter

NODE-H104

Quran-Hadith Linking

These need to be merged into the official catalog.

New Version:

Node Catalog V2
Group B — Recommended Updates

These are still valid but should be enhanced.

5. RAFIQ Product Requirements Document (PRD) V1

Status:

🟡 Enhancement

Add new capabilities:

Verified Hadith Guidance

Hadith Search

Hadith Verification

Quran-Hadith Discovery

Scholar Mode (Future)
6. RAFIQ UX Specification V1

Status:

🟡 Enhancement

Add screens:

Hadith Card

Hadith Details

Verification Badge

Source References

Quran ↔ Hadith Links
7. RAFIQ Figma Build Pack V1

Status:

🟡 Enhancement

New components:

Hadith Card

Grade Badge

Verification Banner

Source Citation Card

Related Hadith Carousel

Quran-Hadith Link Card
8. RAFIQ Backend Blueprint V1

Status:

🟡 Enhancement

Add modules:

hadith

verification

grading

topic-engine
9. RAFIQ Development Blueprint V1

Status:

🟡 Enhancement

Add import pipelines:

QUL Import

Hadith JSON Import

LK Corpus Import

SemakHadis Import
Group C — New Documents That Did Not Exist Before

These should be created.

10. RAFIQ Hadith Knowledge Specification V1

✅ Completed

11. RAFIQ Knowledge Acquisition Matrix V2

Status:

Needs formal release

Contains:

QUL Audit

Hadith Audit

Dataset Inventory

Import Priority
12. RAFIQ Data Import Pipeline Specification V1

Not yet created.

Purpose:

Download

Transform

Validate

Import

Version

for:

QUL
hadith-json
LK Corpus
SemakHadis
13. RAFIQ Knowledge Graph Specification V1

Not yet created.

Purpose:

Topic Graph

Theme Graph

Quran ↔ Topic

Hadith ↔ Topic

Quran ↔ Hadith

This will become the intelligence layer behind guidance.

14. RAFIQ Retrieval & Ranking Engine Specification V1

Not yet created.

Purpose:

How RAFIQ chooses:

Mood

↓

Theme

↓

Best Quran

↓

Best Tafsir

↓

Best Hadith

↓

Best Reflection

This is arguably the most important AI document after the Knowledge Base.

Recommended Update Order

If we continue tomorrow, I would update in this sequence:

Phase 1 (Critical)
RAFIQ Knowledge Base Specification V2
RAFIQ Database Schema & ERD Specification V2
RAFIQ AI Engine Specification V2
RAFIQ Node Catalog V2
Phase 2 (New Core Documents)
RAFIQ Knowledge Graph Specification V1
RAFIQ Retrieval & Ranking Engine Specification V1
RAFIQ Data Import Pipeline Specification V1
Phase 3 (Product Layer)
RAFIQ PRD V2
RAFIQ UX Specification V2
RAFIQ Figma Build Pack V2

At this point, RAFIQ would have a complete architecture built on:

Quran (QUL)
Tafsir (QUL)
Topics & Themes (QUL)
Hadith Collections (hadith-json)
Hadith Intelligence (LK-Hadith-Corpus)
Hadith Verification (SemakHadis + Dorar)
AI Personalization Layer (RAFIQ)

which is a much stronger foundation than the original V1 design. Bismillah.


