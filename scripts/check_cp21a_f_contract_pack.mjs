import { readFile } from 'node:fs/promises';

const docs = [
  {
    id: 'CP21A',
    path: 'docs/09_sprints/resource_audit_import_prototype/CP21A_TARGET_DEVICE_PRODUCT_OWNER_UAT_PACK.md',
    phrases: [
      'Status: Pack Pass; agent target-viewport UAT passed on 2026-07-08; Product Owner physical-device sign-off pending',
      'Product Owner physical-device sign-off still required',
      'CP21A execution can pass only after Product Owner target-device review is recorded',
    ],
  },
  {
    id: 'CP21B',
    path: 'docs/09_sprints/resource_audit_import_prototype/CP21B_RISK_AND_SCHOLAR_ESCALATION_CONTRACT.md',
    phrases: [
      'Status: Implementation Pass',
      'scholar_escalation',
      'safety_escalation',
      'Intent Gate must run before response assembly',
      'CP21B matrix script covering all required states',
    ],
  },
  {
    id: 'CP21C',
    path: 'docs/09_sprints/resource_audit_import_prototype/CP21C_SEMANTIC_RANKING_AND_CROSS_SOURCE_SELECTION_CONTRACT.md',
    phrases: [
      'Status: Contract Pass; implementation pending',
      'at least 20 prompts',
      'Minimum pass score: `85`',
      'no single critical case scores below `75`',
    ],
  },
  {
    id: 'CP21D',
    path: 'docs/09_sprints/resource_audit_import_prototype/CP21D_BACKEND_GROWTH_MEMORY_CONTRACT.md',
    phrases: [
      'Status: Contract Pass; implementation pending',
      'Memory may improve relevance, not authenticity',
      '/api/private-content/memory/sessions',
      'privacy/no-public exposure is verified',
    ],
  },
  {
    id: 'CP21E',
    path: 'docs/09_sprints/resource_audit_import_prototype/CP21E_HADITH_REPLACEMENT_AND_VERIFICATION_WORKFLOW.md',
    phrases: [
      'Status: Contract Pass; implementation pending',
      'Never silently replace a damaged text without audit trail',
      'verified_private',
      'orchestrator excludes `detected`, `withheld`, and unverified replacement candidates',
    ],
  },
  {
    id: 'CP21F',
    path: 'docs/09_sprints/resource_audit_import_prototype/CP21F_PUBLIC_RELEASE_GATE_REGISTER.md',
    phrases: [
      'Status: Register Pass; public release remains NO-GO',
      'Current release state: `NO-GO`',
      'Public/private API separation',
      'no current doc claims RAFIQ is public-release ready',
    ],
  },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const results = [];

for (const item of docs) {
  const text = await readFile(item.path, 'utf8');
  for (const phrase of item.phrases) {
    assert(text.includes(phrase), `${item.id} missing required phrase: ${phrase}`);
  }
  results.push({
    id: item.id,
    path: item.path,
    requiredPhrases: item.phrases.length,
  });
}

const cp21Backlog = await readFile(
  'docs/09_sprints/resource_audit_import_prototype/CP21_PRIVATE_COMPANION_MVP_HARDENING_BACKLOG.md',
  'utf8',
);
for (const id of ['CP21A', 'CP21B', 'CP21C', 'CP21D', 'CP21E', 'CP21F']) {
  assert(cp21Backlog.includes(id), `CP21 backlog no longer includes ${id}.`);
}
assert(cp21Backlog.includes('Public release remains NO-GO'), 'CP21 backlog lost public release NO-GO wording.');

console.log(JSON.stringify({
  status: 'pass',
  pack: 'CP21A-F contracts and UAT pack',
  docs: results,
  acceptedAs: 'contract_pack_with_cp21b_implemented',
  requiresProductOwnerEvidence: ['CP21A'],
  requiresImplementationEvidence: ['CP21C', 'CP21D', 'CP21E'],
  publicRelease: 'no_go',
}, null, 2));
