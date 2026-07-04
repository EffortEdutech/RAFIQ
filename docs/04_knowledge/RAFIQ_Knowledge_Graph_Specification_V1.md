<!--
Extracted from docs/RAFIQ_raw_info.md lines 15871-16517.
Extraction label: current knowledge graph specification.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# RAFIQ Knowledge Graph Specification V1
The Islamic Intelligence Layer

Version: 1.0
Status: Architecture Locked
Parent Documents:

RAFIQ Knowledge Base Specification V2
RAFIQ Database Schema & ERD Specification V2
RAFIQ AI Engine Specification V2
RAFIQ Node Catalog V2
1. Vision

Most Islamic apps store content.

RAFIQ stores knowledge relationships.

Traditional approach:

Quran
Hadith
Tafsir

Stored separately

RAFIQ approach:

Quran
   ↔
Themes
   ↔
Hadith
   ↔
Tafsir
   ↔
Guidance
   ↔
User Journey

This interconnected structure becomes the RAFIQ Knowledge Graph.

2. Why a Knowledge Graph?

Without a graph:

User asks:
"I feel worried"

Search returns:

Keyword:
worried

Poor results.

With a graph:

Worried
 ↓

Anxiety
 ↓

Tawakkul
 ↓

Sabr
 ↓

Yaqin
 ↓

Relevant Quran
 ↓

Relevant Hadith

This enables true guidance instead of simple search.

3. Graph Layers

RAFIQ V1 contains six graph layers.

Theme Graph

Quran Graph

Hadith Graph

Relationship Graph

Guidance Graph

User Graph
4. Theme Graph

The Theme Graph is the center of the entire system.

Every retrieval starts from themes.

Core Themes

Examples:

Tawakkul

Sabr

Shukr

Tawbah

Rahmah

Ikhlas

Rizq

Hidayah

Yaqin

Akhlaq
Theme Relationships

Example:

Tawakkul
 ├─ Sabr
 ├─ Yaqin
 └─ Rizq

Stored in:

topics

topic_relations
Theme Types
Type	Example
Emotional	Fear
Spiritual	Tawakkul
Ethical	Akhlaq
Worship	Salah
Family	Rahmah
Financial	Rizq
5. Quran Graph

Connects verses to themes.

Structure
Theme
 ↓
Ayah
 ↓
Surah

Example

Tawakkul

 ↓

65:2-3

 ↓

At-Talaq
Stored In
ayah_themes

Example Record

{
  "ayah": "65:2-3",
  "theme": "tawakkul",
  "confidence": 0.98
}
6. Similar Ayah Graph

Source:

QUL Similar Ayahs

Purpose:

Connect verses discussing similar concepts.

Example

65:2-3
  ↔
3:159
  ↔
8:2

Stored In

related_ayahs

Benefits

Study Mode

Deep Research

Guided Reflection
7. Hadith Graph

Connects hadith to themes.

Example

Tawakkul
 ↓

Bukhari 6463
 ↓

Related Hadith

Stored In

hadith_topics

Example

{
  "hadith": "Bukhari 6463",
  "theme": "tawakkul",
  "confidence": 0.96
}
8. Hadith Similarity Graph

Generated using:

Embeddings
LK-Hadith-Corpus
Semantic Search

Example

Hadith A
 ↓
Trust Allah

 ↔

Hadith B
 ↓
Reliance on Allah

Stored In

related_hadiths
9. Quran ↔ Hadith Graph

Most important RAFIQ relationship.

Purpose

Connect revelation and prophetic explanation.

Example

Quran

65:2-3

↓

Theme:
Tawakkul

↓

Hadith

Bukhari 6463

Stored In

quran_hadith_links

Relationship Types

Type	Meaning
Supports	Reinforces
Explains	Clarifies
Expands	Adds details
Example Of	Demonstrates implementation

Example

