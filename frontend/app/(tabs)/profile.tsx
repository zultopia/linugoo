'use client';

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 768;

const API_URL = process.env.API_URL || 'http://192.168.1.105:5000';

interface ProfileData {
  id: string;
  username: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  profileImage?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { token, logout, isLoading: authLoading, user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        console.log('No token available for profile fetch');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        console.log('Fetching profile with token:', token);
        console.log('Using API URL:', API_URL);
        
        const response = await fetch(`${API_URL}/api/users/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Profile response status:', response.status);
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const data = await response.json();
        console.log('Profile data:', data);
        setProfileData(data.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [token]);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      // Navigation is handled in logout function
    } catch (error) {
      console.error('Logout error:', error);
      router.replace('/(auth)/login');
    }
  };

  // Handle navigation
  const handleNavigation = (route: string) => {
    if (profileData?.role === 'Guru') {
      if (route === 'dashboard') {
        router.push('/(teacher)/dashboard');
      } else if (route === 'jurnal') {
        router.push('/(teacher)/jurnal');
      } else if (route === 'data-siswa') {
        router.push('/(teacher)/data-siswa');
      }
    } else {
      router.push('/(games)/base');
    }
  };

  // Handle retry
  const handleRetry = () => {
    setError(null);
    // Re-fetch profile
    const fetchProfile = async () => {
      if (!token) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/users/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const data = await response.json();
        setProfileData(data.user);
        setError(null);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  };

  if (authLoading || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={profileData?.role === 'Guru' ? '#C70039' : '#E30425'} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  const brandColor = profileData?.role === 'Guru' ? '#C70039' : '#E30425';
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Navbar - Similar to Dashboard for consistency */}
      <View style={[styles.navbar, { backgroundColor: profileData?.role === 'Guru' ? '#FFFFFF' : '#FFFFFF' }]}>
        <View style={styles.logoContainer}>
          <Image
            source={profileData?.role === 'Guru' 
              ? require('../../assets/images/owl-academic.png')
              : require('../../assets/images/lino.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          <View style={styles.logoTextContainer}>
            <Text style={[styles.logoText, { color: brandColor }]}>linugoo</Text>
            <Text style={styles.logoSubtext}>
              {profileData?.role === 'Guru' ? 'untuk guru' : 'untuk siswa'}
            </Text>
          </View>
        </View>

        {profileData?.role === 'Guru' ? (
          <View style={styles.navLinksContainer}>
            <TouchableOpacity 
              style={styles.navLink}
              onPress={() => handleNavigation('dashboard')}
            >
              <Text style={styles.navLinkText}>Dashboard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.navLink}
              onPress={() => handleNavigation('jurnal')}
            >
              <Text style={styles.navLinkText}>Jurnal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.navLink}
              onPress={() => handleNavigation('data-siswa')}
            >
              <Text style={styles.navLinkText}>Data Siswa</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.logoutButtonNav}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color="#721c24" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.navIcons}>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => handleNavigation('home')}
            >
              <Image 
                source={require('../../assets/images/lino.png')} 
                style={styles.icon} 
                resizeMode="contain"
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color="#721c24" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <ScrollView 
        style={[
          styles.scrollView, 
          { backgroundColor: profileData?.role === 'Guru' ? '#FFF5E0' : '#E1F5F5' }
        ]}
        contentContainerStyle={styles.scrollContent}
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: brandColor }]}
              onPress={handleRetry}
            >
              <Text style={styles.retryButtonText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
              <View style={styles.profileAvatarContainer}>
                {profileData?.profileImage ? (
                  <Image
                    source={{ uri: profileData.profileImage }}
                    style={styles.profileAvatar}
                  />
                ) : (
                  <View style={[styles.profileAvatar, { backgroundColor: brandColor }]}>
                    <Text style={styles.profileInitials}>
                      {profileData?.name ? profileData.name.substring(0, 1).toUpperCase() : '?'}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.profileName}>{profileData?.name || 'User Name'}</Text>
              <Text style={styles.profileRole}>{profileData?.role || 'Role'}</Text>
            </View>
            
            {/* Profile Info Card */}
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Informasi Pribadi</Text>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Username</Text>
                  <Text style={styles.infoValue}>{profileData?.username || '-'}</Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{profileData?.email || '-'}</Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Nomor Telepon</Text>
                  <Text style={styles.infoValue}>{profileData?.phone || '-'}</Text>
                </View>
              </View>
            </View>
            
            {/* Stats for Students */}
            {profileData?.role === 'Siswa' && (
              <View style={styles.cardContainer}>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Statistik Pembelajaran</Text>
                  
                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: brandColor }]}>12</Text>
                      <Text style={styles.statLabel}>Pelajaran Selesai</Text>
                    </View>
                    
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: brandColor }]}>86%</Text>
                      <Text style={styles.statLabel}>Rata-rata Nilai</Text>
                    </View>
                    
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: brandColor }]}>5</Text>
                      <Text style={styles.statLabel}>Penghargaan</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
            
            {/* Stats for Teachers */}
            {profileData?.role === 'Guru' && (
              <View style={styles.cardContainer}>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Statistik Mengajar</Text>
                  
                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: brandColor }]}>25</Text>
                      <Text style={styles.statLabel}>Total Siswa</Text>
                    </View>
                    
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: brandColor }]}>18</Text>
                      <Text style={styles.statLabel}>Aktif Bulan Ini</Text>
                    </View>
                    
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: brandColor }]}>8</Text>
                      <Text style={styles.statLabel}>Jumlah Kelas</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
            
            {/* Settings Card */}
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Pengaturan</Text>
                
                <TouchableOpacity 
                  style={styles.settingItem}
                  onPress={() => {
                    if (profileData?.role === 'Guru') {
                      router.push('/(teacher)/edit-profile');
                    } else {
                      router.push('/(teacher)/edit-profile');
                    }
                  }}
                >
                  <Ionicons name="person-outline" size={24} color="#333" />
                  <Text style={styles.settingText}>Ubah Profil</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.settingItem}
                  onPress={() => {
                    if (profileData?.role === 'Guru') {
                      router.push('/(teacher)/change-password');
                    } else {
                      router.push('/(teacher)/change-password');
                    }
                  }}
                >
                  <Ionicons name="lock-closed-outline" size={24} color="#333" />
                  <Text style={styles.settingText}>Ubah Password</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.settingItem}
                  onPress={() => {
                    if (profileData?.role === 'Guru') {
                      router.push('/(teacher)/help');
                    } else {
                      router.push('/(teacher)/help');
                    }
                  }}
                >
                  <Ionicons name="help-circle-outline" size={24} color="#333" />
                  <Text style={styles.settingText}>Bantuan</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.settingItem, styles.logoutItem]}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={24} color={brandColor} />
                  <Text style={[styles.settingText, { color: brandColor }]}>Keluar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
      },
    }),
    zIndex: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  logoTextContainer: {
    flexDirection: 'column',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoSubtext: {
    color: '#555555',
    fontSize: 12,
    marginTop: -5,
  },
  navLinksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navLink: {
    marginHorizontal: isSmallDevice ? 8 : 15,
  },
  navLinkText: {
    fontSize: isSmallDevice ? 14 : 16,
    color: '#333333',
    fontWeight: '500',
  },
  logoutButtonNav: {
    marginLeft: isSmallDevice ? 8 : 15,
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f8d7da',
  },
  navIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginHorizontal: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileAvatarContainer: {
    marginBottom: 15,
  },
  profileAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileInitials: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileRole: {
    fontSize: 16,
    color: '#666',
  },
  cardContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#555',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: isSmallDevice ? 'column' : 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    padding: 15,
    marginBottom: isSmallDevice ? 10 : 0,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
});