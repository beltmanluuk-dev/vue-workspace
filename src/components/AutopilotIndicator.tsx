/**
 * AutopilotIndicator
 * Visar autopilot-status med subtil badge
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { 
  Eye,
  HandHelping,
  Zap,
  Rocket,
} from 'lucide-react-native';
import { colors, spacing, typography } from '../theme';
import { useStore } from '../store';
import { AutopilotLevel } from '../engine/types';

interface AutopilotIndicatorProps {
  onPress?: () => void;
  showLabel?: boolean;
}

export const AutopilotIndicator: React.FC<AutopilotIndicatorProps> = ({
  onPress,
  showLabel = true,
}) => {
  const { autopilotLevel, isAutoPilotEnabled } = useStore();

  const getIcon = () => {
    if (!isAutoPilotEnabled) {
      return <Eye size={16} color={colors.graySubtle} strokeWidth={2} />;
    }
    
    switch (autopilotLevel) {
      case 'Observera':
        return <Eye size={16} color={colors.ocean} strokeWidth={2} />;
      case 'Assistera':
        return <HandHelping size={16} color={colors.ocean} strokeWidth={2} />;
      case 'Optimera':
        return <Zap size={16} color={colors.mint} strokeWidth={2} />;
      case 'Full Autopilot':
        return <Rocket size={16} color={colors.mint} strokeWidth={2} />;
      default:
        return <Eye size={16} color={colors.ocean} strokeWidth={2} />;
    }
  };

  const getColor = () => {
    if (!isAutoPilotEnabled) return colors.graySubtle;
    
    switch (autopilotLevel) {
      case 'Optimera':
      case 'Full Autopilot':
        return colors.mint;
      default:
        return colors.ocean;
    }
  };

  const getLabel = (): string => {
    if (!isAutoPilotEnabled) return 'Av';
    return autopilotLevel;
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { borderColor: getColor() }]} 
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
    >
      {getIcon()}
      {showLabel && (
        <Text style={[styles.label, { color: getColor() }]}>
          {getLabel()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    gap: 4,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
  },
});

export default AutopilotIndicator;
