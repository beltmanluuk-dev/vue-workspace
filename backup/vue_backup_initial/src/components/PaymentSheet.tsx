import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Animated, Pressable, Dimensions } from 'react-native';
import { Apple, CreditCard, CheckCircle, X } from 'lucide-react-native';
import { Bill } from '../types';
import { colors, shadows } from '../theme';
import { formatCurrency } from '../utils/helpers';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PaymentSheetProps {
  bill: Bill | null;
  visible: boolean;
  onClose: () => void;
  onPay: (billId: string) => void;
}

export const PaymentSheet: React.FC<PaymentSheetProps> = ({ bill, visible, onClose, onPay }) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

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
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View 
          style={[styles.backdrop, { opacity: backdropAnim }]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.sheetContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.handle} />
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color={colors.graySubtle} />
          </TouchableOpacity>
          
          <View style={styles.content}>
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
              <Text style={styles.amountLabel}>Belopp</Text>
              <Text style={styles.amount}>{formatCurrency(bill.amount)}</Text>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.applePayButton} onPress={handlePay}>
              <View style={styles.applePayContent}>
                <Apple size={22} color="#FFFFFF" strokeWidth={0} fill="#FFFFFF" />
                <Text style={styles.applePayText}>Pay</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cardButton} onPress={handlePay}>
              <CreditCard size={20} color={colors.primary} strokeWidth={2} />
              <Text style={styles.cardButtonText}>Betala med kort</Text>
            </TouchableOpacity>

            <View style={styles.securityNote}>
              <CheckCircle size={14} color={colors.systemGreen} strokeWidth={2} />
              <Text style={styles.securityText}>Skyddad med end-to-end kryptering</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheetContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 40,
    ...shadows.medium,
  },
  handle: {
    width: 36,
    height: 5,
    backgroundColor: colors.grayLight,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
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
  vendor: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: -0.4,
  },
  description: {
    fontSize: 14,
    color: colors.graySubtle,
    marginTop: 4,
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
    fontSize: 40,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 24,
  },
  applePayButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  applePayContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applePayText: {
    color: colors.background,
    fontSize: 19,
    fontWeight: '600',
    marginLeft: 6,
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 20,
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
