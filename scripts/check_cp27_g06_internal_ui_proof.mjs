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

runNodeScript('scripts/check_cp27_g05_graph_vault_diff.mjs');
runNodeScript('scripts/generate_cp27_g06_internal_ui_proof.mjs');

const report = readText('docs/09_sprints/resource_audit_import_prototype/CP27_G06_INTERNAL_UI_INSPECTION_PROOF.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP27_REFRESH_BACKED_GRAPH_AND_VAULT_REBUILD_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP27_REFRESH_BACKED_GRAPH_AND_VAULT_REBUILD_ACCEPTANCE_CHECKLIST.md');
const shared = readText('packages/shared/src/private-content.ts');
const controller = readText('apps/api/src/modules/private-content/private-content.controller.ts');
const service = readText('apps/api/src/modules/private-content/private-content.service.ts');
const openapi = readText('apps/api/src/modules/private-content/private-content.openapi.ts');
const mobileApi = readText('apps/mobile/src/services/privateContentApi.ts');
const mobileScreen = readText('apps/mobile/app/knowledge-graphify.tsx');

const latestProof = readJson('data/graphify/cp27-refresh/latest-internal-ui-proof.json');
const statusProof = readJson('data/graphify/cp27-refresh/internal-ui/cp27-g06-internal-ui-inspection-proof/status-proof.json');

expect('G06 report records complete status', report.includes('Status: Complete'), 'Status: Complete');
expect('G06 report documents bounded response', report.includes('fullGraphDumpIncluded: false') && report.includes('fullVaultDumpIncluded: false') && report.includes('rawSourceTextIncluded: false'), 'bounded flags');
expect('G06 report documents CP22 vs CP27 counts', report.includes('79,657') && report.includes('147,689') && report.includes('147') && report.includes('26'), 'baseline diff counts');

expect('Sprint plan marks G06 complete', sprintPlan.includes('Status: CP27-G06 complete; CP27-G07 next') || sprintPlan.includes('Status: CP27 complete; recommended next scope CP28'), 'sprint status');
expect('Sprint plan G06 complete', /CP27-G06[\s\S]*?Status: Complete/.test(sprintPlan), 'G06 status complete');
expect('Checklist G06 rows pass', ['CP27-G06-01', 'CP27-G06-02', 'CP27-G06-03', 'CP27-G06-04', 'CP27-G06-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'G06 rows pass');
expect('Checklist recommends next scope', checklist.includes('Start `CP27-G07 - Combined Verification And Close-Out`') || checklist.includes('Start `CP28 - Retrieval Engine Integration From Refreshed Graph`'), 'next scope');

expect('Shared CP27 response contract exists', shared.includes('PrivateCp27InternalUiInspectionResponse') && shared.includes('responseBoundary') && shared.includes('fullGraphDumpIncluded: false'), 'shared contract');
expect('Controller exposes private CP27 route', controller.includes("@Get('knowledge-graphify/cp27')") && controller.includes('getKnowledgeGraphifyCp27'), 'controller route');
expect('OpenAPI CP27 DTO exists', openapi.includes('PrivateCp27InternalUiInspectionResponseDto'), 'openapi dto');
expect('Service returns bounded CP27 response', service.includes('getKnowledgeGraphifyCp27') && service.includes('CP27_LATEST_GRAPH_PATH') && service.includes('fullVaultDumpIncluded: false'), 'service method');
expect('Mobile client calls CP27 route', mobileApi.includes('getKnowledgeGraphifyCp27') && mobileApi.includes('/api/private-content/knowledge-graphify/cp27'), 'mobile API');
expect('Mobile screen uses CP27 route and boundary labels', mobileScreen.includes('getKnowledgeGraphifyCp27') && mobileScreen.includes('CP27-G06 internal proof') && mobileScreen.includes('Public release blocked'), 'mobile UI');
expect('Mobile screen does not call CP22 route', !mobileScreen.includes('getKnowledgeGraphifyCp22'), 'no CP22 call');

expect('Latest proof checksum matches status proof', latestProof?.statusProofSha256 === sha256File(latestProof?.statusProofPath || ''), latestProof?.statusProofSha256);
expect('Status proof schema and checkpoint are correct', statusProof?.schemaVersion === 'cp27.internal-ui-inspection-proof.v1' && statusProof?.checkpoint === 'CP27-G06', `${statusProof?.schemaVersion} ${statusProof?.checkpoint}`);
expect('Status proof route and screen are correct', statusProof?.route === 'GET /api/private-content/knowledge-graphify/cp27' && statusProof?.screen === 'apps/mobile/app/knowledge-graphify.tsx', `${statusProof?.route} ${statusProof?.screen}`);
expect('Status proof graph counts are stable', statusProof?.graph?.nodeCount === 147 && statusProof?.graph?.edgeCount === 125 && statusProof?.graph?.partitionCount === 10 && statusProof?.graph?.indexCount === 12, JSON.stringify(statusProof?.graph));
expect('Status proof vault counts are stable', statusProof?.vault?.artifactCount === 26 && statusProof?.vault?.categoryCount === 4 && statusProof?.vault?.graphNodesReferenced === 147, JSON.stringify(statusProof?.vault));
expect('Status proof diff counts are stable', statusProof?.diff?.graphBaselineNodes === 79657 && statusProof?.diff?.graphRefreshedNodes === 147 && statusProof?.diff?.graphBaselineEdges === 147689 && statusProof?.diff?.graphRefreshedEdges === 125 && statusProof?.diff?.vaultBaselineArtifacts === 158 && statusProof?.diff?.vaultRefreshedArtifacts === 26, JSON.stringify(statusProof?.diff));
expect('Status proof includes all diff classes', ['matchedCount', 'addedCount', 'removedCount', 'changedCount', 'deferredCount', 'blockedCount'].every((key) => Number.isInteger(statusProof?.diff?.[key])), JSON.stringify(statusProof?.diff));
expect('Status proof excludes full private dumps', statusProof?.responseBoundary?.fullGraphDumpIncluded === false && statusProof?.responseBoundary?.fullVaultDumpIncluded === false && statusProof?.responseBoundary?.rawSourceTextIncluded === false && statusProof?.responseBoundary?.vaultMarkdownBodiesIncluded === false, JSON.stringify(statusProof?.responseBoundary));
expect('Status proof public boundary remains blocked', statusProof?.publicBoundary?.publicReleaseApproved === false && statusProof?.publicBoundary?.publicSafeSnapshotRowCount === 0 && statusProof?.publicBoundary?.publicSafeGraphNodeCount === 0 && statusProof?.publicBoundary?.publicSafeGraphEdgeCount === 0 && statusProof?.publicBoundary?.publicSafeVaultArtifactCount === 0, JSON.stringify(statusProof?.publicBoundary));
expect('No env file path access introduced', !/['"]\.env/.test(`${report}\n${sprintPlan}\n${checklist}\n${shared}\n${controller}\n${service}\n${mobileApi}\n${mobileScreen}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP27-G06 internal UI inspection proof verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP27-G06 internal UI inspection proof verification passed.');
