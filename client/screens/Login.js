import React, { useState } from "react";
import { Button, TextInput } from "react-native-paper";
import {
  View,
  Text,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIurl from "../apiURL.js/APIurl";
function Login(props) {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");

  const sendCred = async ({navigation}) => {
    const res = await APIurl.post(
      "/login",
      { username, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(async (dataResponse) => {
      console.log(dataResponse);
      if (dataResponse.data.message === "Login Successful") {
        try {
          await AsyncStorage.setItem("username", dataResponse.data.user.username);
          navigation.navigate('scan');
        } catch (e) {
          console.log("error hai", e);
          Alert.alert(e);
        }
      } else {
        Alert.alert(dataResponse.data.message);
        return;
      }
    });
  };

  return (
    <>
      <KeyboardAvoidingView behavior="position">
        <StatusBar backgroundColor="blue" barStyle="light-content" />
        <Text
          style={{
            fontSize: 35,
            marginLeft: 18,
            marginTop: 10,
            color: "#3b3b3b",
          }}
        >
          WELCOME
        </Text>
        <Text style={{ fontSize: 30, marginLeft: 18, color: "blue" }}>
          Scan the Product
        </Text>
        <View
          style={{
            borderBottomColor: "blue",
            borderBottomWidth: 4,
            borderRadius: 10,
            marginLeft: 20,
            marginRight: 150,
            marginTop: 4,
          }}
        />
        <Text
          style={{
            fontSize: 20,
            marginLeft: 18,
            marginTop: 20,
          }}
        >
          USER LOGIN
        </Text>
        <TextInput
          label="Username"
          mode="outlined"
          value={username}
          style={{ marginLeft: 18, marginRight: 18, marginTop: 18 }}
          theme={{ colors: { primary: "blue" } }}
          onChangeText={(text) => setusername(text)}
        />
        <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
          style={{ marginLeft: 18, marginRight: 18, marginTop: 18 }}
          theme={{ colors: { primary: "blue" } }}
        />
        <Button
          mode="contained"
          style={{ marginLeft: 18, marginRight: 18, marginTop: 18 }}
          onPress={() => sendCred(props)}
        >
          Login
        </Button>
      </KeyboardAvoidingView>
    </>
  );
}

export default Login;
