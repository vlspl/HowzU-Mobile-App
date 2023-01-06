import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import ImageLoad from "react-native-image-placeholder";
import Constants from "../utils/Constants";

const AllPatientRow = (props) => (
  <TouchableOpacity onPress={props.onPress}>
    <View style={styles.containermainn}>
      <View style={styles.container}>
        <View style={styles.photo}>
          <ImageLoad
            source={{ uri: Constants.PROFILE_PIC + props.ProfilePic }}
            style={styles.photo}
            placeholderSource={require("../../icons/Placeholder.png")}
            placeholderStyle={styles.placeholder}
            borderRadius={34}
          />
          <Image
            source={props.checkbox}
            style={{
              zIndex: 1,
              height: 25,
              width: 25,
              marginTop: -50,
              marginLeft: 0,
            }}
          />
        </View>
        <View style={styles.container_text}>
          <View style={styles.DRnamesubview}>
            <Text style={styles.title}>{props.patientname}</Text>
          </View>
          <View style={styles.Mobilesubview}>
            <Image
              source={require("../../icons/call.png")}
              style={styles.Iconcall}
            />
            <Text
              style={{
                marginLeft: 3,
                marginRight: 10,
                marginTop: 5,
                color: "#A9A9A9",
                fontSize: 14,
              }}
            >
              {props.mobile}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
          <View style={styles.sharebtnview}>
            <TouchableOpacity style={styles.SuggestTesttouch}>
              <Image style={styles.Icons} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          ></View>
        </View>
      </View>
      <View
        style={{
          height: 0.5,
          backgroundColor: "gray",
          marginLeft: 10,
          marginRight: 10,
          marginTop: 5,
        }}
      ></View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  containermain: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "white",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: "white",
    //elevation: 2,
  },
  containermainn: {
    flex: 1,
    flexDirection: "column",
    padding: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: "white",
    //elevation: 2,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    flexDirection: "row",
    // backgroundColor: 'gray',
    marginRight: 10,
    fontWeight: "bold",
  },
  container_text: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 15,
    justifyContent: "center",
    backgroundColor: "white",
  },
  description: {
    fontSize: 15,
    color: "#595858",
    marginBottom: 25,
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
  endTextName: {
    // flex:1,

    marginTop: 10,
    marginRight: 10,
    marginBottom: 5,
    color: "#003484",
    fontSize: 11,
    fontWeight: "bold",
  },
  header: {
    // flex:1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 5,
    fontSize: 22,
    fontWeight: "bold",
    color: "#003484",
  },
  photo: {
    height: 60,
    width: 60,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "gray",
    shadowOpacity: 0.7,
    marginLeft: 5,
    borderWidth: 0,
    borderRadius: 34,
    // elevation: 5,
  },
  placeholder: {
    height: 60,
    width: 60,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "white",
    shadowOpacity: 0.7,
    borderWidth: 0,
    borderRadius: 34,
    elevation: 5,
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
    justifyContent: "flex-end",
    marginEnd: 15,
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
    marginLeft: 10,
  },
  sharebtnview: {
    flex: 0.15,
    flexDirection: "row",
    alignSelf: "flex-start",
    //height: 32,
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
    marginBottom: 10,

    // alignSelf: 'flex-end',
  },
  Icons: {
    height: 20,
    width: 20,
    marginTop: 0,
  },
  IconsHeader: {
    height: 20,
    width: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  Iconcall: {
    height: 18,
    width: 18,
    marginTop: 5,
    marginLeft: 10,
  },
  Iconsemail: {
    height: 15,
    width: 15,
    marginTop: 6,
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
    marginTop: 5,
  },
});

export default AllPatientRow;
