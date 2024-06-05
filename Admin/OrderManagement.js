import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import currencyFormatter from "currency-formatter";


const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ordersCollection = await firestore()
                    .collection('Orders')
                    .get();

                const fetchedOrders = ordersCollection.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setOrders(fetchedOrders);
            } catch (error) {
                console.error('Error fetching orders: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleDeleteOrder = async (orderId) => {
        try {
            await firestore().collection('Orders').doc(orderId).delete();
            setOrders(orders.filter(order => order.id !== orderId));
        } catch (error) {
            console.error('Error deleting order: ', error);
        }
    };

    const handleConfirmPayment = async (orderId) => {
        try {
            await firestore().collection('Orders').doc(orderId).update({
                paymentConfirmed: true
            });
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, paymentConfirmed: true } : order
            ));
        } catch (error) {
            console.error('Error confirming payment: ', error);
        }
    };

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderItem}>
            <Text style={styles.orderText}>Mã dịch vụ: {item.id}</Text>
            <Text style={styles.orderText}>Tên dịch vụ: {item.serviceTitle}</Text>
            <Text style={styles.orderText}> Giá dịch vụ:
                            {currencyFormatter.format(item.price, { code: "VND" })}
                        </Text>
            <Text style={styles.orderText}>Tổng cộng: {currencyFormatter.format(item.totalAmount, { code: "VND" })}</Text>
            <Text style={styles.orderText}>Ngày đặt lịch: {item.appointmentDate}</Text>
            <Text style={styles.orderText}>Hình thức thanh toán: {item.paymentMethod}</Text>
            <View style={styles.buttonContainer}>
                <Button
                    title="Xóa"
                    onPress={() => handleDeleteOrder(item.id)}
                    color="red"
                />
                <TouchableOpacity
                    style={[
                        styles.paymentButton,
                        item.paymentConfirmed && styles.paymentButtonConfirmed
                    ]}
                    onPress={() => handleConfirmPayment(item.id)}
                    disabled={item.paymentConfirmed}
                >
                    <Text style={styles.paymentButtonText}>
                        {item.paymentConfirmed ? 'Đã nhận tiền' : 'Xác nhận đã nhận tiền'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quản lý đơn hàng</Text>
            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

export default OrderManagement;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    orderItem: {
        padding: 20,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    orderText: {
        fontSize: 16,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    paymentButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentButtonConfirmed: {
        backgroundColor: 'gray',
    },
    paymentButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
