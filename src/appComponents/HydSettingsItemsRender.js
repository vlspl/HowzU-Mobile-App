import React from "react";

import { Text, View, TouchableOpacity, Modal as RNModal } from "react-native";
const SettingsItemsRender = (props) => (
  <View
    style={{
      flex: 1,
    }}
  >
    <TouchableOpacity
      style={{ flex: 1, flexDirection: "row", marginTop: 25 }}
      onPress={props.onPress}
    >
      <Text
        style={{
          fontSize: 16,
          paddingTop: 2,
          color: "gray",
          marginLeft: 10,
          width: 200,
          backgroundColor: "white",
          fontWeight: "bold",
        }}
        numberOfLines={1}
      >
        {props.name}
      </Text>
      <Text
        style={{
          flex: 1,
          fontSize: 16,
          marginTop: 0,
          color: "#0F52BA",
          // color: "#0047AB",
          marginRight: 10,
          textAlign: "right",
          backgroundColor: "white",
          padding: 2,
          fontWeight: "bold",
        }}
      >
        {props.value}
      </Text>
    </TouchableOpacity>

    <View
      style={{
        height: 0.5,
        backgroundColor: "lightgray",
        marginTop: 5,
        padding: 0.5,
      }}
    ></View>
  </View>
);

export default SettingsItemsRender;
