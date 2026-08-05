import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { AlertTriangle, TrendingUp, Pause, CheckCircle, X } from 'lucide-react-native';
import { colors, spacing, typography, shadows } from '../theme';
import { formatCurrency } from '../utils/helpers';

export type AlertType = 'high_payment' | 'price_change' | 'low_balance' | 'unused_subscription';

interface SmartAlertModalProps {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  amount?: number;
  previousAmount?: number;
  vendor?: string;
  onApprove: () => void;
  onPause: () => void;
  onClose: () => void;
}

export const SmartAlertModal: React.FC<SmartAlertModalProps> = ({
  visible,
  type,
  title,
  message,
  amount,
  previousAmount,
  vendor,
  onApprove,
  onPause,
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const getAlertIcon = () => {
    switch (type) {
      case 'high_payment':
        return <TrendingUp size={28} color={colors.coral} strokeWidth={2} />;
      case 'price_change':
        return <AlertTriangle size={28} color={colors.coral} strokeWidth={2} />;
      case 'low_balance':
        return <AlertTriangle size={28} color={colors.coral} strokeWidth={2} />;
      case 'unused_subscription':
        return <Pause size={28} color={colors.ocean} strokeWidth={2} />;
      default:
        return <AlertTriangle size={28} color={colors.coral} strokeWidth={2} />;
    }
  };

  const getAlertColor = () => {
    switch (type) {
      case 'unused_subscription':
        return colors.oceanLight;
      default:
        return colors.roseLight;
    }
  };

  const percentageChange = previousAmount && amount 
    ? Math.round(((amount - previousAmount) / previousAmount) * 100)
    : null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <BlurView intensity={20} tint="dark" style={styles.blurOverlay}>
        <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
              <X size={20} color={colors.graySubtle} strokeWidth={2} />
            </TouchableOpacity>

            {/* Alert Icon */}
            <View style={[styles.iconContainer, { backgroundColor: getAlertColor() }]}>
              {getAlertIcon()}
            </View>

            {/* Title & Message */}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            {/* Amount Comparison */}
            {amount && (
              <View style={styles.amountSection}>
                <View style={styles.amountCard}>
                  <Text style={styles.amountLabel}>{vendor || 'Amount'}</Text>
                  <Text style={styles.amountValue}>{formatCurrency(amount)}</Text>
                  {percentageChange !== null && (
                    <View style={styles.changeContainer}>
                      <TrendingUp size={14} color={colors.coral} strokeWidth={2} />
                      <Text style={styles.changeText}>+{percentageChange}%</Text>
                    </View>
                  )}
                </View>
                {previousAmount && (
                  <View style={styles.previousAmount}>
                    <Text style={styles.previousLabel}>Previous: {formatCurrency(previousAmount)}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.pauseButton}
                onPress={onPause}
                activeOpacity={0.8}
              >
                <Pause size={18} color={colors.coral} strokeWidth={2} />
                <Text style={styles.pauseButtonText}>Pausa</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.approveButton}
                onPress={onApprove}
                activeOpacity={0.8}
              >
                <CheckCircle size={18} color={colors.background} strokeWidth={2} />
                <Text style={styles.approveButtonText}>Godkänn</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
              Vue skyddar dig från oväntade kostnader
            </Text>
          </Pressable>
        </Animated.View>
        </Pressable>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurOverlay: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  container: {
    backgroundColor: colors.background,
    borderRadius: 28,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  amountSection: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  amountCard: {
    backgroundColor: colors.glass,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  amountLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
    marginBottom: spacing.xs,
  },
  amountValue: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: typography.letterSpacing.tight,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.roseLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    marginTop: spacing.sm,
    gap: 4,
  },
  changeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.coral,
  },
  previousAmount: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  previousLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  pauseButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.roseLight,
    borderRadius: 14,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  pauseButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.coral,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mintDark,
    borderRadius: 14,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  approveButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.background,
  },
  footer: {
    fontSize: typography.fontSize.xs,
    color: colors.grayLight,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});

export default SmartAlertModal;
