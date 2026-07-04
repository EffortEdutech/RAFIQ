import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { PrivateWorkspaceShell } from '../src/components/PrivateWorkspaceShell';
import {
  type GrowthMemoryItem,
  type GrowthMemoryState,
  getGrowthMemory,
  updateGrowthAction,
  updateGrowthReflection,
} from '../src/services/growthMemory';
import {
  companionColors,
  companionRadii,
  companionShadow,
  companionSpacing,
  companionTypography,
} from '../src/theme/mobileCompanionDesignSystem';

function emptyMemory(): GrowthMemoryState {
  return getGrowthMemory();
}

function formatEntry(item: GrowthMemoryItem) {
  if (item.entryPoint === 'today') return 'Today';
  if (item.entryPoint === 'ask') return 'Ask';
  if (item.entryPoint === 'learn_theme') return 'Learn';
  if (item.entryPoint === 'quran_ayah' || item.entryPoint === 'quran_reading') return 'Quran';
  return 'Growth';
}

export default function ProfileScreen() {
  const [memory, setMemory] = useState<GrowthMemoryState>(emptyMemory);

  const latest = memory.items[0] ?? null;
  const unfinished = memory.items.find((item) => !item.actionCompleted) ?? latest;
  const reflectedItems = memory.items.filter((item) => item.reflectionText.trim().length > 0);
  const completedCount = memory.items.filter((item) => item.actionCompleted).length;

  useFocusEffect(
    useCallback(() => {
      setMemory(getGrowthMemory());
    }, []),
  );

  const memoryLine = useMemo(() => {
    if (!memory.items.length) return 'Start one guidance session, then return here.';
    return `${memory.items.length} saved, ${completedCount} completed, ${reflectedItems.length} reflected`;
  }, [completedCount, memory.items.length, reflectedItems.length]);

  function refreshMemory() {
    setMemory(getGrowthMemory());
  }

  function updateReflection(item: GrowthMemoryItem, text: string) {
    updateGrowthReflection(item.sessionId, text);
    refreshMemory();
  }

  function toggleAction(item: GrowthMemoryItem) {
    updateGrowthAction(item.sessionId, !item.actionCompleted);
    refreshMemory();
  }

  return (
    <PrivateWorkspaceShell
      action={{ href: '/', label: 'Today' }}
      eyebrow="Growth"
      subtitle="Saved guidance, reflection, and unfinished action."
      title="Growth memory"
    >
      <View style={[styles.resumePanel, companionShadow.soft]}>
        <Text style={styles.panelKicker}>Resume</Text>
        {unfinished ? (
          <>
            <Text style={styles.resumeTitle}>{unfinished.title}</Text>
            <Text style={styles.resumeBody}>
              {unfinished.quranReference ? `${unfinished.quranReference}. ` : ''}
              {unfinished.simpleMeaning ?? unfinished.theme}
            </Text>
            <View style={styles.resumeMetaRow}>
              <Text style={styles.metaChip}>{formatEntry(unfinished)}</Text>
              <Text style={styles.metaChip}>{unfinished.actionCompleted ? 'Action completed' : 'Action waiting'}</Text>
            </View>
            <Link href={unfinished.route as never} style={styles.primaryLink}>
              Continue
            </Link>
          </>
        ) : (
          <>
            <Text style={styles.resumeTitle}>No saved guidance yet.</Text>
            <Text style={styles.resumeBody}>Open Today, Ask, Learn, or Quran reading. RAFIQ will remember the path here.</Text>
            <Link href="/" style={styles.primaryLink}>
              Begin today
            </Link>
          </>
        )}
      </View>

      <View style={styles.memoryStrip}>
        <Text style={styles.memoryText}>{memoryLine}</Text>
      </View>

      {latest ? (
        <View style={styles.reflectionPanel}>
          <Text style={styles.panelKicker}>Reflection</Text>
          <Text style={styles.sectionTitle}>A note for your next return</Text>
          <Text style={styles.prompt}>{latest.reflectionPrompt}</Text>
          <TextInput
            accessibilityLabel="Growth reflection"
            multiline
            onChangeText={(text) => updateReflection(latest, text)}
            placeholder="Write one honest sentence..."
            placeholderTextColor={companionColors.muted}
            style={styles.reflectionInput}
            value={latest.reflectionText}
          />
        </View>
      ) : null}

      <View style={styles.savedStack}>
        <Text style={styles.panelKicker}>Saved Guidance</Text>
        {memory.items.length ? (
          memory.items.slice(0, 5).map((item) => (
            <View key={item.sessionId} style={styles.savedItem}>
              <View style={styles.savedCopy}>
                <Text style={styles.itemMeta}>{formatEntry(item)}{item.quranReference ? ` - ${item.quranReference}` : ''}</Text>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemBody}>{item.actionLabel}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: item.actionCompleted }}
                onPress={() => toggleAction(item)}
                style={[styles.actionButton, item.actionCompleted ? styles.actionButtonDone : null]}
              >
                <Text style={[styles.actionButtonText, item.actionCompleted ? styles.actionButtonTextDone : null]}>
                  {item.actionCompleted ? 'Done' : 'Mark done'}
                </Text>
              </Pressable>
            </View>
          ))
        ) : (
          <View style={styles.emptyPanel}>
            <Text style={styles.itemTitle}>Growth starts from one session.</Text>
            <Text style={styles.itemBody}>When you reflect or mark an action, it will appear here.</Text>
          </View>
        )}
      </View>

    </PrivateWorkspaceShell>
  );
}

