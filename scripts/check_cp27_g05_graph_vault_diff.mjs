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

runNodeScript('scripts/check_cp27_g04_vault_packs.mjs');
runNodeScript('scripts/generate_cp27_g05_graph_vault_diff.mjs');

const report = readText('docs/09_sprints/resource_audit_import_prototype/CP27_G05_GRAPH_VAULT_DIFF_PROOF.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP27_REFRESH_BACKED_GRAPH_AND_VAULT_REBUILD_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP27_REFRESH_BACKED_GRAPH_AND_VAULT_REBUILD_ACCEPTANCE_CHECKLIST.md');
const latestDiff = readJson('data/graphify/cp27-refresh/latest-diff.json');
const manifest = readJson('data/graphify/cp27-refresh/diff/cp27-g05-graph-vault-baseline-diff/manifest.json');
const graphDiff = readJson('data/graphify/cp27-refresh/diff/cp27-g05-graph-vault-baseline-diff/graph-diff-summary.json');
const vaultDiff = readJson('data/graphify/cp27-refresh/diff/cp27-g05-graph-vault-baseline-diff/vault-diff-summary.json');
const checksumLedger = readJson('data/graphify/cp27-refresh/diff/cp27-g05-graph-vault-baseline-diff/checksum-comparison-ledger.json');
const publicBoundaryDiff = readJson('data/graphify/cp27-refresh/diff/cp27-g05-graph-vault-baseline-diff/public-boundary-diff.json');

expect('G05 report records complete status', report.includes('Status: Complete'), 'Status: Complete');
expect('G05 report identifies diff artifacts', report.includes('graph-diff-summary.json') && report.includes('vault-diff-summary.json') && report.includes('checksum-comparison-ledger.json') && report.includes('public-boundary-diff.json'), 'diff artifacts');
expect('G05 report documents no parity claim', report.includes('does not claim CP22 parity') || report.includes('not CP22 parity'), 'no parity claim');
expect('G05 report documents all diff statuses', ['matched', 'added', 'removed', 'changed', 'deferred', 'blocked'].every((status) => report.includes(status)), 'diff statuses');

expect('Sprint plan marks G05 complete', /Status: CP27-G0[56] complete; CP27-G0[67] next/.test(sprintPlan) || sprintPlan.includes('Status: CP27 complete; recommended next scope CP28'), 'sprint status');
expect('Sprint plan G05 complete', /CP27-G05[\s\S]*?Status: Complete/.test(sprintPlan), 'G05 status complete');
expect('Checklist G05 rows pass', ['CP27-G05-01', 'CP27-G05-02', 'CP27-G05-03', 'CP27-G05-04', 'CP27-G05-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'G05 rows pass');
expect('Checklist recommends next checkpoint', checklist.includes('Start `CP27-G06 - Graph/Vault Internal UI Inspection Proof`') || checklist.includes('Start `CP27-G07 - Combined Verification And Close-Out`') || checklist.includes('Start `CP28 - Retrieval Engine Integration From Refreshed Graph`'), 'next checkpoint');

expect('Latest diff pointer matches manifest checksum', latestDiff?.manifestSha256 === sha256File(latestDiff?.manifestPath || ''), latestDiff?.manifestSha256);
expect('Manifest schema and checkpoint are correct', manifest?.schemaVersion === 'cp27.graph-vault-diff-proof-manifest.v1' && manifest?.checkpoint === 'CP27-G05', `${manifest?.schemaVersion} ${manifest?.checkpoint}`);
expect('Diff artifact checksums match', Object.entries(manifest?.artifactPaths ?? {}).every(([key, filePath]) => {
  const checksumKey = `${key}Sha256`;
  return manifest.checksums?.[checksumKey] === sha256File(filePath);
}), 'artifact checksums');
expect('Graph diff counts are stable', graphDiff?.baseline?.nodeCount === 79657 && graphDiff?.refreshed?.nodeCount === 147 && graphDiff?.baseline?.edgeCount === 147689 && graphDiff?.refreshed?.edgeCount === 125, JSON.stringify(graphDiff?.countDelta));
expect('Vault diff counts are stable', vaultDiff?.baseline?.artifactCount === 158 && vaultDiff?.refreshed?.artifactCount === 26 && vaultDiff?.countDelta?.artifactDelta === -132, JSON.stringify(vaultDiff?.countDelta));
expect('Graph diff statuses include required classes', ['matched', 'removed', 'changed', 'deferred', 'blocked'].every((status) => graphDiff?.classificationCounts?.[status] > 0), JSON.stringify(graphDiff?.classificationCounts));
expect('Vault diff statuses include required classes', ['matched', 'added', 'removed', 'changed', 'deferred', 'blocked'].every((status) => vaultDiff?.classificationCounts?.[status] > 0), JSON.stringify(vaultDiff?.classificationCounts));
expect('Checksum ledger entries match', checksumLedger?.counts?.totalEntries === 4 && checksumLedger?.counts?.matchedCount === 2 && checksumLedger?.counts?.addedCount === 2 && checksumLedger?.entries?.every((entry) => entry.checksumMatches === true), JSON.stringify(checksumLedger?.counts));
expect('Public boundary remains blocked', publicBoundaryDiff?.counts?.publicSafeGraphNodeCount === 0 && publicBoundaryDiff?.counts?.publicSafeGraphEdgeCount === 0 && publicBoundaryDiff?.counts?.publicSafeVaultArtifactCount === 0 && publicBoundaryDiff?.publicRelease?.status === 'blocked', JSON.stringify(publicBoundaryDiff?.counts));
expect('Manifest preserves blocker counts', manifest?.counts?.unresolvedReferenceCount === 77 && manifest?.counts?.highOrCriticalBlockerCount === 30, JSON.stringify(manifest?.counts));
expect('Manifest public-safe counts remain zero', manifest?.counts?.publicSafeSnapshotRowCount === 0 && manifest?.counts?.publicSafeGraphNodeCount === 0 && manifest?.counts?.publicSafeGraphEdgeCount === 0 && manifest?.counts?.publicSafeVaultArtifactCount === 0 && manifest?.publicBoundary?.publicReleaseApproved === false, 'zero public-safe counts');
expect('No env file path access introduced', !/['"]\.env/.test(`${report}\n${sprintPlan}\n${checklist}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP27-G05 graph/vault diff verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP27-G05 graph/vault diff verification passed.');
