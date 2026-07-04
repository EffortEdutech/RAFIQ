# RAFIQ Brand Usage Guide V1

Status: Build Gate
Last updated: 2026-06-09

## Purpose

This document resolves naming ambiguity before product, design, and code work begins.

## Brand Rules

| Context | Use |
| --- | --- |
| User-facing app name | `Rafiq` |
| Documentation title prefix | `RAFIQ` |
| Product/company shorthand | `RAFIQ` is acceptable in architecture and planning docs. |
| In-app assistant voice | `Rafiq` |
| Acronym story | Optional marketing story only; do not use as the formal product definition. |

## Recommended Tagline

Your daily companion in deen.

## Product Description

Short:

Rafiq is a personal Islamic companion that offers sourced daily guidance, reflection, and small actions.

Long:

Rafiq helps Muslims reflect on Quran and Sunnah through personalized, retrieval-grounded guidance. It is not a scholar, fatwa engine, or replacement for qualified religious advice.

## Code Naming

Use lowercase identifiers:

- app/package: `rafiq`
- API prefix: `/api/v1`
- database schema prefixes only when useful: `guidance`, `knowledge`, `user`

Avoid using the acronym expansion in code, database names, or legal/product definitions.

