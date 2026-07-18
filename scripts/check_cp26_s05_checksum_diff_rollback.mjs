#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const checks = [];
const PROOF_ID = 'cp26-checksum-diff-rollback-proof-s05';
const OUT_DIR = `data/snapshots/cp26/diff/${PROOF_ID}`;

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

runNodeScript('scripts/generate_cp26_s04_refresh_pipeline.mjs');
runNodeScript('scripts/generate_cp26_s05_checksum_diff_rollback.mjs');

const manifestText = readText(`${OUT_DIR}/manifest.json`);
const checksumLedgerText = readText(`${OUT_DIR}/checksum-comparison-ledger.json`);
const snapshotDiffText = readText(`${OUT_DIR}/snapshot-diff-summary.json`);
const artifactDiffText = readText(`${OUT_DIR}/artifact-diff-summary.json`);
const rollbackText = readText(`${OUT_DIR}/rollback-manifest.json`);
const staleDetectionText = readText(`${OUT_DIR}/stale-artifact-detection.json`);
const latestDiffText = readText('data/snapshots/cp26/latest-diff.json');
const manifest = manifestText ? JSON.parse(manifestText) : null;
const checksumLedger = checksumLedgerText ? JSON.parse(checksumLedgerText) : null;
const snapshotDiff = snapshotDiffText ? JSON.parse(snapshotDiffText) : null;
const artifactDiff = artifactDiffText ? JSON.parse(artifactDiffText) : null;
const rollback = rollbackText ? JSON.parse(rollbackText) : null;
const staleDetection = staleDetectionText ? JSON.parse(staleDetectionText) : null;
const latestDiff = latestDiffText ? JSON.parse(latestDiffText) : null;
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP26_S05_CHECKSUM_DIFF_AND_ROLLBACK_PROOF.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP26_LIVE_SNAPSHOT_EXPORT_AND_REFRESH_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP26_LIVE_SNAPSHOT_EXPORT_AND_REFRESH_ACCEPTANCE_CHECKLIST.md');
const generator = readText('scripts/generate_cp26_s05_checksum_diff_rollback.mjs');

expect('Proof manifest schema and checkpoint are correct', manifest?.schemaVersion === 'cp26.checksum-diff-rollback-proof-manifest.v1' && manifest?.checkpoint === 'CP26-S05', `${manifest?.schemaVersion} ${manifest?.checkpoint}`);
expect('Proof manifest id is stable', manifest?.proofId === PROOF_ID, manifest?.proofId);
expect('Proof consumes S03 and S04', manifest?.sourceSnapshotBatchId === 'cp26-snapshot-prototype-s03' && manifest?.refreshRunId === 'cp26-refresh-prototype-s04', `${manifest?.sourceSnapshotBatchId} ${manifest?.refreshRunId}`);
expect('Proof counts checksum entries', manifest?.counts?.beforeSnapshotEntryCount === 13 && manifest?.counts?.afterRefreshEntryCount === 4 && manifest?.counts?.totalChecksumEntryCount === 17, JSON.stringify(manifest?.counts));
expect('Proof counts diff states', manifest?.counts?.unchangedCount === 13 && manifest?.counts?.addedCount === 4 && manifest?.counts?.changedCount === 0 && manifest?.counts?.removedCount === 0, JSON.stringify(manifest?.counts));
expect('Proof detects mismatch probe without stale artifacts', manifest?.counts?.detectedMismatchProbeCount === 1 && manifest?.counts?.staleArtifactCount === 0 && manifest?.counts?.mismatchedArtifactCount === 0, JSON.stringify(manifest?.counts));
expect('Proof carries unresolved references and blockers forward', manifest?.counts?.unresolvedReferenceCount === 77 && manifest?.counts?.highOrCriticalBlockerCount === 30, JSON.stringify(manifest?.counts));
expect('Proof public-safe counts remain zero', manifest?.counts?.publicSafeSnapshotRowCount === 0 && manifest?.counts?.publicSafeGraphNodeCount === 0 && manifest?.counts?.publicSafeGraphEdgeCount === 0 && manifest?.counts?.publicSafeVaultArtifactCount === 0, JSON.stringify(manifest?.counts));

expect('Checksum comparison ledger schema is correct', checksumLedger?.schemaVersion === 'cp26.checksum-comparison-ledger.v1', checksumLedger?.schemaVersion);
expect('Checksum comparison ledger covers snapshots and refresh outputs', checksumLedger?.entries?.length === 17 && checksumLedger?.counts?.beforeSnapshotEntryCount === 13 && checksumLedger?.counts?.afterRefreshEntryCount === 4, JSON.stringify(checksumLedger?.counts));
expect('All checksum ledger entries match files', checksumLedger?.entries?.every((entry) => entry.checksumMatches === true), 'all checksums match');
expect('Checksum comparison ledger has no stale or mismatched artifacts', checksumLedger?.counts?.staleCount === 0 && checksumLedger?.counts?.mismatchedCount === 0 && checksumLedger?.counts?.missingCount === 0, JSON.stringify(checksumLedger?.counts));