{
  "ayah": "65:2-3",
  "hadith": "Bukhari 6463",
  "relationship": "supports"
}
10. Tafsir Graph

Connects verses to scholarly explanations.

Structure

Ayah
 ↓
Tafsir
 ↓
Themes

Example

65:2-3

 ↓

Mukhtasar

 ↓

Tawakkul

 ↓

Rizq

Benefits

Allows AI to retrieve context instead of isolated verses.

11. Guidance Graph

Transforms knowledge into actionable guidance.

Structure

Theme
 ↓
Quran
 ↓
Hadith
 ↓
Reflection
 ↓
Action

Example

Anxiety

 ↓

Tawakkul

 ↓

65:2-3

 ↓

Bukhari 6463

 ↓

Reflection

 ↓

Action Plan

Stored In

guidance_packages
12. User Graph

The personalization layer.

Structure

User
 ↓

Mood

 ↓

Themes

 ↓

Guidance

 ↓

Progress

Example

User

 ↓

Anxiety

 ↓

Tawakkul

 ↓

Read 65:2-3

 ↓

Completed Reflection

Stored In

user_moods

user_journeys

saved_guidance
13. Graph Traversal Rules

The AI never searches randomly.

It traverses the graph.

Example 1

User:

I am afraid of the future.

Traversal:

Fear

 ↓

Tawakkul

 ↓

Ayahs

 ↓

Tafsir

 ↓

Hadith

 ↓

Reflection

Example 2

User:

Show me verses about gratitude.

Traversal:

Shukr

 ↓

Ayah Themes

 ↓

Quran

 ↓

Related Ayahs
14. Confidence Scores

Every relationship carries confidence.

Example

{
  "theme": "tawakkul",
  "ayah": "65:2-3",
  "confidence": 0.98
}

Score Sources

Source	Confidence
Human Curated	1.00
QUL Themes	0.95
Scholar Mapping	0.95
AI Assisted	0.70
Embedding Similarity	0.60
15. Graph Expansion Strategy

V1

Themes

Ayahs

Hadith

Tafsir

V2

Duas

Asmaul Husna

Stories of Prophets

Fiqh Topics

V3

Scholarly Opinions

Learning Paths

Islamic Courses

Knowledge Maps
16. Knowledge Graph Nodes

Current estimated graph size:

RAFIQ knowledge graph estimate

Projected node counts for initial V1 knowledge graph.

0
15,000
30,000
45,000
60,000
Quran Ayahs
Hadiths
Topics
Tafsir Entries
Quran-Hadith Links
User Journey Nodes

This will grow continuously as relationships are added.

17. Knowledge Graph API

Future internal API:

GET /graph/theme/{slug}

GET /graph/ayah/{id}

GET /graph/hadith/{id}

GET /graph/related/ayah/{id}

GET /graph/related/hadith/{id}
18. Integration with RAFIQ Nodes

Graph-aware nodes:

NODE-T203
Topic Graph Retrieval

NODE-Q304
Related Ayah Retrieval

NODE-H406
Related Hadith Retrieval

NODE-S904
Knowledge Graph Traversal

These nodes become the graph gateway for the AI engine.

19. Retrieval Philosophy

Traditional Search:

Keyword
 ↓
Results

RAFIQ Graph Retrieval:

Situation
 ↓

Theme
 ↓

Quran
 ↓

Tafsir
 ↓

Hadith
 ↓

Reflection
 ↓

Action

This is the core intellectual advantage of RAFIQ.

20. Architecture Decision

The RAFIQ Knowledge Graph is the central intelligence layer that connects:

Quran

↕

Themes

↕

Hadith

↕

Tafsir

↕

Guidance

↕

Users

Everything in RAFIQ should eventually be reachable through graph traversal rather than direct keyword lookup.

This transforms RAFIQ from a content application into an Islamic Knowledge Intelligence Platform capable of delivering personalized, traceable, and authentic guidance. Bismillah.


