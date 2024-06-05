import { useEffect, useState } from "react";
import {  View,  Image, StyleSheet,TouchableOpacity } from "react-native";
import {TextInput,Button, Text} from "react-native-paper";
import { useMyContextProvider, login } from '../src/index';
const Login =({navigation})=>{
    const [controller,dispatch] = useMyContextProvider();
    const[email,setEmail] = useState("nguyenhuuhau240616@gmail.com");
    const[password,setPassword] =useState("123456"); // admin 987654
    const[showpassword,setShowPassword] =useState('');

    const {userLogin} = controller;
    

    useEffect(() => {
      console.log(userLogin)
      if (userLogin != null) {
        if (userLogin.role === "admin")
          navigation.navigate("Admin")
        else if (userLogin.role === "customer")
          navigation.navigate("Customer")
      }
    }, [userLogin])

    const handerLogin= async ()=>{
       login(dispatch,email,password)
        
    };

    const hasErrorPassword =()=> password.length<6
    const hasErrorEmail =()=> !email.includes("@")
    const isDisabled = hasErrorPassword() || hasErrorEmail() || email === '' || password === '';
    return(
        <View style={{        
            flex:1,
            backgroundColor:'#E0FFFF',
            justifyContent: "flex-start"
            }}>
            <View style={{        
            alignItems:'center'
            }}>
            <Image
                source={require("../assets/logo1.png")}
                style={{ width: 380, height: 250, 
                marginBottom: 20 ,
                marginVertical: 40}}
            />
            </View>
            <Text style={{ fontSize: 24, textAlign: 'center', color:"#191970" }}>Login</Text>
            <View>
                <TextInput style={MyStyle.text}
                    placeholder={"Email"}
                    mode="outlined"
                    theme={{roundness: 10}}
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput style={MyStyle.text}
                    mode="outlined"
                    theme={{roundness: 10}}
                    placeholder={"Password"}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showpassword}
                    right={
                        <TextInput.Icon 
                        icon ={showpassword? "eye-off" : "eye"}
                        onPress={() => setShowPassword(!showpassword)}
                        />}
                />
                <Button
                style={MyStyle.buttonlogin}
                mode ="contained"
                onPress={handerLogin}
                disabled={isDisabled}
                >
                <Text
                style={{
                    fontSize:20,
                    color:"white"
                }} 
                >Login</Text>
                </Button>
                <View style={{ flexDirection:'row',justifyContent: "space-between", alignItems: "center",  width: '100%' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={{ color: 'blue',fontSize:15, marginLeft:40 }}>
                        Sign Up 
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={{ color: 'blue',fontSize:15, marginRight:40 }}>
                         I have forgot Password!!!
                    </Text>
                </TouchableOpacity>
                </View>
                
            </View>
        </View>
    )
}
export default Login;

const MyStyle = StyleSheet.create({
    text:{
        marginVertical:10,
        marginHorizontal:30,
        backgroundColor:'#87CEFA',
    },
    buttonlogin:{
        height:50,
        width:'auto',
        marginVertical:10,
        marginHorizontal:30,
        backgroundColor:'#00BFFF',
        justifyContent:'center',
    }

})
