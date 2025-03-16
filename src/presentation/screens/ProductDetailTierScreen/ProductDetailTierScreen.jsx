import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Animated } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useCart } from '@presentation/context/CartContext';

const ProductDetailTierScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { product } = route.params || {};

  // Số lượng mua
  const [quantity, setQuantity] = useState(1);
  // Trạng thái hiển thị thông báo khi thêm giỏ hàng
  const [showNotification, setShowNotification] = useState(false);
  // Loại sản phẩm được chọn (Box / Package)
  const [selectedType, setSelectedType] = useState(null);
  // Đo chiều rộng của progress bar container
  const [containerWidth, setContainerWidth] = useState(0);
  // Animated value cho progress bar fill
  const progressAnim = useRef(new Animated.Value(0)).current;

  const { cartItems, setCartItems } = useCart();

  // Hàm tăng giảm số lượng (tối đa 100 nếu là Package)
  const handleIncrement = () => {
    if (selectedType === 'Package') {
      if (quantity < 100) {
        setQuantity(quantity + 1);
      }
    } else {
      // Nếu là Box thì không giới hạn (hoặc bạn có thể tự đặt giới hạn)
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  /**
   * Hàm xác định mức discount (chỉ áp dụng cho Package):
   * - Nếu quantity từ 1 đến 40: giảm 15%
   * - Nếu quantity từ 41 đến 70: giảm 24%
   * - Nếu quantity từ 71 đến 100: giảm 30%
   */
  const getDiscountInfo = (qty) => {
    if (qty > 70) {
      return { rate: 0.30, label: '-30%', color: 'red' };
    } else if (qty > 40) {
      return { rate: 0.24, label: '-24%', color: 'yellow' };
    } else {
      return { rate: 0.15, label: '-15%', color: 'green' };
    }
  };

  // Lấy giá base (USD -> VND) từ product
  const basePrice = parseFloat(product?.price?.replace('$', '') || '85.50') * 23000;

  // Nếu chọn Package thì áp dụng discount theo nghiệp vụ, ngược lại discount = 0
  const isPackage = selectedType === 'Package';
  const { rate: discountRate, label: discountLabel, color: discountColor } = isPackage
    ? getDiscountInfo(quantity)
    : { rate: 0, label: '', color: '#ccc' };

  // Tính tổng giá: số lượng * đơn giá * (1 - discountRate)
  const totalPrice = quantity * basePrice * (1 - discountRate);

  // Format tiền VND đơn giản
  const formatVND = (value) => {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  // Animate progress bar khi quantity hoặc containerWidth thay đổi
  useEffect(() => {
    if (containerWidth > 0) {
      const newWidth = (quantity / 100) * containerWidth;
      Animated.timing(progressAnim, {
        toValue: newWidth,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [quantity, containerWidth, progressAnim]);

  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (!selectedType) {
      alert('Vui lòng chọn loại sản phẩm trước khi thêm vào giỏ hàng!');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      title: product?.title || 'Dimoo Space Series - Package #8',
      image: product?.image || 'https://bizweb.dktcdn.net/100/329/122/files/blind-box-popmart-la-nhung-chiec-hop-kin-co-chua-nhan-vat-ngau-nhien.webp?v=1724125816533',
      quantity: quantity,
      price: totalPrice, // Lưu giá sau discount
      selected: false,
      type: selectedType,
    };

    setCartItems([...cartItems, newItem]);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  // Hàm xử lý "Buy Now" (Pre-Order)
  const handleBuyNow = () => {
    if (!selectedType) {
      alert('Vui lòng chọn loại sản phẩm trước khi mua!');
      return;
    }
    console.log('Buy Now clicked');
    // Bạn có thể điều hướng sang màn hình thanh toán/checkout nếu cần
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Nút Back */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <ScrollView style={styles.container}>
        {/* Ảnh sản phẩm */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: product?.image ||
                'https://bizweb.dktcdn.net/100/329/122/files/blind-box-popmart-la-nhung-chiec-hop-kin-co-chua-nhan-vat-ngau-nhien.webp?v=1724125816533'
            }}
            style={styles.productImage}
          />
        </View>

        {/* Tiêu đề sản phẩm */}
        <View style={[styles.header, { paddingTop: 20 }]}>
          <Text style={styles.title}>{product?.title || 'Dimoo Space Series - Package #8'}</Text>
          <Text style={styles.subTitle}>{product?.campaign || 'MILESTONE CAMPAIGN'}</Text>
          <Text style={styles.endTime}>Ends in: 5 days, 12 hours</Text>
        </View>

        {/* Giá hiển thị ban đầu */}
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>{product?.price || '$85.50'}</Text>
          <Text style={styles.discountLabel}>(10% off)</Text>
          <Text style={styles.originalPrice}>{product?.originalPrice || '$95.00'}</Text>
        </View>

        {/* Chọn loại sản phẩm (Box / Package) */}
        <View style={styles.typeSelectionContainer}>
          <Text style={styles.typeSelectionLabel}>Type:</Text>
          <View style={styles.typeOptions}>
            <TouchableOpacity
              style={[styles.typeOption, selectedType === 'Box' && styles.typeOptionActive]}
              onPress={() => setSelectedType('Box')}
            >
              <Text style={[styles.typeOptionText, selectedType === 'Box' && styles.typeOptionTextActive]}>Box</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeOption, selectedType === 'Package' && styles.typeOptionActive]}
              onPress={() => setSelectedType('Package')}
            >
              <Text style={[styles.typeOptionText, selectedType === 'Package' && styles.typeOptionTextActive]}>Package</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chọn số lượng */}
        <View style={styles.quantityContainer}>
          <Text style={styles.label}>Quantity:</Text>
          <View style={styles.quantityControl}>
            <TouchableOpacity
              style={[styles.btnQty, { opacity: selectedType ? 1 : 0.5 }]}
              onPress={selectedType ? handleDecrement : null}
              disabled={!selectedType}
            >
              <Text style={styles.btnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity
              style={[styles.btnQty, { opacity: selectedType ? 1 : 0.5 }]}
              onPress={selectedType ? handleIncrement : null}
              disabled={!selectedType}
            >
              <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Thanh progress hiển thị mốc giảm giá (chỉ áp dụng với Package) */}
        {selectedType === 'Package' && (
          <View style={styles.progressBarContainer}>
            <Text style={styles.progressBarLabel}>Progress to next discount:</Text>
            <View
              style={styles.progressBarBackground}
              onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
            >
              {/* Animated progress fill */}
              <Animated.View
                style={[
                  styles.progressBarFill,
                  { width: progressAnim, backgroundColor: discountColor },
                ]}
              />
              {/* Vạch đen mốc 1 (40%) */}
              <View style={[styles.milestoneLine, { left: '40%' }]} />
              {/* Vạch đen mốc 2 (70%) */}
              <View style={[styles.milestoneLine, { left: '70%' }]} />
            </View>
            <Text style={styles.milestoneInfo}>{quantity}/100</Text>
          </View>
        )}

        {/* Thông tin khác */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>• 50% deposit required ($4.25 per piece)</Text>
          <Text style={styles.infoText}>• Price locked once 50% deposit is guaranteed</Text>
          <Text style={styles.infoText}>• Full payment is due within 14 days after campaign ends</Text>
          <Text style={styles.infoText}>• Series contains: 6 figures + 1 secret chase</Text>
        </View>

        {/* Vùng hiển thị tổng giá đơn hàng và mức giảm giá */}
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceTitle}>Tổng giá đơn hàng:</Text>
          <Text style={styles.totalPriceValue}>
            {formatVND(totalPrice)} {discountLabel && isPackage ? discountLabel : ''}
          </Text>
        </View>

        {/* Nút thêm vào giỏ hàng */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>ADD TO CART</Text>
        </TouchableOpacity>

        {/* Nút mua ngay (Pre-Order) */}
        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <Text style={styles.buyNowButtonText}>PRE-ORDER NOW</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Thông báo khi thêm vào giỏ hàng thành công */}
      {showNotification && (
        <View style={styles.notification}>
          <Text style={styles.notificationText}>Added to cart successfully!</Text>
        </View>
      )}
    </View>
  );
};

export default ProductDetailTierScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 15,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 15,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  subTitle: {
    fontSize: 14,
    color: '#FF9800',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  endTime: {
    fontSize: 13,
    color: '#757575',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 10,
  },
  currentPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: '#D32F2F',
    marginRight: 5,
  },
  discountLabel: {
    fontSize: 14,
    color: '#D32F2F',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#757575',
    textDecorationLine: 'line-through',
  },
  typeSelectionContainer: {
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeSelectionLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#333',
  },
  typeOptions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  typeOption: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  typeOptionActive: {
    backgroundColor: '#FF9800',
  },
  typeOptionText: {
    fontSize: 14,
    color: '#333',
  },
  typeOptionTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnQty: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  btnText: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
  },
  qtyValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  progressBarContainer: {
    marginBottom: 15,
  },
  progressBarLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  progressBarBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  milestoneLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#000',
  },
  milestoneInfo: {
    marginTop: 5,
    fontSize: 13,
    color: '#555',
    textAlign: 'right',
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  totalPriceContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  totalPriceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  totalPriceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D32F2F',
  },
  addButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  buyNowButton: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 40,
  },
  buyNowButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  notification: {
    position: 'absolute',
    bottom: 20,
    left: '20%',
    right: '20%',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  notificationText: {
    color: '#fff',
    fontSize: 14,
  },
});
