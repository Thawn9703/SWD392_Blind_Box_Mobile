import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ROUTES } from "@presentation/navigation/routes.tsx";

const SignUpScreen = () => {
  const navigation = useNavigation();

  // State quản lý dữ liệu form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Kiểm tra form hợp lệ
  const isValidEmail = email.includes("@") && email.includes(".");
  const isPasswordValid = password.length >= 6 && password === confirmPassword;
  const isFormValid =
    firstName && lastName && isValidEmail && mobile.length >= 8 && gender && isPasswordValid;

  return (
    <View style={styles.container}>
      {/* Nút quay lại luôn ở trên cùng */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      {/* Nội dung có thể cuộn */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Tiêu đề ngay dưới nút Back */}
        <Text style={styles.title}>Create Account</Text>

        {/* Các nút đăng nhập nhanh */}
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

        {/* Nhập thông tin cá nhân */}
        <TextInput placeholder="First Name" style={styles.input} value={firstName} onChangeText={setFirstName} />
        <TextInput placeholder="Last Name" style={styles.input} value={lastName} onChangeText={setLastName} />
        <TextInput placeholder="Example@gmail.com" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput placeholder="Mobile Number" style={styles.input} value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />

        {/* Giới tính và Ngày sinh */}
        <View style={styles.row}>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={gender} style={styles.picker} onValueChange={(itemValue) => setGender(itemValue)}>
              <Picker.Item label="Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              {/* <Picker.Item label="Other" value="other" /> */}
            </Picker>
          </View>

          {/* Date Picker */}
          <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
            <Text style={{ color: dateOfBirth ? "black" : "gray" }}>
              {dateOfBirth.toLocaleDateString()}
            </Text>
            <FontAwesome name="calendar" size={18} color="gray" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dateOfBirth}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDateOfBirth(selectedDate);
            }}
          />
        )}

        {/* Mật khẩu */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirm Password"
            style={styles.passwordInput}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <FontAwesome name={showConfirmPassword ? "eye" : "eye-slash"} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Nút Đăng ký */}
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: isFormValid ? "#007AFF" : "gray" }]}
          disabled={!isFormValid}
        >
          <Text style={styles.continueText}>Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  
  scrollContainer: { paddingHorizontal: 20, paddingTop: 80, paddingBottom: 20 },

  backButton: { 
    position: "absolute", 
    top: 40, 
    left: 20, 
    zIndex: 10 
  },

  title: { 
    fontSize: 26, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 20, 
  },

  input: { padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 10 },

  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },

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
  pickerContainer: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
  },
  
  picker: { width: "100%", height: 50 },

  datePicker: { 
    width: "48%", 
    padding: 12, 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 10, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },

  passwordContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, marginBottom: 10 },
  passwordInput: { flex: 1, paddingVertical: 12 },
  
  continueButton: { padding: 15, borderRadius: 10, alignItems: "center" },
  continueText: { color: "#FFF", fontSize: 16 },
});
