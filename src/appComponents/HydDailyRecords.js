import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const HydDailyRecords = (props) => (
  <>
    <View style={styles.MyhealthcardView}>
      <View style={{ flex: 1, flexDirection: "column" }}>
        <Text
          style={{
            textAlign: "justify",
            fontSize: scale(17),
            marginLeft: 35,
            // marginTop: 22,
            color: "#0F52BA",
            fontWeight: "bold",
          }}
          // numberOfLines={1}
        >
          {props.time}
        </Text>
        <View style={styles.Mobilesubview}>
          <Image
            source={require("../../icons/time.png")}
            style={{ height: 25, width: 25, marginBottom: 20 }}
          />
        </View>

        {/* <View style={{ flex: 1 }}>
        <View style={styles.container_text}>
          <View style={styles.titlesubview}>
            <View
              style={{
                flex: 1,
                alignContent: "flex-end",
                justifyContent: "flex-end",
                marginRight: 20,
                marginTop: 10,
                flexDirection: "row",
                marginTop: -22,
              }}
            >
              <Text
                ellipsizeMode="tail"
                numberOfLines={2}
                style={{
                  // textAlign: "auto",
                  textAlign: "justify",
                  fontSize: 18,
                  marginLeft: 20,
                  color: "gray",
                }}
              >
                {props.water}
              </Text>
            </View>
            <View
              style={{
                alignContent: "flex-end",
                justifyContent: "flex-end",
                marginRight: 0,
                marginTop: 0,
                marginLeft: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <TouchableOpacity onPress={props.onPress}>
                <Image
                  style={{
                    height: 30,
                    width: 30,
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    alignSelf: "auto",
                    marginTop: -30,
                  }}
                  // source={require("../../icons/dot-new.png")}
                  source={require("../../icons/delete.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View> */}
      </View>
      <View
        style={{
          flex: 1,
          alignContent: "flex-end",
          justifyContent: "flex-end",
          marginRight: 20,
          // marginTop: 10,
          flexDirection: "row",
        }}
      >
        <Text
          ellipsizeMode="tail"
          numberOfLines={2}
          style={{
            textAlign: "auto",
            textAlign: "justify",
            fontSize: 18,
            marginLeft: 20,
            color: "gray",
          }}
        >
          {props.water}
        </Text>
      </View>
      <View
        style={{
          alignContent: "flex-end",
          justifyContent: "flex-end",
          marginRight: 0,
          marginTop: 0,
          marginLeft: 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity onPress={props.onPress}>
          <Image
            style={{
              height: 30,
              width: 30,
              alignItems: "flex-end",
              justifyContent: "flex-end",
              alignSelf: "auto",
            }}
            source={require("../../icons/delete.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  </>
);

const styles = StyleSheet.create({
  MyhealthcardView: {
    flex: 1,
    flexDirection: "row",
    padding: 8,
    margin: 10,
    backgroundColor: "#FDFEFE", //"white",#ecf0f5
    width: scale(310),
    height: scale(70),
    borderWidth: 1,
    borderColor: "#ecf0f1",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "lightgray",
    shadowOpacity: 0.8,
    borderRadius: 5,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  container_text: {
    flex: 1,
    marginLeft: 5,
  },

  image: {
    height: 22,
    width: 22,
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: 5,
  },
  Mobilesubview: {
    flex: 0.5,

    marginLeft: scale(5),
    marginTop: scale(5),
    justifyContent: "center",
    bottom: scale(10),
  },
  titlesubview: {
    flex: 1,
    flexDirection: "row",
  },

  DRnamesubview: {
    flex: 1,
    flexDirection: "row",

    justifyContent: "flex-end",
  },
});

export default HydDailyRecords;
