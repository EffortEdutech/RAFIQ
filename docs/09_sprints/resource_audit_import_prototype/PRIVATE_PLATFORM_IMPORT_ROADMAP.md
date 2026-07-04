# Complete Private Platform Import Roadmap

Status: Approved For Next Sprint  
Roadmap date: 2026-06-14
Approval date: 2026-06-14

## Objective

Build RAFIQ as a complete private platform using every technically usable
resource, while source approval proceeds in parallel. Public release remains
a separate promotion decision.

## Phase 1: Database Implementation Foundation

Status: Complete on 2026-06-15. Evidence is recorded in
`CR_060_MIGRATION_EXECUTION_REPORT.md`.

Deliver:

- executable Supabase/PostgreSQL migrations for `ingest`, `staging`, and
  `content`;
- source registry, snapshots, raw objects, runs, findings, transformations,
  lineage, provenance, and release state;
- private schema grants and service-role importer access;
- migration rollback and repeatability tests.

Exit gate:

- CR-060 resolved;
- database advisors reviewed;
- no client access to private schemas;
- migrations apply and roll back in a clean environment.

## Phase 2: Complete Source Registry And Raw Registration

Status: Complete on 2026-06-16. Evidence is recorded in
`PHASE_02_SOURCE_REGISTRY_COMPLETION_REPORT.md`.

Deliver:

- migrate all V1 manifests to Source Registry V2;
- register Quran, translation, tafsir, topic, theme, and all Hadith snapshots;
- retain all 654,229 Hadith raw-object records and aggregate digests;
- record rights, attribution, content, and publication states independently.

Exit gate:

- every principal parser input has snapshot, object, checksum, and parser
  assignment;
- no raw object is modified.

## Phase 3: Production-Grade Source Loaders

Status: Complete on 2026-06-17. Checkpoint 01 completed on 2026-06-16; see
`PHASE_03_LOADER_CHECKPOINT_01_REPORT.md`. Checkpoint 02 completed on
2026-06-16; see `PHASE_03_LOADER_CHECKPOINT_02_REPORT.md`. Checkpoint 03
completed on 2026-06-16; see `PHASE_03_LOADER_CHECKPOINT_03_REPORT.md`.
Checkpoint 04 completed on 2026-06-17; see
`PHASE_03_LOADER_CHECKPOINT_04_REPORT.md`. Final completion evidence is
recorded in `PHASE_03_COMPLETION_REPORT.md`.

Deliver:

- convert the Day 8 representative runner into modular idempotent loaders;
- load every validated Quran and metadata edition;
- load all translation variants and languages;
- load every audited tafsir, topic, and ayah-theme source;
- load all technically usable Hadith collections, editions, grades,
  verification records, and research annotations;
- preserve malformed and blank records with findings.

Exit gate:

- repeatable imports;
- domain count, key, reference, language, encoding, and duplicate rules pass;
- rejected records are explicit and reproducible.

## Phase 4: Canonical Promotion

Status: Complete on 2026-06-17. Evidence is recorded in
`PHASE_04_COMPLETION_REPORT.md`; executable verification is in
`scripts/verify_phase4_final.sql`.

Deliver:

- canonical Quran identities;
- editioned Quran, translation, and tafsir content;
- source taxonomies and governed RAFIQ theme mappings;
- source-qualified Hadith collection and edition records;
- attributed grade and verification claims;
- complete entity provenance and private release states.

Exit gate:

- canonical records trace to every parent staging record;
- source replacement does not change stable Quran identity;
- no automatic cross-source Hadith merge by number or hash alone.

## Phase 5: Private Retrieval And Product Integration

