import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Payment = ({ route, navigation }) => {
    const { serviceTitle = '', price = 0, appointmentDate = '' } = route.params;
    const [loading, setLoading] = useState(false);

    const servicePrice = typeof price === 'number' ? price : parseFloat(price) || 0;
    const VAT_RATE = 0.1;  // 10% VAT
    const vatAmount = servicePrice * VAT_RATE;
    const totalAmount = servicePrice + vatAmount;

    const handleCashPayment = async () => {
        setLoading(true);
        try {
            const orderRef = firestore().collection('Orders').doc();
            const newOrder = {
                id: orderRef.id, // Thêm ID vào tài liệu
                serviceTitle,
                price: servicePrice,
                appointmentDate,
                paymentMethod: 'Tiền mặt',
                totalAmount,
                createdAt: firestore.FieldValue.serverTimestamp(),
            };
    
            await orderRef.set(newOrder);
    
            Alert.alert("Xác nhận thành công", "Bạn có thể kiểm tra lại ở chi tiết đơn hàng, vui lòng đến đúng lịch hẹn!");
            navigation.navigate('OrderDetail', { orderId: orderRef.id }); // Navigate to OrderDetail
        } catch (error) {
            console.error("Error confirming order: ", error);
            Alert.alert("Error", "Có lỗi xảy ra khi xác nhận lịch.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thanh toán cho dịch vụ {serviceTitle}</Text>
            <Text style={styles.label}>Giá dịch vụ:</Text>
            <Text style={styles.value}>{servicePrice.toFixed(2)} VND</Text>
            <Text style={styles.label}>VAT (10%):</Text>
            <Text style={styles.value}>{vatAmount.toFixed(2)} VND</Text>
            <Text style={styles.label}>Tổng cộng:</Text>
            <Text style={styles.value}>{totalAmount.toFixed(2)} VND</Text>
            <Text style={styles.label}>Ngày đặt lịch:</Text>
            <Text style={styles.value}>{appointmentDate}</Text>
            {loading ? <ActivityIndicator size="large" color="#0000ff" /> : (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleCashPayment}>
                        <Text style={styles.buttonText}>Thanh toán tiền mặt</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default Payment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    value: {
        fontSize: 18,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#0070ba',
        padding: 15,
        alignItems: 'center',
        borderRadius: 5,
        width: '70%', // Adjusted width to center the button
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});
