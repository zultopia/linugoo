import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // Validasi dan logika pendaftaran bisa ditambahkan di sini
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Registration Successful!');
    // Proses pendaftaran (misalnya panggil API untuk mendaftar)
  };

  return (
    <View style={styles.container}>
      {/* Left Side */}
      <View style={styles.leftSide}>
        <Text style={styles.logo}>lingu<Text style={styles.highlight}>oo</Text></Text>
        <Image source={require("../../assets/images/owl-academic.png")} style={styles.owlImage} />
      </View>

      {/* Right Side (Register Form) */}
      <View style={styles.rightSide}>
        <View style={styles.registerBox}>
          <Text style={styles.welcomeText}>Welcome to <Text style={styles.highlight}>linguoo</Text></Text>
          <Text style={styles.signUpText}>Sign up</Text>
          
          {/* Form Inputs */}
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
          />
          
          <TouchableOpacity style={styles.signUpButton} onPress={handleRegister}>
            <Text style={styles.signUpButtonText}>Sign up</Text>
          </TouchableOpacity>

          <Text style={styles.haveAccountText}>
            Already have an account? <Text style={styles.loginLink}>Login</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#a02226' },
  leftSide: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { fontSize: 50, fontWeight: 'bold', color: 'white' },
  highlight: { color: '#f8b400' },
  owlImage: { width: 100, height: 100, marginTop: 10 },
  rightSide: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f2eb', borderTopLeftRadius: 30, borderBottomLeftRadius: 30 },
  registerBox: { width: 300, backgroundColor: 'white', padding: 20, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  welcomeText: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'black' },
  signUpText: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: { width: '100%', padding: 10, borderWidth: 1, borderColor: 'gray', borderRadius: 5, marginBottom: 10 },
  signUpButton: { backgroundColor: '#a02226', padding: 10, borderRadius: 5, alignItems: 'center' },
  signUpButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  haveAccountText: { textAlign: 'center', marginTop: 10 },
  loginLink: { color: 'blue' }
});

export default RegisterPage;