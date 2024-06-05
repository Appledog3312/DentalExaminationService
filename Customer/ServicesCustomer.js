import React, { useState, useEffect } from "react";
import { Image, View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { SearchBar } from 'react-native-elements';
import currencyFormatter from "currency-formatter";


const ServicesCustomer = ({ navigation }) => {
    const [initialServices, setInitialServices] = useState([]);
    const [services, setServices] = useState([]);
    const [name, setName] = useState('');
    const [logoUrl, setLogoUrl] = useState(null);

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

        fetchLogoUrl();

        return () => unsubscribe();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity 
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
    );


    const handleDetail = (service) => {
        navigation.navigate("Service Detail", { service });
    }

    return (
        <View style={{ flex: 1 }}>
            {logoUrl && (
                <Image 
                    source={{ uri: logoUrl }}
                    style={styles.logo}
                />
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
            <Text style={styles.headerText}>Danh sách dịch vụ</Text>
            <FlatList
                data={services}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.flatListContent}
            />
        </View>
    )
}

export default ServicesCustomer;

const styles = StyleSheet.create({
    logo: {
        alignSelf: "center",
        marginVertical: 50,
        width: 200,
        height: 100,
        resizeMode: 'contain'
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
    headerText: {
        padding: 15,
        fontSize: 25,
        fontWeight: "bold",
    },
    flatListContent: {
        paddingHorizontal: 10,
    },
    serviceItem: {
        flex: 1,
        margin: 10,
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
    },
    menuTriggerText: {
        color: "blue",
        marginTop: 10,
    }
});