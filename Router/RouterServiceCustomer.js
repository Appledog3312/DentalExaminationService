import { createStackNavigator } from "@react-navigation/stack";
import ServicesCustomer from '../Customer/ServicesCustomer';
import { useMyContextProvider } from "../src/index";
import Appointment from "../Customer/Appointment";
import ProfileCustomer from "../Customer/ProfileCustomer";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "react-native";
import ServiceDetail from "../Sevices/ServiceDetail";
import AppointmentList from "../Customer/AppoinmentList";
import AppoimentDetail from "../Customer/AppoimentDetail";
import Payment from "../Customer/Payment";
import OrderDetail from "../Customer/OrderDetail";


const Stack = createStackNavigator();

const RouterServiceCustomer = ({ navigation }) => {
    const [controller] = useMyContextProvider();
    const { userLogin } = controller;

    return (
        <Stack.Navigator
            initialRouteName="ServicesCustomer"
            screenOptions={{
                headerTitleAlign: "left",
                headerStyle: {
                    backgroundColor: "#87CEFA"
                },
                headerRight: () => (
                    userLogin ? (
                        <TouchableOpacity onPress={() => navigation.navigate("ProfileCustomer")}>
                            <Image source={require('../assets/account1.png')} style={{ width: 30, height: 30, margin: 20 }} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Image source={require('../assets/icon_login.png')} style={{ width: 30, height: 30, margin: 20 }} />
                        </TouchableOpacity>
                    )
                ),
            }}
        >
            <Stack.Screen
                options={{
                    headerLeft: null,
                    title: userLogin ? userLogin.fullName : "Services"
                }}
                name="ServicesCustomer"
                component={ServicesCustomer}
            />
            <Stack.Screen name="Appointment" component={Appointment} />
            <Stack.Screen name="Service Detail" component={ServiceDetail} />
            <Stack.Screen name="AppointmentList" component={AppointmentList} />
            <Stack.Screen name="ProfileCustomer" component={ProfileCustomer} />
            <Stack.Screen name="AppoimentDetail" component={AppoimentDetail} />
            <Stack.Screen name="Payment" component={Payment} />
            <Stack.Screen name="OrderDetail" component={OrderDetail} />
            
        </Stack.Navigator>
    );
}

export default RouterServiceCustomer;
