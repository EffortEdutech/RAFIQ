#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join('data', 'retrieval', 'cp28');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');
const LATEST_POINTER_PATH = path.join(OUT_DIR, 'latest-retrieval.json');
const RANKING_PATH = path.join(OUT_DIR, 'ranking-selection.json');
const HANDOFF_PATH = path.join(OUT_DIR, 'validation-handoff.json');
const API_UI_PROOF_PATH = path.join(OUT_DIR, 'private-api-ui-proof.json');
const GENERATED_AT = '2026-07-18T00:00:00.000Z';

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256Text(value) {
  return createHash('sha256').update(value).digest('hex').toUpperCase();
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  const text = stableJson(value);
  writeFileSync(filePath, text, 'utf8');
  return {
    path: filePath.replaceAll(path.sep, '/'),
    checksumSha256: sha256Text(text),
    byteCount: Buffer.byteLength(text),
  };
}

function publicBoundary(message) {
  return {
    privateOnly: true,
    publicReleaseApproved: false,
    publicRouteExposed: false,
    publicSafeChangeRequested: false,
    publicSafeSnapshotRowCount: 0,
    publicSafeGraphNodeCount: 0,
    publicSafeGraphEdgeCount: 0,
    publicSafeVaultArtifactCount: 0,
    publicSafeRetrievalCandidateCount: 0,
    publicSafeRouteItemCount: 0,
    publicSafeReviewItemCount: 0,
    publicSafeAuditEventCount: 0,
    message,
  };
}

