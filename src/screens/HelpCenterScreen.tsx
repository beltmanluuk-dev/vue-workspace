import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, MessageCircle, Mail, Phone, FileText, HelpCircle, ChevronRight } from 'lucide-react-native';
import { colors, spacing, typography } from '../theme';

interface HelpItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  action: () => void;
}

export const HelpCenterScreen: React.FC = () => {
  const navigation = useNavigation();

  const helpItems: HelpItem[] = [
    {
      id: 'faq',
      icon: <HelpCircle size={22} color={colors.ocean} strokeWidth={2} />,
      title: 'Vanliga frågor',
      description: 'Hitta svar på de vanligaste frågorna',
      action: () => Linking.openURL('https://vue.app/faq'),
    },
    {
      id: 'chat',
      icon: <MessageCircle size={22} color={colors.mintDark} strokeWidth={2} />,
      title: 'Chatta med oss',
      description: 'Få hjälp direkt via chatt',
      action: () => Linking.openURL('https://vue.app/chat'),
    },
    {
      id: 'email',
      icon: <Mail size={22} color={colors.coral} strokeWidth={2} />,
      title: 'Skicka e-post',
      description: 'support@vue.app',
      action: () => Linking.openURL('mailto:support@vue.app'),
    },
    {
      id: 'phone',
      icon: <Phone size={22} color={colors.ocean} strokeWidth={2} />,
      title: 'Ring oss',
      description: '08-123 456 78 (vardagar 9-17)',
      action: () => Linking.openURL('tel:+4681234567'),
    },
    {
      id: 'docs',
      icon: <FileText size={22} color={colors.graySubtle} strokeWidth={2} />,
      title: 'Användarguide',
      description: 'Lär dig hur Vue fungerar',
      action: () => Linking.openURL('https://vue.app/guide'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ChevronLeft size={24} color={colors.primary} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hjälpcenter</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Hur kan vi hjälpa dig?</Text>
          <Text style={styles.heroSubtitle}>
            Välj ett alternativ nedan för att få hjälp med ditt ärende.
          </Text>
        </View>

        <View style={styles.helpList}>
          {helpItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.helpItem}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={styles.helpItemIcon}>{item.icon}</View>
              <View style={styles.helpItemContent}>
                <Text style={styles.helpItemTitle}>{item.title}</Text>
                <Text style={styles.helpItemDescription}>{item.description}</Text>
              </View>
              <ChevronRight size={20} color={colors.grayLight} strokeWidth={2} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Öppettider: Måndag - Fredag 09:00 - 17:00
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.primary,
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  heroSection: {
    marginBottom: spacing.xl,
  },
  heroTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.graySubtle,
    lineHeight: 22,
  },
  helpList: {
    gap: spacing.md,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  helpItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  helpItemContent: {
    flex: 1,
  },
  helpItemTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 2,
  },
  helpItemDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
  },
  footer: {
    marginTop: spacing.xxl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    color: colors.grayLight,
  },
});

export default HelpCenterScreen;
