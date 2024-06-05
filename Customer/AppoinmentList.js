import React, { useState, useEffect } from "react";
import { View, FlatList, Alert, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { useMyContextProvider } from "../src/index";
import DatePicker from "react-native-date-picker";

const AppointmentList = ({ navigation }) => {
    const [appointments, setAppointments] = useState([]);
    const [controller] = useMyContextProvider();
    const { userLogin } = controller;

    useEffect(() => {
        if (!userLogin) {
            return;
        }

        const fetchAppointments = async () => {
            const unsubscribe = firestore()
                .collection('Appointments')
                .where('email', '==', userLogin.email)
                .onSnapshot(async querySnapshot => {
                    const fetchedAppointments = [];
                    for (const documentSnapshot of querySnapshot.docs) {
                        const appointmentData = documentSnapshot.data();
                        const serviceDoc = await firestore()
                            .collection('Services')
                            .doc(appointmentData.serviceId)
                            .get();

                        if (serviceDoc.exists) {
                            fetchedAppointments.push({
                                ...appointmentData,
                                id: documentSnapshot.id,
                                serviceTitle: serviceDoc.data().title,
                                datetime: appointmentData.datetime.toDate(), 
                                state: 'chờ duyệt', 
                            });
                        }
                    }
                    setAppointments(fetchedAppointments);
                });

            return () => unsubscribe();
        };

        fetchAppointments();
    }, [userLogin]);

    const handleViewDetail = (appointment) => {
        navigation.navigate("AppoimentDetail", { appointmentId: appointment.id });
    };

    const handleDelete = (appointmentId) => {
        Alert.alert(
            "Xác nhận",
            "Bạn chắc chắn có muốn xóa lịch hẹn này?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Xóa",
                    onPress: () => {
                        firestore()
                            .collection('Appointments')
                            .doc(appointmentId)
                            .delete()
                            .then(() => {
                                setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
                                Alert.alert("Thành công", "Xóa lịch hẹn thành công!");
                            })
                            .catch(error => {
                                console.error("Error deleting appointment: ", error);
                                Alert.alert("Lỗi", "Đã xảy ra lỗi khi xóa lịch hẹn. Vui lòng thử lại sau.");
                            });
                    },
                    style: "destructive",
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.appointmentItem}>
            <Text style={styles.appointmentText}>Tên dịch vụ: {item.serviceTitle}</Text>
            <Text style={styles.appointmentText}>Ngày hẹn: {item.datetime.toLocaleString()}</Text>
            <Text style={styles.appointmentText}>Trạng thái: {item.state}</Text>
            <View style={styles.buttonContainer}>
                <Button mode="outlined" buttonColor="#AFEEEE" onPress={() => handleViewDetail(item)}>Xem chi tiết</Button>
                <Button mode="outlined" buttonColor="#FA8072" onPress={() => handleDelete(item.id)}>Xóa</Button>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <Text style={{ fontSize: 25, fontWeight: "bold", marginBottom: 10 }}>Danh sách lịch hẹn</Text>
            {userLogin ? (
                <FlatList
                    data={appointments}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.flatListContent}
                />
            ) : (
                <Text style={{ fontSize: 18 }}>Vui lòng đăng nhập để xem lịch hẹn.</Text>
            )}
        </View>
    );
};

export default AppointmentList;

const styles = StyleSheet.create({
    flatListContent: {
        paddingHorizontal: 10,
    },
    appointmentItem: {
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        padding: 15,
        marginVertical: 5,
    },
    appointmentText: {
        fontSize: 16,
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});
