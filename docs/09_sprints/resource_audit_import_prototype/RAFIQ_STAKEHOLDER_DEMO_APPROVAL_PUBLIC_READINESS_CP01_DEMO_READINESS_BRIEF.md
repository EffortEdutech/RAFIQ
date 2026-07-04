# RAFIQ Stakeholder Demo And Public-Readiness CP01 Demo Readiness Brief

Date completed: 2026-06-25  
Sprint: RAFIQ Stakeholder Demo, Approval Workflow, And Public-Readiness Hardening  
Checkpoint: CP01 - Sprint Setup And Demo Readiness Brief  
Status: Approved for CP02 Stakeholder Demo Script And Runbook

## Objective

Start the post-UI sprint by defining how RAFIQ will be reviewed, who makes decisions, and what remains blocked.

## Demo Promise

Stakeholders should be able to open RAFIQ locally and understand:

- what RAFIQ is;
- how public search behaves while content is not approved;
- how public guided answers block without approved evidence;
- how Quran and Hadith reading surfaces will feel;
- how source status and approval labels protect the public release process;
- why the product is ready for private review but not public launch.

## Review Mode

This sprint uses private/local review mode only.

Allowed demo surfaces:

- `/public`;
- `/public/search`;
- `/public/answer`;
- `/public/quran`;
- `/public/hadith`;
- `/public/source/...`;
- private pages only if explicitly marked as internal and not part of public launch approval.

## Non-Launch Boundary

The following remain NO-GO:

- public launch;
- public beta;
- public real-content display;
- public model execution;
- unapproved content release;
- hosted-public deployment without security and rollback gates.

## Review Roles

| Role | CP01 Responsibility |
| --- | --- |
| Product Owner | Confirms the sprint scope and owns public-scope decisions. |
| Technical Owner | Prepares demo runbook, hardening checklist, and implementation implications. |
| Content/Scholar Reviewers | Identify source/content review requirements and religious guidance boundaries. |
| Editorial Reviewer | Reviews wording, attribution clarity, and public-facing tone. |
| Operations/Security Reviewer | Reviews hosted-public deployment readiness and rollback/takedown risks. |

## Initial Demo Path

The CP02 runbook should cover:

1. RAFIQ home and first-screen promise;
2. public search with zero approved public content;
3. guided answer blocked by no approved evidence;
4. Quran preview surface;
5. Hadith preview surface;
6. source detail and approval status;
7. final public release boundary.

## Initial Acceptance Questions

Stakeholders should answer:

- Does RAFIQ feel trustworthy and calm?
- Is the approval boundary understandable?
- Are empty/blocked states clear rather than broken?
- Are source and approval labels visible enough?
- What must change before public-readiness implementation?

## CP01 Decision

CP01 is approved.

Proceed to CP02: Stakeholder Demo Script And Runbook.
