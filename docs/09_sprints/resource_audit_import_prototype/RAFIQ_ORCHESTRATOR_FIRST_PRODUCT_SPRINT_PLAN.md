# RAFIQ Orchestrator-First Product Sprint Plan

Date: 2026-06-29  
Status: Active sprint plan for Product Owner review  
Decision: Current mobile UI is treated as scaffolding. RAFIQ must now be rebuilt around the orchestrated guidance session, not page-by-page cards.

## Bismillah

This sprint exists because previous UI work completed many screens but did not meet the product objective.

RAFIQ must not feel like:

- a dashboard;
- a Quran/Hadith browser with many boxes;
- a collection of disconnected pages;
- a chatbot transcript;
- a developer/API demonstration;
- a settings-heavy mobile app.

RAFIQ must feel like:

- a calm personal Islamic companion;
- a Quran-centered guidance engine;
- a knowledge delivery system;
- a daily reflection and action loop;
- a private growth memory.

## Product Objective

The MVP Core promise remains:

> A user can open RAFIQ, share their current state, receive sourced Islamic guidance, reflect on it, complete a small action, and return later with progress preserved.

The required loop is:

```text
check-in
-> retrieval
-> verification
-> guidance package
-> reflection
-> action completion
-> journal/history
```

No checkpoint is accepted unless it strengthens this loop.

## Current Reality

Technical foundation exists:

- Quran content API;
- Hadith content API;
- search/retrieval trace;
- answer draft;
- guided answer prompt;
- model adapter status;
- validation gate;
- private mobile screens;
- local Quran font assets;
- mobile shell.

Product gap:

- screens still feel manually assembled;
- guidance is not one orchestrated session;
- Profile is not yet true memory;
- Today/Ask/Learn/Read do not share one guidance session model;
- model adapter remains disabled;
- UI still shows too much structure and too little guided knowledge.

## Sprint Principle

Build RAFIQ from the orchestration object outward.

Do not start by designing screens. Start by defining what RAFIQ knows, selects, explains, asks, and remembers for one user session.

## Core Artifact

Create one shared product object:

```text
GuidanceSession
```

Minimum shape:

- session id;
- user state or question;
- detected need/theme;
- Quran anchor;
- meaning/tafsir layer;
- Sunnah support;
- verification status;
- guidance message;
- reflection prompt;
- one action;
- save/memory state;
- next recommended step.

The UI should render this session calmly. It should not invent separate card stacks per screen.

## Primary User Paths

### Path 1: Daily Guidance

User opens Today.

RAFIQ:

- asks what the heart is carrying;
- creates or resumes today's GuidanceSession;
- shows Quran first;
- gives meaning;
- gives Sunnah support when relevant;
- asks one reflection;
- gives one action;
- saves progress into Growth.

### Path 2: Ask For Guidance

User asks with natural words.

RAFIQ:

- detects need/theme;
- retrieves sources;
- verifies source suitability;
- builds GuidanceSession;
- shows answer only after evidence;
- offers save/reflection/action.

### Path 3: Read Quran

User reads Quran.

RAFIQ:

- honors Quran reading first;
- lets the user open meaning, tafsir, Sunnah, themes, and sources as layers;
- can turn an ayah into a GuidanceSession;
- preserves reading/reflection memory.

### Path 4: Learn Theme

User searches or selects a theme.

RAFIQ:

- builds a knowledge path;
- anchors it in Quran;
- adds tafsir and Sunnah;
- recommends one next study/action;
- can save it to Growth.

### Path 5: Growth Memory

User returns later.

RAFIQ:

- shows saved guidance;
- shows unfinished actions;
- shows reflections;
- shows preferences;
- resumes the next useful step without gamification.

## Checkpoints

## Checkpoint Close-Out Rule

Every checkpoint must close with the same Product Owner report:

- Completed: what was actually changed, created, verified, and documented.
- Next planned: the next checkpoint or planned build step.
- Ad-hoc first: any urgent fix, bug, missing verification, or documentation update that must happen before the next checkpoint.
- Checklist update: acceptance checklist status changes.
- Documentation update: sprint plan, checklist, decision register, or supporting docs updated.

A checkpoint is not closed until this report is given and the checklist is updated.

### CP00 - Sprint Reset And Acceptance Contract

Output:

- mark current UI as scaffolding;
- create strict Product Owner acceptance checklist;
- define no-go conditions.

Acceptance:

