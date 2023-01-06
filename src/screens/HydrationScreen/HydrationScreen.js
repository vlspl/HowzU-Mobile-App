import React, { Component } from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Modal as RNModal,
  ScrollView,
  Platform
} from "react-native";
import Toast from "react-native-tiny-toast";
import Modal from "../../appComponents/Modal/index";
import SettingsItemsRender from "../../appComponents/HydSettingsItemsRender";
import SettingModalRender from "../../appComponents/HydSettingModalRender";
import { Container } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import DateTimePicker from "react-native-modal-datetime-picker";
import Loader from "../../appComponents/loader";
import CustomeHeader from "../../appComponents/CustomeHeader";
import Constants from "../../utils/Constants";
import AsyncStorage from "@react-native-community/async-storage";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import axios from "axios";
import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale
} from "react-native-size-matters";
import moment from "moment";
import HydDailyRecords from "../../appComponents/HydDailyRecords";
import NoDataAvailable from "../../appComponents/NoDataAvailable";
import Graphdateinput from "../../appComponents/Graphdateinput";
import {
  BarChart,
  XAxis,
  YAxis,
  Grid,
  LineChart
} from "react-native-svg-charts";
import { Text as SvgText } from "react-native-svg";
const windowWidth = 100;
var today = new Date();
var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

var wightkg = [
  { label: "1" },
  { label: "2" },
  { label: "3" },
  { label: "4" },
  { label: "5" },
  { label: "6" },
  { label: "7" },
  { label: "8" },
  { label: "9" },
  { label: "10" },
  { label: "11" },
  { label: "12" },
  { label: "13" },
  { label: "14" },
  { label: "15" },
  { label: "16" },
  { label: "17" },
  { label: "18" },
  { label: "19" },
  { label: "20" },
  { label: "21" },
  { label: "22" },
  { label: "23" },
  { label: "24" },
  { label: "25" },
  { label: "26" },
  { label: "27" },
  { label: "28" },
  { label: "29" },
  { label: "30" },
  { label: "31" },
  { label: "32" },
  { label: "33" },
  { label: "34" },
  { label: "35" },
  { label: "36" },
  { label: "37" },
  { label: "38" },
  { label: "39" },
  { label: "40" },
  { label: "41" },
  { label: "42" },
  { label: "43" },
  { label: "44" },
  { label: "45" },
  { label: "46" },
  { label: "47" },
  { label: "48" },
  { label: "49" },
  { label: "50" },
  { label: "51" },
  { label: "52" },
  { label: "53" },
  { label: "54" },
  { label: "55" },
  { label: "56" },
  { label: "57" },
  { label: "58" },
  { label: "59" },
  { label: "60" },
  { label: "61" },
  { label: "62" },
  { label: "63" },
  { label: "64" },
  { label: "65" },
  { label: "66" },
  { label: "67" },
  { label: "68" },
  { label: "69" },
  { label: "70" },
  { label: "71" },
  { label: "72" },
  { label: "73" },
  { label: "74" },
  { label: "75" },
  { label: "76" },
  { label: "77" },
  { label: "78" },
  { label: "79" },
  { label: "80" },
  { label: "81" },
  { label: "82" },
  { label: "83" },
  { label: "84" },
  { label: "85" },
  { label: "86" },
  { label: "87" },
  { label: "88" },
  { label: "89" },
  { label: "90" },
  { label: "91" },
  { label: "92" },
  { label: "93" },
  { label: "94" },
  { label: "95" },
  { label: "96" },
  { label: "97" },
  { label: "98" },
  { label: "99" },
  { label: "100" },
  { label: "101" },
  { label: "102" },
  { label: "103" },
  { label: "104" },
  { label: "105" },
  { label: "106" },
  { label: "107" },
  { label: "108" },
  { label: "109" },
  { label: "110" },
  { label: "111" },
  { label: "112" },
  { label: "113" },
  { label: "114" },
  { label: "115" },
  { label: "116" },
  { label: "117" },
  { label: "118" },
  { label: "119" },
  { label: "120" }
];

