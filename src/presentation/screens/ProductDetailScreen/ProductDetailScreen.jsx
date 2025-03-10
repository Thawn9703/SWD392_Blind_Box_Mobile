import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProductDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { product } = route.params || {};

  // Số lượng mua
  const [quantity, setQuantity] = useState(1);
  // Trạng thái hiển thị thông báo add to cart
  const [showNotification, setShowNotification] = useState(false);

  // Hàm tăng giảm số lượng
  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    // Thực hiện thêm sản phẩm vào giỏ hàng (cập nhật state, context hoặc Redux tùy ứng dụng)
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  // Hàm xử lý "Buy Now"
  const handleBuyNow = () => {
    // Thực hiện các hành động liên quan đến mua ngay (ví dụ: chuyển sang màn hình thanh toán)
    console.log('Buy Now clicked');
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Nút back */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <ScrollView style={styles.container}>
        {/* Không gian chứa ảnh sản phẩm */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product?.image || 'https://bizweb.dktcdn.net/100/329/122/files/blind-box-popmart-la-nhung-chiec-hop-kin-co-chua-nhan-vat-ngau-nhien.webp?v=1724125816533' }}
            style={styles.productImage}
          />
        </View>

        {/* Tiêu đề sản phẩm */}
        <View style={[styles.header, { paddingTop: 20 }]}>
          <Text style={styles.title}>
            {product?.title || 'Dimoo Space Series - Package #8'}
          </Text>
          <Text style={styles.subTitle}>
            {product?.campaign || 'MILESTONE CAMPAIGN'}
          </Text>
          <Text style={styles.endTime}>Ends in: 5 days, 12 hours</Text>
        </View>

        {/* Giá sản phẩm */}
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>
            {product?.price || '$85.50'}
          </Text>
          <Text style={styles.discountLabel}>(10% off)</Text>
          <Text style={styles.originalPrice}>
            {product?.originalPrice || '$95.00'}
          </Text>
        </View>

        {/* Trạng thái và milestone */}
        <Text style={styles.status}>Status: 0/8 boxes sold</Text>

        {/* Milestone discount tiers */}
        <View style={styles.discountTiers}>
          <Text style={styles.tierTitle}>Milestone Discount Tiers</Text>
          <Text style={styles.tierItem}>
            • Standard (1-4 items) - Regular Price ($95.00)
          </Text>
          <Text style={styles.tierItem}>
            • Bronze (5-9 items) - 10% off ($85.50)
            <Text style={{ color: 'orange' }}> - EXCLUSIVE SAVE $9.2</Text>
          </Text>
          <Text style={styles.tierItem}>
            • Silver (10-19 items) - 15% off ($80.75)
          </Text>
          <Text style={styles.tierItem}>
            • Gold (20+ items) - 20% off ($76.00)
          </Text>
        </View>

        {/* Chọn số lượng */}
        <View style={styles.quantityContainer}>
          <Text style={styles.label}>Quantity:</Text>
          <View style={styles.quantityControl}>
            <TouchableOpacity style={styles.btnQty} onPress={handleDecrement}>
              <Text style={styles.btnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity style={styles.btnQty} onPress={handleIncrement}>
              <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Thông tin chi tiết khác */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>• 50% deposit required ($4.25 per piece)</Text>
          <Text style={styles.infoText}>• Price locked once 50% deposit is guaranteed</Text>
          <Text style={styles.infoText}>• Full payment is due within 14 days after campaign ends</Text>
          <Text style={styles.infoText}>• Series contains: 6 figures + 1 secret chase</Text>
        </View>

        {/* Nút thêm vào giỏ hàng */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>ADD TO CART</Text>
        </TouchableOpacity>

        {/* Nút mua ngay */}
        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <Text style={styles.buyNowButtonText}>BUY NOW</Text>
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

export default ProductDetailScreen;

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
  status: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  discountTiers: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tierTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  tierItem: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
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
