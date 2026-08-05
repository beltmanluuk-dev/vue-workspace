import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Sparkles } from 'lucide-react-native';
import { Bill } from '../types';
import { colors, shadows, spacing, typography } from '../theme';
import { formatCurrency, formatDate, getDaysUntilDue } from '../utils/helpers';

interface HeroCardProps {
  nextBill: Bill | null;
  totalDue: number;
  onPress: () => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({ nextBill, totalDue, onPress }) => {
  const daysUntil = nextBill ? getDaysUntilDue(nextBill.dueDate) : 0;
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        activeOpacity={0.85} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.container}>
        <LinearGradient
          colors={[colors.glass, colors.mintLight, colors.oceanLight, colors.glass]}
          locations={[0, 0.3, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.meshOverlay} />
          <View style={styles.header}>
            <View style={styles.labelContainer}>
              <View style={styles.iconBadge}>
                <Sparkles size={14} color={colors.charcoal} strokeWidth={2.5} />
              </View>
              <Text style={styles.label}>Next Payment</Text>
            </View>
            <ArrowRight size={18} color={colors.silver} strokeWidth={2} />
          </View>

          {nextBill ? (
            <View style={styles.content}>
              <View style={styles.billInfo}>
                <View style={styles.logoContainer}>
                  <Image
                    source={{ uri: nextBill.logo }}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.details}>
                  <Text style={styles.vendor}>{nextBill.vendor}</Text>
                  <Text style={styles.dueDate}>{formatDate(nextBill.dueDate)}</Text>
                </View>
              </View>

              <View style={styles.amountContainer}>
                <Text style={styles.amount}>{formatCurrency(nextBill.amount)}</Text>
                <View style={styles.daysContainer}>
                  <Text style={styles.daysNumber}>{daysUntil}</Text>
                  <Text style={styles.daysLabel}>{daysUntil === 1 ? 'day' : 'days'}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.zenContainer}>
              <Text style={styles.zenEmoji}>✨</Text>
              <Text style={styles.zenTitle}>You're all caught up</Text>
              <Text style={styles.zenSubtitle}>No upcoming payments</Text>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.totalLabel}>Total this month</Text>
            <Text style={styles.totalAmount}>{formatCurrency(totalDue)}</Text>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: 28,
    padding: spacing.xl,
    position: 'relative',
    overflow: 'hidden',
    ...shadows.glass,
  },
  meshOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.graySubtle,
    letterSpacing: typography.letterSpacing.wider,
    fontFamily: typography.fontFamily.medium,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  billInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    ...shadows.soft,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  details: {
    justifyContent: 'center',
  },
  vendor: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: typography.letterSpacing.wide,
    fontFamily: typography.fontFamily.semibold,
  },
  dueDate: {
    fontSize: 14,
    color: colors.graySubtle,
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: typography.letterSpacing.tight,
    fontFamily: typography.fontFamily.bold,
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  daysNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.charcoal,
    marginRight: 3,
  },
  daysLabel: {
    fontSize: 12,
    color: colors.graySubtle,
  },
  zenContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: spacing.xl,
  },
  zenEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  zenTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
  },
  zenSubtitle: {
    fontSize: 14,
    color: colors.graySubtle,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.04)',
  },
  totalLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.grayMedium,
    letterSpacing: typography.letterSpacing.widest,
    textTransform: 'uppercase',
    fontFamily: typography.fontFamily.semibold,
  },
  totalAmount: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
  },
});
