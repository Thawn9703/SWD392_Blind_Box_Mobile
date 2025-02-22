import React from 'react'
import { StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from '..';
import AntDesign from '@expo/vector-icons/AntDesign';
import HomeScreen from '../../screens/Homepage/HomePage';

const Stack = createStackNavigator();

const StackNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={ROUTES.HOME_PAGE}
                component={HomeScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}

export default StackNavigation

const styles = StyleSheet.create({})