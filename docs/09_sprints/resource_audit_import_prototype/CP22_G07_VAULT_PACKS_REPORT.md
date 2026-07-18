# CP22-G07 - Vault Packs Report

Date: 2026-07-12

Status: Complete

Scope: Generate private RAFIQ Knowledge Vault packs from the CP22 full private
resource graph produced at CP22-G06.

## Summary

CP22-G07 creates a private review vault at:

```text
data/vault/full-private/
```

The vault is generated from the full private RAFIQ resource graph manifest:

```text
data/graphify/full-private/manifest.json
```

The generated vault packs are review and navigation artifacts only. They are not
canonical source data, do not copy raw Quran, translation, tafsir, or hadith text
bodies, and do not approve public release.

## Generated Artifacts

Generator:

```text
scripts/generate_cp22_vault_packs.mjs
```

Verifier:

```text
scripts/check_cp22_vault_packs.mjs
```

Vault manifest:

```text
data/vault/full-private/manifest.json
```

Vault pack root:

```text
data/vault/full-private/packs/
```

## Vault Counts

Verifier output:

```json
{
  "status": "pass",
  "checkpoint": "CP22-G07",
  "vaultDir": "data/vault/full-private",
  "artifactCount": 158,
  "publicSafeArtifacts": 0,
  "graphNodesReferenced": 386,
  "graphNodeReferenceCount": 546
}
```

Category counts:

| Category | Pack count |
| --- | ---: |
| governance | 11 |
| hadith | 15 |
| quality | 21 |
| quran | 4 |
| release-gates | 2 |
| sources | 60 |
| tafsir | 10 |
| topics | 11 |
| validation | 24 |

## Artifact Types Generated

| Artifact type | Purpose |
| --- | --- |
| `ayah_study_pack` | Quran and ayah study review packs. |
| `tafsir_passage_pack` | Tafsir edition and passage review packs. |
| `hadith_verification_pack` | Hadith and grade verification review packs. |
| `theme_guidance_pack` | Topic and theme navigation review packs. |
| `source_approval_pack` | Source, manifest, checksum, and approval review packs. |
| `guidance_evidence_pack` | CP21C/private product-evidence validation packs. |
| `release_gate_pack` | Governance, quality, manifest, and release-boundary packs. |

## Verification Rules

The CP22-G07 verifier checks:

- vault manifest schema, checkpoint, source graph ID, and CP22-G06 source graph
  lineage;
- required vault categories and artifact types;
- required YAML front matter fields from the vault artifact contract;
- required Markdown sections;
- checksum consistency for every generated pack;
- `public_safe: false` on every Markdown pack and manifest artifact;
- no public-safe artifacts in the generated vault;
- graph node IDs resolve through `data/graphify/full-private/indexes/by-node-id.json`;
- every pack includes canonical refs, source refs, and graph node IDs;
- every pack states the non-canonical source-data boundary;
- every pack states the public exposure boundary.

## Governance Boundary

The vault remains private by default:

- `environment`: `private_local`
- `access_level`: `developer_private`
- `public_safe`: `false`
- public-safe artifact count: `0`

The vault is not the source of truth for Islamic content. Canonical source files,
manifests, graph partitions, checksums, and database-backed content workflows
remain the source of truth. Vault packs are inspectable review surfaces built
from those artifacts.

## Verification Commands

Commands run:

```powershell
node scripts/generate_cp22_vault_packs.mjs
node scripts/check_cp22_vault_packs.mjs
node -c scripts/generate_cp22_vault_packs.mjs
node -c scripts/check_cp22_vault_packs.mjs
.\scripts\graphify.ps1 update .
```

All CP22-G07 commands passed.

Graphify refresh result:

```text
Rebuilt: 6615 nodes, 7872 edges, 805 communities.
graph.json and GRAPH_REPORT.md updated in graphify-out.
graph.html skipped because the graph is above the 5000-node HTML visualization limit.
```

## Known Limitations

- The vault intentionally generates compact review packs rather than one
  Markdown file per graph node.
- The vault does not export raw religious text bodies.
- CP21C validation packs remain prototype validation evidence and must not be
  mistaken for the full RAFIQ resource graph.
- Public release remains blocked until a separate source licensing,
  attribution, editorial, scholar review, and release approval plan is approved.

## Next Checkpoint

Recommended next checkpoint:

```text
CP22-G08 - Internal UI
```

The internal UI should expose the private graph and vault packs for inspection
without making them public RAFIQ routes.
