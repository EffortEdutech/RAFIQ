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

function sha256Text(value) {
  return createHash('sha256').update(value).digest('hex').toUpperCase();
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

runNodeScript('scripts/check_cp28_r01_retrieval_architecture.mjs');
runNodeScript('scripts/generate_cp28_r02_candidate_collection.mjs');

const collectionText = readText('data/retrieval/cp28/candidate-collection.json');
const collection = collectionText ? JSON.parse(collectionText) : null;
const manifestText = readText('data/retrieval/cp28/manifest.json');
const manifest = manifestText ? JSON.parse(manifestText) : null;
const latest = readJson('data/retrieval/cp28/latest-retrieval.json');
const graphManifest = readJson('data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/manifest.json');
const vaultManifest = readJson('data/vault/cp27-refresh/vault/cp27-g04-refresh-vault/manifest.json');
const cp24Manifest = readJson('data/retrieval/cp24/manifest.json');
const byNodeId = readJson('data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/indexes/by-node-id.json');
const bySourceId = readJson('data/graphify/cp27-refresh/graph/cp27-g03-refresh-graph/indexes/by-source-id.json');
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP28_R02_CANDIDATE_COLLECTION_FROM_SNAPSHOT_BACKED_GRAPH_INDEXES.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP28_RETRIEVAL_ENGINE_INTEGRATION_FROM_REFRESHED_GRAPH_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP28_RETRIEVAL_ENGINE_INTEGRATION_FROM_REFRESHED_GRAPH_ACCEPTANCE_CHECKLIST.md');
const generator = readText('scripts/generate_cp28_r02_candidate_collection.mjs');

expect('Collection schema is CP28-R02', collection?.schemaVersion === 'cp28.candidate-collection.v1' && collection?.checkpoint === 'CP28-R02', collection?.schemaVersion);
expect('Manifest schema is CP28-R02', manifest?.schemaVersion === 'cp28.retrieval-artifact-manifest.v1' && manifest?.checkpoint === 'CP28-R02', manifest?.schemaVersion);
expect('Latest pointer is CP28-R02', latest?.schemaVersion === 'cp28.latest-retrieval-pointer.v1' && latest?.checkpoint === 'CP28-R02', latest?.schemaVersion);
expect('Manifest checksum matches candidate collection', manifest?.checksums?.candidateCollectionSha256 === sha256Text(collectionText), 'candidate collection checksum');
expect('Latest pointer checksum matches manifest', latest?.manifestSha256 === sha256Text(manifestText), 'latest manifest checksum');

expect('Source graph is CP27 refreshed graph', collection?.sourceGraph?.graphId === graphManifest?.graphId && collection?.sourceGraph?.nodeCount === 147 && collection?.sourceGraph?.edgeCount === 125, collection?.sourceGraph?.graphId);
expect('Source vault is CP27 refreshed vault', collection?.sourceVault?.vaultId === vaultManifest?.vaultId && collection?.sourceVault?.artifactCount === 26, collection?.sourceVault?.vaultId);
expect('CP24 regression baseline is preserved', collection?.regressionBaseline?.cp24CandidateCount === cp24Manifest?.counts?.candidateCount && collection?.regressionBaseline?.cp24SelectedCandidateCount === cp24Manifest?.counts?.rankingSelection?.selectedCandidateCount, JSON.stringify(collection?.regressionBaseline));

const requiredFixtureIds = [
  'cp28-fixture-quran-anchor-001',
  'cp28-fixture-translation-context-001',
  'cp28-fixture-tafsir-context-001',
  'cp28-fixture-hadith-support-001',
  'cp28-fixture-hadith-grade-escalation-001',
  'cp28-fixture-topic-001',
  'cp28-fixture-validation-history-001',
  'cp28-fixture-source-gap-001',
  'cp28-fixture-public-boundary-001',
  'cp28-fixture-safety-escalation-001',
];

expect('Collection has 10 refreshed fixtures', (collection?.fixtures ?? []).length === 10, String((collection?.fixtures ?? []).length));
for (const fixtureId of requiredFixtureIds) {
  const fixture = (collection?.fixtures ?? []).find((item) => item.fixtureId === fixtureId);
  expect(`Collection includes fixture ${fixtureId}`, Boolean(fixture), fixtureId);
  expect(`Report includes fixture ${fixtureId}`, report.includes(fixtureId), fixtureId);
  expect(`Fixture ${fixtureId} has CP24 regression label`, typeof fixture?.regressionFixtureId === 'string' && fixture.regressionFixtureId.startsWith('cp24-fixture-'), fixture?.regressionFixtureId);
  expect(`Fixture ${fixtureId} uses source indexes`, (fixture?.sourceIndexes ?? []).length > 0, JSON.stringify(fixture?.sourceIndexes));
  expect(`Fixture ${fixtureId} has candidates or explicit public-boundary marker`, (fixture?.candidates ?? []).length > 0 || fixtureId.includes('public-boundary'), String((fixture?.candidates ?? []).length));
  expect(`Fixture ${fixtureId} initial candidate cap respected`, (fixture?.candidates ?? []).filter((candidate) => candidate.collectionMethod === 'direct_index_seed').length <= collection?.outputCaps?.maxInitialCandidates || fixtureId.includes('public-boundary'), String((fixture?.candidates ?? []).filter((candidate) => candidate.collectionMethod === 'direct_index_seed').length));
}

const candidates = (collection?.fixtures ?? []).flatMap((fixture) => fixture.candidates ?? []);
expect('CP28-R02 candidate count is generated', collection?.summary?.candidateCount === candidates.length && candidates.length > 0, String(candidates.length));
expect('CP28-R02 candidate count is not CP24 full graph count', candidates.length < cp24Manifest?.counts?.candidateCount, `${candidates.length} < ${cp24Manifest?.counts?.candidateCount}`);
expect('All resolved candidate node IDs exist in CP27 by-node-id index', candidates.every((candidate) => !candidate.graphNodeId.startsWith('public-boundary:') && byNodeId?.entries?.[candidate.graphNodeId]), 'candidate nodes resolve');
expect('All candidate source groups resolve when present', candidates.every((candidate) => !candidate.sourceGroupKey || bySourceId?.entries?.[candidate.sourceGroupKey]), 'source groups resolve');
expect('All candidates are private and publicSafe false', candidates.every((candidate) => candidate.accessLevel === 'developer_private' && candidate.publicSafe === false), 'private/publicSafe false');
expect('All candidates preserve operational metadata boundary', candidates.every((candidate) => candidate.authorityBoundary === 'operational_metadata_only'), 'operational metadata only');
expect('No raw source text bodies are exported', collection?.warnings?.some((warning) => warning.includes('does not export raw Quran')) && !/(fullText|quranText|hadithText|translationText|tafsirText|draftAnswer|guidedAnswer|snippet)/.test(collectionText), 'no raw text fields');
expect('Public-safe candidate count remains zero', collection?.summary?.publicSafeCandidateCount === 0 && collection?.publicBoundary?.publicSafeRetrievalCandidateCount === 0, 'zero public-safe candidates');
expect('Unresolved refs and blockers remain visible', collection?.summary?.cp27UnresolvedReferenceCount === 77 && collection?.summary?.cp27HighOrCriticalBlockerCount === 30, JSON.stringify(collection?.summary));
expect('Hadith grade escalation remains separate', (collection?.fixtures ?? []).find((fixture) => fixture.fixtureId === 'cp28-fixture-hadith-grade-escalation-001')?.candidates?.some((candidate) => candidate.selectionState === 'requires_escalation'), 'grade escalation');
expect('Safety escalation remains separate', (collection?.fixtures ?? []).find((fixture) => fixture.fixtureId === 'cp28-fixture-safety-escalation-001')?.candidates?.some((candidate) => candidate.selectionState === 'requires_escalation'), 'safety escalation');
expect('Source-gap fixture keeps remediation visible', (collection?.fixtures ?? []).find((fixture) => fixture.fixtureId === 'cp28-fixture-source-gap-001')?.candidates?.some((candidate) => candidate.remediationReasons.includes('source_or_provenance_gap_fixture')), 'source gap remediation');

for (const term of [
  '# CP28-R02 - Candidate Collection From Snapshot-Backed Graph Indexes',
  'Status: Complete',
  'Generated Artifacts',
  'Candidate Collection Boundary',
  'Snapshot-Backed Index Usage',
  'Why CP28-R02 Is Smaller Than CP24',
  'Public Boundary',
  'Status: complete',
]) {
  expect(`R02 report includes ${term}`, report.includes(term), term);
}

expect('Sprint plan marks R02 complete', sprintPlan.includes('Status: CP28-R02 complete; CP28-R03 next'), 'sprint status');
expect('Checklist marks R02 complete', checklist.includes('Status: CP28-R02 complete; CP28-R03 next'), 'checklist status');
expect('Checklist R02 rows pass', ['CP28-R02-01', 'CP28-R02-02', 'CP28-R02-03', 'CP28-R02-04', 'CP28-R02-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'R02 rows pass');
expect('Checklist recommends R03 next', checklist.includes('Start `CP28-R03 - Ranking And Explanation Using Allowed Operational Signals`'), 'R03 next');
expect('Generator reads CP27 latest graph and vault pointers', generator.includes('LATEST_GRAPH_PATH') && generator.includes('LATEST_VAULT_PATH'), 'latest pointers');
expect('Generator reads CP27 graph indexes', ['by-ayah-key', 'by-hadith-key', 'by-topic-key', 'by-source-id', 'by-quality-state', 'public-boundary'].every((term) => generator.includes(term)), 'index names');
expect('Generator does not read env files', !generator.includes('.env'), 'no .env');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP28-R02 candidate collection verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP28-R02 candidate collection verification passed.');
