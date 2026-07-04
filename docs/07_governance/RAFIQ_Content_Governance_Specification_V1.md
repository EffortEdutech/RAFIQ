# RAFIQ Content Governance Specification V1

Status: Build Gate
Last updated: 2026-06-09

## Purpose

This document defines how RAFIQ content becomes trusted enough to appear in user-facing guidance.

## Roles

| Role | Responsibility |
| --- | --- |
| Founder/Product Owner | Approves product scope and launch readiness. |
| Knowledge Editor | Imports, tags, and prepares content records. |
| Technical Reviewer | Checks data integrity, references, schema, and import logs. |
| Scholar/Qualified Reviewer | Reviews religious accuracy and sensitive guidance rules. |
| Admin | Publishes approved content and manages rollback. |

## Content States

| State | Meaning |
| --- | --- |
| `draft` | Imported or written but not reviewed. |
| `technical_review` | Data structure, references, and source links are being checked. |
| `scholar_review` | Religious accuracy and usage context are being reviewed. |
| `approved` | Safe for production use. |
| `published` | Visible to users. |
| `rejected` | Not usable. |
| `retired` | Previously used but no longer active. |

## Approval Rules

- Quran text must come from an approved source and pass reference validation.
- Quran translations must not be AI-generated.
- Tafsir summaries must cite their source tafsir.
- Hadith must include collection, reference, source, and grade or verification status.
- Ibadah recommendations that prescribe specific counts, times, or surahs require evidence and scholar approval.
- Theme tags can be editorial, but must not imply rulings.
- AI-generated reflections and actions must be reviewed by validation gates before display.

## Build-Pending-Approval Rule

Technically validated but unapproved content may be used in local development,
the complete private platform, private staging, automated testing, AI/RAG
testing, and internal review. All content-dependent features should be enabled
for complete private end-to-end testing. The content must not be exposed
through a public deployment, public APIs, or public user-facing AI responses
until both rights and content approval are recorded.

Public-release enforcement must occur in deployment-mode-aware data access and
retrieval policies, not only through a manual launch checklist.

## Audit Trail

Every content record should track:

- source ID
- source version
- import batch ID
- created by
- reviewed by
- approval state
- approval date
- publication date
- retired date
- change reason

## Rollback Rule

If a source, translation, hadith grade, or tafsir interpretation is found unreliable, affected guidance packages must be unpublished or regenerated from approved sources.
