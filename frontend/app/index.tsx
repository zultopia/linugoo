import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function IndexPage() {
  const router = useRouter();
  const { user, isLoading, token } = useAuth();

  useEffect(() => {
    // If still loading auth state, do nothing yet
    if (isLoading) {
      return;
    }

    // If user is logged in, route based on role
    if (token && user) {
      if (user.role === 'Guru') {
        router.replace('/(teacher)/dashboard');
      } else {
        router.replace('/(games)/base');
      }
    } else {
      // If not logged in, go to login page
      router.replace('/(auth)/login');
    }
  }, [user, isLoading, token]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#C70039" />
      <Text style={styles.text}>Loading Linugoo...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5E0',
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: '#C70039',
    fontWeight: '500',
  },
});