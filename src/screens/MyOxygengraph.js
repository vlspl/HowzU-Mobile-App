import React from "react";

import {
  ScrollView,
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
  KeyboardAvoidingView,
  Linking
} from "react-native";
import { Container, Header } from "native-base";
import CustomeHeader from "../appComponents/CustomeHeader";
import {
  BarChart,
  XAxis,
  YAxis,
  Grid,
  LineChart,
  AreaChart
} from "react-native-svg-charts";
// import {
//   LineChart,
//   BarChart,
//   PieChart,
//   ProgressChart,
//   ContributionGraph,
//   StackedBarChart,
// } from "react-native-chart-kit";
import { Circle, G, Line, Rect, Text as SvgText } from "react-native-svg";
import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale
} from "react-native-size-matters";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import Graphdateinput from "../appComponents/Graphdateinput";
import AsyncStorage from "@react-native-community/async-storage";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import axios from "axios";
import ActionButton from "react-native-action-button";
import Toast from "react-native-tiny-toast";
import PureChart from "react-native-pure-chart";
import moment from "moment";
import * as shape from "d3-shape";
const screenWidth = Math.round(Dimensions.get("window").width);
const { StatusBarManager } = NativeModules;
// import {
//   Chart,
//   VerticalAxis,
//   HorizontalAxis,
//   Line,
// } from "react-native-responsive-linechart";

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
export default class MyOxygengraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userrole: "",
      // isloading: false,
      fromdate: "",
      todate: "",
      AllReportList: [],
      pageNo: 1,
      healthName: "",
      isLoading: false,
      result: "",
      value: "",
      unit: "",
      selectedDate: "",
      userrole: "",
      reportDetailArr: [],
      activebtn: "report",
      Oxygraph: [],
      Yaxios: [],
      Xaxios: [],
      responsiveLineData: [],
      isDateTimePickerVisible: false,
      isShowDataPicker: false
    };
  }

  OpenDrawer = () => {
    this.props.navigation.goBack();
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    this.setState(
      {
        pageNo: 1,
        isLoading: true,
        AllReportList: [],
        healthName: nextProp.route.params.info.Name,
        result: nextProp.route.params.info.Result,
        value: nextProp.route.params.info.Value,
        unit: nextProp.route.params.info.Unit,
        fromdate: "",
        todate: "",
        reportDetailArr: [],
        activebtn: "report",
        Oxygraph: [],
        Yaxios: [],
        Xaxios: []
      },
      () => {
        this.ReportDetailCall();
      }
    );
  };

  componentDidMount = async () => {
    // this.retrieveData();
    // console.log(" HEAlth componentDidMount==============================");
    this.setState(
      {
        isLoading: true,
        AllReportList: [],
        healthName: this.props.route.params.info.Name,
        result: this.props.route.params.info.Result,
        value: this.props.route.params.info.Value,
        unit: this.props.route.params.info.Unit,
        fromdate: "",
        todate: "",
        activebtn: "report",
        reportDetailArr: [],
        Oxygraph: [],
        Yaxios: [],
        Xaxios: []
      },
      () => {
        this.ReportDetailCall();
      }
    );
  };

  async ReportDetailCall() {
    try {
      const response = await axios.get(Constants.GET_OXYGEN);

      // console.log(response.data, "my blood pressure data ");

      this.setState({ isLoading: false });
      if (response.data.Status) {
        let responseData = [];
        let responseData1 = [];
        let responseMain = [];
        let reports = [];
        let plotting = [];
        let Yaxiosdata = [];
        let xaxiosdata = [];
        responsiveLineData = [];
        console.log(response.data);
        response.data.List.map((item) => {
          let datesetX = {};
          let tempreport = {};
          let temp = {};
          let temp1 = {};
          let svgdata = {};
          let bodytemp = Number(item.Name);
          temp.x = moment(item.RecordDate).format("DD MMM YY");

          temp.y = Number(item.Name);
          datesetX.date = moment(item.RecordDate).format("DD MMM YY");

          responseData.push(temp);
          plotting.push(bodytemp);
          xaxiosdata.push(datesetX);
          responsiveLineData.push(temp);
          // xaxiosdata.push(moment(item.RecordDate).format("DD/MM/YYYY"));
          tempreport.systolic = Number(bodytemp);

          tempreport.pulse = item.PulseRate;
          tempreport.note = item.Notes;
          tempreport.result = item.Result;
          tempreport.recorddate = moment(item.RecordDate).format("DD/MM/YYYY");
          tempreport.createddate = moment(item.CreatedDate).format(
            "DD/MM/YYYY"
          );
          reports.push(tempreport);
        });
        let maxvalue = Math.max.apply(null, plotting);

        let tempp = {};
        let dummy = {};
        dummy.x = " ";
        dummy.y = 100;
        const newAray = [];
        newAray.push(dummy);

        const combinew = newAray.concat(responseData);
        tempp.seriesName = "series1";
        tempp.color = "#297AB1";
        // tempp.data = responseData;
        tempp.data = combinew;

        responseMain.push(tempp);
        if (maxvalue == 0 && maxvalue < 1) {
          Yaxiosdata = range(0, 1);
        } else {
          Yaxiosdata = range(0, Math.ceil(maxvalue));
        }
        // console.log(
        //   "&&&&&============= Yaxiosdata response main",
        //   Yaxiosdata,
        //   "xaxiosdata&&&&&=============",
        //   xaxiosdata,
        //   "====plotting",
        //   plotting
        // );

        this.setState({
          //   AllReportList: responseData,
          reportDetailArr: reports,
          AllReportList: responseMain,
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false,
          Oxygraph: plotting,
          Yaxios: Yaxiosdata,
          Xaxios: xaxiosdata,
          responsiveLineData: responsiveLineData
        });
      } else {
        // Toast.show(response.data.Msg);
        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false,
          Oxygraph: [],
          Yaxios: [],
          Xaxios: []
        });
      }
    } catch (error) {
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        refreshing: false
      });

      console.log(error);
    }
  }

  showGraphUsingDates = async () => {
    console.log(
      "this.state.fromdate",
      this.state.fromdate,
      "this.state.todate",
      this.state.todate,
      "type of",
      typeof this.state.fromdate,
      "///",
      typeof this.state.todate,
      this.state.isLoading
    );
    try {
      let response = await axios.post(Constants.GET_OXYGEN_BYDATES, {
        FromDate: moment(this.state.fromdate).format("DD/MM/YYYY"),
        ToDate: moment(this.state.todate).format("DD/MM/YYYY")
      });
      console.log(response.data, "$$%%%% by Oxye data ");

      this.setState({ isLoading: false });
      if (response.data.Status) {
        let responseData = [];
        let responseData1 = [];
        let responseMain = [];

        response.data.List.map((item) => {
          let temp = {};

          let str = Number(item.Name);

          temp.x = moment(item.RecordDate, "YYYY-MM-DD hh:mm A ").format(
            "DD MMM YY"
          );

          temp.y = Number(str);

          // console.log(str, "^^^&&&&&", num1, num2);

          responseData.push(temp);
        });

        let tempp = {};
        let dummy = {};
        dummy.x = " ";
        dummy.y = 100;
        const newAray = [];
        newAray.push(dummy);
        const combinew = newAray.concat(responseData);

        tempp.seriesName = "series1";
        tempp.color = "#297AB1";
        // tempp.data = responseData;
        tempp.data = combinew;
        responseMain.push(tempp);

        this.setState({
          //   AllReportList: responseData,
          AllReportList: responseMain,
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      } else {
        // Toast.show(response.data.Msg);
        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      }
    } catch (error) {
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        refreshing: false
      });

      console.log(error);
    }
  };
  onSelectFromDate = (date) => {
    let formatdate = moment(date).format("DD/MM/YYYY");
    console.log(formatdate, "formate date ");
    console.log("from date ", date);
    this.setState(
      {
        fromdate: date,

        isDateTimePickerVisible: false
      },
      () => {
        if (this.state.todate == "") {
        } else {
          // responseMain = [];

          this.setState(
            {
              isLoading: true,
              AllReportList: [],

              isDateTimePickerVisible: false
            },
            () => {
              this.showGraphUsingDates();
            }
          );
        }
      }
    );
  };
  onSelectToDate = (date) => {
    console.log(date, "//////onselect to date");
    let formatdate = moment(date).format("DD/MM/YYYY");
    console.log(formatdate, "tod ate formate date ");
    this.setState({ todate: date, isShowDataPicker: false }, () => {
      if (this.state.fromdate == "") {
      } else {
        // responseMain = [];
        // this.setState({ isLoading: true, AllReportList: [] });
        this.setState(
          {
            isLoading: true,
            AllReportList: [],
            isShowDataPicker: false
          },
          () => {
            this.showGraphUsingDates();
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
                AllReportList: [],
                isShowDataPicker: false
              },
              () => {
                this.showGraphUsingDates();
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
                AllReportList: [],
                isShowDataPicker: false
              },
              () => {
                this.showGraphUsingDates();
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
    const CUT_OFF = 20;
    const data = this.state.Oxygraph;
    const HorizontalLine = ({ y }) => (
      <Line
        key={"zero-axis"}
        x1={"0%"}
        x2={"100%"}
        y1={y(50)}
        y2={y(50)}
        stroke={"grey"}
        strokeDasharray={[4, 8]}
        strokeWidth={2}
      />
    );

    const Tooltip = ({ x, y }) => {
      return data.map((itm, ind) => {
        return (
          <G
            x={x(5) - 75 / 2}
            key={"tooltip"}
            onPress={() => console.log("tooltip clicked")}
          >
            <G y={50}>
              <Rect
                height={40}
                width={75}
                stroke={"grey"}
                fill={"white"}
                ry={10}
                rx={10}
              />
              <SvgText
                x={75 / 2}
                dy={20}
                alignmentBaseline={"middle"}
                textAnchor={"middle"}
                stroke={"rgb(134, 65, 244)"}
              >
                {`${itm}`}
              </SvgText>
            </G>
            <G x={75 / 2}>
              <Line
                y1={50 + 40}
                y2={y(data[5])}
                stroke={"grey"}
                strokeWidth={2}
              />
              <Circle
                cy={y(data[5])}
                r={6}
                stroke={"rgb(134, 65, 244)"}
                strokeWidth={2}
                fill={"white"}
              />
            </G>
          </G>
        );
      });
    };
    const { StatusBarManager } = NativeModules;
    const STATUSBAR_HEIGHT =
      Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;
    // console.log("active btn===", this.state.isLoading);

    const { navigate } = this.props.navigation;
    const screenWidth = Math.round(Dimensions.get("window").width);
    return (
      // <KeyboardAvoidingView
      //   style={{ flex: 1 }}
      //   behavior={Platform.OS === "ios" ? "padding" : 0}
      // >
      <Container>
        <CustomeHeader
          title={this.state.healthName}
          headerId={1}
          navigation={this.props.navigation}
        />
        <Loader loading={this.state.isLoading} />

        <View style={{ flex: 1, flexDirection: "column" }}>
          <View
            style={{
              height: 60,
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#F7F7F7"
            }}
          >
            <View
              style={{
                height: 40,
                width: "90%",
                backgroundColor: "#f4f4f4",
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 50,
                borderWidth: 1,
                marginTop: 10
              }}
            >
              {this.state.activebtn == "report" ? (
                <TouchableOpacity
                  style={{
                    height: 40,
                    width: "50%",

                    backgroundColor: "#1d303f",
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onPress={() =>
                    this.setState({
                      activebtn: "report",
                      fromdate: "",
                      todate: ""
                    })
                  }
                >
                  <Text style={{ fontSize: 14, color: "white" }}>Report</Text>
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
                  onPress={() =>
                    this.setState({
                      activebtn: "report",
                      fromdate: "",
                      todate: ""
                    })
                  }
                >
                  <Text style={{ fontSize: 14, color: "#1d303f" }}>Report</Text>
                </TouchableOpacity>
              )}

              {this.state.activebtn == "graph" ? (
                <TouchableOpacity
                  style={{
                    height: 40,
                    width: "50%",
                    // width: '33.33%',
                    backgroundColor: "#1d303f",
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onPress={() => this.setState({ activebtn: "graph" })}
                >
                  <Text style={{ fontSize: 14, color: "white" }}>Graph</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#f4f4f4",
                    height: "100%",
                    width: "50%",
                    // width: '33.33%',
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onPress={() => this.setState({ activebtn: "graph" })}
                >
                  <Text style={{ fontSize: 14, color: "#1d303f" }}>Graph</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {this.state.activebtn == "report" &&
          this.state.activebtn != "graphdata" &&
          this.state.isLoading == false ? (
            <View
              style={{
                justifyContent: "center",
                flex: 1,
                paddingTop: 0
                // backgroundColor: "white",
              }}
            >
              <ScrollView
                alwaysBounceVertical={true}
                showsHorizontalScrollIndicator={false}
                style={{
                  backgroundColor: "#F7F7F7",
                  marginTop: 0,
                  paddingHorizontal: 15
                }}
              >
                {this.state.reportDetailArr.length <= 0
                  ? null
                  : this.state.reportDetailArr.map((itm) => (
                      <View style={styles.container}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "column",
                            backgroundColor: "white"
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              marginTop: 5
                            }}
                          >
                            <Image
                              source={require("../../icons/lab.png")}
                              style={{ height: 15, width: 14, marginLeft: 5 }}
                            />
                            <Text
                              style={{
                                fontSize: 12,
                                paddingTop: 2,
                                color: "gray",
                                marginLeft: 10,
                                width: 65,
                                backgroundColor: "white"
                              }}
                            >
                              Name:
                            </Text>
                            <Text
                              style={{
                                flex: 1,
                                fontSize: 12,
                                marginTop: 0,
                                color: "black",
                                marginRight: 10,
                                textAlign: "right",
                                backgroundColor: "white",
                                padding: 2
                              }}
                            >
                              {this.state.healthName}
                            </Text>
                          </View>
                          <View
                            style={{
                              height: 0.5,
                              backgroundColor: "lightgray",
                              marginTop: 5,
                              padding: 0.5
                            }}
                          ></View>
                        </View>

                        <View
                          style={{
                            flex: 1,
                            flexDirection: "column",
                            backgroundColor: "white"
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              marginTop: 5
                            }}
                          >
                            <Image
                              source={require("../../icons/oxygennew.png")}
                              style={{ height: 26, width: 26, marginLeft: 1 }}
                            />
                            <Text
                              style={{
                                fontSize: 12,
                                paddingTop: 2,
                                color: "gray",
                                marginLeft: 10,
                                width: 100,
                                // width: 75,
                                textAlign: "left",
                                backgroundColor: "white"
                              }}
                              numberOfLines={1}
                            >
                              Oxygen(%)
                            </Text>
                            <View
                              style={{
                                flex: 1,
                                alignItems: "flex-end",
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                marginLeft: 165
                              }}
                            ></View>
                            <Text
                              style={{
                                marginLeft: -90,

                                fontSize: 12,
                                marginTop: 0,
                                color: "black",
                                marginRight: 10,
                                textAlign: "right",
                                backgroundColor: "white"
                              }}
                            >
                              {itm.systolic}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 0.5,
                            backgroundColor: "lightgray",
                            marginTop: 5
                          }}
                        ></View>

                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            marginTop: 5,
                            backgroundColor: "white"
                          }}
                        >
                          <Image
                            source={require("../../icons/heart512.png")}
                            style={{ height: 30, width: 18, marginLeft: 5 }}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              paddingTop: 2,
                              color: "gray",
                              marginLeft: 10,
                              width: 100,
                              backgroundColor: "white",
                              textAlign: "left"
                            }}
                            numberOfLines={1}
                          >
                            Pulse Rate:
                          </Text>
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 12,
                              marginTop: 0,
                              color: "black",
                              marginRight: 10,
                              textAlign: "right",
                              backgroundColor: "white",
                              padding: 2
                            }}
                          >
                            {itm.pulse}
                          </Text>
                        </View>
                        <View
                          style={{
                            height: 0.5,
                            backgroundColor: "lightgray",
                            marginTop: 5,
                            padding: 0.5
                          }}
                        ></View>

                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            marginTop: 5
                          }}
                        >
                          <Image
                            source={require("../../icons/calendergray.jpg")}
                            style={{ height: 16, width: 14, marginLeft: 5 }}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              paddingTop: 2,
                              color: "gray",
                              marginLeft: 10,
                              width: 100,
                              backgroundColor: "white"
                            }}
                            numberOfLines={1}
                          >
                            Record Date:
                          </Text>
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 12,
                              marginTop: 0,
                              color: "black",
                              marginRight: 10,
                              textAlign: "right",
                              backgroundColor: "white",
                              padding: 2
                            }}
                          >
                            {itm.recorddate}
                          </Text>
                        </View>
                        <View
                          style={{
                            height: 0.5,
                            backgroundColor: "lightgray",
                            marginTop: 5
                          }}
                        ></View>

                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            marginTop: 5
                          }}
                        >
                          <Image
                            source={require("../../icons/calendergray.jpg")}
                            style={{ height: 16, width: 14, marginLeft: 5 }}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              paddingTop: 2,
                              color: "gray",
                              marginLeft: 10,
                              width: 100,
                              backgroundColor: "white"
                            }}
                            numberOfLines={1}
                          >
                            Created Date
                          </Text>
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 12,
                              marginTop: 0,
                              color: "black",
                              marginRight: 10,
                              textAlign: "right",
                              backgroundColor: "white",
                              padding: 2
                            }}
                          >
                            {itm.createddate}
                          </Text>
                        </View>
                        <View
                          style={{
                            height: 0.5,
                            backgroundColor: "lightgray",
                            marginTop: 5
                          }}
                        ></View>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            marginTop: 5
                          }}
                        >
                          <Image
                            source={require("../../icons/notes2.png")}
                            style={{ height: 16, width: 14, marginLeft: 5 }}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              paddingTop: 2,
                              color: "gray",
                              marginLeft: 10,
                              width: 100,
                              backgroundColor: "white"
                            }}
                            numberOfLines={1}
                          >
                            Result:
                          </Text>
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 12,
                              marginTop: 0,
                              color: "black",
                              marginRight: 10,
                              textAlign: "right",
                              backgroundColor: "white",
                              padding: 2
                            }}
                          >
                            {itm.result}
                          </Text>
                        </View>
                        <View
                          style={{
                            height: 0.5,
                            backgroundColor: "lightgray",
                            marginTop: 5
                          }}
                        ></View>

                        <View
                          style={{
                            flex: 1,
                            flexDirection: "column",
                            marginTop: 5,
                            backgroundColor: "white"
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              marginTop: 5,
                              backgroundColor: "white"
                            }}
                          >
                            <Image
                              source={require("../../icons/notes2.png")}
                              style={{ height: 16, width: 14, marginLeft: 5 }}
                            />
                            <Text
                              style={{
                                fontSize: 12,
                                paddingTop: 2,
                                color: "gray",
                                marginLeft: 5,
                                width: 70,
                                backgroundColor: "white"
                              }}
                            >
                              Note:
                            </Text>
                          </View>

                          <Text
                            style={{
                              flex: 1,
                              fontSize: 12,
                              marginTop: 10,
                              color: "black",
                              marginLeft: 5,
                              textAlign: "left",
                              backgroundColor: "white",
                              padding: 2
                            }}
                          >
                            {itm.note}
                          </Text>
                        </View>
                        {/* <View
                            style={{
                              height: 0.5,
                              backgroundColor: "lightgray",
                              marginTop: 5,
                            }}
                          ></View> */}
                      </View>
                    ))}

                {this.state.reportstatus == "Pending" &&
                  this.state.from == "Doctor" &&
                  this.state.from != undefined && (
                    <>
                      <View style={{}}>
                        <View
                          style={{
                            height: 100,
                            backgroundColor: "white",
                            marginRight: 15,
                            marginTop: 30,
                            borderRadius: 20,
                            borderColor: "gray",
                            borderWidth: 0.5,
                            padding: 8,
                            marginLeft: 15
                          }}
                        >
                          <TextInput
                            style={{
                              flex: 1,
                              backgroundColor: "white"
                            }}
                            value={this.state.docnote}
                            onChangeText={(text) =>
                              this.setState({ docnote: text })
                            }
                            multiline={true}
                            underlineColorAndroid="transparent"
                            placeholder="Enter your comment here..."
                            returnKeyType="done"
                            blurOnSubmit={true}
                            allowFontScaling={false}
                          />
                        </View>
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#1B2B34",
                            marginTop: 20,
                            borderRadius: 20,
                            height: 50,
                            justifyContent: "center",
                            shadowOffset: { width: 2, height: 3 },
                            shadowColor: "gray",
                            shadowOpacity: 0.9,
                            elevation: 5,
                            margin: 20
                          }}
                          onPress={this.onPressSubmit}
                        >
                          <Text
                            style={{
                              textAlign: "center",
                              alignSelf: "center",
                              fontSize: 14,
                              color: "white",
                              fontWeight: "bold"
                            }}
                          >
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
              </ScrollView>
            </View>
          ) : (
            this.state.isLoading == false &&
            this.state.activebtn == "graph" && (
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
                          maxDate={new Date()}
                          isVisible={this.state.isDateTimePickerVisible}
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
                          maxDate={new Date()}
                          onCancel={this.hideDateTimePicker}
                        ></Graphdateinput>
                      )}
                    </View>

                    {this.state.AllReportList.length <= 0 ? (
                      <NoDataAvailable onPressRefresh={this.onRefresh} />
                    ) : (
                      <>
                        <View
                          style={[
                            styles.MyhealthcardView,
                            { marginTop: 20, marginLeft: 20 }
                          ]}
                        >
                          <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            style={{
                              marginHorizontal: 30,
                              marginLeft: 5
                            }}
                          >
                            <PureChart
                              type={"line"}
                              data={this.state.AllReportList}
                              width={"100%"}
                              height={310}
                              showEvenNumberXaxisLabel={false}
                              numberOfYAxisGuideLine={10}
                              customValueRenderer={(index, point) => {
                                if (index == 0) return null;
                                return (
                                  <View style={{ flex: 1, marginTop: 150 }}>
                                    <Text
                                      style={{
                                        textAlign: "center",
                                        fontSize: 9,
                                        fontWeight: "bold",
                                        marginLeft: 12,
                                        marginTop: 100,
                                        paddingTop: 10
                                      }}
                                    >
                                      {"\n\n"}
                                      {point.y}
                                    </Text>
                                  </View>
                                );
                              }}
                            />
                          </ScrollView>
                        </View>
                        {/* <Chart
                          style={{
                            height: "90%",
                            width: "100%",
                            backgroundColor: "#fff",
                          }}
                          xDomain={{ min: -2, max: 10 }}
                          yDomain={{ min: -2, max: 20 }}
                          padding={{ left: 40, bottom: 20, right: 20, top: 20 }}
                          // padding={{ left: 20, top: 10, bottom: 10, right: 10 }}
                          viewport={{ size: { width: 5 } }}
                          data={this.state.responsiveLineData}
                        >
                          <VerticalAxis tickValues={this.state.Yaxios} />
                           <HorizontalAxis tickCount={3} /> 
                          <Line
                            smoothing="bezier"
                            tension={0.15}
                            theme={{ stroke: { color: "blue", width: 2 } }}
                          />
                        </Chart> */}
                        {/* <ScrollView
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          style={{
                            marginHorizontal: 30,
                            marginLeft: 5,
                          }}
                        >
                          <LineChart
                            data={data}
                            width={screenWidth}
                            height={220}
                            chartConfig={{
                              backgroundColor: "#e26a00",
                              backgroundGradientFrom: "#fb8c00",
                              backgroundGradientTo: "#ffa726",
                              decimalPlaces: 2, // optional, defaults to 2dp
                              color: (opacity = 1) =>
                                `rgba(255, 255, 255, ${opacity})`,
                              labelColor: (opacity = 1) =>
                                `rgba(255, 255, 255, ${opacity})`,
                              style: {
                                borderRadius: 16,
                              },
                              propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#ffa726",
                              },
                            }}
                            // chartConfig={chartConfig}
                          />
                        </ScrollView> */}
                        {/* new graph */}
                        {/* <View
                          style={[styles.MyhealthcardView, { marginTop: 20 }]}
                        >
                          <ScrollView style={{ flex: 1, margin: 0 }}>
                            <View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  paddingVertical: verticalScale(8),
                                  padding: scale(10),
                                }}
                              >
                                <YAxis
                                  data={this.state.Yaxios}
                                  contentInset={{
                                    top: verticalScale(10),
                                    bottom: verticalScale(10),
                                  }}
                                  style={{
                                    height: verticalScale(300),
                                    width: scale(30),
                                    marginRight: scale(-3),
                                    borderRightColor: "gray",
                                    borderRightWidth: 1,
                                  }}
                                  svg={{
                                    fill: "grey",
                                    fontSize: 10,
                                  }}
                                  numberOfTicks={10}
                                  yAccessor={({ index }) => index}
                                  formatLabel={(value) => `${value}`}
                                  spacingInner={0.5}
                                />
                                <ScrollView
                                  horizontal={true}
                                  showsHorizontalScrollIndicator={false}
                                  style={{
                                    marginHorizontal: 30,
                                    marginLeft: 5,
                                  }}
                                >
                                  <View
                                    style={{
                                      flex: 1,
                                      width:
                                        this.state.Oxygraph.length < 3
                                          ? scale(
                                              this.state.Oxygraph.length * 100
                                            )
                                          : scale(
                                              this.state.Oxygraph.length * 80
                                            ),
                                    }}
                                  >
                                    <View
                                      style={{
                                        flex: 1,
                                        height: verticalScale(300),
                                      }}
                                    >
                                      <LineChart
                                        style={{
                                          flex: 1,
                                        }}
                                        data={this.state.Oxygraph}
                                        // data={[23, 43]}
                                        gridMin={0}
                                        svg={{ stroke: "rgb(134, 65, 244)" }}
                                        // svg={{ fill: "#61dafb" }} //#61dafb,#00ccff
                                        contentInset={{
                                          top: 10,
                                          bottom: 10,
                                        }}
                                        // spacing={0.9}
                                        gridMin={0}
                                        curve={shape.curveLinear}
                                        spacingInner={
                                          this.state.Oxygraph.length < 3
                                            ? this.state.Oxygraph.length == 1
                                              ? 0.3
                                              : 0.7
                                            : 0.6
                                        }
                                        spacingOuter={
                                          this.state.Oxygraph.length < 3
                                            ? this.state.Oxygraph.length == 2
                                              ? 0.2
                                              : 0.5
                                            : 0.1
                                        }
                                      >
                                        <Grid />
                                        <HorizontalLine />
                                        <Tooltip />
                                      </LineChart>
                                    </View>

                                    <XAxis
                                      style={{ flex: 0.3 }}
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
                        </View> */}
                      </>
                    )}
                  </View>
                </ScrollView>
              </View>
            )
          )}
        </View>
        <ActionButton
          style={{
            marginRight: 60,
            alignItems: "center",
            bottom: 15
          }}
          buttonColor="#275BB4"
          onPress={() =>
            this.props.navigation.navigate("Oxygen", {
              refresh: true
            })
          }
        />
      </Container>
      // </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: 0,

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
  },
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 5,
    marginLeft: Platform.OS === "ios" ? 15 : 5,
    marginRight: Platform.OS === "ios" ? 15 : 5,
    marginTop: Platform.OS === "ios" ? 10 : 15,
    marginBottom: Platform.OS === "ios" ? 2 : 1,
    borderRadius: Platform.OS === "ios" ? 5 : 2,
    elevation: 2,
    margin: 10,
    backgroundColor: "#fff"
  }
});
