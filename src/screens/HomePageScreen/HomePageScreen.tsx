import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import NewArrivalsScreen from "../NewArrivalsScreen/NewArrivalsScreen";
import CategoriesScreen from "../ProfileScreen/ProfileScreen";
import ProfileScreen from "../CategoriesScreen/CategoriesScreen";


const Tab = createBottomTabNavigator();

const PopMartApp = () => {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="New" component={NewArrivalsScreen} />
        <Tab.Screen name="Categories" component={CategoriesScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
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
});

export default PopMartApp;