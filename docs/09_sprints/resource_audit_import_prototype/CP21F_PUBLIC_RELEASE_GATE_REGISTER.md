# CP21F - Public Release Gate Register

Date: 2026-07-07  
Status: Register Pass; public release remains NO-GO

## Objective

Prevent accidental public-readiness claims by listing the gates required before RAFIQ can move beyond private local/staging use.

## Release Decision

Current release state: `NO-GO`.

This register does not approve public release. It defines what must be true later.

## Public Release Gates

| Gate | Status | Required Evidence |
| --- | --- | --- |
| Product Owner launch approval | Blocked | Product Owner signed GO after target-device UAT and final inspection. |
| Rights and licensing approval | Blocked | Source register completed with permitted public/commercial use and attribution wording. |
| Quran text integrity | Blocked | Approved Quran display source, checksum/integrity record, attribution. |
| Translation approval | Blocked | Approved translation editions and attribution for each public language. |
| Tafsir approval | Blocked | Approved tafsir sources/summaries and attribution. |
| Hadith provenance and grade approval | Blocked | Collection/reference/text/grade provenance verified and public rights cleared. |
| Scholar/content review | Blocked | Reviewed guidance packages for MVP themes and sensitive boundary rules. |
| Risk and safety escalation | Blocked | Scholar/safety/medical/legal/crisis escalation states implemented and tested. |
| Public/private API separation | Blocked | Public deployment cannot access private-only content, review queues, traces, or unapproved source states. |
| Privacy and memory controls | Blocked | User memory has privacy policy, export/delete behavior, and no public leakage. |
| Accessibility/mobile QA | Blocked | Target-device QA passes with no overflow, no unreadable text, and no developer wording. |
| Rollback and audit trail | Blocked | Content rollback and affected guidance regeneration process is documented and tested. |

## MVP Theme Review Requirement

Before public launch, RAFIQ needs reviewed guidance packages for:

- tawakkul;
- sabr;
- shukr;
- tawbah;
- rahmah;
- hope;
- anxiety/worry;
- sadness;
- motivation;
- prayer consistency.

## Implementation Acceptance

CP21F is accepted as a register when:

- every public release gate is listed;
- every gate is blocked unless evidence exists;
- public/private separation is explicit;
- source licensing and content governance docs remain the authority;
- no current doc claims RAFIQ is public-release ready.

## Next

Public release remains blocked until this register is converted into implemented checks and approvals.
