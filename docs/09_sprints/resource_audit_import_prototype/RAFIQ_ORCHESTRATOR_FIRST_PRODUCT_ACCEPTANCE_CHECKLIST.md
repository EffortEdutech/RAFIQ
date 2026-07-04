# RAFIQ Orchestrator-First Product Acceptance Checklist

Date: 2026-06-29  
Status: Active Product Owner checklist  
Sprint: RAFIQ Orchestrator-First Product Sprint

## Acceptance Scale

Use only:

- `Pass`
- `Fail`
- `Blocked`

Do not use `Done` unless Product Owner acceptance also passes.

## Sprint-Level Gates

| ID | Gate | Status | Evidence |
| --- | --- | --- | --- |
| OFP-001 | Current UI is treated as scaffolding, not final RAFIQ UX. | Pass | New sprint plan created. |
| OFP-002 | MVP Core loop is the build gate. | Pass | Scope lock loop adopted. |
| OFP-003 | GuidanceSession is the central product object. | Pass | CP01 shared contract created and exported. |
| OFP-004 | Orchestrator service creates coherent session packages. | Pass | CP02 endpoint returns `GuidanceSessionResponse`. |
| OFP-005 | Product Owner acceptance gates override technical completion. | Pass | Checklist rule defined. |
| OFP-006 | Every checkpoint close-out reports completed, next planned, ad-hoc first, checklist update, and documentation update. | Pass | Close-out rule added to sprint plan and checklist. |

## Checkpoint Checklist

| CP | Checkpoint | Status | Product Owner Gate |
| --- | --- | --- | --- |
| CP00 | Sprint Reset And Acceptance Contract | Pass | Plan and checklist created. |
| CP01 | GuidanceSession Contract | Pass | One object can drive Today, Ask, Learn, Quran-derived guidance, and Growth resume. |
| CP02 | Orchestrator Service | Pass | Backend returns one coherent guidance package and blocks unavailable evidence. |
| CP03 | Today As Session Entry | Pass | Today renders a live `GuidanceSessionResponse` with Quran anchor, reflection, and one action. |
| CP04 | Ask As Session Creation | Pass | Natural question creates and renders `GuidanceSessionResponse`. |
| CP05 | Quran Reading To Guidance | Pass | Quran remains reading-first and ayahs can generate inline `GuidanceSessionResponse` guidance. |
| CP06 | Learn As Knowledge Path | Pass | Theme becomes guided `GuidanceSessionResponse` knowledge path, not search dump. |
| CP07 | Hadith/Sunnah Verification Display | Pass | Reliability is clear before practice/share; `/hadith` and narration detail verified at 390x844. |
| CP08 | Growth Memory | Pass | Saved guidance, reflection, action completion, resume state, and preferences work locally. |
| CP09 | Mobile Companion QA | Pass | Product Owner accepted ADHOC-002 current UI status after the modern companion reset. |
| CP09B | Orchestration Engine Evaluation And Upgrade | Pass | Natural phrasing expansion, Quran-first fallback, Hadith-only mode, no-evidence blocking, build/runtime checks verified. |
| CP09C | Quran, Tafsir, Hadith Learning Path Upgrade | Pass | `GuidanceSession.learningPath` now drives ordered Quran, Tafsir, Hadith, Reflect, and Act steps; build/export/runtime/browser checks passed. |
| CP10A | Hadith Library Mobile Rebuild | Pass | `/hadith` now supports mobile collection search, collection selection, selected collection summary, narration index, pagination, and narration-detail entry. |
| CP10B | Hadith Learning/Practice Map | Pass | Hadith detail now shows Arabic original, preferred meaning fallback, Practice Map, Quran lens, careful action, boundary, and Hadith-scoped Related Sunnah Path. |
| CP10C | Hadith Retrieval Ranking And Narration Anchoring | Pass | `hadith_record` sessions now anchor the opened narration as first Sunnah support and route the learning path back to that narration. |
| CP11A | Guided Discovery Search Rebuild | Pass | `/search` now starts from user need and renders `RAFIQ Path` plus `Guided Steps` before raw source browsing. |
| CP11B | Sunnah Practice Home Rebuild | Pass | `/hadith` now starts from a practice need and renders Quran lens, Sunnah support, caution, and one action before source browsing. |
| CP11C | Source Browse As Secondary Tool | Pass | `/hadith` keeps source browsing behind `Browse sources`; collection/narration browsing no longer dominates the first viewport. |
| CP12A | Dual Search Product Contract | Pass | Shared/API/mobile contracts now separate Guidance Search from Source Search and define deep links, grouped source results, and source-to-guidance handoff. |
| CP12B | Source Search API And Ranking | Pass | `/search/sources` returns grouped, ranked, deep-linked source results with source-to-guidance targets; translation/verification groups remain blocked by missing index rows. |
| CP12C | Source Search Mobile UI | Pass | `/sources` provides compact source search, filters, grouped results, and Open/Source/Guide actions. |
| CP12D | Guidance Deep-Link Upgrade | Pass | Today, Ask, Learn, and Sunnah Practice now render Quran/Sunnah deep links and research suggestions from guidance sessions. |
| CP12E | Ayah And Narration Study Rooms | Pass | Quran lens/source results now land on `/quran/:surah/:ayah`; narration detail includes study/research actions and guidance deep links. |
| CP13 | Product Owner Study UX Review And Mobile QA | Pass | Today, Learn, Sources, Ayah Study, and Sunnah Practice passed 390x844 Chrome QA; Source Search density and Ayah Study attribution/theme wording were corrected. |
| CP14 | Study Room Product Polish And Data Quality Triage | Pass | Hadith study typography softened; damaged Hadith meaning text is withheld from guidance/display; source attribution is now user-facing; mobile QA passed. |
| CP10 | Product Owner Go/No-Go | Pending | Product Owner decision required with known Quran, tafsir, Hadith, and learning-path limits. |

