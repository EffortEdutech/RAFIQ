# Resource Audit & Import Prototype Execution Board

Use this as the sprint tracker.

## Backlog

| ID | Task | Workstream | Priority | Status | Owner | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| D1-001 | Confirm sprint objective | Setup | P0 | Done | TBD | Captured in `DAY_01_SPRINT_SETUP_CHECKLIST.md`. |
| D1-002 | Confirm sprint duration | Setup | P0 | Done | TBD | 10 working days retained in `SPRINT_PLAN.md`. |
| D1-003 | Confirm sprint tracker | Setup | P0 | Done | TBD | This board expanded for Day 1 monitoring. |
| D1-004 | Confirm status values | Setup | P0 | Done | TBD | Standard values listed below. |
| D1-005 | Define P0 source groups | Setup | P0 | Done | TBD | Captured in `SOURCE_SHORTLIST.md`. |
| D1-006 | Define P1 source groups | Setup | P0 | Done | TBD | Captured in `SOURCE_SHORTLIST.md`. |
| D1-007 | Define deferred source groups | Setup | P1 | Done | TBD | Captured in `SOURCE_SHORTLIST.md`. |
| D1-008 | Map source groups to sprint days | Setup | P0 | Done | TBD | Captured in `AUDIT_BATCH_PLAN.md`. |
| D1-009 | Confirm evidence required for every source | Setup | P0 | Done | TBD | Captured in `RESOURCE_AUDIT_METHOD.md`. |
| D1-010 | Confirm source audit template | Setup | P0 | Done | TBD | `templates/SOURCE_AUDIT_TEMPLATE.md`. |
| D1-011 | Confirm source manifest template | Setup | P0 | Done | TBD | `templates/SOURCE_MANIFEST_TEMPLATE.json`. |
| D1-012 | Confirm validation report template | Setup | P0 | Done | TBD | `templates/IMPORT_VALIDATION_REPORT_TEMPLATE.md`. |
| D1-013 | Confirm raw landing-zone principle | Setup | P0 | Done | TBD | Raw resources remain unchanged. |
| D1-014 | Confirm staging-before-canonical rule | Setup | P0 | Done | TBD | Staging imports before production schema lock. |
| D1-015 | Confirm no production import rule | Setup | P0 | Done | TBD | Production import requires approval. |
| D1-016 | Add Day 1 tasks to execution board | Setup | P0 | Done | TBD | Completed in this board. |
| D1-017 | Add open Day 1 decisions | Setup | P0 | Done | TBD | Captured in `DAY_01_OPEN_DECISIONS.md`. |
| D1-018 | Prepare Day 1 completion note | Setup | P0 | Done | TBD | Drafted in `DAY_01_COMPLETION_NOTE.md`. |
| RAIP-001 | Confirm final P0 source shortlist | WS1 | P0 | Done | TBD | Accepted by product owner on 2026-06-10. |
| RAIP-002 | Audit QUL docs and resources directory | WS1 | P0 | Done | TBD | Resource categories, schemas, formats, FAQ, credits, and download access inspected. |
| RAIP-003 | Audit Quran text source and script variant | WS1/WS2 | P0 | Done | TBD | Day 2 audit finalized. Tanzil staging use approved; production display source remains unapproved. |
| RAIP-004 | Verify Quran text license and attribution | WS2 | P0 | Done | TBD | Decision finalized: Tanzil conditional staging use; QUL production use blocked pending provenance/permission. |
| RAIP-005 | Audit English translation source | WS1/WS2 | P0 | Done | TBD | Day 3 decision finalized. Staging only; production rights remain blocked. |
| RAIP-006 | Audit Malay translation source | WS1/WS2 | P0 | Done | TBD | Day 3 decision finalized. Basmeih is the current candidate; production rights remain blocked. |
| RAIP-007 | Audit QUL topics and ayah themes | WS3 | P0 | Done | TBD | Day 4 finalized. Complete private import approved with source-preserving quality flags; public release remains gated. |
| RAIP-008 | Audit tafsir source candidates | WS1/WS2 | P1 | Done | TBD | Day 4 finalized. Complete private import approved; public release remains gated. |
| RAIP-009 | Audit and acquire hadith collection candidates | WS1/WS2 | P1 | Done | TBD | Direct acquisition and principal validation complete; restricted API/export requests continue in parallel. |
| RAIP-010 | Audit hadith grade/verification candidates | WS1/WS2 | P1 | Done | TBD | Day 6 decisions finalized; Dorar and live SemakHadis access continue in parallel. |
| RAIP-011 | Design raw landing-zone layout | WS4 | P0 | Done | TBD | Immutable source/snapshot/object contract and future versioned layout defined. |
| RAIP-012 | Design source registry fields | WS4 | P0 | Done | TBD | V2 registry and manifest contract separates source, snapshot, object, and approval dimensions. |
| RAIP-013 | Design staging import tables | WS5 | P0 | Done | TBD | 35-table private ingest/staging reference DDL covers all audited domains. |
| RAIP-014 | Define validation rules per domain | WS5 | P0 | Done | TBD | 41 executable rules passed across Quran, translation, tafsir, topics, themes, Hadith, grades, and verification. |
| RAIP-015 | Prepare prototype import plan | WS5 | P0 | Done | TBD | Complete representative loaders executed into a source-shaped SQLite staging database. |
| RAIP-016 | Produce canonical schema recommendation | WS6 | P0 | Done | TBD | Day 9 recommendation and 42-table reference DDL replace incompatible V2 content assumptions. |
| RAIP-017 | Sprint review and import roadmap update | WS6 | P0 | Done | TBD | Day 10 review, source matrix, build-readiness decision, and complete private import roadmap prepared. |
| RAIP-018 | Execute production rights approval packs for QUL 86, 88, 193, and 292 | WS2/WS3 | P0 | In Progress | Product Owner | Packs and consolidated permission request prepared under `production_rights_approval/`. |
| RAIP-019 | Enforce build-pending-content-approval architecture | WS4/WS5 | P0 | In Progress | Technical Owner | CR-060 completed private schema/RLS enforcement; reviewed `public_api` release views/RPCs remain implementation work before public deployment. |
| RAIP-020 | Complete Phase 2 source registry and raw-object registration | WS4/WS5 | P0 | Done | Technical Owner | 22 sources, 42 snapshots, 654,285 raw objects, 654,229 Hadith raw objects, 24 Hadith aggregate digests, and 186 parser assignments verified on 2026-06-16. |
| RAIP-021 | Phase 3 loader checkpoint 01 | WS5 | P0 | Done | Technical Owner | 28 completed import runs, 202,249 source records, Quran scripts, Quran partitions, translations, and Fawaz line-by-line Hadith loaded and verified on 2026-06-16. |
| RAIP-022 | Phase 3 remaining all-source loaders | WS5 | P0 | Done | Technical Owner | Phase 3 completed on 2026-06-17 with 196 completed import runs, 0 failed runs, and 186/186 parser assignments implemented. |
| RAIP-023 | Phase 3 QUL metadata, tafsir, topics, and themes checkpoint | WS5 | P0 | Done | Technical Owner | 2,590 Quran partitions, 18,708 tafsir passages, 2,512 source topics, 30,687 topic-ayah links, 2,098 ayah-theme groups, and 12,400 theme-ayah links verified on 2026-06-16. |
| RAIP-024 | Phase 3 Hadith grades and verification checkpoint | WS5 | P0 | Done | Technical Owner | 67,711 Fawaz grade assertions, 28 SemakHadis mock verification claims, and 66 validation findings verified on 2026-06-16. |
| RAIP-025 | Phase 3 additional Hadith JSON source-family checkpoint | WS5 | P0 | Done | Technical Owner | Abdullah, MeeAtif, and AhmedBaset JSON loaders completed; 137,347 total Hadith records and 340,719 total text versions verified on 2026-06-16. |
| RAIP-026 | Phase 3 CSV, JSONL, XLSX, Fawaz profile, and Parquet profile checkpoint | WS5 | P0 | Done | Technical Owner | 141 completed import runs, 1,177,817 source records, 324,866 Hadith records, 684,348 text versions, 88 verification claims, and 64 raw-object profiles verified on 2026-06-17. |
| RAIP-027 | Phase 3 final remaining-item review and closure | WS5 | P0 | Done | Technical Owner | 53 Fawaz edition JSON files and one Sunnah.com SQL dump reviewed; final findings added; 196 completed import runs and 186/186 parser assignments verified on 2026-06-17. |
| RAIP-028 | Phase 4 canonical promotion | WS6 | P0 | Done | Technical Owner | Quran, translations, tafsir, topics, ayah themes, Hadith records, text versions, grades, verification claims, provenance, and private release states promoted and verified on 2026-06-17. See `PHASE_04_COMPLETION_REPORT.md`. |
| RAIP-029 | Phase 5 private retrieval and first RAFIQ pages | Product/API/UI | P0 | In Progress | Technical Owner | Checkpoints 01-02 completed: private database retrieval API, localhost startup, and first private Quran/Hadith pages are verified. Real monorepo API/app scaffold remains next. |
| RAIP-030 | Phase 5 private retrieval API checkpoint 01 | API/Data | P0 | Done | Technical Owner | Added locked-down `private_api` schema with Quran surah, Hadith collection, Hadith list, Hadith detail, and private notice RPC contracts; 11/11 verifier assertions passed on 2026-06-17. |
| RAIP-031 | Phase 5 private bridge checkpoint 02 | Product/API/UI | P0 | Done | Technical Owner | Added localhost startup and health scripts, improved Quran/Hadith private pages, documented private endpoints, and verified bridge/page health on 2026-06-18. |
| RAIP-032 | Phase 5 real app scaffold checkpoint 03 | API/App | P0 | Done | Technical Owner | Monorepo root, `apps/api`, `apps/mobile`, shared contracts, env examples, and scaffold verifier completed on 2026-06-18. |
| RAIP-033 | Phase 5 dependency install and API/mobile run checkpoint 04 | API/App | P0 | Done | Technical Owner | Dependencies installed, NestJS API running on `8056`, Expo web running on `8057`, export/browser/runtime verification passed on 2026-06-18. |
| RAIP-034 | Phase 5 API hardening and bridge retirement checkpoint 05 | API/App | P0 | Done | Technical Owner | DTO validation, standard error shape, OpenAPI, request logging, health checks, runtime checks, and bridge parity tooling completed on 2026-06-18. Python bridge demoted to diagnostic-only. See `PHASE_05_API_HARDENING_CHECKPOINT_05_REPORT.md`. |
| RAIP-035 | Phase 5 private product workflows checkpoint 06 | Product/App | P0 | Done | Technical Owner | Expanded Quran reader controls, Hadith collection/list/detail navigation, source-status panels, and browser verification completed on 2026-06-18. See `PHASE_05_PRIVATE_PRODUCT_WORKFLOWS_CHECKPOINT_06_REPORT.md`. |
| RAIP-036 | Phase 5 private search checkpoint 07 | Search/API/App | P0 | Done | Technical Owner | Added private `search_content` RPC, NestJS search endpoint, Expo `/search` screen, SQL/runtime/browser verification, and private search checkpoint report on 2026-06-18. See `PHASE_05_PRIVATE_SEARCH_CHECKPOINT_07_REPORT.md`. |
| RAIP-037 | Phase 5 indexed search and retrieval traces checkpoint 08 | Search/API/App | P0 | Done | Technical Owner | Added 726,315-document private search index, ranked search, retrieval traces, trace API, rank/trace UI, SQL/runtime/browser verification, and report on 2026-06-18. See `PHASE_05_INDEXED_SEARCH_CHECKPOINT_08_REPORT.md`. |
| RAIP-038 | Phase 5 internal review queues and retrieval evidence checkpoint 09 | Review/API/App | P0 | Done | Technical Owner | Added service-role-only review queue table/RPCs, NestJS queue/detail endpoints, Expo `/review` and evidence screens, SQL/runtime/browser verification, and report on 2026-06-18. See `PHASE_05_REVIEW_QUEUES_CHECKPOINT_09_REPORT.md`. |
| RAIP-039 | Phase 5 answer guardrails and evidence policy checkpoint 10 | AI/API/App | P0 | Done | Technical Owner | Added deterministic private answer draft policy, validation gate results, citation evidence, escalation states, NestJS answer endpoints, Expo `/answer` screen, SQL/runtime/browser verification, and report on 2026-06-19. See `PHASE_05_ANSWER_GUARDRAILS_CHECKPOINT_10_REPORT.md`. |
| RAIP-040 | Phase 5 guided answer prompt integration checkpoint 11 | AI/API/App | P0 | Done | Technical Owner | Added deterministic guided answer prompt package, prompt statuses, citation IDs, NestJS guided answer endpoints, updated Expo `/answer` UX, SQL/runtime/browser verification, and report on 2026-06-19. See `PHASE_05_GUIDED_ANSWER_CHECKPOINT_11_REPORT.md`. |
| RAIP-041 | Phase 5 private model-provider adapter checkpoint 12 | AI/API/App | P0 | Done | Technical Owner | Added disabled-by-default model adapter audit table/RPCs, NestJS adapter status/run endpoints, env flags, updated Expo `/answer` adapter panel, SQL/runtime/browser verification, and report on 2026-06-19. See `PHASE_05_MODEL_ADAPTER_CHECKPOINT_12_REPORT.md`. |
| RAIP-042 | Phase 5 answer validation and reviewer actions checkpoint 13 | AI/Review/App | P0 | Done | Technical Owner | Added post-generation citation enforcement, answer validation runs, answer-validation queue type, reviewer action RPCs, Expo `/answer` reviewer controls, SQL/runtime/browser verification, and report on 2026-06-19. See `PHASE_05_ANSWER_VALIDATION_CHECKPOINT_13_REPORT.md`. |
| RAIP-043 | Phase 5 source detail and attribution display checkpoint 14 | Attribution/API/App | P0 | Done | Technical Owner | Added private source-detail RPC, source-detail API endpoint, Expo `/source-detail` page, Quran/Hadith/search/answer attribution links, SQL/runtime/browser verification, and report on 2026-06-19. See `PHASE_05_SOURCE_DETAIL_CHECKPOINT_14_REPORT.md`. |
| RAIP-044 | Phase 5 private product acceptance and Phase 6 Go/No-Go checkpoint 15 | Product/Governance | P0 | Done | Technical Owner | Phase 5 accepted complete for private testing; SQL acceptance, build, scaffold, export, runtime verification passed; GO for Phase 6 design and NO-GO for public release until approval gates pass. See `PHASE_05_PRIVATE_PRODUCT_ACCEPTANCE_CHECKPOINT_15_REPORT.md`. |
| RAIP-045 | Phase 6 public/private deployment separation and release-filtered public_api checkpoint 01 | Public/API/Governance | P0 | Done | Technical Owner | Added release-filtered `public_api` design functions/views, deployment-mode health flags, SQL safety assertions, and report on 2026-06-19. Public content release remains NO-GO. See `PHASE_06_PUBLIC_PROMOTION_DESIGN_CHECKPOINT_01_REPORT.md`. |
| RAIP-046 | Phase 6 public search contract checkpoint 02 | Public/Search/API | P0 | Done | Technical Owner | Added release-gated `public_api.search_public_content`, shared public search contract, `/api/public-content/search`, SQL/build/runtime verification, and report on 2026-06-19. Public search returns zero pending content. See `PHASE_06_PUBLIC_SEARCH_CHECKPOINT_02_REPORT.md`. |
| RAIP-047 | Phase 6 public AI/RAG retrieval contract checkpoint 03 | Public/AI/API | P0 | Done | Technical Owner | Added release-approved-only public answer draft and guided-answer RPC/API contracts, shared types, OpenAPI/runtime checks, and report on 2026-06-19. Public answers block with `source_unavailable` / `blocked_no_public_evidence` until approved public evidence exists. See `PHASE_06_PUBLIC_ANSWER_RETRIEVAL_CHECKPOINT_03_REPORT.md`. |
| RAIP-048 | Phase 6 Product Owner public-scope approval checklist checkpoint 04 | Public/Governance | P0 | Done | Technical Owner | Prepared exact public-scope approval checklist covering source-version gates, feature approvals, intended public uses, required evidence, AI/RAG conditions, and Product Owner decision record. Public launch remains NO-GO. See `PHASE_06_PUBLIC_SCOPE_CHECKPOINT_04_REPORT.md`. |
| RAIP-049 | Phase 6 public attribution placement and rollback workflow checkpoint 05 | Public/Governance/Ops | P0 | Done | Technical Owner | Prepared public attribution placement matrix, minimum attribution payload, public source-detail requirement, rollback triggers/workflow, verification checklist, machine-readable policy JSON, and report on 2026-06-19. Public launch remains NO-GO. See `PHASE_06_PUBLIC_ATTRIBUTION_ROLLBACK_CHECKPOINT_05_REPORT.md`. |
| RAIP-050 | Phase 6 approved fixture content checkpoint 06 | Public/Test/API | P0 | Done | Technical Owner | Added transactional approved fixture test proving public search/answer/guided-answer positive path, rollback removal, and continued real-content blocking. SQL/build/scaffold/runtime checks passed on 2026-06-20. See `PHASE_06_APPROVED_FIXTURE_CONTENT_CHECKPOINT_06_REPORT.md`. |
| RAIP-051 | Phase 6 public page design and read-only UX checkpoint 07 | Public/UX/Governance | P0 | Done | Technical Owner | Prepared public route map, API allowlist, blocked private route policy, empty-state copy, read-only UX rules, future Quran/Hadith blockers, machine-readable JSON allowlist, and report on 2026-06-20. Public launch remains NO-GO. See `PHASE_06_PUBLIC_READ_ONLY_UX_CHECKPOINT_07_REPORT.md`. |
| RAIP-052 | Phase 6 public security and access review checkpoint 08 | Public/Security/API | P0 | Done | Technical Owner | Added SQL security/access assertions, reviewed Supabase/API/env boundaries, documented robots/indexing and production security gaps, and verified SQL/build/runtime/scaffold on 2026-06-20. Public launch remains NO-GO. See `PHASE_06_PUBLIC_SECURITY_ACCESS_CHECKPOINT_08_REPORT.md`. |
| RAIP-053 | Phase 6 Go/No-Go decision register checkpoint 09 | Public/Governance | P0 | Done | Technical Owner | Finalized Phase 6 design completion decision on 2026-06-20. Phase 6 public-promotion design is GO; public release, public beta, production public deployment, and public model execution remain NO-GO. See `PHASE_06_GO_NO_GO_DECISION_REGISTER.md`. |
| RAIP-054 | Public UI/UX implementation sprint control pack | Public/UI/UX/Product | P0 | Done | Technical Owner | Prepared the next sprint plan, detailed checklist, and decision register for visible RAFIQ public UI/UX implementation. See `RAFIQ_PUBLIC_UI_UX_IMPLEMENTATION_SPRINT_PLAN.md`, `RAFIQ_PUBLIC_UI_UX_IMPLEMENTATION_CHECKLIST.md`, and `RAFIQ_PUBLIC_UI_UX_IMPLEMENTATION_DECISION_REGISTER.md`. |
| RAIP-055 | Public UI/UX CP01 product experience brief | Public/UI/UX/Product | P0 | Done | Technical Owner | Product Owner approved the sprint pack; CP01 defined RAFIQ's first-screen promise, tone, primary journeys, route map, public/private-preview boundaries, and empty-state promise. See `RAFIQ_PUBLIC_UI_UX_CP01_PRODUCT_EXPERIENCE_BRIEF.md`. |
| RAIP-056 | Public UI/UX CP02 visual design system | Public/UI/UX/Product | P0 | Done | Technical Owner | CP02 defined RAFIQ public colors, typography, spacing, cards, source/evidence/status components, state matrix, accessibility rules, and mobile-first layout. See `RAFIQ_PUBLIC_UI_UX_CP02_VISUAL_DESIGN_SYSTEM.md`. |
| RAIP-057 | Public UI/UX CP03 public app shell | Public/UI/UX/App | P0 | Done | Technical Owner | Implemented CP02-based public shell, public navigation, `/` public home, public route shells, and browser-verified no `/review` exposure in public nav. See `RAFIQ_PUBLIC_UI_UX_CP03_PUBLIC_APP_SHELL_REPORT.md`. |
| RAIP-058 | Public UI/UX CP04 public landing page | Public/UI/UX/App | P0 | Done | Technical Owner | Polished public home with primary CTAs, trust indicators, workflow story, approval-boundary messaging, and browser verification. See `RAFIQ_PUBLIC_UI_UX_CP04_PUBLIC_LANDING_PAGE_REPORT.md`. |
| RAIP-059 | Public UI/UX CP05 public search UX | Public/Search/UI/API | P0 | Done | Technical Owner | Connected `/public/search` to `/api/public-content/search`, rendered release-filter status, intentional zero-approved-content empty state, and future approved-result cards while keeping private routes hidden. See `RAFIQ_PUBLIC_UI_UX_CP05_PUBLIC_SEARCH_UX_REPORT.md`. |
| RAIP-060 | Public UI/UX CP06 public guided answer UX | Public/AI/UI/API | P0 | Done | Technical Owner | Connected `/public/answer` to public answer/guided-answer APIs, rendered `blocked_no_public_evidence`, no-evidence citation state, validation gates, and non-fatwa boundary copy. See `RAFIQ_PUBLIC_UI_UX_CP06_PUBLIC_GUIDED_ANSWER_UX_REPORT.md`. |
| RAIP-061 | Public UI/UX CP07 public source detail UX | Public/Attribution/UI/API | P0 | Done | Technical Owner | Added public source-detail contract and UI with `not_public` state, attribution/status fields, rollback state, permitted-use note, and private-field exclusions. See `RAFIQ_PUBLIC_UI_UX_CP07_PUBLIC_SOURCE_DETAIL_UX_REPORT.md`. |
| RAIP-062 | Public UI/UX CP08 Quran and Hadith preview surfaces | Public/Reading/UI | P0 | Done | Technical Owner | Replaced placeholder Quran/Hadith public pages with read-only private-preview surfaces, source/approval labels, no-public-text gates, and browser/runtime verification. See `RAFIQ_PUBLIC_UI_UX_CP08_QURAN_HADITH_PREVIEW_SURFACES_REPORT.md`. |
| RAIP-063 | Public UI/UX CP09 responsive accessibility browser QA | Public/QA/Accessibility | P0 | Done | Technical Owner | Ran build/export/runtime checks, desktop and 390px mobile browser sweeps, private leakage scan, raw JSON check, and touch-target accessibility fixes. See `RAFIQ_PUBLIC_UI_UX_CP09_RESPONSIVE_ACCESSIBILITY_BROWSER_QA_REPORT.md`. |
| RAIP-064 | Public UI/UX CP10 sprint review and Go/No-Go | Public/Governance/Product | P0 | Done | Technical Owner | Closed CP01-CP10, recorded sprint review, issued GO for private-demo stakeholder review, and retained NO-GO for public release until approval/hosted-public gates pass. See `RAFIQ_PUBLIC_UI_UX_CP10_SPRINT_REVIEW_REPORT.md` and `RAFIQ_PUBLIC_UI_UX_CP10_GO_NO_GO_DECISION_REGISTER.md`. |
| RAIP-065 | Stakeholder demo and public-readiness sprint setup CP01 | Product/Governance/Public-Readiness | P0 | Done | Technical Owner | Created sprint plan, checklist, decision register, and CP01 demo readiness brief for private stakeholder review, approval workflow, and public-readiness hardening. Public release remains NO-GO. |
| RAIP-066 | Deployment-grade product polish sprint pivot CP01 | Product/UI/Deployment | P0 | Done | Technical Owner | Deferred stakeholder demo/approval sprint, created deployment-grade product polish sprint controls, upgraded RAFIQ public shell/home positioning, and verified build/export/runtime/browser first screen. |
| RAIP-067 | Deployment-grade visual system upgrade CP02 | Product/UI/Design System | P0 | Done | Technical Owner | Upgraded public design tokens, typography, spacing, radii, shadows, shell, action cards, boundary panels, and status badges; build/export/runtime/browser desktop/mobile verification passed. See `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_CP02_VISUAL_SYSTEM_REPORT.md`. |
| RAIP-068 | Deployment-grade navigation and IA CP03 | Product/UI/IA | P0 | Done | Technical Owner | Updated public nav labels, added `/public/sources` and `/public/about`, added home product-navigation path, footer IA links, and browser-verified desktop/mobile route flow. See `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_CP03_NAVIGATION_IA_REPORT.md`. |
| RAIP-069 | Deployment-grade search experience polish CP04 | Product/Search/UI | P0 | Done | Technical Owner | Reframed public search as RAFIQ's product entry point with guided examples, readiness cards, future result layers, intentional gated empty state, next paths, and browser desktop/mobile verification. See `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_CP04_SEARCH_EXPERIENCE_REPORT.md`. |
| RAIP-070 | Deployment-grade guided answer experience polish CP05 | Product/AI/UI | P0 | Done | Technical Owner | Reframed public guided answer as RAFIQ's evidence-first workflow with question starters, answer readiness, trust-preserving blocked state, citation boundaries, next paths, and browser desktop/mobile verification. See `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_CP05_GUIDED_ANSWER_EXPERIENCE_REPORT.md`. |
| RAIP-071 | Deployment-grade Quran and Hadith reading polish CP06 | Product/Reading/UI | P0 | Done | Technical Owner | Upgraded public Quran and Hadith previews into reading/browsing surfaces with controls, safe hidden-text states, source approval gates, next paths, and browser desktop/mobile verification. See `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_CP06_QURAN_HADITH_READING_EXPERIENCE_REPORT.md`. |
| RAIP-072 | Deployment-grade source trust and attribution polish CP07 | Product/Trust/UI | P0 | Done | Technical Owner | Reframed public source trust as a product feature with source journey, attribution checklist, release gates, rollback posture, public-safe exclusion categories, and browser desktop/mobile verification. See `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_CP07_SOURCE_TRUST_ATTRIBUTION_REPORT.md`. |
| RAIP-073 | RAFIQ dream UX recovery CP07.5 | Product/Private UX/UI | P0 | Done | Technical Owner | Corrected product direction from public brochure/status shell to private full-content RAFIQ workspace; upgraded home, search, Quran, Hadith, and answer routes with build/export/runtime/browser verification. See `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_CP07_5_DREAM_UX_RECOVERY_REPORT.md`. |
| RAIP-074 | Signature RAFIQ experience layer CP07.6 | Product/Private UX/UI | P0 | Rejected | Technical Owner | Product Owner rejected CP07.6 as too generic and insufficiently aligned with dakwah, learning, guidance, reflection, and action. See `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_CP07_6_SIGNATURE_EXPERIENCE_REPORT.md`. |
| RAIP-075 | Dakwah experience correction CP07.6A | Product/Private UX/UI | P0 | PO Review | Technical Owner | Rebuilt the first screen around Personal Daily Dakwah Companion, mood/heart check-in, Quran-first guidance package, simple tafsir, related Hadith, one action, and corrected navigation. See `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_CP07_6A_DAKWAH_EXPERIENCE_CORRECTION.md`. |
| RAIP-076 | Real RAFIQ product experience design CP07.7 | Product/Private UX/UI | P0 | PO Review | Technical Owner | Added shared sticky RAFIQ navigation, available-time controls, Core RAFIQ Loop, reflection journal draft, action completion, and learning journey previews. See `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_CP07_7_REAL_PRODUCT_EXPERIENCE_DESIGN.md`. |

