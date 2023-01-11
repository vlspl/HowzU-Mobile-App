import React, { Fragment } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  RefreshControl
} from "react-native";
import Constants from "../../utils/Constants";
import axios from "axios";
import moment from "moment";
const Rijndael = require("rijndael-js");
import Loader from "../../appComponents/loader";
global.Buffer = global.Buffer || require("buffer").Buffer;
const padder = require("pkcs7-padding");
import Toast from "react-native-tiny-toast";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
const deviceWidth = Dimensions.get("screen").width;
const deviceHeight = Dimensions.get("screen").height;
import CustomeHeader from "../../appComponents/CustomeHeader";
import ImageLoad from "react-native-image-placeholder";
import AsyncStorage from "@react-native-community/async-storage";
export default class RegUserDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orgid: 0,
      scannedmobileno: 0,
      userDetails: [],
      isLoading: true
    };
  }
  componentDidMount() {
    AsyncStorage.getItem(Constants.ORG_ID).then((id) => {
      this.setState({ orgid: Number(JSON.parse(id)) });
    });
    this.setState(
      {
        userDetails: this.props.route.params.labinfo,
        isLoading: true
      },
      () => {
        // this.getProfileDetail();
      }
    );
  }
  async getProfileDetail() {
    try {
      const response = await axios.get(Constants.GET_USERPROFILE);
      this.setState({ isLoading: false });
      //Toast.show(response.data.Msg)
      // let responseData = this.state.userDetails;
      if (response.data.Status) {
        let responseData = [];
        let seetingitms = [];
        let tmp = {};
        // console.log(responseData, '@ getting profile pic  ResponaseData');
        response.data.MyDetails.map((item) => {
          // item.isShow=false;
          responseData.push(item);

          seetingitms.push(tmp);
        });

        this.setState(
          {
            userSettingDetails: seetingitms,
            userDetails: responseData,
            isLoading: false
          },
          () => { }
        );
      } else {
        // console.log(response.data.Msg, "else ");
        Toast.show(response.data.Msg);
      }
    } catch (error) {
      // Toast.show("Network Error,Please check youre internet connection");
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ isLoading: false });
      // console.log(error);
    }
    // console.log("../../wesle smfnffm..././././././.", this.state.activebtn);
  }
  UNSAFE_componentWillReceiveProps(nextProp) {
    AsyncStorage.getItem(Constants.ORG_ID).then((id) => {
      this.setState({ orgid: Number(JSON.parse(id)) });
    });
    this.setState(
      {
        userDetails: nextProp.route.params.labinfo,
        isLoading: true
      },
      () => {
        // this.getProfileDetail();
      }
    );
  }

  Decrypt = (encryptStr) => {
    // console.log(encryptStr, 'user proifle ');
    if (encryptStr) {
      const cipher = new Rijndael("1234567890abcder", "cbc");
      const plaintext = Buffer.from(
        cipher.decrypt(
          new Buffer(encryptStr, "base64"),
          128,
          "1234567890abcder"
        )
      );
      const decrypted = padder.unpad(plaintext, 32);
      const clearText = decrypted.toString("utf8");

      return clearText.toString();
    } else return "";
  };
  render() {
    return (
      <View style={styles.scrollViewStyle}>
        <Fragment>
          <CustomeHeader
            title="User Detail"
            headerId={1}
            navigation={this.props.navigation}
          />
          <View
            style={{
              // flex: 1,

              marginTop: 30,
              backgroundColor: "white"
            }}
          >
            <View
              style={{
                height: 100,
                justifyContent: "center",
                flexDirection: "row"
              }}
            >
              <ImageLoad
                source={{
                  uri: Constants.PROFILE_PIC + this.state.userDetails.ProfilePic
                }}
                style={{
                  height: 100,
                  width: 100,
                  shadowOffset: { width: 3, height: 3 },
                  shadowColor: "gray",
                  shadowOpacity: 0.7,
                  borderRadius: 50
                }}
                placeholderSource={require("../../../icons/Placeholder.png")}
                placeholderStyle={{
                  height: 100,
                  width: 100,
                  shadowOffset: { width: 3, height: 3 },
                  shadowColor: "gray",
                  shadowOpacity: 0.7,
                  borderRadius: 50
                }}
                borderRadius={50}
              />
            </View>
            <Text
              style={{
                height: 25,
                textAlign: "center",
                marginTop: 10,
                fontSize: 18,
                fontWeight: "bold"
              }}
            >
              {this.state.userDetails.FullName}
            </Text>
            <Text
              style={{
                height: 25,
                textAlign: "center",
                marginTop: 6,
                fontSize: 16,
                fontWeight: "normal",
                color: "gray"
              }}
            >
              {this.Decrypt(this.state.userDetails.EmailId)}
            </Text>
          </View>
          <ScrollView
            alwaysBounceVertical={true}
            showsHorizontalScrollIndicator={false}
          // style={{ backgroundColor: "white", marginTop: 0 }}
          >
            <View
              style={{
                backgroundColor: "white",
                flexDirection: "column",
                marginLeft: 15,
                marginRight: 15
              }}
            >
              <Text
                style={{
                  // height: 25,
                  textAlign: "left",
                  height: verticalScale(20),
                  // marginTop: 6,
                  fontSize: 16,
                  fontWeight: "bold"
                }}
              >
                DOB
              </Text>
              <Text
                style={{
                  height: verticalScale(20),
                  // height: 25,
                  textAlign: "left",
                  marginTop: 4,
                  fontSize: 14,
                  fontWeight: "normal",
                  color: "gray"
                }}
              >
                {this.state.userDetails.DOB}
              </Text>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginLeft: 0,
                  marginRight: 0,
                  marginTop: 3
                }}
              ></View>
            </View>
            <View
              style={{
                backgroundColor: "white",
                flexDirection: "column",
                marginLeft: 15,
                marginRight: 15
              }}
            >
              <Text
                style={{
                  height: verticalScale(20),
                  // height: 25,
                  textAlign: "left",
                  marginTop: 6,
                  fontSize: 16,
                  fontWeight: "bold"
                }}
              >
                Mobile
              </Text>
              <Text
                style={{
                  height: verticalScale(20),
                  // height: 25,
                  textAlign: "left",
                  marginTop: 4,
                  fontSize: 14,
                  fontWeight: "normal",
                  color: "gray"
                }}
              >
                {this.Decrypt(this.state.userDetails.Mobile)}
              </Text>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginLeft: 0,
                  marginRight: 0,
                  marginTop: 3
                }}
              ></View>
            </View>
            <View
              style={{
                backgroundColor: "white",
                flexDirection: "column",
                marginLeft: 15,
                marginRight: 15
              }}
            >
              <Text
                style={{
                  // height: 25,
                  height: verticalScale(20),
                  textAlign: "left",
                  marginTop: 6,
                  fontSize: 16,
                  fontWeight: "bold"
                }}
              >
                Gender
              </Text>
              <Text
                style={{
                  height: verticalScale(20),
                  // height: 25,
                  textAlign: "left",
                  marginTop: 4,
                  fontSize: 14,
                  fontWeight: "normal",
                  color: "gray",
                  marginLeft: 5
                }}
              >
                {this.state.userDetails.Gender}
              </Text>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginLeft: 0,
                  marginRight: 0,
                  marginTop: 3
                }}
              ></View>
            </View>

            <View
              style={{
                backgroundColor: "white",
                flexDirection: "column",
                marginLeft: 15,
                marginRight: 15
              }}
            >
              <Text
                style={{
                  height: verticalScale(20),
                  // height: 25,
                  textAlign: "left",
                  marginTop: 6,
                  fontSize: 16,
                  fontWeight: "bold"
                }}
              >
                Aadhar number
              </Text>
              <Text
                style={{
                  height: verticalScale(20),
                  // height: 25,
                  textAlign: "left",
                  marginTop: 4,
                  fontSize: 14,
                  fontWeight: "normal",
                  color: "gray",
                  marginLeft: 5
                }}
              >
                {this.Decrypt(this.state.userDetails.AadharCard)}
              </Text>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginLeft: 0,
                  marginRight: 0,
                  marginTop: 3
                }}
              ></View>
            </View>

            {/*  */}
            <View
              style={{
                backgroundColor: "white",
                flexDirection: "column",
                marginLeft: 15,
                marginRight: 15
              }}
            >
              <Text
                style={{
                  height: verticalScale(20),
                  // height: 25,
                  textAlign: "left",
                  marginTop: 6,
                  fontSize: 16,
                  fontWeight: "bold"
                }}
              >
                HealthId
              </Text>
              <Text
                style={{
                  height: verticalScale(20),
                  // height: 25,
                  textAlign: "left",
                  marginTop: 4,
                  fontSize: 14,
                  fontWeight: "normal",
                  color: "gray",
                  marginLeft: 5
                }}
              >
                {this.Decrypt(this.state.userDetails.HealthId)}
              </Text>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginLeft: 0,
                  marginRight: 0,
                  marginTop: 3
                }}
              ></View>
            </View>

            <View
              style={{
                backgroundColor: "white",
                flexDirection: "column",
                marginLeft: 15,
                marginRight: 15
              }}
            >
              <Text
                style={{
                  marginLeft: 3,
                  height: verticalScale(20),
                  // height: 25,
                  textAlign: "left",
                  marginTop: 6,
                  fontSize: 16,
                  fontWeight: "bold"
                }}
              >
                Address
              </Text>
              <Text
                style={{
                  marginLeft: 3,
                  height: verticalScale(20),
                  // height: 25,
                  textAlign: "left",
                  marginTop: 4,
                  fontSize: 14,
                  fontWeight: "normal",
                  color: "gray"
                }}
              >
                {this.state.userDetails.Address}
              </Text>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginLeft: 0,
                  marginRight: 0,
                  marginTop: 3
                }}
              ></View>
            </View>
            <View
              style={{
                backgroundColor: "white",
                flexDirection: "column",
                marginLeft: 15,
                marginRight: 15
              }}
            >
              <Text
                style={{
                  marginLeft: 3,
                  height: verticalScale(20),
                  // height: 25,
                  textAlign: "left",
                  marginTop: 6,
                  fontSize: 16,
                  fontWeight: "bold"
                }}
              >
                City
              </Text>
              <Text
                style={{
                  marginLeft: 3,
                  height: verticalScale(20),
                  // height: 25,
                  textAlign: "left",
                  marginTop: 4,
                  fontSize: 14,
                  fontWeight: "normal",
                  color: "gray"
                }}
              >
                {this.state.userDetails.City}
              </Text>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginLeft: 0,
                  marginRight: 0,
                  marginTop: 3
                }}
              ></View>
            </View>
            <View
              style={{
                backgroundColor: "white",
                flexDirection: "column",
                marginLeft: 15,
                marginRight: 15
              }}
            >
              <Text
                style={{
                  marginLeft: 3,
                  height: verticalScale(20),
                  // height: 25,
                  textAlign: "left",
                  marginTop: 6,
                  fontSize: 16,
                  fontWeight: "bold"
                }}
              >
                Pincode{" "}
              </Text>
              <Text
                style={{
                  height: verticalScale(20),
                  marginLeft: 3,
                  // height: 25,
                  textAlign: "left",
                  marginTop: 4,
                  fontSize: 14,
                  fontWeight: "normal",
                  color: "gray"
                }}
              >
                {this.state.userDetails.Pincode}
              </Text>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginLeft: 0,
                  marginRight: 0,
                  marginTop: 3
                }}
              ></View>
            </View>
          </ScrollView>
        </Fragment>
      </View>
    );
  }
}