## Checkpoint Close-Out Log

| CP | Completed | Next Planned | Ad-Hoc First | Checklist Update | Documentation Update |
| --- | --- | --- | --- | --- | --- |
| CP00 | New orchestrator-first sprint plan, stricter acceptance checklist, and decision register created. Current UI marked as scaffolding. | CP01 - GuidanceSession Contract. | Arabic font preference verified before CP01. | CP00 Pass; OFP-001, OFP-002, OFP-005, OFP-006 Pass. | Sprint plan, checklist, and decision register created; close-out rule added. |
| CP01 | Shared `GuidanceSession` contract created, exported from `@rafiq/shared`, documented in CP01 contract doc, and verified by shared/root build. | CP02 - Orchestrator Service. | None blocking. CP02 should not rebuild UI yet; it must return `GuidanceSessionResponse` first. | CP01 Pass; OFP-003 Pass; TECH-001 remains Pass. | CP01 contract doc created; checklist close-out updated. |
| CP02 | Backend orchestrator endpoint created at `/api/private-content/guidance/session`; service assembles need, Quran anchor, Sunnah support, verification, guidance, reflection, one action, memory, and source map. Verified ready and blocked sessions. | CP03 - Today As Session Entry. | None blocking. UI must now render the session instead of dashboard sections. | CP02 Pass; OFP-004 Pass; TECH-001, TECH-003, TECH-009 Pass. | CP02 contract doc created; checklist and decision register updated. |
| CP03 | Today route rebuilt from static public demo into a live session entry. User chooses one need; Today calls the orchestrator and renders Quran anchor, meaning, verification, reflection, one action, and next step. | CP04 - Ask As Session Creation. | None blocking. Ask must now be rebuilt from `GuidanceSessionResponse`, not answer draft cards. | CP03 Pass; TECH-002, TECH-004, TECH-006, TECH-007 remain/pass. | CP03 doc created; checklist updated. |
| CP04 | Ask route rebuilt from answer-draft UI into session creation. User question now calls the orchestrator and renders question, Quran anchor or evidence gate, guidance, reflection, one action, and next step. Verified evidence-backed and blocked paths. | CP05 - Quran Reading To Guidance. | None blocking. Quran must stay reading-first while allowing ayah-to-session creation. | CP04 Pass; TECH-002, TECH-003, TECH-004, TECH-006, TECH-007 remain/pass. | CP04 doc created; checklist and decision register updated. |
| CP05 | Quran reading room now keeps Arabic reading primary and adds `Open guidance` per ayah. The selected ayah creates an inline `GuidanceSessionResponse` with guidance, reflection, and one action. Verified on `/quran/1` with ayah `1:1`. | CP06 - Learn As Knowledge Path. | None blocking. Learn must stop behaving like search results and become a guided path. | CP05 Pass; TECH-002, TECH-003, TECH-004, TECH-007, TECH-008, TECH-009 remain/pass. | CP05 doc created; checklist and decision register updated. |
| CP06 | Learn route rebuilt from search-result UI into a theme-led knowledge path. User chooses a theme; Learn calls the orchestrator and renders Quran anchor, meaning, guidance, reflection, one action, and next step. | CP07 - Hadith/Sunnah Verification Display. | None blocking. Hadith must now support Quran/theme/action with reliability visible before practice/share. | CP06 Pass; TECH-002, TECH-003, TECH-004, TECH-007, TECH-008, TECH-009 remain/pass. | CP06 doc created; checklist and decision register updated. |
| CP07 | Hadith landing and detail rebuilt around verification-before-practice. `/hadith` now leads with check-before-practice, reference, grade, reliability reminder, reflection, and action. Narration detail shows reliability, narration, guidance connection, one careful action, and before-sharing caution. | CP08 - Growth Memory. | None blocking. Growth must now become continuity: saved sessions, reflections, actions, resume state, and preferences. | CP07 Pass; TECH-002, TECH-003, TECH-004, TECH-006, TECH-007 remain/pass. | CP07 doc created; checklist and decision register updated. |
| CP08 | Growth Memory store added and `/profile` rebuilt as a return surface. Today, Ask, Learn, and Quran now write saved guidance, reflection, and action state into local Growth Memory. Growth shows resume, saved guidance, reflection editor, completed action state, compact preferences, and Arabic font selection. | CP09 - Mobile Companion QA. | Mobile TypeScript direct check remains blocked by existing Expo/shared module-resolution issues; track during CP09 technical QA. | CP08 Pass; TECH-002, TECH-003, TECH-004, TECH-006, TECH-007, TECH-008, TECH-010 Pass. | CP08 doc created; checklist and decision register updated. |
| CP09 | Route-wide mobile companion QA completed across Today, Ask, Read, Learn, Sunnah, and Growth. Verified build, export, runtime, phone route matrix, tablet/desktop layout, overflow, tap targets, console errors, and developer-language scan. | CP10 - Product Owner Go/No-Go. | Carry known technical follow-up: direct mobile `tsc --noEmit` remains blocked by existing Expo/shared module-resolution issues. Browser automation reset during longer tablet Today retest, but API/runtime and phone/desktop browser evidence passed. | CP09 Pass; TECH-001, TECH-002, TECH-003, TECH-004, TECH-005, TECH-006, TECH-007, TECH-008, TECH-009, TECH-010 Pass. | CP09 doc created; checklist and decision register updated. |
| ADHOC-002 | Route-level modern companion reset implemented across Today, Ask, Read, Learn, Hadith, Growth, and Settings. Shared scale reduced; segmented controls, smaller actions, quieter panels, vertical Hadith verification, reader-first Quran controls, global top settings gear, and separate Reading Settings applied. | Accepted for current status by Product Owner. | Future product updates still needed for Quran reading, Quran learning, tafsir learning, and Hadith learning. | ADHOC-002 accepted; CP10 can move to orchestration engine quality review. | ADHOC doc, checklist, and decision register updated. |
| CP09B | Orchestration engine upgraded with deterministic natural-language theme expansion, Quran-first fallback for general guidance, Hadith-only scoped mode, and repeatable CP09B matrix check. | CP09C - Quran, Tafsir, Hadith Learning Path Upgrade, or CP10 if Product Owner accepts current limits. | Known product gaps remain: tafsir learning, richer Quran reading flow, Hadith learning reliability/practice mapping, anchor ranking, scholar-escalation logic. | CP09B Pass; CP10 remains Product Owner decision with known limits. | CP09B report and orchestration quality review updated. |
| CP09C | Shared `GuidanceSession.learningPath` added and rendered in Learn as a compact Study Flow with Quran, Tafsir, Hadith, Reflect, and Act steps. CP09C script verifies Quran-led and Hadith-only paths. | CP10 - Product Owner Go/No-Go if current learning-path depth is accepted, otherwise continue deeper Quran/Tafsir/Hadith learning checkpoints. | None blocking. Known future work remains: full tafsir reading room, richer hadith learning map, stronger anchor ranking, scholar review states. | CP09C Pass; CP10 remains Product Owner decision with known limits. | CP09C report, checklist, and decision register updated. |
| CP10A | `/hadith` rebuilt into a mobile Hadith library: collection search, collection cards, selected collection summary, narration index, Prev/Next, and narration-detail entry. | CP10B - Hadith Learning/Practice Map. | None blocking. Backend chapter/book metadata should be exposed later if available; CP10A does not fake chapter navigation. | CP10A Pass; `/hadith` route assessment updated to Pass. | CP10A report, checklist, and decision register updated. |
| CP10B | `/hadith/[hadithRecordId]` rebuilt into a Hadith learning/practice surface: Arabic original, preferred meaning fallback, reliability, Practice Map, Quran lens, one careful action, boundary, and Related Sunnah Path from Hadith-scoped orchestration. | CP10C - Hadith Retrieval Ranking And Narration Anchoring, or CP10 review if Product Owner accepts current limit. | Known quality gap: the related Sunnah path can retrieve a different narration for the same theme; first-class `hadith_record` session anchoring is still needed. | CP10B Pass; route detail accepted for current scope with ranking limit documented. | CP10B report, checklist, and decision register updated. |
| CP10C | Shared/API/mobile orchestration now supports `hadith_record` sessions with `hadithRecordId`; the opened narration is prepended as first Sunnah support, related items are deduped/ranked, and the Sunnah learning step routes back to the opened narration. | Product Owner review, or next deepening checkpoint for Hadith metadata/chapter navigation or tafsir reading room. | None blocking. Future semantic ranking remains a quality layer beyond current anchored-record behavior. | CP10C Pass; TECH-013 added. | CP10C report, checklist, sprint plan, and decision register updated. |
| CP11 | Search and Hadith corrected to user-POV guided knowledge delivery. `/search` is now `Guided discovery`; `/hadith` is now `Sunnah practice`; source browsing is secondary; intention/sincerity expansion added; build/export/runtime/API checks passed. | CP12 should deepen knowledge quality: tafsir reading room, Quran-to-tafsir learning, Hadith practice ranking, and clearer verification states. | Restore/install local Playwright browser binary if automated visual browser QA is required before Product Owner review. | ADHOC-004, CP11A, CP11B, CP11C Pass; TECH-014 added. | CP11 report, sprint plan, checklist, and decision register updated. |
| CP12A | Shared/API/mobile contracts now define two search modes: Guidance Search and Source Search. Guidance evidence can carry deep links; source results can carry source-to-guidance targets; mobile has a grouped Source Search response helper. | CP12B - Source Search API And Ranking. | None blocking. Later ad-hoc: split user-facing source study from internal source-trust detail. | CP12A Pass; TECH-015 added. | CP12A report, sprint plan, and checklist updated. |
| CP12B | Backend `/api/private-content/search/sources` added. Source Search now returns `mode=sources`, grouped results, service-layer ranking, result deep links, source-detail routes, and `openGuidanceTarget`. Ayah references such as `2:255` build exact Quran/tafsir results. | CP12C - Source Search Mobile UI. | None blocking. Data follow-up: add translation and verification documents to the private search index. | CP12B Pass for current backend scope; TECH-016 added. | CP12B report, sprint plan, checklist, dual-search plan, and decision register updated. |
| CP12C | `/sources` mobile route added with compact query, filters, starters, grouped source results, and Open/Source/Guide actions. `/search` now links to Sources and bottom Learn nav includes `/sources`. | CP12D - Guidance Deep-Link Upgrade. | None blocking. Product review should inspect `/sources` on mobile because automated Playwright visual QA remains unavailable. | CP12C Pass for current mobile scope; TECH-017 added. | CP12C report, sprint plan, checklist, dual-search plan, and decision register updated. |
| CP12D | Shared `GuidanceDeepLinks` component added and wired into Today, Ask, Learn, and Sunnah Practice. Quran anchors, Sunnah support, and guidance panels now expose study/research links from guidance-session deep-link fields. | CP12E - Ayah And Narration Study Rooms. | None blocking. Product review should inspect link density on mobile. | CP12D Pass for current mobile scope; TECH-018 added. | CP12D report, sprint plan, checklist, dual-search plan, and decision register updated. |
| CP12E | Ayah study route added; Quran reader links to study ayah/source Sunnah; backend route targets now point to ayah rooms, including indexed Quran/tafsir source results; narration detail upgraded with research/deep-link actions; build/export/runtime/API checks passed. | CP13 - Product Owner Study UX Review And Mobile QA, or data-first translation/verification indexing. | None blocking. Translation and verification index data remains follow-up. | CP12E Pass for current mobile scope; TECH-019 added. | CP12E report, sprint plan, checklist, dual-search plan, and decision register updated. |
| CP13 | Mobile study-flow QA completed across Today, Learn, Source Search, Ayah Study, and Sunnah Practice; Source Search density corrected; Ayah Study repeated themes and internal attribution wording corrected; source-to-ayah and ayah-to-guidance interactions verified. | CP14 - Study Room Product Polish And Data Quality Triage. | None blocking. Recommended first CP14 work: Hadith text-quality triage, softer study-room typography, and user-facing attribution panel. | CP13 Pass for mobile study-flow QA; TECH-020 added. | CP13 report, sprint plan, checklist, and decision register updated. |
| CP14 | Hadith study typography softened; API Sunnah support now avoids damaged Hadith snippets; narration detail hides flagged meaning text behind a quality note; source attribution rebuilt as a user-facing page; build/export/runtime/browser QA passed. | CP15 - Translation Coverage And Attribution Data Upgrade. | None blocking before CP15. Data-quality import triage should happen before final Product Owner GO. | CP14 Pass; TECH-021 added. | CP14 report, sprint plan, checklist, and decision register updated. |

