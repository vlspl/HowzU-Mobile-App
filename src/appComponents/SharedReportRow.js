import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";

const SharedReportRow = (props) => {
  // console.log(typeof props.viewreport != "undefined");
  return (
    <View style={{ flex: 1, flexDirection: "column", backgroundColor: "#fff" }}>
      <TouchableOpacity onPress={props.onPress}>
        <View style={styles.container}>
          <Image
            source={require("../../icons/tests-1.png")}
            style={{ height: 50, width: 50, marginTop: 10 }}
          />
          <View style={styles.container_text}>
            <View style={styles.DRnamesubview}>
              <Text style={styles.title}>{props.testname}</Text>
              <TouchableOpacity onPress={props.onPress}>
                <Image
                  source={props.checkbox}
                  //source={require('../../icons/calenadr.png')}

                  style={{
                    height: 20,
                    width: 20,
                    marginTop: 0,
                    marginRight: 10,
                    alignSelf: "flex-end",
                    alignContent: "stretch"
                  }}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.DRnamesubview}>
              <Image
                source={require("../../icons/calenadr.png")}
                style={{ height: 15, width: 15 }}
              />
              <Text
                style={{
                  flex: 1,
                  fontSize: 12,
                  color: "gray",
                  flexDirection: "row",
                  marginRight: 10,
                  fontWeight: "normal"
                }}
              >
                {props.TestSubtitle}
              </Text>
              {typeof props.viewreport != "undefined" && (
                <View style={styles.sharebtnview}>
                  <TouchableOpacity
                    style={styles.SuggestTesttouch}
                    onPress={props.onPressCheckStatus}
                  >
                    <Text style={styles.suggestbtnTitle}>
                      {props.viewreport}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{
          height: 0.5,
          backgroundColor: "gray",
          marginLeft: 15,
          marginRight: 10,
          marginTop: 0,
          padding: 0.5
        }}
      ></View>
    </View>
  );
};

const styles = StyleSheet.create({
  containermain: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "white"
  },
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 3,
    marginLeft: 15,
    marginRight: 5,
    marginTop: 0,
    marginBottom: 0,
    /// borderRadius: 5,
    backgroundColor: "#fff"
    //elevation: 2,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    flexDirection: "row",
    // backgroundColor: 'gray',
    marginRight: 10,
    fontWeight: "bold"
    //marginBottom:20
  },
  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    padding: 0,
    //justifyContent: 'center',
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
    elevation: 5,
    borderWidth: 0,
    borderRadius: 34
  },
  email: {
    fontSize: 12,
    //fontStyle: 'italic',
    color: "gray",
    marginLeft: 4,
    bottom: 20
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

  // DRnamesubview: {
  //   flex: 1,
  //   backgroundColor: "white",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   alignSelf: "center",
  //   marginLeft: 20,
  //   marginTop: 5
  // },

  DRnamesubview: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginLeft: 20,
    marginTop: 5
  },

  sharebtnview: {
    //flex: 0.30,
    flexDirection: "row",
    //marginTop:40,
    //marginRight:0,
    //alignSelf: 'flex-end',
    height: 22,
    width: 80,
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
    marginLeft: 5,
    marginTop: 0
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

export default SharedReportRow;
