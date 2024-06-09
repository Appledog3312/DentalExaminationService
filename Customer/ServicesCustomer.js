import React, { useState, useEffect, useRef } from "react";
import { Image, View, TouchableOpacity, StyleSheet, Animated, Dimensions, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { SearchBar } from 'react-native-elements';
import currencyFormatter from "currency-formatter";
import { launchImageLibrary } from 'react-native-image-picker';

const ServicesCustomer = ({ navigation }) => {
    const [initialServices, setInitialServices] = useState([]);
    const [services, setServices] = useState([]);
    const [name, setName] = useState('');
    const [logoUrl, setLogoUrl] = useState(null);
    const [bannerImages, setBannerImages] = useState([]);
    const [promoText, setPromoText] = useState('');
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const scrollAnim = useRef(new Animated.Value(0)).current;
    const { width: screenWidth } = Dimensions.get("window");

    useEffect(() => {
        // Fetch services
        const unsubscribe = firestore()
            .collection('Services')
            .onSnapshot(querySnapshot => {
                const services = [];
                querySnapshot.forEach(documentSnapshot => {
                    services.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setServices(services);
                setInitialServices(services);
            });

        // Fetch logo image URL
        const fetchLogoUrl = async () => {
            const logoDoc = await firestore().collection('service').doc('image').get();
            if (logoDoc.exists) {
                setLogoUrl(logoDoc.data().url);
            }
        };

        // Fetch banner images and promo text
        const fetchBannerImagesAndPromoText = async () => {
            const bannerQuerySnapshot = await firestore().collection('Banners').get();
            const images = bannerQuerySnapshot.docs.map(doc => doc.data().imageUrl);
            setBannerImages(images);

            const promoTextDoc = await firestore().collection('Settings').doc('PromoText').get();
            if (promoTextDoc.exists) {
                setPromoText(promoTextDoc.data().text);
            }
        };

        fetchLogoUrl();
        fetchBannerImagesAndPromoText();

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (bannerImages.length > 0) {
            const interval = setInterval(() => {
                setCurrentBannerIndex(prevIndex => (prevIndex + 1) % bannerImages.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [bannerImages]);

    useEffect(() => {
        Animated.loop(
            Animated.timing(scrollAnim, {
                toValue: -screenWidth,
                duration: 10000,
                useNativeDriver: true,
            })
        ).start();
    }, [screenWidth]);

    const handleDetail = (service) => {
        navigation.navigate("Service Detail", { service });
    };

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                {logoUrl && (
                    <Image
                        source={{ uri: logoUrl }}
                        style={styles.logo}
                    />
                )}
                {bannerImages.length > 0 && (
                    <View style={styles.bannerContainer}>
                        <Image
                            source={{ uri: bannerImages[currentBannerIndex] }}
                            style={styles.bannerImage}
                        />
                    </View>
                )}
                <View style={[styles.scrollContainer, { width: screenWidth }]}>
                    <Animated.Text
                        style={[
                            styles.scrollText,
                            {
                                transform: [{
                                    translateX: scrollAnim.interpolate({
                                        inputRange: [-screenWidth, 0],
                                        outputRange: [0, screenWidth]
                                    })
                                }]
                            }
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="clip"
                    >
                        {promoText}
                    </Animated.Text>
                </View>
                <View style={styles.searchbar}>
                    <SearchBar
                        placeholder="Search by name"
                        onChangeText={(text) => {
                            setName(text);
                            const result = initialServices.filter(service =>
                                service.title.toLowerCase().includes(text.toLowerCase())
                            );
                            setServices(result);
                        }}
                        value={name}
                        containerStyle={styles.searchContainer}
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                        lightTheme
                    />
                </View>
                <Text style={styles.headerText}>Danh sách dịch vụ</Text>
                <View style={styles.servicesContainer}>
                    {services.map(item => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.serviceItem}
                            onPress={() => handleDetail(item)}
                        >
                            <Image
                                source={{ uri: item.imageUrl }}
                                style={styles.serviceImage}
                            />
                            <Text style={styles.serviceTitle}>{item.title}</Text>
                            <Text style={styles.servicePrice}>
                                {currencyFormatter.format(item.price, { code: "VND" })}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

export default ServicesCustomer;

const styles = StyleSheet.create({
    logo: {
        alignSelf: "center",
        marginVertical: 20,
        width: 200,
        height: 100,
        resizeMode: 'contain'
    },
    bannerContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    bannerImage: {
        width: 410,
        height: 200,
        borderRadius: 10,
    },
    scrollContainer: {
        height: 30,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    scrollText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f00',
    },
    searchbar: {
        justifyContent: 'center',
    },
    searchContainer: {
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
    },
    inputContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    input: {
        color: '#000',
    },
    headerText: {
        padding: 15,
        fontSize: 25,
        fontWeight: "bold",
    },
    servicesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
    },
    serviceItem: {
        width: '45%', 
        margin: '2.5%', 
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    serviceImage: {
        width: 150,
        height: 100,
        borderRadius: 10,
    },
    serviceTitle: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    servicePrice: {
        fontSize: 14,
        color: "#888",
        marginTop: 5,
        textAlign: "center",
    }
});
