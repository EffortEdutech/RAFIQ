# Build Pending Content Approval Decision

Status: Approved  
Decision date: 2026-06-12  
Approver: Product Owner

## Decision

RAFIQ may proceed with complete platform design, implementation, integration,
full-content import, indexing, AI integration, and private end-to-end testing
while source rights and scholar/content approvals remain pending.

This decision authorizes development. It does not authorize production
publication, public display, commercial redistribution, or public AI guidance
grounded in unapproved content.

The private platform must be functionally complete with all technically
validated content enabled. Approval status must not disable internal features
or prevent complete end-to-end testing.

## Operating Model

| Layer | Unapproved validated content allowed? | Rule |
| --- | --- | --- |
| Immutable raw storage | Yes | Preserve source files and checksums unchanged. |
| Local development | Yes | Developer access only; clearly label source status. |
| Private complete platform | Yes | Import, display, search, retrieve, index, and test all validated content. |
| Private staging/test | Yes | All content-dependent features enabled; authentication and access controls required. |
| Automated validation | Yes | Counts, joins, retrieval, rendering, and regression tests allowed. |
| Internal editorial/scholar review | Yes | Reviewer access only with audit trail. |
| Private production-like database | Yes | May contain all validated content for complete integration and load testing. |
| Public-release database/publication layer | No | Only approved source versions may be exposed publicly. |
| Public application display | No | Block records lacking production approval. |
| Public AI/RAG responses | No | Retrieval must exclude unapproved sources. |
| Public exports/API redistribution | No | Requires explicit redistribution permission. |

## Required Architecture

Every source and content record must carry:

- `source_id`
- `source_version`
- `rights_status`
- `content_approval_status`
- `environment_scope`
- `attribution_status`
- `import_batch_id`
- `reviewed_by`
- `approved_at`

Recommended status values:

- rights: `unknown`, `requested`, `verified`, `approved`, `rejected`, `expired`
- content: `raw`, `technical_review`, `editorial_review`, `scholar_review`,
  `approved`, `rejected`, `retired`
- environment: `local_only`, `private_staging`, `production`

## Enforcement Rules

1. Private development and test queries may use all technically validated
   content regardless of pending approval status.
2. Public-release queries must require both:
   - `rights_status = approved`
   - `content_approval_status = approved`
3. The complete private platform must exercise unapproved records through
   import, canonical mapping, search, retrieval, AI/RAG, rendering, caching,
   analytics, and rollback tests.
4. Approval filters must be deployment-mode aware:
   - private mode: all technically validated content enabled
   - public-release mode: only fully approved content enabled
5. Test and staging interfaces must display a persistent
   `UNAPPROVED CONTENT - NOT FOR PUBLICATION` label.
6. Test accounts and internal URLs must not be publicly indexed.
7. Derived embeddings, summaries, and relationships may be generated and
   tested privately but inherit the strictest approval status of their source
   records for public release.
8. The system must support replacing or disabling a source without changing
   canonical ayah identities or rebuilding unrelated application features.
9. Approval is version-specific. A changed source file requires a new
   checksum, validation, and approval assessment.

## Development Strategy

Build the platform against source adapters and canonical contracts, not
against hard-coded QUL file structures.

Proceed with:

- complete database and source-registry implementation
- raw, staging, canonical, indexing, and private publication pipelines
- canonical Quran-linked content model
- search and retrieval infrastructure
- complete UI, navigation, and content-dependent features
- private end-to-end rendering and interaction tests using all content
- private AI/RAG tests using all technically validated content
- content review queues
- attribution components
- public-release approval filtering and deployment controls
- automated integrity and regression tests
- production deployment infrastructure

Hold before public launch:

- promotion of unapproved source versions
- public Quran/translation/tafsir/theme display from those sources
- user-facing AI guidance grounded in unapproved content
- commercial redistribution not covered by permission

## Completion Meaning

The complete private software platform, including every content-dependent
feature and all validated datasets, may reach technical and functional
completion while content approval is pending. Public launch readiness remains
incomplete until the content exposed by the public deployment passes rights,
attribution, editorial, scholar/content, and Product Owner approval gates.

## Public Release Rule

No feature is disabled in the complete private platform merely because its
content approval is pending.

Before public launch, RAFIQ must either:

1. obtain approval for every content source used by the intended public
   platform; or
2. create a separately approved public-release scope that excludes content
   lacking approval.

Any exclusion applies only to the public deployment. It must not reduce the
completeness of the private development and testing platform.
