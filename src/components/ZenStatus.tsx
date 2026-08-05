import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle, Zap } from 'lucide-react-native';
import { colors, spacing, typography } from '../theme';

interface ZenStatusProps {
  isAutoPilotEnabled: boolean;
  pendingCount: number;
}

export const ZenStatus: React.FC<ZenStatusProps> = ({ isAutoPilotEnabled, pendingCount }) => {
  const isZenMode = isAutoPilotEnabled && pendingCount === 0;

  return (
    <View style={[styles.container, isZenMode && styles.zenContainer]}>
      {isZenMode ? (
        <>
          <CheckCircle size={16} color={colors.systemGreen} strokeWidth={2.5} />
          <Text style={styles.zenText}>Zen Mode</Text>
        </>
      ) : (
        <>
          <Zap size={15} color={colors.charcoal} strokeWidth={2.5} />
          <Text style={styles.statusText}>Auto-Pilot {isAutoPilotEnabled ? 'Active' : 'Off'}</Text>
          {pendingCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingCount}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass,
    borderRadius: 16,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  zenContainer: {
    backgroundColor: colors.mintLight,
    borderWidth: 1,
    borderColor: colors.mint,
  },
  zenText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.mintDark,
    marginLeft: spacing.xs,
    letterSpacing: typography.letterSpacing.wider,
    fontFamily: typography.fontFamily.semibold,
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.graySubtle,
    marginLeft: spacing.xs,
    letterSpacing: typography.letterSpacing.normal,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs / 2,
    marginLeft: spacing.sm,
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.background,
    letterSpacing: typography.letterSpacing.normal,
  },
});
