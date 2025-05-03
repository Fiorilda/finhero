import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { getChildById } from '@/app/mock-data';

// Raiffeisen Bank brand colors
const BRAND_COLORS = {
  primary: '#FFEE00', // Raiffeisen Yellow
  secondary: '#004E9E', // Raiffeisen Blue
  lightGray: '#AAAAAA',
  positive: '#4CAF50',
  teal: '#37a69b',
};

// Mock child ID - in a real app this would come from authentication
const MOCK_CHILD_ID = 'c1';

export default function ProfileScreen() {
  const router = useRouter();
  // Get child data
  const childData = getChildById(MOCK_CHILD_ID);
  
  // State for toggle switches
  const [notifications, setNotifications] = useState(true);
  const [biometricLogin, setBiometricLogin] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Log Out", 
          onPress: () => router.replace('/(auth)/login') 
        }
      ]
    );
  };

  // Avatar mapping - in a real app, this might be a real image path
  const getAvatarSource = (avatarName: string) => {
    const avatars: Record<string, any> = {
      girl: require('@/assets/images/avatar-girl.png'),
      boy: require('@/assets/images/avatar-boy.png'),
      man: require('@/assets/images/avatar-man.png'),
    };
    return avatars[avatarName] || require('@/assets/images/avatar-default.png');
  };

  if (!childData) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <Image 
            source={getAvatarSource(childData.avatar)}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{childData.name}</Text>
            <Text style={styles.age}>{childData.age} years old</Text>
          </View>
        </View>
      </View>

      {/* Settings Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="person-outline" size={24} color="#333" />
            <Text style={styles.settingText}>My Details</Text>
            <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="wallet-outline" size={24} color="#333" />
            <Text style={styles.settingText}>My Accounts</Text>
            <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <View style={styles.settingToggleItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: '#DDDDDD', true: BRAND_COLORS.teal }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#DDDDDD"
              onValueChange={setNotifications}
              value={notifications}
            />
          </View>

          <View style={styles.settingToggleItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="finger-print-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Biometric Login</Text>
            </View>
            <Switch
              trackColor={{ false: '#DDDDDD', true: BRAND_COLORS.teal }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#DDDDDD"
              onValueChange={setBiometricLogin}
              value={biometricLogin}
            />
          </View>

          <View style={styles.settingToggleItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="moon-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              trackColor={{ false: '#DDDDDD', true: BRAND_COLORS.teal }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#DDDDDD"
              onValueChange={setDarkMode}
              value={darkMode}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="help-circle-outline" size={24} color="#333" />
            <Text style={styles.settingText}>Help Center</Text>
            <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#333" />
            <Text style={styles.settingText}>Contact Support</Text>
            <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>FinHero v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    backgroundColor: BRAND_COLORS.secondary,
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: BRAND_COLORS.primary,
  },
  profileInfo: {
    marginLeft: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  age: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingToggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 16,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
    marginLeft: 8,
  },
  appInfo: {
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  appVersion: {
    fontSize: 14,
    color: '#999999',
  },
}); 