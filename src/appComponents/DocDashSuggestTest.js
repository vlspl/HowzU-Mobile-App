import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";

const DocDashSuggestTest = (props) => (
  <View style={styles.MyhealthcardView} key={props.index}>
    <TouchableOpacity style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
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
          <View style={styles.Mobilesubview}>
            <TouchableOpacity style={styles.touchable}>
              <Image
                // source={require("../../icons/lab.png")}
                source={require("../../icons/lab-1.png")}
                //source = {{uri:'https://reactnative.dev/img/tiny_logo.png'}}
                style={styles.Iconcall}
              />
            </TouchableOpacity>
            <Text style={styles.description}>{props.labname}</Text>
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
                  // source={require("../../icons/calenadr.png")}
                  // source={require("../../icons/date-of-birth.png")}
                  source={require("../../icons/tests-1.png")}
                  style={styles.Iconsemail}
                />
              </TouchableOpacity>

              <Text style={styles.email} numberOfLines={1}>
                {props.date}
              </Text>
            </View>
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
    padding: 6,
    margin: 8,
    backgroundColor: "white",
    width: 320,
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
    marginLeft: 5,
    justifyContent: "center",
    backgroundColor: "white",
  },
  description: {
    fontSize: 13,
    marginTop: 4,
    color: "#595858",
    marginLeft: 5,
    alignSelf: "center",
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
    fontSize: 12,
    //fontStyle: 'italic',
    marginTop: 5,
    color: "#595858",
    marginLeft: 4,
    marginRight: 10,
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
    height: 23,
    width: 23,
    marginTop: 0,
  },
  Iconsemail: {
    height: 16,
    width: 16,
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

export default DocDashSuggestTest;
