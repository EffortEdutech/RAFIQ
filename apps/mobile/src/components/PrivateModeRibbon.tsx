import type { PrivateContentNotice } from '@rafiq/shared';
import { StyleSheet, Text, View } from 'react-native';
import { publicColors, publicRadii, publicSpacing, publicTypography } from '../theme/publicDesignSystem';

type Props = {
  notice?: PrivateContentNotice;
};

export function PrivateModeRibbon({ notice }: Props) {
  return (
    <View style={styles.ribbon}>
      <View style={styles.copy}>
        <Text style={styles.label}>Private Full-Content Mode</Text>
        <Text style={styles.message}>
          Development can use all imported content. Public release remains gated by approval.
        </Text>
      </View>
      <View style={styles.badges}>
        <Text style={styles.badge}>{notice?.rightsStatus ?? 'rights pending'}</Text>
        <Text style={styles.badge}>{notice?.scholarContentStatus ?? 'scholar review pending'}</Text>
        <Text style={styles.releaseBadge}>{notice?.publicationStatus ?? 'not public'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ribbon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 253, 247, 0.88)',
    borderColor: 'rgba(201, 154, 58, 0.35)',
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space16,
    justifyContent: 'space-between',
    padding: publicSpacing.space16,
  },
  copy: {
    flex: 1,
    gap: publicSpacing.space4,
    minWidth: 260,
  },
  label: {
    ...publicTypography.label,
    color: publicColors.deepGreen,
    textTransform: 'uppercase',
  },
  message: {
    color: publicColors.slate,
    fontSize: 15,
    lineHeight: 22,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space8,
  },
  badge: {
    backgroundColor: publicColors.mintSoft,
    borderRadius: publicRadii.pill,
    color: publicColors.deepGreen,
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: publicSpacing.space12,
    paddingVertical: publicSpacing.space8,
    textTransform: 'uppercase',
  },
  releaseBadge: {
    backgroundColor: publicColors.goldWash,
    borderRadius: publicRadii.pill,
    color: publicColors.warning,
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: publicSpacing.space12,
    paddingVertical: publicSpacing.space8,
    textTransform: 'uppercase',
  },
});
