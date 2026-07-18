# CP23 - Retrieval Integration And Reviewer Workflow Sprint Plan

Date: 2026-07-13

Status: CP23 complete; recommended next scope CP24

Owner: RAFIQ retrieval, validation, review, and knowledge graph workstream

## 1. Objective

CP23 turns the completed CP22 private RAFIQ Product Knowledge Graphify and Vault layer into a practical internal architecture for safer retrieval, evidence validation, reviewer workflows, and future public-release preparation.

CP23 does not approve public release. CP23 does not make the graph the canonical content store. CP23 defines how private graph evidence, validation gates, retrieval traces, review queues, and vault packs should work together before new implementation is started.

## 2. CP22 Baseline

CP22 closed on 2026-07-13 with:

- 79,657 graph nodes,
- 147,689 graph edges,
- 11 graph partitions,
- 12 graph indexes,
- 158 vault artifacts,
- 0 public-safe graph nodes,
- 0 public-safe graph edges,
- 0 public-safe vault artifacts,
- private internal UI route `/knowledge-graphify`,
- private API route `/api/private-content/knowledge-graphify/cp22`.

CP22 may now support internal source/provenance inspection, graph and vault QA, retrieval planning, validation evidence tracing, reviewer workflow planning, governance review, and release-boundary analysis.

## 3. Long-Term Sprint Direction After CP22

There is already a broader private platform roadmap in `PRIVATE_PLATFORM_IMPORT_ROADMAP.md`. That roadmap confirms that RAFIQ's private platform and content-dependent workflows are available for internal testing while public release remains blocked behind approval gates.

CP23 is the missing post-CP22 bridge between:

- the completed private platform roadmap,
- the completed CP22 graph/vault intelligence layer,
- practical retrieval integration,
- reviewer workflow execution,
- future public-release gate hardening.

Recommended long-term sequence after CP22:

| Program | Purpose | Public release impact |
| --- | --- | --- |
| CP23 - Retrieval Integration And Reviewer Workflow | Connect CP22 graph evidence to private retrieval, validation, and reviewer planning. | No public release. |
| CP24 - Graph-Aware Retrieval Prototype | Implement bounded private graph-aware retrieval and evidence-route scoring. | No public release. |
| CP25 - Reviewer Workbench And Audit Trail | Implement queues, review actions, remediation records, and vault pack review surfaces. | No public release. |
| CP26 - Live Snapshot Export And Refresh | Move CP22 generated artifacts toward repeatable source-table snapshot exports. | No public release by default. |
| CP27 - Public Release Gate Simulation | Prove public surfaces cannot cite private, blocked, rejected, or unapproved graph evidence. | Public release remains NO-GO unless gates pass. |
| CP28 - Approved Public Study Pack Track | Generate opt-in public-safe graph/vault study artifacts after rights and review approval. | Requires explicit Product Owner approval. |

## 4. Controlling Documents

CP23 must preserve:

- `docs/04_knowledge/RAFIQ_KNOWLEDGE_GRAPHIFY_AND_VAULT_ARCHITECTURE_V1.md`
- `docs/04_knowledge/RAFIQ_KNOWLEDGE_GRAPHIFY_GRAPH_CONTRACT_V1.md`
- `docs/04_knowledge/RAFIQ_KNOWLEDGE_VAULT_ARTIFACT_CONTRACT_V1.md`
- `docs/09_sprints/resource_audit_import_prototype/CP22_G10_CLOSE_OUT_REPORT.md`
- `docs/09_sprints/resource_audit_import_prototype/CP22_FULL_PRIVATE_RESOURCE_GRAPH_ACCEPTANCE_CHECKLIST.md`
- `docs/03_ai_engine/RAFIQ_AI_Validation_Gates_V1.md`
- `docs/07_governance/RAFIQ_Content_Governance_Specification_V1.md`
- `docs/07_governance/RAFIQ_Trust_Authenticity_Framework_V1.md`
- `docs/09_sprints/resource_audit_import_prototype/PRIVATE_PLATFORM_IMPORT_ROADMAP.md`

## 5. Product Boundaries

CP23 must keep these boundaries intact:

1. Canonical content remains in database/source manifests, not graph/vault artifacts.
2. CP22 graph and vault artifacts remain private and derived.
3. Graph-aware retrieval may improve evidence selection, not invent evidence.
4. Reviewer actions may approve, reject, request remediation, or escalate; they must not silently alter source truth.
5. Public release remains blocked until a separate public-release track approves exact sources, nodes, edges, vault artifacts, APIs, and UI surfaces.
6. User personalization may affect relevance, not authenticity.
7. Scholar/content escalation must remain visible when topics require it.