## Day 1 Decision Tracker

| ID | Decision | Status | Recommendation |
| --- | --- | --- | --- |
| D1-DEC-001 | Launch language audit order | Resolved | English and Malay audited first; Indonesian completed as optional staging. |
| D1-DEC-002 | Quran text source strategy | Resolved | QUL and Tanzil audited together; editions remain source-specific. |
| D1-DEC-003 | Hadith source strategy | Resolved | Comprehensive multi-source acquisition adopted with source-qualified identity. |
| D1-DEC-004 | Raw data storage policy | Resolved | Immutable raw landing zone, checksums, manifests, and retention rules approved. |
| D1-DEC-005 | Sprint ownership | Deferred | Product Owner approvals recorded; implementation role assignment remains organizational work. |
| D1-DEC-006 | Public release threshold | Resolved | Rights, attribution, integrity, editorial, scholar/content, and Product Owner approval required. |

## Day 2 Progress

| ID | Task | Status | Evidence |
| --- | --- | --- | --- |
| D2-001 | Verify QUL official documentation and resource pages | Done | QUL docs, FAQ, credits, script and metadata pages reviewed. |
| D2-002 | Verify Tanzil official documentation and license | Done | Tanzil download, license, updates, and metadata docs reviewed. |
| D2-003 | Download Tanzil Uthmani text | Done | Raw file and manifest stored. |
| D2-004 | Download Tanzil metadata XML | Done | Raw file and manifest stored. |
| D2-005 | Validate Quran text counts and keys | Done | 6236 unique keys, 114 surahs, no duplicates. |
| D2-006 | Validate Quran metadata counts | Done | 114 surahs, 6236 declared ayahs, partition counts recorded. |
| D2-007 | Inspect QUL JSON/SQLite access | Done | 20 authenticated Day 2 files acquired and validated on 2026-06-12. |
| D2-008 | Document Bismillah representation difference | Done | Recorded in `AUD-QURAN-001`. |
| D2-009 | Produce Quran text audit | Done | `audits/AUD-QURAN-001_Quran_Text.md`. |
| D2-010 | Produce Quran metadata audit | Done | `audits/AUD-QURAN-002_Quran_Metadata.md`. |
| D2-011 | Finalize Day 2 decisions | Done | `DAY_02_DECISION_REGISTER.md`. |

