import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AddToCartScreen = () => {
  // Giả sử cartItems được lấy từ state, context hoặc props
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      title: 'Dimoo Space Series - Package #8',
      image: 'https://bizweb.dktcdn.net/100/329/122/files/blind-box-popmart-la-nhung-chiec-hop-kin-co-chua-nhan-vat-ngau-nhien.webp?v=1724125816533',
      quantity: 2,
      price: 85.50,
      selected: false,
    },
    // Có thể thêm các mục khác nếu cần...
  ]);

  // Hàm xử lý toggle checkbox cho từng mục
  const toggleSelect = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  // Hàm tăng số lượng của 1 sản phẩm trong giỏ
  const handleIncrementItem = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  // Hàm giảm số lượng của 1 sản phẩm trong giỏ
  const handleDecrementItem = (id) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 };
      }
      return item;
    }));
  };

  // Tính tổng tiền của các mục được chọn
  const totalCheckoutAmount = cartItems.reduce((total, item) => {
    if (item.selected) {
      return total + item.price * item.quantity;
    }
    return total;
  }, 0);

  // Xử lý thanh toán riêng cho từng mục
  const handleItemCheckout = (id) => {
    console.log('Checkout for item: ', id);
  };

  // Xử lý thanh toán cho các sản phẩm được chọn
  const handleGlobalCheckout = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    console.log('Global checkout for items: ', selectedItems);
  };

  // Xử lý hủy các mục đã chọn (cancel order)
  const handleCancelOrder = () => {
    setCartItems(cartItems.filter(item => !item.selected));
  };

  // Render mỗi mục sản phẩm trong giỏ hàng
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      {/* Checkbox */}
      <TouchableOpacity onPress={() => toggleSelect(item.id)} style={styles.checkbox}>
        {item.selected ? (
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        ) : (
          <Ionicons name="ellipse-outline" size={24} color="#ccc" />
        )}
      </TouchableOpacity>
      {/* Hình ảnh sản phẩm */}
      <Image source={{ uri: item.image }} style={styles.productImage} />
      {/* Thông tin sản phẩm */}
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <View style={styles.quantityAdjustContainer}>
          <Text style={styles.quantityLabel}>Quantity:</Text>
          <TouchableOpacity
            style={styles.qtyAdjustButton}
            onPress={() => handleDecrementItem(item.id)}
          >
            <Text style={styles.qtyAdjustText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.itemQuantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyAdjustButton}
            onPress={() => handleIncrementItem(item.id)}
          >
            <Text style={styles.qtyAdjustText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.itemPrice}>Price: ${item.price.toFixed(2)}</Text>
      </View>
      {/* Nút checkout riêng cho mục */}
      <TouchableOpacity style={styles.itemCheckoutButton} onPress={() => handleItemCheckout(item.id)}>
        <Text style={styles.itemCheckoutText}>Checkout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* Khung thanh toán tổng */}
      <View style={styles.checkoutContainer}>
        <TouchableOpacity style={styles.globalCheckoutButton} onPress={handleGlobalCheckout}>
          <Text style={styles.globalCheckoutText}>Checkout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelOrder}>
          <Text style={styles.cancelButtonText}>Cancel Order</Text>
        </TouchableOpacity>

        <View style={styles.totalAmountContainer}>
          <Text style={styles.totalAmountText}>Total: ${totalCheckoutAmount.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

export default AddToCartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 100, // Dành cho khung thanh toán
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    marginRight: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  quantityAdjustContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  quantityLabel: {
    fontSize: 14,
    color: '#333',
    marginRight: 5,
  },
  qtyAdjustButton: {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyAdjustText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  itemQuantityText: {
    marginHorizontal: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#D32F2F',
    fontWeight: '600',
    marginTop: 4,
  },
  itemCheckoutButton: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  itemCheckoutText: {
    color: '#fff',
    fontSize: 14,
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  globalCheckoutButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  globalCheckoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#757575',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmountContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  totalAmountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