- Product Owner agrees that checklist completion is not enough; RAFIQ must meet product feeling and guidance delivery gates.

### CP01 - GuidanceSession Contract

Output:

- shared `GuidanceSession` type;
- API response contract;
- frontend rendering contract;
- source/verification fields;
- memory/action fields.

Acceptance:

- a single session object can represent Today, Ask, Learn, Quran-derived guidance, and Growth resume.

### CP02 - Orchestrator Service

Output:

- backend service that creates a GuidanceSession from a state/question/theme/ayah;
- retrieval order;
- verification gate;
- deterministic fallback when model execution is disabled;
- future model adapter handoff point.

Acceptance:

- endpoint returns one coherent guidance package, not disconnected payloads.

### CP03 - Today As Session Entry

Output:

- Today creates or resumes today's GuidanceSession;
- first viewport delivers immediate value;
- no dashboard sections;
- no generic product explanation.

Acceptance:

- user receives Quran-centered guidance within 10 seconds.

### CP04 - Ask As Session Creation

Output:

- Ask creates GuidanceSession from natural input;
- evidence comes before answer;
- answer reads as guidance, not system text;
- one reflection and one action are included.

Acceptance:

- Product Owner can ask "I feel anxious about rizq" and receive one coherent session.

### CP05 - Quran Reading To Guidance

Output:

- Quran page remains reading-first;
- Uthmani/Hafs font preference works;
- ayah can become a GuidanceSession;
- tafsir/Sunnah/source layers are quiet and optional.

Acceptance:

- Quran is visually primary and not buried inside cards.

### CP06 - Learn As Knowledge Path

Output:

- Learn builds a GuidanceSession or KnowledgePath from a theme;
- Quran anchor, tafsir, Sunnah support, next action;
- no raw search dump.

Acceptance:

- "mercy" or "patience" reads like guided learning, not search results.

### CP07 - Hadith/Sunnah Verification Display

Output:

- Hadith detail presents narration, reference, collection, grade/verification;
- Sunnah is connected to Quran/theme/action;
- Semak Hadis-inspired check-before-sharing posture.

Acceptance:

- user understands reliability before applying or sharing.

### CP08 - Growth Memory

Output:

- save session;
- save reflection;
- mark action;
- resume unfinished guidance;
- preferences include Arabic font and language.

Acceptance:

- Growth feels like continuity, not account settings.

### CP09 - Mobile Companion QA

Status: Product fail after Product Owner visual inspection. Technical route checks passed, but the visual/product standard did not.

Output:

- verify 390x844, 430x932, tablet, desktop device preview;
- no overflow;
- no card-grid clutter;
- no console errors;
- no developer/process language;
- tap targets visible.

Acceptance:

- Product Owner can inspect on mobile without seeing broken layout or unprofessional structure.
- Product Owner must not see a dated, oversized, box-heavy, classroom-like interface.
- CP09 remains failed until modern companion UI reset passes inspection.

### ADHOC-002 - Modern Companion UI Reset Before CP10

Status: Route reset implemented on 2026-06-30; still pending mobile visual QA and Product Owner acceptance. Full runtime QA is blocked until local Supabase/Postgres is available.

Output:

- reduce typography, spacing, button size, color loudness, and card dominance; implemented;
- separate Reading Settings from Growth Memory; implemented;
- rebuild main route hierarchy around delivered knowledge and guidance density; implemented for Today, Ask, Read, Learn, Hadith, Growth, and Settings;
- verify first mobile viewport on Today, Ask, Read, Learn, Hadith, Growth, and Settings; pending because the local database runtime is unavailable;
- update checklist with explicit Product Owner visual acceptance; pending Product Owner inspection.

Acceptance:

- RAFIQ feels like a current/future mobile companion device, not a developer UI, dashboard, or children's learning screen.

### CP10 - Product Owner Go/No-Go

Status: Blocked until ADHOC-002 passes.

Output:

- route-by-route acceptance evidence;
- screenshots or browser observations;
- strict checklist outcome;
- remaining gaps and decision.

Acceptance:

- GO only if RAFIQ feels like an orchestrated Quran-centered companion, not a UI shell.

### CP10A - Hadith Library Mobile Rebuild

Status: Pass for current scope.

Output:

- mobile Hadith collection search;
- selected collection summary;
- narration index and pagination;
- detail entry without inventing unavailable book/chapter hierarchy.

Acceptance:

