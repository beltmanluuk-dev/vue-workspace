import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, Send, Bot, AlertCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAI } from '../hooks';
import { colors, spacing, typography, shadows } from '../theme';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const EXAMPLE_QUESTIONS = [
  'Hur sparar jag mest på mina räkningar?',
  'Vilka fakturor är mest brådskande?',
  'Förklara autogiro på svenska.',
];

export const AIAssistantScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hej! Jag är din VUE-assistent. Fråga mig om privatekonomi, fakturor eller spartips.',
      timestamp: new Date(),
    },
  ]);

  // API-nyckeln läses från process.env.EXPO_PUBLIC_GROQ_API_KEY (eller GROQ_API_KEY).
  // Lägg den i .env-filen i projektroten och inkludera den aldrig i Git.
  const { ask, isLoading, error, isConfigured } = useAI({
    provider: 'groq',
  });

  const flatListRef = useRef<FlatList>(null);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || !isConfigured) return;

    const userText = input.trim();
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const reply = await ask(userText);

    if (reply) {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }
  }, [input, isLoading, isConfigured, ask]);

  const handleExample = (question: string) => {
    setInput(question);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.messageBubble,
        item.role === 'user' ? styles.userBubble : styles.assistantBubble,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.role === 'user' ? styles.userText : styles.assistantText,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>VUE AI</Text>
          <Text style={styles.subtitle}>Din ekonomiassistent</Text>
        </View>
        <Bot size={28} color={colors.primary} />
      </View>

      {!isConfigured && (
        <View style={styles.configBanner}>
          <AlertCircle size={18} color="#F59E0B" />
          <Text style={styles.configBannerText}>
            Ingen API-nyckel konfigurerad. Lägg till den i din miljö/config för att aktivera AI.
          </Text>
        </View>
      )}

      {error && (
        <View style={styles.errorBanner}>
          <AlertCircle size={18} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />

      {messages.length === 1 && (
        <View style={styles.examples}>
          <Text style={styles.examplesTitle}>Förslag</Text>
          <View style={styles.exampleChips}>
            {EXAMPLE_QUESTIONS.map((question) => (
              <TouchableOpacity
                key={question}
                style={styles.exampleChip}
                onPress={() => handleExample(question)}
              >
                <Text style={styles.exampleChipText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Fråga om din ekonomi..."
            placeholderTextColor={colors.grayLight}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            editable={isConfigured && !isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() || !isConfigured || isLoading) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!input.trim() || !isConfigured || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.background} />
            ) : (
              <Send size={20} color={colors.background} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.graySubtle,
  },
  messagesContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 18,
    marginVertical: 6,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  messageText: {
    fontSize: typography.fontSize.base,
    lineHeight: 22,
    fontFamily: typography.fontFamily.regular,
  },
  userText: {
    color: colors.background,
  },
  assistantText: {
    color: colors.primary,
  },
  configBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  configBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#991B1B',
  },
  examples: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.graySubtle,
    marginBottom: 8,
  },
  exampleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exampleChip: {
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  exampleChipText: {
    fontSize: 13,
    color: colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.base,
    color: colors.text || colors.primary,
    fontFamily: typography.fontFamily.regular,
    marginRight: spacing.sm,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
