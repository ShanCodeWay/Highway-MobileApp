import React from 'react';
import { Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import LottieView from "lottie-react-native";


const ErrorModal = ({
  visible,
  setVisible,
  onClose,
  animationType,
  backgroundColor,
  iconColor,
  iconName,
  iconAnimationType,
  title,
  message,
}) => {
  return (
    <Modal
      animationType       = {animationType}
      transparent         = {true}
      visible             = {visible}
      onRequestClose      = {onClose}>
      <View style         = {styles.container}>
       
        <TouchableOpacity
          activeOpacity   = {1}
          style           = {[styles.contentContainer, { backgroundColor }]}
          onPress         = {() => setVisible(false)}>
             <LottieView
          source          = {require('../assets/animation/error.json')}
          autoPlay
          loop
          style           = {{  position: 'absolute',
          width           : '90%',
          height          : '90%',
          justifyContent  : 'flex-start', // set to flex-start to align to top
          alignItems      : 'flex-start', // set to flex-start to align to left
          marginTop       : '-6%',
          marginLeft      : '0%',}} // add marginLeft to shift to the right by 5%
        />
           
          
          <Text style     = {styles.title}>{title}</Text>
          <Text style     = {styles.message}>{message}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor       : 'rgba(173, 216, 230, 0.3)',
    flex                  : 1,
    justifyContent        : 'center',
    alignItems            : 'center',
  },
  contentContainer: {
    backgroundColor       : 'white',
    marginHorizontal      : 20,
    padding               : 20,
    borderRadius          : 20,
    alignItems            : 'center',
    elevation             : 10,
    zIndex                : 10,
  },
  title: {
    fontSize              : 25,
    fontFamily            : 'Poppins-Bold',
    fontWeight            : 'bold',
    marginBottom          : 10,
    elevation             : 10,
  },
  message: {
    textAlign             : 'center',
    fontFamily            : 'Poppins-Regular',
    fontWeight            : 'bold',
    fontSize              : 18,
  },
});
export default ErrorModal;
