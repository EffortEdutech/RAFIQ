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

runNodeScript('scripts/check_cp27_g01_refresh_backed_graph_architecture.mjs');
runNodeScript('scripts/generate_cp27_g02_snapshot_graph_mapper.mjs');

const report = readText('docs/09_sprints/resource_audit_import_prototype/CP27_G02_SNAPSHOT_TO_NODE_EDGE_MAPPER.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP27_REFRESH_BACKED_GRAPH_AND_VAULT_REBUILD_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP27_REFRESH_BACKED_GRAPH_AND_VAULT_REBUILD_ACCEPTANCE_CHECKLIST.md');
const latestMapper = readJson('data/graphify/cp27-refresh/latest-mapper.json');
const contract = readJson('data/graphify/cp27-refresh/mapper/cp27-g02-snapshot-graph-mapper/mapper-contract.json');
const sourceGroupMapping = readJson('data/graphify/cp27-refresh/mapper/cp27-g02-snapshot-graph-mapper/source-group-mapping.json');
const nodeEdgePlan = readJson('data/graphify/cp27-refresh/mapper/cp27-g02-snapshot-graph-mapper/node-edge-plan.json');
const deferredBlockedReport = readJson('data/graphify/cp27-refresh/mapper/cp27-g02-snapshot-graph-mapper/deferred-blocked-report.json');
const checksumLedger = readJson('data/graphify/cp27-refresh/mapper/cp27-g02-snapshot-graph-mapper/checksum-ledger.json');

expect('G02 report records complete status', report.includes('Status: Complete'), 'Status: Complete');
expect('G02 report identifies mapper artifacts', report.includes('mapper-contract.json') && report.includes('source-group-mapping.json') && report.includes('node-edge-plan.json') && report.includes('deferred-blocked-report.json'), 'mapper artifacts');
expect('G02 report states mapper does not generate partitions', report.includes('does not generate refreshed partitions') && report.includes('CP27-G03'), 'G03 boundary');
expect('G02 report documents deterministic ID policy', report.includes('cp27:{partition}:{sourceGroupKey}:{entityFamily}:{stableKey}') && /canonical refs remain authoritative/i.test(report), 'ID policy');
expect('G02 report documents public-safe zero boundary', report.includes('Public-safe graph nodes | 0') && report.includes('Public-safe graph edges | 0') && report.includes('Public-safe vault artifacts | 0'), 'public boundary');

