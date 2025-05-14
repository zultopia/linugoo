import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Platform,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
  Alert
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Feather"; 
import { useRouter } from 'expo-router';
import { useAuth } from "../../context/AuthContext";

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 768;

const API_URL = process.env.API_URL || 'http://192.168.1.105:5000';

const LoginPage = () => {
  const router = useRouter();
  const { login, isLoading, user } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ emailOrUsername: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);

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
  
  const testConnection = async () => {
    try {
      const response = await fetch(`${API_URL}/api/test`);
      const data = await response.json();
      console.log('Test response:', data);
      Alert.alert('Koneksi Berhasil', data.message);
    } catch (error) {
      console.error('Test error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('Koneksi Gagal', errorMessage);
    }
  };

  const handleLogin = async () => {
    // Reset error state before login
    setError({ emailOrUsername: "", password: "" });

    // Validate form input
    if (!emailOrUsername || !password) {
      setError({
        emailOrUsername: !emailOrUsername ? "Email/Username is required" : "",
        password: !password ? "Password is required" : "",
      });
      return;
    }

    // Call login function from auth context
    const result = await login(emailOrUsername, password);

    if (!result.success) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Login Failed",
        text2: result.message,
      });
    } else {
      Toast.show({
        type: "success",
        position: "top",
        text1: "Login Successful",
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

          {/* Right Side (Login Form) */}
          <View style={styles.rightSide}>
            <View style={styles.loginBox}>
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
                  <Text style={styles.signInText}>Sign in</Text>
                </View>
                {!isSmallDevice && (
                  <Image 
                    source={require("../../assets/images/owl-fly.png")} 
                    style={styles.welcomeOwlImage} 
                    resizeMode="contain"
                  />
                )}
              </View>

              <TouchableOpacity style={styles.googleButton} onPress={testConnection}>
                <Image 
                  source={require("../../assets/images/google-icon.png")} 
                  style={styles.googleIcon} 
                />
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
              </TouchableOpacity>

              <View style={styles.separatorContainer}>
                <View style={styles.separator} />
                <Text style={styles.separatorText}>atau</Text>
                <View style={styles.separator} />
              </View>

              <Text style={styles.inputLabel}>
                Masukan username atau alamat email anda
              </Text>
              <TextInput
                placeholder="Username or email address"
                style={styles.input}
                value={emailOrUsername}
                onChangeText={setEmailOrUsername}
                editable={!isLoading}
              />
              {error.emailOrUsername ? (
                <Text style={styles.errorText}>{error.emailOrUsername}</Text>
              ) : null}

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

              <Text style={styles.forgotPassword}>Forgot Password</Text>

              <TouchableOpacity 
                style={[styles.signInButton, isLoading && styles.signInButtonDisabled]} 
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.signInButtonText}>Sign in</Text>
                )}
              </TouchableOpacity>

              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>
                  No Account? {" "}
                </Text>
                <TouchableOpacity onPress={() => router.replace('/(auth)/register')} disabled={isLoading}>
                  <Text style={styles.signUpLink}>Sign up</Text>
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
    backgroundColor: '#FFF5E0', 
  },
  leftSide: { 
    flex: 1, 
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    position: "relative",
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
  },
  mobileHeader: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  loginBox: { 
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
  signInText: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#000",
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  googleButton: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: "#f7f9fc", 
    padding: 12, 
    borderRadius: 5, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e1e3e8",
  },
  googleIcon: { 
    width: 20, 
    height: 20, 
    marginRight: 10 
  },
  googleButtonText: { 
    fontSize: 16, 
    color: "#5f6368",
  },
  separatorContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginVertical: 20,
  },
  separator: { 
    flex: 1, 
    height: 1, 
    backgroundColor: "#e1e3e8" 
  },
  separatorText: { 
    marginHorizontal: 10, 
    color: "#777",
    fontSize: 14,
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
  forgotPassword: { 
    alignSelf: "flex-end", 
    color: "#3498db", 
    marginBottom: 25,
    fontSize: 14,
  },
  signInButton: { 
    backgroundColor: "#a02226", 
    padding: 15, 
    borderRadius: 5, 
    alignItems: "center",
    marginBottom: 15,
  },
  signInButtonDisabled: {
    backgroundColor: "#d77a7e",
  },
  signInButtonText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: { 
    color: "#555",
    fontSize: 14,
  },
  signUpLink: { 
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

export default LoginPage;