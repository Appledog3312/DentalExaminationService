import React, { useState, useEffect } from "react";
import { firebase } from "@react-native-firebase/firestore";
import { Text, View, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useMyContextProvider } from "../src/index";

const ProfileCustomer = () => {
    const [controller, dispatch] = useMyContextProvider();
    const { userLogin } = controller;
    const [formData, setFormData] = useState({
        fullname: userLogin.fullname,
        address: userLogin.address,
        phone: userLogin.phone,
        email: userLogin.email
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const checkAndCreateUserDocument = async () => {
            try {
                const user = firebase.auth().currentUser;
                if (user) {
                    const userDoc = await firebase.firestore().collection("USERS").doc(user.uid).get();
                    if (!userDoc.exists) {
                        await firebase.firestore().collection("USERS").doc(user.uid).set({
                            address: userLogin.address,
                            fullname: userLogin.fullname,
                            phone: userLogin.phone,
                            email: userLogin.email
                        });
                    }
                }
            } catch (error) {
                Alert.alert("Error", error.message);
            }
        };

        checkAndCreateUserDocument();
    }, [userLogin]);

    const handleSaveChanges = async () => {
        try {
            const user = firebase.auth().currentUser;
            if (user) {
                await user.updateEmail(formData.email);
                await firebase.firestore().collection("USERS").doc(user.uid).update({
                    address: formData.address,
                    fullname: formData.fullname,
                    phone: formData.phone,
                    email: formData.email
                });
                Alert.alert("Success", "Profile updated successfully");
                setIsEditing(false);
            } else {
                Alert.alert("Error", "No authenticated user found");
            }
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={styles.header}>My Profile</Text>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Full Name:</Text>
                {isEditing ? (
                    <TextInput
                        style={styles.input}
                        value={formData.fullname}
                        onChangeText={(text) => setFormData({ ...formData, fullname: text })}
                    />
                ) : (
                    <Text style={styles.value}>{formData.fullname}</Text>
                )}
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Address:</Text>
                {isEditing ? (
                    <TextInput
                        style={styles.input}
                        value={formData.address}
                        onChangeText={(text) => setFormData({ ...formData, address: text })}
                    />
                ) : (
                    <Text style={styles.value}>{formData.address}</Text>
                )}
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Phone:</Text>
                {isEditing ? (
                    <TextInput
                        style={styles.input}
                        value={formData.phone}
                        onChangeText={(text) => setFormData({ ...formData, phone: text })}
                    />
                ) : (
                    <Text style={styles.value}>{formData.phone}</Text>
                )}
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Email:</Text>
                {isEditing ? (
                    <TextInput
                        style={styles.input}
                        value={formData.email}
                        editable={false}
                        placeholder="Email không thể thay đổi"
                    />
                ) : (
                    <Text style={styles.value}>{formData.email}</Text>
                )}
            </View>

            {isEditing ? (
                <Button title="Save Changes" onPress={handleSaveChanges} />
            ) : (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                    <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 20,
        alignSelf: 'center',
        color: '#333',
    },
    fieldContainer: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#87CEFA',
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: '#555',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        padding: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#e6e6e6',
        color: '#333',
    },
    input: {
        padding: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#E0FFFF',
        color: '#333',
    },
    editButton: {
        justifyContent: "center",
        alignSelf: "center",
        fontSize: 16,
        color: "blue",
        marginTop: 10,
        borderColor: "blue",
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
    }
});

export default ProfileCustomer;
