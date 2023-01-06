import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { color } from "react-native-reanimated";
import ImageLoad from "react-native-image-placeholder";

const BookAppointmentLabComp = (props) => (
  <View style={{ flex: 1, flexDirection: "column", backgroundColor: "white" }}>
    <View style={styles.container}>
      <View style={styles.photo}>
        {/* <Image source={props.lablogo} style={styles.photo} /> */}
        <ImageLoad
          source={props.lablogo}
          style={styles.photo}
          placeholderSource={require("../../icons/lab-1.png")}
          placeholderStyle={styles.placeholder}
          borderRadius={34}
        />
      </View>

      <View style={styles.container_text}>
        <View style={styles.titlesubview}>
          <View style={styles.DRnamesubview}>
            <Text style={styles.title}>{props.labname}</Text>
          </View>
          {/* <Image
             source={require('../../icons/lab.png')}
             style={{height:12,width:15}} /> */}
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
          >
            {props.price}
          </Text>
        </View>
        <View style={styles.Mobilesubview}>
          <TouchableOpacity style={styles.touchable}>
            <Image
              source={require("../../icons/call.png")}
              style={{ height: 20, width: 20 }}
            />
          </TouchableOpacity>
          <Text style={styles.description}>{props.phone}</Text>
        </View>
        <View style={styles.emailsubview}>
          <View
            style={{ backgroundColor: "white", flexDirection: "row", flex: 1 }}
          >
            <Text style={styles.email}>{props.address}</Text>
          </View>

          <View style={styles.sharebtnview}></View>
        </View>
      </View>
    </View>
    <View
      style={{
        height: 0.5,
        backgroundColor: "gray",
        marginRight: 5,
        marginTop: 5,
      }}
    ></View>
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
    marginRight: 5,
    marginTop: 5,
    marginBottom: 2,
    //borderRadius: 5,
    backgroundColor: "white",
    //elevation: 2,
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
    marginLeft: 10,
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
    fontSize: 9,
    marginRight: 0,
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
    shadowOffset: { width: 1, height: 2 },
    shadowColor: "lightgray",
    shadowOpacity: 0.9,
    // elevation: 5,
    borderWidth: 0,
    borderRadius: 34,
  },
  placeholder: {
    height: 68,
    width: 68,
    shadowOffset: { width: 1, height: 2 },
    shadowColor: "lightgray",
    shadowOpacity: 0.9,
    // elevation: 5,
    borderWidth: 0,
    borderRadius: 34,
  },
  email: {
    fontSize: 12,
    //fontStyle: 'italic',
    marginTop: 3,
    color: "#3f3f3f",
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
    flex: 0.35,
    flexDirection: "row",
    //alignSelf: 'flex-end',
    height: 22,
    //width: 150,
    //marginTop : 0,
    // paddingTop: 0,
    backgroundColor: "white",
    //borderRadius: 11
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
});

export default BookAppointmentLabComp;
