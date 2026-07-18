# CP23-A01 - Retrieval Integration And Reviewer Workflow Architecture Plan

Date: 2026-07-13

Status: Complete

Scope: Architecture plan for connecting CP22 private graph/vault artifacts to RAFIQ retrieval, answer validation, reviewer workflows, remediation, and future release gates.

## 1. Architecture Decision

RAFIQ will use CP22 Product Knowledge Graphify and Vault artifacts as a private derived intelligence layer for retrieval planning and reviewer workflows.

The graph may help RAFIQ discover, rank, explain, and audit candidate evidence. The vault may help humans review that evidence. Neither artifact becomes the canonical source of truth, and neither artifact approves public use.

Decision:

```text
Retrieval may consult graph evidence.
Validation must check source and citation integrity.
Reviewers decide workflow outcomes.
Governance decides publication.
```

## 2. Implementation Baseline

Current private product surfaces already include:

- private content search and source search,
- retrieval trace responses,
- review queue responses,
- guided answer generation,
- model adapter runs,
- answer validation runs,
- answer validation reviewer action updates,
- CP21C and CP22 Knowledge Graphify inspection endpoints,
- internal `/knowledge-graphify` UI with bounded CP22 graph/vault samples.

Relevant private API and UI surfaces:

| Surface | Current role |
| --- | --- |
| `/api/private-content/knowledge-graphify/cp22` | Returns bounded private graph/vault inspection payload. |
| `/knowledge-graphify` | Internal graph/vault inspection UI. |
| Private review queue APIs | List and inspect review targets. |
| Retrieval trace APIs | Inspect source and evidence retrieval paths. |
| Guided answer APIs | Build private evidence-grounded answer drafts. |
| Answer validation APIs | Check citation, evidence, escalation, and review status. |
| Reviewer action API | Records reviewer action against validation runs. |

## 3. Target Flow

CP23 should connect the existing surfaces into one private workflow:

```text
User or tester query
  -> private retrieval request
  -> canonical content search
  -> CP22 graph expansion
  -> candidate evidence route
  -> answer draft or guided answer
  -> validation gates
  -> reviewer queue item
  -> vault/graph context review
  -> reviewer action
  -> remediation or approval state
  -> audit/export verification
```

The retrieval path must remain Quran-first, source-grounded, provenance-aware, and release-state-aware.

## 4. Graph-Aware Retrieval Role

Graph-aware retrieval may use CP22 for:

- source/provenance expansion,
- ayah-to-tafsir adjacency,
- ayah-to-translation edition awareness,
- hadith grade and verification context,
- topic/theme candidate discovery,
- quality warning detection,
- release-state filtering,
- reviewer/remediation routing,
- explaining why an evidence candidate was selected or rejected.

Graph-aware retrieval must not:

- create Quran references not present in canonical data,
- generate translations,
- infer tafsir beyond stored tafsir sources,
- upgrade weak or disputed hadith into primary guidance,
- convert derived topic links into rulings,
- bypass validation gates,
- expose private/public-blocked evidence on public routes.

## 5. Reviewer Workflow Role

Reviewer workflows should use CP22 graph and vault context to help humans answer:

- Which source produced this evidence?
- Which graph nodes and edges were used?
- Which vault packs explain the evidence route?
- Which quality, release, or review states affect the answer?
- Is the issue technical, content/editorial, scholar-level, or public-release related?
- Should the evidence be approved for private use, rejected, remediated, escalated, or deferred?

Initial reviewer queue families:

| Queue family | Purpose |
| --- | --- |
| `retrieval_trace` | Review surprising, weak, missing, or low-confidence evidence routes. |
| `source_gap` | Review missing source, provenance, licensing, or attribution coverage. |
| `grade_assertion` | Review hadith grade claims and methodology context. |
| `verification_claim` | Review hadith/source verification evidence. |
| `answer_validation` | Review guided answer validation failures or private-review-required outcomes. |
| `graph_quality` | Review CP22 graph quality warnings and broken evidence candidates. |
| `release_boundary` | Review public/private release blockers. |

## 6. Reviewer State Model

CP23 should preserve separate technical, content, scholar, and release decisions.

Recommended reviewer states:

| State | Meaning |
| --- | --- |
| `queued` | Item is awaiting review. |
| `technical_review` | Structure, references, source integrity, or import logic needs review. |
| `content_review` | Meaning, attribution wording, or editorial use needs review. |
| `scholar_review` | Religious accuracy, usage context, or ruling boundary needs qualified review. |
| `remediation_required` | Item cannot proceed until a specific fix is made. |
| `approved_private` | Item may be used in private/internal workflows. |
| `approved_public_candidate` | Item may be considered for public release, subject to public-release gates. |
| `rejected` | Item must not be used. |
| `retired` | Item is no longer active but remains auditable. |

