# CP22 - Full Private RAFIQ Resource Graph Implementation Sprint Plan

Date: 2026-07-11

Status: Draft for implementation planning

Owner: RAFIQ knowledge graph and vault workstream

## 1. Objective

CP22 implements the full private RAFIQ resource graph beyond the CP21C prototype.

The goal is to generate, verify, and inspect a private product knowledge graph covering RAFIQ's Islamic resource corpus, including Quran, translations, tafsir, hadith, source provenance, licensing state, review state, validation evidence, quality findings, release boundaries, and internal vault artifacts.

This is not the same thing as:

- the developer Graphify project graph in `graphify-out/graph.json`,
- the CP21C validation-case graph,
- a public content graph,
- a direct public search index,
- a replacement for canonical Supabase/Postgres content tables.

CP22 is a private internal product resource graph and vault layer that RAFIQ can use for inspection, evidence tracing, content QA, retrieval planning, validation analysis, and governance review.

## 2. Size Assessment

This is a large multi-sprint implementation.

CP21C proved the pattern with a deliberately small validation-case graph:

- 23 cases,
- 253 graph nodes,
- 292 graph edges,
- 23 vault packs,
- 0 public-safe graph artifacts.

The full private RAFIQ resource graph may grow to hundreds of thousands of nodes and edges depending on final import coverage, tafsir granularity, hadith text versions, grade assertions, translation editions, themes, quality findings, and review states.

Approximate effort:

| Area | Rough effort | Notes |
| --- | ---: | --- |
| Inventory and schema mapping | 2-4 days | Depends on current Supabase table completeness and import status. |
| Graph schema and partition design | 1-2 days | Must avoid unstable monolithic JSON exports. |
| Source/provenance/release export | 2-4 days | Governance-critical. |
| Quran, translation, tafsir export | 4-7 days | Needs ayah-level and source-level consistency checks. |
| Hadith, grading, verification export | 5-10 days | More complex due to collection structure, grading provenance, and variant handling. |
| Vault pack generation | 4-7 days | Must stay private and traceable. |
| Internal UI expansion | 4-8 days | Explorer, filters, evidence detail, vault viewer, boundary warnings. |
| Verifiers and performance gates | 3-6 days | Must include scale, partition, schema, and public boundary checks. |
| Close-out docs and handoff | 1-2 days | Required before expanding into product retrieval flows. |

Expected total:

- focused implementation: roughly 2-3 weeks if canonical data tables are already stable,
- realistic single-agent/product iteration: roughly 4-8 weeks,
- longer if import coverage, licensing decisions, or hadith grading model are still unsettled.

## 3. Controlling Documents

CP22 must follow and preserve these existing documents:

- `docs/04_knowledge/RAFIQ_KNOWLEDGE_GRAPHIFY_AND_VAULT_ARCHITECTURE_V1.md`
- `docs/04_knowledge/RAFIQ_KNOWLEDGE_GRAPHIFY_GRAPH_CONTRACT_V1.md`
- `docs/04_knowledge/RAFIQ_KNOWLEDGE_VAULT_ARTIFACT_CONTRACT_V1.md`
- `docs/09_sprints/resource_audit_import_prototype/CP21C_RESOURCE_GRAPHIFY_IMPLEMENTATION_SPRINT_PLAN.md`
- `docs/09_sprints/resource_audit_import_prototype/CP21C_RESOURCE_GRAPHIFY_ACCEPTANCE_CHECKLIST.md`
- `docs/09_sprints/resource_audit_import_prototype/CP21C_R01_RANKING_REMEDIATION_REPORT.md`
- `docs/09_sprints/resource_audit_import_prototype/CP21C_PRIVATE_GRAPHIFY_UI_TEST_REPORT.md`
- `docs/07_governance/RAFIQ_Trust_Authenticity_Framework_V1.md`
- `docs/07_governance/RAFIQ_Content_Governance_Specification_V1.md`
- `docs/04_knowledge/RAFIQ_Source_Licensing_Register_V1.md`
- `docs/03_ai_engine/RAFIQ_AI_Validation_Gates_V1.md`

## 4. Product Boundary

CP22 must keep the following boundaries clear:

1. Canonical source of truth remains the database and source manifests.
2. The graph export is derived, rebuildable, and private.
3. Vault packs are private internal review artifacts.
4. Public-safe metadata is opt-in only and must default to false.
5. Quran, hadith, tafsir, and guidance content must preserve provenance.
6. Validation evidence must not be presented as religious authority by itself.
7. Escalation, uncertainty, and scholar-review boundaries must remain visible.
8. Developer Graphify and RAFIQ Product Knowledge Graphify must remain separate systems.

## 5. Implementation Strategy

Use a partitioned private graph instead of a single monolithic export.

Proposed private artifact layout:

```text
data/graphify/full-private/
  manifest.json
  summary.json
  partitions/
    sources.json
    quran.json
    translations.json
    tafsir.json
    hadith.json
    grades.json
    topics.json
    governance.json
    validation.json
    quality.json
  indexes/
    by-node-id.json
    by-source-id.json
    by-ayah-key.json
    by-hadith-key.json
    by-topic.json
    public-boundary.json

data/vault/full-private/
  manifest.json
  sources/
  quran/
  tafsir/
  hadith/
  topics/
  governance/
  validation/
  quality/
```

Proposed scripts:

```text
scripts/generate_full_private_resource_graph.mjs
scripts/check_full_private_resource_graph.mjs
scripts/generate_full_private_vault_packs.mjs
scripts/check_full_private_vault_packs.mjs
scripts/check_full_private_knowledge_graphify.mjs
```

Implementation should start with read-only export from existing canonical data. Mutating import pipelines should remain separate unless explicitly approved.

## 6. Data Domains

CP22 should support these graph domains:

| Domain | Example node types | Example edge types |
| --- | --- | --- |
| Source registry | source, license, provider, snapshot | governed_by, imported_from, licensed_as |
| Quran | surah, ayah, quran_text_version | contains, has_text_version, references |
| Translation | translation_edition, translated_ayah, translator | translates, authored_by, edition_of |
| Tafsir | tafsir_source, tafsir_passage, tafsir_ayah_link | explains, authored_by, cites |
| Hadith | collection, book, chapter, hadith, hadith_text_version | contains, has_text_version, cross_references |
| Grading | grade_assertion, grader, methodology | grades, asserted_by, follows_method |
| Topics | topic, theme, concept, evidence_bundle | tagged_with, supports_topic, contrasts_with |
| Governance | review_state, release_state, escalation_state | requires_review, blocked_by, approved_for |
| Validation | validation_case, validation_gate, evidence_route | checked_by, uses_evidence, escalates_to |
| Quality | issue, remediation, checksum, completeness_metric | flags, remediated_by, verifies |

## 7. Checkpoints

### CP22-G01 - Inventory And Source Table Map

Purpose: identify the exact canonical tables, manifests, and files that can feed the full private graph.

Deliverables:

- resource inventory document,
- table/file-to-node mapping,
- table/file-to-edge mapping,
- data availability report,
- blocked source list,
- licensing and release-state assumptions.

Acceptance focus:

- no guessed data sources,
- no `.env` access,
- every graph domain has an explicit source owner,
- missing data is documented as blocked, not silently skipped.

### CP22-G02 - Graph Schema Expansion And Partition Plan

Purpose: extend the current graph contract for large private resource exports.

Deliverables:

- node type list,
- edge type list,
- required metadata fields,
- partition naming rules,
- ID conventions,
- private/public boundary fields,
- version and checksum rules.

Acceptance focus:

- stable IDs,
- partition-safe references,
- no public-safe default leakage,
- all nodes have provenance and source pointers where applicable.

### CP22-G03 - Source, Provenance, And Release Export

Purpose: export the governance backbone before exporting content.

Deliverables:

- source registry graph partition,
- license/release-state graph partition,
- source snapshot nodes,
- provider/source ownership edges,
- verifier for missing source attribution.

Acceptance focus:

- no content node can exist without traceable source governance,
- release state is visible,
- private status is explicit.

### CP22-G04 - Quran, Translation, Tafsir, And Topic Export

Purpose: export ayah-level resource graph data and explanatory links.

Deliverables:

- Quran partition,
- translation partition,
- tafsir partition,
- topic/theme partition,
- ayah and source indexes,
- completeness summary.

Acceptance focus:

- ayah keys are stable,
- translations are separated by edition/source,
- tafsir does not collapse into translation,
- topics are treated as internal metadata, not authoritative interpretation.

### CP22-G05 - Hadith, Grade, Verification, And Quality Export

Purpose: export hadith corpus graph data with grading and verification boundaries.

Deliverables:

- hadith collection/book/chapter/hadith partitions,
- text-version nodes,
- grade assertion nodes,
- grader/methodology source links,
- quality issue/remediation nodes,
- verification boundary report.

Acceptance focus:

- grade assertions keep source and methodology context,
- weak/disputed/escalation states are explicit,
- variant texts do not overwrite each other,
- collection structure remains navigable.

### CP22-G06 - Guidance Evidence And Validation Link Export

Purpose: connect product validation and retrieval evidence to the resource graph without turning it into public guidance.

Deliverables:

- validation evidence partition,
- evidence route nodes,
- gate result nodes,
- escalation outcome nodes,
- connections to Quran, tafsir, hadith, and source nodes.

Acceptance focus:

- evidence routes are inspectable,
- escalation boundaries are preserved,
- validation output remains private unless explicitly approved.

