import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, ScrollView, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 768;

// Interface for student data
interface Student {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
}

const DashboardPage = () => {
  const router = useRouter();
  const { user, token, logout, isLoading: authLoading } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect non-teachers to appropriate page
  useEffect(() => {
    if (!authLoading && user && user.role !== 'Guru') {
      router.replace('/(games)/base');
    }
  }, [user, authLoading]);

  // Fetch students from the backend
  useEffect(() => {
    const fetchStudents = async () => {
      if (!token) return;
      
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/users/students', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setStudents(data.students || []);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudents();
  }, [token]);

  const handleNavigation = (route: string) => {
    if (route === 'profile') {
      router.push('/(tabs)/profile');
    } else if (route === 'jurnal') {
      router.push('/(teacher)/jurnal');
    } else if (route === 'data-siswa') {
      router.push('/(teacher)/data-siswa');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Router navigation is handled inside the logout function
    } catch (error) {
      console.error('Error saat logout:', error);
      router.replace('/(auth)/login');
    }
  };

  if (authLoading || (user && user.role !== 'Guru')) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C70039" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/owl-academic.png")}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoText}>linugoo</Text>
            <Text style={styles.logoSubtext}>untuk guru</Text>
          </View>
        </View>

        <View style={styles.navLinksContainer}>
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
            style={styles.profileButton}
            onPress={() => handleNavigation('profile')}
          >
            <View style={styles.profileIcon}>
              <Text style={styles.profileInitials}>
                {user?.name ? user.name.substring(0, 1).toUpperCase() : '?'}
              </Text>
            </View>
          </TouchableOpacity>
          
          {/* Logout Button in Navbar */}
          <TouchableOpacity 
            style={styles.logoutButtonNav}
            onPress={handleLogout}
          >
            <Image 
              source={require('../../assets/images/logout.png')} 
              style={styles.logoutIcon} 
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.backgroundPattern}>
          <View style={styles.contentContainer}>
            {/* Welcome Header */}
            <View style={styles.welcomeContainer}>
              <View>
                <Text style={styles.welcomeText}>Selamat Datang di</Text>
                <Text style={styles.brandText}>linugoo</Text>
                {user?.name && (
                  <Text style={styles.teacherName}>Guru {user.name}</Text>
                )}
              </View>
            </View>

            {/* Card Options */}
            <View style={styles.cardsContainer}>
              <TouchableOpacity 
                style={styles.cardJurnal}
                onPress={() => handleNavigation('jurnal')}
              >
                <View style={styles.cardIconPlaceholder}>
                  <Text style={styles.cardIconText}>📝</Text>
                </View>
                <Text style={styles.cardText}>Jurnal</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cardSiswa}
                onPress={() => handleNavigation('data-siswa')}
              >
                <View style={styles.cardIconPlaceholder}>
                  <Text style={styles.cardIconText}>👨‍🎓</Text>
                </View>
                <Text style={styles.cardText}>Data Siswa</Text>
              </TouchableOpacity>
            </View>

            {/* Stats Section */}
            <View style={styles.statsContainer}>
              <Text style={styles.statsTitle}>Statistik Kelas</Text>
              
              <View style={styles.statsCardsContainer}>
                <View style={styles.statsCard}>
                  <Text style={styles.statsNumber}>{students.length}</Text>
                  <Text style={styles.statsLabel}>Total Siswa</Text>
                </View>
                
                <View style={styles.statsCard}>
                  <Text style={styles.statsNumber}>15</Text>
                  <Text style={styles.statsLabel}>Aktif Bulan Ini</Text>
                </View>
                
                <View style={styles.statsCard}>
                  <Text style={styles.statsNumber}>75%</Text>
                  <Text style={styles.statsLabel}>Tingkat Kelulusan</Text>
                </View>
              </View>
            </View>

            {/* Removed logout button from here */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF5E0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5E0',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
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
    color: '#C70039',
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
    marginHorizontal: 15,
  },
  navLinkText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  profileButton: {
    marginLeft: 15,
    marginRight: 10,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#C70039',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoutButtonNav: {
    marginLeft: 5,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8d7da',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIcon: {
    width: 24,
    height: 24,
  },
  scrollView: {
    flex: 1,
  },
  backgroundPattern: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFF5E0',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  welcomeContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#14213D',
  },
  brandText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#C70039',
  },
  teacherName: {
    fontSize: 18,
    color: '#555',
    marginTop: 10,
  },
  cardsContainer: {
    flexDirection: isSmallDevice ? 'column' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 20,
  },
  cardJurnal: {
    backgroundColor: '#14213D',
    borderRadius: 15,
    padding: 40,
    width: isSmallDevice ? '100%' : 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  cardSiswa: {
    backgroundColor: '#C70039',
    borderRadius: 15,
    padding: 40,
    width: isSmallDevice ? '100%' : 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  cardIconPlaceholder: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardIconText: {
    fontSize: 40,
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginTop: 30,
    marginBottom: 20,
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
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  statsCardsContainer: {
    flexDirection: isSmallDevice ? 'column' : 'row',
    justifyContent: 'space-between',
  },
  statsCard: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 10,
    width: isSmallDevice ? '100%' : '30%',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 15 : 0,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#C70039',
    marginBottom: 5,
  },
  statsLabel: {
    fontSize: 14,
    color: '#555',
  },
  // Kept the style for reference but not using it anymore in this component
  logoutButton: {
    backgroundColor: '#C70039',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardPage;