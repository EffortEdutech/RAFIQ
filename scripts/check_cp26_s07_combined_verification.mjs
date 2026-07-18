#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const checks = [];
const PROOF_ID = 'cp26-combined-verification-s07';
const SUMMARY_PATH = `data/snapshots/cp26/verification/${PROOF_ID}/combined-verification-summary.json`;

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

const inheritedVerifierScripts = [];

const cp26VerifierScripts = [
  'scripts/check_cp26_s01_snapshot_architecture_source_map.mjs',
  'scripts/check_cp26_s02_snapshot_contracts.mjs',
  'scripts/check_cp26_s03_private_snapshot_export.mjs',
  'scripts/check_cp26_s04_refresh_pipeline.mjs',
  'scripts/check_cp26_s05_checksum_diff_rollback.mjs',
  'scripts/check_cp26_s06_private_status_proof.mjs',
];

runNodeScript('scripts/generate_cp26_s07_combined_verification.mjs');

const summaryText = readText(SUMMARY_PATH);
const latestVerificationText = readText('data/snapshots/cp26/latest-verification.json');
const summary = summaryText ? JSON.parse(summaryText) : null;
const latestVerification = latestVerificationText ? JSON.parse(latestVerificationText) : null;
const statusProof = readJson('data/snapshots/cp26/status/cp26-private-status-proof-s06/status-proof.json');
const diffManifest = readJson('data/snapshots/cp26/diff/cp26-checksum-diff-rollback-proof-s05/manifest.json');
const cp22GraphManifest = readJson('data/graphify/full-private/manifest.json');
const cp22VaultManifest = readJson('data/vault/full-private/manifest.json');
const cp22CloseOut = readText('docs/09_sprints/resource_audit_import_prototype/CP22_G10_CLOSE_OUT_REPORT.md');
const cp23ReviewerManifest = readJson('data/review/cp23/manifest.json');
const cp23CloseOut = readText('docs/09_sprints/resource_audit_import_prototype/CP23_A10_CLOSE_OUT_AND_NEXT_SCOPE_DECISION_REPORT.md');
const cp24RetrievalManifest = readJson('data/retrieval/cp24/manifest.json');
const cp24CloseOut = readText('docs/09_sprints/resource_audit_import_prototype/CP24_G09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md');
const cp25ReviewManifest = readJson('data/review/cp25/a07-export-manifest.json');
const cp25CloseOut = readText('docs/09_sprints/resource_audit_import_prototype/CP25_A09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md');
const controller = readText('apps/api/src/modules/private-content/private-content.controller.ts');
const service = readText('apps/api/src/modules/private-content/private-content.service.ts');
const mobileService = readText('apps/mobile/src/services/privateContentApi.ts');
const workbench = readText('apps/mobile/app/review-workbench.tsx');
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP26_S07_COMBINED_VERIFICATION.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP26_LIVE_SNAPSHOT_EXPORT_AND_REFRESH_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP26_LIVE_SNAPSHOT_EXPORT_AND_REFRESH_ACCEPTANCE_CHECKLIST.md');
const generator = readText('scripts/generate_cp26_s07_combined_verification.mjs');

