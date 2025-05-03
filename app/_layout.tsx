import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Mock auth state 
// In a real app, you'd use a state management library like Zustand or Context API
// and implement actual authentication logic
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'parent' | 'child' | null>(null);

  useEffect(() => {
    // Check for authentication status
    // This would typically check a token in AsyncStorage/SecureStore
    // For this demo, we'll start unauthenticated
    setIsAuthenticated(false);
    setUserRole(null);
  }, []);

  return {
    isAuthenticated,
    userRole,
    signIn: (role: 'parent' | 'child') => {
      setIsAuthenticated(true);
      setUserRole(role);
    },
    signOut: () => {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  };
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, userRole } = useAuth();
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Show appropriate screens based on user role
          userRole === 'parent' ? (
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="(child)" options={{ headerShown: false }} />
          )
        ) : (
          // Show auth screens when not authenticated
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="(child)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
