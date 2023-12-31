import React, { useEffect, useState } from "react";
import { Button, View, Text, TouchableOpacity, StyleSheet, Animated, Linking, ScrollView,route } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from 'react-native-vector-icons';
import Circles  from '../../Data/Circles.js';
import {questions} from '../../Data/questions.js';
import * as Font from 'expo-font';
import axios from 'axios';

import en from '../../locales/en.js';
import ta from '../../locales/ta.js';
import si from '../../locales/si.js';

export default function FAQ({ navigation,route  }) {

  const [fontLoaded, setFontLoaded]   = useState(false);
  const [expanded, setExpanded]       = useState(new Array(questions.length).fill(false));
  const [isDarkMode, setIsDarkMode]   = useState(false);
  const [language, setLanguage]       = useState(route.params?.selectedLanguage || 'en');
  const [faqData, setFaqData]         = useState([]);

  const messages = {
    en,
    ta,
    si,
  };

  const currentMessages               = messages[language];

  useEffect(() => {
    if (route.params?.isDarkMode !== undefined) {
      setIsDarkMode(route.params.isDarkMode);
    }
  }, [route.params]);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Poppins-Regular'             : require('../../assets/Fonts/Poppins-Regular.ttf'),
        'Poppins-Bold'                : require('../../assets/Fonts/Poppins-Bold.ttf'),
      });
      setFontLoaded(true); 
    }

    loadFonts();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title                           : currentMessages.faq,
      headerTintColor                 : isDarkMode ? 'white' : 'darkblue',
      headerStyle: {
        backgroundColor               : isDarkMode ? 'grey' : 'white'
      },
      headerTitleStyle: {
        fontWeight                    : 'bold',
        fontFamily                    : 'Poppins-Bold',
        fontSize                      : language === 'en' ? 30 : 20,
      },
      headerRight                     : () => (
        <TouchableOpacity onPress     = {() => navigation.navigate("Home")}>
          <FontAwesome5 name          = "home" size={25} color={ isDarkMode? 'white' : "darkblue"} style={styles.icon} />
        </TouchableOpacity>
      ),
    });
  }, [navigation,isDarkMode]);

  useEffect(() => {
    let url;
    if (language === 'si') {
      url                             = 'http://192.168.8.141:4000/api/SiFAQ';
    } else if (language === 'ta') {
      url                             = 'http://192.168.8.141:4000/api/TaFAQ';
    } else {
      url                             = 'http://192.168.8.141:4000/api/FAQ';
    }

    axios.get(url)
      .then(response => {
        setFaqData(response.data);
      })
      .catch(error => {
        console.log('Error fetching FAQ data:', error);
      });
  }, [language]);

  const toggleExpansion = (index) => {
    setExpanded((prevExpanded) => {
      const newExpanded               = new Array(questions.length).fill(false);
      newExpanded[index]              = !prevExpanded[index];
      return newExpanded;
    });
  };
  

  const handlePress = () => {
    Linking.openURL('https://www.google.com');
  };

  const renderQuestion = (question, index) => {
    const rotation                    = expanded[index] ? "180deg" : "0deg";
    const answerHeight                = expanded[index] ? 70 : 0;
    const opacity                     = expanded[index] ? 1 : 0;
  
    return (
      <View key                       = {index} style={styles.questionContainer}>
        <TouchableOpacity onPress     = {() => toggleExpansion(index)} style={styles.question}>
          <Animated.View style        = {[styles.icon, { transform: [{ rotate: rotation }] }]}>
            <Icon name                = {expanded[index] ? "minus" : "plus"} size={20} color={isDarkMode ? 'white' : 'darkblue'} />
          </Animated.View>
          <Text style                 = {[styles.questionText, isDarkMode && darkStyles.questionText]}>{question.question}</Text>
        </TouchableOpacity>
        <Animated.View style          = {[styles.answer, { height: answerHeight, opacity: opacity }]}>
          <Text style                 = {[styles.answerText, isDarkMode && darkStyles.answerText]}>{question.answer}</Text>
        </Animated.View>
      </View>
    );
  };
  

  return (
    <SafeAreaView style               = {[styles.container,isDarkMode && darkStyles.container]}>
      <Circles />
      <ScrollView> 
        <Text>{currentMessages.greeting}</Text>
        
        {fontLoaded ? (
          <>
            <View style               = {styles.questionsContainer}>
            {faqData.map((question, index) => renderQuestion(question, index, question.id))}

            </View>
            <View style               = {styles.bottomContainer}>
              <TouchableOpacity
                style                 = {styles.buttonContainer}
                onPress               = {handlePress}
                activeOpacity         = {0.8}
              >
                <Text style           = {styles.buttonText}>Visit website</Text>
              </TouchableOpacity>
            </View>
          </>
        )                             : null}
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex                              : 1,
    backgroundColor                   : 'white',
    paddingHorizontal                 : 20,
    paddingTop                        : 0,
    elevation                         : 5,
  },
  title: {
    fontFamily                        : 'Poppins-Bold',
    fontSize                          : 24,
    textAlign                         : 'center',
    marginBottom                      : 20,
  },
  questionsContainer: {
    marginTop                         : 5,
  },
  questionContainer: {
    marginBottom                      : 5,
  },
  question: {
    flexDirection                     : 'row',
    alignItems                        : 'center',
    paddingVertical                   : 10,
    borderBottomWidth                 : 2,
    borderBottomColor                 : 'lightgrey',
  },
  questionText: {
    fontFamily                        : 'Poppins-Bold',
    fontSize                          : 18,
    flex                              : 1,
    color                             : 'darkblue',
  },
  icon: {
    marginLeft                        : 10,
    marginRight                       : 10,
  },
  answer: {
    overflow                          : 'hidden',
  },
  answerText: {
    fontFamily                        : 'Poppins-Regular',
    fontSize                          : 16,
    paddingHorizontal                 : 20,
    paddingVertical                   : 10,
    color                             : 'darkblue',
  },
  buttonContainer: {
    borderRadius                      : 10,
    elevation                         : 5,
    backgroundColor                   : 'darkblue',
    paddingVertical                   : 10,
    paddingHorizontal                 : 40,
  },
  buttonText: {
    color                             : 'white',
    fontWeight                        : 'bold',
    fontFamily                        : 'Poppins-Bold',
    fontSize                          : 18,
  },
  bottomContainer: {
    alignItems                        : 'center',
    justifyContent                    : 'flex-end',
    marginBottom                      : 10,
    flex                              : 1,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor                   : '#333333',
    opacity                           : 0.7,
    
  },
  questionText: {
    fontFamily                        : 'Poppins-Bold',
    fontSize                          : 18,
    flex                              : 1,
    color                             : 'white',
  },
  answerText: {
    fontFamily                        : 'Poppins-Regular',
    fontSize                          : 16,
    paddingHorizontal                 : 20,
    paddingVertical                   : 10,
    color                             : 'white',
  },
});

