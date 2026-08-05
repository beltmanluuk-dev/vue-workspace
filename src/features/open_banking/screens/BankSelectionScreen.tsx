import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../../../theme';

const BANKS = [
  { id: 'tink', name: 'Tink (placeholder)', country: 'SE' },
  { id: 'swedbank', name: 'Swedbank', country: 'SE' },
  { id: 'nordea', name: 'Nordea', country: 'SE' },
  { id: 'handelsbanken', name: 'Handelsbanken', country: 'SE' },
  { id: 'seb', name: 'SEB', country: 'SE' },
];

export const BankSelectionScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleSelect = (bankId: string) => {
    navigation.navigate('ConnectBank', { bankId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Välj bank</Text>
      <Text style={styles.subtitle}>Open Banking-integration (placeholder)</Text>
      <FlatList
        data={BANKS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.bankRow} onPress={() => handleSelect(item.id)}>
            <Text style={styles.bankName}>{item.name}</Text>
            <Text style={styles.bankCountry}>{item.country}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: '700',
    color: colors.primary,
    marginTop: spacing.xl,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.graySubtle,
    marginBottom: spacing.lg,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  bankRow: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  bankName: {
    fontSize: typography.fontSize.lg,
    color: colors.primary,
    fontWeight: '600',
  },
  bankCountry: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
  },
});
