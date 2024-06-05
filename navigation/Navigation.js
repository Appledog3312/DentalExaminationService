import {createStackNavigator} from "@react-navigation/stack"
import Login from "../Component/Login"
import Register from "../Component/Register"
import Admin from "../Admin/Admin"
import Customer from "../Customer/Customer"
import ForgotPassword from "../Component/ForgotPassword"
import { AuthProvider } from "../src"


const Stack = createStackNavigator()

const Navigation = () =>{
    return(
       
            <Stack.Navigator
                initialRouteName="Customer"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="Login" component={Login}/>
                <Stack.Screen name="Admin" component={Admin}/>
                <Stack.Screen name="Customer" component={Customer}/>
                <Stack.Screen name="Register" component={Register}/>
                <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
                    

            </Stack.Navigator>
       
        
    )
}

export default Navigation;