// components/GlobalBackground.js
import React from 'react';
import { StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { BlurView } from 'expo-blur';

const GlobalBackground = () => {
  return (
    <>
      <Video
        source={require('@/assets/flow-background.mp4')} // Your video file
        rate={0.8}
        shouldPlay
        isLooping
        resizeMode="cover"
        style={StyleSheet.absoluteFillObject}
      />
      <BlurView intensity={15} style={StyleSheet.absoluteFillObject} />
    </>
  );
};

export default GlobalBackground;