expect('Sprint plan marks G02 complete', sprintPlan.includes('Status: CP27-G02 complete; CP27-G03 next') || sprintPlan.includes('Status: CP27-G03 complete; CP27-G04 next') || sprintPlan.includes('Status: CP27-G04 complete; CP27-G05 next') || sprintPlan.includes('Status: CP27-G05 complete; CP27-G06 next') || sprintPlan.includes('Status: CP27-G06 complete; CP27-G07 next') || sprintPlan.includes('Status: CP27 complete; recommended next scope CP28'), 'sprint status');
expect('Sprint plan G02 complete', /CP27-G02[\s\S]*?Status: Complete/.test(sprintPlan), 'G02 status complete');
expect('Checklist G02 rows pass', ['CP27-G02-01', 'CP27-G02-02', 'CP27-G02-03', 'CP27-G02-04', 'CP27-G02-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'G02 rows pass');
expect('Checklist preserves G02 completion and later progression', checklist.includes('Start `CP27-G03 - Partition And Index Regeneration From Snapshots`') || checklist.includes('Start `CP27-G04 - Vault Pack Regeneration From Refreshed Graph`') || checklist.includes('Start `CP27-G05 - Graph/Vault Diff Proof Against CP22 Baseline`') || checklist.includes('Start `CP27-G06 - Graph/Vault Internal UI Inspection Proof`') || checklist.includes('Start `CP27-G07 - Combined Verification And Close-Out`') || checklist.includes('Start `CP28 - Retrieval Engine Integration From Refreshed Graph`'), 'G02 complete with later progression');

expect('Latest mapper pointer exists and matches contract checksum', latestMapper?.mapperContractSha256 === sha256File(latestMapper?.mapperContractPath || ''), latestMapper?.mapperContractSha256);
expect('Checksum ledger tracks all mapper artifacts', Array.isArray(checksumLedger?.artifacts) && checksumLedger.artifacts.length === 4 && checksumLedger.artifacts.every((artifact) => artifact.checksumSha256 === sha256File(artifact.path)), 'ledger checksums');
expect('Mapper contract schema and checkpoint are correct', contract?.schemaVersion === 'cp27.snapshot-graph-mapper-contract.v1' && contract?.checkpoint === 'CP27-G02', `${contract?.schemaVersion} ${contract?.checkpoint}`);
expect('Mapper contract uses CP26 latest snapshot', contract?.sourceSnapshotBatchId === 'cp26-snapshot-prototype-s03' && contract?.sourceSnapshotManifestPath === 'data/snapshots/cp26/batches/cp26-snapshot-prototype-s03/manifest.json', contract?.sourceSnapshotBatchId);
expect('Mapper contract preserves baseline directories as inputs only', contract?.baselineGraphManifestPath === 'data/graphify/full-private/manifest.json' && contract?.baselineVaultManifestPath === 'data/vault/full-private/manifest.json', 'baseline inputs');
expect('Mapper contract has deterministic ID policy', contract?.idPolicy?.canonicalRefsRemainAuthoritative === true && contract?.idPolicy?.graphIdsAreDerived === true && contract?.idPolicy?.nodeIdTemplate.includes('{sourceGroupKey}'), JSON.stringify(contract?.idPolicy));

expect('All source groups are mapped', sourceGroupMapping?.counts?.sourceGroupCount === 13 && sourceGroupMapping?.counts?.mappedSourceGroupCount === 13 && sourceGroupMapping?.counts?.unmappedSourceGroupCount === 0, JSON.stringify(sourceGroupMapping?.counts));
expect('All expected source group keys are present', [
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
].every((key) => sourceGroupMapping?.mappings?.some((mapping) => mapping.sourceGroupKey === key && mapping.status === 'mapped')), '13 mappings');
expect('Node and edge families are planned', nodeEdgePlan?.nodeFamilies?.length > 20 && nodeEdgePlan?.edgeFamilies?.length > 20 && nodeEdgePlan?.targetPartitions?.includes('quran') && nodeEdgePlan?.targetPartitions?.includes('product-evidence'), `${nodeEdgePlan?.nodeFamilies?.length}/${nodeEdgePlan?.edgeFamilies?.length}`);
expect('Index vocabulary includes CP22-compatible indexes', ['by-node-id', 'by-edge-id', 'by-canonical-ref', 'by-source-id', 'by-snapshot-id', 'public-boundary'].every((name) => contract?.indexVocabulary?.includes(name)), 'indexes');
expect('Deferred and blocked report is visible', deferredBlockedReport?.counts?.deferredItemCount === 3 && deferredBlockedReport?.counts?.blockedItemCount === 1 && deferredBlockedReport?.unmappedSourceGroups?.length === 0, JSON.stringify(deferredBlockedReport?.counts));
expect('Unresolved references and blockers remain visible', contract?.counts?.unresolvedReferenceCount === 77 && contract?.counts?.highOrCriticalBlockerCount === 30, JSON.stringify(contract?.counts));
expect('Public-safe counts remain zero', [contract, sourceGroupMapping, nodeEdgePlan, deferredBlockedReport, latestMapper].every((item) => item?.counts?.publicSafeSnapshotRowCount === 0 && item?.counts?.publicSafeGraphNodeCount === 0 && item?.counts?.publicSafeGraphEdgeCount === 0 && item?.counts?.publicSafeVaultArtifactCount === 0 && item?.publicBoundary?.publicReleaseApproved === false), 'zero public-safe counts');
expect('No env file path access introduced', !/['"]\.env/.test(`${report}\n${sprintPlan}\n${checklist}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP27-G02 mapper verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP27-G02 mapper verification passed.');
