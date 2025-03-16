import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// Component CircularQuantityPicker: wheel vô hạn với mục giữa được chọn
const CircularQuantityPicker = ({ quantity, setQuantity, maxQuantity }) => {
  const ITEM_HEIGHT = 40;
  // Dãy gốc từ 1 đến maxQuantity
  const originalData = Array.from({ length: maxQuantity }, (_, i) => i + 1);
  // Lặp lại dữ liệu 3 lần để mô phỏng hiệu ứng vô hạn
  const data = [...originalData, ...originalData, ...originalData];
  const flatListRef = useRef(null);

  // Khi mount, cuộn về giữa (bản copy thứ 2)
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: ITEM_HEIGHT * originalData.length,
        animated: false,
      });
    }
  }, []);

  // Cập nhật quantity liên tục khi cuộn
  const handleScroll = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    // Giá trị được chọn dựa trên vị trí trong dãy lặp lại, sau đó lấy modulo để ra số trong originalData
    const selected = data[index % maxQuantity];
    if (selected !== quantity) {
      setQuantity(selected);
    }
  };

  // Khi cuộn kết thúc, nếu gần biên thì tái căn (recenter) để tạo cảm giác vô hạn
  const handleScrollEnd = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const dataLength = originalData.length;
    if (index < dataLength) {
      // Quá gần đầu, cộng thêm dataLength để chuyển về giữa
      const newIndex = index + dataLength;
      flatListRef.current.scrollToOffset({ offset: newIndex * ITEM_HEIGHT, animated: false });
    } else if (index >= dataLength * 2) {
      // Quá gần cuối, trừ đi dataLength để chuyển về giữa
      const newIndex = index - dataLength;
      flatListRef.current.scrollToOffset({ offset: newIndex * ITEM_HEIGHT, animated: false });
    }
  };

  // Để mục giữa được căn giữa, ta thêm padding top và bottom bằng (containerHeight - ITEM_HEIGHT)/2.
  // Với containerHeight = 120, padding = 40.
  return (
    <FlatList
      ref={flatListRef}
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => {
        const isSelected = item === quantity;
        return (
          <View style={[styles.scrollerItem, isSelected && styles.scrollerItemSelected]}>
            <Text style={[styles.scrollerItemText, isSelected && styles.scrollerItemTextSelected]}>
              {item}
            </Text>
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      onScroll={handleScroll}
      onMomentumScrollEnd={handleScrollEnd}
      scrollEventThrottle={16}
      contentContainerStyle={{
        paddingVertical: 40, // để mục giữa (40px padding top + 40px bottom) luôn nằm giữa container 120px
      }}
      style={styles.scroller}
      nestedScrollEnabled={true}
    />
  );
};

const ProductDetailNewTierScreen = () => {
  // Nếu có Context giỏ hàng thật, thay bằng useCart()
  const [cartItems, setCartItemsState] = useState([]);
  const setCartItems = (newCart) => setCartItemsState(newCart);

  // Khai báo số lượng ban đầu của mỗi tier (hằng số)
  const INITIAL_SUPER = 250; // Super Early Bird (giảm 40%)
  const INITIAL_EARLY = 180; // Early Bird (giảm 33%)
  const INITIAL_PRE = 100;   // Pre-order (giảm 25%)

  // Số lượng còn lại của mỗi tier
  const [superEarlyLeft, setSuperEarlyLeft] = useState(INITIAL_SUPER);
  const [earlyLeft, setEarlyLeft] = useState(INITIAL_EARLY);
  const [preLeft, setPreLeft] = useState(INITIAL_PRE);

  // Loại sản phẩm (Box / Package)
  const [selectedType, setSelectedType] = useState(null);
  // Số lượng được chọn
  const [quantity, setQuantity] = useState(1);

  // Sản phẩm mẫu
  const product = {
    title: 'Awesome Figure Collection',
    image:
      'https://bizweb.dktcdn.net/100/329/122/files/blind-box-popmart-la-nhung-chiec-hop-kin-co-chua-nhan-vat-ngau-nhien.webp?v=1724125816533',
    campaign: 'Limited Pre-order Campaign',
  };

  // Giá mẫu: Package mặc định là 85 USD, Box là 85/6 làm tròn lên
  const packagePriceUSD = 85;
  const boxPriceUSD = Math.ceil(85 / 6);
  const exchangeRate = 23000;
  const packagePriceVND = packagePriceUSD * exchangeRate;
  const boxPriceVND = boxPriceUSD * exchangeRate;
  // Giá mẫu hiển thị: nếu chưa chọn hoặc chọn Package => dùng packagePriceVND, nếu chọn Box => dùng boxPriceVND.
  const samplePriceVND =
    selectedType === 'Box' ? boxPriceVND : packagePriceVND;

  // Hook điều hướng
  const navigation = useNavigation();

  /**
   * Hàm tính tổng chi phí đơn hàng khi chọn Package.
   * Phân bổ ưu tiên:
   * - Dùng Super Early Bird (giảm 40%) tối đa INITIAL_SUPER.
   * - Nếu còn dư, dùng Early Bird (giảm 33%) tối đa INITIAL_EARLY.
   * - Nếu còn dư, dùng Pre-order (giảm 25%) tối đa INITIAL_PRE.
   * Nếu sau đó còn dư (remainder > 0) thì không đủ ưu đãi.
   */
  const calculateTierCost = (qtyWanted) => {
    let remainder = qtyWanted;
    let totalCost = 0;
    let usedFromSuper = 0;
    let usedFromEarly = 0;
    let usedFromPre = 0;

    if (superEarlyLeft > 0) {
      usedFromSuper = Math.min(superEarlyLeft, remainder);
      totalCost += usedFromSuper * packagePriceVND * (1 - 0.40);
      remainder -= usedFromSuper;
    }
    if (remainder > 0 && earlyLeft > 0) {
      usedFromEarly = Math.min(earlyLeft, remainder);
      totalCost += usedFromEarly * packagePriceVND * (1 - 0.33);
      remainder -= usedFromEarly;
    }
    if (remainder > 0 && preLeft > 0) {
      usedFromPre = Math.min(preLeft, remainder);
      totalCost += usedFromPre * packagePriceVND * (1 - 0.25);
      remainder -= usedFromPre;
    }
    return {
      totalCost,
      remainder,
      usedFromSuper,
      usedFromEarly,
      usedFromPre,
    };
  };

  // Tính tổng giá đơn hàng và phân bổ nếu chọn Package
  let displayPrice = 0;
  let distribution = { usedFromSuper: 0, usedFromEarly: 0, usedFromPre: 0 };
  if (selectedType === 'Package') {
    const { totalCost, remainder, ...rest } = calculateTierCost(quantity);
    displayPrice = remainder > 0 ? 0 : totalCost;
    distribution = rest;
  } else if (selectedType === 'Box') {
    displayPrice = quantity * boxPriceVND;
  }

  // Hàm định dạng tiền VND
  const formatVND = (value) =>
    value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (!selectedType) {
      Alert.alert('Thông báo', 'Vui lòng chọn loại sản phẩm!');
      return;
    }
    if (selectedType === 'Package') {
      const { totalCost, remainder, usedFromSuper, usedFromEarly, usedFromPre } =
        calculateTierCost(quantity);
      if (remainder > 0) {
        Alert.alert(
          'Thông báo',
          'Không đủ số lượng ưu đãi trong 3 tier (Super Early Bird, Early Bird, Pre-order).'
        );
        return;
      }
      setSuperEarlyLeft(superEarlyLeft - usedFromSuper);
      setEarlyLeft(earlyLeft - usedFromEarly);
      setPreLeft(preLeft - usedFromPre);

      const newItem = {
        id: Date.now().toString(),
        title: product.title,
        image: product.image,
        quantity,
        price: totalCost,
        type: 'Package',
      };
      setCartItems([...cartItems, newItem]);
      Alert.alert('Thành công', `Bạn đã thêm ${quantity} món (Package) vào giỏ hàng.`);
    } else {
      const newItem = {
        id: Date.now().toString(),
        title: product.title,
        image: product.image,
        quantity,
        price: quantity * boxPriceVND,
        type: 'Box',
      };
      setCartItems([...cartItems, newItem]);
      Alert.alert('Thành công', `Bạn đã thêm ${quantity} món (Box) vào giỏ hàng.`);
    }
  };

  // Xử lý mua ngay
  const handleBuyNow = () => {
    if (!selectedType) {
      Alert.alert('Thông báo', 'Vui lòng chọn loại sản phẩm!');
      return;
    }
    Alert.alert('Pre-Order', 'Chuyển sang trang thanh toán...');
  };

  // Tính % progress cho từng tier (dựa trên số đã sử dụng so với tổng ban đầu)
  const superProgress =
    selectedType === 'Package'
      ? (distribution.usedFromSuper / INITIAL_SUPER) * 100
      : 0;
  const earlyProgress =
    selectedType === 'Package'
      ? (distribution.usedFromEarly / INITIAL_EARLY) * 100
      : 0;
  const preProgress =
    selectedType === 'Package'
      ? (distribution.usedFromPre / INITIAL_PRE) * 100
      : 0;

  // Xác định số lượng tối đa được phép chọn:
  // Nếu chọn Package => max = 250 + 180 + 100 = 530, nếu Box => max = 100
  const maxQuantity = selectedType === 'Package' ? 530 : 100;

  return (
    <View style={{ flex: 1 }}>
      {/* Nút Back */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <ScrollView style={styles.container}>
        {/* Ảnh sản phẩm */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
        </View>

        {/* Thông tin chung sản phẩm */}
        <View style={styles.header}>
          <Text style={styles.title}>{product.title}</Text>
          {/* Giá mẫu hiển thị ngay dưới tên sản phẩm với màu đỏ */}
          <Text style={styles.samplePriceLabel}>{formatVND(samplePriceVND)}</Text>
          <Text style={styles.subTitle}>{product.campaign}</Text>
          <Text style={styles.endTime}>Ends in: 7 days</Text>
        </View>

        {/* Chọn loại (Box / Package) */}
        <View style={styles.typeSelectionContainer}>
          <Text style={styles.typeSelectionLabel}>Type:</Text>
          <View style={styles.typeOptions}>
            <TouchableOpacity
              style={[styles.typeOption, selectedType === 'Box' && styles.typeOptionActive]}
              onPress={() => setSelectedType('Box')}
            >
              <Text style={[styles.typeOptionText, selectedType === 'Box' && styles.typeOptionTextActive]}>
                Box
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeOption, selectedType === 'Package' && styles.typeOptionActive]}
              onPress={() => setSelectedType('Package')}
            >
              <Text style={[styles.typeOptionText, selectedType === 'Package' && styles.typeOptionTextActive]}>
                Package
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3 Tier: Super Early Bird, Early Bird, Pre-order */}
        <View style={styles.tierContainer}>
          {/* Super Early Bird */}
          <View style={[styles.tierCard, { backgroundColor: '#F5F5F5' }]}>
            <Text style={styles.tierTitle}>Super Early Bird</Text>
            <Text style={styles.tierDiscount}>Giảm 40%</Text>
            <Text style={styles.tierFixedPrice}>
              Giá bán niêm yết: {formatVND(packagePriceVND)}
            </Text>
            <Text style={styles.tierLeft}>
              Còn lại: {superEarlyLeft - (selectedType === 'Package' ? distribution.usedFromSuper : 0)}/{INITIAL_SUPER}
            </Text>
            <View style={styles.progressBarTierContainer}>
              <View style={[styles.progressBarTierFill, { width: `${superProgress}%` }]} />
            </View>
          </View>

          {/* Early Bird */}
          <View style={[styles.tierCard, { backgroundColor: '#FFF9E0' }]}>
            <Text style={styles.tierTitle}>Early Bird</Text>
            <Text style={styles.tierDiscount}>Giảm 33%</Text>
            <Text style={styles.tierFixedPrice}>
              Giá bán niêm yết: {formatVND(packagePriceVND)}
            </Text>
            <Text style={styles.tierLeft}>
              Còn lại: {earlyLeft - (selectedType === 'Package' ? distribution.usedFromEarly : 0)}/{INITIAL_EARLY}
            </Text>
            <View style={styles.progressBarTierContainer}>
              <View style={[styles.progressBarTierFill, { width: `${earlyProgress}%` }]} />
            </View>
          </View>

          {/* Pre-order */}
          <View style={[styles.tierCard, { backgroundColor: '#FFF3F3' }]}>
            <Text style={styles.tierTitle}>Pre-order</Text>
            <Text style={styles.tierDiscount}>Giảm 25%</Text>
            <Text style={styles.tierFixedPrice}>
              Giá bán niêm yết: {formatVND(packagePriceVND)}
            </Text>
            <Text style={styles.tierLeft}>
              Còn lại: {preLeft - (selectedType === 'Package' ? distribution.usedFromPre : 0)}/{INITIAL_PRE}
            </Text>
            <View style={styles.progressBarTierContainer}>
              <View style={[styles.progressBarTierFill, { width: `${preProgress}%` }]} />
            </View>
          </View>
        </View>

        {/* Phần chọn số lượng sử dụng CircularQuantityPicker */}
        <View style={styles.quantityContainer}>
          <Text style={styles.label}>Quantity:</Text>
          <CircularQuantityPicker
            quantity={quantity}
            setQuantity={setQuantity}
            maxQuantity={maxQuantity}
          />
        </View>

        {/* Hiển thị thông tin phân bổ (chỉ với Package) */}
        {selectedType === 'Package' && (
          <View style={styles.infoDistribution}>
            <Text style={styles.infoDistributionText}>
              • Super Early Bird sử dụng: {distribution.usedFromSuper}
            </Text>
            <Text style={styles.infoDistributionText}>
              • Early Bird sử dụng: {distribution.usedFromEarly}
            </Text>
            <Text style={styles.infoDistributionText}>
              • Pre-order sử dụng: {distribution.usedFromPre}
            </Text>
          </View>
        )}

        {/* Tổng giá đơn hàng */}
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceTitle}>Tổng giá đơn hàng:</Text>
          {displayPrice > 0 ? (
            <Text style={styles.totalPriceValue}>{formatVND(displayPrice)}</Text>
          ) : (
            <Text style={styles.totalPriceValueError}>
              Không đủ hàng hoặc chưa chọn type
            </Text>
          )}
        </View>

        {/* Nút thêm vào giỏ hàng */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>ADD TO CART</Text>
        </TouchableOpacity>

        {/* Nút mua ngay */}
        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <Text style={styles.buyNowButtonText}>PRE-ORDER NOW</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProductDetailNewTierScreen;

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
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 5,
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
  samplePriceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'red', // Giá mẫu hiển thị màu đỏ
    marginTop: 5,
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
  typeSelectionContainer: {
    marginVertical: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
  },
  typeSelectionLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#333',
  },
  typeOptions: {
    flexDirection: 'row',
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
  tierContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  tierCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  tierTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
  tierDiscount: {
    fontSize: 14,
    color: '#D32F2F',
    fontWeight: '600',
    marginBottom: 8,
  },
  tierFixedPrice: {
    fontSize: 13,
    color: '#555',
    marginBottom: 5,
  },
  tierLeft: {
    fontSize: 13,
    color: '#333',
    marginBottom: 5,
  },
  progressBarTierContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarTierFill: {
    height: '100%',
    backgroundColor: 'green',
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
  scroller: {
    height: 120, // hiển thị khoảng 3 mục
  },
  scrollerItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollerItemText: {
    fontSize: 16,
    color: '#333',
  },
  scrollerItemSelected: {
    backgroundColor: '#e0e0e0',
  },
  scrollerItemTextSelected: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  infoDistribution: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  infoDistributionText: {
    fontSize: 14,
    color: '#555',
    marginVertical: 2,
  },
  totalPriceContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
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
  totalPriceValueError: {
    fontSize: 14,
    fontWeight: '700',
    color: 'red',
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
    marginBottom: 30,
  },
  buyNowButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
