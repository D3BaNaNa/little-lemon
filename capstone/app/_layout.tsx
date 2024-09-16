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
  const [initialScreen, setInitialScreen] = useState("Onboarding")

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
    signedIn ? setInitialScreen("Home") : setInitialScreen("Onboarding")
  }, [signedIn])

  if (dataLoaded) {
    screenShown = signedIn
    ? [<Stack.Screen name="Home" component={Home} key="Home"/>,
      <Stack.Screen name="Profile" component={Profile} key="Profile"/>
    ]
    
    : [<Stack.Screen name="Onboarding" component={Onboarding} key="Onboarding"/>,
      <Stack.Screen name="Home" component={Home} key="Home"/>,
    ]

    
  }

  // useEffect(() => {
  //   // console.log(signedIn)
  // }, [signedIn])


  if (dataLoaded) {
    return (
      <Stack.Navigator initialRouteName={initialScreen}>
        
        {screenShown}
        
         
        
        
        
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