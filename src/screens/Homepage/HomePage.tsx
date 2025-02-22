import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur'; // Import BlurView từ expo-blur

import bgImage from './assets/background.jpg'; // Import Background Image

const { height } = Dimensions.get('window');

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* Background Image with Blur Effect */}
      <ImageBackground source={bgImage} style={styles.backgroundImage}>
        <BlurView intensity={20} style={styles.blurOverlay} />
      </ImageBackground>

      {/* Nội dung */}
      <View style={styles.content}>
        <Text style={styles.headerText}>金蛇贺岁</Text>
        <Text style={styles.subHeaderText}>CHINESE NEW YEAR 2025</Text>
        <Text style={styles.welcomeText}>Welcome to POP MART!</Text>
      </View>

      {/* Buttons - Căn ở cuối màn hình */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton}>
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6260F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)', // Tăng mờ bằng cách làm tối
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 36,
    color: '#FFF',
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 14,
    color: '#FFD700',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    marginVertical: 20,
  },
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginButton: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginRight: 10,
  },
  loginText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  signUpText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
