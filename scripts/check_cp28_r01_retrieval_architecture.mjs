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

runNodeScript('scripts/check_cp27_g07_combined_verification.mjs');

const r01Doc = readText('docs/09_sprints/resource_audit_import_prototype/CP28_R01_RETRIEVAL_ARCHITECTURE_FROM_REFRESHED_GRAPH_VAULT.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP28_RETRIEVAL_ENGINE_INTEGRATION_FROM_REFRESHED_GRAPH_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP28_RETRIEVAL_ENGINE_INTEGRATION_FROM_REFRESHED_GRAPH_ACCEPTANCE_CHECKLIST.md');
const cp27CloseOut = readText('docs/09_sprints/resource_audit_import_prototype/CP27_G07_COMBINED_VERIFICATION_AND_CLOSE_OUT.md');
const cp24CloseOut = readText('docs/09_sprints/resource_audit_import_prototype/CP24_G09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md');
const cp24Manifest = readJson('data/retrieval/cp24/manifest.json');
const cp27Verification = readJson('data/graphify/cp27-refresh/latest-verification.json');
const latestGraph = readJson('data/graphify/cp27-refresh/latest-graph.json');
const latestVault = readJson('data/vault/cp27-refresh/latest-vault.json');
const controller = readText('apps/api/src/modules/private-content/private-content.controller.ts');
const mobileApi = readText('apps/mobile/src/services/privateContentApi.ts');

for (const term of [
  '# CP28-R01 - Retrieval Architecture From Refreshed Graph/Vault',
  'Status: Complete',
  'CP24 To CP28 Migration Map',
  'CP27 Graph/Vault Artifact Map',
  'Refreshed Fixture Matrix',
  'Output Folder And Manifest Policy',
  'Bounded Output Policy',
  'Stop Conditions',
  'Rollback Plan',
  'Verifier Plan',
  'Status: complete',
]) {
  expect(`R01 document includes: ${term}`, r01Doc.includes(term), term);
}

for (const fixtureId of [
  'cp28-fixture-quran-anchor-001',
  'cp28-fixture-translation-context-001',
  'cp28-fixture-tafsir-context-001',
  'cp28-fixture-hadith-support-001',
  'cp28-fixture-hadith-grade-escalation-001',
  'cp28-fixture-topic-001',
  'cp28-fixture-validation-history-001',
  'cp28-fixture-source-gap-001',
  'cp28-fixture-public-boundary-001',
  'cp28-fixture-safety-escalation-001',
]) {
  expect(`Refreshed fixture documented: ${fixtureId}`, r01Doc.includes(fixtureId), fixtureId);
}

for (const indexName of [
  'by-node-id',
  'by-edge-id',
  'by-canonical-ref',
  'by-ayah-key',
  'by-hadith-key',
  'by-topic-key',
  'by-source-id',
  'by-quality-state',
  'by-review-state',
  'by-release-state',
  'by-snapshot-id',
  'public-boundary',
]) {
  expect(`CP27 graph index documented: ${indexName}`, r01Doc.includes(indexName), indexName);
}

for (const path of [
  'data/graphify/cp27-refresh/latest-verification.json',
  'data/graphify/cp27-refresh/latest-graph.json',
  'data/vault/cp27-refresh/latest-vault.json',
  'data/retrieval/cp24/manifest.json',
  'data/retrieval/cp28/manifest.json',
  'data/retrieval/cp28/candidate-collection.json',
  'data/retrieval/cp28/ranking-selection.json',
  'data/retrieval/cp28/validation-handoff.json',
]) {
  expect(`R01 document references artifact path: ${path}`, r01Doc.includes(path), path);
}

expect('R01 records CP24 baseline counts', r01Doc.includes('CP24 fixtures | 10') && r01Doc.includes('CP24 candidates | 87') && r01Doc.includes('CP24 selected candidates | 15') && r01Doc.includes('CP24 remediation items | 72'), 'CP24 counts');
expect('R01 records CP27 refreshed counts', r01Doc.includes('CP27 graph nodes | 147') && r01Doc.includes('CP27 graph edges | 125') && r01Doc.includes('CP27 vault artifacts | 26') && r01Doc.includes('CP27 high/critical blockers | 30'), 'CP27 counts');
expect('R01 documents non-canonical graph boundary', r01Doc.includes('canonical Quran, tafsir, translation, hadith') && r01Doc.includes('remain authoritative'), 'canonical boundary');
expect('R01 documents prohibited inference boundary', r01Doc.includes('must not imply religious authority') && r01Doc.includes('authenticity') && r01Doc.includes('fatwa status'), 'prohibited inference');
expect('R01 documents no raw bodies boundary', r01Doc.includes('raw Quran, translation, tafsir, or hadith text bodies'), 'raw body boundary');
expect('R01 documents no public route', r01Doc.includes('no public CP28 retrieval route exists') || r01Doc.includes('No public route can expose CP28'), 'public route boundary');

