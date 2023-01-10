import React, { Component } from "react";

import {
  FlatList,
  Alert,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

import { Container } from "native-base";
import TextInputCard from "../appComponents/TextInputCard";
import Constants from "../utils/Constants";
import Validate from "../utils/validation";
import AsyncStorage from "@react-native-community/async-storage";
import Toast from "react-native-tiny-toast";
import Loader from "../appComponents/loader";
import PasswordInput from "../appComponents/PaaswordInput";
import axios from "axios";

export default class ForgetPassReset extends Component {
  constructor() {
    super();
    this.state = {
      mobile: "",
      password: "",
      confirmpass: "",
      loading: false,
      secureTextEntry: true,
      confirm: true,
      isErr: false
    };
  }

  componentDidMount() {
    this.retrieveData();
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

  onChangePassword(text, name) {
    const Passwordreg = new RegExp(
      /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{6,}$/
    );

    // this.setState({ password: text });
    if (name == "pass") {
      this.setState({ password: text });
    } else {
      this.setState({ confirmpass: text });
    }
    if (text.length < 6) {
      // this.setState({ Password: text });
      this.setState({ isErr: true });
    } else if (Passwordreg.test(text)) {
      if (name == "pass") {
        this.setState({ isErr: false, password: text });
      } else {
        this.setState({ isErr: false, confirmpass: text });
      }
    } else {
      this.setState({ password: text });
      this.setState({ isErr: true });
    }
  }

  onPressReset = () => {
    const Passwordreg = new RegExp(
      /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{6,}$/
    );
    if (this.state.mobile == "") {
      Toast.show("Please enter mobile number");
    } else if (this.state.mobile.length != 10) {
      Toast.show("Please enter valid mobile number");
    } else if (this.state.password == "") {
      Toast.show("Please enter password");
    } else if (this.state.confirmpass == "") {
      Toast.show("Please confirm your password");
    } else if (this.state.password != this.state.confirmpass) {
      Toast.show("Password not match");
    } else if (Passwordreg.test(this.state.password) === false) {
      Toast.show(
        "Please enter Minimum 6 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet, 1 Number and 1 Special Character"
      );
    } else if (Passwordreg.test(this.state.confirmpass) === false) {
      Toast.show(
        "Please enter Minimum 6 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet, 1 Number and 1 Special Character"
      );
    } else {
      this.setState({
        loading: true
      });
      this.onPressSetNewPassword();
    }
  };

  async onPressSetNewPassword() {
    // console.log(this.state.mobile);
    // console.log(this.state.password);
    // console.log(this.state.confirmpass);

    try {
      let response = await axios.post(Constants.GET_SETPASSWORD, {
        Mobile: this.state.mobile,
        Password: this.state.password
      });
      this.setState({ loading: false });
      // console.log("../././.", response.data);
      if (response.data.Status) {
        Toast.show(response.data.Msg);
        this.props.navigation.navigate("LoginScreen");
      } else {
        alert(response.data.Msg);
      }
    } catch (errors) {
      this.setState({ loading: false });
      Toast.show("Something Went Wrong, Please Try Again Later");

      // alert(errors);
      // console.log(errors);
    }
  }

  render() {
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
                    // marginTop: 40,
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
                    RESET PASSWORD
                  </Text>
                </View>

                <View
                  style={{
                    height: 500,
                    backgroundColor: "tranparent",
                    flexDirection: "column",
                    marginTop: 160,
                    marginLeft: 25,
                    marginRight: 25
                  }}
                >
                  <PasswordInput
                    textentry={this.state.secureTextEntry}
                    inputfield="New Password"
                    placeholder="New Password"
                    icon={require("../../icons/password.png")}
                    inputvalue={this.state.password}
                    // onchangeTxt={(text) => this.setState({ password: text })}
                    onchangeTxt={(text) => this.onChangePassword(text, "pass")}
                    updateSecureTextEntry={() =>
                      this.setState({
                        secureTextEntry: !this.state.secureTextEntry
                      })
                    }
                  />
                  <PasswordInput
                    textentry={this.state.confirm}
                    inputfield="Confirm New Password"
                    placeholder="Password"
                    icon={require("../../icons/password.png")}
                    inputvalue={this.state.confirmpass}
                    // onchangeTxt={(text) => this.setState({ confirmpass: text })}
                    onchangeTxt={(text) =>
                      this.onChangePassword(text, "confirmpass")
                    }
                    updateSecureTextEntry={() =>
                      this.setState({
                        confirm: !this.state.confirm
                      })
                    }
                  />
                  {this.state.isErr ? (
                    <Text style={{ color: "red" }}>
                      {
                        "  Enter password with minimum 6 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet, 1 Number and  1 SpecialCharacter"
                      }
                    </Text>
                  ) : null}
                  {/* <TextInputCard
                    textentry
                    inputfield="New Password"
                    placeholder="Password"
                    icon={require('../../icons/password.png')}
                    onchangeTxt={(text) => this.setState({ password: text })}
                  ></TextInputCard>

                  <TextInputCard
                    textentry
                    inputfield="Confirm New Password"
                    placeholder="Password"
                    icon={require('../../icons/password.png')}
                    onchangeTxt={(text) => this.setState({ confirmpass: text })}
                  ></TextInputCard> */}

                  <TouchableOpacity
                    style={{
                      backgroundColor: "#1B2B34",
                      marginTop: 20,
                      borderRadius: 10,
                      height: 50,
                      justifyContent: "center",
                      elevation: 5,
                      shadowOffset: { width: 2, height: 3 },
                      shadowColor: "gray",
                      shadowOpacity: 0.9
                    }}
                    onPress={this.onPressReset}
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
                      RESET
                    </Text>
                  </TouchableOpacity>
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
