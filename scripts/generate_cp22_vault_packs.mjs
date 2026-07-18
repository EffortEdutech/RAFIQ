import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const GRAPH_DIR = 'data/graphify/full-private';
const OUTPUT_DIR = 'data/vault/full-private';
const PACK_DIR = path.join(OUTPUT_DIR, 'packs');
const GENERATED_BY = 'scripts/generate_cp22_vault_packs.mjs';

const SAMPLE_AYAH_KEYS = ['1:1', '2:255', '65:2'];

function sha256(value) {
  return createHash('sha256').update(value).digest('hex').toUpperCase();
}

function yamlString(value) {
  return JSON.stringify(String(value ?? ''));
}

function yamlArray(values) {
  const items = [...new Set((values ?? []).filter(Boolean).map(String))];
  if (items.length === 0) return '[]';
  return `[${items.map((value) => yamlString(value)).join(', ')}]`;
}

function safeFileName(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120) || 'artifact';
}

function refToString(ref) {
  if (!ref) return null;
  if (typeof ref === 'string') return ref;
  return [ref.schema, ref.table, ref.id].filter(Boolean).join(':')
    || [ref.type, ref.id].filter(Boolean).join(':')
    || JSON.stringify(ref);
}

function sourceRefStrings(node) {
  return [
    ...(node?.sourceRefs ?? []).map(refToString),
    ...(node?.provenanceRefs ?? []),
    ...(node?.releaseStateRefs ?? []),
  ].filter(Boolean);
}

function canonicalRefStrings(nodes, fallback = []) {
  return [
    ...fallback,
    ...nodes.map((node) => refToString(node?.canonicalRef)).filter(Boolean),
  ];
}

