import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

import { HeaderWithBack } from '@/components/HeaderWithBack';
import { ThemedText } from '@/components/ThemedText';

// Raiffeisen Bank brand colors
const BRAND_COLORS = {
  primary: '#FFEE00', // Raiffeisen Yellow
  secondary: '#004E9E', // Raiffeisen Blue
  lightGray: '#AAAAAA',
};

export default function ProfileScreen() {
  // Mock user data
  const [user, setUser] = useState({
    name: 'Alex Smith',
    email: 'alex.smith@example.com',
    role: 'parent',
    notifications: true,
    biometricLogin: true,
    childrenCount: 2,
  });

  const toggleSetting = (setting: 'notifications' | 'biometricLogin') => {
    setUser({
      ...user,
      [setting]: !user[setting],
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // In a real app, you'd clear auth tokens, etc.
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <HeaderWithBack title="Profile" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color={BRAND_COLORS.secondary} />
          </View>
          
          <ThemedText style={styles.userName}>{user.name}</ThemedText>
          <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
          <View style={styles.roleBadge}>
            <ThemedText style={styles.roleText}>Parent Account</ThemedText>
          </View>
        </View>

        {/* Family Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Ionicons name="people" size={24} color={BRAND_COLORS.secondary} />
            <View style={styles.summaryTextContainer}>
              <ThemedText style={styles.summaryValue}>{user.childrenCount}</ThemedText>
              <ThemedText style={styles.summaryLabel}>Children</ThemedText>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.manageButton}
            onPress={() => router.push('/(tabs)/family')}
          >
            <ThemedText style={styles.manageButtonText}>Manage Children</ThemedText>
            <Ionicons name="chevron-forward" size={16} color={BRAND_COLORS.secondary} />
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        <View style={styles.settingsSection}>
          <ThemedText style={styles.sectionTitle}>Account Settings</ThemedText>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="person-outline" size={24} color="#555555" style={styles.settingIcon} />
              <ThemedText style={styles.settingLabel}>Edit Profile</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="lock-closed-outline" size={24} color="#555555" style={styles.settingIcon} />
              <ThemedText style={styles.settingLabel}>Change Password</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="card-outline" size={24} color="#555555" style={styles.settingIcon} />
              <ThemedText style={styles.settingLabel}>Payment Methods</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="wallet-outline" size={24} color="#555555" style={styles.settingIcon} />
              <ThemedText style={styles.settingLabel}>Wallet Settings</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <ThemedText style={styles.sectionTitle}>Security</ThemedText>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={24} color="#555555" style={styles.settingIcon} />
              <ThemedText style={styles.settingLabel}>Notifications</ThemedText>
            </View>
            <Switch
              value={user.notifications}
              onValueChange={() => toggleSetting('notifications')}
              trackColor={{ false: '#E5E5E5', true: '#AAD4FF' }}
              thumbColor={user.notifications ? BRAND_COLORS.secondary : '#FFFFFF'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="finger-print-outline" size={24} color="#555555" style={styles.settingIcon} />
              <ThemedText style={styles.settingLabel}>Biometric Login</ThemedText>
            </View>
            <Switch
              value={user.biometricLogin}
              onValueChange={() => toggleSetting('biometricLogin')}
              trackColor={{ false: '#E5E5E5', true: '#AAD4FF' }}
              thumbColor={user.biometricLogin ? BRAND_COLORS.secondary : '#FFFFFF'}
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#555555" style={styles.settingIcon} />
              <ThemedText style={styles.settingLabel}>Privacy Settings</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <ThemedText style={styles.sectionTitle}>Support</ThemedText>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="help-circle-outline" size={24} color="#555555" style={styles.settingIcon} />
              <ThemedText style={styles.settingLabel}>Help & Support</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="document-text-outline" size={24} color="#555555" style={styles.settingIcon} />
              <ThemedText style={styles.settingLabel}>Terms & Privacy</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="information-circle-outline" size={24} color="#555555" style={styles.settingIcon} />
              <ThemedText style={styles.settingLabel}>About</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingTop: Platform.OS === 'ios' ? 40 : 30,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 16,
  },
  roleBadge: {
    backgroundColor: BRAND_COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTextContainer: {
    marginLeft: 16,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#777777',
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  manageButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: BRAND_COLORS.secondary,
    marginRight: 4,
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333333',
  },
  logoutButton: {
    backgroundColor: BRAND_COLORS.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
}); 