## Day 2 Decision Summary

| ID | Decision | Status |
| --- | --- | --- |
| D2-DEC-001 | Canonical ayah identity | Approved |
| D2-DEC-002 | Raw source preservation | Approved |
| D2-DEC-003 | Tanzil usage | Approved With Conditions |
| D2-DEC-004 | QUL usage | Schema Discovery Approved; Production Blocked |
| D2-DEC-005 | Bismillah storage and presentation | Storage Approved; UI Deferred |

## Day 3 Progress

| ID | Task | Status | Evidence |
| --- | --- | --- | --- |
| D3-001 | Audit English translation candidate | Done | `audits/AUD-TRANS-001_English_Translation.md` |
| D3-002 | Audit Malay translation candidate | Done | `audits/AUD-TRANS-002_Malay_Translation.md` |
| D3-003 | Audit optional Indonesian candidate | Done | `audits/AUD-TRANS-003_Indonesian_Translation.md` |
| D3-004 | Download and checksum staging files | Done | Three raw files, manifests, and SHA-256 entries stored. |
| D3-005 | Validate ayah coverage and key equality | Done | Each file has 6,236 unique keys and no blanks or duplicates. |
| D3-006 | Inspect QUL translation structures | Done | Simple, footnote, inline, and chunk structures documented. |
| D3-007 | Confirm production rights | Blocked | Translator/publisher permission remains unresolved. |
| D3-008 | Resolve Malay canonical attribution | Done | Basmeih approved as current candidate; Basamia retained as unresolved source alias. |
| D3-009 | Approve Day 3 decisions | Done | Finalized on 2026-06-12 in `DAY_03_DECISION_REGISTER.md`. |
| D3-010 | Validate authenticated QUL translation files | Done | Ten files validated; source editions and footnote structures compared. |
| D3-011 | Prepare production rights approval packs | Done | Packs for QUL `193` and `292`, master tracker, and permission request prepared. |

