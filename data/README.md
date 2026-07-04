# RAFIQ Data Landing Zone

This folder stores resource-audit data.

## Rules

- Raw files remain unchanged.
- Every raw source needs a manifest under `data/manifests`.
- Every file needs a SHA-256 checksum.
- Raw data is not production-approved merely because it exists here.
- Production use requires source, license, attribution, integrity, and content approval.
- Existing paths are grandfathered. Do not reorganize registered raw files
  merely to match the Day 7 future-acquisition layout.
- New manifests should follow
  `docs/09_sprints/resource_audit_import_prototype/templates/SOURCE_MANIFEST_TEMPLATE_V2.json`.
- Source identity, acquisition snapshot, and raw object identity are separate.
- Corrections and normalization belong in derived staging, never in raw files.

## Hadith Raw-Object Inventory

The complete non-Git Hadith tree is inventoried by:

- `data/manifests/hadith-raw-objects-2026-06-14.csv`
- `data/manifests/hadith-raw-subtrees-2026-06-14.csv`
- `scripts/inventory_hadith_raw_objects.py`

Use `--fail-on-change` for integrity verification. Generated and mirror files
remain registered but are not automatically selected as parser inputs.

## Current Contents

`data/raw/quran/tanzil`

- Tanzil Uthmani Quran Text v1.1
- Tanzil Quran Metadata v1.0
- Captured Tanzil license page
