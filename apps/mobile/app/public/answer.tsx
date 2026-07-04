import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import type { PublicSearchDomain } from '@rafiq/shared';
import { PublicAppShell } from '../../src/components/public/PublicAppShell';
import { PublicBoundaryPanel } from '../../src/components/public/PublicBoundaryPanel';
import { PublicStatusBadge } from '../../src/components/public/PublicStatusBadge';
import { createPublicAnswerDraft, createPublicGuidedAnswer } from '../../src/services/publicContentApi';
import { publicColors, publicRadii, publicShadows, publicSpacing, publicTypography } from '../../src/theme/publicDesignSystem';

const DOMAINS: Array<{ value: PublicSearchDomain; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'quran', label: 'Quran' },
  { value: 'tafsir', label: 'Tafsir' },
  { value: 'topics', label: 'Topics' },
  { value: 'themes', label: 'Themes' },
  { value: 'hadith', label: 'Hadith' },
];

const QUESTION_STARTERS = [
  'What does Islam say about mercy?',
  'How can I understand patience in hardship?',
  'What sources discuss charity?',
  'How should I approach a ruling-like question?',
];

const ANSWER_JOURNEY = [
  ['Understand the question', 'RAFIQ identifies intent before trying to answer.'],
  ['Retrieve approved evidence', 'Public answers require release-approved Quran, Hadith, tafsir, or topic evidence.'],
  ['Validate boundaries', 'If evidence is missing, sensitive, or not approved, RAFIQ blocks the answer.'],
  ['Show citations clearly', 'When answers are allowed, citations and source status must stay visible.'],
];

function formatGateName(name: string) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (letter) => letter.toUpperCase());
}

function formatGateValue(value: unknown) {
  if (!value || typeof value !== 'object') {
    return String(value);
  }

  const payload = value as Record<string, unknown>;
  const details = [
    payload.status ? `Status: ${payload.status}` : null,
    payload.detectedIntent ? `Intent: ${payload.detectedIntent}` : null,
    payload.policy ? `Policy: ${payload.policy}` : null,
  ].filter(Boolean);

  return details.length ? details.join(' | ') : 'Gate reviewed';
}

