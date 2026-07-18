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

function readText(path) {
  if (!existsSync(path)) {
    fail(`File exists: ${path}`, 'Missing.');
    return '';
  }
  pass(`File exists: ${path}`, 'Found.');
  return readFileSync(path, 'utf8');
}

function readJson(path) {
  const text = readText(path);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`Parse JSON: ${path}`, error instanceof Error ? error.message : String(error));
    return null;
  }
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

runNodeScript('scripts/check_cp22_combined_verification.mjs');
runNodeScript('scripts/check_cp23_private_prototype.mjs');
runNodeScript('scripts/check_cp23_reviewer_exports.mjs');

const shared = readText('packages/shared/src/private-content.ts');
const controller = readText('apps/api/src/modules/private-content/private-content.controller.ts');
const service = readText('apps/api/src/modules/private-content/private-content.service.ts');
const openapi = readText('apps/api/src/modules/private-content/private-content.openapi.ts');
const mobileApi = readText('apps/mobile/src/services/privateContentApi.ts');
const mobileScreen = readText('apps/mobile/app/review-workbench.tsx');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP23_RETRIEVAL_INTEGRATION_AND_REVIEWER_WORKFLOW_ACCEPTANCE_CHECKLIST.md');
const a06Report = readText('docs/09_sprints/resource_audit_import_prototype/CP23_A06_PRIVATE_PROTOTYPE_IMPLEMENTATION_REPORT.md');
const a07Report = readText('docs/09_sprints/resource_audit_import_prototype/CP23_A07_REVIEWER_AUDIT_TRAIL_AND_REMEDIATION_EXPORT_REPORT.md');
const a08Report = readText('docs/09_sprints/resource_audit_import_prototype/CP23_A08_COMBINED_VERIFICATION_REPORT.md');
const manifest = readJson('data/review/cp23/manifest.json');
const auditTrail = readJson('data/review/cp23/audit-trail-export.json') || [];
const remediation = readJson('data/review/cp23/remediation-export.json') || [];

expect('A06 checklist pass row exists', checklist.includes('| CP23-A06 | Private prototype implementation is complete. | Pass |'), 'CP23-A06 Pass');
expect('A07 checklist pass row exists', checklist.includes('| CP23-A07 | Reviewer audit trail and remediation export are complete. | Pass |'), 'CP23-A07 Pass');
expect('A08 checklist pass row exists', checklist.includes('| CP23-A08 | Combined verification is complete. | Pass |'), 'CP23-A08 Pass');
expect('A06 report retains private boundary', a06Report.includes('bounded private read-only prototype'), 'bounded private read-only prototype');
expect('A07 report retains private export boundary', a07Report.includes('private-only reviewer audit trail and remediation export'), 'private-only reviewer audit trail and remediation export');
expect('A08 report documents combined gate', a08Report.includes('combined verifier for CP23-A06 and CP23-A07'), 'combined verifier for CP23-A06 and CP23-A07');

expect('Shared workbench response exists', shared.includes('PrivateReviewWorkbenchCp23Response'), 'PrivateReviewWorkbenchCp23Response');
expect('Shared reviewer export bundle exists', shared.includes('PrivateCp23ReviewerExports'), 'PrivateCp23ReviewerExports');
expect('Private API route only', controller.includes("@Get('review-workbench/cp23')") && controller.includes("@Controller('private-content')"), 'private-content/review-workbench/cp23');
expect('No public CP23 route is introduced', !controller.includes("@Controller('public") && !controller.includes("public-content/review-workbench"), 'no public controller route');
expect('Service reads CP22 graph baseline', service.includes('CP22_GRAPH_MANIFEST_PATH') && service.includes('CP22_VAULT_MANIFEST_PATH'), 'CP22 graph/vault baseline');
expect('Service reads A07 exports', service.includes('CP23_REVIEW_EXPORT_MANIFEST_PATH') && service.includes('reviewerExports'), 'A07 reviewerExports');
expect('OpenAPI documents reviewerExports', openapi.includes('reviewerExports'), 'reviewerExports DTO');
expect('Mobile API exposes workbench call', mobileApi.includes('getReviewWorkbenchCp23'), 'getReviewWorkbenchCp23');
expect('Mobile screen shows A06 route proof', mobileScreen.includes('EvidenceRoutePanel') && mobileScreen.includes('Reviewer Queue'), 'A06 UI panels');
expect('Mobile screen shows A07 export proof', mobileScreen.includes('A07 Export Proof') && mobileScreen.includes('payload.reviewerExports'), 'A07 UI panel');

expect('Export manifest checkpoint is A07', manifest?.checkpoint === 'CP23-A07', manifest?.checkpoint);
expect('Export manifest remains private-only', manifest?.privateOnly === true, String(manifest?.privateOnly));
expect('Export manifest blocks public release', manifest?.publicReleaseApproved === false, String(manifest?.publicReleaseApproved));
expect('Export audit/remediation counts match files', manifest?.counts?.auditEvents === auditTrail.length && manifest?.counts?.remediationItems === remediation.length, `${manifest?.counts?.auditEvents}/${auditTrail.length}; ${manifest?.counts?.remediationItems}/${remediation.length}`);
expect('Export payloads are bounded', auditTrail.length > 0 && auditTrail.length <= 8 && remediation.length > 0 && remediation.length <= 8, `${auditTrail.length}/${remediation.length}`);
expect('Audit events have review transitions', auditTrail.every((event) => event.action && event.fromStatus && event.toStatus && event.reviewerRole), 'action/from/to/reviewerRole');
expect('Remediation items have closure paths', remediation.every((item) => item.ownerRole && item.issueType && item.requiredAction && item.verificationMethod && item.closurePath), 'owner/issue/action/verification/closure');
expect('Public-safe boundary remains explicit', service.includes('publicSafeCandidateCount: 0') && service.includes('publicReleaseApproved: false'), 'publicSafeCandidateCount 0 and release false');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP23-A08 combined verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP23-A08 combined verification passed.');
