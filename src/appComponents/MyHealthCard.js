import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

const MyHealthCard = (props) => (
  <View style={styles.MyhealthcardView} key={props.index}>
    <TouchableOpacity style={{ flex: 1 }} onPress={props.onPress}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 0.6, backgroundColor: "white" }}>
          <Text
            style={{
              textAlign: "left",
              backgroundColor: "white",
              fontSize: 16,
              marginLeft: 2,
              flex: 1,
              marginTop: 2,
              padding: 2,
              // fontWeight: "bold",
            }}
          >
            {props.title}
          </Text>
          <Text
            style={{
              textAlign: "left",
              fontSize: 13,
              // fontSize: scale(14),
              marginLeft: 2,
              padding: 2,
              marginTop: 2,
              flex: 1,
              color: "black",
            }}
            numberOfLines={1}
          >
            {props.value}
          </Text>
          <Text
            style={{
              textAlign: "left",

              color: "green",
              fontSize: scale(11),
              marginLeft: 2,
              flex: 1,
              marginTop: 2,
              padding: 2,
            }}
            numberOfLines={1}
          >
            {props.result}
          </Text>
        </View>
        {/* <View style={{ flex: 0.25, backgroundColor: "white" }}>
          <Text
            style={{
              textAlign: "center",
              backgroundColor: "white",
              color: "green",
              fontSize: 11,
              marginLeft: -10,
              flex: 1,
              marginTop: 4,
            }}
            numberOfLines={1}
          >
            {props.result}
          </Text>
        </View> */}
        <View
          style={{ flex: 0.35, backgroundColor: "white", alignItems: "center" }}
        >
          {/* <View style={{ flex: 0.25, backgroundColor: "white" }}> */}

          {/* </View> */}
          {props.title == "Blood Pressure" && (
            <Image
              style={{ height: 45, width: 47 }}
              source={require("../../icons/heartred.png")}
            />
          )}
          {props.title == "Oxygen" && (
            <Image
              style={{ height: 50, width: 50 }}
              // source={require("../../icons/oxygennew-blue.png")}
              source={require("../../icons/oxygen.png")}
            />
          )}
          {props.title == "Temperature" && (
            <Image
              style={{ height: 45, width: 50 }}
              source={require("../../icons/tempbluenew.png")}
              // source={require("../../icons/temperature.png")}
            />
          )}
          {props.title == "BMI" && (
            <View
              style={{
                height: 45,
                width: 45,
                borderRadius: 22.5,
                borderColor: "lightgray",
                borderWidth: 1,
                marginTop: 4,
                overflow: "hidden",
              }}
            >
              <Image
                style={{ height: 40, width: 40 }}
                source={require("../../icons/bmi-calculater-b.png")}
              />
            </View>
          )}

          {/* {props.title == "Blood Pressure" ? (
            <Image
              style={{ height: 45, width: 47 }}
              source={require("../../icons/heartred.png")}
            />
          ) : (
            <View
              style={{
                height: 45,
                width: 45,
                borderRadius: 22.5,
                borderColor: "lightgray",
                borderWidth: 1,
                marginTop: 4,
                overflow: "hidden",
              }}
            >
              <Image
                style={{ height: 45, width: 45 }}
                source={require("../../icons/booktest.jpg")}
              />
            </View>
          )} */}
          <View
            style={{
              flex: 1,
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Text
              ellipsizeMode="tail"
              numberOfLines={2}
              style={{
                textAlign: "center",
                backgroundColor: "white",
                fontSize: 10,
                color: "gray",
              }}
            >
              {props.date}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    paddingTop: 0,
    backgroundColor: "white",
  },

  imageThumbnail: {
    // alignItems: 'center',
    //justifyContent:'center',
    margin: 5,
    height: 80,
    width: 80,
    //padding: 10,
    //backgroundColor: 'red',
  },

  MyhealthcardView: {
    flex: 1,
    flexDirection: "row",
    padding: 8,
    margin: 10,
    backgroundColor: "white",
    width: scale(220),
    height: scale(95),
    borderWidth: 1,
    borderColor: "#FFFFF0",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "lightgray",
    shadowOpacity: 0.8,
    borderRadius: 5,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
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
  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    marginLeft: 5,
    justifyContent: "center",
    backgroundColor: "white",
  },
  description: {
    fontSize: 13,
    marginTop: 4,
    color: "#595858",
    marginLeft: 5,
    /// backgroundColor: 'gray',
  },
  suggestbtnTitle: {
    // flex:1,
    fontSize: 9,
    marginLeft: 5,
    paddingRight: 0,
    color: "white",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  photo: {
    height: 68,
    width: 68,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "gray",
    shadowOpacity: 0.7,
    elevation: 5,
    borderWidth: 0,
    borderRadius: 34,
  },
  email: {
    fontSize: 13,
    //fontStyle: 'italic',
    marginTop: 6,
    color: "#595858",
    marginLeft: 4,
    // alignSelf: 'flex-end',

    // backgroundColor: 'gray',
  },
  image: {
    height: 22,
    width: 22,
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: 5,

    // justifyContent: 'center'
  },
  touchable: {
    alignItems: "center",
    justifyContent: "center",
  },

  SuggestTesttouch: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  titlesubview: {
    flex: 1,
    flexDirection: "row",
    //alignSelf: 'flex-end',
    // backgroundColor: 'green',
  },

  DRnamesubview: {
    flex: 1,
    flexDirection: "row",
    //alignSelf: 'flex-end',
    backgroundColor: "white",
  },
  sharebtnview: {
    flex: 0.15,
    flexDirection: "row",
    alignSelf: "flex-end",
    // height: 32,
    /// width: 30,
    //marginTop : 0,
    // paddingTop: 0,
    // backgroundColor: '#003484',
    // borderRadius: 11
  },

  Reportview: {
    //flex: 0.40,
    flexDirection: "row",
    alignSelf: "flex-end",
    height: 22,
    width: 100,
    marginLeft: 10,
    // paddingTop: 0,
    backgroundColor: "#003484",
    borderRadius: 11,
  },

  Mobilesubview: {
    flex: 1,
    flexDirection: "row",
    marginTop: 5,
    // alignSelf: 'flex-end',
  },
  Icons: {
    height: 22,
    width: 22,
    marginTop: 0,
  },
  Iconcall: {
    height: 15,
    width: 15,
    marginTop: 0,
  },
  Iconsemail: {
    height: 15,
    width: 15,
    marginTop: 4,
  },

  eyeicon: {
    height: 15,
    width: 15,
    marginTop: 0,
    paddingLeft: 2,
  },

  emailsubview: {
    flex: 1,
    flexDirection: "row",
    // alignSelf: 'flex-end',
    //justifyContent: 'space-between',
    // alignContent: 'flex-end',
    //marginTop:4,
    backgroundColor: "white",
  },

  DoctorProfile: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignContent: "flex-end",
    textAlign: "right",
    color: "black",
    fontSize: 11,
  },

  Separator: {
    height: 0.5,
    backgroundColor: "gray",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10,
  },
});

export default MyHealthCard;