expect('CP27 close-out selects CP28', cp27CloseOut.includes('CP28 - Retrieval Engine Integration From Refreshed Graph') && cp27CloseOut.includes('CP28-R01 - Retrieval Architecture From Refreshed Graph/Vault'), 'CP28 selected');
expect('CP24 close-out remains complete', cp24CloseOut.includes('CP24 is complete') && cp24CloseOut.includes('data/retrieval/cp24/manifest.json'), 'CP24 baseline');
expect('CP24 manifest counts are stable', cp24Manifest?.counts?.fixtureCount === 10 && cp24Manifest?.counts?.candidateCount === 87 && cp24Manifest?.counts?.rankingSelection?.selectedCandidateCount === 15 && cp24Manifest?.counts?.validationHandoff?.remediationCount === 72, JSON.stringify(cp24Manifest?.counts));
expect('CP24 public-safe counts remain zero', cp24Manifest?.counts?.publicSafeCandidateCount === 0 && cp24Manifest?.counts?.validationHandoff?.publicSafeRouteItemCount === 0, JSON.stringify(cp24Manifest?.counts));
expect('CP27 verification pointer is complete and private', cp27Verification?.checkpoint === 'CP27-G07' && cp27Verification?.privateOnly === true && cp27Verification?.publicReleaseApproved === false, JSON.stringify(cp27Verification));
expect('CP27 graph counts are stable', latestGraph?.counts?.totalNodes === 147 && latestGraph?.counts?.totalEdges === 125 && latestGraph?.counts?.partitions === 10 && latestGraph?.counts?.indexes === 12, JSON.stringify(latestGraph?.counts));
expect('CP27 vault counts are stable', latestVault?.counts?.artifacts === 26 && latestVault?.counts?.categories === 4 && latestVault?.counts?.graphNodesReferenced === 147, JSON.stringify(latestVault?.counts));
expect('CP27 public-safe counts remain zero', latestGraph?.counts?.publicSafeNodes === 0 && latestGraph?.counts?.publicSafeEdges === 0 && latestVault?.counts?.publicSafeArtifacts === 0, 'zero public-safe graph/vault counts');

expect('CP28 sprint plan title exists', sprintPlan.includes('# CP28 - Retrieval Engine Integration From Refreshed Graph Sprint Plan'), 'sprint plan title');
expect('CP28 sprint plan is at or beyond R01 complete', sprintPlan.includes('Status: CP28-R01 complete; CP28-R02 next') || sprintPlan.includes('Status: CP28-R02 complete; CP28-R03 next'), 'sprint status');
expect('CP28 sprint plan includes all checkpoints', ['CP28-R01', 'CP28-R02', 'CP28-R03', 'CP28-R04', 'CP28-R05', 'CP28-R06', 'CP28-R07'].every((id) => sprintPlan.includes(id)), 'R01-R07');
expect('CP28 sprint plan recommends R02 next', sprintPlan.includes('CP28-R02 - Candidate Collection From Snapshot-Backed Graph Indexes'), 'R02 next');
expect('CP28 checklist title exists', checklist.includes('# CP28 - Retrieval Engine Integration From Refreshed Graph Acceptance Checklist'), 'checklist title');
expect('CP28 checklist is at or beyond R01 complete', checklist.includes('Status: CP28-R01 complete; CP28-R02 next') || checklist.includes('Status: CP28-R02 complete; CP28-R03 next'), 'checklist status');
expect('CP28 checklist R01 rows pass', ['CP28-R01-01', 'CP28-R01-02', 'CP28-R01-03', 'CP28-R01-04', 'CP28-R01-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'R01 rows pass');
expect('CP28 checklist includes a valid post-R01 next action', checklist.includes('Start `CP28-R02 - Candidate Collection From Snapshot-Backed Graph Indexes`') || checklist.includes('Start `CP28-R03 - Ranking And Explanation Using Allowed Operational Signals`'), 'post-R01 next');

expect('No private CP28 API route is introduced yet', !controller.includes("graph-aware-retrieval/cp28") && !mobileApi.includes('/api/private-content/graph-aware-retrieval/cp28'), 'no CP28 API yet');
expect('No public CP28 route exists', !controller.includes('public-content/graph-aware-retrieval/cp28') && !mobileApi.includes('/api/public-content/graph-aware-retrieval/cp28'), 'no public route');
expect('No env file path access introduced', !/['"]\.env/.test(`${r01Doc}\n${sprintPlan}\n${checklist}\n${controller}\n${mobileApi}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP28-R01 retrieval architecture verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP28-R01 retrieval architecture verification passed.');
