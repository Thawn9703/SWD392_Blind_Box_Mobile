// src/presentation/navigation/stack.navigation.jsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ROUTES } from "@presentation/navigation/routes";

// Import các screens
// import HomeScreen from '@presentation/screens/HomeScreen/HomeScreen';
// import LoginScreen from '@presentation/screens/LoginScreen/LoginScreen';
// import SignUpScreen from '@presentation/screens/SignUpScreen/SignUpScreen';
// import ForgotPasswordScreen from '@presentation/screens/ForgotPasswordScreen/ForgotPasswordScreen';
import HomePageScreen from "@presentation/screens/HomePageScreen/HomePageScreen";
import NewArrivalsScreen from "@presentation/screens/NewArrivalsScreen/NewArrivalsScreen";
import CategoriesScreen from "@presentation/screens/CategoriesScreen/CategoriesScreen";
import ProfileScreen from "@presentation/screens/ProfileScreen/ProfileScreen";
import MeScreen from "@presentation/screens/MeScreen/MeScreen";
import MeStackNavigator from "@presentation/screens/MeScreen/MeStackNavigator";
import HomePageStackNavigator from "@presentation/screens/HomePageScreen/HomePageStackNavigator";
import ProductDetailScreen from "@presentation/screens/ProductDetailScreen/ProductDetailScreen";
import AddToCartScreen from "@presentation/screens/AddToCartScreen/AddToCartScreen";
import PurchaseHistoryScreen from "@presentation/screens/PurchaseHistoryScreen/PurchaseHistoryScreen";

const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name={ROUTES.HOME_SCREEN} component={HomeScreen} />
            <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
            <Stack.Screen name={ROUTES.SIGN_UP} component={SignUpScreen} />
            <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} /> */}
      {/* <Stack.Screen 
                name={ROUTES.HOME_PAGE_SCREEN} 
                component={HomePageScreen} 
            /> */}
      <Stack.Screen
        name={ROUTES.HOME_PAGE_SCREEN}
        component={HomePageStackNavigator}
      />
      {/* <Stack.Screen
        name={ROUTES.NEW_ARRIVALS_SCREEN}
        component={NewArrivalsScreen}
      /> */}
      <Stack.Screen
        name={ROUTES.CATEGORIES_SCREEN}
        component={CategoriesScreen}
      />
       <Stack.Screen
        name={ROUTES.PURCHASE_HISTORY_SCREEN}
        component={PurchaseHistoryScreen}
      />
      <Stack.Screen name={ROUTES.ME_SCREEN} component={MeStackNavigator} />

      <Stack.Screen
        name={ROUTES.PRODUCT_DETAIL_SCREEN}
        component={ProductDetailScreen}
      />
      <Stack.Screen
        name={ROUTES.ADD_TO_CART_SCREEN}
        component={AddToCartScreen}
      />
      <Stack.Screen name={ROUTES.PROFILE_SCREEN} component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
