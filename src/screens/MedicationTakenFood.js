import React from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  NativeModules,
  AppState,
  BackHandler
} from "react-native";
import { Container } from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import PushNotification from "react-native-push-notification";
import Toast from "react-native-tiny-toast";
import axios from "axios";

import notifee, {
  TimestampTrigger,
  TriggerType,
  TimeUnit,
  RepeatFrequency
} from "@notifee/react-native";
import { notifyLocalNotificationsService } from "../appComponents/notifiylocal";
import {
  MEDICINE_INFO,
  medicineInfo,
  DOSE_INFO,
  doseInfo,
  doseStatus,
  DOSE_STATUS,
  realm
} from "../utils/AllSchemas";
import moment from "moment";
import { localNotificationService } from "../appComponents/LocalNotificationService";

const Realm = require("realm");
const screenWidth = Math.round(Dimensions.get("window").width);
const { StatusBarManager } = NativeModules;

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

export default class MedicationTakenFood extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activebtn: "doctor",
      userrole: "",
      isLoading: false,
      doseTime: "",

      dose: "",
      firstDose: "",
      secondDose: "",
      thirdDose: "",
      tabName: "",
      takeFor: "",
      tabStrength: "",
      doseCount: 0,

      firstDoseTime: "",
      secondDoseTime: "",
      thirdDoseTime: "",

      firstDoseAlrm: "",
      secondDoseAlrm: "",
      thirdDoseAlrm: "",

      firstDoseQuantity: "",
      secondDoseQuantity: "",
      thirdDoseQuantity: "",
      UserId: 0,
      startDate: "",
      endDate: "",
      takenWithFood: "",
      duration: 0,
      doseDuration: "",
      forwhome: "",
      selectedtcolor: ""
    };
  }

  async requestNotificationPermission() {
    // console.log('request notification setting00');
    const bool = await checkNotificationPermission();

    if (bool) {
      // console.log(bool, '******request notification setting00');
    } else {
      changeNotificationSetting();
    }
  }

  retrieveData() {
    AsyncStorage.getItem(Constants.USER_ROLE).then((value) => {
      let valuelowrcase = value.toLowerCase();
      // console.log('Role Dashboard screen ==================', valuelowrcase);
      this.setState({
        userrole: valuelowrcase,
        activebtn: valuelowrcase == "doctor" ? "doctor" : "patient",
        isloading: true
      });

      //  this.setState({activebtn:valuelowrcase == 'doctor'?'doctor':'patient'})
      //   this.setState({
      //     isloading: true
      //   });
    });
    AsyncStorage.getItem(Constants.USER_ID).then((value) => {
      let valuelowrcase = value;
      // console.log("Role Dashboard screen ==================", valuelowrcase);
      this.setState({
        UserId: valuelowrcase,
        activebtn: valuelowrcase == "doctor" ? "doctor" : "patient",
        isloading: true
      });
    });
  }

  OpenDrawer = () => {
    this.props.navigation.goBack();
  };
  componentWillUnmount() {
    // Close the realm if there is one open.
    // const {realm} = this.state;
    if (realm !== null && !realm.isClosed) {
      realm.close();
    }
  }
  UNSAFE_componentWillReceiveProps = (nextProp) => {
    console.log(
      "UNSAFE_componentWillReceivePropslast saving",
      nextProp.route.params.color
    );

    this.setState(
      {
        forwhome: nextProp.route.params.forwhome,
        selectedtcolor: nextProp.route.params.color,

        tabName: nextProp.route.params.tabName,
        takeFor: nextProp.route.params.takeFor,
        tabStrength: nextProp.route.params.tabStrength,
        doseCount: nextProp.route.params.doseCount,
        firstDose: nextProp.route.params.firstDose,
        secondDose: nextProp.route.params.secondDose,
        thirdDose: nextProp.route.params.thirdDose,
        firstDoseTime: nextProp.route.params.firstDoseTime,
        secondDoseTime: nextProp.route.params.secondDoseTime,
        thirdDoseTime: nextProp.route.params.thirdDoseTime,
        doseDuration: nextProp.route.params.doseDuration,
        firstDoseAlrm: nextProp.route.params.firstDoseAlrm,
        secondDoseAlrm: nextProp.route.params.secondDoseAlrm,
        thirdDoseAlrm: nextProp.route.params.thirdDoseAlrm,
        firstDoseQuantity: nextProp.route.params.firstDoseQuantity,
        secondDoseQuantity: nextProp.route.params.secondDoseQuantity,
        thirdDoseQuantity: nextProp.route.params.thirdDoseQuantity,
        startDate: nextProp.route.params.startDate,
        endDate: nextProp.route.params.endDate,
        duration: nextProp.route.params.duration
      },
      () => { }
    );
  };

  componentDidMount = async () => {
    let self = this;
    this.setState(
      {
        forwhome: this.props.route.params.forwhome,
        selectedtcolor: this.props.route.params.color,

        tabName: this.props.route.params.tabName,
        takeFor: this.props.route.params.takeFor,
        tabStrength: this.props.route.params.tabStrength,
        doseCount: this.props.route.params.doseCount,
        firstDose: this.props.route.params.firstDose,
        secondDose: this.props.route.params.secondDose,
        thirdDose: this.props.route.params.thirdDose,
        firstDoseTime: this.props.route.params.firstDoseTime,
        secondDoseTime: this.props.route.params.secondDoseTime,
        thirdDoseTime: this.props.route.params.thirdDoseTime,
        doseDuration: this.props.route.params.doseDuration,
        firstDoseAlrm: this.props.route.params.firstDoseAlrm,
        secondDoseAlrm: this.props.route.params.secondDoseAlrm,
        thirdDoseAlrm: this.props.route.params.thirdDoseAlrm,
        firstDoseQuantity: this.props.route.params.firstDoseQuantity,
        secondDoseQuantity: this.props.route.params.secondDoseQuantity,
        thirdDoseQuantity: this.props.route.params.thirdDoseQuantity,
        startDate: this.props.route.params.startDate,
        endDate: this.props.route.params.endDate,
        duration: this.props.route.params.duration
      },

      () => { }
    );
    // this.requestNotificationPermission();
  };

  onPressSelect = (selectStr) => {
    if (selectStr == "Before eating") {
      this.setState({ takenWithFood: "Before eating" }, () => { });
    } else if (selectStr == "While eating") {
      this.setState({ takenWithFood: "While eating" }, () => { });
    } else if (selectStr == "After eating") {
      this.setState({ takenWithFood: "After eating" }, () => { });
    } else if (selectStr == "Doesnt matter") {
      this.setState({ takenWithFood: "Doesnt matter" }, () => { });
    }
  };

  SaveMedicationData() {
    moment.defaultFormat = "DD-MM-YYYY HH:mm";
    let Startdate = moment(this.state.startDate, moment.defaultFormat).toDate();
    let dostime =
      this.state.firstDoseTime +
      "," +
      this.state.secondDoseTime +
      "," +
      this.state.thirdDoseTime;

    // let realm = new Realm({ schema: [medicineInfo, doseInfo, doseStatus] });
    let comparedate = new Date();
    var Doseid = 0;
    var MedicationId = 0;
    var DoseStatusid = 0;
    var userid = this.state.UserId;

    if (this.state.endDate != null) {
      realm.write(() => {
        MedicationId = realm.objects(MEDICINE_INFO).length + 1;
        const Medicine_info = realm.create(MEDICINE_INFO, {
          Id: MedicationId,
          UserId: 1,
          Tabletname: this.state.tabName,
          Reason: this.state.takeFor,
          Startdate: moment(
            this.state.startDate,
            moment.defaultFormat
          ).toDate(),
          Enddate: moment(this.state.endDate, moment.defaultFormat).toDate(),

          Doseinfo: []
        });
        let currendate = new Date();

        for (let i = 0; i < this.state.doseCount; i++) {
          Doseid = realm.objects(DOSE_INFO).length + 1;
          DoseStatusid = realm.objects(DOSE_STATUS).length + 1;

          if (i == 0) {
            if (Startdate <= this.state.endDate) {
              let add1day = this.state.firstDoseAlrm;
              if (currendate < this.state.firstDoseAlrm) {
              } else {
                add1day.setDate(add1day.getDate() + 1);
              }
              PushNotification.checkPermissions((permission) => {
                if (permission) {
                  notifyLocalNotificationsService.onCreateTriggerNotification(
                    add1day,
                    this.state.tabName,
                    this.state.firstDoseTime,
                    MedicationId,
                    Doseid,
                    DoseStatusid,
                    Platform.OS
                  );
                  // PushNotification.localNotificationSchedule({
                  //   channelId: "sound-channel-id", // (required)
                  //   title: "Hi,it's time for your medication ",
                  //   data: {
                  //     Type: "Local Notifaction",
                  //     DoseInfo_Id: DoseStatusid,
                  //     MedicationId: MedicationId,
                  //     DoseInfo_MedicationId: Doseid,
                  //     Dosetime: this.state.firstDose,
                  //     Time: this.state.firstDoseTime,
                  //     TakenTime: this.state.firstDoseTime,
                  //     TakenDate: this.state.startDate,
                  //     IsTaken: "",
                  //     Quantity: this.state.firstDoseQuantity,
                  //     Reason: this.state.takeFor,
                  //     Strength: this.state.tabStrength,
                  //     Tabletname: this.state.tabName,
                  //     WhenToTake: this.state.takenWithFood,
                  //   },
                  //   invokeApp: false,
                  //   priority: "high",
                  //   actions: ["Skip", "Snooze", "Take"],
                  //   // messageId: "google:message_id",
                  //   message:
                  //     "Take your " +
                  //     this.state.tabName +
                  //     " med at " +
                  //     this.state.firstDoseTime,
                  //   date: add1day,
                  //   // date:firdate1,
                  //   // date: this.state.firstDoseAlrm,
                  //   // playSound: true,
                  //   // soundName: 'default',
                  //   vibration: 300,
                  //   vibrate: true,
                  //   allowWhileIdle: true,
                  //   priority: "high",
                  //   repeatType: "day",
                  //   timeoutAfter: 10000,
                  //   onlyAlertOnce: true,
                  //   exact: true,
                  //   // ongoing: true,
                  // });
                } else {
                  // console.log(permission, "******permission**********");
                }
              });
            }
            Medicine_info.Doseinfo.push({
              Id: Doseid,
              MedicationId: MedicationId,
              Dosetime: this.state.firstDose,
              Time: this.state.firstDoseTime,
              WhenToTake: this.state.takenWithFood,
              Quantity: this.state.firstDoseQuantity,
              Strength: this.state.tabStrength
            });

            Medicine_info.Dosestatus.push({
              Id: DoseStatusid,
              MedicationId: MedicationId,
              MedDoseId: Doseid,
              TakenTime: this.state.firstDoseTime,
              TakenDate: this.state.startDate,
              SkipReason: "",
              IsTaken: ""
            });
          } else if (i == 1) {
            //Notification
            if (Startdate <= this.state.endDate) {
              let add1day = this.state.secondDoseAlrm;
              if (currendate < this.state.secondDoseAlrm) {
              } else {
                add1day.setDate(add1day.getDate() + 1);
              }
              PushNotification.checkPermissions((permission) => {
                if (permission) {
                  notifyLocalNotificationsService.onCreateTriggerNotification(
                    this.state.secondDoseAlrm,
                    this.state.tabName,
                    this.state.secondDoseTime,
                    MedicationId,
                    Doseid,
                    DoseStatusid,
                    Platform.OS
                  );
                  // PushNotification.localNotificationSchedule({
                  //   channelId: "sound-channel-id", // (required)
                  //   title: "Hi,it's time for your medication ",

                  //   data: {
                  //     Type: "Local Notifaction",
                  //     DoseInfo_Id: DoseStatusid,
                  //     MedicationId: MedicationId,
                  //     DoseInfo_MedicationId: Doseid,
                  //     Dosetime: this.state.secondDose,
                  //     Time: this.state.secondDoseTime,
                  //     TakenTime: this.state.secondDoseTime,
                  //     TakenDate: this.state.startDate,
                  //     IsTaken: "",
                  //     Quantity: this.state.secondDoseQuantity,
                  //     Reason: this.state.takeFor,
                  //     Strength: this.state.tabStrength,
                  //     Tabletname: this.state.tabName,
                  //     WhenToTake: this.state.takenWithFood,
                  //   },
                  //   invokeApp: false,
                  //   priority: "high",
                  //   actions: ["Skip", "Snooze", "Take"],
                  //   messageId: "google:message_id",
                  //   message:
                  //     "Take your " +
                  //     this.state.tabName +
                  //     " med at " +
                  //     this.state.secondDoseTime, // (required)
                  //   // date: this.state.secondDoseAlrm, // in 60 secs
                  //   date: add1day,
                  //   playSound: true,
                  //   soundName: "default",
                  //   vibration: 300,
                  //   vibrate: true,
                  //   // invokeApp: true,
                  //   priority: "high",
                  //   repeatType: "day",
                  // });
                } else {
                  // console.log(permission, "******permission**********");
                }
              });
            }

            Medicine_info.Doseinfo.push({
              Id: Doseid,
              MedicationId: MedicationId,
              Dosetime: this.state.secondDose,
              Time: this.state.secondDoseTime,
              WhenToTake: this.state.takenWithFood,
              Quantity: this.state.secondDoseQuantity,
              Strength: this.state.tabStrength
            });

            Medicine_info.Dosestatus.push({
              Id: DoseStatusid,
              MedicationId: MedicationId,
              MedDoseId: Doseid,
              TakenTime: this.state.firstDoseTime,
              TakenDate: this.state.startDate,
              SkipReason: "",
              IsTaken: ""
            });
          } else if (i == 2) {
            if (Startdate <= this.state.endDate) {
              let add1day = this.state.thirdDoseAlrm;
              if (currendate < this.state.thirdDoseAlrm) {
              } else {
                add1day.setDate(add1day.getDate() + 1);
              }
              PushNotification.checkPermissions((permission) => {
                if (permission) {
                  notifyLocalNotificationsService.onCreateTriggerNotification(
                    this.state.thirdDoseAlrm,
                    this.state.tabName,
                    this.state.thirdDoseTime,
                    MedicationId,
                    Doseid,
                    DoseStatusid,
                    Platform.OS
                  );
                  // PushNotification.localNotificationSchedule({
                  //   channelId: "sound-channel-id", // (required)
                  //   title: "Hi,it's time for your medication ",

                  //   data: {
                  //     Type: "Local Notifaction",
                  //     DoseInfo_Id: DoseStatusid,
                  //     MedicationId: MedicationId,
                  //     DoseInfo_MedicationId: Doseid,
                  //     Dosetime: this.state.thirdDose,
                  //     Time: this.state.thirdDoseTime,
                  //     TakenTime: this.state.thirdDoseTime,
                  //     TakenDate: this.state.startDate,
                  //     IsTaken: "",
                  //     Quantity: this.state.thirdDoseQuantity,
                  //     Reason: this.state.takeFor,
                  //     Strength: this.state.tabStrength,
                  //     Tabletname: this.state.tabName,
                  //     WhenToTake: this.state.takenWithFood,
                  //   },
                  //   invokeApp: false,
                  //   priority: "high",
                  //   actions: ["Skip", "Snooze", "Take"],
                  //   messageId: "google:message_id",
                  //   message:
                  //     "Take your " +
                  //     this.state.tabName +
                  //     " med at " +
                  //     this.state.thirdDoseTime, // (required)
                  //   //date: this.state.thirdDoseAlrm, // in 60 secs
                  //   date: add1day,
                  //   // vibration: 300,
                  //   vibrate: true,
                  //   // invokeApp: true,
                  //   priority: "high",
                  //   repeatType: "day",
                  // });
                } else {
                  // console.log(permission, "******permission**********");
                }
              });
            }
            Medicine_info.Doseinfo.push({
              Id: Doseid,
              MedicationId: MedicationId,
              Dosetime: this.state.thirdDose,
              Time: this.state.thirdDoseTime,
              WhenToTake: this.state.takenWithFood,
              Quantity: this.state.thirdDoseQuantity,
              Strength: this.state.tabStrength
            });

            Medicine_info.Dosestatus.push({
              Id: DoseStatusid,
              MedicationId: MedicationId,
              MedDoseId: Doseid,
              TakenTime: this.state.thirdDoseTime,
              TakenDate: this.state.startDate,
              SkipReason: "",
              IsTaken: ""
            });
          }
        }
      });
    } else {
      realm.write(() => {
        MedicationId = realm.objects(MEDICINE_INFO).length + 1;
        const Medicine_info = realm.create(MEDICINE_INFO, {
          Id: MedicationId,
          UserId: 1,
          Tabletname: this.state.tabName,
          Reason: this.state.takeFor,
          Startdate: moment(
            this.state.startDate,
            moment.defaultFormat
          ).toDate(),
          // Enddate: moment(this.state.endDate, moment.defaultFormat).toDate(),
          Doseinfo: []
        });

        for (let i = 0; i < this.state.doseCount; i++) {
          Doseid = realm.objects(DOSE_INFO).length + 1;
          DoseStatusid = realm.objects(DOSE_STATUS).length + 1;
          if (i == 0) {
            if (Startdate <= this.state.endDate) {
              let add1day = this.state.firstDoseAlrm;
              if (currendate < this.state.firstDoseAlrm) {
              } else {
                add1day.setDate(add1day.getDate() + 1);
              }
              PushNotification.checkPermissions((permission) => {
                if (permission) {
                  notifyLocalNotificationsService.onCreateTriggerNotification(
                    this.state.firstDoseAlrm,
                    this.state.tabName,
                    this.state.firstDoseTime,
                    MedicationId,
                    Doseid,
                    DoseStatusid,
                    Platform.OS
                  );
                  // PushNotification.localNotificationSchedule({
                  //   channelId: "sound-channel-id", // (required)
                  //   title: "Hi,it's time for your medication ",

                  //   data: {
                  //     Type: "Local Notifaction",
                  //     DoseInfo_Id: DoseStatusid,
                  //     MedicationId: MedicationId,
                  //     DoseInfo_MedicationId: Doseid,
                  //     Dosetime: this.state.firstDose,
                  //     Time: this.state.firstDoseTime,
                  //     TakenTime: this.state.firstDoseTime,
                  //     TakenDate: this.state.startDate,
                  //     IsTaken: "",
                  //     Quantity: this.state.firstDoseQuantity,
                  //     Reason: this.state.takeFor,
                  //     Strength: this.state.tabStrength,
                  //     Tabletname: this.state.tabName,
                  //     WhenToTake: this.state.takenWithFood,
                  //   },
                  //   invokeApp: false,
                  //   priority: "high",
                  //   actions: ["Skip", "Snooze", "Take"],
                  //   messageId: "google:message_id",
                  //   message:
                  //     "Take your " +
                  //     this.state.tabName +
                  //     " med at " +
                  //     this.state.firstDoseTime, // (required)
                  //   // date: this.state.firstDoseAlrm, // in 60 secs
                  //   // vibration: 300,
                  //   vibrate: true,
                  //   date: add1day,
                  //   priority: "high",
                  //   repeatType: "day",
                  // });
                } else {
                  // console.log(permission, "******permission**********");
                }
              });
            }
            Medicine_info.Doseinfo.push({
              Id: Doseid,
              MedicationId: MedicationId,
              Dosetime: this.state.firstDose,
              Time: this.state.firstDoseTime,
              WhenToTake: this.state.takenWithFood,
              Quantity: this.state.firstDoseQuantity,
              Strength: this.state.tabStrength
            });

            Medicine_info.Dosestatus.push({
              Id: DoseStatusid,
              MedicationId: MedicationId,
              MedDoseId: Doseid,
              TakenTime: this.state.firstDoseTime,
              TakenDate: this.state.startDate,
              SkipReason: "",
              IsTaken: ""
            });
          } else if (i == 1) {
            if (Startdate <= this.state.endDate) {
              let add1day = this.state.secondDoseAlrm;
              if (currendate < this.state.secondDoseAlrm) {
              } else {
                add1day.setDate(add1day.getDate() + 1);
              }
              PushNotification.checkPermissions((permission) => {
                if (permission) {
                  notifyLocalNotificationsService.onCreateTriggerNotification(
                    this.state.secondDoseAlrm,
                    this.state.tabName,
                    this.state.secondDoseTime,
                    MedicationId,
                    Doseid,
                    DoseStatusid,
                    Platform.OS
                  );
                  // PushNotification.localNotificationSchedule({
                  //   channelId: "sound-channel-id", // (required)
                  //   title: "Hi,it's time for your medication ",
                  //   data: {
                  //     Type: "Local Notifaction",
                  //     DoseInfo_Id: DoseStatusid,
                  //     MedicationId: MedicationId,
                  //     DoseInfo_MedicationId: Doseid,
                  //     Dosetime: this.state.secondDose,
                  //     Time: this.state.secondDoseTime,
                  //     TakenTime: this.state.secondDoseTime,
                  //     TakenDate: this.state.startDate,
                  //     IsTaken: "",
                  //     Quantity: this.state.secondDoseQuantity,
                  //     Reason: this.state.takeFor,
                  //     Strength: this.state.tabStrength,
                  //     Tabletname: this.state.tabName,
                  //     WhenToTake: this.state.takenWithFood,
                  //   },
                  //   invokeApp: false,
                  //   priority: "high",
                  //   actions: ["Skip", "Snooze", "Take"],
                  //   messageId: "google:message_id",
                  //   message:
                  //     "Take your " +
                  //     this.state.tabName +
                  //     " med at " +
                  //     this.state.secondDoseTime, // (required)
                  //   date: add1day,
                  //   // date: this.state.secondDoseAlrm, // in 60 secs
                  //   vibration: 300,
                  //   vibrate: true,

                  //   priority: "high",
                  //   repeatType: "day",
                  // });
                } else {
                  // console.log(permission, "******permission**********");
                }
              });
            }
            Medicine_info.Doseinfo.push({
              Id: Doseid,
              MedicationId: MedicationId,
              Dosetime: this.state.secondDose,
              Time: this.state.secondDoseTime,
              WhenToTake: this.state.takenWithFood,
              Quantity: this.state.secondDoseQuantity,
              Strength: this.state.tabStrength
            });

            Medicine_info.Dosestatus.push({
              Id: DoseStatusid,
              MedicationId: MedicationId,
              MedDoseId: Doseid,
              TakenTime: this.state.firstDoseTime,
              TakenDate: this.state.startDate,
              SkipReason: "",
              IsTaken: ""
            });
          } else if (i == 2) {
            if (Startdate <= this.state.endDate) {
              let add1day = this.state.thirdDoseAlrm;
              if (currendate < this.state.thirdDoseAlrm) {
              } else {
                add1day.setDate(add1day.getDate() + 1);
              }
              PushNotification.checkPermissions((permission) => {
                if (permission) {
                  notifyLocalNotificationsService.onCreateTriggerNotification(
                    this.state.thirdDoseAlrm,
                    this.state.tabName,
                    this.state.thirdDoseTime,
                    MedicationId,
                    Doseid,
                    DoseStatusid,
                    Platform.OS
                  );
                  // PushNotification.localNotificationSchedule({
                  //   channelId: "sound-channel-id", // (required)
                  //   title: "Hi,it's time for your medication ",

                  //   data: {
                  //     Type: "Local Notifaction",
                  //     DoseInfo_Id: DoseStatusid,
                  //     MedicationId: MedicationId,
                  //     DoseInfo_MedicationId: Doseid,
                  //     Dosetime: this.state.thirdDose,
                  //     Time: this.state.thirdDoseTime,
                  //     TakenTime: this.state.thirdDoseTime,
                  //     TakenDate: this.state.startDate,
                  //     IsTaken: "",
                  //     Quantity: this.state.thirdDoseQuantity,
                  //     Reason: this.state.takeFor,
                  //     Strength: this.state.tabStrength,
                  //     Tabletname: this.state.tabName,
                  //     WhenToTake: this.state.takenWithFood,
                  //   },
                  //   invokeApp: false,
                  //   priority: "high",
                  //   actions: ["Skip", "Snooze", "Take"],
                  //   messageId: "google:message_id",
                  //   message:
                  //     "Take your " +
                  //     this.state.tabName +
                  //     " med at " +
                  //     this.state.thirdDoseTime, // (required)
                  //   //    date: this.state.thirdDoseAlrm, // in 60 secs
                  //   // vibration: 300,
                  //   date: add1day,
                  //   vibrate: true,

                  //   priority: "high",
                  //   repeatType: "day",
                  // });
                } else {
                  // console.log(permission, "******permission**********");
                }
              });
            }
            Medicine_info.Doseinfo.push({
              Id: Doseid,
              MedicationId: MedicationId,
              Dosetime: this.state.thirdDose,
              Time: this.state.thirdDoseTime,
              WhenToTake: this.state.takenWithFood,
              Quantity: this.state.thirdDoseQuantity,
              Strength: this.state.tabStrength
            });

            Medicine_info.Dosestatus.push({
              Id: DoseStatusid,
              MedicationId: MedicationId,
              MedDoseId: Doseid,
              TakenTime: this.state.firstDoseTime,
              TakenDate: this.state.startDate,
              SkipReason: "",
              IsTaken: ""
            });
          }
        }
      });
    }

    if (realm.objects(MEDICINE_INFO).length) {
      // console.log(
      //   "Medication taken food REALM PATH================",
      //   Realm.defaultPath
      // );
      let medication = realm.objects(MEDICINE_INFO);

      this.FetchMedicationData();
      // if (medication != []) {
      //   Toast.show("Medicine Saved successfully");
      //   this.props.navigation.navigate("MedicationCalendrHome");
      // }
      // console.log(medication, "saved data");
    }
    //realm.close();

    this.setState({ isLoading: false }, () => {
      // console.log("data saved successfully");
    });
  }

  FetchMedicationData() {
    // let realm = new Realm({ schema: [medicineInfo, doseInfo, doseStatus] });
    let selectedDate = moment(new Date(), "YYYY-MM-DDTHH: mm: ss")
      .format("DD-MM-YYYY")
      .toString();
    // this.setState({
    //   medicationInfo: [],
    // });

    let medication = realm.objects(MEDICINE_INFO);
    if (medication.length > 0) {
      this.props.navigation.navigate("MedicationCalendrHome", {
        refresh: true
      });
    }

    // this.setState({
    //   medicationInfo: temparray,
    //   isLoading: false,
    // });
  }
  SaveDateToBackedDB = async () => {
    try {
      let response = await axios.post(Constants.ADD_MEDICINE_REMINDER, {
        MedName: this.state.tabName,
        Medfor: this.state.takeFor,
        MedSdate: moment(this.state.startDate, "DD/MM/YY").format("MM/DD/YYYY"),

        MedDoseDuration: this.state.duration,
        DoseInterval: this.state.doseCount,
        DoseTime:
          this.state.firstDoseTime +
          "," +
          this.state.secondDoseTime +
          "," +
          this.state.thirdDoseTime,
        MedicationStatus: "",
        NotificationStatus: "N",
        ForWhome: this.state.forwhome,
        ColorCode: this.state.selectedtcolor
      });
      if (response.data.Status) {
        this.props.navigation.navigate("MedicationCalendrHome", {
          refresh: true
        });
      }
    } catch (e) {
      Toast.show("Something Went Wrong, Please Try Again Later ");
      this.setState({ isLoading: false });
      console.log(e, "=============");
    }
  };
  saveData = () => {
    if (this.state.takenWithFood == "") {
      Toast.show("Please select this is taken with food?");
    } else {
      try {
        this.setState({ isLoading: true }, () => {
          setTimeout(() => {
            // this.SaveMedicationData();
            this.SaveDateToBackedDB();
          }, 500);
        });

        // let medication = realm.objects(MEDICINE_INFO);
        // console.log(medication, "medicatiob in calling of save data");
      } catch (e) { }
    }
  };

  render() {
    const { StatusBarManager } = NativeModules;
    const STATUSBAR_HEIGHT =
      Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;
    // console.log("statusheight===", StatusBarManager.HEIGHT);

    ///const { navigate } = this.props.navigation;
    const screenWidth = Math.round(Dimensions.get("window").width);

    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <StatusBarPlaceHolder />

        <ImageBackground
          source={require("../../icons/medicationHeader.png")}
          style={{ width: screenWidth, height: 250, marginTop: 0 }}
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
                style={{ marginLeft: 8, height: 35, width: 35, marginTop: 5 }}
                onPress={this.OpenDrawer}
              >
                <Image
                  source={require("../../icons/back.png")}
                  style={{ marginLeft: 5, height: 28, width: 28 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              <Text
                style={{
                  textAlign: "left",
                  fontSize: 22,
                  flex: 1,
                  marginLeft: 25,
                  height: 40,
                  color: "white",
                  marginTop: 5
                  // justifyContent: "center",
                  // alignSelf: "center"
                }}
              >
                Medication
              </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "transparent"
              }}
            >
              <Image
                source={require("../../icons/takenwithfood.png")}
                style={{ height: 80, width: 80 }}
                resizeMode="cover"
              />
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "normal",
                  textAlign: "center",
                  color: "white",
                  marginTop: 10,
                  marginLeft: 15,
                  marginRight: 15
                }}
              >
                Should this be taken with food?
              </Text>
            </View>
          </View>
        </ImageBackground>

        <View
          style={{ flex: 1, flexDirection: "column", backgroundColor: "white" }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              backgroundColor: "white",
              marginTop: 20
            }}
          >
            {this.state.takenWithFood == "Before eating" ? (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 2 }}
                onPress={() => this.onPressSelect("Before eating")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "left",
                    color: "black",
                    marginLeft: 25
                  }}
                >
                  Before eating
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 2 }}
                onPress={() => this.onPressSelect("Before eating")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "normal",
                    textAlign: "left",
                    color: "gray",
                    marginLeft: 25
                  }}
                >
                  Before eating
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            )}
            {this.state.takenWithFood == "While eating" ? (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 2 }}
                onPress={() => this.onPressSelect("While eating")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "left",
                    color: "black",
                    marginLeft: 25
                  }}
                >
                  While eating
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 2 }}
                onPress={() => this.onPressSelect("While eating")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "normal",
                    textAlign: "left",
                    color: "gray",
                    marginLeft: 25
                  }}
                >
                  While eating
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            )}
            {this.state.takenWithFood == "After eating" ? (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 2 }}
                onPress={() => this.onPressSelect("After eating")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "left",
                    color: "black",
                    marginLeft: 25
                  }}
                >
                  After eating
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 2 }}
                onPress={() => this.onPressSelect("After eating")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "normal",
                    textAlign: "left",
                    color: "gray",
                    marginLeft: 25
                  }}
                >
                  After eating
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            )}
            {this.state.takenWithFood == "Doesnt matter" ? (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 2 }}
                onPress={() => this.onPressSelect("Doesnt matter")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight:
                      this.state.takenWithFood == "" ? "normal" : "bold",
                    // fontWeight: 'bold',
                    textAlign: "left",
                    color: "black",
                    marginLeft: 25
                  }}
                >
                  Doesn't matter
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 2 }}
                onPress={() => this.onPressSelect("Doesnt matter")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "normal",
                    textAlign: "left",
                    color: "gray",
                    marginLeft: 25
                  }}
                >
                  Doesn't matter
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              height: 60,
              marginBottom: 0,
              backgroundColor: "white",
              flexDirection: "row-reverse",
              justifyContent: "space-between"
            }}
          >
            <TouchableOpacity
              style={{
                height: 60,
                marginBottom: 0,
                backgroundColor: "white",
                flexDirection: "row-reverse"
              }}
              //style={styles.loginScreenButton}
              onPress={() => this.saveData()}
              underlayColor="#fff"
            >
              <Image
                style={{
                  resizeMode: "contain",
                  height: 25,
                  width: 25,
                  marginRight: 20
                }}
                source={require("../../icons/next.png")}
              />
              <Text style={styles.loginText}> Next </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: 60,
                marginBottom: 0,
                backgroundColor: "white",
                flexDirection: "row-reverse"
              }}
              //style={styles.loginScreenButton}
              onPress={() => this.props.navigation.goBack()}
              underlayColor="#fff"
            >
              <Text style={styles.loginText}> Back </Text>

              <Image
                style={{
                  resizeMode: "contain",
                  height: 25,
                  width: 25,
                  marginLeft: 20
                }}
                source={require("../../icons/prev.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    paddingTop: 0,
    backgroundColor: "white",
    flexDirection: "column"
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
  },
  loginText: {
    color: "#2e62ae",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10
  }
});
