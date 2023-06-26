import React, { useEffect, useState } from "react";
import { Button, View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, Platform, Linking, Clipboard } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from 'react-native-vector-icons';
import Circles from '../../Data/Circles.js';
import * as Font from 'expo-font';
import { TouchableWithoutFeedback } from 'react-native';
import en from '../../locales/en.js';
import ta from '../../locales/ta.js';
import si from '../../locales/si.js';
import BubbleContainer from "../../Data/bubbles/BubbleContainer.js";
import axios from 'axios'; 

export default function Contact({ navigation, route }) {
  const [modalVisible, setModalVisible]                 = useState(false);
  const [selectedPhoneNumber, setSelectedPhoneNumber]   = useState('');
  const [selectedContact, setSelectedContact]           = useState('');
  const [selectedLatitude, setSelectedLatitude]         = useState('');
  const [selectedLongitude, setSelectedLongitude]       = useState('');
  const [isDarkMode, setIsDarkMode]                     = useState(false);
  const [language, setLanguage]                         = useState(route.params?.selectedLanguage || 'en');
  const messages = {
    en,
    ta,
    si,
  };
  const currentMessages                                 = messages[language];

  const [contacts, setContacts]                         = useState([]);

  useEffect(() => {
    if (route.params?.isDarkMode !== undefined) {
      setIsDarkMode(route.params.isDarkMode);
    }
  }, [route.params]);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Poppins-Regular'                               : require('../../assets/Fonts/Poppins-Regular.ttf'),
        'Poppins-Bold'                                  : require('../../assets/Fonts/Poppins-Bold.ttf'),
      });
    }

    loadFonts();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title                                             : currentMessages.allcontact,
      headerTintColor                                   : isDarkMode ? 'white' : 'darkblue',
      headerStyle: {
        backgroundColor                                 : isDarkMode ? 'grey' : 'white'
      },
      headerTitleStyle: {
        fontWeight                                      : 'bold',
        fontFamily                                      : 'Poppins-Bold',
        fontSize                                        : language === 'en' ? 30 : 20,
      },
      headerRight                                       : () => (
        <TouchableOpacity onPress                       = {() => navigation.navigate("Home")}>
          <FontAwesome name                             = "home" size={25} color={isDarkMode ? 'white' : "darkblue"} style={styles.icon} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isDarkMode, currentMessages, language]);

  const toggleModal = (item) => {
    setSelectedPhoneNumber(item.phone);
    setSelectedContact(item.name);
    setSelectedLatitude(item.latitude);
    setSelectedLongitude(item.longitude);
    setModalVisible(!modalVisible);
  };

  const handleCopyPress = (phoneNumber) => {
    Clipboard.setString(phoneNumber);
    setModalVisible(false);
  };

  const handleCallPress = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleLocationPress = (latitude, longitude) => {
    const url                                           = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  useEffect(() => {
    let url;
    if (language === 'si') {
      url                                               = 'http://192.168.8.141:4000/api/sicontacts';
    } else if (language === 'ta') {
      url                                               = 'http://192.168.8.141:4000/api/tacontacts';
    } else {
      url                                               = 'http://192.168.8.141:4000/api/encontacts';
    }

    axios.get(url)
      .then(response => {
        setContacts(response.data);
      })
      .catch(error => {
        console.log('Error fetching contacts:', error);
      });
  }, [language]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style                           = {styles.contactContainer} onPress={() => toggleModal(item)}>
        <Text style                                     = {[styles.contactName, isDarkMode && darkStyles.contactName]}>{item.name}</Text>
        <Text style                                     = {[styles.contactPhone, isDarkMode && darkStyles.contactPhone]}>{item.phone}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style                                 = {[styles.container, isDarkMode && darkStyles.container]} onPress={() => setModalVisible(false)}>
      <Circles />
      <FlatList
        data                                            = {contacts}
        renderItem                                      = {renderItem}
        keyExtractor                                    = {(item) => item.id}
      />

      <Modal
        visible                                         = {modalVisible}
        animationType                                   = "slide"
        transparent                                     = {true}
        onRequestClose                                  = {() => setModalVisible(false)}
      >
        <BubbleContainer />
        <TouchableWithoutFeedback onPress               = {() => setModalVisible(false)}>
          <View style                                   = {styles.modalContainer}>
            <View style                                 = {styles.circlesContainer}></View>
            <Text style                                 = {styles.modalTitle}>{selectedContact}</Text>
            <BubbleContainer />
            <Text style                                 = {styles.modalPhone}>{selectedPhoneNumber}</Text>
            <View style                                 = {styles.modalButtonsContainer}>
              <BubbleContainer />
              <TouchableOpacity style                   = {styles.modalButton} onPress={() => handleCallPress(selectedPhoneNumber)}>
                <FontAwesome name                       = "phone" size={25} color="white" />
                <Text style                             = {styles.modalButtonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style                   = {styles.modalButton} onPress={() => handleCopyPress(selectedPhoneNumber)}>
                <FontAwesome name                       = "copy" size={25} color="white" />
                <Text style                             = {styles.modalButtonText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity style                   = {styles.modalButton} onPress={() => handleLocationPress(selectedLatitude, selectedLongitude)}>
                <FontAwesome name                       = "location-arrow" size={25} color="white" style={styles.locationIcon} />
                <Text style                             = {styles.modalButtonText}>View on map</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}
        
        const styles = StyleSheet.create({
          container: {
            flex                                        : 1,
            backgroundColor                             : '#fff',
            flexDirection                               : 'row',
          },
          contactContainer: {
            padding                                     : 10,
            borderBottomWidth                           : 2,
            borderBottomColor                           : '#ddd',
            flexDirection                               : 'row',
            justifyContent                              : 'space-between',
            alignItems                                  : 'center',
            paddingHorizontal                           : 30,
          },
          contactName: {
            fontSize                                    : 18,
            fontWeight                                  : 'bold',
            fontFamily                                  : 'Poppins-Bold',
            marginBottom                                : 5,
          },
          contactPhone: {
            fontSize                                    : 16,
            fontFamily                                  : 'Poppins-Regular',
            color                                       : '#555',
          },
          modalContainer: {
            justifyContent                              : 'center',
            alignItems                                  : 'center',
            borderRadius                                : 20,
            backgroundColor                             : 'white',
            borderWidth                                 : 2,
            paddingHorizontal                           : 5,
            paddingVertical                             : 5,
            position                                    : 'absolute',
            top                                         : '30%',
            left                                        : '5%',
            borderColor                                 : '#ddd',
            shadowColor                                 : '#000',
            shadowOffset: {
              width                                     : 0,
              height                                    : 3,
              
            },
            shadowOpacity                               : 0.29,
            shadowRadius                                : 4.65,
            elevation                                   : 7,
            justifyContent                              : 'space-evenly',
          },
          modalTitle: {
            fontSize                                    : 30,
            fontWeight                                  : 'bold',
            fontFamily                                  : 'Poppins-Bold',
            color                                       : '#444',
            marginBottom                                : 20,
            flexDirection                               : 'row',
            alignItems                                  : 'center',
          },
          circlesContainer: {
            position                                    : 'absolute',
            top                                         : 0,
            bottom                                      : 0,
            left                                        : 0,
            right                                       : 0,
            justifyContent                              : 'center',
            alignItems                                  : 'center',
          },
          circle: {
            width                                       : 80,
            height                                      : 80,
            borderRadius                                : 40,
            backgroundColor                             : 'lightblue',
            position                                    : 'absolute',
            top                                         : '50%',
            transform                                   : [{ translateY: -40 }],
          },
          locationIcon: {
            marginRight                                 : 10,
          },
          locationButton: {
            backgroundColor                             : '#4a90e2',
            flexDirection                               : 'column',
            justifyContent                              : 'center',
            alignItems                                  : 'center',
            borderRadius                                : 10,
            paddingHorizontal                           : 20,
            paddingVertical                             : 10,
            marginTop                                   : 20,
          },
          modalPhone: {
            fontSize                                    : 28,
            fontFamily                                  : 'Poppins-Regular',
            fontWeight                                  : 'bold',
            color                                       : '#777',
            marginBottom                                : 20,
          },
          modalButtonsContainer: {
            flexDirection                               : 'row',
            justifyContent                              : 'space-between',
            paddingVertical                             : 5,
            justifyContent                              : 'space-between',
          },
          modalButton: {
            
            backgroundColor                             : '#4a90e2',
            padding                                     : 10,
            borderRadius                                : 20,
            alignItems                                  : 'center',
            width                                       : '28%',
            marginHorizontal                            : 2,
            elevation                                   : 5,
          },
          modalButtonText: {
            backgroundColor                             : '#4a90e2',
            color                                       : '#fff',
            fontFamily                                  : 'Poppins-Regular',
            fontSize                                    : 16,
            marginTop                                   : 5,
            alignItems                                  : 'center',
          },
          
          icon: {
            marginRight                                 : 20,
          },
        });
        
        const darkStyles = StyleSheet.create({
          container: {
            backgroundColor                             : '#333333',
            opacity                                     : 0.9,
            
          },
          contactName: {
            color                                       : '#fff',
          },
          contactPhone: {
            color                                       : '#fff',
          }
        });