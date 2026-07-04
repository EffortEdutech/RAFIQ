<!--
Extracted from docs/RAFIQ_raw_info.md lines 17215-17977.
Extraction label: current data import pipeline specification.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# RAFIQ Data Import Pipeline Specification V1
Quran, Tafsir, Hadith & Knowledge Graph Acquisition System

Hadith source-audit override, 2026-06-13:

The later Day 5 audit supersedes any single-source acquisition strategy.
Acquire all technically available hadith datasets into source-specific raw
zones, quarantine risk-flagged snapshots, and preserve language editions,
references, URNs, grade assertions, rights, and provenance independently.

Build note:

Imports must only promote content from sources approved in `RAFIQ_Source_Licensing_Register_V1.md`, and published content must follow `../07_governance/RAFIQ_Content_Governance_Specification_V1.md`.

Private development and staging imports may use technically validated sources
whose approval is pending, subject to
`../09_sprints/resource_audit_import_prototype/BUILD_PENDING_CONTENT_APPROVAL_DECISION.md`.
The complete private platform may import, index, retrieve, display, and test
all such content. Pending content must be access-controlled and excluded only
from public-release publication and public retrieval.

Version: 1.0
Status: Architecture Locked

Parent Documents:

RAFIQ Knowledge Base Specification V2
RAFIQ Database Schema & ERD Specification V2
RAFIQ Knowledge Graph Specification V1
RAFIQ Retrieval & Ranking Engine Specification V1
RAFIQ Backend Blueprint V1
1. Vision

The RAFIQ Data Import Pipeline is responsible for acquiring, validating, transforming, enriching, and publishing Islamic knowledge into the RAFIQ platform.

Its purpose is to ensure that every piece of knowledge inside RAFIQ is:

Authentic
Traceable
Structured
Searchable
Relationship-aware
AI-ready
Core Principle

AI should never be the source of knowledge.

AI only consumes knowledge that has already passed through the RAFIQ Import Pipeline.

External Sources
       ↓
Import Pipeline
       ↓
Validation
       ↓
Normalization
       ↓
Enrichment
       ↓
Knowledge Graph
       ↓
RAFIQ AI
2. Data Domains

The pipeline manages six domains.

Quran

Translations

Tafsir

Hadith

Verification

Knowledge Graph
3. Import Architecture
Source Connectors
        ↓

Raw Import Layer
        ↓

Validation Layer
        ↓

Transformation Layer
        ↓

Enrichment Layer
        ↓

Knowledge Graph Builder
        ↓

Publishing Layer
        ↓

Production Database
4. Pipeline Stages
Stage	Purpose
Extract	Acquire source data
Validate	Verify integrity
Transform	Normalize format
Enrich	Add metadata
Link	Build relationships
Publish	Push to production
5. Source Registry

Every source must be registered.

source_registry
id

name

domain

version

license

source_url

status

last_imported_at

Example:

Source	Domain
QUL Quran	Quran
QUL Topics	Themes
Hadith JSON	Hadith
LK Corpus	Hadith Intelligence
SemakHadis	Verification
6. Quran Import Pipeline

Primary source:

QUL Resources Portal

Stage 1

Acquire:

Surahs

Ayahs

Metadata
Stage 2

Validate:

6236 ayahs

114 surahs

Integrity checks:

Missing ayahs

Duplicate ayahs

Corrupted text
Stage 3

Transform:

Convert to RAFIQ schema:

quran_surahs

quran_ayahs
Stage 4

Publish

Production Database
7. Translation Import Pipeline

Sources:

English
Malay
Indonesian
Chinese
Import Flow
Translation File
      ↓

Language Validation
      ↓

Ayah Matching
      ↓

Normalization
      ↓

Database Insert

Validation Rules:

Ayah exists

Language valid

Translator identified

Target Table:

quran_translations
8. Tafsir Import Pipeline

Sources:

Mukhtasar
Ibn Kathir
Saadi
Muyassar
Flow
Tafsir Source
      ↓

Ayah Mapping
      ↓

Language Mapping
      ↓

Metadata Enrichment
      ↓

Database Insert

Target:

quran_tafsir
9. Hadith Import Pipeline

Primary Source:

hadith-json Repository

Collections:

Sahih al-Bukhari
Sahih Muslim
Jami' at-Tirmidhi
Sunan Abu Dawud
Sunan an-Nasa'i
Sunan Ibn Majah
Flow
Raw JSON
      ↓

Collection Validation
      ↓

Chapter Extraction
      ↓

Hadith Extraction
      ↓

Normalization
      ↓

Database Insert

Tables:

hadith_books

hadith_chapters

hadiths
10. Hadith Grade Pipeline

Sources:

SemakHadis
Dorar
Collection metadata
Flow
Hadith
      ↓

Grade Lookup
      ↓

Validation
      ↓

Normalization
      ↓

Database Insert

Target:

hadith_grades

Allowed:

Sahih

Hasan

Daif

Mawdu
11. Hadith Intelligence Pipeline

