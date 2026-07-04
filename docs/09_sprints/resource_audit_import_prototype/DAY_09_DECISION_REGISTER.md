# Day 9 Canonical Schema Decision Register

Sprint: RAFIQ Resource Audit & Import Prototype  
Decision gate: Canonical Content Model Recommendation  
Status: Finalized  
Recommendation date: 2026-06-14  
Decision date: 2026-06-14  
Approver: Product Owner

Subsequent implementation note: CR-060 was resolved on 2026-06-15. The
historical Day 9 execution-gate wording below is retained as approved.

## Final Decisions

| ID | Decision | Final Status |
| --- | --- | --- |
| D9-DEC-001 | Existing V2 content schema | Superseded For Implementation Planning |
| D9-DEC-002 | Canonical boundary | Approved; Separate `content`, Ingest, And Staging |
| D9-DEC-003 | Quran identity | Approved; Stable Ayah Identity With Editioned Text |
| D9-DEC-004 | Translation model | Approved; Editions, Variants, Footnotes, And Chunks |
| D9-DEC-005 | Tafsir model | Approved; Passage-Based Many-To-Many Coverage |
| D9-DEC-006 | Topic/theme model | Approved; Source Taxonomies Separate From RAFIQ Themes |
| D9-DEC-007 | Hadith identity | Approved; Source-Qualified Collections And Editions |
| D9-DEC-008 | Grade/verification model | Approved; Attributed Claims And Reversible Normalization |
| D9-DEC-009 | Provenance/publication | Approved; Record-Level Provenance And Independent Gates |
| D9-DEC-010 | Day 9 DDL | Approved As Reference Only |
| D9-DEC-011 | Public API | Deferred Until Release Rules And Security Review |
| D9-DEC-012 | Day 10 authorization | Approved |

## Decision Basis

The existing V2 content schema conflicts with observed source structures:

- multiple Quran script editions cannot fit one `text_ar`;
- partition boundaries differ by source/layout;
- translations contain four structural variants and separate footnotes;
- tafsir passages may cover multiple ayahs through explicit pointers;
- imported topics are not identical to governed RAFIQ themes;
- QUL ayah themes provide no confidence field;
- Hadith numbering and text identity are source and edition specific;
- a Hadith may have multiple conflicting attributed grades;
- verification classification is distinct from workflow state.

The Day 9 recommendation resolves these conflicts while retaining canonical
queryability, source lineage, private-platform completeness, and separate
public-release governance.

## Verification Boundary

The reference DDL passed static structural checks. It has not been executed
against PostgreSQL or Supabase and must not be applied unchanged as a
production migration.

Implementation approval will still require:

- clean migration generation;
- PostgreSQL execution tests;
- Supabase database advisors;
- exposed-schema and RLS review;
- public view/RPC policy tests;
- canonical promotion and rollback tests.

## Review Finding

The Product Owner review confirmed that the recommendation is consistent with
the audited source structures and Day 8 prototype. During review, the
reference DDL was corrected to include the explicitly recommended
`related_ayahs` and `related_hadiths` tables.

Final static validation:

- 42 unique canonical tables;
- 13 unique indexes;
- 61 foreign-key targets resolved;
- balanced SQL structure;
- no direct grants to `anon` or `authenticated`;
- related Quran and Hadith relationship tables present.

CR-060 remains open because static validation is not equivalent to execution
against PostgreSQL/Supabase.

## Approval Effect

Approval closes Day 9 and authorizes Day 10 sprint review. It approves
the canonical model as the implementation-planning baseline, not deploy or
publicly expose any database object.

## Review Record

- Product Owner decision: Approved
- Decision date: 2026-06-14
- Notes: All twelve Day 9 decisions approved. The corrected 42-table DDL is a
  reference artifact only. CR-060 remains an implementation gate.

## Day 9 Closure

Day 9 is formally closed.

Day 10 may proceed with sprint review, resource go/no-go decisions, the import
roadmap, and build-readiness determination.
