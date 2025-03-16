import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  SafeAreaView,
} from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ROUTES } from "@presentation/navigation/routes.tsx";
import { useAuth } from "@presentation/context/AuthContext";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const { register, loading, error } = useAuth();

  // State quản lý dữ liệu form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State cho các thông báo lỗi
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [dateError, setDateError] = useState("");
  
  // State để theo dõi form hợp lệ
  const [isValid, setIsValid] = useState(false);

  // Xác thực email mà không cập nhật state
  const checkEmail = (emailValue) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailValue.trim() && emailRegex.test(emailValue);
  };

  // Xác thực tên mà không cập nhật state
  const checkName = (nameValue) => {
    return nameValue.trim() !== "";
  };

  // Xác thực số điện thoại mà không cập nhật state
  const checkPhone = (phoneValue) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneValue.trim() && phoneRegex.test(phoneValue);
  };

  // Xác thực mật khẩu mà không cập nhật state
  const checkPassword = (passwordValue) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordValue.trim() && passwordRegex.test(passwordValue);
  };

  // Xác thực nhập lại mật khẩu mà không cập nhật state
  const checkConfirmPassword = (confirmValue, passwordValue) => {
    return confirmValue.trim() && confirmValue === passwordValue;
  };

  // Xác thực ngày sinh không quá hiện tại và không quá xa trong quá khứ
  const checkDate = (date) => {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 100); // Giới hạn 100 tuổi
    
    return date <= today && date >= minDate;
  };

  // Hiển thị lỗi cho email
  const showEmailError = () => {
    if (!email.trim()) {
      setEmailError("Email là bắt buộc");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Định dạng email không đúng");
      return false;
    }

    setEmailError("");
    return true;
  };

  // Hiển thị lỗi cho tên
  const showNameError = () => {
    if (!name.trim()) {
      setNameError("Tên là bắt buộc");
      return false;
    }
    setNameError("");
    return true;
  };

  // Hiển thị lỗi cho số điện thoại
  const showPhoneError = () => {
    if (!phone.trim()) {
      setPhoneError("Số điện thoại là bắt buộc");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError("Số điện thoại phải có 10 chữ số");
      return false;
    }

    setPhoneError("");
    return true;
  };

  // Hiển thị lỗi cho mật khẩu
  const showPasswordError = () => {
    if (!password.trim()) {
      setPasswordError("Mật khẩu là bắt buộc");
      return false;
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt"
      );
      return false;
    }

    setPasswordError("");
    return true;
  };

  // Hiển thị lỗi cho xác nhận mật khẩu
  const showConfirmPasswordError = () => {
    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Xác nhận mật khẩu là bắt buộc");
      return false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Mật khẩu xác nhận không khớp");
      return false;
    }

    setConfirmPasswordError("");
    return true;
  };

  // Hiển thị lỗi cho giới tính
  const showGenderError = () => {
    if (!gender) {
      setGenderError("Giới tính là bắt buộc");
      return false;
    }
    
    setGenderError("");
    return true;
  };

  // Hiển thị lỗi cho ngày sinh
  const showDateError = () => {
    if (!checkDate(dateOfBirth)) {
      setDateError("Ngày sinh không hợp lệ");
      return false;
    }
    
    setDateError("");
    return true;
  };

  // Sử dụng useEffect để cập nhật trạng thái form hợp lệ khi các giá trị thay đổi
  useEffect(() => {
    const formIsValid =
      checkEmail(email) &&
      checkName(name) &&
      checkPhone(phone) &&
      checkPassword(password) &&
      checkConfirmPassword(confirmPassword, password) &&
      gender !== "" &&
      checkDate(dateOfBirth);

    setIsValid(formIsValid);
  }, [email, name, phone, gender, dateOfBirth, password, confirmPassword]);

  // Xử lý khi ngày sinh thay đổi
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
      setDateError("");
    }
  };

  // Xử lý đăng ký
  const handleSignUp = async () => {
    // Kiểm tra lại form trước khi submit
    const isEmailValid = showEmailError();
    const isNameValid = showNameError();
    const isPhoneValid = showPhoneError();
    const isPasswordValid = showPasswordError();
    const isConfirmValid = showConfirmPasswordError();
    const isGenderValid = showGenderError();
    const isDateValid = showDateError();

    if (!isEmailValid || !isNameValid || !isPhoneValid || !isPasswordValid || 
        !isConfirmValid || !isGenderValid || !isDateValid) {
      return;
    }

    // Định dạng dateOfBirth thành ISO string YYYY-MM-DD
    const formattedDate = dateOfBirth.toISOString().split("T")[0];

    const registerData = {
      email,
      name,
      gender,
      phone,
      dateOfBirth: formattedDate,
      password,
    };

    console.log("Đang gửi dữ liệu đăng ký:", registerData);

    const result = await register(registerData);
    console.log("Kết quả đăng ký:", result, "Error:", error);

    if (result && result.success) {
      Alert.alert(
        "Đăng ký thành công",
        "Bạn đã đăng ký tài khoản thành công!",
        [{ text: "OK", onPress: () => navigation.navigate(ROUTES.LOGIN) }]
      );
    } else {
      Alert.alert(
        "Đăng ký thất bại", 
        error || "Vui lòng thử lại sau.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tạo tài khoản</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Nội dung có thể cuộn */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            {/* Thông tin cá nhân */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Họ và tên</Text>
                <TextInput
                  placeholder="Nhập họ và tên của bạn"
                  style={[styles.input, nameError ? styles.inputError : null]}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setNameError("");
                  }}
                  onBlur={showNameError}
                />
                {nameError ? (
                  <Text style={styles.errorText}>{nameError}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  placeholder="example@gmail.com"
                  style={[styles.input, emailError ? styles.inputError : null]}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError("");
                  }}
                  onBlur={showEmailError}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Số điện thoại</Text>
                <TextInput
                  placeholder="Nhập số điện thoại"
                  style={[styles.input, phoneError ? styles.inputError : null]}
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    setPhoneError("");
                  }}
                  onBlur={showPhoneError}
                  keyboardType="phone-pad"
                />
                {phoneError ? (
                  <Text style={styles.errorText}>{phoneError}</Text>
                ) : null}
              </View>

              {/* Giới tính và Ngày sinh */}
              <View style={styles.row}>
                <View style={styles.halfContainer}>
                  <Text style={styles.inputLabel}>Giới tính</Text>
                  <View style={[styles.pickerContainer, genderError ? styles.inputError : null]}>
                    <Picker
                      selectedValue={gender}
                      style={styles.picker}
                      onValueChange={(itemValue) => {
                        setGender(itemValue);
                        setGenderError("");
                      }}
                    >
                      <Picker.Item
                        label="Chọn giới tính"
                        value=""
                        enabled={false}
                      />
                      <Picker.Item label="Nam" value="MALE" />
                      <Picker.Item label="Nữ" value="FEMALE" />
                      <Picker.Item label="Khác" value="OTHER" />
                    </Picker>
                  </View>
                  {genderError ? (
                    <Text style={styles.errorText}>{genderError}</Text>
                  ) : null}
                </View>

                <View style={styles.halfContainer}>
                  <Text style={styles.inputLabel}>Ngày sinh</Text>
                  {/* Date Picker */}
                  <TouchableOpacity
                    style={[styles.datePicker, dateError ? styles.inputError : null]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={{ color: "black" }}>
                      {dateOfBirth.toLocaleDateString()}
                    </Text>
                    <FontAwesome name="calendar" size={18} color="#d32f2f" />
                  </TouchableOpacity>
                  {dateError ? (
                    <Text style={styles.errorText}>{dateError}</Text>
                  ) : null}
                </View>
              </View>

              {/* Hiển thị DateTimePicker khi showDatePicker là true */}
              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dateOfBirth}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              )}

              {/* Mật khẩu - đã được chuyển vào phần thông tin cá nhân */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Mật khẩu</Text>
                <View
                  style={[
                    styles.passwordContainer,
                    passwordError ? styles.inputError : null,
                  ]}
                >
                  <TextInput
                    placeholder="Nhập mật khẩu"
                    style={styles.passwordInput}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setPasswordError("");
                    }}
                    onBlur={showPasswordError}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesome
                      name={showPassword ? "eye" : "eye-slash"}
                      size={20}
                      color="#777"
                    />
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
                <View
                  style={[
                    styles.passwordContainer,
                    confirmPasswordError ? styles.inputError : null,
                  ]}
                >
                  <TextInput
                    placeholder="Nhập lại mật khẩu"
                    style={styles.passwordInput}
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setConfirmPasswordError("");
                    }}
                    onBlur={showConfirmPasswordError}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <FontAwesome
                      name={showConfirmPassword ? "eye" : "eye-slash"}
                      size={20}
                      color="#777"
                    />
                  </TouchableOpacity>
                </View>
                {confirmPasswordError ? (
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                ) : null}
              </View>
            </View>

            {/* Nút Đăng ký */}
            <TouchableOpacity
              style={[
                styles.signUpButton,
                { backgroundColor: isValid ? "#d32f2f" : "#aaa" },
              ]}
              disabled={!isValid || loading}
              onPress={handleSignUp}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.signUpText}>Đăng ký</Text>
              )}
            </TouchableOpacity>

            {/* Đã có tài khoản, quay lại đăng nhập */}
            <TouchableOpacity 
              style={styles.loginLinkContainer}
              onPress={() => navigation.navigate(ROUTES.LOGIN)}
            >
              <Text style={styles.alreadyHaveAccount}>
                Đã có tài khoản? <Text style={styles.loginLink}>Đăng nhập</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#d32f2f",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  formContainer: {
    marginBottom: 20,
  },
  sectionContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#d32f2f",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#d32f2f",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfContainer: {
    width: "48%",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
  signUpButton: {
    backgroundColor: "#d32f2f",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginVertical: 15,
  },
  signUpText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginLinkContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  alreadyHaveAccount: {
    fontSize: 16,
    color: "#555",
  },
  loginLink: {
    color: "#d32f2f",
    fontWeight: "bold",
  },
});

export default SignUpScreen;