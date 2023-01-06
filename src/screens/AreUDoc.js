import React, { Component } from "react";
//import CustomListview from './Screen/DoctorList'

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Button,
  Dimensions,
} from "react-native";
import Constants from "../utils/Constants";
import Toast from "react-native-tiny-toast";
import Loader from "../appComponents/loader";
import AsyncStorage from "@react-native-community/async-storage";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

import axios from "axios";

export default class AreUDoc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      USER_ID: "",
    };
    /// this.props.navigation.dispatch(resetAction);
  }

  // retrieveData() {
  //   var activebtrole;
  //   AsyncStorage.getItem(Constants.ACCOUNT_ROLE).then((value) => {
  //     activebtrole = value.toLowerCase();
  //   });
  //   // console.log(activebtrole, "**********Patent Dashboardcurrent role");
  //   AsyncStorage.getItem(Constants.USER_ID).then((value) => {
  //     let valuelowrcase = value;

  //     this.setState({
  //       USER_ID: valuelowrcase,
  //     });
  //   });
  // }

  // componentDidMount() {
  //   this.retrieveData();
  // }

  onPressNobtn = () => {
    // console.log("====")
    // this.props.navigation.navigate("Drawer")
    this.setState({ loading: true });
    this.saveData();
    this.onPressUpdateRegStatus();
  };

  onPressYesbtn = () => {
    // console.log("====")
    // this.props.navigation.navigate("Drawer")
    // this.setState({ loading: true });
    this.IsDocsaveData();
    //  this.onPressUpdateRegStatus();
    this.props.navigation.navigate("DoctorRegScreen");
  };

  async onPressUpdateRegStatus() {
    //console.log(this.state.mobile);

    try {
      const response = await axios.get(Constants.GET_UPDATESTATUS);
      // console.log(response.data);

      this.setState({ loading: false });
      if (response.data.Status) {
        Toast.show(response.data.Msg);

        this.saveData();
      } else {
        Toast.show(response.data.Msg);
      }
    } catch (error) {
      this.setState({ loading: false });
      console.error(error);
      Toast.show("Something Went Wrong, Please Try Again Later");
    }
  }

  IsDocsaveData = async () => {
    /// alert(response.data.Status);
    //var items = [["token", Token], ["mobile", this.state.mobile]]
    // console.log('Role Doctor==================');
    try {
      // await AsyncStorage.setItem(Constants.USER_ROLE, 'doctor');
      await AsyncStorage.setItem("IsDoc", "yes");
      // await AsyncStorage.setItem(
      //   Constants.REGISTRATION_STATUS,
      //   JSON.stringify('true')
      // );
    } catch (e) {
      //alert('Failed to save the data to the storage')
    }
  };

  saveData = async () => {
    /// alert(response.data.Status);
    //var items = [["token", Token], ["mobile", this.state.mobile]]
    // console.log('Role patient==================');
    try {
      await AsyncStorage.setItem(Constants.USER_ROLE, "patient");
      await AsyncStorage.setItem("IsDoc", "no");
      await AsyncStorage.setItem(Constants.REGISTRATION_STATUS, "true");
      this.props.navigation.navigate("Drawer");
    } catch (e) {
      //alert('Failed to save the data to the storage')
    }
  };

  render() {
    const screenHeight = Math.round(Dimensions.get("window").height);
    const { navigate } = this.props.navigation;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "transparent",
          justifyContent: "center",
        }}
      >
        <Loader loading={this.state.loading} />

        <ScrollView
          alwaysBounceVertical={false}
          showsHorizontalScrollIndicator={false}
          style={{ backgroundColor: "white" }}
        >
          <ImageBackground
            source={require("../../icons/Are-u-a-Doctor-background.png")}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
            }}
          >
            <View
              style={{
                height: verticalScale(360),
                backgroundColor: "transparent",
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 20,
                paddingBottom: verticalScale(20),
              }}
            >
              <Image
                source={require("../../icons/Are-u-a-Doctor.png")}
                style={{
                  width: scale(170),
                  height: verticalScale(230),
                }}
              />
            </View>
            <View
              style={{
                height: verticalScale(310),
                backgroundColor: "transparent",
                marginTop: 0,
              }}
            >
              <Text
                style={{
                  fontSize: 36,
                  textAlign: "center",
                  color: "#494949",
                  fontWeight: "bold",
                }}
              >
                Are you a Doctor?
              </Text>

              <TouchableOpacity
                style={{
                  height: 50,
                  marginLeft: 60,
                  marginRight: 60,
                  marginTop: verticalScale(50),
                  backgroundColor: "#33bc00",
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() =>
                  this.props.navigation.navigate("DoctorRegScreen")
                }
                // onPress={this.onPressYesbtn}
              >
                <Text
                  style={{
                    fontSize: 22,
                    textAlign: "center",
                    color: "white",
                    fontWeight: "bold",
                    alignSelf: "center",
                  }}
                >
                  YES
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 50,
                  marginLeft: 60,
                  marginRight: 60,
                  marginTop: 35,
                  backgroundColor: "#1e2a33",
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={this.onPressNobtn}
              >
                <Text
                  style={{
                    fontSize: 22,
                    textAlign: "center",
                    color: "white",
                    fontWeight: "bold",
                    alignSelf: "center",
                  }}
                >
                  NO
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containermain: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "white",
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
    elevation: 2,
  },
});
