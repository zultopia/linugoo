import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, ScrollView, Dimensions, ImageBackground, Platform } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 768;

const DashboardPage = () => {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    if (route === '/(tabs)/profile') {
      router.push('/profile');
    } else if (route === '/jurnal') {
      router.push('/(teacher)/jurnal');
    } else if (route === '/data-siswa') {
      router.push('/(teacher)/data-siswa');
    } else {
      // Fall back to using the route as is with type assertion
      router.push(route as any);
    }
  };

  const handleLogout = () => {
    // Handle logout logic here
    router.replace('/(auth)/login');
  };

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
            onPress={() => handleNavigation('/jurnal')}
          >
            <Text style={styles.navLinkText}>Jurnal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navLink}
            onPress={() => handleNavigation('/data-siswa')}
          >
            <Text style={styles.navLinkText}>Data Siswa</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => handleNavigation('/(tabs)/profile')}
          >
            <Image 
              source={require("../../assets/images/profile-placeholder.svg")}
              style={styles.profileIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <ImageBackground 
          source={require("../../assets/images/background.svg")} 
          style={styles.backgroundPattern}
          resizeMode="cover"
        >
          <View style={styles.contentContainer}>
            {/* Welcome Header */}
            <View style={styles.welcomeContainer}>
              <View>
                <Text style={styles.welcomeText}>Selamat Datang di</Text>
                <Text style={styles.brandText}>linugoo</Text>
              </View>
            </View>

            {/* Card Options */}
            <View style={styles.cardsContainer}>
              <TouchableOpacity 
                style={styles.cardJurnal}
                onPress={() => handleNavigation('/jurnal')}
              >
                <Image 
                  source={require("../../assets/images/journal-icon.svg")} 
                  style={styles.cardIcon}
                />
                <Text style={styles.cardText}>Jurnal</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cardSiswa}
                onPress={() => handleNavigation('/data-siswa')}
              >
                <Image 
                  source={require("../../assets/images/student-icon.svg")} 
                  style={styles.cardIcon}
                />
                <Text style={styles.cardText}>Data Siswa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF5E0',
  },
  scrollView: {
    flex: 1,
  },
  backgroundPattern: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
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
    // Replace shadow properties with boxShadow
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
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DDDDDD',
  },
  welcomeContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#14213D',
  },
  brandText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#C70039',
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
    // Replace shadow properties with boxShadow
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
    // Replace shadow properties with boxShadow
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
  cardIcon: {
    width: 80,
    height: 80,
    tintColor: '#FFF5E0',
    marginBottom: 20,
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default DashboardPage;