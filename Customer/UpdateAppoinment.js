import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";

const UpdateAppointment = ({ route, navigation }) => {
    const { appointmentId } = route.params;
    const [appointment, setAppointment] = useState(null);
    const [datetime, setDatetime] = useState(new Date());
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [note, setNote] = useState("");
    
    useEffect(() => {
        const fetchAppointment = async () => {
            const doc = await firestore().collection("Appointments").doc(appointmentId).get();
            if (doc.exists) {
                const data = doc.data();
                setAppointment(data);
                setDatetime(data.datetime.toDate());

                // Fetch the service data
                const serviceDoc = await firestore().collection("Services").doc(data.serviceId).get();
                if (serviceDoc.exists) {
                    const serviceData = serviceDoc.data();
                    setTitle(serviceData.title);
                    setPrice(serviceData.price.toString());
                }
            }
        };
        fetchAppointment();
    }, [appointmentId]);

    const handleSubmit = async () => {
        try {
            await firestore().collection("Appointments").doc(appointmentId).update({
                datetime,
            });
            await firestore().collection("Services").doc(appointment.serviceId).update({
                title,
                price: parseFloat(price),
            });

            navigation.goBack();
        } catch (error) {
            console.error("Error updating appointment: ", error);
        }
    };

    if (!appointment) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Email: {appointment.email}</Text>
            <Text style={styles.label}>Service ID: {appointment.serviceId}</Text>
            <Text style={styles.label}>Title:</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
            />
            <Text style={styles.label}>Price:</Text>
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
            />
            <Text style={styles.label}>Datetime:</Text>
            <TextInput
                style={styles.input}
                value={datetime.toISOString().slice(0, 16).replace("T", " ")}
                onChangeText={(text) => setDatetime(new Date(text))}
            />
            <Text style={styles.label}>Note:</Text>
            <TextInput
                style={styles.input}
                value={note}
                onChangeText={setNote}
            />
            <Button mode="contained" onPress={handleSubmit}>
                Submit
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    label: {
        fontSize: 18,
        marginVertical: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default UpdateAppointment;
