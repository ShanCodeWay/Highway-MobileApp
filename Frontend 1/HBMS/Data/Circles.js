import React from 'react';
import { View } from 'react-native';

const Circles = () => {
  return (
    <View
      style={{
        width             : 430,
        height            : 377,
        position          : 'absolute',
        top               : 0,
        left              : 0,
      }}>
      <View
        style={{
          position        : 'absolute',
          top             : 450,
          left            : 110,
          width           : 300,
          height          : 300,
          borderRadius    : 300,
          backgroundColor : 'rgba(132, 206, 235, 0.3)',
        }}
      />
      <View
        style={{
          position        : 'absolute',
          top             : 350,
          left            : 250,
          width           : 300,
          height          : 300,
          borderRadius    : 300,
          backgroundColor : 'rgba(132, 206, 235, 0.3)',
        }}
      />
    </View>
  );
};

export default Circles;