expect('Combined summary schema and checkpoint are correct', summary?.schemaVersion === 'cp26.combined-verification-summary.v1' && summary?.checkpoint === 'CP26-S07', `${summary?.schemaVersion} ${summary?.checkpoint}`);
expect('Combined summary id is stable', summary?.proofId === PROOF_ID, summary?.proofId);
expect('Combined summary records no recursive inherited verifier calls', summary?.counts?.inheritedVerifierCount === 0, String(summary?.counts?.inheritedVerifierCount));
expect('Combined summary records inherited persisted boundary gates', summary?.counts?.inheritedBoundaryCheckCount === 4 && summary?.counts?.inheritedGateCount === 4, JSON.stringify(summary?.counts));
expect('Combined summary records CP26 checkpoint script coverage', summary?.counts?.cp26VerifierCount === 7, String(summary?.counts?.cp26VerifierCount));
expect('Combined summary has no missing required files', summary?.counts?.missingRequiredFileCount === 0 && summary?.missingRequiredFiles?.length === 0, JSON.stringify(summary?.missingRequiredFiles));
expect('Combined summary preserves CP26 snapshot and refresh counts', summary?.counts?.sourceGroupCount === 13 && summary?.counts?.snapshotArtifactCount === 13 && summary?.counts?.refreshOutputCount === 4, JSON.stringify(summary?.counts));
expect('Combined summary preserves checksum and diff counts', summary?.counts?.totalChecksumEntryCount === 17 && summary?.counts?.unchangedCount === 13 && summary?.counts?.addedCount === 4 && summary?.counts?.changedCount === 0 && summary?.counts?.removedCount === 0, JSON.stringify(summary?.counts));
expect('Combined summary has no stale or mismatched artifacts', summary?.counts?.staleArtifactCount === 0 && summary?.counts?.mismatchedArtifactCount === 0, JSON.stringify(summary?.counts));
expect('Combined summary keeps unresolved blockers visible', summary?.counts?.unresolvedReferenceCount === 77 && summary?.counts?.highOrCriticalBlockerCount === 30, JSON.stringify(summary?.counts));
expect('Combined summary public-safe counts remain zero', summary?.counts?.publicSafeSnapshotRowCount === 0 && summary?.counts?.publicSafeGraphNodeCount === 0 && summary?.counts?.publicSafeGraphEdgeCount === 0 && summary?.counts?.publicSafeVaultArtifactCount === 0, JSON.stringify(summary?.counts));
expect('Combined summary route boundary is private and bounded', summary?.routeBoundary?.privateStatusRoute === 'GET /api/private-content/snapshots/cp26' && summary?.routeBoundary?.publicSnapshotRouteExists === false && summary?.routeBoundary?.boundedClientPayload === true, JSON.stringify(summary?.routeBoundary));
expect('Combined summary public boundary blocks release', summary?.publicBoundary?.privateOnly === true && summary?.publicBoundary?.publicReleaseApproved === false && summary?.publicBoundary?.publicRouteExposed === false, JSON.stringify(summary?.publicBoundary));
expect('CP22 persisted graph boundary remains stable', cp22GraphManifest?.counts?.totalNodes === 79657 && cp22GraphManifest?.counts?.totalEdges === 147689 && cp22GraphManifest?.counts?.publicSafeNodes === 0 && cp22GraphManifest?.counts?.publicSafeEdges === 0, JSON.stringify(cp22GraphManifest?.counts));
expect('CP22 persisted vault boundary remains stable', cp22VaultManifest?.counts?.artifacts === 158 && cp22VaultManifest?.counts?.publicSafeArtifacts === 0 && cp22VaultManifest?.requiredBoundary?.publicReleaseApproved === false, JSON.stringify(cp22VaultManifest?.counts));
expect('CP22 close-out records combined verification and public block', cp22CloseOut.includes('node scripts/check_cp22_combined_verification.mjs') || cp22CloseOut.includes('node scripts\\check_cp22_combined_verification.mjs'), 'CP22 combined command documented');
expect('CP23 persisted reviewer boundary remains stable', cp23ReviewerManifest?.privateOnly === true && cp23ReviewerManifest?.publicReleaseApproved === false && cp23ReviewerManifest?.counts?.auditEvents === 8 && cp23ReviewerManifest?.counts?.openBlockingRemediationItems === 8, JSON.stringify(cp23ReviewerManifest?.counts));
expect('CP23 close-out records complete and public block', cp23CloseOut.includes('Status: Complete') && cp23CloseOut.includes('Public release remains blocked'), 'CP23 close-out');
expect('CP24 persisted retrieval boundary remains stable', cp24RetrievalManifest?.privateOnly === true && cp24RetrievalManifest?.publicReleaseApproved === false && cp24RetrievalManifest?.counts?.rankingSelection?.selectedCandidateCount === 15 && cp24RetrievalManifest?.counts?.validationHandoff?.remediationCount === 72 && cp24RetrievalManifest?.counts?.rankingSelection?.publicSafeCandidateCount === 0, JSON.stringify(cp24RetrievalManifest?.counts));
expect('CP24 close-out records complete and public block', cp24CloseOut.includes('Status: Complete') && cp24CloseOut.includes('Public release remains blocked'), 'CP24 close-out');
expect('CP25 persisted action workflow boundary remains stable', cp25ReviewManifest?.privateOnly === true && cp25ReviewManifest?.publicReleaseApproved === false && cp25ReviewManifest?.counts?.auditExportEventCount === 72 && cp25ReviewManifest?.counts?.unresolvedActionCount === 66 && cp25ReviewManifest?.counts?.openBlockingCount === 12 && cp25ReviewManifest?.counts?.publicSafeCandidateCount === 0 && cp25ReviewManifest?.counts?.publicSafeRouteItemCount === 0, JSON.stringify(cp25ReviewManifest?.counts));
expect('CP25 close-out records complete and public block', cp25CloseOut.includes('Status: Complete') && cp25CloseOut.includes('Public release remains blocked'), 'CP25 close-out');

