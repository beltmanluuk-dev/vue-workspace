import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingDown, Sparkles, ArrowRight, X } from 'lucide-react-native';
import { Bill } from '../types';
import { colors } from '../theme';
import { formatCurrency } from '../utils/helpers';

const { width } = Dimensions.get('window');

interface CostSaverModalProps {
  visible: boolean;
  bill: Bill | null;
  onClose: () => void;
  onExplore: () => void;
}

export const CostSaverModal: React.FC<CostSaverModalProps> = ({
  visible,
  bill,
  onClose,
  onExplore,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();

      // Pulse animation for the savings badge
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [visible]);

  if (!bill) return null;

  const potentialSavings = Math.round(bill.amount * 0.15);
  const isHighBill = bill.amount > 500;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: opacityAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim },
              ],
            },
          ]}
        >
          <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
            <LinearGradient
              colors={['#1C1C1E', '#2C2C2E', '#1C1C1E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <Pressable style={styles.closeButton} onPress={onClose}>
                <X size={18} color="#98989D" strokeWidth={2} />
              </Pressable>

              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['#30D158', '#28A745']}
                  style={styles.iconGradient}
                >
                  <TrendingDown size={28} color="#FFFFFF" strokeWidth={2.5} />
                </LinearGradient>
              </View>

              <Text style={styles.title}>Sänk kostnaden</Text>
              <Text style={styles.subtitle}>
                Din {bill.vendor}-faktura är {isHighBill ? 'högre än vanligt' : 'på väg'}
              </Text>

              <Animated.View style={[styles.savingsCard, { transform: [{ scale: pulseAnim }] }]}>
                <View style={styles.savingsHeader}>
                  <Sparkles size={16} color="#FFD60A" strokeWidth={2} />
                  <Text style={styles.savingsLabel}>Potentiell besparing</Text>
                </View>
                <Text style={styles.savingsAmount}>
                  {formatCurrency(potentialSavings)}/år
                </Text>
              </Animated.View>

              <View style={styles.partnersSection}>
                <Text style={styles.partnersTitle}>Våra partners</Text>
                <View style={styles.partnersList}>
                  <View style={styles.partnerBadge}>
                    <Text style={styles.partnerText}>⚡ Tibber</Text>
                  </View>
                  <View style={styles.partnerBadge}>
                    <Text style={styles.partnerText}>🔌 Vattenfall</Text>
                  </View>
                  <View style={styles.partnerBadge}>
                    <Text style={styles.partnerText}>💡 E.ON</Text>
                  </View>
                </View>
              </View>

              <Pressable style={styles.exploreButton} onPress={onExplore}>
                <Text style={styles.exploreText}>Utforska erbjudanden</Text>
                <ArrowRight size={18} color="#000000" strokeWidth={2.5} />
              </Pressable>

              <Text style={styles.disclaimer}>
                Baserat på din förbrukning och aktuella marknadspriser
              </Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: width - 48,
    maxWidth: 380,
  },
  card: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  gradient: {
    padding: 28,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#98989D',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  savingsCard: {
    backgroundColor: 'rgba(48, 209, 88, 0.15)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(48, 209, 88, 0.3)',
  },
  savingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  savingsLabel: {
    fontSize: 13,
    color: '#30D158',
    fontWeight: '600',
    marginLeft: 6,
    letterSpacing: 0.3,
  },
  savingsAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#30D158',
    letterSpacing: -1,
  },
  partnersSection: {
    width: '100%',
    marginBottom: 24,
  },
  partnersTitle: {
    fontSize: 12,
    color: '#98989D',
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
    textAlign: 'center',
  },
  partnersList: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  partnerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  partnerText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    marginBottom: 16,
  },
  exploreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginRight: 8,
  },
  disclaimer: {
    fontSize: 11,
    color: '#636366',
    textAlign: 'center',
  },
});
