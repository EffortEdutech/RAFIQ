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
    fail(`Parse JSON: ${filePath}`, error.message);
    return null;
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

function collectRouteItems(handoff) {
  return (handoff?.routes || []).flatMap((route) => [
    ...(route.evidenceRoute?.selectedEvidence || []),
    ...(route.evidenceRoute?.rejectedEvidence || []),
    ...(route.evidenceRoute?.escalationEvidence || []),
  ]);
}

runNodeScript('scripts/check_cp25_a02_contracts.mjs');

const handoffText = readText('data/retrieval/cp24/validation-handoff.json');
const handoff = handoffText ? JSON.parse(handoffText) : null;
const manifest = readJson('data/review/cp25/manifest.json');
const reviewQueue = readJson('data/review/cp25/review-queue.json') || [];
const remediationState = readJson('data/review/cp25/remediation-state.json') || [];
const summary = readJson('data/review/cp25/state-summary.json');
const generator = readText('scripts/generate_cp25_review_queue_remediation_state.mjs');
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP25_A03_REVIEW_QUEUE_AND_REMEDIATION_STATE_EXPORT.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_ACCEPTANCE_CHECKLIST.md');

const cp24Remediations = handoff?.remediationItems || [];
const cp24RemediationIds = new Set(cp24Remediations.map((item) => item.remediationId));
const routeItems = collectRouteItems(handoff);
const cp24CandidateIds = new Set(routeItems.map((item) => item.candidateId));
const cp24RouteItemIds = new Set(routeItems.map((item) => item.routeItemId));
const cp24EvidenceRouteIds = new Set((handoff?.routes || []).map((route) => route.evidenceRoute?.evidenceRouteId));

expect('Manifest schema is CP25-A03', manifest?.schemaVersion === 'cp25.review-queue-remediation-state-manifest.v1' && manifest?.checkpoint === 'CP25-A03', manifest?.schemaVersion);
expect('Summary schema is CP25-A03', summary?.schemaVersion === 'cp25.review-queue-remediation-state-summary.v1' && summary?.checkpoint === 'CP25-A03', summary?.schemaVersion);
expect('Public boundary remains private-only', manifest?.privateOnly === true && manifest?.publicReleaseApproved === false && manifest?.publicBoundary?.publicRouteExposed === false, 'private/public false');
expect('Public safe counts remain zero', manifest?.counts?.publicSafeCandidateCount === 0 && manifest?.counts?.publicSafeRouteItemCount === 0 && manifest?.publicBoundary?.publicSafeGraphNodeCount === 0 && manifest?.publicBoundary?.publicSafeVaultArtifactCount === 0, 'all zero');

expect('Queue represents all CP24 remediation items', reviewQueue.length === 72 && reviewQueue.length === cp24Remediations.length, `${reviewQueue.length}/${cp24Remediations.length}`);
expect('Remediation states represent all CP24 remediation items', remediationState.length === 72 && remediationState.length === cp24Remediations.length, `${remediationState.length}/${cp24Remediations.length}`);
expect('Manifest counts match artifacts', manifest?.counts?.queueItemCount === reviewQueue.length && manifest?.counts?.remediationStateCount === remediationState.length, 'counts match');
expect('No CP24 remediation item is deferred', manifest?.counts?.explicitlyDeferredCp24RemediationCount === 0 && Array.isArray(summary?.explicitlyDeferredCp24RemediationIds) && summary.explicitlyDeferredCp24RemediationIds.length === 0, 'deferred 0');
expect('High and critical blockers remain visible', manifest?.counts?.highOrCriticalQueueItemCount === 18 && manifest?.counts?.openBlockingCount === 18, '18 high/critical and 18 blocking');
expect('Role assignment summary is complete', ['technical_reviewer', 'knowledge_editor', 'scholar_reviewer', 'product_owner'].every((role) => Number.isInteger(manifest?.roleAssignmentSummary?.[role])), JSON.stringify(manifest?.roleAssignmentSummary));
expect('Severity summary is complete', ['low', 'medium', 'high', 'critical'].every((severity) => Number.isInteger(manifest?.severitySummary?.[severity])), JSON.stringify(manifest?.severitySummary));
expect('Blocker summary is complete', manifest?.blockerSummary?.blocking === 18 && manifest?.blockerSummary?.review_required === 54, JSON.stringify(manifest?.blockerSummary));

const uniqueQueueIds = new Set(reviewQueue.map((item) => item.queueItemId));
const uniqueStateIds = new Set(remediationState.map((item) => item.remediationId));
const representedRemediationIds = new Set(reviewQueue.flatMap((item) => item.remediationIds || []));
const stateSourceIds = new Set(remediationState.map((item) => item.sourceCp24RemediationId));
expect('Queue IDs are unique', uniqueQueueIds.size === reviewQueue.length, `${uniqueQueueIds.size}/${reviewQueue.length}`);
expect('Remediation state IDs are unique', uniqueStateIds.size === remediationState.length, `${uniqueStateIds.size}/${remediationState.length}`);
expect('Every CP24 remediation is in the queue', cp24Remediations.every((item) => representedRemediationIds.has(item.remediationId)), 'queue remediation refs');
expect('Every CP24 remediation is in remediation state', cp24Remediations.every((item) => stateSourceIds.has(item.remediationId)), 'state remediation refs');

