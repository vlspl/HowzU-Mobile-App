import React, { Component } from "react";

import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Animated
} from "react-native";
import PasswordInput from "../appComponents/PaaswordInput";
import { Container, Toast } from "native-base";
import TextInputCard from "../appComponents/TextInputCard";
import Constants from "../utils/Constants";
import Rediobutton from "../appComponents/Rediobutton";
import AsyncStorage from "@react-native-community/async-storage";
// import Toast from 'react-native-tiny-toast';
import Loader from "../appComponents/loader";
// import DatePicker from 'react-native-datepicker';
import InputWithReqField from "../appComponents/InputwithReqField";
import RNDateTimePickerForAndroid from "@react-native-community/datetimepicker";
import moment from "moment";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePicker from "react-native-modal-datetime-picker";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import analytics from "@react-native-firebase/analytics";

export default class RegisterScreen extends Component {
  constructor() {
    super();
    this.state = {
      FullName: "",
      Mobile: "",
      EmailId: "",
      Password: "",
      Gender: "",
      BirthDate: "",
      HealthId: "",
      Aadharnumber: "",
      activeGender: "Male",
      loading: false,
      date: "",
      isErr: false,
      secureTextEntry: true,
      Pincode: "",
      channelcode: "",
      isDateTimePickerVisible: false
    };
  }

