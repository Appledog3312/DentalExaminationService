import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MyContextControllerProvider } from './src/index';
import Navigation from './navigation/Navigation';
import { MenuProvider } from 'react-native-popup-menu';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import FlashMessage from "react-native-flash-message";

const App = () => {
  // const USERS = firestore().collection("USERS")
  // const admin = {
  //   fullname: "Admin02",
  //   email: "admin02@gmail.com",
  //   password: "987654",
  //   phone: "0868602572",
  //   address: "Bình Dương",
  //   role: "admin" 
  // }
  // useEffect(() => {
  //   const checkAndCreateAdmin = async () => {
  //     try {
  //       const userDoc = await USERS.doc(admin.email).get();
  //       if (!userDoc.exists) {
  //         await auth().createUserWithEmailAndPassword(admin.email, admin.password);
  //         await USERS.doc(admin.email).set(admin);
  //         console.log("Add new account admin");
  //       }
  //     } catch (error) {
  //       console.error("Error creating admin user:", error);
  //     }
  //   };

  //   checkAndCreateAdmin();
  // }, []);
  // useEffect(() => {
  //   const handleDeepLink = (event) => {
  //     const { url } = event;
  //     if (url.includes('success')) {
  //       // Extract paymentId and payerId from URL
  //       const params = new URLSearchParams(url.split('?')[1]);
  //       const paymentId = params.get('paymentId');
  //       const payerId = params.get('PayerID');

  //       // Navigate to PaymentSuccess with paymentId and payerId
  //       navigation.navigate('PaymentSuccess', { paymentId, payerId });
  //     } else if (url.includes('cancel')) {
  //       navigation.navigate('PaymentCancel');
  //     }
  //   };

  //   const linkingEvent = Linking.addEventListener('url', handleDeepLink);

  //   return () => {
  //     linkingEvent.remove();
  //   };
  // }, []);

  return (
    
      <MyContextControllerProvider>
      <MenuProvider>
        <NavigationContainer>
          <Navigation/>
        </NavigationContainer>
      </MenuProvider>
    </MyContextControllerProvider>
 
    
     );
}
export default App
