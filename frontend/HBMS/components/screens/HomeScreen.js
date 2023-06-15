import React, {useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Animated, Easing, PanResponder, Switch,Button } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';

import { SafeAreaView } from 'react-native-safe-area-context';
import Circles  from '../../Data/Circles.js';
import { useColorScheme } from 'react-native';


import * as Font from 'expo-font';
import en from '../../locales/en.js';
import ta from '../../locales/ta.js';
import si from '../../locales/si.js';










const HomeScreen = ({ navigation, }) => {
  
  

  const [fontsLoaded, setFontsLoaded]                   = useState(false);
  const [buttonIndex, setButtonIndex]                   = useState(0);
  const opacityValue                                    = useRef(new Animated.Value(0)).current;
  const [isDrawerOpen, setIsDrawerOpen]                 = useState(false);
  const [isDarkMode, setIsDarkMode]                     = useState(false);
  const [panResponderEnabled, setPanResponderEnabled]   = useState(false);

  const pan                                             = useRef(new Animated.ValueXY({ x: 400, y: 0 })).current;
  const panResponder                                    = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder                      : () => true,
      onPanResponderGrant: () => {
        setPanResponderEnabled(true);
      },
      onPanResponderMove                                : Animated.event(
        [null, { dx                                     : pan.x, dy: pan.y }],
        { useNativeDriver                               : false }
      ),
      onPanResponderRelease: (e, gesture) => {
        if (gesture.dx < -50) {
          setIsDrawerOpen(false);
          Animated.spring(pan, {
            toValue                                     : { x: 200, y: 0 },
            useNativeDriver                             : false,
          }).start();
        } else {
          setIsDrawerOpen(true);
          Animated.spring(pan, {
            toValue                                     : { x: 200, y: 0 },
            useNativeDriver                             : false,
          }).start();
        }
        setPanResponderEnabled(false);
      },
    })
  ).current;

  const openDrawer = () => {
    setIsDrawerOpen(true);
    Animated.spring(pan, {
      toValue                                           : { x: 200, y: 0 },
      useNativeDriver                                   : false,
    }).start();
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    Animated.spring(pan, {
      toValue                                           : { x: 400, y: 0 },
      useNativeDriver                                   : false,
    }).start();
  };
  
  const handleDarkModeSwitch = () => {
    console.log('Dark mode switched', isDarkMode); // Dark mode on switch
    setIsDarkMode(!isDarkMode);
  };

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        'Poppins-Regular'                               : require('../../assets/Fonts/Poppins-Regular.ttf'),
        'Poppins-Bold'                                  : require('../../assets/Fonts/Poppins-Bold.ttf'),
      });
      setFontsLoaded(true);
    } catch (error) {
      console.log('Error loading fonts:', error);
    }
  };
  const startAnimation = () => {
    Animated.timing(opacityValue, {
      toValue                                           : 1,
      duration                                          : 250,
      easing                                            : Easing.ease,
      useNativeDriver                                   : true,
    }).start(() => setButtonIndex(1));
  };

  useEffect(() => {
    loadFonts();
  }, []);

  useEffect(() => {

  
    if (fontsLoaded) {
      navigation.setOptions({
        title                                           : currentMessages.Htitle,
        headerTintColor                                 : isDarkMode ? 'white' : 'darkblue',
        headerStyle: {
          backgroundColor                               : isDarkMode ? 'grey' : 'white'
        },
        headerTitleStyle: {
          fontWeight                                    : 'bold',
          fontFamily                                    : 'Poppins-Regular',
          fontSize                                      : language === 'en' ? 30 : 20,
        },
        headerRight                                     : () => (
          <TouchableOpacity onPress                     = {isDrawerOpen ? closeDrawer : openDrawer} style={styles.icon}>
            <FontAwesome
              name                                      = {isDrawerOpen ? 'times' : 'gear'}
              size                                      = {24}
              color                                     = {isDarkMode ? 'white' : 'darkblue'}
              style                                     = {styles.drawerButtonText}
            />
          </TouchableOpacity>
        ),
      });
      Animated.timing(opacityValue, {
        toValue                                         : 1,
        duration                                        : 1000,
        easing                                          : Easing.ease,
        useNativeDriver                                 : true,
      }).start(() => setButtonIndex(1));
    }
  }, [navigation, fontsLoaded, isDrawerOpen, isDarkMode,currentMessages,language]);
  

  




 useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      startAnimation();
    });

    return unsubscribe;
  }, [navigation]);
  
  useEffect(() => {
    if (buttonIndex < 5) {
      Animated.timing(opacityValue, {
        toValue                                         : 1,
        duration                                        : 125,
        easing                                          : Easing.ease,
        useNativeDriver                                 : true,
        delay                                           : 20,
      }).start(() => setButtonIndex(buttonIndex + 1));
    }
  }, [buttonIndex]);

  const [language, setLanguage]                         = useState('en');

  const messages = {
    en,
    ta,
    si,
  };

  const currentMessages                                 = messages[language];

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  const handleLanguageSelect = (newLanguage) => {
    onLanguageChange(newLanguage);
  };

  return (
    <View style                                         = {styles.languageButton}>
    <TouchableOpacity 
      style                                             = {[styles.languageButtonChild, selectedLanguage === 'en' && styles.selectedButton]}
      onPress                                           = {() => handleLanguageSelect('en')}
      disabled                                          = {selectedLanguage === 'en'}
    >
      <Text style                                       = {[styles.languageButtonText,selectedLanguage === 'en' && styles.selectedButtonText] }>English</Text>
    </TouchableOpacity>
    <TouchableOpacity 
      style                                             = {[styles.languageButtonChild, selectedLanguage === 'si' && styles.selectedButton]}
      onPress                                           = {() => handleLanguageSelect('si')}
      disabled                                          = {selectedLanguage === 'si'}
    >
      <Text style                                       = {[styles.languageButtonText,selectedLanguage === 'si' && styles.selectedButtonText]}>සිංහල</Text>
    </TouchableOpacity>
    <TouchableOpacity 
      style                                             = {[styles.languageButtonChild, selectedLanguage === 'ta' && styles.selectedButton]}
      onPress                                           = {() => handleLanguageSelect('ta')}
      disabled                                          = {selectedLanguage === 'ta'}
    >
      <Text style                                       = {[styles.languageButtonText,selectedLanguage === 'ta' && styles.selectedButtonText]}>தமிழ்</Text>
    </TouchableOpacity>
  </View>
  );
};
  return (
    <SafeAreaView style                                 = {[styles.container, isDarkMode && darkStyles.container]}>
       <Circles /> 
       

    <>
      {isDrawerOpen && <TouchableOpacity onPress        = {closeDrawer} style={styles.overlay} />}
      <Animated.View
        {...panResponder.panHandlers}
        style                                           = {[styles.sideMenu, isDarkMode && darkStyles.sideMenu, { transform: pan.getTranslateTransform() }]}
      >
        <View style                                     = {styles.profileContainer}>
          <Image style                                  = {styles.profileImage} source={require('../../assets/profile.png')} />
          <Text style                                   = {[styles.profileName,isDarkMode && darkStyles.profileName]}>Darshana Wijebahu</Text>
        </View>
        <TouchableOpacity onPress                       = {() => navigation.navigate('EditProfile')}>
          <Text style                                   = {[styles.menuItem, isDarkMode && darkStyles.menuItem]}>{currentMessages.editprofile}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress                       = {() => navigation.navigate('SignIn')}>
          <Text style                                   = {[styles.menuItem, isDarkMode && darkStyles.menuItem]}>{currentMessages.help}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress                       = {() => navigation.navigate('Settings')}>
          <Text style                                   = {[styles.menuItem, isDarkMode && darkStyles.menuItem]}>{currentMessages.settings}</Text>
          
        </TouchableOpacity>
        <View style                                     = {styles.darkModeContainer}>
          <Text style                                   = {[styles.menuItem, isDarkMode && darkStyles.menuItem]}>{currentMessages.darkmode}</Text>
          <Switch value                                 = {isDarkMode} onValueChange={handleDarkModeSwitch} />
        </View>

        <View>
      
      
      <LanguageSelector
        selectedLanguage                                = {language}
        onLanguageChange                                = {handleLanguageChange}
      />
    </View>
      </Animated.View>
    </>
      


     <View style                                        = {styles.logoContainer}>
        <Image
          source                                        = {require('../../assets/logo.png')}
          style                                         = {styles.logo}

          resizeMode                                    = "contain"
        />
      </View>

      <View style                                       = {styles.buttonContainer}>
      <View style                                       = {styles.greetingContainer}>
      <Text style                                       = {styles.greeting}>{currentMessages.greeting}</Text>
       </View>
      <TouchableOpacity
              style={[
                styles.button,
                styles.contactsButton,
                {
                  opacity                               : buttonIndex >= 1 ? 1 : 0,
                  transform: [
                    {
                      translateY: opacityValue.interpolate({
                        inputRange                      : [0, 1],
                        outputRange                     : [-50, 0],
                      }),
                    },
                  ],
                },
              ]}
              onPress                                   = {() => navigation.navigate('Map', { isDarkMode,selectedLanguage: language })}
            >
          <FontAwesome
            name                                        = "address-book"
            size                                        = {24}
            color                                       = "darkblue"
            style                                       = {styles.buttonIcon}
          />
          <Text style                                   = {styles.buttonText}>{currentMessages.findcontact}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style                                         = {[styles.button, styles.viewAllButton,
            {
              opacity                                   : buttonIndex >= 2 ? 1 : 0,
              transform: [
                {
                  translateY: opacityValue.interpolate({
                    inputRange                          : [0, 1],
                    outputRange                         : [-50, 0],
                  }),
                },
              ],
            },
          ]}
          onPress                                       = {() => navigation.navigate('Contact', { isDarkMode, selectedLanguage: language })}>
          <FontAwesome
            name                                        = "th-list"
            size                                        = {24}
            color                                       = "darkblue"
            style                                       = {styles.buttonIcon}
          />
          <Text style                                   = {styles.buttonText}>{currentMessages.viewall}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style                                         = {[styles.button, styles.helpButton,
            {
              opacity                                   : buttonIndex >= 3 ? 1 : 0,
              transform: [
                {
                  translateY: opacityValue.interpolate({
                    inputRange                          : [0, 1],
                    outputRange                         : [-50, 0],
                  }),
                },
              ],
            },
          ]}
          onPress                                       = {() => navigation.navigate('Help_Support', { isDarkMode, selectedLanguage: language })}>
          <FontAwesome
            name                                        = "question-circle"
            size                                        = {24}
            color                                       = "darkblue"
            style                                       = {styles.buttonIcon}
          />
          <Text style                                   = {styles.buttonText}>{currentMessages.help}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style                                         = {[styles.button, styles.complainButton,
            {
              opacity                                   : buttonIndex >= 4 ? 1 : 0,
              transform: [
                {
                  translateY: opacityValue.interpolate({
                    inputRange                          : [0, 1],
                    outputRange                         : [-50, 0],
                  }),
                },
              ],
            },
          ]}
          onPress                                       = {() => navigation.navigate('Complain', { isDarkMode,selectedLanguage: language })}>
          <FontAwesome
            name                                        = "exclamation-circle"
            size                                        = {24}
            color                                       = "darkblue"
            style                                       = {styles.buttonIcon}
          />
          <Text style                                   = {styles.buttonText}>{currentMessages.complain}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style                                         = {[styles.button, styles.faqButton,
            {
              opacity                                   : buttonIndex >= 5 ? 1 : 0,
              transform: [
                {
                  translateY: opacityValue.interpolate({
                    inputRange                          : [0, 1],
                    outputRange                         : [-50, 0],
                  }),
                },
              ],
            },
          ]}
          onPress                                       = {() => navigation.navigate('Faq', { isDarkMode,selectedLanguage: language  })}>
          <FontAwesome
            name                                        = "question-circle"
            size                                        = {24}
            color                                       = "darkblue"
            style                                       = {styles.buttonIcon}
          />
          <Text style                                   = {styles.buttonText}>{currentMessages.faq}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
  

};

