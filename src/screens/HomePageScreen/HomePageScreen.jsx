import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';

import NewArrivalsScreen from "../NewArrivalsScreen/NewArrivalsScreen";
import CategoriesScreen from "../ProfileScreen/ProfileScreen";
import ProfileScreen from "../CategoriesScreen/CategoriesScreen";
import MeStackNavigator from '../MeScreen/MeStackNavigator';


const Tab = createBottomTabNavigator();

const PopMartApp = () => {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, style: styles.tabBarStyle }}>
        <Tab.Screen name="Home" component={HomeScreen} options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={24} 
              color={color}
            />
          ),
          tabBarActiveTintColor: '#d32f2f',
          tabBarInactiveTintColor: '#757575',
        }}/>
        <Tab.Screen name="New" component={NewArrivalsScreen} options={{
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons 
              name={focused ? 'star' : 'star-outline'} 
              size={24} 
              color={color}
            />
          ),
          tabBarActiveTintColor: '#d32f2f',
          tabBarInactiveTintColor: '#757575',
        }}/>
        <Tab.Screen name="Categories" component={CategoriesScreen} options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons 
              name={focused ? 'grid' : 'grid-outline'} 
              size={24} 
              color={color}
            />
          ),
          tabBarActiveTintColor: '#d32f2f',
          tabBarInactiveTintColor: '#757575',
        }}/>
        <Tab.Screen name="Me" component={MeStackNavigator} options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons 
              name={focused ? 'person' : 'person-outline'} 
              size={24} 
              color={color}
            />
          ),
          tabBarActiveTintColor: '#d32f2f',
          tabBarInactiveTintColor: '#757575',
        }}/>
      </Tab.Navigator>
    );
  };

const HomeScreen = () => (
  <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>
    {/* Navbar */}
    <View style={{ flexDirection: 'row', paddingVertical: 10, alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#d32f2f' }}>POP MART</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: '#ddd', padding: 5, borderRadius: 5, width: 150, marginLeft: 10 }}
        placeholder='Search...'
      />
    </View>
    
    {/* Sidebar Navigation */}
    <ScrollView horizontal style={{ flexDirection: 'row', marginVertical: 10 }}>
      {['SKULLPANDA', 'LABUBU', 'DIMOO', 'MOLLY'].map((item, index) => (
        <TouchableOpacity key={index} style={styles.navItem}>
          <Text>{item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>

    {/* Product Grid */}
    <View style={styles.gridContainer}>
      {[1, 2, 3, 4, 5, 6].map((item, index) => (
        <View key={index} style={styles.productCard}>
          <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.productImage} />
          <Text>THE MONSTERS</Text>
          <Text>¥69/抽</Text>
        </View>
      ))}
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  navItem: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  tabBarStyle: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingBottom: 5,
    paddingTop: 5,
  },
});

export default PopMartApp;