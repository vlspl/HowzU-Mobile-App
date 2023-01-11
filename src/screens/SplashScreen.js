import React from "react";
import {
  Alert,
  Dimensions,
  View,
  BackHandler,
  Image,
  Text,
  ImageBackground,
  AppState,
  NativeModules,
  StatusBar,
} from "react-native";
import Constants from "../utils/Constants";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
let value = null;
let status = "false";
const { StatusBarManager } = NativeModules;
import analytics from "@react-native-firebase/analytics";

function StatusBarPlaceHolder() {
  return (
    <View
      style={{
        width: "100%",
        height: Platform.OS === "ios" ? StatusBarManager.HEIGHT : 0,
        backgroundColor: "#275BB4",
      }}
    >
      <StatusBar barStyle="light-content" />
    </View>
  );
}
export default class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fcm_token: "",
      isnotification: false,
      screenName: "PatientDashboard",
    };
    // console.log(this.props, '**********Spash Screen***********');
  }

  componentDidMount = () => {
    this.checkUserSignedIn();
  };
  async checkUserSignedIn() {
    try {
      value = await AsyncStorage.getItem(Constants.TOKEN_KEY);
      status = await AsyncStorage.getItem(Constants.REGISTRATION_STATUS);
      let ismobileverified = await AsyncStorage.getItem(
        Constants.MOBILE_VERIFIED
      );
      let isDoc = await AsyncStorage.getItem("IsDoc");

      if (value != null && status == "true" && ismobileverified == "true") {
        if (status != "false" && ismobileverified != "false") {
          // console.log("Got to Drawer Login scuess===open drawer");
          setTimeout(() => {
            this.props.navigation.replace("Drawer");
            //  this.props.navigation.reset('Drawer');
          }, 2000);
        }
        // else if (ismobileverified == 'false') {
        //   console.log('Got to Otp Mobile not verified yet===open drawer');

        //   setTimeout(() => {
        //     this.props.navigation.navigate('OTPverification',{from:'splash'});
        //   }, 2000);
        // } else if (isDoc == null) {
        //   setTimeout(() => {
        //     this.props.navigation.navigate('AreUDoc');
        //   }, 2000);
        // } else if (isDoc == 'yes') {
        //   console.log('Flase Reg Status');
        //   setTimeout(() => {
        //     this.props.navigation.navigate('DoctorRegScreen');
        //   }, 2000);
        // }
        //  else {
        //   setTimeout(() => {
        //     this.props.navigation.navigate('AreUDoc');
        //   }, 2000);
        // }
      } else {
        // do something else
        // console.log("splashscreen===open login");

        setTimeout(() => {
          this.props.navigation.navigate("LoginScreen", {
            from: "SplashScreen",
          });
        }, 2000);
      }
    } catch (error) {
      Toast.show("Something Went Wrong, Please Try Again Later");
      // Error retrieving data
    }
  }

  componentWillUnmount() { }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBarPlaceHolder />

        <ImageBackground
          source={require("../../icons/Splash-screen.jpg")}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "80%",
              height: "20%",
              alignSelf: "center",
            }}
            source={require("../../icons/Finallogo.png")}
            resizeMode="contain"
          />
        </ImageBackground>
      </View>
    );
  }
}