## Ad-Hoc Completion Log

| ID | Item | Status | Evidence | Next |
| --- | --- | --- | --- | --- |
| ADHOC-001 | User-selectable Arabic font in Profile. | Pass | Profile offers KFGQPC Hafs and Amiri Quran with Arabic preview. Quran page refreshes the saved preference and renders Arabic ayahs with the selected font. | Continue CP01. |
| ADHOC-002 | Modern companion UI reset before CP10. | Pass | Product Owner accepted current status. Route reset implemented across Today, Ask, Read, Learn, Hadith, Growth, and Settings. Global top gear opens Settings. Growth no longer displays settings. Build/export/runtime passed. | Proceed to orchestration engine quality review before CP10. |
| CP09B | Orchestration engine quality upgrade. | Pass | Natural user phrases for patience/gratitude now produce Quran-anchored ready sessions; unknown test phrase remains blocked; Hadith-only mode keeps Sunnah support without forced Quran anchor. | Decide CP09C learning-path upgrade or CP10 Go/No-Go with known limits. |
| CP09C | Quran, Tafsir, Hadith learning path upgrade. | Pass | Contract/API/UI now expose ordered Quran, Tafsir, Hadith, Reflect, and Act steps; CP09C matrix and mobile browser check passed. | Decide CP10 Go/No-Go or continue deeper learning content checkpoints. |
| CP10A | Hadith Library Mobile Rebuild. | Pass | `/hadith` shows collection search, collection cards, selected collection summary, narration index, Prev/Next controls, and detail entry at mobile width. | Proceed CP10B - Hadith Learning/Practice Map. |
| CP10B | Hadith Learning/Practice Map. | Pass | Detail route shows Arabic original, preferred meaning fallback, Practice Map, Quran lens, careful action, boundary, and Related Sunnah Path; 390x844 check passed without overflow. | Improve retrieval ranking and first-class narration anchoring before mature Hadith learning acceptance. |
| CP10C | Hadith Retrieval Ranking And Narration Anchoring. | Pass | `hadith_record` entry point anchors Bukhari #1 as first Sunnah support; learning path returns to `/hadith/5afbb787-10dc-b1c9-8bc6-4beb0299d569`; 390x844 browser check passed. | Decide Product Owner review or proceed to next deepening checkpoint. |
| ADHOC-003 | Hadith landing density correction. | Pass | Removed collection stat panel, collection cards, selected-collection metadata, repeated review/source labels, and placeholder list copy. `/hadith` now uses one compact source selector and real narration previews where available. | Continue Product Owner review of Hadith reading density. |
| ADHOC-004 | User-POV guided knowledge UI correction. | Pass | `/search` now starts from user need and `/hadith` now starts from Sunnah practice. Source browsing is secondary behind guided knowledge delivery. | Proceed to deeper tafsir, Quran learning, and Hadith practice quality. |
| CP14 | Study Room Product Polish And Data Quality Triage. | Pass | Hadith damaged meaning text is guarded, source attribution is user-facing, and CP14 mobile browser QA passed. | Proceed CP15 - Translation Coverage And Attribution Data Upgrade. |

