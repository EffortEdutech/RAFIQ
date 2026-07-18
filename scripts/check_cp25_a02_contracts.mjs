#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const checks = [];

function pass(name, evidence) {
  checks.push({ name, status: 'PASS', evidence });
}

function fail(name, evidence) {
  checks.push({ name, status: 'FAIL', evidence });
}

function expect(name, condition, evidence) {
  if (condition) pass(name, evidence);
  else fail(name, evidence);
}

function readText(filePath) {
  if (!existsSync(filePath)) {
    fail(`File exists: ${filePath}`, 'Missing.');
    return '';
  }
  pass(`File exists: ${filePath}`, 'Found.');
  return readFileSync(filePath, 'utf8');
}

function runNodeScript(scriptPath) {
  const result = spawnSync(process.execPath, [scriptPath], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.status === 0) {
    pass(`Run ${scriptPath}`, result.stdout.trim().split(/\r?\n/).at(-1) || 'ok');
  } else {
    fail(`Run ${scriptPath}`, `${result.stdout}${result.stderr}`);
  }
}

runNodeScript('scripts/check_cp25_a01_action_workflow_plan.mjs');

const shared = readText('packages/shared/src/private-content.ts');
const a02Doc = readText('docs/09_sprints/resource_audit_import_prototype/CP25_A02_REQUEST_RESPONSE_AND_STATE_CONTRACTS.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_ACCEPTANCE_CHECKLIST.md');

for (const typeName of [
  'PrivateCp25ReviewerRole',
  'PrivateCp25ReviewStatus',
  'PrivateCp25ReviewerAction',
  'PrivateCp25ReviewQueueType',
  'PrivateCp25ReviewSubjectType',
  'PrivateCp25RemediationStatus',
  'PrivateCp25PublicBoundary',
  'PrivateCp25ReviewQueueItem',
  'PrivateCp25RemediationState',
  'PrivateCp25ReviewerActionRequest',
  'PrivateCp25ReviewerActionValidation',
  'PrivateCp25ReviewAuditEvent',
  'PrivateCp25ReviewerActionResponse',
  'PrivateCp25WorkbenchStateResponse',
]) {
  expect(`Shared contract includes ${typeName}`, shared.includes(`export type ${typeName}`), typeName);
}

expect('CP25 roles are explicit', ['technical_reviewer', 'knowledge_editor', 'scholar_reviewer', 'product_owner', 'admin', 'developer_private'].every((term) => shared.includes(`'${term}'`)), 'role union');
expect('CP25 statuses are explicit', ['queued', 'in_review', 'technical_review', 'content_review', 'scholar_review', 'product_owner_review', 'remediation_required', 'resolved_private', 'approved_public_candidate', 'rejected', 'retired', 'deferred'].every((term) => shared.includes(`'${term}'`)), 'status union');
expect('CP25 actions are explicit', ['claim', 'request_technical_review', 'request_content_review', 'request_scholar_review', 'request_product_owner_review', 'request_remediation', 'approve_private', 'mark_public_candidate', 'reject', 'defer', 'retire'].every((term) => shared.includes(`'${term}'`)), 'action union');
expect('CP25 remediation states are explicit', ['open', 'assigned', 'in_progress', 'blocked', 'resolved_private', 'deferred', 'rejected', 'retired'].every((term) => shared.includes(`'${term}'`)), 'remediation states');
expect('Action request has explicit target and refs', ['queueItemId: string', 'subjectType: PrivateCp25ReviewSubjectType', 'subjectId: string', 'fromStatus:', 'reviewerRole: PrivateCp25ReviewerRole', 'affectedSourceIds: string[]', 'affectedGraphNodeIds: string[]', 'affectedGraphEdgeIds: string[]', 'affectedVaultPackIds: string[]', 'affectedEvidenceRouteIds: string[]', 'affectedRouteItemIds: string[]', 'affectedCandidateIds: string[]', 'affectedRemediationIds: string[]'].every((term) => shared.includes(term)), 'request fields');
expect('Action validation exposes transition and notes checks', shared.includes('notesRequired: boolean') && shared.includes('missingRequiredNotes: boolean') && shared.includes('invalidTransition: boolean') && shared.includes('blockedReasons: string[]'), 'validation fields');
expect('Audit event captures from/to and notes', shared.includes('fromStatus: PrivateCp25ReviewStatus | PrivateCp25RemediationStatus') && shared.includes('toStatus: PrivateCp25ReviewStatus | PrivateCp25RemediationStatus') && shared.includes('notes: string') && shared.includes('createdAt: string'), 'audit fields');
expect('Public boundary is false by type', shared.includes('privateOnly: true') && shared.includes('publicReleaseApproved: false') && shared.includes('publicRouteExposed: false') && shared.includes('publicSafeChangeRequested: false') && shared.includes('publicSafeCandidateCount: 0') && shared.includes('publicSafeRouteItemCount: 0') && shared.includes('publicSafeGraphNodeCount: 0') && shared.includes('publicSafeGraphEdgeCount: 0') && shared.includes('publicSafeVaultArtifactCount: 0'), 'false public boundary');
expect('CP25 routes are private namespace contracts', shared.includes("route: 'POST /api/private-content/reviewer-workbench/cp25/actions'") && shared.includes("route: 'GET /api/private-content/reviewer-workbench/cp25'"), 'private routes');

