# RAFIQ Graphify Product Development Roadmap - CP26 To Completion

Date: 2026-07-16

Status: Planning baseline

Scope: Long-term RAFIQ product development plan based on the private Graphify, vault, snapshot, retrieval, and reviewer workflow approach.

Public release status: Blocked.

## 1. Purpose

This roadmap defines the long-term product development path from CP26 until RAFIQ reaches private product completion.

The new development approach treats Graphify, vault packs, snapshot exports, graph-aware retrieval, reviewer workflow, and internal product UX as one private product intelligence layer. This layer supports RAFIQ development, validation, review, remediation, and QA. It does not approve public release and does not replace canonical Quran, tafsir, translation, hadith, provenance, release-state, or review tables.

Public release remains blocked until a separate public-release track explicitly passes rights, attribution, editorial, scholar/content, hosted-security, Product Owner, and release-scope gates.

## 2. Current Baseline

The roadmap starts from the current state:

| Track | Current status | Evidence |
| --- | --- | --- |
| CP22 full private resource graph and vault | Complete | `CP22_G10_CLOSE_OUT_REPORT.md` |
| CP23 retrieval and reviewer workflow architecture | Complete | `CP23_A10_CLOSE_OUT_AND_NEXT_SCOPE_DECISION_REPORT.md` |
| CP24 graph-aware retrieval prototype | Complete | `CP24_G09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md` |
| CP25 reviewer workbench action workflow | Complete | `CP25_A09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md` |
| CP26 live snapshot export and refresh | Complete | `CP26_S08_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md` |
| CP27 refresh-backed graph and vault rebuild | Complete | `CP27_G07_COMBINED_VERIFICATION_AND_CLOSE_OUT.md` |
| CP28 retrieval integration from refreshed graph | Complete | `CP28_R07_CLOSE_OUT.md` |
| CP29 retrieval remediation and selected-candidate unlock | Complete | `CP29_R08_COMBINED_VERIFICATION_AND_CLOSE_OUT.md` |

Current private graph/snapshot facts:

| Metric | Count |
| --- | ---: |
| CP22 graph nodes | 79,657 |
| CP22 graph edges | 147,689 |
| CP22 vault artifacts | 158 |
| CP26 source groups | 13 |
| CP26 snapshot artifacts | 13 |
| CP26 unresolved references | 77 |
| CP26 high/critical blockers | 30 |
| Public-safe graph, vault, retrieval, review, audit, and snapshot counts | 0 |

## 3. Product Completion Definition

RAFIQ private product development is complete when:

1. The private content pipeline can refresh source snapshots, graph, vault packs, retrieval artifacts, reviewer state, audit state, and remediation state repeatably.
2. The user-facing private MVP guidance loop works end to end:

```text
check-in -> retrieval -> verification -> guidance package -> reflection -> action completion -> journal/history
```

3. Internal reviewers can inspect evidence, graph paths, vault packs, validation gates, remediation items, audit events, and blocker states without direct file inspection.
4. The product can run in private/internal mode with all available imported content, while rights, attribution, editorial, scholar/content, and Product Owner states remain visible.
5. No private graph, vault, snapshot, reviewer, audit, remediation, or unapproved source artifact is exposed as public-safe by default.
6. Public routes remain blocked or release-filtered and cannot access private snapshot or reviewer artifacts.
7. A single combined private verifier proves graph, vault, snapshot, retrieval, review, UI, API, validation, public-boundary, and no-secret constraints.

## 4. Development Principles

| Principle | Rule |
| --- | --- |
| Canonical source authority | Canonical content tables remain authoritative. Graph/vault/snapshot artifacts are derived private metadata. |
| Private-first development | Build and test against the full private resource graph before any public release decision. |
| Repeatable refresh | Every generated artifact must trace back to a snapshot batch ID, manifest, and checksum ledger. |
| Reviewer visibility | Open blockers, unresolved references, weak grades, missing citations, and public-boundary risks must stay visible. |
| Validation gates | AI guidance cannot bypass intent, source retrieval, Quran, translation, tafsir, hadith, grade, fatwa, safety, personalization, or citation gates. |
| Public release blocked | Public-safe counts remain zero unless a later explicit public-release gate approves an exact scope. |
| No secrets | Snapshot/export/refresh/check scripts must not read or print `.env`, service-role keys, private tokens, or credentials. |

