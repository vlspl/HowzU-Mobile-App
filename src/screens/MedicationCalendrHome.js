import React from "react";
import {
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
  ScrollView
} from "react-native";
import { Container, Header } from "native-base";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import ActionButton from "react-native-action-button";
//import CalendarStrip from 'react-native-slideable-calendar-strip';
import CalendarStrip from "react-native-calendar-strip";
import Toast from "react-native-tiny-toast";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import DateTimePicker from "react-native-modal-datetime-picker";

import axios from "axios";
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
import Modal from "react-native-modal";
import Rediobutton from "../appComponents/Rediobutton";
import DatePicker from "react-native-datepicker";
import PushNotification from "react-native-push-notification";
const Realm = require("realm");
// let realm = new Realm({ schema: [medicineInfo, doseInfo, doseStatus] });

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

export default class MedicationCalendrHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activebtn: "doctor",
      userrole: "",
      isLoading: false,
      realm: null,
      medicationInfo: [],
      selectedDate: "",
      selectedDoseDate: "",
      isModalVisible: false,
      doseInfo: [],
      onPressPopup: "",
      dosetime: "",
      isnotif: false,
      isShowDataPicker: false,
      istaken: false,
      notificationdata: [],
      delindex: "",
      meduserName: ""
    };
  }

  //For Android

  onChange = (event, selectedDate) => {
    // console.log(selectedDate, '@@@@@selected for First Dose Medication Date');
    if (event.type == "set") {
      const currentDate = selectedDate;
      let selctedtime = moment(currentDate).format("DD-MM-YYYY hh:mm:ss");

      let formatdate = moment(currentDate).format("hh:mm A");
      // .replace(/\-/g, '/');
      // console.log(selctedtime, '************', selectedDate);
      this.setState(
        {
          isShowDataPicker: false,
          dosetime: formatdate,
          isModalVisible: false
        },
        () => {
          this.TakeMedicineReason("3");
        }
      );
    } else {
      this.setState({
        isShowDataPicker: false,
        firstDoseAlrm: selectedDate,
        dosetime: formatdate,
        doseDuration: "Set end date"
      });
    }
  };

  renderDatePicker = () => {
    return (
      <>
        {Platform.OS === "ios"
          ? "ios"
          : "android" && (
              <RNDateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                mode="time"
                is24Hour={false}
                display="default"
                // minimumDate={new Date()}
                // maximumDate={new Date('12/10/2021')}
                onChange={this.onChange}
              />
            )}
      </>
    );
  };

  showDateTimePicker = () => {
    this.setState({ isShowDataPicker: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isShowDataPicker: false });
  };

  handleDatePicked = (date) => {
    let formatdate = moment(date).format("hh:mm A");
    this.setState(
      {
        isShowDataPicker: false,
        dosetime: formatdate,
        isModalVisible: false
      },
      () => {
        this.TakeMedicineReason("3");
      }
    );

    this.hideDateTimePicker();
  };
  renderModalPicekr = () => {
    return (
      <DateTimePicker
        isVisible={this.state.isShowDataPicker}
        onConfirm={this.handleDatePicked}
        onCancel={this.hideDateTimePicker}
        mode="time"
        //  isDarkModeEnabled={true}
      />
    );
  };
  OpenDrawer = () => {
    this.props.navigation.openDrawer();
  };

  onDateSelected = (date) => {
    console.log(" onDateSelected ==============================", date);

    // this.setState({ selectedDate: date.format('YYYY-MM-DD')});
    this.setState(
      {
        selectedDate: date.format("YYYY-MM-DD"),
        selectedDoseDate: date.format("DD-MM-YYYY").toString(),
        medicationInfo: [],
        isLoading: true
      },
      () => {
        this.FetchMedicationData();
      }
    );
  };

  async FetchMedicationData() {
    console.log(Realm.defaultPath);
    // this.props.navigation.setParams({ from: null, data: null });

    // console.log(
    //   " FetchMedicationData ==============================",
    //   this.state.selectedDate
    // );
    // this.setState({
    //   medicationInfo: [],
    // });

    // let medication = realm.objects(MEDICINE_INFO);
    // console.log(JSON.stringify(medication), "*******Medication Saved into DB");

    // let tempMedicationInfo = medication.filtered(
    //   "Startdate<= $0 && (Enddate >= $0||Enddate==null)",
    //   this.state.selectedDate,
    //   this.state.selectedDate
    // );
    // console.log(
    //   " Condtional fetching data medication",
    //   tempMedicationInfo,
    //   "date from ==",
    //   this.state.selectedDate
    // );

    let temparray = [];
    let data = [];

    // tempMedicationInfo.map((item) => {
    //   console.log(item, "****^^^^mapping hte data ");
    //   item.Doseinfo.map((subitem) => {
    //     let temp = {};
    //     console.log(subitem, "subitems");
    //     temp.MedicationId = item.Id;
    //     temp.Tabletname = item.Tabletname;
    //     temp.Startdate = item.Startdate;
    //     temp.Enddate = item.Enddate;
    //     temp.Reason = item.Reason;
    //     temp.DoseTime = subitem.Dosetime;
    //     temp.Time = subitem.Time;
    //     temp.WhenToTake = subitem.WhenToTake;
    //     temp.Quantity = subitem.Quantity;
    //     temp.Strength = subitem.Strength;
    //     temp.DoseInfo_Id = subitem.Id;
    //     temp.DoseInfo_MedicationId = subitem.MedicationId;
    //     temparray.push(temp);
    //   });
    // });
    // temparray.forEach((element) => {
    //   let doseSatus = realm.objects(DOSE_STATUS);
    //   let doseSatusInfo = doseSatus.filtered(
    //     "MedicationId == $0 && MedDoseId == $1 && TakenDate == $2",
    //     element.DoseInfo_MedicationId,
    //     element.DoseInfo_Id,
    //     this.state.selectedDoseDate
    //   );

    //   if (doseSatusInfo.length <= 0) {
    //     element.IsTaken = "";
    //   } else {
    //     element.IsTaken = doseSatusInfo[0].IsTaken;
    //   }
    // });

    // temparray = temparray.reduce((acc, d) => {
    //   const found = acc.find((a) => a.Time === d.Time);
    //   const value = {
    //     DoseTime: d.DoseTime,
    //     IsTaken: d.IsTaken,
    //     Enddate: d.Enddate,
    //     Quantity: d.Quantity,
    //     Reason: d.Reason,
    //     Startdate: d.Startdate,
    //     Strength: d.Strength,
    //     Tabletname: d.Tabletname,
    //     Time: d.Time,
    //     MedicationId: d.MedicationId,
    //     DoseInfo_Id: d.DoseInfo_Id,
    //     DoseInfo_MedicationId: d.DoseInfo_MedicationId,
    //     WhenToTake: d.WhenToTake,
    //   };
    //   if (!found) {
    //     acc.push({ Time: d.Time, data: [value] });
    //   } else {
    //     found.data.push(value);
    //   }
    //   return acc;
    // }, []);

    try {
      let response = await axios.post(Constants.GET_MEDICATIONDATA, {
        DoseDate: moment(this.state.selectedDate, "YYYY-MM-DD").format(
          "MM-DD-YYYY"
        )
      });
      this.setState({
        isLoading: false
      });
      if (response.data.Status) {
        let temp = {};
        let temp1 = {};
        let name = [];
        let uniquenames = [];
        let color = "";
        let splitname;

        response.data.medicineDetails.map((item) => {
          console.log(item, "infetch data ");
          // name.push(item.ForWhome);
          // let find = name.find((nm) => nm == item.ForWhome);
          // console.log(find, "///////", name);
          // if (uniquenames.find((nm) => nm.name == item.ForWhome)) {
          //   // console.log("aftr finding ", item);
          //   console.log(uniquenames, "<><><><><>name////////", name);
          //   // name.push(temp);
          //   //    uniquenames.push(nm);
          // } else {
          //   console.log("in else partfinding =====", item);
          //   color = this.generateColor();
          //   temp.name = item.ForWhome;
          //   temp.color = this.generateColor();
          //   uniquenames.push(temp);
          //   name.push(temp);
          // }
          // splitname = item.ForWhome.split(" ");

          const value = {
            DoseTime: item.doseTime,
            IsTaken: item.MedicationStatus != "" ? item.MedicationStatus : "",

            Reason: item.MedicineFor,
            Startdate: item.medStartDate,

            Tabletname: item.Medicinename,
            Time: item.doseTime,
            MedicationId: item.RemindermId,
            medDelteID: item.medicineMasterId
          };
          console.log(color, "color");
          temparray.push({
            Time: item.doseTime,
            name: item.ForWhome,
            colors: item.ColorCode,
            data: [value]
          });
        });
        console.log(name, "names ", "uniquenames", uniquenames);
        this.setState({
          medicationInfo: temparray,
          isLoading: false
        });
      } else {
        this.setState({
          medicationInfo: [],
          isLoading: false
        });
      }
    } catch (err) {
      this.setState({
        // medicationInfo: temparray,
        isLoading: false
      });
      console.log(err, "medication erro");
    }
    // this.setState({
    //   medicationInfo: temparray,
    //   isLoading: false,
    // });
  }

  fetchDataforNotificaton = async () => {
    // let id = this.state.notificationdata.notification.data.MedicationId;
    //this id is for remote

    // {"ID": "2416", "Type": "Local Notification", "delivered_priority": "high", "priority": "high", "remote": "true"}
    //when the app was open LOG  ****** {"ID": "2416", "Type": "Local Notification", "delivered_priority": "high", "priority": "high", "remote": "true"}

    //kiiled state
    //{"data": {"ID": "2416", "Type": "Local Notification", "collapse_key": "com.howzu", "delivered_priority": "high", "from": "510234675595", "google.delivered_priority": "normal", "google.message_id": "0:1641465576877099%3b8d58de3b8d58de", "google.original_priority": "normal", "google.sent_time": 1641465576863, "google.ttl": 2419200, "priority": "high", "remote": "true"}}
    console.log("******", this.state.notificationdata, "notification data");
    let id = this.state.notificationdata.data.ID;
    console.log(id, "id =====");
    // this.props.navigation.setParams({ from: null, data: null });

    // let medication = realm.objects(MEDICINE_INFO);

    // console.log(id, "&&&****(*(*((id   ");
    // let filterdata = medication.filtered(
    //   "Startdate<= $0 && (Enddate >= $0||Enddate==null)&&Id=" + id,
    //   this.state.selectedDate,
    //   this.state.selectedDate
    // );
    // let temparray = [];
    // filterdata.map((dosedata) => {
    //   console.log(dosedata, "/////*****");
    //   dosedata.Doseinfo.map((subitem) => {
    //     let temp = {};
    //     console.log(subitem, "****&&&&&***&*&*&*");
    //     temp.MedicationId = dosedata.Id;
    //     temp.Tabletname = dosedata.Tabletname;
    //     temp.Startdate = dosedata.Startdate;
    //     temp.Enddate = dosedata.Enddate;
    //     temp.Reason = dosedata.Reason;
    //     temp.DoseTime = subitem.Dosetime;
    //     temp.Time = subitem.Time;
    //     temp.WhenToTake = subitem.WhenToTake;
    //     temp.Quantity = subitem.Quantity;
    //     temp.Strength = subitem.Strength;
    //     temp.DoseInfo_Id = subitem.Id;

    //     temparray.push(temp);
    //   });
    // });

    // temparray.forEach((element) => {
    //   let doseSatus = realm.objects(DOSE_STATUS);
    //   let doseSatusInfo = doseSatus.filtered(
    //     "MedicationId == $0 && MedDoseId == $1 && TakenDate == $2",
    //     element.DoseInfo_MedicationId,
    //     element.DoseInfo_Id,
    //     this.state.selectedDoseDate
    //   );

    //   if (doseSatusInfo.length <= 0) {
    //     element.IsTaken = "";
    //   } else {
    //     element.IsTaken = doseSatusInfo[0].IsTaken;
    //   }
    // });

    let data = [];
    let temparray = [];
    const value = {};
    // data.IsTaken = temparray[0].IsTaken;

    // (data.Enddate = temparray[0].Enddate),
    //   (data.Quantity = temparray[0].Quantity),
    //   (data.Reason = temparray[0].Reason),
    //   (data.Startdate = temparray[0].Startdate),
    //   (data.Strength = temparray[0].Strength),
    //   (data.Tabletname = temparray[0].Tabletname),
    //   (data.Time = temparray[0].Time),
    //   (data.MedicationId = temparray[0].MedicationId),
    //   (data.DoseInfo_Id = temparray[0].DoseInfo_Id),
    //   (data.DoseInfo_MedicationId = temparray[0].DoseInfo_MedicationId),
    //   (data.WhenToTake = temparray[0].WhenToTake);

    try {
      let response = await axios.post(Constants.GET_MEDICATIONDATA, {
        DoseDate: moment(this.state.selectedDate, "YYYY-MM-DD").format(
          "MM-DD-YYYY"
        )
      });
      console.log(response.data, "fetching from backed data");
      this.setState({
        isLoading: false,
        isModalVisible: true
      });
      if (response.data.Status) {
        let temp = {};
        let temp1 = {};

        let result = response.data.medicineDetails.filter((_id) => {
          console.log(_id.RemindermId == id, "matching the data");
          return _id.RemindermId == id;
        });
        console.log(
          "???????",
          result,
          "filtering from backed baased on the id"
        );

        (value.DoseTime = result[0].doseTime),
          (value.IsTaken =
            result[0].MedicationStatus != "" ? result[0].MedicationStatus : ""),
          (value.Reason = result[0].MedicineFor),
          (value.Startdate = result[0].medStartDate),
          (value.Tabletname = result[0].Medicinename),
          (value.Time = result[0].doseTime),
          (value.MedicationId = result[0].RemindermId),
          (value.medDelteID = result[0].medicineMasterId);
        value.meduserName = result[0].ForWhome;
        console.log(value, "value after filtering");
        // this.setState({
        //   doseInfo: [value],
        //   isLoading: false,
        // });
        this.setState({
          doseInfo: value,
          onPressPopup: "dose",
          isLoading: false
        });
      } else {
        this.setState({
          doseInfo: value,
          onPressPopup: "dose",
          isLoading: false
        });
      }
    } catch (err) {
      console.log(err, "medication erro");
      this.setState({
        doseInfo: [],
        onPressPopup: "dose",
        isLoading: false
      });
    }
  };
  componentDidMount = () => {
    let self = this;

    console.log(
      "Component Did MOunt ****************Medication Calendar Home****************",
      this.props.route.params
    );
    //notifcation
    if (this.props.route.params.from == "notifcation") {
      this.setState(
        {
          isLoading: true,
          // isModalVisible: true,
          // doseInfo: this.props.route.params.data,
          notificationdata: this.props.route.params.data,
          onPressPopup: "dose",
          selectedDate: moment(new Date(), " YYYY-MM-DDTHH: mm: ss").format(
            "YYYY-MM-DD"
          ),
          selectedDoseDate: moment(new Date(), "YYYY-MM-DDTHH: mm: ss")
            .format("DD-MM-YYYY")
            .toString()
        },
        () => {
          this.props.navigation.setParams({ from: null, data: null });

          this.fetchDataforNotificaton();
        }
      );
    } else {
      this.setState(
        {
          selectedDate: moment(new Date(), " YYYY-MM-DDTHH: mm: ss").format(
            "YYYY-MM-DD"
          ),
          medicationInfo: [],
          isLoading: true,
          selectedDoseDate: moment(new Date(), "YYYY-MM-DDTHH: mm: ss")
            .format("DD-MM-YYYY")
            .toString()
        },
        () => {
          this.FetchMedicationData();
        }
      );
    }
  };

  componentWillUnmount = () => {
    this.setState({
      activebtn: "doctor",
      userrole: "",
      isLoading: false,
      realm: null,
      medicationInfo: [],
      selectedDate: "",
      selectedDoseDate: "",
      isModalVisible: false,
      doseInfo: [],
      onPressPopup: "",
      dosetime: "",
      isnotif: false,
      isShowDataPicker: false,
      istaken: false,
      notificationdata: []
    });
  };
  UNSAFE_componentWillReceiveProps = (nextProp) => {
    console.log(
      " Unsafe componentWillReceiveProps==============================",
      nextProp.route.params.data
    );
    if (nextProp.route.params.from == "notifcation") {
      this.setState(
        {
          isLoading: true,
          // isModalVisible: true,
          notificationdata: nextProp.route.params.data,
          onPressPopup: "dose",
          loading: true,
          selectedDate: moment(new Date(), " YYYY-MM-DDTHH: mm: ss").format(
            "YYYY-MM-DD"
          ),
          selectedDoseDate: moment(new Date(), "YYYY-MM-DDTHH: mm: ss")
            .format("DD-MM-YYYY")
            .toString()
        },
        () => {
          nextProp.navigation.setParams({ from: null, data: null });
          this.fetchDataforNotificaton();
        }
      );
    } else {
      this.setState(
        {
          selectedDate: moment(new Date(), " YYYY-MM-DDTHH: mm: ss").format(
            "YYYY-MM-DD"
          ),
          medicationInfo: [],
          isLoading: true,
          selectedDoseDate: moment(new Date(), "YYYY-MM-DDTHH: mm: ss")
            .format("DD-MM-YYYY")
            .toString()
        },
        () => {
          this.FetchMedicationData();
        }
      );
    }
  };
  componentWillUnmount() {
    // Close the realm if there is one open.
    // const {realm} = this.state;
    if (realm !== null && !realm.isClosed) {
      realm.close();
    }
  }
  ClosePOPup = () => {
    // console.log("ClosePOPup=================");
    this.setState({ isModalVisible: false, isnotif: false }, () => {});
  };

  TakeMedicine = () => {
    let selectdate = moment(
      this.state.selectedDate,
      "YYYY-MM-DDTHH: mm: ss"
    ).format("DD-MM-YYYY");
    // console.log("selectdate=================", typeof selectdate);
    this.setState(
      {
        istaken: true,
        isModalVisible: true,
        // isModalVisible: false,
        onPressPopup: "take",
        isnotif: false,
        selectedDoseDate: moment(
          this.state.selectedDate,
          "YYYY-MM-DDTHH: mm: ss"
        )
          .format("DD-MM-YYYY")
          .toString()
      },
      () => {}
    );
  };

  SkipMedicine = () => {
    // console.log("SkipMedicine=================");
    this.setState(
      { isModalVisible: true, onPressPopup: "skip", isnotif: false },
      () => {
        // this.SkipMedicineReason();
      }
    );
  };

  SkipMedicineReason = async (reason) => {
    // console.log("SkipMedicineReason=================", reason);
    this.setState({ isModalVisible: false, onPressPopup: "skip" }, () => {});
    var skipreason = "";
    if (reason == "1") {
      skipreason = "Skipped med isn't near me";
    } else if (reason == "2") {
      skipreason = "Skipped Forgot/Busy/Asleep";
    } else if (reason == "3") {
      skipreason = "Skipped Ran out of the med";
    } else if (reason == "4") {
      skipreason = " Skipped Dont need to take this dose";
    } else if (reason == "5") {
      skipreason = " Skipped side effect";
    } else if (reason == "6") {
      skipreason = " Skipped Worried about the cost";
    } else if (reason == "7") {
      skipreason = "Skipped other reason";
    }

    // let doseSatus = realm.objects(DOSE_STATUS);
    try {
      let response = await axios.post(Constants.UPDATE_MEDICINE_STATUS, {
        RemidermId: this.state.doseInfo.MedicationId,
        MedicationStatus: "U",
        MedStatus: skipreason
      });
      // console.log(response.data, "fetching from backed data");
      this.setState({
        isLoading: false
      });
      if (response.data.Status) {
      } else {
      }
    } catch (err) {
      console.log(err, "medication erro");
    }
    // let doseSatusINFO = doseSatus.filtered(
    //   "MedicationId == $0 && MedDoseId == $1 && TakenDate == $2",
    //   this.state.doseInfo.MedicationId,
    //   this.state.doseInfo.DoseInfo_Id,
    //   this.state.selectedDoseDate
    // );
    // console.log(
    //   " skip doseSatusInfo ==============================",
    //   doseSatusINFO
    // );
    // Add persons and their cars
    // if (doseSatusINFO.length <= 0) {
    //   realm.write(() => {
    //     DoseStatusid = realm.objects(DOSE_STATUS).length + 1;
    //     const Medicine_info = realm.create(DOSE_STATUS, {
    //       Id: DoseStatusid,
    //       MedicationId: this.state.doseInfo.MedicationId,
    //       MedDoseId: this.state.doseInfo.DoseInfo_Id,
    //       TakenTime: "",
    //       TakenDate: this.state.selectedDoseDate,
    //       SkipReason: skipreason,
    //       IsTaken: "skipped",
    //     });
    //   });
    // } else {
    //   realm.write(() => {
    //     // DoseStatusid = realm.objects(DOSE_STATUS).length + 1
    //     //doseSatusINFO[0].Id = DoseStatusid;
    //     doseSatusINFO[0].TakenDate = this.state.selectedDoseDate;
    //     doseSatusINFO[0].IsTaken = "skipped";
    //     doseSatusINFO[0].TakenTime = "";
    //     doseSatusINFO[0].MedicationId = this.state.doseInfo.MedicationId;
    //     doseSatusINFO[0].MedDoseId = this.state.doseInfo.DoseInfo_Id;
    //     doseSatusINFO[0].SkipReason = skipreason;
    //   });
    // }

    this.FetchMedicationData();
  };

  TakeMedicineReason = async (reason) => {
    // console.log("///////TakeMedicineReason=================", reason);

    // console.log(
    //   "this.state.doseInfo.DoseInfo_Id=================",
    //   this.state.doseInfo.MedicationId
    // );
    // console.log(
    //   'this.state.selectedDoseDate=================',
    //   this.state.selectedDoseDate
    // );

    var takentime = "";
    if (reason == "1") {
      takentime = "Taken On time (" + this.state.doseInfo.Time + ")";
      this.setState(
        {
          isModalVisible: false,
          onPressPopup: "take",
          isnotif: false,
          istaken: true
        },
        () => {}
      );
    } else if (reason == "2") {
      takentime = "Taken Now " + moment(new Date()).format("hh:mm A");
      this.setState(
        {
          isModalVisible: false,
          onPressPopup: "take",
          isnotif: false,
          istaken: true
        },
        () => {}
      );
    } else if (reason == "3") {
      takentime = "Taken On (" + this.state.dosetime + ")";
      this.setState(
        { isModalVisible: false, onPressPopup: "take", isnotif: false },
        () => {}
      );
    }

    // let doseSatus = realm.objects(DOSE_STATUS);
    // let doseSatusInfo = doseSatus.filtered(
    //   "MedicationId == $0 && MedDoseId == $1 && TakenDate == $2",
    //   this.state.doseInfo.MedicationId,
    //   this.state.doseInfo.DoseInfo_Id,
    //   this.state.selectedDoseDate
    // );

    try {
      let response = await axios.post(Constants.UPDATE_MEDICINE_STATUS, {
        RemidermId: this.state.doseInfo.MedicationId,
        MedicationStatus: "U",
        MedStatus: takentime
      });
      console.log(response.data, "===after take fetching from backed data");
      this.setState({
        isLoading: false
      });
      if (response.data.Status) {
      } else {
      }
    } catch (err) {
      console.log(err, "medication erro");
    }
    // if (doseSatusInfo.length <= 0) {
    //   realm.write(() => {
    //     DoseStatusid = realm.objects(DOSE_STATUS).length + 1;
    //     const Medicine_info = realm.create(DOSE_STATUS, {
    //       Id: DoseStatusid,
    //       MedicationId: this.state.doseInfo.MedicationId,
    //       MedDoseId: this.state.doseInfo.DoseInfo_Id,
    //       TakenTime: takentime,
    //       TakenDate: this.state.selectedDoseDate,
    //       SkipReason: "taken",
    //       IsTaken: "taken",
    //     });
    //   });
    // } else {
    //   realm.write(() => {
    //     doseSatusInfo[0].TakenDate = this.state.selectedDoseDate;
    //     doseSatusInfo[0].IsTaken = "taken";
    //     doseSatusInfo[0].TakenTime = takentime;
    //     doseSatusInfo[0].MedicationId = this.state.doseInfo.MedicationId;
    //     doseSatusInfo[0].MedDoseId = this.state.doseInfo.DoseInfo_Id;
    //     doseSatusInfo[0].SkipReason = "taken";
    //   });
    // }

    this.FetchMedicationData();
  };

  DeleteMedicationRecords = async (delnum, index) => {
    let med = this.state.medicationInfo[index];
    let id;
    let MedicationStatus;
    if (delnum == 1) {
      id = med.data[0].MedicationId;
      MedicationStatus = "D";
      this.setState(
        {
          isModalVisible: false
        },
        () => {}
      );
    } else {
      id = med.data[0].medDelteID;
      MedicationStatus = "DM";
      this.setState(
        {
          isModalVisible: false
        },
        () => {}
      );
    }

    try {
      let response = await axios.post(Constants.UPDATE_MEDICINE_STATUS, {
        RemidermId: id,
        MedicationStatus: MedicationStatus,
        MedStatus: ""
      });
      this.setState({ isLoading: false });
      if (response.data.Status) {
        this.setState({ isLoading: true });
        Toast.show(response.data.Msg);
        this.FetchMedicationData();
      } else {
        Toast.show(response.data.Msg);
        this.FetchMedicationData();
      }
    } catch (errors) {
      ///Toast.show(errors)
      Toast.show("Something Went Wrong, Please Try Again Later");

      console.log(errors);
    }
  };
  AddMedication = () => {
    //Alert.alert(item.key,item.title);
    // console.log('AddMedication=================');
    // this.props.navigation.navigate("MedicationTabName");

    this.props.navigation.navigate("MedicatnForSelforOther");
  };

  OnPressDoseInfo = (subitem, index, name) => {
    console.log(
      "********Sub item Dose info on press=================",
      subitem,
      index
    );
    let data = this.state.medicationInfo[index];
    let temp = {};
    temp.DoseTime = subitem.DoseTime;
    temp.IsTaken = subitem.IsTaken;
    temp.MedicationId = subitem.MedicationId;
    temp.Reason = subitem.Reason;
    temp.Startdate = subitem.Startdate;
    temp.Tabletname = subitem.Tabletname;
    temp.Time = subitem.Time;
    temp.medDelteID = subitem.medDelteID;
    temp.meduserName = name;
    console.log(data, "/////////");
    if (subitem.IsTaken == "") {
      this.setState(
        {
          isModalVisible: true,
          doseInfo: temp,
          // doseInfo: subitem,
          onPressPopup: "dose"
        },
        () => {}
      );
    }
  };

  generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
    // console.log(randomColor, "/////");
    return `#${randomColor}`;
  };
  render() {
    const { StatusBarManager } = NativeModules;
    const STATUSBAR_HEIGHT =
      Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;
    console.log("==={}{}medicationInfo===", this.state.doseInfo.meduserName);

    const screenWidth = Math.round(Dimensions.get("window").width);

    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <StatusBarPlaceHolder />

        {this.state.onPressPopup == "dose" ? (
          <Modal
            isVisible={this.state.isModalVisible}
            style={{ margin: 0 }}
            onBackdropPress={() => this.setState({ isModalVisible: false })}
          >
            <View
              style={{
                flexDirection: "column",
                width: "80%",
                height: 260,
                backgroundColor: "white",
                alignSelf: "center",
                borderRadius: 5
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",

                  // marginRight: 10,
                  // justifyContent: "space-evenly",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    flex: 1,
                    alignSelf: "center",
                    justifyContent: "center",
                    marginTop: 10
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: 16,
                      margin: 8,
                      marginLeft: 18,
                      textAlign: "center",
                      fontWeight: "bold"
                    }}
                  >
                    {this.state.doseInfo.meduserName + "'s Medicine"}
                  </Text>
                </View>

                <View
                  style={{
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    // marginRight: 10,
                    alignSelf: "center"
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "column",
                      height: 20,
                      width: 20,
                      backgroundColor: "white",
                      marginRight: 20
                    }}
                    onPress={this.ClosePOPup}
                  >
                    <Image
                      source={require("../../icons/close.png")}
                      // source={require("../../icons/close_gray.png")}
                      style={{
                        height: 35,
                        width: 35
                        // marginTop: 10,
                        // marginLeft: 10
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 0
                }}
              >
                <Image
                  source={require("../../icons/medicine.png")}
                  style={{ height: 50, width: 50 }}
                />
              </View>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 10,
                  fontSize: 15,
                  fontWeight: "bold"
                }}
              >
                {this.state.doseInfo.Tabletname}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "white",
                  marginTop: 10,
                  marginLeft: 20,
                  marginRight: 20
                }}
              >
                <Image
                  source={require("../../icons/date-of-birth.png")}
                  style={{ height: 15, width: 15 }}
                />
                <Text
                  style={{
                    textAlign: "left",
                    marginLeft: 15,
                    color: "black",
                    fontSize: 14
                  }}
                >
                  {"Scheduled for " +
                    this.state.doseInfo.Time +
                    "," +
                    moment(this.state.selectedDate).format("MMM DD")}{" "}
                </Text>
              </View>
              {/* <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "white",
                  marginTop: 10,
                  marginLeft: 20,
                  marginRight: 20,
                }}
              >
                <Image
                  source={require("../../icons/medicine.png")}
                  style={{ height: 18, width: 18 }}
                />
                <Text
                  style={{
                    textAlign: "left",
                    marginLeft: 12,
                    color: "gray",
                    fontSize: 14,
                  }}
                >
                  {
                    // this.state.doseInfo.Strength + ", take Pill(s) "
                    // +
                    // this.state.doseInfo.WhenToTake
                  }
                </Text>
              </View> */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  backgroundColor: "white",
                  marginTop: 10,
                  marginLeft: 0,
                  marginRight: 0
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "column",
                    height: 65,
                    width: 50,
                    backgroundColor: "white"
                  }}
                  onPress={this.SkipMedicine}
                >
                  <Image
                    source={require("../../icons/Reject.png")}
                    style={{ height: 50, width: 50 }}
                  />
                  <Text style={{ textAlign: "center", fontSize: 12 }}>
                    Skip
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: "column",
                    height: 65,
                    width: 50,
                    backgroundColor: "white",
                    marginLeft: 30
                  }}
                  onPress={this.TakeMedicine}
                >
                  <Image
                    source={require("../../icons/aPPROVE.png")}
                    style={{ height: 50, width: 50 }}
                  />
                  <Text style={{ textAlign: "center", fontSize: 12 }}>
                    Take
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        ) : null}

        {this.state.onPressPopup == "skip" ? (
          <Modal
            isVisible={this.state.isModalVisible}
            style={{ margin: 0 }}
            onBackdropPress={() => this.setState({ isModalVisible: false })}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                flexDirection: "column",
                marginTop: 200,
                marginLeft: 0
              }}
            >
              <Text
                style={{
                  textAlign: "left",
                  marginTop: 10,
                  fontSize: 20,
                  marginLeft: 15,
                  marginBottom: 15,
                  fontWeight: "bold",
                  marginBottom: 10
                }}
              >
                Could you please indicate why you are skipping this dose?
              </Text>
              <View style={{ flex: 1, marginTop: 0 }}>
                <ScrollView showsVerticalScrollIndicator={true}>
                  <Rediobutton
                    onpress={() => this.SkipMedicineReason("1")}
                    buttonimg={require("../../icons/radio-off.png")}
                    gender="med isn't near me"
                  ></Rediobutton>
                  <Rediobutton
                    onpress={() => this.SkipMedicineReason("2")}
                    buttonimg={require("../../icons/radio-off.png")}
                    gender="Forgot/Busy/Asleep"
                  ></Rediobutton>
                  <Rediobutton
                    onpress={() => this.SkipMedicineReason("3")}
                    buttonimg={require("../../icons/radio-off.png")}
                    gender="Ran out of the med"
                  ></Rediobutton>
                  <Rediobutton
                    onpress={() => this.SkipMedicineReason("4")}
                    buttonimg={require("../../icons/radio-off.png")}
                    gender="Dont need to take this dose"
                  ></Rediobutton>
                  <Rediobutton
                    onpress={() => this.SkipMedicineReason("5")}
                    buttonimg={require("../../icons/radio-off.png")}
                    gender="side effect"
                  ></Rediobutton>
                  <Rediobutton
                    onpress={() => this.SkipMedicineReason("6")}
                    buttonimg={require("../../icons/radio-off.png")}
                    gender="Worried about the cost"
                  ></Rediobutton>
                  <Rediobutton
                    onpress={() => this.SkipMedicineReason("7")}
                    buttonimg={require("../../icons/radio-off.png")}
                    gender="Other"
                  ></Rediobutton>
                </ScrollView>
              </View>
            </View>
          </Modal>
        ) : null}

        {this.state.onPressPopup == "take" ? (
          <Modal
            isVisible={this.state.isModalVisible}
            style={{ margin: 0 }}
            onBackdropPress={() => this.setState({ isModalVisible: false })}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                flexDirection: "column",
                marginTop: 300,
                marginLeft: 0
              }}
            >
              <Text
                style={{
                  textAlign: "left",
                  marginTop: 10,
                  fontSize: 20,
                  marginLeft: 15,
                  marginBottom: 15,
                  fontWeight: "bold"
                }}
              >
                When did you take your meds?
              </Text>
              <Rediobutton
                onpress={() => this.TakeMedicineReason("1")}
                buttonimg={require("../../icons/radio-off.png")}
                gender={"On time (" + this.state.doseInfo.Time + ")"}
              ></Rediobutton>
              <Rediobutton
                onpress={() => this.TakeMedicineReason("2")}
                buttonimg={require("../../icons/radio-off.png")}
                gender={"Now " + moment(new Date()).format("hh:mm A")}
              ></Rediobutton>

              {/* <TouchableOpacity
                style={{
                  backgroundColor: "transparent",
                  marginTop: 0,
                  height: 30,
                  flexDirection: "row",
                  margin: 10,
                  justifyContent: "flex-start",
                }}
                onPress={() =>
                  this.setState({
                    isShowDataPicker: !this.state.isShowDataPicker,
                  })
                }
              >
                <Image
                  source={require("../../icons/radio-off.png")}
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: "transparent",
                    marginTop: 5,
                    resizeMode: "contain",
                  }}
                />

                <Text style={{ marginTop: 4, color: "gray", fontSize: 17 }}>
                  {"  "}
                  Pick extra time
                </Text>

                {this.state.isShowDataPicker && Platform.OS === "ios"
                  ? this.renderModalPicekr()
                  : null}

                {this.state.isShowDataPicker &&
                  Platform.OS === "android" &&
                  this.renderDatePicker()}
              </TouchableOpacity> */}
            </View>
          </Modal>
        ) : null}

        {this.state.onPressPopup == "del" ? (
          <Modal
            isVisible={this.state.isModalVisible}
            style={{ margin: 0 }}
            onBackdropPress={() => this.setState({ isModalVisible: false })}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                flexDirection: "column",
                marginTop: 300,
                marginLeft: 0
              }}
            >
              <Text
                style={{
                  textAlign: "left",
                  marginTop: 10,
                  fontSize: 20,
                  marginLeft: 15,
                  marginBottom: 15,
                  fontWeight: "bold"
                }}
              >
                Delete meds?
              </Text>
              <Rediobutton
                onpress={() =>
                  this.DeleteMedicationRecords("1", this.state.delindex)
                }
                buttonimg={require("../../icons/radio-off.png")}
                gender={"Only this dose"}
              ></Rediobutton>
              <Rediobutton
                onpress={() =>
                  this.DeleteMedicationRecords("2", this.state.delindex)
                }
                buttonimg={require("../../icons/radio-off.png")}
                gender={"All future doses "}
              ></Rediobutton>
            </View>
          </Modal>
        ) : null}
        <ImageBackground
          source={require("../../icons/home-bg.png")}
          style={{ width: screenWidth, height: 200, marginTop: 0 }}
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
                  source={require("../../icons/menu.png")}
                  style={{ marginLeft: 5, height: 32, width: 32 }}
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
                  alignSelf: "center"
                }}
              >
                Medication
              </Text>
              <TouchableOpacity
                style={{ marginRight: 8, height: 35, width: 35, marginTop: 5 }}
                onPress={() =>
                  this.props.navigation.navigate("MedicatnHistory")
                }
              >
                <Image
                  source={require("../../icons/medicalhistory.png")}
                  style={{ marginRight: 5, height: 30, width: 30 }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginRight: 8, height: 35, width: 35, marginTop: 5 }}
                onPress={() => this.props.navigation.navigate("Audio")}
              >
                <Image
                  source={require("../../icons/micheader.png")}
                  style={{ marginRight: 5, height: 30, width: 30 }}
                  // resizeMode="cover"
                />
              </TouchableOpacity>
            </View>

            <CalendarStrip
              scrollable
              style={{ height: 100, paddingTop: 0, paddingBottom: 10 }}
              calendarColor={"transparent"}
              calendarHeaderStyle={{ color: "white" }}
              headerText={moment(
                this.state.selectedDate,
                "YYYY-MM-DDTHH: mm: ss"
              ).format("DD MMM YY")}
              dateNumberStyle={{ color: "white" }}
              dateNameStyle={{ color: "white" }}
              iconContainer={{ flex: 0.05 }}
              daySelectionAnimation={{
                type: "border",
                duration: 200,
                borderWidth: 1,
                borderHighlightColor: "white"
              }}
              highlightDateNumberStyle={{ color: "yellow" }}
              highlightDateNameStyle={{ color: "yellow" }}
              onDateSelected={this.onDateSelected}
              selectedDate={new Date()}
              calendarHeaderPosition={"below"}
              calendarHeaderFormat={"DD MMM YY"}
              shouldAllowFontScaling={false}
              iconLeft={require("../../icons/back.png")}
              iconLeftStyle={{ height: 20, width: 40, color: "#fff" }}
              iconRight={require("../../icons/1.png")}
              iconRightStyle={{ height: 20, width: 40, color: "#fff" }}
            />
          </View>
        </ImageBackground>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            backgroundColor: "white",
            marginTop: 0
          }}
        >
          {this.state.medicationInfo.length <= 0 && !this.state.isLoading ? (
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                backgroundColor: "white",
                marginTop: 0,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Image
                source={require("../../icons/schedule-your-med.png")}
                style={{ height: 120, width: 120 }}
                resizeMode="cover"
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "normal",
                  textAlign: "center",
                  color: "gray",
                  marginTop: 10
                }}
              >
                Please schedule your medicine...
              </Text>
            </View>
          ) : null}
          <ScrollView>
            {this.state.medicationInfo.map((item, index) => {
              return (
                <View
                  style={{
                    flexDirection: "column",
                    marginBottom: 15,
                    marginLeft: 15,
                    marginRight: 15,
                    borderWidth: 1,
                    borderColor: "lightgray",
                    borderRadius: 5,
                    flex: 1
                  }}
                  key={index}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      borderColor: "lightgray",
                      flex: 1
                    }}
                  >
                    <View
                      style={{
                        borderRadius: 5,
                        flex: 1,
                        backgroundColor: item.colors,
                        marginTop: 10,
                        marginLeft: 10
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 16,
                          margin: 8,
                          marginLeft: 18,
                          textAlign: "center",
                          backgroundColor: item.colors,
                          // lineHeight: 40,
                          fontWeight: "bold"
                          // width: "60%",
                          // borderRadius: 1
                        }}
                      >
                        {item.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        alignContent: "flex-end",
                        justifyContent: "flex-end",
                        marginRight: 10,
                        marginTop: 0,
                        marginLeft: 1,
                        alignItems: "center",
                        flexDirection: "row",
                        flex: 1
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            isModalVisible: true,
                            onPressPopup: "del",
                            delindex: index
                          })
                        }
                      >
                        <Image
                          style={{
                            height: 30,
                            width: 30,
                            alignItems: "flex-end",
                            justifyContent: "flex-end",
                            alignSelf: "center"
                          }}
                          source={require("../../icons/delete.png")}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      borderColor: "lightgray"
                    }}
                  >
                    <Text
                      style={{
                        color: "blue",
                        fontSize: 16,
                        margin: 8,
                        marginLeft: 18
                      }}
                    >
                      {item.Time}
                    </Text>
                  </View>

                  {item.data.map((subitem, ind) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          this.OnPressDoseInfo(subitem, ind, item.name)
                        }
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            marginLeft: 18,
                            marginBottom: 8,
                            backgroundColor: "white",
                            margin: 2
                          }}
                          key={ind}
                        >
                          <Image
                            source={require("../../icons/capsule1.png")}
                            style={{ height: 20, width: 20 }}
                          />
                          {subitem.IsTaken == "" ? (
                            <View style={{ flexDirection: "row", flex: 1 }}>
                              <Text style={{ fontSize: 15, color: "gray" }}>
                                {
                                  subitem.Tabletname
                                  // +
                                  //   " " +
                                  //   subitem.Strength +
                                  //   " take " +
                                  //   subitem.Quantity +
                                  //   "Pills " +
                                  //   subitem.WhenToTake
                                }
                              </Text>
                            </View>
                          ) : (
                            <View style={{ flex: 1 }}>
                              <View style={{ flexDirection: "row", flex: 1 }}>
                                <Text style={{ fontSize: 15, color: "gray" }}>
                                  {
                                    subitem.Tabletname
                                    //  +
                                    //   " " +
                                    //   subitem.Strength +
                                    //   " take " +
                                    //   subitem.Quantity +
                                    //   "Pills " +
                                    //   subitem.WhenToTake
                                  }
                                </Text>
                              </View>

                              <View style={{ flexDirection: "row", flex: 1 }}>
                                <Text style={{ fontSize: 15, color: "black" }}>
                                  {"(" + subitem.IsTaken + ")"}
                                </Text>
                              </View>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })}
          </ScrollView>
        </View>

        <ActionButton buttonColor="#275BB4" onPress={this.AddMedication} />
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
  }
});
