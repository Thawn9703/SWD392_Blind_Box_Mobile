import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  StyleSheet, 
  Dimensions,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, AntDesign } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';

import blindboxFacade from '@domain/facades/blindboxFacade';
import NewArrivalsScreen from "@presentation/screens/NewArrivalsScreen/NewArrivalsScreen";
import CategoriesScreen from "@presentation/screens/CategoriesScreen/CategoriesScreen";
import ProfileScreen from "@presentation/screens/ProfileScreen/ProfileScreen";
import MeStackNavigator from '@presentation/screens/MeScreen/MeStackNavigator';
import ProductDetailScreen from '@presentation/screens/ProductDetailScreen/ProductDetailScreen';
import AddToCartScreen from '@presentation/screens/AddToCartScreen/AddToCartScreen';
import PurchaseHistoryScreen from '@presentation/screens/PurchaseHistoryScreen/PurchaseHistoryScreen';
import { useCart } from '@presentation/context/CartContext';
import ProductDetailTierScreen from '@presentation/screens/ProductDetailTierScreen/ProductDetailTierScreen';
import ProductDetailNewTierScreen from '@presentation/screens/ProductDetailNewTierScreen/ProductDetailNewTierScreen';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const PopMartApp = () => {
  const { cartItemCount } = useCart();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        style: styles.tabBarStyle,
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
        name="Cart"
        component={AddToCartScreen} 
        options={{
          tabBarIcon: ({ focused, color }) => (
            <FontAwesome5
              name={focused ? 'shopping-cart' : 'shopping-cart'} 
              size={22} 
              color={color}
            />
          ),
          tabBarBadge: cartItemCount > 0 ? cartItemCount : null, 
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
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [blindboxSeries, setBlindboxSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const flatListRef = useRef(null);
  const autoScrollTimer = useRef(null);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch data from API using facade
  useEffect(() => {
    fetchBlindboxSeries();
    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, []);

  // Auto scroll effect
  useEffect(() => {
    if (blindboxSeries.length > 0 && !isSearching) {
      autoScrollTimer.current = setInterval(() => {
        let nextIndex = currentSlideIndex + 1;
        if (nextIndex >= blindboxSeries.slice(0, 10).length) {
          nextIndex = 0;
        }
        
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true
          });
          setCurrentSlideIndex(nextIndex);
        }
      }, 2000);
    }
    
    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [currentSlideIndex, blindboxSeries, isSearching]);

  const fetchBlindboxSeries = async (searchQuery = null) => {
    try {
      setLoading(true);
      // Sử dụng facade thay vì gọi API trực tiếp
      const data = await blindboxFacade.getBlindboxSeries(0, 20, ['id', 'asc'], searchQuery);
      
      if (data && data.content) {
        setBlindboxSeries(data.content);
      } else {
        setBlindboxSeries([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching blindbox series:", err);
      setError("Failed to load products");
      setLoading(false);
    }
  };

  const handleViewProductDetails = (product) => {
    navigation.navigate('ProductDetailScreen', { productId: product.id });
  };

  // Hàm chỉ lưu giá trị vào state, không thực hiện tìm kiếm
  const handleTextChange = (text) => {
    setSearchText(text);
  };

  // Hàm thực hiện tìm kiếm khi bấm nút
  const handleSearch = () => {
    if (searchText.trim().length > 0) {
      setIsSearching(true);
      fetchBlindboxSeries(searchText);
    } else {
      resetSearch();
    }
  };

  const resetSearch = () => {
    setSearchText('');
    setIsSearching(false);
    fetchBlindboxSeries();
  };

  const renderSlideItem = ({ item, index }) => (
    <View style={styles.slideItemContainer}>
      <TouchableOpacity 
        style={styles.slideItem}
        onPress={() => handleViewProductDetails(item)}
      >
        <Image
          source={{ uri: item.imageUrl || 'https://via.placeholder.com/400x300' }}
          style={styles.slideImage}
        />
        <View style={styles.slideInfoContainer}>
          <View style={styles.tagContainer}>
            <Text style={styles.seriesTag}>Series {item.seriesNumber}</Text>
            <Text style={styles.stockTag}>In Stock</Text>
          </View>
          <Text style={styles.slideTitle}>Mystery Series {item.seriesNumber}</Text>
          <Text style={styles.slideDescription} numberOfLines={2}>
            Exciting mystery collection featuring unique collectibles in Series {item.seriesNumber}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.packagePrice}>Package: {item.packagePrice || (item.price * 5.5).toFixed(2)} đ</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cartButton}>
              <Text style={styles.cartButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const handleOnViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentSlideIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  const renderFeaturedCollectionItem = (item, index) => (
    <TouchableOpacity 
      key={index}
      style={styles.collectionCard}
      onPress={() => handleViewProductDetails(item)}
    >
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/200' }}
        style={styles.collectionImage}
      />
      <View style={styles.collectionTagContainer}>
        <Text style={styles.collectionSeriesTag}>Series {item.seriesNumber}</Text>
        <Text style={styles.collectionStockTag}>In Stock</Text>
      </View>
      <Text style={styles.collectionTitle}>Mystery Series {item.seriesNumber}</Text>
      <Text style={styles.collectionDescription} numberOfLines={3}>
        Exciting mystery collection featuring unique collectibles in Series {item.seriesNumber}
      </Text>
      <View style={styles.collectionPriceContainer}>
        <Text style={styles.collectionPrice}>Price: {item.packagePrice || (item.price * 5.5).toFixed(2)} đ</Text>
      </View>
      <TouchableOpacity style={styles.collectionViewDetailsButton}>
        <Text style={styles.collectionViewDetailsText}>View Details</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderAboutBoxItem = (item, index) => (
    <TouchableOpacity 
      key={index}
      style={styles.aboutBoxCard}
      onPress={() => handleViewProductDetails(item)}
    >
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
        style={styles.aboutBoxImage}
      />
      <Text style={styles.aboutBoxTitle}>Mystery Series {item.seriesNumber}</Text>
      <Text style={styles.aboutBoxPrice}>{item.packagePrice || (item.price * 5.5).toFixed(2)} đ</Text>
      <View style={styles.aboutBoxTagContainer}>
        <Text style={styles.aboutBoxStockTag}>In Stock</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCollectionGuideStep = (number, title, description) => (
    <View style={styles.guideStepContainer}>
      <View style={styles.guideStepNumberContainer}>
        <Text style={styles.guideStepNumber}>{number}</Text>
      </View>
      <Text style={styles.guideStepTitle}>{title}</Text>
      <Text style={styles.guideStepDescription}>{description}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d32f2f" />
        <Text>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchBlindboxSeries}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.homeContainer}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={resetSearch}>
          <Text style={styles.title}>Blindbox®</Text>
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <TextInput
              style={[
                styles.searchInput,
                isFocused && styles.searchInputFocused
              ]}
              placeholder={isFocused ? 'Blindbox packages' : 'Search...'}
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={handleTextChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity 
              style={styles.searchButton} 
              onPress={handleSearch}
              activeOpacity={0.7}
            >
              <Ionicons name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {isSearching && (
        <View style={styles.searchResultHeader}>
          <Text style={styles.searchResultText}>
            Search results for "{searchText}"
          </Text>
          <TouchableOpacity onPress={resetSearch}>
            <Text style={styles.clearSearchText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Slider section - First 10 products */}
      <View style={styles.sliderContainer}>
        <FlatList
          ref={flatListRef}
          data={blindboxSeries.slice(0, 10)}
          renderItem={renderSlideItem}
          keyExtractor={(item, index) => `slide-${index}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={handleOnViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          initialScrollIndex={0}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          contentContainerStyle={styles.sliderContentContainer}
        />
        <View style={styles.paginationContainer}>
          {blindboxSeries.slice(0, 10).map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                { backgroundColor: index === currentSlideIndex ? '#d32f2f' : '#ccc' }
              ]}
            />
          ))}
        </View>
      </View>

      {/* Featured Collections Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Collections</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionSubtitle}>Explore our latest blind box series</Text>
        
        <View style={styles.featuredCollectionsContainer}>
          {blindboxSeries.slice(0, 4).map((item, index) => renderFeaturedCollectionItem(item, index))}
        </View>
      </View>

      {/* About Our Blind Boxes Section */}
      <View style={styles.aboutSectionContainer}>
        <Text style={styles.aboutSectionTitle}>About Our Blind Boxes</Text>
        <Text style={styles.aboutSectionSubtitle}>Discover the thrill of mystery collectibles</Text>
        
        <Text style={styles.aboutSectionDescription}>
          Each blind box contains a surprise figurine from your favorite series. Collect them all and find the
          rare special editions!
        </Text>
        <Text style={styles.aboutSectionDescription}>
          Our blind boxes feature high-quality materials and detailed craftsmanship, making them perfect for
          collectors and enthusiasts alike.
        </Text>
        
        <TouchableOpacity style={styles.browseCollectionsButton}>
          <Text style={styles.browseCollectionsButtonText}>Browse Collections</Text>
        </TouchableOpacity>

        <View style={styles.aboutBoxesContainer}>
          {blindboxSeries.slice(0, 4).map((item, index) => renderAboutBoxItem(item, index))}
        </View>
      </View>

      {/* Collection Guide Section */}
      <View style={styles.guideContainer}>
        <Text style={styles.guideSectionTitle}>Blind Box Collection Guide</Text>
        
        <View style={styles.guideStepsContainer}>
          {renderCollectionGuideStep(
            "1", 
            "Choose Your Series", 
            "Browse our extensive collection of blind box series and find the ones that match your style."
          )}
          
          {renderCollectionGuideStep(
            "2", 
            "Unbox Your Surprise", 
            "Experience the excitement of opening your blind box and discovering which figurine you got!"
          )}
          
          {renderCollectionGuideStep(
            "3", 
            "Complete Your Collection", 
            "Keep collecting to find all the figurines in each series, including rare special editions!"
          )}
        </View>

        <TouchableOpacity style={styles.startCollectingButton}>
          <Text style={styles.startCollectingButtonText}>Start Collecting</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Tổng thể màn hình Home
  homeContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',  
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#d32f2f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  searchContainer: {
    position: 'relative',
    flex: 1,
    marginLeft: 10,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flex: 1,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  searchInputFocused: {
    borderColor: '#d32f2f',
    borderWidth: 2,
    borderRightWidth: 0,
  },
  searchButton: {
    backgroundColor: '#d32f2f',
    padding: 9,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Search result styles
  searchResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginVertical: 10,
  },
  searchResultText: {
    fontSize: 14,
    color: '#555',
  },
  clearSearchText: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: 'bold',
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

  // Slider Section - Đã cập nhật để sửa lỗi tràn
  sliderContainer: {
    height: 450,
    marginVertical: 10,
    width: '100%',
  },
  sliderContentContainer: {
    // Đã xóa paddingRight để sửa lỗi tràn
  },
  slideItemContainer: {
    width: Dimensions.get('window').width - 20, // Trừ đi padding của container cha
    paddingHorizontal: 10,
  },
  slideItem: {
    height: 420,
    borderRadius: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  slideImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  slideInfoContainer: {
    padding: 15,
    flex: 1, // Make sure this container uses all available space
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  seriesTag: {
    backgroundColor: '#e3f2fd',
    color: '#2196f3',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 5,
  },
  stockTag: {
    backgroundColor: '#e8f5e9',
    color: '#4caf50',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  slideTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  slideDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  priceContainer: {
    marginBottom: 15,
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto', // Push to bottom of container
  },
  detailsButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d32f2f',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  cartButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  // Featured Collections Section
  sectionContainer: {
    marginVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#2196f3',
    fontWeight: '500',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 15,
  },
  featuredCollectionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  collectionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
    overflow: 'hidden',
    paddingBottom: 10,
  },
  collectionImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  collectionTagContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  collectionSeriesTag: {
    backgroundColor: '#e3f2fd',
    color: '#2196f3',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 5,
  },
  collectionStockTag: {
    backgroundColor: '#e8f5e9',
    color: '#4caf50',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  collectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 10,
  },
  collectionDescription: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 10,
    marginVertical: 5,
    minHeight: 45,
  },
  collectionPriceContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  collectionPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  collectionViewDetailsButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d32f2f',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 5,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  collectionViewDetailsText: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 12,
  },

  // About Our Blind Boxes Section
  aboutSectionContainer: {
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  aboutSectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  aboutSectionSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 15,
  },
  aboutSectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  browseCollectionsButton: {
    backgroundColor: '#000',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginVertical: 15,
  },
  browseCollectionsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  aboutBoxesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  aboutBoxCard: {
    width: '48%',
    marginBottom: 15,
  },
  aboutBoxImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 5,
  },
  aboutBoxTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  aboutBoxPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 5,
  },
  aboutBoxTagContainer: {
    flexDirection: 'row',
  },
  aboutBoxStockTag: {
    backgroundColor: '#e8f5e9',
    color: '#4caf50',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  // Collection Guide Section
  guideContainer: {
    marginVertical: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 20,
  },
  guideSectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  guideStepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  guideStepContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  guideStepNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  guideStepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196f3',
  },
  guideStepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  guideStepDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  startCollectingButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
  },
  startCollectingButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Tab bar style
  tabBarStyle: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default PopMartApp;