const styles = StyleSheet.create({
  container: {
    flex                                                : 1,
    alignItems                                          : 'center',
    justifyContent                                      : 'center',
    backgroundColor                                     : '#F9FAFB',
  },
 
  logoContainer: {
    marginTop                                           : -10,
  },
  logo: {
    height                                              : 200,
    width                                               : 200,
  },
  buttonContainer: {
    marginTop                                           : 0,
    width                                               : '100%',
    paddingHorizontal                                   : 20,
  },
  button: {
    backgroundColor                                     : 'white',
    paddingVertical                                     : 15,
    borderRadius                                        : 10,
    marginBottom                                        : 20,
    flexDirection                                       : 'row',
    alignItems                                          : 'center',
  },
  buttonText: {
    color                                               : 'darkblue',
    fontSize                                            : 18,
    marginLeft                                          : 20,
  },
  buttonIcon: {
    marginLeft                                          : 30,
  },
  icon: {
    marginRight                                         : 20,
  },
  contactsButton: {
    backgroundColor                                     : '#CCE5FF',
    elevation                                           : 10,
  },
  viewAllButton: {
    backgroundColor                                     : '#FFEDCC',
    elevation                                           : 10,
  },
  helpButton: {
    backgroundColor                                     : '#D1E0E0',
    elevation                                           : 10,
  },
  complainButton: {
    backgroundColor                                     : '#FFCCE5',
    elevation                                           : 10,
  },
  faqButton: {
    backgroundColor                                     : '#D6C2FF',
    elevation                                           : 10,
  },

  mainContent: {
    flex                                                : 1,
    backgroundColor                                     : 'black',
    alignItems                                          : 'center',
    justifyContent                                      : 'center',
  },
  drawerButton: {
    position                                            : 'absolute',
    left                                                : 300,
    top                                                 : 0,
    bottom                                              : 0,
    width                                               : 50,
    backgroundColor                                     : '#fff',
    zIndex                                              : 2,
    justifyContent                                      : 'center',
    alignItems                                          : 'center',
    elevation                                           : 5,
    shadowColor                                         : '#000',
    shadowOpacity                                       : 0.5,
    shadowOffset                                        : { width: 0, height: 0 },
    shadowRadius                                        : 5,
  },
  drawerButtonText: {
    color                                               : 'darkblue',
    fontSize                                            : 20,
  },
  overlay: {
    position                                            : 'absolute',
    left                                                : 0,
    top                                                 : 0,
    bottom                                              : 0,
    right                                               : 0,
    backgroundColor                                     : 'rgba(173,216,230,0.5)',
    zIndex                                              : 1,
    borderRadius                                        : 10,
    opacity                                             : 0.8,
  },
  sideMenu: {
    position                                            : 'absolute',
    flexDirection                                       : 'column',
    left                                                : 5,
    top                                                 : 0,
    bottom                                              : 100,
    width                                               : 250,
    backgroundColor                                     : 'rgba(238, 238, 238, 0.8)', // set the background color with an opacity of 0.9
    zIndex                                              : 2,
    justifyContent                                      : 'flex-start',
    alignItems                                          : 'flex-start',
    elevation                                           : 20,
    shadowColor                                         : '#000',
    shadowOpacity                                       : 0.5,
    shadowOffset                                        : { width: 0, height: 0 },
    shadowRadius                                        : 5,
    borderLeftWidth                                     : 5,
    borderLeftColor                                     : 'darkblue',
    borderRadius                                        : 30,
  },
  
  menuItem: {
    fontSize                                            : 18,
    fontWeight                                          : 'bold',
    marginVertical                                      : 5,
    color                                               : 'darkblue',
    paddingHorizontal                                   : 10,
    justifyContent                                      : 'center',

  },
  mainContent: {
    flex                                                : 1,
    backgroundColor                                     : 'black',
    alignItems                                          : 'center',
    justifyContent                                      : 'center',
  },
  darkModeText: {
    fontSize                                            : 16,
    fontWeight                                          : 'bold',
    paddingHorizontal                                   : 20,
    
  },
  profileContainer: {
    width                                               : '100%',
    padding                                             : 20,
    borderBottomWidth                                   : 2,
    borderBottomColor                                   : '#ccc',
    
  },
  profileImage: {
    width                                               : 80,
    height                                              : 80,
    borderRadius                                        : 40,
    marginBottom                                        : 10,
  },
  profileName: {
    fontSize                                            : 18,
    fontWeight                                          : 'bold',
    textAlign                                           : 'center',
    color                                               : 'darkblue',
    paddingRight                                        : 20,
  },
  darkModeContainer: {
    flexDirection                                       : 'row',
    justifyContent                                      : 'space-between',
    marginTop                                           : 50,
  },
  languageButton: {
    flexDirection                                       : 'row',
    alignItems                                          : 'center',
    justifyContent                                      : 'center',
     marginTop                                          : 50,
    paddingHorizontal                                   : 5,
    paddingVertical                                     : 5,
  },
  languageButtonChild: {
    backgroundColor                                     : '#CCE5FF',
    paddingVertical                                     : 10, // increase to make button taller
    paddingHorizontal                                   : 10, // increase to make button wider
    borderRadius                                        : 8,
    marginLeft                                          : 5,
    elevation                                           : 5,
    shadowOffset                                        : { width: 5, height: 5},
    shadowColor                                         : '#000',
  },
  selectedButton: {
    backgroundColor                                     : 'darkblue',
    paddingVertical                                     : 10, // increase to make button taller
    paddingHorizontal                                   : 10, // increase to make button wider
    borderRadius                                        : 8,
    marginLeft                                          : 5,
    elevation                                           : 5,
    shadowOffset                                        : { width: 5, height: 5 },
    shadowColor                                         : '#000',
  },
  languageButtonText: {
    color                                               : 'black',
    fontSize                                            : 10,
    fontWeight                                          : 'bold',
    textAlign                                           : 'center',
    elevation                                           : 5,
  },
  selectedButtonText: {
    color                                               : 'white',
    fontSize                                            : 13,
    fontWeight                                          : 'bold',
    textAlign                                           : 'center',
  },
  greeting:{
    fontSize                                            : 22,
    fontWeight                                          : 'bold',
    color                                               : 'darkblue',
    fontStyle                                           : 'italic',
    elevation                                           : 5,
    shadowOffset                                        : { width: 5, height: 5 },
    shadowColor                                         : '#000',
  },
  greetingContainer:{
    alignItems                                          : 'center',
    paddingHorizontal                                   : 10,
    

  },
  
});


