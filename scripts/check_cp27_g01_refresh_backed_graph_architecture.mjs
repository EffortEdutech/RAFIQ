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

runNodeScript('scripts/check_cp26_s08_close_out.mjs');

const report = readText('docs/09_sprints/resource_audit_import_prototype/CP27_G01_REFRESH_BACKED_GRAPH_REBUILD_ARCHITECTURE.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP27_REFRESH_BACKED_GRAPH_AND_VAULT_REBUILD_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP27_REFRESH_BACKED_GRAPH_AND_VAULT_REBUILD_ACCEPTANCE_CHECKLIST.md');
const roadmap = readText('docs/09_sprints/resource_audit_import_prototype/RAFIQ_GRAPHIFY_PRODUCT_DEVELOPMENT_ROADMAP_CP26_TO_COMPLETION.md');
const cp26CloseOut = readText('docs/09_sprints/resource_audit_import_prototype/CP26_S08_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md');
const snapshotManifest = readJson('data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json');
const graphManifest = readJson('data/graphify/full-private/manifest.json');
const vaultManifest = readJson('data/vault/full-private/manifest.json');

expect('G01 report records complete status', report.includes('Status: Complete'), 'Status: Complete');
expect('G01 report is architecture-only', report.includes('architecture-only') && report.includes('does not generate a new graph'), 'architecture-only');
expect('G01 report identifies CP26 source snapshot', report.includes('cp26-snapshot-prototype-s03') && report.includes('data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json'), 'CP26 snapshot');
expect('G01 report identifies CP22 graph and vault baseline', report.includes('data/graphify/full-private/manifest.json') && report.includes('data/vault/full-private/manifest.json'), 'CP22 baseline');
expect('G01 report records baseline counts', report.includes('79,657') && report.includes('147,689') && report.includes('158'), 'baseline counts');
expect('G01 report maps all CP26 source groups', [
  'source_registry',
  'raw_lineage',
  'quran',
  'translations',
  'tafsir',
  'topics_themes',
  'hadith',
  'hadith_quality',
  'cross_domain_links',
  'private_retrieval',
  'private_review',
  'private_audit',
  'graph_vault_baseline',
].every((term) => report.includes(term)), 'source group map');
expect('G01 report defines output policy', report.includes('data/graphify/cp27-refresh/') && report.includes('data/vault/cp27-refresh/') && report.includes('must not overwrite'), 'output policy');
expect('G01 report defines manifest policy', report.includes('sourceSnapshotBatchId') && report.includes('baselineGraphChecksumSha256') && report.includes('sourceGraphChecksumSha256'), 'manifest policy');
expect('G01 report defines partition and index strategy', report.includes('by-canonical-ref') && report.includes('public-boundary') && report.includes('deferred') && report.includes('blocked'), 'partition index strategy');
expect('G01 report defines diff statuses', ['matched', 'added', 'removed', 'changed', 'deferred', 'blocked'].every((term) => report.includes(`\`${term}\``)), 'diff statuses');
expect('G01 report keeps public boundary blocked', report.includes('Public-safe graph nodes | 0') && report.includes('Public CP27 graph/vault route exposed | false'), 'public boundary');
expect('G01 report recommends G02 next', report.includes('CP27-G02 - Snapshot-To-Node And Snapshot-To-Edge Mapper'), 'G02 next');

expect('Sprint plan marks G01 complete', sprintPlan.includes('Status: CP27-G01 complete; CP27-G02 next') || sprintPlan.includes('Status: CP27-G02 complete; CP27-G03 next') || sprintPlan.includes('Status: CP27-G03 complete; CP27-G04 next') || sprintPlan.includes('Status: CP27-G04 complete; CP27-G05 next') || sprintPlan.includes('Status: CP27-G05 complete; CP27-G06 next') || sprintPlan.includes('Status: CP27-G06 complete; CP27-G07 next') || sprintPlan.includes('Status: CP27 complete; recommended next scope CP28'), 'sprint status');
expect('Sprint plan records CP27 objective', sprintPlan.includes('rebuilds the RAFIQ full private resource graph and private vault packs from CP26 snapshot batches'), 'objective');
expect('Sprint plan lists CP27 checkpoints', ['CP27-G01', 'CP27-G02', 'CP27-G03', 'CP27-G04', 'CP27-G05', 'CP27-G06', 'CP27-G07'].every((term) => sprintPlan.includes(term)), 'checkpoints');
expect('Checklist records CP27 readiness', checklist.includes('| CP27-R01 |') && checklist.includes('| CP27-R05 |'), 'readiness');
expect('Checklist G01 rows pass', ['CP27-G01-01', 'CP27-G01-02', 'CP27-G01-03', 'CP27-G01-04', 'CP27-G01-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'G01 rows pass');
expect('Checklist preserves G01 completion and later progression', checklist.includes('Start `CP27-G02 - Snapshot-To-Node And Snapshot-To-Edge Mapper`') || checklist.includes('Start `CP27-G03 - Partition And Index Regeneration From Snapshots`') || checklist.includes('Start `CP27-G04 - Vault Pack Regeneration From Refreshed Graph`') || checklist.includes('Start `CP27-G05 - Graph/Vault Diff Proof Against CP22 Baseline`') || checklist.includes('Start `CP27-G06 - Graph/Vault Internal UI Inspection Proof`') || checklist.includes('Start `CP27-G07 - Combined Verification And Close-Out`') || checklist.includes('Start `CP28 - Retrieval Engine Integration From Refreshed Graph`'), 'G01 complete with later progression');
expect('Roadmap recommends CP27', roadmap.includes('CP27 - Refresh-Backed Graph And Vault Rebuild'), 'roadmap CP27');
expect('CP26 close-out recommends CP27', cp26CloseOut.includes('CP27 - Refresh-Backed Graph And Vault Rebuild'), 'CP26 handoff');

expect('CP26 snapshot baseline counts are stable', snapshotManifest?.counts?.sourceGroupCount === 13 && snapshotManifest?.counts?.snapshotArtifactCount === 13 && snapshotManifest?.counts?.unresolvedReferenceCount === 77 && snapshotManifest?.counts?.highOrCriticalBlockerCount === 30, JSON.stringify(snapshotManifest?.counts));
expect('CP22 graph baseline counts are stable', graphManifest?.counts?.totalNodes === 79657 && graphManifest?.counts?.totalEdges === 147689 && graphManifest?.counts?.publicSafeNodes === 0 && graphManifest?.counts?.publicSafeEdges === 0, JSON.stringify(graphManifest?.counts));
expect('CP22 vault baseline counts are stable', vaultManifest?.counts?.artifacts === 158 && vaultManifest?.counts?.publicSafeArtifacts === 0 && vaultManifest?.requiredBoundary?.publicReleaseApproved === false, JSON.stringify(vaultManifest?.counts));
expect('No env file path access introduced', !/['"]\.env/.test(`${report}\n${sprintPlan}\n${checklist}\n${roadmap}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP27-G01 architecture verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP27-G01 architecture verification passed.');