function range(start, end, step, offset) {
  console.log("start", start, "end ", end);
  let strt = Math.round(start / 10) * 10;
  // let strt = 10;
  let endel = end;
  // let endel = Math.round(end / 10) * 10; //
  // console.log(endel, "endl");
  let s1 = strt;
  let s2 = endel;
  console.log(s1, "start", s2, "end");
  if (endel == 0 || endel < end) {
    endel = end;
  } else {
  }

  var len = (Math.abs(endel - strt) + (offset || 0) * 2) / (step || 1) + 1;

  var direction = parseFloat(strt) < parseFloat(endel) ? 1 : -1;

  var startingPoint = strt - direction * (offset || 0);

  var stepSize = direction * (step || 1);

  if (len > 1 && len < 2) {
    len = 2;
  }

  return Array(parseInt(len))
    .fill(0)
    .map(function (_, index) {
      return startingPoint + stepSize * index;
    });
}
export default class HydrationScreen extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      dailyGoalModalVisible: false,
      waterinml: "100 ml",
      // activebtn: "settings",
      activebtn: "home",
      drinkwater: 0,
      percentage: 0,
      unit: "kg,ml",
      goal: 0,
      gender: "",
      weight: "",
      wakeup: "",
      bedtime: "",
      waterunit: "ml",
      weightunit: "kg",
      isGoalModalVisible: false,
      isGendermodalVisible: false,
      isWeightModal: false,
      isWakeupModal: false,
      isBedModal: false,
      isDateTimePickerVisible: false,
      isShowDataPicker: false,
      isLoading: false,
      converweight: 0,
      dailyConsumptopnData: [],
      fromdate: "",
      todate: "",
      // fromdate: moment().startOf("month").format("DD/MM/YYYY"),
      // todate: moment(lastDayOfMonth).format("DD/MM/YYYY"),
      Hydgraph: [],
      Yaxios: [],
      Xaxios: [],
      changedWeight: "",
      changedGend: "",
      changedBedtime: "",
      ChangedWakeup: "",
      changedGoal: 0
    };
  }

  showDateTimePicker = () => {
    // console.log("os d msnens@@@@@");
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = (date) => {
    console.log("isBedModal", this.state.isBedModal);
    // let formatdate = moment(date).format("ddd, Do MMMM YYYY, hh:mm A");
    let formatdate = moment(date).format("ddd, Do MMMM YYYY");
    let formatdate1 = moment(date).format("hh:mm A");

    if (this.state.isBedModal) {
      this.setState({ bedtime: formatdate1, isBedModal: false }, () => {
        this.UpdateSavedHydationDatatoDB();
      });
    } else {
      this.setState(
        {
          wakeup: formatdate1
        },
        () => {
          this.UpdateSavedHydationDatatoDB();
        }
      );
    }
    this.hideDateTimePicker();
  };

  // only for ios
  renderModalPicekr = () => {
    // console.log("modal date picker");
    return (
      <DateTimePicker
        isVisible={this.state.isDateTimePickerVisible}
        onConfirm={this.handleDatePicked}
        onCancel={this.hideDateTimePicker}
        mode="time"
        is24Hour={false}
      />
    );
  };

  // Android
  renderDatePicker = () => {
    return (
      <RNDateTimePicker
        testID="dateTimePicker"
        value={new Date()}
        mode="time"
        is24Hour={false}
        onChange={this.onChange}
      />
    );
  };

  onChange = (event, selectedDate) => {
    console.log(event, "event");
    const now = new Date(selectedDate);

    if (event.type == "set" && this.state.isBedModal == false) {
      const currentDate = selectedDate;
      let selctedtime = moment(currentDate).format("DD-MM-YYYY hh:mm:ss");
      let formatdate = moment(currentDate).format("hh:mm A");

      this.setState(
        {
          isDateTimePickerVisible: false,
          wakeup: formatdate
        },
        () => {
          this.UpdateSavedHydationDatatoDB();
        }
      );
    } else if (event.type == "set" && this.state.isBedModal) {
      const currentDate = selectedDate;
      let selctedtime = moment(currentDate).format("DD-MM-YYYY hh:mm:ss");
      let formatdate = moment(currentDate).format("hh:mm A");

      this.setState(
        {
          isDateTimePickerVisible: false,
          bedtime: formatdate,
          isBedModal: false
        },
        () => {
          this.UpdateSavedHydationDatatoDB();
        }
      );
    } else if (event.type == "dismissed" && this.state.isBedModal == false) {
      console.log(event, "=====**&*&8event");
      this.setState({
        isDateTimePickerVisible: false
      });
    } else if (event.type == "dismissed" && this.state.isBedModal) {
      console.log(event, "=====**&*&8event");
      this.setState({
        isDateTimePickerVisible: false,
        isBedModal: false
      });
    } else {
      console.log(event, "event");
      this.setState({
        isDateTimePickerVisible: false,
        isBedModal: false
      });
    }
  };

  getAsyncData = async () => {
    console.log("^^^^&^&^&^^^^^^^^^^^^:::::::");

    try {
      const value = await AsyncStorage.getItem("Hydration");
      // const hydrationDetail = JSON.parse(value);
      let response = await axios.get(Constants.GET_HYDRATION_DETAILS, {});
      console.log(response.data, "^&^&^&^&", response.data.Status);

      if (response.data.Status) {
        let intdata = response.data.List[0].Intekgoal.replace("ML", "");

        let goalfterremoveml = Number(intdata);
        console.log(
          goalfterremoveml.toFixed(0),
          "////????^^^^&^&^&^^^^^^^^^^^^:::::::"
        );
        this.setState(
          {
            goal: goalfterremoveml.toFixed(0),
            changedGoal: goalfterremoveml.toFixed(0),
            gender: response.data.List[0].sGender,
            changedGend: response.data.List[0].sGender,
            weight: response.data.List[0].Weight,
            wakeup: response.data.List[0].Wekup_time,
            bedtime: response.data.List[0].Bed_time
            // unit: hydrationDetail.weightUnit + "," + "ML",
          },
          () => {
            this.GetDailyWaterIntake();
          }
        );
      } else {
        console.log("///else part of get async data");
        // Toast.show(response.data.Msg);
      }
    } catch (error) {
      console.log(error);
      // Error retrieving data
    }
  };

  onEditDailyGoalPress = () => {
    this.setState({ dailyGoalModalVisible: true });
    // setDailyGoalModalVisible(true)
  };
  handleEditDailyGoalModalCancel = () => {
    this.setState({ dailyGoalModalVisible: false });

    // setDailyGoalModalVisible(false)
  };

  componentDidMount = () => {
    this.setState(
      {
        isLoading: true
      },
      () => {
        this.getAsyncData();
        // this.GetDailyWaterIntake();
      }
    );
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    this.setState(
      {
        isLoading: true
      },
      () => {
        this.getAsyncData();
        // this.GetDailyWaterIntake();
      }
    );
  };
  UpdateSavedHydationDatatoDB = async () => {
    this.setState({ isLoading: true });

    // await AsyncStorage.removeItem("Hydration");

    try {
      let response = await axios.post(Constants.SAVE_HYDRATION, {
        Weight_kg: this.state.weight,
        Wakeuptime: this.state.wakeup,
        Bedtime: this.state.bedtime,
        Gender: this.state.gender,
        Intakegoal: this.state.goal + " ML",
        ActionStatus: "U"
      });
      this.setState({ isLoading: false });
      if (response.data.Status) {
        this.getAsyncData();
      } else {
        Toast.show(response.data.Msg);
      }
    } catch (errors) {
      ///Toast.show(errors)
      Toast.show("Something Went Wrong, Please Try Again Later");

      console.log(errors);
    }
  };
  DailyDrinkWaterGoal = () => {
    let cup = this.state.waterinml.replace("ml", "");

    let res = Number(cup) + Number(this.state.drinkwater);
    let per = Math.floor(100 * (res / this.state.goal));
    console.log("res", res, "per", per);

    this.setState(
      {
        drinkwater: res,
        percentage: Math.floor(100 * (res / this.state.goal))
      },
      () => {
        this.SaveDailyWaterIntake();
      }
    );
  };

  SaveDailyWaterIntake = async () => {
    let time = moment().format("hh:mm A");
    let date = moment().format("DD/MM/YYYY");
    try {
      let response = await axios.post(Constants.ADD_WATER_INTAKE, {
        Water_cosumtion: this.state.waterinml,
        time: time,
        date: date
        // Intake_Goal: "",
      });
      this.setState({ isLoading: false });
      if (response.data.Status) {
        this.GetDailyWaterIntake();
      } else {
        Toast.show(response.data.Msg);
      }
    } catch (errors) {
      ///Toast.show(errors)
      Toast.show("Something Went Wrong, Please Try Again Later");

      console.log(errors);
    }
  };
  GetDailyWaterIntake = async () => {
    console.log(this.state.goal, "===GetDailyWaterIntake");
    let date = moment().format("DD/MM/YYYY");
    try {
      const value = await AsyncStorage.getItem("Hydration");
      const hydrationDetail = JSON.parse(value);
      console.log("hydrationDetail", hydrationDetail);

      let response = await axios.post(Constants.GET_WATER_CONSUMTION_DATA, {
        StartDate: date,
        EndDate: date
      });
      // console.log(response.data, "======after del");
      if (response.data.Status) {
        let drinkwater = 0;
        let responseData = [];

        response.data.List.map((itm) => {
          let temp = {};

          let cup = itm.Water_cosumtion.replace("ml", "");

          drinkwater = Number(drinkwater) + Number(cup);
          temp.Water_cosumtion = itm.Water_cosumtion;
          temp.datetime = itm.time;
          temp.WaterConsuId = itm.WaterConsuId;
          temp.drinked = drinkwater;

          responseData.push(temp);
        });

        this.setState({
          isLoading: false,
          dailyConsumptopnData: responseData.reverse(),
          drinkwater: drinkwater,
          percentage: Math.floor(100 * (drinkwater / this.state.goal))
        });
      } else {
        this.setState({
          isLoading: false,
          dailyConsumptopnData: [],
          drinkwater: 0,
          percentage: 0
        });
      }
    } catch (errors) {
      ///Toast.show(errors)
      Toast.show("Something Went Wrong, Please Try Again Later");
      this.setState({ isLoading: false });
      console.log(errors);
    }
  };
  getHydHistory = async () => {
    //bydefault display month wise data
    this.setState({ isLoading: true });
    const startOfMonth =
      this.state.fromdate == ""
        ? moment().startOf("month").format("YYYY/MM/DD")
        : moment(this.state.fromdate).format("YYYY/MM/DD");
    const endOfMonth =
      this.state.todate == ""
        ? moment(lastDayOfMonth).format("YYYY/MM/DD")
        : //moment().endOf("month").format("DD/MM/YYYY")
          moment(this.state.todate).format("YYYY/MM/DD");

    // console.log("startOfMonth", startOfMonth, ">>.", "endOfMonth", endOfMonth);
    try {
      console.log(startOfMonth, "startOfMonth", "endOfMonth", endOfMonth);
      let response = await axios.post(Constants.HYD_HISTORY, {
        StartDate: startOfMonth,
        EndDate: endOfMonth
      });
      console.log("======////////", response.data);
      let sorteddata = response.data.List;
      // console.log(sorteddata.sort(), "======////////", response.data);
      this.setState({ isLoading: false });

      if (response.data.Status) {
        let drinkwater = 0;
        let responseData = [];
        let tempp = {};
        let graph = [];
        let bardata = [];
        let Yaxiosdata = [];
        let xaxiosdata = [];

        let totaldrink = 0;
        let drinkedwaterperce = 0;
        // Yaxiosdata = range(0, 100);
        response.data.List.map((itm) => {
          let datesetX = {}; //to push the data in to xaxios

          let temp = {};

          totaldrink = Number(itm.time);
          console.log(totaldrink, ":::////>>>");

          drinkedwaterperce = Math.floor(100 * (totaldrink / this.state.goal));
          console.log(drinkedwaterperce, ":::////>>>");
          datesetX.date = itm.date;

          xaxiosdata.push(datesetX);
          graph.push(drinkedwaterperce);
        });

        let maxvalue = Math.max.apply(null, graph);
        console.log(
          maxvalue,
          "maxvalue *********",
          "Math.ceil(maxvalue)",
          Math.ceil(maxvalue),
          "Math.round(maxvalue)",
          Math.round(maxvalue)
        );
        if (maxvalue == 0 && maxvalue < 1) {
          Yaxiosdata = range(0, 1);
        } else {
          Yaxiosdata = range(0, Math.ceil(maxvalue));
        }
        this.setState({
          Hydgraph: graph,
          Yaxios: Yaxiosdata,
          Xaxios: xaxiosdata
        });
      } else {
        this.setState({
          Hydgraph: [],
          Yaxios: [],
          Xaxios: [],
          isLoading: false
        });
      }
    } catch (errors) {
      this.setState({ isLoading: false });
      ///Toast.show(errors)
      Toast.show("Something Went Wrong, Please Try Again Later");

      console.log(errors);
    }
  };

  backbtnPress = () => {
    // var role = AsyncStorage.getItem(Constants.ACCOUNT_ROLE);
    // this.props.navigation.goBack();
    this.props.navigation.navigate("PatientDashboard");
  };

  handleHydRecords = async (index) => {
    let hydrecord = this.state.dailyConsumptopnData[index];
    console.log(hydrecord.WaterConsuId, "////");
    let id = hydrecord.WaterConsuId;
    try {
      let response = await axios.get(
        Constants.DELETE_WATER_CONSUMTION_DATA + "waterConsumptionId=" + id,
        {}
      );
      console.log(response.data, "dlete");
      this.setState({ isLoading: false });
      if (response.data.Status) {
        this.setState({ isLoading: true });
        // Toast.show(response.data.Msg);
        this.GetDailyWaterIntake();
      } else {
        Toast.show(response.data.Msg);
        this.GetDailyWaterIntake();
      }
    } catch (errors) {
      ///Toast.show(errors)
      Toast.show("Something Went Wrong, Please Try Again Later");

      console.log(errors);
    }
  };

  onSelectFromDate = (date) => {
    let formatdate = moment(date).format("DD/MM/YYYY");
    // console.log(formatdate, "formate date ");
    // console.log("from date ", date);
    this.setState({ fromdate: date, isDateTimePickerVisible: false }, () => {
      if (this.state.todate == "") {
      } else {
        this.setState(
          { isLoading: true, Hydgraph: [], isDateTimePickerVisible: false },
          () => {
            this.getHydHistory();
          }
        );
      }
    });
  };
  onSelectToDate = (date) => {
    let formatdate = moment(date).format("DD/MM/YYYY");
    // console.log(formatdate, "tod ate formate date ");
    this.setState({ todate: date, isShowDataPicker: false }, () => {
      if (this.state.fromdate == "") {
      } else {
        // responseMain = [];
        // this.setState({ isLoading: true, AllReportList: [] });
        this.setState(
          {
            isLoading: true,
            Hydgraph: [],
            isShowDataPicker: false
          },
          () => {
            this.getHydHistory();
          }
        );
      }
    });
  };
  onChangeSelectFromDate = (event, selectedDate) => {
    console.log(event, "//////");
    if (event.type == "set") {
      const currentDate = selectedDate || date;
      // setShow(Platform.OS === 'ios');
      let formatdate = moment(currentDate).format("DD/MM/YYYY");

      this.setState(
        {
          fromdate: selectedDate,
          isShowDataPicker: false,
          isDateTimePickerVisible: false
        },
        () => {
          if (this.state.todate == "") {
          } else {
            this.setState(
              {
                isLoading: true,
                Hydgraph: [],
                isShowDataPicker: false
              },
              () => {
                this.getHydHistory();
              }
            );
          }
        }
      );
    } else {
      this.setState({
        // BirthDate: formatdate,
        isShowDataPicker: false,
        isDateTimePickerVisible: false
      });
    }
  };
  onChangeSelectToDate = (event, selectedDate) => {
    console.log(event, "//////");
    if (event.type == "set") {
      const currentDate = selectedDate || date;
      // setShow(Platform.OS === 'ios');
      let formatdate = moment(currentDate).format("DD/MM/YYYY");

      this.setState(
        {
          todate: selectedDate,
          isShowDataPicker: false,
          isDateTimePickerVisible: false
        },
        () => {
          if (this.state.fromdate == "") {
          } else {
            this.setState(
              {
                isLoading: true,
                Hydgraph: [],
                isShowDataPicker: false
              },
              () => {
                this.getHydHistory();
              }
            );
          }
        }
      );
    } else {
      this.setState({
        // BirthDate: formatdate,
        isShowDataPicker: false,
        isDateTimePickerVisible: false
      });
    }
  };
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false, isShowDataPicker: false });
  };
  render() {
    const data = {
      labels: this.state.Xaxios,
      datasets: [
        {
          data: this.state.Hydgraph
        }
      ]
    };
    const screenWidth = Math.round(Dimensions.get("window").width);
    const screenheight = Math.round(Dimensions.get("screen").height);
    const screenScale = Math.round(Dimensions.get("screen").scale);

    const CUT_OFF = 20;
    // console.log("screenheight", screenheight, "screenScale", screenScale);

    console.log(screenWidth, "screenWidth");
    const Labels = ({ x, y, bandwidth }) =>
      this.state.Hydgraph.map((value, index) => (
        <SvgText
          key={index}
          x={x(index) + bandwidth / 2}
          y={value < CUT_OFF ? y(value) + 10 : y(value) + 15}
          fontSize={14}
          fill={value >= CUT_OFF ? "white" : "black"}
          alignmentBaseline={"middle"}
          textAnchor={"middle"}
        >
          {" " + value + "%  "}
        </SvgText>
      ));
    return (
      <Container>
        <CustomeHeader
          title="Hydration Reminder"
          headerId={2}
          navigation={this.props.navigation}
          onPressback={this.backbtnPress}
        />

        <Loader loading={this.state.isLoading} />

        <View style={{ flex: 1, backgroundColor: "white" }}>
          <View
            style={{
              height: 60,
              width: "100%",
              flexDirection: "column",
              alignItems: "center"
              // backgroundColor: "red",
            }}
          >
            <View
              style={{
                height: 40,
                width: "90%",
                // backgroundColor: "red",
                backgroundColor: "#f4f4f4",
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 50,
                borderWidth: 1,
                marginTop: 10
              }}
            >
              {this.state.activebtn == "home" ? (
                <TouchableOpacity
                  style={{
                    height: 40,
                    // width: "50%",
                    width: "33.33%",
                    backgroundColor: "#1d303f",
                    borderRadius: 16,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row"
                  }}
                  onPress={() => this.setState({ activebtn: "home" })}
                >
                  <Image
                    source={require("../../../icons/home-active.png")}
                    style={{ height: 20, width: 20, marginLeft: 1 }}
                  />
                  <Text style={{ fontSize: 14, color: "white", marginLeft: 2 }}>
                    {" "}
                    Home
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#f4f4f4",
                    height: "100%",
                    // width: "50%",
                    width: "33.33%",
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row"
                  }}
                  onPress={() => {
                    this.setState({ activebtn: "home" });
                    // this.DailyDrinkWaterGoal();
                    this.getAsyncData();
                  }}
                >
                  <Image
                    source={require("../../../icons/home-not-active.png")}
                    style={{ height: 25, width: 25, marginLeft: 1 }}
                  />
                  <Text
                    style={{ fontSize: 14, color: "#1d303f", marginLeft: 2 }}
                  >
                    {" "}
                    Home
                  </Text>
                </TouchableOpacity>
              )}

              {this.state.activebtn == "history" ? (
                <TouchableOpacity
                  style={{
                    height: 40,
                    // width: "50%",
                    width: "33.33%",
                    backgroundColor: "#1d303f",
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row"
                  }}
                  onPress={() => {
                    this.setState({ activebtn: "history" });
                  }}
                >
                  <Image
                    source={require("../../../icons/History-active.png")}
                    style={{ height: 25, width: 25, marginLeft: 1 }}
                  />
                  <Text style={{ fontSize: 14, color: "white", marginLeft: 2 }}>
                    {" "}
                    History
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#f4f4f4",
                    height: "100%",
                    // width: "50%",
                    width: "33.33%",
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row"
                  }}
                  onPress={() => {
                    console.log("hyd selecteu====");
                    this.setState({ activebtn: "history" });

                    this.getHydHistory();
                  }}
                >
                  <Image
                    source={require("../../../icons/History-not-active.png")}
                    style={{ height: 25, width: 25, marginLeft: 1 }}
                  />
                  <Text
                    style={{ fontSize: 14, color: "#1d303f", marginLeft: 2 }}
                  >
                    {" "}
                    History
                  </Text>
                </TouchableOpacity>
              )}
              {this.state.activebtn == "settings" ? (
                <TouchableOpacity
                  style={{
                    height: 40,
                    // width: "50%",
                    width: "33.33%",
                    backgroundColor: "#1d303f",
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row"
                  }}
                  onPress={() => this.setState({ activebtn: "settings" })}
                >
                  <Image
                    source={require("../../../icons/Settings-active.png")}
                    style={{ height: 25, width: 25, marginLeft: 1 }}
                  />
                  <Text style={{ fontSize: 14, color: "white", marginLeft: 2 }}>
                    {" "}
                    Settings
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#f4f4f4",
                    height: "100%",
                    // width: "50%",
                    width: "33.33%",
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row"
                  }}
                  onPress={() => this.setState({ activebtn: "settings" })}
                >
                  <Image
                    source={require("../../../icons/Settings-not-active.png")}
                    style={{ height: 25, width: 25, marginLeft: 1 }}
                  />
                  <Text
                    style={{ fontSize: 14, color: "#1d303f", marginLeft: 2 }}
                  >
                    {" "}
                    settings
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/*  home  */}
          {this.state.activebtn == "home" && (
            <KeyboardAwareScrollView enableOnAndroid={true}>
              <View
                style={{
                  flex: 1,

                  alignItems: "center"
                }}
              >
                <AnimatedCircularProgress
                  // style={styles.progress}
                  size={screenWidth - 30}
                  width={scale(5)}
                  rotation={0.1}
                  fill={this.state.percentage}
                  onAnimationComplete={() =>
                    console.log(this.state.percentage, "::::::///")
                  }
                  tintColor="#00CCFF"
                  backgroundColor="white"
                  startDeg={45}
                  endDeg={10}
                  innerRadius={0}
                  duration={300}
                  style={{
                    margin: 10,
                    marginRight: 20,
                    marginTop: 30,
                    marginLeft: 20
                  }}
                  children={() => (
                    <>
                      <View
                        style={{
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <ImageBackground
                          style={{
                            // height: scale(280),
                            // width: scale(280),
                            // height: moderateScale(290),
                            // width: moderateScale(290),
                            height: screenWidth - 60,
                            width: screenWidth - 60,
                            resizeMode: "contain"

                            // alignItems: "center",
                            // justifyContent: "center",
                          }}
                          source={require("../../../icons/hyderation.png")}
                        >
                          <Text
                            style={[
                              styles.header1,
                              {
                                color: "gray",
                                marginTop: 2,
                                fontSize: 18,
                                fontWeight: "bold"
                              }
                            ]}
                          ></Text>
                          <Text style={[styles.header]}>
                            {"     " + this.state.drinkwater}

                            <Text style={[styles.header, { color: "#2761B3" }]}>
                              {" / " + this.state.goal}
                              <Text
                                style={[
                                  styles.header,
                                  { color: "#2761B3", fontSize: scale(20) }
                                ]}
                              >
                                {"  ml"}
                              </Text>
                            </Text>
                          </Text>
                          <Text
                            style={[
                              styles.header1,
                              {
                                color: "gray",
                                marginTop: 2,
                                fontSize: 18,
                                fontWeight: "bold"
                              }
                            ]}
                          >
                            {"Daily Drink Target"}
                          </Text>

                          <View
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop:
                                screenWidth >= 365
                                  ? screenWidth >= 374 && screenWidth < 400
                                    ? scale(20)
                                    : screenWidth <= 428 && Platform.OS == "ios"
                                    ? scale(42)
                                    : scale(32)
                                  : screenWidth > 320 && screenWidth < 364
                                  ? scale(10)
                                  : scale(-20)
                            }}
                          >
                            <Text style={styles.header2}> </Text>
                            <Text
                              style={[
                                styles.header,
                                {
                                  color: "#fff",
                                  fontSize: 21,
                                  marginLeft: 30,

                                  marginTop: scale(11)
                                }
                              ]}
                            >
                              {this.state.waterinml}
                            </Text>

                            <TouchableOpacity
                              onPress={() => {
                                this.DailyDrinkWaterGoal();
                              }}
                              style={{
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: scale(10)
                                // marginTop: moderateVerticalScale(10),
                              }}
                            >
                              <Image
                                style={{
                                  height: scale(50),
                                  width: scale(50),
                                  alignItems: "center",
                                  justifyContent: "center",
                                  alignSelf: "center",
                                  resizeMode: "contain",
                                  backfaceVisibility: "hidden"
                                }}
                                source={require("../../../icons/glass-daily-drink-target.png")}
                              ></Image>
                            </TouchableOpacity>
                          </View>
                          <View
                            style={{
                              height:
                                Platform.OS == "ios" ? scale(130) : scale(120),
                              width: 20,
                              // backgroundColor: "red",
                              resizeMode: "contain",
                              // marginTop: 10,
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          ></View>
                        </ImageBackground>
                      </View>
                    </>
                  )}
                />

                <TouchableOpacity
                  onPress={() => {
                    this.DailyDrinkWaterGoal();
                  }}
                >
                  <Image
                    style={{
                      height: 30,
                      width: 30,

                      resizeMode: "stretch",
                      marginTop: scale(-40),
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "center"
                      // marginLeft: -10,
                    }}
                    // source={require("../../../icons/arrow.png")}
                    source={require("../../../icons/greenarrow.png")}
                  ></Image>
                </TouchableOpacity>
                <Text
                  style={[
                    styles.header1,
                    {
                      color: "#2761B3",
                      marginTop: 1,
                      fontSize: scale(12),
                      textAlign: "left",
                      fontWeight: "bold"
                      // marginLeft: 20,
                    }
                  ]}
                >
                  {
                    "Click on the glass  to confirm intake of water                "
                  }
                </Text>
                <TouchableOpacity
                  onPress={() => this.setState({ dailyGoalModalVisible: true })}
                  style={{ flex: 1 }}
                >
                  <Image
                    style={{
                      height: scale(50),
                      width: scale(50),
                      resizeMode: "contain",
                      marginLeft: screenWidth - 80,
                      alignItems: "flex-end",
                      justifyContent: "flex-end",
                      marginTop: -70,
                      padding: 10,
                      marginRight: 20
                    }}
                    source={require("../../../icons/cup.png")}
                  ></Image>
                </TouchableOpacity>

                <Modal
                  title="Switch cup"
                  visible={this.state.dailyGoalModalVisible}
                  onCancel={this.handleEditDailyGoalModalCancel}
                  waterinml={this.state.waterinml}
                  onpressCups={(water) =>
                    this.setState({
                      waterinml: water,
                      dailyGoalModalVisible: false
                    })
                  }
                ></Modal>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  marginLeft: 20
                }}
              >
                <Text style={[styles.header2, { marginLeft: 0 }]}>
                  {"Today's records    "}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,

                  backgroundColor: "transparent",
                  marginLeft: 5
                }}
              >
                {this.state.dailyConsumptopnData.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,

                      backgroundColor: "transparent",
                      marginLeft: 5
                    }}
                  >
                    <HydDailyRecords
                      time={item.datetime}
                      water={item.Water_cosumtion}
                      date={moment(item.RecommendedDate).format(" DD MMM YY")}
                      onPress={() => this.handleHydRecords(index)}
                    ></HydDailyRecords>
                  </View>
                ))}
              </View>
            </KeyboardAwareScrollView>
          )}
          {/*  history  */}
          {this.state.activebtn == "history" && (
            <View style={{ flex: 1 }}>
              <ScrollView
                alwaysBounceVertical={true}
                showsHorizontalScrollIndicator={false}
                style={{ backgroundColor: "white", marginTop: 0 }}
              >
                <View style={{ paddingLeft: 10, marginTop: 20 }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignContent: "center"
                    }}
                  >
                    {Platform.OS == "ios" ? (
                      <Graphdateinput
                        placeholder="Start Date"
                        onDateChange={this.onSelectFromDate}
                        date={this.state.fromdate}
                        onPress={() =>
                          this.setState({
                            isDateTimePickerVisible:
                              !this.state.isDateTimePickerVisible
                          })
                        }
                        onCancel={this.hideDateTimePicker}
                        isVisible={this.state.isDateTimePickerVisible}
                        maxDate={new Date()}
                      ></Graphdateinput>
                    ) : (
                      <Graphdateinput
                        placeholder="Start Date"
                        onDateChange={this.onChangeSelectFromDate}
                        date={this.state.fromdate}
                        onPress={() =>
                          this.setState({
                            isDateTimePickerVisible:
                              !this.state.isDateTimePickerVisible
                          })
                        }
                        onCancel={this.hideDateTimePicker}
                        isVisible={this.state.isDateTimePickerVisible}
                        maxDate={new Date()}
                      ></Graphdateinput>
                    )}
                    <Text
                      style={{
                        textAlign: "center",
                        alignSelf: "center",
                        margin: 10
                      }}
                    >
                      To
                    </Text>
                    {Platform.OS == "ios" ? (
                      <Graphdateinput
                        placeholder="End Date"
                        onDateChange={this.onSelectToDate}
                        date={this.state.todate}
                        isVisible={this.state.isShowDataPicker}
                        onPress={() => {
                          console.log("pressed");
                          this.setState({
                            isShowDataPicker: !this.state.isShowDataPicker
                          });
                        }}
                        maxDate={new Date()}
                        onCancel={this.hideDateTimePicker}
                      ></Graphdateinput>
                    ) : (
                      <Graphdateinput
                        placeholder="End Date"
                        onDateChange={this.onChangeSelectToDate}
                        date={this.state.todate}
                        isVisible={this.state.isShowDataPicker}
                        onPress={() => {
                          console.log("pressed");
                          this.setState({
                            isShowDataPicker: !this.state.isShowDataPicker
                          });
                        }}
                        onCancel={this.hideDateTimePicker}
                        maxDate={new Date()}
                      ></Graphdateinput>
                    )}
                  </View>

                  {this.state.Hydgraph.length <= 0 ? (
                    <NoDataAvailable></NoDataAvailable>
                  ) : (
                    <View style={[styles.MyhealthcardView, { marginTop: 20 }]}>
                      <ScrollView style={{ flex: 1, margin: 0 }}>
                        <View>
                          <View
                            style={{
                              flexDirection: "row",
                              paddingVertical: verticalScale(8),
                              padding: scale(10)
                            }}
                          >
                            <YAxis
                              data={this.state.Yaxios}
                              contentInset={{
                                top: verticalScale(10),
                                bottom: verticalScale(10)
                              }}
                              style={{
                                height: verticalScale(300),
                                width: scale(30),
                                marginRight: scale(-3),
                                borderRightColor: "gray",
                                borderRightWidth: 1
                              }}
                              svg={{
                                fill: "grey",
                                fontSize: 10
                              }}
                              numberOfTicks={10}
                              yAccessor={({ index }) => index}
                              formatLabel={(value) => `${value}%`}
                              spacingInner={0.5}
                            />
                            <ScrollView
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}
                              style={{ marginHorizontal: 30, marginLeft: 5 }}
                            >
                              <View
                                style={{
                                  //flexDirection: "row",
                                  flex: 1,
                                  width:
                                    this.state.Hydgraph.length < 3
                                      ? scale(this.state.Hydgraph.length * 100)
                                      : scale(this.state.Hydgraph.length * 80)
                                }}
                              >
                                <View
                                  style={{
                                    flex: 1,
                                    height: verticalScale(300)
                                  }}
                                >
                                  <BarChart
                                    style={{
                                      flex: 1
                                    }}
                                    data={this.state.Hydgraph}
                                    // data={[23, 43]}
                                    gridMin={0}
                                    svg={{ fill: "#61dafb" }} //#61dafb,#00ccff
                                    contentInset={{
                                      top: 10,
                                      bottom: 10,
                                      left: 0,
                                      right: 0
                                    }}
                                    // spacingInner={0.6}
                                    spacingInner={
                                      this.state.Hydgraph.length < 3
                                        ? this.state.Hydgraph.length == 1
                                          ? 0.3
                                          : 0.7
                                        : 0.6
                                    }
                                    spacingOuter={
                                      this.state.Hydgraph.length < 3
                                        ? this.state.Hydgraph.length == 2
                                          ? 0.2
                                          : 0.5
                                        : 0.1
                                    }
                                  >
                                    <Grid />
                                    <Labels />
                                  </BarChart>
                                </View>

                                <XAxis
                                  style={{ flex: 1 }}
                                  yAccessor={({ index }) => index}
                                  data={this.state.Xaxios}
                                  formatLabel={(value, index) =>
                                    this.state.Xaxios[index].date
                                  }
                                  contentInset={{ left: 40, right: 40 }}
                                  svg={{ fontSize: 12, fill: "black" }}
                                />
                              </View>
                            </ScrollView>
                          </View>
                        </View>
                      </ScrollView>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>
          )}
          {/*  settings  */}
          {this.state.activebtn == "settings" && (
            <View
              style={{
                justifyContent: "center",
                flex: 1,
                paddingTop: 0,
                backgroundColor: "white"
              }}
            >
              <KeyboardAwareScrollView enableOnAndroid={true}>
                <View style={styles.container}>
                  <SettingsItemsRender
                    name={"Intake goal"}
                    value={this.state.goal + this.state.waterunit}
                    onPress={() => this.setState({ isGoalModalVisible: true })}
                  />

                  <SettingsItemsRender
                    name={"Gender"}
                    value={this.state.gender}
                    onPress={() =>
                      this.setState({ isGendermodalVisible: true })
                    }
                  />

                  <SettingsItemsRender
                    name={"Weight"}
                    value={this.state.weight + this.state.weightunit}
                    onPress={() =>
                      this.setState({
                        isWeightModal: true
                      })
                    }
                  />
                  <SettingsItemsRender
                    name={"Wake up time"}
                    value={this.state.wakeup}
                    onPress={() =>
                      this.setState({
                        isDateTimePickerVisible: true
                      })
                    }
                  />
                  <SettingsItemsRender
                    name={"BedTime"}
                    value={this.state.bedtime}
                    onPress={() =>
                      this.setState({
                        isBedModal: true,
                        isDateTimePickerVisible: true
                      })
                    }
                  />
                </View>
              </KeyboardAwareScrollView>

              {this.state.isBedModal
                ? Platform.OS == "ios"
                  ? this.renderModalPicekr()
                  : null
                : null}
              {this.state.isBedModal
                ? Platform.OS == "android"
                  ? this.renderDatePicker()
                  : null
                : null}
              {this.state.isDateTimePickerVisible
                ? Platform.OS == "ios"
                  ? this.renderModalPicekr()
                  : null
                : null}
              {this.state.isDateTimePickerVisible
                ? Platform.OS == "android"
                  ? this.renderDatePicker()
                  : null
                : null}
              {this.state.isGoalModalVisible && (
                <>
                  <SettingModalRender
                    title="Adjust Intake goal"
                    visible={this.state.isGoalModalVisible}
                    value={this.state.changedGoal}
                    onValueChange={(val) => this.setState({ changedGoal: val })}
                    onCancel={() =>
                      this.setState({ isGoalModalVisible: false })
                    }
                    onPressOk={() =>
                      this.setState(
                        {
                          goal: this.state.changedGoal,
                          isGoalModalVisible: false
                        },
                        () => {
                          this.UpdateSavedHydationDatatoDB();
                        }
                      )
                    }
                  />
                </>
              )}
              {this.state.isGendermodalVisible && (
                <>
                  <SettingModalRender
                    title="Gender"
                    visible={this.state.isGendermodalVisible}
                    onCancel={() =>
                      this.setState({ isGendermodalVisible: false })
                    }
                    onPressOk={() =>
                      this.setState(
                        {
                          gender: this.state.changedGend,
                          isGendermodalVisible: false
                        },
                        () => {
                          this.UpdateSavedHydationDatatoDB();
                        }
                      )
                    }
                    value={this.state.changedGend}
                    onValueChange={(val) => this.setState({ changedGend: val })}
                  />
                </>
              )}
              {this.state.isWeightModal && (
                <>
                  <SettingModalRender
                    title="Weight"
                    wightkg={wightkg}
                    visible={this.state.isWeightModal}
                    onCancel={() => this.setState({ isWeightModal: false })}
                    onPressOk={() =>
                      this.setState(
                        {
                          weight: this.state.changedWeight,
                          isWeightModal: false,
                          goal: this.state.changedGoal.toFixed(0)
                        },
                        () => {
                          this.UpdateSavedHydationDatatoDB();
                        }
                      )
                    }
                    value={this.state.weight}
                    onValueChange={(val) =>
                      this.setState({
                        changedWeight: val,
                        changedGoal: val * 0.033 * 1000
                      })
                    }
                  />
                </>
              )}
            </View>
          )}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  progress: {
    width: 300,
    height: 300,
    marginBottom: 10,
    borderRadius: 70,
    borderWidth: 10,
    borderColor: "#0051d4",
    overflow: "hidden"
  },
  containermain: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "white"
  },
  container: {
    flex: 1,
    // flexDirection: "row",
    padding: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: "white"
    //elevation: 2,
  },
  title: {
    fontSize: 16,
    color: "#000",
    flexDirection: "column",
    backgroundColor: "white",
    fontWeight: "bold",
    marginBottom: 10
  },
  mainheader: {
    //flex:1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 20,
    ///fontWeight: 'bold',
    color: "#000",
    marginTop: 15
  },

  header: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: scale(25),
    fontWeight: "bold",
    color: "#32CD32",
    marginTop: Platform.OS === "ios" ? 70 : 50,
    // marginTop: 100,
    marginRight: 30
  },
  header1: {
    //flex:1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#32CD32"
  },
  header2: {
    flex: 1,
    // alignItems: "center",
    // alignSelf: "center",

    fontSize: 18,
    fontWeight: "bold",
    // color: "white",
    marginTop: 30,
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },

  imageWrapper: {
    height: 330,
    width: 330,
    overflow: "hidden",
    marginTop: 25
  },
  theImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },
  loginScreenButton: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#2e62ae",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff"
  },
  loginText: {
    color: "#2e62ae",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 20
  },
  circle: {
    // width: 181,
    // height: 181,
    width: "90%",
    height: "90%",
    borderRadius: 10,
    borderWidth: 5,
    backgroundColor: "red", //#27354d
    borderColor: "white", //#0051d4
    borderTopLeftRadius: 10,
    borderBottomWidth: 10,
    borderRightWidth: 10,
    transform: [{ rotate: "45deg" }],
    shadowColor: "#000000",
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowOpacity: 0.9,
    shadowRadius: 10.0,
    elevation: 10
  },
  MyhealthcardView: {
    flex: 1,

    padding: 8,
    margin: 10,

    width: 300,
    height: 400,

    borderRadius: 5,

    marginTop: 20,
    alignItems: "center",
    justifyContent: "center"
  }
});
