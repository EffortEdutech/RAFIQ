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

function sha256File(filePath) {
  return createHash('sha256').update(readFileSync(filePath, 'utf8')).digest('hex').toUpperCase();
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

runNodeScript('scripts/check_cp27_g06_internal_ui_proof.mjs');
runNodeScript('scripts/generate_cp27_g07_combined_verification.mjs');

const closeOut = readText('docs/09_sprints/resource_audit_import_prototype/CP27_G07_COMBINED_VERIFICATION_AND_CLOSE_OUT.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP27_REFRESH_BACKED_GRAPH_AND_VAULT_REBUILD_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP27_REFRESH_BACKED_GRAPH_AND_VAULT_REBUILD_ACCEPTANCE_CHECKLIST.md');
const roadmap = readText('docs/09_sprints/resource_audit_import_prototype/RAFIQ_GRAPHIFY_PRODUCT_DEVELOPMENT_ROADMAP_CP26_TO_COMPLETION.md');
const latestVerification = readJson('data/graphify/cp27-refresh/latest-verification.json');
const summary = readJson('data/graphify/cp27-refresh/verification/cp27-combined-verification-g07/combined-verification-summary.json');
const controller = readText('apps/api/src/modules/private-content/private-content.controller.ts');
const mobileApi = readText('apps/mobile/src/services/privateContentApi.ts');
const mobileScreen = readText('apps/mobile/app/knowledge-graphify.tsx');

expect('G07 report records complete status', closeOut.includes('Status: Complete'), 'Status: Complete');
expect('G07 report declares CP27 complete', closeOut.includes('CP27 is complete'), 'CP27 complete');
expect('G07 report keeps public release blocked', closeOut.includes('Public release remains blocked'), 'public block');
expect('G07 report selects CP28 next', closeOut.includes('Recommended next scope') && closeOut.includes('CP28 - Retrieval Engine Integration From Refreshed Graph'), 'CP28 selected');
expect('G07 report documents known limitations', closeOut.includes('Known Limitations') && closeOut.includes('77 unresolved references') && closeOut.includes('30 high/critical blockers'), 'known limits');
expect('G07 report lists final proof commands', closeOut.includes('node scripts\\check_cp27_g07_combined_verification.mjs') && closeOut.includes('node scripts\\check_cp27_g06_internal_ui_proof.mjs'), 'proof commands');

for (const term of [
  'CP27-G01 - Refresh-Backed Graph Rebuild Architecture',
  'CP27-G02 - Snapshot-To-Node And Snapshot-To-Edge Mapper',
  'CP27-G03 - Partition And Index Regeneration From Snapshots',
  'CP27-G04 - Vault Pack Regeneration From Refreshed Graph',
  'CP27-G05 - Graph/Vault Diff Proof Against CP22 Baseline',
  'CP27-G06 - Graph/Vault Internal UI Inspection Proof',
  'CP27-G07 - Combined Verification And Close-Out',
]) {
  expect(`G07 report includes delivered checkpoint ${term}`, closeOut.includes(term), term);
}

expect('Latest verification checksum matches summary', latestVerification?.summarySha256 === sha256File(latestVerification?.summaryPath || ''), latestVerification?.summarySha256);
expect('Summary schema and checkpoint are correct', summary?.schemaVersion === 'cp27.combined-verification-summary.v1' && summary?.checkpoint === 'CP27-G07', `${summary?.schemaVersion} ${summary?.checkpoint}`);
expect('Summary remains private and not public release approved', summary?.privateOnly === true && summary?.publicReleaseApproved === false, JSON.stringify({ privateOnly: summary?.privateOnly, publicReleaseApproved: summary?.publicReleaseApproved }));
expect('Summary required files are present', summary?.counts?.missingRequiredFileCount === 0 && Array.isArray(summary?.missingRequiredFiles) && summary.missingRequiredFiles.length === 0, JSON.stringify(summary?.missingRequiredFiles));
expect('Summary graph counts are stable', summary?.counts?.graphNodeCount === 147 && summary?.counts?.graphEdgeCount === 125 && summary?.counts?.graphPartitionCount === 10 && summary?.counts?.graphIndexCount === 12, JSON.stringify(summary?.counts));
expect('Summary vault counts are stable', summary?.counts?.vaultArtifactCount === 26 && summary?.counts?.vaultCategoryCount === 4 && summary?.counts?.vaultGraphNodesReferenced === 147, JSON.stringify(summary?.counts));
expect('Summary CP22 baseline diff counts are stable', summary?.counts?.graphBaselineNodes === 79657 && summary?.counts?.graphRefreshedNodes === 147 && summary?.counts?.graphBaselineEdges === 147689 && summary?.counts?.graphRefreshedEdges === 125 && summary?.counts?.vaultBaselineArtifacts === 158 && summary?.counts?.vaultRefreshedArtifacts === 26, JSON.stringify(summary?.counts));
expect('Summary diff classifications are visible', ['matchedCount', 'addedCount', 'removedCount', 'changedCount', 'deferredCount', 'blockedCount'].every((key) => Number.isInteger(summary?.counts?.[key])), JSON.stringify(summary?.counts));
expect('Summary unresolved blockers remain visible', summary?.counts?.unresolvedReferenceCount === 77 && summary?.counts?.highOrCriticalBlockerCount === 30, JSON.stringify(summary?.counts));
expect('Summary public-safe counts remain zero', summary?.counts?.publicSafeSnapshotRowCount === 0 && summary?.counts?.publicSafeGraphNodeCount === 0 && summary?.counts?.publicSafeGraphEdgeCount === 0 && summary?.counts?.publicSafeVaultArtifactCount === 0 && summary?.publicBoundary?.publicReleaseApproved === false, JSON.stringify(summary?.publicBoundary));
expect('Summary route boundary is private and bounded', summary?.routeBoundary?.privateInspectionRoute === 'GET /api/private-content/knowledge-graphify/cp27' && summary?.routeBoundary?.publicGraphRouteExists === false && summary?.routeBoundary?.publicVaultRouteExists === false && summary?.routeBoundary?.fullGraphDumpIncluded === false && summary?.routeBoundary?.fullVaultDumpIncluded === false && summary?.routeBoundary?.rawSourceTextIncluded === false, JSON.stringify(summary?.routeBoundary));
expect('Summary graph/vault boundary preserves derived metadata', summary?.graphBoundary?.canonicalRefsRemainAuthoritative === true && summary?.graphBoundary?.graphIdsAreDerived === true && summary?.graphBoundary?.rawTextBodiesExported === false && summary?.vaultBoundary?.rawTextBodiesExported === false, JSON.stringify({ graph: summary?.graphBoundary, vault: summary?.vaultBoundary }));
expect('Summary records no CP22 parity claim', summary?.diffBoundary?.cp22BaselinePreservedAsComparisonInput === true && summary?.diffBoundary?.doesNotClaimCp22Parity === true, JSON.stringify(summary?.diffBoundary));

expect('Private CP27 API route remains present', controller.includes("@Get('knowledge-graphify/cp27')") && mobileApi.includes('/api/private-content/knowledge-graphify/cp27'), 'private CP27 route');
expect('No public CP27 graph/vault route exists', !controller.includes('public-content/knowledge-graphify/cp27') && !mobileApi.includes('/api/public-content/knowledge-graphify/cp27'), 'no public CP27 route');
expect('Mobile UI remains bounded', mobileScreen.includes('Summary-only payload') && mobileScreen.includes('Full graph dump included') && mobileScreen.includes('Full vault dump included'), 'bounded UI');

expect('Sprint plan marks CP27 complete', sprintPlan.includes('Status: CP27 complete; recommended next scope CP28'), 'sprint status');
expect('Sprint plan marks G07 complete', sprintPlan.includes('Status: Complete. See `CP27_G07_COMBINED_VERIFICATION_AND_CLOSE_OUT.md`'), 'G07 status');
expect('Sprint plan recommends CP28', sprintPlan.includes('CP28 - Retrieval Engine Integration From Refreshed Graph'), 'CP28 next');
expect('Checklist marks CP27 complete', checklist.includes('Status: CP27 complete; recommended next scope CP28'), 'checklist status');
expect('Checklist G07 rows pass', ['CP27-G07-01', 'CP27-G07-02', 'CP27-G07-03', 'CP27-G07-04', 'CP27-G07-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'G07 rows pass');
expect('Checklist recommends CP28', checklist.includes('Start `CP28 - Retrieval Engine Integration From Refreshed Graph`'), 'CP28 next');
expect('Roadmap marks CP27 complete and CP28 next', roadmap.includes('CP27 refresh-backed graph and vault rebuild | Complete') && roadmap.includes('Start CP28 retrieval integration from refreshed graph/vault outputs'), 'roadmap updated');
expect('Roadmap keeps public release blocked', roadmap.includes('Public release status: Blocked') && roadmap.includes('public-safe graph nodes: `0`'), 'roadmap public block');
expect('No env file path access introduced', !/['"]\.env/.test(`${closeOut}\n${sprintPlan}\n${checklist}\n${roadmap}\n${controller}\n${mobileApi}\n${mobileScreen}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP27-G07 combined verification and close-out failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP27-G07 combined verification and close-out passed.');
