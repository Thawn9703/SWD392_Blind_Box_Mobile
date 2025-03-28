import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Platform, 
  Dimensions 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import blindboxFacade from '@domain/facades/blindboxFacade';

const { width, height } = Dimensions.get('window');

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isSingleBoxSelected, setIsSingleBoxSelected] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('Product Details');
  const [customerPurchaseCount, setCustomerPurchaseCount] = useState(0);
  const imageFlatListRef = useRef(null);

  // Mock customer ID (replace with actual customer ID from auth context)
  const customerId = 'mock-customer-id';

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await blindboxFacade.getBlindboxSeriesById(productId);
        console.log('Fetched product data:', data);

        // Fetch customer's purchase history
        const purchaseCount = await blindboxFacade.getCustomerPurchaseCount(productId, customerId);
        setCustomerPurchaseCount(purchaseCount);

        // Update tier currentCount with customer's purchase history
        if (data.activeCampaign && data.activeCampaign.campaignTiers) {
          data.activeCampaign.campaignTiers = data.activeCampaign.campaignTiers.map(tier => ({
            ...tier,
            currentCount: (tier.currentCount || 0) + purchaseCount,
          }));
        }

        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Không thể tải chi tiết sản phẩm');
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text>Không tìm thấy sản phẩm</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasCampaign = product.activeCampaign && product.activeCampaign.active;
  const campaignType = hasCampaign && product.activeCampaign.campaignType 
    ? product.activeCampaign.campaignType.toUpperCase() 
    : null;
  const availableUnits = isSingleBoxSelected ? product.availableBoxUnits : product.availablePackageUnits;
  const price = isSingleBoxSelected ? product.boxPrice : product.packagePrice;

  // Determine the active tier and discount
  let discountPercent = 0;
  let activeTier = null;
  if (hasCampaign && product.activeCampaign.campaignTiers) {
    activeTier = product.activeCampaign.campaignTiers.find(tier => tier.tierStatus === 'PROCESSING') || 
                 product.activeCampaign.campaignTiers[0];
    discountPercent = activeTier ? activeTier.discountPercent : 0;
  }
  const discountedPrice = price * (1 - discountPercent / 100);
  const deposit = campaignType === 'GROUP' ? discountedPrice * 0.5 : 0;
  const remainingBalance = campaignType === 'GROUP' ? discountedPrice - deposit : 0;

  const productData = [{ id: 'product-details', product: product }];

  const renderImageItem = ({ item }) => (
    <Image
      source={{ uri: item || 'https://via.placeholder.com/400' }}
      style={styles.productImage}
      resizeMode="cover"
    />
  );

  const handleImageScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentImageIndex(index);
  };

  const renderHeader = () => {
    if (!hasCampaign || !campaignType) {
      return (
        <View style={styles.headerContainer}>
          <Text style={styles.campaignType}>No Active Campaign</Text>
        </View>
      );
    }

    return (
      <View style={styles.headerContainer}>
        <Text style={styles.campaignType}>
          {campaignType} CAMPAIGN
          <TouchableOpacity style={styles.infoIcon}>
            <Ionicons name="information-circle-outline" size={16} color="#000" />
          </TouchableOpacity>
        </Text>
        <Text style={styles.campaignInfo}>
          {campaignType === 'MILESTONE'
            ? 'Purchase now with instant shipping. Price depends on current campaign tier.'
            : 'Preorder now with 50% deposit. Final price depends on tier reached when campaign ends.'}
        </Text>
        <Text style={styles.campaignEnd}>
          Campaign ends: {new Date(product.activeCampaign.endCampaignTime).toLocaleDateString()} (in a month)
        </Text>
        <View style={styles.headerButtonContainer}>
          <Text style={styles.headerButtonText}>
            {campaignType === 'MILESTONE' ? 'In Stock & Ready to Ship' : '50% Deposit Required'}
          </Text>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonLabel}>
              {campaignType === 'MILESTONE' ? 'Buy Now' : 'Learn More'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCampaignTiers = () => {
    if (!hasCampaign || !product.activeCampaign.campaignTiers) return null;

    const { campaignTiers } = product.activeCampaign;
    return (
      <View style={styles.tierSection}>
        <Text style={styles.sectionTitle}>Campaign Tiers</Text>
        {campaignTiers.map((tier, index) => (
          <View key={index} style={styles.tierContainer}>
            <View style={styles.tierHeader}>
              <Text style={styles.tierTitle}>
                {tier.tierStatus === 'PROCESSING' ? '•' : '◦'} Tier {tier.tierOrder}: {tier.tierStatus}
              </Text>
              <Text style={styles.tierDiscount}>{tier.discountPercent}% OFF</Text>
            </View>
            <Text style={styles.tierProgress}>
              {tier.currentCount} / {tier.thresholdQuantity} {campaignType === 'MILESTONE' ? 'units sold' : 'preorders'}
            </Text>
            {tier.currentCount < tier.thresholdQuantity && (
              <Text style={styles.tierRemaining}>
                Need {tier.thresholdQuantity - tier.currentCount} more
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderCampaignTimeline = () => {
    if (!hasCampaign) return null;

    const { startCampaignTime, endCampaignTime } = product.activeCampaign;
    const paymentDeadline = new Date(endCampaignTime);
    paymentDeadline.setDate(paymentDeadline.getDate() + 14);

    return (
      <View style={styles.timelineContainer}>
        <Text style={styles.sectionTitle}>Campaign Timeline</Text>
        <View style={styles.timelineItem}>
          <View style={[styles.timelineDot, { backgroundColor: '#4caf50' }]} />
          <Text>Campaign Started</Text>
        </View>
        <View style={styles.timelineLine} />
        <View style={styles.timelineItem}>
          <Text style={styles.timelineText}>Mar 27, 2025</Text>
        </View>
        <View style={styles.timelineLine} />
        <View style={styles.timelineItem}>
          <View style={[styles.timelineDot, { backgroundColor: '#2196f3' }]} />
          <Text>Current Stage</Text>
        </View>
        <View style={styles.timelineLine} />
        <View style={styles.timelineItem}>
          <Text style={styles.timelineText}>Campaign in progress</Text>
        </View>
        <View style={styles.timelineLine} />
        <View style={styles.timelineItem}>
          <View style={[styles.timelineDot, { backgroundColor: '#ccc' }]} />
          <Text>Campaign Ends</Text>
        </View>
        <View style={styles.timelineLine} />
        <View style={styles.timelineItem}>
          <Text style={styles.timelineText}>{new Date(endCampaignTime).toLocaleDateString()}</Text>
        </View>
        {campaignType === 'GROUP' && (
          <>
            <View style={styles.timelineLine} />
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#ff9800' }]} />
              <Text>Payment Deadline</Text>
            </View>
            <View style={styles.timelineLine} />
            <View style={styles.timelineItem}>
              <Text style={styles.timelineText}>{paymentDeadline.toLocaleDateString()}</Text>
            </View>
            <Text style={styles.warningText}>
              Must pay remaining balance within 14 days after campaign ends
            </Text>
          </>
        )}
      </View>
    );
  };

  const renderProductDetailsTab = () => (
    <View>
      <Text style={styles.productName}>{product.seriesName}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.seriesId}>Series ID: {product.id}</Text>
        <View style={styles.tagsContainer}>
          <Text style={[styles.tag, styles.boxTag]}>Available Boxes: {product.availableBoxUnits}</Text>
          <Text style={[styles.tag, styles.packageTag]}>Available Packages: {product.availablePackageUnits}</Text>
          <Text style={[styles.tag, styles.activeTag]}>Active</Text>
        </View>
      </View>
      {renderCampaignTiers()}
      <View style={styles.priceContainer}>
        <Text style={styles.price}>
          {discountedPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </Text>
        <Text style={styles.originalPrice}>
          {price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </Text>
        <Text style={styles.discountTag}>-{discountPercent}%</Text>
      </View>
      {campaignType === 'GROUP' && (
        <View style={styles.depositContainer}>
          <Text style={styles.depositText}>
            Deposit Required: {deposit.toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})}
          </Text>
          <Text style={styles.depositText}>
            Remaining balance: {remainingBalance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})}
            <TouchableOpacity style={styles.infoIcon}>
              <Ionicons name="information-circle-outline" size={16} color="#000" />
            </TouchableOpacity>
          </Text>
        </View>
      )}
      {renderCampaignTimeline()}
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{product.description || 'Không có mô tả'}</Text>
      <View style={styles.optionContainer}>
        <TouchableOpacity
          style={[styles.optionButton, isSingleBoxSelected && styles.selectedOption]}
          onPress={() => setIsSingleBoxSelected(true)}
        >
          <Text>Single Box ({product.boxPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, !isSingleBoxSelected && styles.selectedOption]}
          onPress={() => setIsSingleBoxSelected(false)}
        >
          <Text>Package ({product.packagePrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})})</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityLabel}>Quantity:</Text>
        <View style={styles.quantitySelector}>
          <TouchableOpacity onPress={() => quantity > 1 && setQuantity(quantity - 1)}>
            <Ionicons name="remove-circle-outline" size={24} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={() => quantity < availableUnits && setQuantity(quantity + 1)}>
            <Ionicons name="add-circle-outline" size={24} />
          </TouchableOpacity>
        </View>
        <Text style={styles.availableText}>
          {availableUnits} {isSingleBoxSelected ? 'boxes' : 'packages'} available
        </Text>
      </View>
    </View>
  );

  const renderCampaignDetailsTab = () => {
    if (!hasCampaign || !campaignType) {
      return (
        <View>
          <Text style={styles.sectionTitle}>Campaign Details</Text>
          <Text style={styles.description}>No active campaign available.</Text>
        </View>
      );
    }

    return (
      <View>
        <Text style={styles.sectionTitle}>
          {campaignType} Campaign Details
        </Text>
        <Text style={styles.description}>
          This is a {campaignType} campaign. {campaignType === 'MILESTONE'
            ? 'Products are already in stock and will be shipped immediately after purchase. Price depends on the current active tier.'
            : 'You will be charged a 50% deposit now, and the remaining balance after the campaign ends. Final price will be determined by the tier reached when the campaign ends.'}
        </Text>
        <Text style={styles.sectionTitle}>Campaign Rules</Text>
        {campaignType === 'MILESTONE' ? (
          <>
            <Text style={styles.infoText}>• Products are in stock and ready to ship</Text>
            <Text style={styles.infoText}>• Price is determined by the current active tier</Text>
            <Text style={styles.infoText}>• As more units are sold, higher tiers with better discounts may be unlocked</Text>
            <Text style={styles.infoText}>• You pay the price based on the tier active at the time of your purchase</Text>
          </>
        ) : (
          <>
            <Text style={styles.infoText}>• You will be charged a 50% deposit now, and the remaining balance after the campaign ends</Text>
            <Text style={styles.infoText}>• Final price will be determined by the tier reached when the campaign ends</Text>
            <Text style={styles.infoText}>• You must complete the full payment within 14 days after the campaign ends or your deposit will be forfeited</Text>
            <Text style={styles.infoText}>• You can track all your preorders in your account preorder history</Text>
          </>
        )}
        <Text style={styles.sectionTitle}>Campaign Progress</Text>
        <Text style={styles.tierProgress}>
          {activeTier ? activeTier.currentCount : 0} Units {campaignType === 'MILESTONE' ? 'Sold' : 'Preordered'}
        </Text>
        {renderCampaignTiers()}
      </View>
    );
  };

  const renderShippingReturnsTab = () => (
    <View>
      <Text style={styles.sectionTitle}>Shipping Information</Text>
      <Text style={styles.description}>
        All orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed on the next business day.
      </Text>
      {campaignType === 'GROUP' && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Preorder Shipping</Text>
          <Text style={styles.description}>
            For preorder campaigns, shipping will begin after the campaign ends and all payments are completed. Estimated delivery time will be provided after the campaign ends.
          </Text>
        </View>
      )}
      <Text style={styles.sectionTitle}>Return Policy</Text>
      <Text style={styles.description}>
        We offer a 14-day return policy for unopened items in their original packaging. Please contact our customer service team to initiate a return.
      </Text>
      {campaignType === 'GROUP' && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Preorder Cancellation Policy</Text>
          <Text style={styles.description}>
            Preorders cannot be cancelled after the campaign ends. If you fail to complete the full payment within 14 days after the campaign ends, your deposit will be forfeited.
          </Text>
        </View>
      )}
    </View>
  );

  const renderProductSpecification = () => {
    // Determine the background color for the campaign type tag dynamically
    const campaignTypeBackgroundColor = campaignType === 'MILESTONE' ? '#4caf50' : campaignType === 'GROUP' ? '#ff9800' : '#ccc';

    return (
      <View style={styles.specificationContainer}>
        <Text style={styles.sectionTitle}>Product Specification</Text>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Series Name:</Text>
          <Text style={styles.specValue}>{product.seriesName}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Series ID:</Text>
          <Text style={styles.specValue}>{product.id}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Box Price:</Text>
          <Text style={styles.specValue}>{product.boxPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Package Price:</Text>
          <Text style={styles.specValue}>{product.packagePrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Available Box Units:</Text>
          <Text style={styles.specValue}>{product.availableBoxUnits}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Available Package Units:</Text>
          <Text style={styles.specValue}>{product.availablePackageUnits}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Campaign Type:</Text>
          <Text style={[styles.specValue, styles.campaignTypeTag, { backgroundColor: campaignTypeBackgroundColor }]}>
            {campaignType || 'N/A'}
          </Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Campaign Start:</Text>
          <Text style={styles.specValue}>
            {hasCampaign ? new Date(product.activeCampaign.startCampaignTime).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Campaign End:</Text>
          <Text style={styles.specValue}>
            {hasCampaign ? new Date(product.activeCampaign.endCampaignTime).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Status:</Text>
          <Text style={styles.specValue}>{product.active ? 'Active' : 'Inactive'}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Number of Items:</Text>
          <Text style={styles.specValue}>{product.items?.length || 0}</Text>
        </View>
      </View>
    );
  };

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {['Product Details', 'Campaign Details', 'Shipping & Returns'].map(tab => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Product Details':
        return renderProductDetailsTab();
      case 'Campaign Details':
        return renderCampaignDetailsTab();
      case 'Shipping & Returns':
        return renderShippingReturnsTab();
      default:
        return renderProductDetailsTab();
    }
  };

  const renderActionButton = () => {
    if (!campaignType) {
      return (
        <TouchableOpacity style={styles.addToCartButton}>
          <Ionicons name="cart-outline" size={24} color="white" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      );
    }

    if (campaignType === 'GROUP') {
      return (
        <TouchableOpacity
          style={styles.preOrderButton}
          onPress={() => navigation.navigate('PaymentScreen', { productId, quantity, isSingleBoxSelected })}
        >
          <Ionicons name="wallet-outline" size={24} color="white" />
          <Text style={styles.preOrderText}>Pre-order with Deposit</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={styles.addToCartButton}>
        <Ionicons name="cart-outline" size={24} color="white" />
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => (
    <View>
      {renderHeader()}
      <View style={styles.imageContainer}>
        <FlatList
          ref={imageFlatListRef}
          data={product.seriesImageUrls}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => `image-${index}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleImageScroll}
          scrollEventThrottle={16}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
        <View style={styles.paginationContainer}>
          {product.seriesImageUrls.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                { backgroundColor: index === currentImageIndex ? '#d32f2f' : '#ccc' }
              ]}
            />
          ))}
        </View>
      </View>
      <View style={styles.detailsContainer}>
        {renderTabs()}
        {renderTabContent()}
        {renderProductSpecification()}
      </View>
      <View style={styles.bottomPadding} />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <FlatList
        data={productData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={true}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={1}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
      />

      <View style={styles.scrollIndicator} />

      {renderActionButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  backButton: {
    position: 'absolute',
    top: Platform.select({ ios: 40, android: 20, web: 20 }),
    left: 20,
    zIndex: 10,
  },
  headerContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  campaignType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoIcon: {
    marginLeft: 4,
  },
  campaignInfo: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  campaignEnd: {
    fontSize: 12,
    color: '#666',
  },
  headerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  headerButtonText: {
    fontSize: 14,
    color: '#000',
  },
  headerButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  headerButtonLabel: {
    color: '#fff',
    fontSize: 14,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: width,
    height: Platform.select({ web: 400, default: 300 }),
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  detailsContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  seriesId: {
    fontSize: 14,
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 4,
    fontSize: 12,
  },
  boxTag: {
    backgroundColor: '#e3f2fd',
    color: '#2196f3',
  },
  packageTag: {
    backgroundColor: '#f3e5f5',
    color: '#9c27b0',
  },
  activeTag: {
    backgroundColor: '#e8f5e9',
    color: '#4caf50',
  },
  tierSection: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tierContainer: {
    marginBottom: 8,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tierTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tierDiscount: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: 'bold',
  },
  tierProgress: {
    fontSize: 12,
    color: '#666',
  },
  tierRemaining: {
    fontSize: 12,
    color: '#d32f2f',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  discountTag: {
    backgroundColor: '#4caf50',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  depositContainer: {
    marginVertical: 8,
  },
  depositText: {
    fontSize: 14,
    color: '#666',
  },
  timelineContainer: {
    marginVertical: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: '#ccc',
    marginLeft: 5,
    marginVertical: 4,
  },
  timelineText: {
    fontSize: 12,
    color: '#666',
  },
  warningText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  optionButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedOption: {
    borderColor: '#2196f3',
    backgroundColor: '#e3f2fd',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  availableText: {
    fontSize: 12,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196f3',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    fontWeight: 'bold',
  },
  specificationContainer: {
    marginVertical: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  specLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    color: '#000',
    flex: 1,
    textAlign: 'right',
  },
  campaignTypeTag: {
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bottomPadding: {
    height: 100,
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  preOrderButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  preOrderText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollIndicator: {
    position: 'absolute',
    right: 2,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: '#d32f2f',
    opacity: 0.6,
    borderRadius: 3,
  },
});

export default ProductDetailScreen;