### CP22-G07 - Full Private Vault Pack Generation

Purpose: generate private Obsidian-compatible review packs from graph partitions.

Deliverables:

- vault manifest,
- source packs,
- ayah packs,
- tafsir packs,
- hadith packs,
- topic packs,
- governance packs,
- validation packs,
- quality packs,
- vault verifier.

Acceptance focus:

- packs cite graph node IDs and canonical source IDs,
- packs are private by default,
- generated files include warnings when not public-safe,
- no pack becomes the canonical source of truth.

### CP22-G08 - Internal Graph And Vault UI Upgrade

Purpose: make the private graph inspectable inside RAFIQ.

Deliverables:

- graph explorer view,
- partition selector,
- node detail panel,
- edge detail panel,
- source/provenance panel,
- ayah/hadith/topic lookup,
- vault pack preview,
- quality and release-state filters,
- private/public boundary warnings.

Acceptance focus:

- internal-only route remains protected,
- large graph summaries render without loading every node,
- selected details are traceable to artifacts,
- no public-safe claims are implied.

### CP22-G09 - One-Command Verification And Performance Gates

Purpose: provide one command to verify the full private graph, vault packs, governance boundaries, indexes, and UI data contracts.

Deliverables:

- combined verifier,
- schema checks,
- partition reference checks,
- source attribution checks,
- public boundary checks,
- index consistency checks,
- performance summary,
- graph size report.

Acceptance focus:

- verifier fails on missing provenance,
- verifier fails on invalid public-safe metadata,
- verifier fails on broken cross-partition references,
- verifier reports counts by domain and risk category.

### CP22-G10 - Close-Out And Next Scope Decision

Purpose: decide whether the graph is ready for broader internal use, retrieval integration, reviewer workflows, or import expansion.

Deliverables:

- close-out report,
- final checklist,
- implementation notes,
- known limitations,
- next recommended checkpoints,
- handoff instructions.

Acceptance focus:

- documented status is current,
- no one mistakes CP22 artifacts for public release artifacts,
- next work is clearly separated from completed work.

## 8. Sprint Sequence

Recommended execution order:

1. CP22-G01 - Inventory and source table map.
2. CP22-G02 - Graph schema expansion and partition plan.
3. CP22-G03 - Source, provenance, and release export.
4. CP22-G04 - Quran, translation, tafsir, and topic export.
5. CP22-G05 - Hadith, grade, verification, and quality export.
6. CP22-G06 - Guidance evidence and validation link export.
7. CP22-G07 - Full private vault pack generation.
8. CP22-G08 - Internal graph and vault UI upgrade.
9. CP22-G09 - One-command verification and performance gates.
10. CP22-G10 - Close-out and next scope decision.

Do not start content-heavy export work before CP22-G01 and CP22-G02 are complete.

## 9. Verification Plan

Each checkpoint should run the narrowest relevant checks.

Minimum final verification target:

```powershell
corepack pnpm build:shared
corepack pnpm build:api
corepack pnpm build:mobile:web
node scripts\check_full_private_knowledge_graphify.mjs
```

If the internal UI changes:

- run the RAFIQ local app,
- verify `/knowledge-graphify`,
- capture at least one browser screenshot or UI test proof,
- confirm the route remains internal/private.

If code structure changes:

```powershell
.\scripts\graphify.ps1 update .
```

## 10. Governance Gates

CP22 cannot be considered complete unless:

- all generated graph artifacts are private by default,
- all vault packs are private by default,
- public-safe node count is either zero or explicitly justified by a separate public release plan,
- every Islamic content node has source/provenance metadata,
- uncertain, weak, disputed, or escalation states are visible,
- generated artifacts do not bypass validation gates,
- licensing state is available for content-bearing nodes,
- internal inspection does not present generated metadata as religious authority.

## 11. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Monolithic graph becomes too large | UI and verifier may fail | Use partitions and indexes from the start. |
| Missing source attribution | Governance failure | Source/provenance export must run before content export. |
| Hadith grade oversimplification | Religious authenticity risk | Model grade assertions with sources and methodology. |
| Tafsir and translation conflation | Meaning distortion | Keep translations and tafsir as distinct node types. |
| Private data appears public-safe | Product safety failure | Default all artifacts to private and verify boundary metadata. |
| Vault becomes treated as canonical | Data integrity risk | Vault packs must point back to canonical IDs and graph IDs. |
| UI loads too much data | Poor internal usability | UI must use summaries, filters, and selected detail loading. |

## 12. Initial Recommendation

Start CP22 with two documentation-first checkpoints:

1. CP22-G01 - Inventory and Source Table Map.
2. CP22-G02 - Graph Schema Expansion and Partition Plan.

Only after those are complete should implementation begin on source/provenance export. This keeps the full graph grounded in real RAFIQ data instead of imagined structure.