const linkedStates = remediationState.every((state) => uniqueQueueIds.has(state.queueItemId));
expect('Every remediation state links to a queue item', linkedStates, 'queueItemId refs');
const queueRefsValid = reviewQueue.every((item) =>
  item.evidenceRouteIds.every((id) => cp24EvidenceRouteIds.has(id)) &&
  item.remediationIds.every((id) => cp24RemediationIds.has(id)) &&
  item.candidateIds.every((id) => cp24CandidateIds.has(id) || id.endsWith(':unresolved')) &&
  item.routeItemIds.every((id) => cp24RouteItemIds.has(id))
);
expect('Queue items reference CP24 route, candidate, route-item, and remediation IDs', queueRefsValid, 'CP24 refs');
expect('Queue graph/vault refs are bounded arrays', reviewQueue.every((item) => Array.isArray(item.graphNodeIds) && Array.isArray(item.graphEdgeIds) && Array.isArray(item.vaultPackIds) && item.graphEdgeIds.length <= 8), 'bounded refs');
expect('Unresolved reference report exists', manifest?.counts?.unresolvedReferenceCount === summary?.unresolvedReferences?.length && summary.unresolvedReferences.length === reviewQueue.filter((item) => item.graphNodeIds.length === 0).length, 'unresolved refs');
expect('All queue items require notes and remain private', reviewQueue.every((item) => item.notesRequired === true && item.publicReleaseApproved === false), 'notes/private');
expect('All remediation states remain private', remediationState.every((item) => item.publicReleaseApproved === false && ['open', 'blocked'].includes(item.status)), 'state private/status');

expect('Review queue checksum matches manifest', manifest?.checksums?.reviewQueueSha256 === sha256(JSON.stringify(reviewQueue)), 'queue checksum');
expect('Remediation state checksum matches manifest', manifest?.checksums?.remediationStateSha256 === sha256(JSON.stringify(remediationState)), 'state checksum');
expect('Summary checksum matches manifest', manifest?.checksums?.stateSummarySha256 === sha256(JSON.stringify(summary)), 'summary checksum');
expect('Generator documents CP24 input and CP25 outputs', generator.includes('data/retrieval/cp24/validation-handoff.json') && generator.includes('data/review/cp25'), 'generator paths');

for (const term of [
  '# CP25-A03 - Review Queue And Remediation State Export',
  'Status: Complete',
  '72 CP24 remediation items',
  '18 high/critical',
  'public-safe counts remain zero',
  'node scripts\\check_cp25_a03_review_queue_exports.mjs',
]) {
  expect(`A03 report includes ${term}`, report.includes(term), term);
}

expect('Sprint plan marks A03 complete or later', sprintPlan.includes('Status: CP25-A03 complete; CP25-A04 pending') || sprintPlan.includes('Status: CP25-A04 complete; CP25-A05 pending') || sprintPlan.includes('Status: CP25-A05 complete; CP25-A06 pending') || sprintPlan.includes('Status: CP25-A06 complete; CP25-A07 pending') || sprintPlan.includes('Status: CP25-A07 complete; CP25-A08 pending') || sprintPlan.includes('Status: CP25-A08 complete; CP25-A09 pending') || sprintPlan.includes('Status: CP25 complete; recommended next scope CP26'), 'sprint status');
expect('Checklist marks A03 complete or later', checklist.includes('Status: CP25-A03 complete; CP25-A04 pending') || checklist.includes('Status: CP25-A04 complete; CP25-A05 pending') || checklist.includes('Status: CP25-A05 complete; CP25-A06 pending') || checklist.includes('Status: CP25-A06 complete; CP25-A07 pending') || checklist.includes('Status: CP25-A07 complete; CP25-A08 pending') || checklist.includes('Status: CP25-A08 complete; CP25-A09 pending') || checklist.includes('Status: CP25 complete; recommended next scope CP26'), 'checklist status');
expect('Checklist A03 rows pass', ['CP25-A03-01', 'CP25-A03-02', 'CP25-A03-03', 'CP25-A03-04', 'CP25-A03-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'A03 rows pass');
expect('Checklist recommends A04 through CP26 next', checklist.includes('Start `CP25-A04 - Audit Event And Decision Ledger`') || checklist.includes('Start `CP25-A05 - Private API Prototype`') || checklist.includes('Start `CP25-A06 - Internal UI Action Controls`') || checklist.includes('Start `CP25-A07 - Audit Export And Remediation Review Proof`') || checklist.includes('Start `CP25-A08 - Combined Verification`') || checklist.includes('Start `CP25-A09 - Close-Out And Next Scope Decision`') || checklist.includes('Start `CP26 - Live Snapshot Export And Refresh`'), 'next checkpoint');
expect('No env file path access introduced', !/['"]\.env/.test(`${generator}\n${report}\n${sprintPlan}\n${checklist}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP25-A03 review queue verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP25-A03 review queue verification passed.');
