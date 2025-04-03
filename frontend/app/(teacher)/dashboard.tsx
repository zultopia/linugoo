import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const DashboardPage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome back to linguoo!</Text>
        <Image
          source={require("../../assets/images/owl-fly.png")}
          style={styles.avatar}
        />
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Your Dashboard</Text>
        <Text style={styles.description}>
          Here you can manage your profile, explore new features, and much more.
        </Text>

        {/* Button to navigate to Profile */}
        <TouchableOpacity style={styles.button} onPress={() => alert('Go to Profile')}>
          <Text style={styles.buttonText}>Go to Profile</Text>
        </TouchableOpacity>

        {/* Button to navigate to Settings */}
        <TouchableOpacity style={styles.button} onPress={() => alert('Go to Settings')}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

        {/* Button to logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => alert('Logging out')}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f2eb' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#a02226',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerText: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  avatar: { width: 50, height: 50, borderRadius: 25 },

  body: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  sectionTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  
  button: {
    backgroundColor: '#a02226',
    padding: 10,
    width: 250,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  logoutButton: {
    backgroundColor: 'gray',
    padding: 10,
    width: 250,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  logoutButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default DashboardPage;