## Route Acceptance Matrix

| Route | Must Feel Like | Current Assessment | Required Change |
| --- | --- | --- | --- |
| `/` Today | Receiving guidance immediately | Pending | Compact segmented need selector and quieter guidance surfaces implemented; awaits mobile visual QA with data runtime. |
| `/answer` Ask | Companion creates sourced guidance | Pending | Smaller question surface, starter rows, Quran/guidance panels, reflection, and action implemented; awaits mobile visual QA with data runtime. |
| `/quran/1` Read | Quran reading room | Pending | Reader-first Arabic display and compact reading/layer controls implemented; awaits mobile visual QA with data runtime. |
| `/search` Learn | Guided discovery from a user need | Pass | CP11A starts with `What do you need guidance for?`, renders `RAFIQ Path`, and then `Guided Steps` from `GuidanceSession.learningPath`. |
| `/hadith` Sunnah | Sunnah practice from a user goal | Pass | CP11B starts with `What Sunnah do you want to practice?`, renders Quran lens, Sunnah support, caution, one action, and keeps source browsing behind `Browse sources`. |
| `/profile` Growth | Memory and continuity | Pending | Growth now focuses on memory/continuity only; settings moved to the global top gear; awaits mobile visual QA. |
| `/settings` Reading Settings | Quiet configuration | Pending | Dedicated language, rhythm, guidance lens, and Quran font settings implemented behind the top gear; awaits mobile visual QA. |

