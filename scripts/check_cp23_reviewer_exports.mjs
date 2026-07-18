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

function readJson(path) {
  if (!existsSync(path)) {
    fail(`File exists: ${path}`, 'Missing.');
    return null;
  }
  pass(`File exists: ${path}`, 'Found.');
  return JSON.parse(readFileSync(path, 'utf8'));
}

function expect(name, condition, evidence) {
  if (condition) pass(name, evidence);
  else fail(name, evidence);
}

function runNodeScript(scriptPath) {
  const result = spawnSync(process.execPath, [scriptPath], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.status === 0) {
    pass(`Run ${scriptPath}`, result.stdout.trim().split(/\r?\n/).at(-1) || 'ok');
  } else {
    fail(`Run ${scriptPath}`, result.stdout + result.stderr);
  }
}

runNodeScript('scripts/check_cp23_private_prototype.mjs');
runNodeScript('scripts/generate_cp23_reviewer_exports.mjs');

const manifest = readJson('data/review/cp23/manifest.json');
const auditTrail = readJson('data/review/cp23/audit-trail-export.json') || [];
const remediation = readJson('data/review/cp23/remediation-export.json') || [];
const shared = existsSync('packages/shared/src/private-content.ts')
  ? readFileSync('packages/shared/src/private-content.ts', 'utf8')
  : '';
const service = existsSync('apps/api/src/modules/private-content/private-content.service.ts')
  ? readFileSync('apps/api/src/modules/private-content/private-content.service.ts', 'utf8')
  : '';
const mobileScreen = existsSync('apps/mobile/app/review-workbench.tsx')
  ? readFileSync('apps/mobile/app/review-workbench.tsx', 'utf8')
  : '';
const checklist = existsSync('docs/09_sprints/resource_audit_import_prototype/CP23_RETRIEVAL_INTEGRATION_AND_REVIEWER_WORKFLOW_ACCEPTANCE_CHECKLIST.md')
  ? readFileSync('docs/09_sprints/resource_audit_import_prototype/CP23_RETRIEVAL_INTEGRATION_AND_REVIEWER_WORKFLOW_ACCEPTANCE_CHECKLIST.md', 'utf8')
  : '';
const report = existsSync('docs/09_sprints/resource_audit_import_prototype/CP23_A07_REVIEWER_AUDIT_TRAIL_AND_REMEDIATION_EXPORT_REPORT.md')
  ? readFileSync('docs/09_sprints/resource_audit_import_prototype/CP23_A07_REVIEWER_AUDIT_TRAIL_AND_REMEDIATION_EXPORT_REPORT.md', 'utf8')
  : '';

expect('Manifest checkpoint is CP23-A07', manifest?.checkpoint === 'CP23-A07', manifest?.checkpoint);
expect('Manifest is private-only', manifest?.privateOnly === true, String(manifest?.privateOnly));
expect('Manifest blocks public release approval', manifest?.publicReleaseApproved === false, String(manifest?.publicReleaseApproved));
expect('Manifest counts audit trail', manifest?.counts?.auditEvents === auditTrail.length, `${manifest?.counts?.auditEvents}/${auditTrail.length}`);
expect('Manifest counts remediation', manifest?.counts?.remediationItems === remediation.length, `${manifest?.counts?.remediationItems}/${remediation.length}`);
expect('Audit trail is bounded and non-empty', auditTrail.length > 0 && auditTrail.length <= 8, String(auditTrail.length));
expect('Remediation export is bounded and non-empty', remediation.length > 0 && remediation.length <= 8, String(remediation.length));

for (const event of auditTrail) {
  expect(`Audit event has queue item: ${event.auditEventId}`, Boolean(event.queueItemId), event.queueItemId);
  expect(`Audit event has action: ${event.auditEventId}`, Boolean(event.action), event.action);
  expect(`Audit event has from/to status: ${event.auditEventId}`, Boolean(event.fromStatus && event.toStatus), `${event.fromStatus}->${event.toStatus}`);
  expect(`Audit event has reviewer role: ${event.auditEventId}`, Boolean(event.reviewerRole), event.reviewerRole);
  expect(`Audit event has notes: ${event.auditEventId}`, Boolean(event.notes), event.notes);
  expect(`Audit event has graph refs: ${event.auditEventId}`, Array.isArray(event.graphNodeIds) && event.graphNodeIds.length > 0, JSON.stringify(event.graphNodeIds));
}

for (const item of remediation) {
  expect(`Remediation has owner: ${item.remediationId}`, Boolean(item.ownerRole), item.ownerRole);
  expect(`Remediation has issue type: ${item.remediationId}`, Boolean(item.issueType), item.issueType);
  expect(`Remediation has required action: ${item.remediationId}`, Boolean(item.requiredAction), item.requiredAction);
  expect(`Remediation has verification method: ${item.remediationId}`, Boolean(item.verificationMethod), item.verificationMethod);
  expect(`Remediation has closure path: ${item.remediationId}`, Boolean(item.closurePath), item.closurePath);
  expect(`Remediation has graph refs: ${item.remediationId}`, Array.isArray(item.graphNodeIds) && item.graphNodeIds.length > 0, JSON.stringify(item.graphNodeIds));
}

expect('Shared reviewer export contract exists', shared.includes('PrivateCp23ReviewerExports'), 'PrivateCp23ReviewerExports');
expect('Service reads export manifest', service.includes('CP23_REVIEW_EXPORT_MANIFEST_PATH'), 'CP23_REVIEW_EXPORT_MANIFEST_PATH');
expect('Service exposes reviewerExports', service.includes('reviewerExports'), 'reviewerExports');
expect('Mobile screen shows A07 export proof', mobileScreen.includes('A07 Export Proof'), 'A07 Export Proof');
expect('Checklist marks CP23-A07 Pass', checklist.includes('| CP23-A07 | Reviewer audit trail and remediation export are complete. | Pass |'), 'CP23-A07 Pass row');
expect('Report documents private export boundary', report.includes('private-only reviewer audit trail and remediation export'), 'private-only reviewer audit trail and remediation export');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP23-A07 reviewer export verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP23-A07 reviewer audit trail and remediation export verification passed.');
