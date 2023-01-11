import React from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  NativeModules,
  AppState,
  BackHandler,
  Alert,
  Linking,
} from "react-native";
import { Container, Header, Toast } from "native-base";
import CustomFooter from "../appComponents/CustomFooter";
import PatientdashboardComp from "../appComponents/PatientdashboardComp";
import DoctordashboardComp from "../appComponents/DoctordashboardComp";
import AsyncStorage from "@react-native-community/async-storage";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import axios from "axios";
import { fcmService } from "../appComponents/FCMservice";
import PushNotification from "react-native-push-notification";
import { localNotificationService } from "../appComponents/LocalNotificationService";
const screenWidth = Math.round(Dimensions.get("window").width);
const { StatusBarManager } = NativeModules;

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

export default class NotifactionMainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activebtn: "doctor",
      userrole: "",
      isloading: false,
      fcm_token: "",
      isback: false,
      clickcount: 0,
      iscurrent: false,
      totalcliks: 0,
      appState: AppState.currentState,
      isAppComeBackground: false,
    };
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this.setState({ isAppComeBackground: true }, () => {
        // console.log("----Apstate--ifffffff----", this.state.isAppComeBackground)
      });
    } else {
      // this.setState({ isAppComeBackground: false }, () => {
      //     console.log("----Apstate--elssssssss----", this.state.isAppComeBackground)
      // })
    }
    this.setState({ appState: nextAppState });
  };

  retrieveData() {
    var activebtrole;
    AsyncStorage.getItem(Constants.ACCOUNT_ROLE).then((value) => {
      activebtrole = value.toLowerCase();
    });
    // console.log(activebtrole, '**********Patent Dashboardcurrent role');
    AsyncStorage.getItem(Constants.USER_ROLE).then((value) => {
      let valuelowrcase = value.toLowerCase();

      this.setState({
        userrole: valuelowrcase,
        // activebtn: valuelowrcase == 'doctor' ? 'doctor' : 'patient',
        activebtn: activebtrole == "doctor" ? "doctor" : "patient",
        isloading: false,
      });
    });
  }

  OpenDrawer = () => {
    this.removehandleBackButtonClick();
    this.props.navigation.openDrawer();
  };

  registerFCMToken = async (fcmtoken) => {
    let response;
    // console.log(
    //   fcmtoken,
    //   Constants.FIREBASE_REGISTER_TOKEN + fcmtoken,
    //   'fcm tokrn'
    // );
    try {
      response = await axios.post(Constants.FIREBASE_REGISTER_TOKEN + fcmtoken);
      // console.log('fcm token ==============', response.data);
    } catch (errors) {
      console.log(errors, "errors");
    }
  };
  componentDidMount = () => {
    AppState.addEventListener("change", this._handleAppStateChange);
    let notificationObj = null;
    let navigationObj = this.props;
    let appState = this.state.appState;
    let isAppComeBackground = this.state.isAppComeBackground;
    let self = this;
    // console.log('appstate',appState)

    //-------Notification----------------------------------
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    function onRegister(token) {
      self.registerFCMToken(token);
    }

    function onNotification(notify) {
      notificationObj = notify;
      // console.log(appState != 'active','##########onnofa');
      const options = {
        soundName: "default",
        playSound: true,
      };
      if (Platform.OS == "android") {
        if (appState != "active") {
          // console.log(appState,'****** if ======',appState)
          localNotificationService.showNotification(
            0,
            notify.notification.title,
            notify.notification.body,
            notify.notification,
            options
          );
          // appState = "not"
        } else {
          console.log(
            notificationObj,
            "else platfotm android and app state not active",
            notify
          );
        }
      } else {
        // console.log('platform ios and notification',appState)
        localNotificationService.showNotification(
          0,
          notify.notification.title,
          notify.notification.body,
          notify.notification
        );
      }
    }

    function onOpenNotification(notif) {
      //  console.log("isAppComeBackground",notif)
      if (Platform.OS === "ios") {
        if (notificationObj != null) {
          if (notif != undefined) {
            if (notif.data.Type === "Family Member") {
              //  console.log('family meber')
              //   navigationObj.navigation.navigate('FamilyMemberList',{from:'notifcation'});
            } else if (notif.data.Type === "Alert") {
              navigationObj.navigation.navigate("PatientDashboard");
              // Alert.alert('On notification', notif.Name);
            } else if (notif.data.Type === "Booking") {
              // console.log('Chek status')
              navigationObj.navigation.navigate("CheckStatus", {
                bookingid: notif.data.ID,
              });
            } else if (notif.data.Type === "Test") {
              navigationObj.navigation.navigate("BookAppointment", {
                labinfo: notif.data,
                from: "suggested",
              });
            } else if (notif.data.Type === "Local Notifaction") {
              Alert.alert("On notification");
            }
          }
        }
      } else {
        // console.log(
        //   "isAppComeBackground else in Android BLock",
        //   notificationObj
        // );
        if (notif != null) {
          if (isAppComeBackground == true) {
            // console.log("if------");
            // navigationObj.navigation.navigate("BussinessMyOrder", { from: "" })

            if (notif.data.Type === "Family Member") {
              // console.log("family meber true");
              navigationObj.navigation.navigate("FamilyMemberList", {
                from: "notifcation",
              });
            } else if (notif.data.Type === "Alert") {
              // console.log("Aler");
              navigationObj.navigation.navigate("PatientDashboard");
              // Alert.alert('On notification', notif.Name);
            } else if (notif.data.Type === "Booking") {
              // console.log("Chek status");
              navigationObj.navigation.navigate("CheckStatus", {
                bookingid: notif.data.ID,
              });
            } else if (notif.data.Type === "Test") {
              // console.log(notif, "-----Test----- ");

              navigationObj.navigation.navigate("BookAppointment", {
                labinfo: notif.data,
                from: "suggested",
              });
            } else if (notif.data.Type === "Local Notifaction") {
              // console.log("Local medication");
              Alert.alert("On notification");
            }
          }

          isAppComeBackground = false;
          // console.log("else &&&&&&", notif.userInteraction, notif.foreground);
          if (isAppComeBackground == false && notif.userInteraction === true) {
            // console.log("=====isbCKGROUND FALS");
            if (notif.data.Type === "Family Member") {
              // console.log("family meber false");
              setTimeout(() => {
                navigationObj.navigation.navigate("FamilyMemberList", {
                  from: "notifcation",
                });
              }, 1000);
              //  navigationObj.navigation.navigate('FamilyMemberList',{from:'notifcation'});
            } else if (notif.data.Type === "Alert") {
              // console.log("Aler");
              setTimeout(() => {
                navigationObj.navigation.navigate("PatientDashboard");
              }, 1000);
              // Alert.alert('On notification', notif.Name);
            } else if (notif.data.Type === "Booking") {
              // console.log("Chek status");
              setTimeout(() => {
                navigationObj.navigation.navigate("CheckStatus", {
                  bookingid: notif.data.ID,
                });
              }, 1000);
            } else if (notif.data.Type === "Test") {
              // console.log(notif, "-----Test----- ");
              setTimeout(() => {
                navigationObj.navigation.navigate("BookAppointment", {
                  labinfo: notif.data,
                  from: "suggested",
                });
              }, 1000);
            } else if (notif.data.Type === "Local Notifaction") {
              // console.log("Local medication");
              Alert.alert("On notification");
            }
          }
        } else {
          notificationObj = notif;
          if (isAppComeBackground == false) {
            // console.log("=====isbCKGROUND FALS");
            if (notif.data.Type === "Family Member") {
              // console.log("family meber false");
              setTimeout(() => {
                navigationObj.navigation.navigate("FamilyMemberList", {
                  from: "notifcation",
                });
              }, 1000);
              //  navigationObj.navigation.navigate('FamilyMemberList',{from:'notifcation'});
            } else if (notif.data.Type === "Alert") {
              // console.log("Aler");
              setTimeout(() => {
                navigationObj.navigation.navigate("PatientDashboard");
              }, 1000);
              // Alert.alert('On notification', notif.Name);
            } else if (notif.data.Type === "Booking") {
              // console.log("Chek status");
              setTimeout(() => {
                navigationObj.navigation.navigate("CheckStatus", {
                  bookingid: notif.data.ID,
                });
              }, 1000);
            } else if (notif.data.Type === "Test") {
              // console.log(notif, "-----Test----- ");
              setTimeout(() => {
                navigationObj.navigation.navigate("BookAppointment", {
                  labinfo: notif.data,
                  from: "suggested",
                });
              }, 1000);
            } else if (notif.data.Type === "Local Notifaction") {
              // console.log("Local medication");
              Alert.alert("On notification");
            }
          }
        }
      }
    }

    //    this.props.navigation.navigate('Drawer')

    return () => {
      fcmService.unRegister();
      localNotificationService.unregister();
    };
    //-------Notification----------------------------------
  };

  componentWillUnmount() {
    // console.log(
    //   this.props,
    //   'componentWillUnmount****************PATIENTDASHMain'
    // );
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  render() {
    return null;
  }
}
