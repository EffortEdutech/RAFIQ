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

## Direction From CP16 Forward

The sprint is now moving from "routes exist" into "study-quality RAFIQ."

RAFIQ is heading toward:

1. Study-quality core: Quran reading, translation choice, tafsir context, Hadith reliability, and readable attribution.
2. Guidance engine depth: better source ranking, Quran-theme-Hadith links, Sunnah practice support, and no invented evidence.
3. Personal companion memory: saved sessions, reflections, unfinished actions, preferences, and return continuity.
4. Product Owner GO/NO-GO: mobile QA, rights boundaries, private/public separation, and acceptance against the companion objective.

Planned runway:

- CP16 - Hadith meaning quality scan and Quran translation selection.
- CP17 - Tafsir reading room and tafsir comparison/depth.
- CP18 - Hadith quality queue and verification strengthening.
- CP19 - Orchestration evaluation matrix for guidance quality, ranking, and blocked/no-evidence behavior.
- CP20 - Product Owner GO/NO-GO for private companion MVP.

Current CP20 decision:

- Conditional GO for private companion MVP continuation.
- NO-GO for public release, broad external testing, or public Islamic guidance publication.
- Next runway is CP21 private MVP hardening: target-device Product Owner visual inspection, risk/scholar escalation, semantic ranking, backend Growth Memory, Hadith replacement queue, and deeper study paths.

Current CP21 hardening lock:

- CP21 is accepted as a backlog lock, not a release approval.
- H0 hardening gates are target-device Product Owner UAT, risk/scholar escalation, semantic ranking, backend Growth Memory, Hadith replacement, and public-release gate register.
- CP21A agent target-viewport UAT passed on 2026-07-08; physical Product Owner device sign-off remains pending.
- CP21B risk and scholar escalation implementation passed on 2026-07-08.
- Next checkpoint is CP21C - Semantic Ranking And Cross-Source Selection.
- CP21C-E implementation remains pending evidence, and CP21F keeps public release blocked.

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

Status: Pass for current scope, with production-rights follow-up required.

Output:

- identify why ayah study rooms show missing translations for common ayah references;
- index approved translation rows into Source Search and ayah study payloads;
- improve source/provider/license/attribution display names for user-facing attribution;
- create Hadith meaning quality scan for damaged repeated wording and replacement candidates.

Acceptance:

- common Quran study rooms show readable translation when available, attribution is meaningful, and damaged Hadith meaning records are measurable instead of discovered one screen at a time.

CP15 evidence:

- Root cause found: the retrieval RPC selected only `variant_type = 'plain'`, while imported display translations use `variant_type = 'simple'`.
- `private_api.get_quran_surah` now prefers stored `simple` translation rows and falls back to `plain`.
- Source Search translation results now carry `translationTextId` and route Attribution to `translation_text`.
- Translation attribution now shows source, provider, license, and a careful private-study source statement while keeping rights/publication pending.
- `node scripts/check_cp15_translation_attribution.mjs`, build, export, runtime, and 390 x 844 browser QA passed.
- Next recommended checkpoint is CP16 - Study Data Quality Review: Hadith Meaning Scan And Quran Translation Selection.

### CP16 - Study Data Quality Review: Hadith Meaning Scan And Quran Translation Selection

Status: Pass for current scope, with review/replacement follow-up required.

Output:

- scan Hadith meaning records for repeated words, broken phrases, suspicious truncation, and unusable translations;
- define a replacement/review queue for damaged Hadith meaning records;
- expose Quran translation selection/comparison in the study room without cluttering reading;
- document which translation editions are private-study only and which are candidates for public release.

Acceptance:

- RAFIQ can measure and quarantine damaged Hadith meaning records, and users can study Quran translation choices without the reading room becoming noisy.

CP16 evidence:

- Hadith meaning records are scanned by `scripts/check_cp16_hadith_quality_scan.mjs` for repeated words, known broken phrases, suspicious length, and blank text.
- Current scan measured 406,459 non-Arabic meaning records and flagged 5,405 review candidates, including 13 known broken-phrase candidates.
- The scan produces a review queue shape for damaged `hadith_text_version` records and a quarantine rule for user-facing guidance.
- Ayah study rooms now offer compact translation selection for English and Malay editions without changing the main Quran reading room into a settings surface.
- Source Search target OpenAPI documentation now includes `translationTextId`.
- Fresh static export QA passed at 390 x 844 with no horizontal overflow or console errors; the running `8057` Expo dev server was stale and must be restarted before Product Owner inspection.
- Next recommended checkpoint is CP17 - Tafsir Reading Room And Tafsir Learning Depth.

