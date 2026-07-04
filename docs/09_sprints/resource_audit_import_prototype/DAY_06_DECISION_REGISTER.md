# Day 6 Hadith Grades And Verification Decision Register

Sprint: RAFIQ Resource Audit & Import Prototype  
Decision gate: Hadith Grades And Verification  
Status: Finalized  
Audit date: 2026-06-14  
Decision date: 2026-06-14  
Approver: Product Owner

## Final Decisions

| ID | Decision | Final Status |
| --- | --- | --- |
| D6-DEC-001 | Grade storage | Separate Source-Attributed Assertions Approved |
| D6-DEC-002 | Grade normalization | Reversible Derived Mapping Required |
| D6-DEC-003 | Grade disagreement | Preserve All Assertions |
| D6-DEC-004 | Grade scope | Hadith, Matn, Isnad, Wording, And Source Scope Required |
| D6-DEC-005 | SemakHadis use | Private Schema And Verification Import Approved |
| D6-DEC-006 | SemakHadis statuses | Classification And Editorial Workflow Kept Separate |
| D6-DEC-007 | Dorar | Access Request And Adapter Candidate |
| D6-DEC-008 | Weak/fabricated content | Retain For Private Verification Workflows |
| D6-DEC-009 | Public presentation | Contextual Policy And Content Approval Required |
| D6-DEC-010 | Unreliable grade fields | Preserve Raw; Exclude From Derived Authority |

## D6-DEC-001: Grade Storage

Store every grade as a separate source-attributed assertion. Do not maintain
one mutable `grade` field as the canonical truth for a hadith.

Each assertion must retain:

- verbatim grade
- grader or authority
- source and source version
- source hadith mapping
- edition and citation where available
- claim scope
- parser and review lineage

## D6-DEC-002: Grade Normalization

Preserve every raw label unchanged. Normalized values are reversible derived
mappings with a mapping version, method, reviewer, and link to the raw
assertion.

Normalization must accommodate composite, bilingual, isnad-specific,
supporting-chain, and free-text judgments. It must not force every source label
into a misleading short enum.

## D6-DEC-003: Grade Disagreement

Conflicting and differing assertions must coexist. The 7,476 Fawaz records in
the broad-label review queue must not be resolved automatically by majority
vote, source order, or a preferred distributor.

Any RAFIQ display summary is a derived editorial product and must retain its
inputs, method, version, and approval.

## D6-DEC-004: Claim Scope

Every grade or verification claim must identify its scope where known:

- hadith or narration
- matn
- isnad
- wording or attribution
- supporting chain
- source absence or lookup result
- collection or edition metadata

Collection reputation must not be silently converted into an individual
narration grade.

## D6-DEC-005: SemakHadis

Import the archived SemakHadis schema, 60-row seed workbook, and 28 mock
records into the private staging and adapter environment with explicit source
and quality flags.

These resources support schema discovery and workflow testing. They do not
represent complete live SemakHadis coverage or a production authority export.

## D6-DEC-006: SemakHadis Status Dimensions

Keep hadith classification separate from editorial workflow.

Classification examples include `sahih`, `hasan`, `dhaif`, `palsu`,
`maudhu`, and `tidak sahih`. Workflow examples include `draf`, `disemak`,
`diterbitkan`, and `dibuang`.

No field, API, interface, or import transform may collapse these dimensions
into one status.

## D6-DEC-007: Dorar

Retain Dorar al-Sunniyyah as an access-request and adapter candidate. RAFIQ
must request permitted API or bulk research access and confirm storage,
caching, attribution, and public-display terms.

The documented endpoint returned HTTP 403 on 2026-06-14. RAFIQ must not bypass
that restriction or claim Dorar coverage before an authorized snapshot is
obtained and validated.

## D6-DEC-008: Weak And Fabricated Content

Retain weak, disputed, no-origin, and fabricated records inside the complete
private platform. They are required for:

- verification search
- misinformation detection
- source comparison
- editorial review
- warning and educational workflows

Classification affects context and public presentation, not private
acquisition or private testing.

## D6-DEC-009: Public Presentation

Public grade and verification claims require:

- source permission and attribution
- complete citations
- clear scholar or authority attribution
- claim-scope accuracy
- reviewed normalization
- contextual warning and display policy
- editorial and scholar/content approval
- Product Owner approval

RAFIQ must never present its normalized label as the verbatim judgment of a
scholar or source.

## D6-DEC-010: Unreliable Grade Fields

Preserve unreliable source fields as raw metadata but exclude them from
authoritative or derived grade summaries unless independently verified.

This applies specifically to Abdullah Naseer's `status` field: all 34,265
records are marked sahih while the repository itself warns that hadith status
is not accurately represented.

## Approval Effect

Approval closes Day 6 and authorizes private import of all downloaded grade
and verification records under the source-attributed architecture.

It does not choose one universal grade, authorize public verification claims,
or imply complete SemakHadis or Dorar coverage.

## Day 6 Closure

Day 6 is formally closed.

Dorar access, the complete live SemakHadis export, source rights, attribution,
normalization review, and public-display approval continue in parallel. They
do not block Day 7 staging architecture or complete private platform work.

