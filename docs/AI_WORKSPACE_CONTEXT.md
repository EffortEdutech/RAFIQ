# AI Workspace Context

This file is a project-local bridge to the Effort Studio central Obsidian vault.

It exists because some Codex or Claude sessions mount only the project folder. In those sessions, the central vault may be outside the sandbox even though it exists on the machine.

## Central Vault

~~~text
C:\Users\user\Documents\00 AI agent\AI-Knowledge
~~~

## How To Use This File

- Read this file only for architecture rationale, ADR, roadmap, cross-project context, and workspace operating rules.
- Do not use this file as a replacement for project docs or source files.
- If the central vault is accessible, prefer the live vault note listed below.
- If the central vault is not accessible, use this local bridge as the fallback context and mention that the live vault was outside the current sandbox.

## Live Vault Note

~~~text
C:\Users\user\Documents\00 AI agent\AI-Knowledge\Projects\RAFIQ\Overview.md
~~~

## Synced Project Overview

# RAFIQ Overview

## Purpose

RAFIQ is an Islamic guidance and knowledge product focused on Quran, hadith, tafsir, retrieval, provenance, validation, and a mobile companion experience.

## Repository

```text
C:\Users\user\Documents\00 RAFIQ
```

## Project Docs

Implementation and product documentation remain in:

```text
C:\Users\user\Documents\00 RAFIQ\docs
```

Start with:

- `docs/README.md`
- `docs/00_overview/RAFIQ_Product_Master_Blueprint_V1.md`
- `docs/01_product/RAFIQ_PRD_V2.md`
- `docs/03_ai_engine/RAFIQ_AI_Validation_Gates_V1.md`
- `docs/04_knowledge/RAFIQ_Source_Licensing_Register_V1.md`
- `docs/07_governance/RAFIQ_Trust_Authenticity_Framework_V1.md`

## AI Setup

Project-local assistant files:

```text
C:\Users\user\Documents\00 RAFIQ\AGENTS.md
C:\Users\user\Documents\00 RAFIQ\CLAUDE.md
```

Project-local Graphify wrapper:

```text
C:\Users\user\Documents\00 RAFIQ\scripts\graphify.ps1
```

The wrapper delegates to the central Graphify install in:

```text
C:\Users\user\Documents\00 AI agent\scripts\graphify.ps1
```

## Current Graphify Scope

The initial RAFIQ graph is code-only and merged from:

```text
C:\Users\user\Documents\00 RAFIQ\apps\api\src
C:\Users\user\Documents\00 RAFIQ\apps\mobile\app
C:\Users\user\Documents\00 RAFIQ\apps\mobile\src
C:\Users\user\Documents\00 RAFIQ\packages\shared\src
C:\Users\user\Documents\00 RAFIQ\scripts
```

Full semantic extraction requires an LLM API key because the repository contains many docs and data files.

## Related Notes

- [[Architecture/AI Development Workspace]]
- [[Architecture/Graphify + Obsidian Workflow]]
- [[Architecture/Codex + Claude Code Workflow]]

