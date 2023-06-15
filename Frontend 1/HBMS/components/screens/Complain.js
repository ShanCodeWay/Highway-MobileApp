// Complain.js
import React, { useEffect, useState } from "react";
import {
  Button,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Clipboard,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "react-native-vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Alert } from "react-native";
import { Keyboard } from "expo";
import axios from "axios";
import Circles from "../../Data/Circles.js";
import Modal from "react-native-modal";
import ErrorModal from "../../Data/ErrorModal.js";
import SuccessModal from "../../Data/SuccessModal.js";
import * as ImagePicker from 'expo-image-picker';
import { ToastAndroid } from 'react-native';
import en from '../../locales/en.js';
import ta from '../../locales/ta.js';
import si from '../../locales/si.js';
import LottieView from 'lottie-react-native';


import { loadAsync } from "expo-font";

import * as Font from "expo-font";

export default function Complain({ navigation,route }) {
  const [emailIsValid, setEmailIsValid]                                                                                                                                                                                                                         = useState(false);
  const emailRegex                                                                                                                                                                                                                                              = /^\S+@\S+\.\S+$/;
  const [fontsLoaded, setFontsLoaded]                                                                                                                                                                                                                           = useState(false);
  const [isDarkMode, setIsDarkMode]                                                                                                                                                                                                                             = useState(false);
  const [isLoading, setIsLoading]                                                                                                                                                                                                                               = useState(false);

  const [name, setName]                                                                                                                                                                                                                                         = useState("");
  const [email, setEmail]                                                                                                                                                                                                                                       = useState("");
  const [complainType, setComplainType]                                                                                                                                                                                                                         = useState("");
  const [complain, setComplain]                                                                                                                                                                                                                                 = useState("");
  const [isErrorModalVisible, setIsErrorModalVisible]                                                                                                                                                                                                           = useState(false);

  const [successVisible, setSuccessVisible]                                                                                                                                                                                                                     = useState(false);

  const [errorVisible, setErrorVisible]                                                                                                                                                                                                                         = useState(false);
  const [errorMessage, setErrorMessage]                                                                                                                                                                                                                         = useState("");

  const [key, setKey]                                                                                                                                                                                                                                           = useState(null);
  const [language, setLanguage]                                                                                                                                                                                                                                 = useState(route.params?.selectedLanguage || 'en');
  
  const messages = {
    en,
    ta,
    si,
  };

  const currentMessages                                                                                                                                                                                                                                         = messages[language];





  const handleModalClose = () => {
    setIsErrorModalVisible(false);
    setSuccessVisible(false);
  };

  const [image, setImage]                                                                                                                                                                                                                                       = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes                                                                                                                                                                                                                                                : ImagePicker.MediaTypeOptions.Images,
      allowsEditing                                                                                                                                                                                                                                             : true,
      aspect                                                                                                                                                                                                                                                    : [4, 3],
      quality                                                                                                                                                                                                                                                   : 1,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
 
  

  const validateEmail = (email) => {
    setEmailIsValid(emailRegex.test(email));
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (route.params?.isDarkMode !== undefined) {
      setIsDarkMode(route.params.isDarkMode);
    }
  }, [route.params]);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'Poppins-Regular'                                                                                                                                                                                                                                     : require('../../assets/Fonts/Poppins-Regular.ttf'),
          'Poppins-Bold'                                                                                                                                                                                                                                        : require('../../assets/Fonts/Poppins-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.log('Error loading fonts:', error);
      }
    };
    
    loadFonts();
  }, []);
  
  

  useEffect(() => {
    navigation.setOptions({
      title                                                                                                                                                                                                                                                     : "Complain", // Set Header Title
      headerTintColor                                                                                                                                                                                                                                           : isDarkMode ? 'white' : 'darkblue',
      headerStyle: {
        backgroundColor                                                                                                                                                                                                                                         : isDarkMode ? 'grey' : 'white'
      },
      headerTitleStyle: {
        fontWeight                                                                                                                                                                                                                                              : "bold", // Set font weight of navigation bar
        fontFamily                                                                                                                                                                                                                                              : "Poppins-Bold", // Set font family of navigation bar
        fontSize                                                                                                                                                                                                                                                : language === 'en' ? 30 : 20,
      },
      headerRight                                                                                                                                                                                                                                               : () => (
        <TouchableOpacity onPress                                                                                                                                                                                                                               = {() => navigation.navigate("Home")}>
          <FontAwesome5
            name                                                                                                                                                                                                                                                = "home"
            size                                                                                                                                                                                                                                                = {25}
            color                                                                                                                                                                                                                                               = {isDarkMode ? 'white' : 'darkblue'}
            style                                                                                                                                                                                                                                               = {styles.Home_icon}
          />
        </TouchableOpacity>
      ),
      
    });
  }, [navigation,isDarkMode]);


  const handleSubmit = async () => {
    // Check if any of the fields are empty
    if (!name || !email || !complainType || !complain) {
      setErrorVisible(true);
      setErrorMessage("Please fill out all fields before submitting your complaint.");
    } else if (!validateEmail(email)) {
      setErrorVisible(true);
      setErrorMessage("Please enter a valid email address.");
    } else {
      // Set loading state to true
      setIsLoading(true);
  
      try {
        // Create a new instance of FormData
        const formData                                                                                                                                                                                                                                          = new FormData();
  
        // Append the image file to the form data
        if (image) {
          const fileExtension                                                                                                                                                                                                                                   = image.split(".").pop();
          formData.append("image", {
            uri                                                                                                                                                                                                                                                 : image,
            name                                                                                                                                                                                                                                                : `image.${fileExtension}`,
            type                                                                                                                                                                                                                                                : `image/${fileExtension}`,
          });
        }
  
        // Append the form data fields to the form data object
        formData.append("name", name);
        formData.append("email", email);
        formData.append("complainType", complainType);
        formData.append("complain", complain);
  
        // Send POST request to backend API with form data object
        axios.post("http://192.168.8.141:4000/api/data", formData, {
          headers: {
            "Content-Type"                                                                                                                                                                                                                                      : "multipart/form-data",
          },
        }).then((response) => {
            console.log(response.data);
          // Show success modal with ID
          const key                                                                                                                                                                                                                                             = response.data.uniqueKey;
          setKey(key);
          setSuccessVisible(true);
        }).catch((error) => {
          console.error(error);
          setErrorVisible(true);
          setErrorMessage('An error occurred while submitting your complaint. Please try again later.');
        });
  
        // Clear all input fields
        setName("");
        setEmail("");
        setComplainType("");
        setComplain("");
        setImage("");
  
      } catch (error) {
        setErrorVisible(true);
        setErrorMessage("An error occurred while submitting your complaint. Please try again later.");
      }
  
      // Set loading state back to false
      setIsLoading(false);
    }
  };
  
  

  return (
   
    <ScrollView contentContainerStyle                                                                                                                                                                                                                           = {styles.scrollViewContainer}>
  <SafeAreaView style                                                                                                                                                                                                                                           = {[styles.container, isDarkMode && darkStyles.container]}>
    
   
    <ErrorModal
      visible                                                                                                                                                                                                                                                   = {errorVisible}
      setVisible                                                                                                                                                                                                                                                = {setErrorVisible}
      onClose                                                                                                                                                                                                                                                   = {() => setErrorMessage("")}
      animationType                                                                                                                                                                                                                                             = "slide"
      backgroundColor                                                                                                                                                                                                                                           = "white"
      iconColor                                                                                                                                                                                                                                                 = "red"
      iconName                                                                                                                                                                                                                                                  = "close"
      iconAnimationType                                                                                                                                                                                                                                         = "shake"
      title                                                                                                                                                                                                                                                     = "Error !!!"
      message                                                                                                                                                                                                                                                   = {errorMessage}
      
    />
   <SuccessModal
  visible                                                                                                                                                                                                                                                       = {successVisible}
  setVisible                                                                                                                                                                                                                                                    = {setSuccessVisible}
  onClose                                                                                                                                                                                                                                                       = {handleModalClose}
  animationType                                                                                                                                                                                                                                                 = "slide"
  backgroundColor                                                                                                                                                                                                                                               = "white"
  iconColor                                                                                                                                                                                                                                                     = "green"
  iconName                                                                                                                                                                                                                                                      = "check-circle"
  key                                                                                                                                                                                                                                                           = {key}
  iconAnimationType                                                                                                                                                                                                                                             = "pulse"
  title                                                                                                                                                                                                                                                         = "Complaint Successfully !!!"
  message={
    <>
      <Text style                                                                                                                                                                                                                                               = {{ marginBottom: 10 }}>
        We apologize for the need to submit a complaint. Your concerns have been addressed to the Authority in the Transport. Please be assured that we will review your concerns and take the necessary action to resolve the problem. Your complaint No is    : 
      </Text>
      <TouchableOpacity
        style                                                                                                                                                                                                                                                   = {{ position: 'absolute', top: 75, right: 40 }}
        onPress={() => {
          Clipboard.setString(key);
          ToastAndroid.show("Complaint ID copied to clipboard", ToastAndroid.SHORT);
        }}
      >
        <Text style                                                                                                                                                                                                                                             = {{ fontWeight: "bold", fontSize: 34, fontStyle: 'italic', color: 'red' }}>
          {key}
        </Text>
      </TouchableOpacity>
    </>
  }
/>




    <KeyboardAvoidingView
      behavior                                                                                                                                                                                                                                                  = {Platform.OS === 'android' ? 'padding' : 'height'}
      style                                                                                                                                                                                                                                                     = {{ ...styles.formContainer, backgroundColor: isDarkMode ? 'grey' : 'white', padding: 0,  }}
    >
      <Circles />
      <View style                                                                                                                                                                                                                                               = {styles.inputContainer}>
        <Text style                                                                                                                                                                                                                                             = {[styles.label , isDarkMode && darkStyles.label]}>Name</Text>
        <TextInput
          style                                                                                                                                                                                                                                                 = {styles.input}
          placeholder                                                                                                                                                                                                                                           = "Enter your name"
          value                                                                                                                                                                                                                                                 = {name}
          onChangeText                                                                                                                                                                                                                                          = {setName}
        />
      </View>
      <View style                                                                                                                                                                                                                                               = {styles.inputContainer}>
        <Text style                                                                                                                                                                                                                                             = { [styles.label , isDarkMode && darkStyles.label]}>Email Address</Text>
        <TextInput
          style                                                                                                                                                                                                                                                 = {styles.input}
          placeholder                                                                                                                                                                                                                                           = "Enter your email address"
          value                                                                                                                                                                                                                                                 = {email}
          onChangeText                                                                                                                                                                                                                                          = {setEmail}
          keyboardType                                                                                                                                                                                                                                          = "email-address"
          autoCapitalize                                                                                                                                                                                                                                        = "none"
          autoCompleteType                                                                                                                                                                                                                                      = "email"
          textContentType                                                                                                                                                                                                                                       = "emailAddress"
        />
      </View>
      <View style                                                                                                                                                                                                                                               = {styles.inputContainer}>
              <Text style                                                                                                                                                                                                                                       = {[styles.label, isDarkMode && darkStyles.label]}>Complain Type</Text>
              <Picker
                style                                                                                                                                                                                                                                           = {[styles.dropdown, isDarkMode && darkStyles.dropdown]}
                selectedValue                                                                                                                                                                                                                                   = {complainType}
                onValueChange                                                                                                                                                                                                                                   = {setComplainType}
                dropdownIconColor                                                                                                                                                                                                                               = {isDarkMode ? 'white' : 'darkblue'}
                itemStyle                                                                                                                                                                                                                                       = {isDarkMode ? darkStyles.pickerItem : styles.pickerItem}
              >
                <Picker.Item label                                                                                                                                                                                                                              = "Complain list (please select)" value="" />
                <Picker.Item label                                                                                                                                                                                                                              = "Incorrect fare charge" value="Incorrect fare charge" />
                <Picker.Item label                                                                                                                                                                                                                              = "Attitude or behavior of staff" value="Attitude or behavior of staff" />
                <Picker.Item label                                                                                                                                                                                                                              = "Personal security" value="Personal security" />
                <Picker.Item label                                                                                                                                                                                                                              = "Reliability and punctuality" value="Reliability and punctuality" />
                <Picker.Item label                                                                                                                                                                                                                              = "Other..." value="Other..." />
              </Picker>
            </View>
      <View style                                                                                                                                                                                                                                               = {styles.inputContainer}>
  <Text style                                                                                                                                                                                                                                                   = {[styles.label , isDarkMode && darkStyles.label]}>Complain</Text>
  <View style                                                                                                                                                                                                                                                   = {{ position: 'relative' }}>
    <TextInput
      style                                                                                                                                                                                                                                                     = {[styles.input, { height: 200, textAlignVertical: 'top' }]}
      placeholder                                                                                                                                                                                                                                               = "Enter your complain here"
      numberOfLines                                                                                                                                                                                                                                             = {20}
      value                                                                                                                                                                                                                                                     = {complain}
      onChangeText                                                                                                                                                                                                                                              = {setComplain}
    />
    <View style                                                                                                                                                                                                                                                 = {{ position: 'absolute', bottom: 2, right: 10 }}>
      {image && (
        <View style                                                                                                                                                                                                                                             = {{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10 }}>
          <Image source                                                                                                                                                                                                                                         = {{ uri: image }} style={{ width: 80, height: 80, marginRight: 10 }} />
          <TouchableOpacity onPress                                                                                                                                                                                                                             = {() => setImage(null)}>
            <FontAwesome5 name                                                                                                                                                                                                                                  = "minus-circle" size={24} color="red" />
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity onPress                                                                                                                                                                                                                                 = {pickImage}>
        <FontAwesome5 name                                                                                                                                                                                                                                      = "paperclip" size={24} color="darkblue" />
      </TouchableOpacity>
    </View>
  </View>
</View>
        
      <TouchableOpacity
        style                                                                                                                                                                                                                                                   = {styles.submitButton}
        onPress                                                                                                                                                                                                                                                 = {handleSubmit}
        disabled                                                                                                                                                                                                                                                = {isLoading}
      >
        <Text style                                                                                                                                                                                                                                             = {styles.submitButtonText}>
          {isLoading ? "Submitting..."                                                                                                                                                                                                                          : "Submit"}
        </Text>
      </TouchableOpacity>
      <View style                                                                                                                                                                                                                                               = {styles.ViewButtonContainer}>
        <FontAwesome5 name                                                                                                                                                                                                                                      = "eye" size={24} color="darkblue" />
      <TouchableOpacity onPress                                                                                                                                                                                                                                 = {() => navigation.navigate("ViewComplaints", { isDarkMode,selectedLanguage: language })}>
        
        <Text style                                                                                                                                                                                                                                             = {styles.ViewButtonText}>View Complaints</Text>
      </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
   
  </SafeAreaView>
</ScrollView>

);
}

const styles = StyleSheet.create({
  container: {
    flex                                                                                                                                                                                                                                                        : 1,
    backgroundColor                                                                                                                                                                                                                                             : '#fff',
    paddingHorizontal                                                                                                                                                                                                                                           : 20,
    paddingTop                                                                                                                                                                                                                                                  : 0,
  },
  scrollViewContainer: {
    flexGrow                                                                                                                                                                                                                                                    : 0.25,
  },
  inputContainer: {
    marginBottom                                                                                                                                                                                                                                                : 20,
  },
  label: {
    fontSize                                                                                                                                                                                                                                                    : 18,
    fontWeight                                                                                                                                                                                                                                                  : 'bold',
    marginBottom                                                                                                                                                                                                                                                : 10,
    color                                                                                                                                                                                                                                                       : 'darkblue',
  },
  input: {
    borderWidth                                                                                                                                                                                                                                                 : 1,
    borderColor                                                                                                                                                                                                                                                 : 'darkblue',
    borderRadius                                                                                                                                                                                                                                                : 10,
    fontSize                                                                                                                                                                                                                                                    : 16,
    padding                                                                                                                                                                                                                                                     : 10,
    alignContent                                                                                                                                                                                                                                                : 'center',
  },
  dropdown: {
    borderWidth                                                                                                                                                                                                                                                 : 2,
    borderColor                                                                                                                                                                                                                                                 : 'darkblue',
    borderRadius                                                                                                                                                                                                                                                : 10,
    fontSize                                                                                                                                                                                                                                                    : 16,
    padding                                                                                                                                                                                                                                                     : 10,
    height                                                                                                                                                                                                                                                      : 50,
    backgroundColor                                                                                                                                                                                                                                             : '#bef',
    
     // Change the background color of the Picker component here
  },
  pickerItem: {
    color                                                                                                                                                                                                                                                       : 'darkblue',
    backgroundColor                                                                                                                                                                                                                                             : '#bef', // Change the color of the drop-down menu items here
  },
  submitButton: {
    backgroundColor                                                                                                                                                                                                                                             : 'darkblue',
    borderRadius                                                                                                                                                                                                                                                : 10,
    paddingVertical                                                                                                                                                                                                                                             : 10,
    paddingHorizontal                                                                                                                                                                                                                                           : 20,
    alignItems                                                                                                                                                                                                                                                  : 'center',
    marginBottom                                                                                                                                                                                                                                                : 2,
  },
  submitButtonText: {
    fontFamily                                                                                                                                                                                                                                                  : 'Poppins-Bold',
    color                                                                                                                                                                                                                                                       : '#fff',
    fontSize                                                                                                                                                                                                                                                    : 18,
  },
  Home_icon: {
    marginRight                                                                                                                                                                                                                                                 : 2,
  },
  formContainer: {
    flex                                                                                                                                                                                                                                                        : 1,
    justifyContent                                                                                                                                                                                                                                              : 'center',
  },
  ViewButtonText: {
   
    color                                                                                                                                                                                                                                                       : 'darkblue',
    fontSize                                                                                                                                                                                                                                                    : 18,
    textDecorationLine                                                                                                                                                                                                                                          : 'underline',
  },
  ViewButtonContainer: {
    flexDirection                                                                                                                                                                                                                                               : 'row',
    justifyContent                                                                                                                                                                                                                                              : 'flex-start',
    alignItems                                                                                                                                                                                                                                                  : 'flex-start',
    marginTop                                                                                                                                                                                                                                                   : 5,
  }
  
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor                                                                                                                                                                                                                                             : '#333333',
    opacity                                                                                                                                                                                                                                                     : 0.6,
    // other dark styles...
  },
  label: {
    fontSize                                                                                                                                                                                                                                                    : 18,
    fontWeight                                                                                                                                                                                                                                                  : 'bold',
    marginBottom                                                                                                                                                                                                                                                : 10,
    color                                                                                                                                                                                                                                                       : 'white',
  },

  dropdown: {
    borderWidth                                                                                                                                                                                                                                                 : 2,
    borderColor                                                                                                                                                                                                                                                 : 'darkblue',
    borderRadius                                                                                                                                                                                                                                                : 10,
    fontSize                                                                                                                                                                                                                                                    : 16,
    padding                                                                                                                                                                                                                                                     : 10,
    height                                                                                                                                                                                                                                                      : 50,
    backgroundColor                                                                                                                                                                                                                                             : 'grey', // Change the background color of the Picker component in dark mode here
  },
  pickerItem: {
    color                                                                                                                                                                                                                                                       : 'white', // Change the color of the drop-down menu items in dark mode here
  },
});