## Day 3 Decision Summary

| ID | Decision | Status |
| --- | --- | --- |
| D3-DEC-001 | Translation identity and ayah mapping | Approved |
| D3-DEC-002 | Raw translation preservation | Approved |
| D3-DEC-003 | Tanzil English and Malay files | Staging Only |
| D3-DEC-004 | QUL translation resources | Schema Discovery Only; Production Blocked |
| D3-DEC-005 | Malay translator attribution | Basmeih Candidate; Alias Review Required |
| D3-DEC-006 | Translation footnotes and chunks | Separate Structured Records |
| D3-DEC-007 | Indonesian translation | Optional Staging Only |
| D3-DEC-008 | AI translation boundary | Approved |

## Day 4 Progress

| ID | Task | Status | Evidence |
| --- | --- | --- | --- |
| D4-001 | Audit representative QUL tafsir resources | Done | `audits/AUD-TAFSIR-001_Tafsir.md` |
| D4-002 | Audit QUL Topics and Concepts | Done | `audits/AUD-TOPIC-001_Topics_Concepts.md` |
| D4-003 | Audit QUL Ayah Themes | Done | `audits/AUD-THEME-001_Ayah_Themes.md` |
| D4-004 | Preserve and checksum public evidence | Done | `data/raw/day4/qul-evidence/` |
| D4-005 | Inspect authenticated dataset files | Done | Eight files acquired; SQLite integrity and JSON equivalence validated. |
| D4-006 | Confirm resource rights | Blocked | Copyright pages report no copyright information. |
| D4-007 | Correct confidence-field assumption | Done | No confidence field is published for resource `62`. |
| D4-008 | Approve Day 4 decisions | Done | Finalized by Product Owner on 2026-06-13 in `DAY_04_DECISION_REGISTER.md`. |
| D4-009 | Define Ayah Theme duplicate and coverage handling | Done | Preserve raw duplicates, deduplicate derived staging with lineage, and retain 36 explicit gaps. |
| D4-010 | Define As-Saadi blank-record handling | Done | Import 59 blank records with explicit `blank_text` quality flags. |

