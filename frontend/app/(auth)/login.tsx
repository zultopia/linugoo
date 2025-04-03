import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Platform } from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Feather"; 
import { useRouter } from 'expo-router';

const LoginPage = () => {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ emailOrUsername: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false); // Untuk toggle password visibility

  const handleLogin = async () => {
    // Reset error state sebelum login
    setError({ emailOrUsername: "", password: "" });

    // Validasi form input
    if (!emailOrUsername || !password) {
      setError({
        emailOrUsername: !emailOrUsername ? "Email/Username is required" : "",
        password: !password ? "Password is required" : "",
      });
      return;
    }

    // Menyiapkan payload untuk API
    const requestBody = {
      emailOrUsername,
      password,
    };

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.status === 200) {
        router.push('/dashboard');

        Toast.show({
          type: "success",
          position: "top",
          text1: "Login Successful",
        });
      } else {
        // Jika login gagal
        Toast.show({
          type: "error",
          position: "top",
          text1: "Login Failed",
          text2: data.message || "Invalid credentials",
        });
      }
    } catch (error) {
      // Menampilkan toast error jika ada masalah dengan request API
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Left Side */}
      <View style={styles.leftSide}>
        <Text style={styles.logo}>lingu<Text style={styles.highlight}>oo</Text></Text>
        <Image source={require("../../assets/images/owl-academic.png")} style={styles.owlImage} />
      </View>

      {/* Right Side (Login Form) */}
      <View style={styles.rightSide}>
        <View style={styles.loginBox}>
          <Text style={styles.welcomeText}>Welcome to <Text style={styles.highlight}>linguoo</Text></Text>
          <Text style={styles.signInText}>Sign in</Text>

          <TouchableOpacity style={styles.googleButton}>
            <Image source={require("../../assets/images/google-icon.png")} style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>

          <View style={styles.separatorContainer}>
            <View style={styles.separator} />
            <Text style={styles.separatorText}>atau</Text>
            <View style={styles.separator} />
          </View>

          {/* Input Username or Email */}
          <TextInput
            placeholder="Username or email address"
            style={styles.input}
            value={emailOrUsername}
            onChangeText={setEmailOrUsername}
          />
          {error.emailOrUsername ? <Text style={styles.errorText}>{error.emailOrUsername}</Text> : null}

          {/* Input Password */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              secureTextEntry={!passwordVisible}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Icon name={passwordVisible ? "eye-off" : "eye"} size={24} color="gray" />
            </TouchableOpacity>
          </View>
          {error.password ? <Text style={styles.errorText}>{error.password}</Text> : null}

          <Text style={styles.forgotPassword}>Forgot Password</Text>

          {/* Sign In Button */}
          <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
            <Text style={styles.signInButtonText}>Sign in</Text>
          </TouchableOpacity>

          <Text style={styles.signUpText}>No Account? <Text style={styles.signUpLink}>Sign up</Text></Text>
        </View>
      </View>

      {/* Toast component */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", backgroundColor: "#a02226" },
  leftSide: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  logo: { fontSize: 50, fontWeight: "bold", color: "white" },
  highlight: { color: "#f8b400" },
  owlImage: { width: 100, height: 100, marginTop: 10 },
  rightSide: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f2eb", borderTopLeftRadius: 30, borderBottomLeftRadius: 30 },
  loginBox: { width: 300, backgroundColor: "white", padding: 20, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5 },
  welcomeText: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "black" },
  signInText: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  googleButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#eee", padding: 10, borderRadius: 5, marginBottom: 10 },
  googleIcon: { width: 20, height: 20, marginRight: 10 },
  googleButtonText: { fontSize: 16 },
  separatorContainer: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  separator: { flex: 1, height: 1, backgroundColor: "gray" },
  separatorText: { marginHorizontal: 10, color: "gray" },
  input: { width: "100%", padding: 10, borderWidth: 1, borderColor: "gray", borderRadius: 5, marginBottom: 10 },
  passwordContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  forgotPassword: { alignSelf: "flex-end", color: "blue", marginBottom: 10 },
  signInButton: { backgroundColor: "#a02226", padding: 10, borderRadius: 5, alignItems: "center" },
  signInButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  signUpText: { textAlign: "center", marginTop: 10 },
  signUpLink: { color: "blue" },
  errorText: { color: "red", fontSize: 12, marginBottom: 10 },
});

export default LoginPage;