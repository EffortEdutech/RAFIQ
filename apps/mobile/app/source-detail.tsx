import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { PrivateWorkspaceShell } from '../src/components/PrivateWorkspaceShell';
import {
  getSourceDetail,
  type PrivateSourceDetailResponse,
} from '../src/services/privateContentApi';
import {
  companionColors,
  companionRadii,
  companionShadow,
  companionSpacing,
  companionTypography,
} from '../src/theme/mobileCompanionDesignSystem';

function readable(value: unknown, fallback = 'Pending review') {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value).replace(/_/g, ' ');
}

function statusTone(value: unknown) {
  const text = String(value ?? '').toLowerCase();
  if (text.includes('approved') || text.includes('active')) return 'Ready';
  if (text.includes('pending') || text.includes('unreviewed')) return 'Pending';
  if (text.includes('private')) return 'Private';
  return 'Review';
}

function studyItemTitle(entityType?: string, entityId?: string, fallback = 'Study item') {
  if (!entityType || !entityId) return fallback;
  if (entityType.includes('quran') && /^\d+:\d+$/.test(entityId)) return `Quran ${entityId}`;
  if (entityType.includes('hadith')) return 'Hadith narration';
  if (entityType.includes('tafsir') && /^\d+:\d+$/.test(entityId)) return `Tafsir ${entityId}`;
  return fallback;
}

function sourceDisplayName(sourceName: unknown, entityType?: string, fallback = 'Source') {
  const raw = readable(sourceName, '');
  if (raw && !raw.includes(':') && !raw.includes('_')) return raw;
  if (entityType?.includes('quran')) return 'Quran text source';
  if (entityType?.includes('hadith')) return 'Hadith collection source';
  if (entityType?.includes('tafsir')) return 'Tafsir source';
  return fallback;
}

export default function SourceDetailScreen() {
  const params = useLocalSearchParams<{ entityType?: string; entityId?: string }>();
  const [payload, setPayload] = useState<PrivateSourceDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const target = useMemo(() => {
    if (!params.entityType || !params.entityId) return null;
    return {
      entityType: String(params.entityType),
      entityId: String(params.entityId),
    };
  }, [params.entityId, params.entityType]);

  useEffect(() => {
    if (!target) return;
    setPayload(null);
    setError(null);
    void getSourceDetail(target)
      .then(setPayload)
      .catch((sourceError: unknown) => {
        setError(sourceError instanceof Error ? sourceError.message : 'Attribution could not open.');
      });
  }, [target]);

  const detail = payload?.sourceDetail;
  const firstProvenance = detail?.provenance[0] ?? null;
  const displayTitle = studyItemTitle(detail?.entityType, detail?.entityId, detail?.title);
  const sourceName = sourceDisplayName(firstProvenance?.source.name, detail?.entityType, detail?.subtitle ?? displayTitle ?? 'Source');
  const provider = readable(firstProvenance?.source.provider, 'Provider pending');
  const license = readable(firstProvenance?.snapshot.licenseName, 'License pending');
  const attribution = readable(firstProvenance?.snapshot.attributionText, 'Attribution pending');
  const releaseState = detail?.releaseState ?? {};

  return (
    <PrivateWorkspaceShell
      action={{ href: '/sources', label: 'Sources' }}
      eyebrow="Attribution"
      subtitle="Where this study item came from and whether it is ready to quote or share."
      title="Source attribution"
    >
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {target && !payload && !error ? (
        <View style={styles.loadingPanel}>
          <ActivityIndicator color={companionColors.gold} />
          <Text style={styles.loadingText}>Opening attribution...</Text>
        </View>
      ) : null}

      {detail ? (
        <>
          <View style={[styles.summaryPanel, companionShadow.soft]}>
            <Text style={styles.kicker}>Study item</Text>
            <Text style={styles.title}>{displayTitle}</Text>
            {detail.subtitle ? <Text style={styles.body}>{detail.subtitle}</Text> : null}
          </View>

          <View style={styles.panel}>
            <Text style={styles.kicker}>Source</Text>
            <Text style={styles.sourceName}>{sourceName}</Text>
            <Text style={styles.body}>Provider: {provider}</Text>
            <Text style={styles.body}>License: {license}</Text>
            <Text style={styles.body}>Attribution: {attribution}</Text>
          </View>

          <View style={styles.panel}>
            <Text style={styles.kicker}>Use With Care</Text>
            <View style={styles.statusGrid}>
              <View style={styles.statusPill}>
                <Text style={styles.statusLabel}>Rights</Text>
                <Text style={styles.statusValue}>{statusTone(releaseState.rightsStatus)}</Text>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusLabel}>Attribution</Text>
                <Text style={styles.statusValue}>{statusTone(releaseState.attributionStatus)}</Text>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusLabel}>Editorial</Text>
                <Text style={styles.statusValue}>{statusTone(releaseState.editorialStatus)}</Text>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusLabel}>Publication</Text>
                <Text style={styles.statusValue}>{statusTone(releaseState.publicationStatus)}</Text>
              </View>
            </View>
            <Text style={styles.note}>
              If any status is pending or private, use this item for personal study only. Do not publish or forward it as a public RAFIQ answer.
            </Text>
          </View>

          <View style={styles.panel}>
            <Text style={styles.kicker}>Next</Text>
          <View style={styles.linkRow}>
            <Link href="/sources" style={styles.primaryLink}>
              Back to sources
            </Link>
          </View>
        </View>
        </>
      ) : null}
    </PrivateWorkspaceShell>
  );
}

const styles = StyleSheet.create({
  loadingPanel: {
    alignItems: 'center',
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: companionRadii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  loadingText: {
    color: companionColors.mint,
    fontWeight: '700',
  },
  summaryPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  panel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  kicker: {
    ...companionTypography.label,
    color: companionColors.gold,
    textTransform: 'uppercase',
  },
  title: {
    color: companionColors.ink,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  sourceName: {
    color: companionColors.ink,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  body: {
    ...companionTypography.body,
    color: companionColors.ink,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: companionSpacing.xs,
  },
  statusPill: {
    backgroundColor: companionColors.paperWarm,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    gap: 2,
    minWidth: 132,
    padding: companionSpacing.sm,
  },
  statusLabel: {
    color: companionColors.muted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  statusValue: {
    color: companionColors.ink,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  note: {
    color: companionColors.inkSoft,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
  linkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: companionSpacing.sm,
  },
  primaryLink: {
    backgroundColor: companionColors.night,
    borderRadius: companionRadii.sm,
    color: companionColors.white,
    fontWeight: '800',
    minHeight: 38,
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.md,
    paddingVertical: companionSpacing.sm,
    textAlign: 'center',
  },
  secondaryLink: {
    backgroundColor: companionColors.paperWarm,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    color: companionColors.ink,
    fontWeight: '800',
    minHeight: 38,
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.md,
    paddingVertical: companionSpacing.sm,
    textAlign: 'center',
  },
  error: {
    color: companionColors.danger,
    fontWeight: '800',
  },
});
