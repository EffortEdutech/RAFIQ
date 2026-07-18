# CP23-A02 - Graph-Aware Retrieval Contract

Date: 2026-07-13

Status: Complete

Scope: Private graph-aware retrieval contract for CP23 design. No implementation is started by this document.

## 1. Purpose

This contract defines how RAFIQ may use the completed CP22 private Product Knowledge Graphify artifacts during retrieval.

Graph-aware retrieval may improve evidence discovery, ranking, explanation, and reviewer routing. It must not replace canonical database content, source manifests, validation gates, reviewer decisions, or public-release governance.

## 2. Current Baseline

Current private retrieval surfaces include:

- private content search,
- private source search,
- retrieval trace detail,
- guided answer generation,
- answer validation runs,
- review queue inspection,
- CP22 graph/vault summary endpoint.

CP23-A02 defines the future contract that CP23-A06 may implement with bounded additions.

## 3. Retrieval Request Contract

Recommended future request shape:

```ts
type Cp23GraphAwareRetrievalRequest = {
  queryText: string;
  intent?: 'guidance' | 'learning' | 'search' | 'reflection' | 'journal' | 'ruling' | 'medical' | 'legal' | 'crisis' | 'other';
  language?: string;
  domain?: 'all' | 'quran' | 'tafsir' | 'hadith' | 'source' | 'topic';
  limit?: number;
  offset?: number;
  graphMode: 'off' | 'explain_only' | 'expand_candidates' | 'rank_and_explain';
  graphExpansion: {
    maxDepth: 0 | 1 | 2;
    allowedNodeTypes: string[];
    allowedEdgeTypes: string[];
    requireSourceRefs: boolean;
    requireProvenanceRefs: boolean;
    requireReleaseRefs: boolean;
    includeVaultPackRefs: boolean;
  };
  releaseBoundary: {
    mode: 'private_internal';
    allowPublicBlocked: true;
    allowRejected: false;
    publicSafeOnly: false;
  };
  qualityBoundary: {
    allowWarning: boolean;
    allowWithheld: false;
    requireReviewForWarning: true;
  };
};
```

Required defaults:

| Field | Default |
| --- | --- |
| `graphMode` | `explain_only` |
| `maxDepth` | `1` |
| `requireSourceRefs` | `true` |
| `requireProvenanceRefs` | `true` |
| `requireReleaseRefs` | `true` |
| `includeVaultPackRefs` | `true` |
| `releaseBoundary.mode` | `private_internal` |
| `releaseBoundary.publicSafeOnly` | `false` |
| `qualityBoundary.allowWithheld` | `false` |

## 4. Evidence Candidate Contract

Every graph-aware candidate must keep canonical and graph identities separate.

```ts
type Cp23EvidenceCandidate = {
  candidateId: string;
  canonicalRef: string;
  contentType: 'quran_ayah' | 'quran_ayah_text' | 'translation_text' | 'tafsir_passage' | 'hadith_record' | 'hadith_text_version' | 'source_topic' | 'source' | 'validation_finding';
  graphNodeIds: string[];
  graphEdgeIds: string[];
  sourceIds: string[];
  provenanceIds: string[];
  releaseStateIds: string[];
  qualityState: 'clean' | 'warning' | 'unverified' | 'withheld';
  reviewState: 'not_required' | 'pending' | 'technical_review' | 'content_review' | 'scholar_review' | 'rejected';
  publicSafe: false;
  vaultPackIds: string[];
  rankingSignals: Cp23RankingSignal[];
  selectionState: 'selected' | 'candidate' | 'rejected' | 'requires_review' | 'requires_escalation';
  selectionReason: string;
};
```

Required candidate invariants:

- `canonicalRef` must point to canonical content or a known derived workflow entity.
- `graphNodeIds` must resolve in CP22 graph indexes.
- `sourceIds`, `provenanceIds`, and `releaseStateIds` are required for content-bearing candidates.
- `publicSafe` remains false during CP23 unless a later public-release track changes the boundary.
- `selectionReason` must be operational, not religiously authoritative.

