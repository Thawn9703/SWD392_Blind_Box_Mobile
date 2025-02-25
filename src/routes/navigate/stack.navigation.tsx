import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from '../../routes'; // Kiểm tra lại đường dẫn import
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import LoginScreen from '../../screens/LoginScreen/LoginScreen';
import SignUpScreen from '../../screens/SignUpScreen/SignUpScreen';
import ForgotPasswordScreen from '../../screens/ForgotPasswordScreen/ForgotPasswordScreen';

const Stack = createStackNavigator();

const StackNavigation: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={ROUTES.HOME_PAGE} component={HomeScreen} />
            <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
            <Stack.Screen name={ROUTES.SIGN_UP} component={SignUpScreen} />
            <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
        </Stack.Navigator>
    );
};

export default StackNavigation;
