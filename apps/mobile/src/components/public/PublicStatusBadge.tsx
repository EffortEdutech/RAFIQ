import { StyleSheet, Text, View } from 'react-native';
import { publicColors, publicRadii, publicSpacing, publicTypography } from '../../theme/publicDesignSystem';

type StatusKind = 'approvedPublic' | 'approvalPending' | 'privatePreview' | 'fixtureDemo' | 'blocked';

type Props = {
  kind: StatusKind;
  label: string;
};

const badgeStylesByKind: Record<StatusKind, { backgroundColor: string; borderColor: string; color: string }> = {
  approvedPublic: {
    backgroundColor: '#E3F3EA',
    borderColor: publicColors.success,
    color: publicColors.success,
  },
  approvalPending: {
    backgroundColor: publicColors.goldSoft,
    borderColor: publicColors.warning,
    color: publicColors.warning,
  },
  privatePreview: {
    backgroundColor: '#E7F0F6',
    borderColor: publicColors.info,
    color: publicColors.info,
  },
  fixtureDemo: {
    backgroundColor: publicColors.cream,
    borderColor: publicColors.muted,
    color: publicColors.slate,
  },
  blocked: {
    backgroundColor: '#F8E5DF',
    borderColor: publicColors.danger,
    color: publicColors.danger,
  },
};

export function PublicStatusBadge({ kind, label }: Props) {
  const style = badgeStylesByKind[kind];
  return (
    <View style={[styles.badge, { backgroundColor: style.backgroundColor, borderColor: style.borderColor }]}>
      <Text style={[styles.label, { color: style.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: publicRadii.pill,
    borderWidth: 1,
    minHeight: 34,
    paddingHorizontal: publicSpacing.space16,
    paddingVertical: publicSpacing.space8,
  },
  label: {
    ...publicTypography.label,
    textTransform: 'uppercase',
  },
});
