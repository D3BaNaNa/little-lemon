import { NavigationContainer } from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack"

import AsyncStorage from '@react-native-async-storage/async-storage';

import Onboarding from "./Onboarding"
import Profile from "./Profile";
import Home from "./Home"
import Loading from "./Loading"


import { useEffect, useState } from "react";

const Stack = createNativeStackNavigator();

export default function RootLayout() {  
  const [signedIn, setSignedIn] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  let screenShown;

  const getSignedIn = async() => {
    try {
      setSignedIn(await AsyncStorage.getItem("isSignedIn") === "yes")

    } catch(e) {
      console.error(e)
    }
  }

  useEffect(() => {getSignedIn}, [])

  setInterval(getSignedIn, 250)

  useEffect(() => {
    setDataLoaded(true)
  }, [signedIn])

  if (dataLoaded) {
    screenShown = signedIn
    ? <Stack.Screen name="Profile" component={Profile} />
    : <Stack.Screen name="Onboarding" component={Onboarding} />
  }

  // useEffect(() => {
  //   // console.log(signedIn)
  // }, [signedIn])
  


  if (dataLoaded) {
    return (
      <Stack.Navigator>
        
        {screenShown}
        <Stack.Screen name="Home" component={Home} />
         
        
        
        
      </Stack.Navigator>
    );

  } else {
    return (
      <Stack.Navigator initialRouteName={"Loading"}>
        
        <Stack.Screen name="Loading" component={Loading} />
        
      </Stack.Navigator>
    );
  }
    
}
