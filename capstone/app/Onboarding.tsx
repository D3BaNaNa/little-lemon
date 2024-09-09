import {Text, View, TextInput, Image, 
  StyleSheet, KeyboardAvoidingView, Platform, Pressable } from "react-native"
import { useState, useEffect } from "react";
import { useFonts } from 'expo-font';

import AsyncStorage from '@react-native-async-storage/async-storage';

const isValidEmail = (email: string) => {
  if (email.includes("@")) {
    return !(email[email.indexOf("@") + 1] === undefined)
  } else {
    return false
  }
}

export default function Onboarding({navigation} : {navigation: any}) {
  
  const [loaded] = useFonts({
    MarkaziText: require('../assets/fonts/MarkaziText-Regular.ttf'),
    Karla: require('../assets/fonts/Karla-Regular.ttf')
  });

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isDisabled, setDisabled] = useState(true)

  useEffect(() => {
    setDisabled(!(isValidEmail(email) && !(name === "")))
  }, [name, email])

  const handleClick = async () => {
    try {
      await AsyncStorage.setItem("isSignedIn", "yes")
      await AsyncStorage.setItem("name", name)
      await AsyncStorage.setItem("email", email)
      await AsyncStorage.setItem("phone", "null")
      await AsyncStorage.setItem("avatar", "null")
      await AsyncStorage.setItem("checkboxes", "null")

      await AsyncStorage.removeItem("one")
      await AsyncStorage.removeItem("two")
      await AsyncStorage.removeItem("three")
      await AsyncStorage.removeItem("four")

      navigation.navigate("Home")
  
    } catch(e) {
      console.error(e)
    }
    
  
  }


    return (
      <View style={styles.container}>

        <View style={styles.header}>
          <Image source={require("../assets/img/Logo.png")}></Image>
        </View>

        <Text style={styles.welcomeText}>Let us get to know you!</Text>

        <KeyboardAvoidingView style={styles.inputArea}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

          <Text style={styles.fieldText}>First Name</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={setName}
            placeholder="  Enter first name..."
            value={name}
          />

          <Text style={styles.fieldText}>Email</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={setEmail}
            placeholder="  Enter first name..."
            value={email}
          />

        </KeyboardAvoidingView>
        <View style={styles.buttonArea}>
          <Pressable
          style={[
            styles.button,
            isDisabled ? {backgroundColor: "#ffefa3"} : {backgroundColor: "#F4CE14"}
          ]}
          disabled={isDisabled}
          onPress={handleClick}
        >
          <Text style={styles.fieldText}>Next</Text></Pressable></View>
        


      </View>
    );
  }
  
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column"
  },
  header: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 0.1,
    backgroundColor: "lightgray"
  },
  welcomeText: {
    flex: 0.1,
    fontSize: 30,
    alignItems: "center",
    textAlign: "center",
    fontFamily: "MarkaziText",
    backgroundColor: "lightgray",
    marginBottom: "10%"
  },
  fieldText: {
    fontSize: 30,
    alignItems: "center",
    textAlign: "center",
    fontFamily: "Karla"
  },
  inputArea: {
    flex: 0.45,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  textInput: {
    backgroundColor: "gray",
    width: "80%",
    borderRadius: 8,
    height: "10%",
    margin: "5%"
  },
  buttonArea: {
    flex: 0.3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"

  },
  button: {
    width: "30%",
    height: "25%",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"

  }

})