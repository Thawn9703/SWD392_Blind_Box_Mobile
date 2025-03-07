import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from "@presentation/navigation/routes.tsx";// Kiểm tra lại đường dẫn import
import { BlurView } from 'expo-blur';
import bgImage from '../../../assets/background.png';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground source={bgImage} style={styles.backgroundImage}>
        <BlurView intensity={10} style={styles.blurOverlay} />
      </ImageBackground>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to PRE ORDER!</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => navigation.navigate(ROUTES.LOGIN)}>  
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signUpButton} 
          onPress={() => navigation.navigate(ROUTES.SIGN_UP)}>  
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
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(195, 195, 195, 0.8)', 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  loginButton: {
    backgroundColor: '#FFF',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 10,
    marginRight: 12,
  },
  loginText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 10,
  },
  signUpText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
