import React from "react";
import { TouchableOpacity, View, Image, Text } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

const NoDataAvailable = (props) => (
  <View
    style={{
      height: "100%",
      width: "100%",
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    {props.source != undefined ? (
      <Image
        source={props.source}
        style={{
          height: "100%",
          width: "100%",
          // height: scale(250),
          // width: moderateScale(250),
          // height: 250,
          // width: 250,
          resizeMode: "contain"
        }}
      ></Image>
    ) : (
      <Image
        source={require("../../icons/nodata-found.png")}
        style={{
          height: 250,
          width: 250,
          resizeMode: "cover",
          backgroundColor: "white"
        }}
      />
    )}
    <TouchableOpacity onPress={props.onPressRefresh}>
      {/* <Text style={{ color: 'green' ,backgroundColor:'white'}}>click to refresh</Text> */}
    </TouchableOpacity>
  </View>
);

export default NoDataAvailable;
