import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import HomeScreen from "./components/screens/HomeScreen";
import Contact from "./components/screens/Contact";
import Map from "./components/screens/Map";
import Complain from "./components/screens/Complain";
import HelpSupport from "./components/screens/Help_Support";
import ViewComplaints from "./components/screens/ViewComplaints";
import LottieView from "lottie-react-native";
import Faq from "./components/screens/Faq";
import * as Font from "expo-font";

const Stack                     = createNativeStackNavigator();

function SplashScreen() {
  const styles = StyleSheet.create({
    container: {
      flex                      : 1,
      alignItems                : "center",
      justifyContent            : "center",
    },
  });

  return (
    <View style                 = {styles.container}>
      <LottieView
        style                   = {styles.container}
        source                  = {require("./assets/bus_refresh.json")}
        autoPlay
        loop                    = {false}
        onAnimationFinish={() => {
          console.log("Animation finished!");
        }}
      />
    </View>
  );
}

async function loadFonts() {
  await Font.loadAsync({
    // load your fonts here
  });
}

export default function App() {
  const [loading, setLoading]   = React.useState(true);

  useEffect(() => {
    loadFonts().then(() => {
      setTimeout(() => {
        setLoading(false);
      }, 5000); // replace with your desired duration for the splash screen
    });
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name      = "Home" component={HomeScreen} />
        <Stack.Screen name      = "Map" component={Map} />
        <Stack.Screen name      = "Contact" component={Contact} />
        <Stack.Screen name      = "Help_Support" component={HelpSupport} />
        <Stack.Screen name      = "Complain" component={Complain} />
        <Stack.Screen name      = "Faq" component={Faq} />
        <Stack.Screen name      = "ViewComplaints" component={ViewComplaints} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
