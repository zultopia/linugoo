import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://linugoo-production-e38a.up.railway.app';

export default function ChangePassword() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password harus minimal 8 karakter';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password harus mengandung huruf besar';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password harus mengandung huruf kecil';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password harus mengandung angka';
    }
    return null;
  };

  const handleChangePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      Alert.alert('Error', 'Password baru dan konfirmasi password tidak cocok');
      return;
    }

    const passwordError = validatePassword(passwords.newPassword);
    if (passwordError) {
      Alert.alert('Error', passwordError);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      Alert.alert('Success', 'Password berhasil diubah', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Error changing password:', error);
      Alert.alert('Error', error.message || 'Gagal mengubah password');
    } finally {
      setIsLoading(false);
    }
  };

  const brandColor = user?.role === 'Guru' ? '#C70039' : '#E30425';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/profile')}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ubah Password</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.formField}>
          <Text style={styles.label}>Password Saat Ini</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={passwords.currentPassword}
              onChangeText={(text) => setPasswords(prev => ({ ...prev, currentPassword: text }))}
              placeholder="Masukkan password saat ini"
              secureTextEntry={!showPasswords.current}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
            >
              <Ionicons 
                name={showPasswords.current ? "eye-outline" : "eye-off-outline"} 
                size={24} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Password Baru</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={passwords.newPassword}
              onChangeText={(text) => setPasswords(prev => ({ ...prev, newPassword: text }))}
              placeholder="Masukkan password baru"
              secureTextEntry={!showPasswords.new}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
            >
              <Ionicons 
                name={showPasswords.new ? "eye-outline" : "eye-off-outline"} 
                size={24} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Konfirmasi Password Baru</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={passwords.confirmPassword}
              onChangeText={(text) => setPasswords(prev => ({ ...prev, confirmPassword: text }))}
              placeholder="Konfirmasi password baru"
              secureTextEntry={!showPasswords.confirm}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
            >
              <Ionicons 
                name={showPasswords.confirm ? "eye-outline" : "eye-off-outline"} 
                size={24} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.requirementsContainer}>
          <Text style={styles.requirementsTitle}>Password harus:</Text>
          <Text style={styles.requirementItem}>• Minimal 8 karakter</Text>
          <Text style={styles.requirementItem}>• Mengandung huruf besar</Text>
          <Text style={styles.requirementItem}>• Mengandung huruf kecil</Text>
          <Text style={styles.requirementItem}>• Mengandung angka</Text>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: brandColor }]}
          onPress={handleChangePassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Simpan Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formField: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  eyeButton: {
    padding: 10,
  },
  requirementsContainer: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  requirementItem: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  saveButton: {
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});