# Source Registry Contract V2

Status: Day 7 Design Complete  
Design date: 2026-06-14

## Entities

| Entity | Purpose |
| --- | --- |
| `source_registry` | Continuing provider/resource identity. |
| `source_snapshots` | One acquired source version at a point in time. |
| `raw_objects` | Immutable files, responses, databases, and archive members. |
| `import_runs` | Versioned parser executions against a snapshot. |
| `validation_findings` | Object, run, or staged-record defects and warnings. |
| `transformation_events` | Versioned repairs, normalization, expansion, or deduplication. |
| `record_lineage` | Parent-child links between source-shaped and derived rows. |

## Source Registry Required Fields

- stable `source_key`
- display name
- provider
- domain
- official, repository, and documentation URLs
- default acquisition method
- source authority classification
- active/retired state

Do not store one changing license or version directly on the source identity.
Those belong to the snapshot.

## Snapshot Required Fields

- `source_id`
- stable `snapshot_key`
- upstream version, tag, branch, commit, or API date
- acquisition timestamp and method
- acquired by
- terms/license URL and captured evidence object
- attribution text captured for this version
- rights, attribution, technical, content, and publication statuses
- file count, total bytes, and aggregate checksum where available
- notes and supersession link

Approval is version-specific. A changed snapshot does not inherit approval
automatically.

## Raw Object Required Fields

- snapshot
- object role
- logical name
- path/storage key
- SHA-256 checksum
- byte length
- media type and format
- encoding
- parent archive object and archive member path where relevant
- principal/mirror/generated classification
- parse eligibility

The checksum plus byte length detects identity; the path is only a locator.

## Status Vocabularies

### Technical

- `acquired`
- `profiled`
- `validated`
- `validated_with_findings`
- `unusable`
- `superseded`

### Rights

- `unknown`
- `requested`
- `verified`
- `approved`
- `rejected`
- `expired`

### Attribution

- `unknown`
- `incomplete`
- `documented`
- `approved`

### Content Review

- `raw`
- `technical_review`
- `editorial_review`
- `scholar_review`
- `approved`
- `rejected`
- `retired`

### Publication

- `private_only`
- `public_blocked`
- `public_eligible`
- `published`
- `withdrawn`

These fields are independent. Do not encode them in one overloaded status.

## Manifest Compatibility

Existing V1 JSON manifests map as follows:

| V1 Field | V2 Destination |
| --- | --- |
| `sourceId` | `source_registry.source_key` |
| `version`, `dateAccessed` | `source_snapshots` |
| `rawFilePath`, checksum, format | `raw_objects` |
| `license*`, attribution | snapshot rights/attribution evidence |
| `recordCount*` | snapshot expectation and validation metric |
| `status` | split into technical, rights, content, and publication statuses |

Hadith repository CSV rows become source snapshots. Principal checksum rows
become raw objects.

## Minimum Manifest Rule

A source is ready for parsing only when:

1. source identity exists;
2. snapshot identity exists;
3. every principal object has checksum and byte length;
4. acquisition method and upstream version are recorded;
5. technical and publication states are explicit;
6. parser selection is recorded.