## 5. Ranking Signals

Allowed ranking signals:

| Signal | Meaning |
| --- | --- |
| `text_match` | Canonical/private search matched the query text. |
| `source_declared_relation` | Relationship came from source data. |
| `imported_relation` | Relationship was imported into RAFIQ canonical/staging data. |
| `ayah_tafsir_adjacency` | Tafsir passage explains selected ayah. |
| `translation_edition_available` | Translation edition exists for selected ayah. |
| `hadith_grade_context` | Hadith has grade or verification context. |
| `topic_candidate_match` | Topic/theme metadata is a candidate relation. |
| `quality_warning` | Candidate has a quality issue that must remain visible. |
| `release_blocker` | Candidate is private/public-blocked and cannot be used publicly. |
| `validation_history` | Prior validation evidence exists. |
| `vault_context_available` | A vault pack exists for human review. |

Ranking signals may explain selection. They must not imply approval.

## 6. Graph Expansion Rules

Allowed CP23 expansion:

| Start node | Allowed expansion | Max depth |
| --- | --- | ---: |
| `quran_ayah` | text versions, translations, tafsir passages, topics, release states, quality findings | 2 |
| `tafsir_passage` | explained ayahs, tafsir edition, source/provenance/release states | 1 |
| `translation_text` | ayah, translation edition, source/provenance/release states | 1 |
| `hadith_record` | references, text versions, grade assertions, verification claims, release states | 2 |
| `source_topic` | taxonomy, ayah theme groups, candidate evidence refs | 1 |
| `private_retrieval_trace` | cited entities, search documents, validation links | 1 |

Expansion must stop when:

- a node is rejected,
- a node is withheld,
- an edge has status `rejected` or `retired`,
- required source/provenance/release refs are missing,
- max depth is reached,
- the request would expose raw/private data outside private APIs.

## 7. Prohibited Inferences

CP23 retrieval must not:

- create new Quran references,
- generate Quran translations,
- summarize tafsir without stored tafsir evidence,
- convert a topic/theme relation into a ruling,
- use weak, fabricated, unknown, or withheld hadith as primary guidance,
- treat graph centrality as authenticity,
- treat vault packs as canonical source data,
- use user memory to override source authority,
- expose public-blocked candidates on public surfaces,
- remove escalation flags to improve answer fluency.

## 8. Output Contract

Recommended future response wrapper:

```ts
type Cp23GraphAwareRetrievalResponse = {
  notice: PrivateContentNotice;
  retrievalTraceId: string;
  graphMode: Cp23GraphAwareRetrievalRequest['graphMode'];
  query: {
    text: string;
    intent: string;
    domain: string;
  };
  candidates: Cp23EvidenceCandidate[];
  selectedCandidateIds: string[];
  rejectedCandidateIds: string[];
  requiresReviewCandidateIds: string[];
  graphProof: {
    graphId: 'rafiq-full-private-resource-graph';
    graphChecksumSha256: string;
    partitionNames: string[];
    indexNames: string[];
  };
  boundary: {
    privateOnly: true;
    publicSafeCandidateCount: 0;
    publicReleaseApproved: false;
  };
};
```

## 9. Verifier Requirements

CP23-A06 or later must add a verifier that fails when:

- a selected candidate lacks source refs,
- a selected candidate lacks provenance refs,
- a selected candidate lacks release refs,
- a graph node or edge ID does not resolve,
- withheld or rejected evidence is selected,
- a public-safe count is nonzero without public-release approval,
- graph expansion exceeds the declared max depth,
- a vault pack ID does not resolve,
- ranking signals include a prohibited inference.

## 10. Acceptance

CP23-A02 is complete when the retrieval request contract, evidence candidate contract, expansion rules, ranking signals, prohibited inferences, output contract, and verifier requirements are documented.

Status: complete.

