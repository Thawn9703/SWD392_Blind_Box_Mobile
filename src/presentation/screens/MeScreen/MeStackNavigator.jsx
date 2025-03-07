import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MeScreen from './MeScreen';
import ProfileScreen from '../ProfileScreen/ProfileScreen';
import { ROUTES } from "@presentation/navigation/routes";

const MeStack = createStackNavigator();

const MeStackNavigator = () => (
  <MeStack.Navigator screenOptions={{ headerShown: false }}>
    <MeStack.Screen name={ROUTES.ME_SCREEN} component={MeScreen} />
    <MeStack.Screen name={ROUTES.PROFILE_SCREEN} component={ProfileScreen} />
  </MeStack.Navigator>
);

export default MeStackNavigator;