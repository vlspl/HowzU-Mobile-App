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
  KeyboardAvoidingView,
} from "react-native";
import { CommonActions } from "@react-navigation/native";

import TextInputCard from "../appComponents/TextInputCard.js";
import Constants from "../utils/Constants";
import Toast from "react-native-tiny-toast";
import Loader from "../appComponents/loader";
import AsyncStorage from "@react-native-community/async-storage";
import { Container } from "native-base";
import InputWithReqField from "../appComponents/InputwithReqField";
import axios from "axios";

export default class DoctorRegScreen extends Component {
  constructor() {
    super();

    this.state = {
      degree: "",
      specializin: "",
      clinic: "",
      loading: false,
      submitted: false,
    };
  }

  onPressSubmit = () => {
    // console.log("====")
    // this.props.navigation.navigate("Drawer")
    if (this.state.degree == "") {
      Toast.show("Please enter Designation");
    } else if (this.state.specializin == "") {
      Toast.show("Please enter your Speciality");
    }
    //  else if (this.state.clinic == '') {
    //   Toast.show('Please enter clinic address');
    // }
    else {
      this.setState({ loading: true, submitted: true });
      this.DocRegApiCall();
    }
  };

  async DocRegApiCall() {
    try {
      let response = await axios.post(Constants.GET_DOCREG, {
        Degree: this.state.degree,
        SpecialistIn: this.state.specializin,
        Clinic: this.state.clinic,
      });
      // console.log(response.data, "//////");

      // console.log("docor ", response.data);

      if (response.data.Status) {
        this.saveData();
      } else {
        this.setState({ loading: false });
        //alert(response.data.Msg);
        Toast.show(response.data.Msg);
      }
    } catch (errors) {
      Toast.show("Something Went Wrong, Please Try Again Later");

      //alert(errors);
      // console.log(errors);
    }
  }

  saveData = async () => {
    /// alert(response.data.Status);
    //var items = [["token", Token], ["mobile", this.state.mobile]]
    //console.log("Role doctor==================");
    try {
      this.setState({ loading: false });
      await AsyncStorage.setItem(Constants.USER_ROLE, "doctor");
      await AsyncStorage.setItem(Constants.ACCOUNT_ROLE, "doctor");
      await AsyncStorage.setItem(Constants.REGISTRATION_STATUS, "true");
      // console.log(this.props.navigation, "navigation");
      // this.props.navigation.replace("Drawer");

      // await AsyncStorage.setItem('ActiveUser', JSON.stringify(item));

      // this.props.navigation.navigate("Drawer");
      // this.props.navigation.reset("Drawer");
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: "Drawer",
            },
          ],
        })
      );
    } catch (e) {
      //alert('Failed to save the data to the storage')
    }
  };

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
            justifyContent: "center",
          }}
        >
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
                  height: 350,
                  backgroundColor: "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              >
                <Image
                  source={require("../../icons/Are-u-a-Doctor.png")}
                  style={{
                    width: 300,
                    height: 280,
                    backgroundColor: "transparent",
                    marginTop: 30,
                    resizeMode: "contain",
                  }}
                />
              </View>
              <View
                style={{
                  height: 450,
                  backgroundColor: "trasparent",
                  marginTop: 0,
                  marginLeft: 30,
                  marginRight: 30,
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    textAlign: "center",
                    color: "#494949",
                    fontWeight: "bold",
                    marginLeft: 10,
                    marginRight: 10,
                  }}
                >
                  Please help us know you better
                </Text>

                {/* <TextInputCard
                  inputfield="Designation"
                  placeholder="Designation"
                  icon={require('../../icons/Designation.png')}
                  onchangeTxt={(text) => this.setState({ degree: text })}
                ></TextInputCard> */}
                <InputWithReqField
                  inputfield="Speciality"
                  placeholder="Speciality"
                  icon={require("../../icons/Designation.png")}
                  onchangeTxt={(text) => this.setState({ specializin: text })}
                  // onchangeTxt={(text) => this.setState({ degree: text })}
                />

                <InputWithReqField
                  // inputfield="Speciality"
                  // placeholder="Speciality"
                  inputfield="Education"
                  placeholder="Education"
                  icon={require("../../icons/Specialist-in.png")}
                  onchangeTxt={(text) => this.setState({ degree: text })}
                  // onchangeTxt={(text) => this.setState({ specializin: text })}
                />
                {/* <TextInputCard
                  inputfield="Speciality"
                  placeholder="Speciality"
                  icon={require('../../icons/Specialist-in.png')}
                  onchangeTxt={(text) => this.setState({ specializin: text })}
                ></TextInputCard> */}

                <TextInputCard
                  inputfield="Clinic"
                  placeholder="Clinic"
                  icon={require("../../icons/Clinic.png")}
                  onchangeTxt={(text) => this.setState({ clinic: text })}
                ></TextInputCard>

                <TouchableOpacity
                  style={{
                    height: 50,
                    marginLeft: 0,
                    marginRight: 0,
                    marginTop: 35,
                    backgroundColor: "#1e2a33",
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={this.state.submitted ? null : this.onPressSubmit}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      textAlign: "center",
                      color: "white",
                      fontWeight: "bold",
                      alignSelf: "center",
                    }}
                  >
                    SUBMIT
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </ScrollView>
        </View>
      </Container>
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
