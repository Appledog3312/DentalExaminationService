import { useState ,useEffect} from "react";
import { Alert, View,Image,StyleSheet, TouchableOpacity } from "react-native";
import {TextInput,Button, Text, HelperText} from "react-native-paper";
import { createAccount } from '../src/index';

const Register =({navigation})=>{
    const[email,setEmail] = useState("");
    const[password,setPassword] =useState("");
    const[fullname,setFullName] =useState("");
    const[passwordComfirm,setPasswordComfirm] =useState("");
    const[showpassword,setShowPassword] =useState('');
    const[showpasswordConfirm,setShowPasswordConfirm] =useState('');

    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [role] = useState('');
   

    
    const handleRegister = () => {
      createAccount(email, password, fullname, phone, address, role);
    };

    const hasErrorPassword =()=> password.length<6
    const hasErrorPasswordConfirm =()=> passwordComfirm != password
    const hasErrorEmail =()=> !email.includes("@")

    return(
        <View style={{flex:1,justifyContent:"flex-start",backgroundColor:'#E0FFFF'}}>
            <View style={{        
            alignItems:'center'
            }}>
            <Image
                source={require("../assets/logo1.png")}
                style={{ width: 380, height: 130, 
                marginBottom: 20 ,
                marginVertical: 40}}
            />
            </View>
            <TextInput style={MyStyle.text}
                mode="outlined"
                theme={{roundness: 10}}
                label={"Fullname"}
                value={fullname}
                onChangeText={setFullName}
            />
            <TextInput style={MyStyle.text}
                mode="outlined"
                theme={{roundness: 10}}
                label={"Email"}
                value={email}
                onChangeText={setEmail}
            />
            <HelperText style={MyStyle.texthelp} type="error" visible={email.length > 0 && hasErrorEmail()}>
                Email must have an '@' character to be valid
            </HelperText>
            <TextInput style={MyStyle.text}
                mode="outlined"
                theme={{roundness: 10}}
                label={"Address"}
                value={address}
                onChangeText={setAddress}
            />
            <TextInput style={MyStyle.text}
                mode="outlined"
                theme={{roundness: 10}}
                label={"Phone"}
                value={phone}
                onChangeText={setPhone}
            />
            <TextInput
                style={MyStyle.text}
                mode="outlined"
                theme={{roundness: 10}}
                label={"Password"}
                value={password}
                secureTextEntry={!showpassword}
                onChangeText={setPassword}
                right={
                    <TextInput.Icon 
                    icon ={showpassword? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showpassword)}
                    />}
            />
            <HelperText
                style={MyStyle.texthelp}
                type="error"
                visible={password.length > 0 && hasErrorPassword()}>
                Password of at least 6 characters
            </HelperText>
            <TextInput
                style={MyStyle.text}
                mode="outlined"
                theme={{roundness: 10}}
                label={"PasswordComfirm"}
                value={passwordComfirm}
                secureTextEntry={!showpasswordConfirm}
                onChangeText={setPasswordComfirm}
                right={
                <TextInput.Icon 
                icon ={showpasswordConfirm ? "eye-off" : "eye"}
                onPress={() => setShowPasswordConfirm(!showpasswordConfirm)}
                />}
            />         
            <HelperText type="error" visible={hasErrorPasswordConfirm()}>
                 Confirm Password don't match
            </HelperText>
            <Button mode ="contained"
                style={MyStyle.buttonlogin}
                onPress={handleRegister}
                disabled={hasErrorEmail()||hasErrorPassword()||hasErrorPasswordConfirm()}
            >
                Register
            </Button>
            <View style={{ flexDirection:'row',alignSelf:"center" }}>
                <Text style={{ color: 'black',fontSize:15 }}>Already have an account ? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={{ color: 'blue',fontSize:15 }}>
                        Log In
                    </Text>
                </TouchableOpacity>
                </View>
        </View>
    )
}
export default Register;
const MyStyle = StyleSheet.create({
    text:{
        marginVertical:5,
        marginHorizontal:30,
        backgroundColor:'#87CEFA',
    },
    texthelp:{
        marginHorizontal:30,
    },
    buttonlogin:{
        height:45,
        width:'auto',
        marginVertical:2,
        marginHorizontal:30,
        backgroundColor:'#00BFFF',
        justifyContent:'center',
    }

})