## Per-Checkpoint Product Owner Questions

Answer `Pass` or `Fail`.

| Question | Status | Notes |
| --- | --- | --- |
| Does RAFIQ understand the user's state/question/theme/ayah? | Pass | CP01 contract includes `GuidanceSessionNeed` with entry point, raw input, detected theme, intent, language, and domain. |
| Does RAFIQ select a Quran anchor? | Pass | CP01 contract includes nullable `GuidanceSessionQuranAnchor`; CP02 must populate it. |
| Does RAFIQ explain meaning simply? | Pass | CP01 contract requires `simpleMeaning` and optional tafsir summary. |
| Does RAFIQ add Sunnah support where relevant? | Pass | CP01 contract includes `GuidanceSessionSunnahSupport`. |
| Does RAFIQ show reliability/source quietly? | Pass | CP01 contract includes verification summary, evidence counts, review status, and source targets. |
| Does RAFIQ ask for reflection? | Pass | CP01 contract includes `reflectionPrompt`. |
| Does RAFIQ give one action? | Pass | CP01 contract includes one action with completion state. |
| Does RAFIQ save or resume memory? | Pass | CP01 contract includes saved state, reflection text, journal id, and resumed session id. |
| Does the screen avoid dashboard/card clutter? | Pass | CP03 Today removed old hardcoded dashboard/demo content and renders one session flow. |
| Does the screen feel professional on mobile? | Fail | Product Owner rejected the current UI as dated, oversized, box-heavy, and not yet a modern RAFIQ companion. |

