<!--
Extracted from docs/RAFIQ_raw_info.md lines 15159-15870.
Extraction label: current node catalog.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# RAFIQ Node Catalog V2
Quran + Hadith Guidance Engine

Version: 2.0
Status: Architecture Locked
Supersedes: Node Catalog V1

1. Purpose

The RAFIQ AI Engine is built from modular nodes.

A node is a self-contained processing unit with:

Input
 ↓
Logic
 ↓
Output

Benefits:

Easier maintenance
Easier testing
Easier AI upgrades
Easier workflow design
Future no-code workflow builder
2. RAFIQ Engine Architecture
USER
 ↓

Understanding Layer

 ↓

Theme Layer

 ↓

Knowledge Retrieval Layer

 ↓

Verification Layer

 ↓

Guidance Layer

 ↓

Personalization Layer

 ↓

Response Layer
3. Node Categories
Prefix	Category
U	User Understanding
T	Theme Engine
Q	Quran Engine
H	Hadith Engine
V	Verification Engine
G	Guidance Engine
P	Personalization Engine
R	Response Engine
S	System Nodes
USER UNDERSTANDING LAYER
NODE-U101
User Input Parser

Purpose:

Normalize user input.

Input:

{
  "message": "I feel worried."
}

Output:

{
  "cleanedText": "I feel worried"
}
NODE-U102
Intent Detection

Purpose:

Identify user intent.

Outputs:

guidance

question

study

reflection

search
NODE-U103
Situation Detection

Purpose:

Identify life situation.

Examples:

anxiety

stress

grief

gratitude

anger

confusion

hope

Output:

{
  "situation": "anxiety",
  "confidence": 0.93
}
NODE-U104
Mood Detection

Purpose:

Detect emotional state.

Input:

I am overwhelmed.

Output:

{
  "mood": "anxious"
}
THEME ENGINE
NODE-T201
Primary Theme Detection

Purpose:

Convert situation into Islamic theme.

Example:

anxiety
 ↓
tawakkul

Output:

{
  "theme": "tawakkul"
}
NODE-T202
Secondary Theme Expansion

Purpose:

Find related themes.

Example:

tawakkul
 ↓
sabr
 ↓
yaqin

Output:

{
  "themes": [
    "tawakkul",
    "sabr",
    "yaqin"
  ]
}
NODE-T203
Topic Graph Retrieval

Purpose:

Retrieve topic hierarchy.

Sources:

QUL Topics
Topic Relations
QURAN ENGINE
NODE-Q301
Ayah Theme Search

Purpose:

Find verses matching themes.

Input:

{
  "theme": "tawakkul"
}

Output:

{
  "ayahs": []
}
NODE-Q302
Quran Retrieval

Purpose:

Retrieve full ayah data.

Sources:

Quran
Translation
Metadata
NODE-Q303
Tafsir Retrieval

Purpose:

Retrieve tafsir entries.

Sources:

Mukhtasar
Ibn Kathir
Saadi
Muyassar
NODE-Q304
Related Ayah Retrieval

Purpose:

Find similar verses.

Source:

QUL Similar Ayahs

HADITH ENGINE
NODE-H401
Hadith Topic Search

Purpose:

Find hadith by topic.

Input:

{
  "theme": "tawakkul"
}

Output:

{
  "hadiths": []
}
NODE-H402
Hadith Retrieval

Purpose:

Retrieve full hadith record.

Sources:

hadith-json

Output:

{
  "book": "",
  "number": "",
  "text": ""
}
NODE-H403
Hadith Grade Retrieval

Purpose:

Retrieve grading.

Sources:

Collection metadata
Dorar

Output:

{
  "grade": "sahih"
}
NODE-H404
Hadith Verification Retrieval

Purpose:

Check SemakHadis records.

Output:

{
  "status": "verified"
}
NODE-H405
Hadith Isnad Retrieval

Purpose:

Retrieve chain information.

Source:

LK-Hadith-Corpus

NODE-H406
Related Hadith Retrieval

Purpose:

Find semantically similar hadith.

Source:

Embeddings

VERIFICATION ENGINE
NODE-V501
Quran Validation

Purpose:

Validate Quran source integrity.

