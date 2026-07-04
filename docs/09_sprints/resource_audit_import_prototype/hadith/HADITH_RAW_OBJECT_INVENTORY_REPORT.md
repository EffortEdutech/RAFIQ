# Hadith Raw-Object Inventory Report

Status: Complete  
Inventory date: 2026-06-14

## Result

The complete non-Git Hadith raw tree is now registered at file level.

| Metric | Result |
| --- | ---: |
| Registered files | 654,229 |
| Registered bytes | 11,179,086,503 |
| Principal parser inputs | 163 |
| Principal checksum matches | 163 |
| Missing principals | 0 |
| Principal mismatches | 0 |
| Whole-tree aggregate SHA-256 | `6D9FCB9B34C13126CEC42672B6C85E9B686469B93A160CDCA92145AD01214C80` |

`.git` metadata is intentionally excluded. Existing acquisition manifests
include Git object databases and, for Hugging Face snapshots, duplicated LFS
objects. The new raw-object inventory represents working-tree evidence used by
RAFIQ rather than repository transport internals.

## Role Classification

| Role | Files |
| --- | ---: |
| Generated | 326,339 |
| Mirror/minified | 326,240 |
| Unselected payload | 1,022 |
| Support | 431 |
| Principal | 163 |
| Metadata | 34 |

Roles control parser selection and inventory presentation. They do not imply
source authority, rights approval, or content quality.

## Deterministic Verification

The aggregate digest is calculated from sorted lines:

```text
relative_path|byte_length|file_sha256
```

The inventory was immediately rerun using the cache:

- 654,229 hashes reused
- zero files rehashed
- zero added files
- zero content changes
- zero metadata-only changes
- zero missing files
- identical whole-tree aggregate digest

## Outputs

- `scripts/inventory_hadith_raw_objects.py`
- `data/manifests/hadith-raw-objects-2026-06-14.csv`
- `data/manifests/hadith-raw-subtrees-2026-06-14.csv`
- `data/staging_reports/hadith/raw_inventory/hadith-raw-inventory-summary.json`
- `data/staging_reports/hadith/raw_inventory/hadith-raw-inventory-changes.csv`
- `data/staging_reports/hadith/raw_inventory/inventory_cache.sqlite`

The detailed object CSV is approximately 217 MB. The resumable SQLite cache is
approximately 408 MB.

## Tool Behavior

The tool:

- excludes `.git`
- streams SHA-256 hashing
- checkpoints hashes in SQLite
- reuses hashes by path, byte length, and modification timestamp
- detects added, content-changed, metadata-changed, and missing files
- verifies the 163 principal checksums
- produces deterministic resource and subtree digests
- writes report files atomically
- never modifies raw files

Standard verification command:

```powershell
python scripts/inventory_hadith_raw_objects.py --workers 8 --fail-on-change
```

Use `--force-rehash` only when a full byte-level recheck is intentionally
required.

## Decision

The Day 7 raw-object inventory gap is resolved. Per-file identity is retained
for every non-Git object, including generated and mirror subtrees. Aggregate
subtree digests remain available for efficient monitoring and reconciliation.

