import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import Constants from "../utils/Constants";
import ImageLoad from "react-native-image-placeholder";

const LifeDisorderImgcard = (props) => (
  <View style={styles.Horizontalcard}>
    <TouchableOpacity onPress={props.onPress}>
      <ImageLoad
        source={{ uri: props.lifedisorderImg }}
        style={styles.imageThumbnail}
        //placeholderSource={require('../../icons/placeholder.png')}
        //placeholderStyle={styles.imageThumbnail}
        borderRadius={34}
      />

      <View
        style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
      >
        <Text
          style={{
            textAlign: "center",
            backgroundColor: "white",
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
    width: 110,
    height: 110,
    borderWidth: 1,
    borderColor: "#FFFFF0",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "lightgray",
    shadowOpacity: 0.9,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
    // justifyContent:'center',
  },
  imageThumbnail: {
    margin: 5,
    height: 50,
    width: 50,
  },

  MyhealthcardView: {
    flex: 1,
    flexDirection: "row",
    padding: 8,
    margin: 10,
    backgroundColor: "white",
    width: 350,
    height: 100,
    borderWidth: 1,
    borderColor: "lightgray",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "lightgray",
    shadowOpacity: 0.8,
    borderRadius: 5,
    elevation: 5,
  },
  title: {
    flex: 1,
    fontSize: 18,
    color: "#000",
    flexDirection: "row",
    marginRight: 10,
  },
});

export default LifeDisorderImgcard;
