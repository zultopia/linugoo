import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Define the user type
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  phone: string;
  role: 'Guru' | 'Siswa';
}

// Define the context type
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (username: string, email: string, name: string, phone: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL
const API_URL = process.env.API_URL || 'http://localhost:5000';

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored auth token on mount
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('auth_token');
        if (storedToken) {
          setToken(storedToken);
          await getProfileWithToken(storedToken);
        }
      } catch (error) {
        console.error('Failed to load auth token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  // Navigate based on user role
  useEffect(() => {
    if (!isLoading && token && user) {
      // Redirect based on user role
      if (user.role === 'Guru') {
        router.replace('/(teacher)/dashboard');
      } else {
        router.replace('/(games)/base');
      }
    } else if (!isLoading && !token) {
      router.replace('/(auth)/login');
    }
  }, [user, token, isLoading]);

  // Login function
  const login = async (emailOrUsername: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        await AsyncStorage.setItem('auth_token', data.token);
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (
    username: string, 
    email: string, 
    name: string, 
    phone: string, 
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          email, 
          name, 
          phone, 
          password,
          role: 'Siswa' // Default role for frontend registration
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: 'Registration successful' };
      } else {
        return { success: false, message: data.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'An error occurred during registration' };
    } finally {
      setIsLoading(false);
    }
  };

  // Get profile function with token parameter
  const getProfileWithToken = async (authToken: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // If token is invalid, clear it
        setToken(null);
        await AsyncStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setToken(null);
      await AsyncStorage.removeItem('auth_token');
    }
  };

  // Get profile function that uses current token
  const getProfile = async (): Promise<void> => {
    if (!token) return;
    await getProfileWithToken(token);
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Jika menggunakan API logout
      if (token) {
        try {
          await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.error('API logout error:', error);
          // Lanjutkan proses logout lokal meskipun API gagal
        }
      }

      // Hapus data dari state
      setUser(null);
      setToken(null);

      // Hapus data dari storage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      
      // Arahkan ke halaman login
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    getProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};