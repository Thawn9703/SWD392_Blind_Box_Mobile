import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from "@presentation/navigation/routes";

const MyProfileScreen = () => {
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
        <TouchableOpacity style={styles.item} onPress={() => handlePress('OrderHistory')}>
          <Text style={styles.itemText}>Order history</Text>
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
    padding: 20,
    backgroundColor: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
  },
});

export default MyProfileScreen;