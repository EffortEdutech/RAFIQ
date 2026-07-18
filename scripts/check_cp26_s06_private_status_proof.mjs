#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const checks = [];
const PROOF_ID = 'cp26-private-status-proof-s06';
const PROOF_PATH = `data/snapshots/cp26/status/${PROOF_ID}/status-proof.json`;

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

function sha256Text(text) {
  return createHash('sha256').update(text).digest('hex').toUpperCase();
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

runNodeScript('scripts/generate_cp26_s05_checksum_diff_rollback.mjs');
runNodeScript('scripts/generate_cp26_s06_private_status_proof.mjs');

const proofText = readText(PROOF_PATH);
const latestStatusText = readText('data/snapshots/cp26/latest-status.json');
const proof = proofText ? JSON.parse(proofText) : null;
const latestStatus = latestStatusText ? JSON.parse(latestStatusText) : null;
const shared = readText('packages/shared/src/private-content.ts');
const controller = readText('apps/api/src/modules/private-content/private-content.controller.ts');
const service = readText('apps/api/src/modules/private-content/private-content.service.ts');
const openapi = readText('apps/api/src/modules/private-content/private-content.openapi.ts');
const mobileService = readText('apps/mobile/src/services/privateContentApi.ts');
const workbench = readText('apps/mobile/app/review-workbench.tsx');
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP26_S06_PRIVATE_API_AND_INTERNAL_UI_STATUS_PROOF.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP26_LIVE_SNAPSHOT_EXPORT_AND_REFRESH_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP26_LIVE_SNAPSHOT_EXPORT_AND_REFRESH_ACCEPTANCE_CHECKLIST.md');

expect('Status proof schema and checkpoint are correct', proof?.schemaVersion === 'cp26.private-status-proof.v1' && proof?.checkpoint === 'CP26-S06', `${proof?.schemaVersion} ${proof?.checkpoint}`);
expect('Status proof id is stable', proof?.proofId === PROOF_ID, proof?.proofId);
expect('Status proof exposes private API and UI routes', proof?.apiRoute === 'GET /api/private-content/snapshots/cp26' && proof?.uiRoute === '/review-workbench', `${proof?.apiRoute} ${proof?.uiRoute}`);
expect('Status proof preserves CP26 counts', proof?.snapshot?.sourceGroupCount === 13 && proof?.refresh?.refreshedOutputCount === 4 && proof?.diff?.totalChecksumEntryCount === 17, JSON.stringify(proof?.snapshot));
expect('Status proof carries blockers visibly', proof?.unresolved?.total === 77 && proof?.refresh?.highOrCriticalBlockerCount === 30 && proof?.unresolved?.sampleCount === 4, JSON.stringify(proof?.unresolved));
expect('Status proof public-safe counts remain zero', proof?.snapshot?.publicSafeSnapshotRowCount === 0 && proof?.snapshot?.publicSafeGraphNodeCount === 0 && proof?.snapshot?.publicSafeGraphEdgeCount === 0 && proof?.snapshot?.publicSafeVaultArtifactCount === 0, JSON.stringify(proof?.snapshot));
expect('Status proof payload is bounded', proof?.payloadBoundary?.sendsFullSourceRows === false && proof?.payloadBoundary?.sendsFullGraphDump === false && proof?.payloadBoundary?.sendsFullVaultDump === false && proof?.payloadBoundary?.sendsFullAuditDump === false && proof?.payloadBoundary?.sendsSnapshotRowBodies === false, JSON.stringify(proof?.payloadBoundary));
expect('Latest status pointer references proof', latestStatus?.proofId === PROOF_ID && latestStatus?.statusProofPath === PROOF_PATH, JSON.stringify(latestStatus));
expect('Latest status pointer checksum matches proof', latestStatus?.statusProofSha256 === sha256Text(proofText), latestStatus?.statusProofSha256);

expect('Shared status response contract exists', shared.includes('PrivateCp26SnapshotStatusResponse') && shared.includes("route: 'GET /api/private-content/snapshots/cp26'"), 'shared contract');
expect('Controller exposes private CP26 route', controller.includes("@Get('snapshots/cp26')") && controller.includes('getCp26SnapshotStatus'), 'controller route');
expect('Service reads CP26 latest pointers', service.includes('CP26_LATEST_SNAPSHOT_PATH') && service.includes('CP26_LATEST_REFRESH_PATH') && service.includes('CP26_LATEST_DIFF_PATH'), 'service pointers');
expect('Service returns bounded CP26 fields', service.includes('samples: unresolvedReport.references.slice(0, 4)') && service.includes('sendsFullGraphDump') === false, 'bounded service');
expect('OpenAPI DTO exists', openapi.includes('PrivateCp26SnapshotStatusResponseDto'), 'openapi dto');
expect('Mobile service fetches CP26 status route', mobileService.includes('getCp26SnapshotStatus') && mobileService.includes('/api/private-content/snapshots/cp26'), 'mobile service');
expect('Workbench renders CP26 status panel', workbench.includes('Cp26SnapshotStatusPanel') && workbench.includes('Live snapshot and refresh proof') && workbench.includes('Public release blocked'), 'workbench panel');
expect('Workbench does not render full snapshot rows', !workbench.includes('.sourceGroups.map') && !workbench.includes('.entries.map') && !workbench.includes('.restoreSteps.map'), 'bounded workbench');
expect('Report records complete status', report.includes('Status: Complete'), 'report complete');
expect('Report documents API and UI proof', report.includes('GET /api/private-content/snapshots/cp26') && report.includes('/review-workbench'), 'api ui proof');
expect('Report keeps public release blocked', report.includes('Public release remains blocked') && report.includes('public-safe counts remain zero'), 'public boundary');
expect('Sprint plan marks S06 complete', sprintPlan.includes('Status: Complete. See `CP26_S06_PRIVATE_API_AND_INTERNAL_UI_STATUS_PROOF.md`'), 'S06 complete');
expect('Sprint plan recommends S07 next', sprintPlan.includes('CP26-S07 - Combined Verification'), 'S07 next');
expect('Checklist marks S06 rows pass', ['CP26-S06-01', 'CP26-S06-02', 'CP26-S06-03', 'CP26-S06-04', 'CP26-S06-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |') && row.includes('scripts/check_cp26_s06_private_status_proof.mjs');
}), 'S06 checklist rows');
expect('Checklist recommends S07 next', checklist.includes('Start `CP26-S07 - Combined Verification`'), 'S07 checklist next');
expect('No env file path access introduced', !/['"]\.env/.test(`${shared}\n${controller}\n${service}\n${openapi}\n${mobileService}\n${workbench}\n${report}\n${sprintPlan}\n${checklist}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP26-S06 private status proof verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP26-S06 private status proof verification passed.');
