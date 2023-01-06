import React from "react";
import { TouchableOpacity, View, Image, Text, TextInput } from "react-native";

const TestInputCard = (props) => (
  <View
    style={{
      height: 80,
      backgroundColor: "transparent",
      flexDirection: "column",
      marginTop: 10,
      marginLeft: 5,
      marginRight: 5,
    }}
  >
    <Text style={{ fontSize: 15 }}>{props.inputfield}</Text>

    <View
      style={{
        height: 50,
        backgroundColor: "white",
        flexDirection: "row",
        marginTop: 10,
        marginLeft: 0,
        marginRight: 0,
        borderColor: "lightgray",
        borderWidth: 1,
        borderRadius: 5,
      }}
    >
      <Image
        source={props.icon}
        style={{
          height: 20,
          width: 20,
          marginLeft: 8,
          justifyContent: "center",
          alignSelf: "center",
        }}
      />
      <View
        style={{
          height: 34,
          width: 1,
          marginTop: 8,
          marginBottom: 8,
          marginLeft: 10,
          backgroundColor: "lightgray",
        }}
      ></View>

      <TextInput
        style={{ textAlign: "left", flex: 1, paddingLeft: 10, fontSize: 17 }}
        value={props.inputvalue}
        underlineColorAndroid="transparent"
        placeholder={props.placeholder}
        onChangeText={props.onchangeTxt}
        secureTextEntry={props.textentry}
        maxLength={props.maxlength}
        keyboardType={props.keyboardtype}
        textContentType={props.textContentType}
        placeholderTextColor="lightgray"
        allowFontScaling={false}
      />
    </View>
  </View>
);

export default TestInputCard;
