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

runNodeScript('scripts/check_cp25_a09_close_out.mjs');

const report = readText('docs/09_sprints/resource_audit_import_prototype/CP26_S01_SNAPSHOT_ARCHITECTURE_AND_SOURCE_MAP.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP26_LIVE_SNAPSHOT_EXPORT_AND_REFRESH_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP26_LIVE_SNAPSHOT_EXPORT_AND_REFRESH_ACCEPTANCE_CHECKLIST.md');
const graphManifest = readJson('data/graphify/full-private/manifest.json');
const vaultManifest = readJson('data/vault/full-private/manifest.json');
const retrievalManifest = readJson('data/retrieval/cp24/manifest.json');
const reviewManifest = readJson('data/review/cp25/manifest.json');
const reviewExportManifest = readJson('data/review/cp25/a07-export-manifest.json');

expect('S01 report records complete status', report.includes('Status: Complete'), 'Status: Complete');
expect('S01 report references CP25 baseline verifier', report.includes('node scripts\\check_cp25_a09_close_out.mjs'), 'CP25 verifier');
expect('S01 report includes snapshot architecture', report.includes('## 3. Snapshot Architecture') && report.includes('batch-oriented private snapshot architecture'), 'architecture section');
expect('S01 report includes source table and export map', report.includes('## 4. Source Table And Export Map'), 'source map section');
expect('S01 report includes private artifact dependency map', report.includes('## 5. Private Artifact Dependency Map'), 'dependency map section');
expect('S01 report includes folder and manifest naming policy', report.includes('## 6. Folder And Manifest Naming Policy') && report.includes('data/snapshots/cp26/'), 'folder policy');
expect('S01 report includes public boundary policy', report.includes('## 7. Public Boundary Policy') && report.includes('publicReleaseApproved !== false'), 'public boundary');
expect('S01 report includes rollback and diff policy', report.includes('## 8. Rollback And Diff Policy') && report.includes('Rollback is not a git reset'), 'rollback policy');
expect('S01 report points to S02 next', report.includes('CP26-S02 - Snapshot Contracts And Manifest Schema'), 'S02 next');

for (const term of [
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
]) {
  expect(`S01 source map includes ${term}`, report.includes(`| \`${term}\``), term);
}

for (const term of [
  'Cp26SnapshotBatchManifest',
  'Cp26SnapshotSourceGroup',
  'Cp26SnapshotArtifactRef',
  'Cp26ChecksumLedger',
  'Cp26RefreshRun',
  'Cp26PublicBoundaryStatus',
  'Cp26RollbackManifest',
  'Cp26UnresolvedReferenceReport',
]) {
  expect(`S01 defines S02 contract input ${term}`, report.includes(term), term);
}

expect('Sprint plan marks S01 complete', sprintPlan.includes('Status: Complete. See `CP26_S01_SNAPSHOT_ARCHITECTURE_AND_SOURCE_MAP.md`'), 'S01 complete');
expect('Sprint plan recommends S02 next', sprintPlan.includes('CP26-S02 - Snapshot Contracts And Manifest Schema'), 'S02 next');
expect('Checklist marks S01 rows pass', ['CP26-S01-01', 'CP26-S01-02', 'CP26-S01-03', 'CP26-S01-04', 'CP26-S01-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |') && row.includes('CP26_S01_SNAPSHOT_ARCHITECTURE_AND_SOURCE_MAP.md');
}), 'S01 checklist rows');
expect(
  'Checklist includes a valid post-S01 next action',
  checklist.includes('Start `CP26-S02 - Snapshot Contracts And Manifest Schema`') ||
    checklist.includes('Start `CP26-S03 - Private Snapshot Export Prototype`') ||
    checklist.includes('Start `CP26-S04 - Refresh Pipeline Prototype`') ||
    checklist.includes('Start `CP26-S05 - Checksum, Diff, And Rollback Proof`') ||
    checklist.includes('Start `CP26-S06 - Private API And Internal UI Status Proof`') ||
    checklist.includes('Start `CP26-S07 - Combined Verification`') ||
    checklist.includes('Start `CP26-S08 - Close-Out And Next Scope Decision`'),
  'post-S01 next action',
);

expect('CP22 graph baseline still private with zero public-safe counts', graphManifest?.privateOnly !== false && graphManifest?.publicSafe === false && graphManifest?.counts?.publicSafeNodes === 0 && graphManifest?.counts?.publicSafeEdges === 0, JSON.stringify(graphManifest?.counts));
expect('CP22 vault baseline still private with zero public-safe artifacts', vaultManifest?.publicSafe === false && vaultManifest?.counts?.publicSafeArtifacts === 0, JSON.stringify(vaultManifest?.counts));
expect('CP24 retrieval baseline still private with zero public-safe route/candidate counts', retrievalManifest?.privateOnly === true && retrievalManifest?.publicReleaseApproved === false && retrievalManifest?.counts?.publicSafeCandidateCount === 0 && retrievalManifest?.counts?.validationHandoff?.publicSafeRouteItemCount === 0, JSON.stringify(retrievalManifest?.counts));
expect('CP25 review baseline still private with zero public-safe counts', reviewManifest?.privateOnly === true && reviewManifest?.publicReleaseApproved === false && reviewManifest?.counts?.publicSafeCandidateCount === 0 && reviewManifest?.counts?.publicSafeRouteItemCount === 0, JSON.stringify(reviewManifest?.counts));
expect('CP25 export baseline keeps public release blocked', reviewExportManifest?.privateOnly === true && reviewExportManifest?.publicReleaseApproved === false && reviewExportManifest?.counts?.publicReleaseApprovedEventCount === 0, JSON.stringify(reviewExportManifest?.counts));
expect('No env file path access introduced', !/['"]\.env/.test(`${report}\n${sprintPlan}\n${checklist}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP26-S01 verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP26-S01 snapshot architecture and source map verification passed.');
