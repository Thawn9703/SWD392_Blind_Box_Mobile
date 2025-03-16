import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '@presentation/context/AuthContext';
import { CartProvider } from '@presentation/context/CartContext';
import PopMartApp from '@presentation/screens/HomePageScreen/HomePageScreen';
import LoginScreen from '@presentation/screens/LoginScreen/LoginScreen';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <CartProvider>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Main" component={PopMartApp} />
          </Stack.Navigator>
        </CartProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;