## Day 5 Progress

| ID | Task | Status | Evidence |
| --- | --- | --- | --- |
| D5-001 | Inventory existing hadith files | Done | No `data/raw/hadith/` dataset exists. |
| D5-002 | Audit official Sunnah.com API | Done | Official terms, API schema, identifiers, and access process reviewed. |
| D5-003 | Audit Fawaz Ahmed hadith-api | Done | Version-1 metadata inspected; broad coverage but major provenance gaps documented. |
| D5-004 | Audit AhmedBaset hadith-json/API | Done | Dataset states it was scraped from Sunnah.com; no licence found; acquired into quarantined raw storage for controlled private use. |
| D5-005 | Define hadith identity architecture | Done | Source-qualified identity, language versions, references, and grade assertions proposed. |
| D5-006 | Request official API and export access | Ready | Sunnah.com request prepared; SemakHadis, Dorar, HadeethEnc, and IslamHouse requests tracked in the download manifest. |
| D5-007 | Acquire complete candidate resource set | Done | 24 snapshots, 654,970 files, and 18.442 GB acquired; see `hadith/HADITH_DIRECT_DOWNLOAD_COMPLETION_REPORT.md`. |
| D5-008 | Validate all acquired datasets | Done | 566 principal payloads profiled; 563 passed, three SemakHadis seed defects registered, and five source families compared in `audits/VAL-HADITH-001_Downloaded_Dataset_Validation_Comparison.md`. |
| D5-009 | Approve Day 5 decisions | Done | Finalized by Product Owner on 2026-06-14 in `DAY_05_DECISION_REGISTER.md`. |

