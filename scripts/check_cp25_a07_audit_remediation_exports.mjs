#!/usr/bin/env node
import { createHash } from 'node:crypto';
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

function readJson(filePath) {
  const text = readText(filePath);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`Parse JSON: ${filePath}`, error instanceof Error ? error.message : String(error));
    return null;
  }
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex').toUpperCase();
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

runNodeScript('scripts/check_cp25_a06_internal_ui_action_controls.mjs');

const manifest = readJson('data/review/cp25/a07-export-manifest.json');
const auditExport = readJson('data/review/cp25/a07-audit-event-export.json') || [];
const remediationTransitions = readJson('data/review/cp25/a07-remediation-transition-export.json') || [];
const workloadSummary = readJson('data/review/cp25/a07-reviewer-workload-summary.json');
const unresolvedReport = readJson('data/review/cp25/a07-unresolved-action-report.json');
const reviewQueue = readJson('data/review/cp25/review-queue.json') || [];
const remediationState = readJson('data/review/cp25/remediation-state.json') || [];
const auditEvents = readJson('data/review/cp25/audit-events.json') || [];
const decisionLedger = readJson('data/review/cp25/decision-ledger.json') || [];
const generator = readText('scripts/generate_cp25_a07_audit_remediation_exports.mjs');
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP25_A07_AUDIT_EXPORT_AND_REMEDIATION_REVIEW_PROOF.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_ACCEPTANCE_CHECKLIST.md');

const queueIds = new Set(reviewQueue.map((item) => item.queueItemId));
const remediationIds = new Set(remediationState.map((item) => item.remediationId));
const sourceCp24RemediationIds = new Set(remediationState.map((item) => item.sourceCp24RemediationId));
const auditIds = new Set(auditEvents.map((item) => item.auditEventId));
const ledgerIds = new Set(decisionLedger.map((item) => item.ledgerEntryId));

expect('A07 manifest schema is correct', manifest?.schemaVersion === 'cp25.a07-export-manifest.v1' && manifest?.checkpoint === 'CP25-A07', manifest?.schemaVersion);
expect('A07 workload schema is correct', workloadSummary?.schemaVersion === 'cp25.a07-reviewer-workload-summary.v1' && workloadSummary?.checkpoint === 'CP25-A07', workloadSummary?.schemaVersion);
expect('A07 unresolved report schema is correct', unresolvedReport?.schemaVersion === 'cp25.a07-unresolved-action-report.v1' && unresolvedReport?.checkpoint === 'CP25-A07', unresolvedReport?.schemaVersion);
expect('A07 remains private only', manifest?.privateOnly === true && manifest?.publicReleaseApproved === false && manifest?.publicBoundary?.publicRouteExposed === false, 'private/public false');
expect('Public safe counts remain zero', manifest?.counts?.publicSafeCandidateCount === 0 && manifest?.counts?.publicSafeRouteItemCount === 0 && manifest?.counts?.publicSafeGraphNodeCount === 0 && manifest?.counts?.publicSafeGraphEdgeCount === 0 && manifest?.counts?.publicSafeVaultArtifactCount === 0, 'all zero');

expect('Audit export covers every A04 audit event', auditExport.length === auditEvents.length && auditExport.length === 72, `${auditExport.length}/${auditEvents.length}`);
expect('Remediation transition export covers every ledger entry', remediationTransitions.length === decisionLedger.length && remediationTransitions.length === 72, `${remediationTransitions.length}/${decisionLedger.length}`);
expect('Manifest counts match A07 artifacts', manifest?.counts?.auditExportEventCount === auditExport.length && manifest?.counts?.remediationTransitionCount === remediationTransitions.length && manifest?.counts?.unresolvedActionCount === unresolvedReport?.unresolvedActions?.length, 'counts match');
expect('Audit export links to source A04 events and ledger entries', auditExport.every((item) => auditIds.has(item.sourceAuditEventId) && ledgerIds.has(item.sourceLedgerEntryId)), 'A04 refs');
expect('Audit export remains private and non-public-safe', auditExport.every((item) => item.privateOnly === true && item.publicReleaseApproved === false && item.publicSafeChangeRequested === false), 'private audit export');
expect('Remediation transitions link back to queue and CP24 remediations', remediationTransitions.every((item) => queueIds.has(item.queueItemId) && remediationIds.has(item.remediationStateId) && sourceCp24RemediationIds.has(item.sourceCp24RemediationId)), 'queue/remediation refs');
expect('Remediation transitions preserve previous/new state history', remediationTransitions.every((item) => item.previousState && item.newState && item.statusDiff && item.historyPreserved?.auditEventId === item.auditEventId && item.historyPreserved?.ledgerEntryId === item.ledgerEntryId), 'history preserved');
expect('Resolved/deferred/rejected state buckets are explicit', ['open', 'resolved_private', 'deferred', 'rejected', 'retired'].every((key) => Number.isInteger(manifest?.finalStateSummary?.[key]) && Number.isInteger(workloadSummary?.finalStateSummary?.[key])), 'final state summary');
expect('Rejected states preserve history when present', remediationTransitions.filter((item) => item.terminalState === 'rejected').every((item) => item.historyPreserved?.sourceCp24RemediationId && item.historyPreserved?.auditEventId), 'rejected history');
expect('Reviewer workload summary is complete', workloadSummary?.counts?.reviewerRoleCount === Object.keys(manifest?.roleSummary || {}).length && workloadSummary?.reviewerWorkload?.every((item) => item.reviewerRole && Number.isInteger(item.queueItemCount) && Number.isInteger(item.auditEventCount) && Array.isArray(item.unresolvedQueueItemIds)), 'workload');
expect('Blocker summary remains visible', manifest?.counts?.openBlockingCount === workloadSummary?.counts?.openBlockingCount && manifest?.counts?.highOrCriticalUnresolvedActionCount === unresolvedReport?.counts?.highOrCriticalUnresolvedActionCount, 'blockers');
expect('Unresolved action report references audit and ledger history', unresolvedReport?.unresolvedActions?.every((item) => queueIds.has(item.queueItemId) && item.historyRef?.auditEventId && item.historyRef?.ledgerEntryId && item.privateOnly === true && item.publicReleaseApproved === false), 'unresolved refs');
expect('Open blockers remain visible', unresolvedReport?.counts?.highOrCriticalUnresolvedActionCount === manifest?.counts?.highOrCriticalUnresolvedActionCount && manifest?.counts?.openBlockingCount === workloadSummary?.counts?.openBlockingCount && manifest?.counts?.openBlockingCount > 0, `${manifest?.counts?.openBlockingCount} high/critical open blockers`);

