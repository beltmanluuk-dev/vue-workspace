import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { FileText, Plus, Inbox } from 'lucide-react-native';
import { colors, spacing, typography } from '../theme';

interface EmptyStateProps {
  type?: 'bills' | 'notifications' | 'generic';
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'generic',
  title,
  message,
  actionLabel,
  onAction,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'bills':
        return <FileText size={48} color={colors.mint} strokeWidth={1.5} />;
      case 'notifications':
        return <Inbox size={48} color={colors.ocean} strokeWidth={1.5} />;
      default:
        return <Inbox size={48} color={colors.graySubtle} strokeWidth={1.5} />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'bills':
        return 'Inga fakturor hittade';
      case 'notifications':
        return 'Inga notiser';
      default:
        return 'Inget att visa';
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'bills':
        return 'När du ansluter din bank hittar vi automatiskt dina återkommande betalningar.';
      case 'notifications':
        return 'Du har inga nya notiser just nu.';
      default:
        return 'Det finns ingen data att visa för tillfället.';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      
      <Text style={styles.title}>{title || getDefaultTitle()}</Text>
      <Text style={styles.message}>{message || getDefaultMessage()}</Text>

      {actionLabel && onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <Plus size={18} color={colors.background} strokeWidth={2} />
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
    minHeight: 300,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.fontSize.base,
    color: colors.graySubtle,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
    maxWidth: 280,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 14,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  actionText: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.background,
  },
});

export default EmptyState;