function boundedFixturePayload(route, rankingFixture) {
  const items = [
    ...(route.evidenceRoute.selectedEvidence ?? []),
    ...(route.evidenceRoute.reviewEvidence ?? []),
    ...(route.evidenceRoute.escalationEvidence ?? []),
  ];
  return {
    fixtureId: route.fixtureId,
    checkpoint: 'CP28-R05',
    route: 'POST /api/private-content/graph-aware-retrieval/cp28',
    routeImplementationStatus: 'prototype_contract_only_not_source_route',
    uiSurface: 'internal_cp28_retrieval_inspector_contract',
    query: {
      fixtureId: route.fixtureId,
      regressionFixtureId: route.regressionFixtureId,
      intent: rankingFixture?.intent ?? null,
      domain: rankingFixture?.domain ?? null,
      graphMode: 'rank_route_validate',
    },
    counts: {
      rankedCandidatesShown: Math.min(8, rankingFixture?.rankedCandidates?.length ?? 0),
      routeItemsShown: Math.min(8, items.length),
      validationGatesShown: route.evidenceRoute.validationGateResults.length,
      remediationItemsShown: Math.min(8, route.remediationItems.length),
      selectedRouteItems: route.evidenceRoute.selectedEvidence.length,
      reviewRouteItems: route.evidenceRoute.reviewEvidence.length,
      escalationRouteItems: route.evidenceRoute.escalationEvidence.length,
    },
    candidates: (rankingFixture?.rankedCandidates ?? []).slice(0, 8).map((candidate) => ({
      candidateId: candidate.candidateId,
      graphNodeId: candidate.graphNodeId,
      graphPartition: candidate.graphPartition,
      sourceGroupKey: candidate.sourceGroupKey,
      selectionState: candidate.selectionState,
      ordinaryScore: candidate.ordinaryScore,
      remediationReasons: candidate.remediationReasons,
      publicSafe: false,
      authorityBoundary: candidate.rankingAuthorityBoundary,
    })),
    evidenceRoute: {
      evidenceRouteId: route.evidenceRoute.evidenceRouteId,
      selectedEvidenceIds: route.evidenceRoute.selectedEvidence.map((item) => item.routeItemId),
      reviewEvidenceIds: route.evidenceRoute.reviewEvidence.slice(0, 8).map((item) => item.routeItemId),
      escalationEvidenceIds: route.evidenceRoute.escalationEvidence.slice(0, 8).map((item) => item.routeItemId),
      validationGates: route.evidenceRoute.validationGateResults.map((gate) => ({
        gate: gate.gate,
        status: gate.status,
        graphLinked: gate.graphLinked,
        authorityBoundary: gate.authorityBoundary,
      })),
    },
    reviewerHandoff: {
      remediationIds: route.validationHandoff.remediationIds.slice(0, 8),
      escalationCandidateIds: route.validationHandoff.escalationCandidateIds,
      missingCitationIds: route.validationHandoff.missingCitationIds.slice(0, 8),
      publicReleaseApproved: false,
    },
    publicBoundary: publicBoundary(`CP28-R05 fixture ${route.fixtureId} is a bounded private API/UI proof payload only.`),
  };
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const rankingText = readFileSync(RANKING_PATH, 'utf8');
  const handoffText = readFileSync(HANDOFF_PATH, 'utf8');
  const ranking = JSON.parse(rankingText);
  const handoff = JSON.parse(handoffText);
  const manifest = readJson(MANIFEST_PATH);
  const rankingByFixture = new Map(ranking.fixtures.map((fixture) => [fixture.fixtureId, fixture]));
  const fixturePayloads = handoff.routes.map((route) => boundedFixturePayload(route, rankingByFixture.get(route.fixtureId)));
  const proof = {
    schemaVersion: 'cp28.private-api-ui-proof.v1',
    checkpoint: 'CP28-R05',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp28_r05_private_api_ui_proof.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    artifactKind: 'bounded_private_api_ui_integration_proof',
    sourceArtifacts: {
      rankingSelectionPath: RANKING_PATH.replaceAll(path.sep, '/'),
      rankingSelectionSha256: sha256Text(rankingText),
      validationHandoffPath: HANDOFF_PATH.replaceAll(path.sep, '/'),
      validationHandoffSha256: sha256Text(handoffText),
    },
    integrationDecision: {
      privateApiRoutePlanned: 'POST /api/private-content/graph-aware-retrieval/cp28',
      privateApiSourceRouteImplemented: false,
      privateUiSourceScreenImplemented: false,
      reasonSourceRouteDeferred: 'CP28-R04 has zero selected route items and remains remediation-first; source route implementation is deferred until CP28 artifacts can safely return selected validation-handoff candidates.',
      proofType: 'contract_payload_and_boundary_proof',
    },
    outputCaps: {
      maxCandidateSummariesPerFixture: 8,
      maxRouteItemIdsPerFixture: 8,
      maxRemediationIdsPerFixture: 8,
      rawTextBodies: 0,
      fullGraphDump: false,
      fullVaultDump: false,
    },
    fixturePayloads,
    summary: {
      fixturePayloadCount: fixturePayloads.length,
      boundedCandidateSummaryCount: fixturePayloads.reduce((sum, item) => sum + item.candidates.length, 0),
      selectedRouteItemCount: handoff.summary.selectedRouteItemCount,
      reviewRouteItemCount: handoff.summary.reviewRouteItemCount,
      escalationRouteItemCount: handoff.summary.escalationRouteItemCount,
      validationGateResultCount: handoff.summary.validationGateResultCount,
      remediationCount: handoff.summary.remediationCount,
      publicSafeCandidateCount: 0,
      publicSafeRouteItemCount: 0,
      publicRouteExposed: false,
    },
    publicBoundary: publicBoundary('CP28-R05 is a private API/UI proof artifact. No source route or public route is exposed. Public-safe counts remain zero.'),
  };
  const proofArtifact = writeJson(API_UI_PROOF_PATH, proof);
  const updatedManifest = {
    ...manifest,
    checkpoint: 'CP28-R05',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp28_r05_private_api_ui_proof.mjs',
    artifactPaths: {
      ...manifest.artifactPaths,
      privateApiUiProof: proofArtifact.path,
    },
    checksums: {
      ...manifest.checksums,
      validationHandoffSha256: sha256Text(handoffText),
      privateApiUiProofSha256: proofArtifact.checksumSha256,
    },
    counts: {
      ...manifest.counts,
      privateApiUiProof: proof.summary,
    },
    verifier: {
      command: 'node scripts/check_cp28_r05_private_api_ui_proof.mjs',
      status: 'pending',
    },
    publicBoundary: proof.publicBoundary,
  };
  const manifestArtifact = writeJson(MANIFEST_PATH, updatedManifest);
  writeJson(LATEST_POINTER_PATH, {
    schemaVersion: 'cp28.latest-retrieval-pointer.v1',
    checkpoint: 'CP28-R05',
    generatedAt: GENERATED_AT,
    retrievalDir: OUT_DIR.replaceAll(path.sep, '/'),
    manifestPath: manifestArtifact.path,
    manifestSha256: manifestArtifact.checksumSha256,
    candidateCollectionPath: manifest.artifactPaths.candidateCollection,
    candidateCollectionSha256: updatedManifest.checksums.candidateCollectionSha256,
    rankingSelectionPath: manifest.artifactPaths.rankingSelection,
    rankingSelectionSha256: updatedManifest.checksums.rankingSelectionSha256,
    validationHandoffPath: manifest.artifactPaths.validationHandoff,
    validationHandoffSha256: updatedManifest.checksums.validationHandoffSha256,
    privateApiUiProofPath: proofArtifact.path,
    privateApiUiProofSha256: proofArtifact.checksumSha256,
    counts: updatedManifest.counts,
    publicBoundary: proof.publicBoundary,
  });
  console.log(JSON.stringify({ status: 'pass', checkpoint: 'CP28-R05', outputPath: proofArtifact.path, summary: proof.summary }, null, 2));
}

main();
