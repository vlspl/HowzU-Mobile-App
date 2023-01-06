import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import ImageLoad from "react-native-image-placeholder";
import Constants from "../utils/Constants";

const SharedReportCountDoc = (props) => {
  // console.log(props.time, "props.time");
  return (
    <View style={styles.MyhealthcardView} key={props.index}>
      <TouchableOpacity style={{ flex: 1 }} onPress={props.OpenReportDetail}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={styles.photo}>
            <ImageLoad
              source={{ uri: Constants.PROFILE_PIC + props.ProfilePic }}
              style={styles.photo}
              placeholderSource={require("../../icons/Placeholder.png")}
              placeholderStyle={styles.photo}
              borderRadius={34}
            />
          </View>

          <View style={styles.container_text}>
            <View style={styles.titlesubview}>
              <View style={styles.DRnamesubview}>
                <Text style={styles.title}>{props.testname}</Text>
                <Text
                  style={{ fontSize: 11, textAlign: "center", color: "gray" }}
                >
                  {props.date1}
                </Text>
              </View>
            </View>
            {typeof props.time != "undefined" && (
              <View style={styles.emailsubview}>
                <View
                  style={{
                    backgroundColor: "white",
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <Image
                    source={require("../../icons/calenadr.png")}
                    style={styles.Iconsemail}
                  />
                  <Text style={styles.email}>{props.time}</Text>
                </View>
              </View>
            )}

            <View style={styles.emailsubview}>
              <View
                style={{
                  backgroundColor: "white",
                  flexDirection: "row",
                  flex: 1,
                  margin: 1,
                }}
              >
                <TouchableOpacity style={styles.touchable}>
                  <Image source={props.lablogo} style={styles.Iconsemail} />
                </TouchableOpacity>

                <Text
                  style={{
                    fontSize: 12,
                    marginTop: 7,
                    color: "#595858",
                    marginLeft: 4,
                  }}
                >
                  {props.date}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{
          height: 0.5,

          backgroundColor: "#d8d8d8",

          marginLeft: 5,
          marginRight: 0,
          marginTop: 10,
          padding: 0.5,
        }}
      />
    </View>
  );
};

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
    flexDirection: "column",
    padding: 4,
    marginLeft: 10,
    marginRight: 10,

    backgroundColor: "white",
  },
  title: {
    flex: 1,
    fontSize: 16,
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
    marginLeft: 15,
    justifyContent: "center",
    backgroundColor: "white",
  },
  description: {
    fontSize: 13,
    marginTop: 3,
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
    height: 50,
    width: 50,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "gray",
    shadowOpacity: 0.7,
    // elevation: 5,
    borderWidth: 0,
    borderRadius: 25,
  },
  email: {
    fontSize: 12,
    //fontStyle: 'italic',
    marginTop: 4,
    color: "#595858",
    marginLeft: 4,
    // alignSelf: "flex-end",

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
    height: 14,
    width: 14,
    marginTop: 4,
  },

  eyeicon: {
    height: 14,
    width: 14,
    marginTop: 0,
    paddingLeft: 2,
  },

  emailsubview: {
    flex: 1,

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

export default SharedReportCountDoc;
