import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  Pressable,
} from 'react-native';
import { PauseCircle, AlertTriangle, CheckCircle, X } from 'lucide-react-native';
import { colors, spacing, typography, shadows } from '../theme';

interface EmergencyPauseButtonProps {
  isPaused: boolean;
  onTogglePause: () => void;
}

export const EmergencyPauseButton: React.FC<EmergencyPauseButtonProps> = ({
  isPaused,
  onTogglePause,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isPaused) {
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
      pulseAnim.setValue(1);
    }
  }, [isPaused]);

  const handlePress = () => {
    if (isPaused) {
      onTogglePause();
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmPause = () => {
    setShowConfirmModal(false);
    onTogglePause();
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 200,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 8,
    }).start();
  };

  return (
    <>
      <Animated.View style={{ transform: [{ scale: scaleAnim }, { scale: pulseAnim }] }}>
        <TouchableOpacity
          style={[styles.button, isPaused && styles.buttonPaused]}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <View style={[styles.iconContainer, isPaused && styles.iconContainerPaused]}>
            {isPaused ? (
              <CheckCircle size={24} color={colors.mintDark} strokeWidth={2} />
            ) : (
              <PauseCircle size={24} color={colors.ocean} strokeWidth={2} />
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, isPaused && styles.titlePaused]}>
              {isPaused ? 'Betalningar pausade' : 'Nödpaus'}
            </Text>
            <Text style={[styles.subtitle, isPaused && styles.subtitlePaused]}>
              {isPaused ? 'Tryck för att återuppta' : 'Pausa alla automatiska betalningar'}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Confirmation Modal */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowConfirmModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setShowConfirmModal(false)}
              activeOpacity={0.7}
            >
              <X size={20} color={colors.graySubtle} strokeWidth={2} />
            </TouchableOpacity>

            <View style={styles.modalIcon}>
              <AlertTriangle size={32} color={colors.ocean} strokeWidth={2} />
            </View>

            <Text style={styles.modalTitle}>Pausa alla betalningar?</Text>
            <Text style={styles.modalMessage}>
              Alla automatiska betalningar kommer att pausas tills du aktiverar dem igen. 
              Använd detta om du tappat kortet eller misstänker bedrägeri.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowConfirmModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Avbryt</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmPause}
                activeOpacity={0.8}
              >
                <PauseCircle size={18} color={colors.background} strokeWidth={2} />
                <Text style={styles.confirmButtonText}>Pausa nu</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.oceanLight,
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.ocean,
  },
  buttonPaused: {
    backgroundColor: colors.mintLight,
    borderColor: colors.mint,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconContainerPaused: {
    backgroundColor: colors.background,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.oceanDark,
    marginBottom: 2,
  },
  titlePaused: {
    color: colors.mintDark,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.slate,
  },
  subtitlePaused: {
    color: colors.graySubtle,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 28,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.oceanLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalMessage: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 14,
    paddingVertical: spacing.md,
  },
  cancelButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.grayMedium,
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ocean,
    borderRadius: 14,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  confirmButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.background,
  },
});

export default EmergencyPauseButton;