function countBy(items, key) {
  const counts = new Map();
  for (const item of items) {
    const value = typeof key === 'function' ? key(item) : item[key];
    counts.set(value ?? 'unknown', (counts.get(value ?? 'unknown') ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => String(a[0]).localeCompare(String(b[0])));
}

function table(rows, headers) {
  const lines = [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
  ];
  for (const row of rows) {
    lines.push(`| ${row.map((value) => String(value ?? '').replace(/\|/g, '\\|')).join(' | ')} |`);
  }
  return lines.join('\n');
}

function bulletList(values, empty = 'None recorded.') {
  const items = [...new Set((values ?? []).filter(Boolean).map(String))];
  if (items.length === 0) return empty;
  return items.map((value) => `- ${value}`).join('\n');
}

function summarizeNodes(nodes, limit = 12) {
  if (!nodes.length) return 'No graph nodes linked to this pack.';
  return table(
    nodes.slice(0, limit).map((node) => [
      node.id,
      node.type,
      node.partition,
      node.releaseState,
      node.reviewState,
      node.qualityState,
    ]),
    ['Node ID', 'Type', 'Partition', 'Release', 'Review', 'Quality'],
  );
}

function metadataBlock(value) {
  const metadata = value ?? {};
  const keys = Object.keys(metadata).slice(0, 12);
  if (keys.length === 0) return 'No metadata fields recorded.';
  return table(keys.map((key) => [key, JSON.stringify(metadata[key])]), ['Field', 'Value']);
}

function packContent({
  artifactId,
  artifactType,
  title,
  generatedAt,
  graphManifest,
  graphNodes = [],
  canonicalRefs = [],
  sourceRefs = [],
  summary,
  evidenceDetails,
  qualityDetails,
  blockers = [],
}) {
  const graphNodeIds = [...new Set(graphNodes.map((node) => node.id))];
  const allCanonicalRefs = canonicalRefStrings(graphNodes, canonicalRefs);
  const allSourceRefs = [
    `graph_manifest:${graphManifest.graphId}`,
    ...sourceRefs,
    ...graphNodes.flatMap(sourceRefStrings),
  ];
  const qualityStates = [...new Set(graphNodes.map((node) => node.qualityState).filter(Boolean))];
  const reviewStates = [...new Set(graphNodes.map((node) => node.reviewState).filter(Boolean))];
  const releaseStates = [...new Set(graphNodes.map((node) => node.releaseState).filter(Boolean))];
  const qualityState = qualityStates.includes('warning') ? 'warning'
    : qualityStates.includes('unverified') ? 'unverified'
      : qualityStates[0] ?? 'generated_review';
  const reviewState = reviewStates.includes('content_review') ? 'content_review'
    : reviewStates.includes('technical_review') ? 'technical_review'
      : reviewStates[0] ?? 'technical_review';
  const releaseState = releaseStates.includes('public_blocked') ? 'public_blocked'
    : releaseStates[0] ?? 'private_available_public_blocked';

  const yaml = [
    '---',
    `artifact_id: ${yamlString(artifactId)}`,
    `artifact_type: ${yamlString(artifactType)}`,
    `title: ${yamlString(title)}`,
    'status: "generated"',
    'environment: "private_local"',
    'access_level: "developer_private"',
    'public_safe: false',
    `generated_at: ${yamlString(generatedAt)}`,
    `generated_by: ${yamlString(GENERATED_BY)}`,
    `source_graph_id: ${yamlString(graphManifest.graphId)}`,
    `canonical_refs: ${yamlArray(allCanonicalRefs)}`,
    `source_refs: ${yamlArray(allSourceRefs)}`,
    `graph_node_ids: ${yamlArray(graphNodeIds)}`,
    `release_state: ${yamlString(releaseState)}`,
    `review_state: ${yamlString(reviewState)}`,
    `quality_state: ${yamlString(qualityState)}`,
    '---',
  ].join('\n');

  return `${yaml}

# ${title}

## Summary

${summary}

This is a generated private RAFIQ Knowledge Vault review artifact. It is not canonical source data, not a substitute for source files, and not public release approval.

## Canonical References

${bulletList(allCanonicalRefs)}

## Source And Attribution

${bulletList(allSourceRefs)}

## Evidence Graph

Graph node IDs:

${bulletList(graphNodeIds)}

${summarizeNodes(graphNodes)}

${evidenceDetails ?? ''}

## Quality And Review State

- Review state: \`${reviewState}\`
- Quality state: \`${qualityState}\`
- Release state: \`${releaseState}\`
- Public safe: \`false\`

${qualityDetails ?? ''}

## Release Boundary

This pack is private-local and developer-private. It must not be exposed through
public RAFIQ routes, public APIs, or public vault exports without a separate
release approval plan.

## Open Questions Or Blockers

${bulletList([
    ...blockers,
    'Vault packs are review/navigation artifacts only and must not be treated as canonical source data.',
    'Public-safe status remains false until source licensing, attribution, editorial, and scholar review gates approve release.',
  ])}
`;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function loadGraph() {
  const manifest = await readJson(path.join(GRAPH_DIR, 'manifest.json'));
  const partitions = {};
  for (const partition of manifest.partitions) {
    partitions[partition.name] = await readJson(path.join(GRAPH_DIR, partition.path));
  }
  const byAyahKey = await readJson(path.join(GRAPH_DIR, 'indexes/by-ayah-key.json'));
  const byNodeId = await readJson(path.join(GRAPH_DIR, 'indexes/by-node-id.json'));
  return { manifest, partitions, byAyahKey, byNodeId };
}

function nodesOf(partitions, names) {
  return names.flatMap((name) => partitions[name]?.nodes ?? []);
}

function firstNodes(nodes, type, limit) {
  return nodes.filter((node) => node.type === type).slice(0, limit);
}

function nodeById(partitions, id) {
  for (const partition of Object.values(partitions)) {
    const found = partition.nodes.find((node) => node.id === id);
    if (found) return found;
  }
  return null;
}

function buildPackPlans(graph, generatedAt) {
  const { manifest, partitions, byAyahKey } = graph;
  const plans = [];
  const push = (category, fileStem, options) => {
    plans.push({
      category,
      path: path.join(PACK_DIR, category, `${safeFileName(fileStem)}.md`),
      ...options,
      generatedAt,
      graphManifest: manifest,
    });
  };

  const allNodes = Object.values(partitions).flatMap((partition) => partition.nodes ?? []);
  const sources = nodesOf(partitions, ['sources']);
  const quran = nodesOf(partitions, ['quran']);
  const translations = nodesOf(partitions, ['translations']);
  const tafsir = nodesOf(partitions, ['tafsir']);
  const hadith = nodesOf(partitions, ['hadith']);
  const grades = nodesOf(partitions, ['hadith-grades']);
  const topics = nodesOf(partitions, ['topics']);
  const governance = nodesOf(partitions, ['governance']);
  const quality = nodesOf(partitions, ['quality']);
  const evidence = nodesOf(partitions, ['product-evidence']);
  const cp21c = nodesOf(partitions, ['cp21c-reference']);

  push('release-gates', 'full-private-vault-boundary', {
    artifactId: 'vault:full-private:release-boundary',
    artifactType: 'release_gate_pack',
    title: 'Full Private Vault Release Boundary',
    graphNodes: [
      ...firstNodes(governance, 'content_release_state', 8),
      ...firstNodes(quality, 'validation_finding', 8),
      ...firstNodes(cp21c, 'cp21c_case', 4),
    ],
    canonicalRefs: ['data/graphify/full-private/manifest.json'],
    sourceRefs: ['docs/04_knowledge/RAFIQ_KNOWLEDGE_VAULT_ARTIFACT_CONTRACT_V1.md'],
    summary: `CP22-G07 vault boundary pack for graph \`${manifest.graphId}\`. The source graph has ${manifest.counts.totalNodes} nodes and ${manifest.counts.totalEdges} edges, with ${manifest.counts.publicSafeNodes} public-safe nodes and ${manifest.counts.publicSafeEdges} public-safe edges.`,
    evidenceDetails: table(
      manifest.partitions.map((item) => [item.name, item.nodeCount, item.edgeCount, item.publicSafeNodeCount, item.publicSafeEdgeCount]),
      ['Partition', 'Nodes', 'Edges', 'Public-Safe Nodes', 'Public-Safe Edges'],
    ),
    blockers: manifest.warnings,
  });

  push('sources', 'source-summary', {
    artifactId: 'vault:sources:summary',
    artifactType: 'source_approval_pack',
    title: 'Source Approval Summary',
    graphNodes: sources.slice(0, 20),
    canonicalRefs: ['data/graphify/full-private/partitions/sources.json'],
    summary: `Source partition review pack covering ${sources.length} source, manifest, snapshot, checksum, license, and release records.`,
    evidenceDetails: table(countBy(sources, 'type'), ['Source Node Type', 'Count']),
    blockers: ['Source packs summarize provenance and approval state; they do not grant public release.'],
  });

  for (const node of sources) {
    push('sources', node.id, {
      artifactId: `vault:source:${node.id}`,
      artifactType: 'source_approval_pack',
      title: `Source Pack - ${node.label}`,
      graphNodes: [node],
      summary: `Private source approval pack for \`${node.id}\`.`,
      evidenceDetails: metadataBlock(node.metadata),
      blockers: node.publicSafe ? [] : ['Source node is not public safe.'],
    });
  }

  push('quran', 'quran-ayah-summary', {
    artifactId: 'vault:quran:summary',
    artifactType: 'ayah_study_pack',
    title: 'Quran And Ayah Study Summary',
    graphNodes: [
      ...firstNodes(quran, 'quran_surah', 5),
      ...firstNodes(quran, 'quran_ayah', 5),
      ...firstNodes(quran, 'quran_text_version', 5),
      ...firstNodes(translations, 'translation_edition', 5),
    ],
    canonicalRefs: ['data/graphify/full-private/partitions/quran.json', 'data/graphify/full-private/partitions/translations.json'],
    summary: `Quran, Quran text-version, and translation review summary. Quran partition has ${quran.length} nodes; translations partition has ${translations.length} nodes.`,
    evidenceDetails: [
      table(countBy(quran, 'type'), ['Quran Node Type', 'Count']),
      table(countBy(translations, 'type'), ['Translation Node Type', 'Count']),
    ].join('\n\n'),
    blockers: ['Raw Quran and translation text bodies are not copied into vault packs.'],
  });

  for (const ayahKey of SAMPLE_AYAH_KEYS) {
    const index = byAyahKey[ayahKey];
    if (!index) continue;
    const linkedIds = [
      index.ayahNodeId,
      ...(index.translations ?? []).slice(0, 5),
      ...(index.tafsir ?? []).slice(0, 3),
      ...(index.topics ?? []).slice(0, 5),
      ...(index.retrievalEvidence ?? []).slice(0, 5),
    ];
    const graphNodes = linkedIds.map((id) => nodeById(partitions, id)).filter(Boolean);
    push('quran', `ayah-${ayahKey}`, {
      artifactId: `vault:ayah:${ayahKey}`,
      artifactType: 'ayah_study_pack',
      title: `Ayah Study Pack - Quran ${ayahKey}`,
      graphNodes,
      summary: `Private ayah study pack for Quran ${ayahKey}. It records graph links for ayah, text versions, translations, tafsir, topics, and validation evidence where present.`,
      evidenceDetails: table([
        ['ayah_node', index.ayahNodeId],
        ['translation_links', (index.translations ?? []).length],
        ['tafsir_links', (index.tafsir ?? []).length],
        ['topic_links', (index.topics ?? []).length],
        ['retrieval_evidence_links', (index.retrievalEvidence ?? []).length],
      ], ['Signal', 'Value']),
      blockers: ['Ayah pack is for private navigation and does not include raw text body export.'],
    });
  }

  push('tafsir', 'tafsir-summary', {
    artifactId: 'vault:tafsir:summary',
    artifactType: 'tafsir_passage_pack',
    title: 'Tafsir Passage Summary',
    graphNodes: [
      ...firstNodes(tafsir, 'tafsir_edition', 8),
      ...firstNodes(tafsir, 'tafsir_passage', 8),
    ],
    canonicalRefs: ['data/graphify/full-private/partitions/tafsir.json'],
    summary: `Tafsir review summary covering ${tafsir.length} tafsir nodes.`,
    evidenceDetails: table(countBy(tafsir, 'type'), ['Tafsir Node Type', 'Count']),
    blockers: ['Tafsir passages remain source-qualified and private unless release gates approve otherwise.'],
  });

  for (const node of [...firstNodes(tafsir, 'tafsir_edition', 3), ...firstNodes(tafsir, 'tafsir_passage', 6)]) {
    push('tafsir', node.id, {
      artifactId: `vault:tafsir:${node.id}`,
      artifactType: 'tafsir_passage_pack',
      title: `Tafsir Pack - ${node.label}`,
      graphNodes: [node],
      summary: `Private tafsir review pack for \`${node.id}\`.`,
      evidenceDetails: metadataBlock(node.metadata),
      blockers: ['Tafsir pack does not approve public use or override source licensing.'],
    });
  }

  push('hadith', 'hadith-summary', {
    artifactId: 'vault:hadith:summary',
    artifactType: 'hadith_verification_pack',
    title: 'Hadith Verification Summary',
    graphNodes: [
      ...firstNodes(hadith, 'hadith_collection', 8),
      ...firstNodes(hadith, 'hadith_record', 8),
      ...firstNodes(grades, 'hadith_grade_assertion', 8),
    ],
    canonicalRefs: ['data/graphify/full-private/partitions/hadith.json', 'data/graphify/full-private/partitions/hadith-grades.json'],
    summary: `Hadith verification summary covering ${hadith.length} hadith nodes and ${grades.length} grade or verification nodes.`,
    evidenceDetails: [
      table(countBy(hadith, 'type'), ['Hadith Node Type', 'Count']),
      table(countBy(grades, 'type'), ['Grade Node Type', 'Count']),
    ].join('\n\n'),
    blockers: ['Hadith records are aggregate/private where record-level safe content snapshots are unavailable.'],
  });

  for (const node of [...firstNodes(hadith, 'hadith_record', 8), ...firstNodes(grades, 'hadith_grade_assertion', 6)]) {
    push('hadith', node.id, {
      artifactId: `vault:hadith:${node.id}`,
      artifactType: 'hadith_verification_pack',
      title: `Hadith Pack - ${node.label}`,
      graphNodes: [node],
      summary: `Private hadith verification pack for \`${node.id}\`.`,
      evidenceDetails: metadataBlock(node.metadata),
      blockers: ['Hadith grade and verification claims remain source-qualified and need human review before public use.'],
    });
  }

  push('topics', 'topic-summary', {
    artifactId: 'vault:topics:summary',
    artifactType: 'theme_guidance_pack',
    title: 'Topic And Theme Guidance Summary',
    graphNodes: topics.slice(0, 20),
    canonicalRefs: ['data/graphify/full-private/partitions/topics.json'],
    summary: `Topic/theme summary covering ${topics.length} private topic nodes.`,
    evidenceDetails: table(countBy(topics, 'type'), ['Topic Node Type', 'Count']),
    blockers: ['Topic links are navigation metadata and do not imply authoritative interpretation.'],
  });

  for (const node of topics.slice(0, 10)) {
    push('topics', node.id, {
      artifactId: `vault:topic:${node.id}`,
      artifactType: 'theme_guidance_pack',
      title: `Topic Pack - ${node.label}`,
      graphNodes: [node],
      summary: `Private topic/theme pack for \`${node.id}\`.`,
      evidenceDetails: metadataBlock(node.metadata),
      blockers: ['Topic/theme pack is not an independent religious ruling or tafsir.'],
    });
  }

  push('governance', 'governance-summary', {
    artifactId: 'vault:governance:summary',
    artifactType: 'release_gate_pack',
    title: 'Governance And Provenance Summary',
    graphNodes: governance.slice(0, 20),
    canonicalRefs: ['data/graphify/full-private/partitions/governance.json'],
    summary: `Governance summary covering ${governance.length} provenance and release-state nodes.`,
    evidenceDetails: table(countBy(governance, 'type'), ['Governance Node Type', 'Count']),
    blockers: ['Live database provenance rows remain deferred until a safe snapshot is provided.'],
  });

  for (const node of governance.slice(0, 10)) {
    push('governance', node.id, {
      artifactId: `vault:governance:${node.id}`,
      artifactType: 'release_gate_pack',
      title: `Governance Pack - ${node.label}`,
      graphNodes: [node],
      summary: `Private governance pack for \`${node.id}\`.`,
      evidenceDetails: metadataBlock(node.metadata),
      blockers: ['Governance pack preserves release blockers rather than clearing them.'],
    });
  }

  push('quality', 'quality-summary', {
    artifactId: 'vault:quality:summary',
    artifactType: 'release_gate_pack',
    title: 'Quality And Remediation Summary',
    graphNodes: quality.slice(0, 20),
    canonicalRefs: ['data/graphify/full-private/partitions/quality.json'],
    summary: `Quality summary covering ${quality.length} validation finding and remediation nodes.`,
    evidenceDetails: table(countBy(quality, 'type'), ['Quality Node Type', 'Count']),
    blockers: ['Open findings remain blockers until remediated and reviewed.'],
  });

  for (const node of quality.slice(0, 20)) {
    push('quality', node.id, {
      artifactId: `vault:quality:${node.id}`,
      artifactType: 'release_gate_pack',
      title: `Quality Pack - ${node.label}`,
      graphNodes: [node],
      summary: `Private quality/remediation pack for \`${node.id}\`.`,
      evidenceDetails: metadataBlock(node.metadata),
      blockers: ['Quality pack is inspectable evidence of review state, not proof of public readiness.'],
    });
  }

  push('validation', 'guidance-validation-summary', {
    artifactId: 'vault:validation:summary',
    artifactType: 'guidance_evidence_pack',
    title: 'Guidance Evidence And Validation Summary',
    graphNodes: [...cp21c.slice(0, 20), ...evidence.slice(0, 20)],
    canonicalRefs: ['data/graphify/full-private/partitions/cp21c-reference.json', 'data/graphify/full-private/partitions/product-evidence.json'],
    summary: `Validation summary covering ${cp21c.length} CP21C reference nodes and ${evidence.length} product-evidence nodes.`,
    evidenceDetails: [
      table(countBy(cp21c, 'type'), ['CP21C Node Type', 'Count']),
      table(countBy(evidence, 'type'), ['Product Evidence Node Type', 'Count']),
    ].join('\n\n'),
    blockers: ['CP21C evidence remains prototype validation evidence, not the RAFIQ resource graph itself.'],
  });

  for (const node of firstNodes(cp21c, 'cp21c_case', 30)) {
    const caseId = node.metadata?.caseId ?? node.id.replace(/^cp21c_case:/, '').toUpperCase();
    const linkedEvidence = evidence.filter((item) => item.id.toLowerCase().includes(String(caseId).toLowerCase()));
    push('validation', node.id, {
      artifactId: `vault:validation:${node.id}`,
      artifactType: 'guidance_evidence_pack',
      title: `Guidance Evidence Pack - ${node.label}`,
      graphNodes: [node, ...linkedEvidence.slice(0, 8)],
      summary: `Private guidance evidence pack for CP21C case \`${caseId}\`.`,
      evidenceDetails: metadataBlock(node.metadata),
      blockers: ['Generated evidence routes are derived candidates and do not become religious authority.'],
    });
  }

  push('release-gates', 'manifest-partition-index', {
    artifactId: 'vault:full-private:manifest-index',
    artifactType: 'release_gate_pack',
    title: 'Full Private Manifest Partition Index',
    graphNodes: allNodes.slice(0, 30),
    canonicalRefs: ['data/graphify/full-private/manifest.json', 'data/graphify/full-private/summary.json'],
    summary: `Manifest index pack for ${manifest.partitions.length} graph partitions and ${manifest.indexes.length} indexes.`,
    evidenceDetails: [
      table(manifest.partitions.map((item) => [item.name, item.nodeCount, item.edgeCount, item.checksumSha256]), ['Partition', 'Nodes', 'Edges', 'Checksum']),
      table(manifest.indexes.map((item) => [item.name, item.entryCount, item.checksumSha256]), ['Index', 'Entries', 'Checksum']),
    ].join('\n\n'),
    blockers: manifest.warnings,
  });

  return plans;
}

async function writePack(plan) {
  const content = packContent(plan);
  const graphNodeIds = [...new Set(plan.graphNodes.map((node) => node.id))];
  await mkdir(path.dirname(plan.path), { recursive: true });
  await writeFile(plan.path, content, 'utf8');
  return {
    artifactId: plan.artifactId,
    artifactType: plan.artifactType,
    title: plan.title,
    category: plan.category,
    path: path.relative(OUTPUT_DIR, plan.path).replace(/\\/g, '/'),
    checksumSha256: sha256(content),
    publicSafe: false,
    graphNodeIds,
    canonicalRefs: canonicalRefStrings(plan.graphNodes, plan.canonicalRefs),
    sourceRefs: [
      `graph_manifest:${plan.graphManifest.graphId}`,
      ...(plan.sourceRefs ?? []),
      ...plan.graphNodes.flatMap(sourceRefStrings),
    ],
  };
}

async function main() {
  const graph = await loadGraph();
  const generatedAt = new Date().toISOString();

  await rm(OUTPUT_DIR, { recursive: true, force: true });
  await mkdir(PACK_DIR, { recursive: true });

  const plans = buildPackPlans(graph, generatedAt);
  const artifacts = [];
  for (const plan of plans) artifacts.push(await writePack(plan));

  const categoryCounts = Object.fromEntries(countBy(artifacts, 'category'));
  const manifest = {
    schemaVersion: 'cp22.full-private-vault.v1',
    contractVersion: 'RAFIQ_KNOWLEDGE_VAULT_ARTIFACT_CONTRACT_V1+CP22-G07',
    checkpoint: 'CP22-G07',
    vaultId: 'rafiq-full-private-knowledge-vault',
    vaultKind: 'private_review_vault',
    scope: 'Generated private vault packs for the CP22 full private RAFIQ resource graph.',
    environment: 'private_local',
    accessLevel: 'developer_private',
    publicSafe: false,
    generatedAt,
    generatedBy: GENERATED_BY,
    sourceGraphId: graph.manifest.graphId,
    sourceGraphCheckpoint: graph.manifest.checkpoint,
    sourceGraphChecksumSha256: graph.manifest.checksums?.graphChecksumSha256 ?? null,
    outputDir: OUTPUT_DIR,
    counts: {
      artifacts: artifacts.length,
      categories: Object.keys(categoryCounts).length,
      publicSafeArtifacts: artifacts.filter((artifact) => artifact.publicSafe).length,
      graphNodesReferenced: new Set(artifacts.flatMap((artifact) => artifact.graphNodeIds)).size,
    },
    categoryCounts,
    requiredBoundary: {
      vaultArtifactsAreCanonicalSourceData: false,
      rawTextBodiesExported: false,
      publicReleaseApproved: false,
      publicSafeArtifactsAllowed: false,
    },
    artifacts,
    warnings: [
      'Vault packs are generated review and navigation artifacts, not canonical source data.',
      'Vault packs do not copy raw Quran, tafsir, translation, or hadith text bodies.',
      'All CP22-G07 vault artifacts are private and publicSafe=false.',
      'CP21C validation packs remain prototype evidence and must not be mistaken for the full RAFIQ resource graph.',
    ],
  };

  const manifestContent = `${JSON.stringify(manifest, null, 2)}\n`;
  await writeFile(path.join(OUTPUT_DIR, 'manifest.json'), manifestContent, 'utf8');

  console.log(JSON.stringify({
    status: 'pass',
    checkpoint: manifest.checkpoint,
    outputDir: OUTPUT_DIR,
    artifactCount: manifest.counts.artifacts,
    categoryCounts: manifest.categoryCounts,
    publicSafeArtifacts: manifest.counts.publicSafeArtifacts,
    graphNodesReferenced: manifest.counts.graphNodesReferenced,
  }, null, 2));
}

await main();
