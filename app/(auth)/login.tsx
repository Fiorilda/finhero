import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

// Raiffeisen Bank brand colors
const BRAND_COLORS = {
  primary: '#FFEE00', // Raiffeisen Yellow
  secondary: '#004E9E', // Raiffeisen Blue
  darkText: '#000000',
  lightGray: '#AAAAAA',
};

export default function LoginScreen() {
  const [isParent, setIsParent] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // In a real app, you would authenticate with a backend
    // For now, we'll just navigate to the main app
    if (isParent) {
      // Store user role in AsyncStorage/SecureStore in a real app
      router.replace('/(tabs)');
    } else {
      // Child login
      router.replace('/(tabs)');
    }
  };

  const toggleUserType = () => {
    setIsParent(!isParent);
    // Clear form when switching user types
    setEmail('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Image 
              source={require('@/assets/images/raiffeisen-logo.png')} 
              style={styles.logo}
              // Use a placeholder image if you don't have the actual logo
              defaultSource={require('@/assets/images/icon.png')}
            />
            <ThemedText style={styles.appName}>FinHero</ThemedText>
          </View>

          <View style={styles.tabSelector}>
            <TouchableOpacity 
              style={[styles.tabButton, isParent && styles.activeTabButton]} 
              onPress={() => setIsParent(true)}
            >
              <ThemedText style={[styles.tabText, isParent && styles.activeTabText]}>Parent</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, !isParent && styles.activeTabButton]} 
              onPress={() => setIsParent(false)}
            >
              <ThemedText style={[styles.tabText, !isParent && styles.activeTabText]}>Child</ThemedText>
            </TouchableOpacity>
          </View>

          <ThemedText style={styles.title}>
            {isParent ? 'Parent Login' : 'Child Login'}
          </ThemedText>
          
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <View style={styles.input}>
              <Ionicons name="mail-outline" size={20} color={BRAND_COLORS.lightGray} style={styles.inputIcon} />
              <TextInput
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                style={styles.textInput}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Password</ThemedText>
            <View style={styles.input}>
              <Ionicons name="lock-closed-outline" size={20} color={BRAND_COLORS.lightGray} style={styles.inputIcon} />
              <TextInput
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.textInput}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={BRAND_COLORS.lightGray} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <ThemedText style={styles.forgotPasswordText}>Forgot Password?</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <ThemedText style={styles.loginButtonText}>Login</ThemedText>
          </TouchableOpacity>

          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>Don't have an account?</ThemedText>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <ThemedText style={styles.signupText}>Sign Up</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: BRAND_COLORS.secondary,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 30,
    width: '100%',
  },
  tabButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: BRAND_COLORS.primary,
  },
  tabText: {
    fontWeight: '500',
    color: BRAND_COLORS.lightGray,
  },
  activeTabText: {
    color: BRAND_COLORS.darkText,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555555',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: BRAND_COLORS.secondary,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: BRAND_COLORS.secondary,
    borderRadius: 8,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  footerText: {
    color: '#555555',
    marginRight: 5,
  },
  signupText: {
    color: BRAND_COLORS.secondary,
    fontWeight: 'bold',
  },
}); 