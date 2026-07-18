# CP22-G06 - Guidance Evidence And Validation Links Report

Date: 2026-07-12

Status: Complete for CP22-G06 private CP21C evidence projection

Scope: Product-evidence partition, CP21C reference partition, validation run nodes, retrieval evidence links, vault-note links, checksums, indexes, and private/public boundary verification for the full private RAFIQ resource graph.

## 1. Purpose

CP22-G06 expands the CP22-G05 private resource graph with product evidence and validation links.

This checkpoint exports:

- private retrieval trace nodes from CP21C collected evidence;
- private search document nodes for CP21C verification evidence and search results;
- private answer draft nodes;
- private guided answer run nodes;
- private answer validation run nodes;
- CP21C case reference nodes;
- CP21C vault note nodes;
- CP21C case-to-evidence links;
- retrieval/document links to resolvable resource graph nodes, especially Quran ayah identities;
- refreshed indexes over the full private graph.

It intentionally treats evidence links as validation traces, not religious authority.

## 2. Implementation

Added:

- `scripts/generate_cp22_guidance_evidence_graph.mjs`
- `scripts/check_cp22_guidance_evidence_graph.mjs`

Updated:

- `scripts/check_cp22_hadith_grade_quality_graph.mjs`

Generated or refreshed:

- `data/graphify/full-private/manifest.json`
- `data/graphify/full-private/summary.json`
- `data/graphify/full-private/partitions/product-evidence.json`
- `data/graphify/full-private/partitions/cp21c-reference.json`
- all full-private graph indexes.

## 3. Input Sources

The CP22-G06 exporter uses checked-in, non-secret evidence only:

- `data/graphify/cp21c/cases.json`
- `data/graphify/cp21c/evidence.json`
- `data/graphify/cp21c/ranking-summary.json`
- `data/vault/cp21c/ranking-cases/*.md`
- existing CP22-G05 graph partitions

No `.env` files were read.

No database credentials were used.

No live database connection was used.

## 4. Boundary Decision

CP22-G06 is a private product-evidence projection.

Therefore:

- CP21C evidence remains prototype validation evidence;
- CP21C reference nodes do not become the full RAFIQ resource graph;
- retrieval/document links are marked as derived candidates;
- evidence-to-resource links include an explicit authority boundary;
- escalation outcomes remain separate validation outcomes;
- public release remains blocked;
- every generated node and edge remains `accessLevel=developer_private`;
- every generated node and edge remains `publicSafe=false`.

This lets RAFIQ inspect how guidance validation touches the resource graph without implying that a retrieval route is an authoritative Islamic ruling.

## 5. Export Result

Generator command:

```powershell
node scripts/generate_cp22_guidance_evidence_graph.mjs
```

Result:

```json
{
  "status": "pass",
  "checkpoint": "CP22-G06",
  "outputDir": "data/graphify/full-private",
  "counts": {
    "totalNodes": 79657,
    "totalEdges": 147689,
    "partitions": 11,
    "indexes": 12,
    "publicSafeNodes": 0,
    "publicSafeEdges": 0
  },
  "partitionCounts": {
    "product-evidence": {
      "nodes": 303,
      "edges": 628
    },
    "cp21c-reference": {
      "nodes": 46,
      "edges": 280
    }
  }
}
```

The full run also preserved all prior partitions:

| Partition | Nodes | Edges |
| --- | ---: | ---: |
| sources | 59 | 54 |
| governance | 36 | 108 |
| quran | 25,061 | 43,652 |
| translations | 31,185 | 62,360 |
| tafsir | 18,711 | 37,416 |
| topics | 3,562 | 2,512 |
| hadith | 483 | 546 |
| hadith-grades | 120 | 118 |
| quality | 91 | 15 |
| product-evidence | 303 | 628 |
| cp21c-reference | 46 | 280 |

## 6. Verification Result

Verifier command:

```powershell
node scripts/check_cp22_guidance_evidence_graph.mjs
```

Result:

```json
{
  "status": "pass",
  "checkpoint": "CP22-G06",
  "nodeCount": 79657,
  "edgeCount": 147689,
  "cp21cCaseCount": 23,
  "vaultNoteCount": 23,
  "retrievalTraceCount": 18,
  "searchDocumentCount": 216,
  "answerDraftCount": 23,
  "guidedAnswerRunCount": 23,
  "answerValidationRunCount": 23,
  "evidenceToResourceEdgeCount": 372,
  "cp21cCaseEvidenceEdgeCount": 257,
  "validationStatuses": {
    "approved_with_disclaimer": 16,
    "pass": 2,
    "safety_escalation": 2,
    "scholar_escalation": 1,
    "source_unavailable": 2
  },
  "publicSafeNodeCount": 0,
  "publicSafeEdgeCount": 0
}
```

Inherited G05 verifier command:

```powershell
node scripts/check_cp22_hadith_grade_quality_graph.mjs
```

Result: pass.

## 7. Verifier Coverage

The verifier checks:

- manifest schema and `CP22-G06` checkpoint value;
- required `product-evidence` and `cp21c-reference` partitions;
- all inherited CP22-G05 partitions and indexes;
- partition checksums;
- index checksums;
- duplicate node and edge IDs;
- node base fields;
- edge base fields;
- edge endpoint resolution;
- edge partition consistency;
- 23 CP21C case nodes;
- 23 CP21C vault note nodes;
- retrieval trace, search document, answer draft, guided answer run, and answer validation run nodes;
- approved, blocked, scholar escalation, and safety escalation validation outcomes;
- evidence-to-resource edges remain `derived_candidate`;
- evidence-to-resource edges carry `authorityBoundary=retrieval_evidence_not_religious_authority`;
- CP21C case evidence links;
- vault note links;
- provenance and release refs on product evidence nodes;
- `by-ayah-key` includes retrieval evidence links;
- zero public-safe nodes;
- zero public-safe edges.

## 8. Generated Graph Shape

| Artifact | Count |
| --- | ---: |
| Partitions | 11 |
| Indexes | 12 |
| Nodes | 79,657 |
| Edges | 147,689 |
| CP21C case nodes | 23 |
| Vault note nodes | 23 |
| Retrieval trace nodes | 18 |
| Search document nodes | 216 |
| Answer draft nodes | 23 |
| Guided answer run nodes | 23 |
| Answer validation run nodes | 23 |
| Evidence-to-resource edges | 372 |
| CP21C case evidence edges | 257 |
| Public-safe nodes | 0 |
| Public-safe edges | 0 |

## 9. Important Limitations

CP22-G06 is not yet a live product-evidence database export.

It does not yet include:

- live `content.private_search_documents` rows;
- live `content.private_retrieval_traces` rows;
- live `content.private_answer_drafts` rows;
- live `content.private_guided_answer_runs` rows;
- live `content.private_model_adapter_runs` rows;
- live `content.private_answer_validation_runs` rows;
- full review queue export;
- vault packs.

Those remain later CP22 checkpoints or require a safe canonical database/export input.

## 10. Governance Confirmation

The CP22-G06 export preserves the private validation boundary:

- `publicSafeNodes = 0`
- `publicSafeEdges = 0`
- manifest `publicSafe = false`
- access level is `developer_private`
- public release is not approved
- CP21C remains prototype reference evidence
- retrieval links are not treated as religious authority
- escalation outcomes remain separate from ordinary guidance ranking

## 11. Next Checkpoint

Next checkpoint:

```text
CP22-G07 - Vault Packs
```

Before CP22-G07 begins, the CP22-G06 verifier should continue to pass.
