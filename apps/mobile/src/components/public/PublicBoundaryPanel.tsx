import { StyleSheet, Text, View } from 'react-native';
import { publicColors, publicRadii, publicShadows, publicSpacing, publicTypography } from '../../theme/publicDesignSystem';
import { PublicStatusBadge } from './PublicStatusBadge';

type Props = {
  title: string;
  body: string;
};

export function PublicBoundaryPanel({ title, body }: Props) {
  return (
    <View style={[styles.boundaryPanel, publicShadows.card]}>
      <View style={styles.boundaryHeader}>
        <PublicStatusBadge kind="approvalPending" label="Approval pending" />
        <Text style={styles.boundaryLabel}>Controlled release</Text>
      </View>
      <View style={styles.copy}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardBody}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boundaryPanel: {
    backgroundColor: publicColors.goldWash,
    borderColor: publicColors.lineStrong,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space24,
  },
  boundaryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space12,
    justifyContent: 'space-between',
  },
  boundaryLabel: {
    ...publicTypography.label,
    color: publicColors.warning,
    textTransform: 'uppercase',
  },
  copy: {
    gap: publicSpacing.space8,
  },
  cardTitle: {
    ...publicTypography.sectionTitle,
    color: publicColors.ink,
  },
  cardBody: {
    ...publicTypography.body,
    color: publicColors.slate,
  },
});