### CP17 - Tafsir Reading Room And Tafsir Learning Depth

Status: Pass for current development scope; imported tafsir resources are enabled for private RAFIQ study workflows.

Output:

- create a tafsir-focused study room from ayah/source links;
- compare available tafsir passages where data supports it;
- connect tafsir explanation back to Quran reading, Sunnah support, reflection, and one careful action;
- keep tafsir rights/publication status separate from user-facing study.

Acceptance:

- user can move from an ayah to tafsir depth without landing in internal provenance tooling or a shallow snippet.

CP17 evidence:

- Added private tafsir study endpoint at `/api/private-content/tafsir/passage/:passageId`.
- Added mobile tafsir study room at `/tafsir/:passageId`.
- Tafsir source-search results and guidance learning-path tafsir steps now route to the tafsir room.
- Ayah study now offers `Open tafsir room` from the tafsir panel.
- Tafsir room shows Quran anchor, translation, tafsir explanation, comparison passages when available, continue-study actions, guidance handoff, and attribution.
- `scripts/check_cp17_tafsir_room.mjs`, build, mobile export, runtime, and 390 x 844 browser QA passed.
- Next recommended checkpoint is CP18 - Hadith Quality Queue And Verification Strengthening.

### CP18 - Hadith Quality Queue And Verification Strengthening

Status: Pass for current scope.

Output:

- turn CP16 Hadith scan candidates into a structured review/replacement workflow;
- strengthen Hadith reliability display with clearer grade/verification/text-quality boundaries;
- expose automated text-quality state in the Hadith API and narration room;
- keep damaged meaning records out of guidance and user reading until reviewed.

Acceptance:

- user can study and practice Hadith with reliability, source, and text-quality boundaries visible without scrolling raw metadata.

CP18 evidence:

- Hadith detail API now enriches every text version with quality flags, severity, and summary.
- Damaged meaning text is marked `withheld` and is not selected as orchestrator Sunnah support copy.
- Narration study now shows a compact verification map and meaning-quality note.
- `scripts/check_cp18_hadith_quality_verification.mjs`, build/export/runtime, and 390 x 844 browser QA passed.
- Next recommended checkpoint is CP19 - Orchestration Evaluation Matrix for guidance quality, ranking, and blocked/no-evidence behavior.

### CP19 - Orchestration Evaluation Matrix

Status: Pass for current scope.

Output:

- define a repeatable evaluation matrix for natural guidance, direct ayah guidance, anchored Hadith guidance, source ranking, and no-evidence blocking;
- score ready sessions against Quran anchor, tafsir route, Sunnah support, evidence counts, learning path, reflection/action, and source map;
- tighten source ranking where the matrix exposes repeated low-value results;
- document current engine level and remaining gaps.

Acceptance:

- RAFIQ selects Quran-first guidance for general user needs;
- direct ayah guidance keeps the requested ayah as anchor;
- Hadith-record guidance keeps the opened narration anchored first;
- no-evidence input is blocked without invented guidance;
- Source Search opens Quran, translation, and tafsir study routes without repeated Quran rows crowding the top results.

CP19 evidence:

- Added `scripts/check_cp19_orchestration_matrix.mjs`.
- Natural patience, natural prayer focus, direct ayah `2:255`, anchored Bukhari #1, unknown no-evidence phrase, and `2:255` Source Search all passed.
- Source Search dedupes exact Quran ayah rows by verse key, preserving distinct tafsir and translation results.
- `corepack pnpm build`, CP19 matrix, and runtime check passed.
- Next recommended checkpoint is CP20 - Product Owner Private Companion MVP Go/No-Go Review.

### CP20 - Product Owner Private Companion MVP Go/No-Go Review

Status: Conditional GO for private companion MVP continuation; NO-GO for public release.

Output:

- Product Owner-style decision document for the private companion MVP;
- repeatable CP20 readiness script;
- route-by-route mobile evidence at 390px;
- explicit separation between private-local readiness and public-release readiness;
- next hardening backlog for CP21.

Acceptance:

