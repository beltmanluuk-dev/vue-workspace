import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Camera, FileText, CreditCard, Zap } from 'lucide-react-native';
import { colors, shadows } from '../theme';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
}

interface QuickActionsProps {
  onScanBill?: () => void;
  onAddManual?: () => void;
  onPaymentMethods?: () => void;
  onAutoPilot?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onScanBill,
  onAddManual,
  onPaymentMethods,
  onAutoPilot,
}) => {
  const actions: QuickAction[] = [
    {
      id: 'scan',
      label: 'Scan Bill',
      icon: <Camera size={22} color={colors.background} />,
      color: colors.primary,
      onPress: onScanBill || (() => {}),
    },
    {
      id: 'add',
      label: 'Add Manual',
      icon: <FileText size={22} color={colors.primary} />,
      color: colors.secondary,
      onPress: onAddManual || (() => {}),
    },
    {
      id: 'payment',
      label: 'Payment',
      icon: <CreditCard size={22} color={colors.primary} />,
      color: colors.secondary,
      onPress: onPaymentMethods || (() => {}),
    },
    {
      id: 'autopilot',
      label: 'Auto-Pilot',
      icon: <Zap size={22} color={colors.systemBlue} />,
      color: 'rgba(0, 122, 255, 0.1)',
      onPress: onAutoPilot || (() => {}),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.actionsContainer}
      >
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionButton}
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: action.color },
              ]}
            >
              {action.icon}
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 14,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    alignItems: 'center',
    marginRight: 4,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...shadows.soft,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.graySubtle,
  },
});
