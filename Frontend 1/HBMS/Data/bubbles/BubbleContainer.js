import React from 'react';
import { SafeAreaView, View } from 'react-native';
import Bubble from '../../Data/bubbles/Bubble.js';

const BubbleContainer = () => {
  return (
<SafeAreaView>
<View style       = {{ flexDirection: 'row',position: 'absolute', top: 260, left: 70 }}>

 
  <Bubble size    = {30} color="rgba(173, 216, 230, 0.2)" delay={100} style={{ position: 'absolute', top: 400, left: 180 }} />
  
</View>

<View style       = {{ flexDirection: 'row',position: 'absolute', top: 160, left: 70 }}>
 
  <Bubble size    = {22} color="rgba(0, 116, 217, 0.2)" delay={100} style={{ position: 'absolute', top: 500, left: 20 }} />
  <Bubble size    = {12} color="rgba(173, 216, 230, 0.2)" delay={100} style={{ position: 'absolute', top: 650, left: 300 }} />
</View>
    



</SafeAreaView>

  );
};



export default BubbleContainer;
