import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5BCFB8',
        tabBarInactiveTintColor: '#AAAAAA',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => 
            focused ? 
              <Ionicons name="home" size={24} color={color} /> : 
              <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ color, focused }) => 
            focused ? 
              <Ionicons name="wallet" size={24} color={color} /> : 
              <Ionicons name="wallet-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chores"
        options={{
          title: 'Chores',
          tabBarIcon: ({ color, focused }) => 
            focused ? 
              <Ionicons name="checkmark-circle" size={24} color={color} /> : 
              <Ionicons name="checkmark-circle-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="safety"
        options={{
          title: 'Safety',
          tabBarIcon: ({ color, focused }) => 
            focused ? 
              <Ionicons name="location" size={24} color={color} /> : 
              <Ionicons name="location-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="game"
        options={{
          title: 'Money Game',
          tabBarIcon: ({ color, focused }) => 
            focused ? 
              <Ionicons name="trophy" size={24} color={color} /> : 
              <Ionicons name="trophy-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
