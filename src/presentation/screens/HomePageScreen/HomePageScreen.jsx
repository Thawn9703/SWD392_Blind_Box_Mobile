import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';

import NewArrivalsScreen from "@presentation/screens/NewArrivalsScreen/NewArrivalsScreen";
import CategoriesScreen from "@presentation/screens/CategoriesScreen/CategoriesScreen";
import ProfileScreen from "@presentation/screens/ProfileScreen/ProfileScreen";
import MeStackNavigator from '@presentation/screens/MeScreen/MeStackNavigator';
import ProductDetailScreen from '@presentation/screens/ProductDetailScreen/ProductDetailScreen';


const Tab = createBottomTabNavigator();

const PopMartApp = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        style: styles.tabBarStyle, // Giữ nguyên style tabBar như bạn đã có
        tabBarActiveTintColor: '#d32f2f',
        tabBarInactiveTintColor: '#757575',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="New"
        component={NewArrivalsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? 'star' : 'star-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Me"
        component={MeStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const HomeScreen = () => {
  
  const navigation = useNavigation();
  
  return (<ScrollView style={styles.homeContainer}>
    {/* Navbar */}
    <View style={styles.navbar}>
      <Text style={styles.title}>Blindbox®</Text>
      <TextInput
        style={styles.searchInput}
        placeholder='Search...'
        placeholderTextColor='#999'
      />
    </View>
    
    {/* Sidebar Navigation */}
    <ScrollView horizontal style={styles.navItemsWrapper} showsHorizontalScrollIndicator={false}>
      {['SKULLPANDA', 'LABUBU', 'DIMOO', 'MOLLY'].map((item, index) => (
        <TouchableOpacity key={index} style={styles.navItem}>
          <Text style={styles.navItemText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>

    {/* Product Grid */}
    <View style={styles.gridContainer}>
        {[1, 2, 3, 4, 5, 6].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.productCard}
            onPress={() =>
              navigation.navigate('ProductDetailScreen', {
                product: {
                  // Truyền dữ liệu sản phẩm tuỳ ý
                  title: 'Dimoo Space Series - Package #8',
                  price: '$85.50',
                  originalPrice: '$95.00',
                  campaign: 'MILESTONE CAMPAIGN',
                },
              })
            }
          >
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.productImage}
            />
            <Text style={styles.productTitle}>THE MONSTERS</Text>
            <Text style={styles.productPrice}>¥69/抽</Text>
          </TouchableOpacity>
        ))}
      </View>
  </ScrollView>);
};

const styles = StyleSheet.create({
  // Tổng thể màn hình Home
  homeContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',  // Màu nền nhẹ nhàng
    padding: 10,
  },

  // Navbar
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    borderRadius: 5,
    width: 150,
    marginLeft: 10,
    backgroundColor: '#fff',
    // Thêm hiệu ứng shadow nhẹ
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  // Sidebar Navigation
  navItemsWrapper: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    // Thêm shadow cho item
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 2,
  },
  navItemText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },

  // Product Grid
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
    // Thêm shadow cho card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d32f2f',
  },

  // Tab bar
  tabBarStyle: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingBottom: 5,
    paddingTop: 5,
    // Thêm chiều cao và shadow nhẹ cho tab bar
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default PopMartApp;
