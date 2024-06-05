import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from '@react-navigation/native'; 
import DatePicker from "react-native-date-picker";

const Transaction = () => {
    const [appointments, setAppointments] = useState([]);
    const navigation = useNavigation(); 
    const SERVICES = firestore().collection("Services");
    const APPOINTMENTS = firestore().collection("Appointments");
    const [open, setOpen] = useState(false);
    const [datetime, setDatetime] = useState(new Date());

    useEffect(() => {
        const unsubscribe = APPOINTMENTS.onSnapshot(async querySnapshot => {
            const appointmentsData = [];
            for (const documentSnapshot of querySnapshot.docs) {
                const appointmentData = documentSnapshot.data();
                const serviceId = appointmentData.serviceId;

                const serviceDoc = await SERVICES.doc(serviceId).get();
                const serviceData = serviceDoc.exists ? { ...serviceDoc.data(), id: serviceId } : { title: "Unknown Service", id: serviceId };

                appointmentsData.push({
                    ...appointmentData,
                    id: documentSnapshot.id,
                    serviceTitle: serviceData.title,
                    datetime: appointmentData.datetime.toDate(),
                    state: appointmentData.state,
                });
            }
            setAppointments(appointmentsData);
        });

        return () => unsubscribe();
    }, []);

    const handleUpdateAppointment = (id) => {
        
        navigation.navigate("UpdateAppointment", { appointmentId: id });
    };

    const handleAcceptAppointment = async (id) => {
        try {
            await firestore().collection("Appointments").doc(id).update({ state: "accepted" });
        } catch (error) {
            console.error("Error accepting appointment: ", error);
        }
    };

    const renderAppointmentItem = ({ item }) => (
        <View style={styles.appointmentItem}>
            <Text style={styles.itemText}>Email: {item.email}</Text>
            <Text style={styles.itemText}>Service ID: {item.serviceId}</Text>
            <Text style={styles.itemText}>Service Name: {item.serviceTitle}</Text>

            <DatePicker
                modal
                open={open}
                date={datetime}
                onConfirm={(date) => {
                    setOpen(false);
                    setDatetime(date);
                }}
                onCancel={() => {
                    setOpen(false);
                }}
            />
            {/* <Text style={styles.itemText}>Datetime: {item.datetime.toDate().toLocaleString()}</Text> */}
            <Text style={styles.itemText}>Appointment Date: {item.datetime.toDateString()}</Text>
            <Text style={styles.itemText}>State: {item.state}</Text>
            <Text style={styles.itemText}>Note:{item.note} </Text>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: "green" }]}
                onPress={() => handleAcceptAppointment(item.id)}
            >
                <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: "blue" }]}
                onPress={() => handleUpdateAppointment(item.id)}
            >
                <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Appointment List</Text>
            <FlatList
                data={appointments}
                renderItem={renderAppointmentItem}
                keyExtractor={(item) => item.id}
                style={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    list: {
        flexGrow: 1,
    },
    appointmentItem: {
        backgroundColor: "#f0f0f0",
        padding: 10,
        marginBottom: 10,
    },
    itemText: {
        fontSize: 16,
        marginBottom: 5,
    },
    button: {
        marginTop: 5,
        paddingVertical: 8,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
});

export default Transaction;
