import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { color } from "react-native-reanimated";
import ImageLoad from "react-native-image-placeholder";

var total = 0;
var temp = 0;
const PaymentHistoryCard = (props) => (
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
          <Image
            source={require("../../icons/calenadr.png")}
            style={{ height: 12, width: 15 }}
          />
          <Text
            style={{
              height: 20,
              fontSize: 12,
              color: "gray",
              textAlign: "center",
              backgroundColor: "white",
              paddingLeft: 2,
              marginTop: 0,
            }}
          >
            {props.testdate}
          </Text>
        </View>
        <View>
          {props.item.SubPaymentList.map((item, index) => {
            return (
              <View style={{ flex: 1, flexDirection: "column", marginTop: 3 }}>
                <View style={styles.Mobilesubview}>
                  <Text style={styles.description}>{item.TestName}</Text>
                  <Text
                    style={{
                      height: 20,
                      fontSize: 12,
                      color: "gray",
                      textAlign: "center",
                      backgroundColor: "white",
                      paddingLeft: 2,
                      marginTop: 0,
                    }}
                  >
                    {/* {'\u20A8'}{item.TestAmount}    this was changed to below */}
                    {`\u20B9 ${item.TestAmount} `}
                  </Text>
                </View>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 0,
                    marginRight: 0,
                    marginTop: 3,
                  }}
                ></View>
              </View>
            );
          })}
        </View>
        {
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginTop: 5,
              height: 20,
              backgroundColor: "white",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                padding: 2,
                color: "black",
                marginLeft: 2,
                flex: 1,
              }}
            >
              Total:
            </Text>
            <Text
              style={{
                height: 20,
                fontSize: 12,
                color: "black",
                textAlign: "center",
                backgroundColor: "white",
                paddingLeft: 2,
                marginTop: 0,
              }}
            >
              {/* changed to below {'Rs. ' + props.item.total} */}
              {`\u20B9 ${props.item.total} `}
            </Text>
          </View>
        }
      </View>
    </View>
    <View
      style={{
        height: 0.5,
        backgroundColor: "gray",
        marginLeft: 0,
        marginRight: 0,
        marginTop: 2,
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
    marginLeft: 10,
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
    height: 60,
    width: 60,
    shadowOffset: { width: 1, height: 2 },
    shadowColor: "lightgray",
    shadowOpacity: 0.9,

    borderWidth: 0,
    borderRadius: 30,
    // elevation:5
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
    backgroundColor: "#00397e",
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
    borderRadius: 30,
    elevation: 5,
  },
});

export default PaymentHistoryCard;
