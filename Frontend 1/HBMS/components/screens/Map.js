import React, { useEffect, useState } from "react";
import { Button, View, Text, TouchableOpacity, StyleSheet, Linking ,route} from "react-native";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from 'react-native-vector-icons';
import * as Font from 'expo-font';
import MapView from 'react-native-maps';
import en from '../../locales/en.js';
import ta from '../../locales/ta.js';
import si from '../../locales/si.js';


export default function Map({ navigation,route }) {
 
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [language, setLanguage] = useState(route.params?.selectedLanguage || 'en');
  
  const messages = {
    en,
    ta,
    si,
  };

  const currentMessages = messages[language];

  const [region, setRegion] = useState({
    latitude: 6.584748,
    longitude: 80.1996578,
    latitudeDelta: 0.0089,
    longitudeDelta: 0.9098,
  });

  useEffect(() => {
    if (route.params?.isDarkMode !== undefined) {
      setIsDarkMode(route.params.isDarkMode);
    }
  }, [route.params]);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Poppins-Regular': require('../../assets/Fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../..//assets/Fonts/Poppins-Bold.ttf'),
      });
    }

    loadFonts();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title:currentMessages.contact, // Set Header Title
      headerTintColor: isDarkMode ? 'white' : 'darkblue',
      headerStyle: {
        backgroundColor: isDarkMode ? 'grey' : 'white'
      },
      headerTitleStyle: {
        fontWeight: 'bold', // Set font weight of navigation bar
        fontFamily: 'Poppins-Regular',
        fontSize: language === 'en' ? 30 : 20,
      },
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <FontAwesome5 name="home" size={25} color={ isDarkMode? 'white' : "darkblue"} style={styles.icon} />
        </TouchableOpacity>
      ),
    });
  }, [navigation,isDarkMode,currentMessages]);

  const handleEmergencyCall = () => {
    Linking.openURL('tel: 1969');
  }

  return (
    <SafeAreaView style={[styles.container,isDarkMode && darkStyles.container]}>
      <MapView
        style={styles.map}
        initialRegion={region}
        scrollEnabled={true}
      />

      <View style={styles.overlay}>
      
        <TouchableOpacity onPress={() => handleEmergencyCall('1969')} style={styles.emergencyButton}>
          <FontAwesome5 name="phone" size={25} color="white" style={styles.emergencyIcon} />
          <Text style={styles.emergencyText}>{currentMessages.expresswayhot}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  icon: {
    marginRight: 10,
  },
  text1: {
    flex: 0,
    backgroundColor: '#fff',
    justifyContent: 'center',
    fontSize: 30,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderBottomColor: '#ccc',
  },
  overlay: {
    position: 'absolute',
    bottom: 30,
    right: 26,
  },
  emergencyButton: {
    flexDirection: 'row',
    backgroundColor: 'red',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyIcon: {
    marginRight: 8,
  },
  emergencyText: {color: 'white',
  fontSize: 20,
  fontWeight: 'bold',
},
emergencyIcon: {
marginRight: 10,
},
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#333333',
    // other dark styles...
  },
});
