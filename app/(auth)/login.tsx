import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
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
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Logo and Header */}
            <View style={styles.header}>
              <Image
                source={{ uri: 'https://via.placeholder.com/100x100.png?text=FinHero' }}
                style={styles.logo}
              />
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
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                
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
                <TouchableOpacity 
                  style={[
                    styles.loginButton,
                    (!selectedUser || pin.length < 4) && styles.loginButtonDisabled
                  ]} 
                  onPress={handleLogin}
                  disabled={!selectedUser || pin.length < 4}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Dimensions.get('window').height - (Platform.OS === 'ios' ? 40 : 0),
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: BRAND_COLORS.secondary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 24,
    padding: 4,
    width: '100%',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#888888',
  },
  toggleTextActive: {
    color: BRAND_COLORS.secondary,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 50,
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
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: BRAND_COLORS.secondary,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: BRAND_COLORS.secondary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 16,
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
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    width: windowWidth / 3 - 24,
  },
  childItemSelected: {
    borderColor: BRAND_COLORS.teal,
    backgroundColor: 'rgba(55, 166, 155, 0.1)',
  },
  childAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 16,
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
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  pinDotFilled: {
    backgroundColor: BRAND_COLORS.secondary,
    borderColor: BRAND_COLORS.secondary,
  },
  pinHint: {
    fontSize: 12,
    color: '#999999',
    marginTop: 8,
  },
  quickLoginSection: {
    marginTop: 24,
  },
  quickLoginTitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    textAlign: 'center',
  },
  quickLoginOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  quickLoginItem: {
    alignItems: 'center',
    margin: 8,
  },
  quickLoginAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickLoginName: {
    fontSize: 12,
    color: '#333333',
  },
}); 