- RAFIQ's core private guidance loop works end-to-end: user need, Quran anchor, tafsir path, reflection, one action, and memory-capable session state;
- no-evidence behavior blocks without invented guidance;
- Quran/translation/tafsir source research opens study rooms without repeated exact Quran rows;
- Hadith guidance anchors the opened narration and withholds damaged meaning text;
- mobile routes avoid overflow, duplicate labels, console errors, and internal release/review language;
- public release remains blocked until scholar/risk, rights, attribution, editorial, Hadith replacement, semantic ranking, backend memory, and final device Product Owner gates pass.

CP20 evidence:

- `scripts/check_cp20_private_mvp_go_no_go.mjs` returned `conditional_go_private_companion_mvp` and `publicRelease: no_go`.
- CP17 tafsir room, CP18 Hadith quality, and CP19 orchestration matrix scripts passed.
- Root build, mobile web export, and runtime check passed.
- Browser QA passed at 390px for Today, Ask, Learn, Sources, Ayah Study, Tafsir, Hadith, Narration Study, Growth, and Settings.
- Next recommended checkpoint is CP21 - Private Companion MVP Hardening Backlog.

### CP21 - Private Companion MVP Hardening Backlog

Status: Pass as hardening backlog lock.

Output:

- map every CP20 conditional-GO blocker to a named hardening gate;
- separate H0 private-MVP blockers from H1 study-depth work;
- keep public release explicitly blocked;
- define CP21A as the immediate next checkpoint;
- add a repeatable backlog verification script.

Acceptance:

- target-device Product Owner UAT is first before more route expansion;
- risk/scholar escalation, semantic ranking, backend Growth Memory, Hadith replacement, and public-release gates are named H0 work;
- Quran/tafsir/Hadith study depth and companion-device operating constraints are tracked as H1 work;
- documentation and checklist identify the next action.

CP21 evidence:

- Added `docs/09_sprints/resource_audit_import_prototype/CP21_PRIVATE_COMPANION_MVP_HARDENING_BACKLOG.md`.
- Added `scripts/check_cp21_hardening_backlog.mjs`.
- `corepack pnpm exec node scripts/check_cp21_hardening_backlog.mjs` passed.
- Next recommended checkpoint is CP21A - Target-Device Product Owner UAT Pack And Evidence Capture.

### CP21A-F - Private MVP Hardening Contract Pack

Status: Pack/contract/register pass; CP21A agent UAT and CP21B implementation passed; remaining implementation pending where required.

Output:

- CP21A target-device Product Owner UAT pack;
- CP21B risk and scholar escalation contract;
- CP21C semantic ranking and cross-source selection contract;
- CP21D backend Growth Memory contract;
- CP21E Hadith replacement and verification workflow;
- CP21F public release gate register;
- repeatable pack verification script.

Acceptance:

- CP21A is not accepted as executed until Product Owner target-device evidence is recorded;
- CP21B is accepted as implemented; CP21C-E are not accepted as implemented until API/mobile/schema/script evidence exists;
- CP21F keeps public release NO-GO;
- CP21G/H remain planned hardening tracks after H0 gates.

CP21A-F evidence:

- Added CP21A-F docs under `docs/09_sprints/resource_audit_import_prototype/`.
- Added `scripts/check_cp21a_f_contract_pack.mjs`.
- `corepack pnpm exec node scripts/check_cp21a_f_contract_pack.mjs` passed.
- Next recommended checkpoint is CP21C - Semantic Ranking And Cross-Source Selection.

### CP21A - Target-Device UAT Execution

Status: Agent target-viewport UAT Pass; physical Product Owner device sign-off pending.

Output:

- executed private local runtime check;
- executed browser UAT at 390 x 844 and 430 x 932;
- tested Today, Ask, Learn, Sources, Ayah Study, Tafsir, Hadith, Narration Study, Growth, and Settings;
- retested `/hadith` at 390 x 844 after a longer settle window;
- documented physical Product Owner sign-off as still pending.

Acceptance:

- automated target-viewport evidence may pass;
- physical Product Owner device sign-off remains a separate acceptance signal;
- public release remains NO-GO.

CP21A evidence:

- `scripts/check_phase5_runtime.ps1` passed.
- Browser UAT passed both target viewports after `/hadith` settle retest.
- Added `docs/09_sprints/resource_audit_import_prototype/CP21A_TARGET_DEVICE_UAT_EXECUTION_REPORT.md`.
- Added `scripts/check_cp21a_target_device_uat_report.mjs`.
- Next recommended checkpoint is CP21C - Semantic Ranking And Cross-Source Selection, unless Product Owner wants physical-device sign-off recorded first.

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