## 5. Long-Term Checkpoint Roadmap

### CP26 - Live Snapshot Export And Refresh

Goal: move from one-off generated artifacts to repeatable private snapshot export and refresh.

| Checkpoint | Purpose | Status |
| --- | --- | --- |
| CP26-S01 | Snapshot architecture and source map | Complete |
| CP26-S02 | Snapshot contracts and manifest schema | Complete |
| CP26-S03 | Private snapshot export prototype | Complete |
| CP26-S04 | Refresh pipeline prototype | Complete |
| CP26-S05 | Checksum, diff, and rollback proof | Complete |
| CP26-S06 | Private API and internal UI status proof | Complete |
| CP26-S07 | Combined verification | Complete |
| CP26-S08 | Close-out and next scope decision | Complete |

Exit gate:

- CP26 combined verifier passes.
- Snapshot refresh produces traceable private graph/retrieval/reviewer inputs.
- Public-safe counts remain zero.
- Public release remains blocked.

### CP27 - Refresh-Backed Graph And Vault Rebuild

Goal: rebuild the CP22 full private graph and vault from CP26 snapshot batches.

| Checkpoint | Purpose | Status |
| --- | --- | --- |
| CP27-G01 | Refresh-backed graph rebuild architecture | Complete |
| CP27-G02 | Snapshot-to-node and snapshot-to-edge mapper | Complete |
| CP27-G03 | Partition and index regeneration from snapshots | Complete |
| CP27-G04 | Vault pack regeneration from refreshed graph | Complete |
| CP27-G05 | Graph/vault diff proof against CP22 baseline | Complete |
| CP27-G06 | Graph/vault internal UI inspection proof | Complete |
| CP27-G07 | Combined verification and close-out | Complete |

Exit gate:

- Refreshed graph and vault match or intentionally supersede CP22 baseline with documented diffs.
- Canonical refs remain separate from graph/vault IDs.
- Public-safe graph and vault counts remain zero.

### CP28 - Retrieval Engine Integration From Refreshed Graph

Goal: make graph-aware retrieval consume refreshed graph/vault/snapshot outputs rather than static CP24 fixtures.

Status: Complete. See `CP28_R07_CLOSE_OUT.md`.

Completed checkpoints:

| Checkpoint | Purpose | Status |
| --- | --- | --- |
| CP28-R01 | Retrieval architecture from refreshed graph/vault | Complete |
| CP28-R02 | Candidate collection from snapshot-backed graph indexes | Complete |
| CP28-R03 | Ranking and explanation using allowed operational signals | Complete |
| CP28-R04 | Evidence route rebuild and validation handoff | Complete |
| CP28-R05 | Retrieval API and private UI integration proof | Complete |
| CP28-R06 | Retrieval regression suite and public-boundary verifier | Complete |
| CP28-R07 | Close-out | Complete |

Exit gate:

- Retrieval can use refreshed graph/vault artifacts.
- Validation handoff is remediation-first and blocker-visible.
- Ranking never implies religious authority.
- Selected candidates and selected route items remain zero while blockers remain.
- Public answer surfaces do not use private graph evidence.

### CP29 - Retrieval Remediation And Selected-Candidate Unlock

Goal: remediate CP27/CP28 blocker families that keep CP28 selected candidates and selected route items at zero, then prove selected-candidate unlock without bypassing validation gates.

Note: this CP29 scope supersedes the earlier planning label `CP29 - Reviewer Workbench Productionization`. Reviewer workbench productionization remains important, but CP28 close-out selected remediation/unlock first because selected candidates are blocked by unresolved references and high/critical blocker state.

Status: Complete. CP29 closed as a private remediation planning and blocked-unlock proof. Selected-candidate unlock remains blocked because no real source repair, quality decision, escalation decision, CP27 regeneration, or CP28 rerun was applied in CP29.

Completed checkpoints:

| Checkpoint | Purpose | Status |
| --- | --- | --- |
| CP29-R01 | Remediation architecture and unlock baseline | Complete |
| CP29-R02 | Reference and provenance repair plan | Complete |
| CP29-R03 | Quality review burn-down plan | Complete |
| CP29-R04 | Escalation lane separation | Complete |
| CP29-R05 | Regeneration and diff proof | Complete |
| CP29-R06 | Selected-candidate unlock verification | Complete |
| CP29-R07 | Private route readiness decision | Complete |
| CP29-R08 | Combined verification and close-out | Complete |

