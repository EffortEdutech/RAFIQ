# AGENTS.md

## Project Identity

Project name: RAFIQ

RAFIQ is an Islamic guidance and knowledge product built around Quran, hadith, tafsir, retrieval, provenance, validation gates, and a mobile companion experience.

This repository is part of the Effort Studio AI development workspace.

Central workspace:

```text
C:\Users\user\Documents\00 AI agent
```

Central Obsidian vault:

```text
C:\Users\user\Documents\00 AI agent\AI-Knowledge
```

## AI Assistant Operating Rules

Before making changes:

1. Read this `AGENTS.md`.
2. Read `graphify-out/GRAPH_REPORT.md` if it exists, or query `graphify-out/graph.json`.
3. Read `docs/README.md`.
4. Read the relevant RAFIQ docs under `docs/`.
5. Inspect source files directly before editing.
6. Preserve Islamic content governance, source attribution, licensing, and validation boundaries.
7. Prefer small, reviewable changes.
8. Do not introduce new production dependencies without approval.
9. Update docs when behavior, APIs, schemas, content workflows, setup commands, or governance rules change.

## Repository Map

- `apps/api/` contains the NestJS API surface.
- `apps/mobile/` contains the Expo mobile/web companion app.
- `apps/private-bridge/` contains the diagnostic Python bridge.
- `packages/shared/` contains shared TypeScript contracts and helpers.
- `supabase/` contains migrations, tests, and database configuration.
- `scripts/` contains project checks, local launchers, parsers, import tools, and verification scripts.
- `docs/` contains RAFIQ product, UX, AI engine, knowledge, backend, governance, operations, sprint, and register documentation.
- `data/` contains manifests, checksums, and source data working areas.
- `graphify-out/` contains generated Graphify project intelligence output.

## Documentation Reading Order

Start with:

1. `docs/README.md`
2. `docs/00_overview/RAFIQ_Product_Master_Blueprint_V1.md`
3. `docs/01_product/RAFIQ_PRD_V2.md`
4. `docs/01_product/RAFIQ_MVP_Scope_Lock_V1.md`
5. `docs/03_ai_engine/RAFIQ_AI_Validation_Gates_V1.md`
6. `docs/04_knowledge/RAFIQ_Source_Licensing_Register_V1.md`
7. `docs/07_governance/RAFIQ_Trust_Authenticity_Framework_V1.md`
8. `docs/07_governance/RAFIQ_Content_Governance_Specification_V1.md`
9. `docs/05_backend_data/RAFIQ_API_Specification_V1.md`
10. `docs/08_operations/RAFIQ_Deployment_Architecture_V1.md`

For current sprint work, inspect:

```text
docs/09_sprints/resource_audit_import_prototype/
```

## Graphify Rules

Use Graphify for codebase structure, relationships, and scoped navigation.

Local wrapper:

```powershell
.\scripts\graphify.ps1 --version
```

Query existing graph:

```powershell
.\scripts\graphify.ps1 query "question" --graph "graphify-out\graph.json"
```

Explain a symbol or file:

```powershell
.\scripts\graphify.ps1 explain "symbol-or-file" --graph "graphify-out\graph.json"
```

Generate the current code-only graph by extracting code folders and merging them. Do not run extraction directly on `apps/`, because it contains README files and Graphify will request an LLM API key for semantic doc extraction.

