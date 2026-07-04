import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { PublicAppShell } from '../../../src/components/public/PublicAppShell';
import { PublicBoundaryPanel } from '../../../src/components/public/PublicBoundaryPanel';
import { PublicStatusBadge } from '../../../src/components/public/PublicStatusBadge';
import { getPublicSourceDetail } from '../../../src/services/publicContentApi';
import {
  publicColors,
  publicRadii,
  publicShadows,
  publicSpacing,
  publicTypography,
} from '../../../src/theme/publicDesignSystem';

const TRUST_GATES = [
  ['Rights', 'rightsStatus'],
  ['Attribution', 'attributionStatus'],
  ['Editorial', 'editorialStatus'],
  ['Scholar/content', 'scholarContentStatus'],
  ['Publication', 'publicationStatus'],
] as const;

const DETAIL_LINKS = [
  ['Back to sources', '/public/sources'],
  ['Search release-filtered content', '/public/search'],
  ['Ask with evidence boundaries', '/public/answer'],
];

const PUBLIC_EXCLUSION_CATEGORIES = [
  'Internal retrieval and ranking diagnostics',
  'Private reviewer queue and workflow data',
  'Raw import lineage and operational provenance',
  'Unapproved content text and derived summaries',
];

function humanizeStatus(value: string) {
  return value.replace(/_/g, ' ');
}

export default function PublicSourceDetailShell() {
  const { id, entityType } = useLocalSearchParams<{ id: string; entityType?: string }>();
  const resolvedEntityType = entityType ?? 'unknown';
  const resolvedEntityId = id ?? 'pending';
  const [payload, setPayload] = useState<Awaited<ReturnType<typeof getPublicSourceDetail>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPayload(null);
    setError(null);
    void getPublicSourceDetail({
      entityType: resolvedEntityType,
      entityId: resolvedEntityId,
    })
      .then(setPayload)
      .catch((sourceError: unknown) => {
        setError(sourceError instanceof Error ? sourceError.message : 'Public source detail failed');
      });
  }, [resolvedEntityId, resolvedEntityType]);

  const sourceDetail = payload?.sourceDetail;

  const releaseSummary = useMemo(() => {
    if (!sourceDetail) return 'Checking public source gate';
    if (sourceDetail.publicReleaseGatePassed) return 'Approved for public display';
    if (sourceDetail.publicStatus === 'rolled_back') return 'Rolled back from public display';
    return 'Not public yet';
  }, [sourceDetail]);

  return (
    <PublicAppShell
      eyebrow="Source Detail"
      title="Source transparency before publication."
      subtitle="This page shows the public-safe trust record for a source: approval gates, attribution fields, rollback posture, and what remains hidden until release approval."
    >
      {!payload && !error ? <ActivityIndicator color={publicColors.deepGreen} style={styles.loading} /> : null}

      {error ? (
        <View style={styles.errorPanel}>
          <Text style={styles.errorTitle}>Public source detail could not load</Text>
          <Text style={styles.body}>{error}</Text>
        </View>
      ) : null}

      {sourceDetail ? (
        <>
          <View style={[styles.heroPanel, publicShadows.raised]}>
            <View style={styles.heroHeader}>
              <PublicStatusBadge
                kind={sourceDetail.publicReleaseGatePassed ? 'approvedPublic' : 'blocked'}
                label={sourceDetail.publicReleaseGatePassed ? 'Approved public' : 'Not public'}
              />
              <PublicStatusBadge kind="approvalPending" label={releaseSummary} />
            </View>
            <Text style={styles.kicker}>Public Source Record</Text>
            <Text style={styles.sectionTitle}>{sourceDetail.title}</Text>
            <Text style={styles.body}>{sourceDetail.permittedUseNote}</Text>
            <View style={styles.identityGrid}>
              <IdentityCard label="Entity type" value={sourceDetail.entityType} />
              <IdentityCard label="Study item" value={sourceDetail.entityId} />
              <IdentityCard label="Public status" value={humanizeStatus(sourceDetail.publicStatus)} />
              <IdentityCard label="Rollback" value={humanizeStatus(sourceDetail.rollbackStatus)} />
            </View>
          </View>

          <View style={[styles.gatePanel, publicShadows.card]}>
            <Text style={styles.kicker}>Release Gates</Text>
            <Text style={styles.sectionTitle}>What must be true before content appears publicly</Text>
            {TRUST_GATES.map(([label, key]) => (
              <View key={key} style={styles.gateRow}>
                <Text style={styles.gateLabel}>{label}</Text>
                <Text style={styles.gateValue}>{humanizeStatus(String(sourceDetail[key]))}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.attributionPanel, publicShadows.card]}>
            <Text style={styles.kicker}>Attribution Payload</Text>
            <Text style={styles.sectionTitle}>What users can see when a source is approved</Text>
            <Field label="Source name" value={sourceDetail.sourceName} />
            <Field label="Source key" value={sourceDetail.sourceKey} />
            <Field label="Snapshot key" value={sourceDetail.snapshotKey} />
            <Field label="Edition key" value={sourceDetail.editionKey} />
            <Field label="Author/translator/editor" value={sourceDetail.authorTranslatorEditor} />
            <Field label="Publisher/maintainer" value={sourceDetail.publisherOrMaintainer} />
            <Field label="License name" value={sourceDetail.licenseName} />
            <Field label="License URL" value={sourceDetail.licenseUrl} />
            <Field label="Attribution text" value={sourceDetail.attributionText} />
            <Field
              label="Required links"
              value={sourceDetail.requiredLinks.length ? sourceDetail.requiredLinks.join(', ') : null}
            />
          </View>

          <View style={[styles.boundaryCard, publicShadows.card]}>
            <Text style={styles.kicker}>Public Boundary</Text>
            <Text style={styles.sectionTitle}>What RAFIQ is deliberately not showing</Text>
            {sourceDetail.unavailableReason ? (
              <Text style={styles.body}>{sourceDetail.unavailableReason}</Text>
            ) : (
              <Text style={styles.body}>
                This source has passed the public release gate. Private operational fields still remain hidden.
              </Text>
            )}
            <View style={styles.exclusionList}>
              {PUBLIC_EXCLUSION_CATEGORIES.map((field) => (
                <Text key={field} style={styles.exclusionItem}>- {field}</Text>
              ))}
            </View>
          </View>

          <View style={styles.nextPanel}>
            <Text style={styles.kicker}>Next Product Path</Text>
            <Text style={styles.sectionTitle}>Source trust should lead users back into RAFIQ safely</Text>
            <View style={styles.nextLinks}>
              {DETAIL_LINKS.map(([label, href]) => (
                <Link href={href} key={href} style={styles.nextLink}>
                  {label}
                </Link>
              ))}
            </View>
          </View>
        </>
      ) : null}

      <PublicBoundaryPanel
        title="Public source-detail is release-gated"
        body="If a source has not passed public rights, attribution, editorial, scholar/content, and publication gates, RAFIQ shows only a not-public status and hides private provenance."
      />
    </PublicAppShell>
  );
}

function IdentityCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.identityCard}>
      <Text style={styles.identityLabel}>{label}</Text>
      <Text style={styles.identityValue}>{value}</Text>
    </View>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value ?? 'Not public / pending approval'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: publicSpacing.space24,
  },
  heroPanel: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.lineStrong,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space24,
  },
  heroHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space8,
  },
  kicker: {
    ...publicTypography.label,
    color: publicColors.gold,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    ...publicTypography.sectionTitle,
    color: publicColors.ink,
  },
  body: {
    ...publicTypography.body,
    color: publicColors.slate,
  },
  identityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space8,
  },
  identityCard: {
    backgroundColor: publicColors.forest,
    borderRadius: publicRadii.large,
    flex: 1,
    gap: publicSpacing.space4,
    minWidth: 150,
    padding: publicSpacing.space16,
  },
  identityLabel: {
    ...publicTypography.label,
    color: publicColors.goldSoft,
    textTransform: 'uppercase',
  },
  identityValue: {
    color: publicColors.white,
    fontWeight: '900',
  },
  gatePanel: {
    backgroundColor: publicColors.goldWash,
    borderColor: publicColors.lineStrong,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space12,
    padding: publicSpacing.space20,
  },
  gateRow: {
    alignItems: 'flex-start',
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space8,
    justifyContent: 'space-between',
    padding: publicSpacing.space16,
  },
  gateLabel: {
    color: publicColors.deepGreen,
    fontWeight: '900',
  },
  gateValue: {
    ...publicTypography.metadata,
    color: publicColors.slate,
    fontWeight: '800',
  },
  attributionPanel: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space12,
    padding: publicSpacing.space20,
  },
  fieldRow: {
    borderTopColor: publicColors.line,
    borderTopWidth: 1,
    gap: publicSpacing.space4,
    paddingTop: publicSpacing.space8,
  },
  fieldLabel: {
    color: publicColors.deepGreen,
    fontWeight: '900',
  },
  fieldValue: {
    ...publicTypography.metadata,
    color: publicColors.slate,
  },
  boundaryCard: {
    backgroundColor: publicColors.cream,
    borderColor: publicColors.gold,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space12,
    padding: publicSpacing.space20,
  },
  exclusionList: {
    gap: publicSpacing.space4,
  },
  exclusionItem: {
    ...publicTypography.metadata,
    color: publicColors.slate,
  },
  nextPanel: {
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
});
