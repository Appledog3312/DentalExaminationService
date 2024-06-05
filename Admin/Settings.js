import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Image, Modal, Alert } from "react-native";
import { Button, Text, Appbar, TextInput} from "react-native-paper";
import { logout, useMyContextProvider } from "../src/index";
import firebase from "@react-native-firebase/app";



const Settings = ({ navigation }) => {
    const [controller, dispatch] = useMyContextProvider();
    const { userLogin } = controller;
    const [isChangePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState(""); 
    const[showCurrentPassword,setShowCurrentPassword] =useState('');
    const[showNewPassword,setShowNewPassword] =useState('');
    const[showConformPassword,setShowConformPassword] =useState('');

    useEffect(() => {
        if (userLogin == null)
            navigation.navigate("Login");
    }, [userLogin]);

    const handleLogout = () => {
        logout(dispatch);
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        try {
            const user = firebase.auth().currentUser;
            if (user) {
                const credentials = firebase.auth.EmailAuthProvider.credential(
                    user.email,
                    currentPassword
                );
                await user.reauthenticateWithCredential(credentials); 
                await user.updatePassword(newPassword);
                Alert.alert("Success", "Password updated successfully");
                setChangePasswordModalVisible(false);
            }
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {userLogin && userLogin.fullname && (
                        <Appbar.Content
                            title={`Hello, ${userLogin.fullname}`}
                            titleStyle={{ color: 'black', fontSize: 20 }}
                            style={{ marginRight: 'auto' }} 
                        />
                    )}
                    <Image source={require("../assets/account1.png")} style={styles.logo} />
                </View>
            </View>
            <View style={{ padding: 20 }}>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("ServicesCustomer")}>
                    <Text style={styles.menuText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("ProfileCustomer")}>
                    <Text style={styles.menuText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Appointments")}>
                    <Text style={styles.menuText}>Appointment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("MyBanner")}>
                    <Text style={styles.menuText}>Cài đặt Banner </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => setChangePasswordModalVisible(true)}>
                    <Text style={styles.menuText}>Change Password</Text>
                </TouchableOpacity>
                <Button
                    style={styles.logoutButton}
                    buttonColor="pink"
                    textColor="black"
                    mode="contained"
                    onPress={handleLogout}
                >
                    Logout
                </Button>
            </View>

            <Modal
                visible={isChangePasswordModalVisible}
                animationType="slide"
                onRequestClose={() => setChangePasswordModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Change Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Current Password"
                        secureTextEntry= {!showCurrentPassword}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        right={
                        <TextInput.Icon 
                        icon ={showCurrentPassword ? "eye-off" : "eye"}
                        onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                        />}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        secureTextEntry= {!showNewPassword}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        right={
                        <TextInput.Icon 
                        icon ={showNewPassword ? "eye-off" : "eye"}
                        onPress={() => setShowNewPassword(!showNewPassword)}
                        />}
                        
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        secureTextEntry= {!showConformPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        right={
                        <TextInput.Icon 
                        icon ={showConformPassword ? "eye-off" : "eye"}
                        onPress={() => setShowConformPassword(!showConformPassword)}
                        />}
                    />
                    <Button
                        mode="contained"
                        onPress={handleChangePassword}
                        style={styles.modalButton}
                    >
                        Save
                    </Button>
                    <Button
                        mode="text"
                        onPress={() => setChangePasswordModalVisible(false)}
                        style={styles.modalButton}
                    >
                        Cancel
                    </Button>
                </View>
            </Modal>
        </View>
    );
};


export default Settings;

const styles = StyleSheet.create({
    header: {
        padding: 20,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    logo: {
        width: 40,
        height: 40,
        marginRight: 10
    },
    menuItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc"
    },
    menuText: {
        fontSize: 16,
        color: "#333"
    },
    logoutButton: {
        marginTop: 20
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "white"
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center"
    },
    input: {
        padding: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10
    },
    modalButton: {
        marginTop: 10
    }
});