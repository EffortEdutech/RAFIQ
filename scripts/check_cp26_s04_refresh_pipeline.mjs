#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const checks = [];
const REFRESH_RUN_ID = 'cp26-refresh-prototype-s04';
const REFRESH_DIR = `data/snapshots/cp26/refresh/${REFRESH_RUN_ID}`;

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
runNodeScript('scripts/generate_cp26_s04_refresh_pipeline.mjs');

const refreshRunText = readText(`${REFRESH_DIR}/refresh-run.json`);
const graphSummaryText = readText(`${REFRESH_DIR}/refreshed-graph-input-summary.json`);
const retrievalSummaryText = readText(`${REFRESH_DIR}/refreshed-retrieval-handoff-summary.json`);
const reviewerSummaryText = readText(`${REFRESH_DIR}/refreshed-reviewer-remediation-summary.json`);
const unresolvedText = readText(`${REFRESH_DIR}/unresolved-reference-report.json`);
const latestRefreshText = readText('data/snapshots/cp26/latest-refresh.json');
const sourceManifest = readJson('data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json');
const refreshRun = refreshRunText ? JSON.parse(refreshRunText) : null;
const graphSummary = graphSummaryText ? JSON.parse(graphSummaryText) : null;
const retrievalSummary = retrievalSummaryText ? JSON.parse(retrievalSummaryText) : null;
const reviewerSummary = reviewerSummaryText ? JSON.parse(reviewerSummaryText) : null;
const unresolvedReport = unresolvedText ? JSON.parse(unresolvedText) : null;
const latestRefresh = latestRefreshText ? JSON.parse(latestRefreshText) : null;
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP26_S04_REFRESH_PIPELINE_PROTOTYPE.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP26_LIVE_SNAPSHOT_EXPORT_AND_REFRESH_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP26_LIVE_SNAPSHOT_EXPORT_AND_REFRESH_ACCEPTANCE_CHECKLIST.md');
const generator = readText('scripts/generate_cp26_s04_refresh_pipeline.mjs');

expect('Refresh run schema and checkpoint are correct', refreshRun?.schemaVersion === 'cp26.refresh-run.v1' && refreshRun?.checkpoint === 'CP26-S04', `${refreshRun?.schemaVersion} ${refreshRun?.checkpoint}`);
expect('S03 source manifest is complete before S04 refresh verification', sourceManifest?.checkpoint === 'CP26-S03' && sourceManifest?.counts?.sourceGroupCount === 13 && sourceManifest?.counts?.snapshotArtifactCount === 13, JSON.stringify(sourceManifest?.counts));
expect('Refresh run id is stable', refreshRun?.refreshRunId === REFRESH_RUN_ID, refreshRun?.refreshRunId);
expect('Refresh consumes S03 snapshot batch', refreshRun?.sourceSnapshotBatchId === 'cp26-snapshot-prototype-s03', refreshRun?.sourceSnapshotBatchId);
expect('Refresh manifest checksum is inherited from latest pointer', refreshRun?.sourceSnapshotManifestSha256 === 'BF2796637C3E44C9EA81EA9AF23EB9BA13D87F4C15A3FC726F2249E84EF51FE2', refreshRun?.sourceSnapshotManifestSha256);
expect('Refresh completed with unresolved references visible', refreshRun?.status === 'completed_with_unresolved_references', refreshRun?.status);
expect('Refresh output count is four', refreshRun?.counts?.refreshedOutputCount === 4 && refreshRun?.refreshedOutputs?.length === 4, JSON.stringify(refreshRun?.counts));
expect('Refresh carries unresolved references and blockers forward', refreshRun?.counts?.unresolvedReferenceCount === 77 && refreshRun?.counts?.highOrCriticalBlockerCount === 30, JSON.stringify(refreshRun?.counts));
expect('Refresh public-safe counts remain zero', refreshRun?.counts?.publicSafeSnapshotRowCount === 0 && refreshRun?.counts?.publicSafeGraphNodeCount === 0 && refreshRun?.counts?.publicSafeGraphEdgeCount === 0 && refreshRun?.counts?.publicSafeVaultArtifactCount === 0, JSON.stringify(refreshRun?.counts));
expect('Refresh run public boundary is private-only', refreshRun?.publicBoundary?.privateOnly === true && refreshRun?.publicBoundary?.publicReleaseApproved === false && refreshRun?.publicBoundary?.publicRouteExposed === false, JSON.stringify(refreshRun?.publicBoundary));

for (const output of refreshRun?.refreshedOutputs ?? []) {
  const outputText = readText(output.path);
  expect(`Refreshed output checksum matches ${output.artifactId}`, sha256Text(outputText) === output.checksumSha256, output.path);
  expect(`Refreshed output artifact family ${output.artifactId}`, output.artifactFamily === 'refresh_output', output.artifactFamily);
  expect(`Refreshed output is private ${output.artifactId}`, output.publicBoundary?.privateOnly === true && output.publicBoundary?.publicReleaseApproved === false, output.artifactId);
}

