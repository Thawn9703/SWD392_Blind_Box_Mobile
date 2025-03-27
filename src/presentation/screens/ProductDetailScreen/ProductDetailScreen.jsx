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
  const imageFlatListRef = useRef(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await blindboxFacade.getBlindboxSeriesById(productId);
        setProduct(data);
        setLoading(false);
      } catch (err) {
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

  const hasCampaign = product.activeCampaign && product.activeCampaign.isActive;
  const availableUnits = isSingleBoxSelected
    ? product.availableBoxUnits
    : product.availablePackageUnits;
  const price = isSingleBoxSelected ? product.boxPrice : product.packagePrice;
  const discountPercent = hasCampaign ? product.activeCampaign.campaignTiers[0].discountPercent : 0;
  const discountedPrice = hasCampaign ? price * (1 - discountPercent / 100) : price;

  // Tạo một mảng duy nhất để sử dụng trong FlatList chính
  const productData = [{ 
    id: 'product-details',
    product: product
  }];

  // Hàm render ảnh trong FlatList ảnh
  const renderImageItem = ({ item }) => (
    <Image
      source={{ uri: item || 'https://via.placeholder.com/400' }}
      style={styles.productImage}
      resizeMode="cover"
    />
  );

  // Xử lý khi ảnh thay đổi
  const handleImageScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentImageIndex(index);
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        {/* Phần hiển thị nhiều ảnh */}
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
          {/* Pagination dots */}
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
          {/* Tên sản phẩm */}
          <Text style={styles.productName}>{product.seriesName}</Text>

          {/* Thông tin availability */}
          <View style={styles.infoRow}>
            <Text style={styles.seriesId}>Series ID: {product.id}</Text>
            <View style={styles.tagsContainer}>
              <Text style={[styles.tag, styles.boxTag]}>BOXES: {product.availableBoxUnits}</Text>
              <Text style={[styles.tag, styles.packageTag]}>PACKAGES: {product.availablePackageUnits}</Text>
              <Text style={[styles.tag, styles.activeTag]}>Active</Text>
            </View>
          </View>

          {/* Giá sản phẩm */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {discountedPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </Text>
            {hasCampaign && (
              <>
                <Text style={styles.originalPrice}>
                  {price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </Text>
                <Text style={styles.discountTag}>-{discountPercent}%</Text>
              </>
            )}
          </View>

          {/* Phần campaign */}
          {hasCampaign && (
            <View style={styles.campaignSection}>
              <Text style={styles.sectionTitle}>Chi tiết Campaign</Text>
              <View style={styles.timelineContainer}>
                <View style={styles.timelineDot} />
                <Text>Bắt đầu: {new Date(product.activeCampaign.startCampaignTime).toLocaleDateString()}</Text>
                <View style={styles.timelineLine} />
                <View style={styles.timelineDot} />
                <Text>Giai đoạn hiện tại</Text>
                <View style={styles.timelineLine} />
                <View style={styles.timelineDot} />
                <Text>Kết thúc: {new Date(product.activeCampaign.endCampaignTime).toLocaleDateString()}</Text>
              </View>
              {product.activeCampaign.campaignTiers.map((tier, index) => (
                <View key={index} style={styles.tierInfo}>
                  <Text>{tier.alias}: Giảm {tier.discountPercent}%</Text>
                  <Text>{tier.currentCount}/{tier.thresholdQuantity} đơn vị</Text>
                </View>
              ))}
            </View>
          )}

          {/* Mô tả */}
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.description}>{product.description || 'Không có mô tả'}</Text>

          {/* Tùy chọn mua hàng */}
          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={[styles.optionButton, isSingleBoxSelected && styles.selectedOption]}
              onPress={() => setIsSingleBoxSelected(true)}
            >
              <Text>Lẻ ({product.boxPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })})</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, !isSingleBoxSelected && styles.selectedOption]}
              onPress={() => setIsSingleBoxSelected(false)}
            >
              <Text>Gói ({product.packagePrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })})</Text>
            </TouchableOpacity>
          </View>

          {/* Số lượng */}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Số lượng:</Text>
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
              {availableUnits} {isSingleBoxSelected ? 'hộp' : 'gói'} còn lại
            </Text>
          </View>
        </View>

        {/* Thêm thông tin khác */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>• 50% deposit required for pre-orders</Text>
          <Text style={styles.infoText}>• Price locked once deposit is paid</Text>
          <Text style={styles.infoText}>• Full payment is due within 14 days after campaign ends</Text>
          <Text style={styles.infoText}>• Free shipping on orders over 500.000 VND</Text>
        </View>

        {/* Thêm nội dung bổ sung */}
        <View style={styles.additionalInfoSection}>
          <Text style={styles.sectionTitle}>Thông tin bổ sung</Text>
          <Text style={styles.description}>
            Sản phẩm này là một phần của bộ sưu tập đặc biệt. Mỗi hộp chứa một nhân vật ngẫu nhiên
            từ bộ sưu tập. Tìm kiếm các nhân vật hiếm với tỷ lệ xuất hiện thấp!
          </Text>
          <Text style={styles.description}>
            Bạn có thể mua lẻ từng hộp hoặc mua theo gói để tiết kiệm chi phí. Khi mua theo gói, bạn
            sẽ nhận được nhiều hộp với giá ưu đãi so với mua lẻ.
          </Text>
        </View>

        {/* Đánh giá giả */}
        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>Đánh giá từ khách hàng</Text>
          <View style={styles.reviewItem}>
            <Text style={styles.reviewAuthor}>Nguyễn Văn A</Text>
            <Text style={styles.reviewRating}>★★★★★</Text>
            <Text style={styles.reviewContent}>
              Sản phẩm tuyệt vời! Tôi đã sưu tầm được gần đủ bộ và rất hài lòng với chất lượng.
            </Text>
          </View>
          <View style={styles.reviewItem}>
            <Text style={styles.reviewAuthor}>Trần Thị B</Text>
            <Text style={styles.reviewRating}>★★★★☆</Text>
            <Text style={styles.reviewContent}>
              Đóng gói cẩn thận, giao hàng nhanh. Sản phẩm đúng như mô tả.
            </Text>
          </View>
        </View>

        {/* Padding dưới cùng */}
        <View style={styles.bottomPadding} />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Nút back */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* FlatList chính */}
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

      {/* Thanh cuộn bên phải */}
      <View style={styles.scrollIndicator} />

      {/* Nút thêm vào giỏ hàng */}
      <TouchableOpacity style={styles.addToCartButton}>
        <Ionicons name="cart-outline" size={24} color="white" />
        <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
      </TouchableOpacity>
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
  campaignSection: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timelineContainer: {
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4caf50',
    marginBottom: 4,
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: '#ccc',
    marginLeft: 5,
    marginBottom: 4,
  },
  tierInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
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
  infoBox: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  additionalInfoSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginVertical: 8,
  },
  reviewsSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  reviewItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewAuthor: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  reviewRating: {
    color: '#FFD700',
    marginVertical: 4,
  },
  reviewContent: {
    fontSize: 14,
    color: '#666',
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