## Day 6 Progress

| ID | Task | Status | Evidence |
| --- | --- | --- | --- |
| D6-001 | Inventory embedded grade sources | Done | Fawaz, MeeAtif, LK, and Abdullah Naseer profiled. |
| D6-002 | Extract grade vocabularies and attribution | Done | 28 source/collection profiles and 2,322 vocabulary rows generated under `data/staging_reports/hadith/day6/`. |
| D6-003 | Identify multi-grader review queue | Done | 7,476 Fawaz records contain more than one broad normalized grade bucket. |
| D6-004 | Audit SemakHadis schema and seed data | Done | API schema, 60-row workbook, and 28 mock records audited. |
| D6-005 | Audit Dorar access and methodology | Done | Methodology and API documentation reviewed; endpoint returned HTTP 403 to automated requests. |
| D6-006 | Define grade and verification architecture | Done | Separate assertions, claim scope, reversible normalization, and workflow separation documented. |
| D6-007 | Approve Day 6 decisions | Done | Finalized by Product Owner on 2026-06-14 in `DAY_06_DECISION_REGISTER.md`. |

## Day 7 Progress

| ID | Task | Status | Evidence |
| --- | --- | --- | --- |
| D7-001 | Reconcile import design with audited source structures | Done | `IMPORT_PROTOTYPE_DESIGN.md` replaced with the source/snapshot/object architecture. |
| D7-002 | Define future landing-zone layout and legacy-path handling | Done | Existing raw paths retained; future versioned acquisition layout specified. |
| D7-003 | Define source registry V2 | Done | `SOURCE_REGISTRY_CONTRACT_V2.md` and V2 manifest template. |
| D7-004 | Define all-domain staging schema | Done | `staging_table_recommendation.md`. |
| D7-005 | Produce PostgreSQL reference DDL | Done | 35 unique tables in `schemas/day7_ingest_staging_reference.sql`; structural checks passed. |
| D7-006 | Define security and approval inheritance | Done | Private ingest/staging schemas and version-specific publication gates documented. |
| D7-007 | Approve Day 7 decisions | Done | Finalized by Product Owner on 2026-06-14 in `DAY_07_DECISION_REGISTER.md`. |
| D8-001 | Build complete raw-object inventory policy/tool | Done | 654,229 non-Git files registered; 163/163 principals matched; deterministic rerun passed. See `hadith/HADITH_RAW_OBJECT_INVENTORY_REPORT.md`. |
| D8-002 | Define executable validation contract | Done | `validation_rules_by_domain.md`; error, warning, and informational acceptance semantics defined. |
| D8-003 | Implement representative all-domain loaders | Done | `scripts/run_day8_import_prototype.py`; seven complete representative source groups loaded. |
| D8-004 | Execute and verify prototype import | Done | 47,360 source records; 41/41 rules passed; SQLite integrity `ok`. |
| D8-005 | Record Day 8 findings and completion evidence | Done | `DAY_08_IMPORT_PROTOTYPE_CHECKLIST.md`, `DAY_08_COMPLETION_NOTE.md`, and CR-058. |
| D8-006 | Review and approve Day 8 decisions | Done | Finalized by Product Owner on 2026-06-14 in `DAY_08_DECISION_REGISTER.md`; Day 9 authorized. |

