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

runNodeScript('scripts/check_cp26_s07_combined_verification.mjs');

const closeOut = readText('docs/09_sprints/resource_audit_import_prototype/CP26_S08_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP26_LIVE_SNAPSHOT_EXPORT_AND_REFRESH_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP26_LIVE_SNAPSHOT_EXPORT_AND_REFRESH_ACCEPTANCE_CHECKLIST.md');
const roadmap = readText('docs/09_sprints/resource_audit_import_prototype/RAFIQ_GRAPHIFY_PRODUCT_DEVELOPMENT_ROADMAP_CP26_TO_COMPLETION.md');
const s07Summary = readJson('data/snapshots/cp26/verification/cp26-combined-verification-s07/combined-verification-summary.json');
const latestVerification = readJson('data/snapshots/cp26/latest-verification.json');
const controller = readText('apps/api/src/modules/private-content/private-content.controller.ts');
const mobileService = readText('apps/mobile/src/services/privateContentApi.ts');

expect('S08 report records complete status', closeOut.includes('Status: Complete'), 'Status: Complete');
expect('S08 report declares CP26 complete', closeOut.includes('CP26 is complete'), 'CP26 complete');
expect('S08 report keeps public release blocked', closeOut.includes('Public release remains blocked'), 'public block');
expect('S08 report selects CP27 next', closeOut.includes('Recommended next scope') && closeOut.includes('CP27 - Refresh-Backed Graph And Vault Rebuild'), 'CP27 selected');
expect('S08 report documents known limitations', closeOut.includes('Known Limitations') && closeOut.includes('77 unresolved references') && closeOut.includes('30 high/critical blockers'), 'known limits');
expect('S08 report lists final proof commands', closeOut.includes('node scripts\\check_cp26_s08_close_out.mjs') && closeOut.includes('node scripts\\check_cp26_s07_combined_verification.mjs'), 'proof commands');

for (const term of [
  'CP26-S01 - Snapshot Architecture And Source Map',
  'CP26-S02 - Snapshot Contracts And Manifest Schema',
  'CP26-S03 - Private Snapshot Export Prototype',
  'CP26-S04 - Refresh Pipeline Prototype',
  'CP26-S05 - Checksum, Diff, And Rollback Proof',
  'CP26-S06 - Private API And Internal UI Status Proof',
  'CP26-S07 - Combined Verification',
  'CP26-S08 - Close-Out And Next Scope Decision',
]) {
  expect(`S08 report includes delivered checkpoint ${term}`, closeOut.includes(term), term);
}

expect('S07 summary remains private and complete', s07Summary?.privateOnly === true && s07Summary?.publicReleaseApproved === false && s07Summary?.checkpoint === 'CP26-S07', JSON.stringify({ checkpoint: s07Summary?.checkpoint, privateOnly: s07Summary?.privateOnly }));
expect('S07 summary final CP26 counts are stable', s07Summary?.counts?.sourceGroupCount === 13 && s07Summary?.counts?.snapshotArtifactCount === 13 && s07Summary?.counts?.refreshOutputCount === 4 && s07Summary?.counts?.totalChecksumEntryCount === 17, JSON.stringify(s07Summary?.counts));
expect('S07 summary unresolved blockers remain visible', s07Summary?.counts?.unresolvedReferenceCount === 77 && s07Summary?.counts?.highOrCriticalBlockerCount === 30, JSON.stringify(s07Summary?.counts));
expect('S07 public-safe counts remain zero', s07Summary?.counts?.publicSafeSnapshotRowCount === 0 && s07Summary?.counts?.publicSafeGraphNodeCount === 0 && s07Summary?.counts?.publicSafeGraphEdgeCount === 0 && s07Summary?.counts?.publicSafeVaultArtifactCount === 0, JSON.stringify(s07Summary?.counts));
expect('Latest verification points to S07 summary', latestVerification?.proofId === 'cp26-combined-verification-s07' && latestVerification?.summaryPath?.includes('combined-verification-summary.json'), JSON.stringify(latestVerification));
expect('No public CP26 snapshot route exists', !controller.includes('public-content/snapshots/cp26') && !mobileService.includes('/api/public-content/snapshots/cp26'), 'no public route');
expect('Private CP26 snapshot status route remains present', controller.includes("@Get('snapshots/cp26')") && mobileService.includes('/api/private-content/snapshots/cp26'), 'private status route');

expect('Sprint plan marks CP26 complete', sprintPlan.includes('Status: CP26 complete; recommended next scope CP27'), 'sprint status');
expect('Sprint plan marks S08 complete', sprintPlan.includes('Status: Complete. See `CP26_S08_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`'), 'S08 status');
expect('Sprint plan recommends CP27', sprintPlan.includes('CP27 - Refresh-Backed Graph And Vault Rebuild'), 'CP27 next');
expect('Checklist marks CP26 complete', checklist.includes('Status: CP26 complete; recommended next scope CP27'), 'checklist status');
expect('Checklist S08 rows pass', ['CP26-S08-01', 'CP26-S08-02', 'CP26-S08-03', 'CP26-S08-04', 'CP26-S08-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |') && row.includes('CP26_S08_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md');
}), 'S08 rows pass');
expect('Checklist recommends CP27', checklist.includes('Start `CP27 - Refresh-Backed Graph And Vault Rebuild`'), 'CP27 next');
expect('Roadmap marks CP26 complete and later graphify work next', roadmap.includes('CP26 live snapshot export and refresh | Complete') && (roadmap.includes('Start CP27 refresh-backed graph/vault rebuild') || roadmap.includes('Start CP28 retrieval integration from refreshed graph/vault outputs')), 'roadmap updated');
expect('Roadmap keeps public release blocked', roadmap.includes('Public release status: Blocked') && roadmap.includes('public-safe graph nodes: `0`'), 'roadmap public block');
expect('No env file path access introduced', !/['"]\.env/.test(`${closeOut}\n${sprintPlan}\n${checklist}\n${roadmap}\n${controller}\n${mobileService}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP26-S08 close-out verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP26-S08 close-out verification passed.');
