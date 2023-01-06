import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

const LifeDisorderCard = (props) => (
  <View style={styles.Horizontalcard}>
    <TouchableOpacity onPress={props.onPress}>
      <Image style={styles.imageThumbnail} source={props.img} />
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
          {props.title}
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
    width: scale(110),
    height: scale(110),
    borderWidth: 1,
    borderColor: "#FFFFF0", //ivory color
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "lightgray",
    shadowOpacity: 0.9,
    borderRadius: 12,
    alignItems: "center",
    elevation: 5,
    justifyContent: "center",
    // backgroundColor: "#FFFFF0",
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

export default LifeDisorderCard;