## Day 9 Progress

| ID | Task | Status | Evidence |
| --- | --- | --- | --- |
| D9-001 | Compare V2 schema with audited source structures | Done | `canonical_schema_recommendation.md` |
| D9-002 | Define canonical identities and domain relationships | Done | Editioned Quran/translation/Hadith and passage-based tafsir model |
| D9-003 | Define provenance and release-state architecture | Done | `content.entity_provenance` and `content.entity_release_states` |
| D9-004 | Produce PostgreSQL reference DDL | Done | 42 tables and 13 indexes in `schemas/day9_canonical_content_reference.sql` |
| D9-005 | Validate reference DDL structure | Done | 42/42 unique tables; 61/61 FK targets resolved; structural checks passed |
| D9-006 | Review and approve Day 9 decisions | Done | Finalized by Product Owner on 2026-06-14; corrected 42-table DDL approved as reference and Day 10 authorized |

## Day 10 Progress

| ID | Task | Status | Evidence |
| --- | --- | --- | --- |
| D10-001 | Review complete sprint evidence | Done | `DAY_10_SPRINT_REVIEW.md` |
| D10-002 | Finalize source decisions | Done | `RESOURCE_DECISION_MATRIX.md` |
| D10-003 | Determine private-build and public-release readiness | Done | `BUILD_READINESS_GO_NO_GO.md` |
| D10-004 | Produce complete private import roadmap | Done | `PRIVATE_PLATFORM_IMPORT_ROADMAP.md` |
| D10-005 | Reconcile trackers and correction register | Done | Completed architecture corrections closed; remaining risks retained |
| D10-006 | Review and approve Day 10 decisions | Done | Finalized by Product Owner on 2026-06-14; sprint closed and next build sprint authorized |

## Status Values

- `Not Started`
- `In Progress`
- `Blocked`
- `Needs Review`
- `Done`

## Daily Standup Questions

1. Which source did we audit yesterday?
2. What did we learn about license, format, IDs, or quality?
3. What is blocked?
4. Which source decision changed?
5. Does the canonical schema need to change?
