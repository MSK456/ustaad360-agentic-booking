import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import { View } from 'react-native';

import { RootStackParamList, TabParamList } from './types';
import { Colors, Typography } from '../theme';

import { HomeScreen } from '../screens/HomeScreen';
import { IntentReviewScreen } from '../screens/IntentReviewScreen';
import { ProviderListScreen } from '../screens/ProviderListScreen';
import { ProviderDetailScreen } from '../screens/ProviderDetailScreen';
import { BookingConfirmScreen } from '../screens/BookingConfirmScreen';
import { FollowUpTimelineScreen } from '../screens/FollowUpTimelineScreen';
import { AgentTraceScreen } from '../screens/AgentTraceScreen';
import { DisputeCenterScreen } from '../screens/DisputeCenterScreen';
import { BaselineCompareScreen } from '../screens/BaselineCompareScreen';
import { DemoScenariosScreen } from '../screens/DemoScenariosScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: Colors.card },
  headerTintColor: Colors.textPrimary,
  headerTitleStyle: { ...Typography.h4, color: Colors.textPrimary },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: Colors.background },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, [string, string]> = {
            Home: ['home', 'home-outline'],
            AgentTrace: ['hardware-chip', 'hardware-chip-outline'],
            BaselineCompare: ['git-compare', 'git-compare-outline'],
            DemoScenarios: ['play-circle', 'play-circle-outline'],
          };
          const [active, inactive] = icons[route.name] ?? ['ellipse', 'ellipse-outline'];
          return <Ionicons name={(focused ? active : inactive) as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopColor: Colors.tabBarBorder,
          borderTopWidth: 1,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', paddingBottom: 4 },
        ...screenOptions,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Ustaad360', tabBarLabel: 'Home' }} />
      <Tab.Screen name="AgentTrace" component={AgentTraceScreen} options={{ title: 'Agent Trace', tabBarLabel: 'Trace' }} />
      <Tab.Screen name="BaselineCompare" component={BaselineCompareScreen} options={{ title: 'Compare', tabBarLabel: 'Compare' }} />
      <Tab.Screen name="DemoScenarios" component={DemoScenariosScreen} options={{ title: 'Demo', tabBarLabel: 'Demo' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="IntentReview" component={IntentReviewScreen} options={{ title: 'Analyzing Request' }} />
        <Stack.Screen name="ProviderList" component={ProviderListScreen} options={{ title: 'Ranked Providers' }} />
        <Stack.Screen name="ProviderDetail" component={ProviderDetailScreen} options={{ title: 'Provider Profile' }} />
        <Stack.Screen name="BookingConfirm" component={BookingConfirmScreen} options={{ title: 'Confirm Booking' }} />
        <Stack.Screen name="FollowUpTimeline" component={FollowUpTimelineScreen} options={{ title: 'Booking Status' }} />
        <Stack.Screen name="DisputeCenter" component={DisputeCenterScreen} options={{ title: 'Dispute Center' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
