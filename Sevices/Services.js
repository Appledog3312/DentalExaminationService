import React, { useState, useEffect, useRef } from "react";
import { Image, View, TouchableOpacity, Alert, Dimensions, Animated, StyleSheet, Text as RNText } from "react-native";
import { Text } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { SearchBar } from 'react-native-elements';
import currencyFormatter from "currency-formatter";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from "react-native-gesture-handler";

const Services = ({ navigation }) => {
    const [initialServices, setInitialServices] = useState([]);
    const [services, setServices] = useState([]);
    const [name, setName] = useState('');
    const [bannerImages, setBannerImages] = useState([]);
    const [promoText, setPromoText] = useState('');
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const scrollAnim = useRef(new Animated.Value(0)).current;
    const { width: screenWidth } = Dimensions.get("window");
    const [textWidth, setTextWidth] = useState(0);

    useEffect(() => {
        const unsubscribeServices = firestore()
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

        const unsubscribeBanners = firestore()
            .collection('Banners')
            .onSnapshot(querySnapshot => {
                const images = querySnapshot.docs.map(doc => doc.data().imageUrl);
                setBannerImages(images);
            });

        const unsubscribePromoText = firestore()
            .collection('Settings')
            .doc('PromoText')
            .onSnapshot(doc => {
                if (doc.exists) {
                    setPromoText(doc.data().text);
                }
            });

        return () => {
            unsubscribeServices();
            unsubscribeBanners();
            unsubscribePromoText();
        };
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
        if (promoText && textWidth > 0) {
            Animated.loop(
                Animated.timing(scrollAnim, {
                    toValue: -textWidth,
                    duration: textWidth * 20, 
                    useNativeDriver: true,
                })
            ).start();
        }
    }, [promoText, textWidth]);

    const handleUpdate = async (service) => {
        try {
            navigation.navigate("Service Update", { service });
        } catch (error) {
            console.error("Lỗi khi cập nhật dịch vụ:", error);
        }
    };

    const handleDelete = (service) => {
        Alert.alert(
            "Warning",
            "Are you sure you want to delete this service? This operation cannot be returned",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        firestore()
                            .collection('Services')
                            .doc(service.id)
                            .delete()
                            .then(() => {
                                console.log("Dịch vụ đã được xóa thành công!");
                                navigation.navigate("Services");
                            })
                            .catch(error => {
                                console.error("Lỗi khi xóa dịch vụ:", error);
                            });
                    },
                    style: "default"
                }
            ]
        )
    }

    const handleDetail = (service) => {
        navigation.navigate("Service Detail", { service });
    }

    return (
        <ScrollView>
            <View style={{ flex: 1 }}>
                {bannerImages.length > 0 && (
                    <View style={styles.bannerContainer}>
                        <Image
                            source={{ uri: bannerImages[currentBannerIndex] }}
                            style={styles.bannerImage}
                        />
                    </View>
                )}
                {promoText && (
                    <View style={styles.promoTextContainer}>
                        <Animated.Text
                            style={[
                                styles.promoText,
                                {
                                    transform: [{
                                        translateX: scrollAnim,
                                    }],
                                }
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="clip"
                            onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
                        >
                            {promoText}
                        </Animated.Text>
                    </View>
                )}
                <View style={styles.Searchbar}>
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
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <Text style={{
                        padding: 15,
                        fontSize: 25,
                        fontWeight: "bold",
                    }}>
                        List of services</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Add New Service")}>
                        <Image source={require('../assets/add.png')} style={{ width: 30, height: 30, margin: 20 }} />
                    </TouchableOpacity>
                </View>
                <View>
                    {services.map((item, index) => (
                        <TouchableOpacity key={item.id} style={{ margin: 10, padding: 15, borderRadius: 15, marginVertical: 5, backgroundColor: 'white' }}>
                            <Menu>
                                <MenuTrigger>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20 }}>
                                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{index + 1}. {item.title}</Text>
                                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                                            {currencyFormatter.format(item.price, { code: "VND" })}
                                        </Text>
                                    </View>
                                </MenuTrigger>
                                <MenuOptions>
                                    <MenuOption onSelect={() => handleUpdate(item)} style={styles.menuOption}>
                                        <Icon name="edit" size={20} color="#000" style={styles.icon} />
                                        <Text style={styles.menuOptionText}>Update</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={() => handleDelete(item)} style={styles.menuOption}>
                                        <Icon name="delete" size={20} color="#000" style={styles.icon} />
                                        <Text style={styles.menuOptionText}>Delete</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={() => handleDetail(item)} style={styles.menuOption}>
                                        <Icon name="info" size={20} color="#000" style={styles.icon} />
                                        <Text style={styles.menuOptionText}>Detail</Text>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

export default Services;

const styles = StyleSheet.create({
    bannerContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    bannerImage: {
        width: 410,
        height: 200,
        borderRadius: 10,
    },
    promoTextContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        marginVertical: 10,
        overflow: 'hidden',
        width: '100%', 
    },
    promoText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff0000',
        position: 'absolute',
        whiteSpace: 'nowrap', 
    },
    Searchbar: {
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
    menuOption: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    icon: {
        marginRight: 10,
    },
    menuOptionText: {
        fontSize: 18,
    }
});
