/**
 * PriceAlertCard - Prisbevakaren UI
 * Glasmorfisk floating card för prisökningsvarningar
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import {
  TrendingUp,
  X,
  Check,
  Search,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react-native';
import { colors, shadows, spacing, typography } from '../theme';
import { PriceIncreaseAlert, PriceAlertAction } from '../engine/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PriceAlertCardProps {
  alert: PriceIncreaseAlert;
  visible: boolean;
  onAction: (action: PriceAlertAction) => void;
  onDismiss: () => void;
}

export const PriceAlertCard: React.FC<PriceAlertCardProps> = ({
  alert,
  visible,
  onAction,
  onDismiss,
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getSeverityColor = () => {
    switch (alert.severity) {
      case 'significant':
        return colors.coralDark;
      case 'moderate':
        return colors.coral;
      default:
        return colors.ocean;
    }
  };

  const getSeverityLabel = () => {
    switch (alert.severity) {
      case 'significant':
        return 'Betydande höjning';
      case 'moderate':
        return 'Märkbar höjning';
      default:
        return 'Mindre höjning';
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('sv-SE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onDismiss}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={onDismiss}
        />

        <Animated.View
          style={[
            styles.cardWrapper,
            {
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <BlurView intensity={80} tint="light" style={styles.blurContainer}>
            <View style={styles.card}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <View style={[styles.severityBadge, { backgroundColor: getSeverityColor() }]}>
                    <AlertTriangle size={12} color={colors.background} strokeWidth={2.5} />
                    <Text style={styles.severityText}>{getSeverityLabel()}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
                  <X size={20} color={colors.graySubtle} strokeWidth={2} />
                </TouchableOpacity>
              </View>

              {/* Vendor Info */}
              <View style={styles.vendorSection}>
                <View style={styles.vendorLogo}>
                  <Text style={styles.vendorLogoText}>{alert.vendor.charAt(0)}</Text>
                </View>
                <View style={styles.vendorInfo}>
                  <Text style={styles.vendorName}>{alert.vendor}</Text>
                  <Text style={styles.vendorCategory}>
                    {alert.category === 'subscription' ? 'Prenumeration' :
                     alert.category === 'utilities' ? 'Förbrukningskostnad' :
                     alert.category === 'insurance' ? 'Försäkring' : 'Övrig tjänst'}
                  </Text>
                </View>
              </View>

              {/* Price Comparison */}
              <View style={styles.priceSection}>
                <View style={styles.priceRow}>
                  <View style={styles.priceColumn}>
                    <Text style={styles.priceLabel}>Tidigare pris</Text>
                    <Text style={styles.previousPrice}>{formatPrice(alert.previousPrice)} kr</Text>
                  </View>

                  <View style={styles.arrowContainer}>
                    <ArrowUpRight size={24} color={getSeverityColor()} strokeWidth={2} />
                  </View>

                  <View style={styles.priceColumn}>
                    <Text style={styles.priceLabel}>Nytt pris</Text>
                    <Text style={styles.newPrice}>{formatPrice(alert.newPrice)} kr</Text>
                  </View>
                </View>

                {/* Increase Indicator */}
                <View style={[styles.increaseIndicator, { backgroundColor: `${getSeverityColor()}15` }]}>
                  <TrendingUp size={16} color={getSeverityColor()} strokeWidth={2} />
                  <Text style={[styles.increaseText, { color: getSeverityColor() }]}>
                    +{formatPrice(alert.priceChange)} kr ({alert.percentageChange}%)
                  </Text>
                </View>

                {/* Annual Impact */}
                <View style={styles.annualImpact}>
                  <Text style={styles.annualImpactLabel}>Årlig påverkan</Text>
                  <Text style={styles.annualImpactValue}>
                    +{formatPrice(alert.annualImpact)} kr/år
                  </Text>
                </View>
              </View>

              {/* Recommendation */}
              <View style={styles.recommendationSection}>
                <Text style={styles.recommendationText}>{alert.recommendation}</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsSection}>
                {/* Primary CTA - Find Alternative */}
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => onAction('find_alternative')}
                  activeOpacity={0.85}
                >
                  <Search size={18} color={colors.background} strokeWidth={2} />
                  <Text style={styles.primaryButtonText}>Hitta billigare alternativ</Text>
                </TouchableOpacity>

                {/* Secondary Actions */}
                <View style={styles.secondaryActions}>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => onAction('approve')}
                    activeOpacity={0.7}
                  >
                    <Check size={16} color={colors.charcoal} strokeWidth={2} />
                    <Text style={styles.secondaryButtonText}>Godkänn höjning</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelLink}
                    onPress={() => onAction('cancel')}
                    activeOpacity={0.7}
                  >
                    <XCircle size={14} color={colors.coralDark} strokeWidth={2} />
                    <Text style={styles.cancelLinkText}>Avsluta prenumeration</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </BlurView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  cardWrapper: {
    width: SCREEN_WIDTH - 32,
    maxWidth: 400,
  },
  blurContainer: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.glass,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: spacing.lg,
    ...shadows.glass,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    gap: 4,
  },
  severityText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.background,
    letterSpacing: typography.letterSpacing.wide,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vendorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  vendorLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.charcoal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vendorLogoText: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.background,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 2,
  },
  vendorCategory: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
  },
  priceSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  priceColumn: {
    flex: 1,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.graySubtle,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wider,
  },
  previousPrice: {
    fontSize: typography.fontSize.xl,
    fontWeight: '500',
    color: colors.grayMedium,
    textDecorationLine: 'line-through',
  },
  newPrice: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
  },
  arrowContainer: {
    width: 40,
    alignItems: 'center',
  },
  increaseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    gap: 6,
    marginBottom: spacing.sm,
  },
  increaseText: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
  },
  annualImpact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  annualImpactLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
  },
  annualImpactValue: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.coralDark,
  },
  recommendationSection: {
    marginBottom: spacing.lg,
  },
  recommendationText: {
    fontSize: typography.fontSize.sm,
    color: colors.charcoal,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
  },
  actionsSection: {
    gap: spacing.md,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 14,
    gap: spacing.sm,
    ...shadows.soft,
  },
  primaryButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.background,
    letterSpacing: typography.letterSpacing.normal,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    gap: 6,
  },
  secondaryButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.charcoal,
  },
  cancelLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: 4,
  },
  cancelLinkText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.coralDark,
  },
});

export default PriceAlertCard;
