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
  Dimensions
} from "react-native";
import { Container } from "native-base";
import TextInputCard from "../appComponents/TextInputCard";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import InputWithReqField from "../appComponents/InputwithReqField";
import axios from "axios";
import CustomeHeader from "../appComponents/CustomeHeader";
import Toast from "react-native-tiny-toast";
import Rediobutton from "../appComponents/Rediobutton";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CommonActions } from "@react-navigation/native";

export default class AddNewPatient extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      address: "",
      age: "",
      loading: false,
      submitted: false,
      patientname: "",
      Mobile: "",
      activeGender: "Male"
    };
  }

  onTextChanged(text) {
    console.log(isNaN(text), "mobile");
    if (isNaN(text)) {
      Toast.show("Please enter only number");
    } else {
      this.setState({ Mobile: text });
    }
  }
  onTextAgeChanged(text) {
    console.log(isNaN(text), "mobile");
    if (isNaN(text)) {
      Toast.show("Please enter only number");
    } else {
      this.setState({ age: text });
    }
  }
  onPressSubmit = () => {
    // console.log("====")
    // this.props.navigation.navigate("Drawer")
    if (this.state.patientname == "") {
      Toast.show("Please enter Patient name");
    } else if (this.state.Mobile == "") {
      Toast.show("Please enter Mobile number");
    } else {
      this.setState({ loading: true });
      this.PatientRegApiCall();
    }
  };

  async PatientRegApiCall() {
    console.log(
      this.state.patientname,
      this.state.Mobile,
      this.state.activeGender,
      this.state.email,
      this.state.age,
      this.state.address
    );
    try {
      let response = await axios.post(Constants.Add_NEW_PATIENT, {
        FullName: this.state.patientname,
        Mobile: this.state.Mobile,
        EmailId: this.state.email,
        Gender: this.state.activeGender,
        BirthDate: "",
        Age: this.state.age,
        Address: this.state.address,
        HealthId: "",
        Aadharnumber: "",
        Pincode: ""
      });
      console.log(response.data);
      if (response.data.Status) {
        Toast.show(response.data.Msg);
        // this.props.navigation.navigate("MyPatients");
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: "Drawer"
              },
              {
                name: "MyPatients",
                params: { refresh: "refresh" }
              }
            ]
          })
        );
      } else {
        this.setState({ loading: false });
        //alert(response.data.Msg);
        Toast.show(response.data.Msg);
      }
    } catch (err) {
      Toast.show("Something Went Wrong, Please Try Again Later");
      console.log(err, "//////");
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    const screenHeight = Math.round(Dimensions.get("window").height);
    const screenWidth = Math.round(Dimensions.get("window").width);
    return (
      <Container>
        <Loader loading={this.state.loading} />
        <CustomeHeader
          title="Add Patient"
          headerId={1}
          navigation={this.props.navigation}
        />
        <View
          style={{
            flex: 1,

            justifyContent: "center"
          }}
        >
          {/* <ScrollView
            alwaysBounceVertical={false}
           showsHorizontalScrollIndicator={false}
             style={{ flex: 1 }}
        > */}

          <View style={{ flex: 1 }}>
            <ImageBackground
              source={require("../../icons/Are-u-a-Doctor-background.png")}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "transparent"
              }}
            >
              <View
                style={{
                  height: 300,
                  backgroundColor: "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 10,
                  paddingBottom: 10
                }}
              >
                <Image
                  source={require("../../icons/addnewpatient.png")}
                  style={{
                    width: 250,
                    height: 200,
                    backgroundColor: "transparent",
                    // marginTop: 30,
                    resizeMode: "contain"
                  }}
                />
              </View>
              <KeyboardAwareScrollView
                enableOnAndroid={true}
                // style={{ marginBottom: scale(80) }}
              >
                <View
                  style={{
                    // height: 600,
                    backgroundColor: "trasparent",
                    marginTop: 0,
                    marginLeft: 30,
                    marginRight: 30
                  }}
                >
                  <InputWithReqField
                    inputfield="Patient Name "
                    placeholder="Patient Name"
                    icon={require("../../icons/full-name.png")}
                    inputvalue={this.state.patientname}
                    onchangeTxt={(text) => this.setState({ patientname: text })}
                  />

                  <InputWithReqField
                    keyboardtype={"numeric"}
                    maxlength={10}
                    inputfield="Mobile Number"
                    placeholder="Mobile Number"
                    icon={require("../../icons/mobile-number.png")}
                    inputvalue={this.state.Mobile}
                    onchangeTxt={(text) => {
                      this.onTextChanged(text);
                    }}
                  />
                  <InputWithReqField
                    keyboardtype={"numeric"}
                    maxlength={3}
                    inputfield="Age"
                    placeholder="Age"
                    icon={require("../../icons/date-of-birth.png")}
                    onchangeTxt={(text) => this.onTextAgeChanged(text)}
                    inputvalue={this.state.age}
                    //   onchangeTxt={(text) => this.setState({ age: text })}
                  />

                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 10,
                      marginLeft: 5,
                      marginRight: 5
                    }}
                  >
                    <Text style={{ fontSize: 15 }}>{"Gender"}</Text>
                    <Text style={{ fontSize: 15, color: "red" }}>*</Text>
                  </View>
                  <View
                    style={{
                      height: 40,
                      backgroundColor: "transparent",
                      marginTop: 5,
                      flexDirection: "row"
                      //   marginLeft: 10
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
                        onpress={() =>
                          this.setState({ activeGender: "Female" })
                        }
                        buttonimg={require("../../icons/radio-on.png")}
                        gender="Female"
                      ></Rediobutton>
                    ) : (
                      <Rediobutton
                        onpress={() =>
                          this.setState({ activeGender: "Female" })
                        }
                        buttonimg={require("../../icons/radio-off.png")}
                        gender="Female"
                      ></Rediobutton>
                    )}
                  </View>
                  {/* </View> */}

                  <TextInputCard
                    inputfield="Email"
                    placeholder="Email"
                    keyboardtype="email-address"
                    icon={require("../../icons/email.png")}
                    onchangeTxt={(text) => this.setState({ email: text })}
                  ></TextInputCard>

                  <TextInputCard
                    inputfield="Address"
                    placeholder="Address"
                    icon={require("../../icons/familymembermenu.png")}
                    onchangeTxt={(text) => this.setState({ address: text })}
                  />

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
                      marginBottom: 60
                    }}
                    onPress={this.state.submitted ? null : this.onPressSubmit}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                        alignSelf: "center"
                      }}
                    >
                      SUBMIT
                    </Text>
                  </TouchableOpacity>
                </View>
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
    marginTop: 0
    // backgroundColor: 'white',
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
    // backgroundColor: 'white',
    elevation: 2
  }
});