for (const term of [
  '# CP25-A02 - Request, Response, And State Contracts',
  'Status: Complete',
  'PrivateCp25ReviewerActionRequest',
  'PrivateCp25ReviewerActionResponse',
  'PrivateCp25ReviewQueueItem',
  'PrivateCp25RemediationState',
  'PrivateCp25ReviewAuditEvent',
  'PrivateCp25PublicBoundary',
  'publicSafeChangeRequested: false',
  'Status: complete',
]) {
  expect(`A02 doc includes ${term}`, a02Doc.includes(term), term);
}

expect('A02 doc records verifier command', a02Doc.includes('node scripts\\check_cp25_a02_contracts.mjs'), 'verifier command');
expect('A02 doc records shared build command', a02Doc.includes('corepack pnpm -C packages/shared build'), 'shared build command');
expect('No env file path access introduced', !/['"]\.env/.test(`${shared}\n${a02Doc}\n${sprintPlan}\n${checklist}`), 'no .env path');
expect('Sprint plan marks A02 complete or later', sprintPlan.includes('Status: CP25-A02 complete; CP25-A03 pending') || sprintPlan.includes('Status: CP25-A03 complete; CP25-A04 pending') || sprintPlan.includes('Status: CP25-A04 complete; CP25-A05 pending') || sprintPlan.includes('Status: CP25-A05 complete; CP25-A06 pending') || sprintPlan.includes('Status: CP25-A06 complete; CP25-A07 pending') || sprintPlan.includes('Status: CP25-A07 complete; CP25-A08 pending') || sprintPlan.includes('Status: CP25-A08 complete; CP25-A09 pending') || sprintPlan.includes('Status: CP25 complete; recommended next scope CP26'), 'sprint status');
expect('Sprint plan points to A02 report', sprintPlan.includes('CP25_A02_REQUEST_RESPONSE_AND_STATE_CONTRACTS.md'), 'A02 linked');
expect('Sprint plan recommends A03 through CP26 next', sprintPlan.includes('CP25-A03 - Review Queue And Remediation State Export') || sprintPlan.includes('CP25-A04 - Audit Event And Decision Ledger') || sprintPlan.includes('CP25-A05 - Private API Prototype') || sprintPlan.includes('CP25-A06 - Internal UI Action Controls') || sprintPlan.includes('CP25-A07 - Audit Export And Remediation Review Proof') || sprintPlan.includes('CP25-A08 - Combined Verification') || sprintPlan.includes('CP25-A09 - Close-Out And Next Scope Decision') || sprintPlan.includes('CP26 - Live Snapshot Export And Refresh'), 'next checkpoint');
expect('Checklist marks A02 complete or later', checklist.includes('Status: CP25-A02 complete; CP25-A03 pending') || checklist.includes('Status: CP25-A03 complete; CP25-A04 pending') || checklist.includes('Status: CP25-A04 complete; CP25-A05 pending') || checklist.includes('Status: CP25-A05 complete; CP25-A06 pending') || checklist.includes('Status: CP25-A06 complete; CP25-A07 pending') || checklist.includes('Status: CP25-A07 complete; CP25-A08 pending') || checklist.includes('Status: CP25-A08 complete; CP25-A09 pending') || checklist.includes('Status: CP25 complete; recommended next scope CP26'), 'checklist status');
expect('Checklist A02 rows pass', ['CP25-A02-01', 'CP25-A02-02', 'CP25-A02-03', 'CP25-A02-04', 'CP25-A02-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'A02 rows pass');
expect('Checklist recommends A03 through CP26 next', checklist.includes('Start `CP25-A03 - Review Queue And Remediation State Export`') || checklist.includes('Start `CP25-A04 - Audit Event And Decision Ledger`') || checklist.includes('Start `CP25-A05 - Private API Prototype`') || checklist.includes('Start `CP25-A06 - Internal UI Action Controls`') || checklist.includes('Start `CP25-A07 - Audit Export And Remediation Review Proof`') || checklist.includes('Start `CP25-A08 - Combined Verification`') || checklist.includes('Start `CP25-A09 - Close-Out And Next Scope Decision`') || checklist.includes('Start `CP26 - Live Snapshot Export And Refresh`'), 'next checkpoint');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP25-A02 contract verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP25-A02 contract verification passed.');
