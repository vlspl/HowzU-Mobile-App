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
import QRCodeScanner from "react-native-qrcode-scanner";
import CustomeHeader from "../../appComponents/CustomeHeader";
import ImageLoad from "react-native-image-placeholder";
import AsyncStorage from "@react-native-community/async-storage";

export default class ScanQRcode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scan: true,
      ScanResult: false,
      result: null,
      orgid: 0,
      scannedmobileno: 0,
      userid: 0,
      isLoading: false
    };
  }
  componentDidMount() {
    AsyncStorage.getItem(Constants.ORG_ID).then((id) => {
      this.setState({ orgid: Number(JSON.parse(id)) });
    });
    this.setState({ scan: true, ScanResult: false, result: null });
  }
  UNSAFE_componentWillReceiveProps() {
    AsyncStorage.getItem(Constants.ORG_ID).then((id) => {
      this.setState({ orgid: Number(JSON.parse(id)) });
    });
    this.setState({ scan: true, ScanResult: false, result: null });
  }
  makeSlideOutTranslation(translationType, fromValue) {
    return {
      from: {
        [translationType]: deviceWidth * -0.18
      },
      to: {
        [translationType]: fromValue
      }
    };
  }
  onSuccess = (e) => {
    // console.log(
    //   e.data.substring(0),
    //   "scanned ",
    //   e.data,
    //   "length of edata ",
    //   isNaN(e.data)
    // );
    let parseddata = JSON.parse(e.data);
    console.log(parseddata.FullName, "====scanned "); //undefined for empty
    const check = e.data.substring(0, 4);
    console.log("scanned data" + check);
    this.setState({
      result: JSON.parse(e.data),
      scan: false,
      ScanResult: true,
      scannedmobileno: this.Decrypt(parseddata.Mobile),
      userid: parseddata.UserId
    });
    if (check === "http") {
      Linking.openURL(e.data).catch((err) =>
        console.error("An error occured", err)
      );
    } else if (e.data.length > 1) {
      this.setState({
        result: parseddata,
        scan: false,
        ScanResult: true
      });
    } else {
      console.log("????????");
      Toast.show("Something Went Wrong ,Try Again Later");

      this.setState({
        scan: false,
        ScanResult: false
      });
    }
  };
  activeQR = () => {
    this.setState({ scan: true });
  };
  scanAgain = () => {
    this.setState({ scan: true, ScanResult: false });
  };
  OnProcess = async () => {
    console.log(
      "./.?????org Scanned Users ==============",
      this.state.userid,
      this.state.org_id,
      this.state.orgid != 0
    );
    this.setState({ isLoading: true });
    if (this.state.orgid != 0) {
      try {
        let response = await axios.post(Constants.PROCESS_SCANNED_USER_REG, {
          UserId: this.state.userid,
          healthcampId: 1,
          org_id: this.state.orgid
        });
        console.log(
          "./.?????org Suggested test==============",
          response.data,
          "response.data.LabList[0].LabName"
        );

        this.setState({ isLoading: false });
        this.props.navigation.navigate("TechAddreport", {
          refresh: "",
          orgid: this.state.orgid,
          usernm: this.state.scannedmobileno
        });
        // if (response.data.Status) {
        //   this.props.navigation.navigate("TechAddreport", {
        //     refresh: "",
        //     orgid: this.state.orgid,
        //     usernm: this.state.scannedmobileno
        //   });
        // } else {

        //   //Toast.show(response.data.Msg)
        //   this.setState({
        //     isLoading: false,
        //     paginationLoading: false,
        //     searchLoading: false,
        //     refreshing: false,
        //     bookingdate: formatdate
        //   });

        // }
      } catch (errors) {
        Toast.show("Something Went Wrong ,Try Again Later");

        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
        console.log(errors, "err");
      }
    } else {
      this.setState({ isLoading: false });
      Toast.show("Something Went Wrong ,Try Again Later");
    }
  };
  scaanerStyleing = () => {
    return (
      <View style={[styles.Scannercontainer]}>
        <View style={[styles.finder, { with: 300, height: 300 }]}>
          <View
            style={[
              { borderColor: "red" },
              styles.topLeftEdge,
              {
                borderLeftWidth: 2,
                borderTopWidth: 2
              }
            ]}
          />
          <View
            style={[
              { borderColor: "red" },
              styles.topRightEdge,
              {
                borderRightWidth: 2,
                borderTopWidth: 2
              }
            ]}
          />
          <View
            style={[
              { borderColor: this.props.borderColor },
              styles.bottomLeftEdge,
              {
                borderLeftWidth: 2,
                borderBottomWidth: 2
              }
            ]}
          />
          <View
            style={[
              { borderColor: this.props.borderColor },
              styles.bottomRightEdge,
              {
                borderRightWidth: 2,
                borderBottomWidth: 2
              }
            ]}
          />
        </View>
      </View>
    );
  };
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
    const { scan, ScanResult, result } = this.state;
    console.log(ScanResult, ":::?//", this.props.navigation);
    return (
      <View style={styles.scrollViewStyle}>
        <Loader loading={this.state.isLoading} />

        <Fragment>
          <CustomeHeader
            title="Scan QR Code"
            headerId={1}
            navigation={this.props.navigation}
          />
          {!scan && !ScanResult && (
            <View style={styles.cardView}>
              <Image
                source={require("../../../icons/camera.png")}
                style={{ height: 36, width: 36 }}
              ></Image>
              <Text numberOfLines={8} style={styles.descText}>
                Please move your camera {"\n"} over the QR Code
              </Text>
              <Image
                source={require("../../../icons/techscanner.png")}
                style={{ margin: 20, height: 150, width: 150 }}
              ></Image>
              <TouchableOpacity
                onPress={this.activeQR}
                style={styles.buttonScan}
              >
                <View style={styles.buttonWrapper}>
                  <Image
                    source={require("../../../icons/camera.png")}
                    style={{ height: 36, width: 36 }}
                  ></Image>
                  <Text
                    style={{
                      ...styles.buttonTextStyle,
                      color: "#2196f3",
                      marginLeft: 5
                    }}
                  >
                    Scan QR Code
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {ScanResult && (
            <>
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
                      uri: Constants.PROFILE_PIC + result.ProfilePic
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
                  {result.FullName}
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
                  {this.Decrypt(result.EmailId)}
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
                    {result.DOB}
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
                    {this.Decrypt(result.Mobile)}
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
                    {result.Gender}
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
                {/* <View
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
                    Employee ID
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
                    {result.EmployeeId}
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
                </View> */}
                {/* <View
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
                    Organization Name
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
                    {result.Org_Name}
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
                </View> */}
                {/* <View
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
                    Branch Name
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
                    {result.BranchName}
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
                </View> */}
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
                    {this.Decrypt(result.AadharCard)}
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
                    {this.Decrypt(result.HealthId)}
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
                    {result.Address}
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
                    {result.City}
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
                    {result.Pincode}
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
                <TouchableOpacity
                  // onPress={this.scanAgain}
                  onPress={this.OnProcess}
                  style={[
                    {
                      backgroundColor: "#1B2B34",
                      marginTop: 15,
                      borderRadius: 10,
                      height: 50,
                      justifyContent: "center",
                      shadowOffset: { width: 2, height: 3 },
                      shadowColor: "gray",
                      shadowOpacity: 0.9,
                      elevation: 5,
                      margin: 20
                    }
                  ]}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      alignSelf: "center",
                      fontSize: 18,
                      color: "white",
                      fontWeight: "bold"
                    }}
                  >
                    {" "}
                    Process
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </>
          )}
          {scan && (
            <>
              <QRCodeScanner
                onRead={this.onSuccess}
                cameraStyle={{ height: deviceHeight }}
                showMarker={true}
                // customMarker={this.scaanerStyleing}
                customMarker={
                  <View style={styles.rectangleContainer}>
                    <View style={styles.topOverlay}>
                      <Text style={styles.centerText}>
                        Please move your camera {"\n"} over the{" "}
                        <Text style={styles.textBold}> QR code</Text> and scan
                        the QR code.
                      </Text>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                      <View style={styles.leftAndRightOverlay} />

                      <View style={styles.rectangle}>
                        <View
                          style={{
                            height: deviceWidth * 0.73,
                            width: deviceWidth * 0.73
                          }}
                        ></View>
                        <Animatable.View
                          style={styles.scanBar}
                          direction="alternate-reverse"
                          iterationCount="infinite"
                          duration={1700}
                          easing="linear"
                          animation={this.makeSlideOutTranslation(
                            "translateY",
                            deviceWidth * -0.54
                          )}
                        />
                      </View>

                      <View style={styles.leftAndRightOverlay} />
                    </View>

                    <View style={styles.bottomOverlay} />
                  </View>
                }
                markerStyle={{ margin: 10 }}
                topContent={
                  <Text style={styles.centerText}>
                    Please move your camera {"\n"} over the{" "}
                    <Text style={styles.textBold}> QR code</Text> and scan the
                    QR code.
                  </Text>
                }
                bottomContent={
                  <TouchableOpacity style={styles.buttonTouchable}>
                    <Text style={styles.buttonText}>OK. Got it!</Text>
                  </TouchableOpacity>
                }
              />
            </>
          )}
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
    backgroundColor: "wFhite"
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
