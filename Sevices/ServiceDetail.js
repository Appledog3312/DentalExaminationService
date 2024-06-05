import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Dialog, Portal, Provider } from "react-native-paper";
import currencyFormatter from "currency-formatter";

const ServiceDetail = ({ route, navigation }) => {
    const { service } = route.params;
    const [visible, setVisible] = useState(false);

   
    const handleAppointment = () => {
        navigation.navigate("Appointment", { service });
        
    };

    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.row}>
                    <Text style={styles.label}>Tên dịch vụ:</Text>
                    <Text style={styles.value}>{service.title}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Giá tiền:</Text>
                    <Text style={styles.value}>
                        {currencyFormatter.format(service.price, { code: "VND" })}
                    </Text>
                </View>
                <Button 
                    mode="contained" 
                    onPress={handleAppointment} 
                    style={styles.button}
                >
                    Đặt lịch
                </Button>
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 20,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#00BFFF',
    },
});

export default ServiceDetail;
