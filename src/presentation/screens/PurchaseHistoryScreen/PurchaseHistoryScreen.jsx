import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';

// Sample data for Pop Mart blind box orders
const orders = [
  {
    id: '1',
    boxType: 'Molly Series', // Loại hộp Pop Mart (ví dụ: Molly Series)
    productCategory: 'Vinyl Figures', // Danh mục sản phẩm (vinyl figures)
    price: 350000, // Giá của hộp blind box
    purchaseDate: '2025-03-01', // Ngày mua
    deliveryStatus: 'Pending', // Trạng thái giao hàng
    trackingNumber: 'TN1234567890', // Mã vận chuyển
    revealedItem: 'Molly the Bunny', // Sản phẩm đã mở từ hộp
  },
  {
    id: '2',
    boxType: 'Pucky Series', // Loại hộp Pop Mart
    productCategory: 'Vinyl Figures',
    price: 450000,
    purchaseDate: '2025-03-05',
    deliveryStatus: 'Shipped',
    trackingNumber: 'TN9876543210',
    revealedItem: 'Pucky the Monster', // Sản phẩm đã mở từ hộp
  },
  {
    id: '3',
    boxType: 'The Monsters Series',
    productCategory: 'Vinyl Figures',
    price: 500000,
    purchaseDate: '2025-03-10',
    deliveryStatus: 'Shipped',
    trackingNumber: 'TN1122334455',
    revealedItem: 'The Monster Series - Zombie Edition', // Sản phẩm đã mở từ hộp
  },
];

// Component to display order details
const OrderItem = ({ item, onViewDetails }) => (
  <View style={styles.orderItem}>
    <View style={styles.orderInfo}>
      <Text style={styles.productName}>{item.productCategory} - {item.boxType}</Text>
      <Text style={styles.price}>Price: {item.price.toLocaleString()} VND</Text>
      <Text style={styles.date}>Purchase Date: {item.purchaseDate}</Text>
    </View>
    <TouchableOpacity style={styles.viewButton} onPress={() => onViewDetails(item)}>
      <Text style={styles.viewButtonText}>View</Text>
    </TouchableOpacity>
  </View>
);

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Purchase History</Text>
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
              <Text style={styles.modalText}>Purchase Date: {selectedOrder.purchaseDate}</Text>
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
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    margin: 40,
    textTransform: 'uppercase',
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
    color: '#2c3e50',
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