expect('A07 audit export checksum matches manifest', manifest?.checksums?.auditExportSha256 === sha256(JSON.stringify(auditExport)), 'audit checksum');
expect('A07 remediation transition checksum matches manifest', manifest?.checksums?.remediationTransitionExportSha256 === sha256(JSON.stringify(remediationTransitions)), 'transition checksum');
expect('A07 workload checksum matches manifest', manifest?.checksums?.reviewerWorkloadSummarySha256 === sha256(JSON.stringify(workloadSummary)), 'workload checksum');
expect('A07 unresolved action checksum matches manifest', manifest?.checksums?.unresolvedActionReportSha256 === sha256(JSON.stringify(unresolvedReport)), 'unresolved checksum');
expect('Generator documents A07 artifacts', ['a07-audit-event-export.json', 'a07-remediation-transition-export.json', 'a07-reviewer-workload-summary.json', 'a07-unresolved-action-report.json', 'a07-export-manifest.json'].every((term) => generator.includes(term)), 'generator paths');

for (const term of [
  '# CP25-A07 - Audit Export And Remediation Review Proof',
  'Status: Complete',
  '72 audit events',
  '72 remediation transitions',
  'unresolved action report',
  'public-safe counts remain zero',
  'node scripts\\generate_cp25_a07_audit_remediation_exports.mjs',
  'node scripts\\check_cp25_a07_audit_remediation_exports.mjs',
]) {
  expect(`A07 report includes ${term}`, report.includes(term), term);
}

expect('Sprint plan marks A07 complete or later', sprintPlan.includes('Status: CP25-A07 complete; CP25-A08 pending') || sprintPlan.includes('Status: CP25-A08 complete; CP25-A09 pending') || sprintPlan.includes('Status: CP25 complete; recommended next scope CP26'), 'sprint status');
expect('Sprint plan points to A07 report', sprintPlan.includes('CP25_A07_AUDIT_EXPORT_AND_REMEDIATION_REVIEW_PROOF.md'), 'A07 linked');
expect('Sprint plan recommends A08 through CP26 next', sprintPlan.includes('CP25-A08 - Combined Verification') || sprintPlan.includes('CP25-A09 - Close-Out And Next Scope Decision') || sprintPlan.includes('CP26 - Live Snapshot Export And Refresh'), 'next checkpoint');
expect('Checklist marks A07 complete or later', checklist.includes('Status: CP25-A07 complete; CP25-A08 pending') || checklist.includes('Status: CP25-A08 complete; CP25-A09 pending') || checklist.includes('Status: CP25 complete; recommended next scope CP26'), 'checklist status');
expect('Checklist A07 rows pass', ['CP25-A07-01', 'CP25-A07-02', 'CP25-A07-03', 'CP25-A07-04', 'CP25-A07-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'A07 rows pass');
expect('Checklist recommends A08 through CP26 next', checklist.includes('Start `CP25-A08 - Combined Verification`') || checklist.includes('Start `CP25-A09 - Close-Out And Next Scope Decision`') || checklist.includes('Start `CP26 - Live Snapshot Export And Refresh`'), 'next checkpoint');
expect('No env file path access introduced', !/['"]\.env/.test(`${generator}\n${report}\n${sprintPlan}\n${checklist}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP25-A07 audit export and remediation review proof verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP25-A07 audit export and remediation review proof verification passed.');
