import { createContext, useContext, useMemo, useReducer, useState } from "react";
import { Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

// Display
const MyContext = createContext()
MyContext.displayName = "MyContext";

// Reducer
const reducer = (state, action) => {
    switch (action.type) {
        case "USER_LOGIN":
            return { ...state, userLogin: action.value };
        case "LOGOUT":
            return { ...state, userLogin: null };
        default:
            throw new Error("Action doesn't exit");
    }
};

// MyContext
const MyContextControllerProvider = ({ children }) => {
    const initialState = {
        userLogin: null,
        services: [],
    };
    const [controller, dispatch] = useReducer(reducer, initialState);
    const value = useMemo(() => [controller, dispatch], [controller]);
    return (
        <MyContext.Provider value={value}>
            {children}
        </MyContext.Provider>
    );
};
// useMyContext
function useMyContextProvider() {
    const context = useContext(MyContext);
    if (!context) {
        throw new Error("useMyContextProvider should be used inside the MyContextControllerProvider");
    };
    return context;
};

// Collections
const USERS = firestore().collection("USERS");
 
// Action
// const createAccount = (email, password, fullname, phone, address, role, id) => {
//     auth().createUserWithEmailAndPassword(email, password)
//         .then((userCredential) => {
//             const userId = userCredential.user.uid; // Get the user ID
//             Alert.alert("Success!", "Your account has been created.");

//             USERS.doc(userId)
//                 .set({
//                     id: userId, // Add the user ID here
//                     email,
//                     fullname,
//                     phone,
//                     address,
//                     role:  "customer" 
//                 })
//                 .catch(e => console.log(e.message));
//         })
//         .catch(e => console.log(e.message));
// };

const createAccount = (email, password, fullname, phone, address, role) => {
    auth().createUserWithEmailAndPassword(email, password, fullname, phone, address, role)
    .then(() => {
        Alert.alert("Success!", "Your account has been created. " );
        USERS.doc(email)
        .set({
            email,
            password,
            fullname,
            phone,
            address,
            role: "customer"
        })
        .catch(e=>console.log(e.message));
    })
    .catch(e=>console.log(e.message))
};


const login = (dispatch,email,password)=>{
    auth().signInWithEmailAndPassword(email,password)
    .then(
        ()=>
        USERS.doc(email)
        .onSnapshot(u=>{
            if(u.exists){

                Alert.alert("Login successful with user : " + u.id);
                dispatch({type: "USER_LOGIN" ,value : u.data()});
            }
        })
    )
    .catch(e=>Alert.alert(e.message))
}


const logout = (dispatch) => {
    auth().signOut()
    .then(() => dispatch({ type: "LOGOUT" }));
};


export {
    MyContextControllerProvider,
    useMyContextProvider,
    createAccount,
    login,
    logout,
    
    
};