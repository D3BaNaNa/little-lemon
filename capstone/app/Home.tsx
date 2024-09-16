import { Text, View, Image, Pressable, StyleSheet, TextInput, FlatList } from "react-native";
import { useState, useEffect } from "react"

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PreventRemoveContext } from "@react-navigation/native";
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('little_lemon');

export default function Home({navigation}: {navigation: any}) {
  const [avatar, setAvatar] = useState<any>()
  const [searchText, setSearchText] = useState("")
  const [starters, setStarters] = useState(true)
  const [mains, setMains] = useState(true)
  const [desserts, setDesserts] = useState(true)
  const [drinks, setDrinks] = useState(true)

  const [fetched, setFetched] = useState(false)
  const [menuData, setMenuData] = useState<any>()
  const [menuImages, setMenuImages] = useState<any>({
    "greekSalad.jpg": require("../assets/img/greekSalad.jpg"),
    "bruschetta.jpg": require("../assets/img/bruschetta.jpg"),
    "grilledFish.jpg": require("../assets/img/grilledFish.jpg"),
    "pasta.jpg": require("../assets/img/pasta.jpg"),
    "lemonDessert.jpg": require("../assets/img/lemonDessert.jpg")
  })
  const [shownMenu, setShownMenu] = useState<any>()

  
  const getAvatar = async () => {
    setAvatar(String(await AsyncStorage.getItem("avatar")))
  }

  const getMenuData = async () => {
    const URL_PATH = 
    `https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json`

    setFetched(await AsyncStorage.getItem("fetched") === "yes")

    if (!fetched) { // CHANGE TO !fetched
      try { 
        const response = await fetch(URL_PATH);
        const json = await response.json();
        setMenuData(json["menu"])
        const tempMenuData = json["menu"]


        let sql = "create table if not exists menuitems (title text, price text,"
       db.execSync(
           sql + "description text, image text, category text);"
        );

        let values = ``;

        for (const item of tempMenuData) {
          values += `("${item.name}", "$${item.price}", "${item.description}", "${item.image}", "${item.category}")`
          item.name === "Lemon Dessert" ? values += ";" : values += ", "
          
        }

        db.execSync(`INSERT INTO menuitems (title, price, description, image, category)
          VALUES ${values}`)
        
      } catch (error) {
        console.error(error);
  
       } finally {
        // await AsyncStorage.setItem("fetched", "yes")
       }

    } else {
      try {
        const allRows = db.getAllSync('SELECT * FROM menuitems');
        setMenuData(allRows)

      } catch (e) { console.error(e) }


    }
  }

  

  useEffect(() => {
    getAvatar();
    getMenuData();
    // const func = async () => {
    //   try {
    //     let newDict = menuImages
    //     for (const row of menuData) {
    //       let url = `https://github.com/Meta-Mobile-Developer-PC/`
    //       newDict[row.image] = await fetch(
    //         url += `Working-With-Data-API/blob/main/images/${row.image}?raw=true`
    //       )
    //     }
    //   } catch (e) { console.error(e) }
      
    // }
    // func();
  }, [])

  useEffect(() => {
    setShownMenu([])
    let updated: any = [];
    let updatedTwo = [];
    let selCategories = [];

    if (menuData !== undefined) {
      if (mains) { selCategories.push("mains") }
      if (desserts) { selCategories.push("desserts") }
      if (drinks) { selCategories.push("drinks") }
      if (starters) { selCategories.push("starters") }


      for (const element of menuData) {
        if (selCategories.includes(element.category)) {
          updated.push(element)
        }

      }

      for (const element of updated) {
        if (element.name.toLowerCase().includes(searchText.toLowerCase())) {
          updatedTwo.push(element)
        }
      }
      }
      
    setShownMenu(updatedTwo)

  }, [starters, mains, desserts, drinks, searchText, menuData])

  setInterval(getAvatar, 250)

  const [fontsLoaded] = useFonts({
    Markazi: require('../assets/fonts/MarkaziText-Regular.ttf'),
    Karla: require('../assets/fonts/Karla-Regular.ttf')
  });

  // useEffect(() => {
  //   let newStyleState = [[{}, {}], [{}, {}], [{}, {}], [{}, {}]]
  //   for (let i = 0; i < 4; i++) {
  //     newStyleState[i][0] = categories[i] 
  //       ? categoryButtonOn : categoryButtonOff

  //       newStyleState[i][1] = categories[i] 
  //       ? buttonTextOn : buttonTextOff
  //   }

  //   console.log("yap")
  //   setCatStyles(newStyleState)
  // }, [categories])


  let img = avatar === "null" 
  ? <Image source={require("../assets/img/defaulticon.png")} style={styles.avatar} 
  resizeMode="stretch" />
  : <Image source={{ uri: avatar }} style={styles.avatar}
  resizeMode="stretch" />


  const Item = (props: any) => {
    const img = props.image;
    // console.log(img);

    const path = "../assets/img/" + img
    // console.log(path)
    return (
      <View style={styles.itemArea}>
        <View style={styles.itemTextArea}>
          <Text style={styles.itemTitleText}>{props.title}</Text>
          <Text style={styles.itemDescText}>{props.desc}</Text>
          <Text style={styles.itemTitleText}>${props.price}</Text>
        </View>

        <View style={styles.itemImageArea}>
          <Image source={menuImages[img]} 
          style={styles.menuImage}
          resizeMode="cover" />
        </View>
    </View>
    )
    
  }

  const renderItem = (props: any) => {
  return (
    <Item 
    title={props.item.name} 
    image={props.item.image}
    desc={props.item.description} 
    price={props.item.price}
    />
  )
  
}


  return (
    <View style={{flex: 1}}>
      <View style={styles.homeHeaderContainer}>
      <Image source={require("../assets/img/Logo.png")}></Image>
      <Pressable onPress={() => {navigation.navigate("Profile")}} style={styles.profileButton}>
        {img}
      </Pressable>
      
      </View>
      
      <View style={styles.heroContainer}>
        <View style={styles.miniHeroContainer}>
          <View style={styles.heroText}>
            <Text style={styles.littleLemonText}>Little Lemon</Text>
            <Text style={styles.subheading}>Chicago</Text>
            <Text style={styles.restaurantDescText}>
              We are a family-owned Mediterranean restaurant focused
              on traditional recipes served with a modern twist.
            </Text>
          </View>

          <View style={styles.heroImageArea}>
          <Image source={require("../assets/img/Hero image.png")} 
          resizeMode="contain" style={styles.heroImage}
          />
          </View>
        </View>

        <View style={styles.searchArea}>
          <Ionicons name="search" size={24}color="black" />
          <TextInput 
            style={styles.input}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search for a menu item..."
            keyboardType="default"
          />
        </View>
        
      </View>

      


      <View style={styles.categoryButtonsArea}>
        <Text style={styles.orderDelivery}>ORDER FOR DELIVERY!</Text>
        <View style={styles.categoryButtonsContainer}>
          <Pressable style={starters ? styles.categoryButtonOff : styles.categoryButtonOn} 
          onPress={() => {setStarters(prev => !prev)}}>
            <Text style={starters ? styles.buttonTextOff : styles.buttonTextOn}>Starters</Text>
          </Pressable>

          <Pressable style={mains ? styles.categoryButtonOff : styles.categoryButtonOn} 
          onPress={() => {setMains(prev => !prev)}}>
            <Text style={mains ? styles.buttonTextOff : styles.buttonTextOn}>Mains</Text>
          </Pressable>

          <Pressable style={desserts ? styles.categoryButtonOff : styles.categoryButtonOn} 
          onPress={() => {setDesserts(prev => !prev)}}>
            <Text style={desserts ? styles.buttonTextOff : styles.buttonTextOn}>Desserts</Text>
          </Pressable>

          <Pressable style={drinks ? styles.categoryButtonOff : styles.categoryButtonOn} 
          onPress={() => {setDrinks(prev => !prev)}}>
            <Text style={drinks ? styles.buttonTextOff : styles.buttonTextOn}>Drinks</Text>
          </Pressable>

          
        </View>
      </View>

    <View style={styles.menuArea}>
      <FlatList 
        renderItem={renderItem}
        data={shownMenu}
        contentContainerStyle={styles.flatList}
      />
    </View>


    </View>
  );
}

