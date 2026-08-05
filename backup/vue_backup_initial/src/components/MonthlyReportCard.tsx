import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { CheckCircle, Clock, TrendingDown, ChevronRight } from 'lucide-react-native';
import { colors, spacing, typography, shadows } from '../theme';
import { formatCurrency } from '../utils/helpers';

interface MonthlyReportCardProps {
  paymentsHandled: number;
  totalAmount: number;
  timeSavedMinutes: number;
  allGreen: boolean;
  onPress?: () => void;
}

export const MonthlyReportCard: React.FC<MonthlyReportCardProps> = ({
  paymentsHandled,
  totalAmount,
  timeSavedMinutes,
  allGreen,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (allGreen) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [allGreen]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      tension: 200,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 8,
    }).start();
  };

  const timeSavedHours = Math.floor(timeSavedMinutes / 60);
  const timeSavedDisplay = timeSavedHours > 0 
    ? `${timeSavedHours} timmar` 
    : `${timeSavedMinutes} minuter`;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerLabel}>MÅNADSRAPPORT</Text>
            <Text style={styles.headerMonth}>Februari 2026</Text>
          </View>
          {allGreen && (
            <Animated.View style={[styles.statusBadge, { opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }) }]}>
              <CheckCircle size={14} color={colors.mintDark} strokeWidth={2.5} />
              <Text style={styles.statusText}>Allt grönt</Text>
            </Animated.View>
          )}
        </View>

        {/* Main Message */}
        <Text style={styles.mainMessage}>
          Denna månad har vi skött{' '}
          <Text style={styles.highlight}>{paymentsHandled} betalningar</Text>
          {' '}åt dig.
        </Text>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.oceanLight }]}>
              <TrendingDown size={18} color={colors.ocean} strokeWidth={2} />
            </View>
            <Text style={styles.statValue}>{formatCurrency(totalAmount)}</Text>
            <Text style={styles.statLabel}>Totalt betalt</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.mintLight }]}>
              <Clock size={18} color={colors.mintDark} strokeWidth={2} />
            </View>
            <Text style={styles.statValue}>{timeSavedDisplay}</Text>
            <Text style={styles.statLabel}>Sparad tid</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Se detaljerad rapport</Text>
          <ChevronRight size={16} color={colors.graySubtle} strokeWidth={2} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.glass,
    borderRadius: 24,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.glass,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  headerLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.grayMedium,
    letterSpacing: typography.letterSpacing.widest,
    marginBottom: spacing.xs,
  },
  headerMonth: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.primary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mintLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.mintDark,
  },
  mainMessage: {
    fontSize: typography.fontSize.base,
    color: colors.graySubtle,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  highlight: {
    fontWeight: '700',
    color: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.graySubtle,
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: colors.glassBorder,
    marginHorizontal: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
    fontWeight: '500',
  },
});

export default MonthlyReportCard;
