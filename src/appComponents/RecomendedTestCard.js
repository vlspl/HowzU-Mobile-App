import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";

const RecomendedTestCard = (props) => (
  <View style={styles.MyhealthcardView}>
    <TouchableOpacity style={{ flex: 1 }} onPress={props.onPress}>
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View style={{ flex: 0.8, backgroundColor: "white" }}>
          <View style={styles.container_text}>
            <View style={styles.titlesubview}>
              <View style={styles.DRnamesubview}>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={2}
                  style={{
                    textAlign: "left",
                    backgroundColor: "white",
                    fontSize: 15,
                    marginLeft: 2,
                    flex: 1,
                    marginTop: 4,
                  }}
                >
                  {props.testname}
                </Text>
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
                  //source={require("../../icons/my-doctors.png")}
                  source={require("../../icons/my-doctors-b.png")}
                  style={styles.Iconcall}
                />
              </TouchableOpacity>
              <Text style={styles.description}>{props.docName}</Text>
            </View>

            <View
              style={{
                flex: 0.3,
                backgroundColor: "white",
                flexDirection: "row-reverse",
              }}
            >
              <View
                style={{
                  width: 80,
                  backgroundColor: "#003484",
                  borderRadius: 15,
                  height: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    alignSelf: "center",
                    fontSize: 10,
                    //marginLeft: 2,
                    //flex: 1,
                    marginTop: 1,
                    margin: 2,
                  }}
                >
                  Book Test
                </Text>
              </View>
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

  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    marginLeft: 5,
    justifyContent: "center",
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
    fontSize: 20,
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
    marginTop: 5,
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
    height: 15,
    width: 15,
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

export default RecomendedTestCard;