const styles = StyleSheet.create({
  resumePanel: {
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
  resumeTitle: {
    color: companionColors.ink,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  resumeBody: {
    ...companionTypography.body,
    color: companionColors.ink,
  },
  resumeMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: companionSpacing.xs,
  },
  metaChip: {
    backgroundColor: companionColors.paperWarm,
    borderRadius: companionRadii.sm,
    color: companionColors.ink,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.sm,
    paddingVertical: companionSpacing.xs,
  },
  primaryLink: {
    alignSelf: 'flex-start',
    backgroundColor: companionColors.night,
    borderRadius: companionRadii.sm,
    color: companionColors.white,
    fontWeight: '800',
    minHeight: 38,
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.lg,
    paddingVertical: companionSpacing.sm,
    textAlign: 'center',
  },
  memoryStrip: {
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: companionRadii.md,
    borderWidth: 1,
    padding: companionSpacing.md,
  },
  memoryText: {
    color: companionColors.mint,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  reflectionPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  sectionTitle: {
    color: companionColors.ink,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21,
  },
  prompt: {
    color: companionColors.inkSoft,
    fontWeight: '700',
    lineHeight: 22,
  },
  reflectionInput: {
    backgroundColor: companionColors.pearl,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    color: companionColors.ink,
    fontSize: 14,
    minHeight: 86,
    padding: companionSpacing.md,
    textAlignVertical: 'top',
  },
  savedStack: {
    gap: companionSpacing.sm,
  },
  savedItem: {
    alignItems: 'center',
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  savedCopy: {
    flex: 1,
    gap: companionSpacing.xs,
    minWidth: 0,
  },
  itemMeta: {
    color: companionColors.gold,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  itemTitle: {
    color: companionColors.ink,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21,
  },
  itemBody: {
    color: companionColors.inkSoft,
    lineHeight: 22,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: companionColors.goldSoft,
    borderRadius: companionRadii.sm,
    justifyContent: 'center',
    minHeight: 38,
    minWidth: 104,
    paddingHorizontal: companionSpacing.md,
  },
  actionButtonDone: {
    backgroundColor: companionColors.night,
  },
  actionButtonText: {
    color: companionColors.ink,
    fontWeight: '800',
    textAlign: 'center',
  },
  actionButtonTextDone: {
    color: companionColors.white,
  },
  emptyPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    gap: companionSpacing.xs,
    padding: companionSpacing.md,
  },
});