const styles = StyleSheet.create({
  homeHeaderContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "10%"
  },
  profileButton: {
    flex: 0.3
  },
  avatar: {
    height: "80%",
    width: "100%",
    borderRadius: 20,
    margin: 10
  },
  heroContainer: {
    flex: 0.4,
    backgroundColor: "#495E57",
    flexDirection: "column"
  },
  miniHeroContainer: {
    flexDirection: "row",
    height: "85%"
  },
  heroText: {
    flex: 0.6,
  },
  heroImageArea: {
    flex: 0.4,
    alignContent: "center",
    justifyContent: "center",
  },
  heroImage: {
    height: "60%",
    width: "80%",
    borderRadius: 40
  },
  littleLemonText: {
    fontSize: 40,
    color: "#F4CE14",
    fontFamily: "Markazi",
    marginHorizontal: "3%",
    marginBottom: 0
  },
  subheading: {
    fontSize: 28,
    color: "white",
    fontFamily: "Markazi",
    marginHorizontal: "3%",
    marginTop: 0,
    marginBottom: "10%"
  },
  restaurantDescText: {
    fontSize: 15,
    color: "white",
    fontFamily: "Karla",
    marginHorizontal: "3%",
    width: "80%"
  },
  searchArea: {
    height: "15%",
    marginHorizontal: "3%",
    flexDirection: "row",
    alignItems: "center"
  },
  input: {
    backgroundColor: "white",
    color: "black",
    borderRadius: 2,
    height: "60%",
    width: "90%",
    marginHorizontal: "3%",
    padding: "1%",
  },
  categoryButtonsArea: {
    flex: 0.15,
    flexDirection: "column",
    borderBottomColor: "black",
    borderBottomWidth: 2,
    paddingBottom: "3%"
  },
  categoryButtonsContainer: {
    height: "50%",
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  orderDelivery: {
    fontSize: 24,
    fontFamily: "Karla",
    fontWeight: "bold",
    marginHorizontal: "3%",
    marginVertical: "3%"
  },
  categoryButtonOn: {
    width: "23%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "gray"
  },
  categoryButtonOff: {
    width: "23%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  buttonTextOn: {
    fontSize: 16,
    fontFamily: "Karla",
    fontWeight: "bold",
    marginHorizontal: "3%",
    marginVertical: "3%",
    color: "white"
  },
  buttonTextOff: {
    fontSize: 16,
    fontFamily: "Karla",
    fontWeight: "bold",
    marginHorizontal: "3%",
    marginVertical: "3%",
    color: "#495E57"
  },
  menuArea: {
    flexDirection: "column",
    flex: 0.3
  },
  itemArea: {
    flexDirection: "row",
    borderBottomWidth: 1,
    flex: 0.5,
    justifyContent: "center",
  },
  itemTextArea: {
    flex: 0.6,
    flexDirection: "column",
    justifyContent: "center",
  },
  itemImageArea: {
    flex: 0.4,
    flexDirection: "column",
    justifyContent: "center"
  },
  itemTitleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    fontFamily: "Karla",
    marginHorizontal: "3%",
    paddingTop: "1%"
  },
  itemDescText: {
    fontSize: 15,
    fontFamily: "Karla",
    color: "dark gray",
    marginHorizontal: "3%",
    maxHeight: "50%"
  },
  menuImage: {
    height: "80%",
    width: "80%",
    borderRadius: 4
  },
  flatList: {
    flexDirection: "column",
  }
  
})