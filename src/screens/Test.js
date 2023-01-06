import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  NativeModules,
  AppState,
  BackHandler,
} from "react-native";
import { Container, Header } from "native-base";
import CustomFooter from "../appComponents/CustomFooter";
import PatientdashboardComp from "../appComponents/PatientdashboardComp";
import DoctordashboardComp from "../appComponents/DoctordashboardComp";
import AsyncStorage from "@react-native-community/async-storage";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import PushNotification from "react-native-push-notification";
import {
  changeNotificationSetting,
  checkNotificationPermission,
} from "react-native-check-notification-permission";
// import NotifyService from '../Notification/NotifyService';
import {
  MEDICINE_INFO,
  medicineInfo,
  DOSE_INFO,
  doseInfo,
  doseStatus,
  DOSE_STATUS,
} from "../utils/AllSchemas";
import moment from "moment";

const Realm = require("realm");

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
    };
    // this.notify = new NotifyService(
    //   // this.onRegister.bind(this),
    //   this._onNotif.bind(this)
    // );
  }

  // _onNotif(notif) {
  //   console.log(notif, '*****Medication Food***** ');
  //   if (notif != undefined && notif.userInteraction === true) {
  //     console.log(notif);
  //   } else {
  //     console.log('------------onNotification of called');
  //   }

  // Alert.alert('On notification', notif.Name);/
  // }

  async requestNotificationPermission() {
    const bool = await checkNotificationPermission();

    if (bool) {
    } else {
      changeNotificationSetting();
    }
  }

  retrieveData() {
    AsyncStorage.getItem(Constants.USER_ROLE).then((value) => {
      let valuelowrcase = value.toLowerCase();
      // console.log("Role Dashboard screen ==================", valuelowrcase);
      this.setState({
        userrole: valuelowrcase,
        activebtn: valuelowrcase == "doctor" ? "doctor" : "patient",
        isloading: true,
      });

      //  this.setState({activebtn:valuelowrcase == 'doctor'?'doctor':'patient'})
      //   this.setState({
      //     isloading: true
      //   });
    });
    AsyncStorage.getItem(Constants.USER_ID).then((value) => {
      let valuelowrcase = value;
      this.setState({
        UserId: valuelowrcase,
        activebtn: valuelowrcase == "doctor" ? "doctor" : "patient",
        isloading: true,
      });
    });
  }

  OpenDrawer = () => {
    this.props.navigation.goBack();
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   " MedTakenFood componentWillReceiveProps==============================",
    //   nextProp.route.params.tabName,
    //   nextProp.route.params.takeFor,
    //   nextProp.route.params.tabStrength,
    //   nextProp.route.params.doseCount,
    //   nextProp.route.params.firstDose,
    //   nextProp.route.params.secondDose,
    //   nextProp.route.params.thirdDose,
    //   nextProp.route.params.firstDoseTime,
    //   nextProp.route.params.secondDoseTime,
    //   nextProp.route.params.thirdDoseTime,
    //   nextProp.route.params.firstDoseQuantity,
    //   nextProp.route.params.secondDoseQuantity,
    //   nextProp.route.params.thirdDoseQuantity,
    //   nextProp.route.params.startDate,
    //   nextProp.route.params.endDate
    // );
    this.setState(
      {
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

        firstDoseAlrm: nextProp.route.params.firstDoseAlrm,
        secondDoseAlrm: nextProp.route.params.secondDoseAlrm,
        thirdDoseAlrm: nextProp.route.params.thirdDoseAlrm,

        firstDoseQuantity: nextProp.route.params.firstDoseQuantity,
        secondDoseQuantity: nextProp.route.params.secondDoseQuantity,
        thirdDoseQuantity: nextProp.route.params.thirdDoseQuantity,
        startDate: nextProp.route.params.startDate,
        endDate: nextProp.route.params.endDate,
      },
      () => {}
    );
  };

  // handelNotification = (notification) => {
  //   console.log(notification, '******Handle Notifcation');
  //   if (notification.userInteraction) {
  //     this.props.navigation.navigate('MedicationCalendrHome', {
  //       data: notification.data,
  //     });
  //   }
  // };

  componentDidMount = async () => {
    PushNotification.popInitialNotification((notification) => {
      console.log("Initial Notification", notification);
    });
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
    PushNotification.createChannel(
      {
        channelId: "sound-channel-id", // (required)
        channelName: `Sound channel`, // (required)
        channelDescription: "A sound channel", // (optional) default: undefined.
        soundName: "sample.mp3", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) =>
        console.log(`createChannel 'sound-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );

    let self = this;
    // PushNotification.invokeApp(notification);
    PushNotification.configure({
      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log("LOCAL NOTIFICATION ==>", notification);

        // self.handelNotification(notification);
        PushNotification.invokeApp(notification);
      },
      onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);

        // process the action
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: true,
    });
    // console.log(
    //   "MedicationTakenFood componentDidMount and store data==============================",
    //   "tabName-",
    //   this.props.route.params.tabName,
    //   "takeFor-",
    //   this.props.route.params.takeFor,
    //   "tabStrength-",
    //   this.props.route.params.tabStrength,
    //   "doseCount-",
    //   this.props.route.params.doseCount,
    //   "firstDose-",
    //   this.props.route.params.firstDose,
    //   "secondDose-",
    //   this.props.route.params.secondDose,
    //   "thirdDose-",
    //   this.props.route.params.thirdDose,
    //   "firstDoseTime-",
    //   this.props.route.params.firstDoseTime,
    //   "secondDoseTime-",
    //   this.props.route.params.secondDoseTime,
    //   " thirdDoseTime-",
    //   this.props.route.params.thirdDoseTime,
    //   "firstDoseQuantity-",
    //   this.props.route.params.firstDoseQuantity,
    //   "secondDoseQuantity-",
    //   this.props.route.params.secondDoseQuantity,
    //   "thirdDoseQuantity-",
    //   this.props.route.params.thirdDoseQuantity,
    //   "startDate-",
    //   this.props.route.params.startDate,
    //   "endDate-",
    //   this.props.route.params.endDate,
    //   "first dose alrm",
    //   this.props.route.params.firstDoseAlrm,
    //   "second dose alrm",
    //   this.props.route.params.secondDoseAlrm,
    //   "third alrm",
    //   this.props.route.params.thirdDoseAlrm
    // );
    this.setState(
      {
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

        firstDoseAlrm: this.props.route.params.firstDoseAlrm,
        secondDoseAlrm: this.props.route.params.secondDoseAlrm,
        thirdDoseAlrm: this.props.route.params.thirdDoseAlrm,
        firstDoseQuantity: this.props.route.params.firstDoseQuantity,
        secondDoseQuantity: this.props.route.params.secondDoseQuantity,
        thirdDoseQuantity: this.props.route.params.thirdDoseQuantity,
        startDate: this.props.route.params.startDate,
        endDate: this.props.route.params.endDate,
      },

      () => {}
    );
    this.requestNotificationPermission();
    // console.log(
    //   new Date(Date.now() + 30 * 1000),
    //   "*******Push notification local*****",

    //   "======================this.state.firstDoseAlrm",
    //   this.props.route.params.firstDoseAlrm,
    //   "this.state.tabName",
    //   this.state.tabName
    // );
  };

  onPressSelect = (selectStr) => {
    // console.log("selectStr Medication Taken food=================", selectStr);
    if (selectStr == "Before eating") {
      this.setState({ takenWithFood: "Before eating" }, () => {});
    } else if (selectStr == "While eating") {
      this.setState({ takenWithFood: "While eating" }, () => {});
    } else if (selectStr == "After eating") {
      this.setState({ takenWithFood: "After eating" }, () => {});
    } else if (selectStr == "Doesnt matter") {
      this.setState({ takenWithFood: "Doesnt matter" }, () => {});
    }
  };

  SaveMedicationData() {
    PushNotification.requestPermissions((permission) => {
      // console.log(permission, "prmisio2222");
    });
    // console.log("medication save ");
    moment.defaultFormat = "DD-MM-YYYY HH:mm";

    let Startdate = moment(this.state.startDate, moment.defaultFormat).toDate();
    // console.log(
    //   "this.state.startDate =================",
    //   this.state.startDate,
    //   "SartDate ******",
    //   Startdate
    // );
    // console.log("this.state.endDate =================", this.state.endDate);

    // console.log(
    //   "======================this.state.firstDoseTime",
    //   this.state.firstDoseTime
    // );
    // var enddate = '';
    // if (this.state.endDate == 'null') {
    //   enddate = '';
    // } else {
    //   enddate = moment(this.state.endDate).format('DD-MM-YYYY');
    // }
    // console.log(enddate, '*************enddate*******');

    let realm = new Realm({ schema: [medicineInfo, doseInfo, doseStatus] });

    var Doseid = 0;
    var MedicationId = 0;
    var DoseStatusid = 0;
    var userid = this.state.UserId;
    // console.log(userid, "User id ");

    // console.log(realm.objects(MEDICINE_INFO).length, "*********lent**********");
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

          Doseinfo: [],
        });

        for (let i = 0; i < this.state.doseCount; i++) {
          Doseid = realm.objects(DOSE_INFO).length + 1;
          DoseStatusid = realm.objects(DOSE_STATUS).length + 1;
          if (i == 0) {
            if (Startdate <= this.state.endDate) {
              PushNotification.checkPermissions((permission) => {
                if (permission) {
                  PushNotification.localNotificationSchedule({
                    channelId: "sound-channel-id", // (required)
                    title: "Hi,it's time for your medication ",
                    // data: {
                    //   Type: 'Local Notifaction',
                    //   DoseInfo_Id: DoseStatusid,
                    //   MedicationId: MedicationId,
                    //   DoseInfo_MedicationId: Doseid,
                    //   Dosetime: this.state.firstDose,
                    //   Time: this.state.firstDoseTime,
                    //   TakenTime: this.state.firstDoseTime,
                    //   TakenDate: this.state.startDate,
                    //   Enddate: this.state.endDate,
                    //   IsTaken: '',
                    //   Quantity: this.state.firstDoseQuantity,
                    //   Reason: this.state.takeFor,
                    //   Startdate: moment(
                    //     this.state.startDate,
                    //     moment.defaultFormat
                    //   ).toDate(),
                    //   Strength: this.state.tabStrength,
                    //   Tabletname: this.state.tabName,
                    //   WhenToTake: this.state.takenWithFood,
                    // },
                    data: {
                      Type: "Local Notifaction",
                      DoseInfo_Id: DoseStatusid,
                      MedicationId: MedicationId,
                      DoseInfo_MedicationId: Doseid,
                      Dosetime: this.state.firstDose,
                      Time: this.state.firstDoseTime,
                      TakenTime: this.state.firstDoseTime,
                      TakenDate: this.state.startDate,
                      IsTaken: "",
                      Quantity: this.state.firstDoseQuantity,
                      Reason: this.state.takeFor,
                      Strength: this.state.tabStrength,
                      Tabletname: this.state.tabName,
                      WhenToTake: this.state.takenWithFood,
                    },
                    invokeApp: false,
                    priority: "high",
                    actions: ["Skip", "Snooze", "Take"],
                    messageId: "google:message_id",
                    message:
                      "Take your " +
                      this.state.tabName +
                      " med at " +
                      this.state.firstDoseTime,
                    date: this.state.firstDoseAlrm,
                    // playSound: true,
                    // soundName: 'default',
                    vibration: 300,
                    vibrate: true,
                    allowWhileIdle: true,
                    priority: "high",
                    repeatType: "day",
                  });
                } else {
                  console.log(permission, "******permission**********");
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
              Strength: this.state.tabStrength,
            });

            Medicine_info.Dosestatus.push({
              Id: DoseStatusid,
              MedicationId: MedicationId,
              MedDoseId: Doseid,
              TakenTime: this.state.firstDoseTime,
              TakenDate: this.state.startDate,
              SkipReason: "",
              IsTaken: "",
            });
          } else if (i == 1) {
            //Notification
            if (Startdate <= this.state.endDate) {
              PushNotification.checkPermissions((permission) => {
                if (permission) {
                  PushNotification.localNotificationSchedule({
                    channelId: "sound-channel-id", // (required)
                    title: "Hi,it's time for your medication ",
                    // data: {
                    //   Type: 'Local Notifaction',
                    //   DoseInfo_Id: DoseStatusid,
                    //   MedicationId: MedicationId,
                    //   DoseInfo_MedicationId: Doseid,
                    //   Dosetime: this.state.firstDose,
                    //   Time: this.state.firstDoseTime,
                    //   TakenTime: this.state.firstDoseTime,
                    //   TakenDate: this.state.startDate,
                    // },
                    data: {
                      Type: "Local Notifaction",
                      DoseInfo_Id: DoseStatusid,
                      MedicationId: MedicationId,
                      DoseInfo_MedicationId: Doseid,
                      Dosetime: this.state.secondDose,
                      Time: this.state.secondDoseTime,
                      TakenTime: this.state.secondDoseTime,
                      TakenDate: this.state.startDate,
                      IsTaken: "",
                      Quantity: this.state.secondDoseQuantity,
                      Reason: this.state.takeFor,
                      Strength: this.state.tabStrength,
                      Tabletname: this.state.tabName,
                      WhenToTake: this.state.takenWithFood,
                    },
                    invokeApp: false,
                    priority: "high",
                    actions: ["Skip", "Snooze", "Take"],
                    messageId: "google:message_id",
                    message:
                      "Take your " +
                      this.state.tabName +
                      " med at " +
                      this.state.secondDoseTime, // (required)
                    date: this.state.secondDoseAlrm, // in 60 secs
                    playSound: true,
                    soundName: "default",
                    vibration: 300,
                    vibrate: true,
                    // invokeApp: true,
                    priority: "high",
                    repeatType: "day",
                  });
                } else {
                  console.log(permission, "******permission**********");
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
              Strength: this.state.tabStrength,
            });

            Medicine_info.Dosestatus.push({
              Id: DoseStatusid,
              MedicationId: MedicationId,
              MedDoseId: Doseid,
              TakenTime: this.state.firstDoseTime,
              TakenDate: this.state.startDate,
              SkipReason: "",
              IsTaken: "",
            });
          } else if (i == 2) {
            if (Startdate <= this.state.endDate) {
              PushNotification.checkPermissions((permission) => {
                if (permission) {
                  PushNotification.localNotificationSchedule({
                    channelId: "sound-channel-id", // (required)
                    title: "Hi,it's time for your medication ",
                    // data: {
                    //   Type: 'Local Notifaction',
                    //   DoseInfo_Id: DoseStatusid,
                    //   MedicationId: MedicationId,
                    //   DoseInfo_MedicationId: Doseid,
                    //   Dosetime: this.state.firstDose,
                    //   Time: this.state.firstDoseTime,
                    //   TakenTime: this.state.firstDoseTime,
                    //   TakenDate: this.state.startDate,
                    // },
                    data: {
                      Type: "Local Notifaction",
                      DoseInfo_Id: DoseStatusid,
                      MedicationId: MedicationId,
                      DoseInfo_MedicationId: Doseid,
                      Dosetime: this.state.thirdDose,
                      Time: this.state.thirdDoseTime,
                      TakenTime: this.state.thirdDoseTime,
                      TakenDate: this.state.startDate,
                      IsTaken: "",
                      Quantity: this.state.thirdDoseQuantity,
                      Reason: this.state.takeFor,
                      Strength: this.state.tabStrength,
                      Tabletname: this.state.tabName,
                      WhenToTake: this.state.takenWithFood,
                    },
                    invokeApp: false,
                    priority: "high",
                    actions: ["Skip", "Snooze", "Take"],
                    messageId: "google:message_id",
                    message:
                      "Take your " +
                      this.state.tabName +
                      " med at " +
                      this.state.thirdDoseTime, // (required)
                    date: this.state.thirdDoseAlrm, // in 60 secs
                    // vibration: 300,
                    vibrate: true,
                    // invokeApp: true,
                    priority: "high",
                    repeatType: "day",
                  });
                } else {
                  console.log(permission, "******permission**********");
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
              Strength: this.state.tabStrength,
            });

            Medicine_info.Dosestatus.push({
              Id: DoseStatusid,
              MedicationId: MedicationId,
              MedDoseId: Doseid,
              TakenTime: this.state.thirdDoseTime,
              TakenDate: this.state.startDate,
              SkipReason: "",
              IsTaken: "",
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
          Doseinfo: [],
        });

        for (let i = 0; i < this.state.doseCount; i++) {
          Doseid = realm.objects(DOSE_INFO).length + 1;
          DoseStatusid = realm.objects(DOSE_STATUS).length + 1;
          if (i == 0) {
            if (Startdate <= this.state.endDate) {
              PushNotification.checkPermissions((permission) => {
                if (permission) {
                  PushNotification.localNotificationSchedule({
                    channelId: "sound-channel-id", // (required)
                    title: "Hi,it's time for your medication ",
                    // data: {
                    //   Type: 'Local Notifaction',
                    //   DoseInfo_Id: DoseStatusid,
                    //   MedicationId: MedicationId,
                    //   DoseInfo_MedicationId: Doseid,
                    //   Dosetime: this.state.firstDose,
                    //   Time: this.state.firstDoseTime,
                    //   TakenTime: this.state.firstDoseTime,
                    //   TakenDate: this.state.startDate,
                    // },
                    data: {
                      Type: "Local Notifaction",
                      DoseInfo_Id: DoseStatusid,
                      MedicationId: MedicationId,
                      DoseInfo_MedicationId: Doseid,
                      Dosetime: this.state.firstDose,
                      Time: this.state.firstDoseTime,
                      TakenTime: this.state.firstDoseTime,
                      TakenDate: this.state.startDate,
                      IsTaken: "",
                      Quantity: this.state.firstDoseQuantity,
                      Reason: this.state.takeFor,
                      Strength: this.state.tabStrength,
                      Tabletname: this.state.tabName,
                      WhenToTake: this.state.takenWithFood,
                    },
                    invokeApp: false,
                    priority: "high",
                    actions: ["Skip", "Snooze", "Take"],
                    messageId: "google:message_id",
                    message:
                      "Take your " +
                      this.state.tabName +
                      " med at " +
                      this.state.firstDoseTime, // (required)
                    date: this.state.firstDoseAlrm, // in 60 secs
                    // vibration: 300,
                    vibrate: true,

                    priority: "high",
                    repeatType: "day",
                  });
                } else {
                  console.log(permission, "******permission**********");
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
              Strength: this.state.tabStrength,
            });

            Medicine_info.Dosestatus.push({
              Id: DoseStatusid,
              MedicationId: MedicationId,
              MedDoseId: Doseid,
              TakenTime: this.state.firstDoseTime,
              TakenDate: this.state.startDate,
              SkipReason: "",
              IsTaken: "",
            });
          } else if (i == 1) {
            if (Startdate <= this.state.endDate) {
              PushNotification.checkPermissions((permission) => {
                if (permission) {
                  PushNotification.localNotificationSchedule({
                    channelId: "sound-channel-id", // (required)
                    title: "Hi,it's time for your medication ",
                    data: {
                      Type: "Local Notifaction",
                      DoseInfo_Id: DoseStatusid,
                      MedicationId: MedicationId,
                      DoseInfo_MedicationId: Doseid,
                      Dosetime: this.state.secondDose,
                      Time: this.state.secondDoseTime,
                      TakenTime: this.state.secondDoseTime,
                      TakenDate: this.state.startDate,
                      IsTaken: "",
                      Quantity: this.state.secondDoseQuantity,
                      Reason: this.state.takeFor,
                      Strength: this.state.tabStrength,
                      Tabletname: this.state.tabName,
                      WhenToTake: this.state.takenWithFood,
                    },
                    invokeApp: false,
                    priority: "high",
                    actions: ["Skip", "Snooze", "Take"],
                    messageId: "google:message_id",
                    message:
                      "Take your " +
                      this.state.tabName +
                      " med at " +
                      this.state.secondDoseTime, // (required)
                    date: this.state.secondDoseAlrm, // in 60 secs
                    vibration: 300,
                    vibrate: true,

                    priority: "high",
                    repeatType: "day",
                  });
                } else {
                  console.log(permission, "******permission**********");
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
              Strength: this.state.tabStrength,
            });

            Medicine_info.Dosestatus.push({
              Id: DoseStatusid,
              MedicationId: MedicationId,
              MedDoseId: Doseid,
              TakenTime: this.state.firstDoseTime,
              TakenDate: this.state.startDate,
              SkipReason: "",
              IsTaken: "",
            });
          } else if (i == 2) {
            if (Startdate <= this.state.endDate) {
              PushNotification.checkPermissions((permission) => {
                if (permission) {
                  PushNotification.localNotificationSchedule({
                    channelId: "sound-channel-id", // (required)
                    title: "Hi,it's time for your medication ",
                    // data: {
                    //   Type: 'Local Notifaction',
                    //   DoseInfo_Id: DoseStatusid,
                    //   MedicationId: MedicationId,
                    //   DoseInfo_MedicationId: Doseid,
                    //   Dosetime: this.state.firstDose,
                    //   Time: this.state.firstDoseTime,
                    //   TakenTime: this.state.firstDoseTime,
                    //   TakenDate: this.state.startDate,
                    // },
                    data: {
                      Type: "Local Notifaction",
                      DoseInfo_Id: DoseStatusid,
                      MedicationId: MedicationId,
                      DoseInfo_MedicationId: Doseid,
                      Dosetime: this.state.thirdDose,
                      Time: this.state.thirdDoseTime,
                      TakenTime: this.state.thirdDoseTime,
                      TakenDate: this.state.startDate,
                      IsTaken: "",
                      Quantity: this.state.thirdDoseQuantity,
                      Reason: this.state.takeFor,
                      Strength: this.state.tabStrength,
                      Tabletname: this.state.tabName,
                      WhenToTake: this.state.takenWithFood,
                    },
                    invokeApp: false,
                    priority: "high",
                    actions: ["Skip", "Snooze", "Take"],
                    messageId: "google:message_id",
                    message:
                      "Take your " +
                      this.state.tabName +
                      " med at " +
                      this.state.thirdDoseTime, // (required)
                    date: this.state.thirdDoseAlrm, // in 60 secs
                    // vibration: 300,
                    vibrate: true,

                    priority: "high",
                    repeatType: "day",
                  });
                } else {
                  console.log(permission, "******permission**********");
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
              Strength: this.state.tabStrength,
            });

            Medicine_info.Dosestatus.push({
              Id: DoseStatusid,
              MedicationId: MedicationId,
              MedDoseId: Doseid,
              TakenTime: this.state.firstDoseTime,
              TakenDate: this.state.startDate,
              SkipReason: "",
              IsTaken: "",
            });
          }
        }
      });
    }

    //realm.close();
    console.log(
      "Medication taken food REALM PATH================",
      Realm.defaultPath
    );
    this.setState({ isLoading: false }, () => {});
  }

  saveData = async () => {
    console.log("******medication taken food  ********");
    try {
      this.setState({ isLoading: true }, () => {
        this.SaveMedicationData();
        // this.props.navigation.navigate('MedicationPermission', {
        //   refresh: 'refresh',
        // });
        this.props.navigation.navigate("MedicationCalendrHome", {
          from: "refresh",
        });
      });

      //this.props.navigation.navigate('MedicationPermission',{refresh:'refresh'})
    } catch (e) {}
  };

  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  render() {
    const { StatusBarManager } = NativeModules;
    const STATUSBAR_HEIGHT =
      Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;
    console.log("statusheight===", StatusBarManager.HEIGHT);

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
                marginTop: 5,
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
                  justifyContent: "center",
                  alignSelf: "center",
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
                backgroundColor: "transparent",
              }}
            >
              <Image
                source={require("../../icons/all-pages-icon.png")}
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
                  marginRight: 15,
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
              marginTop: 20,
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
                    marginLeft: 25,
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
                    marginTop: 10,
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
                    marginLeft: 25,
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
                    marginTop: 10,
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
                    marginLeft: 25,
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
                    marginTop: 10,
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
                    marginLeft: 25,
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
                    marginTop: 10,
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
                    marginLeft: 25,
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
                    marginTop: 10,
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
                    marginLeft: 25,
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
                    marginTop: 10,
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
                    marginLeft: 25,
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
                    marginTop: 10,
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
                    marginLeft: 25,
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
                    marginTop: 10,
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
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={{
                height: 60,
                marginBottom: 0,
                backgroundColor: "white",
                flexDirection: "row-reverse",
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
                  marginRight: 20,
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
                flexDirection: "row-reverse",
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
                  marginLeft: 20,
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
    flexDirection: "column",
  },

  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    marginLeft: 5,
    justifyContent: "center",
    backgroundColor: "white",
  },

  Separator: {
    height: 0.5,
    backgroundColor: "gray",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10,
  },
  loginText: {
    color: "#2e62ae",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
});
