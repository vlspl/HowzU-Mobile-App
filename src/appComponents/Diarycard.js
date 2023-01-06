import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";

const Diarycard = (props) => (
  <View style={styles.Horizontalcard}>
    <TouchableOpacity onPress={props.onPress}>
      <Image style={styles.imageThumbnail} source={props.img} />
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
    width: 150,
    height: 150,
    borderWidth: 1,
    borderColor: "lightgray",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "lightgray",
    shadowOpacity: 0.9,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
    // justifyContent:'center',
  },
  imageThumbnail: {
    alignItems: "center",

    margin: 15,
    height: 65,
    width: 70,
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
    //alignItems: 'center',
    // justifyContent:'center',
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

export default Diarycard;
