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
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  Platform
} from "react-native";
import RNDateTimePickerForAndroid from "@react-native-community/datetimepicker";
import moment from "moment";
import { Container, Toast } from "native-base";
import TextInputCard from "../appComponents/TextInputCard";
import Constants from "../utils/Constants";
import Rediobutton from "../appComponents/Rediobutton";
import AsyncStorage from "@react-native-community/async-storage";
// import Toast from 'react-native-tiny-toast';
import Loader from "../appComponents/loader";
import DatePicker from "react-native-datepicker";
import Modal from "react-native-modal";
import InputWithReqField from "../appComponents/InputwithReqField";
import axios from "axios";
import PasswordInput from "../appComponents/PaaswordInput";
import DateTimePicker from "react-native-modal-datetime-picker";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// import {ModalPicker} from "../appComponents/ModalPicker";
export default class AddNewFamilyMember extends Component {
  constructor() {
    super();
    this.state = {
      FullName: "",
      Mobile: "",
      EmailId: "",
      Password: "",
      Gender: "",
      BirthDate: "",
      activeGender: "Male",
      loading: false,
      date: "",
      healthID: "",
      adharNumber: "",
      relation: "Relation",
      relationId: "",
      relationList: [],
      isShowDataPicker: false,
      secureTextEntry: true,
      PinCode: "",
      channelcode: "",
      isDateTimePickerVisible: false,
      from: ""
    };
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   ' Appointment componentWillReceiveProps==============================',
    //   nextProp
    // );
    //this.setState({selectedtestId: nextProp.route.params.testids });

    this.setState(
      { relationList: [], from: nextProp.route.params.from },
      () => {
        this.getFamilyRelationList();
      }
    );
  };

  componentDidMount = async () => {
    // console.log('componentDidMount==============================');
    this.setState(
      { relationList: [], from: this.props.route.params.from },
      () => {
        this.getFamilyRelationList();
      }
    );
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
  };