- user can browse Hadith collections and open narrations on a mobile viewport without overflow or fake structure.

### CP10B - Hadith Learning/Practice Map

Status: Pass for current scope with known retrieval-ranking follow-up.

Output:

- Hadith detail keeps reliability visible;
- Arabic original appears when available;
- best available meaning text is selected with language fallback;
- narration maps to Quran lens, careful action, and boundary;
- related Hadith-scoped Sunnah path opens through the orchestrator.

Acceptance:

- user can understand how to approach a narration carefully before practice or sharing.
- Related support ranking must be improved before mature Hadith learning acceptance.

### CP10C - Hadith Retrieval Ranking And Narration Anchoring

Status: Pass.

Output:

- `hadith_record` guidance session entry point;
- `hadithRecordId` passed through shared contract, API query, and mobile client;
- opened narration appears first in Sunnah support;
- related Hadith results are deduped and ranked after the opened narration;
- Sunnah learning step routes back to the opened narration.

Acceptance:

- a user opening a Hadith detail sees the opened narration as the primary Sunnah support, not a different related narration.

### ADHOC-004 - User-POV Guided Knowledge UI Correction

Status: Pass for current scope in CP11.

Output:

- reframe Search as Guided Discovery, not raw search;
- reframe Hadith as Sunnah Practice, not collection browsing;
- move source browsing behind secondary controls;
- create route acceptance based on user need, Quran anchor, Sunnah support, caution, reflection, and action.

Acceptance:

- users can start from a life need or practice goal, not from source metadata.
- RAFIQ selects and explains knowledge instead of asking users to scroll large collections.

### CP11A - Guided Discovery Search Rebuild

Status: Pass for current scope.

Output:

- rebuild `/search` around user need input;
- render a GuidanceSession path first;
- collapse raw sources behind a quiet `Sources` layer.

Acceptance:

- "I need patience with my family" opens Quran-first guidance, tafsir/Sunnah support, caution, reflection, and one action.

### CP11B - Sunnah Practice Home Rebuild

Status: Pass for current scope.

Output:

- rebuild `/hadith` default page as Sunnah Practice;
- guided themes and input first;
- source browsing secondary.

Acceptance:

- users are not expected to scroll thousands of narrations to learn.

### CP11C - Source Browse As Secondary Tool

Status: Pass for current scope.

Output:

- source browsing remains available on `/hadith`;
- source browsing is hidden behind `Browse sources`;
- narration index is no longer the default Hadith learning experience.

Acceptance:

- source metadata and narration browsing are available for direct lookup, but they do not dominate the first user journey.

### CP12A - Dual Search Product Contract

Status: Pass.

Output:

- define `Guidance Search` for user needs, reflection, action, and orchestrated guidance;
- define `Source Search` for Quran, translations, tafsir, Hadith, topics, themes, and verification research;
- add deep-link targets so Quran lens, tafsir summary, and Sunnah support are not dead-end snippets;
- define source-to-guidance handoff so an opened ayah, tafsir passage, or narration can create a `GuidanceSession`.

Acceptance:

- the product clearly separates "guide me" from "let me research";
- every guidance evidence item can be opened for deeper study;
- every source result can become a guided RAFIQ session.

### CP12B - Source Search API And Ranking

Status: Pass for current backend scope.

Output:

- grouped source search across Quran, translations, tafsir, Hadith, topics, and themes;
- filters for domain and evidence type;
- direct route targets for every result;
- ranking that avoids raw ungrouped result dumps.

Acceptance:

- user can search all private resources without scrolling thousands of records or reading repeated metadata.

### CP12C - Source Search Mobile UI

Status: Pass for current mobile scope.

Output:

- build `/sources` or a clearly separated `Sources` tab;
- compact grouped mobile result rows;
- domain filters;
- open result actions;
- source-to-guidance action.

Acceptance:

- Source Search feels like a serious mobile research tool, not a database table or giant card grid.

### CP12D - Guidance Deep-Link Upgrade

Status: Pass for current mobile scope.

Output:

- Quran lens opens ayah study;
- tafsir summary opens tafsir context;
- Sunnah support opens narration study;
- guidance result includes research suggestions and continuation actions.

Acceptance:

- a RAFIQ guidance answer is the beginning of study, not the end of the path.

### CP12E - Ayah And Narration Study Rooms

Status: Pass for current mobile scope.

Output:

