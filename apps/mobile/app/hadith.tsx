import type { GuidanceSession, HadithCollectionSummary, HadithRecordsResponse } from '@rafiq/shared';
import { Link, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { GuidanceDeepLinks } from '../src/components/GuidanceDeepLinks';
import { PrivateWorkspaceShell } from '../src/components/PrivateWorkspaceShell';
import { createGuidanceSession, listHadithCollections, listHadithRecords } from '../src/services/privateContentApi';
import {
  companionColors,
  companionRadii,
  companionShadow,
  companionSpacing,
  companionTypography,
} from '../src/theme/mobileCompanionDesignSystem';

const DEFAULT_COLLECTION = 'fawaz-linebyline:bukhari';
const PAGE_SIZE = 12;
const PRACTICE_STARTERS = [
  { query: 'I want to improve my prayer', title: 'Prayer' },
  { query: 'I want sincerity in my actions', title: 'Intention' },
  { query: 'I need patience with people', title: 'Patience' },
  { query: 'I want to respond with mercy', title: 'Mercy' },
];

function collectionTitle(collection?: Pick<HadithCollectionSummary, 'collectionKey' | 'nameEnglish'> | null) {
  const label = collection?.nameEnglish ?? collection?.collectionKey ?? 'Hadith collection';
  return label
    .replaceAll('-', ' ')
    .replaceAll('_', ' ')
    .replace(/\s+\/\s+/g, ' / ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function referenceLabel(record: HadithRecordsResponse['records'][number]) {
  return record.printedReference ?? record.sourceHadithNumber ?? record.sourceHadithKey;
}

function selectedCollectionTitle(collection: HadithCollectionSummary | null, collectionKey: string) {
  if (collection) return collectionTitle(collection);
  if (collectionKey === DEFAULT_COLLECTION) return 'Sahih al-Bukhari';
  return collectionTitle({ collectionKey });
}

export default function HadithScreen() {
  const router = useRouter();
  const [collections, setCollections] = useState<HadithCollectionSummary[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [records, setRecords] = useState<HadithRecordsResponse | null>(null);
  const [selectedCollectionKey, setSelectedCollectionKey] = useState(DEFAULT_COLLECTION);
  const [collectionSearch, setCollectionSearch] = useState('');
  const [showCollectionPicker, setShowCollectionPicker] = useState(false);
  const [showSourceBrowse, setShowSourceBrowse] = useState(false);
  const [offset, setOffset] = useState(0);
  const [practiceNeed, setPracticeNeed] = useState(PRACTICE_STARTERS[0].query);
  const [submittedPracticeNeed, setSubmittedPracticeNeed] = useState(PRACTICE_STARTERS[0].query);
  const [practiceSession, setPracticeSession] = useState<GuidanceSession | null>(null);
  const [sunnahSession, setSunnahSession] = useState<GuidanceSession | null>(null);
  const [practiceLoading, setPracticeLoading] = useState(true);
  const [practiceError, setPracticeError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setCollectionsLoading(true);
    listHadithCollections()
      .then((payload) => {
        if (!mounted) return;
        setCollections(payload.collections);
        if (!payload.collections.some((collection) => collection.collectionKey === DEFAULT_COLLECTION)) {
          setSelectedCollectionKey(payload.collections[0]?.collectionKey ?? DEFAULT_COLLECTION);
        }
      })
      .finally(() => {
        if (mounted) setCollectionsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    setRecords(null);
    listHadithRecords({
      collection: selectedCollectionKey,
      limit: PAGE_SIZE,
      offset,
    }).then((payload) => {
      if (mounted) setRecords(payload);
    });
    return () => {
      mounted = false;
    };
  }, [offset, selectedCollectionKey]);

  useEffect(() => {
    let mounted = true;
    setPracticeLoading(true);
    setPracticeError(null);
    setPracticeSession(null);
    setSunnahSession(null);

    Promise.all([
      createGuidanceSession({
        entryPoint: 'learn_theme',
        input: submittedPracticeNeed,
        language: 'en',
        domain: 'all',
      }),
      createGuidanceSession({
        entryPoint: 'learn_theme',
        input: submittedPracticeNeed,
        language: 'en',
        domain: 'hadith',
      }),
    ])
      .then(([pathPayload, sunnahPayload]) => {
        if (!mounted) return;
        setPracticeSession(pathPayload.session);
        setSunnahSession(sunnahPayload.session);
      })
      .catch(() => {
        if (mounted) setPracticeError('This Sunnah path could not open. Try another practice need.');
      })
      .finally(() => {
        if (mounted) setPracticeLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [submittedPracticeNeed]);

  const selectedCollection = useMemo(
    () => collections.find((collection) => collection.collectionKey === selectedCollectionKey) ?? null,
    [collections, selectedCollectionKey],
  );

  const filteredCollections = useMemo(() => {
    const query = collectionSearch.trim().toLowerCase();
    const available = collections.filter((collection) => collection.recordCount > 1);
    const filtered = query
      ? available.filter((collection) =>
          `${collection.collectionKey} ${collection.nameEnglish ?? ''}`.toLowerCase().includes(query),
        )
      : available;
    return filtered
      .sort((left, right) => right.recordCount - left.recordCount)
      .slice(0, 8);
  }, [collectionSearch, collections]);

  const canGoPrevious = offset > 0;
  const canGoNext = records ? offset + records.pagination.limit < records.pagination.total : false;
  const rangeStart = records && records.pagination.total > 0 ? offset + 1 : 0;
  const rangeEnd = records ? Math.min(offset + records.pagination.limit, records.pagination.total) : 0;
  const selectedTitle = selectedCollectionTitle(selectedCollection, selectedCollectionKey);
  const primarySunnah = sunnahSession?.sunnahSupport[0] ?? practiceSession?.sunnahSupport[0] ?? null;

  function selectCollection(collectionKey: string) {
    setSelectedCollectionKey(collectionKey);
    setShowCollectionPicker(false);
    setCollectionSearch('');
    setOffset(0);
  }

  function submitPractice(nextNeed = practiceNeed) {
    const clean = nextNeed.trim() || PRACTICE_STARTERS[0].query;
    setPracticeNeed(clean);
    setSubmittedPracticeNeed(clean);
  }

  return (
    <PrivateWorkspaceShell
      action={{ href: '/search', label: 'Learn' }}
      eyebrow="Hadith"
      title="Sunnah practice"
      subtitle="Start with what you want to practice."
    >
      <View style={[styles.practicePanel, companionShadow.soft]}>
        <Text style={styles.panelKicker}>What Sunnah do you want to practice?</Text>
        <TextInput
          accessibilityLabel="Sunnah practice need"
          onChangeText={setPracticeNeed}
          onSubmitEditing={() => submitPractice()}
          placeholder="Example: I want sincerity in my actions"
          placeholderTextColor={companionColors.muted}
          style={styles.searchInput}
          value={practiceNeed}
        />
        <Pressable accessibilityRole="button" onPress={() => submitPractice()} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Open Sunnah path</Text>
        </Pressable>
      </View>

      <View style={styles.starterRow}>
        {PRACTICE_STARTERS.map((starter) => {
          const active = submittedPracticeNeed === starter.query;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={starter.query}
              onPress={() => submitPractice(starter.query)}
              style={[styles.starterChip, active ? styles.starterChipActive : null]}
            >
              <Text style={[styles.starterText, active ? styles.starterTextActive : null]}>{starter.title}</Text>
            </Pressable>
          );
        })}
      </View>

      {practiceLoading ? (
        <View style={styles.loadingPanel}>
          <ActivityIndicator color={companionColors.gold} />
          <Text style={styles.loadingText}>Opening Sunnah path...</Text>
        </View>
      ) : null}

      {!practiceLoading && practiceError ? (
        <View style={styles.cautionPanel}>
          <Text style={styles.panelKicker}>Path unavailable</Text>
          <Text style={styles.cautionText}>{practiceError}</Text>
        </View>
      ) : null}

      {!practiceLoading && practiceSession ? (
        <View style={styles.guidedPanel}>
          <Text style={styles.panelKicker}>Guided Sunnah Path</Text>
          <Text style={styles.guidedTitle}>{practiceSession.need.detectedTheme}</Text>
          {practiceSession.quranAnchor ? (
            <>
              <Text style={styles.pathLabel}>Quran lens</Text>
              <Text style={styles.guidedText}>
                {practiceSession.quranAnchor.verseKey}: {practiceSession.quranAnchor.simpleMeaning}
              </Text>
              <GuidanceDeepLinks
                links={practiceSession.quranAnchor.deepLinks}
                suggestions={practiceSession.quranAnchor.researchSuggestions}
                title="Open Quran study"
              />
            </>
          ) : null}
          {primarySunnah ? (
            <>
              <Text style={styles.pathLabel}>Sunnah support</Text>
              <Text style={styles.supportText}>{primarySunnah.practiceConnection}</Text>
              <Text style={styles.careText}>{primarySunnah.verificationSummary}</Text>
              <GuidanceDeepLinks
                links={primarySunnah.deepLinks}
                suggestions={primarySunnah.researchSuggestions}
                title="Open narration study"
              />
            </>
          ) : null}
          <Text style={styles.pathLabel}>One action</Text>
          <Text style={styles.guidedText}>{practiceSession.guidance.action.label}</Text>
          <View style={styles.guidedActions}>
            <Link href="/search" style={styles.inlineLink}>
              Full path
            </Link>
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowSourceBrowse((value) => !value)}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>{showSourceBrowse ? 'Hide sources' : 'Browse sources'}</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {showSourceBrowse ? (
        <View style={styles.selectorPanel}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: showCollectionPicker }}
          onPress={() => setShowCollectionPicker((value) => !value)}
          style={styles.collectionSelector}
        >
          <View style={styles.collectionMark}>
            <Text style={styles.collectionMarkText}>H</Text>
          </View>
          <View style={styles.selectorCopy}>
            <Text style={styles.panelKicker}>Collection</Text>
            <Text style={styles.selectorTitle}>{selectedTitle}</Text>
          </View>
          <Text style={styles.selectorChevron}>{showCollectionPicker ? 'Close' : 'Change'}</Text>
        </Pressable>

        {collectionsLoading ? (
          <View style={styles.loadingPanel}>
            <ActivityIndicator color={companionColors.gold} />
            <Text style={styles.loadingText}>Opening collections...</Text>
          </View>
        ) : null}
        {showCollectionPicker ? (
          <View style={styles.collectionMenu}>
            <TextInput
              accessibilityLabel="Search Hadith collections"
              onChangeText={setCollectionSearch}
              placeholder="Search Bukhari, Muslim, Riyad..."
              placeholderTextColor={companionColors.muted}
              style={styles.searchInput}
              value={collectionSearch}
            />
            {filteredCollections.map((collection) => {
              const active = collection.collectionKey === selectedCollectionKey;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  key={collection.collectionKey}
                  onPress={() => selectCollection(collection.collectionKey)}
                  style={[styles.collectionOption, active ? styles.collectionOptionActive : null]}
                >
                  <Text style={[styles.collectionOptionText, active ? styles.collectionOptionTextActive : null]}>
                    {collectionTitle(collection)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>
      ) : null}

      {showSourceBrowse && !records ? (
        <View style={styles.loadingPanel}>
          <ActivityIndicator color={companionColors.gold} />
          <Text style={styles.loadingText}>Opening narrations...</Text>
        </View>
      ) : null}

      {showSourceBrowse && records ? (
        <View style={styles.recordPanel}>
          <View style={styles.recordPanelHeader}>
            <View style={styles.headerCopy}>
              <Text style={styles.panelKicker}>Narration Index</Text>
              <Text style={styles.rangeText}>
                {rangeStart}-{rangeEnd}
              </Text>
            </View>
            <View style={styles.pagerRow}>
              <Pressable
                accessibilityRole="button"
                disabled={!canGoPrevious}
                onPress={() => setOffset((value) => Math.max(0, value - PAGE_SIZE))}
                style={[styles.pagerButton, !canGoPrevious ? styles.pagerButtonDisabled : null]}
              >
                <Text style={styles.pagerText}>Prev</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={!canGoNext}
                onPress={() => setOffset((value) => value + PAGE_SIZE)}
                style={[styles.pagerButton, !canGoNext ? styles.pagerButtonDisabled : null]}
              >
                <Text style={styles.pagerText}>Next</Text>
              </Pressable>
            </View>
          </View>

          {records.records.map((record) => (
            <Pressable
              accessibilityRole="button"
              key={record.hadithRecordId}
              onPress={() =>
                router.push({
                  pathname: '/hadith/[hadithRecordId]',
                  params: { hadithRecordId: record.hadithRecordId },
                } as never)
              }
              style={styles.recordRow}
            >
              <View style={styles.recordNumberBox}>
                <Text style={styles.recordNumber}>{referenceLabel(record)}</Text>
              </View>
              <View style={styles.recordCopy}>
                {record.previewText ? (
                  <Text
                    numberOfLines={3}
                    style={record.previewLanguageCode === 'ar' ? styles.recordBodyArabic : styles.recordBody}
                  >
                    {record.previewText}
                  </Text>
                ) : (
                  <Text style={styles.openText}>Open narration</Text>
                )}
              </View>
            </Pressable>
          ))}
        </View>
      ) : null}

      {showSourceBrowse ? (
        <View style={styles.cautionPanel}>
        <Text style={styles.panelKicker}>Before Practice</Text>
        <Text style={styles.cautionText}>
          Read the narration with its reference and reliability notes. Do not forward a narration as a ruling without qualified review.
        </Text>
        <Link href="/search" style={styles.inlineLink}>
          Connect to guidance
        </Link>
      </View>
      ) : null}
    </PrivateWorkspaceShell>
  );
}

const styles = StyleSheet.create({
  practicePanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  panelKicker: {
    ...companionTypography.label,
    color: companionColors.gold,
    textTransform: 'uppercase',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: companionColors.night,
    borderRadius: companionRadii.sm,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: companionSpacing.md,
  },
  primaryButtonText: {
    color: companionColors.white,
    fontWeight: '900',
    textAlign: 'center',
  },
  starterRow: {
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: companionRadii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: companionSpacing.xxs,
    padding: companionSpacing.xxs,
  },
  starterChip: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: companionRadii.sm,
    flex: 1,
    justifyContent: 'center',
    minHeight: 34,
    paddingHorizontal: companionSpacing.xs,
    paddingVertical: companionSpacing.xs,
  },
  starterChipActive: {
    backgroundColor: companionColors.paper,
  },
  starterText: {
    color: companionColors.mint,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  starterTextActive: {
    color: companionColors.ink,
  },
  guidedPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  guidedTitle: {
    color: companionColors.ink,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    textTransform: 'capitalize',
  },
  pathLabel: {
    color: companionColors.gold,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  guidedText: {
    color: companionColors.ink,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  },
  supportText: {
    color: companionColors.ink,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22,
  },
  careText: {
    color: companionColors.inkSoft,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  guidedActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: companionSpacing.sm,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: companionColors.paperWarm,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: companionSpacing.md,
    paddingVertical: companionSpacing.sm,
  },
  secondaryButtonText: {
    color: companionColors.ink,
    fontWeight: '900',
  },
  selectorPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.sm,
  },
  collectionSelector: {
    alignItems: 'center',
    borderColor: companionColors.gold,
    borderRadius: companionRadii.md,
    borderStyle: 'dotted',
    borderWidth: 1,
    flexDirection: 'row',
    gap: companionSpacing.sm,
    minHeight: 58,
    padding: companionSpacing.sm,
  },
  collectionMark: {
    alignItems: 'center',
    backgroundColor: companionColors.night,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  collectionMarkText: {
    color: companionColors.goldSoft,
    fontSize: 15,
    fontWeight: '900',
  },
  selectorCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  selectorTitle: {
    color: companionColors.ink,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 19,
  },
  selectorChevron: {
    color: companionColors.inkSoft,
    fontSize: 12,
    fontWeight: '900',
  },
  collectionMenu: {
    gap: companionSpacing.xs,
  },
  searchInput: {
    backgroundColor: companionColors.pearl,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    color: companionColors.ink,
    fontSize: 14,
    minHeight: 40,
    paddingHorizontal: companionSpacing.md,
    paddingVertical: companionSpacing.sm,
  },
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
  collectionOption: {
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    minHeight: 42,
    justifyContent: 'center',
    paddingHorizontal: companionSpacing.sm,
    paddingVertical: companionSpacing.xs,
  },
  collectionOptionActive: {
    backgroundColor: companionColors.night,
    borderColor: companionColors.gold,
  },
  collectionOptionText: {
    color: companionColors.ink,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  collectionOptionTextActive: {
    color: companionColors.white,
  },
  recordPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  recordPanelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: companionSpacing.sm,
    justifyContent: 'space-between',
  },
  headerCopy: {
    flex: 1,
    gap: companionSpacing.xxs,
    minWidth: 140,
  },
  rangeText: {
    color: companionColors.ink,
    fontSize: 13,
    fontWeight: '800',
  },
  pagerRow: {
    flexDirection: 'row',
    gap: companionSpacing.xs,
  },
  pagerButton: {
    alignItems: 'center',
    backgroundColor: companionColors.night,
    borderRadius: companionRadii.sm,
    justifyContent: 'center',
    minHeight: 36,
    minWidth: 58,
    paddingHorizontal: companionSpacing.sm,
  },
  pagerButtonDisabled: {
    opacity: 0.4,
  },
  pagerText: {
    color: companionColors.white,
    fontSize: 12,
    fontWeight: '900',
  },
  recordRow: {
    borderColor: companionColors.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: companionSpacing.sm,
    paddingTop: companionSpacing.sm,
  },
  recordNumberBox: {
    alignItems: 'center',
    backgroundColor: companionColors.pearl,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: companionSpacing.xs,
    width: 52,
  },
  recordNumber: {
    color: companionColors.gold,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
  recordCopy: {
    flex: 1,
    gap: companionSpacing.xxs,
    minWidth: 0,
  },
  recordBody: {
    color: companionColors.inkSoft,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  recordBodyArabic: {
    color: companionColors.ink,
    fontSize: 16,
    lineHeight: 27,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  openText: {
    color: companionColors.gold,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 18,
  },
  cautionPanel: {
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  cautionText: {
    ...companionTypography.body,
    color: companionColors.mint,
  },
  inlineLink: {
    alignSelf: 'flex-start',
    backgroundColor: companionColors.paper,
    borderRadius: companionRadii.sm,
    color: companionColors.ink,
    fontWeight: '900',
    minHeight: 38,
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.md,
    paddingVertical: companionSpacing.sm,
    textAlign: 'center',
  },
});
