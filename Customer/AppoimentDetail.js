// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Image, Button, Alert } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import { useMyContextProvider } from '../src/index';
// import currencyFormatter from "currency-formatter";

// const AppointmentDetail = ({ route, navigation }) => {
//     const { appointmentId } = route.params;
//     const [appointment, setAppointment] = useState(null);
//     const [service, setService] = useState(null);
//     const [contactInfo, setContactInfo] = useState(null); 
//     const [controller] = useMyContextProvider();
//     const { userLogin } = controller;

//     useEffect(() => {
//         const fetchAppointment = async () => {
//             const appointmentDoc = await firestore()
//                 .collection('Appointments')
//                 .doc(appointmentId)
//                 .get();
                
//             if (appointmentDoc.exists) {
//                 const appointmentData = appointmentDoc.data();
//                 setAppointment({
//                     ...appointmentData,
//                     id: appointmentDoc.id,
//                     datetime: appointmentData.datetime.toDate() 
//                 });
    
//                 const serviceDoc = await firestore()
//                     .collection('Services')
//                     .doc(appointmentData.serviceId)
//                     .get();
    
//                 if (serviceDoc.exists) {
//                     const serviceData = serviceDoc.data();
//                     setService(serviceData);
//                     const userInfoDoc = await firestore()
//                         .collection('USERS')
//                         .doc(serviceData.userId) 
//                         .get();
    
//                     if (userInfoDoc.exists) {
//                         const userInfoData = userInfoDoc.data();
//                         setContactInfo(userInfoData); 
//                     }
//                 }
//             }
//         };
    
//         fetchAppointment();
//     }, [appointmentId]);

//     const handlePayment = () => {
//         navigation.navigate('Payment', { appointmentId: appointment.id, total: service.price, serviceTitle: service.title, price: service.price, DateA: appointment.datetime });
//     };

//     // if (!appointment || !service || !contactInfo) {
//     //     return (
//     //         <View style={styles.loadingContainer}>
//     //             <Text>Loading...</Text>
//     //         </View>
//     //     );
//     // }

    
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.title}>Chi tiết cuộc hẹn</Text>
//                 {service && <Image source={{ uri: service.imageUrl }} style={styles.image} />}
//                 <Text style={styles.label}>Tên dịch vụ:</Text>
//                 <Text style={styles.value}>{service ? service.title : 'Loading...'}</Text>
//                 <Text style={styles.label}>Giá tiền:</Text>
//                 <Text style={styles.value}>{service ? currencyFormatter.format(service.price, { code: "VND" }) : 'Loading...'}</Text>
//                 <Text style={styles.label}>Trạng thái:</Text>
//                 <Text style={styles.value}>{appointment ? (appointment.state === 'pending approval' ? 'Chờ duyệt' : appointment.state) : 'Loading...'}</Text>
//                 <Text style={styles.label}>Ngày hẹn:</Text>
//                 <Text style={styles.value}>{appointment && appointment.datetime ? appointment.datetime.toLocaleString() : 'Loading...'}</Text>
                
//                     <Button title="Thanh toán" onPress={handlePayment} />
//                 </View>
//             );
    
// };

// export default AppointmentDetail;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: '#fff',
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
//     image: {
//         width: '100%',
//         height: 200,
//         marginBottom: 20,
//     },
//     label: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginTop: 10,
//     },
//     value: {
//         fontSize: 18,
//     },
// });




import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useMyContextProvider } from '../src/index';
import currencyFormatter from "currency-formatter";

const AppointmentDetail = ({ route, navigation }) => {
    const { appointmentId } = route.params;
    const [appointment, setAppointment] = useState(null);
    const [service, setService] = useState(null);
    const [contactInfo, setContactInfo] = useState(null); 
    const [controller] = useMyContextProvider();
    const { userLogin } = controller;

    useEffect(() => {
        const fetchAppointment = async () => {
            const appointmentDoc = await firestore()
                .collection('Appointments')
                .doc(appointmentId)
                .get();
                
            if (appointmentDoc.exists) {
                const appointmentData = appointmentDoc.data();
                setAppointment({
                    ...appointmentData,
                    id: appointmentDoc.id,
                    datetime: appointmentData.datetime.toDate() 
                });
    
                const serviceDoc = await firestore()
                    .collection('Services')
                    .doc(appointmentData.serviceId)
                    .get();
    
                if (serviceDoc.exists) {
                    const serviceData = serviceDoc.data();
                    setService(serviceData);
                    const userInfoDoc = await firestore()
                        .collection('USERS')
                        .doc(serviceData.userId) 
                        .get();
    
                    if (userInfoDoc.exists) {
                        const userInfoData = userInfoDoc.data();
                        setContactInfo(userInfoData); 
                    }
                }
            }
        };
    
        fetchAppointment();
    }, [appointmentId]);

    const handlePayment = () => {
        if (appointment && service) {
            navigation.navigate('Payment', {
                appointmentId: appointment.id,
                serviceTitle: service.title,
                price: service.price,
                appointmentDate: appointment.datetime.toLocaleString(),
            });
        } else {
            Alert.alert('Error', 'Loading appointment or service details, please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chi tiết cuộc hẹn</Text>
            {service && <Image source={{ uri: service.imageUrl }} style={styles.image} />}
            <Text style={styles.label}>Tên dịch vụ:</Text>
            <Text style={styles.value}>{service ? service.title : 'Loading...'}</Text>
            <Text style={styles.label}>Giá tiền:</Text>
            <Text style={styles.value}>{service ? currencyFormatter.format(service.price, { code: "VND" }) : 'Loading...'}</Text>
            <Text style={styles.label}>Trạng thái:</Text>
            <Text style={styles.value}>{appointment ? (appointment.state === 'pending approval' ? 'Chờ duyệt' : appointment.state) : 'Loading...'}</Text>
            <Text style={styles.label}>Ngày hẹn:</Text>
            <Text style={styles.value}>{appointment && appointment.datetime ? appointment.datetime.toLocaleString() : 'Loading...'}</Text>
            <Button title="Thanh toán" onPress={handlePayment} />
        </View>
    );
};

export default AppointmentDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    value: {
        fontSize: 18,
    },
});


