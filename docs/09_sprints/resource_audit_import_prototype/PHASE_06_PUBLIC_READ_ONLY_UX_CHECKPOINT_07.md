# Phase 6 Checkpoint 07: Public Page Design And Read-Only UX

Date: 2026-06-20  
Status: Prepared For Product / Technical Review  
Scope: First public read-only RAFIQ page design using public APIs, release filters, attribution rules, and blocked-state UX.

## Decision Rule

Public pages must use public APIs only.

They must not call:

- `private_api`;
- `/api/private-content/*`;
- internal review queue endpoints;
- private source-detail endpoints;
- private retrieval traces;
- service-role-only data directly from the client.

If a page cannot be powered by `public_api` or approved public API routes, it must remain hidden or show a public-safe unavailable state.

## Current Public API Allowlist

| Public API Route | Purpose | Current Content Behavior | Page Eligibility |
| --- | --- | --- | --- |
| `GET /api/health` | deployment and release status | shows `private_local`, `publicContentEnabled=false`, `publicReleaseGo=false` | diagnostic only |
| `GET /api/public-content/search` | release-filtered public search | returns `0` real content results | eligible for blocked/empty public search page |
| `GET /api/public-content/answer/draft` | public answer-policy draft | returns `source_unavailable` without approved evidence | eligible for blocked/empty public answer page |
| `GET /api/public-content/answer/guided` | public guided-answer prompt package | returns `blocked_no_public_evidence` without approved evidence | eligible for internal/product preview only |

Future public API routes required before full public reader pages:

| Future Route | Required Before Page |
| --- | --- |
| `GET /api/public-content/quran/surah/:surahNumber` | public Quran reader |
| `GET /api/public-content/hadith/collections` | public Hadith collection browser |
| `GET /api/public-content/hadith/records` | public Hadith list |
| `GET /api/public-content/hadith/record/:hadithRecordId` | public Hadith detail |
| `GET /api/public-content/source/detail` | public-safe attribution/source-detail page |

## Public Route Map

| Public Route | Status | Data Source | UX Behavior Now |
| --- | --- | --- | --- |
| `/public` | Design ready | `/api/health` | public landing page explains RAFIQ public release is not open yet |
| `/public/search` | Design ready | `/api/public-content/search` | search UI works but shows no approved results |
| `/public/answer` | Design ready | `/api/public-content/answer/draft` | question form returns public-safe unavailable answer |
| `/public/quran/:surahNumber` | Blocked | future public Quran API | route hidden until approved content and API exist |
| `/public/hadith` | Blocked | future public Hadith API | route hidden until approved content and API exist |
| `/public/hadith/:hadithRecordId` | Blocked | future public Hadith detail API | route hidden until approved content and API exist |
| `/public/source-detail` | Blocked | future public-safe source detail API | route hidden until implemented |

## Navigation Principles

Public navigation should show only:

- Home;
- Search;
- Ask RAFIQ, if answer remains public-safe and evidence-bound;
- About / Sources, once public source-detail exists.

Public navigation must not show:

- private Quran reader routes;
- private Hadith browser routes;
- internal review queue;
- private answer evidence policy;
- private source-detail page;
- retrieval trace IDs;
- reviewer action controls;
- source approval gaps or internal notes.

## Public Landing Page Design

Purpose: explain public status without exposing private content.

Required sections:

1. **Public Release Status**
   - "RAFIQ public release is not open yet."
   - `publicContentEnabled=false`
   - `publicReleaseGo=false`

2. **What Works Privately**
   - explain that the complete private platform is under internal testing.
   - do not link to private local routes in public deployment mode.

3. **What Public Users Can Do Now**
   - search approved public content, currently empty;
   - submit a question and receive a public-safe unavailable response if no approved evidence exists.

4. **Source Approval Notice**
   - explain content is released only after rights, attribution, editorial, scholar/content, and Product Owner gates pass.

5. **Attribution Policy**
   - link to source/attribution page once public source-detail is implemented.

## Public Search Page Design

Route: `/public/search`  
API: `GET /api/public-content/search`

Required UI states:

| State | Behavior |
| --- | --- |
| Loading | show neutral loading state |
| No approved results | show "No release-approved public content is available for this query yet." |
| Results found | show only release-approved result cards |
| Error | show generic error; do not expose internal stack or SQL details |

Each result card must show:

