import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";

const RecentTestCard = (props) => (
  <View style={styles.MyhealthcardView} key={props.index}>
    <TouchableOpacity style={{ flex: 1 }} onPress={props.onPress}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 0.75, backgroundColor: "white" }}>
          <View style={styles.container_text}>
            <View style={styles.titlesubview}>
              <View style={styles.DRnamesubview}>
                <Text style={styles.title} numberOfLines={1}>
                  {props.testname}
                </Text>
              </View>
            </View>
            <View style={styles.Mobilesubview}>
              <TouchableOpacity style={styles.touchable}>
                <Image
                  // source={require("../../icons/lab.png")}
                  source={require("../../icons/lab-1.png")}
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
                    source={require("../../icons/date-of-birth.png")}
                    style={styles.Iconsemail}
                  />
                </TouchableOpacity>

                <Text style={styles.email}>{props.date}</Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{ flex: 0.25, backgroundColor: "white", alignItems: "center" }}
        >
          <View
            style={{
              height: 50,
              width: 50,
              // borderRadius: 25,
              borderColor: "lightgray",
              // borderWidth: 1,
              marginTop: 4,
              overflow: "hidden",
              shadowOffset: { width: 1, height: 3 },
              // shadowColor: "gray",
              shadowOpacity: 0.8,
            }}
          >
            <Image style={{ height: 40, width: 40 }} source={props.lablogo} />
          </View>
          <View
            style={{
              flex: 1,
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                textAlign: "left",
                backgroundColor: "white",
                fontSize: 11,
                color: "green",
                marginTop: scale(2),
                marginLeft: -7,
              }}
            >
              {props.teststatus}
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
    alignItems: "center",
    elevation: 5,
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
    margin: 10,
    backgroundColor: "white",
    width: 250,
    height: 90,
    borderWidth: 1,
    borderColor: "#FFFFF0",
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
    fontSize: 11,
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
    fontSize: 11,
    //fontStyle: 'italic',
    marginTop: 5,
    color: "#595858",
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
    height: 23,
    width: 23,
    marginTop: 0,
  },
  Iconcall: {
    height: 23,
    width: 23,
    marginTop: 1,
  },
  Iconsemail: {
    height: 19,
    width: 19,
    marginTop: 5,
    padding: 1,
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
