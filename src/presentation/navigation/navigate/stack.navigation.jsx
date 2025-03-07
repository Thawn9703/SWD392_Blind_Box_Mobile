// src/presentation/navigation/stack.navigation.jsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from "@presentation/navigation/routes";

// Import các screens
//import HomeScreen from '../screens/HomeScreen/HomeScreen';
// import LoginScreen from '../screens/LoginScreen/LoginScreen';
// import SignUpScreen from '../screens/SignUpScreen/SignUpScreen';
// import ForgotPasswordScreen from '../screens/ForgotPasswordScreen/ForgotPasswordScreen';
import HomePageScreen from '@presentation/screens/HomePageScreen/HomePageScreen';
import NewArrivalsScreen from '@presentation/screens/NewArrivalsScreen/NewArrivalsScreen';
import CategoriesScreen from '@presentation/screens/CategoriesScreen/CategoriesScreen';
// import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
// import MeScreen from '../screens/MeScreen/MeScreen';
import MeStackNavigator from '@presentation/screens/MeScreen/MeStackNavigator';

const Stack = createStackNavigator();

const StackNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name={ROUTES.HOME_SCREEN} component={HomeScreen} />
            <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
            <Stack.Screen name={ROUTES.SIGN_UP} component={SignUpScreen} />
            <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} /> */}
            <Stack.Screen 
                name={ROUTES.HOME_PAGE_SCREEN} 
                component={HomePageScreen} 
            />
            <Stack.Screen 
                name={ROUTES.NEW_ARRIVALS_SCREEN} 
                component={NewArrivalsScreen} 
            />
            <Stack.Screen 
                name={ROUTES.CATEGORIES_SCREEN} 
                component={CategoriesScreen} 
            />
            <Stack.Screen 
                name={ROUTES.ME_SCREEN} 
                component={MeStackNavigator} 
            />
            {/* <Stack.Screen name={ROUTES.PROFILE_SCREEN} component={ProfileScreen} /> */}
        </Stack.Navigator>
    );
};

export default StackNavigation;