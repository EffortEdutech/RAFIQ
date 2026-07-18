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

function readText(path) {
  if (!existsSync(path)) {
    fail(`File exists: ${path}`, 'Missing.');
    return '';
  }
  pass(`File exists: ${path}`, 'Found.');
  return readFileSync(path, 'utf8');
}

function readJson(path) {
  const text = readText(path);
  if (!text) return {};
  try {
    const value = JSON.parse(text);
    pass(`Parse JSON: ${path}`, 'Valid JSON.');
    return value;
  } catch (error) {
    fail(`Parse JSON: ${path}`, error.message);
    return {};
  }
}

function sha256(value) {
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

runNodeScript('scripts/check_cp24_g02_request_response_contracts.mjs');
runNodeScript('scripts/generate_cp24_candidate_graph_expansion.mjs');

const artifactText = readText('data/retrieval/cp24/candidate-expansion.json');
const artifact = artifactText ? JSON.parse(artifactText) : {};
const manifest = readJson('data/retrieval/cp24/manifest.json');
const graphManifest = readJson('data/graphify/full-private/manifest.json');
const vaultManifest = readJson('data/vault/full-private/manifest.json');
const byNodeId = readJson('data/graphify/full-private/indexes/by-node-id.json');
const byEdgeId = readJson('data/graphify/full-private/indexes/by-edge-id.json');
const g03Doc = readText('docs/09_sprints/resource_audit_import_prototype/CP24_G03_CANDIDATE_RETRIEVAL_AND_GRAPH_EXPANSION.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_ACCEPTANCE_CHECKLIST.md');
const generator = readText('scripts/generate_cp24_candidate_graph_expansion.mjs');

expect('Artifact schema is CP24-G03', artifact.schemaVersion === 'cp24.candidate-expansion.v1' && artifact.checkpoint === 'CP24-G03', artifact.schemaVersion);
expect('Manifest schema is CP24-G03', manifest.schemaVersion === 'cp24.retrieval-artifact-manifest.v1' && manifest.checkpoint === 'CP24-G03', manifest.schemaVersion);
expect('Manifest checksum matches artifact', manifest.checksums?.candidateExpansionSha256 === sha256(artifactText), 'checksum match');
expect('Source graph ID matches CP22 graph', artifact.sourceGraph?.graphId === graphManifest.graphId, artifact.sourceGraph?.graphId);
expect('Source graph checksum matches CP22 graph', artifact.sourceGraph?.graphChecksumSha256 === graphManifest.checksums?.graphChecksumSha256, 'checksum match');
expect('Source graph counts match CP22 graph', artifact.sourceGraph?.nodeCount === 79657 && artifact.sourceGraph?.edgeCount === 147689, `${artifact.sourceGraph?.nodeCount}/${artifact.sourceGraph?.edgeCount}`);
expect('Source vault counts match CP22 vault', artifact.sourceVault?.vaultId === vaultManifest.vaultId && artifact.sourceVault?.artifactCount === 158, artifact.sourceVault?.vaultId);
expect('Public-safe graph/vault/candidate counts are zero', artifact.publicBoundary?.publicSafeCandidateCount === 0 && artifact.publicBoundary?.publicSafeGraphNodeCount === 0 && artifact.publicBoundary?.publicSafeGraphEdgeCount === 0 && artifact.publicBoundary?.publicSafeVaultArtifactCount === 0, 'zero public-safe');

const requiredFixtures = [
  'cp24-fixture-quran-anchor-001',
  'cp24-fixture-translation-context-001',
  'cp24-fixture-tafsir-context-001',
  'cp24-fixture-hadith-support-001',
  'cp24-fixture-hadith-grade-escalation-001',
  'cp24-fixture-topic-001',
  'cp24-fixture-validation-history-001',
  'cp24-fixture-source-gap-001',
  'cp24-fixture-public-boundary-001',
  'cp24-fixture-safety-escalation-001',
];

const fixtures = artifact.fixtures ?? [];
expect('Artifact has 10 fixtures', fixtures.length === 10, String(fixtures.length));
for (const fixtureId of requiredFixtures) {
  expect(`Artifact includes fixture: ${fixtureId}`, fixtures.some((fixture) => fixture.fixtureId === fixtureId), fixtureId);
  expect(`G03 doc includes fixture: ${fixtureId}`, g03Doc.includes(fixtureId), fixtureId);
}

const vaultArtifactIds = new Set((vaultManifest.artifacts ?? []).map((item) => item.artifactId));
for (const fixture of fixtures) {
  expect(`Fixture ${fixture.fixtureId} has candidates`, (fixture.candidates ?? []).length > 0, String((fixture.candidates ?? []).length));
  expect(`Fixture ${fixture.fixtureId} depth is capped`, fixture.graphExpansion?.maxDepthReached <= artifact.outputCaps.maxGraphDepth, String(fixture.graphExpansion?.maxDepthReached));
  expect(`Fixture ${fixture.fixtureId} node cap is enforced`, fixture.graphExpansion?.nodeCount <= artifact.outputCaps.maxGraphNodes, String(fixture.graphExpansion?.nodeCount));
  expect(`Fixture ${fixture.fixtureId} edge cap is enforced`, fixture.graphExpansion?.edgeCount <= artifact.outputCaps.maxGraphEdges, String(fixture.graphExpansion?.edgeCount));
  expect(`Fixture ${fixture.fixtureId} route cap is enforced`, ((fixture.evidenceRoute?.selectedEvidence ?? []).length + (fixture.evidenceRoute?.rejectedEvidence ?? []).length + (fixture.evidenceRoute?.escalationEvidence ?? []).length) <= artifact.outputCaps.maxEvidenceRouteItems, 'route cap');
  expect(`Fixture ${fixture.fixtureId} vault cap is enforced`, (fixture.vaultPackIds ?? []).length <= artifact.outputCaps.maxVaultPackRefs, String((fixture.vaultPackIds ?? []).length));
  expect(`Fixture ${fixture.fixtureId} resolved seed nodes exist`, (fixture.seed?.resolvedNodeIds ?? []).every((nodeId) => byNodeId[nodeId]), 'resolved seeds');
  expect(`Fixture ${fixture.fixtureId} expanded nodes resolve`, (fixture.graphExpansion?.graphNodeIds ?? []).every((nodeId) => byNodeId[nodeId]), 'node IDs resolve');
  expect(`Fixture ${fixture.fixtureId} expanded edges resolve`, (fixture.graphExpansion?.graphEdgeIds ?? []).every((edgeId) => byEdgeId[edgeId]), 'edge IDs resolve');
  expect(`Fixture ${fixture.fixtureId} vault refs resolve`, (fixture.vaultPackIds ?? []).every((artifactId) => vaultArtifactIds.has(artifactId)), 'vault refs resolve');
  expect(`Fixture ${fixture.fixtureId} public-safe candidates remain zero`, (fixture.candidates ?? []).every((candidate) => candidate.publicSafe === false), 'publicSafe false');
}

const allCandidates = fixtures.flatMap((fixture) => fixture.candidates ?? []);
const selectedCandidates = allCandidates.filter((candidate) => candidate.selectionState === 'selected');
expect('G03 does not perform final selection', selectedCandidates.length === 0, String(selectedCandidates.length));
expect('Missing-ref candidates are not selected', allCandidates.every((candidate) => {
  const hasRefs = candidate.sourceIds.length > 0 && candidate.provenanceIds.length > 0 && candidate.releaseStateIds.length > 0;
  return hasRefs || candidate.selectionState !== 'selected';
}), 'missing refs held');
expect('Withheld/rejected candidates are not selected', allCandidates.every((candidate) => !['withheld'].includes(candidate.qualityState) && candidate.reviewState !== 'rejected' || candidate.selectionState !== 'selected'), 'blocked states held');
expect('Authority boundary is operational only', allCandidates.every((candidate) => candidate.rankingExplanations.every((item) => item.authorityBoundary === 'operational_relevance_only')), 'operational only');
expect('No raw source text fields are exported', !/(fullText|quranText|draftAnswer|guidedAnswer|snippet)/.test(artifactText), 'no raw text fields');

const sourceGap = fixtures.find((fixture) => fixture.fixtureId === 'cp24-fixture-source-gap-001');
expect('Source-gap fixture has unresolved seed', (sourceGap?.seed?.unresolvedNodeIds ?? []).length === 1, 'unresolved source gap');
expect('Source-gap fixture is held for review', (sourceGap?.requiresReviewCandidateIds ?? []).length > 0 && (sourceGap?.selectedCandidateIds ?? []).length === 0, 'held for review');
const escalation = fixtures.find((fixture) => fixture.fixtureId === 'cp24-fixture-safety-escalation-001');
expect('Safety fixture produces escalation candidates', (escalation?.requiresEscalationCandidateIds ?? []).length > 0, 'escalation split');
const publicBoundary = fixtures.find((fixture) => fixture.fixtureId === 'cp24-fixture-public-boundary-001');
expect('Public boundary fixture proves private-only state', publicBoundary?.publicBoundary?.publicReleaseApproved === false && publicBoundary?.publicBoundary?.publicRouteExposed === false, 'private boundary');

expect('Generated summary has expected fixture count', artifact.summary?.fixtureCount === 10, String(artifact.summary?.fixtureCount));
expect('Generated summary has expected candidate count', artifact.summary?.candidateCount === 87, String(artifact.summary?.candidateCount));
expect('Generated summary has expected review/escalation split', artifact.summary?.requiresReviewCandidateCount === 74 && artifact.summary?.requiresEscalationCandidateCount === 13, `${artifact.summary?.requiresReviewCandidateCount}/${artifact.summary?.requiresEscalationCandidateCount}`);
expect('Generated summary has public-safe zero', artifact.summary?.publicSafeCandidateCount === 0, String(artifact.summary?.publicSafeCandidateCount));

expect('Generator uses CP22 graph indexes', generator.includes('indexes/by-ayah-key.json') && generator.includes('indexes/by-hadith-key.json') && generator.includes('indexes/by-topic-key.json'), 'graph indexes');
expect('Generator uses CP22 partitions', generator.includes('graphManifest.partitions') && generator.includes('partition.nodes') && generator.includes('partition.edges'), 'graph partitions');
expect('Generator does not read env files', !generator.includes('.env'), 'no .env');

const requiredDocTerms = [
  '# CP24-G03 - Candidate Retrieval And Graph Expansion',
  'Status: Complete',
  'Generated Artifacts',
  'Fixture Coverage',
  'Bounded Expansion Rules',
  'Candidate Boundary',
  'Source Graph And Vault Proof',
  'Status: complete',
];
for (const term of requiredDocTerms) {
  expect(`G03 doc includes: ${term}`, g03Doc.includes(term), term);
}

const sprintHasG03Complete = sprintPlan.includes('Status: CP24-G03 complete; CP24-G04 pending');
const sprintHasG04Complete = sprintPlan.includes('Status: CP24-G04 complete; CP24-G05 pending');
const sprintHasG05Complete = sprintPlan.includes('Status: CP24-G05 complete; CP24-G06 pending');
const sprintHasG06Complete = sprintPlan.includes('Status: CP24-G06 complete; CP24-G07 pending');
const sprintHasG07Complete = sprintPlan.includes('Status: CP24-G07 complete; CP24-G08 pending');
const sprintHasG08Complete = sprintPlan.includes('Status: CP24-G08 complete; CP24-G09 pending');
const sprintHasCp24Complete = sprintPlan.includes('Status: CP24 complete; recommended next scope CP25');
expect('Sprint plan is at or beyond G03 complete', sprintHasG03Complete || sprintHasG04Complete || sprintHasG05Complete || sprintHasG06Complete || sprintHasG07Complete || sprintHasG08Complete || sprintHasCp24Complete, sprintHasCp24Complete ? 'CP24 complete' : sprintHasG08Complete ? 'G08 complete' : sprintHasG07Complete ? 'G07 complete' : sprintHasG06Complete ? 'G06 complete' : sprintHasG05Complete ? 'G05 complete' : sprintHasG04Complete ? 'G04 complete' : 'G03 complete');
expect('Sprint plan points to G03 report', sprintPlan.includes('CP24_G03_CANDIDATE_RETRIEVAL_AND_GRAPH_EXPANSION.md'), 'G03 report linked');
const checklistHasG03Complete = checklist.includes('Status: CP24-G03 complete; CP24-G04 pending');
const checklistHasG04Complete = checklist.includes('Status: CP24-G04 complete; CP24-G05 pending');
const checklistHasG05Complete = checklist.includes('Status: CP24-G05 complete; CP24-G06 pending');
const checklistHasG06Complete = checklist.includes('Status: CP24-G06 complete; CP24-G07 pending');
const checklistHasG07Complete = checklist.includes('Status: CP24-G07 complete; CP24-G08 pending');
const checklistHasG08Complete = checklist.includes('Status: CP24-G08 complete; CP24-G09 pending');
const checklistHasCp24Complete = checklist.includes('Status: CP24 complete; recommended next scope CP25');
expect('Checklist is at or beyond G03 complete', checklistHasG03Complete || checklistHasG04Complete || checklistHasG05Complete || checklistHasG06Complete || checklistHasG07Complete || checklistHasG08Complete || checklistHasCp24Complete, checklistHasCp24Complete ? 'CP24 complete' : checklistHasG08Complete ? 'G08 complete' : checklistHasG07Complete ? 'G07 complete' : checklistHasG06Complete ? 'G06 complete' : checklistHasG05Complete ? 'G05 complete' : checklistHasG04Complete ? 'G04 complete' : 'G03 complete');
expect('Checklist G03 rows pass', ['CP24-G03-01', 'CP24-G03-02', 'CP24-G03-03', 'CP24-G03-04', 'CP24-G03-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'G03 rows pass');
expect(
  'Checklist includes a valid post-G03 next action',
  checklist.includes('Start `CP24-G04 - Ranking, Explanation, And Selection`') ||
    checklist.includes('Start `CP24-G05 - Evidence Route And Validation Handoff`') ||
    checklist.includes('Start `CP24-G06 - Private API Prototype`') ||
    checklist.includes('Start `CP24-G07 - Internal UI Prototype`') ||
    checklist.includes('Start `CP24-G08 - Combined Verification`') ||
    checklist.includes('Start `CP24-G09 - Close-Out And Next Scope Decision`') ||
    checklist.includes('Start `CP25 - Reviewer Workbench Action Workflow`'),
  checklistHasCp24Complete ? 'CP25 next' : checklistHasG08Complete ? 'G09 next' : checklistHasG07Complete ? 'G08 next' : checklistHasG06Complete ? 'G07 next' : checklistHasG05Complete ? 'G06 next' : checklistHasG04Complete ? 'G05 next' : 'G04 next',
);

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP24-G03 candidate graph expansion verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP24-G03 candidate graph expansion verification passed.');
