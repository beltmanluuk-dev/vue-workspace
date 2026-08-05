import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import {
  WelcomeScreen,
  OnboardingScreen,
  PrivacyPolicyScreen,
  BankConnectionScreen,
  HelpCenterScreen,
  MonthlyReportDetailScreen,
  VueScanConsentScreen,
  VueScanningScreen,
  ClarityListScreen,
  PersonalizeScreen,
  FinalHandshakeScreen,
  BillScanResultScreen,
  SignUpScreen,
} from '../screens';

export type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  Onboarding: undefined;
  BankConnectionOnboarding: undefined;
  VueScanConsent: undefined;
  VueScanning: undefined;
  ClarityList: undefined;
  Personalize: undefined;
  FinalHandshake: undefined;
  MainTabs: undefined;
  PrivacyPolicy: undefined;
  BankConnection: undefined;
  HelpCenter: undefined;
  MonthlyReportDetail: undefined;
  BillScanResult: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  initialRoute?: keyof RootStackParamList;
}

export const RootNavigator: React.FC<RootNavigatorProps> = ({ initialRoute = 'Welcome' }) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="BankConnectionOnboarding" component={BankConnectionScreen} />
      <Stack.Screen name="VueScanConsent" component={VueScanConsentScreen} />
      <Stack.Screen name="VueScanning" component={VueScanningScreen} />
      <Stack.Screen name="ClarityList" component={ClarityListScreen} />
      <Stack.Screen name="Personalize" component={PersonalizeScreen} />
      <Stack.Screen name="FinalHandshake" component={FinalHandshakeScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen 
        name="PrivacyPolicy" 
        component={PrivacyPolicyScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen 
        name="BankConnection" 
        component={BankConnectionScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen 
        name="HelpCenter" 
        component={HelpCenterScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen 
        name="MonthlyReportDetail" 
        component={MonthlyReportDetailScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen 
        name="BillScanResult" 
        component={BillScanResultScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
