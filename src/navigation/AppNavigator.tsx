import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import {
  DashboardScreen,
  EquipmentScreen,
  AlertsScreen,
  ServicesScreen,
  AccountScreen,
  SplashScreen,
} from '../screens';
import { AuthNavigator } from './AuthNavigator';
import { Colors } from '../utils/theme';
import { MainTabParamList, RootStackParamList } from '../types';
import { useApp } from '../context/AppContext';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabBarIcon: React.FC<{
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
  badge?: number;
}> = ({ name, color, focused, badge }) => {
  return (
    <View style={styles.iconContainer}>
      <Ionicons name={name} size={24} color={color} />
      {badge !== undefined && badge > 0 && (
        <View style={styles.badge}>
          <Ionicons name="ellipse" size={8} color={Colors.critical} />
        </View>
      )}
      {focused && <View style={[styles.activeIndicator, { backgroundColor: color }]} />}
    </View>
  );
};

const MainTabs: React.FC = () => {
  const { alerts } = useApp();
  const unreadAlerts = alerts.filter((a) => !a.isRead).length;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="grid" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Equipment"
        component={EquipmentScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="hardware-chip" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="notifications"
              color={color}
              focused={focused}
              badge={unreadAlerts}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="construct" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="wallet" color={color} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 88 : 70,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    borderTopWidth: 0,
    elevation: 0,
    backgroundColor: Colors.backgroundSecondary,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '500' as const,
    marginTop: 4,
  },
  iconContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    position: 'relative' as const,
  },
  activeIndicator: {
    position: 'absolute' as const,
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  badge: {
    position: 'absolute' as const,
    top: -2,
    right: -6,
  },
});