export default function PublicAnswerScreen() {
  const [question, setQuestion] = useState('What does Islam say about mercy?');
  const [submittedQuestion, setSubmittedQuestion] = useState('What does Islam say about mercy?');
  const [domain, setDomain] = useState<PublicSearchDomain>('all');
  const [draftPayload, setDraftPayload] = useState<Awaited<ReturnType<typeof createPublicAnswerDraft>> | null>(null);
  const [guidedPayload, setGuidedPayload] = useState<Awaited<ReturnType<typeof createPublicGuidedAnswer>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraftPayload(null);
    setGuidedPayload(null);
    setError(null);
    const params = {
      q: submittedQuestion,
      domain,
      language: 'en',
      limit: 5,
    };
    void Promise.all([
      createPublicAnswerDraft(params),
      createPublicGuidedAnswer(params),
    ])
      .then(([draft, guided]) => {
        setDraftPayload(draft);
        setGuidedPayload(guided);
      })
      .catch((answerError: unknown) => {
        setError(answerError instanceof Error ? answerError.message : 'Public guided answer failed');
      });
  }, [domain, submittedQuestion]);

  const gateSummary = useMemo(() => {
    const gates = draftPayload?.answerDraft.validationGateResults;
    if (!gates) return [];
    return Object.entries(gates).map(([name, value]) => ({
      name: formatGateName(name),
      value: formatGateValue(value),
    }));
  }, [draftPayload]);

  const evidenceCount = guidedPayload?.guidedAnswer.evidencePrompt.length ?? 0;

  return (
    <PublicAppShell
      eyebrow="Guided Answer"
      title="Ask RAFIQ, but only with evidence."
      subtitle="Guided answers are RAFIQ's core promise: understand the question, retrieve approved evidence, validate the boundary, and refuse to improvise when public evidence is not ready."
    >
      <View style={[styles.questionPanel, publicShadows.raised]}>
        <View style={styles.questionHeader}>
          <PublicStatusBadge kind="approvalPending" label="Public evidence gate active" />
          <Text style={styles.sectionTitle}>Ask a careful Islamic knowledge question.</Text>
          <Text style={styles.body}>
            RAFIQ is designed to help, but not at the cost of trust. In public mode it will only
            produce guidance when approved evidence and citation rules are satisfied.
          </Text>
        </View>
        <TextInput
          accessibilityLabel="Public guided answer question"
          multiline
          onChangeText={setQuestion}
          placeholder="Ask a careful Islamic knowledge question"
          style={styles.input}
          value={question}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => setSubmittedQuestion(question)}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Check answer readiness</Text>
        </Pressable>
      </View>

      <View style={styles.starterPanel}>
        <Text style={styles.kicker}>Question Starters</Text>
        <Text style={styles.sectionTitle}>Try the kind of question RAFIQ is built to handle.</Text>
        <View style={styles.starterGrid}>
          {QUESTION_STARTERS.map((starter) => (
            <Pressable
              accessibilityRole="button"
              key={starter}
              onPress={() => {
                setQuestion(starter);
                setSubmittedQuestion(starter);
              }}
              style={styles.starterCard}
            >
              <Text style={styles.starterText}>{starter}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.domainRow}>
        {DOMAINS.map((item) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: domain === item.value }}
            key={item.value}
            onPress={() => setDomain(item.value)}
            style={[styles.domainChip, domain === item.value ? styles.activeDomainChip : null]}
          >
            <Text style={[styles.domainLabel, domain === item.value ? styles.activeDomainLabel : null]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {error ? (
        <View style={styles.errorPanel}>
          <Text style={styles.errorTitle}>Public guided answer could not load</Text>
          <Text style={styles.body}>{error}</Text>
        </View>
      ) : null}

      {!draftPayload && !guidedPayload && !error ? (
        <ActivityIndicator color={publicColors.deepGreen} style={styles.loading} />
      ) : null}

      {guidedPayload?.guidedAnswer ? (
        <View style={[styles.statusPanel, publicShadows.card]}>
          <Text style={styles.kicker}>Answer Readiness</Text>
          <Text style={styles.sectionTitle}>RAFIQ checks evidence before it speaks.</Text>
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Prompt</Text>
              <Text style={styles.statusValue}>{guidedPayload.guidedAnswer.promptStatus}</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Answer state</Text>
              <Text style={styles.statusValue}>{guidedPayload.guidedAnswer.responseState}</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Evidence</Text>
              <Text style={styles.statusValue}>{evidenceCount}</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Citations</Text>
              <Text style={styles.statusValue}>{guidedPayload.guidedAnswer.citationIds.length}</Text>
            </View>
          </View>
          <Text style={styles.meta}>
            Public answer ready: {guidedPayload.guidedAnswer.publicReleaseReady ? 'yes' : 'not yet'}
          </Text>
        </View>
      ) : null}

      <View style={[styles.journeyPanel, publicShadows.card]}>
        <Text style={styles.kicker}>How RAFIQ Answers</Text>
        <Text style={styles.sectionTitle}>A guided answer is a workflow, not a guess.</Text>
        {ANSWER_JOURNEY.map(([title, body], index) => (
          <View key={title} style={styles.journeyRow}>
            <Text style={styles.journeyNumber}>0{index + 1}</Text>
            <View style={styles.journeyCopy}>
              <Text style={styles.journeyTitle}>{title}</Text>
              <Text style={styles.journeyBody}>{body}</Text>
            </View>
          </View>
        ))}
      </View>

      <PublicBoundaryPanel
        title="Approved public evidence is not available yet"
        body="When a question cannot be supported by approved public sources, RAFIQ will show a calm blocked state instead of generating unsupported guidance."
      />

      {draftPayload?.answerDraft ? (
        <View style={[styles.answerPanel, publicShadows.card]}>
          <Text style={styles.kicker}>Current Answer Boundary</Text>
          <Text style={styles.sectionTitle}>RAFIQ is not ready to answer this publicly yet.</Text>
          <Text style={styles.body}>{draftPayload.answerDraft.draftAnswer}</Text>
          <Text style={styles.meta}>Question: {draftPayload.answerDraft.questionText}</Text>
          <Text style={styles.meta}>Detected intent: {draftPayload.answerDraft.detectedIntent}</Text>
          <Text style={styles.meta}>Policy: {draftPayload.answerDraft.policyVersion}</Text>
          <Text style={styles.meta}>Public evidence searched: {draftPayload.search.pagination.total}</Text>
        </View>
      ) : null}

      <View style={[styles.evidencePanel, publicShadows.card]}>
        <Text style={styles.kicker}>Evidence And Citations</Text>
        <Text style={styles.sectionTitle}>No public answer without approved evidence.</Text>
        {evidenceCount > 0 ? (
          guidedPayload?.guidedAnswer.evidencePrompt.map((item) => (
            <View key={item.citationId} style={styles.evidenceCard}>
              <PublicStatusBadge kind="approvedPublic" label="Approved public" />
              <Text style={styles.evidenceTitle}>{item.title}</Text>
              {item.subtitle ? <Text style={styles.meta}>{item.subtitle}</Text> : null}
              <Text style={styles.body}>{item.snippet}</Text>
              <Text style={styles.meta}>Citation: {item.citationId}</Text>
              <Text style={styles.meta}>Public release: {item.publicReleaseStatus}</Text>
            </View>
          ))
        ) : (
          <View style={styles.noEvidenceCard}>
            <PublicStatusBadge kind="blocked" label="Blocked no public evidence" />
            <Text style={styles.evidenceTitle}>No approved evidence can be cited yet</Text>
            <Text style={styles.body}>
              RAFIQ will not create public answer guidance without approved source evidence.
              This protects users from unsupported religious claims.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.guardrailPanel}>
        <Text style={styles.kicker}>Guidance Boundary</Text>
        <Text style={styles.sectionTitle}>RAFIQ should be useful without pretending to be an authority.</Text>
        <Text style={styles.body}>
          RAFIQ public answers are not fatwa. They must be evidence-led, source-cited,
          and blocked when approved evidence is unavailable. Sensitive or ruling-like
          questions should be directed to qualified scholars or appropriate local authorities.
        </Text>
      </View>

      {gateSummary.length ? (
        <View style={[styles.gatePanel, publicShadows.card]}>
          <Text style={styles.kicker}>Validation Snapshot</Text>
          <Text style={styles.sectionTitle}>What RAFIQ checked before blocking.</Text>
          {gateSummary.map((gate) => (
            <View key={gate.name} style={styles.gateRow}>
              <Text style={styles.gateName}>{gate.name}</Text>
              <Text style={styles.gateValue}>{gate.value}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.nextStepPanel}>
        <Text style={styles.kicker}>Next Product Path</Text>
        <Text style={styles.sectionTitle}>When RAFIQ cannot answer, it should still help users move carefully.</Text>
        <View style={styles.nextLinks}>
          <Link href="/public/search" style={styles.nextLink}>
            Explore source search
          </Link>
          <Link href="/public/quran" style={styles.nextLink}>
            Preview Quran reading
          </Link>
          <Link href="/public/sources" style={styles.nextLink}>
            Understand source trust
          </Link>
        </View>
      </View>
    </PublicAppShell>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: publicSpacing.space24,
  },
  questionPanel: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space24,
  },
  questionHeader: {
    gap: publicSpacing.space12,
  },
  sectionTitle: {
    ...publicTypography.sectionTitle,
    color: publicColors.ink,
  },
  body: {
    ...publicTypography.body,
    color: publicColors.slate,
  },
  input: {
    backgroundColor: publicColors.white,
    borderColor: publicColors.line,
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    color: publicColors.ink,
    minHeight: 92,
    paddingHorizontal: publicSpacing.space16,
    paddingVertical: publicSpacing.space12,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: publicColors.deepGreen,
    borderRadius: publicRadii.medium,
    minHeight: 48,
    paddingHorizontal: publicSpacing.space20,
    paddingVertical: publicSpacing.space16,
  },
  primaryButtonText: {
    color: publicColors.white,
    fontWeight: '900',
    textAlign: 'center',
  },
  kicker: {
    ...publicTypography.label,
    color: publicColors.gold,
    textTransform: 'uppercase',
  },
  starterPanel: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space20,
  },
  starterGrid: {
    gap: publicSpacing.space12,
  },
  starterCard: {
    backgroundColor: publicColors.mintSoft,
    borderColor: publicColors.line,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    minHeight: 72,
    padding: publicSpacing.space16,
  },
  starterText: {
    ...publicTypography.body,
    color: publicColors.ink,
    fontWeight: '700',
  },
  domainRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space8,
  },
  domainChip: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.pill,
    borderWidth: 1,
    minHeight: 44,
    paddingHorizontal: publicSpacing.space16,
    paddingVertical: publicSpacing.space12,
  },
  activeDomainChip: {
    backgroundColor: publicColors.deepGreen,
    borderColor: publicColors.deepGreen,
  },
  domainLabel: {
    color: publicColors.ink,
    fontWeight: '800',
  },
  activeDomainLabel: {
    color: publicColors.white,
  },
  errorPanel: {
    backgroundColor: '#F8E5DF',
    borderColor: publicColors.danger,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    gap: publicSpacing.space8,
    padding: publicSpacing.space16,
  },
  errorTitle: {
    color: publicColors.danger,
    fontSize: 18,
    fontWeight: '800',
  },
  statusPanel: {
    backgroundColor: publicColors.goldWash,
    borderColor: publicColors.lineStrong,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space20,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space8,
  },
  statusItem: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    flexGrow: 1,
    minWidth: 130,
    padding: publicSpacing.space12,
  },
  statusLabel: {
    ...publicTypography.label,
    color: publicColors.muted,
    textTransform: 'uppercase',
  },
  statusValue: {
    color: publicColors.deepGreen,
    fontSize: 18,
    fontWeight: '900',
    marginTop: publicSpacing.space4,
  },
  meta: {
    ...publicTypography.metadata,
    color: publicColors.muted,
  },
  journeyPanel: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space20,
  },
  journeyRow: {
    alignItems: 'flex-start',
    backgroundColor: publicColors.cream,
    borderColor: publicColors.line,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    flexDirection: 'row',
    gap: publicSpacing.space12,
    padding: publicSpacing.space16,
  },
  journeyNumber: {
    ...publicTypography.label,
    color: publicColors.gold,
  },
  journeyCopy: {
    flex: 1,
    gap: publicSpacing.space4,
  },
  journeyTitle: {
    ...publicTypography.cardTitle,
    color: publicColors.ink,
  },
  journeyBody: {
    ...publicTypography.metadata,
    color: publicColors.slate,
  },
  answerPanel: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space12,
    padding: publicSpacing.space20,
  },
  evidencePanel: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space12,
    padding: publicSpacing.space20,
  },
  evidenceCard: {
    backgroundColor: publicColors.cream,
    borderColor: publicColors.line,
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    gap: publicSpacing.space8,
    padding: publicSpacing.space16,
  },
  noEvidenceCard: {
    backgroundColor: '#F8E5DF',
    borderColor: publicColors.danger,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    gap: publicSpacing.space12,
    padding: publicSpacing.space16,
  },
  evidenceTitle: {
    color: publicColors.ink,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
  },
  guardrailPanel: {
    backgroundColor: publicColors.mint,
    borderColor: publicColors.deepGreen,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space12,
    padding: publicSpacing.space20,
  },
  gatePanel: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space12,
    padding: publicSpacing.space20,
  },
  gateRow: {
    borderTopColor: publicColors.line,
    borderTopWidth: 1,
    gap: publicSpacing.space4,
    paddingTop: publicSpacing.space8,
  },
  gateName: {
    color: publicColors.deepGreen,
    fontWeight: '900',
  },
  gateValue: {
    ...publicTypography.metadata,
    color: publicColors.slate,
  },
  nextStepPanel: {
    backgroundColor: publicColors.forest,
    borderColor: publicColors.deepGreen,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space24,
  },
  nextLinks: {
    gap: publicSpacing.space8,
  },
  nextLink: {
    backgroundColor: 'rgba(255, 253, 247, 0.08)',
    borderColor: 'rgba(255, 253, 247, 0.18)',
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    color: publicColors.white,
    fontWeight: '900',
    minHeight: 48,
    overflow: 'hidden',
    paddingHorizontal: publicSpacing.space16,
    paddingVertical: publicSpacing.space12,
  },
});
