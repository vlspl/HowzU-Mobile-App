import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";

const Rediobutton = (props) => (
  <TouchableOpacity
    style={{
      backgroundColor: "transparent",
      marginTop: 0,
      height: 30,
      flexDirection: "row",
      margin: 10,
    }}
    onPress={props.onpress}
  >
    <Image
      source={props.buttonimg}
      style={{
        width: 20,
        height: 20,
        backgroundColor: "transparent",
        marginTop: 5,
        resizeMode: "contain",
      }}
    />
    <Text
      style={{
        textAlign: "center",
        alignSelf: "center",
        fontSize: 16,
        color: props.from == "Hyd" ? "#0F52BA" : "gray",
        marginLeft: 10,
      }}
    >
      {props.gender}
    </Text>
  </TouchableOpacity>
);

export default Rediobutton;
