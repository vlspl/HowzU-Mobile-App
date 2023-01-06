import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";

const RecentTestCard = (props) => (
  <View style={styles.MyhealthcardView} key={props.index}>
    <TouchableOpacity style={{ flex: 1 }} onPress={props.OpenReportDetail}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={styles.container_text}>
          <View style={styles.titlesubview}>
            <View style={styles.DRnamesubview}>
              <Text style={styles.title}>{props.patientname}</Text>
              <Text
                style={{ fontSize: 10, textAlign: "center", color: "gray" }}
              >
                {props.date}
              </Text>
            </View>
          </View>
          <View style={styles.Mobilesubview}>
            <TouchableOpacity style={styles.touchable}>
              <Image
                source={require("../../icons/call.png")}
                style={styles.Iconcall}
              />
            </TouchableOpacity>
            <Text style={styles.description}>{props.mobile}</Text>
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
                  // source={require("../../icons/Book-Test-g.png")}
                  source={require("../../icons/tests-1.png")}
                  style={styles.Iconsemail}
                />
              </TouchableOpacity>
              <Text style={styles.email}>{props.email}</Text>
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

  Horizontalcard: {
    flex: 1,
    flexDirection: "column",
    padding: 10,
    margin: 10,
    backgroundColor: "white",
    width: 145,
    height: 145,
    borderWidth: 1,
    borderColor: "lightgray",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "lightgray",
    shadowOpacity: 0.9,
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
    // justifyContent:'center',
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
    margin: 8,
    backgroundColor: "white",
    width: 320,
    height: 90,
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
    fontSize: 12,
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
    marginTop: 4,
    color: "#595858",
    marginLeft: 5,
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
    height: 20,
    width: 20,
    marginTop: 0,
  },
  Iconsemail: {
    height: 21,
    width: 21,
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

export default RecentTestCard;
