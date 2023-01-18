import React from "react";
// import notifee, {
//   RepeatFrequency,
//   TimestampTrigger,
//   TriggerType,
//   EventType
// } from "@notifee/react-native";

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
  BackHandler
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
// import { notifyLocalNotificationsService } from "../appComponents/notifiylocal";
const screenWidth = Math.round(Dimensions.get("window").width);
const { StatusBarManager } = NativeModules;
import analytics from "@react-native-firebase/analytics";
import dynamicLinks from "@react-native-firebase/dynamic-links";

import TechDashboard from "../appComponents/TechDashboard";

function StatusBarPlaceHolder() {
  return (
    <View
      style={{
        width: "100%",
        height: Platform.OS === "ios" ? StatusBarManager.HEIGHT : 0,
        backgroundColor: "#275BB4"
      }}
    >
      <StatusBar barStyle="light-content" />
    </View>
  );
}

class PatientDashboard extends React.Component {
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
      didcount: 0,
      notificationData: null,
      bgnotifee: null
    };
  }

  retrieveData() {
    var activebtrole;
    AsyncStorage.getItem(Constants.ACCOUNT_ROLE).then((value) => {
      activebtrole = value.toLowerCase();
    });
    AsyncStorage.getItem(Constants.USER_ROLE).then((value) => {
      let valuelowrcase = value.toLowerCase();
      console.log(activebtrole, "**********Patent Dashboardcurrent role");

      this.setState({
        userrole: valuelowrcase,
        // activebtn: valuelowrcase == 'doctor' ? 'doctor' : 'patient',
        // activebtn: activebtrole == "doctor" ? "doctor" : "patient",
        activebtn:
          activebtrole == "employee"
            ? "employee"
            : activebtrole == "doctor"
              ? "doctor"
              : activebtrole == "technician"
                ? "technician"
                : "patient",
        isloading: false
      });
    });
  }

  OpenDrawer = () => {
    this.removehandleBackButtonClick();
    this.props.navigation.openDrawer();
  };

  //  for book appoint navigation

  handleSelectionMultiple = (index) => {
    //.log("TestID==============================");
    var dict = {}; // create an empty array

    dict = this.state.recomendedtestlist[index];
    let testprices = dict["TestPrice"];
    var sum = 0;
    var pricearr = testprices.split(",");
    pricearr.forEach(function (obj) {
      sum += Number(obj);
    });

    //.log("Total Price ==============================", dict);

    ///dict.set("Total", sum);
    dict["Total"] = sum;
    //.log("Total Price ==============================", dict);

    //console.log('index====================================',index,dict)
    // this.props.remove();
    this.props.navigation.navigate("BookAppointment", {
      labinfo: dict,
      from: "suggested"
    });
  };
  registerFCMToken = async (fcmtoken) => {
    let response;
    // console.log(
    //   fcmtoken,

    //   "fcm tokrn"
    // );
    try {
      response = await axios.post(Constants.FIREBASE_REGISTER_TOKEN + fcmtoken);
      //.log("fcm token ==============", response.data);
    } catch (errors) {
      Toast.show("Something Went Wrong, Please Try Again Later");

      //.log(errors, "errors");
    }
  };

  buildLink = async () => {
    const SENDER_UID = "USER1234";
    const link = await dynamicLinks().buildLink({
      link: `https://vlshowzuapp.com?invitedby=${SENDER_UID}`,
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: "https://vlshowzuapp.page.link"
      // optional setup which updates Firebase analytics campaign
      // "banner". This also needs setting up before hand
    });
    console.log(link, ":::::///");
    return link;
  };
  appOpen = async () => {
    await analytics().logAppOpen();
  };
  componentDidMount = () => {
    //  let buildlinkcall = this.buildLink();
    // console.log("#$#$", buildlinkcall);

    // dynamicLinks()
    //   .getInitialLink()
    //   .then((link) => {
    //     console.log(link, "::::>>>LLLLLL");
    //     if (link.url == "https://howzuapp.page.link") {
    //     }
    //   });
    // console.log(dynamicLinks);
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    let notificationObj = null;
    let NaviagtionObj = this.props;
    let self = this;
    this.setState({
      isloading: true,
      clickcount: 0,
      iscurrent: true,
      totalcliks: 0
    });
    this.retrieveData();
    this.appOpen();
    localNotificationService.createDefaultChannels();
    // notifyLocalNotificationsService.registernotifee(
    //   onOpenLocalNotification,
    //   onOpenKilledStateNotification
    // );
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(
      onOpenNotification,
      setPermissions,
      cancelPressedNotification
    );
    function setPermissions() { }
    function onRegister(token) {
      self.registerFCMToken(token);
    }

    function cancelPressedNotification() { }
    // function onOpenKilledStateNotification(notification) {
    //   console.log(
    //     "------killed",
    //     notification,
    //     "on open killed state sdkjdkdskfj",
    //     EventType.ACTION_PRESS,
    //     "notification",
    //     notification
    //   );
    //   if (EventType.ACTION_PRESS == 2) {
    //     NaviagtionObj.navigation.navigate("MedicationCalendrHome", {
    //       from: "notifcation",
    //       data: notification,
    //       type: "",
    //     });
    //     notifee.cancelNotification(detail.notification.id);
    //   } else if (
    //     type === EventType.ACTION_PRESS &&
    //     detail.pressAction.id === "take"
    //   ) {
    //     console.log('User pressed the "Mark as read" action.');
    //     NaviagtionObj.navigation.navigate("MedicationCalendrHome", {
    //       from: "notifcation",
    //     });
    //   } else if (
    //     type === EventType.ACTION_PRESS &&
    //     detail.pressAction.id === "snooze"
    //   ) {
    //     NaviagtionObj.navigation.navigate("MedicationCalendrHome", {
    //       from: "notifcation",
    //     });
    //     console.log('User pressed the "Mark as read" action.');
    //   } else if (
    //     type === EventType.ACTION_PRESS &&
    //     detail.pressAction.id === "skip"
    //   ) {
    //     NaviagtionObj.navigation.navigate("MedicationCalendrHome", {
    //       from: "notifcation",
    //     });
    //     console.log('User pressed the "Mark as read" action.');
    //   }
    // }
    // function onOpenLocalNotification(type, detail) {
    //   console.log("onOpenLocalNotification////??");
    //   const { notification, pressAction } = detail;

    //   if (EventType.ACTION_PRESS == 2) {
    //     console.log('User pressed the "action in patient dashboard " action.');
    //     NaviagtionObj.navigation.navigate("MedicationCalendrHome", {
    //       from: "notifcation",
    //       data: detail,
    //       type: type,
    //     });
    //   } else if (
    //     type === EventType.ACTION_PRESS &&
    //     detail.pressAction.id === "take"
    //   ) {
    //     console.log('User pressed the "Mark as read" action.');
    //     NaviagtionObj.navigation.navigate("MedicationCalendrHome", {
    //       from: "notifcation",
    //       data: detail,
    //       type: type,
    //     });
    //   } else if (
    //     type === EventType.ACTION_PRESS &&
    //     detail.pressAction.id === "snooze"
    //   ) {
    //     NaviagtionObj.navigation.navigate("MedicationCalendrHome", {
    //       from: "notifcation",
    //     });
    //     console.log('User pressed the "Mark as read" action.');
    //   } else if (
    //     type === EventType.ACTION_PRESS &&
    //     detail.pressAction.id === "skip"
    //   ) {
    //     NaviagtionObj.navigation.navigate("MedicationCalendrHome", {
    //       from: "notifcation",
    //     });
    //     console.log('User pressed the "Mark as read" action.');
    //   }
    //   // if (pressAction.id == "take" && pressAction != "undefined") {
    //   //   notifee.cancelNotification(notification.id);
    //   // }
    //   // switch (type) {
    //   //   case EventType.DISMISSED:
    //   //     console.log("User dismissed notification", detail.notification);
    //   //     break;
    //   //   case EventType.ACTION_PRESS && pressAction.id == "snooze":
    //   //     console.log("User pressed notification", detail.notification);
    //   //     NaviagtionObj.navigation.navigate("MedicationCalendrHome", {
    //   //       from: "notifcation",
    //   //     });
    //   //     break;
    //   // }
    // }

    // notifee.onBackgroundEvent(async ({ type, detail }) => {
    //   const { notification, pressAction } = detail;
    //   console.log(
    //     "**********onBackgroundEvent",
    //     "type",
    //     type,
    //     "notifcation",
    //     "detail",
    //     detail,
    //     "pressAction.id",
    //     pressAction.id,

    //     "EventType.ACTION_PRESS",
    //     EventType.ACTION_PRESS
    //   );

    //   // Check if the user pressed the "Mark as read" action
    //   // if (
    //   //   type === EventType.ACTION_PRESS &&
    //   //   pressAction.id === "localandroidnotifcation"
    //   // ) {
    //   //   console.log(
    //   //     "preseed the notifcation Patient Dashboard  js ",
    //   //     type,
    //   //     "detail",
    //   //     detail
    //   //   );
    //   //   NaviagtionObj.navigation.navigate("MedicationCalendrHome", {
    //   //     from: "notifcation",
    //   //   });

    //   //   await notifee.cancelNotification(notification.id);
    //   // }

    //   // Remove the notification
    // });
    function onNotification(notify, callOpen) {
      console.log(notify.Type, "callopent //...");
      notificationObj = notify;
      if (Platform.OS === "android" && callOpen === true) {
        if (notify.data.Type === "Family Member") {
          NaviagtionObj.navigation.navigate("FamilyMemberList", {
            from: "notifcation"
          });
        } else if (notify.data.Type === "Local Notification") {
          //  Local Notification
          console.log("Local Notification");

          NaviagtionObj.navigation.navigate("MedicationCalendrHome", {
            from: "notifcation",
            data: notify.data
          });
        } else if (notify.data.Type === "new patient report") {
          NaviagtionObj.navigation.navigate("AllPatientList");
        } else if (notify.data.Type === "Shared Report") {
          NaviagtionObj.navigation.navigate("SharedReportstatus", {
            status: "Pending"
          });
        } else if (notify.data.Type === "Alert") {
          NaviagtionObj.navigation.navigate("PatientDashboard");
        } else if (notify.data.Type === "Booking") {
          NaviagtionObj.navigation.navigate("CheckStatus", {
            bookingid: notify.data.ID
          });
        } else if (notify.data.Type === "Test") {
          // var dict = {};
          // dict = notify.data;
          // //.log(dict, "@#@##@##Killed ");
          // let testprices = dict["TestPrice"];
          // var sum = 0;
          // var pricearr = testprices.split(",");
          // pricearr.forEach(function (obj) {
          //   sum += Number(obj);
          // });
          // dict["Total"] = sum;
          // NaviagtionObj.navigation.navigate("BookAppointment", {
          //   labinfo: dict,
          //   from: "suggested",
          // });
          NaviagtionObj.navigation.navigate("PatientDashboard");
        } else if (notify.data.Type === "HealthDay") {
          NaviagtionObj.navigation.navigate("HealthDayNoti", {
            Link: notify.data.Link,
            pagetitle: notify.data.Title
          });
        }
      } else {
        if (Platform.OS == "android") {
          //.log("////....//...show noti");
          localNotificationService.showNotification(
            0,
            notify.notification.title,
            notify.notification.body,
            notify.notification
            // options
          );
        } else {
          localNotificationService.showNotification(
            0,
            notify.notification.title,
            notify.notification.body,
            notify.notification
          );
        }
      }
      // //.log("===s=s==s=s=s=s==s=s",notify)
      // console.log("===s=s==s=s..........=s=s==s=s",callOpen)
      const options = {
        soundName: "default",
        playSound: true
      };
    }

    function onOpenNotification(notify) {
      if (Platform.OS === "ios") {
        if (notificationObj != null) {
          console.log(notificationObj, "os ios //");
          if (notificationObj.data.Type === "Family Member") {
            NaviagtionObj.navigation.navigate("FamilyMemberList", {
              from: "notifcation"
            });
          } //new changes not yet tested
          else if (notificationObj.data.Type === "Local Notification") {
            console.log(
              "Foreground *******Local Notification notificationObj not null",
              notificationObj.data
            );
            let data = {};
            data.data = notificationObj.data;
            NaviagtionObj.navigation.navigate("MedicationCalendrHome", {
              from: "notifcation",
              data: data
            });
          } else if (notificationObj.data.Type === "Hydration") {
            NaviagtionObj.navigation.navigate("HydrationScreen", {
              refresh: true
            });
          } else if (notificationObj.data.Type === "new patient report") {
            NaviagtionObj.navigation.navigate("AllPatientList");
          } else if (notificationObj.data.Type === "Shared Report") {
            NaviagtionObj.navigation.navigate("SharedReportstatus", {
              status: "Pending"
            });
            // NaviagtionObj.navigation.navigate("PatientDashboard");
          } else if (notificationObj.data.Type === "Alert") {
            NaviagtionObj.navigation.navigate("PatientDashboard");
          } else if (notificationObj.data.Type === "Booking") {
            NaviagtionObj.navigation.navigate("CheckStatus", {
              bookingid: notificationObj.data.ID
            });
          } else if (notificationObj.data.Type === "Test") {
            NaviagtionObj.navigation.navigate("PatientDashboard");

            //foreground
            // var dict = {};
            // dict = notificationObj.data;
            // let testprices = dict["TestPrice"];
            // var sum = 0;
            // var pricearr = testprices.split(",");
            // pricearr.forEach(function (obj) {
            //   sum += Number(obj);
            // });
            // dict["Total"] = sum;
            // NaviagtionObj.navigation.navigate("BookAppointment", {
            //   // labinfo: notificationObj.data,
            //   labinfo: dict,
            //   from: "suggested",
            // });
          } else if (notificationObj.data.Type === "HealthDay") {
            NaviagtionObj.navigation.navigate("HealthDayNoti", {
              Link: notificationObj.data.Link,
              pagetitle: notificationObj.data.Title
            });
          }
        } else {
          // when app is opend from killed state
          console.log("//////////88787878787878888", notify.notification);
          if (notify.data) {
            if (notify.data.Type === "Family Member") {
              NaviagtionObj.navigation.navigate("FamilyMemberList", {
                from: "notifcation"
              });
            } else if (notify.data.Type === "Local Notification") {
              console.log(
                "KKKKKKKKKKKKK Local Notification killed state",
                notify.data
              );
              let data = {};
              data.data = notify.data;
              NaviagtionObj.navigation.navigate("MedicationCalendrHome", {
                from: "notifcation",
                data: data
              });
            } else if (notify.data.Type === "Shared Report") {
              NaviagtionObj.navigation.navigate("SharedReportstatus", {
                status: "Pending"
              });
              // NaviagtionObj.navigation.navigate("PatientDashboard");
            } else if (notify.data.Type === "Hydration") {
              NaviagtionObj.navigation.navigate("HydrationScreen", {
                refresh: true
              });
              // NaviagtionObj.navigation.navigate("PatientDashboard");
            }
            //new changes not yet tested
            else if (notify.data.Type === "new patient report") {
              NaviagtionObj.navigation.navigate("AllPatientList");
            } else if (notify.data.Type === "Alert") {
              NaviagtionObj.navigation.navigate("PatientDashboard");
            } else if (notify.data.Type === "Booking") {
              NaviagtionObj.navigation.navigate("CheckStatus", {
                bookingid: notify.data.ID
              });
            } else if (notify.data.Type === "Test") {
              //background ios
              // var dict = {};
              // dict = notify.data;
              // // console.log(dict,'!!!!!!!!!notification');
              // let testprices = dict["TestPrice"];
              // var sum = 0;
              // var pricearr = testprices.split(",");
              // pricearr.forEach(function (obj) {
              //   sum += Number(obj);
              // });
              // dict["Total"] = sum;
              // NaviagtionObj.navigation.navigate("BookAppointment", {
              //   labinfo: notify.data,
              //   from: "suggested",
              // });
              NaviagtionObj.navigation.navigate("PatientDashboard");
            } else if (notify.data.Type === "HealthDay") {
              NaviagtionObj.navigation.navigate("HealthDayNoti", {
                Link: notify.data.Link,
                pagetitle: notify.data.Title
              });
            }
          } else {
            console.log(notify, "no data present ");
            if (notify.Type === "Family Member") {
              NaviagtionObj.navigation.navigate("FamilyMemberList", {
                from: "notifcation"
              });
            }
            //new changes not yet tested
            else if (notify.Type == "Local Notification") {
              let data = {};
              data.data = notify;
              data.ID = notify.ID;
              console.log("&&*&*&*&*&*&Local Notification", notify);
              NaviagtionObj.navigation.navigate("MedicationCalendrHome", {
                from: "notifcation",
                data: data
              });
            } else if (notify.Type === "new patient report") {
              NaviagtionObj.navigation.navigate("AllPatientList");
            } else if (notify.Type === "Hydration") {
              NaviagtionObj.navigation.navigate("HydrationScreen", {
                refresh: true
              });
            } else if (notify.Type === "Alert") {
              NaviagtionObj.navigation.navigate("PatientDashboard");
            } else if (notify.Type === "Shared Report") {
              NaviagtionObj.navigation.navigate("SharedReportstatus", {
                status: "Pending"
              });
              // NaviagtionObj.navigation.navigate("PatientDashboard");
            } else if (notify.Type === "Booking") {
              NaviagtionObj.navigation.navigate("CheckStatus", {
                bookingid: notify.ID
              });
            } else if (notify.Type === "Test") {
              NaviagtionObj.navigation.navigate("PatientDashboard");

              // console.log(' 88787878787878888/////////backgroudn-------',notify)
              // var dict = {
              //   DoctorId: notify.DoctorId,
              //   LabAddress: notify.LabAddress,
              //   LabContact: notify.LabContact,
              //   LabId: notify.LabId,
              //   LabLogo: notify.LabLogo,
              //   LabName: notify.LabName,
              //   RecomendationId: notify.RecomendationId,
              //   TestCount: notify.TestCount,
              //   testId: notify.testId,
              //   TestName: notify.TestName,
              //   TestPrice: notify.TestPrice,
              //   TotalAmount: notify.TotalAmount,
              // };
              // dict =notify.data
              // console.log(dict,'!!!!!!!!!notification');
              // let testprices = dict["TestPrice"];
              // var sum = 0;
              // var pricearr = testprices.split(",");
              // pricearr.forEach(function (obj) {
              //   sum += Number(obj);
              // });
              // dict["Total"] = sum;
              // NaviagtionObj.navigation.navigate("BookAppointment", {
              //   labinfo: dict,
              //   from: "suggested",
              // });
              //  console.log("*****Y**YGUGGUCVHBKNLFGHJJHCVBHJNM")
            } else if (notify.Type === "HealthDay") {
              NaviagtionObj.navigation.navigate("HealthDayNoti", {
                Link: notify.Link,
                pagetitle: notify.Title
              });
            }
          }
        }
        notificationObj = null;
      } else {
        console.log("android =======", notify);
        if (notify.userInteraction == true) {
          console.log("******** =======", notify);
          if (notificationObj != null) {
            console.log("******** =======", notificationObj, "notificationObj");
            if (notificationObj.data.Type === "Family Member") {
              NaviagtionObj.navigation.navigate("FamilyMemberList", {
                from: "notifcation"
              });
            } else if (notificationObj.data.Type === "Local Notification") {
              // let data = {};
              // data.ID = notificationObj.data.ID;
              // data.Type = notificationObj.data.Type;
              let data = {};
              data.data = notificationObj.data;

              NaviagtionObj.navigation.navigate("MedicationCalendrHome", {
                from: "notifcation",
                data: data
              });
            } else if (notificationObj.data.Type === "Hydration") {
              NaviagtionObj.navigation.navigate("HydrationScreen", {
                refresh: true
              });
            }
            //new changes not yet tested
            else if (notificationObj.data.Type === "new patient report") {
              NaviagtionObj.navigation.navigate("AllPatientList");
            } else if (notificationObj.data.Type === "Shared Report") {
              NaviagtionObj.navigation.navigate("SharedReportstatus", {
                status: "Pending"
              });
              // NaviagtionObj.navigation.navigate("PatientDashboard");
            } else if (notificationObj.data.Type === "Alert") {
              NaviagtionObj.navigation.navigate("PatientDashboard");
            } else if (notificationObj.data.Type === "Booking") {
              NaviagtionObj.navigation.navigate("CheckStatus", {
                bookingid: notificationObj.data.ID
              });
            } else if (notificationObj.data.Type === "Test") {
              NaviagtionObj.navigation.navigate("PatientDashboard");

              // var dict = {};

              // dict = notificationObj.data;

              // let testprices = dict["TestPrice"];
              // var sum = 0;
              // var pricearr = testprices.split(",");
              // pricearr.forEach(function (obj) {
              //   sum += Number(obj);
              // });

              // dict["Total"] = sum;
              // NaviagtionObj.navigation.navigate("BookAppointment", {
              //   labinfo: dict,
              //   from: "suggested",
              // });
            } else if (notificationObj.data.Type === "HealthDay") {
              NaviagtionObj.navigation.navigate("HealthDayNoti", {
                Link: notificationObj.data.Link,
                pagetitle: notificationObj.data.Title
              });
            }
          } else {
            console.log("******** else part =======", notify);
            if (notify.data.Type === "Family Member") {
              NaviagtionObj.navigation.navigate("FamilyMemberList", {
                from: "notifcation"
              });
            } else if (notify.data.Type === "Local Notification") {
              console.log("Local Notification", notify.data);
              let data = {};
              // data = notify.data;
              data.data = notify.data;
              NaviagtionObj.navigation.navigate("MedicationCalendrHome", {
                from: "notifcation",
                data: data
              });
            } else if (notify.data.Type === "Hydration") {
              NaviagtionObj.navigation.navigate("HydrationScreen", {
                refresh: true
              });
            }
            //new changes not yet tested
            else if (notify.data.Type === "new patient report") {
              NaviagtionObj.navigation.navigate("AllPatientList");
            } else if (notify.data.Type === "Shared Report") {
              NaviagtionObj.navigation.navigate("SharedReportstatus", {
                status: "Pending"
              });
              // NaviagtionObj.navigation.navigate("PatientDashboard");
            } else if (notify.data.Type === "Alert") {
              NaviagtionObj.navigation.navigate("PatientDashboard");
            } else if (notify.data.Type === "Booking") {
              NaviagtionObj.navigation.navigate("CheckStatus", {
                bookingid: notify.data.ID
              });
            } else if (notify.data.Type === "Test") {
              // var dict = {};
              // dict = notify.data;
              // // console.log(dict,'//////Android!!!!!!!!!notification');
              // let testprices = dict["TestPrice"];
              // var sum = 0;
              // var pricearr = testprices.split(",");
              // pricearr.forEach(function (obj) {
              //   sum += Number(obj);
              // });
              // dict["Total"] = sum;
              // NaviagtionObj.navigation.navigate("BookAppointment", {
              //   labinfo: dict,
              //   from: "suggested",
              // });
              NaviagtionObj.navigation.navigate("PatientDashboard");
            } else if (notify.data.Type === "HealthDay") {
              NaviagtionObj.navigation.navigate("HealthDayNoti", {
                Link: notify.data.Link,
                pagetitle: notify.data.Title
              });
            }
          }
          notificationObj = null;
        }
      }
    }

    return () => {
      fcmService.unRegister();
      localNotificationService.unregister();
    };
  };

  componentWillUnmount() {
    this.removehandleBackButtonClick();
  }

  removehandleBackButtonClick = () => {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  };

  handleBackButtonClick = () => {
    if (this.props.route.name == "PatientDashboard") {
      this.setState({ clickcount: this.state.clickcount + 1 });
      this.check();
    }
    return true;
  };
  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   this.props,
    //   'FIrst Screen ****************PATIENTDASH',
    //   nextProp,
    //   nextProp.navigation.isFocused(),
    //   'state',
    //   this.state.clickcount,
    //   this.state.isback
    // );

    this.setState({
      isloading: true,
      clickcount: 0,
      iscurrent: true,
      totalcliks: 0
    });

    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.backAction
    // );
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    this.retrieveData();
  };

  onPressBookTest = () => {
    this.removehandleBackButtonClick();
    this.setState({ isloading: false });
    // console.log('onPressMyDoctor=================');
    // this.setState({ iscurrent: false });
    this.props.navigation.navigate("ChooseBookingScreen", {
      refresh: true
    });
    // this.props.navigation.navigate('ChooseBookingScreen', {
    //   refresh: true,
    // //  back: this.removehandleBackButtonClick,
    // });
  };

  onPressMyPatient = () => {
    this.setState({ iscurrent: false });
    this.removehandleBackButtonClick();
    this.props.navigation.navigate("MyPatients", {
      refresh: "refresh"
    });
  };

  onPressProfile = () => {
    this.setState({ iscurrent: false });
    this.removehandleBackButtonClick();
    console.log("onPressProfile=================", this.state.userrole);
    this.props.navigation.navigate("UserProfile", {
      refresh: "refresh",
      role: this.state.userrole,
      back: this.removehandleBackButtonClick
    });
  };
  onPressMIC = () => {
    this.props.navigation.navigate("Audio", {});
  };
  onPressPatientView = () => {
    // this.removehandleBackButtonClick();
    this.setState({ activebtn: "patient" }, () => {
      this.saveData();
    });

    // console.log('onPressPatientView=================');
  };

  onPressMyDoctorView = () => {
    // this.removehandleBackButtonClick();
    this.setState({ activebtn: "doctor" }, () => {
      this.saveData();
    });

    // console.log('onPressMyDoctorView=================');
  };

  saveData = async () => {
    console.log("Role on Active==================", this.state.activebtn);
    try {
      await AsyncStorage.setItem(Constants.ACCOUNT_ROLE, this.state.activebtn);
    } catch (e) {
      alert("Failed to save the data to the storage");
    }
  };

  backAction = async () => {
    // console.log(
    //   '**********Dashboard handling back action******',
    //   this.props.navigation,
    //   '**********Dashboard handling back action******',
    //   this.props.navigation.canGoBack(),
    //   this.props.navigation.isFocused()
    // );
    if (this.props.route.name == "PatientDashboard") {
      this.setState({
        clickcount: this.state.clickcount + 1,
        isback: true,
        totalcliks: this.state.totalcliks + 1
      });
      this.check();
    }
    return true;
  };
  // new
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
  check = () => {
    if (this.state.clickcount < 2) {
      Toast.show({
        text: `Press back again to exit App `,
        duration: 1000,
        onClose: () => {
          this.setState({ clickcount: 0 });
        }
      });
    } else if (this.state.clickcount == 2) {
      BackHandler.exitApp();
    }
  };
  render() {
    const { StatusBarManager } = NativeModules;
    const STATUSBAR_HEIGHT =
      Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;

    const screenWidth = Math.round(Dimensions.get("window").width);
    return (
      <Container>
        <StatusBarPlaceHolder />
        <View style={styles.MainContainer}>
          {this.state.userrole == "doctor" ? (
            <ImageBackground
              source={require("../../icons/home-bg.png")}
              style={{ width: screenWidth, height: 140, marginTop: 0 }}
              resizeMode="stretch"
            >
              <View style={{ flex: 1, flexDirection: "column" }}>
                <View
                  style={{
                    height: 50,
                    backgroundColor: "transparent",
                    flexDirection: "row",
                    marginTop: 5
                  }}
                >
                  <TouchableOpacity
                    style={{
                      marginLeft: 8,
                      height: 35,
                      width: 35,
                      marginTop: 5
                    }}
                    onPress={this.OpenDrawer}
                  >
                    <Image
                      source={require("../../icons/menu.png")}
                      style={{ marginLeft: 5, height: 30, width: 30 }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  <Image
                    source={require("../../icons/logo-icon.png")}
                    style={{ marginLeft: 25, height: 35, width: 35 }}
                  />
                  <Text
                    style={{
                      textAlign: "left",
                      fontSize: 22,
                      flex: 1,
                      marginLeft: 15,
                      height: 40,
                      color: "white",
                      justifyContent: "center",
                      alignSelf: "center"
                    }}
                  >
                    Home
                  </Text>
                  <TouchableOpacity
                    style={{
                      // marginLeft: 8,
                      height: 35,
                      width: 35,
                      marginTop: 10,
                      marginRight: 25
                      // marginTop: 5
                    }}
                    onPress={() => this.props.navigation.navigate("Audio")}
                  >
                    <Image
                      source={require("../../icons/voice.png")}
                      style={{
                        marginLeft: 10,
                        height: 35,
                        width: 35,
                        marginTop: 10,
                        marginRight: 10
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    height: 30,
                    width: 200,
                    backgroundColor: "#f4f4f4",
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 20,
                    borderWidth: 1,
                    marginLeft: 5
                  }}
                >
                  {this.state.activebtn == "doctor" ? (
                    <>
                      <TouchableOpacity
                        style={{
                          height: 30,
                          width: "50%",
                          backgroundColor: "#1d303f",
                          borderRadius: 15,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        onPress={this.onPressMyDoctorView}
                      >
                        <Text style={{ fontSize: 10, color: "white" }}>
                          DOCTOR VIEW
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#f4f4f4",
                        height: "100%",
                        width: "50%",
                        borderRadius: 50,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                      onPress={this.onPressMyDoctorView}
                    >
                      <Text style={{ fontSize: 10, color: "#1d303f" }}>
                        DOCTOR VIEW
                      </Text>
                    </TouchableOpacity>
                  )}

                  {this.state.activebtn == "patient" ? (
                    <TouchableOpacity
                      style={{
                        height: 30,
                        width: "50%",
                        backgroundColor: "#1d303f",
                        borderRadius: 15,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                      onPress={this.onPressPatientView}
                    >
                      <Text style={{ fontSize: 10, color: "white" }}>
                        PATIENT VIEW
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#f4f4f4",
                        height: "100%",
                        width: "50%",
                        borderRadius: 50,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                      onPress={this.onPressPatientView}
                    >
                      <Text style={{ fontSize: 10, color: "#1d303f" }}>
                        PATIENT VIEW
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    color: "white",
                    marginTop: 5,
                    marginLeft: 10,
                    fontWeight: "bold",
                    alignSelf: "auto"
                  }}
                >
                  Awaiting Action{this.state.isloading}
                </Text>
              </View>
            </ImageBackground>
          ) : this.state.userrole == "technician" ? (
            <ImageBackground
              source={require("../../icons/home-bg.png")}
              style={{ width: screenWidth, height: 75, marginTop: 0 }}
              resizeMode="stretch"
            >
              <View style={{ flex: 1, flexDirection: "column" }}>
                <View
                  style={{
                    height: 50,
                    backgroundColor: "transparent",
                    flexDirection: "row",
                    marginTop: 5
                  }}
                >
                  <TouchableOpacity
                    style={{
                      marginLeft: 8,
                      height: 35,
                      width: 35,
                      marginTop: 5
                    }}
                    onPress={this.OpenDrawer}
                  >
                    <Image
                      source={require("../../icons/menu.png")}
                      style={{ marginLeft: 5, height: 32, width: 32 }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  {/* <Image
                    source={require("../../icons/logo-icon.png")}
                    style={{ marginLeft: 25, height: 40, width: 40 }}
                  /> */}
                  <Text
                    style={{
                      textAlign: "left",
                      fontSize: 25,
                      flex: 1,
                      marginLeft: 15,
                      // height: 40,
                      color: "white",
                      justifyContent: "center",
                      alignSelf: "center"
                    }}
                  >
                    Health Camp
                  </Text>
                  {/* <TouchableOpacity
                    style={{
                      // marginLeft: 8,
                      height: 35,
                      width: 35,
                      // marginTop: 10,
                      marginRight: 25
                      // marginTop: 5
                    }}
                    onPress={() => this.props.navigation.navigate("Audio")}
                  >
                    <Image
                      source={require("../../icons/voice.png")}
                      style={{
                        marginLeft: 10,
                        height: 35,
                        width: 35,
                        marginTop: 10,
                        marginRight: 10
                      }}
                    />
                  </TouchableOpacity> */}
                </View>
              </View>
            </ImageBackground>
          ) : (
            <ImageBackground
              source={require("../../icons/home-bg.png")}
              style={{ width: screenWidth, height: 75, marginTop: 0 }}
              resizeMode="stretch"
            >
              <View style={{ flex: 1, flexDirection: "column" }}>
                <View
                  style={{
                    height: 50,
                    backgroundColor: "transparent",
                    flexDirection: "row",
                    marginTop: 5
                  }}
                >
                  <TouchableOpacity
                    style={{
                      marginLeft: 8,
                      height: 35,
                      width: 35,
                      marginTop: 5
                    }}
                    onPress={this.OpenDrawer}
                  >
                    <Image
                      source={require("../../icons/menu.png")}
                      style={{ marginLeft: 5, height: 32, width: 32 }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  <Image
                    source={require("../../icons/logo-icon.png")}
                    style={{ marginLeft: 25, height: 40, width: 40 }}
                  />
                  <Text
                    style={{
                      textAlign: "left",
                      fontSize: 25,
                      flex: 1,
                      marginLeft: 15,
                      height: 40,
                      color: "white",
                      justifyContent: "center",
                      alignSelf: "center"
                    }}
                  >
                    Home
                  </Text>
                  <TouchableOpacity
                    style={{
                      // marginLeft: 8,
                      height: 35,
                      width: 35,
                      // marginTop: 10,
                      marginRight: 25
                      // marginTop: 5
                    }}
                    onPress={() => this.props.navigation.navigate("Audio")}
                  >
                    <Image
                      source={require("../../icons/voice.png")}
                      style={{
                        marginLeft: 10,
                        height: 35,
                        width: 35,
                        marginTop: 10,
                        marginRight: 10
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          )}

          {this.state.activebtn == "doctor" ? (
            <DoctordashboardComp
              remove={this.removehandleBackButtonClick()}
              navigation={this.props.navigation}
            ></DoctordashboardComp>
          ) : this.state.activebtn == "technician" ? (
            <TechDashboard
              remove={this.removehandleBackButtonClick()}
              navigation={this.props.navigation}
            ></TechDashboard>
          ) : (
            <PatientdashboardComp
              remove={this.removehandleBackButtonClick()}
              navigation={this.props.navigation}
            ></PatientdashboardComp>
          )}
        </View>

        {this.state.activebtn == "patient" ||
          this.state.activebtn == "employee" ? (
          <CustomFooter
            onPressBookTest={this.onPressBookTest}
            onPressProfile={this.onPressProfile}
            onPressMIC={this.onPressMIC}
            profile="unselect"
            home="select"
          />
        ) : this.state.activebtn == "doctor" ? (
          <CustomFooter
            footerId={1}
            onPressPatient={this.onPressMyPatient}
            onPressProfile={this.onPressProfile}
            profile="unselect"
            home="select"
          />
        ) : (
          <CustomFooter
            footerId={2} //for technitian role
            onPressProfile={this.onPressProfile}
            onPressLogout={this.onPressLogoutYes}
            profile="unselect"
            home="select"
            logout="unselect"
          />
        )}
      </Container>
    );
  }
}
export default PatientDashboard;

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    paddingTop: 0,
    backgroundColor: "white"
  },

  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    marginLeft: 5,
    justifyContent: "center",
    backgroundColor: "white"
  },

  Separator: {
    height: 0.5,
    backgroundColor: "gray",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10
  }
});
