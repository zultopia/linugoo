import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import Icon from "react-native-vector-icons/Feather";

interface StudentNavbarProps {
  title?: string;
}

const StudentNavbar: React.FC<StudentNavbarProps> = ({ title = "Linugoo" }) => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const navigateToProfile = () => {
    router.push('/(tabs)/profile');
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => {
            logout();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.navbar}>
      <View style={styles.leftSection}>
        <Image 
          source={require('../../assets/images/owl-academic.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => router.push('/(games)/base')}>
          <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton} onPress={navigateToProfile}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileInitials}>
              {user?.name ? user.name.substring(0, 1).toUpperCase() : '?'}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
          <Icon name="log-out" size={22} color="#333" />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C70039',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 10,
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#C70039',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default StudentNavbar;