const darkStyles = StyleSheet.create({
  container: {
    backgroundColor                                     : '#333333',
    opacity                                             : 0.7,
    // other dark styles...
  },
  text: {
    color                                               : 'white',
    // other dark styles...
  },
  // define more dark styles here...
  sideMenu: {
    position                                            : 'absolute',
    flexDirection                                       : 'column',
    left                                                : 5,
    top                                                 : 0,
    bottom                                              : 100,
    width                                               : 250,
    backgroundColor                                     : '#424242',
    zIndex                                              : 2,
    justifyContent                                      : 'flex-start',
    alignItems                                          : 'flex-start',
    elevation                                           : 20,
    shadowColor                                         : '#000',
    shadowOpacity                                       : 0.5,
    shadowOffset                                        : { width: 0, height: 0 },
    shadowRadius                                        : 5,
    borderLeftWidth                                     : 5,
    borderLeftColor                                     : 'darkblue',
    borderRadius                                        : 30,
  },
  menuItem: {
    fontSize                                            : 20,
    fontWeight                                          : 'bold',
    marginVertical                                      : 5,
    color                                               : 'white',
    paddingHorizontal                                   : 10,
    justifyContent                                      : 'center',

  },
  mainContent: {
    flex                                                : 1,
    backgroundColor                                     : 'black',
    alignItems                                          : 'center',
    justifyContent                                      : 'center',
  },
  darkModeText: {
    fontSize                                            : 16,
    fontWeight                                          : 'bold',
    paddingHorizontal                                   : 20,
  },
  profileContainer: {
    width                                               : '100%',
    padding                                             : 20,
    borderBottomWidth                                   : 2,
    borderBottomColor                                   : '#ccc',
    
  },
  profileImage: {
    width                                               : 80,
    height                                              : 80,
    borderRadius                                        : 40,
    marginBottom                                        : 10,
  },
  profileName: {
    fontSize                                            : 18,
    fontWeight                                          : 'bold',
    textAlign                                           : 'center',
    color                                               : 'white',
  },
});

export default HomeScreen;