import React from 'react';
import { Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import LottieView from "lottie-react-native";

const SuccessModal = ({
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
      animationType                     = {animationType}
      transparent                       = {true}
      visible                           = {visible}
      onRequestClose                    = {onClose}>
      <TouchableOpacity
        activeOpacity                   = {1}
        style                           = {styles.container}
        onPress                         = {() => setVisible(false)}>
        <View style                     = {[styles.contentContainer, {backgroundColor}]}>
        <LottieView
          source                        = {require('../assets/animation/trowsome.json')}
          autoPlay
          loop
          style                         = {{ position: 'absolute', width: '100%', height: '100%' }}
        />
          <Animatable.View animation    = "zoomIn" iterationCount={3}>
            <Icon
              name                      = {iconName}
              color                     = {iconColor}
              size                      = {95}
              style                     = {{ marginBottom: 20 }}
              animation                 = {iconAnimationType || 'none'} // Add default value for animation prop
            />
          </Animatable.View>
          <Text style                   = {styles.title}>{title}</Text>
          <Text style                   = {styles.message}>{message}</Text>
          <Text >  </Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor                     : 'rgba(0,0,0,0.3)',
    flex                                : 1,
    justifyContent                      : 'center',
  },
  contentContainer: {
    backgroundColor                     : 'white',
    marginHorizontal                    : 20,
    padding                             : 20,
    borderRadius                        : 20,
    alignItems                          : 'center',
    elevation                           : 10,
  },
  title: {
    fontSize                            : 25,
    fontFamily                          : 'Poppins-Bold',
    fontWeight                          : 'bold',
    marginBottom                        : 10,
    color                               : 'darkblue',
    elevation                           : 10,
    textAlign                           : 'center',
  },
  message: {
    
    fontFamily                          : 'Poppins-Regular',
    color                               : 'darkblue',
    fontSize                            : 16,
    textAlign                           : 'center',
  },
});

export default SuccessModal;
