import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const OrderDetail = ({ route }) => {
    const { orderId } = route.params;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderDoc = await firestore()
                    .collection('Orders')
                    .doc(orderId)
                    .get();

                if (orderDoc.exists) {
                    setOrder(orderDoc.data());
                } else {
                    console.error('Order not found');
                }
            } catch (error) {
                console.error('Error fetching order: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!order) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Order not found</Text>
                <Button title="Quay lại trang chủ" onPress={() => navigation.navigate('Home')} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chi tiết đơn hàng</Text>
            <Text style={styles.label}>Tên dịch vụ:</Text>
            <Text style={styles.value}>{order.serviceTitle}</Text>
            <Text style={styles.label}>Giá dịch vụ:</Text>
            <Text style={styles.value}>{order.price.toFixed(2)} VND</Text>
            <Text style={styles.label}>VAT:</Text>
            <Text style={styles.value}>{(order.price * 0.1).toFixed(2)} VND</Text>
            <Text style={styles.label}>Tổng cộng:</Text>
            <Text style={styles.value}>{order.totalAmount.toFixed(2)} VND</Text>
            <Text style={styles.label}>Ngày đặt lịch:</Text>
            <Text style={styles.value}>{order.appointmentDate}</Text>
            <Text style={styles.label}>Hình thức thanh toán:</Text>
            <Text style={styles.value}>{order.paymentMethod}</Text>
            <Button title="Quay lại trang chủ" onPress={() => navigation.navigate('ServicesCustomer')} />
        </View>
    );
};

export default OrderDetail;

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
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    value: {
        fontSize: 18,
    },
});