const overlayColor = "rgba(0,0,0,0.5)"; // this gives us a black color with a 50% transparency

const rectDimensions = deviceWidth * 0.65; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = deviceWidth * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = "#fff";

const scanBarWidth = deviceWidth * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = deviceWidth * 0.0025; //this is equivalent to 1 from a 393 device width
const scanBarColor = "#275BB4";

const iconScanColor = "blue";
const styles = StyleSheet.create({
  rectangleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  resultContainer: {
    flex: 1,
    marginTop: 30,
    backgroundColor: "white"
  },
  rectangle: {
    height: rectDimensions,
    width: rectDimensions,
    borderWidth: rectBorderWidth,
    borderColor: rectBorderColor,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: 10
  },

  topOverlay: {
    flex: 1,
    height: deviceWidth,
    width: deviceWidth,
    backgroundColor: overlayColor,
    justifyContent: "center",
    alignItems: "center"
  },

  bottomOverlay: {
    flex: 1,
    height: deviceWidth,
    width: deviceWidth,
    backgroundColor: overlayColor,
    paddingBottom: deviceWidth * 0.25
  },

  leftAndRightOverlay: {
    height: deviceWidth * 0.65,
    width: deviceWidth,
    backgroundColor: overlayColor
  },

  scanBar: {
    width: scanBarWidth,
    height: scanBarHeight,
    backgroundColor: scanBarColor
  },
  scrollViewStyle: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "white"
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "10%",
    paddingLeft: 15,
    paddingTop: 10,
    width: deviceWidth
  },
  textTitle: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    padding: 16,
    color: "red"
  },
  textTitle1: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    padding: 16,
    color: "white"
  },
  cardView: {
    width: deviceWidth - 32,
    height: deviceHeight - 350,
    alignSelf: "center",
    justifyContent: "flex-start",
    alignItems: "center",
    // flex: 1,
    borderRadius: 10,
    padding: 25,
    marginLeft: 5,
    marginRight: 5,
    marginTop: "10%",
    backgroundColor: "white"
  },
  scanCardView: {
    width: deviceWidth - 32,
    height: deviceHeight / 2,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 25,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    backgroundColor: "white"
  },
  buttonWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  buttonScan: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#258ce3",
    paddingTop: 5,
    paddingRight: 25,
    paddingBottom: 5,
    paddingLeft: 25,
    marginTop: 20
  },
  buttonScan2: {
    marginLeft: deviceWidth / 2 - 50,
    width: 100,
    height: 100
  },
  descText: {
    padding: 16,
    textAlign: "center",
    fontSize: 16
  },
  highlight: {
    fontWeight: "700"
  },
  centerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    padding: 32,
    color: "white"
  },
  textBold: {
    fontWeight: "500",
    color: "#000"
  },
  bottomContent: {
    width: deviceWidth,
    height: 120
  },
  buttonTouchable: {
    fontSize: 21,
    backgroundColor: "white",
    marginTop: 32,
    width: deviceWidth - 62,
    justifyContent: "center",
    alignItems: "center",
    height: 44
  },
  buttonTextStyle: {
    color: "black",
    fontWeight: "bold"
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777"
  },
  textBold: {
    fontWeight: "500",
    color: "#000"
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)"
  },
  buttonTouchable: {
    padding: 16
  },

  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10
  },
  button: {
    marginHorizontal: 10
  },
  imageContainer: {
    // justifyContent: 'center',
    alignItems: "center",
    flex: 1
  },
  image: {
    marginVertical: 15,
    height: 300, //DEFAULT_HEIGHT / 2.5,
    width: 300 //DEFAULT_WITH / 2.5,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
    // marginTop: 0,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
    margin: 10
  },
  // Scanner
  Scannercontainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  finder: {
    alignItems: "center",
    justifyContent: "center"
  },
  topLeftEdge: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
    height: 20
  },
  topRightEdge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 20
  },
  bottomLeftEdge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 40,
    height: 20
  },
  bottomRightEdge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 20
  }
});
