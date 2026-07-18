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

runNodeScript('scripts/check_cp22_combined_verification.mjs');
runNodeScript('scripts/check_cp23_close_out.mjs');
runNodeScript('scripts/check_cp24_close_out.mjs');
runNodeScript('scripts/check_cp25_a07_audit_remediation_exports.mjs');

const cp22GraphManifest = readJson('data/graphify/full-private/manifest.json');
const cp22VaultManifest = readJson('data/vault/full-private/manifest.json');
const cp24Manifest = readJson('data/retrieval/cp24/manifest.json');
const cp24Handoff = readJson('data/retrieval/cp24/validation-handoff.json');
const cp25A03Manifest = readJson('data/review/cp25/manifest.json');
const cp25A04Manifest = readJson('data/review/cp25/audit-decision-ledger-manifest.json');
const cp25A07Manifest = readJson('data/review/cp25/a07-export-manifest.json');
const cp25AuditExport = readJson('data/review/cp25/a07-audit-event-export.json') || [];
const cp25RemediationTransitions = readJson('data/review/cp25/a07-remediation-transition-export.json') || [];
const cp25UnresolvedReport = readJson('data/review/cp25/a07-unresolved-action-report.json');
const shared = readText('packages/shared/src/private-content.ts');
const controller = readText('apps/api/src/modules/private-content/private-content.controller.ts');
const service = readText('apps/api/src/modules/private-content/private-content.service.ts');
const dto = readText('apps/api/src/modules/private-content/private-content.dto.ts');
const openapi = readText('apps/api/src/modules/private-content/private-content.openapi.ts');
const mobileApi = readText('apps/mobile/src/services/privateContentApi.ts');
const reviewWorkbench = readText('apps/mobile/app/review-workbench.tsx');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_ACCEPTANCE_CHECKLIST.md');
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP25_A08_COMBINED_VERIFICATION.md');

expect('CP22 full private graph remains private', cp22GraphManifest?.deploymentMode === 'private_local' && cp22GraphManifest?.accessLevel === 'developer_private' && cp22GraphManifest?.publicSafe === false, 'CP22 graph private');
expect('CP22 public-safe graph counts remain zero', cp22GraphManifest?.counts?.publicSafeNodes === 0 && cp22GraphManifest?.counts?.publicSafeEdges === 0, JSON.stringify(cp22GraphManifest?.counts));
expect('CP22 vault remains private with zero public-safe artifacts', cp22VaultManifest?.accessLevel === 'developer_private' && cp22VaultManifest?.publicSafe === false && cp22VaultManifest?.requiredBoundary?.publicReleaseApproved === false && cp22VaultManifest?.counts?.publicSafeArtifacts === 0, JSON.stringify(cp22VaultManifest?.counts));

expect('CP24 close-out baseline remains private', cp24Manifest?.privateOnly === true && cp24Manifest?.publicReleaseApproved === false, 'CP24 private');
expect('CP24 selected candidates and public-safe counts remain stable', cp24Manifest?.counts?.fixtureCount === 10 && cp24Manifest?.counts?.rankingSelection?.selectedCandidateCount === 15 && cp24Manifest?.counts?.rankingSelection?.publicSafeCandidateCount === 0, JSON.stringify(cp24Manifest?.counts));
expect('CP24 validation handoff keeps remediation and public boundary', cp24Handoff?.summary?.remediationCount === 72 && cp24Handoff?.summary?.publicSafeRouteItemCount === 0 && cp24Handoff?.publicBoundary?.publicReleaseApproved === false, JSON.stringify(cp24Handoff?.summary));

expect('CP25 A03 workbench state remains private', cp25A03Manifest?.privateOnly === true && cp25A03Manifest?.publicReleaseApproved === false && cp25A03Manifest?.counts?.queueItemCount === 72 && cp25A03Manifest?.counts?.publicSafeCandidateCount === 0, JSON.stringify(cp25A03Manifest?.counts));
expect('CP25 A04 audit ledger remains private', cp25A04Manifest?.privateOnly === true && cp25A04Manifest?.publicReleaseApproved === false && cp25A04Manifest?.counts?.auditEventCount === 72 && cp25A04Manifest?.counts?.publicSafeCandidateCount === 0, JSON.stringify(cp25A04Manifest?.counts));
expect('CP25 A07 export manifest remains private', cp25A07Manifest?.schemaVersion === 'cp25.a07-export-manifest.v1' && cp25A07Manifest?.privateOnly === true && cp25A07Manifest?.publicReleaseApproved === false, cp25A07Manifest?.schemaVersion);
expect('CP25 A07 export counts remain stable', cp25A07Manifest?.counts?.auditExportEventCount === 72 && cp25A07Manifest?.counts?.remediationTransitionCount === 72 && cp25A07Manifest?.counts?.unresolvedActionCount === 66 && cp25A07Manifest?.counts?.openBlockingCount === 12, JSON.stringify(cp25A07Manifest?.counts));
expect('CP25 public-safe counts remain zero across A07', ['publicSafeCandidateCount', 'publicSafeRouteItemCount', 'publicSafeGraphNodeCount', 'publicSafeGraphEdgeCount', 'publicSafeVaultArtifactCount'].every((key) => cp25A07Manifest?.counts?.[key] === 0), JSON.stringify(cp25A07Manifest?.counts));
expect('CP25 audit and remediation exports preserve history', cp25AuditExport.length === 72 && cp25RemediationTransitions.length === 72 && cp25RemediationTransitions.every((item) => item.historyPreserved?.auditEventId && item.historyPreserved?.ledgerEntryId), 'A07 history');
expect('CP25 unresolved report keeps blockers inspectable', cp25UnresolvedReport?.counts?.unresolvedActionCount === 66 && cp25UnresolvedReport?.counts?.highOrCriticalUnresolvedActionCount === 12, JSON.stringify(cp25UnresolvedReport?.counts));

