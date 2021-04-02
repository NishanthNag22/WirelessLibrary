import React from 'react';
import { Text, View, FlatList, StyleSheet, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView } from 'react-native';
import db from '../config';
import * as firebase from 'firebase'

export default class LoginScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            emailId: '',
            password: ''
        }
    }
    login=async(email,password)=>{
        console.log("Login Function");
        if (email && password){
            console.log(email,password)
          try{
            const response = await firebase.auth().signInWithEmailAndPassword(email,password);
            console.log("Response: ",response);
            if(response){
              this.props.navigation.navigate('Transaction')
            }
          }
          catch(error){
            switch (error.code) {
              case 'auth/user-not-found':
                alert("User dosen't exists")
                console.log("doesn't exist")
                break
              case 'auth/invalid-email':
                alert('Incorrect email or password')
                console.log('invaild')
                break
            }
          }
        }
        else{
            alert('Enter email and password');
        }
      }

    render() {
        return (
            <KeyboardAvoidingView style={{ alignItems: "center", marginTop: 20 }}>
                <View>
                    <Image
                        source={require("../assets/booklogo.jpg")}
                        style={{ width: 200, height: 200 }} />
                    <Text style={{ textAlign: "center", fontSize: 30 }}>Wireless Library</Text>
                </View>
                <View>
                    <TextInput style={styles.loginBox}
                        placeholder="Enter Email Id"
                        keyboardType='email-address'
                        onChangeText={(text) => {
                            this.setState({
                                emailId: text
                            })
                        }} />
                    <TextInput style={styles.loginBox}
                        placeholder="Enter Password"
                        secureTextEntry={true}
                        onChangeText={(text) => {
                            this.setState({
                                password: text
                            })
                        }} />
                </View>
                <View>
                    <TouchableOpacity style={styles.button}
                        onPress={() => {
                            this.login(this.state.emailId, this.state.password)
                        }}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}
const styles = StyleSheet.create({
    loginBox: {
        width: 300,
        height: 40,
        borderWidth: 1.5,
        fontSize: 20,
        margin: 10,
        paddingLeft: 10
    },
    button: {
        height: 40,
        width: 100,
        borderWidth: 1,
        padding: 10,
        borderRadius: 7,
        backgroundColor: "gold"
    },
    buttonText: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
        alignItems: "center"
    }
})