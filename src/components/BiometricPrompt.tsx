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
import * as Haptics from 'expo-haptics';
import { Fingerprint, ScanFace, X, Shield } from 'lucide-react-native';
import { colors, spacing, typography } from '../theme';

interface BiometricPromptProps {
  visible: boolean;
  action?: string;
  onAuthenticate: () => void;
  onCancel: () => void;
}

export const BiometricPrompt: React.FC<BiometricPromptProps> = ({
  visible,
  action,
  onAuthenticate,
  onCancel,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

      // Pulse animation for the biometric icon
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
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
    }
  }, [visible]);

  const handleAuthenticate = () => {
    // Trigger success haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(onAuthenticate, 300);
    });
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}>
      <BlurView intensity={20} tint="dark" style={styles.blurOverlay}>
        <Pressable style={styles.overlay} onPress={onCancel}>
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
            <TouchableOpacity style={styles.closeButton} onPress={onCancel} activeOpacity={0.7}>
              <X size={20} color={colors.graySubtle} strokeWidth={2} />
            </TouchableOpacity>

            {/* Security Badge */}
            <View style={styles.securityBadge}>
              <Shield size={14} color={colors.mintDark} strokeWidth={2} />
              <Text style={styles.securityText}>Säker verifiering</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>Verifiera din identitet</Text>
            <Text style={styles.action}>{action}</Text>

            {/* Biometric Icon - Centered */}
            <View style={styles.iconWrapper}>
              <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleAuthenticate}
                  activeOpacity={0.8}
                >
                  <ScanFace size={44} color={colors.charcoal} strokeWidth={1.5} />
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.primaryActionButton} onPress={handleAuthenticate} activeOpacity={0.85}>
                <ScanFace size={20} color={colors.background} strokeWidth={2.5} />
                <Text style={styles.primaryActionText}>Använd Face ID</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryActionButton} onPress={handleAuthenticate} activeOpacity={0.85}>
                <Fingerprint size={20} color={colors.primary} strokeWidth={2} />
                <Text style={styles.secondaryActionText}>Använd fingeravtryck</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.7}>
                <Text style={styles.cancelButtonText}>Avbryt</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 32,
    padding: spacing.xl,
    paddingTop: spacing.xl + 8,
    paddingBottom: spacing.xl + 8,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
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
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mintLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    gap: 4,
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
  },
  securityText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.mintDark,
  },
  iconWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.grayLight,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  action: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  actionButtonsContainer: {
    width: '100%',
    gap: spacing.sm,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md + 2,
    gap: spacing.sm,
  },
  primaryActionText: {
    fontSize: typography.fontSize.base,
    color: colors.background,
    fontWeight: '600',
  },
  secondaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glass,
    borderRadius: 16,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  secondaryActionText: {
    fontSize: typography.fontSize.base,
    color: colors.primary,
    fontWeight: '500',
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  cancelButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
    fontWeight: '500',
  },
});

export default BiometricPrompt;
