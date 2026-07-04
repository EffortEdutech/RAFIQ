# RAFIQ API Build Contract Addendum V1

Status: Build Gate
Last updated: 2026-06-09

## Purpose

The API specification lists the required endpoints. This addendum defines the minimum precision needed before coding.

## Required For Every Endpoint

Each endpoint must define:

- method and path
- auth requirement
- role requirement
- request body schema
- query parameter schema
- response schema
- validation rules
- pagination rules where relevant
- rate limit group
- error responses
- audit/logging requirement

## Standard Error Shape

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {},
    "requestId": "string"
  }
}
```

## Standard Guidance Response Minimum

```json
{
  "guidanceId": "uuid",
  "state": "approved",
  "theme": {
    "id": "string",
    "name": "string"
  },
  "quran": [],
  "hadith": [],
  "reflection": {
    "text": "string",
    "generatedBy": "RAFIQ"
  },
  "action": {
    "text": "string",
    "type": "suggested"
  },
  "citations": [],
  "validation": {
    "state": "approved",
    "gates": []
  }
}
```

## Rate Limit Groups

| Group | Applies To | Initial Limit |
| --- | --- | --- |
| `auth` | Login/register/password actions | Conservative auth provider defaults plus abuse protection. |
| `guidance` | Daily guidance and companion generation | Lower limit; protects AI spend and abuse. |
| `search` | Quran/hadith/library search | Medium limit. |
| `read` | Public approved content browsing | Higher limit. |
| `admin` | Imports, rebuilds, approvals | Role restricted and audited. |

## Build Rule

Do not implement an endpoint until its schema, auth, error behavior, and rate-limit group are defined.

