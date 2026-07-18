# CP21C - Resource Graphify Decision Register

Date: 2026-07-10
Status: Active

## Decisions

| ID | Decision | Status | Notes |
| --- | --- | --- | --- |
| RG-DEC-001 | RAFIQ Product Knowledge Graphify is separate from developer Graphify. | Approved | Developer `graphify-out/` remains builder tooling only. |
| RG-DEC-002 | RAFIQ Product Knowledge Vault is separate from the central AI-Knowledge Obsidian vault. | Approved | Product vault must be deployable with RAFIQ and not depend on `C:\Users\user\Documents\00 AI agent`. |
| RG-DEC-003 | Supabase/Postgres remains canonical truth. | Approved | Graph and vault outputs are derived intelligence surfaces. |
| RG-DEC-004 | Graph nodes and edges must carry release, review, quality, access, and public-safe fields. | Approved | Required for private/public filtering and launch-gate proof. |
| RG-DEC-005 | Derived relationships cannot become approved religious guidance without review. | Approved | Preserves RAFIQ governance and scholar/content boundaries. |
| RG-DEC-006 | CP21C is the first implementation target. | Approved | Ranking explainability is the smallest useful product Graphify slice. |
| RG-DEC-007 | CP21C graph/vault outputs are private by default. | Approved | Public release remains NO-GO. |
| RG-DEC-008 | CP21C must produce at least 20 ranking cases. | Approved | Matches CP21C semantic ranking contract. |
| RG-DEC-009 | Ranking packs are the first vault artifact type to implement. | Approved | Other artifact packs wait until ranking prototype proves value. |
| RG-DEC-010 | Implementation must not add mobile route chrome. | Approved | CP21C is ranking evidence, not UI expansion. |
| RG-DEC-011 | Implementation must not require new production dependencies without approval. | Approved | Use existing repo patterns first. |
| RG-DEC-012 | Public release cannot be inferred from high CP21C ranking scores. | Approved | Ranking quality and public approval are separate gates. |
| RG-DEC-013 | CP21C graph export is not the full RAFIQ resource graph. | Approved | `data/graphify/cp21c/resource-graph.json` is a small ranking-evidence slice over the CP21C cases only. Full Quran, tafsir, translation, hadith, topic, provenance, review, and release-state graph expansion requires a later checkpoint. |
| RG-DEC-014 | CP21C file-based graph and vault artifacts are sufficient for prototype close-out. | Approved | Database-backed graph/vault storage remains deferred; CP21C closes with generated JSON/markdown artifacts and a combined verifier. |
| RG-DEC-015 | Low-scoring CP21C cases are remediation targets, not close-out blockers. | Approved | Ordinary average passes at `89.25`, no critical ordinary case is below `75`, and every failing signal has remediation recorded. |
| RG-DEC-016 | CP21C-R01 remediation should fix retrieval expansion, not scoring thresholds. | Approved | Tawbah/guilt, spiritual motivation, and hard-week hope prompts now map to existing private source-backed evidence; ordinary average is `98.25` and low-scoring ordinary cases are `0`. |

## Open Decisions

| ID | Decision | Status | Recommendation |
| --- | --- | --- | --- |
| RG-OPEN-001 | Final storage path for product graph artifacts. | Deferred | CP21C closes with `data/graphify/cp21c/`; revisit for broader deployed product graph storage. |
| RG-OPEN-002 | Final storage path for product vault artifacts. | Deferred | CP21C closes with `data/vault/cp21c/`; revisit before broader deployed vault rollout. |
| RG-OPEN-003 | Whether CP21C graph export should be generated only from API responses or also direct DB queries. | Open | Prefer existing private API responses first; use DB only if ranking evidence cannot be captured safely. |
| RG-OPEN-004 | Whether graph artifacts should later become database records. | Deferred | File artifacts are sufficient for the prototype. |
| RG-OPEN-005 | Whether the future product vault should be Obsidian-compatible markdown. | Deferred | Use markdown-compatible packs now without depending on Obsidian runtime. |

## Implementation Guardrails

- Do not read or print `.env` files.
- Do not depend on the developer AI workspace.
- Do not write product vault artifacts to the central Obsidian vault.
- Do not expose private graph/vault artifacts to public routes.
- Do not claim public readiness.
- Do not mutate canonical religious content for this prototype.
- Do not bypass risk/scholar escalation states.

## Next Decision Point

After CP21C-R01, plan the next knowledge-graph expansion checkpoint while
keeping CP21C as a private ranking-evidence prototype.

Any full RAFIQ resource graph build must be scoped separately from CP21C.

Bismillah.