Always approved.

NODE-V502
Hadith Grade Validation

Rules:

Sahih → Allow

Hasan → Allow

Daif → Restricted

Mawdu → Reject
NODE-V503
Authenticity Filter

Purpose:

Remove fabricated narrations.

Output:

{
  "approved": true
}
NODE-V504
Source Traceability Check

Purpose:

Ensure source references exist.

Required fields:

source

reference

version
GUIDANCE ENGINE
NODE-G601
Guidance Package Builder

Purpose:

Assemble guidance.

Output:

{
  "theme": {},
  "quran": {},
  "tafsir": {},
  "hadith": {}
}
NODE-G602
Reflection Generator

Purpose:

Generate reflection from retrieved sources.

Important:

May explain.

May summarize.

May not invent religious content.

NODE-G603
Action Recommendation Generator

Purpose:

Generate practical next steps.

Example:

Read Surah Al-Inshirah

Make dua after Maghrib

Write 3 blessings
NODE-G604
Dua Recommendation Node

Purpose:

Retrieve relevant duas.

Future source:

Hisnul Muslim dataset.

PERSONALIZATION ENGINE
NODE-P701
User Profile Retrieval

Purpose:

Load preferences.

Output:

{
  "language": "en"
}
NODE-P702
Reading History Analysis

Purpose:

Analyze user engagement.

NODE-P703
Journey Progress Evaluation

Purpose:

Track growth path.

Examples:

Tawakkul Journey

Sabr Journey

Ramadan Journey
NODE-P704
Recommendation Personalization

Purpose:

Adjust ranking.

Factors:

history

favorites

language

engagement
RESPONSE ENGINE
NODE-R801
Language Localization

Purpose:

Prepare language output.

Supported:

Arabic

English

Malay

Indonesian
NODE-R802
Response Formatting

Purpose:

Build final response structure.

Output:

{
  "guidance": {}
}
NODE-R803
Citation Builder

Purpose:

Attach references.

Example:

Quran 65:2-3

Sahih Muslim 2699
NODE-R804
Companion Tone Engine

Purpose:

Apply RAFIQ personality.

Traits:

Gentle

Encouraging

Reflective

Respectful
SYSTEM NODES
NODE-S901
Retrieval Logging

Purpose:

Track retrieval activity.

NODE-S902
Ranking Engine

Purpose:

Score candidates.

Inputs:

theme_match

verification

user_relevance

engagement

Output:

{
  "score": 0.92
}
NODE-S903
Embedding Search

Purpose:

Semantic retrieval.

Sources:

Hadith embeddings
Future Quran embeddings
NODE-S904
Knowledge Graph Traversal

Purpose:

Navigate relationships.

Examples:

Theme
 ↓
Ayah
 ↓
Hadith
Primary Workflow
Guidance Flow
U101
 ↓
U102
 ↓
U103
 ↓
T201
 ↓
T202
 ↓
Q301
 ↓
Q302
 ↓
Q303
 ↓
H401
 ↓
H402
 ↓
H403
 ↓
V502
 ↓
V503
 ↓
G601
 ↓
G602
 ↓
G603
 ↓
P704
 ↓
R804
 ↓
R802
Study Mode Workflow
User
 ↓
Q302
 ↓
Q303
 ↓
Q304
 ↓
H402
 ↓
H405
 ↓
R803
Search Workflow
User Query
 ↓
S903
 ↓
S904
 ↓
Q302
 ↓
H402
 ↓
R802
Node Inventory Summary
Layer	Nodes
User Understanding	4
Theme Engine	3
Quran Engine	4
Hadith Engine	6
Verification Engine	4
Guidance Engine	4
Personalization Engine	4
Response Engine	4
System Engine	4

Total Nodes: 37

Architecture Decision

RAFIQ V2 is no longer a simple AI assistant.

It is a modular Islamic Guidance Operating System built around:

Quran Knowledge Graph
Hadith Knowledge Graph
Verification Layer
Personalization Layer
Retrieval-Augmented Guidance

This node catalog becomes the blueprint for implementing RAFIQ workflows in:

NestJS services
LangGraph workflows
Custom workflow engines
Future QS-OS style node orchestration

Bismillah.


