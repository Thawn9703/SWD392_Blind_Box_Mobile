import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '@presentation/context/AuthContext';
import { CartProvider } from '@presentation/context/CartContext';
import PopMartApp from '@presentation/screens/HomePageScreen/HomePageScreen';
import LoginScreen from '@presentation/screens/LoginScreen/LoginScreen';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from '@presentation/screens/SignUpScreen/SignUpScreen';
import { ROUTES } from '@presentation/navigation/routes';
import ProductDetailScreen from '@presentation/screens/ProductDetailScreen/ProductDetailScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <CartProvider>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
            <Stack.Screen name={ROUTES.SIGN_UP} component={SignUpScreen} />
            <Stack.Screen name="Main" component={PopMartApp} />
            <Stack.Screen name={ROUTES.PRODUCT_DETAIL_SCREEN} component={ProductDetailScreen} />
          </Stack.Navigator>
        </CartProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;