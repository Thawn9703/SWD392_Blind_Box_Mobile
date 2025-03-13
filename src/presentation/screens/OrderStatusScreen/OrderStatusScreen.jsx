import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Thêm icon mũi tên
import { useNavigation } from '@react-navigation/native'; // Thêm hook để sử dụng navigation

// Sample data for Pop Mart blind box orders
const orders = [
  {
    id: '1',
    boxType: 'Molly Series',
    productCategory: 'Vinyl Figures',
    price: 350000,
    orderDate: '2025-03-01',
    deliveryStatus: 'Pending',
    trackingNumber: 'TN1234567890',
    revealedItem: 'Molly the Bunny',
  },
  {
    id: '2',
    boxType: 'Pucky Series',
    productCategory: 'Vinyl Figures',
    price: 450000,
    orderDate: '2025-03-05',
    deliveryStatus: 'Pending',
    trackingNumber: 'TN9876543210',
    revealedItem: 'Pucky the Monster',
  },
  {
    id: '3',
    boxType: 'The Monsters Series',
    productCategory: 'Vinyl Figures',
    price: 500000,
    orderDate: '2025-03-10',
    deliveryStatus: 'Pending',
    trackingNumber: 'TN1122334455',
    revealedItem: 'The Monster Series - Zombie Edition',
  },
];

// Component to display order details
const OrderItem = ({ item, onViewDetails }) => (
  <View style={styles.orderItem}>
    <View style={styles.orderInfo}>
      <Text style={styles.productName}>{item.productCategory} - {item.boxType}</Text>
      <Text style={styles.price}>Price: {item.price.toLocaleString()} VND</Text>
      <Text style={styles.date}>Order Date: {item.orderDate}</Text>
    </View>
    <TouchableOpacity style={styles.viewButton} onPress={() => onViewDetails(item)}>
      <Text style={styles.viewButtonText}>View</Text>
    </TouchableOpacity>
  </View>
);

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigation = useNavigation(); // Sử dụng hook navigation

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  const handleGoBack = () => {
    navigation.goBack('MeScreen'); // Quay lại
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.header}>Order Status</Text>
      </View>

      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderItem item={item} onViewDetails={handleViewDetails} />}
        keyExtractor={item => item.id}
      />

      {selectedOrder && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <Text style={styles.modalText}>Order ID: {selectedOrder.id}</Text>
              <Text style={styles.modalText}>Box Type: {selectedOrder.boxType}</Text>
              <Text style={styles.modalText}>Product Category: {selectedOrder.productCategory}</Text>
              <Text style={styles.modalText}>Price: {selectedOrder.price.toLocaleString()} VND</Text>
              <Text style={styles.modalText}>Order Date: {selectedOrder.orderDate}</Text>
              <Text style={styles.modalText}>Delivery Status: {selectedOrder.deliveryStatus}</Text>
              <Text style={styles.modalText}>Tracking Number: {selectedOrder.trackingNumber}</Text>
              <Text style={styles.modalText}>Revealed Item: {selectedOrder.revealedItem || 'Not opened yet'}</Text>

              <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

// Styles for the page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f9',
    padding: 15,
  },
  headerContainer: {
    flexDirection: 'row',  // Căn chỉnh nút back và tiêu đề theo chiều ngang
    alignItems: 'center',  // Căn giữa các phần tử theo chiều dọc
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e74c3c', // Màu chủ đạo là đỏ
    textAlign: 'center',
    marginLeft: 10,
    textTransform: 'uppercase',
    flex: 1, // Đảm bảo tiêu đề chiếm không gian còn lại
    marginTop: 20,
  },
  backButton: {
    padding: 10,
  },
  orderItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 5,
  },
  orderInfo: {
    flex: 1,
    marginRight: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  price: {
    fontSize: 16,
    fontWeight: '500',
    color: '#16a085',
    marginTop: 5,
  },
  date: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  viewButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2980b9',
    shadowColor: '#2980b9',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 15,
    color: '#e74c3c', // Màu chủ đạo là đỏ
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginTop: 20,
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
});
