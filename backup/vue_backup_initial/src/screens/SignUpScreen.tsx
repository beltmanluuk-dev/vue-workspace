import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Mail, Lock, Eye, EyeOff, ChevronLeft } from 'lucide-react-native';
import { colors, spacing, typography, shadows } from '../theme';

export const SignUpScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = () => {
    if (!email || !password) {
      Alert.alert('Fyll i alla fält', 'Ange både e-post och lösenord.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Onboarding' as never);
    }, 1500);
  };

  const handleAppleSignUp = () => {
    Alert.alert('Apple Sign In', 'Apple inloggning kommer snart!');
  };

  const handleGoogleSignUp = () => {
    Alert.alert('Google Sign In', 'Google inloggning kommer snart!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={colors.primary} />
          </TouchableOpacity>

          <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Skapa konto</Text>
          <Text style={styles.subtitle}>
            Kom igång med Vue och ta kontroll över dina betalningar
          </Text>
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton} onPress={handleAppleSignUp}>
            <Text style={styles.appleIcon}></Text>
            <Text style={styles.socialButtonText}>Fortsätt med Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton, styles.googleButton]} onPress={handleGoogleSignUp}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleButtonText}>Fortsätt med Google</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>eller</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Mail size={20} color={colors.graySubtle} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="E-postadress"
              placeholderTextColor={colors.grayLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color={colors.graySubtle} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Lösenord"
              placeholderTextColor={colors.grayLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color={colors.graySubtle} />
              ) : (
                <Eye size={20} color={colors.graySubtle} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text style={styles.signUpButtonText}>
              {isLoading ? 'Skapar konto...' : 'Skapa konto'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.termsText}>
          Genom att skapa ett konto godkänner du våra{' '}
          <Text style={styles.termsLink}>Användarvillkor</Text> och{' '}
          <Text style={styles.termsLink}>Integritetspolicy</Text>
        </Text>
      </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Har du redan ett konto?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>Logga in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xl,
    marginTop: spacing.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
    letterSpacing: typography.letterSpacing.tight,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.graySubtle,
    lineHeight: 22,
  },
  socialButtons: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  appleIcon: {
    fontSize: 20,
    color: colors.background,
  },
  socialButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.background,
  },
  googleButton: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  googleButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.primary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.glassBorder,
  },
  dividerText: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
    paddingHorizontal: spacing.md,
  },
  form: {
    gap: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: spacing.md,
    height: 56,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.primary,
  },
  signUpButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
    ...shadows.soft,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.background,
  },
  termsText: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.xl,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xl,
  },
  footerText: {
    fontSize: typography.fontSize.base,
    color: colors.graySubtle,
  },
  loginLink: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default SignUpScreen;