expect('Snapshot diff schema is correct', snapshotDiff?.schemaVersion === 'cp26.snapshot-diff-summary.v1', snapshotDiff?.schemaVersion);
expect('Snapshot diff records unchanged source groups', snapshotDiff?.sourceGroupDiffs?.length === 13 && snapshotDiff?.counts?.unchangedSourceGroupCount === 13 && snapshotDiff?.counts?.changedSourceGroupCount === 0, JSON.stringify(snapshotDiff?.counts));
expect('Snapshot diff keeps unresolved references visible', snapshotDiff?.counts?.unresolvedReferenceCount === 77 && snapshotDiff?.counts?.highOrCriticalBlockerCount === 30, JSON.stringify(snapshotDiff?.counts));

expect('Artifact diff schema is correct', artifactDiff?.schemaVersion === 'cp26.artifact-diff-summary.v1', artifactDiff?.schemaVersion);
expect('Artifact diff counts unchanged and added artifacts', artifactDiff?.counts?.beforeArtifactCount === 13 && artifactDiff?.counts?.afterArtifactCount === 4 && artifactDiff?.counts?.unchangedArtifactCount === 13 && artifactDiff?.counts?.addedArtifactCount === 4, JSON.stringify(artifactDiff?.counts));
expect('Artifact diff has no changed removed stale or mismatched artifacts', artifactDiff?.counts?.changedArtifactCount === 0 && artifactDiff?.counts?.removedArtifactCount === 0 && artifactDiff?.counts?.staleArtifactCount === 0 && artifactDiff?.counts?.mismatchedArtifactCount === 0, JSON.stringify(artifactDiff?.counts));

expect('Rollback manifest schema and target are correct', rollback?.schemaVersion === 'cp26.rollback-manifest.v1' && rollback?.rollbackTarget === 'generated_private_artifacts_only', `${rollback?.schemaVersion} ${rollback?.rollbackTarget}`);
expect('Rollback manifest preserves prior snapshot refs', rollback?.priorManifestRefs?.length === 13, `${rollback?.priorManifestRefs?.length}`);
expect('Rollback manifest has explicit restore steps', rollback?.restoreSteps?.length === 6 && rollback.restoreSteps.some((step) => step.action === 'restore_manifest_pointer') && rollback.restoreSteps.some((step) => step.action === 'mark_refresh_rolled_back'), JSON.stringify(rollback?.restoreSteps?.map((step) => step.action)));
expect('Rollback manifest blocks audit overwrite', rollback?.restoreSteps?.every((step) => step.notes.includes('Do not') || step.notes.includes('do not') || step.action === 'restore_manifest_pointer'), 'rollback notes');

expect('Stale artifact detection schema is correct', staleDetection?.schemaVersion === 'cp26.stale-artifact-detection.v1', staleDetection?.schemaVersion);
expect('Stale detection has mismatch probe', staleDetection?.counts?.probeCount === 3 && staleDetection?.counts?.detectedMismatchCount === 1 && staleDetection?.counts?.failCount === 0, JSON.stringify(staleDetection?.counts));
expect('Stale detection includes intentional mismatch proof', staleDetection?.probes?.some((probe) => probe.probeId === 'intentional-mismatched-manifest-detection' && probe.status === 'detected'), JSON.stringify(staleDetection?.probes));

for (const [key, path] of Object.entries(manifest?.artifactPaths ?? {})) {
  const artifactText = readText(path);
  const checksumKey = `${key}Sha256`;
  expect(`Manifest checksum matches ${key}`, sha256Text(artifactText) === manifest.checksums?.[checksumKey], `${key}:${manifest.checksums?.[checksumKey]}`);
}

expect('Latest diff pointer references S05 manifest', latestDiff?.proofId === PROOF_ID && latestDiff?.manifestPath === `${OUT_DIR}/manifest.json`, JSON.stringify(latestDiff));
expect('Latest diff checksum matches manifest', latestDiff?.manifestSha256 === sha256Text(manifestText), latestDiff?.manifestSha256);
expect('Report records complete status', report.includes('Status: Complete'), 'report complete');
expect('Report documents all S05 outputs', ['checksum-comparison-ledger.json', 'snapshot-diff-summary.json', 'artifact-diff-summary.json', 'rollback-manifest.json', 'stale-artifact-detection.json'].every((term) => report.includes(term)), 'all outputs');
expect('Report keeps public release blocked', report.includes('Public release remains blocked') && report.includes('public-safe counts remain zero'), 'public boundary');
expect('Sprint plan marks S05 complete', sprintPlan.includes('Status: Complete. See `CP26_S05_CHECKSUM_DIFF_AND_ROLLBACK_PROOF.md`'), 'S05 complete');
expect('Sprint plan recommends S06 next', sprintPlan.includes('CP26-S06 - Private API And Internal UI Status Proof'), 'S06 next');
expect('Checklist marks S05 rows pass', ['CP26-S05-01', 'CP26-S05-02', 'CP26-S05-03', 'CP26-S05-04', 'CP26-S05-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |') && row.includes('scripts/check_cp26_s05_checksum_diff_rollback.mjs');
}), 'S05 checklist rows');
expect('Checklist recommends S06 next', checklist.includes('Start `CP26-S06 - Private API And Internal UI Status Proof`'), 'S06 checklist next');
expect('No env file path access introduced', !/['"]\.env/.test(`${generator}\n${report}\n${sprintPlan}\n${checklist}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP26-S05 checksum, diff, and rollback verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP26-S05 checksum, diff, and rollback verification passed.');
