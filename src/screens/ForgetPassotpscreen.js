import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  Platform
} from "react-native";

import { Container } from "native-base";
import TextInputCard from "../appComponents/TextInputCard";
import Constants from "../utils/Constants";
import Toast from "react-native-tiny-toast";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../appComponents/loader";
import OtpVerification from "../appComponents/OtpVerification";
import axios from "axios";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export default class ForgetPassotpscreen extends Component {
  constructor() {
    super();
    this.state = {
      otp: "",
      mobile: "",
      isotpsend: false,
      loading: false
    };
  }

  componentDidMount() {
    /// this.retrieveData()
  }

  handleChange(text) {
    if (isNaN(text)) {
      Toast.show("Please enter only number");
    } else {
      this.setState({ mobile: text });
    }
  }

  onPressVerify = () => {
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

  onPressSendOTP = () => {
    //Toast.show(this.state.mobile)

    if (this.state.mobile == "") {
      Toast.show("Please enter Mobile number");
    } else {
      this.setState({ loading: true });
      this.onPressSendOTPcall();
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
      if (response.data.Status) {
        this.setState({ loading: false });
        //this.saveData()
        Toast.show(response.data.Msg);
        this.props.navigation.navigate("ForgetPassReset");
      } else {
        this.setState({ loading: false });
        // alert(response.data.Msg);
        Toast.show(response.data.Msg);
      }
    } catch (errors) {
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ loading: false });

      // alert(errors);
      // console.log(errors);
    }
  }

  saveData = async (Token) => {
    try {
      await AsyncStorage.setItem(Constants.USER_MOBILE, this.state.mobile);
    } catch (e) {
      alert("Failed to save the data to the storage");
    }
  };

  async onPressSendOTPcall() {
    // console.log(this.state.mobile);

    try {
      const response = await axios.get(
        Constants.FORGOTPASS_SENDOTP + this.state.mobile
      );
      // console.log(response.data);
      this.setState({ loading: false });
      if (response.data.OTPSend) {
        this.saveData();
        Toast.show(response.data.Msg);
        this.setState({ isotpsend: true });
      } else {
        // console.log("else ");
        Toast.show(response.data.Msg);
      }
      // Toast.show(response)
    } catch (error) {
      this.setState({ loading: false });
      // console.error(error);
    }
  }

  onPressresndOTP = () => {
    // this.props.navigation.navigate("ForgetPassReset")
    if (this.state.mobile == "") {
      Toast.show("Please enter Mobile number");
    } else {
      this.setState({ loading: true });
      this.onPressSendOTPcall();
    }
  };
  callbackForOTP = (otpfromchild) => {
    this.setState({ otp: otpfromchild });
  };
  render() {
    const { navigate } = this.props.navigation;

    const screenHeight = Math.round(Dimensions.get("window").height);
    const screenWidth = Math.round(Dimensions.get("window").width);
    return (
      <Container>
        <Loader loading={this.state.loading} />
        {/* <KeyboardAvoidingView
      style={{flex:1}}
      behavior="padding"
    >    */}

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
                    marginTop:
                      Platform.OS === "ios"
                        ? verticalScale(45)
                        : verticalScale(25),
                    // marginTop:Platform.OS==='ios'?50: 40,
                    justifyContent: "center",
                    height: 50
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      alignSelf: "center",
                      fontSize: 18,
                      color: "#DCFF94",
                      fontWeight: "bold"
                    }}
                  >
                    Forgot Password?
                  </Text>
                </View>

                <View
                  style={{
                    height: 500,
                    backgroundColor: "tranparent",
                    flexDirection: "column",
                    marginTop: 180,
                    marginLeft: 25,
                    marginRight: 25
                  }}
                >
                  <TextInputCard
                    keyboardtype={"numeric"}
                    inputfield="Enter Mobile Number"
                    placeholder="Mobile Number"
                    icon={require("../../icons/mobile-number.png")}
                    inputvalue={this.state.mobile}
                    onchangeTxt={(text) => {
                      this.handleChange(text);
                    }}
                  ></TextInputCard>

                  {this.state.isotpsend == true ? (
                    // <TextInputCard
                    //   keyboardtype={"numeric"}
                    //   inputfield="Enter OTP"
                    //   maxlength={10}
                    //   placeholder="Enter OTP"
                    //   icon={require("../../icons/mobile-number.png")}
                    //   onchangeTxt={(text) => this.setState({ otp: text })}
                    // ></TextInputCard>
                    <OtpVerification
                      onSubmitButtonPress={this.onPressVerify}
                      onResendOtpButtonPress={this.onPressresndOTP}
                      mobile={this.state.mobile}
                      callBack={this.callbackForOTP}
                    ></OtpVerification>
                  ) : null}

                  {this.state.isotpsend == true ? null : (
                    // <TouchableOpacity
                    //   style={{
                    //     backgroundColor: "#1B2B34",
                    //     elevation: 5,
                    //     marginTop: 50,
                    //     borderRadius: 10,
                    //     height: 50,
                    //     justifyContent: "center",
                    //     shadowOffset: { width: 2, height: 3 },
                    //     shadowColor: "gray",
                    //     shadowOpacity: 0.9
                    //   }}
                    //   onPress={this.onPressVerify}
                    // >
                    //   <Text
                    //     style={{
                    //       textAlign: "center",
                    //       alignSelf: "center",
                    //       fontSize: 18,
                    //       color: "white",
                    //       fontWeight: "bold"
                    //     }}
                    //   >
                    //     VERIFY OTP
                    //   </Text>
                    // </TouchableOpacity>
                    <TouchableOpacity
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
                      onPress={this.onPressSendOTP}
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
                        GET OTP
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* <TouchableOpacity onPress={this.onPressresndOTP}>
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