- create user-facing ayah study room with Arabic, translation, tafsir, themes, related Sunnah, source links, and `Open guidance`;
- create user-facing narration study room with original/translation, reference, verification, Quran connection, related narrations, source links, and `Open guidance`;
- separate user study detail from internal source-trust/provenance detail.
- normalize Quran, translation, tafsir, and theme source-result routes with ayah references into `/quran/:surah/:ayah`.

Acceptance:

- opening a Quran lens or Sunnah support leads to a study room, not an internal trust page or a shallow route.

### CP13 - Product Owner Study UX Review And Mobile QA

Status: Pass for mobile study-flow QA, with product polish follow-up required.

Output:

- inspect Guidance Search, Source Search, ayah study room, and narration study room on mobile;
- verify link density is useful but not cluttered;
- verify study flow does not feel like internal source tooling;
- decide whether to proceed to Product Owner acceptance or first add translation/verification index data.

Acceptance:

- Product Owner can start from guidance, open Quran/tafsir/Sunnah study, search sources, and return to guidance without feeling blocked or overwhelmed.

CP13 evidence:

- Today, Learn, Source Search, Ayah Study, and Sunnah Practice passed 390 x 844 Chrome QA with no horizontal overflow or console errors.
- Source Search was corrected during QA to reduce duplicate Quran variants, shorten snippets, correct Arabic starter text, and use calmer attribution labels.
- Ayah Study was corrected during QA to dedupe repeated themes and replace internal `Source Detail` wording with `Attribution`.
- Next recommended checkpoint is CP14 - Study Room Product Polish And Data Quality Triage.

### CP14 - Study Room Product Polish And Data Quality Triage

Status: Pass for current scope, with data import follow-up required.

Output:

- soften Hadith learning typography and button density;
- triage Hadith meaning text quality issues exposed in CP13 screenshots;
- design a user-facing attribution panel so users do not land on internal provenance screens;
- improve translation coverage/indexing where ayah study rooms show missing translation.

Acceptance:

- study rooms feel calmer and more mature on mobile, and source/data quality issues are separated from user guidance.

CP14 evidence:

- Hadith home, narration study, source attribution, and ayah study passed 390 x 844 Chrome QA with no horizontal overflow or console errors.
- Damaged Hadith meaning text is withheld from narration study and no longer becomes orchestrator support copy.
- Source attribution was rebuilt as a user-facing page and no longer exposes reviewer workspace, raw source-trust labels, or ingestion-style ayah identifiers.
- Translation coverage and attribution metadata remain data follow-ups.
- Next recommended checkpoint is CP15 - Translation Coverage And Attribution Data Upgrade.

### CP15 - Translation Coverage And Attribution Data Upgrade

Status: Next recommended checkpoint.

Output:

- identify why ayah study rooms show missing translations for common ayah references;
- index approved translation rows into Source Search and ayah study payloads;
- improve source/provider/license/attribution display names for user-facing attribution;
- create Hadith meaning quality scan for damaged repeated wording and replacement candidates.

Acceptance:

- common Quran study rooms show readable translation when available, attribution is meaningful, and damaged Hadith meaning records are measurable instead of discovered one screen at a time.

## Hard No-Go Conditions

The checkpoint fails if any of these are true:

- first viewport is mostly cards/boxes with little guidance;
- UI explains RAFIQ instead of guiding the user;
- Quran is not primary where relevant;
- Sunnah support is hidden or decorative;
- answer appears before evidence;
- screen has no reflection/action;
- Growth does not remember anything meaningful;
- raw IDs, traces, validation, payload, public/private release, review, or deployment language appears in user UI;
- mobile layout overflows or uses desktop grids;
- Product Owner says the screen feels like a dashboard.

## Product Owner Acceptance Questions

Every checkpoint must answer yes:

1. Did RAFIQ understand a user state, question, theme, or ayah?
2. Did RAFIQ select a Quran anchor?
3. Did RAFIQ explain the meaning simply?
4. Did RAFIQ add Sunnah support where relevant?
5. Did RAFIQ show source/verification without overwhelming the user?
6. Did RAFIQ ask for reflection?
7. Did RAFIQ give one action?
8. Did RAFIQ save or resume memory?
9. Did the screen avoid card clutter and dashboard feeling?
10. Did the screen work professionally on mobile?

If any answer is no, the checkpoint is not accepted.

## Build Order Rule

Do not rebuild more screen chrome until CP01 and CP02 are done.

The orchestrator session contract comes first. Then screens render it.
