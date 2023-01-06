import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import ImageLoad from "react-native-image-placeholder";
import Constants from "../utils/Constants";

const FamilyMemberCard = (props) => (
  <View style={{ flex: 1, flexDirection: "column", backgroundColor: "white" }}>
    <TouchableOpacity onPress={props.onPressRow}>
      <View style={styles.container}>
        <View style={styles.photo}>
          <ImageLoad
            source={{ uri: Constants.PROFILE_PIC + props.ProfilePic }}
            style={styles.photo}
            placeholderSource={require("../../icons/Placeholder.png")}
            placeholderStyle={styles.placeholder}
            borderRadius={34}
          />
        </View>

        <View style={styles.container_text}>
          <View style={styles.titlesubview}>
            <View style={styles.DRnamesubview}>
              <Text style={styles.title}>{props.name}</Text>
              <TouchableOpacity onPress={props.onPressClose}>
                <Image
                  source={require("../../icons/close.png")}
                  style={{ height: 20, width: 20, padding: 0.5 }}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                height: 20,
                fontSize: 14,
                color: "black",
                textAlign: "center",
                backgroundColor: "white",
                paddingLeft: 2,
                marginTop: 0,
              }}
            ></Text>
          </View>

          <View style={styles.emailsubview}>
            <View
              style={{
                backgroundColor: "white",
                flexDirection: "row",
                flex: 1,
              }}
            >
              <TouchableOpacity style={styles.touchable}>
                <Image
                  source={require("../../icons/relation.png")}
                  style={{ height: 16, width: 18 }}
                />
              </TouchableOpacity>
              <Text style={styles.email}>{props.relation}</Text>
            </View>

            <View style={styles.Approvebtnview}>
              {props.RequestStatus == "Pending" ? (
                <TouchableOpacity style={styles.SuggestTesttouch}>
                  <Text
                    style={{
                      fontSize: 10,
                      marginRight: 0,
                      paddingRight: 0,
                      color: "#275BB4",
                      textAlign: "right",
                      //alignItems: 'center',
                      //justifyContent: 'center',
                      fontWeight: "bold",
                      backgroundColor: "white",
                    }}
                  >
                    Approval Pending
                  </Text>
                </TouchableOpacity>
              ) : null}

              {props.RequestStatus != "Pending" &&
              props.RequestStatus != "Verification Pending" ? (
                <TouchableOpacity style={styles.SuggestTesttouch}>
                  <Text
                    style={{
                      fontSize: 10,
                      marginRight: 0,
                      paddingRight: 0,
                      color: "#275BB4",
                      textAlign: "right",
                      //alignItems: 'center',
                      //justifyContent: 'center',
                      fontWeight: "bold",
                      backgroundColor: "white",
                    }}
                  >
                    Remove Member
                  </Text>
                </TouchableOpacity>
              ) : null}

              {props.RequestStatus == "Verification Pending" ? (
                <TouchableOpacity
                  style={styles.SuggestTesttouch}
                  onPress={props.onPress}
                >
                  <Text style={styles.suggestbtnTitle}>
                    Verification Pending
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          height: 0.5,
          backgroundColor: "gray",
          marginLeft: 15,
          marginRight: 10,
          marginTop: 5,
        }}
      ></View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  containermain: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 3,
    marginLeft: 10,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 2,

    backgroundColor: "white",
  },
  title: {
    flex: 1,
    fontSize: 15,
    color: "#2b2b2b",
    flexDirection: "row",
    // backgroundColor: 'gray',
    marginRight: 12,
    fontWeight: "bold",
    //color:'black'
  },
  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    padding: 5,
    justifyContent: "center",
    backgroundColor: "white",
    marginLeft: 5,
  },
  description: {
    fontSize: 12,
    //marginTop: 4,
    padding: 2,
    color: "gray",
    marginLeft: 2,
    flex: 1,
    /// backgroundColor: 'gray',
  },
  suggestbtnTitle: {
    // flex:1,
    fontSize: 10,
    marginRight: 0,
    paddingRight: 0,
    color: "orange",
    textAlign: "right",
    //alignItems: 'center',
    //justifyContent: 'center',
    fontWeight: "bold",
    backgroundColor: "white",
  },
  photo: {
    height: 60,
    width: 60,
    shadowOffset: { width: 1, height: 2 },
    shadowColor: "lightgray",
    shadowOpacity: 0.9,
    // elevation: 2,
    borderWidth: 0,
    borderRadius: 30,
  },
  email: {
    fontSize: 12,
    //fontStyle: 'italic',
    marginTop: 0,
    color: "#3f3f3f",
    marginLeft: 5,
    alignSelf: "center",
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
    // alignItems: 'center',
    //justifyContent: 'center',
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
  Approvebtnview: {
    //flex: 0.30,
    flexDirection: "row",
    alignSelf: "flex-end",
    height: 20,
    width: 150,
    //marginTop : 0,
    // paddingTop: 0,
    backgroundColor: "white",
    // borderRadius: 11
  },
  Rejectbtnview: {
    flex: 0.3,
    flexDirection: "row",
    //alignSelf: 'flex-end',
    height: 20,
    //width: 150,
    marginLeft: 5,
    // paddingTop: 0,
    backgroundColor: "#dc143c",
    borderRadius: 11,
  },

  Mobilesubview: {
    flex: 1,
    flexDirection: "row",
    marginTop: 5,
    // alignSelf: 'flex-end',
    // backgroundColor:'yellow'
  },
  Icons: {
    height: 15,
    width: 15,
    marginTop: 2,
  },

  emailsubview: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    justifyContent: "space-between",
    alignContent: "flex-end",
    marginTop: 4,
    // backgroundColor:'yellow'
  },

  DoctorProfile: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignContent: "flex-end",
    textAlign: "right",
    color: "gray",
    fontSize: 11,
  },

  Separator: {
    height: 0.5,
    backgroundColor: "gray",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10,
  },
  placeholder: {
    height: 60,
    width: 60,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "white",
    shadowOpacity: 0.7,
    borderWidth: 0,
    // elevation: 5,
    borderRadius: 30,
  },
});

export default FamilyMemberCard;
