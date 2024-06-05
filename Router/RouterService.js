import { createStackNavigator } from "@react-navigation/stack";
import Services from '../Sevices/Services';
import AddNewService from '../Admin/AddNewService';
import ServiceDetail from '../Sevices/ServiceDetail';
import ServiceUpdate from "../Sevices/ServiceUpdate";
import { useMyContextProvider } from "../src/index";
import { Text, IconButton } from "react-native-paper";
import { Menu, MenuTrigger, MenuOption, MenuOptions } from "react-native-popup-menu";
import { Alert, Image } from "react-native";
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from "react-native-gesture-handler";
import Transaction from "../Admin/Transaction";
import UpdateAppointment from "../Customer/UpdateAppoinment";
import MyBanner from "../Admin/MyBanner";

const Stack = createStackNavigator();

const RouterService = ({ navigation }) => {
    const [controller] = useMyContextProvider();
    const { userLogin } = controller;

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
        );
    };

    return (
        <Stack.Navigator
            initialRouteName="Services"
            screenOptions={{
                headerTitleAlign: "left",
                headerStyle: {
                    backgroundColor: "#87CEFA"
                },
                headerRight: (props) => (
                    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                      <Image source={require('../assets/account1.png')} style={{ width: 30, height: 30, margin: 20 }} />
                    </TouchableOpacity>
                  ),
                  
            }}
        >
            <Stack.Screen options={{headerLeft: null, title: (userLogin != null) && (userLogin.fullName)}} name="Services" component={Services} />
            <Stack.Screen name="Add New Service" component={AddNewService} />
            <Stack.Screen
                name="Service Detail"
                component={ServiceDetail}
                options={({ route }) => ({
                    headerRight: () => (
                        <Menu>
                            <MenuTrigger>
                            <Image source={require('../assets/dots.png')} style={{ width: 30, height: 30, margin: 20 }} />
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption onSelect={() => navigation.navigate("Service Update", { service: route.params.service })}>
                                    <Text>Update</Text>
                                </MenuOption>
                                <MenuOption onSelect={() => handleDelete(route.params.service)}>
                                    <Text>Delete</Text>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    )
                })}
            />
            <Stack.Screen name="Service Update" component={ServiceUpdate} />
            <Stack.Screen name="Transaction" component={Transaction} />
            <Stack.Screen name="UpdateAppointment" component={UpdateAppointment} />
            <Stack.Screen name="MyBanner" component={MyBanner} />
            
        </Stack.Navigator>
    )
}

export default RouterService;