Exit gate:

- CP27 unresolved reference and blocker deltas are visible.
- CP28 selected-candidate unlock is proven only after validation gates allow it.
- Escalation candidates remain separate from ordinary selected-candidate unlock.
- Public-safe candidate and route item counts remain zero.
- CP28 private source route is approved or deferred based on selected route item proof.

### CP30 - Private Guidance Loop Integration

Goal: connect graph-aware retrieval, validation, reviewer state, and guidance generation to the MVP Core loop.

Planned checkpoints:

| Checkpoint | Purpose |
| --- | --- |
| CP30-M01 | Guidance loop architecture from refreshed retrieval |
| CP30-M02 | Check-in to retrieval request mapping |
| CP30-M03 | Evidence package and validation gate integration |
| CP30-M04 | Guidance package response states |
| CP30-M05 | Reflection, action, and journal persistence |
| CP30-M06 | Private guided answer UX proof |
| CP30-M07 | End-to-end private MVP loop verifier |

Exit gate:

- `check-in -> retrieval -> verification -> guidance -> reflection -> action -> journal` works in private/internal mode.
- Validation gates block unsafe or unsupported guidance.
- All religious content displays source labels and private approval state.

### CP31 - Internal Product UX Completion

Goal: make RAFIQ usable as a coherent private product, not only an engineering workbench.

Planned checkpoints:

| Checkpoint | Purpose |
| --- | --- |
| CP31-U01 | Navigation and information architecture reset around private MVP |
| CP31-U02 | Daily check-in and guidance home polish |
| CP31-U03 | Quran, tafsir, translation, and hadith reading polish |
| CP31-U04 | Source trust and attribution UX polish |
| CP31-U05 | Review workbench and graph inspection UX polish |
| CP31-U06 | Mobile responsiveness and accessibility QA |
| CP31-U07 | Product Owner private UX review |

Exit gate:

- Product Owner can test RAFIQ without file/system knowledge.
- Internal mode is visibly labeled.
- Private/public boundaries are obvious in the UI.

### CP32 - Data Quality And Remediation Burn-Down

Goal: reduce unresolved references, high/critical blockers, missing citations, quality warnings, and source gaps.

Planned checkpoints:

| Checkpoint | Purpose |
| --- | --- |
| CP32-Q01 | Quality metric baseline from CP26/CP27/CP28 |
| CP32-Q02 | Missing citation and source gap burn-down |
| CP32-Q03 | Hadith grade and verification conflict review |
| CP32-Q04 | Tafsir and translation quality review |
| CP32-Q05 | Topic/theme mapping review |
| CP32-Q06 | Remediation dashboard and export |
| CP32-Q07 | Quality close-out |

Exit gate:

- Blockers are reduced or explicitly deferred.
- Remaining risks are visible and routed.
- No unresolved item is hidden by scoring or UI polish.

### CP33 - Private Production Architecture Hardening

Goal: harden the private app, API, data, and operations surfaces.

Planned checkpoints:

| Checkpoint | Purpose |
| --- | --- |
| CP33-O01 | Private deployment architecture review |
| CP33-O02 | API boundary and route audit |
| CP33-O03 | Auth, role, and access-control hardening |
| CP33-O04 | Logging, observability, and no-secret audit |
| CP33-O05 | Backup, rollback, and artifact retention |
| CP33-O06 | Performance and payload-size limits |
| CP33-O07 | Operations runbook |

Exit gate:

- Private deployment can be operated safely.
- Private schemas/artifacts are not exposed to public clients.
- Snapshot and graph refresh can be run and rolled back predictably.

### CP34 - Internal QA, UAT, And Regression Suite

Goal: prove private product readiness through repeatable QA and target-device testing.

Planned checkpoints:

| Checkpoint | Purpose |
| --- | --- |
| CP34-T01 | Regression test matrix |
| CP34-T02 | API and artifact verifier suite |
| CP34-T03 | Browser/mobile UI proof |
| CP34-T04 | Target-device UAT pack |
| CP34-T05 | Product Owner private UAT execution |
| CP34-T06 | Defect triage and retest |
| CP34-T07 | Private readiness go/no-go |

