import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../../routes";

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Kiểm tra email hợp lệ
  const isValidEmail = email.includes("@") && email.includes(".");

  // Xử lý gửi yêu cầu khôi phục mật khẩu
  const handleResetPassword = () => {
    if (!isValidEmail) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "Email Sent",
        "If this email exists, you will receive reset instructions."
      );
      navigation.navigate(ROUTES.LOGIN);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate(ROUTES.LOGIN)}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email and we will send you instructions to reset your
        password.
      </Text>

      {/* Nhập email */}
      <TextInput
        placeholder="Enter your email"
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Nút gửi yêu cầu khôi phục mật khẩu */}
      <TouchableOpacity
        style={[styles.resetButton, { backgroundColor: isValidEmail ? "#007AFF" : "gray" }]}
        disabled={!isValidEmail || isLoading}
        onPress={handleResetPassword}
      >
        <Text style={styles.resetText}>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "gray",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
  resetButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  resetText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
