#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const checks = [];
const BATCH_ID = 'cp26-snapshot-prototype-s03';
const BATCH_DIR = `data/snapshots/cp26/batches/${BATCH_ID}`;
const REQUIRED_GROUPS = [
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
];

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

function sha256Text(text) {
  return createHash('sha256').update(text).digest('hex').toUpperCase();
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

runNodeScript('scripts/generate_cp26_s03_private_snapshot_export.mjs');

const manifestText = readText(`${BATCH_DIR}/manifest.json`);
const ledgerText = readText(`${BATCH_DIR}/checksum-ledger.json`);
const latestText = readText('data/snapshots/cp26/latest-manifest.json');
const manifest = manifestText ? JSON.parse(manifestText) : null;
const ledger = ledgerText ? JSON.parse(ledgerText) : null;
const latest = latestText ? JSON.parse(latestText) : null;
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP26_S03_PRIVATE_SNAPSHOT_EXPORT_PROTOTYPE.md');
const s02Report = readText('docs/09_sprints/resource_audit_import_prototype/CP26_S02_SNAPSHOT_CONTRACTS_AND_MANIFEST_SCHEMA.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP26_LIVE_SNAPSHOT_EXPORT_AND_REFRESH_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP26_LIVE_SNAPSHOT_EXPORT_AND_REFRESH_ACCEPTANCE_CHECKLIST.md');
const generator = readText('scripts/generate_cp26_s03_private_snapshot_export.mjs');

expect('Manifest schema and checkpoint are correct', manifest?.schemaVersion === 'cp26.snapshot-batch-manifest.v1' && manifest?.checkpoint === 'CP26-S03', `${manifest?.schemaVersion} ${manifest?.checkpoint}`);
expect('Manifest batch id is stable', manifest?.snapshotBatchId === BATCH_ID, manifest?.snapshotBatchId);
expect('Manifest is private and not public release approved', manifest?.privateOnly === true && manifest?.publicReleaseApproved === false, 'private boundary');
expect('Manifest source checkpoint remains S01', manifest?.sourceCheckpoint === 'CP26-S01', manifest?.sourceCheckpoint);
expect('Manifest has all 13 source groups', manifest?.counts?.sourceGroupCount === 13 && manifest?.sourceGroups?.length === 13, JSON.stringify(manifest?.counts));
expect('Manifest has all 13 snapshot artifacts', manifest?.counts?.snapshotArtifactCount === 13 && manifest?.artifactRefs?.length === 13, JSON.stringify(manifest?.counts));
expect('Manifest has no derived outputs in S03', manifest?.counts?.derivedOutputCount === 0 && manifest?.derivedOutputs?.length === 0, JSON.stringify(manifest?.counts));
expect('Manifest public-safe counts remain zero', manifest?.counts?.publicSafeSnapshotRowCount === 0 && manifest?.counts?.publicSafeGraphNodeCount === 0 && manifest?.counts?.publicSafeGraphEdgeCount === 0 && manifest?.counts?.publicSafeVaultArtifactCount === 0, JSON.stringify(manifest?.counts));
expect('Manifest keeps unresolved references and blockers visible', manifest?.counts?.unresolvedReferenceCount === 77 && manifest?.counts?.highOrCriticalBlockerCount === 30, JSON.stringify(manifest?.counts));
expect('Manifest warning states no live DB export', manifest?.warnings?.some((warning) => warning.includes('not live database rows')), JSON.stringify(manifest?.warnings));
expect('S02 contract report is complete before S03 export verification', s02Report.includes('Status: Complete') && s02Report.includes('PrivateCp26SnapshotBatchManifest'), 'S02 complete');

for (const groupKey of REQUIRED_GROUPS) {
  const sourceGroup = manifest?.sourceGroups?.find((group) => group.groupKey === groupKey);
  const artifact = manifest?.artifactRefs?.find((ref) => ref.artifactId === `cp26:s03:snapshot:${groupKey}`);
  expect(`Manifest includes source group ${groupKey}`, Boolean(sourceGroup), groupKey);
  expect(`Manifest includes artifact ref ${groupKey}`, Boolean(artifact), groupKey);
  if (sourceGroup) {
    const snapshotText = readText(sourceGroup.snapshotPath);
    const snapshot = snapshotText ? JSON.parse(snapshotText) : null;
    expect(`Snapshot checksum matches ${groupKey}`, sha256Text(snapshotText) === sourceGroup.checksumSha256, sourceGroup.checksumSha256);
    expect(`Snapshot is private ${groupKey}`, snapshot?.privateOnly === true && snapshot?.publicReleaseApproved === false, groupKey);
    expect(`Snapshot has rows ${groupKey}`, Array.isArray(snapshot?.rows) && snapshot.rows.length === sourceGroup.rowCount && sourceGroup.rowCount > 0, `${groupKey}:${sourceGroup.rowCount}`);
    expect(`Snapshot public boundary zero ${groupKey}`, snapshot?.publicBoundary?.publicSafeSnapshotRowCount === 0 && snapshot?.publicBoundary?.publicRouteExposed === false, groupKey);
  }
}

expect('Ledger schema and batch are correct', ledger?.schemaVersion === 'cp26.checksum-ledger.v1' && ledger?.sourceSnapshotBatchId === BATCH_ID, `${ledger?.schemaVersion} ${ledger?.sourceSnapshotBatchId}`);
expect('Ledger count matches artifacts', ledger?.counts?.totalEntries === 13 && ledger?.entries?.length === 13, JSON.stringify(ledger?.counts));
expect('Ledger entries are all new for prototype', ledger?.counts?.newCount === 13 && ledger?.counts?.changedCount === 0 && ledger?.counts?.missingCount === 0 && ledger?.counts?.staleCount === 0, JSON.stringify(ledger?.counts));
expect('Ledger checksum matches manifest pointer', sha256Text(ledgerText) === manifest?.checksumLedgerSha256, manifest?.checksumLedgerSha256);
expect('Every ledger entry matches artifact checksum', ledger?.entries?.every((entry) => entry.checksumSha256 === entry.artifactRef?.checksumSha256 && entry.algorithm === 'sha256' && entry.status === 'new'), 'ledger checksum refs');
expect('Latest pointer references S03 manifest', latest?.snapshotBatchId === BATCH_ID && latest?.manifestPath === `${BATCH_DIR}/manifest.json`, JSON.stringify(latest));
expect('Latest pointer checksum matches manifest file', latest?.manifestSha256 === sha256Text(manifestText), latest?.manifestSha256);
expect('Report records complete status', report.includes('Status: Complete'), 'report complete');
expect('Report documents generated artifacts', report.includes('sourceGroupCount: 13') && report.includes('snapshotArtifactCount: 13') && report.includes('checksum-ledger.json'), 'artifact summary');
expect('Report keeps public release blocked', report.includes('Public release remains blocked') && report.includes('public-safe counts remain zero'), 'public boundary');
expect('Sprint plan marks S03 complete', sprintPlan.includes('Status: Complete. See `CP26_S03_PRIVATE_SNAPSHOT_EXPORT_PROTOTYPE.md`'), 'S03 complete');
expect('Sprint plan recommends S04 next', sprintPlan.includes('CP26-S04 - Refresh Pipeline Prototype'), 'S04 next');
expect('Checklist marks S03 rows pass', ['CP26-S03-01', 'CP26-S03-02', 'CP26-S03-03', 'CP26-S03-04', 'CP26-S03-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |') && row.includes('scripts/check_cp26_s03_private_snapshot_export.mjs');
}), 'S03 checklist rows');
expect(
  'Checklist includes a valid post-S03 next action',
  checklist.includes('Start `CP26-S04 - Refresh Pipeline Prototype`') ||
    checklist.includes('Start `CP26-S05 - Checksum, Diff, And Rollback Proof`') ||
    checklist.includes('Start `CP26-S06 - Private API And Internal UI Status Proof`') ||
    checklist.includes('Start `CP26-S07 - Combined Verification`') ||
    checklist.includes('Start `CP26-S08 - Close-Out And Next Scope Decision`'),
  'post-S03 next action',
);
expect('No env file path access introduced', !/['"]\.env/.test(`${generator}\n${report}\n${sprintPlan}\n${checklist}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP26-S03 private snapshot export verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP26-S03 private snapshot export verification passed.');
