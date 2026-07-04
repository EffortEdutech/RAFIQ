# Day 1 Checklist: Sprint Setup & Source Shortlist

Sprint: RAFIQ Resource Audit & Import Prototype
Day: 1
Status: Complete
Date started: 2026-06-09
Date completed: 2026-06-10

## Day 1 Objective

Set up the audit sprint so RAFIQ can systematically evaluate content resources before import. By the end of Day 1, we should know which source groups will be audited first, what files will track progress, what evidence is required, and what counts as "done" for each audit.

## Day 1 Deliverables

| Deliverable | Target File | Status |
| --- | --- | --- |
| Sprint tracking board reviewed and expanded | `EXECUTION_BOARD.md` | Done |
| P0/P1 source shortlist confirmed | `SOURCE_SHORTLIST.md` | Done |
| Audit batches defined | `AUDIT_BATCH_PLAN.md` | Done |
| Audit folder prepared | `audits/` | Done |
| Audit evidence rules confirmed | `RESOURCE_AUDIT_METHOD.md` | Done |
| Source/licensing register linked to sprint | `../../04_knowledge/RAFIQ_Source_Licensing_Register_V1.md` | Done |
| Day 1 completion note prepared | `DAY_01_COMPLETION_NOTE.md` | Drafted |

## Checklist

### 1. Sprint Control Setup

| ID | Task | Status | Acceptance Criteria | Output |
| --- | --- | --- | --- | --- |
| D1-001 | Confirm sprint objective | Done | Objective matches resource-first architecture decision. | This checklist. |
| D1-002 | Confirm sprint duration | Done | 10 working days accepted as default. | `SPRINT_PLAN.md` |
| D1-003 | Confirm sprint tracker | Done | Every task has ID, workstream, priority, status, owner, notes. | `EXECUTION_BOARD.md` |
| D1-004 | Confirm status values | Done | Status values are standardized. | `EXECUTION_BOARD.md` |

### 2. Source Shortlist Setup

| ID | Task | Status | Acceptance Criteria | Output |
| --- | --- | --- | --- | --- |
| D1-005 | Define P0 source groups | Done | Quran text, metadata, translations, topics, ayah themes are listed. | `SOURCE_SHORTLIST.md` |
| D1-006 | Define P1 source groups | Done | Tafsir, hadith collections, hadith grades/verifications are listed. | `SOURCE_SHORTLIST.md` |
| D1-007 | Define deferred source groups | Done | Audio, morphology, grammar, mushaf layouts are deferred unless needed. | `SOURCE_SHORTLIST.md` |
| D1-008 | Map source groups to sprint days | Done | Each P0/P1 group has planned audit day. | `AUDIT_BATCH_PLAN.md` |

### 3. Audit Evidence Setup

| ID | Task | Status | Acceptance Criteria | Output |
| --- | --- | --- | --- | --- |
| D1-009 | Confirm evidence required for every source | Done | URL, license, format, sample record, IDs, attribution, risks required. | `RESOURCE_AUDIT_METHOD.md` |
| D1-010 | Confirm source audit template | Done | Template covers identity, license, access, structure, risks, decision. | `templates/SOURCE_AUDIT_TEMPLATE.md` |
| D1-011 | Confirm source manifest template | Done | Manifest captures source metadata and checksum fields. | `templates/SOURCE_MANIFEST_TEMPLATE.json` |
| D1-012 | Confirm validation report template | Done | Template captures counts, errors, warnings, recommendations. | `templates/IMPORT_VALIDATION_REPORT_TEMPLATE.md` |

### 4. Import Prototype Setup

| ID | Task | Status | Acceptance Criteria | Output |
| --- | --- | --- | --- | --- |
| D1-013 | Confirm raw landing-zone principle | Done | Raw resources are stored unchanged. | `IMPORT_PROTOTYPE_DESIGN.md` |
| D1-014 | Confirm staging-before-canonical rule | Done | Prototype imports go to staging tables first. | `IMPORT_PROTOTYPE_DESIGN.md` |
| D1-015 | Confirm no production import rule | Done | No source enters production until license/content approval. | `IMPORT_PROTOTYPE_DESIGN.md` |

### 5. Monitoring Setup

| ID | Task | Status | Acceptance Criteria | Output |
| --- | --- | --- | --- | --- |
| D1-016 | Add Day 1 tasks to execution board | Done | Day 1 tasks are visible with RAIP/D1 mapping. | `EXECUTION_BOARD.md` |
| D1-017 | Add open Day 1 decisions | Done | Open choices are visible and not buried in prose. | `DAY_01_OPEN_DECISIONS.md` |
| D1-018 | Prepare Day 1 completion note | Done | Completion note can summarize done/open/blockers. | `DAY_01_COMPLETION_NOTE.md` |

## Day 1 Open Decisions

These should be decided or explicitly marked as pending:

| Decision | Recommendation | Status |
| --- | --- | --- |
| Launch language order | English + Malay audit first, Indonesian as P2/P1 depending source readiness. | Pending |
| Quran text source | Audit QUL and Tanzil together before deciding canonical source. | Pending |
| Hadith source priority | Audit source/provenance before choosing hadith-json/API source. | Pending |
| Production data storage | Raw resources should not be committed to repo unless small and license allows. | Pending |
| Sprint owner names | Use `TBD` until actual team assignments are known. | Pending |

## Day 1 Done Criteria

Day 1 is complete when:

- `SOURCE_SHORTLIST.md` exists.
- `AUDIT_BATCH_PLAN.md` exists.
- `EXECUTION_BOARD.md` includes Day 1 setup tasks.
- All P0/P1 source groups have an audit day.
- Audit templates are confirmed.
- Open decisions are recorded.
- Day 1 completion note exists.
