import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet, Image, TextInput, Button } from "react-native";
import { launchImageLibrary } from 'react-native-image-picker';
import { Text } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const MyBanner = () => {
    const [banners, setBanners] = useState([]);
    const [promoText, setPromoText] = useState('');
    const [newBannerImage, setNewBannerImage] = useState(null);
    const [editBannerImage, setEditBannerImage] = useState(null);
    const [editBannerId, setEditBannerId] = useState(null);

    useEffect(() => {
        // Fetch banners
        const unsubscribe = firestore()
            .collection('Banners')
            .onSnapshot(querySnapshot => {
                const banners = [];
                querySnapshot.forEach(documentSnapshot => {
                    banners.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setBanners(banners);
            });

        // Fetch promo text
        const fetchPromoText = async () => {
            const promoDoc = await firestore().collection('Settings').doc('PromoText').get();
            if (promoDoc.exists) {
                setPromoText(promoDoc.data().text);
            }
        };

        fetchPromoText();

        return () => unsubscribe();
    }, []);

    const pickImage = async (setImage) => {
        const result = await launchImageLibrary({ mediaType: 'photo' });
        if (result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (uri) => {
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const reference = storage().ref(filename);
        await reference.putFile(uri);
        return await reference.getDownloadURL();
    };

    const addBanner = async () => {
        if (newBannerImage) {
            const imageUrl = await uploadImage(newBannerImage);
            await firestore().collection('Banners').add({ imageUrl });
            setNewBannerImage(null);
        }
    };

    const deleteBanner = async (id) => {
        await firestore().collection('Banners').doc(id).delete();
    };

    const editBanner = (id, imageUrl) => {
        setEditBannerId(id);
        setEditBannerImage(imageUrl);
    };

    const updateBanner = async () => {
        if (editBannerImage) {
            const imageUrl = await uploadImage(editBannerImage);
            await firestore().collection('Banners').doc(editBannerId).update({ imageUrl });
            setEditBannerId(null);
            setEditBannerImage(null);
        }
    };

    const updatePromoText = async () => {
        await firestore().collection('Settings').doc('PromoText').set({ text: promoText });
    };

    const renderBannerItem = ({ item }) => (
        <View style={styles.bannerItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.bannerImage} />
            <Button title="Edit" onPress={() => editBanner(item.id, item.imageUrl)} />
            <Button title="Delete" onPress={() => deleteBanner(item.id)} />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Banner Management</Text>

            <Text style={styles.label}>Add New Banner</Text>
            <Button title="Pick Image" onPress={() => pickImage(setNewBannerImage)} style={styles.button} />
            {newBannerImage && <Image source={{ uri: newBannerImage }} style={styles.previewImage} />}
            <Button title="Add Banner" onPress={addBanner} style={[styles.button, styles.marginTop]} />

            {editBannerId && (
                <>
                    <Text style={styles.label}>Edit Banner</Text>
                    <Button title="Pick Image" onPress={() => pickImage(setEditBannerImage)} style={styles.button} />
                    {editBannerImage && <Image source={{ uri: editBannerImage }} style={styles.previewImage} />}
                    <Button title="Update Banner" onPress={updateBanner} style={[styles.button, styles.marginTop]} />
                </>
            )}

            <Text style={styles.label}>Promotion Text</Text>
            <TextInput
                style={styles.input}
                placeholder="Promotion Text"
                value={promoText}
                onChangeText={setPromoText}
            />
            <Button title="Update Promo Text" onPress={updatePromoText} />

            <FlatList
                data={banners}
                renderItem={renderBannerItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.bannerList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginTop: 20,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
    },
    bannerList: {
        marginTop: 20,
    },
    bannerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    bannerImage: {
        width: 100,
        height: 50,
        marginRight: 10,
    },
    previewImage: {
        width: 100,
        height: 100,
        marginTop: 10,
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
        marginHorizontal:10, 
    },
    marginTop: {
        marginTop: 10,
    }
});

export default MyBanner;
