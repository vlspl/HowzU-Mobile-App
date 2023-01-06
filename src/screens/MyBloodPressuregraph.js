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
  TextInput
} from "react-native";
import { Container, Header } from "native-base";
import CustomeHeader from "../appComponents/CustomeHeader";
import Toast from "react-native-tiny-toast";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import Graphdateinput from "../appComponents/Graphdateinput";
import AsyncStorage from "@react-native-community/async-storage";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import axios from "axios";
import ActionButton from "react-native-action-button";
import PureChart from "react-native-pure-chart";
import moment from "moment";

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

export default class MyBloodPressuregraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userrole: "",
      isloading: false,
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
        activebtn: "report"
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
        reportDetailArr: []
      },
      () => {
        this.ReportDetailCall();
      }
    );
  };

  async ReportDetailCall() {
    try {
      const response = await axios.get(
        Constants.GET_HEALTH_PARAMETER_BLOODPRESSURE
      );

      // console.log(response.data, "my blood pressure data ");

      this.setState({ isLoading: false });
      if (response.data.Status) {
        let responseData = [];
        let responseData1 = [];
        let responseMain = [];
        let reports = [];
        response.data.List.map((item) => {
          let tempreport = {};
          let temp = {};
          let temp1 = {};
          let str = item.Name.split("/");
          let num1 = str[0];
          let num2 = str[1];
          temp.x = moment(item.RecordDate).format("DD MMM YY");

          temp.y = Number(num1);

          temp1.x = moment(item.RecordDate).format("DD MMM YY");
          temp1.y = Number(num2);

          responseData.push(temp);
          responseData1.push(temp1);
          tempreport.systolic = Number(num1);
          tempreport.diastolic = Number(num2);
          tempreport.pulse = item.PulseRate;
          tempreport.note = item.Notes;
          tempreport.result = item.Result;
          tempreport.recorddate = moment(item.RecordDate).format("DD/MM/YYYY");
          tempreport.createddate = moment(item.CreatedDate).format(
            "DD/MM/YYYY"
          );
          reports.push(tempreport);
        });

        let tempp = {};
        let tempp2 = {};
        let dummy = {};
        dummy.x = " ";
        dummy.y = 100;
        const newAray = [];
        newAray.push(dummy);

        const combinew = newAray.concat(responseData);
        const newseries1 = newAray.concat(responseData1);
        tempp.seriesName = "series1";
        tempp.color = "#297AB1";
        // tempp.data = responseData;
        tempp.data = combinew;
        tempp2.seriesName = "series2";
        tempp2.color = "#297AB1";
        // tempp2.data = responseData1;
        tempp2.data = newseries1;
        responseMain.push(tempp);
        responseMain.push(tempp2);

        console.log(
          "&&&&&=============  Blood Pressure  response main",
          JSON.stringify(responseMain)
        );

        this.setState({
          //   AllReportList: responseData,
          reportDetailArr: reports,
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
  }

  showGraphUsingDates = async () => {
    // console.log(
    //   "this.state.fromdate",
    //   this.state.fromdate,
    //   "this.state.todate",
    //   this.state.todate,
    //   "type of",
    //   typeof this.state.fromdate,
    //   "///",
    //   typeof this.state.todate
    // );
    try {
      let response = await axios.post(Constants.GET_BLOODPRESURE_BYDATES, {
        FromDate: moment(this.state.fromdate).format("DD/MM/YYYY"),
        ToDate: moment(this.state.todate).format("DD/MM/YYYY")
      });
      // console.log(response.data, "$$%%%% by dates my blood pressure data ");

      this.setState({ isLoading: false });
      if (response.data.Status) {
        let responseData = [];
        let responseData1 = [];
        let responseMain = [];

        response.data.List.map((item) => {
          let temp = {};
          let temp1 = {};
          let str = item.Name.split("/");
          let num1 = str[0];
          let num2 = str[1];
          temp.x = moment(item.RecordDate, "YYYY-MM-DD hh:mm A ").format(
            "DD MMM YY"
          );

          temp.y = Number(num1);

          temp1.x = moment(item.RecordDate, "YYYY-MM-DD hh:mm A ").format(
            "DD MMM YY"
          );
          temp1.y = Number(num2);

          // console.log(str, "^^^&&&&&", num1, num2);

          responseData.push(temp);
          responseData1.push(temp1);
        });

        let tempp = {};
        let tempp2 = {};
        let dummy = {};
        dummy.x = " ";
        dummy.y = 100;
        const newAray = [];
        newAray.push(dummy);

        const combinew = newAray.concat(responseData);
        const newseries1 = newAray.concat(responseData1);

        tempp.seriesName = "series1";
        tempp.color = "#297AB1";
        // tempp.data = responseData;
        tempp.data = combinew;
        tempp2.seriesName = "series2";
        tempp2.color = "#297AB1";
        // tempp2.data = responseData1;
        tempp2.data = newseries1;
        responseMain.push(tempp);
        responseMain.push(tempp2);

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
    this.setState({ fromdate: date, isDateTimePickerVisible: false }, () => {
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
    });
  };
  onSelectToDate = (date) => {
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
  garphPressed = () => {
    console.log('////////??:::::""""@@@!!!!!');
    this.setState(
      {
        activebtn: "graph",
        fromdate: "",
        todate: "",
        // isLoading: true,
        AllReportList: [],
        reportDetailArr: []
      },
      () => {
        this.ReportDetailCall;
      }
    );
  };

  render() {
    const { StatusBarManager } = NativeModules;
    const STATUSBAR_HEIGHT =
      Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;
    //console.log("active btn===", this.state.activebtn);

    const { navigate } = this.props.navigation;
    const screenWidth = Math.round(Dimensions.get("window").width);
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : 0}
      >
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
                    <Text style={{ fontSize: 14, color: "#1d303f" }}>
                      Report
                    </Text>
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
                    <Text style={{ fontSize: 14, color: "#1d303f" }}>
                      Graph
                    </Text>
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
                                source={require("../../icons/heartgray1.png")}
                                style={{ height: 16, width: 16, marginLeft: 5 }}
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
                                Systolic (mmHg)
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
                                source={require("../../icons/heartgray1.png")}
                                style={{ height: 16, width: 16, marginLeft: 5 }}
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
                                Diastolic (mmHg)
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
                                {itm.diastolic}
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
                          // marginLeft: 30,
                          // marginRight: 10,
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
                            maxDate={new Date()}
                            onCancel={this.hideDateTimePicker}
                            isVisible={this.state.isDateTimePickerVisible}
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
                            maxDate={new Date()}
                            onCancel={this.hideDateTimePicker}
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
                            onCancel={this.hideDateTimePicker}
                            maxDate={new Date()}
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

                      {this.state.AllReportList.length <= 0 ? (
                        <NoDataAvailable onPressRefresh={this.onRefresh} />
                      ) : (
                        <View
                          style={[styles.MyhealthcardView, { marginTop: 20 }]}
                        >
                          <PureChart
                            type={"line"}
                            data={this.state.AllReportList}
                            width={"100%"}
                            height={310}
                            showEvenNumberXaxisLabel={false}
                            customValueRenderer={(index, point) => {
                              // console.log(index, "index");
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
                        </View>
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
              this.props.navigation.navigate("BloodPressure", {
                refresh: true
              })
            }
          />
        </Container>
      </KeyboardAvoidingView>
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
