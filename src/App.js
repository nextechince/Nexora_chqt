import React, { useEffect, useState } from 'react';
import { StatusBar, SafeAreaView, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { AppNavigator } from './navigation/AppNavigator';
import { AuthStack } from './navigation/AuthStack';
import { COLORS } from './styles/colors';
import { db } from './services/LocalDB';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await db.init();
      // Check if any user is logged in (you can implement login check)
      // For demo, we'll just show login screen
      const user = await db.getUserById('admin_001');
      if (user) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('App init error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bgPrimary, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bgPrimary }}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bgPrimary} />
        <NavigationContainer>
          {isAuthenticated ? <AppNavigator /> : <AuthStack />}
        </NavigationContainer>
        <Toast visibilityTime={3000} position="bottom" />
      </SafeAreaView>
    </PaperProvider>
  );
}