## 6. CP23 Checkpoints

### CP23-A01 - Retrieval Integration And Reviewer Workflow Architecture Plan

Purpose: define the architecture that connects CP22 graph/vault evidence to private retrieval, answer validation, reviewer queues, remediation, and release-boundary decisions.

Deliverables:

- architecture plan,
- retrieval integration flow,
- reviewer workflow model,
- data contract assumptions,
- implementation checkpoints,
- no-code acceptance decision.

### CP23-A02 - Graph-Aware Retrieval Contract

Purpose: define how retrieval requests may use graph partitions, indexes, release states, review states, quality states, and vault pack references.

Deliverables:

- retrieval request contract,
- evidence candidate contract,
- graph expansion rules,
- ranking feature list,
- prohibited inference list,
- verifier requirements.

### CP23-A03 - Evidence Route And Validation Contract

Purpose: define how retrieval traces, evidence routes, guided answers, model adapter runs, and validation runs should cite graph nodes and vault packs.

Deliverables:

- evidence route schema,
- validation-to-graph linkage rules,
- citation coverage requirements,
- escalation outcome mapping,
- validation failure remediation rules.

### CP23-A04 - Reviewer Workflow Contract

Purpose: define queue types, reviewer roles, actions, state transitions, audit trail, and remediation handoff.

Deliverables:

- queue model,
- review action model,
- role permissions,
- state transition table,
- audit event requirements,
- source/provenance display requirements.

### CP23-A05 - Internal UI Workbench Plan

Purpose: design the internal screens needed for retrieval trace review, evidence route inspection, validation failure triage, graph node/vault pack context, and reviewer decisions.

Deliverables:

- screen map,
- primary workflows,
- UI data payload boundaries,
- empty/error/escalation states,
- verification checklist.

### CP23-A06 - Private Prototype Implementation

Purpose: implement the smallest private graph-aware retrieval and review workflow prototype using bounded payloads.

Deliverables:

- private API additions,
- shared contracts,
- internal UI additions,
- prototype verifier,
- no public route exposure.

### CP23-A07 - Reviewer Audit Trail And Remediation Export

Purpose: record review actions, remediation outcomes, and graph/vault links in a durable internal audit artifact.

Deliverables:

- review audit artifact format,
- remediation list export,
- reviewer decision summary,
- verifier for missing audit evidence.

### CP23-A08 - Combined Verification

Purpose: verify CP22 artifacts plus CP23 retrieval/reviewer contracts, prototype payloads, audit outputs, and public/private boundaries.

Deliverables:

- one-command verifier,
- graph/vault inherited checks,
- retrieval contract checks,
- reviewer workflow checks,
- public boundary checks.

### CP23-A09 - Internal UX Proof

Purpose: test the private UI flow end to end with sample retrieval traces, validation outcomes, graph evidence, vault context, and reviewer actions.

Deliverables:

- test script,
- UI proof report,
- screenshot or browser verification notes if UI changed,
- blocked/failed state documentation.

Status: Complete. See `CP23_A09_INTERNAL_UX_PROOF_REPORT.md` and `scripts/check_cp23_internal_ux_proof.mjs`.

### CP23-A10 - Close-Out And Next Scope Decision

Purpose: decide whether to proceed to CP24 graph-aware retrieval implementation, CP25 reviewer workbench implementation, or CP26 live snapshot export expansion.

Deliverables:

- close-out report,
- final checklist,
- known limitations,
- next scope decision.

Status: Complete. See `CP23_A10_CLOSE_OUT_AND_NEXT_SCOPE_DECISION_REPORT.md` and `scripts/check_cp23_close_out.mjs`.

## 7. Acceptance Gates

CP23 cannot be considered complete unless:

- CP22 verifier remains passing,
- all CP23 retrieval outputs preserve source/provenance/release metadata,
- graph expansion never converts candidate relationships into religious authority,
- reviewer actions are auditable,
- scholar/content escalation remains explicit,
- public-safe counts remain zero unless a separate public-release approval exists,
- internal UI uses bounded/private payloads,
- no `.env` files or secrets are read or printed.

## 8. Initial Recommendation

Start with CP23-A01, then proceed to CP23-A02 and CP23-A04 before implementation.

Reason: retrieval and reviewer workflows are coupled. Retrieval decides what evidence appears; reviewers decide what evidence is safe, weak, blocked, remediated, or escalated. Building either side without a shared contract risks producing internal screens that look useful but cannot support governance.
