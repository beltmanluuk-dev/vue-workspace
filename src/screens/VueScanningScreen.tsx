import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Cpu, FileSearch, Receipt, Home, Zap, Shield } from 'lucide-react-native';
import { colors, spacing, typography } from '../theme';

const { width } = Dimensions.get('window');

const scanSteps = [
  { icon: Receipt, text: 'Söker prenumerationer...' },
  { icon: Home, text: 'Hittar hyra och boende...' },
  { icon: Zap, text: 'Kollar el och internet...' },
  { icon: Shield, text: 'Letar efter försäkringar...' },
  { icon: FileSearch, text: 'Sammanställer dina kostnader...' },
];

export const VueScanningScreen: React.FC = () => {
  const navigation = useNavigation();
  const pulseAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotate animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start();

    // Step through scan items
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < scanSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1000);

    // Navigate after scanning
    const timer = setTimeout(() => {
      navigation.navigate('ClarityList' as never);
    }, 5000);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(timer);
    };
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const CurrentIcon = scanSteps[currentStep].icon;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.scanContainer}>
          {/* Outer ring */}
          <Animated.View 
            style={[
              styles.outerRing,
              { transform: [{ scale: pulseAnim }] }
            ]} 
          />
          
          {/* Middle ring */}
          <Animated.View 
            style={[
              styles.middleRing,
              { transform: [{ rotate: rotation }] }
            ]}
          >
            <View style={styles.ringDot} />
          </Animated.View>

          {/* Center icon */}
          <View style={styles.centerIcon}>
            <Cpu size={48} color={colors.primary} strokeWidth={1.5} />
          </View>
        </View>

        <Text style={styles.title}>Vi söker efter fasta utgifter</Text>
        <Text style={styles.subtitle}>
          Analyserar senaste 5 månadernas transaktioner
        </Text>

        <View style={styles.stepContainer}>
          <CurrentIcon size={24} color={colors.mint} />
          <Text style={styles.stepText}>{scanSteps[currentStep].text}</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View 
              style={[
                styles.progressBar,
                { width: progressWidth }
              ]} 
            />
          </View>
        </View>

        <Text style={styles.securityText}>
          🔒 Krypterad anslutning · Data stannar på din enhet
        </Text>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  scanContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  outerRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(168, 213, 186, 0.2)',
    shadowColor: colors.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  middleRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: colors.mint,
    alignItems: 'flex-end',
    justifyContent: 'center',
    shadowColor: colors.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  ringDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.mintDark,
    marginRight: -7,
    shadowColor: colors.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  centerIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: colors.mintLight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.mint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.graySubtle,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
    height: 32,
  },
  stepText: {
    fontSize: typography.fontSize.base,
    color: colors.charcoal,
    fontWeight: '500',
  },
  progressContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.glass,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.mint,
  },
  securityText: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
    textAlign: 'center',
  },
});

export default VueScanningScreen;
