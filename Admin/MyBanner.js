import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet, Image, TextInput, Button } from "react-native";
import { Text } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
const MyBanner = () => {
    const [banners, setBanners] = useState([]);
    const [promoText, setPromoText] = useState('');
    const [newBannerUrl, setNewBannerUrl] = useState('');
    const [editBannerUrl, setEditBannerUrl] = useState('');
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

    const addBanner = async () => {
        if (newBannerUrl.trim()) {
            await firestore().collection('Banners').add({ imageUrl: newBannerUrl });
            setNewBannerUrl('');
        }
    };

    const deleteBanner = async (id) => {
        await firestore().collection('Banners').doc(id).delete();
    };

    const editBanner = (id, url) => {
        setEditBannerId(id);
        setEditBannerUrl(url);
    };

    const updateBanner = async () => {
        if (editBannerUrl.trim()) {
            await firestore().collection('Banners').doc(editBannerId).update({ imageUrl: editBannerUrl });
            setEditBannerId(null);
            setEditBannerUrl('');
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
            <TextInput
                style={styles.input}
                placeholder="Banner URL"
                value={newBannerUrl}
                onChangeText={setNewBannerUrl}
            />
            <Button title="Add Banner" onPress={addBanner} />

            {editBannerId && (
                <>
                    <Text style={styles.label}>Edit Banner</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Banner URL"
                        value={editBannerUrl}
                        onChangeText={setEditBannerUrl}
                    />
                    <Button title="Update Banner" onPress={updateBanner} />
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
});

export default MyBanner;
