import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../../routes";

const ProfileScreen = () => {
  const navigation = useNavigation();

  // Dữ liệu mẫu của user
  const [user, setUser] = useState({
    avatar: "https://via.placeholder.com/100", // Avatar mặc định
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "123-456-7890",
  });

  // State để theo dõi thay đổi
  const [editedUser, setEditedUser] = useState({ ...user });
  const [isEditing, setIsEditing] = useState(false);

  // Xử lý thay đổi thông tin
  const handleChange = (key: keyof typeof user, value: string) => {
    setEditedUser((prev) => ({ ...prev, [key]: value }));
    setIsEditing(true);
  };

  // Lưu thông tin cập nhật
  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
    Alert.alert("Profile Updated", "Your profile has been successfully updated.");
  };

  // Đăng xuất
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => navigation.navigate(ROUTES.LOGIN as never),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>My Profile</Text>

      {/* Ảnh đại diện */}
      <Image source={{ uri: user.avatar }} style={styles.avatar} />

      {/* Tên */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={editedUser.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      {/* Email (không chỉnh sửa) */}
      <Text style={styles.label}>Email</Text>
      <TextInput style={[styles.input, styles.disabledInput]} value={user.email} editable={false} />

      {/* Số điện thoại */}
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={editedUser.phone}
        onChangeText={(text) => handleChange("phone", text)}
        keyboardType="phone-pad"
      />

      {/* Nút Lưu */}
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: isEditing ? "#007AFF" : "gray" }]}
        disabled={!isEditing}
        onPress={handleSave}
      >
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>

      {/* Nút Đăng xuất */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
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
    marginTop: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "gray",
  },
  saveButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "red",
  },
  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
