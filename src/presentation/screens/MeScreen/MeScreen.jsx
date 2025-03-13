import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from "@presentation/navigation/routes"; 
const MeScreen = () => {
  const navigation = useNavigation();

  // Hàm điều hướng dựa theo tên màn hình
  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      {/* Header: Avatar và Tên tài khoản */}
      <View style={styles.profileHeader}>
        <Image
          style={styles.avatar}
          source={{ uri: 'https://example.com/avatar.jpg' }} // Thay URL avatar thật của bạn
        />
        <Text style={styles.username}>Account name</Text>
      </View>

      {/* Khung 1: Manage order */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Manage order</Text>
        <TouchableOpacity style={styles.item} onPress={() => handlePress('OrderStatus')}>
          <Text style={styles.itemText}>Order status</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate(ROUTES.PURCHASE_HISTORY_SCREEN)}>
          <Text style={styles.itemText}>Purchase history</Text>
        </TouchableOpacity>
      </View>

      {/* Khung 2: Account */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate(ROUTES.PROFILE_SCREEN)}>
          <Text style={styles.itemText}>My Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => handlePress('Logout')}>
          <Text style={styles.itemText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2', // Màu nền mềm mại, không quá chói
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    // Thêm shadow tạo hiệu ứng nổi bật cho card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#d32f2f', // Đường viền nổi bật
  },
  username: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    // Shadow cho card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#d32f2f',
  },
  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default MeScreen;
