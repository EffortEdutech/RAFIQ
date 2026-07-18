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

runNodeScript('scripts/check_cp27_g02_snapshot_graph_mapper.mjs');
runNodeScript('scripts/generate_cp27_g03_partition_index_graph.mjs');

const report = readText('docs/09_sprints/resource_audit_import_prototype/CP27_G03_PARTITION_AND_INDEX_REGENERATION.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP27_REFRESH_BACKED_GRAPH_AND_VAULT_REBUILD_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP27_REFRESH_BACKED_GRAPH_AND_VAULT_REBUILD_ACCEPTANCE_CHECKLIST.md');
const latestGraph = readJson('data/graphify/cp27-refresh/latest-graph.json');
const manifest = readJson('data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/manifest.json');
const summary = readJson('data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/summary.json');
const checksumLedger = readJson('data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/checksum-ledger.json');

expect('G03 report records complete status', report.includes('Status: Complete'), 'Status: Complete');
expect('G03 report identifies generated graph artifacts', report.includes('manifest.json') && report.includes('summary.json') && report.includes('checksum-ledger.json') && report.includes('latest-graph.json'), 'graph artifacts');
expect('G03 report states summary snapshot boundary', report.includes('does not claim full CP22 node/edge parity') && report.includes('summary snapshots'), 'summary boundary');
expect('G03 report documents public-safe zero boundary', report.includes('Public-safe graph nodes | 0') && report.includes('Public-safe graph edges | 0'), 'public boundary');

expect('Sprint plan marks G03 complete', sprintPlan.includes('Status: CP27-G03 complete; CP27-G04 next') || sprintPlan.includes('Status: CP27-G04 complete; CP27-G05 next') || sprintPlan.includes('Status: CP27-G05 complete; CP27-G06 next') || sprintPlan.includes('Status: CP27-G06 complete; CP27-G07 next') || sprintPlan.includes('Status: CP27 complete; recommended next scope CP28'), 'sprint status');
expect('Sprint plan G03 complete', /CP27-G03[\s\S]*?Status: Complete/.test(sprintPlan), 'G03 status complete');
expect('Checklist G03 rows pass', ['CP27-G03-01', 'CP27-G03-02', 'CP27-G03-03', 'CP27-G03-04', 'CP27-G03-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'G03 rows pass');
expect('Checklist preserves G03 completion and later progression', checklist.includes('Start `CP27-G04 - Vault Pack Regeneration From Refreshed Graph`') || checklist.includes('Start `CP27-G05 - Graph/Vault Diff Proof Against CP22 Baseline`') || checklist.includes('Start `CP27-G06 - Graph/Vault Internal UI Inspection Proof`') || checklist.includes('Start `CP27-G07 - Combined Verification And Close-Out`') || checklist.includes('Start `CP28 - Retrieval Engine Integration From Refreshed Graph`'), 'G03 complete with later progression');

expect('Latest graph pointer matches manifest checksum', latestGraph?.manifestSha256 === sha256File(latestGraph?.manifestPath || ''), latestGraph?.manifestSha256);
expect('Checksum ledger tracks graph artifacts', Array.isArray(checksumLedger?.artifacts) && checksumLedger.artifacts.length === 24 && checksumLedger.artifacts.every((artifact) => artifact.checksumSha256 === sha256File(artifact.path)), 'ledger checksums');
expect('Manifest schema and checkpoint are correct', manifest?.schemaVersion === 'cp27.refresh-graph-manifest.v1' && manifest?.checkpoint === 'CP27-G03', `${manifest?.schemaVersion} ${manifest?.checkpoint}`);
expect('Manifest uses G02 mapper and CP26 snapshot', manifest?.sourceMapperId === 'cp27-g02-snapshot-graph-mapper' && manifest?.sourceSnapshotBatchId === 'cp26-snapshot-prototype-s03', `${manifest?.sourceMapperId} ${manifest?.sourceSnapshotBatchId}`);
expect('Manifest preserves CP22 baseline as input only', manifest?.baselineGraphManifestPath === 'data/graphify/full-private/manifest.json' && manifest?.baselineVaultManifestPath === 'data/vault/full-private/manifest.json', 'baseline inputs');
expect('Generated partition and index counts are stable', manifest?.counts?.partitions === 10 && manifest?.counts?.indexes === 12 && manifest?.counts?.totalNodes === 147 && manifest?.counts?.totalEdges === 125, JSON.stringify(manifest?.counts));
expect('All expected partitions exist', ['governance', 'hadith', 'hadith-grades', 'product-evidence', 'quality', 'quran', 'sources', 'tafsir', 'topics', 'translations'].every((name) => manifest?.partitions?.some((partition) => partition.name === name)), 'partitions');
expect('All expected indexes exist', ['by-node-id', 'by-edge-id', 'by-canonical-ref', 'by-source-id', 'by-snapshot-id', 'by-ayah-key', 'by-hadith-key', 'by-topic-key', 'by-release-state', 'by-review-state', 'by-quality-state', 'public-boundary'].every((name) => manifest?.indexes?.some((index) => index.name === name)), 'indexes');
expect('Summary mirrors manifest counts', summary?.counts?.totalNodes === manifest?.counts?.totalNodes && summary?.counts?.totalEdges === manifest?.counts?.totalEdges, JSON.stringify(summary?.counts));
expect('Unresolved references and blockers remain visible', manifest?.counts?.unresolvedReferenceCount === 77 && manifest?.counts?.highOrCriticalBlockerCount === 30, JSON.stringify(manifest?.counts));
expect('Raw text bodies remain unexported', manifest?.rawTextBodiesExported === false && manifest?.warnings?.some((warning) => warning.includes('Raw Quran')), 'raw text boundary');
expect('Public-safe counts remain zero', [latestGraph, manifest, summary].every((item) => item?.counts?.publicSafeNodes === 0 && item?.counts?.publicSafeEdges === 0 && item?.counts?.publicSafeSnapshotRowCount === 0 && item?.counts?.publicSafeVaultArtifactCount === 0 && item?.publicBoundary?.publicReleaseApproved === false), 'zero public-safe counts');
expect('Partition files have zero public-safe counts', manifest?.partitions?.every((partition) => {
  const partitionJson = readJson(`data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/${partition.path}`);
  return partitionJson?.publicSafeNodeCount === 0 && partitionJson?.publicSafeEdgeCount === 0 && partitionJson?.nodes?.every((node) => node.publicSafe === false) && partitionJson?.edges?.every((edge) => edge.publicSafe === false);
}), 'partition public-safe counts');
expect('No env file path access introduced', !/['"]\.env/.test(`${report}\n${sprintPlan}\n${checklist}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP27-G03 partition/index verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP27-G03 partition/index verification passed.');
