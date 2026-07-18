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

runNodeScript('scripts/check_cp27_g03_partition_index_graph.mjs');
runNodeScript('scripts/generate_cp27_g04_vault_packs.mjs');

const report = readText('docs/09_sprints/resource_audit_import_prototype/CP27_G04_VAULT_PACK_REGENERATION.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP27_REFRESH_BACKED_GRAPH_AND_VAULT_REBUILD_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP27_REFRESH_BACKED_GRAPH_AND_VAULT_REBUILD_ACCEPTANCE_CHECKLIST.md');
const latestVault = readJson('data/vault/cp27-refresh/latest-vault.json');
const manifest = readJson('data/vault/cp27-refresh/vault/cp27-g04-refresh-vault/manifest.json');
const summary = readJson('data/vault/cp27-refresh/vault/cp27-g04-refresh-vault/summary.json');
const checksumLedger = readJson('data/vault/cp27-refresh/vault/cp27-g04-refresh-vault/checksum-ledger.json');
const sourceGraph = readJson('data/graphify/cp27-refresh/latest-graph.json');
const baselineVault = readJson('data/vault/full-private/manifest.json');

expect('G04 report records complete status', report.includes('Status: Complete'), 'Status: Complete');
expect('G04 report identifies generated vault artifacts', report.includes('manifest.json') && report.includes('summary.json') && report.includes('checksum-ledger.json') && report.includes('latest-vault.json'), 'vault artifacts');
expect('G04 report states CP22 vault baseline is not overwritten', report.includes('does not overwrite') && report.includes('data/vault/full-private'), 'baseline boundary');
expect('G04 report documents public-safe zero boundary', report.includes('Public-safe vault artifacts | 0') && report.includes('Public-safe graph nodes | 0'), 'public boundary');

expect('Sprint plan marks G04 complete', sprintPlan.includes('Status: CP27-G04 complete; CP27-G05 next') || sprintPlan.includes('Status: CP27-G05 complete; CP27-G06 next') || sprintPlan.includes('Status: CP27-G06 complete; CP27-G07 next') || sprintPlan.includes('Status: CP27 complete; recommended next scope CP28'), 'sprint status');
expect('Sprint plan G04 complete', /CP27-G04[\s\S]*?Status: Complete/.test(sprintPlan), 'G04 status complete');
expect('Checklist G04 rows pass', ['CP27-G04-01', 'CP27-G04-02', 'CP27-G04-03', 'CP27-G04-04', 'CP27-G04-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'G04 rows pass');
expect('Checklist preserves G04 completion and later progression', checklist.includes('Start `CP27-G05 - Graph/Vault Diff Proof Against CP22 Baseline`') || checklist.includes('Start `CP27-G06 - Graph/Vault Internal UI Inspection Proof`') || checklist.includes('Start `CP27-G07 - Combined Verification And Close-Out`') || checklist.includes('Start `CP28 - Retrieval Engine Integration From Refreshed Graph`'), 'G04 complete with later progression');

expect('Latest vault pointer matches manifest checksum', latestVault?.manifestSha256 === sha256File(latestVault?.manifestPath || ''), latestVault?.manifestSha256);
expect('Checksum ledger tracks vault artifacts', Array.isArray(checksumLedger?.artifacts) && checksumLedger.artifacts.length === 28 && checksumLedger.artifacts.every((artifact) => artifact.checksumSha256 === sha256File(artifact.path)), 'ledger checksums');
expect('Manifest schema and checkpoint are correct', manifest?.schemaVersion === 'cp27.refresh-vault-manifest.v1' && manifest?.checkpoint === 'CP27-G04', `${manifest?.schemaVersion} ${manifest?.checkpoint}`);
expect('Manifest uses G03 refreshed graph', manifest?.sourceGraphManifestPath === sourceGraph?.manifestPath && manifest?.sourceGraphManifestSha256 === sourceGraph?.manifestSha256 && manifest?.sourceGraphCheckpoint === 'CP27-G03', 'source graph');
expect('Manifest preserves CP22 vault baseline as input only', manifest?.baselineVaultManifestPath === 'data/vault/full-private/manifest.json' && manifest?.baselineVaultArtifactCount === baselineVault?.counts?.artifacts, 'baseline inputs');
expect('Generated vault counts are stable', manifest?.counts?.artifacts === 26 && manifest?.counts?.categories === 4 && manifest?.counts?.graphNodesReferenced === 147, JSON.stringify(manifest?.counts));
expect('Generated category counts are stable', manifest?.categoryCounts?.['release-gates'] === 2 && manifest?.categoryCounts?.partitions === 10 && manifest?.categoryCounts?.['source-groups'] === 13 && manifest?.categoryCounts?.quality === 1, JSON.stringify(manifest?.categoryCounts));
expect('Summary mirrors manifest counts', summary?.counts?.artifacts === manifest?.counts?.artifacts && summary?.counts?.graphNodesReferenced === manifest?.counts?.graphNodesReferenced, JSON.stringify(summary?.counts));
expect('Unresolved references and blockers remain visible', manifest?.counts?.unresolvedReferenceCount === 77 && manifest?.counts?.highOrCriticalBlockerCount === 30, JSON.stringify(manifest?.counts));
expect('Raw text bodies remain unexported', manifest?.requiredBoundary?.rawTextBodiesExported === false && manifest?.warnings?.some((warning) => warning.includes('raw Quran')), 'raw text boundary');
expect('Public-safe counts remain zero', [latestVault, manifest, summary].every((item) => item?.counts?.publicSafeArtifacts === 0 && item?.counts?.publicSafeGraphNodes === 0 && item?.counts?.publicSafeGraphEdges === 0 && item?.publicBoundary?.publicReleaseApproved === false), 'zero public-safe counts');
expect('All vault artifacts are private', manifest?.artifacts?.every((artifact) => artifact.publicSafe === false && artifact.path.startsWith('packs/')), 'private artifacts');
expect('No env file path access introduced', !/['"]\.env/.test(`${report}\n${sprintPlan}\n${checklist}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP27-G04 vault verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP27-G04 vault verification passed.');
