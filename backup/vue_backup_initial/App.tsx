import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as LocalAuthentication from 'expo-local-authentication';
import { RootNavigator } from './src/navigation';
import { SplashScreen } from './src/screens';
import { BiometricPrompt } from './src/components';
import { useStore } from './src/store';
import { colors } from './src/theme';
import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showBiometric, setShowBiometric] = useState(false);
  const { isLoggedIn, isAuthenticated, setAuthenticated } = useStore();

  useEffect(() => {
    if (!showSplash && isLoggedIn && !isAuthenticated) {
      setShowBiometric(true);
    }
  }, [showSplash, isLoggedIn, isAuthenticated]);

  const handleBiometricAuth = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Verifiera din identitet',
          cancelLabel: 'Avbryt',
          fallbackLabel: 'Använd lösenord',
        });
        
        if (result.success) {
          setAuthenticated(true);
          setShowBiometric(false);
        }
      } else {
        setAuthenticated(true);
        setShowBiometric(false);
      }
    } catch (error) {
      setAuthenticated(true);
      setShowBiometric(false);
    }
  };

  const getInitialRoute = () => {
    if (isLoggedIn && isAuthenticated) return 'MainTabs';
    return 'Welcome';
  };

  if (showSplash) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <ThemeProvider>
          <SafeAreaProvider>
            <SplashScreen onFinish={() => setShowSplash(false)} />
          </SafeAreaProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <SafeAreaProvider>
          <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
          <NavigationContainer>
            <RootNavigator initialRoute={getInitialRoute()} />
          </NavigationContainer>
          <BiometricPrompt
            visible={showBiometric}
            onAuthenticate={handleBiometricAuth}
            onCancel={() => setShowBiometric(false)}
          />
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