Source:

LK-Hadith-Corpus Repository

Imports:

Isnad

Narrators

Annotations

Metadata

Tables:

hadith_isnad

hadith_annotations
12. Verification Pipeline

Source:

SemakHadis

Purpose:

Import public verification references.

Flow:

Verification Record
      ↓

Claim Extraction
      ↓

Status Mapping
      ↓

Reference Mapping
      ↓

Insert

Target:

hadith_verifications

Statuses:

VERIFIED

WEAK

FABRICATED

DISPUTED
13. Theme Import Pipeline

Sources:

QUL Topics
Internal RAFIQ Taxonomy
Flow
Topic
      ↓

Normalization
      ↓

Hierarchy Detection
      ↓

Insert

Tables:

topics

topic_relations

Example

Tawakkul
 ├─ Sabr
 └─ Yaqin
14. Ayah Theme Linking Pipeline

Purpose:

Create Quran → Theme relationships.

Flow

Ayah
 ↓

Theme

 ↓

Confidence

 ↓

Insert

Target

ayah_themes

Example

{
  "ayah": "65:2-3",
  "theme": "tawakkul",
  "confidence": 0.98
}
15. Hadith Theme Linking Pipeline

Purpose:

Create Hadith → Theme relationships.

Flow

Hadith
 ↓

Theme
 ↓

Confidence
 ↓

Insert

Target

hadith_topics
16. Quran ↔ Hadith Link Pipeline

Most important enrichment stage.

Purpose:

Build the core Knowledge Graph.

Flow

Ayah
 ↓

Theme

 ↓

Related Hadith

 ↓

Relationship Type

 ↓

Confidence

Target:

quran_hadith_links

Relationship Types

SUPPORTS

EXPLAINS

EXPANDS

EXAMPLE_OF
17. Similar Ayah Pipeline

Source:

QUL Similar Ayahs

Flow

Ayah
 ↓

Related Ayah
 ↓

Similarity

Target

related_ayahs
18. Similar Hadith Pipeline

Generated internally.

Method

Embedding Creation
 ↓

Vector Search
 ↓

Similarity Detection
 ↓

Relationship Creation

Target

related_hadiths
19. Embedding Pipeline

Purpose:

Enable semantic search.

Sources:

Quran

Hadith

Tafsir

Flow

Text
 ↓

Chunking
 ↓

Embedding Model
 ↓

Vector Creation
 ↓

Storage

Tables

hadith_embeddings

future:
ayah_embeddings
20. Import Validation Framework

Every imported record must pass:

Schema Validation

Example

Required fields exist
Reference Validation

Example

Ayah exists

Hadith exists
Duplicate Detection

Example

Same source

Same reference
Language Validation

Example

en

ar

ms

id
21. Import Audit Framework

Every import produces logs.

import_jobs
id

source

started_at

completed_at

status
import_job_details
id

job_id

record_count

errors

warnings
22. Versioning Strategy

Every imported record includes:

source

version

import_date

validation_date

Example

{
  "source": "QUL",
  "version": "2026-06",
  "importDate": "2026-06-07"
}
23. Scheduling Strategy
Daily
Verification updates
Weekly
Metadata refresh
Monthly
Full source audit
Manual
Major source upgrades
24. Pipeline Nodes

Future NestJS workers:

IMPORT-QURAN

IMPORT-TRANSLATIONS

IMPORT-TAFSIR

IMPORT-HADITH

IMPORT-GRADES

IMPORT-VERIFICATION

IMPORT-THEMES

BUILD-QURAN-HADITH-LINKS

BUILD-SIMILAR-AYAHS

BUILD-SIMILAR-HADITHS

GENERATE-EMBEDDINGS
25. Deployment Architecture
Source Connectors
         ↓

Import Workers
         ↓

Validation Workers
         ↓

Transformation Workers
         ↓

Graph Builders
         ↓

Embedding Workers
         ↓

Publishing Workers
         ↓

Supabase PostgreSQL
         ↓

RAFIQ Retrieval Engine
26. Initial Import Roadmap
Phase 1

Foundation

Quran

Translations

Topics
Phase 2

Guidance

Tafsir

Hadith

Grades
Phase 3

Knowledge Graph

Ayah Themes

Hadith Themes

Quran-Hadith Links
Phase 4

Intelligence

Embeddings

Semantic Search

Recommendations
27. Success Definition

The Data Import Pipeline succeeds when every knowledge object inside RAFIQ is:

Authentic

Traceable

Versioned

Validated

Linked

Searchable

AI Ready
Architecture Decision

The RAFIQ Data Import Pipeline is not an ETL process.

It is a Knowledge Acquisition System that transforms raw Quran, Tafsir, Hadith, verification data, and thematic relationships into a living Islamic Knowledge Graph.

This pipeline becomes the foundation upon which every future RAFIQ capability is built:

Daily Guidance
Companion Chat
Study Mode
Semantic Search
Guided Journeys
Scholar Mode

Bismillah.

