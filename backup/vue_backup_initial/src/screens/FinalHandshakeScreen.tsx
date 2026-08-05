import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { CheckCircle, Bell, Calendar, Shield } from 'lucide-react-native';
import { colors, spacing, typography, shadows } from '../theme';
import { useStore } from '../store';

export const FinalHandshakeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { setOnboardingComplete, setLoggedIn } = useStore();
  const checkAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(checkAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleStart = () => {
    setOnboardingComplete();
    setLoggedIn(true);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      })
    );
  };

  const checkScale = checkAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.2, 1],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.checkContainer, { transform: [{ scale: checkScale }] }]}>
          <View style={styles.checkOuter}>
            <View style={styles.checkInner}>
              <CheckCircle size={64} color={colors.mint} strokeWidth={1.5} />
            </View>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.title}>Du är redo!</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>betalningar hittade</Text>
            </View>
          </View>

          <View style={styles.nextPaymentCard}>
            <View style={styles.nextPaymentHeader}>
              <Calendar size={20} color={colors.primary} />
              <Text style={styles.nextPaymentTitle}>Första betalning</Text>
            </View>
            <Text style={styles.nextPaymentVendor}>Hyra - Bostadsbolaget</Text>
            <Text style={styles.nextPaymentDate}>27 februari 2026</Text>
            <Text style={styles.nextPaymentAmount}>8 500 kr</Text>
          </View>

          <View style={styles.featureList}>
            <View style={styles.featureRow}>
              <Bell size={20} color={colors.mint} />
              <Text style={styles.featureText}>
                Jag meddelar dig 2 dagar innan varje betalning
              </Text>
            </View>
            <View style={styles.featureRow}>
              <Shield size={20} color={colors.mint} />
              <Text style={styles.featureText}>
                Säkerhetsgränser är aktiverade på alla betalningar
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>Starta Vue</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkContainer: {
    marginBottom: spacing.xl,
    marginTop: spacing.xl,
  },
  checkOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(168, 213, 186, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(168, 213, 186, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  statsContainer: {
    marginBottom: spacing.xl,
  },
  statCard: {
    backgroundColor: colors.glass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: spacing.lg,
    alignItems: 'center',
    minWidth: 200,
  },
  statNumber: {
    fontSize: typography.fontSize.huge,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: typography.fontSize.base,
    color: colors.graySubtle,
    marginTop: spacing.xs,
  },
  nextPaymentCard: {
    backgroundColor: colors.glass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.mint,
    padding: spacing.lg,
    width: '100%',
    marginBottom: spacing.xl,
  },
  nextPaymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  nextPaymentTitle: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nextPaymentVendor: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  nextPaymentDate: {
    fontSize: typography.fontSize.base,
    color: colors.charcoal,
    marginBottom: spacing.xs,
  },
  nextPaymentAmount: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.primary,
  },
  featureList: {
    gap: spacing.md,
    width: '100%',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.charcoal,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadows.soft,
  },
  startButtonText: {
    color: colors.background,
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
  },
});

export default FinalHandshakeScreen;
