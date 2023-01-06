import React from 'react';
import { TouchableOpacity, View, Image, Text } from 'react-native';
import Colors from '../utils/Colors';

const NoInternet = (props) => (
  <View
    style={{
      position: 'absolute',
      height: '100%',
      width: '100%',
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Image
      source={require('../../assets/ic_no_internet.png')}
      style={{ height: 50, width: 50 }}
    />
    <Text>unable to establish connection with server</Text>
    <TouchableOpacity onPress={props.onPressRefresh}>
      <Text style={{ color: Colors.GREEN_COLOR }}>click to refresh</Text>
    </TouchableOpacity>
  </View>
);

export default NoInternet;
