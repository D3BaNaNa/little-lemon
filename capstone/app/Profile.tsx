import { Text, View, StyleSheet, Image, TextInput, Pressable, Switch } from "react-native";
import { useFonts } from 'expo-font';
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';


export default function Profile({ navigation }: { navigation: any }) {
  

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [avatar, setAvatar] = useState<any>("")
  const [phone, setPhone] = useState("")
  // const [initialStates, setInitialStates] = useState<any>([])
  // const [loaded, setLoaded] = useState(false)
  // const [logged, setLogged] = useState(true)

  const [one, setOne] = useState("")
  const [two, setTwo] = useState("")
  const [three, setThree] = useState("")
  const [four, setFour] = useState("")

  const readData = async () => {
    try {
      setName(String(await AsyncStorage.getItem("name")))
      setEmail(String(await AsyncStorage.getItem("email")))

      setAvatar(String(await AsyncStorage.getItem("avatar")))
      setPhone(String(await AsyncStorage.getItem("phone")))

      setOne(String(await AsyncStorage.getItem("one")))
      setTwo(String(await AsyncStorage.getItem("two")))
      setThree(String(await AsyncStorage.getItem("three")))
      setFour(String(await AsyncStorage.getItem("four")))

      // setInitialStates([name, email, phone, avatar, checkboxes])
            

    } catch(e) {
      console.error(e)

    } finally {
      // setLoaded(true)
    }
    

  }



  if (name === "null") { setName("") }
  if (email === "null") { setEmail("") }
  if (avatar === "null") { setAvatar("") }
  if (phone === "null") { setPhone("") }


  useEffect(() => {
    readData()
  }, 
  []) 



  // const [initialStates, setInitialStates] = useState<any>([])

    // useEffect(() => {
    //   setInitialStates([name, email, phone, avatar, checkboxes])
    // }, [loaded])

  

  /*
    onValueChange={() => {
          let newCheck = checkboxes
          newCheck[String(i)] = !newCheck[String(i)]
          setCheckboxes(newCheck)


        }}
  */

  const placeholderImage = require("../assets/img/defaulticon.png")

  const img = avatar === "" 
  ? <Image source={placeholderImage} style={styles.avatar} />
  : <Image source={{ uri: avatar }} style={styles.avatar}
  resizeMode="stretch" width={100} />


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    // console.log(result);
  
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };


  const logout = async () => {
    try {
      await AsyncStorage.setItem("isSignedIn", "no")
  
    } catch(e) {
      console.error(e)
    }
  }

  const save = async () => {
    try {
      await AsyncStorage.setItem("isSignedIn", "yes")
      await AsyncStorage.setItem("name", name)
      await AsyncStorage.setItem("email", email)
      await AsyncStorage.setItem("avatar", avatar)
      await AsyncStorage.setItem("phone", phone)

      await AsyncStorage.setItem("one", one)
      await AsyncStorage.setItem("two", two)
      await AsyncStorage.setItem("three", three)
      await AsyncStorage.setItem("four", four)



      navigation.navigate("Home")

  
    } catch(e) {
      console.error(e)
    }
  }

  // useEffect(() => {async() => {
  //   const runOrder = async () => {
  //     await save()
  //     await readData()

  //   }

  //   runOrder()
  // }}, [loaded])

  const discard = async () => {
    // await AsyncStorage.setItem("isSignedIn", "yes")
    // await AsyncStorage.setItem("name", initialStates[0])
    // await AsyncStorage.setItem("email", initialStates[1])
    // await AsyncStorage.setItem("avatar", initialStates[3])
    // await AsyncStorage.setItem("phone", initialStates[2])
    // await AsyncStorage.setItem("checkboxes", JSON.stringify(initialStates[4]))

    // setName(initialStates[0])
    // setEmail(initialStates[1])
    // setPhone(initialStates[2])
    // setAvatar(initialStates[3])
    // setCheckboxes(initialStates[4])
    readData()

    navigation.navigate("Home");

  }



  const [fontsLoaded] = useFonts({
    Markazi: require('../assets/fonts/MarkaziText-Regular.ttf'),
    Karla: require('../assets/fonts/Karla-Regular.ttf')
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.headerText}>Personal Information</Text>
      </View>

      <View style={styles.fullAvatarArea}>
        <Text style={styles.fieldText}>Avatar</Text>

        <View style={styles.avatarArea}>

          {img}
          

          <Pressable style={styles.avatarButtonGreen} onPress={pickImage}>
            <Text style={styles.changeButton}>Change</Text>
          </Pressable>

          <Pressable style={styles.avatarButtonWhite} onPress={pickImage}>
            <Text style={styles.removeButton}>Remove</Text>
          </Pressable>

        </View>
      </View>

      <View style={styles.textInputArea}>
        <Text style={styles.fieldText}>Name</Text>
        <TextInput 
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder="Enter name..."
          keyboardType="default"
        />

        <Text style={styles.fieldText}>Email</Text>
        <TextInput 
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Enter name..."
          keyboardType="email-address"
        />

        <Text style={styles.fieldText}>Phone Number</Text>
        <TextInput 
          style={styles.input}
          onChangeText={setPhone}
          value={phone}
          placeholder="Enter phone number..."
          keyboardType="phone-pad"
        />
        
      </View>

      <View style={styles.notificationsArea}>
        <Text style={
          styles.emailNotifications}
        >Email notifications</Text>
        
      <View style={styles.eachNotif} >
        <Switch value={one === "yes"} style={styles.switch}
        onValueChange={() => setOne(prev => 
          prev === "yes" ? "no" : "yes"
        )} />
        <Text style={styles.notifText}>Order statuses</Text>
      </View>

      <View style={styles.eachNotif} >
        <Switch value={two === "yes"} style={styles.switch}
        onValueChange={() => setTwo(prev => 
          prev === "yes" ? "no" : "yes"
        )} />
        <Text style={styles.notifText}>Password changes</Text>
      </View>

      <View style={styles.eachNotif} >
        <Switch value={three === "yes"} style={styles.switch}
        onValueChange={() => setThree(prev => 
          prev === "yes" ? "no" : "yes"
        )} />
        <Text style={styles.notifText}>Special offers</Text>
      </View>

      <View style={styles.eachNotif} >
        <Switch value={four === "yes"} style={styles.switch}
        onValueChange={() => setFour(prev => 
          prev === "yes" ? "no" : "yes"
        )} />
        <Text style={styles.notifText}>Newsletter</Text>
      </View>
     


      </View>

      <View style={styles.logoutArea}>
          <Pressable style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
      </View>

      <View style={styles.saveArea}>
          <Pressable style={styles.discardButton} onPress={discard}>
            <Text style={styles.discardText}>Discard Changes</Text>
          </Pressable>

          <Pressable style={styles.saveButton} onPress={save}>
            <Text style={styles.saveText}>Save Changes</Text>
          </Pressable>

      </View>
     

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex"
  },
  headerArea: {
    flex: 0.1,
    justifyContent: "center"
  },
  headerText: {
    fontFamily: "Karla",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center"
  },
  fullAvatarArea: {
    flex: 0.15,
    flexDirection: "column"
  },
  fieldText: {
    fontFamily: "Karla",
    color: "gray",
    fontSize: 15,
    marginHorizontal: "5%",
    marginVertical: 2
  },
  avatarArea: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  avatar: {
    height: "100%",
    width: "25%",
    borderRadius: 40,
    margin: 10
  },
  changeButton: {
    fontFamily: "Karla",
    color: "white",
    textAlign: "center",
    fontSize: 18
  },
  removeButton: {
    fontFamily: "Karla",
    color: "#495E57",
    textAlign: "center",
    fontSize: 18
  },
  avatarButtonGreen: {
    height: "40%",
    width: "25%",
    backgroundColor: "#495E57",
    borderRadius: 8,
    justifyContent: "center",
    
  },
  avatarButtonWhite: {
    height: "40%",
    width: "25%",
    backgroundColor: "white",
    borderRadius: 8,
    justifyContent: "center",
    borderColor: "#495E57",
    borderWidth: 1,
    marginHorizontal: "5%"
  },
  textInputArea: {
    flex: 0.25,
  },
  input: {
    backgroundColor: "gray",
    borderRadius: 4,
    width: "80%",
    marginHorizontal: "5%",
    height: "10%",
    marginBottom: "5%",
    fontFamily: "Karla"
  },
  notificationsArea: {
    flex: 0.25,
  },
  eachNotif: {
    display: "flex",
    flexDirection: "row",
    marginHorizontal: "10%",
    marginVertical: 2
  },
  switch: {
    flex: 0.3,
    alignItems: "center"
  },
  notifText: {
    flex: 0.7,
    fontWeight: "bold",
    fontSize: 18,
    fontFamily: "Karla",
    textAlign: "center"
  },
  logoutArea: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center"
  },
  logoutButton: {
    width: "80%",
    borderRadius: 8,
    backgroundColor: "#F4CE14",
    height: "50%",
    justifyContent: "center"
  },
  logoutText: {
    fontSize: 18,
    fontFamily: "Karla",
    fontWeight: "bold",
    textAlign: "center"
  },
  saveArea: {
    flex: 0.15,
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  saveButton: {
    width: "40%",
    borderRadius: 8,
    backgroundColor: "white",
    borderColor: "#495E57",
    borderWidth: 1,
    height: "50%",
    justifyContent: "center"
  },
  discardButton: {
    flex: 0.5,
    width: "40%",
    borderRadius: 8,
    backgroundColor: "#495E57",
    height: "50%",
    justifyContent: "center"
  },
  saveText: {
    fontSize: 18,
    fontFamily: "Karla",
    textAlign: "center",
    color: "#495E57"
  },
  discardText: {
    fontSize: 18,
    fontFamily: "Karla",
    textAlign: "center",
    color: "white"
  },
  emailNotifications: {
    fontSize: 18,
    fontFamily: "Karla", 
    marginHorizontal: "3%", 
    fontWeight: "bold",
    marginBottom: 15
  }
})