import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ChevronRight, Zap, TrendingDown } from 'lucide-react-native';
import { Bill } from '../types';
import { colors, shadows, spacing, typography } from '../theme';
import { formatCurrency, formatDate } from '../utils/helpers';

interface BillCardProps {
  bill: Bill;
  onPress: () => void;
  onQuickPay?: () => void;
  onHighBillPress?: () => void;
}

const HIGH_BILL_THRESHOLD = 500;

export const BillCard: React.FC<BillCardProps> = ({ bill, onPress, onQuickPay, onHighBillPress }) => {
  const isHighBill = bill.amount > HIGH_BILL_THRESHOLD;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    if (isHighBill) {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.08,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.4,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.2,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    }
  }, [isHighBill]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 150,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 150,
      friction: 10,
    }).start();
  };

  const handleQuickPayPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.timing(scaleAnim, {
      toValue: 0.96,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleQuickPayPressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const getStatusColor = () => {
    switch (bill.status) {
      case 'paid':
        return colors.systemGreen;
      case 'overdue':
        return colors.systemRed;
      case 'scheduled':
        return colors.systemBlue;
      case 'paused':
        return colors.coral;
      case 'pending_approval':
        return '#FF9500';
      default:
        return colors.graySubtle;
    }
  };

  const isPaused = bill.status === 'paused';
  const isPendingApproval = bill.status === 'pending_approval';

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.card}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={styles.leftSection}>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: bill.logo }}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.info}>
              <Text style={styles.vendor}>{bill.vendor}</Text>
              <Text style={styles.description}>{bill.description}</Text>
              <View style={styles.dueDateRow}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
                <Text style={styles.dueDate}>{formatDate(bill.dueDate)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.rightSection}>
            <Text style={styles.amount}>{formatCurrency(bill.amount)}</Text>
            {bill.isAutoPay && (
              <View style={styles.autoPayBadge}>
                <Zap size={10} color={colors.charcoal} strokeWidth={2.5} />
                <Text style={styles.autoPayText}>Auto</Text>
              </View>
            )}
            {isHighBill && onHighBillPress && (
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity style={styles.saveBadge} onPress={onHighBillPress}>
                  <TrendingDown size={12} color="#30D158" strokeWidth={2.5} />
                  <Text style={styles.saveText}>Spara</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
            {!isHighBill && <ChevronRight size={18} color={colors.grayLight} strokeWidth={1.5} />}
          </View>
        </TouchableOpacity>

        {((!bill.isAutoPay && bill.status === 'pending') || isPaused || isPendingApproval) && onQuickPay && (
          <TouchableOpacity
            style={[styles.quickPayButton, (isPaused || isPendingApproval) && styles.approveButton]}
            onPress={onQuickPay}
            onPressIn={handleQuickPayPressIn}
            onPressOut={handleQuickPayPressOut}
            activeOpacity={0.7}
          >
            <Text style={[styles.quickPayText, (isPaused || isPendingApproval) && styles.approveText]}>
              {isPaused ? 'Godkänn' : isPendingApproval ? 'Verifiera' : 'Betala'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.glass,
    borderRadius: 24,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.glass,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  info: {
    flex: 1,
  },
  vendor: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: typography.letterSpacing.wide,
    fontFamily: typography.fontFamily.medium,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
    marginTop: spacing.xs / 2,
    letterSpacing: typography.letterSpacing.normal,
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  dueDate: {
    fontSize: 12,
    color: colors.graySubtle,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: typography.letterSpacing.wide,
    marginBottom: spacing.sm,
    fontFamily: typography.fontFamily.semibold,
  },
  autoPayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  autoPayText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.charcoal,
    marginLeft: 3,
    letterSpacing: 0.3,
  },
  saveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mintLight,
    borderWidth: 1,
    borderColor: colors.mint,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  saveText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.mintDark,
    marginLeft: spacing.xs,
    letterSpacing: typography.letterSpacing.wider,
  },
  quickPayButton: {
    backgroundColor: colors.charcoal,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  quickPayText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  approveButton: {
    backgroundColor: colors.primary,
  },
  approveText: {
    color: colors.background,
  },
});
