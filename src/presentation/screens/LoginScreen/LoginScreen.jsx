import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
  import { ROUTES } from "@presentation/navigate/routes";

const LoginScreen = () => {
  const navigation = useNavigation(); // Lấy object điều hướng

  // State cho Email, Password & Kiểm soát hiển thị mật khẩu
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Kiểm tra email & password có hợp lệ không
  const isValidEmail = email.includes("@") && email.includes(".");
  const isPasswordValid = password.length >= 6;
  const isFormValid = isValidEmail && isPasswordValid;

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate(ROUTES.HOME_PAGE_SCREEN)}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Login</Text>

      {/* Các nút đăng nhập */}
      <TouchableOpacity style={styles.socialButton}>
        <AntDesign name="google" size={24} color="black" />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <FontAwesome name="facebook" size={24} color="black" />
        <Text style={styles.socialText}>Continue with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <AntDesign name="apple1" size={24} color="black" />
        <Text style={styles.socialText}>Continue with Apple</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      {/* Nhập email */}
      <TextInput
        placeholder="Example@gmail.com"
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Nhập mật khẩu + Nút ẩn/hiện */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          style={styles.passwordInput}
          secureTextEntry={!showPassword} // Ẩn/Hiện mật khẩu
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome
            name={showPassword ? "eye" : "eye-slash"} // Đổi icon
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)}>
      <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>


      {/* Nút đăng nhập (chỉ bấm được khi nhập đúng email & password) */}
      <TouchableOpacity
        style={[styles.loginButton, { backgroundColor: isFormValid ? "#007AFF" : "gray" }]}
        disabled={!isFormValid} // Không bấm được nếu form chưa hợp lệ
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

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
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    justifyContent: "center",
  },
  socialText: {
    marginLeft: 10,
    fontSize: 16,
  },
  orText: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: "space-between",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
  },
  forgotPassword: {
    color: "#007AFF",
    fontSize: 14,
    marginBottom: 20,
  },
  loginButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  loginText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
