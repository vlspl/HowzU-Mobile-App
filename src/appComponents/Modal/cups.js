import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

const Cups = (props) => (
  <View style={styles.Horizontalcard}>
    <TouchableOpacity onPress={() => props.onpress(props.cupname)}>
      <Image style={styles.imageThumbnail} source={props.source} />
      <View
        style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
      >
        <Text
          style={{
            textAlign: "center",
            // backgroundColor: "white",
            fontSize: 12,
            fontWeight: "700",
          }}
        >
          {props.cupname}
        </Text>
      </View>
    </TouchableOpacity>
  </View>
);
const styles = StyleSheet.create({
  Horizontalcard: {
    flex: 1,
    flexDirection: "column",
    padding: 8,
    margin: 8,
    backgroundColor: "white",
    width: scale(100),
    height: scale(120),
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  imageThumbnail: {
    alignItems: "center",
    justifyContent: "center",
    margin: scale(10),
    height: scale(50),
    width: scale(50),
    alignSelf: "center",
    padding: 10,
  },

  title: {
    flex: 1,
    fontSize: 18,
    color: "#000",
    flexDirection: "row",
    // backgroundColor: 'gray',
    marginRight: 10,
    //fontWeight: 'bold'
  },
});

export default Cups;