expect('Latest verification pointer references S07 summary', latestVerification?.proofId === PROOF_ID && latestVerification?.summaryPath === SUMMARY_PATH, JSON.stringify(latestVerification));
expect('Latest verification checksum matches summary', latestVerification?.summarySha256 === sha256Text(summaryText), latestVerification?.summarySha256);
expect('S06 status proof remains bounded', statusProof?.payloadBoundary?.sendsFullSourceRows === false && statusProof?.payloadBoundary?.sendsFullGraphDump === false && statusProof?.payloadBoundary?.sendsFullVaultDump === false && statusProof?.payloadBoundary?.sendsFullAuditDump === false, JSON.stringify(statusProof?.payloadBoundary));
expect('S05 diff manifest remains stable', diffManifest?.counts?.totalChecksumEntryCount === 17 && diffManifest?.counts?.staleArtifactCount === 0 && diffManifest?.counts?.mismatchedArtifactCount === 0, JSON.stringify(diffManifest?.counts));
expect('CP26 checkpoint scripts exist', cp26VerifierScripts.every((scriptPath) => existsSync(scriptPath)), 'CP26 scripts present');
expect('Private CP26 API route exists', controller.includes("@Get('snapshots/cp26')") && service.includes('getCp26SnapshotStatus') && mobileService.includes('/api/private-content/snapshots/cp26'), 'private route');
expect('No public CP26 snapshot route exists', !controller.includes('public-content/snapshots/cp26') && !controller.includes("@Controller('public-content')") && !mobileService.includes('/api/public-content/snapshots/cp26'), 'no public route');
expect('Internal UI keeps CP26 status inside private workbench', workbench.includes('Cp26SnapshotStatusPanel') && workbench.includes('PrivateModeRibbon') && workbench.includes('Public release blocked'), 'private workbench');
expect('Report records complete status', report.includes('Status: Complete'), 'report complete');
expect('Report documents inherited persisted boundary checks', report.includes('persisted CP22 boundary') && report.includes('persisted CP23 boundary') && report.includes('persisted CP24 boundary') && report.includes('persisted CP25 boundary'), 'inherited persisted boundaries');
expect('Report documents CP22 persisted boundary counts', report.includes('79,657') && report.includes('147,689') && report.includes('158'), 'CP22 persisted boundary counts');
expect('Report documents CP26 gates', cp26VerifierScripts.every((scriptPath) => report.includes(scriptPath)), 'CP26 gates');
expect('Report keeps public release blocked', report.includes('Public release remains blocked') && report.includes('public-safe counts remain zero'), 'public boundary');
expect('Sprint plan marks S07 complete', sprintPlan.includes('Status: Complete. See `CP26_S07_COMBINED_VERIFICATION.md`'), 'S07 complete');
expect('Sprint plan recommends S08 or CP27 next', sprintPlan.includes('CP26-S08 - Close-Out And Next Scope Decision') || sprintPlan.includes('CP27 - Refresh-Backed Graph And Vault Rebuild'), 'S08 or CP27 next');
expect('Checklist marks S07 rows pass', ['CP26-S07-01', 'CP26-S07-02', 'CP26-S07-03', 'CP26-S07-04', 'CP26-S07-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |') && row.includes('scripts/check_cp26_s07_combined_verification.mjs');
}), 'S07 checklist rows');
expect('Checklist recommends S08 or CP27 next', checklist.includes('Start `CP26-S08 - Close-Out And Next Scope Decision`') || checklist.includes('Start `CP27 - Refresh-Backed Graph And Vault Rebuild`'), 'S08 or CP27 checklist next');
expect('No env file path access introduced', !/['"]\.env/.test(`${generator}\n${report}\n${sprintPlan}\n${checklist}\n${controller}\n${service}\n${mobileService}\n${workbench}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP26-S07 combined verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP26-S07 combined verification passed.');
