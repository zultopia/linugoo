import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import 'react-native-reanimated';
import { AuthProvider } from './context/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useNativeColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)/profile" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
          <Stack.Screen name="(teacher)/dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="(teacher)/data-siswa" options={{ headerShown: false }} />
          <Stack.Screen name="(teacher)/jurnal" options={{ headerShown: false }} />
          <Stack.Screen name="(games)/base" options={{ headerShown: false }} />
          <Stack.Screen name="(games)/detail/[id]/page" options={{ headerShown: true, title: "Detail Page" }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}