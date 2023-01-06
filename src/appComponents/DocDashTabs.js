import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";

const DocDashTabs = (props) => (
  <View style={styles.Horizontalcard}>
    <TouchableOpacity onPress={props.onPress}>
      <View
        style={{
          flex: 1,
          alignContent: "center",
          justifyContent: "center",
          height: 30,
          width: 30,
          // backgroundColor: 'red',
          backgroundColor: "#00397e",
          marginLeft: 60,
          marginTop: 2,
          marginRight: 2,
          zIndex: 2,
          position: "absolute",
          borderRadius: 15,
          padding: 2,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontSize: 12,
            fontWeight: "700",
            alignSelf: "center",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          {props.count}
        </Text>
      </View>

      {/* {props.count != 0 ? (
        <View
          style={{
            flex: 1,
            alignContent: 'center',
            justifyContent: 'center',
            height: 30,
            width: 30,
            // backgroundColor: 'red',
            backgroundColor: '#00397e',
            marginLeft: 60,
            marginTop: 2,
            marginRight: 2,
            zIndex: 2,
            position: 'absolute',
            borderRadius: 15,
            padding: 2,
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 12,
              fontWeight: '700',
              alignSelf: 'center',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            {props.count}
          </Text>
        </View>
      ) : null} */}
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
            color: "#2b2b2b",
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
    width: 115,
    height: 115,
    borderWidth: 1,
    borderColor: "lightgray",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "lightgray",
    shadowOpacity: 0.9,
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  imageThumbnail: {
    //alignItems: 'center',
    // justifyContent:'center',
    // margin:5,
    height: 80,
    width: 80,
    alignSelf: "center",
    //padding: 10,
    backgroundColor: "white",
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
    fontSize: 20,
    color: "#000",
    flexDirection: "row",
    // backgroundColor: 'gray',
    marginRight: 10,
    //fontWeight: 'bold'
  },
});

export default DocDashTabs;
