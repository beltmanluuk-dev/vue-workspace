import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Search, Sparkles, Shield } from 'lucide-react-native';
import { colors, spacing, typography, shadows } from '../theme';

const { width } = Dimensions.get('window');

export const VueScanConsentScreen: React.FC = () => {
  const navigation = useNavigation();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleAccept = () => {
    navigation.navigate('VueScanning' as never);
  };

  const handleSkip = () => {
    navigation.navigate('MainTabs' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.iconOuter}>
            <View style={styles.iconInner}>
              <Search size={48} color={colors.primary} strokeWidth={1.5} />
            </View>
          </View>
        </Animated.View>

        <Text style={styles.title}>Låt oss hitta dina fasta{'\n'}kostnader automatiskt</Text>
        
        <Text style={styles.subtitle}>
          Vi går igenom dina senaste transaktioner och identifierar hyra, el, försäkringar och prenumerationer åt dig. Dina bankuppgifter är krypterade och delas aldrig vidare.
        </Text>

        <View style={styles.features}>
          <View style={styles.featureRow}>
            <Sparkles size={20} color={colors.mint} />
            <Text style={styles.featureText}>Automatisk identifiering av återkommande fakturor</Text>
          </View>
          <View style={styles.featureRow}>
            <Shield size={20} color={colors.mint} />
            <Text style={styles.featureText}>Bankdata krypterad och säker</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleAccept}>
            <Text style={styles.primaryButtonText}>Hitta mina fasta kostnader</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={handleSkip}>
            <Text style={styles.secondaryButtonText}>Jag vill lägga till själv</Text>
          </TouchableOpacity>
        </View>
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
  iconContainer: {
    marginBottom: spacing.xxl,
  },
  iconOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(168, 213, 186, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.glass,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.graySubtle,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  features: {
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    fontSize: typography.fontSize.sm,
    color: colors.charcoal,
  },
  buttonContainer: {
    width: '100%',
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadows.soft,
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: colors.glass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.graySubtle,
    fontSize: typography.fontSize.base,
    fontWeight: '500',
  },
});

export default VueScanConsentScreen;
