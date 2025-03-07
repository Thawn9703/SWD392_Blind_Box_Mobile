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
import { ROUTES } from "@presentation/navigation/routes";
import PropTypes from 'prop-types';

const NewArrivalsScreen = () => {
  const navigation = useNavigation();

  // Dữ liệu mẫu của user
  const [user, setUser] = useState({
    avatar: "https://via.placeholder.com/100",
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "123-456-7890",
  });

  // State để theo dõi thay đổi
  const [editedUser, setEditedUser] = useState({ ...user });
  const [isEditing, setIsEditing] = useState(false);

  // Xử lý thay đổi thông tin
  const handleChange = (key, value) => {
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
        onPress: () => navigation.navigate(ROUTES.LOGIN)
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>New Arrivals</Text>

      {/* Thêm nội dung cho New Arrivals screen */}
    </View>
  );
};

// NewArrivalsScreen.propTypes = {
//   navigation: PropTypes.object
// };

export default NewArrivalsScreen;

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
  }
});