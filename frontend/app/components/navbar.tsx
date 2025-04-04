import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

interface NavbarProps {
  currentRoute?: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentRoute }) => {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    // Use router.push() with type assertion to handle string routes
    router.push(route as any);
  };

  return (
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
          style={[
            styles.navLink,
            currentRoute === 'jurnal' && styles.activeNavLink
          ]}
          onPress={() => handleNavigation('/jurnal')}
        >
          <Text style={[
            styles.navLinkText,
            currentRoute === 'jurnal' && styles.activeNavLinkText
          ]}>Jurnal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.navLink,
            currentRoute === 'data-siswa' && styles.activeNavLink
          ]}
          onPress={() => handleNavigation('/data-siswa')}
        >
          <Text style={[
            styles.navLinkText,
            currentRoute === 'data-siswa' && styles.activeNavLinkText
          ]}>Data Siswa</Text>
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
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
    paddingVertical: 5,
  },
  activeNavLink: {
    borderBottomWidth: 2,
    borderBottomColor: '#C70039',
  },
  navLinkText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  activeNavLinkText: {
    color: '#C70039',
    fontWeight: 'bold',
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
});

export default Navbar;