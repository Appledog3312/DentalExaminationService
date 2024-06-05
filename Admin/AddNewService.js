import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import ImagePicker from "react-native-image-crop-picker";
import { useMyContextProvider } from "../src/index";
import { showMessage } from "react-native-flash-message";

const AddNewService = ({ navigation }) => {
    const [controller, dispatch] = useMyContextProvider();
    const { userLogin } = controller;
    const [imagePath, setImagePath] = useState("");
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const SERVICES = firestore().collection("Services");

    useEffect(() => {
        // Check if all required fields are filled
        setIsButtonDisabled(!(title && price && imagePath));
    }, [title, price, imagePath]);

    const handleAddNewService = async () => {
        if (!title || !price || !imagePath) {
            showMessage({
                message: "Vui lòng điền đầy đủ thông tin!",
                type: "danger",
                duration: 2000
            });
            return;
        }

        try {
            const response = await SERVICES.add({
                title,
                price,
                create: userLogin.email
            });
            
            const refImage = storage().ref(`/services/${response.id}.png`);
            await refImage.putFile(imagePath);
            const link = await refImage.getDownloadURL();
            
            await SERVICES.doc(response.id).update({
                id: response.id, 
                imageUrl: link
            });
            
            showMessage({
                message: "Thêm dịch vụ thành công!",
                type: "success",
                duration: 2000,
                onHide: () => navigation.navigate("Services")
            });
        } catch (error) {
            console.error("Error adding service: ", error);
            showMessage({
                message: "Đã xảy ra lỗi khi thêm dịch vụ. Vui lòng thử lại sau.",
                type: "danger",
                duration: 2000
            });
        }
    };
        
    const handleUploadImage = () => {
        ImagePicker.openPicker({
            mediaType: "photo",
            width: 400,
            height: 300
        })
        .then(image => setImagePath(image.path))
        .catch(error => console.error("Error picking image: ", error));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Service Name *</Text>
            <TextInput
                placeholder="Input a service name"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
            />
            <Text style={styles.label}>Price *</Text>
            <TextInput
                placeholder="0"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={styles.input}
            />
            <Button 
                mode="contained" 
                onPress={handleUploadImage} 
                style={styles.button}
            >
                Upload Image
            </Button>
            {imagePath ? (
                <Image source={{ uri: imagePath }} style={styles.image} />
            ) : null}
            <Button 
                mode="contained" 
                onPress={handleAddNewService} 
                style={[styles.button, styles.addButton]}
                disabled={isButtonDisabled}
            >
                Add
            </Button>
        </View>
    );
};

export default AddNewService;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f0f8ff",
        flex: 1,
    },
    label: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1e90ff",
        marginBottom: 5,
    },
    input: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#1e90ff",
        marginVertical: 10,
    },
    addButton: {
        marginTop: 20,
    },
    image: {
        height: 260,
        width: "100%",
        marginTop: 20,
        borderRadius: 10,
    },
});
