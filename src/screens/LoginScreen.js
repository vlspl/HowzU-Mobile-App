import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  Button
} from "react-native";
import { Container } from "native-base";
import InputWithReqField from "../appComponents/InputwithReqField";
import PasswordInput from "../appComponents/PaaswordInput";
import Constants from "../utils/Constants";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-community/async-storage";
import Toast from "react-native-tiny-toast";
import Loader from "../appComponents/loader";
import axios from "axios";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import analytics from "@react-native-firebase/analytics";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Rijndael = require("rijndael-js");

global.Buffer = global.Buffer || require("buffer").Buffer;

const padder = require("pkcs7-padding");
export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: "",
      passWord: "",
      loading: false,
      telephone: "",
      activeNumber: "",
      logeedinuser: {},
      // allActiveuser: [],
      secureTextEntry: true
    };
    /// this.handleChange = this.handleChange.bind(this);
    // console.log(this.props, "Login screen");
  }

  handleChange(text) {
    if (isNaN(text)) {
      Toast.show("Please enter only number");
    } else {
      this.setState({ mobile: text });
    }
  }
  async onGoogleButtonPress() {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }
  googleLogin = () => {
    this.onGoogleButtonPress().then((res) =>
      console.log("Signed in with Google!", res)
    );
  };
  getActiveUser = () => {
    AsyncStorage.getItem("Users", (err, res) => {
      if (!res);
      else {
        // console.log(res, 'get user');
        this.setState({ allActiveuser: JSON.parse(res) });
      }
    });
    // console.log('ALL THE ACTIVE USERS ', res);
  };

  componentDidMount() {
    //not needed now this for mu;tiple acc handleing login
    // this.getActiveUser();
    // AsyncStorage.getItem(Constants.USER_MOBILE).then((mobile) => {
    //   // console.log('Acive user number Login screen ==================', mobile);
    //   this.setState({ activeNumber: mobile });
    // });
    this.setState({ passWord: "" });
    GoogleSignin.configure({
      webClientId:
        "510234675595-umrp0it2bbp0bq7io0bodq8qq9lu2atl.apps.googleusercontent.com"
    });
    // 510234675595-7g9pprvvr8qvr4lcsvcs45crhq98ls6o.apps.googleusercontent.com
  }

  onPressLogin = () => {
    var chek;

    // for multi acc
    // chek = this.state.allActiveuser.find(
    //   (user) => user.Mobile == this.state.mobile
    // );
    // console.log(chek, 'chek');
    // if (chek === undefined) {
    if (this.state.mobile == "") {
      Toast.show("Please enter mobile number");
    } else if (this.state.mobile.length != 10) {
      Toast.show("Please enter valid mobile number");
    } else if (this.state.passWord == "") {
      Toast.show("Please enter password");
    } else {
      // console.log("@@@@@@Valid Input Fetching login details from Server");
      this.setState({
        loading: true
      });
      this.onFetchLoginRecords();
    }

    // else {
    //   Toast.show(
    //     'You already Logged In. Switch to Your Account Or Log In with Different Account'
    //   );
    // }
  };

  // onPressSubmit = () => {
  //   // console.log("====")
  //   this.props.navigation.navigate('Drawer');
  // };

  async onFetchLoginRecords() {
    try {
      let response = await axios.post(Constants.GET_SIGNIN, {
        Username: this.state.mobile,
        Password: this.state.passWord
      });
      this.setState({ loading: false });
      if (response.data.Status) {
        this.saveData(
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

  saveData = async (Token, Role, Name, response) => {
    //var items = [["token", Token], ["mobile", this.state.mobile]]
    var user = [];
    let item = {};
    var UserID = response.data.UserId;
    let tostring = response.data.UserId.toString();
    // console.log(tostring, "tostring");

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
      await AsyncStorage.setItem(Constants.ORG_ID, response.data.OrgId);
      // when we handle multi acc
      // await AsyncStorage.setItem('ActiveUser', JSON.stringify(item));

      // await AsyncStorage.getItem('Users', (err, res) => {
      // console.log(res, ' storing ..... ');
      // if (!res) {
      //   AsyncStorage.setItem('Users', JSON.stringify(user));
      // } else {
      //   var items = JSON.parse(res);
      //   // var filterdata = items.filter(function (e) {
      //   //   e.Mobile !== item.Mobile;
      //   // });
      //   items.push(item);
      //   AsyncStorage.setItem('Users', JSON.stringify(items));
      //   // console.log(items, '@@@@@Login Screen items @@@@@');
      // }
      // });
      this.setState({ logeedinuser: item });
      this.setState({ loading: false });

      if (response.data.MobileVerified) {
        if (response.data.RegistrationStatus) {
          this.setState({ mobile: "", passWord: "" });
          // console.log(
          //   "Role on login================== swithcing to Dash from Drawer ",
          //   Role
          // );

          // this.props.navigation.navigate('Drawer');
          // this.props.navigation.navigate('PatientDashboard', {
          //   from: 'LoginScreen',
          // });
          // replace current screen bcz when we come back we dont want to show login
          this.props.navigation.replace("Drawer");
        } else {
          this.props.navigation.navigate("AreUDoc");
        }
      } else {
        this.props.navigation.navigate("OTPverification");
      }
    } catch (e) {
      //alert('Failed to save the data to the storage')
    }
  };

  Decrypt = (encryptStr) => {
    const cipher = new Rijndael("1234567890abcder", "cbc");
    const plaintext = Buffer.from(
      cipher.decrypt(new Buffer(encryptStr, "base64"), 128, "1234567890abcder")
    );

    const decrypted = padder.unpad(plaintext, 32);
    const clearText = decrypted.toString("utf8");
    // console.log(
    //   "Decrypt  ====================================",
    //   clearText,
    //   plaintext.toString("base64")
    // );

    return clearText.toString();
  };

  updateSecureTextEntry = () => {
    this.setState({
      secureTextEntry: !this.state.secureTextEntry
    });
  };

  render() {
    const { navigate } = this.props.navigation;

    const screenHeight = Math.round(Dimensions.get("window").height);
    const screenWidth = Math.round(Dimensions.get("window").width);
    return (
      <Container style={{ flex: 1 }}>
        <Loader loading={this.state.loading} />

        <View
          style={{
            flex: 1,
            // backgroundColor: 'transparent',
            justifyContent: "center"
          }}
        >
          {/* <ScrollView
            alwaysBounceVertical={false}
            showsHorizontalScrollIndicator={false}
            style={{ backgroundColor: "white" }}
          > */}
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
                height: screenHeight
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginTop:
                    Platform.OS === "ios"
                      ? verticalScale(45)
                      : verticalScale(25),

                  // marginTop: 40,
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
                  {""} SIGN IN
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
                  {""} /
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
                  {""} SIGN UP
                </Text>
              </View>

              <KeyboardAwareScrollView enableOnAndroid={true}>
                {/* <View style={{ flex: 1 }}> */}

                <View
                  style={{
                    backgroundColor: "tranparent",
                    flexDirection: "column",
                    marginTop: verticalScale(130),
                    marginLeft: verticalScale(25),
                    marginRight: verticalScale(25),
                    flex: 1,
                    marginBottom: verticalScale(25)
                  }}
                >
                  {/* <Text
                    style={{
                      textAlign: "center",
                      alignSelf: "center",
                      fontSize: 12,
                      color: "gray",
                      fontWeight: "bold"
                    }}
                  >
                    {""}Apk After Server Migration .in Server testing{"/n"}and
                    otp changes from fronted side to auto read
                  </Text> */}
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

                  <PasswordInput
                    textentry={this.state.secureTextEntry}
                    inputfield="Password"
                    placeholder="Password"
                    icon={require("../../icons/password.png")}
                    inputvalue={this.state.passWord}
                    onchangeTxt={(text) => {
                      this.setState({ passWord: text });
                    }}
                    updateSecureTextEntry={() =>
                      this.setState({
                        secureTextEntry: !this.state.secureTextEntry
                      })
                    }
                  />

                  <TouchableOpacity
                    onPress={() => navigate("ForgetPassotpscreen")}
                  >
                    <Text
                      style={{
                        marginLeft: verticalScale(10),
                        marginRight: verticalScale(10),
                        height: verticalScale(30),
                        marginTop: verticalScale(15),
                        textAlign: "center",
                        fontSize: 16,
                        color: "#00397e"
                      }}
                    >
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>

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
                    }}
                    onPress={this.onPressLogin}
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
                      {"LOGIN  " + ""}
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 15
                    }}
                  >
                    <View
                      style={{ flex: 1, height: 2, backgroundColor: "gray" }}
                    />
                    <View>
                      <Text
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          height: 30,
                          // marginTop: 20,
                          textAlign: "center",
                          fontSize: 16
                          //color: "#00397e",
                        }}
                      >
                        OR
                      </Text>
                    </View>
                    <View
                      style={{ flex: 1, height: 2, backgroundColor: "gray" }}
                    />
                  </View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#1B2B34",
                      marginTop: verticalScale(15),
                      borderRadius: 10,
                      height: verticalScale(50),
                      justifyContent: "center",
                      shadowOffset: { width: 2, height: 3 },
                      shadowColor: "gray",
                      shadowOpacity: 0.9,
                      elevation: 5
                    }}
                    onPress={() => navigate("LoginwithOTP", { from: "" })}
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
                      {"LOGIN WITH MOBILE NUMBER  " + ""}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#1B2B34",
                      marginTop: verticalScale(15),
                      borderRadius: 10,
                      height: verticalScale(50),
                      justifyContent: "center",
                      shadowOffset: { width: 2, height: 3 },
                      shadowColor: "gray",
                      shadowOpacity: 0.9,
                      elevation: 5
                    }}
                    onPress={this.googleLogin}
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
                      {"Google Sign-In  " + ""}
                    </Text>
                  </TouchableOpacity>
                  {/* <Button
                    title="Google Sign-In"
                    onPress={this.onGoogleButtonPress}
                  /> */}

                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 15,
                      justifyContent: "center"
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
                      Don't have an Account?
                    </Text>
                    <TouchableOpacity
                      onPress={() => navigate("RegisterScreen")}
                    // onPress={() => navigate("AreUDoc")}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          alignSelf: "center",
                          fontSize: 15,
                          color: "#00397e",
                          paddingLeft: 5
                        }}
                      >
                        Sign up
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* </View> */}
              </KeyboardAwareScrollView>
            </ImageBackground>
          </View>
          {/* </ScrollView> */}
        </View>
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