## UI Rejection Checklist

Any `Yes` below means fail.

| Rejection Trigger | Status | Notes |
| --- | --- | --- |
| Screen is mostly boxes/cards/buttons without delivered guidance. | Pass | CP09 route checks show guidance, reading, verification, or memory on each main route. |
| Text explains product/process instead of guiding the user. | Pass | Visible developer/process word scan passed in completed browser batches. |
| More than one primary task competes in first viewport. | Pass | Main routes keep one primary path: Today, Ask, Read, Learn, Sunnah, or Growth. |
| Desktop grid appears on mobile. | Pass | 390x844 and 430x932 route matrix showed no mobile overflow or small targets. |
| Quran appears secondary where it should be primary. | Pass | Read route and session routes keep Quran anchor visible. |
| Hadith/Sunnah is hidden, decorative, or disconnected. | Pass | Sunnah route and support layers show reliability/practice connection. |
| Developer/process words appear in user UI. | Pass | Browser scans returned no visible internal/process terms in completed route batches. |
| Tap target does not look tappable. | Pass | Browser tap-target scan found no visible interactive target under 44px in completed route batches. |
| Font sizes feel like marketing headlines rather than reading UI. | Pass | Route QA confirmed compact companion shell and reading-oriented text hierarchy. |
| Product Owner says it still feels unprofessional. | Fail | Product Owner rejected the UI before CP10 and stated it would be NO-GO. |