Status: Complete on 2026-06-19. Checkpoint 01 completed on 2026-06-17; see
`PHASE_05_PRIVATE_RETRIEVAL_CHECKPOINT_01_REPORT.md`. Checkpoint 02
completed on 2026-06-18; see
`PHASE_05_PRIVATE_BRIDGE_CHECKPOINT_02_REPORT.md`. Checkpoint 03 completed on
2026-06-18; see `PHASE_05_APP_SCAFFOLD_CHECKPOINT_03_REPORT.md`. Checkpoint
04 completed on 2026-06-18; see
`PHASE_05_RUNTIME_CHECKPOINT_04_REPORT.md`. Checkpoint 05 completed on
2026-06-18; see `PHASE_05_API_HARDENING_CHECKPOINT_05_REPORT.md`.
Checkpoint 06 completed on 2026-06-18; see
`PHASE_05_PRIVATE_PRODUCT_WORKFLOWS_CHECKPOINT_06_REPORT.md`. Checkpoint 07
completed on 2026-06-18; see
`PHASE_05_PRIVATE_SEARCH_CHECKPOINT_07_REPORT.md`.
Checkpoint 08 completed on 2026-06-18; see
`PHASE_05_INDEXED_SEARCH_CHECKPOINT_08_REPORT.md`. Checkpoint 09 completed
on 2026-06-18; see
`PHASE_05_REVIEW_QUEUES_CHECKPOINT_09_REPORT.md`. Checkpoint 10 completed
on 2026-06-19; see
`PHASE_05_ANSWER_GUARDRAILS_CHECKPOINT_10_REPORT.md`. Checkpoint 11
completed on 2026-06-19; see
`PHASE_05_GUIDED_ANSWER_CHECKPOINT_11_REPORT.md`. Checkpoint 12 completed
on 2026-06-19; see
`PHASE_05_MODEL_ADAPTER_CHECKPOINT_12_REPORT.md`. Checkpoint 13 completed
on 2026-06-19; see
`PHASE_05_ANSWER_VALIDATION_CHECKPOINT_13_REPORT.md`. Checkpoint 14
completed on 2026-06-19; see
`PHASE_05_SOURCE_DETAIL_CHECKPOINT_14_REPORT.md`. Checkpoint 15 completed on
2026-06-19; see
`PHASE_05_PRIVATE_PRODUCT_ACCEPTANCE_CHECKPOINT_15_REPORT.md`.

Deliver:

- private content APIs and server-side query layer;
- Quran, translation, tafsir, topic/theme, and Hadith screens;
- search, retrieval, embeddings, relationship exploration, and AI/RAG;
- persistent `UNAPPROVED CONTENT - NOT FOR PUBLICATION` labeling;
- internal review queues and attribution display components.

Exit gate:

- complete content-dependent workflows pass end to end;
- all validated content is enabled in private mode;
- no unapproved content is reachable through a public deployment path.

## Phase 6: Approval And Public Promotion

Status: Design Complete / Public Release NO-GO on 2026-06-20. Checkpoint 01 completed on 2026-06-19; see
`PHASE_06_PUBLIC_PROMOTION_DESIGN_CHECKPOINT_01_REPORT.md`. Checkpoint 02
completed on 2026-06-19; see
`PHASE_06_PUBLIC_SEARCH_CHECKPOINT_02_REPORT.md`. Checkpoint 03 completed on
2026-06-19; see
`PHASE_06_PUBLIC_ANSWER_RETRIEVAL_CHECKPOINT_03_REPORT.md`. Checkpoint 04
completed on 2026-06-19; see `PHASE_06_PUBLIC_SCOPE_CHECKPOINT_04_REPORT.md`
and `PHASE_06_PRODUCT_OWNER_PUBLIC_SCOPE_CHECKPOINT_04.md`. Checkpoint 05
completed on 2026-06-19; see
`PHASE_06_PUBLIC_ATTRIBUTION_ROLLBACK_CHECKPOINT_05_REPORT.md`. Checkpoint 06
completed on 2026-06-20; see
`PHASE_06_APPROVED_FIXTURE_CONTENT_CHECKPOINT_06_REPORT.md`. Checkpoint 07
completed on 2026-06-20; see
`PHASE_06_PUBLIC_READ_ONLY_UX_CHECKPOINT_07_REPORT.md`. Checkpoint 08
completed on 2026-06-20; see
`PHASE_06_PUBLIC_SECURITY_ACCESS_CHECKPOINT_08_REPORT.md`. Checkpoint 09
completed on 2026-06-20; see
`PHASE_06_GO_NO_GO_DECISION_REGISTER.md` and
`PHASE_06_GO_NO_GO_CHECKPOINT_09_REPORT.md`. Phase 6 design is GO; public
release remains NO-GO until release approval gates pass.

Run in parallel with continued approval work:

- complete source permission and attribution packs;
- acquire authorized Sunnah.com, SemakHadis, Dorar, HadeethEnc, and
  IslamHouse exports where available;
- perform editorial and scholar/content review;
- approve public display policies and derived summaries;
- create release-filtered `public_api` views/RPCs;
- test public/private deployment-mode separation.

Exit gate:

- every publicly exposed source version passes all release dimensions;
- public API and public AI retrieval exclude pending content;
- Product Owner authorizes the exact public scope.

## Completed Public UI/UX Sprint

Name: `RAFIQ Public UI/UX Implementation Sprint`

Sprint control documents:

