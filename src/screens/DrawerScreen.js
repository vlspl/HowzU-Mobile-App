import React from "react";
import {
  View,
  Text,
  Image,
  Alert,
  Linking,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  TouchableHighlight,
  Platform,
  UIManager,
  StyleSheet
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/MaterialIcons";

// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Constants from "../utils/Constants";
import AsyncStorage from "@react-native-community/async-storage";
import AddAccount from "../appComponents/AddAccount";
import ImageLoad from "react-native-image-placeholder";
import {
  NavigationActions,
  StackActions,
  CommonActions
} from "@react-navigation/native";
import axios from "axios";
import Toast from "react-native-tiny-toast";
import analytics from "@react-native-firebase/analytics";
const Rijndael = require("rijndael-js");
global.Buffer = global.Buffer || require("buffer").Buffer;
const padder = require("pkcs7-padding");
const Realm = require("realm");
import Accordian from "../appComponents/Accordian";
// let realm = new Realm({ schema: [medicineInfo, doseInfo, doseStatus] });

import {
  MEDICINE_INFO,
  medicineInfo,
  DOSE_INFO,
  doseInfo,
  doseStatus,
  DOSE_STATUS
} from "../utils/AllSchemas";
// const styles = StyleSheet.create({
//   title: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#5E5E5E"
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     height: 56,
//     paddingLeft: 25,
//     paddingRight: 18,
//     alignItems: "center",
//     backgroundColor: "#fff"
//   },
//   parentHr: {
//     height: 1,
//     color: "#ffffff",
//     width: "100%"
//   },
//   child: {
//     backgroundColor: "#C7C7C7",
//     padding: 16
//   }
// });
const styles = StyleSheet.create({
  modalView: {
    flexDirection: "column",
    width: "80%",
    backgroundColor: "white",
    alignSelf: "center",
    justifyContent: "center",
    padding: 15
  },
  buttonStyle: {
    backgroundColor: "#275BB4",
    borderRadius: 12,
    width: 60
  },
  textStyle: {
    textAlign: "center",
    fontSize: 15,
    margin: 10,
  },
});
const CustomeDrawerItem = (props) => (
  <TouchableOpacity
    style={{
      flexDirection: "row",
      alignItems: "center",
      height: 50,
      backgroundColor: "white"
    }}
    onPress={props.onPressItem}
  >
    <View
      style={{
        width: 30,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10
      }}
    >
      {props.itemName == "Organization  Tests" ? (
        <Image
          style={{ height: 25, width: 25, marginTop: 5 }}
          source={props.img}
        />
      ) : (
        <Image style={{ height: 30, width: 30 }} source={props.img} />
      )}
    </View>

    <Text style={{ fontSize: 16, marginLeft: 15, fontWeight: "bold" }}>
      {props.itemName}
    </Text>
  </TouchableOpacity>
);

export default class DrawerScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: "",
      userrole: "",
      mobile: "",
      isloading: false,
      modalVisible: false,
      allActiveuser: [],
      cureentActiveUser: {},
      isDrawerOpen: false,
      userProfileDetails: [],
      orgid: 0,
      expanded: false,
      hydrationdetailsexist: false,
      isModalVisible: false,
      menu: [
        {
          title: "Test Booking",
          // icon: require("../../icons/bookingmenu.png"),
          icon: require("../../icons/online-booking.png"),
          data: [
            {
              data: "Book a Test",
              img: require("../../icons/booktestmenu.png"),
              navtoScreen: "ChooseBookingScreen"
            },
            {
              data: "Appointments",
              // img: require("../../icons/Appointments-b.png"),
              img: require("../../icons/appointmentmenu.png"),
              // img: require("../../icons/apointment2color.png"),

              navtoScreen: "Appointments"
            },
            {
              data: "Reschedule Appointment",
              // img: require("../../icons/Reschedule-Test-b.png"),
              img: require("../../icons/rescheduleappmenu.png"), //apointment reschedule2color
              // img: require("../../icons//apointmentreschedule2color.png"), //apointment reschedule2color

              navtoScreen: "RescheduleAppoint"
            },

            {
              data: "Suggested Tests",
              // img: require("../../icons/Book-Test-2.png"),
              img: require("../../icons/suggestedtestformenu.png"),
              navtoScreen: "SuggestTest"
            },
            {
              data: "Payment History",
              // img: require("../../icons/Payment-History-b.png"),
              img: require("../../icons/Paymenthistory.png"),
              // img: require("../../icons/Paymenthistory2color.png"),

              navtoScreen: "PaymentHistory"
            }
          ]
        },
        {
          title: "Test Reports",
          // icon: require("../../icons/my-report-b.png"),
          icon: require("../../icons/testreport.png"),
          // icon: require("../../icons/testreport2.png"),

          data: [
            {
              data: "My Reports",
              img: require("../../icons/my-report-b.png"),
              // img: require("../../icons/myreport2color.png"),

              navtoScreen: "MyReports"
            },
            {
              data: "Trend analysis",
              img: require("../../icons/dash1new.png"),
              navtoScreen: "CompareReportsList"
            },
            {
              data: "Shared Reports",
              // img: require("../../icons/my-report-b.png"),
              img: require("../../icons/sharereport.png"),
              navtoScreen: "ShareReport"
            }
          ]
        },
        {
          title: "Health Reminders",
          // icon: require("../../icons/healthreminders.jpeg"),
          // icon: require("../../icons/remindernew.png"),
          icon: require("../../icons/remindernew1formenu.png"),

          data: [
            {
              data: "Hydration Reminder",
              // img: require("../../icons/glass-of-water.png"),
              // img: require("../../icons/menuhyd.png"),//
              img: require("../../icons/hydretionremindermenu.png"),
              navtoScreen: "HydGenderScreen"
            },
            {
              data: "Medication Reminder",
              // img: require("../../icons/Medication-b.png"),
              img: require("../../icons/medication.png"),
              // img: require("../../icons/menuhyd.png"),

              navtoScreen: "MedicationCalendrHome"
            }
          ]
        },
        {
          title: "My Health Diary",
          icon: require("../../icons/diary-b.png"),

          data: [
            {
              data: "Add Blood Pressure",
              // img: require("../../icons/heartblue.png"),
              img: require("../../icons/heartmenu.png"),
              navtoScreen: "BloodPressure"
            },
            {
              data: "Add Temperature",
              img: require("../../icons/tempbluenew.png"),
              navtoScreen: "Temprature"
            },
            {
              data: "Add Oxygen",
              img: require("../../icons/oxygennew-blue.png"),
              navtoScreen: "Oxygen"
            },
            {
              data: "BMI Calculator",
              img: require("../../icons/bmi-calculater-b.png"),
              navtoScreen: "BMIGender"
            }
          ]
        }
      ]
    };
    // console.log(props, 'Drawer screen menus for side drawer ');
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expanded: !this.state.expanded });
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

  componentDidMount = () => {
    // console.log(
    //   "Drawer screen  componentDidMount =============================="
    //   // this.props
    // );
    this.retrieveData();
    this.getProfile();
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   " Drawer screen  UNSAFE_componentWillReceiveProps ==============================",
    //   nextProp
    //   //typeof nextProp.route.params
    // );
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.backAction
    // );
    this.setState({ isloading: true }, () => {
      this.retrieveData();
      this.getProfile();

      // this.getActiveUser();
    });

    // this.getProfile();
  };

  async getProfile() {
    // console.log("@@@@@@@@get profile", this.state.userrole);
    if (this.state.userrole == "doctor") {
      try {
        const response = await axios.get(Constants.GET_DOCTOR_PROFILE);
        // console.log(response.data, "././%%%%%%^^&&^&&^getting profile pic");
        this.setState({ isloading: false });
        //Toast.show(response.data.Msg)
        let responseData = [];

        // let responseData = this.state.userDetails;
        // console.log(responseData, '@ getting profile pic  ResponaseData');
        response.data.MyDetails.map((item) => {
          // item.isShow=false;
          responseData.push(item);
        });

        this.setState(
          { userProfileDetails: responseData, isLoading: false },
          () => { }
        );
      } catch (error) {
        // Toast.show("Something Went Wrong, Please Try Again Later");

        this.setState({ isloading: false });
        // console.log(error);
      }
    } else {
      try {
        const response = await axios.get(Constants.GET_USERPROFILE);
        let responseData = [];
        response.data.MyDetails.map((item) => {
          responseData.push(item);
        });

        // console.log(responseData, "ResponseData======");
        this.setState({ userProfileDetails: responseData }, () => { });
        // console.log(response.data, '****Drawer  user profile');
      } catch (err) {
        // Toast.show("Something Went Wrong, Please Try Again Later");

        this.setState({ isloading: false });
        console.log(err);
      }
    }
  }

  retrieveData = async () => {
    try {
      const response = await axios.get(Constants.GET_HYDRATION_DETAILS);
      this.setState({ isloading: false });
      if (response.data.Status) {
        this.setState({ hydrationdetailsexist: true });
        await AsyncStorage.setItem(
          "hydrationdetailsexist",
          JSON.stringify(response.data.Status)
        );
      } else {
        this.setState({ hydrationdetailsexist: false });
        await AsyncStorage.setItem(
          "hydrationdetailsexist",
          JSON.stringify(response.data.Status)
        );
      }
    } catch (error) {
      this.setState({ isloading: false });
    }
    const Hydrationvalue = await AsyncStorage.getItem("Hydration");
    // if (Hydrationvalue != null) {
    //   this.setState({
    //     hydrationdetailsexist: true,
    //   });
    // }
    AsyncStorage.getItem(Constants.ACCOUNT_ROLE).then((value) => {
      let valuelowrcase;
      if (value) {
        valuelowrcase = value.toLowerCase();
        // console.log("Role drwer screen ==================", valuelowrcase);
        this.setState({ userrole: valuelowrcase });
        this.setState({
          isloading: false
        });
      }
    });

    AsyncStorage.getItem(Constants.USER_NAME).then((name) => {
      // console.log('name drawwer  screen ==================', name);
      this.setState({ userInfo: name });
    });
    //active user number
    AsyncStorage.getItem(Constants.USER_MOBILE).then((mobile) => {
      // console.log(
      //   "Acive user number drawwer  screen ==================",
      //   mobile
      // );
      this.setState({ mobile: mobile });
    });
    AsyncStorage.getItem(Constants.ORG_ID).then((id) => {
      this.setState({ orgid: Number(JSON.parse(id)) });
    });
    //cureent active user
    // AsyncStorage.getItem("ActiveUser", (err, res) => {
    //   if (!res);
    //   else {
    //     var user = JSON.parse(res);
    //     // console.log(user, 'Cureent active user');
    //     this.setState({ cureentActiveUser: user });
    //     // console.log(user, 'is the cureent active');
    //     // console.log(
    //     //   'CURRENT ACTIVE USER drawwer  screen ==================',
    //     //   this.state.cureentActiveUser
    //     // );
    //   }
    // });
  };

  onPressDrawerItem = (screen) => {
    // console.log(screen, '******On press drawer item shared reports');
    // this.props.navigation.navigate(screen);
  };

  componentWillUnmount = () => {
    // this.getProfile();
    // this.retrieveData();
  };
  onPressLogoutYes = async () => {
    try {
      response = await axios.post(Constants.FIREBASE_REGISTER_TOKEN + null);

      console.log("fcm token on logo]=t  ==============", response.data);
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

  setModalVisible = (visible) => {
    this.props.navigation.closeDrawer();
    this.setState({ isDrawerOpen: true, modalVisible: visible });
  };

  openLoginScreen = (visible) => {
    // console.log('Open Login Screen ');
    this.setState({ modalVisible: visible });
    // const isDrawerOpen = useIsDrawerOpen();
    if (this.state.isDrawerOpen) {
      this.props.navigation.closeDrawer();
    }
    // this.props.navigation.navigate('LoginScreen');
    this.props.navigation.navigate("LoginScreen", {
      refresh: "refresh"
    });
  };

  //switch Accoount

  switchAccount = async (user) => {
    // console.log(this.props);
    // console.log('Switch to ', user);
    this.saveData(
      !this.state.modalVisible,
      user.Token,
      user.Mobile,
      user.Role,
      user.Name,
      user.Email,
      user.isActive
    );
    // this.props.navigation.navigate('Drawer');
  };

  Decrypt = (encryptStr) => {
    const cipher = new Rijndael("1234567890abcder", "cbc");
    const plaintext = Buffer.from(
      cipher.decrypt(new Buffer(encryptStr, "base64"), 128, "1234567890abcder")
    );
    const decrypted = padder.unpad(plaintext, 32);
    const clearText = decrypted.toString("utf8");
    // console.log(
    //   'Decrypt  ====================================',
    //   clearText,
    //   plaintext
    // );

    return clearText.toString();
  };

  saveData = async (visible, Token, Mobile, Role, Name, Email, status) => {
    this.setState({ modalVisible: visible });
    // console.log(
    //   visible,
    //   Token,
    //   Mobile,
    //   Role,
    //   Name,
    //   Email,
    //   'Saving Data for switch Account'
    // );
    // var user = [];
    // let item = {};
    // item["Name"] = Name;
    // item["Mobile"] = Mobile;
    // item["Token"] = Token;
    // item["Role"] = Role;
    // item["Email"] = Email;

    // this.Decrypt(Email);
    // item["isActive"] = false;
    // user.push(item);

    try {
      await AsyncStorage.setItem(Constants.TOKEN_KEY, Token);
      await AsyncStorage.setItem(Constants.USER_MOBILE, Mobile);
      await AsyncStorage.setItem(Constants.USER_ROLE, Role);
      await AsyncStorage.setItem(Constants.ACCOUNT_ROLE, Role);
      await AsyncStorage.setItem(Constants.USER_NAME, Name);
      // for multi account
      // await AsyncStorage.setItem('ActiveUser', JSON.stringify(item));

      // console.log(this.props.navigation, 'navigating to the darwer screen ');

      this.props.navigation.navigate("PatientDashboard", {
        refresh: "refresh"
      });
    } catch (e) {
      //alert('Failed to save the data to the storage')
    }
  };
  renderAccordians = () => {
    const items = [];
    for (item of this.state.menu) {
      items.push(
        <Accordian
          title={item.title}
          icon={item.icon}
          data={item.data}
          ishyddetailsExisit={this.state.hydrationdetailsexist}
          navigation={this.props.navigation}
        />
      );
    }
    return items;
  };
  onPressprivacyPolicy = () => {
    this.props.navigation.navigate("PrivacyPolicy");
  };
  render() {
    // console.log(this.state.orgid, "User Profile Detail");
    // if (this.state.isloading && this.state.userProfileDetails.length > 0) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* <Loader loading={this.state.isloading} /> */}
        {/* for multip account */}
        {/* {this.state.modalVisible && (
          <AddAccount
            visible={this.state.modalVisible}
            openLoginScreen={() => {
              this.openLoginScreen(!this.state.modalVisible);
            }}
            CurrentActiveUser={this.state.cureentActiveUser}
            activeNumber={this.state.mobile}
            switchAccount={(user) => {
              this.switchAccount(user);
            }}
            navigation={this.props.navigation}
            onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
            }}
          />
        )} */}
        <Modal isVisible={this.state.isModalVisible}>
          <View
            style={styles.modalView}
          >
            <View
            >
              <Text
                style={styles.textStyle}
              >
                Are You Sure You want to delete your account?
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <TouchableOpacity style={styles.buttonStyle} onPress={this.onPressLogoutYes}>
                <Text
                  style={{ ...styles.textStyle, color: "white" }}
                  numberOfLines={1}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonStyle} onPress={() => {
                this.setState({ isModalVisible: false });
              }}>
                <Text
                  style={{ ...styles.textStyle, color: "white" }}
                  numberOfLines={1}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View
          style={{
            backgroundColor: "#275BB4",
            height: Platform.OS == "ios" ? 160 : 140
          }}
        >
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 0,
                // marginTop: 10,
                marginTop: Platform.OS == "ios" ? 40 : 10,
                height: 100,
                justifyContent: "center",
                alignItems: "center"
                // margin: 10,
              }}
            >
              {this.state.userProfileDetails.length > 0 && (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("UserProfile", {
                        refresh: "refresh",
                        role: this.state.userrole
                      })
                    }
                  >
                    <ImageLoad
                      source={{
                        uri:
                          Constants.PROFILE_PIC +
                          this.state.userProfileDetails[0]["ProfilePic"]
                      }}
                      style={{
                        height: 60,
                        width: 60,
                        marginLeft: 10,
                        // marginTop: Platform.OS == "ios" ? 10 : 15,
                        marginTop: 20,
                        shadowOffset: { width: 2, height: 2 },
                        shadowColor: "gray",
                        shadowOpacity: 0.7,
                        borderRadius: 30
                      }}
                      placeholderSource={require("../../icons/Placeholder.png")}
                      placeholderStyle={{
                        height: 60,
                        width: 60,
                        shadowOffset: { width: 2, height: 2 },
                        shadowColor: "gray",
                        shadowOpacity: 0.7,

                        borderRadius: 30
                      }}
                      borderRadius={30}
                    />
                  </TouchableOpacity>
                </>
              )}

              <View
                style={{
                  marginTop: 10,
                  flex: 1
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                    textAlign: "left",
                    marginLeft: 12,
                    marginTop: Platform.OS == "ios" ? 10 : 7,
                    justifyContent: "center",
                    alignSelf: "flex-start"
                  }}
                >
                  {this.state.userInfo}
                </Text>
                {this.state.userProfileDetails.length > 0 && (
                  <Text
                    style={{
                      color: "white",
                      fontSize: 12,
                      textAlign: "left",
                      marginLeft: 12,
                      marginTop: 5,
                      justifyContent: "center",
                      alignSelf: "flex-start"
                    }}
                  >
                    {/* {this.state.cureentActiveUser.Email} */}
                    {this.Decrypt(this.state.userProfileDetails[0]["EmailId"])}
                  </Text>
                )}
              </View>
            </View>
            {/* <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginTop: 0,
                  justifyContent: 'center',
                
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 15,
                    backgroundColor: '#1d303f',
                    width: 120,
                    height: 25,
                    borderWidth: 0.5,
                    marginTop: 0,
                  }}
                  onPress={() => {
                    // this.props.navigation.closeDrawer();
                    this.setModalVisible(true);
                  }}
                >
                  <Icon name="plus" size={15} color="#fff" />
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 12,
                    }}
                  >
                    Add Accoount
                  </Text>
                </TouchableOpacity>
              </View> */}
          </View>
        </View>
        {this.state.userrole == "doctor" ? (
          <DrawerContentScrollView
            {...this.props}
            contentContainerStyle={{ paddingTop: 5 }}
          >
            <CustomeDrawerItem
              itemName="Home"
              img={require("../../icons/menuhome.png")}
              // img={require("../../icons/homemenu.png")}
              // img={require("../../icons/home-1.png")}

              // onPressItem={this.onPressDrawerItem.bind(
              //   this,
              //   "PatientDashboard"
              // )}
              onPressItem={() =>
                this.props.navigation.navigate("PatientDashboard", {
                  refresh: true
                })
              }
            />
            <CustomeDrawerItem
              itemName="My Patients"
              // img={require("../../icons/my-doctors-b.png")}
              img={require("../../icons/patient.png")}
              onPressItem={() =>
                this.props.navigation.navigate("MyPatients", {
                  refresh: true
                })
              }
            />
            <CustomeDrawerItem
              itemName="Shared Reports"
              // img={require("../../icons/my-report-b.png")}
              img={require("../../icons/sharereport.png")}
              onPressItem={() => {
                this.props.navigation.closeDrawer();
                this.props.navigation.navigate("DocDashSharedList", {
                  refresh: true
                });
              }}
            // onPressItem={this.onPressDrawerItem.bind(
            //   this,
            //   'DocDashSharedList'
            // )}
            />
            <CustomeDrawerItem
              itemName="Suggested Tests"
              // img={require("../../icons/Suggested-Test-b.png")}
              img={require("../../icons/suggestedtestformenu.png")}
              onPressItem={() => {
                this.props.navigation.closeDrawer();
                this.props.navigation.navigate("DocDashSuggestedList", {
                  refresh: true
                });
              }}
            />

            <CustomeDrawerItem
              itemName="About Us"
              // img={require("../../icons/about-us-g.png")}
              // img={require("../../icons/aboutusmenu.png")}
              img={require("../../icons/aboutus.png")}
              onPressItem={() => {
                this.props.navigation.closeDrawer();

                this.props.navigation.navigate("About", { refresh: true });
              }}
            />
            <CustomeDrawerItem
              itemName="Privacy Policy"
              img={require("../../icons/privacy_policy_icon.png")}
              onPressItem={this.onPressprivacyPolicy}
            />
            <CustomeDrawerItem
              itemName="LOGOUT"
              // img={require("../../icons/logout-b.png")}
              // img={require("../../icons/logout.png")}
              img={require("../../icons/logoutmenu.png")}
              onPressItem={this.onPressLogoutYes}
            />
            <CustomeDrawerItem
              itemName="Delete Account"
              img={require("../../icons/delete_icon.png")}
              onPressItem={() => {
                this.setState({ isModalVisible: true });
              }}
            />
          </DrawerContentScrollView>
        ) : this.state.userrole == "technician" ? (
          <DrawerContentScrollView
            {...this.props}
            contentContainerStyle={{ paddingTop: 5 }}
          >
            <CustomeDrawerItem
              itemName="Home"
              img={require("../../icons/menuhome.png")}
              onPressItem={() =>
                this.props.navigation.navigate("PatientDashboard", {
                  refresh: true
                })
              }
            />
            <CustomeDrawerItem
              itemName="About Us"
              // img={require("../../icons/about-us-g.png")}
              // img={require("../../icons/aboutusmenu.png")}
              img={require("../../icons/aboutus.png")}
              onPressItem={() => {
                this.props.navigation.closeDrawer();

                this.props.navigation.navigate("About", { refresh: true });
              }}
            />
            <CustomeDrawerItem
              itemName="Privacy Policy"
              img={require("../../icons/privacy_policy_icon.png")}
              onPressItem={this.onPressprivacyPolicy}
            />
            <CustomeDrawerItem
              itemName="LOGOUT"
              // img={require("../../icons/logout-b.png")}
              // img={require("../../icons/logout.png")}
              img={require("../../icons/logoutmenu.png")}
              onPressItem={this.onPressLogoutYes}
            />
            <CustomeDrawerItem
              itemName="Delete Account"
              img={require("../../icons/delete_icon.png")}
              onPressItem={() => {
                this.setState({ isModalVisible: true });
              }}
            />
          </DrawerContentScrollView>
        ) : (
          <DrawerContentScrollView
            {...this.props}
            contentContainerStyle={{
              paddingTop: 5,

              paddingBottom: 5
            }}
          >
            <CustomeDrawerItem
              itemName="Home"
              // img={require("../../icons/home-1.png")}
              // img={require("../../icons/homemenu.png")}

              img={require("../../icons/menuhome.png")}
              onPressItem={() =>
                this.props.navigation.navigate("PatientDashboard", {
                  refresh: true
                })
              }
            />

            {/* <CustomeDrawerItem
              itemName="Book Test"
              img={require("../../icons/Book-Test-b.png")}
              // img={require("../../icons/Book-Test-g.png")}
              onPressItem={() =>
                this.props.navigation.navigate("ChooseBookingScreen", {
                  refresh: true
                })
              }
            /> */}
            <View style={{}}>{this.renderAccordians()}</View>

            {/* <CustomeDrawerItem
              itemName="My Reports"
              img={require("../../icons/my-report-b.png")}
              onPressItem={() =>
                this.props.navigation.navigate("MyReports", { refresh: true })
              }
            /> */}
            {/* <CustomeDrawerItem
              itemName="Trend analysis"
              // itemName="Comapre Reports"
              img={require("../../icons/dash1new.png")}
              onPressItem={() =>
                this.props.navigation.navigate("CompareReportsList", {
                  refresh: true
                })
              }
            /> */}
            {/* <CustomeDrawerItem
              itemName="Appointments"
              img={require("../../icons/Appointments-b.png")}
              onPressItem={() =>
                this.props.navigation.navigate("Appointments", {
                  refresh: true
                })
              }
            /> */}
            {/* <CustomeDrawerItem
              itemName="Reschedule Appointment"
              img={require("../../icons/Reschedule-Test-b.png")}
              onPressItem={() =>
                this.props.navigation.navigate("RescheduleAppoint", {
                  refresh: true
                })
              }
            /> */}
            <CustomeDrawerItem
              itemName="My Doctors"
              // img={require("../../icons/my-doctors-b.png")}
              img={require("../../icons/doctormenu.png")}
              onPressItem={() =>
                this.props.navigation.navigate("MyDoctors", { refresh: true })
              }
            />
            {/* <CustomeDrawerItem
              itemName="Shared Reports"
              img={require("../../icons/my-report-b.png")}
              // img={require("../../icons/my-report-g.png")}
              onPressItem={() =>
                this.props.navigation.navigate("ShareReport", {
                  refresh: true
                })
              }
            /> */}

            {/* <CustomeDrawerItem
              itemName="Suggested Tests"
              img={require("../../icons/Suggested-Test-b.png")}
              onPressItem={() =>
                this.props.navigation.navigate("SuggestTest", {
                  refresh: true
                })
              }
            /> */}
            {this.state.userrole == "employee" && (
              <CustomeDrawerItem
                itemName="Organization  Tests"
                // img={require("../../icons/Suggested-Test-g.png")}
                img={require("../../icons/org.png")}
                onPressItem={() =>
                  this.props.navigation.navigate("OrganizationTest", {
                    refresh: true,
                    orgid: this.state.orgid
                  })
                }
              />
            )}

            <CustomeDrawerItem
              itemName="Family Members"
              // img={require("../../icons/Family-Member-b.png")}
              img={require("../../icons/familymembermenu.png")}
              onPressItem={() =>
                this.props.navigation.navigate("FamilyMemberList", {
                  refresh: true
                })
              }
            />

            {/* <CustomeDrawerItem
              itemName="Hydration Reminder"
              img={require("../../icons/glass-of-water.png")}
              onPressItem={() => {
                if (this.state.hydrationdetailsexist) {
                  this.props.navigation.closeDrawer();
                  this.props.navigation.navigate("HydrationScreen", {
                    refresh: true
                  });
                } else {
                  this.props.navigation.closeDrawer();
                  this.props.navigation.navigate("HydGenderScreen", {
                    refresh: true
                  });
                }
              }}
            />
            <CustomeDrawerItem
              itemName="Medication"
              img={require("../../icons/Medication-b.png")}
              onPressItem={() =>
                this.props.navigation.navigate("MedicationCalendrHome", {
                  refresh: true
                })
              }
            /> */}

            {/* <CustomeDrawerItem
              itemName="Payment History"
              img={require("../../icons/Payment-History-b.png")}
              // img={require("../../icons/Payment-History-g.png")}
              onPressItem={() =>
                this.props.navigation.navigate("PaymentHistory", {
                  refresh: true
                })
              }
            /> */}
            {/* <CustomeDrawerItem
              itemName="My Health Diary"
              img={require("../../icons/diary-b.png")}
              onPressItem={() =>
                this.props.navigation.navigate("HealthDiary", { refresh: true })
              }
            /> */}
            {/* <CustomeDrawerItem
              itemName="BMI Calculator"
              img={require("../../icons/bmi-calculater.png")}
              onPressItem={() =>
                this.props.navigation.navigate("BMIGender", { refresh: true })
              }
            />
            <CustomeDrawerItem
              itemName="Blood Pressure"
              img={require("../../icons/heartgray1.png")}
              onPressItem={() =>
                this.props.navigation.navigate("BloodPressure", {
                  refresh: true,
                })
              }
            />
            <CustomeDrawerItem
              itemName="Oxygen"
              img={require("../../icons/oxygennew.png")}
              onPressItem={() =>
                this.props.navigation.navigate("Oxygen", {
                  refresh: true,
                })
              }
            />
            <CustomeDrawerItem
              itemName="Body Temperature"
              img={require("../../icons/TEMP.png")}
              onPressItem={() =>
                this.props.navigation.navigate("Temprature", {
                  refresh: true,
                })
              }
            /> */}
            <CustomeDrawerItem
              itemName="About Us"
              // img={require("../../icons/about-us-g.png")}
              // img={require("../../icons/aboutusmenu.png")}
              img={require("../../icons/aboutus.png")}
              onPressItem={() => {
                this.props.navigation.closeDrawer();

                this.props.navigation.navigate("About", { refresh: true });
              }}
            />
            <CustomeDrawerItem
              itemName="Privacy Policy"
              img={require("../../icons/privacy_policy_icon.png")}
              onPressItem={this.onPressprivacyPolicy}
            />
            <CustomeDrawerItem
              itemName="Log Out"
              // img={require("../../icons/logout-b.png")}
              // img={require("../../icons/logout.png")}
              img={require("../../icons/logoutmenu.png")}
              onPressItem={this.onPressLogoutYes}
            />
            <CustomeDrawerItem
              itemName="Delete Account"
              img={require("../../icons/delete_icon.png")}
              onPressItem={() => {
                this.setState({ isModalVisible: true });
              }}
            />
          </DrawerContentScrollView>
        )}
      </View>
    );
  }
}