Exit gate:

- Private MVP flows pass on target devices.
- Reviewer and graph inspection flows pass.
- Public release remains a separate no-go unless separately approved.

### CP35 - Stakeholder Demo And Internal Adoption Pack

Goal: prepare a private stakeholder demo without public release.

Planned checkpoints:

| Checkpoint | Purpose |
| --- | --- |
| CP35-D01 | Demo scope and risk brief |
| CP35-D02 | Demo dataset and scenario pack |
| CP35-D03 | Reviewer/product owner narrative |
| CP35-D04 | Internal deployment rehearsal |
| CP35-D05 | Feedback capture and action register |
| CP35-D06 | Demo close-out |

Exit gate:

- Demo uses private/internal mode only.
- No public claims are made.
- Feedback routes into CP36 or later product hardening.

### CP36 - Product Completion Hardening

Goal: finish private product gaps discovered during QA and stakeholder review.

Planned checkpoints:

| Checkpoint | Purpose |
| --- | --- |
| CP36-H01 | Defect and polish backlog lock |
| CP36-H02 | Critical UX defects fix pass |
| CP36-H03 | Retrieval and validation defects fix pass |
| CP36-H04 | Reviewer workflow defects fix pass |
| CP36-H05 | Performance and reliability fix pass |
| CP36-H06 | Final private regression |
| CP36-H07 | Private product completion report |

Exit gate:

- Private RAFIQ is stable for internal use.
- Known limitations are documented.
- Public release remains blocked.

### CP37 - Public Release Gate Simulation Only

Goal: simulate what public release would require without approving public release.

Planned checkpoints:

| Checkpoint | Purpose |
| --- | --- |
| CP37-P01 | Public-scope candidate inventory |
| CP37-P02 | Rights and attribution simulation |
| CP37-P03 | Editorial and scholar review simulation |
| CP37-P04 | Public API filter simulation |
| CP37-P05 | Public UI preview simulation |
| CP37-P06 | Public release risk report |
| CP37-P07 | No-go or limited-candidate recommendation |

Exit gate:

- Simulation identifies what could become public later.
- No artifact becomes public-safe.
- Public release remains blocked unless a later separate approval track changes this.

## 6. Completion Milestones

| Milestone | Meaning | Likely CP range |
| --- | --- | --- |
| Private data intelligence complete | Snapshot, graph, vault, retrieval, reviewer, audit, and remediation refresh loops work. | CP26-CP29 |
| Private MVP guidance complete | Core guidance loop works with validation and source display. | CP30 |
| Internal product UX complete | Product Owner can use RAFIQ privately without engineering support. | CP31 |
| Quality and remediation stable | Major blockers are resolved, routed, or explicitly deferred. | CP32 |
| Private operations ready | API, auth, observability, rollback, and no-secret handling are ready. | CP33 |
| Private product ready | UAT/regression pass and private go/no-go accepted. | CP34-CP36 |
| Public-release simulation complete | Public release requirements are known, but still blocked. | CP37 |

## 7. What We Should Build Next

Immediate sequence:

1. Start CP30 private MVP guidance loop integration.
2. Continue CP31 internal product UX completion.
3. Continue CP32 data quality and remediation burn-down.
4. Continue CP31 through CP37 according to the private product readiness gates.

Do not start public release implementation as a release activity. Public-route work may only continue as private/release-filtered simulation, with public release blocked.

## 8. Non-Negotiable Public Release Boundary

Until separately approved:

- public-safe graph nodes: `0`;
- public-safe graph edges: `0`;
- public-safe vault artifacts: `0`;
- public-safe snapshot rows: `0`;
- public-safe retrieval candidates: `0`;
- public-safe route items: `0`;
- public-safe reviewer/audit artifacts: `0`;
- public release approved: `false`.

Any checkpoint that changes one of these values must stop and become a separate Product Owner decision, rights/attribution decision, editorial decision, scholar/content decision, and security decision.

## 9. Recommended Next Action

Start the next major implementation track:

```text
CP30 - Private Guidance Loop Integration
```

Reason: CP29 is complete as private remediation planning and blocked-unlock proof. CP30 should now integrate the private guidance loop while keeping unresolved references, review blockers, escalation separation, and public-release boundaries visible.