  onPressSignup = () => {
    // console.log("On press Submit ", this.state.PinCode);
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const Passwordreg = new RegExp(
      /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{6,}$/
    );
    if (this.state.FullName == "") {
      // Toast.show('Please enter full name');

      Toast.show({
        text: "Please enter full name",
        duration: 1000
      });
    } else if (!isNaN(this.state.FullName)) {
      Toast.show({ text: "Please enter only alphabets in Name" });
    } else if (
      this.state.EmailId != "" &&
      reg.test(this.state.EmailId.trimEnd()) === false
    ) {
      Toast.show({ text: "Please enter valid email" });
    } else if (this.state.Mobile.length != 10) {
      Toast.show({ text: "Please enter mobile number", duration: 3000 });
    } else if (this.state.BirthDate == "") {
      Toast.show({ text: "Please enter your birthdate" });
    } else if (this.state.Password == "") {
      Toast.show({ text: "Please enter your password" });
    } else if (Passwordreg.test(this.state.Password) === false) {
      Toast.show({
        text: "Please enter password with Minimum 6 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet, 1 Number and 1 Special Character",
        duration: 10000
      });
    } else if (this.state.adharNumber != "" && this.state.adharNumber < 12) {
      // console.log(
      //   this.state.adharNumber,
      //   'adhar',
      //   'cond',
      //   this.state.adharNumber != '' && this.state.adharNumber < 12,
      //   this.state.adharNumber.length
      // );
      Toast.show({ text: "Please enter Valid  adhar number" });
    } else if (this.state.PinCode == "") {
      Toast.show({ text: "Please enter pincode number" });
    } else if (this.state.PinCode != "" && this.state.PinCode.length != 6) {
      Toast.show({ text: "Please enter valid pincode number" });
    } else if (this.state.relation == "Relation") {
      Toast.show({ text: "Please Select Relation" });
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

  async SignupAPicall() {
    console.log(this.state.Mobile, "////");
    try {
      let response = await axios.post(Constants.ADD_NEWMEMBER, {
        FullName: this.state.FullName,
        Mobile: this.state.Mobile,
        EmailId: this.state.EmailId,
        Password: this.state.Password,
        Gender: this.state.activeGender,
        BirthDate: this.state.BirthDate,
        HealthId: this.state.healthID,
        Aadharnumber: this.state.adharNumber,
        Relation: this.state.relationId,
        Pincode: this.state.PinCode,
        ChannelPartnerCode: this.state.channelcode
      });
      console.log(response.data, "new family memeber regi");
      this.setState({ loading: false });

      if (response.data.Status) {
        Toast.show({ text: response.data.Msg });
        this.props.navigation.navigate("NewMemberOtpVerification", {
          FamilyMemberId: response.data.FamilyMemberId,
          from: this.state.from,
          mobile: this.state.Mobile
        });
      } else {
        Toast.show({ text: response.data.Msg });
      }
    } catch (errors) {
      this.setState({ loading: false });
      Toast.show({ text: "Something Went Wrong, Please Try Again Later" });

      // Toast.show({ text: " Network Error,please check the internet" });
    }
  }

  onPressTnC = () => {
    this.props.navigation.navigate("TermnCondition");
  };

  onPressprivacyPolicy = () => {
    this.props.navigation.navigate("PrivacyPolicy");
  };
  showDateTimePicker = () => {
    // console.log('os d msnens@@@@@')
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
    // console.log("A date has been picked: ", date);
    this.hideDateTimePicker();
  };
  renderModalPicekr = () => {
    // console.log("modal date picker");
    return (
      <DateTimePicker
        isVisible={this.state.isDateTimePickerVisible}
        onConfirm={this.handleDatePicked}
        onCancel={this.hideDateTimePicker}
        maximumDate={new Date()}
        display="spinner"
      />
    );
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  DismissModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  selectRelation = (index) => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
    let info = this.state.relationList[index];
    // console.log("index====================================", index, info);
    this.setState({ relation: info.Name, relationId: info.Id });
  };

  async getFamilyRelationList() {
    try {
      const response = await axios.get(Constants.FAMILY_RELATION);
      // console.log(response.data);
      this.setState({ loading: false });
      if (response.data.Status) {
        //Toast.show(response.data.Msg)
        let responseData = this.state.relationList;

        response.data.List.map((item) => {
          // item.isShow=false;
          responseData.push(item);
        });

        this.setState({
          relationList: responseData,
          loading: false,
          refreshing: false
        });
      } else {
        Toast.show({ text: response.data.Msg });
      }
    } catch (error) {
      Toast.show({ text: "Something went wrong,Please Try Again Later" });
      // Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ loading: false });
      // console.error(error);
    }
  }

  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };

  onChangedAdhar(text) {
    if (isNaN(text)) {
      Toast.show({ text: "Please enter only number" });
    } else {
      this.setState({ adharNumber: text });
    }
  }
  render() {
    const { navigate } = this.props.navigation;

    // console.log(this.state.loading, "Loading $$$$$$$$$$$$$$$$$$");
    const screenHeight = Math.round(Dimensions.get("window").height);
    const screenWidth = Math.round(Dimensions.get("window").width);
    // console.log(screenHeight, "Add family memeber ");
    return (
      <View style={{ flex: 1 }}>
        <Loader loading={this.state.loading} />

        <Modal isVisible={this.state.isModalVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            <View
              style={{
                height: "50%",
                width: "100%",
                backgroundColor: "white",
                flexDirection: "column",
                borderRadius: 5
              }}
            >
              <Text
                style={{
                  marginTop: 10,
                  marginLeft: 10,
                  fontSize: 24,
                  color: "black",
                  textAlign: "center"
                }}
              >
                Relation
              </Text>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginRight: 5,
                  marginTop: 8
                }}
              ></View>
              <ScrollView
                alwaysBounceVertical={true}
                showsHorizontalScrollIndicator={false}
                style={{
                  backgroundColor: "white",
                  marginTop: 0,
                  paddingHorizontal: 0
                }}
              >
                {this.state.relationList.map((item, index) => {
                  return (
                    <TouchableOpacity
                      style={{ height: 40, flexDirection: "column" }}
                      onPress={() => this.selectRelation(index)}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          margin: 5,
                          backgroundColor: "white",
                          fontSize: 18,
                          color: "gray"
                        }}
                      >
                        {item.Name}
                      </Text>
                      <View
                        style={{
                          height: 0.4,
                          backgroundColor: "lightgray",
                          marginRight: 30,
                          marginLeft: 30,
                          marginTop: 5,
                          padding: 0.5
                        }}
                      ></View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <Button title="Cancel" onPress={this.DismissModal} />
            </View>
          </View>
        </Modal>

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
              // marginTop: 20,
              justifyContent: "space-between",
              height: 50,
              marginBottom:
                screenHeight <= 640 ? verticalScale(160) : verticalScale(120)
            }}
          >
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
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
                marginRight: 5
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
                ADD FAMILY MEMBER
              </Text>
            </View>
          </View>

          <KeyboardAwareScrollView enableOnAndroid={true}>
            <View
              style={{
                backgroundColor: "tranparent",
                flexDirection: "column",
                // marginTop: 50,
                // marginTop: 120,
                // marginTop: 180,
                marginLeft: 25,
                marginRight: 25
                // marginTop:40
                // flex: 1,
              }}
            >
              {/* <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  // style={{ flex: 1 }}
                > */}
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
                onchangeTxt={(text) => this.setState({ EmailId: text })}
              ></TextInputCard>

              <InputWithReqField
                keyboardtype={"numeric"}
                numeric
                maxlength={10}
                inputfield="Mobile Number "
                placeholder="Mobile Number"
                icon={require("../../icons/mobile-number.png")}
                inputvalue={this.state.Mobile}
                onchangeTxt={(text) => this.onTextChanged(text)}
              />

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
                      // this.showDateTimePicker
                      this.setState({
                        // isShowDataPicker: !this.state.isShowDataPicker,
                        isDateTimePickerVisible:
                          !this.state.isDateTimePickerVisible
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
                  </TouchableOpacity>
                  {this.state.isDateTimePickerVisible
                    ? this.renderModalPicekr()
                    : null}
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
                            !this.state.isDateTimePickerVisible
                          // isShowDataPicker: !this.state.isShowDataPicker,
                        })
                      }
                    >
                      <Text
                        style={{
                          marginLeft: 0,
                          color: this.state.BirthDate == "" ? "gray" : "black",
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

              {/* <InputWithReqField
                textentry
                inputfield="Password "
                placeholder="Password"
                icon={require('../../icons/password.png')}
                onchangeTxt={(text) => this.setState({ Password: text })}
              /> */}
              <PasswordInput
                textentry={this.state.secureTextEntry}
                inputfield="Password"
                placeholder="Password"
                icon={require("../../icons/password.png")}
                inputvalue={this.state.Password}
                onchangeTxt={(text) => this.setState({ Password: text })}
                updateSecureTextEntry={() =>
                  this.setState({
                    secureTextEntry: !this.state.secureTextEntry
                  })
                }
              />

              <TextInputCard
                keyboardtype={"numeric"}
                numeric
                maxlength={14}
                inputfield="HealthID"
                placeholder="HealthID"
                icon={require("../../icons/password.png")}
                onchangeTxt={(text) => this.setState({ healthID: text })}
              ></TextInputCard>

              <TextInputCard
                keyboardtype={"numeric"}
                numeric
                maxlength={12}
                inputfield="Adhar Number"
                placeholder="Adhar Number"
                icon={require("../../icons/aadharicon.png")}
                onchangeTxt={(text) => this.onChangedAdhar(text)}

                // onchangeTxt={(text) => this.setState({ adharNumber: text })}
              ></TextInputCard>

              <InputWithReqField
                keyboardtype={"numeric"}
                maxlength={6}
                inputfield="Pincode"
                placeholder="Pincode"
                icon={require("../../icons/PinCode.png")}
                // onchangeTxt={(text) => this.onChangePassword(text)}
                onchangeTxt={(text) => this.setState({ PinCode: text })}
              />

              <TextInputCard
                maxLength={12}
                inputfield="
                  Channel Partner Code"
                placeholder="
                  Channel Partner Code"
                icon={require("../../icons/channel-partner.png")}
                // onchangeTxt={(text) => this.onChangePassword(text)}
                onchangeTxt={(text) => this.setState({ channelcode: text })}
              />
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
                <Text style={{ height: 18, fontSize: 15 }}>
                  Relation <Text style={{ color: "red" }}>*</Text>
                </Text>
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
                    borderRadius: 5
                  }}
                >
                  <Image
                    source={require("../../icons/full-name.png")}
                    style={{
                      height: 20,
                      width: 20,
                      marginLeft: 8,
                      justifyContent: "center",
                      alignSelf: "center"
                    }}
                  />
                  <View
                    style={{
                      height: 34,
                      width: 1,
                      marginTop: 10,
                      marginBottom: 8,
                      marginLeft: 10,
                      backgroundColor: "lightgray",
                      justifyContent: "center",
                      alignContent: "center"
                    }}
                  ></View>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: "white",
                      justifyContent: "center",
                      alignContent: "center"
                    }}
                  >
                    <TouchableOpacity onPress={this.toggleModal}>
                      {this.state.relation == "Relation" ? (
                        <Text
                          style={{
                            textAlign: "left",
                            marginLeft: 10,
                            backgroundColor: "white",
                            fontSize: 15,
                            color: "gray"
                          }}
                        >
                          {this.state.relation}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            textAlign: "left",
                            marginLeft: 10,
                            backgroundColor: "white",
                            fontSize: 15,
                            color: "black"
                          }}
                        >
                          {this.state.relation}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={this.toggleModal}>
                    <Image
                      source={require("../../icons/drop-arrow.png")}
                      style={{
                        height: 15,
                        width: 15,
                        marginRight: 10,
                        marginTop: 15,
                        justifyContent: "center",
                        alignSelf: "center"
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>

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
                  marginTop: 15,
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
                  By using to this app you agree to{"  "}
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
                  elevation: 5,
                  marginBottom: 25
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
                  marginTop: 15,
                  justifyContent: "center"
                }}
              ></View>
              {/* </KeyboardAvoidingView> */}
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </View>
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
