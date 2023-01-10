import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  StyleSheet
} from "react-native";

import {
  Container,
  Tab,
  Tabs,
  TabHeading,
  Icon,
  List,
  ListItem,
  Content,
  Left,
  Right,
  Body
} from "native-base";
import CustomeHeader from "../appComponents/CustomeHeader";
import axios from "axios";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import Toast from "react-native-tiny-toast";
import ImageLoad from "react-native-image-placeholder";
import CustomFooter from "../appComponents/CustomFooter";
import AsyncStorage from "@react-native-community/async-storage";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import QRC from "react-native-qrcode-svg";
// import QRCodeScanner from "react-native-qrcode-scanner";
// import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MyDoctorListComp from "../appComponents/MyDoctorListComp";
const Rijndael = require("rijndael-js");
//const bufferFrom = require('buffer-from')
global.Buffer = global.Buffer || require("buffer").Buffer;
const padder = require("pkcs7-padding");
// import { TabView, SceneMap } from "react-native-tab-view";

export default class UserProfile extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      selectedIds: [],
      userDetails: [],
      pageNo: 1,
      searchString: "",
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      activebtn: "",
      isDatePickerVisible: false,
      whichprofile: "medical",
      index: 0,
      scan: false,
      ScanResult: false,
      result: null,
      isshowQRTab: false,
      userSettingDetails: [],
      menus: [
        {
          key: "first",
          title: "Covid Vaccination",
          leftimg: require("../../icons/vaccinated.png"),
          gotoScreen: "VaccinationCertificate",
          from: "",
          type: ""
        },
        {
          key: "second",
          title: "Drug Allergy",
          leftimg: require("../../icons/drugallergy.png"),
          gotoScreen: "DrugAllergy",

          from: "",
          type: "Drug"
        },
        {
          key: "third",
          title: "Food Allergy",
          leftimg: require("../../icons/foodallergies.png"),
          // gotoScreen: "Allergy",
          gotoScreen: "DrugAllergy",

          from: "",
          type: "Food"
        },
        {
          key: "fourth",
          // title: "Family History",
          title: "Family Medical Condition",
          leftimg: require("../../icons/familyhistory.png"),
          // gotoScreen: "Allergy",
          gotoScreen: "FamilyHis",
          from: "",
          type: "Family History" //for getting  type: "Medical Condition"
        },
        {
          key: "fifth",
          // title: "Medical Condition",
          title: "Medical Condition",
          leftimg: require("../../icons/medicalcondition.png"),
          // gotoScreen: "MedicalCondition",
          gotoScreen: "DrugAllergy",
          from: "",
          type: "Medical Condition"
        }
      ]
    };
    // console.log('constructort==============================');
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    this.setState(
      {
        isLoading: true,
        userDetails: [],
        activebtn: nextProp.route.params.role,
        isshowQRTab: false
      },
      () => {
        // this.retrieveData();
        this.getProfileDetail();
      }
    );
  };

  componentDidMount() {
    this.setState(
      {
        userDetails: [],
        isLoading: true,
        activebtn: this.props.route.params.role,
        isshowQRTab: false
      },
      () => {
        this.getProfileDetail();
      }
    );
  }

  onPressMyPatient = () => {
    // console.log('onPressMyDoctor=================');
    this.props.navigation.navigate("MyPatients", { refresh: true });
  };

  onPressBookTest = () => {
    // console.log('onPressMyDoctor=================');
    this.props.navigation.navigate("ChooseBookingScreen");
  };

  onPressHome = () => {
    // console.log('onPressProfile=================');
    this.props.navigation.navigate("PatientDashboard", { refresh: true });
  };

  // new
  onPressLogoutYes = async () => {
    try {
      response = await axios.post(Constants.FIREBASE_REGISTER_TOKEN + null);
    } catch (errors) {
      //Toast.show("Something Went Wrong, Please Try Again Later");
      console.log(errors, "errors");
    }
    this.setState({ isDrawerOpen: true });
    // this.props.navigation.closeDrawer();
    // console.log(this.state.mobile, 'Mobile number to delete the user');
    var id = this.state.mobile;
    var updateUser = [];
    await AsyncStorage.removeItem(Constants.ACCOUNT_ROLE);
    await AsyncStorage.removeItem(Constants.TOKEN_KEY);
    await AsyncStorage.removeItem(Constants.USER_ROLE);
    await AsyncStorage.removeItem(Constants.USER_MOBILE);
    await AsyncStorage.removeItem(Constants.USER_NAME);
    await analytics().resetAnalyticsData();
    // await AsyncStorage.removeItem('ActiveUser');
    await AsyncStorage.removeItem(Constants.REGISTRATION_STATUS);
    if (this.state.isDrawerOpen) {
      this.props.navigation.closeDrawer();
    }

    // this.props.navigation.dispatch(
    //   CommonActions.reset({
    //     index: 1,
    //     routes: [
    //       {
    //         name: "Login",
    //       },
    //     ],
    //   })
    // );
    // this.props.navigation.reset("LoginScreen");
    this.props.navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen" }]
    });
  };
  async getDoctorProfileDetail() {
    // console.log("././.8888888888");
    try {
      const response = await axios.get(Constants.GET_DOCTOR_PROFILE);
      this.setState({ isLoading: false });
      //Toast.show(response.data.Msg)
      if (response.data.Status) {
        let responseData = [];

        response.data.MyDetails.map((item) => {
          responseData.push(item);
        });

        this.setState({ userDetails: responseData, isLoading: false });
      } else {
        // Toast.show(response.data.Msg);
        this.setState({ userDetails: [], isLoading: false });
      }
    } catch (error) {
      Toast.show("Network Error,Please check you're internet connection");
      this.setState({ isLoading: false });
      console.log(error);
    }
  }

  async getProfileDetail() {
    if (this.state.activebtn == "doctor") {
      this.getDoctorProfileDetail();
    } //if (this.state.activebtn == "doctor")
    else {
      try {
        const response = await axios.get(Constants.GET_USERPROFILE);
        this.setState({ isLoading: false });
        //Toast.show(response.data.Msg)
        // let responseData = this.state.userDetails;
        if (response.data.Status) {
          let responseData = [];
          let seetingitms = [];
          let tmp = {};
          // console.log(responseData, '@ getting profile pic  ResponaseData');
          response.data.MyDetails.map((item) => {
            // item.isShow=false;
            responseData.push(item);

            seetingitms.push(tmp);
          });

          this.setState(
            {
              userSettingDetails: seetingitms,
              userDetails: responseData,
              isLoading: false
            },
            () => { }
          );
        } else {
          // console.log(response.data.Msg, "else ");
          // Toast.show(response.data.Msg);
        }
      } catch (error) {
        // Toast.show("Network Error,Please check youre internet connection");
        Toast.show("Something Went Wrong, Please Try Again Later");

        this.setState({ isLoading: false });
        // console.log(error);
      }
      // console.log("../../wesle smfnffm..././././././.", this.state.activebtn);
    }
  }

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
  onComeBackAgain = () => {
    this.setState(
      {
        userDetails: [],
        isLoading: true
      },
      () => {
        this.getProfileDetail();
      }
    );
    var role = AsyncStorage.getItem(Constants.ACCOUNT_ROLE);
    this.props.navigation.navigate("PatientDashboard", {
      refresh: "refresh"
      // role: this.state.activebtn,
    });
    // this.props.navigation.reset({
    //   index: 0,
    //   routes: [
    //     {
    //       name: "PatientDashboard",
    //       params: { refresh: "refresh", role: this.state.activebtn },
    //     },
    //   ],
    // });
  };

  QRCode = () => {
    this.setState({ isshowQRTab: true });
  };
  EditProfile = () => {
    // this.backHandler.remove();
    this.props.navigation.navigate("UserEditProfile", {
      refresh: true,
      role: this.state.activebtn,
      comeback: this.onComeBackAgain
    });
  };

  backbtnPress = () => {
    // var role = AsyncStorage.getItem(Constants.ACCOUNT_ROLE);
    this.props.navigation.goBack();
    // this.props.navigation.navigate("PatientDashboard", {
    //   refresh: "refresh",
    //   role: role,
    // });
  };

  renderSubitms = (title, itmnm) => {
    // return this.state.userDetails.map((item) => {
    return (
      <>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            marginLeft: 15,
            marginRight: 15
          }}
        >
          <View style={styles.container}>
            <View style={styles.photo}>
              {title == "DOB" && (
                <Image
                  source={require("../../icons/dobsett.png")}
                  style={{ height: 30, width: 30 }}
                ></Image>
              )}
              {title == "Degree" && (
                <Image
                  source={require("../../icons/certificatesett.png")}
                  style={{ height: 30, width: 30 }}
                ></Image>
              )}
              {title == "Specialization" && (
                <Image
                  source={require("../../icons/specialization.png")}
                  style={{ height: 30, width: 30 }}
                ></Image>
              )}
              {title == "Clinic" && (
                <Image
                  source={require("../../icons/clinicsett.png")}
                  style={{ height: 30, width: 30 }}
                ></Image>
              )}
              {title == "Employee ID" && (
                <Image
                  source={require("../../icons/empid-card.png")}
                  style={{ height: 30, width: 30 }}
                ></Image>
              )}
              {title == "Organization Name" && (
                <Image
                  source={require("../../icons/orgnization.png")}
                  style={{ height: 30, width: 30 }}
                ></Image>
              )}
              {title == "Branch Name" && (
                <Image
                  source={require("../../icons/branchname.png")}
                  style={{ height: 30, width: 30 }}
                ></Image>
              )}
              {title == "Mobile" && (
                <Image
                  source={require("../../icons/mobile.png")}
                  style={{ height: 30, width: 30 }}
                ></Image>
              )}
              {title == "Gender" && (
                <Image
                  source={require("../../icons/genders.png")}
                  style={{ height: 30, width: 30 }}
                ></Image>
              )}
              {title == "Aadhar number" && (
                <Image
                  source={require("../../icons/adharcard.png")}
                  style={{ height: 30, width: 30 }}
                ></Image>
              )}
              {/* HealthId */}
              {title == "HealthId" && (
                <Image
                  source={require("../../icons/healthidsett.png")}
                  style={{ height: 30, width: 30 }}
                ></Image>
              )}
              {title == "Address" && (
                <Image
                  source={require("../../icons/adress.png")}
                  style={{ height: 30, width: 30 }}
                ></Image>
              )}
              {title == "City" && (
                <Image
                  source={require("../../icons/city.png")}
                  style={{ height: 30, width: 30 }}
                ></Image>
              )}
              {title == "Pincode" && (
                <Image
                  source={require("../../icons/pincodesett.png")}
                  style={{ height: 30, width: 30 }}
                ></Image>
              )}
            </View>
            <View style={styles.container_text}>
              <View style={styles.DRnamesubview}>
                <Text
                  style={[
                    styles.title,
                    {
                      color: "gray"
                    }
                  ]}
                >
                  {title}
                </Text>
              </View>

              {itmnm != undefined ? (
                <Text
                  style={[
                    styles.title,
                    {
                      color: "gray"
                    }
                  ]}
                >
                  {itmnm == "AadharCard"
                    ? this.Decrypt(this.state.userDetails[0][itmnm])
                    : this.state.userDetails[0][itmnm]}
                </Text>
              ) : (
                <Text
                  style={[
                    styles.title,
                    {
                      color: "gray"
                    }
                  ]}
                >
                  {title == "Mobile" || title == "HealthId"
                    ? this.Decrypt(this.state.userDetails[0][title])
                    : this.state.userDetails[0][title]}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View
          style={{
            height: 0.5,
            backgroundColor: "#d8d8d8",
            marginLeft: 15,
            marginRight: 10,
            marginTop: 0,
            padding: 0.5
          }}
        ></View>
      </>
    );
    // });
  };
  render() {
    // console.log(this.state.isshowQRTab, "is show qrtab ");
    const screenWidth = Math.round(Dimensions.get("window").width);

    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="Profile"
          headerId={2}
          onPressback={this.backbtnPress}
          navigation={this.props.navigation}
          Qricon={require("../../icons/scannercodeicon.png")}
          Ricon={require("../../icons/editprofilee.png")}
          onPressRight={() => this.EditProfile()}
          onPressQR={() => this.QRCode()}
        />

        <View style={{ flex: 1, justifyContent: "center" }}>
          {this.state.userDetails.length == 0 ? (
            <NoDataAvailable onPressRefresh={this.onRefresh}></NoDataAvailable>
          ) : this.state.activebtn != "" ? (
            <>
              <View
                style={{
                  flex: 1,
                  // height: verticalScale(250),
                  // alignItems: "center"
                  marginTop: 15,
                  backgroundColor: "white"
                }}
              >
                <View
                  style={{
                    height: 100,
                    justifyContent: "center",
                    flexDirection: "row"
                  }}
                >
                  <ImageLoad
                    source={{
                      uri:
                        Constants.PROFILE_PIC +
                        this.state.userDetails[0]["ProfilePic"]
                    }}
                    style={{
                      height: 80,
                      width: 80,
                      shadowOffset: { width: 3, height: 3 },
                      shadowColor: "gray",
                      shadowOpacity: 0.7,
                      borderRadius: 40
                    }}
                    placeholderSource={require("../../icons/Placeholder.png")}
                    placeholderStyle={{
                      height: 80,
                      width: 80,
                      shadowOffset: { width: 3, height: 3 },
                      shadowColor: "gray",
                      shadowOpacity: 0.7,
                      borderRadius: 40
                    }}
                    borderRadius={40}
                  />
                </View>
                <Text
                  style={{
                    height: 25,
                    textAlign: "center",
                    // marginTop: 5,
                    fontSize: 18,
                    fontWeight: "bold"
                  }}
                >
                  {this.state.userDetails[0]["FullName"]}
                </Text>
                <Text
                  style={{
                    height: 25,
                    textAlign: "center",
                    // marginTop: 6,
                    fontSize: 16,
                    fontWeight: "normal",
                    color: "gray"
                  }}
                >
                  {this.Decrypt(this.state.userDetails[0]["EmailId"])}
                </Text>
                {this.state.isshowQRTab ? (
                  this.state.isshowQRTab && (
                    <ScrollView
                      alwaysBounceVertical={true}
                      showsHorizontalScrollIndicator={false}
                      style={{ backgroundColor: "white", marginTop: 30 }}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <QRC
                          value={JSON.stringify(this.state.userDetails[0])}
                          size={300}
                        />
                      </View>
                    </ScrollView>
                  )
                ) : (
                  <Tabs
                    tabBarUnderlineStyle={{ backgroundColor: "#3062ae" }}
                    tabContainerStyle={{ backgroundColor: "#ffffff" }}
                  >
                    <Tab
                      heading={
                        <TabHeading style={{ backgroundColor: "white" }}>
                          <Text
                            style={[
                              styles.title,
                              {
                                color: "gray",
                                marginLeft: 30
                              }
                            ]}
                          >
                            Medical Profile
                          </Text>
                        </TabHeading>
                      }
                    // textStyle={styles.title}
                    >
                      <ScrollView
                        alwaysBounceVertical={true}
                        showsHorizontalScrollIndicator={false}
                        style={{ backgroundColor: "white", marginTop: 0 }}
                      >
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center"
                          }}
                        >
                          {this.state.menus.map((item, index) => {
                            return (
                              <TouchableOpacity
                                onPress={() => {
                                  if (item.title == "Covid Vaccination") {
                                    this.props.navigation.navigate(
                                      item.gotoScreen,
                                      {
                                        from: item.from
                                      }
                                    );
                                  } else {
                                    this.props.navigation.navigate(
                                      item.gotoScreen,
                                      {
                                        type: item.type,
                                        title: item.title
                                      }
                                    );
                                  }
                                }}
                              >
                                <View
                                  style={{
                                    flex: 1,
                                    // flexDirection: "column"
                                    // justifyContent: "center",
                                    alignItems: "center"
                                  }}
                                  key={index}
                                >
                                  <View style={styles.container}>
                                    <View style={styles.photo}>
                                      <Image
                                        source={item.leftimg}
                                        // source={require("../../icons/vaccinated.png")}
                                        style={{ height: 30, width: 30 }}
                                      ></Image>
                                    </View>
                                    <View style={styles.container_text}>
                                      <View style={styles.DRnamesubview}>
                                        <Text
                                          style={[
                                            styles.title,
                                            {
                                              color: "gray"
                                            }
                                          ]}
                                        // numberOfLines={1}
                                        >
                                          {item.title}
                                        </Text>
                                      </View>
                                    </View>
                                    <View
                                      style={{
                                        alignItems: "flex-end",
                                        flex: 1
                                      }}
                                    >
                                      <View
                                        style={{
                                          flex: 1,
                                          flexDirection: "row",
                                          width: "100%"
                                        }}
                                      >
                                        <TouchableOpacity
                                          style={styles.SuggestTesttouch}
                                          onPress={() => {
                                            if (
                                              item.title == "Covid Vaccination"
                                            ) {
                                              this.props.navigation.navigate(
                                                item.gotoScreen,
                                                {
                                                  from: item.from
                                                }
                                              );
                                            } else {
                                              this.props.navigation.navigate(
                                                item.gotoScreen,
                                                {
                                                  type: item.type,
                                                  title: item.title
                                                }
                                              );
                                            }
                                          }}
                                        >
                                          <Image
                                            source={require("../../icons/arrowblue.png")}
                                            style={{ height: 30, width: 30 }}
                                          ></Image>
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  </View>
                                </View>
                                <View
                                  style={{
                                    height: 0.5,
                                    backgroundColor: "#d8d8d8",
                                    marginLeft: 15,
                                    marginRight: 10,
                                    marginTop: 0,
                                    padding: 0.5
                                  }}
                                ></View>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </ScrollView>
                    </Tab>
                    <Tab
                      heading={
                        <TabHeading style={{ backgroundColor: "white" }}>
                          <Text
                            style={[
                              styles.title,
                              {
                                color: "gray",
                                marginLeft: 35
                              }
                            ]}
                          >
                            Settings
                          </Text>
                        </TabHeading>
                      }
                    >
                      <ScrollView
                        alwaysBounceVertical={true}
                        showsHorizontalScrollIndicator={false}
                        style={{ backgroundColor: "white", marginTop: 0 }}
                      >
                        {this.renderSubitms("DOB")}
                        {this.renderSubitms("Mobile")}
                        {this.renderSubitms("Gender")}

                        {/* {this.renderSubitms("DOB", this.state.userDetails)}
                        {this.renderSubitms("Mobile", this.state.userDetails)} */}
                        {/* <View
                          style={{
                            backgroundColor: "white",
                            flexDirection: "column",
                            marginLeft: 15,
                            marginRight: 15
                          }}
                        >
                          <View style={styles.container}>
                            <View style={styles.photo}>
                              <Image
                                source={this.state.userSettingDetails[0]["img"]}
                                // source={require("../../icons/" + leftimg)}
                                style={{ height: 30, width: 30 }}
                              ></Image>
                            </View>
                            <Text
                              style={{
                                // height: 25,
                                textAlign: "center",
                                height: verticalScale(20),
                                // marginTop: 6,
                                fontSize: 16,
                                fontWeight: "bold"
                              }}
                            >
                              DOB
                            </Text>
                          </View>

                          <Text
                            style={{
                              height: verticalScale(20),
                              // height: 25,
                              textAlign: "left",
                              marginTop: 4,
                              fontSize: 14,
                              fontWeight: "normal",
                              color: "gray"
                            }}
                          >
                            {this.state.userDetails[0]["DOB"]}
                          </Text>
                          <View
                            style={{
                              height: 0.5,
                              backgroundColor: "gray",
                              marginLeft: 0,
                              marginRight: 0,
                              marginTop: 3
                            }}
                          ></View>
                        </View>

                        <View
                          style={{
                            backgroundColor: "white",
                            flexDirection: "column",
                            marginLeft: 15,
                            marginRight: 15
                          }}
                        >
                          <Text
                            style={{
                              height: verticalScale(20),
                              // height: 25,
                              textAlign: "left",
                              marginTop: 6,
                              fontSize: 16,
                              fontWeight: "bold"
                            }}
                          >
                            Mobile
                          </Text>
                          <Text
                            style={{
                              height: verticalScale(20),
                              // height: 25,
                              textAlign: "left",
                              marginTop: 4,
                              fontSize: 14,
                              fontWeight: "normal",
                              color: "gray"
                            }}
                          >
                            {this.Decrypt(this.state.userDetails[0]["Mobile"])}
                          </Text>
                          <View
                            style={{
                              height: 0.5,
                              backgroundColor: "gray",
                              marginLeft: 0,
                              marginRight: 0,
                              marginTop: 3
                            }}
                          ></View>
                        </View>

                        <View
                          style={{
                            backgroundColor: "white",
                            flexDirection: "column",
                            marginLeft: 15,
                            marginRight: 15
                          }}
                        >
                          <Text
                            style={{
                              // height: 25,
                              height: verticalScale(20),
                              textAlign: "left",
                              marginTop: 6,
                              fontSize: 16,
                              fontWeight: "bold"
                            }}
                          >
                            Gender
                          </Text>
                          <Text
                            style={{
                              height: verticalScale(20),
                              // height: 25,
                              textAlign: "left",
                              marginTop: 4,
                              fontSize: 14,
                              fontWeight: "normal",
                              color: "gray",
                              marginLeft: 5
                            }}
                          >
                            {this.state.userDetails[0]["Gender"]}
                          </Text>
                          <View
                            style={{
                              height: 0.5,
                              backgroundColor: "gray",
                              marginLeft: 0,
                              marginRight: 0,
                              marginTop: 3
                            }}
                          ></View>
                        </View> */}
                        {this.state.activebtn == "employee" && (
                          <>
                            {this.renderSubitms("Employee ID", "EmployeeId")}
                            {this.renderSubitms(
                              "Organization Name",
                              "Org_Name"
                            )}
                            {this.renderSubitms("Branch Name", "BranchName")}
                            {/* <View
                              style={{
                                backgroundColor: "white",
                                flexDirection: "column",
                                marginLeft: 15,
                                marginRight: 15
                              }}
                            >
                              <Text
                                style={{
                                  height: verticalScale(20),
                                  // height: 25,
                                  textAlign: "left",
                                  marginTop: 6,
                                  fontSize: 16,
                                  fontWeight: "bold"
                                }}
                              >
                                Employee ID
                              </Text>
                              <Text
                                style={{
                                  height: verticalScale(20),
                                  // height: 25,
                                  textAlign: "left",
                                  marginTop: 4,
                                  fontSize: 14,
                                  fontWeight: "normal",
                                  color: "gray",
                                  marginLeft: 5
                                }}
                              >
                                {this.state.userDetails[0]["EmployeeId"]}
                              </Text>
                              <View
                                style={{
                                  height: 0.5,
                                  backgroundColor: "gray",
                                  marginLeft: 0,
                                  marginRight: 0,
                                  marginTop: 3
                                }}
                              ></View>
                            </View>
                            <View
                              style={{
                                backgroundColor: "white",
                                flexDirection: "column",
                                marginLeft: 15,
                                marginRight: 15
                              }}
                            >
                              <Text
                                style={{
                                  height: verticalScale(20),
                                  // height: 25,
                                  textAlign: "left",
                                  marginTop: 6,
                                  fontSize: 16,
                                  fontWeight: "bold"
                                }}
                              >
                                Organization Name
                              </Text>
                              <Text
                                style={{
                                  height: verticalScale(20),
                                  // height: 25,
                                  textAlign: "left",
                                  marginTop: 4,
                                  fontSize: 14,
                                  fontWeight: "normal",
                                  color: "gray",
                                  marginLeft: 5
                                }}
                              >
                                {this.state.userDetails[0]["Org_Name"]}
                              </Text>
                              <View
                                style={{
                                  height: 0.5,
                                  backgroundColor: "gray",
                                  marginLeft: 0,
                                  marginRight: 0,
                                  marginTop: 3
                                }}
                              ></View>
                            </View>

                            <View
                              style={{
                                backgroundColor: "white",
                                flexDirection: "column",
                                marginLeft: 15,
                                marginRight: 15
                              }}
                            >
                              <Text
                                style={{
                                  marginLeft: 3,
                                  height: verticalScale(20),
                                  // height: 25,
                                  textAlign: "left",
                                  marginTop: 6,
                                  fontSize: 16,
                                  fontWeight: "bold"
                                }}
                              >
                                Branch Name
                              </Text>
                              <Text
                                style={{
                                  marginLeft: 3,
                                  height: verticalScale(20),
                                  // height: 25,
                                  textAlign: "left",
                                  marginTop: 4,
                                  fontSize: 14,
                                  fontWeight: "normal",
                                  color: "gray"
                                }}
                              >
                                {this.state.userDetails[0]["BranchName"]}
                              </Text>
                              <View
                                style={{
                                  height: 0.5,
                                  backgroundColor: "gray",
                                  marginLeft: 0,
                                  marginRight: 0,
                                  marginTop: 3
                                }}
                              ></View>
                            </View> */}
                          </>
                        )}

                        {/* <View
                          style={{
                            backgroundColor: "white",
                            flexDirection: "column",
                            marginLeft: 15,
                            marginRight: 15
                          }}
                        >
                          <Text
                            style={{
                              height: verticalScale(20),
                              // height: 25,
                              textAlign: "left",
                              marginTop: 6,
                              fontSize: 16,
                              fontWeight: "bold"
                            }}
                          >
                            Aadhar number
                          </Text>
                          <Text
                            style={{
                              height: verticalScale(20),
                              // height: 25,
                              textAlign: "left",
                              marginTop: 4,
                              fontSize: 14,
                              fontWeight: "normal",
                              color: "gray",
                              marginLeft: 5
                            }}
                          >
                            {this.Decrypt(
                              this.state.userDetails[0]["AadharCard"]
                            )}
                          </Text>
                          <View
                            style={{
                              height: 0.5,
                              backgroundColor: "gray",
                              marginLeft: 0,
                              marginRight: 0,
                              marginTop: 3
                            }}
                          ></View>
                        </View> */}
                        {this.renderSubitms("Aadhar number", "AadharCard")}
                        {this.state.activebtn == "doctor" && (
                          <>
                            {this.renderSubitms("Degree")}
                            {this.renderSubitms("Specialization")}
                            {this.renderSubitms("Clinic")}
                            {/* <View
                              style={{
                                backgroundColor: "white",
                                flexDirection: "column",
                                marginLeft: 15,
                                marginRight: 15
                              }}
                            >
                              <Text
                                style={{
                                  height: verticalScale(20),
                                  // height: 25,
                                  textAlign: "left",
                                  marginTop: 6,
                                  fontSize: 16,
                                  fontWeight: "bold"
                                }}
                              >
                                Degree
                              </Text>
                              <Text
                                style={{
                                  height: verticalScale(20),
                                  // height: 25,
                                  textAlign: "left",
                                  marginTop: 4,
                                  fontSize: 14,
                                  fontWeight: "normal",
                                  color: "gray",
                                  marginLeft: 5
                                }}
                              >
                                {this.state.userDetails[0]["Degree"]}
                              </Text>
                              <View
                                style={{
                                  height: 0.5,
                                  backgroundColor: "gray",
                                  marginLeft: 0,
                                  marginRight: 0,
                                  marginTop: 3
                                }}
                              ></View>
                            </View>

                            <View
                              style={{
                                backgroundColor: "white",
                                flexDirection: "column",
                                marginLeft: 15,
                                marginRight: 15
                              }}
                            >
                              <Text
                                style={{
                                  height: verticalScale(20),
                                  // height: 25,
                                  textAlign: "left",
                                  marginTop: 6,
                                  fontSize: 16,
                                  fontWeight: "bold"
                                }}
                              >
                                Specialization
                              </Text>
                              <Text
                                style={{
                                  height: verticalScale(20),
                                  // height: 25,
                                  textAlign: "left",
                                  marginTop: 4,
                                  fontSize: 14,
                                  fontWeight: "normal",
                                  color: "gray",
                                  marginLeft: 5
                                }}
                              >
                                {this.state.userDetails[0]["Specialization"]}
                              </Text>
                              <View
                                style={{
                                  height: 0.5,
                                  backgroundColor: "gray",
                                  marginLeft: 0,
                                  marginRight: 0,
                                  marginTop: 3
                                }}
                              ></View>
                            </View>

                            <View
                              style={{
                                backgroundColor: "white",
                                flexDirection: "column",
                                marginLeft: 15,
                                marginRight: 15
                              }}
                            >
                              <Text
                                style={{
                                  marginLeft: 3,
                                  height: verticalScale(20),
                                  // height: 25,
                                  textAlign: "left",
                                  marginTop: 6,
                                  fontSize: 16,
                                  fontWeight: "bold"
                                }}
                              >
                                Clinic
                              </Text>
                              <Text
                                style={{
                                  marginLeft: 3,
                                  height: verticalScale(20),
                                  // height: 25,
                                  textAlign: "left",
                                  marginTop: 4,
                                  fontSize: 14,
                                  fontWeight: "normal",
                                  color: "gray"
                                }}
                              >
                                {this.state.userDetails[0]["Clinic"]}
                              </Text>
                              <View
                                style={{
                                  height: 0.5,
                                  backgroundColor: "gray",
                                  marginLeft: 0,
                                  marginRight: 0,
                                  marginTop: 3
                                }}
                              ></View>
                            </View> */}
                          </>
                        )}
                        {this.state.activebtn == "patient" && (
                          <>{this.renderSubitms("HealthId")}</>
                          // <View
                          //   style={{
                          //     backgroundColor: "white",
                          //     flexDirection: "column",
                          //     marginLeft: 15,
                          //     marginRight: 15
                          //   }}
                          // >
                          //   <Text
                          //     style={{
                          //       height: verticalScale(20),
                          //       // height: 25,
                          //       textAlign: "left",
                          //       marginTop: 6,
                          //       fontSize: 16,
                          //       fontWeight: "bold"
                          //     }}
                          //   >
                          //     HealthId
                          //   </Text>
                          //   <Text
                          //     style={{
                          //       height: verticalScale(20),
                          //       // height: 25,
                          //       textAlign: "left",
                          //       marginTop: 4,
                          //       fontSize: 14,
                          //       fontWeight: "normal",
                          //       color: "gray",
                          //       marginLeft: 5
                          //     }}
                          //   >
                          //     {this.Decrypt(
                          //       this.state.userDetails[0]["HealthId"]
                          //     )}
                          //   </Text>
                          //   <View
                          //     style={{
                          //       height: 0.5,
                          //       backgroundColor: "gray",
                          //       marginLeft: 0,
                          //       marginRight: 0,
                          //       marginTop: 3
                          //     }}
                          //   ></View>
                          // </View>
                        )}
                        {this.renderSubitms("Address")}
                        {this.renderSubitms("City")}
                        {this.renderSubitms("Pincode")}
                        {/* <View
                          style={{
                            backgroundColor: "white",
                            flexDirection: "column",
                            marginLeft: 15,
                            marginRight: 15
                          }}
                        >
                          <Text
                            style={{
                              marginLeft: 3,
                              height: verticalScale(20),
                              // height: 25,
                              textAlign: "left",
                              marginTop: 6,
                              fontSize: 16,
                              fontWeight: "bold"
                            }}
                          >
                            Address
                          </Text>
                          <Text
                            style={{
                              marginLeft: 3,
                              height: verticalScale(20),
                              // height: 25,
                              textAlign: "left",
                              marginTop: 4,
                              fontSize: 14,
                              fontWeight: "normal",
                              color: "gray"
                            }}
                          >
                            {this.state.userDetails[0]["Address"]}
                          </Text>
                          <View
                            style={{
                              height: 0.5,
                              backgroundColor: "gray",
                              marginLeft: 0,
                              marginRight: 0,
                              marginTop: 3
                            }}
                          ></View>
                        </View>

                        <View
                          style={{
                            backgroundColor: "white",
                            flexDirection: "column",
                            marginLeft: 15,
                            marginRight: 15
                          }}
                        >
                          <Text
                            style={{
                              marginLeft: 3,
                              height: verticalScale(20),
                              // height: 25,
                              textAlign: "left",
                              marginTop: 6,
                              fontSize: 16,
                              fontWeight: "bold"
                            }}
                          >
                            City
                          </Text>
                          <Text
                            style={{
                              marginLeft: 3,
                              height: verticalScale(20),
                              // height: 25,
                              textAlign: "left",
                              marginTop: 4,
                              fontSize: 14,
                              fontWeight: "normal",
                              color: "gray"
                            }}
                          >
                            {this.state.userDetails[0]["City"]}
                          </Text>
                          <View
                            style={{
                              height: 0.5,
                              backgroundColor: "gray",
                              marginLeft: 0,
                              marginRight: 0,
                              marginTop: 3
                            }}
                          ></View>
                        </View>

                        <View
                          style={{
                            backgroundColor: "white",
                            flexDirection: "column",
                            marginLeft: 15,
                            marginRight: 15
                          }}
                        >
                          <Text
                            style={{
                              marginLeft: 3,
                              height: verticalScale(20),
                              // height: 25,
                              textAlign: "left",
                              marginTop: 6,
                              fontSize: 16,
                              fontWeight: "bold"
                            }}
                          >
                            Pincode{" "}
                          </Text>
                          <Text
                            style={{
                              height: verticalScale(20),
                              marginLeft: 3,
                              // height: 25,
                              textAlign: "left",
                              marginTop: 4,
                              fontSize: 14,
                              fontWeight: "normal",
                              color: "gray"
                            }}
                          >
                            {this.state.userDetails[0]["Pincode"]}
                          </Text>
                          <View
                            style={{
                              height: 0.5,
                              backgroundColor: "gray",
                              marginLeft: 0,
                              marginRight: 0,
                              marginTop: 3
                            }}
                          ></View>
                        </View> */}
                      </ScrollView>
                    </Tab>

                    <Tab
                      heading={
                        <TabHeading style={{ backgroundColor: "white" }}>
                          <Text
                            style={[
                              styles.title,
                              {
                                color: "gray",
                                marginLeft: 30
                              }
                            ]}
                          >
                            QR Code
                          </Text>
                        </TabHeading>
                      }
                    >
                      <ScrollView
                        alwaysBounceVertical={true}
                        showsHorizontalScrollIndicator={false}
                        style={{
                          backgroundColor: "white",
                          marginTop: 30,
                          margin: 30
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <QRC
                            value={JSON.stringify(this.state.userDetails[0])}
                            size={300}
                          />
                        </View>
                      </ScrollView>
                    </Tab>
                  </Tabs>
                )}
              </View>
            </>
          ) : null}
        </View>

        {this.state.activebtn == "patient" ||
          this.state.activebtn == "employee" ? (
          <CustomFooter
            onPressBookTest={this.onPressBookTest}
            onPressHome={this.onPressHome}
            profile="select"
            home="unselect"
          />
        ) : this.state.activebtn == "doctor" ? (
          <CustomFooter
            footerId={1}
            onPressPatient={this.onPressMyPatient}
            onPressHome={this.onPressHome}
            profile="select"
            home="unselect"
          />
        ) : (
          <CustomFooter
            footerId={2} //for technitian role
            onPressHome={this.onPressHome}
            onPressLogout={this.onPressLogoutYes}
            profile="select"
            home="unselect"
            logout="unselect"
          />
        )}
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 1,
    marginLeft: 5,
    marginRight: 5
  },
  title: {
    flex: 1,
    fontSize: 15,
    color: "#000",
    flexDirection: "row",
    marginLeft: 10,
    // backgroundColor: 'gray',
    marginRight: 10,
    fontWeight: "bold"
  },
  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 10,
    marginLeft: 5,
    justifyContent: "center",
    backgroundColor: "white"
  },

  suggestbtnTitle: {
    // flex:1,
    fontSize: 9,
    marginLeft: 5,
    paddingRight: 0,
    color: "white",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
  },

  photo: {
    height: 50,
    width: 50,
    marginLeft: 5,
    marginTop: 15
  },

  SuggestTesttouch: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginEnd: 5
  },

  DRnamesubview: {
    flex: 1,
    flexDirection: "row",
    marginTop: 8
  }
});
