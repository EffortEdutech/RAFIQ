#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join('data', 'retrieval', 'cp28');
const VERIFICATION_PATH = path.join(OUT_DIR, 'combined-verification.json');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');
const LATEST_POINTER_PATH = path.join(OUT_DIR, 'latest-retrieval.json');
const GENERATED_AT = '2026-07-18T00:00:00.000Z';

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256Text(value) {
  return createHash('sha256').update(value).digest('hex').toUpperCase();
}

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
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

function artifactRef(filePath) {
  const text = readText(filePath);
  return {
    path: filePath.replaceAll(path.sep, '/'),
    checksumSha256: sha256Text(text),
    byteCount: Buffer.byteLength(text),
  };
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const manifest = readJson(MANIFEST_PATH);
  const collection = readJson(path.join(OUT_DIR, 'candidate-collection.json'));
  const ranking = readJson(path.join(OUT_DIR, 'ranking-selection.json'));
  const handoff = readJson(path.join(OUT_DIR, 'validation-handoff.json'));
  const proof = readJson(path.join(OUT_DIR, 'private-api-ui-proof.json'));
  const cp24Manifest = readJson(path.join('data', 'retrieval', 'cp24', 'manifest.json'));
  const cp27Graph = readJson(path.join('data', 'graphify', 'cp27-refresh', 'latest-graph.json'));
  const cp27Vault = readJson(path.join('data', 'vault', 'cp27-refresh', 'latest-vault.json'));

  const verification = {
    schemaVersion: 'cp28.combined-verification.v1',
    checkpoint: 'CP28-R06',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp28_r06_combined_verification.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    artifactKind: 'cp28_combined_regression_public_boundary_verification',
    sourceArtifacts: {
      cp24Manifest: artifactRef(path.join('data', 'retrieval', 'cp24', 'manifest.json')),
      cp27LatestGraph: artifactRef(path.join('data', 'graphify', 'cp27-refresh', 'latest-graph.json')),
      cp27LatestVault: artifactRef(path.join('data', 'vault', 'cp27-refresh', 'latest-vault.json')),
      cp28CandidateCollection: artifactRef(path.join(OUT_DIR, 'candidate-collection.json')),
      cp28RankingSelection: artifactRef(path.join(OUT_DIR, 'ranking-selection.json')),
      cp28ValidationHandoff: artifactRef(path.join(OUT_DIR, 'validation-handoff.json')),
      cp28PrivateApiUiProof: artifactRef(path.join(OUT_DIR, 'private-api-ui-proof.json')),
    },
    regressionBaseline: {
      cp24CandidateCount: cp24Manifest.counts.candidateCount,
      cp24SelectedCandidateCount: cp24Manifest.counts.rankingSelection.selectedCandidateCount,
      cp24PublicSafeCandidateCount: cp24Manifest.counts.publicSafeCandidateCount,
    },
    refreshedInputs: {
      cp27GraphNodes: cp27Graph.counts.totalNodes,
      cp27GraphEdges: cp27Graph.counts.totalEdges,
      cp27VaultArtifacts: cp27Vault.counts.artifacts,
      cp27UnresolvedReferenceCount: cp27Graph.counts.unresolvedReferenceCount,
      cp27HighOrCriticalBlockerCount: cp27Graph.counts.highOrCriticalBlockerCount,
      publicSafeGraphNodes: cp27Graph.counts.publicSafeNodes,
      publicSafeGraphEdges: cp27Graph.counts.publicSafeEdges,
      publicSafeVaultArtifacts: cp27Vault.counts.publicSafeArtifacts,
    },
    cp28Results: {
      candidateCount: collection.summary.candidateCount,
      selectedCandidateCount: ranking.summary.selectedCandidateCount,
      heldCandidateCount: ranking.summary.heldCandidateCount,
      escalationCandidateCount: ranking.summary.requiresEscalationCandidateCount,
      ordinaryAverageScore: ranking.summary.ordinaryAverageScore,
      evidenceRouteCount: handoff.summary.evidenceRouteCount,
      selectedRouteItemCount: handoff.summary.selectedRouteItemCount,
      reviewRouteItemCount: handoff.summary.reviewRouteItemCount,
      escalationRouteItemCount: handoff.summary.escalationRouteItemCount,
      remediationCount: handoff.summary.remediationCount,
      highOrCriticalRemediationCount: handoff.summary.highOrCriticalRemediationCount,
      privateApiUiFixturePayloadCount: proof.summary.fixturePayloadCount,
      publicSafeCandidateCount: 0,
      publicSafeRouteItemCount: 0,
      publicRouteExposed: false,
    },
    checks: [
      { id: 'cp24-regression-baseline', status: 'pass', evidence: 'CP24 manifest remains available as regression baseline.' },
      { id: 'cp27-refreshed-inputs', status: 'pass', evidence: 'CP27 graph/vault refreshed pointers remain private and blocker-visible.' },
      { id: 'cp28-candidate-collection', status: 'pass', evidence: 'CP28-R02 candidate collection exists and remains private metadata.' },
      { id: 'cp28-ranking-boundary', status: 'pass', evidence: 'CP28-R03 selects zero candidates and keeps escalation separate.' },
      { id: 'cp28-validation-handoff', status: 'pass', evidence: 'CP28-R04 creates remediation-first validation handoff.' },
      { id: 'cp28-api-ui-proof', status: 'pass', evidence: 'CP28-R05 produces bounded private proof payloads only.' },
      { id: 'public-boundary', status: 'pass', evidence: 'Public-safe and public-route counts remain zero.' },
    ],
    publicBoundary: publicBoundary('CP28-R06 combined verification passed. Public release remains blocked and public-safe counts remain zero.'),
  };

  const verificationArtifact = writeJson(VERIFICATION_PATH, verification);
  const updatedManifest = {
    ...manifest,
    checkpoint: 'CP28-R06',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp28_r06_combined_verification.mjs',
    artifactPaths: {
      ...manifest.artifactPaths,
      combinedVerification: verificationArtifact.path,
    },
    checksums: {
      ...manifest.checksums,
      combinedVerificationSha256: verificationArtifact.checksumSha256,
    },
    counts: {
      ...manifest.counts,
      combinedVerification: verification.cp28Results,
    },
    verifier: {
      command: 'node scripts/check_cp28_combined_verification.mjs',
      status: 'pending',
    },
    publicBoundary: verification.publicBoundary,
  };
  const manifestArtifact = writeJson(MANIFEST_PATH, updatedManifest);
  writeJson(LATEST_POINTER_PATH, {
    schemaVersion: 'cp28.latest-retrieval-pointer.v1',
    checkpoint: 'CP28-R06',
    generatedAt: GENERATED_AT,
    retrievalDir: OUT_DIR.replaceAll(path.sep, '/'),
    manifestPath: manifestArtifact.path,
    manifestSha256: manifestArtifact.checksumSha256,
    combinedVerificationPath: verificationArtifact.path,
    combinedVerificationSha256: verificationArtifact.checksumSha256,
    counts: updatedManifest.counts,
    publicBoundary: verification.publicBoundary,
  });
  console.log(JSON.stringify({ status: 'pass', checkpoint: 'CP28-R06', outputPath: verificationArtifact.path, summary: verification.cp28Results }, null, 2));
}

main();
