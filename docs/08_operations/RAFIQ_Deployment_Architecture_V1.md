# RAFIQ Deployment Architecture V1

Status: Build Gate
Last updated: 2026-06-09

## Purpose

This document defines minimum deployment readiness before RAFIQ moves from local development to staging or production.

## Environments

| Environment | Purpose |
| --- | --- |
| Local | Developer iteration with local or sandbox data. |
| Development | Shared integration environment. |
| Staging | Production-like verification with approved test content. |
| Production | User-facing release. |

## Deployment Gates

Before staging:

- database migrations run cleanly
- RLS policies tested
- API schema documented
- AI validation gates active
- content source registry exists
- no unapproved source appears in user-facing guidance
- service keys absent from mobile bundle

Before production:

- backup and restore tested
- monitoring configured
- rate limits configured
- privacy/delete/export flows tested
- scholar/content approval workflow active
- incident rollback process documented
- launch content approved

## Monitoring

Track:

- API errors
- auth failures
- RLS denials
- AI validation failures
- source retrieval misses
- hallucination-block events
- content import errors
- rate-limit events
- user deletion/export requests

## Rollback

Production rollback must support:

- API rollback
- mobile app rollback or hotfix strategy
- content unpublish
- prompt version rollback
- source import rollback
- database migration rollback plan

## Build Rule

RAFIQ should not launch publicly until staging can complete the full MVP flow with approved content and no validation bypasses.