expect('Shared CP25 contracts exist', ['PrivateCp25ReviewerActionRequest', 'PrivateCp25ReviewerActionResponse', 'PrivateCp25WorkbenchStateResponse', 'PrivateCp25ReviewAuditEvent'].every((term) => shared.includes(term)), 'shared CP25 contracts');
expect('Private CP25 API routes exist and no public CP25 route exists', controller.includes("@Get('reviewer-workbench/cp25')") && controller.includes("@Post('reviewer-workbench/cp25/actions')") && !controller.includes('/api/public') && !controller.includes("public-content/reviewer-workbench/cp25"), 'private controller routes');
expect('CP25 service validates actions and public boundary', service.includes('cp25ValidateReviewerAction') && service.includes('Public-safe change requests are outside CP25') && service.includes('Public release approval is outside CP25'), 'service validation');
expect('CP25 DTO/OpenAPI boundary fields exist', dto.includes('PrivateCp25BoundaryAcknowledgementDto') && openapi.includes('PrivateCp25ReviewerActionResponseDto') && openapi.includes('POST /api/private-content/reviewer-workbench/cp25/actions'), 'DTO/OpenAPI');
expect('Mobile private client and UI remain internal only', mobileApi.includes('/api/private-content/reviewer-workbench/cp25') && reviewWorkbench.includes('PrivateModeRibbon') && reviewWorkbench.includes('Public release blocked') && reviewWorkbench.includes('Preview audit event'), 'mobile private UI');

for (const term of [
  '# CP25-A08 - Combined Verification',
  'Status: Complete',
  'node scripts\\check_cp25_a08_combined_verification.mjs',
  'scripts/check_cp22_combined_verification.mjs',
  'scripts/check_cp23_close_out.mjs',
  'scripts/check_cp24_close_out.mjs',
  'scripts/check_cp25_a07_audit_remediation_exports.mjs',
  'public-safe counts remain zero',
]) {
  expect(`A08 report includes ${term}`, report.includes(term), term);
}

expect('Sprint plan marks A08 complete or later', sprintPlan.includes('Status: CP25-A08 complete; CP25-A09 pending') || sprintPlan.includes('Status: CP25 complete; recommended next scope CP26'), 'sprint status');
expect('Sprint plan points to A08 report', sprintPlan.includes('CP25_A08_COMBINED_VERIFICATION.md'), 'A08 linked');
expect('Sprint plan recommends A09 or CP26 next', sprintPlan.includes('CP25-A09 - Close-Out And Next Scope Decision') || sprintPlan.includes('CP26 - Live Snapshot Export And Refresh'), 'next checkpoint');
expect('Checklist marks A08 complete or later', checklist.includes('Status: CP25-A08 complete; CP25-A09 pending') || checklist.includes('Status: CP25 complete; recommended next scope CP26'), 'checklist status');
expect('Checklist A08 rows pass', ['CP25-A08-01', 'CP25-A08-02', 'CP25-A08-03', 'CP25-A08-04', 'CP25-A08-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'A08 rows pass');
expect('Checklist recommends A09 or CP26 next', checklist.includes('Start `CP25-A09 - Close-Out And Next Scope Decision`') || checklist.includes('Start `CP26 - Live Snapshot Export And Refresh`'), 'next checkpoint');
expect('No env file path access introduced', !/['"]\.env/.test(`${shared}\n${controller}\n${service}\n${dto}\n${openapi}\n${mobileApi}\n${reviewWorkbench}\n${sprintPlan}\n${checklist}\n${report}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP25-A08 combined verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP25-A08 combined verification passed.');
