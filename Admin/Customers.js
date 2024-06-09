import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, TextInput, Alert, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [editedCustomer, setEditedCustomer] = useState({});

    useEffect(() => {
        const unsubscribeCustomers = firestore()
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

        return () => unsubscribeCustomers();
    }, []);

    useEffect(() => {
        const unsubscribeAdmins = firestore()
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

        return () => unsubscribeAdmins();
    }, []);

    const handleEdit = (customer) => {
        setEditMode(true);
        setSelectedCustomer(customer);
        setEditedCustomer({ ...customer });
    };

    const handleSave = () => {
        firestore()
            .collection('USERS')
            .doc(selectedCustomer.id)
            .update(editedCustomer)
            .then(() => {
                setEditMode(false);
                setSelectedCustomer(null);
                setEditedCustomer({});
            })
            .catch(error => {
                console.error("Error updating customer: ", error);
            });
    };

    const handleDelete = (customer) => {
        Alert.alert(
            "Warning",
            "Are you sure you want to delete this account? This operation cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        firestore()
                            .collection('USERS')
                            .doc(customer.id)
                            .delete()
                            .then(() => {
                                console.log("User deleted successfully!");
                            })
                            .catch(error => {
                                console.error("Error deleting user:", error);
                            });
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const renderCustomerItem = ({ item }) => {
        if (editMode && selectedCustomer.id === item.id) {
            return (
                <View style={styles.itemContainer}>
                    <View>
                        <Text style={styles.inputLabel}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={editedCustomer.email}
                            editable={false}
                            placeholder="Email không thể thay đổi"
                        />
                        <Text style={styles.inputLabel}>Tên</Text>
                        <TextInput
                            style={styles.input}
                            value={editedCustomer.fullname}
                            onChangeText={(text) => setEditedCustomer({ ...editedCustomer, fullname: text })}
                            placeholder="Tên"
                        />
                        <Text style={styles.inputLabel}>Địa chỉ</Text>
                        <TextInput
                            style={styles.input}
                            value={editedCustomer.address}
                            onChangeText={(text) => setEditedCustomer({ ...editedCustomer, address: text })}
                            placeholder="Địa chỉ"
                        />
                        <Text style={styles.inputLabel}>SDT</Text>
                        <TextInput
                            style={styles.input}
                            value={editedCustomer.phone}
                            onChangeText={(text) => setEditedCustomer({ ...editedCustomer, phone: text })}
                            placeholder="SDT"
                        />
                    </View>
                    <View style={styles.editButtons}>
                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                            <Icon name="save" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
                            <Icon name="delete" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.itemContainer}>
                <View>
                    <Text style={styles.itemText}>Email: {item.email}</Text>
                    <Text style={styles.itemText}>Tên: {item.fullname}</Text>
                    <Text style={styles.itemText}>Địa chỉ: {item.address}</Text>
                    <Text style={styles.itemText}>SDT: {item.phone}</Text>
                </View>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                    <Icon name="edit" size={24} color="white" />
                </TouchableOpacity>
            </View>
        );
    };

    const renderAdminItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View>
                <Text style={styles.itemText}>Email: {item.email}</Text>
                <Text style={styles.itemText}>Tên: {item.fullname}</Text>
                <Text style={styles.itemText}>Địa chỉ: {item.address}</Text>
                <Text style={styles.itemText}>SDT: {item.phone}</Text>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Text style={styles.headerText}>Admins</Text>
            <FlatList
                data={admins}
                renderItem={renderAdminItem}
                keyExtractor={item => item.id}
            />
            <Text style={styles.headerText}>Customers</Text>
            <FlatList
                data={customers}
                renderItem={renderCustomerItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

export default Customers;

const styles = StyleSheet.create({
    headerText: {
        padding: 15,
        fontSize: 25,
        fontWeight: "bold",
    },
    itemContainer: {
        margin: 10,
        padding: 15,
        borderRadius: 15,
        marginVertical: 5,
        backgroundColor: '#FAE7FD',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    input: {
        fontSize: 18,
        fontWeight: "bold",
        backgroundColor: 'white',
        marginBottom: 5,
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    inputLabel: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    editButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    editButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
});
