import React from "react";
import { TouchableOpacity, View, Image, Text, TextInput } from "react-native";
import { scale } from "react-native-size-matters";

const PasswordInput = (props) => (
  <View
    style={{
      height: scale(80),
      backgroundColor: "transparent",
      flexDirection: "column",
      marginTop: 10,
      marginLeft: 5,
      marginRight: 5,
    }}
  >
    <View style={{ flexDirection: "row" }}>
      <Text style={{ fontSize: 15 }}>{props.inputfield}</Text>
      <Text style={{ fontSize: 15, color: "red" }}>*</Text>
    </View>

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

      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={props.updateSecureTextEntry}
      >
        <Image
          source={
            props.textentry
              ? require("../../icons/eye-invisible.png")
              : require("../../icons/eyeshow.png")
          }
          style={{
            height: 20,
            width: 20,
            marginRight: 5,
            marginTop: 13,
            padding: 2,
            justifyContent: "center",
            alignSelf: "center",
          }}
        />
      </TouchableOpacity>
    </View>
  </View>
);

export default PasswordInput;
