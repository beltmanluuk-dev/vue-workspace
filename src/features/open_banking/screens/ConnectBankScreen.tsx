import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { colors, spacing, typography } from '../../../theme';

export const ConnectBankScreen: React.FC = () => {
  const route = useRoute<any>();
  const bankId = route.params?.bankId || 'unknown';
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConnect = () => {
    setIsLoading(true);
    // Placeholder: öppna OAuth-fönster eller deeplink mot Tink/vald bank.
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Anslut {bankId}</Text>
      <Text style={styles.subtitle}>
        Här kommer OAuth- eller bank-inloggningsflödet att öppnas. Ännu är det bara en placeholder.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleConnect} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text style={styles.buttonText}>Starta anslutning</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.graySubtle,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.background,
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
  },
});