expect('Graph summary consumes all source groups', graphSummary?.counts?.sourceGroupCount === 13 && graphSummary?.sourceGroups?.length === 13, JSON.stringify(graphSummary?.counts));
expect('Graph summary preserves deterministic IDs', graphSummary?.deterministicIdPolicy?.mode === 'preserve_existing_ids_when_snapshot_group_identity_matches' && graphSummary?.deterministicIdPolicy?.replacementMappingRequired === false, JSON.stringify(graphSummary?.deterministicIdPolicy));
expect('Graph summary keeps public graph/vault counts zero', graphSummary?.counts?.publicSafeGraphNodeCount === 0 && graphSummary?.counts?.publicSafeGraphEdgeCount === 0 && graphSummary?.counts?.publicSafeVaultArtifactCount === 0, JSON.stringify(graphSummary?.counts));
expect('Retrieval summary preserves CP24 ID policy', retrievalSummary?.deterministicIdPolicy?.mode === 'preserve_cp24_candidate_and_route_ids', JSON.stringify(retrievalSummary?.deterministicIdPolicy));
expect('Retrieval summary carries unresolved references', retrievalSummary?.counts?.unresolvedReferenceCount === 5 && retrievalSummary?.counts?.publicSafeRetrievalCandidateCount === 0 && retrievalSummary?.counts?.publicSafeRouteItemCount === 0, JSON.stringify(retrievalSummary?.counts));
expect('Reviewer summary preserves CP25 IDs and audit history', reviewerSummary?.deterministicIdPolicy?.mode === 'preserve_cp25_queue_remediation_audit_ids' && reviewerSummary?.deterministicIdPolicy?.auditHistoryOverwriteAllowed === false, JSON.stringify(reviewerSummary?.deterministicIdPolicy));
expect('Reviewer summary carries blocker counts', reviewerSummary?.counts?.totalUnresolvedReferenceCount === 67 && reviewerSummary?.counts?.highOrCriticalBlockerCount === 30, JSON.stringify(reviewerSummary?.counts));
expect('Unresolved report schema and source batch are correct', unresolvedReport?.schemaVersion === 'cp26.unresolved-reference-report.v1' && unresolvedReport?.sourceSnapshotBatchId === 'cp26-snapshot-prototype-s03', `${unresolvedReport?.schemaVersion} ${unresolvedReport?.sourceSnapshotBatchId}`);
expect('Unresolved report keeps aggregate total visible', unresolvedReport?.counts?.total === 77 && unresolvedReport?.references?.length === 4, JSON.stringify(unresolvedReport?.counts));
expect('Unresolved report includes blocking and high/critical groups', unresolvedReport?.counts?.blocking === 2 && unresolvedReport?.counts?.reviewRequired === 2 && unresolvedReport?.counts?.highOrCritical === 2, JSON.stringify(unresolvedReport?.counts));
expect('Latest refresh pointer references S04 refresh run', latestRefresh?.refreshRunId === REFRESH_RUN_ID && latestRefresh?.refreshRunPath === `${REFRESH_DIR}/refresh-run.json`, JSON.stringify(latestRefresh));
expect('Latest refresh checksum matches refresh run', latestRefresh?.refreshRunSha256 === sha256Text(refreshRunText), latestRefresh?.refreshRunSha256);
expect('Source manifest remains S03 with no derived outputs', sourceManifest?.checkpoint === 'CP26-S03' && sourceManifest?.counts?.derivedOutputCount === 0, JSON.stringify(sourceManifest?.counts));

expect('Report records complete status', report.includes('Status: Complete'), 'report complete');
expect('Report documents refresh outputs', report.includes('refreshed-graph-input-summary.json') && report.includes('refreshed-retrieval-handoff-summary.json') && report.includes('refreshed-reviewer-remediation-summary.json') && report.includes('unresolved-reference-report.json'), 'output files');
expect('Report documents public release blocked', report.includes('Public release remains blocked') && report.includes('public-safe counts remain zero'), 'public boundary');
expect('Sprint plan marks S04 complete', sprintPlan.includes('Status: Complete. See `CP26_S04_REFRESH_PIPELINE_PROTOTYPE.md`'), 'S04 complete');
expect('Sprint plan recommends S05 next', sprintPlan.includes('CP26-S05 - Checksum, Diff, And Rollback Proof'), 'S05 next');
expect('Checklist marks S04 rows pass', ['CP26-S04-01', 'CP26-S04-02', 'CP26-S04-03', 'CP26-S04-04', 'CP26-S04-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |') && row.includes('scripts/check_cp26_s04_refresh_pipeline.mjs');
}), 'S04 checklist rows');
expect('Checklist recommends S05 next', checklist.includes('Start `CP26-S05 - Checksum, Diff, And Rollback Proof`'), 'S05 checklist next');
expect('No env file path access introduced', !/['"]\.env/.test(`${generator}\n${report}\n${sprintPlan}\n${checklist}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP26-S04 refresh pipeline verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP26-S04 refresh pipeline verification passed.');
