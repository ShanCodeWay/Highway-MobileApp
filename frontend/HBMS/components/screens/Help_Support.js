import React, { useEffect, useState } from "react";
import { Button, View, Text,TouchableOpacity,StyleSheet, Modal, Image, FlatList} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from 'react-native-vector-icons';
import { Linking } from 'react-native';
import Circles  from '../../Data/Circles.js';
import * as Font from 'expo-font';
import en from '../../locales/en.js';
import ta from '../../locales/ta.js';
import si from '../../locales/si.js';



export default function Help_Support({ navigation,route }) {
  const [dateTime, setDateTime]         = useState(new Date());
  const []                              = useState(false);
  const [fontsLoaded, setFontsLoaded]   = useState(false);
  const [isDarkMode, setIsDarkMode]     = useState(false);

  const [language, setLanguage]         = useState(route.params?.selectedLanguage || 'en');
  
  const messages = {
    en,
    ta,
    si,
  };

  const currentMessages                 = messages[language];

  const handleCallPress = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  useEffect(() => {
    if (route.params?.isDarkMode !== undefined) {
      setIsDarkMode(route.params.isDarkMode);
    }
  }, [route.params]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Poppins-Regular'               : require('../../assets/Fonts/Poppins-Regular.ttf'),
        'Poppins-Bold'                  : require('../../assets/Fonts/Poppins-Bold.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title                             : currentMessages.help,
      headerTintColor                   : isDarkMode ? 'white' : 'darkblue',
      headerStyle: {
        backgroundColor                 : isDarkMode ? 'grey' : 'white'
      },
      headerTitleStyle: {
        fontWeight                      : 'bold',
        fontFamily                      : 'Poppins-Bold',
        fontSize                        : language === 'en' ? 30 : 20,
      },
      headerRight                       : () => (
        <TouchableOpacity onPress       = {() => navigation.navigate("Home")}>
          <FontAwesome5 name            = "home" size={25} color={ isDarkMode? 'white' : "darkblue"} style={styles.icon} />
        </TouchableOpacity>
      ),
      
    });
  }, [navigation,isDarkMode]);


  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style                 = {[styles.container,isDarkMode && darkStyles.container]}>
      
      <View style                       = {[styles.dateTimeContainer, isDarkMode && darkStyles.dateTimeContainer ]}>
        <Text style                     = {[styles.dateTime,isDarkMode && darkStyles.dateTime ]}>{dateTime.toLocaleString()}</Text>
      </View>
      <Circles /> 
    <View style                         = {styles.modalContainer}>
      
      <View style                       = {styles.modalContent}>
        
        <Image source                   = {require('../../assets/help.png')} style={styles.modalImage} />
        
        <Text style                     = {styles.modalTitle}>How can we help?</Text>
        <View style                     = {styles.gridContainer}>
          <TouchableOpacity style       = {styles.gridItem}>
            <Icon name                  = "users" size={30} color="darkblue" />
            <Text style                 = {styles.gridItemText}>Ask Community</Text>
          </TouchableOpacity>
          <TouchableOpacity style       = {styles.gridItem} onPress={() => navigation.navigate('Faq')}>
            <Icon name                  = "question-circle" size={30} color="darkblue" />
            <Text style                 = {styles.gridItemText}>FAQ</Text>
          </TouchableOpacity>
          <TouchableOpacity style       = {styles.gridItem}
             onPress                    = {() => Linking.openURL('mailto:wijebahuwmpwdgb.20@uom.lk')}>
            <Icon name                  = "envelope" size={30} color="darkblue" />
            <Text style                 = {styles.gridItemText}>Email Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style       = {styles.gridItem} onPress={() => handleCallPress('071145457')}>
           <Icon name                   = "phone" size={30} color="darkblue" />
          <Text style                   = {styles.gridItemText}>Voice Agent</Text>
          </TouchableOpacity>
          <TouchableOpacity style       = {styles.gridItem}>
            <Icon name                  = "comment" size={30} color="darkblue" />
            <Text style                 = {styles.gridItemText}>Messenger</Text>
          </TouchableOpacity>
          <TouchableOpacity style       = {styles.gridItem}>
            <Icon name                  = "whatsapp" size={30} color="darkblue" />
            <Text style                 = {styles.gridItemText}>Whatsapp</Text>
          </TouchableOpacity>
          <TouchableOpacity style       = {styles.gridItem} onPress={() => navigation.navigate('Complain')}>
            <Icon name                  = "exclamation-triangle" size={30} color="darkblue" />
            <Text style                 = {styles.gridItemText}>Complaints</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style         = {styles.visitButton}>
          <Text style                   = {styles.visitButtonText}>Visit Our Website</Text>
        </TouchableOpacity>
      </View>
      
    </View>
    
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex                                : 1,
    alignItems                          : "center",
    backgroundColor                     : "#F5F5F5",
  },
  dateContainer: {
    flexDirection                       : "row",
    alignItems                          : "center",
    justifyContent                      : "center",
    marginVertical                      : 0,
  },
  dateText: {
    fontFamily                          : "Poppins-Regular",
    fontWeight                          : "bold",
    fontSize                            : 16,
    color                               : "darkblue",
    marginRight                         : 10,
    marginBottom                        : 51,
  },
  modalContainer: {
    paddingTop                          : 50,
    flex                                : 1,
    alignItems                          : "center",
    justifyContent                      : "center",
  },
  modalView: {
    backgroundColor                     : "white",
    borderRadius                        : 10,
    padding                             : 20,
    alignItems                          : "center",
    justifyContent                      : "center",
    elevation                           : 5,
  },
  modalTitle: {
    fontFamily                          : "Poppins-Bold",
    fontSize                            : 20,
    marginBottom                        : 10,
    marginLeft                          : 20,
  },
  modalText: {
    fontFamily                          : "Poppins-Regular",
    fontSize                            : 16,
    marginBottom                        : 20,
  },
  modalImage: {
    width                               : 250,
    height                              : 150,
    marginBottom                        : 20,
    alignItems                          : 'center',
    justifyContent                      : 'center',
    alignSelf                           : 'center',
    borderRadius                        : 10,
    shadowColor                         : '#000',
    shadowOffset                        : { width: 0, height: 2 },
    shadowOpacity                       : 0.25,
    shadowRadius                        : 3.84,
    
  },
  gridContainer: {
    flexDirection                       : "row",
    flexWrap                            : "wrap",
    justifyContent                      : "space-evenly",
    marginBottom                        : 20,
  },
  gridItem: {
    alignItems                          : "center",
    justifyContent                      : "center",
    width                               : 100,
    height                              : 100,
    margin                              : 10,
    borderRadius                        : 10,
    backgroundColor                     : "#F0F0F0",
    elevation                           : 5,
  },
  gridItemText: {
    fontFamily                          : "Poppins-Regular",
    alignItems                          : "center",
    fontSize                            : 16,
    color                               : "#666",
  },
  modalButton: {
    backgroundColor                     : "#1E90FF",
    borderRadius                        : 10,
    padding                             : 10,
    elevation                           : 2,
    marginBottom                        : 20,
    width                               : "80%",
  },
  modalButtonText: {
    fontFamily                          : "Poppins-Bold",
    fontSize                            : 18,
    color                               : "white",
    textAlign                           : "center",
  },
  elevateButton: {
    backgroundColor                     : "white",
    borderRadius                        : 10,
    padding                             : 10,
    elevation                           : 5,
    marginBottom                        : 20,
    width                               : "80%",
  },
  elevateButtonText: {
    fontFamily                          : "Poppins-Bold",
    fontSize                            : 18,
    color                               : "black",
    textAlign                           : "center",
  },
  icon: {
    marginRight                         : 10,
  },
  dateTimeContainer: {
    position                            : 'absolute',
    top                                 : 10,
    left                                : 20,
  },
  dateTime: {
    fontSize                            : 15,
    color                               : "darkblue",
  },
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor                     : '#333333',
    opacity                             : 0.6,
   
  },
  dateTimeContainer: {
    position                            : 'absolute',
    top                                 : 10,
    left                                : 20,
  },
  dateTime: {
    fontSize                            : 15,
    color                               : "white",
  },
  
});