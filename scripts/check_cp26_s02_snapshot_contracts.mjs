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

runNodeScript('scripts/check_cp26_s01_snapshot_architecture_source_map.mjs');

const shared = readText('packages/shared/src/private-content.ts');
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP26_S02_SNAPSHOT_CONTRACTS_AND_MANIFEST_SCHEMA.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP26_LIVE_SNAPSHOT_EXPORT_AND_REFRESH_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP26_LIVE_SNAPSHOT_EXPORT_AND_REFRESH_ACCEPTANCE_CHECKLIST.md');

const requiredTypes = [
  'PrivateCp26SnapshotGroupKey',
  'PrivateCp26ArtifactFamily',
  'PrivateCp26PublicBoundaryStatus',
  'PrivateCp26SnapshotArtifactRef',
  'PrivateCp26SnapshotSourceGroup',
  'PrivateCp26ChecksumLedgerEntry',
  'PrivateCp26ChecksumLedger',
  'PrivateCp26SnapshotBatchManifest',
  'PrivateCp26RefreshRun',
  'PrivateCp26UnresolvedReference',
  'PrivateCp26UnresolvedReferenceReport',
  'PrivateCp26RollbackManifest',
  'PrivateCp26SnapshotStatusResponse',
];

for (const typeName of requiredTypes) {
  expect(`Shared type exported: ${typeName}`, shared.includes(`export type ${typeName}`), typeName);
  expect(`S02 report names type: ${typeName}`, report.includes(typeName), typeName);
}

for (const groupKey of [
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
  expect(`Snapshot group key locked: ${groupKey}`, shared.includes(`| '${groupKey}'`), groupKey);
}

const requiredSharedTerms = [
  "schemaVersion: 'cp26.snapshot-batch-manifest.v1'",
  "schemaVersion: 'cp26.checksum-ledger.v1'",
  "schemaVersion: 'cp26.unresolved-reference-report.v1'",
  "schemaVersion: 'cp26.rollback-manifest.v1'",
  "sourceCheckpoint: 'CP26-S01'",
  'privateOnly: true',
  'publicReleaseApproved: false',
  'publicRouteExposed: false',
  'publicSafeChangeRequested: false',
  'publicSafeSnapshotRowCount: 0',
  'publicSafeGraphNodeCount: 0',
  'publicSafeGraphEdgeCount: 0',
  'publicSafeVaultArtifactCount: 0',
  'publicSafeRetrievalCandidateCount: 0',
  'publicSafeRouteItemCount: 0',
  'publicSafeReviewItemCount: 0',
  'publicSafeAuditEventCount: 0',
  "'GET /api/private-content/snapshots/cp26'",
  "'generated_private_artifacts_only'",
  "'sha256'",
];

for (const term of requiredSharedTerms) {
  expect(`Shared CP26 contract locks: ${term}`, shared.includes(term), term);
}

const requiredDocTerms = [
  '# CP26-S02 - Snapshot Contracts And Manifest Schema',
  'Status: Complete',
  'Snapshot Batch Manifest Contract',
  'Source Snapshot Metadata Contract',
  'Checksum Ledger Contract',
  'Refresh Run Contract',
  'Public Boundary Contract',
  'Error, Unresolved Reference, And Rollback Contracts',
  'Private Status Response Contract',
  'CP26-S03 - Private Snapshot Export Prototype',
];

for (const term of requiredDocTerms) {
  expect(`S02 report includes: ${term}`, report.includes(term), term);
}

expect('Sprint plan marks S02 complete', sprintPlan.includes('Status: Complete. See `CP26_S02_SNAPSHOT_CONTRACTS_AND_MANIFEST_SCHEMA.md`'), 'S02 complete');
expect('Sprint plan recommends S03 next', sprintPlan.includes('CP26-S03 - Private Snapshot Export Prototype'), 'S03 next');
expect('Checklist marks S02 rows pass', ['CP26-S02-01', 'CP26-S02-02', 'CP26-S02-03', 'CP26-S02-04', 'CP26-S02-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |') && row.includes('CP26_S02_SNAPSHOT_CONTRACTS_AND_MANIFEST_SCHEMA.md');
}), 'S02 checklist rows');
expect(
  'Checklist includes a valid post-S02 next action',
  checklist.includes('Start `CP26-S03 - Private Snapshot Export Prototype`') ||
    checklist.includes('Start `CP26-S04 - Refresh Pipeline Prototype`') ||
    checklist.includes('Start `CP26-S05 - Checksum, Diff, And Rollback Proof`') ||
    checklist.includes('Start `CP26-S06 - Private API And Internal UI Status Proof`') ||
    checklist.includes('Start `CP26-S07 - Combined Verification`') ||
    checklist.includes('Start `CP26-S08 - Close-Out And Next Scope Decision`'),
  'post-S02 next action',
);
expect('No env file path access introduced', !/['"]\.env/.test(`${shared}\n${report}\n${sprintPlan}\n${checklist}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP26-S02 snapshot contract verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP26-S02 snapshot contract verification passed.');
