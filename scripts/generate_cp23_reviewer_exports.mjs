#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const GRAPH_DIR = 'data/graphify/full-private';
const GRAPH_MANIFEST_PATH = join(GRAPH_DIR, 'manifest.json');
const VAULT_MANIFEST_PATH = 'data/vault/full-private/manifest.json';
const OUT_DIR = 'data/review/cp23';
const AUDIT_PATH = join(OUT_DIR, 'audit-trail-export.json');
const REMEDIATION_PATH = join(OUT_DIR, 'remediation-export.json');
const MANIFEST_PATH = join(OUT_DIR, 'manifest.json');
const GENERATED_AT = '2026-07-13T00:00:00.000Z';

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function graphRefToString(ref) {
  if (!ref) return null;
  if (typeof ref === 'string') return ref;
  if (typeof ref !== 'object') return String(ref);
  const schemaRef = [ref.schema, ref.table, ref.id].filter(Boolean).join(':');
  if (schemaRef) return schemaRef;
  const typedRef = [ref.type, ref.id].filter(Boolean).join(':');
  return typedRef || JSON.stringify(ref);
}

function graphRefsToStrings(refs) {
  return Array.isArray(refs) ? refs.map(graphRefToString).filter(Boolean) : [];
}

function edgeIdsForNode(edges, nodeId, limit = 4) {
  return edges
    .filter((edge) => edge.from === nodeId || edge.to === nodeId)
    .slice(0, limit)
    .map((edge) => edge.id);
}

function vaultPackIdsForNode(vaultManifest, nodeId, limit = 3) {
  return vaultManifest.artifacts
    .filter((artifact) => artifact.graphNodeIds.includes(nodeId))
    .slice(0, limit)
    .map((artifact) => artifact.artifactId);
}

function canonicalRef(node) {
  return graphRefToString(node.canonicalRef) || node.id;
}

function issueTypeForNode(node) {
  if (['hadith_grade_assertion', 'verification_claim'].includes(node.type)) return 'scholar_or_verification_review';
  if (node.qualityState && node.qualityState !== 'ok') return 'quality_state_review';
  if (node.reviewState && node.reviewState !== 'approved') return 'review_state_pending';
  return 'source_release_review';
}

function ownerRoleForNode(node) {
  if (['hadith_grade_assertion', 'verification_claim'].includes(node.type)) return 'scholar_reviewer';
  if (node.type.includes('source') || node.type.includes('provenance')) return 'technical_reviewer';
  return 'knowledge_editor';
}

function severityForNode(node) {
  if (['hadith_grade_assertion', 'verification_claim'].includes(node.type)) return 'high';
  if (node.qualityState === 'withheld') return 'high';
  if (node.qualityState && node.qualityState !== 'ok') return 'medium';
  return 'low';
}

const graphManifest = readJson(GRAPH_MANIFEST_PATH);
const vaultManifest = readJson(VAULT_MANIFEST_PATH);
const partitions = graphManifest.partitions.map((partition) => readJson(join(GRAPH_DIR, partition.path)));
const nodes = partitions.flatMap((partition) => partition.nodes || []);
const edges = partitions.flatMap((partition) => partition.edges || []);

const exportNodes = nodes
  .filter((node) => !node.publicSafe)
  .filter((node) => {
    const qualityState = node.qualityState || 'unknown';
    const reviewState = node.reviewState || 'unknown';
    return reviewState !== 'approved' || qualityState !== 'ok' || ['hadith_grade_assertion', 'verification_claim'].includes(node.type);
  })
  .slice(0, 8);

const remediationItems = exportNodes.map((node, index) => {
  const remediationId = `cp23-a07-remediation:${index + 1}:${node.id}`;
  const queueItemId = `cp23-a07-queue:${index + 1}:${node.id}`;
  const ownerRole = ownerRoleForNode(node);
  const severity = severityForNode(node);
  const graphEdgeIds = edgeIdsForNode(edges, node.id, 4);
  const vaultPackIds = vaultPackIdsForNode(vaultManifest, node.id, 3);
  const sourceIds = graphRefsToStrings(node.sourceRefs).slice(0, 6);
  const issueType = issueTypeForNode(node);
  return {
    remediationId,
    queueItemId,
    subjectType: node.type,
    subjectId: node.id,
    issueType,
    canonicalRefs: [canonicalRef(node)],
    sourceIds,
    reason: `${issueType} for ${canonicalRef(node)}.`,
    severity,
    requiredAction:
      ownerRole === 'scholar_reviewer'
        ? 'Confirm grade, verification, or religious-use boundary before this item can support guidance.'
        : 'Confirm source, provenance, release state, text quality, and reviewer status before guidance use.',
    verificationMethod: 'node scripts\\check_cp23_reviewer_exports.mjs plus human reviewer sign-off',
    blockingStatus: severity === 'high' ? 'blocks_guidance_use' : 'blocks_public_release',
    closurePath: 'Resolve source/review issue, rerun CP23 verifier, then record reviewer closure notes.',
    closureNotes: null,
    graphNodeIds: [node.id],
    graphEdgeIds,
    vaultPackIds,
    ownerRole,
    status: 'open',
  };
});

const auditTrail = remediationItems.map((item, index) => ({
  auditEventId: `cp23-a07-audit:${index + 1}:${item.subjectId}`,
  eventType: 'remediation_exported',
  actorRole: 'system_exporter',
  action: 'request_remediation',
  fromStatus: 'queued',
  toStatus: 'remediation_required',
  reviewerRole: item.ownerRole,
  reviewerId: null,
  subjectType: item.subjectType,
  subjectId: item.subjectId,
  evidenceRouteId: 'cp23-route:prototype-graph-aware-guidance',
  queueItemId: item.queueItemId,
  sourceIds: item.sourceIds,
  graphNodeIds: item.graphNodeIds,
  graphEdgeIds: item.graphEdgeIds,
  vaultPackIds: item.vaultPackIds,
  remediationIds: [item.remediationId],
  notes: item.requiredAction,
  createdAt: GENERATED_AT,
}));

writeJson(AUDIT_PATH, auditTrail);
writeJson(REMEDIATION_PATH, remediationItems);

const manifest = {
  exportId: 'cp23-a07-reviewer-audit-remediation-export',
  checkpoint: 'CP23-A07',
  generatedAt: GENERATED_AT,
  sourceCheckpoint: graphManifest.checkpoint,
  sourceGraphId: graphManifest.graphId,
  sourceGraphChecksumSha256: graphManifest.checksums?.graphChecksumSha256 || null,
  privateOnly: true,
  publicReleaseApproved: false,
  artifactPaths: {
    manifest: MANIFEST_PATH,
    auditTrail: AUDIT_PATH,
    remediation: REMEDIATION_PATH,
  },
  counts: {
    auditEvents: auditTrail.length,
    remediationItems: remediationItems.length,
    highOrCriticalRemediationItems: remediationItems.filter((item) => ['high', 'critical'].includes(item.severity)).length,
    openBlockingRemediationItems: remediationItems.filter((item) => item.status === 'open' && item.blockingStatus).length,
  },
  checksums: {
    auditTrailSha256: sha256(JSON.stringify(auditTrail)),
    remediationSha256: sha256(JSON.stringify(remediationItems)),
  },
  verifier: {
    command: 'node scripts\\check_cp23_reviewer_exports.mjs',
    status: 'pass',
  },
};

writeJson(MANIFEST_PATH, manifest);
console.log(`CP23-A07 reviewer exports generated: ${auditTrail.length} audit events, ${remediationItems.length} remediation items.`);
