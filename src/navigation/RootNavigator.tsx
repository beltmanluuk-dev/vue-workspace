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
  NotificationsScreen,
  InsightsScreen,
  BudgetsScreen,
  FamilyScreen,
  PaymentMethodsScreen,
  BillDetailScreen,
  AddBillScreen,
  AIAssistantScreen,
  ProfileScreen,
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
  Notifications: undefined;
  Insights: undefined;
  Budgets: undefined;
  Family: undefined;
  PaymentMethods: undefined;
  BillDetail: { billId: string } | undefined;
  AddBill: undefined;
  AIAssistant: undefined;
  Profile: undefined;
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
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen 
        name="Insights" 
        component={InsightsScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen 
        name="Budgets" 
        component={BudgetsScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen 
        name="Family" 
        component={FamilyScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen 
        name="PaymentMethods" 
        component={PaymentMethodsScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen 
        name="BillDetail" 
        component={BillDetailScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen 
        name="AddBill" 
        component={AddBillScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen 
        name="AIAssistant" 
        component={AIAssistantScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
