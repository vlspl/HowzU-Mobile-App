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
  NativeModules
} from "react-native";
import { Container, Header } from "native-base";

import NoDataAvailable from "../appComponents/NoDataAvailable";
import Graphdateinput from "../appComponents/Graphdateinput";
import CustomFooter from "../appComponents/CustomFooter";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import axios from "axios";
import ActionButton from "react-native-action-button";
import PureChart from "react-native-pure-chart";
import moment from "moment";
import Toast from "react-native-tiny-toast";
const screenWidth = Math.round(Dimensions.get("window").width);
const { StatusBarManager } = NativeModules;

var responseMain = [];

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

export default class Myhealthgraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activebtn: "doctor",
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
      isShowDataPicker: false,
      isDateTimePickerVisible: false
    };
  }

  OpenDrawer = () => {
    this.props.navigation.goBack();
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   " Health graph componentWillReceiveProps==============================",
    //   nextProp
    // );
    //this.setState({selectedtestId: nextProp.route.params.UserId });
    this.setState(
      {
        pageNo: 1,
        isLoading: true,
        AllReportList: [],
        healthName: nextProp.route.params.info.Name,
        result: nextProp.route.params.info.Result,
        value: nextProp.route.params.info.Value,
        unit: nextProp.route.params.info.Unit
      },
      () => {
        this.ReportDetailCall();
      }
    );
  };

  componentDidMount = async () => {
    // console.log(" HEAlth componentDidMount==============================");
    this.setState(
      {
        isLoading: true,
        AllReportList: [],
        healthName: this.props.route.params.info.Name,
        result: this.props.route.params.info.Result,
        value: this.props.route.params.info.Value,
        unit: this.props.route.params.info.Unit
      },
      () => {
        this.ReportDetailCall();
      }
    );
  };

  onPressBookTest = () => {
    // console.log("onPressMyDoctor=================");
    this.props.navigation.navigate("ChooseBookingScreen");
  };

  onPressMyPatient = () => {
    // console.log("onPressMyDoctor=================");
    this.props.navigation.navigate("MyPatients");
  };

  onPressProfile = () => {
    // console.log("onPressProfile=================");
    this.props.navigation.navigate("UserProfile");
  };

  onSelectFromDate = (date) => {
    this.setState({ fromdate: date, isDateTimePickerVisible: false }, () => {
      if (this.state.todate == "") {
      } else {
        responseMain = [];
        //this.setState({isLoading: true, responseMain = []})

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
    //let info = this.state.ApprovedRequestList[index];
    // if (this.state.fromdate == ''){

    this.setState({ todate: date, isShowDataPicker: false }, () => {
      if (this.state.fromdate == "") {
      } else {
        responseMain = [];
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
  async ReportDetailCall() {
    // http://endpoint.visionarylifescience.com/Patient/MyHealthAnaylteDetails?Anayltename=BMI
    try {
      const response = await axios.get(Constants.GET_BMI_GRAPH_DETAILS);

      this.setState({ isLoading: false });
      if (response.data.Status) {
        //Toast.show(response.data.Msg)
        // let responseData = this.state.AllReportList;
        let responseData = [];
        responseMain = [];

        response.data.HealthList.map((item) => {
          if (Number(item.Value) < 100) {
            // console.log(item.Value);
            let temp = {};
            // temp.x = moment(item.Date, "MMM DD YYYY hh:mm A").format(
            //   " DD MMM YY"
            // );
            temp.x = moment(item.Date).format(" DD MMM YY");
            temp.y = Number(item.Value);
            responseData.push(temp);
          }
        });

        /// response.data.HealthList.map((itemm) => {
        let tempp = {};
        let dummy = {};
        dummy.x = " ";
        dummy.y = 0;
        const newAray = [];
        newAray.push(dummy);
        const combinew = newAray.concat(responseData);

        tempp.seriesName = "series1";
        tempp.color = "#297AB1";
        // tempp.data = responseData;
        tempp.data = combinew;
        responseMain.push(tempp);
        //});

        // console.log(
        //   "&&&&&============= response main",
        //   JSON.stringify(responseMain)
        // );

        this.setState({
          AllReportList: responseMain,
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      } else {
        Toast.show(response.data.Msg);
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
    try {
      let response = await axios.post(Constants.BYDATES_GRAPH, {
        AnalyteName: this.state.healthName,
        StartDate: moment(this.state.fromdate).format("YYYY-MM-DD"),
        EndDate: moment(this.state.todate).format("YYYY-MM-DD")
      });
      // console.log("by date data==============", response.data);
      this.setState({ isLoading: false });

      if (response.data.Status) {
        var responseData = [];
        responseMain = [];

        response.data.HealthList.map((item) => {
          if (Number(item.Value) < 55) {
            // console.log("&&&&&&&&&", item);
            let temp = {};
            // temp.x = moment(item.Date, "MMM DD YYYY hh:mm A").format(
            //   " DD MMM YY"
            // );
            temp.x = moment(item.Date).format("DD MMM YY");
            temp.y = Number(item.Value);
            responseData.push(temp);
          }
        });

        /// response.data.HealthList.map((itemm) => {
        let tempp = {};
        let dummy = {};
        dummy.x = " ";
        dummy.y = 50;
        const newAray = [];
        newAray.push(dummy);

        const combinew = newAray.concat(responseData);

        tempp.seriesName = "series1";
        tempp.color = "#297AB1";
        // tempp.data = responseData;
        tempp.data = combinew;
        responseMain.push(tempp);
        //});

        // console.log("=============", JSON.stringify(responseMain));

        this.setState({
          AllReportList: responseMain,
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      } else {
        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      }
    } catch (errors) {
      ///Toast.show(errors)
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        refreshing: false
      });

      // console.log(errors);
    }
  };

  render() {
    const { StatusBarManager } = NativeModules;
    const STATUSBAR_HEIGHT =
      Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;
    // console.log("statusheight===", StatusBarManager.HEIGHT);

    const { navigate } = this.props.navigation;
    const screenWidth = Math.round(Dimensions.get("window").width);
    // console.log(
    //   JSON.stringify(this.state.AllReportList),
    //   "&&^^^^^^my health graph"
    // );
    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <StatusBarPlaceHolder />

        <View style={styles.MainContainer}>
          <ImageBackground
            source={require("../../icons/home-bg.png")}
            style={{
              width: screenWidth,
              height: 160,
              marginTop: 0,
              backgroundColor: "white",
              flexDirection: "column"
            }}
            resizeMode="stretch"
          >
            <View
              style={{
                height: 50,
                backgroundColor: "transparent",
                flexDirection: "row",
                marginTop: 5
              }}
            >
              <TouchableOpacity
                style={{ padding: 5 }}
                // style={{ marginLeft: 8, height: 25, width: 25, marginTop: 5 }}
                onPress={this.OpenDrawer}
              >
                <Image
                  style={{ height: 25, width: 25 }}
                  source={require("../../icons/back.png")}
                ></Image>
              </TouchableOpacity>

              <Text
                style={{
                  textAlign: "left",
                  fontSize: 20,
                  flex: 1,
                  marginLeft: 15,
                  height: 40,
                  color: "white",
                  justifyContent: "center",
                  alignSelf: "center"
                }}
              >
                {this.state.healthName + " History"}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingLeft: 20,
                margintop: 0,
                backgroundColor: "transparent",
                width: screenWidth,
                height: 60
              }}
            >
              <View style={{ flex: 0.5, backgroundColor: "transparent" }}>
                <Text
                  style={{
                    textAlign: "left",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 16,
                    marginLeft: 2,
                    flex: 1,
                    marginTop: 2
                  }}
                >
                  {this.state.healthName}
                </Text>
                <Text
                  style={{
                    textAlign: "left",
                    color: "white",
                    fontSize: 20,
                    marginLeft: 2,
                    flex: 1
                  }}
                >
                  {this.state.value + this.state.unit}
                </Text>
              </View>
              <View style={{ flex: 0.3, backgroundColor: "transparent" }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    backgroundColor: "transparent",
                    color: "white",
                    fontSize: 13,
                    marginLeft: 2,
                    flex: 1,
                    marginTop: 4
                  }}
                >
                  {this.state.result}
                </Text>
              </View>
              <View
                style={{
                  flex: 0.2,
                  backgroundColor: "transparent",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    height: 45,
                    width: 45,
                    borderRadius: 22.5,
                    borderColor: "lightgray",
                    borderWidth: 1,
                    marginTop: 4,
                    overflow: "hidden"
                  }}
                >
                  <Image
                    style={{ height: 45, width: 45 }}
                    source={require("../../icons/booktest.jpg")}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    alignContent: "center",
                    justifyContent: "center"
                  }}
                ></View>
              </View>
            </View>
          </ImageBackground>
          <View style={{ flex: 1, backgroundColor: "red" }}>
            <ScrollView
              alwaysBounceVertical={true}
              showsHorizontalScrollIndicator={false}
              style={{ backgroundColor: "white", marginTop: 0 }}
            >
              <View style={{ paddingLeft: 10 }}>
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
                      maxDate={new Date()}
                      onPress={() =>
                        this.setState({
                          isDateTimePickerVisible:
                            !this.state.isDateTimePickerVisible
                        })
                      }
                      onCancel={() =>
                        this.setState({
                          isDateTimePickerVisible:
                            !this.state.isDateTimePickerVisible
                        })
                      }
                      isVisible={this.state.isDateTimePickerVisible}
                    ></Graphdateinput>
                  ) : (
                    <Graphdateinput
                      maxDate={new Date()}
                      placeholder="Start Date"
                      onDateChange={this.onChangeSelectFromDate}
                      date={this.state.fromdate}
                      onPress={() =>
                        this.setState({
                          isDateTimePickerVisible:
                            !this.state.isDateTimePickerVisible
                        })
                      }
                      onCancel={() => this.hideDateTimePicker}
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
                      maxDate={new Date()}
                      isVisible={this.state.isShowDataPicker}
                      onPress={() => {
                        this.setState({
                          isShowDataPicker: !this.state.isShowDataPicker
                        });
                      }}
                      onCancel={() => {
                        this.setState({
                          isShowDataPicker: !this.state.isShowDataPicker
                        });
                      }}
                    ></Graphdateinput>
                  ) : (
                    <Graphdateinput
                      placeholder="End Date"
                      onDateChange={this.onChangeSelectToDate}
                      date={this.state.todate}
                      isVisible={this.state.isShowDataPicker}
                      onPress={() => {
                        this.setState({
                          isShowDataPicker: !this.state.isShowDataPicker
                        });
                      }}
                      onCancel={() => this.hideDateTimePicker}
                      maxDate={new Date()}
                    ></Graphdateinput>
                  )}
                </View>

                {this.state.AllReportList.length <= 0 ? (
                  <NoDataAvailable onPressRefresh={this.onRefresh} />
                ) : (
                  <View style={[styles.MyhealthcardView, { marginTop: 20 }]}>
                    <PureChart
                      type={"line"}
                      data={this.state.AllReportList}
                      width={"100%"}
                      height={300}
                      showEvenNumberXaxisLabel={false}
                      customValueRenderer={(index, point) => {
                        if (index === 0) return null;
                        return (
                          <View style={{ flex: 1, marginTop: 120 }}>
                            <Text
                              style={{
                                textAlign: "center",
                                fontSize: 9,
                                fontWeight: "bold",
                                marginLeft: 10,
                                marginTop: 130
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
        </View>

        <ActionButton
          style={{
            marginRight: 60,
            alignItems: "center",
            bottom: 15
          }}
          buttonColor="#275BB4"
          onPress={() =>
            this.props.navigation.navigate("BMIGender", {
              refresh: true
            })
          }
        />
      </Container>
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
  }
});
