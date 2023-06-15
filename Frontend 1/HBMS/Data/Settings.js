import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const Settings = ({ navigation }) => {
  const handleLogout = () => {
    // Handle Logout logic
  };

  return (
    <View style                 = {styles.container}>
      <TouchableOpacity style   = {styles.button} onPress={handleLogout}>
        <Text style             = {styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex                        : 1,
    alignItems                  : 'center',
    justifyContent              : 'center',
    backgroundColor             : '#fff',
  },
  button: {
    paddingVertical             : 10,
    paddingHorizontal           : 20,
    backgroundColor             : '#ddd',
    borderRadius                : 5,
  },
  buttonText: {
    fontSize                    : 18,
  },
});

export default Settings;
