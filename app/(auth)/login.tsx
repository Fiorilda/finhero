import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import { users } from '@/app/mock-data';

// Raiffeisen Bank brand colors
const BRAND_COLORS = {
  primary: '#FFEE00', // Raiffeisen Yellow
  secondary: '#004E9E', // Raiffeisen Blue
  lightGray: '#AAAAAA',
  positive: '#4CAF50',
  teal: '#37a69b',
};

// Soft shadows for a more professional look
const SHADOWS = {
  light: {
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  strong: {
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
};

// Define prop types for our GradientButton component
interface GradientButtonProps {
  style?: any;
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
}

// Add a gradient helper component since React Native doesn't have built-in LinearGradient
const GradientButton = ({ 
  style, 
  colors, 
  start, 
  end, 
  children, 
  onPress, 
  disabled = false 
}: GradientButtonProps) => {
  const buttonStyles = [styles.gradientButton, style];
  const gradientColors = disabled ? ['#F5F5F5', '#EEEEEE'] : colors;
  
  return (
    <TouchableOpacity 
      style={buttonStyles} 
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={{ 
        backgroundColor: gradientColors[0], 
        borderRadius: (style && style.borderRadius) || 12,
        overflow: 'hidden', 
        width: '100%',
        ...style
      }}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

export default function LoginScreen() {
  const [isChildMode, setIsChildMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Sample child users for quick login
  const childUsers = users.filter(user => user.role === 'child');
  const parentUsers = users.filter(user => user.role === 'parent');

  const handleLogin = () => {
    if (isChildMode) {
      // Child login with PIN
      if (!selectedUser) {
        Alert.alert('Error', 'Please select your account');
        return;
      }
      
      const childUser = users.find(u => u.id === selectedUser);
      if (!childUser) {
        Alert.alert('Error', 'User not found');
        return;
      }
      
      if (pin === childUser.pin) {
        // Successful child login
        console.log('Child logged in:', childUser.name);
        router.replace('/(child)');
      } else {
        Alert.alert('Error', 'Invalid PIN');
      }
    } else {
      // Parent login with email/password
      const parentUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === 'parent');
      
      if (parentUser && password === '1234') { // Mock password check
        // Successful parent login
        console.log('Parent logged in:', parentUser.name);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    }
  };

  const selectChildUser = (userId: string) => {
    setSelectedUser(userId);
    setPin(''); // Clear PIN when switching users
  };

  // Handle PIN input
  const handlePinChange = (text: string) => {
    // Only allow numbers and limit to 4 digits
    const newPin = text.replace(/[^0-9]/g, '').substr(0, 4);
    setPin(newPin);
    
    // Auto login when PIN is complete (4 digits)
    if (newPin.length === 4 && selectedUser) {
      const childUser = users.find(u => u.id === selectedUser);
      if (childUser && newPin === childUser.pin) {
        // Successful child login
        console.log('Child logged in:', childUser.name);
        setTimeout(() => {
          router.replace('/(child)');
        }, 300); // Small delay for better UX
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <View style={styles.backgroundTop} />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Logo and Header */}
            <View style={styles.header}>
              <Text style={styles.title}>FinHero</Text>
              <Text style={styles.subtitle}>Financial education for kids</Text>
            </View>

            {/* Toggle between Parent and Child modes */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, !isChildMode && styles.toggleButtonActive]}
                onPress={() => {
                  setIsChildMode(false);
                  setSelectedUser(null);
                  setPin('');
                }}
              >
                <Text style={[styles.toggleText, !isChildMode && styles.toggleTextActive]}>Parent</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, isChildMode && styles.toggleButtonActive]}
                onPress={() => {
                  setIsChildMode(true);
                  setEmail('');
                  setPassword('');
                }}
              >
                <Text style={[styles.toggleText, isChildMode && styles.toggleTextActive]}>Child</Text>
              </TouchableOpacity>
            </View>

            {/* Parent Login Form */}
            {!isChildMode && (
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
                
                <GradientButton 
                  style={styles.loginButton} 
                  colors={['#FFEE00', '#FFD000']} 
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                </GradientButton>
                
                {/* Parent Quick Login (for demo) */}
                <View style={styles.quickLoginSection}>
                  <Text style={styles.quickLoginTitle}>Quick Login (Demo)</Text>
                  <View style={styles.quickLoginOptions}>
                    {parentUsers.map(user => (
                      <TouchableOpacity 
                        key={user.id}
                        style={styles.quickLoginItem}
                        onPress={() => {
                          setEmail(user.email);
                          setPassword('1234'); // Demo password
                        }}
                      >
                        <View style={styles.quickLoginAvatar}>
                          <Ionicons 
                            name="person" 
                            size={24} 
                            color={BRAND_COLORS.secondary} 
                          />
                        </View>
                        <Text style={styles.quickLoginName}>{user.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* Child Login Form */}
            {isChildMode && (
              <View style={styles.form}>
                {/* Child selection */}
                <Text style={styles.sectionLabel}>Select your account:</Text>
                <View style={styles.childrenContainer}>
                  {childUsers.map(child => (
                    <TouchableOpacity
                      key={child.id}
                      style={[
                        styles.childItem,
                        selectedUser === child.id && styles.childItemSelected
                      ]}
                      onPress={() => selectChildUser(child.id)}
                    >
                      <View style={styles.childAvatar}>
                        <Ionicons 
                          name="person-circle" 
                          size={40} 
                          color={child.avatar === 'girl' ? '#FF4081' : '#2196F3'} 
                        />
                      </View>
                      <Text style={styles.childName}>{child.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* PIN entry when child is selected */}
                {selectedUser && (
                  <View style={styles.pinSection}>
                    <Text style={styles.pinLabel}>Enter your PIN to login</Text>
                    <View style={styles.pinContainer}>
                      <TextInput
                        style={styles.pinInput}
                        value={pin}
                        onChangeText={handlePinChange}
                        keyboardType="number-pad"
                        maxLength={4}
                        secureTextEntry
                        autoFocus
                      />
                      <View style={styles.pinDots}>
                        {[...Array(4)].map((_, index) => (
                          <View
                            key={index}
                            style={[
                              styles.pinDot,
                              index < pin.length && styles.pinDotFilled
                            ]}
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.pinHint}>
                      {/* Show PIN for demo purposes */}
                      (Demo PIN: {users.find(u => u.id === selectedUser)?.pin})
                    </Text>
                  </View>
                )}

                {/* Login button for child mode */}
                <GradientButton 
                  style={[
                    styles.loginButton,
                    (!selectedUser || pin.length < 4) && styles.loginButtonDisabled
                  ]} 
                  colors={['#FFEE00', '#FFD000']} 
                  onPress={handleLogin}
                  disabled={!selectedUser || pin.length < 4}
                >
                  <Text style={[
                    styles.loginButtonText,
                    (!selectedUser || pin.length < 4) && styles.loginButtonTextDisabled
                  ]}>Login</Text>
                </GradientButton>
              </View>
            )}

            {/* Sign Up Section */}
            {!isChildMode && (
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/signup')}>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  backgroundTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: windowHeight * 0.35,
    backgroundColor: 'rgba(255, 238, 0, 0.08)',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: windowHeight - (Platform.OS === 'ios' ? 40 : 0),
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 20,
    borderRadius: 25,
    ...SHADOWS.strong,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: BRAND_COLORS.secondary,
    marginBottom: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#555555',
    letterSpacing: 0.5,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 40,
    padding: 5,
    width: '100%',
    ...SHADOWS.light,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleButtonActive: {
    backgroundColor: BRAND_COLORS.primary,
    ...SHADOWS.light,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555555',
  },
  toggleTextActive: {
    color: '#000000',
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    marginBottom: 20,
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: '#FFFFFF',
    width: '100%',
    ...SHADOWS.light,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 28,
  },
  forgotPasswordText: {
    color: BRAND_COLORS.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  loginButtonDisabled: {
    backgroundColor: '#F5F5F5',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: BRAND_COLORS.secondary,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
    paddingVertical: 12,
  },
  loginButtonTextDisabled: {
    color: '#AAAAAA',
  },
  gradientButton: {
    borderRadius: 12,
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  signupText: {
    color: '#666666',
    fontSize: 14,
  },
  signupLink: {
    color: BRAND_COLORS.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
  },
  childrenContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  childItem: {
    alignItems: 'center',
    margin: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    width: windowWidth / 3 - 24,
    backgroundColor: '#FAFAFA',
  },
  childItemSelected: {
    borderColor: BRAND_COLORS.primary,
    backgroundColor: 'rgba(255, 238, 0, 0.15)',
    ...SHADOWS.light,
  },
  childAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...SHADOWS.light,
  },
  childName: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
  },
  pinSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pinLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
  },
  pinContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  pinInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  pinDots: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pinDotFilled: {
    backgroundColor: BRAND_COLORS.primary,
    borderColor: '#E0C800',
    ...SHADOWS.light,
  },
  pinHint: {
    fontSize: 12,
    color: '#999999',
    marginTop: 8,
  },
  quickLoginSection: {
    marginTop: 32,
    width: '100%',
  },
  quickLoginTitle: {
    fontSize: 15,
    color: '#555555',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  quickLoginOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  quickLoginItem: {
    alignItems: 'center',
    margin: 12,
  },
  quickLoginAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...SHADOWS.light,
    borderWidth: 2,
    borderColor: BRAND_COLORS.primary,
  },
  quickLoginName: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
}); 
 