No reviewer state alone should publish content. Publication requires separate release gates.

## 7. Evidence Route Requirements

Each graph-aware retrieval route should eventually record:

- retrieval trace ID,
- query text or safe query summary,
- intent and domain classification,
- selected evidence node IDs,
- rejected candidate node IDs where useful,
- source IDs and provenance IDs,
- release-state IDs,
- quality-state IDs,
- vault pack IDs,
- graph expansion depth and rules,
- ranking features used,
- validation gate results,
- reviewer queue item ID where review is required.

## 8. Validation Gate Integration

CP23 retrieval integration must preserve the gates in `RAFIQ_AI_Validation_Gates_V1.md`:

- Intent Gate,
- Source Retrieval Gate,
- Quran Reference Gate,
- Translation Gate,
- Tafsir Gate,
- Hadith Reference Gate,
- Grade Gate,
- Fatwa Boundary Gate,
- Medical/Legal/Crisis Gate,
- Personalization Gate,
- Final Citation Gate.

Graph evidence may help gates inspect source, relationship, and release context. It may not replace gate decisions.

## 9. Public And Private Boundary

CP23 remains private-only.

Required invariant:

```text
No public route, public search index, public guided answer, public study page,
or public vault artifact may depend on CP22 private graph nodes, private graph
edges, public-blocked evidence, rejected review items, or unapproved vault packs.
```

CP23 implementation should keep public-safe counts at zero unless a separate public-release sprint explicitly approves exact artifacts.

## 10. Data Ownership

| Data | Owner |
| --- | --- |
| Canonical Quran, translation, tafsir, hadith content | Database/source manifests |
| Source registry, provenance, release state | Database/source manifests |
| CP22 graph partitions and indexes | Derived product graph artifacts |
| CP22 vault packs | Derived private review artifacts |
| Retrieval trace | Private product workflow |
| Validation run | Private product workflow |
| Reviewer action | Private product workflow audit trail |
| Public release decision | Governance and Product Owner approval |

## 11. CP23 Implementation Sequence

Recommended next checkpoints:

1. CP23-A02 - Graph-Aware Retrieval Contract.
2. CP23-A04 - Reviewer Workflow Contract.
3. CP23-A03 - Evidence Route And Validation Contract.
4. CP23-A05 - Internal UI Workbench Plan.
5. CP23-A06 - Private Prototype Implementation.
6. CP23-A07 - Reviewer Audit Trail And Remediation Export.
7. CP23-A08 - Combined Verification.
8. CP23-A09 - Internal UX Proof.
9. CP23-A10 - Close-Out And Next Scope Decision.

CP23-A02 and CP23-A04 should be completed before code implementation because retrieval and review need one shared evidence contract.

## 12. Verification Strategy

For CP23-A01, documentation verification is sufficient.

For later implementation checkpoints, minimum verification should include:

```powershell
node scripts/check_cp22_combined_verification.mjs
corepack pnpm build:shared
corepack pnpm build:api
corepack pnpm build:mobile:web
```

Later CP23 code should add a CP23 combined verifier that inherits CP22 checks and verifies:

- graph-aware retrieval payload schema,
- evidence route source/provenance/release coverage,
- reviewer queue state transitions,
- reviewer action audit trail,
- remediation export completeness,
- public/private boundary metadata,
- UI bounded payload behavior.

## 13. Known Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Retrieval treats graph adjacency as authority | Religious authenticity risk | Keep edge statuses and validation gates mandatory. |
| Reviewer queues mix technical and scholar decisions | Governance confusion | Preserve distinct queue families, roles, and states. |
| UI exposes too much graph data | Performance and privacy risk | Keep bounded payloads and selected detail loading. |
| Public release pressure skips review | Product safety risk | Keep public-safe counts zero until a public-release sprint approves scope. |
| Vault packs become treated as canonical | Data integrity risk | Display graph IDs and canonical source IDs; keep non-canonical warning. |
| Remediation fixes are not auditable | Regression risk | Require reviewer action and remediation export artifacts. |

## 14. CP23-A01 Close-Out

CP23-A01 is complete when:

- the post-CP22 long-term sprint direction is documented,
- retrieval integration architecture is documented,
- reviewer workflow architecture is documented,
- current private API/UI baselines are acknowledged,
- CP23 implementation sequence is defined,
- no code implementation is started.

Status: complete.

