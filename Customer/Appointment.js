import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { Button, Text } from "react-native-paper";
import DatePicker from "react-native-date-picker";
import firestore from "@react-native-firebase/firestore";
import currencyFormatter from "currency-formatter";
import { useMyContextProvider } from "../src/index";

const Appointment = ({ navigation, route }) => {
    const { service } = route.params || {};
    const [datetime, setDatetime] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [controller, dispatch] = useMyContextProvider();
    const { userLogin } = controller;
    const APPOINTMENTs = firestore().collection("Appointments");

    const handleSubmit = () => {
        const now = new Date();
        const maxDate = new Date();
        maxDate.setDate(now.getDate() + 60);

        if (datetime < now) {
            Alert.alert("Lỗi", "Không thể đặt lịch vào thời gian đã trôi qua.");
            return;
        }

        if (datetime > maxDate) {
            Alert.alert("Lỗi", "Không thể đặt lịch quá 60 ngày từ hôm nay.");
            return;
        }

        try {
            APPOINTMENTs.add({
                email: userLogin.email,
                serviceId: service.id,
                datetime,
                state: "wait",
            }).then((r) => {
                APPOINTMENTs.doc(r.id).update({ id: r.id });
                Alert.alert("Thành công", "Đặt lịch thành công!", [
                    { text: "OK", onPress: () => navigation.navigate('ServicesCustomer') }
                ]);
            });
        } catch (error) {
            console.error("Error booking appointment: ", error);
            Alert.alert("Lỗi", "Đã xảy ra lỗi khi đặt lịch. Vui lòng thử lại sau.");
        }
    };

    return (
        <View style={{ padding: 10 }}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tên dịch vụ: </Text>
                <Text style={{ fontSize: 20 }}>{service && service.title}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Người tiếp nhận: </Text>
                <Text style={{ fontSize: 20 }}>{service && service.create}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Giá tiền: </Text>
                <Text style={{ fontSize: 20 }}>
                    {service && currencyFormatter.format(service.price, { code: "VND" })}
                </Text>
            </View>
            <DatePicker
                modal
                open={open}
                date={datetime}
                minimumDate={new Date()}
                maximumDate={new Date(new Date().setDate(new Date().getDate() + 60))}
                onConfirm={(date) => {
                    setOpen(false);
                    setDatetime(date);
                }}
                onCancel={() => {
                    setOpen(false);
                }}
            />
            <TouchableOpacity
                onPress={() => setOpen(true)}
                style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}
            >
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Ngày đặt lịch: </Text>
                <Text style={{ fontSize: 20 }}>{datetime.toDateString()}</Text>
            </TouchableOpacity>
            <Button style={{ margin: 10 }} textColor="black" buttonColor="#00BFFF" mode="contained" onPress={handleSubmit}>
                Đặt lịch
            </Button>
        </View>
    );
};

export default Appointment;
