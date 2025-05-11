import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, Dimensions, Modal } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

interface NavbarProps {
  onNavigate?: (route: string) => void;
}

const Navbar = ({ onNavigate }: NavbarProps) => {
  const router = useRouter();
  const { user, logout, getProfile } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 768;

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, []);

  const isActive = (route: string) => {
    if (route === 'jurnal' && pathname.includes('jurnal')) {
      return true;
    }
    if (route === 'data-siswa' && pathname.includes('data-siswa')) {
      return true;
    }
    if (route === 'profile' && pathname.includes('profile')) {
      return true;
    }
    return false;
  };

  const handleNavigation = (route: string) => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
    
    if (onNavigate) {
      onNavigate(route);
    } else {
      if (route === 'profile') {
        router.push('/(tabs)/profile');
      } else if (route === 'jurnal') {
        router.push('/(teacher)/jurnal');
      } else if (route === 'data-siswa') {
        router.push('/(teacher)/data-siswa');
      }
    }
  };

  const handleLogout = async () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
    
    try {
      await logout();
    } catch (error) {
      console.error('Error saat logout:', error);
      router.replace('/(auth)/login');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const renderMobileMenu = () => {
    return (
      <View style={styles.mobileNavbar}>
        <View style={styles.mobileLogoContainer}>
          <Image
            source={require("../../assets/images/owl-academic.png")}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={() => router.push('/(teacher)/dashboard')}>
            <View style={styles.logoTextContainer}>
              <Text style={styles.logoText}>linugoo</Text>
              <Text style={styles.logoSubtext}>untuk guru</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={toggleMobileMenu} style={styles.hamburgerButton}>
          <Ionicons name="menu" size={24} color="#333333" />
        </TouchableOpacity>

        {mobileMenuOpen && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={mobileMenuOpen}
            onRequestClose={() => setMobileMenuOpen(false)}
          >
            <View style={styles.mobileMenuContainer}>
              <View style={styles.mobileMenu}>
                <View style={styles.mobileMenuHeader}>
                  <Text style={styles.mobileMenuTitle}>Menu</Text>
                  <TouchableOpacity onPress={toggleMobileMenu} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#333333" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.mobileMenuContent}>
                  <TouchableOpacity 
                    style={[styles.mobileNavLink, isActive('jurnal') && styles.activeMobileNavLink]}
                    onPress={() => handleNavigation('jurnal')}
                  >
                    <Text style={[styles.mobileNavLinkText, isActive('jurnal') && styles.activeMobileNavLinkText]}>
                      Jurnal
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.mobileNavLink, isActive('data-siswa') && styles.activeMobileNavLink]}
                    onPress={() => handleNavigation('data-siswa')}
                  >
                    <Text style={[styles.mobileNavLinkText, isActive('data-siswa') && styles.activeMobileNavLinkText]}>
                      Data Siswa
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.mobileNavLink, isActive('profile') && styles.activeMobileNavLink]}
                    onPress={() => handleNavigation('profile')}
                  >
                    <Text style={[styles.mobileNavLinkText, isActive('profile') && styles.activeMobileNavLinkText]}>
                      Profil
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.mobileLogoutButton}
                    onPress={handleLogout}
                  >
                    <Ionicons name="log-out-outline" size={24} color="#721c24" />
                    <Text style={styles.mobileLogoutText}>Keluar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    );
  };

  const renderDesktopMenu = () => {
    return (
      <View style={styles.navbar}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/owl-academic.png")}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={() => router.push('/(teacher)/dashboard')}>
            <View style={styles.logoTextContainer}>
              <Text style={styles.logoText}>linugoo</Text>
              <Text style={styles.logoSubtext}>untuk guru</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.navLinksContainer}>
          <TouchableOpacity 
            style={styles.navLink}
            onPress={() => handleNavigation('jurnal')}
          >
            <Text style={[
              styles.navLinkText, 
              isActive('jurnal') && styles.activeNavLinkText
            ]}>
              Jurnal
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navLink}
            onPress={() => handleNavigation('data-siswa')}
          >
            <Text style={[
              styles.navLinkText, 
              isActive('data-siswa') && styles.activeNavLinkText
            ]}>
              Data Siswa
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => handleNavigation('profile')}
          >
            {user?.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileIcon}>
                <Text style={styles.profileInitials}>
                  {user?.name ? user.name.substring(0, 1).toUpperCase() : '?'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.logoutButtonNav}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#721c24" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return isMobile ? renderMobileMenu() : renderDesktopMenu();
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
    borderRadius: 10,
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
  activeNavLinkText: {
    color: '#C70039',
    fontWeight: 'bold',
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
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  logoutButtonNav: {
    marginLeft: 5,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8d7da',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  mobileNavbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
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
  mobileLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hamburgerButton: {
    padding: 8,
  },
  hamburgerLine: {
    width: 25,
    height: 2,
    backgroundColor: '#333333',
    marginVertical: 2,
  },
  mobileMenuContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  mobileMenu: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    minHeight: '50%',
  },
  mobileMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  mobileMenuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mobileMenuContent: {
    padding: 20,
  },
  mobileNavLink: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  activeMobileNavLink: {
    borderLeftWidth: 3,
    borderLeftColor: '#C70039',
    paddingLeft: 10,
  },
  mobileNavLinkText: {
    fontSize: 16,
    color: '#333333',
  },
  activeMobileNavLinkText: {
    color: '#C70039',
    fontWeight: 'bold',
  },
  mobileLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8d7da',
    borderRadius: 8,
  },
  mobileLogoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#721c24',
    fontWeight: '500',
  },
});

export default Navbar;