  onPressSignup = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const Passwordreg = new RegExp(
      /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{6,}$/
    );
    if (this.state.FullName == "") {
      Toast.show({ text: "Please enter full name" });
    } else if (!isNaN(this.state.FullName)) {
      Toast.show({ text: "Please enter only alphabets in Name" });
    } else if (this.state.Mobile.length != 10) {
      Toast.show({ text: "Please enter valid mobile number" });
    }
    //  else if (this.state.EmailId == '') {
    //   Toast.show('Please enter your email');
    // }
    else if (
      this.state.EmailId != "" &&
      reg.test(this.state.EmailId.trimEnd()) === false
    ) {
      Toast.show({ text: "Please enter valid email" });
    } else if (this.state.BirthDate == "") {
      Toast.show({ text: "Please enter your birthdate" });
    } else if (this.state.Password == "") {
      Toast.show({ text: "Please enter your password" });
    } else if (this.state.Pincode == "") {
      Toast.show({ text: "Please enter pincode number" });
    } else if (this.state.Pincode.length != 6) {
      Toast.show({ text: "Please enter valid pincode number" });
    } else if (Passwordreg.test(this.state.Password) === false) {
      Toast.show({
        text: "Please enter password with minimum 6 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet, 1 Number and 1 Special Character",
        duration: 10000
      });
    } else if (
      this.state.Aadharnumber != "" &&
      this.state.Aadharnumber.length != 12
    ) {
      Toast.show({ text: "Aadharnumber must be 12 digit" });
    } else {
      this.setState({
        loading: true
      });
      this.SignupAPicall();
    }
  };

  onTextChanged(text) {
    if (isNaN(text)) {
      Toast.show({ text: "Please enter only number" });
    } else {
      this.setState({ Mobile: text });
    }
  }
  onChangePassword(text) {
    const Passwordreg = new RegExp(
      /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{6,}$/
    );

    this.setState({ Password: text });
    if (text.length < 6) {
      // this.setState({ Password: text });
      this.setState({ isErr: true });
    } else if (Passwordreg.test(text)) {
      this.setState({ isErr: false, Password: text });
    } else {
      this.setState({ Password: text });
      this.setState({ isErr: true });
    }
  }

  onChangedAdhar(text) {
    if (isNaN(text)) {
      Toast.show({ text: "Please enter only number" });
    } else {
      this.setState({ Aadharnumber: text });
    }
  }
  async SignupAPicall() {
    try {
      let response = await axios.post(Constants.GET_SIGNUP, {
        FullName: this.state.FullName,
        Mobile: this.state.Mobile,
        EmailId: this.state.EmailId,
        Password: this.state.Password,
        Gender: this.state.activeGender,
        BirthDate: this.state.BirthDate,
        HealthId: this.state.HealthId,
        Aadharnumber: this.state.Aadharnumber,
        Pincode: this.state.Pincode,
        ChannelPartnerCode: this.state.channelcode
      });
      this.setState({ loading: false });
      if (response.data.Status) {
        this.saveData(response.data.Token, response.data.Role, response);
        if (response.data.MobileVerified) {
          // this.props.navigation.navigate('OTPverification',{from:'RegScreen'});
          this.props.navigation.navigate("RegOTPverification");
        } else {
          this.props.navigation.navigate("RegOTPverification");
          // this.props.navigation.navigate('OTPverification',{from:'RegScreen'});
          Toast.show({ text: response.data.Msg });
        }
      } else {
        Toast.show({ text: response.data.Msg });
      }
    } catch (errors) {
      Toast.show({ text: "Something Went Wrong, Please Try Again Later" });

      // Toast.show({ text: " Network Error,please check the internet" });
      //alert(errors);
      this.setState({ loading: false });
      console.log(errors);
    }
  }
  saveData = async (Token, Role, response) => {
    let UserId = response.data.UserId;
    try {
      await analytics().setUserId(UserId + "");
      await analytics().logEvent("NewUser", {
        UserID: UserId,
        Name: this.state.FullName,
        Mobile: this.state.mobile
      });
      await AsyncStorage.setItem(Constants.TOKEN_KEY, Token);
      await AsyncStorage.setItem(Constants.USER_MOBILE, this.state.Mobile);
      await AsyncStorage.setItem(Constants.USER_ROLE, Role);
      await AsyncStorage.setItem(Constants.ACCOUNT_ROLE, Role);
      await AsyncStorage.setItem(Constants.USER_NAME, this.state.FullName);
      await AsyncStorage.setItem(Constants.USER_ID, JSON.stringify(UserId));
    } catch (e) {
      alert("Failed to save the data to the storage");
    }
  };

  onPressTnC = () => {
    this.props.navigation.navigate("TermnCondition");
  };

  onPressprivacyPolicy = () => {
    this.props.navigation.navigate("PrivacyPolicy");
  };
  //// RN Picker

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = (date) => {
    let formatdate = moment(date).format("DD/MM/YYYY");

    this.setState({
      // BirthDate: selectedDate,
      BirthDate: formatdate,
      isShowDataPicker: false

      // selectedtimeslot: '',
    });
    this.hideDateTimePicker();
  };
  renderModalPicekr = () => {
    return (
      <DateTimePicker
        isVisible={this.state.isDateTimePickerVisible}
        onConfirm={this.handleDatePicked}
        onCancel={this.hideDateTimePicker}
        // minimumDate={new Date(1950, 0, 1)}
        // maximumDate={new Date(2020, 10, 20)}
        maximumDate={new Date()}
        display="spinner"
      />
    );
  };

  render() {
    const { navigate } = this.props.navigation;

    const screenHeight = Math.round(Dimensions.get("window").height);
    const screenWidth = Math.round(Dimensions.get("window").width);
    //   console.log(screenHeight, 'screen height');
    return (
      <Container style={{ flex: 1 }}>
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
                Platform.OS === "ios" ? verticalScale(45) : verticalScale(25),
              // marginTop: 10,
              justifyContent: "space-between",
              height: 50,
              // marginBottom: 150,
              marginBottom:
                screenHeight <= 640 ? verticalScale(160) : verticalScale(120)
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                // marginTop: verticalScale(20),
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                  fontSize: 20,
                  color: "gray",
                  fontWeight: "bold"
                }}
              >
                SIGN IN
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                  fontSize: 20,
                  color: "white",
                  fontWeight: "bold"
                }}
              >
                /
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                  fontSize: 20,
                  color: "#DCFF94",
                  fontWeight: "bold"
                }}
              >
                SIGN UP
              </Text>
            </View>
          </View>

          <KeyboardAwareScrollView enableOnAndroid={true}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  // height: 650,
                  backgroundColor: "tranparent",
                  flexDirection: "column",
                  // marginTop: 150,
                  marginLeft: 25,
                  marginRight: 25
                }}
              >
                <InputWithReqField
                  inputfield="Full Name"
                  placeholder="First Name Middle Name Last Name "
                  icon={require("../../icons/full-name.png")}
                  onchangeTxt={(text) => this.setState({ FullName: text })}
                />

                <TextInputCard
                  inputfield="Email"
                  placeholder="Email"
                  icon={require("../../icons/email.png")}
                  keyboardtype="email-address"
                  onchangeTxt={(text) => this.setState({ EmailId: text })}
                ></TextInputCard>
                {/* <InputWithReqField
                  inputfield="Email"
                  placeholder="Email"
                  icon={require('../../icons/email.png')}
                  onchangeTxt={(text) => this.setState({ EmailId: text })}
                /> */}
                <View
                  style={{
                    height: 80,
                    backgroundColor: "transparent",
                    flexDirection: "column",
                    marginTop: 10,
                    marginLeft: 5,
                    marginRight: 5
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ height: 18, fontSize: 15 }}>
                      Date of Birth{" "}
                    </Text>
                    <Text style={{ color: "red", height: 18, fontSize: 15 }}>
                      *
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 50,
                      backgroundColor: "white",
                      flexDirection: "row",
                      marginTop: 10,
                      marginLeft: 0,
                      marginRight: 0,
                      borderColor: "lightgray",
                      borderWidth: 1,
                      borderRadius: 5,
                      alignItems: "center"
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          isDateTimePickerVisible:
                            !this.state.isDateTimePickerVisible,

                          isShowDataPicker: !this.state.isShowDataPicker
                        })
                      }
                      style={{ justifyContent: "center" }}
                    >
                      <Image
                        source={require("../../icons/date-of-birth.png")}
                        style={{
                          height: 20,
                          width: 20,
                          marginLeft: 8,
                          justifyContent: "center",
                          alignSelf: "center"
                        }}
                      />

                      {this.state.isShowDataPicker && this.renderModalPicekr()}
                    </TouchableOpacity>
                    <View
                      style={{
                        height: 34,
                        width: 1,
                        marginTop: 10,
                        marginBottom: 8,
                        marginLeft: 10,
                        backgroundColor: "lightgray",
                        alignItems: "center"
                      }}
                    ></View>

                    <View
                      style={{
                        flex: 1,
                        justifyContent: "flex-start",
                        marginLeft: 12
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            isDateTimePickerVisible:
                              !this.state.isDateTimePickerVisible,
                            isShowDataPicker: !this.state.isShowDataPicker
                          })
                        }
                      >
                        <Text
                          style={{
                            marginLeft: 0,
                            color:
                              this.state.BirthDate == ""
                                ? "lightgray"
                                : "black",
                            alignSelf: "stretch"
                          }}
                        >
                          {this.state.BirthDate == ""
                            ? "Date of Birth "
                            : this.state.BirthDate}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <InputWithReqField
                  keyboardtype={"numeric"}
                  numeric
                  maxlength={10}
                  inputfield="Mobile Number"
                  placeholder="Mobile Number"
                  icon={require("../../icons/mobile-number.png")}
                  inputvalue={this.state.Mobile}
                  onchangeTxt={(text) => this.onTextChanged(text)}
                />

                <PasswordInput
                  textentry={this.state.secureTextEntry}
                  inputfield="Password"
                  placeholder="Password"
                  icon={require("../../icons/password.png")}
                  inputvalue={this.state.Password}
                  // onchangeTxt={(text) => {
                  //   this.setState({ Password: text });
                  // }}
                  onchangeTxt={(text) => this.onChangePassword(text)}
                  updateSecureTextEntry={() =>
                    this.setState({
                      secureTextEntry: !this.state.secureTextEntry
                    })
                  }
                ></PasswordInput>
                {this.state.isErr ? (
                  <Text style={{ color: "red" }}>
                    {
                      "  Enter password with minimum 6 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet, 1 Number and  1 SpecialCharacter"
                    }
                  </Text>
                ) : null}

                <TextInputCard
                  keyboardtype={"numeric"}
                  numeric
                  maxlength={14}
                  inputfield="HealthID"
                  placeholder="HealthID"
                  icon={require("../../icons/health-id.png")}
                  // onchangeTxt={(text) => this.onTextChanged(text)}

                  onchangeTxt={(text) => this.setState({ HealthId: text })}
                ></TextInputCard>

                <TextInputCard
                  keyboardtype={"numeric"}
                  numeric
                  maxlength={12}
                  inputfield="Aadhar Number"
                  placeholder="Aadhar Number"
                  icon={require("../../icons/aadharicon.png")}
                  onchangeTxt={(text) => this.onChangedAdhar(text)}
                ></TextInputCard>
                <InputWithReqField
                  keyboardtype={"numeric"}
                  maxlength={6}
                  inputfield="Pincode"
                  placeholder="Pincode"
                  icon={require("../../icons/PinCode.png")}
                  // onchangeTxt={(text) => this.onChangePassword(text)}
                  onchangeTxt={(text) => this.setState({ Pincode: text })}
                />

                <TextInputCard
                  maxLength={12}
                  inputfield="Channel Partner Code"
                  placeholder="Channel Partner Code"
                  icon={require("../../icons/channel-partner.png")}
                  // onchangeTxt={(text) => this.onChangePassword(text)}
                  onchangeTxt={(text) => this.setState({ channelcode: text })}
                />
                <View
                  style={{
                    height: 40,
                    backgroundColor: "transparent",
                    marginTop: 5,
                    flexDirection: "row",
                    marginLeft: 10
                  }}
                >
                  {this.state.activeGender == "Male" ? (
                    <Rediobutton
                      onpress={() => this.setState({ activeGender: "Male" })}
                      buttonimg={require("../../icons/radio-on.png")}
                      gender="Male"
                    ></Rediobutton>
                  ) : (
                    <Rediobutton
                      onpress={() => this.setState({ activeGender: "Male" })}
                      buttonimg={require("../../icons/radio-off.png")}
                      gender="Male"
                    ></Rediobutton>
                  )}
                  {this.state.activeGender == "Female" ? (
                    <Rediobutton
                      onpress={() => this.setState({ activeGender: "Female" })}
                      buttonimg={require("../../icons/radio-on.png")}
                      gender="Female"
                    ></Rediobutton>
                  ) : (
                    <Rediobutton
                      onpress={() => this.setState({ activeGender: "Female" })}
                      buttonimg={require("../../icons/radio-off.png")}
                      gender="Female"
                    ></Rediobutton>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                    justifyContent: "center"
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      alignSelf: "center",
                      fontSize: 11,
                      color: "black"
                    }}
                  >
                    By using to this app you agree to{"   "}
                  </Text>
                  <TouchableOpacity onPress={this.onPressTnC}>
                    <Text
                      style={{
                        textAlign: "center",
                        alignSelf: "center",
                        fontSize: 11,
                        color: "#00397e",
                        textDecorationLine: "underline"
                      }}
                    >
                      Terms and Conditions{"   "}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.onPressprivacyPolicy}>
                    <Text
                      style={{
                        textAlign: "center",
                        alignSelf: "center",
                        fontSize: 11,
                        color: "#00397e",
                        textDecorationLine: "underline"
                      }}
                    >
                      privacy policy
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#1B2B34",
                    marginTop: 15,
                    borderRadius: 10,
                    height: 50,
                    justifyContent: "center",
                    shadowOffset: { width: 2, height: 3 },
                    shadowColor: "gray",
                    shadowOpacity: 0.9,
                    elevation: 5
                    // marginBottom: 10,
                  }}
                  onPress={this.onPressSignup}
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
                    SIGN UP
                  </Text>
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                    justifyContent: "center",
                    marginBottom: 10
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      alignSelf: "center",
                      fontSize: 15,
                      color: "black"
                    }}
                  >
                    Already have an Account?
                  </Text>
                  <TouchableOpacity onPress={() => navigate("LoginScreen")}>
                    <Text
                      style={{
                        textAlign: "center",
                        alignSelf: "center",
                        fontSize: 15,
                        color: "#00397e"
                      }}
                    >
                      Sign in
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
          {/* </ScrollView> */}
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
