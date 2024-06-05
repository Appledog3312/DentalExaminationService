import React, { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import { Text } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [admin,setAdmins]=useState([])

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('USERS')
            .where('role', '==', 'customer')
            .onSnapshot(querySnapshot => {
                const customersData = [];
                querySnapshot.forEach(documentSnapshot => {
                    customersData.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setCustomers(customersData);
            });

        return () => unsubscribe();
    }, []);
    useEffect(() => {
        const unsubscribe = firestore()
            .collection('USERS')
            .where('role', '==', 'admin')
            .onSnapshot(querySnapshot => {
                const adminData = [];
                querySnapshot.forEach(documentSnapshot => {
                    adminData.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setAdmins(adminData);
            });

        return () => unsubscribe();
    }, []);


    const renderItem = ({ item }) => (
        <View style={{ margin: 10, 
            padding: 15, 
            borderRadius: 15, 
            marginVertical: 5, 
            backgroundColor:'#FAE7FD'
            }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Email: {item.email} </Text>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Tên: {item.fullname} </Text>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Địa chỉ: {item.address} </Text>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>SDT: {item.phone} </Text>
        </View>
    );
    const renderItemadmin = ({ item }) => (
        <View style={{ margin: 10, 
            padding: 15, 
            borderRadius: 15, 
            marginVertical: 5, 
            backgroundColor:'#FAE7FD'
            }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Email: {item.email} </Text>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Tên: {item.fullname} </Text>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Địa chỉ: {item.address} </Text>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>SDT: {item.phone} </Text>
        </View>
    );

    return (
        <View style={{ flex: 1,backgroundColor:'white' }}>
            <Text style={{ padding: 15, fontSize: 25, fontWeight: "bold" }}>Admin</Text>
            <FlatList
                data={admin}
                renderItem={renderItemadmin}
                keyExtractor={item => item.id}
            />
            <Text style={{ padding: 15, fontSize: 25, fontWeight: "bold" }}>Customers</Text>
            <FlatList
                data={customers}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    )
}

export default Customers;