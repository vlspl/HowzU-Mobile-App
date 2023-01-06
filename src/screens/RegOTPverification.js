import React, { Component } from "react";

import {
  FlatList,
  Alert,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Button,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  BackHandler
} from "react-native";

import { Container } from "native-base";
import TextInputCard from "../appComponents/TextInputCard";
import Constants from "../utils/Constants";
import Validate from "../utils/validation";
import Toast from "react-native-tiny-toast";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../appComponents/loader";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

import OtpVerification from "../appComponents/OtpVerification";

import axios from "axios";

export default class RegOTPverification extends Component {
  constructor() {
    super();
    this.state = {
      otp: "",
      mobile: "",
      loading: false
    };
  }

  componentDidMount() {
    //.log(this.props, "OTP verificatom/////", this.props.route);
    this.retrieveData();

    // if(this.props.route.params!=undefined&&this.props.route.params.from=='RegScreen'){
    //   this.backHandler = BackHandler.addEventListener(
    //       'hardwareBackPress',()=>
    //       {return true}
    //     );
    // }
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      return true;
    });
  }

  retrieveData = async () => {
    try {
      let value = await AsyncStorage.getItem(Constants.USER_MOBILE);
      //let parsed = JSON.parse(user);
      //Toast.show(value)
      this.setState({ mobile: value });

      // alert(user);
    } catch (error) {
      // Error retrieving data
    }
  };

  backAction = () => {
    this.props.navigation.navigate(null);
  };
  componentWillUnmount = () => {
    // if(this.state.route.params!=undefined&&this.props.route.params.from=='RegScreen'){
    this.backHandler.remove();
    // }
  };

  onPressSubmit = () => {
    if (this.state.mobile == "") {
      Toast.show("Mobile number not found");
    } else if (this.state.otp == "") {
      Toast.show("Please enter OTP");
    } else if (this.state.otp.length != 4) {
      Toast.show("Please enter valid OTP");
    } else {
      this.setState({ loading: true });
      this.otpVerifyCall();
    }
    //this.props.navigation.navigate("AreUDoc")
  };

  onPressResendOtp = () => {
    //Toast.show(this.state.mobile)

    if (this.state.mobile == "") {
      Toast.show("Mobile number not found");
    } else {
      this.otpResendCall();
    }

    //this.onFetchLoginRecords();
    //this.props.navigation.navigate("AreUDoc")
  };

  async otpVerifyCall() {
    try {
      let response = await axios.post(Constants.GET_OTPVERIFY, {
        Mobile: this.state.mobile,
        OTP:
          this.state.otp[0] +
          this.state.otp[1] +
          this.state.otp[2] +
          this.state.otp[3]
        // OTP: this.state.otp
      });
      //.log("-----///otp verifciation data", response.data);
      this.setState({ loading: false });

      if (response.data.Status) {
        try {
          await AsyncStorage.setItem(
            Constants.MOBILE_VERIFIED,
            JSON.stringify(response.data.Status)
          );
        } catch (err) {
          //.log(err);
        }
        this.props.navigation.navigate("AreUDoc");
      } else {
        //.log("else ");
        try {
          await AsyncStorage.setItem(
            Constants.MOBILE_VERIFIED,
            JSON.stringify(response.data.Status)
          );
        } catch (err) {
          //.log(err, "otp ver");
        }
        Toast.show(response.data.Msg);
      }
    } catch (errors) {
      this.setState({ loading: false });
      // alert(errors);
      //.log(errors);
    }
  }

  async otpResendCall() {
    this.setState({ loading: true });

    //.log(this.state.mobile);
    /// //.log(this.state.otp)
    //Toast.show(this.state.mobile)

    const mobilestr = this.state.mobile;

    try {
      const response = await axios.get(Constants.GET_SENDOTP + mobilestr);
      //.log(response.data);
      this.setState({ loading: false });

      if (response.data.OTPSend) {
        Toast.show(response.data.Msg);
      } else {
        Toast.show(response.data.Msg);
      }
      // Toast.show(response)
    } catch (error) {
      this.setState({ loading: false });
      //.error(error);
    }
  }
  callbackForOTP = (otpfromchild) => {
    console.log("otpfromchild==>", otpfromchild.length);

    this.setState({ otp: otpfromchild });
  };
  render() {
    const { navigate } = this.props.navigation;
    this.retrieveData();

    //const user_mobile = navigation.getParam('user_mobile');
    // alert(user_mobile);
    // console.log(user_mobile)

    const screenHeight = Math.round(Dimensions.get("window").height);
    const screenWidth = Math.round(Dimensions.get("window").width);
    return (
      <Container>
        <Loader loading={this.state.loading} />
        {/* <KeyboardAvoidingView
      style={{flex:1}}
      behavior="padding"
    >   
        */}
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            justifyContent: "center"
          }}
        >
          <ScrollView
            alwaysBounceVertical={false}
            showsHorizontalScrollIndicator={false}
            style={{ backgroundColor: "white" }}
          >
            <View
              style={{
                height: screenHeight,
                backgroundColor: "white",
                flexDirection: "column"
              }}
            >
              <ImageBackground
                source={require("../../icons/sign-up-sign-in-background.jpg")}
                style={{
                  width: screenWidth,
                  height: screenHeight,
                  backgroundColor: "transparent"
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    // marginTop: 40,
                    marginTop:
                      Platform.OS === "ios"
                        ? verticalScale(45)
                        : verticalScale(25),
                    justifyContent: "center",
                    height: 50
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      alignSelf: "center",
                      fontSize: 20,
                      color: "#DCFF94",
                      fontWeight: "bold"
                    }}
                  >
                    OTP
                  </Text>
                </View>

                <View
                  style={{
                    height: 500,
                    backgroundColor: "tranparent",
                    flexDirection: "column",
                    marginTop: 150,
                    marginLeft: 25,
                    marginRight: 25
                  }}
                >
                  {/* <TextInputCard
                    keyboardtype={"numeric"}
                    inputfield="Enter OTP"
                    maxlength={4}
                    placeholder="Enter OTP"
                    icon={require("../../icons/mobile-number.png")}
                    onchangeTxt={(text) => this.setState({ otp: text })}
                  ></TextInputCard> */}
                  <OtpVerification
                    onSubmitButtonPress={this.onPressSubmit}
                    onResendOtpButtonPress={this.onPressResendOtp}
                    mobile={this.state.mobile}
                    callBack={this.callbackForOTP}
                  />

                  {/* <TouchableOpacity
                    style={{
                      backgroundColor: "#1B2B34",
                      marginTop: 50,
                      borderRadius: 10,
                      height: 50,
                      justifyContent: "center",
                      shadowOffset: { width: 2, height: 3 },
                      shadowColor: "gray",
                      shadowOpacity: 0.9,
                      elevation: 5
                    }}
                    onPress={this.onPressSubmit}
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
                      SUBMIT
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={this.onPressResendOtp}>
                    <Text
                      style={{
                        marginLeft: 10,
                        marginRight: 10,
                        height: 30,
                        marginTop: 30,
                        textAlign: "center",
                        fontSize: 18,
                        color: "#00397e"
                      }}
                    >
                      Resend OTP
                    </Text>
                  </TouchableOpacity> */}
                </View>
              </ImageBackground>
            </View>
          </ScrollView>
        </View>
        {/* </KeyboardAvoidingView> */}
      </Container>
    );
  }
}

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
    marginLeft: 10,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 2,
    borderRadius: 5,
    backgroundColor: "white",
    elevation: 2
  }
});
