import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import ImageLoad from "react-native-image-placeholder";
import Constants from "../utils/Constants";

const AllDocListComp = (props) => (
  <TouchableOpacity onPress={props.onPress}>
    <View style={{ flex: 1, flexDirection: "column" }}>
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
            <Text style={styles.title}>{props.docname}</Text>
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
                marginBottom: 5,
                color: "#A9A9A9",
                fontSize: 13.5,
              }}
            >
              {props.mobile}
            </Text>
          </View>

          <View style={styles.Mobilesubview}>
            <Image
              source={require("../../icons/location.png")}
              // source={require('../../icons/email-1.png')}
              style={styles.Iconcall}
            />
            <Text
              style={{
                marginLeft: 3,
                marginRight: 10,
                marginBottom: 5,
                color: "#A9A9A9",
                fontSize: 13.5,
                width: 100,
              }}
              numberOfLines={1}
            >
              {props.address}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-end",
            flex: 1,
            marginBottom: 20,
          }}
        >
          <View style={styles.sharebtnview}>
            {!props.item.isShow ? (
              <TouchableOpacity
                style={[styles.SuggestTesttouch]}
                onPress={() => props.showOrhide(props.item, props.isShow)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    // width: 100,
                  }}
                >
                  <Text style={styles.endTextName}>More Details</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.SuggestTesttouch}
                onPress={() => props.showOrhide(props.item, props.isShow)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    width: 100,
                  }}
                >
                  <Text style={styles.endTextName}>Less</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.sharebtnview}>
            <TouchableOpacity style={styles.SuggestTesttouch1}>
              <Image
                source={require("../../icons/Heart.png")}
                style={styles.Icons2}
              />
            </TouchableOpacity>
            <Text style={styles.endTextName1}>{props.specilization}</Text>
          </View>
        </View>
      </View>
      {props.item.isShow ? (
        <View
          style={{
            height: 70,
            backgroundColor: "white",
            flexDirection: "column",
          }}
        >
          <View
            style={{
              height: 0.5,
              backgroundColor: "#d8d8d8",
              marginLeft: 15,
              marginRight: 10,
              marginTop: 5,
              padding: 0.5,
            }}
          ></View>
          <Text
            style={{
              marginLeft: 15,
              marginTop: 5,
              marginBottom: 5,
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            EXPERIENCE
          </Text>
          <View
            style={{
              flexDirection: "row",
              height: 20,
              backgroundColor: "white",
              marginLeft: 15,
              marginRight: 15,
            }}
          >
            <Image
              source={require("../../icons/lab.png")}
              style={{ height: 15, width: 15 }}
            />
            <Text style={{ marginLeft: 15, color: "gray" }}>
              {props.item.Specialization}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              height: 20,
              backgroundColor: "white",
              marginLeft: 15,
              marginRight: 15,
            }}
          >
            <Image
              source={require("../../icons/qulification.png")}
              style={{ height: 15, width: 15 }}
            />
            <Text style={{ marginLeft: 15, color: "gray" }}>
              {props.item.Degree}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              height: 20,
              backgroundColor: "white",
              marginLeft: 15,
              marginRight: 15,
            }}
          ></View>
        </View>
      ) : null}
    </View>
    <View
      style={{
        flex: 1,
        height: 0.5,
        backgroundColor: "#d8d8d8",
        marginLeft: 15,
        marginRight: 10,
        marginTop: 10,
        padding: 0.5,
      }}
    ></View>
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
  title: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    flexDirection: "row",
    marginLeft: 10,
    // backgroundColor: 'gray',
    marginRight: 10,
    fontWeight: "bold",
  },
  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
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

    marginTop: 4,
    marginRight: 10,
    marginBottom: 5,
    color: "#003484",
    fontSize: 11.5,
    fontWeight: "bold",
  },
  endTextName1: {
    // flex:1,

    marginTop: 10,
    marginRight: 5,
    marginLeft: 5,
    marginBottom: 5,
    color: "grey",
    fontSize: 12,
  },
  Icons: {
    height: 20,
    width: 20,
  },
  Icons1: {
    height: 20,
    width: 20,
    marginRight: 10,
  },
  Icons2: {
    height: 15,
    width: 15,
    marginTop: 5,
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
    height: 50,
    width: 50,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "gray",
    shadowOpacity: 0.7,
    marginLeft: 5,
    // elevation: 5,
    borderWidth: 0,
    borderRadius: 25,
  },
  placeholder: {
    height: 50,
    width: 50,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "white",
    shadowOpacity: 0.7,
    borderWidth: 0,
    borderRadius: 25,
    // elevation: 5,
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
    marginEnd: 5,
    // height: 20,
    marginBottom: 6,
    // padding: 12,
  },
  SuggestTesttouch1: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
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
    alignSelf: "flex-start",
    // height: 32,
    // width: 30,
    // marginTop: 0,
    // paddingTop: 0,
    // backgroundColor: "#003484",
    // borderRadius: 11,
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

    // alignSelf: 'flex-end',
  },

  IconsHeader: {
    height: 20,
    width: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  Iconcall: {
    height: 15,
    width: 15,
    marginTop: 1,
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

export default AllDocListComp;
