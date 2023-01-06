import React from "react";
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  Platform
} from "react-native";

const TestListRow = (props) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.container_text}>
        <View style={styles.titlesubview}>
          <View style={styles.DRnamesubview}>
            <Text style={styles.title}>{props.testname}</Text>
          </View>
          <TouchableOpacity
            style={{
              flex: 0.1,
              justifyContent: "flex-end",
              alignItems: "flex-end",
              marginRight: 3
            }}
            onPress={props.onPress}
          >
            <Image
              source={props.checkboximg}
              style={{
                height: 20,
                width: 20,
                marginRight: 10,
                alignSelf: "flex-end",
                alignContent: "stretch"
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.Mobilesubview}>
          <Text style={styles.description}>{props.profile}</Text>
        </View>

        {props.price != undefined && (
          <View style={styles.Mobilesubview}>
            <Text style={styles.description}>{props.price}</Text>
          </View>
        )}
      </View>

      <View
        style={{
          height: 0.5,
          backgroundColor: "#d8d8d8",
          // backgroundColor: 'gray',
          marginLeft: 3,
          marginRight: 3,
          marginTop: 10,
          padding: 0.5
        }}
      ></View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  containermain: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "white"
  },
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 3,
    marginLeft: Platform.OS === "ios" ? 15 : 0,
    marginRight: Platform.OS === "ios" ? 5 : 0,
    marginTop: Platform.OS === "ios" ? 5 : 0,
    marginBottom: Platform.OS === "ios" ? 2 : 0,
    borderRadius: Platform.OS === "ios" ? 5 : 0,
    backgroundColor: "white"
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    flexDirection: "row",
    // backgroundColor: 'gray',
    marginRight: 10,
    marginLeft: 3
    // fontWeight: 'bold'
  },
  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    padding: 0,
    justifyContent: "center",
    backgroundColor: "white"
  },
  description: {
    fontSize: 12,
    //marginTop: 4,
    padding: 2,
    color: "gray",
    marginLeft: 2,
    flex: 1
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
    fontWeight: "bold"
  },
  photo: {
    height: 68,
    width: 68,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "gray",
    shadowOpacity: 0.7,
    // elevation: 5,
    borderWidth: 0,
    borderRadius: 34
  },
  email: {
    fontSize: 12,
    //fontStyle: 'italic',
    marginTop: 3,
    color: "gray",
    marginLeft: 4
    // alignSelf: 'flex-end',

    // backgroundColor: 'gray',
  },
  image: {
    height: 22,
    width: 22,
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: 5

    // justifyContent: 'center'
  },
  touchable: {
    alignItems: "center",
    justifyContent: "center"
  },

  SuggestTesttouch: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  titlesubview: {
    flex: 1,
    flexDirection: "row"
    //alignSelf: 'flex-end',
    // backgroundColor: 'green',
  },

  DRnamesubview: {
    flex: 1,
    flexDirection: "row",
    //alignSelf: 'flex-end',
    backgroundColor: "white"
  },
  sharebtnview: {
    flex: 0.3,
    flexDirection: "row",
    //alignSelf: 'flex-end',
    height: 22,
    //width: 150,
    //marginTop : 0,
    // paddingTop: 0,
    backgroundColor: "#003484",
    borderRadius: 11
  },

  Mobilesubview: {
    flex: 1,
    flexDirection: "row",
    marginTop: 5
    // alignSelf: 'flex-end',
    // backgroundColor:'yellow'
  },
  Icons: {
    height: 15,
    width: 15,
    marginTop: 2
  },

  emailsubview: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    justifyContent: "space-between",
    alignContent: "flex-end",
    marginTop: 4
    // backgroundColor:'yellow'
  },

  DoctorProfile: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignContent: "flex-end",
    textAlign: "right",
    color: "gray",
    fontSize: 11
  },

  Separator: {
    height: 0.5,
    backgroundColor: "gray",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10
  }
});

export default TestListRow;