- `RAFIQ_PUBLIC_UI_UX_IMPLEMENTATION_SPRINT_PLAN.md`
- `RAFIQ_PUBLIC_UI_UX_IMPLEMENTATION_CHECKLIST.md`
- `RAFIQ_PUBLIC_UI_UX_IMPLEMENTATION_DECISION_REGISTER.md`
- `RAFIQ_PUBLIC_UI_UX_CP01_PRODUCT_EXPERIENCE_BRIEF.md`
- `RAFIQ_PUBLIC_UI_UX_CP02_VISUAL_DESIGN_SYSTEM.md`
- `RAFIQ_PUBLIC_UI_UX_CP02_VISUAL_DESIGN_SYSTEM.json`
- `RAFIQ_PUBLIC_UI_UX_CP03_PUBLIC_APP_SHELL_REPORT.md`
- `RAFIQ_PUBLIC_UI_UX_CP04_PUBLIC_LANDING_PAGE_REPORT.md`
- `RAFIQ_PUBLIC_UI_UX_CP05_PUBLIC_SEARCH_UX_REPORT.md`
- `RAFIQ_PUBLIC_UI_UX_CP06_PUBLIC_GUIDED_ANSWER_UX_REPORT.md`
- `RAFIQ_PUBLIC_UI_UX_CP07_PUBLIC_SOURCE_DETAIL_UX_REPORT.md`
- `RAFIQ_PUBLIC_UI_UX_CP08_QURAN_HADITH_PREVIEW_SURFACES_REPORT.md`
- `RAFIQ_PUBLIC_UI_UX_CP09_RESPONSIVE_ACCESSIBILITY_BROWSER_QA_REPORT.md`
- `RAFIQ_PUBLIC_UI_UX_CP10_SPRINT_REVIEW_REPORT.md`
- `RAFIQ_PUBLIC_UI_UX_CP10_GO_NO_GO_DECISION_REGISTER.md`

Priority order:

1. prepare private stakeholder demo and Product Owner review workflow;
2. continue source rights, attribution, editorial, scholar/content, and Product Owner public-scope approval;
3. harden hosted-public deployment controls, release filters, indexing policy, rate limits, and rollback operations before any public release.

## Deferred Sprint

Name: `RAFIQ Stakeholder Demo, Approval Workflow, and Public-Readiness Hardening`

Sprint control documents:

- `RAFIQ_STAKEHOLDER_DEMO_APPROVAL_PUBLIC_READINESS_SPRINT_PLAN.md`
- `RAFIQ_STAKEHOLDER_DEMO_APPROVAL_PUBLIC_READINESS_CHECKLIST.md`
- `RAFIQ_STAKEHOLDER_DEMO_APPROVAL_PUBLIC_READINESS_DECISION_REGISTER.md`
- `RAFIQ_STAKEHOLDER_DEMO_APPROVAL_PUBLIC_READINESS_CP01_DEMO_READINESS_BRIEF.md`

Status: Deferred by Product Owner on 2026-06-25.

Reason: RAFIQ must first reach deployment-grade product polish. Stakeholder demo and approval workflow work will resume after the product delivery experience is strong enough.

## Active Next Sprint

Name: `RAFIQ Deployment-Grade Product Polish`

Sprint control documents:

- `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_SPRINT_PLAN.md`
- `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_CHECKLIST.md`
- `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_DECISION_REGISTER.md`
- `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_CP01_REPORT.md`
- `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_CP02_VISUAL_SYSTEM_REPORT.md`
- `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_CP03_NAVIGATION_IA_REPORT.md`
- `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_CP04_SEARCH_EXPERIENCE_REPORT.md`
- `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_CP05_GUIDED_ANSWER_EXPERIENCE_REPORT.md`
- `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_CP06_QURAN_HADITH_READING_EXPERIENCE_REPORT.md`
- `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_CP07_SOURCE_TRUST_ATTRIBUTION_REPORT.md`
- `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_CP07_5_DREAM_UX_RECOVERY_REPORT.md`
- `RAFIQ_DEPLOYMENT_GRADE_PRODUCT_POLISH_CP07_6_SIGNATURE_EXPERIENCE_REPORT.md`

Current next checkpoint: Product Owner visual review of CP07.6. CP08 - Deployment Readiness QA remains blocked until that review is accepted.

Remaining Phase 5 checkpoint estimate after Checkpoint 15: `0`.

The private RAFIQ product is available for internal testing against canonical
content.

Delivery status clarification on 2026-06-25: the development team must receive
a fully running RAFIQ with all available imported content in private/internal
mode regardless of approval status. Rights, attribution, editorial,
scholar/content, and Product Owner approval statuses remain visible as metadata
and review signals, but they must not remove content from private development,
private search, private reading, guided answer testing, or internal QA.

Public implementation work may proceed behind release filters, but public
release remains blocked until rights, attribution, editorial, scholar/content,
hosted-security, and Product Owner approvals are complete.