## Technical Verification Checklist

| ID | Verification | Status | Evidence |
| --- | --- | --- | --- |
| TECH-001 | `corepack pnpm build` passes. | Pass | Root build passed for shared and API. |
| TECH-002 | Mobile web export passes. | Pass | `corepack pnpm -C apps/mobile exec expo export --platform web` passed and exported both Arabic font files. |
| TECH-003 | Runtime check passes. | Pass | `scripts/check_phase5_runtime.ps1` passed after CP02 restart. |
| TECH-004 | Browser QA passes at 390x844. | Pass | CP09 390x844 route matrix passed for Today, Ask, Read, Learn, Sunnah, and Growth after Hadith data-load retest. |
| TECH-005 | Browser QA passes at 430x932. | Pass | CP09 430x932 route matrix passed for Today, Ask, Read, Learn, Sunnah, and Growth. |
| TECH-006 | No console errors. | Pass | CP09 completed route batches reported no app console errors; ignored browser clipboard bridge tooling noise. |
| TECH-007 | No mobile overflow. | Pass | CP09 route matrix found no horizontal overflow across 390x844, 430x932, tablet, or desktop checks. |
| TECH-008 | Quran Arabic font preference works. | Pass | Browser verification: Amiri Quran renders as `RafiqAmiriQuran`; KFGQPC Hafs renders as `RafiqKfgqpcHafs`; no horizontal overflow at mobile viewport. |
| TECH-009 | API returns GuidanceSession contract. | Pass | `/api/private-content/guidance/session` returned ready `mercy` session and blocked no-evidence `rizq` session. |
| TECH-010 | Saved memory persists locally or in backend. | Pass | CP08 added guarded local Growth Memory for saved sessions, reflections, actions, resume routes, and preferences. |
| TECH-011 | API returns structured learning path. | Pass | `scripts/check_cp09c_learning_path.ps1` passed for Learn guidance, Ask patience, and Hadith-only mercy. |
| TECH-012 | Hadith detail can open practice-map support. | Pass | `scripts/check_cp10b_hadith_practice_map.ps1` verifies Bukhari detail text, Arabic original, Hadith-scoped intention support, and learning path. |
| TECH-013 | Hadith-record session anchors opened narration. | Pass | `scripts/check_cp10c_hadith_anchor.ps1` verifies `hadith_record`, anchored first support, Bukhari reference, and `/hadith/:id` learning route. |
| TECH-014 | CP11 guided discovery and Sunnah practice rebuild checks pass. | Pass | `corepack pnpm build`, mobile web export, runtime check, route-source checks, and direct API guidance-session checks passed. Headless Playwright binary was unavailable and should be restored for automated visual QA. |
| TECH-015 | CP12A dual-search contract builds. | Pass | `corepack pnpm build` and `corepack pnpm -C apps/mobile exec expo export --platform web` passed after shared/API/mobile contract updates. |
| TECH-016 | CP12B source-search endpoint checks pass. | Pass | `/api/private-content/search/sources` passed for `mercy/all`, `intention/hadith`, Arabic Quran query, `2:255/all`, and `2:255/tafsir`; build, mobile export, and runtime checks passed. |
| TECH-017 | CP12C source-search mobile UI builds and exports. | Pass | `/sources` route added; mobile export produced `index-37efa33d786273ca30aad29db9a07dbb.js`; runtime check passed; source-search API returned grouped results with deep links and guidance target. |
| TECH-018 | CP12D guidance deep-link UI builds and exports. | Pass | `mercy/all` session returned 4 Quran deep links and 3 suggestions; `intention/hadith` returned Sunnah deep links/suggestions; build, mobile export, and runtime checks passed. |
| TECH-019 | CP12E ayah/narration study rooms build and route checks pass. | Pass | Build, mobile export, and runtime passed; guidance/source-search route targets verified `/quran/7/155`, `/quran/2/255`, and indexed tafsir route `/quran/20/109`. |
| TECH-020 | CP13 mobile study-flow browser QA passes. | Pass | Chrome 390x844 QA passed for Today, Learn, Sources, Ayah Study, and Sunnah Practice; source-to-ayah and ayah-to-guidance interactions passed; build, mobile export, and runtime passed. |
| TECH-021 | CP14 study-room polish and data-quality browser QA passes. | Pass | Build, mobile export, runtime, and Chrome 390x844 QA passed for `/hadith`, narration study, source attribution, and ayah study; no console errors, no horizontal overflow, and no damaged Hadith phrase or internal/reviewer language on tested user routes. |

## Decision Rule

CP10 is `GO` only if:

- all CP01-CP09 gates pass;
- Product Owner accepts the first mobile inspection;
- no route feels like a dashboard;
- the MVP Core guidance loop is end-to-end;
- RAFIQ visibly behaves like an orchestrator-led Islamic companion.

Otherwise CP10 is `NO-GO`.
