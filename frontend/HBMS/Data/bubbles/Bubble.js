import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

const Bubble = ({ size, color, delay = 0 }) => {
  const animatedValue   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue         : 6,
        duration        : 2500,
        easing          : Easing.linear,
        useNativeDriver : true,
        delay,
      })
    ).start();
  }, []);

  const bubbleScale = animatedValue.interpolate({
    inputRange          : [0, 1],
    outputRange         : [1, 2],
  });

  const bubbleBorderRadius = animatedValue.interpolate({
    inputRange          : [0, 1],
    outputRange         : [size, size * 4],
  });

  return (
    <Animated.View
      style={{
        transform       : [{ scaleX: bubbleScale }, { scaleY: bubbleScale }],
        borderRadius    : bubbleBorderRadius,
        backgroundColor : color,
        width           : size * 2,
        height          : size * 2,
      }}
    />
  );
};

export default Bubble;
