import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import { X, CreditCard, CheckCircle } from 'lucide-react-native';
import { Bill } from '../types';
import { colors, shadows, spacing, typography } from '../theme';
import { formatCurrency } from '../utils/helpers';

interface PaymentModalProps {
  visible: boolean;
  bill: Bill | null;
  onClose: () => void;
  onPay: (billId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  bill,
  onClose,
  onPay,
}) => {
  const handlePay = () => {
    if (bill) {
      onPay(bill.id);
      onClose();
    }
  };

  if (!bill) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color={colors.graySubtle} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: bill.logo }}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.vendor}>{bill.vendor}</Text>
            <Text style={styles.description}>{bill.description}</Text>
          </View>

          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amount}>{formatCurrency(bill.amount)}</Text>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.applePayButton} onPress={handlePay}>
            <Text style={styles.applePayText}> Pay</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cardButton} onPress={handlePay}>
            <CreditCard size={20} color={colors.primary} strokeWidth={2} />
            <Text style={styles.cardButtonText}>Pay with Card</Text>
          </TouchableOpacity>

          <View style={styles.securityNote}>
            <CheckCircle size={14} color={colors.systemGreen} strokeWidth={2} />
            <Text style={styles.securityText}>Secured with end-to-end encryption</Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    maxHeight: '80%',
  },
  handle: {
    width: 36,
    height: 5,
    backgroundColor: colors.grayLight,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...shadows.soft,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: typography.letterSpacing.wide,
    fontFamily: typography.fontFamily.semibold,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
    marginTop: spacing.sm,
  },
  vendor: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: typography.letterSpacing.normal,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 13,
    color: colors.graySubtle,
    marginBottom: 4,
  },
  amount: {
    fontSize: typography.fontSize.huge,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: typography.letterSpacing.tight,
    fontFamily: typography.fontFamily.bold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 24,
  },
  billCard: {
    backgroundColor: colors.glass,
    borderRadius: 20,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  payButtonText: {
    color: colors.background,
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    letterSpacing: typography.letterSpacing.normal,
  },
  applePayButton: {
    backgroundColor: colors.buttonPrimaryBackground,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.buttonBorder,
    ...shadows.button,
  },
  applePayText: {
    color: colors.background,
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    letterSpacing: typography.letterSpacing.normal,
  },
  billInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  billInfoText: {
    fontSize: typography.fontSize.base,
    color: colors.primary,
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.buttonSecondaryBackground,
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: colors.buttonSecondaryBorder,
    ...shadows.button,
  },
  cardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 10,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityText: {
    fontSize: 12,
    color: colors.graySubtle,
    marginLeft: 6,
  },
});
