import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  ImageBackground
} from 'react-native';
import Icon from "react-native-vector-icons/Feather";
import { useRouter } from 'expo-router';
import Toast from "react-native-toast-message";
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 768;

const RegisterPage = () => {
  const router = useRouter();
  const { register, isLoading, user } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState({
    username: '',
    email: '',
    name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'Guru') {
        router.replace('/(teacher)/dashboard');
      } else {
        router.replace('/(games)/base');
      }
    }
  }, [user]);

  const handleRegister = async () => {
    // Reset errors
    setError({
      username: '',
      email: '',
      name: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });

    // Validate inputs
    let hasError = false;
    let newErrors = {
      username: '',
      email: '',
      name: '',
      phone: '',
      password: '',
      confirmPassword: ''
    };

    if (!username) {
      newErrors.username = 'Username is required';
      hasError = true;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      hasError = true;
    }

    if (!name) {
      newErrors.name = 'Full name is required';
      hasError = true;
    }

    if (!phone) {
      newErrors.phone = 'Phone number is required';
      hasError = true;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      hasError = true;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasError = true;
    }

    if (hasError) {
      setError(newErrors);
      return;
    }

    // Call register function from auth context
    const result = await register(username, email, name, phone, password);
    
    if (result.success) {
      // Show success message
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Registration Successful',
        text2: 'You can now login with your credentials',
      });
      
      // Navigate to login page after successful registration
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 1500);
    } else {
      // Handle API error
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Registration Failed',
        text2: result.message || 'Please try again later',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* Background */}
          <View style={styles.backgroundContainer}>
            <ImageBackground 
              source={require("../../assets/images/background.svg")} 
              style={styles.backgroundTop}
              imageStyle={{ opacity: 0.7 }}
            />
            <View style={styles.backgroundBottom} />
          </View>
          
          {/* Left Side */}
          {!isSmallDevice && (
            <View style={styles.leftSide}>
              <View style={styles.leftContent}>
                <View style={styles.brandContainer}>
                  <Image 
                    source={require("../../assets/images/linugoo.svg")} 
                    style={styles.logoImage} 
                    resizeMode="contain"
                  />
                  <Image 
                    source={require("../../assets/images/owl-academic.png")} 
                    style={styles.owlImage} 
                    resizeMode="contain"
                  />
                </View>
              </View>
              <Image 
                source={require("../../assets/images/owl-wood.svg")} 
                style={styles.bottomOwlImage} 
                resizeMode="contain"
              />
            </View>
          )}

          {/* Right Side (Register Form) */}
          <View style={styles.rightSide}>
            <View style={styles.registerBox}>
              {isSmallDevice && (
                <View style={styles.mobileHeader}>
                  <Image 
                    source={require("../../assets/images/linugoo.svg")} 
                    style={styles.mobileLogoImage} 
                    resizeMode="contain"
                  />
                </View>
              )}
              
              <View style={styles.welcomeHeader}>
                <View>
                  <View style={styles.welcomeTextRow}>
                    <Text style={styles.welcomeText}>Welcome to </Text>
                    <Image 
                      source={require("../../assets/images/linugoo.svg")} 
                      style={styles.welcomeLogoImage} 
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.signUpText}>Sign up</Text>
                </View>
                {!isSmallDevice && (
                  <Image 
                    source={require("../../assets/images/owl-fly.png")} 
                    style={styles.welcomeOwlImage} 
                    resizeMode="contain"
                  />
                )}
              </View>

              {/* Username Input */}
              <Text style={styles.inputLabel}>
                Masukan username anda
              </Text>
              <TextInput
                placeholder="Username"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                editable={!isLoading}
              />
              {error.username ? (
                <Text style={styles.errorText}>{error.username}</Text>
              ) : null}

              {/* Full Name Input */}
              <Text style={styles.inputLabel}>
                Masukan nama lengkap anda
              </Text>
              <TextInput
                placeholder="Full Name"
                style={styles.input}
                value={name}
                onChangeText={setName}
                editable={!isLoading}
              />
              {error.name ? (
                <Text style={styles.errorText}>{error.name}</Text>
              ) : null}

              {/* Email Input */}
              <Text style={styles.inputLabel}>
                Masukan alamat email anda
              </Text>
              <TextInput
                placeholder="Email address"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
              {error.email ? (
                <Text style={styles.errorText}>{error.email}</Text>
              ) : null}

              {/* Phone Input */}
              <Text style={styles.inputLabel}>
                Masukan nomor telepon anda
              </Text>
              <TextInput
                placeholder="Phone Number"
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                editable={!isLoading}
              />
              {error.phone ? (
                <Text style={styles.errorText}>{error.phone}</Text>
              ) : null}

              {/* Password Input */}
              <Text style={styles.inputLabel}>
                Masukan password anda
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Password"
                  secureTextEntry={!passwordVisible}
                  style={[styles.input, styles.passwordInput]}
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon} 
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  disabled={isLoading}
                >
                  <Icon 
                    name={passwordVisible ? "eye-off" : "eye"} 
                    size={20} 
                    color="gray" 
                  />
                </TouchableOpacity>
              </View>
              {error.password ? (
                <Text style={styles.errorText}>{error.password}</Text>
              ) : null}

              {/* Confirm Password Input */}
              <Text style={styles.inputLabel}>
                Konfirmasi password anda
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Confirm Password"
                  secureTextEntry={!confirmPasswordVisible}
                  style={[styles.input, styles.passwordInput]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon} 
                  onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  disabled={isLoading}
                >
                  <Icon 
                    name={confirmPasswordVisible ? "eye-off" : "eye"} 
                    size={20} 
                    color="gray" 
                  />
                </TouchableOpacity>
              </View>
              {error.confirmPassword ? (
                <Text style={styles.errorText}>{error.confirmPassword}</Text>
              ) : null}

              <TouchableOpacity 
                style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]} 
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.signUpButtonText}>Sign up</Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>
                  Already have an account? {" "}
                </Text>
                <TouchableOpacity onPress={() => router.replace('/(auth)/login')} disabled={isLoading}>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Toast component */}
      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    flexDirection: "row",
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#C70039',
  },
  backgroundBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#FFF5E0', // Cream color for bottom half
  },
  leftSide: { 
    flex: 1, 
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    position: "relative",
    zIndex: 1,
  },
  leftContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "center",
  },
  logoImage: {
    width: 400,
    height: 120,
    tintColor: "#FFF5E0",
  },
  welcomeTextRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeLogoImage: {
    width: 70,
    height: 20,
    tintColor: "#C70039",
  },
  mobileLogoImage: {
    width: 150,
    height: 40,
    tintColor: "#a02226",
  },
  owlImage: { 
    width: 150, 
    height: 150, 
    marginTop: 20,
  },
  bottomOwlImage: {
    width: 350, 
    height: 350,
    left: -20,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  rightSide: { 
    flex: 1.2, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20,
    zIndex: 1,
  },
  mobileHeader: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  registerBox: { 
    width: "100%", 
    maxWidth: 450,
    backgroundColor: "white", 
    padding: 30, 
    borderRadius: 10, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
    shadowRadius: 5,
    elevation: 3,
  },
  welcomeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: { 
    fontSize: 16, 
    marginBottom: 5, 
    color: "#333",
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    alignSelf: "center",
  },
  welcomeOwlImage: {
    width: 100,
    height: 100,
  },
  signUpText: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#000",
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  inputLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  input: { 
    width: "100%", 
    padding: 12,
    paddingLeft: 15, 
    borderWidth: 1, 
    borderColor: "#ddd", 
    borderRadius: 5, 
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
  },
  passwordContainer: { 
    width: "100%",
    position: "relative",
    marginBottom: 5,
  },
  passwordInput: {
    paddingRight: 45,
    marginBottom: 5,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 13,
  },
  signUpButton: { 
    backgroundColor: "#a02226", 
    padding: 15, 
    borderRadius: 5, 
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  signUpButtonDisabled: {
    backgroundColor: "#d77a7e",
  },
  signUpButtonText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: { 
    color: "#555",
    fontSize: 14,
  },
  loginLink: { 
    color: "#3498db",
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: { 
    color: "red", 
    fontSize: 12, 
    marginTop: -15,
    marginBottom: 15,
  },
});

export default RegisterPage;