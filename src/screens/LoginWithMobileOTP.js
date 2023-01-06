import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  Platform,
  Image
} from "react-native";

import { Container } from "native-base";
import TextInputCard from "../appComponents/TextInputCard";
import InputWithReqField from "../appComponents/InputwithReqField";
import { sha256 } from "react-native-sha256";
import OtpVerification from "../appComponents/OtpVerification";
import Constants from "../utils/Constants";
import Toast from "react-native-tiny-toast";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../appComponents/loader";
const Rijndael = require("rijndael-js");
global.Buffer = global.Buffer || require("buffer").Buffer;
const padder = require("pkcs7-padding");
import analytics from "@react-native-firebase/analytics";

import axios from "axios";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export default class LoginWithMobileOTP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: "",
      mobile: "",
      isotpsend: false,
      loading: false,
      from: "",
      txnId: "",
      sha256otp: ""
    };
  }

  componentDidMount() {
    console.log(this.props.route.params);
    /// this.retrieveData()
    if (this.props.route.params.from == "cowin-certifcate") {
      this.setState({ from: this.props.route.params.from });
    }
  }

  UNSAFE_componentWillReceiveProps(nextprops) {
    if (nextprops.route.params.from == "cowin-certifcate") {
      this.setState({
        from: nextprops.route.params.from
      });
    }
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
    } else if (
      this.state.otp.length != 4 &&
      this.state.from != "cowin-certifcate"
    ) {
      Toast.show("Please enter valid OTP");
    } else if (this.state.from == "cowin-certifcate") {
      console.log("--==-=", this.state.sha256otp); // this.convertSHA256otp();
      //  console.log(hashotp, "has ");
      this.VerifyCowinOtp();
    } else {
      this.setState({ loading: true });
      this.otpVerifyCall();
    }
    //this.props.navigation.navigate("AreUDoc")
  };

  convertSHA256otp = (txt) => {
    this.setState({ otp: txt });
    sha256(txt).then((hash) => {
      this.setState({ sha256otp: hash });
    });
  };

  async VerifyCowinOtp() {
    // this.setState({ loading: true }, () => {
    //   this.convertSHA256otp();
    // });
    this.setState({ loading: true });
    console.log("this.sha256otp", this.state.sha256otp);
    try {
      let response = await axios.post(
        "https://cdn-api.co-vin.in/api/v2/auth/public/confirmOTP",
        {
          otp: this.state.sha256otp,
          txnId: this.state.txnId
        }
      );

      var data = JSON.stringify({
        otp: this.state.sha256otp,
        txnId: this.state.txnId
      });

      var config = {
        method: "post",
        url: "https://cdndemo-api.co-vin.in/api/v2/auth/confirmOTP",

        headers: {
          "x-api-key": "3sjOr2rmM52GzhpMHjDEE1kpQeRxwFDr4YcBEimi ",
          "Content-Type": "application/json"
        },
        data: data
      };

      // let response = await axios(config);
      console.log(response.data.token, "After Otp Verification");
      // this.setState({ loading: false });
      if (response.data.token) {
        this.setState({ loading: false });

        this.props.navigation.navigate("VaccinationCertificate", {
          from: "cowinotp",
          token: response.data.token
        });
      } else {
        this.setState({ loading: false });
      }
    } catch (errors) {
      console.log(errors, ":::erorisd,sjdfkhb");
      // Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ loading: false });
    }
  }
  onPressSendOTP = () => {
    //Toast.show(this.state.mobile)

    if (this.state.mobile == "") {
      Toast.show("Please enter Mobile number");
    } else {
      this.setState({ loading: true });
      if (this.state.from == "cowin-certifcate") {
        this.onCowinAPis();
      } else {
        this.onPressSendOTPcall();
      }
    }
  };

  async onCowinAPis() {
    // console.log(this.state.mobile);
    // console.log(this.state.passWord);
    try {
      //Public apis
      let response = await axios.post(
        "https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP",
        {
          mobile: this.state.mobile
        }
      );
      //protected sandox server apis

      var data = JSON.stringify({
        mobile: this.state.mobile
      });

      var config = {
        method: "post",
        url: "https://cdndemo-api.co-vin.in/api/v2/auth/generateOTP",
        headers: {
          "x-api-key": "3sjOr2rmM52GzhpMHjDEE1kpQeRxwFDr4YcBEimi ",
          "Content-Type": "application/json"
        },
        data: data
      };
      // let response = await axios(config);

      this.setState({ loading: false });
      console.log(response.data.txnId, "=======");
      if (response.data.txnId) {
        this.setState({ isotpsend: true, txnId: response.data.txnId });
      } else {
        this.setState({ isotpsend: false });
        Toast.show("Something Went Wrong, Please Try Again Later");

        // alert(response.data.Msg);
        // Toast.show(response.data.Msg);
      }
    } catch (errors) {
      this.setState({ loading: false });
      Toast.show("Something Went Wrong, Please Try Again Later");

      console.log(errors, "errors");
    }
  }
  async onFetchLoginRecords() {
    // console.log(this.state.mobile);
    // console.log(this.state.passWord);
    try {
      let response = await axios.post(Constants.GET_SIGNIN, {
        Username: this.state.mobile,
        // Password: 1,
        Password: "Vls@123#!@"
      });
      console.log(
        "Signi api calling Login Response**************",
        response.data
      );
      this.setState({ loading: false });

      if (response.data.Status) {
        console.log(
          "Signi api calling Login Response**************",
          response.data
        );
        this.saveLoginData(
          response.data.Token,
          response.data.Role,
          response.data.Name,
          response
        );
      } else {
        // alert(response.data.Msg);
        Toast.show(response.data.Msg);
      }
    } catch (errors) {
      this.setState({ loading: false });
      Toast.show("Something Went Wrong, Please Try Again Later");

      // Alert.alert(errors);
      // Toast.show("Please check the Internet");
      // alert(errors);
      console.log(errors, "errors");
    }
  }

  async otpVerifyCall() {
    console.log(
      this.state.otp[0],
      this.state.otp[0] +
        this.state.otp[1] +
        this.state.otp[2] +
        this.state.otp[3],
      " this.state.otp"
    );
    let tmp;
    this.state.otp.map((itm) => {
      console.log(itm, "otpskl");
    });
    try {
      let response = await axios.post(Constants.GET_OTPVERIFY, {
        Mobile: this.state.mobile,
        OTP:
          this.state.otp[0] +
          this.state.otp[1] +
          this.state.otp[2] +
          this.state.otp[3]
      });
      console.log(response.data, "After Otp Verification");

      if (response.data.Status) {
        this.setState({ loading: false });
        this.saveData();
        // Toast.show(response.data.Msg);
        this.onFetchLoginRecords();
        // this.props.navigation.replace("Drawer");
        // this.props.navigation.navigate("ForgetPassReset");
      } else {
        this.setState({ loading: false });
        // alert(response.data.Msg);
        Toast.show(response.data.Msg);
      }
    } catch (errors) {
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ loading: false });
    }
  }

  saveData = async (Token) => {
    try {
      await AsyncStorage.setItem(Constants.USER_MOBILE, this.state.mobile);
    } catch (e) {
      alert("Failed to save the data to the storage");
    }
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

  saveLoginData = async (Token, Role, Name, response) => {
    console.log("tostring", this.props.navigation);
    //var items = [["token", Token], ["mobile", this.state.mobile]]
    var user = [];
    let item = {};
    var UserID = response.data.UserId;
    let tostring = response.data.UserId.toString();

    item["Name"] = Name;
    item["Mobile"] = this.state.mobile;
    item["Token"] = Token;
    item["Role"] = Role;
    item["Email"] = this.Decrypt(response.data.EmailId);
    item["isActive"] = false;
    user.push(item);
    try {
      await analytics().setUserId(UserID + "");

      await analytics().logEvent("UserLoginDetails", {
        UserID: UserID,
        Name: Name,
        Role: Role,
        Mobile: this.state.mobile
      });

      await AsyncStorage.setItem(Constants.TOKEN_KEY, Token);
      await AsyncStorage.setItem(Constants.USER_MOBILE, this.state.mobile);
      await AsyncStorage.setItem(Constants.USER_ROLE, Role);
      await AsyncStorage.setItem(Constants.ACCOUNT_ROLE, Role);
      await AsyncStorage.setItem(Constants.USER_ID, JSON.stringify(UserID));
      await AsyncStorage.setItem(
        Constants.REGISTRATION_STATUS,
        JSON.stringify(response.data.RegistrationStatus)
      );
      await AsyncStorage.setItem(
        Constants.MOBILE_VERIFIED,
        JSON.stringify(response.data.MobileVerified)
      );
      await AsyncStorage.setItem(Constants.USER_NAME, Name);

      this.setState({ loading: false });

      if (response.data.MobileVerified) {
        if (response.data.RegistrationStatus) {
          //   this.setState({ mobile: "", passWord: "" });
          //   console.log(
          //     "Role on login================== swithcing to Dash from Drawer ",
          //     Role
          //   );

          //   this.props.navigation.navigate("Drawer");
          //   this.props.navigation.navigate("PatientDashboard", {
          //     from: "LoginScreen",
          //   });
          // replace current screen bcz when we come back we dont want to show login
          this.props.navigation.replace("Drawer");
        } else {
          this.props.navigation.navigate("AreUDoc");
        }
      } else {
        this.props.navigation.navigate("OTPverification");
      }
    } catch (e) {
      console.log(e, "?????////");
      //alert('Failed to save the data to the storage')
    }
  };
  async onPressSendOTPcall() {
    console.log(
      this.state.mobile,
      "@#@##@#@#@#//////for otp send and resend button  "
    );

    try {
      const response = await axios.get(
        Constants.FORGOTPASS_SENDOTP + this.state.mobile
      );
      console.log(response.data);
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
    } else if (this.state.from == "") {
      this.setState({ loading: true });
      this.onPressSendOTPcall();
    } else {
      this.onCowinAPis();
    }
  };

  callbackForOTP = (otpfromchild) => {
    console.log("otpfromchild==>", otpfromchild.length);

    this.setState({ otp: otpfromchild });
  };
  render() {
    console.log(this.state.otp);
    const { navigate } = this.props.navigation;

    const screenHeight = Math.round(Dimensions.get("window").height);
    const screenWidth = Math.round(Dimensions.get("window").width);
    return (
      <Container>
        <Loader loading={this.state.loading} />

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
                    // marginTop: 20,
                    justifyContent: "space-between",
                    height: verticalScale(50)
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                    style={{ padding: scale(6), marginLeft: scale(30) }}
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
                      flex: verticalScale(1),
                      marginRight: scale(50)
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        alignSelf: "center",
                        fontSize: 20,
                        color: "#fff",

                        fontWeight: "bold"
                      }}
                    >
                      Login With Mobile Number
                    </Text>
                  </View>
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
                  {/* <TextInputCard
                    keyboardtype={"numeric"}
                    inputfield="Enter Mobile Number"
                    placeholder="Mobile Number"
                    icon={require("../../icons/mobile-number.png")}
                    inputvalue={this.state.mobile}
                    onchangeTxt={(text) => {
                      this.handleChange(text);
                    }}
                  ></TextInputCard> */}
                  <InputWithReqField
                    keyboardtype={"numeric"}
                    maxlength={10}
                    inputfield="Mobile Number"
                    placeholder="Mobile Number"
                    icon={require("../../icons/mobile-number.png")}
                    inputvalue={this.state.mobile}
                    onchangeTxt={(text) => {
                      this.handleChange(text);
                    }}
                  />

                  {this.state.isotpsend == true ? (
                    <>
                      <OtpVerification
                        onSubmitButtonPress={this.onPressVerify}
                        onResendOtpButtonPress={this.onPressresndOTP}
                        mobile={this.state.mobile}
                        callBack={this.callbackForOTP}
                      />
                      {/* <AutoFillOtp></AutoFillOtp> */}
                    </>
                  ) : // <TextInputCard
                  //   keyboardtype={"numeric"}
                  //   inputfield="Enter OTP"
                  //   maxlength={this.state.from == "cowin-certifcate" ? 10 : 4}
                  //   placeholder="Enter OTP"
                  //   icon={require("../../icons/mobile-number.png")}
                  //   // onchangeTxt={(text) => this.setState({ otp: text })}
                  //   onchangeTxt={(text) => {
                  //     this.convertSHA256otp(text);
                  //   }}
                  // ></TextInputCard>

                  null}
                  {this.state.isotpsend == false ? (
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
                  ) : null}
                  {/* {this.state.isotpsend == true ? (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#1B2B34",
                        elevation: 5,
                        marginTop: 50,
                        borderRadius: 10,
                        height: 50,
                        justifyContent: "center",
                        shadowOffset: { width: 2, height: 3 },
                        shadowColor: "gray",
                        shadowOpacity: 0.9
                      }}
                      onPress={this.onPressVerify}
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
                        VERIFY OTP
                      </Text>
                    </TouchableOpacity>
                  ) : (
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
                  )} */}

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
