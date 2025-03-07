import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomePageScreen from './HomePageScreen';
import ProductDetailScreen from '@presentation/screens/ProductDetailScreen/ProductDetailScreen';
import { ROUTES } from "@presentation/navigation/routes";

const HomePageStack = createStackNavigator();

const HomePageStackNavigator = () => (
    <HomePageStack.Navigator screenOptions={{ headerShown: false }}>
      <HomePageStack.Screen name={ROUTES.HOME_PAGE_SCREEN} component={HomePageScreen} />
      <HomePageStack.Screen name={ROUTES.PRODUCT_DETAIL_SCREEN} component={ProductDetailScreen} />
    </HomePageStack.Navigator>
  );
  
  export default HomePageStackNavigator;