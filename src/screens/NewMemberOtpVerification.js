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
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
  BackHandler
} from "react-native";
import { CommonActions } from "@react-navigation/native";

import { Container } from "native-base";
import TextInputCard from "../appComponents/TextInputCard";
import Constants from "../utils/Constants";
import Validate from "../utils/validation";
import Toast from "react-native-tiny-toast";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../appComponents/loader";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import InputWithReqField from "../appComponents/InputwithReqField";
import OtpVerification from "../appComponents/OtpVerification";

export default class NewMemberOtpVerification extends Component {
  constructor() {
    super();
    this.state = {
      otp: "",
      mobile: "",
      loading: false,
      FamilyMemberId: "",
      from: ""
    };
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   ' Appointment componentWillReceiveProps==============================',
    //   nextProp.route.params.FamilyMemberId
    // );
    //console.log(" Appointment componentWillReceiveProps==============================", nextProp.route.params.mobile);
    //this.setState({selectedtestId: nextProp.route.params.testids });

    this.setState(
      {
        FamilyMemberId: nextProp.route.params.FamilyMemberId,
        loading: false,
        from: nextProp.route.params.from,
        mobile: nextProp.route.params.mobile
      },
      () => { }
    );
  };

  componentDidMount = async () => {
    // console.log(
    //   'componentDidMount==============================',
    //   this.props.route.params.FamilyMemberId
    // );
    // console.log("componentDidMount==============================",this.props.route.params.mobile);

    this.setState(
      {
        FamilyMemberId: this.props.route.params.FamilyMemberId,
        loading: false,
        from: this.props.route.params.from,
        mobile: this.props.route.params.mobile
      },
      () => { }
    );
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      return true;
    });
  };

  componentWillUnmount = () => {
    this.backHandler.remove();
  };
  onPressSubmit = () => {
    if (this.state.otp == "") {
      Toast.show("Please enter OTP");
    } else if (this.state.otp.length != 4) {
      Toast.show("Please enter valid OTP");
    } else {
      this.setState({ loading: true });
      this.otpVerifyCall();
    }
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
    // console.log(this.state.FamilyMemberId);
    try {
      let response = await axios.post(Constants.VERIFY_FAMILYMEMBER, {
        FamilyMemberId: this.state.FamilyMemberId,
        // OTP: this.state.otp
        OTP:
          this.state.otp[0] +
          this.state.otp[1] +
          this.state.otp[2] +
          this.state.otp[3]
      });
      // console.log(response.data, "add new Family memebrt ");
      this.setState({ loading: false });

      if (response.data.Status) {
        Toast.show(response.data.Msg);
        if (this.props.from == "medication") {
          this.props.navigation.navigate("MedicatnForSelforOther", {
            from: { from: "otp" }
          });
        } else {
          this.props.navigation.navigate("FamilyMemberList", {
            from: { from: "otp" }
          });
        }
      } else {
        Toast.show(response.data.Msg);
        this.setState({ loading: false });
      }
    } catch (errors) {
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ loading: false });
      // alert(errors);
      console.log(errors);
    }
  }

  async otpResendCall() {
    // this.setState({ loading: true });

    // console.log(this.state.mobile);
    /// console.log(this.state.otp)
    //Toast.show(this.state.mobile)

    const mobilestr = this.state.mobile;
    try {
      // const response = await axios.get(Constants.GET_SENDOTP + mobilestr);
      const response = await axios.get(
        Constants.RESEND_FAMILYMEMBER_OTP + this.state.FamilyMemberId
      );
      this.setState({ loading: false });

      if (response.data.OTPSend) {
        Toast.show(response.data.Msg);
      } else {
        this.setState({ loading: false });

        Toast.show(response.data.Msg);
      }
      // Toast.show(response)
    } catch (error) {
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ loading: false });
      console.error(error);
    }
  }
  goBack = () => {
    // this.props.navigation.goBack()
    // this.props.navigation.navigate('FamilyMemberList', {
    //   refresh: true,
    // })

    if (this.state.from == "medication") {
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: "Drawer"
            },
            {
              name: "MedicatnForSelforOther",
              params: {
                refresh: "refresh"
              }
            }
          ]
        })
      );
    } else {
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: "Drawer"
            },
            {
              name: "FamilyMemberList",
              params: {
                refresh: "refresh"
              }
            }
          ]
        })
      );
    }
  };
  callbackForOTP = (otpfromchild) => {
    this.setState({ otp: otpfromchild });
  };
  render() {
    const { navigate } = this.props.navigation;

    const screenHeight = Math.round(Dimensions.get("window").height);
    const screenWidth = Math.round(Dimensions.get("window").width);
    // console.log(screenWidth, "otp family meber ");
    return (
      <Container>
        <Loader loading={this.state.loading} />
        <ImageBackground
          source={require("../../icons/sign-up-sign-in-background.jpg")}
          style={{
            height: "100%",
            width: "100%",
            position: "absolute"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop:
                Platform.OS === "ios" ? verticalScale(30) : verticalScale(25),
              // marginTop: 20,
              justifyContent: "space-between",
              height: 50,
              marginBottom:
                screenHeight <= 640 ? verticalScale(100) : verticalScale(120)
              // marginBottom:Platform.OS==='ios'?verticalScale(45):verticalScale(50)
            }}
          >
            <TouchableOpacity
              onPress={() => this.goBack()}
              style={{ padding: 5, marginLeft: 15 }}
            >
              <Image
                style={{ height: 25, width: 25, marginTop: 5 }}
                source={require("../../icons/back.png")}
              ></Image>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                flex: 1,
                marginRight: screenWidth <= 360 ? scale(65) : scale(50),
                marginTop: 0
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                  fontSize: 18,
                  color: "#fff",
                  // color: '#DCFF94',
                  fontWeight: "bold"
                }}
              >
                OTP
              </Text>
            </View>
          </View>

          <View
            style={{
              // backgroundColor: 'tranparent',
              flexDirection: "column",
              // marginTop: 50,
              // marginTop: 120,
              // marginTop: 180,
              marginLeft: 25,
              marginRight: 25
              // marginTop:40
            }}
          >
            <View
              style={{
                // flex: 1,
                backgroundColor: "transparent",
                justifyContent: "center"
              }}
            >
              <View
                style={{
                  flexDirection: "column"
                }}
              >
                <View
                  style={{
                    // height: 500,
                    backgroundColor: "tranparent",
                    flexDirection: "column",
                    // marginTop: 150,
                    marginLeft: 25,
                    marginRight: 25
                  }}
                >
                  <OtpVerification
                    onSubmitButtonPress={this.onPressSubmit}
                    onResendOtpButtonPress={this.onPressResendOtp}
                    mobile={this.state.mobile}
                    callBack={this.callbackForOTP}
                  />
                  {/* <TextInputCard
                    keyboardtype={"numeric"}
                    inputfield="Enter OTP"
                    maxlength={4}
                    placeholder="Enter OTP"
                    icon={require("../../icons/mobile-number.png")}
                    onchangeTxt={(text) => this.setState({ otp: text })}
                  ></TextInputCard>

                  <TouchableOpacity
                    style={{
                      backgroundColor: "#1B2B34",
                      marginTop: 50,
                      borderRadius: 10,
                      height: 50,
                      justifyContent: "center",
                      shadowOffset: { width: 2, height: 3 },
                      elevation: 5,
                      shadowColor: "gray",
                      shadowOpacity: 0.9
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
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 15,
                justifyContent: "center"
              }}
            ></View>
          </View>
        </ImageBackground>
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