```powershell
.\scripts\graphify.ps1 extract "apps\api\src" --no-cluster --out ".graphify-work\api"
.\scripts\graphify.ps1 extract "apps\mobile\app" --no-cluster --out ".graphify-work\mobile-app"
.\scripts\graphify.ps1 extract "apps\mobile\src" --no-cluster --out ".graphify-work\mobile-src"
.\scripts\graphify.ps1 extract "packages\shared\src" --no-cluster --out ".graphify-work\shared"
.\scripts\graphify.ps1 extract "scripts" --no-cluster --out ".graphify-work\scripts"
.\scripts\graphify.ps1 merge-graphs ".graphify-work\api\graphify-out\graph.json" ".graphify-work\mobile-app\graphify-out\graph.json" ".graphify-work\mobile-src\graphify-out\graph.json" ".graphify-work\shared\graphify-out\graph.json" ".graphify-work\scripts\graphify-out\graph.json" --out "graphify-out\graph.json"
.\scripts\graphify.ps1 tree --graph "graphify-out\graph.json" --output "graphify-out\GRAPH_TREE.html" --root "$PWD" --label "RAFIQ"
```

Full repository semantic extraction requires an LLM API key because RAFIQ contains many Markdown, Excel, SQL, and data files.

## Obsidian Rules

Project-specific implementation docs stay in this repository under `docs/`.

Shared cross-project strategy, ADRs, standards, and roadmap thinking belong in:

```text
C:\Users\user\Documents\00 AI agent\AI-Knowledge
```

Use Obsidian for:

- product rationale,
- architecture decisions,
- cross-project patterns,
- roadmap thinking,
- meeting notes,
- research notes.

Do not duplicate RAFIQ docs into Obsidian. Link to repo paths instead.

## Commands

Install dependencies:

```powershell
corepack pnpm install
```

Build:

```powershell
corepack pnpm build
```

Local start:

```powershell
corepack pnpm local:start
```

Runtime check:

```powershell
corepack pnpm local:check
```

Phase 5 checks:

```powershell
corepack pnpm check:scaffold
corepack pnpm check:runtime
corepack pnpm check:bridge-parity
```

Targeted builds:

```powershell
corepack pnpm build:shared
corepack pnpm build:api
corepack pnpm build:mobile:web
```

## Architecture Rules

- Keep API contracts explicit and documented.
- Keep Islamic source provenance and attribution visible.
- Do not bypass validation gates for Quran, hadith, tafsir, or guidance content.
- Keep private content APIs and public content APIs clearly separated.
- Preserve Supabase schema boundaries and RPC contracts.
- Keep shared contracts in `packages/shared/`.
- Avoid circular dependencies between apps and packages.
- Prefer direct, readable implementation over clever abstractions.

## Testing Rules

Before completing a code task:

1. Run the narrowest relevant check.
2. Run build or runtime checks when behavior changed.
3. If checks cannot run, explain why.
4. Do not claim tests passed unless they were actually run.

## Security And Governance Rules

- Never commit secrets.
- Never print credentials into logs.
- Use `.env.example` for safe examples only.
- Treat source licensing and content provenance as product-critical.
- Do not expose private ingestion, staging, or internal content schemas directly.
- Preserve user safety, privacy, attribution, and authenticity constraints.

## Git Rules

Before editing:

```powershell
git status
```

Before committing:

```powershell
git diff
git status
```

Commit style:

```text
type(scope): short description
```

Examples:

```text
docs(workspace): add RAFIQ graphify setup
fix(api): validate private content pagination
feat(mobile): add source detail view
```

## Done Criteria

A task is complete when:

- code or docs changes are implemented,
- relevant checks were run or blockers are stated,
- documentation is updated if behavior or operating rules changed,
- Graphify is refreshed after meaningful code structure changes,
- the final response explains what changed and how it was verified.

<!-- AI-WORKSPACE-CONTEXT-FALLBACK -->

## Obsidian Fallback Context

The central Obsidian vault lives at:

~~~text
C:\Users\user\Documents\00 AI agent\AI-Knowledge
~~~

Some Codex or Claude sessions mount only this project folder. If the live vault is outside the current sandbox, read this local bridge instead:

~~~text
docs\AI_WORKSPACE_CONTEXT.md
~~~

Use the bridge only for architecture rationale, ADRs, roadmap context, cross-project standards, and workspace operating context. Do not use it as a replacement for project docs, Graphify, or source inspection.