- domain;
- title;
- snippet;
- source/edition label when available;
- release status;
- public source-detail link when available;
- no private trace ID.

Blocked from UI:

- private result IDs that imply internal source gaps;
- private review status;
- internal provenance notes;
- raw file paths;
- approval-pack details not meant for public users.

## Public Answer Page Design

Route: `/public/answer`  
API: `GET /api/public-content/answer/draft`

Required UI states:

| State | Behavior |
| --- | --- |
| No public evidence | show the `source_unavailable` answer text |
| Scholar escalation | say a qualified scholar is required; do not answer as ruling |
| Safety escalation | say RAFIQ cannot answer as ordinary guidance; direct to appropriate support |
| Evidence available | show answer draft only if public release gates pass |

The public answer must show:

- response state;
- answer text;
- citation/evidence cards when available;
- source/edition per citation;
- public release readiness;
- public-safe attribution links.

The public answer must not show:

- private evidence;
- private retrieval trace ID;
- model adapter internals;
- reviewer controls;
- internal validation JSON by default;
- uncited religious claims.

## Public Quran Reader Design

Status: blocked until public Quran API exists and at least one Quran display source is approved.

Required future UI elements:

- approved script/edition selector;
- clear Bismillah rendering policy;
- ayah source attribution;
- translation selector only for approved translations;
- tafsir/topics/themes disabled unless approved;
- no unapproved fallback from private content.

If no public Quran source is approved:

- route should not appear in public navigation;
- direct route should show unavailable page, not private content.

## Public Hadith Reader Design

Status: blocked until public Hadith API exists and at least one Hadith source/version is approved.

Required future UI elements:

- collection source label;
- edition/source label;
- hadith reference;
- text-version attribution;
- grade/verification source and status when displayed;
- warning if grade/verification is not part of approved public scope.

If no public Hadith source is approved:

- route should not appear in public navigation;
- direct route should show unavailable page, not private content.

## Public Attribution And Source Detail UX

Public source detail must be separate from private source detail.

It should show:

- approved source name;
- edition/version;
- approved attribution text;
- licence/terms link;
- publisher/maintainer when approved;
- public release gate status;
- last approval date;
- public-safe update/withdrawal notice if relevant.

It must not show:

- private raw file paths;
- internal review notes;
- pending approval gaps;
- service-role-only metadata;
- unapproved alternate sources.

## Read-Only Rules

Public users must not be able to:

- change content state;
- approve/reject content;
- submit reviewer actions;
- see internal queues;
- see private trace IDs;
- trigger import/reindex jobs;
- call model-provider adapter endpoints;
- bypass public release filters through route parameters.

## Empty-State Copy

Recommended copy:

Public search:

> No release-approved public content is available for this query yet. RAFIQ is being tested privately while source rights, attribution, editorial review, scholar/content review, and Product Owner approvals are completed.

Public answer:

> No release-approved public evidence is available for this question yet. RAFIQ public mode should not generate an Islamic answer until approved sources are available.

Public Quran/Hadith direct route:

> This page is not available in public mode yet because no approved public source has been selected for this content.

## Acceptance Checklist

Before implementation is accepted:

- [ ] public pages call only `/api/public-content/*` or `/api/health`;
- [ ] public pages do not import private API service functions;
- [ ] public navigation hides private-only routes;
- [ ] public search shows zero real content while public release is blocked;
- [ ] public answer shows `source_unavailable` while no approved evidence exists;
- [ ] public pages show release-filter notices;
- [ ] public result cards include source/edition attribution when available;
- [ ] public answer citations include source/edition attribution when available;
- [ ] direct blocked routes do not reveal private content;
- [ ] browser/runtime tests verify no private labels, traces, review queues, or source-detail internals leak.

## Current Checkpoint Decision

- [x] Public read-only route map prepared
- [x] Public API allowlist prepared
- [x] Empty-state UX defined
- [x] Public Quran/Hadith route blockers defined
- [x] Attribution/source-detail UX rules defined
- [x] Read-only restrictions defined
- [ ] Public pages implemented
- [ ] Browser verification completed for public pages
- [x] Public launch remains NO-GO

## Next Action

Proceed to Checkpoint 08: Public Security And Access Review.

That checkpoint should verify RLS, API roles, environment flags, robots/indexing policy, private schema blocking, service-role isolation, and public route leakage controls before any public UI implementation is promoted.
