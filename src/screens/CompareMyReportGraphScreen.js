import React, { Component } from "react";
import * as d3scale from "d3-scale";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions
} from "react-native";
// import {
//   BarChart,
//   XAxis,
//   YAxis,
//   Grid,
//   LineChart
// } from "react-native-svg-charts";
import { BarChart, LineChart } from "react-native-gifted-charts";

import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import PureChart from "react-native-pure-chart";

import { Container } from "native-base";
import CustomeHeader from "../appComponents/CustomeHeader";
import axios from "axios";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import moment from "moment";
const Rijndael = require("rijndael-js");
global.Buffer = global.Buffer || require("buffer").Buffer;
const padder = require("pkcs7-padding");
import Toast from "react-native-tiny-toast";

function range(start, end, step, offset) {
  console.log("start", start, "end ", end);
  let strt = Math.round(start / 10) * 10;
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

  // console.log(len > 1 && len < 2, "??????///len", len);
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

const Labels = ({ x, y, bandwidth, data }) =>
  data.map((value, index) => (
    <Text
      key={index}
      x={x(index) + bandwidth / 2}
      y={value < 20 ? y(value) - 10 : y(value) + 15}
      fontSize={14}
      fill={value >= 20 ? "white" : "black"}
      alignmentBaseline={"middle"}
      textAnchor={"middle"}
    >
      {value}
    </Text>
  ));
function IsvalueBetweenRange(RefArray, value) {
  let ref1 = RefArray[0];
  let ref2 = RefArray[1];
  // console.log("ref1==============================", ref1);
  // console.log("ref2==============================", ref2);
  // console.log("value==============================", value);

  if (
    parseFloat(value) >= parseFloat(ref1) &&
    parseFloat(value) <= parseFloat(ref2)
  ) {
    return "Yes";
  } else if (parseFloat(value) < parseFloat(ref1)) {
    return "Low";
  } else {
    return "No";
  }
}

export default class CompareMyReportGraphScreen extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      activebtn: "report",
      reportDetailArr: [],
      subReportDetails: [],
      subReportGraphData: [],
      allgraphdata: [],
      UserId: "",
      ReportId: "",
      from: "",
      testid: 0,
      testname: "",
      data: [],
      datasets: [],
      chartData: {},
      commentmodal: false,
      doccomment: [],
      from: "",
      docnote: "",
      flag: "",
      editcommetn: false,
      status: "",
      Familymemberid: 0,
      Yaxis: [],
      plotGraph: [],
      min: 0,
      max: 0,
      newcomplexgraph: [],
      maxploting: 0
    };

    // this.hardwarebBackAction = this.hardwarebBackAction.bind(this);
    // console.log('constructort==============================');
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    console.log("------", nextProp.route.params);
    this.setState(
      {
        isLoading: true,
        reportDetailArr: [],
        subReportDetails: [],
        subReportGraphData: [],
        allgraphdata: [],
        Yaxis: [],
        plotGraph: [],
        testid: nextProp.route.params.labinfo.sTestId,
        testname: nextProp.route.params.labinfo.TestName,
        flag: nextProp.route.params.labinfo.Flag,

        min: 0,
        max: 0
      },
      () => {
        this.ReportDetailCall();
      }
    );
    // }
  };
  hardwarebBackAction = () => {
    if (this.props.route.params == "") {
      this.props.navigation.navigate("MyReports", { refresh: "true" });
      // this.props.navigation.goBack();
      return true;
    } else {
      // this.props.navigation.navigate('PatientSharedReport', {
      //   refresh: 'true',
      // });
      this.props.navigation.goBack();
      return true;
    }
  };

  componentDidMount = () => {
    console.log("------", this.props.route.params);
    this.setState(
      {
        isLoading: true,
        reportDetailArr: [],
        subReportDetails: [],
        subReportGraphData: [],
        allgraphdata: [],
        Yaxis: [],
        plotGraph: [],
        flag: this.props.route.params.labinfo.Flag,
        testid: this.props.route.params.labinfo.sTestId,
        testname: this.props.route.params.labinfo.TestName,
        min: 0,
        max: 0
      },
      () => {
        this.ReportDetailCall();
      }
    );
  };

  Decrypt = (encryptStr) => {
    if (encryptStr) {
      const cipher = new Rijndael("1234567890abcder", "cbc");
      const plaintext = Buffer.from(
        cipher.decrypt(
          new Buffer(encryptStr, "base64"),
          128,
          "1234567890abcder"
        )
      );
      const decrypted = padder.unpad(plaintext, 32);
      const clearText = decrypted.toString("utf8");

      // console.log(clearText, 'Decypt report ');
      return clearText.toString();
    } else return "";
  };

  groupBy = (array, key) => {
    // Return the end result
    return array.reduce((result, currentValue) => {
      console.log("result[currentValue[key]", result[currentValue[key]]);
      console.log(result, "reducer function"); //first time {}
      console.log(currentValue, "currentValue function"); //1st time 1st   onject

      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      console.log(result, "befor returning the results>>>.");
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
  };

  async ReportDetailCall() {
    this.setState({ isLoading: true }); //OldReport
    if (this.state.flag == "OldReport") {
      try {
        console.log("ols test id ===");
        const response = await axios.post(Constants.COMPARE_OLDREPORTGRAPH, {
          ParameterName: this.state.testname
        });
        this.setState({ isLoading: false });

        if (response.data.Status) {
          let responseData = [];

          let Yaxiosdata = [];

          let refrange = "";
          let xaxiosdata = [];
          let dataplot = [];

          var values = [];

          var RefArray = [];

          let dt = [];

          response.data.ReportData.map((element) => {
            refrange = "";
            RefArray = [];
            dataplot = [];
            Yaxiosdata = [];
            xaxiosdata = [];
            values = [];
            refrange = element.MinRange + "-" + element.MaxRange;
            // refrange = element.Female != "" ? element.Female : element.Male;
            RefArray = refrange.split("-");
            // console.log(element.SubAnalyte, "subanlyet==", element);
            dt = element.TestDate.split(",");

            let temp = {};
            temp.Analyte = "Parameter";
            temp.Subanalyte = element.ParameterName;
            for (let i = 0; i < dt.length; i++) {
              let yaxios = Number(this.Decrypt(dt[i + 1]));
              let value = isNaN(yaxios) ? 0 : yaxios;

              let Inrange = IsvalueBetweenRange(RefArray, value);
              // console.log(Inrange, "/////$$%%%%%@@@@@");
              let datesetX = {};
              let tmp = {};
              values.push(value);
              let minvalue = Math.min.apply(null, values);
              let maxvalue = Math.max.apply(null, values);
              if (maxvalue == 0 && maxvalue < 1) {
                Yaxiosdata = range(0, RefArray[1]);
              } else if (maxvalue < 1) {
                Yaxiosdata = range(0, RefArray[1]);
              } else {
                Yaxiosdata = range(0, maxvalue);
              }
              if (Inrange == "Yes") {
                datesetX.date = moment(dt[i], "DD/MM/YYYY").format(
                  "DD MMM YYYY"
                );
                tmp.date = moment(dt[i], "DD/MM/YYYY").format("DD MMM YYYY");
                tmp.value = value;
                tmp.label = moment(dt[i], "DD/MM/YYYY").format("DD MMM YY");
                tmp.frontColor = "green";

                tmp.svg = {
                  fill: "green"
                };
                xaxiosdata.push(datesetX);
                dataplot.push(tmp);
              } else if (Inrange == "Low") {
                datesetX.date = moment(dt[i], "DD/MM/YYYY").format(
                  "DD MMM YYYY"
                );
                tmp.date = moment(dt[i], "DD/MM/YYYY").format("DD MMM YYYY");
                tmp.value = value;
                tmp.label = moment(dt[i], "DD/MM/YYYY").format("DD MMM YY");

                tmp.frontColor = "indianred";
                tmp.svg = {
                  fill: "indianred"
                };

                xaxiosdata.push(datesetX);
                dataplot.push(tmp);
              } else {
                datesetX.date = moment(dt[i], "DD/MM/YYYY").format(
                  "DD MMM YYYY"
                );
                tmp.date = moment(dt[i], "DD/MM/YYYY").format("DD MMM YYYY");
                tmp.value = value;
                tmp.label = moment(dt[i], "DD/MM/YYYY").format("DD MMM YY");
                tmp.frontColor = "red";
                tmp.svg = {
                  fill: "red"
                };
                xaxiosdata.push(datesetX);
                dataplot.push(tmp);
              }

              i++;
            }
            const desendingsortarrydata = dataplot.sort(function (a, b) {
              return new Date(b.label) - new Date(a.label);
            });
            // console.log("outsudie of map dataplot======", dataplot);
            temp.data = desendingsortarrydata; //dataplot;
            temp.xaxiosdata = xaxiosdata;
            temp.yaxios = Yaxiosdata;
            temp.min = RefArray[0];
            temp.max = RefArray[1];

            responseData.push(temp);
          });

          this.setState({
            allgraphdata: xaxiosdata,
            min: RefArray[0],
            max: RefArray[1],
            Yaxis: Yaxiosdata,
            plotGraph: dataplot,
            isLoading: false,
            paginationLoading: false,
            searchLoading: false,
            refreshing: false,
            newcomplexgraph: responseData,
            from: ""
          });
        } else {
          // Toast.show(response.data.Msg);
          this.setState({
            isLoading: false,
            paginationLoading: false,
            searchLoading: false,
            refreshing: false,
            reportDetailArr: [],
            subReportDetails: [],
            subReportGraphData: []
          });
        }
      } catch (error) {
        console.log(error, "********$$$$");
        Toast.show("Something Went Wrong, Please Try Again Later");

        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false,
          reportDetailArr: [],
          subReportDetails: [],
          subReportGraphData: []
        });
      }
    } else {
      try {
        console.log(this.state.testid, "test id ");
        const response = await axios.get(
          Constants.COMPARE_REPORTGRAPH + "TestId=" + this.state.testid
        );

        console.log(">>><<<<<<", response.data, "for the lab reports ");
        this.setState({ isLoading: false });
        if (response.data.Status) {
          let responseData = [];

          let Yaxiosdata = [];

          let refrange = "";
          let xaxiosdata = [];
          let dataplot = [];

          var values = [];

          var RefArray = [];

          let dt = [];

          response.data.ReportData.map((element) => {
            refrange = "";
            RefArray = [];
            dataplot = [];
            Yaxiosdata = [];
            xaxiosdata = [];
            refrange = element.Female != "" ? element.Female : element.Male;
            RefArray = refrange.split("-");

            console.log(element, "subanlyet==");
            dt = element.TestDate.split(",");
            console.log(dt, "after splic test dteag==");
            let temp = {};
            temp.Analyte = element.Analyte;
            temp.Subanalyte = element.SubAnalyte;
            values = [];
            for (let i = 0; i < dt.length; i++) {
              console.log(dt[i], "==========/////date ");
              let yaxios = Number(this.Decrypt(dt[i + 1]));
              let value = isNaN(yaxios) ? 0 : yaxios;

              let Inrange = IsvalueBetweenRange(RefArray, value);
              let datesetX = {};
              let tmp = {};
              let giftedchartdata = {};
              values.push(value);
              let minvalue = Math.min.apply(null, values);
              let maxvalue = Math.max.apply(null, values);

              if (maxvalue == 0 && maxvalue < 1) {
                Yaxiosdata = range(0, RefArray[1]);
              } else if (maxvalue < 1) {
                Yaxiosdata = range(0, RefArray[1]);
              } else {
                Yaxiosdata = range(0, Math.ceil(maxvalue));
              }
              if (Inrange == "Yes") {
                datesetX.date = moment(dt[i], "DD/MM/YYYY").format(
                  "DD MMM YYYY"
                );
                datesetX.forsoring = moment(dt[i]).format("DD/MM/YYYY");
                // tmp.date = moment(dt[i], "DD/MM/YYYY").format("DD MMM YYYY");
                tmp.date = moment(dt[i]).format("DD/MM/YYYY");

                tmp.value = value;
                tmp.svg = {
                  fill: "green"
                };
                tmp.label = moment(dt[i], "DD/MM/YYYY").format("DD MMM YY");
                // giftedchartdata.value = value;

                tmp.frontColor = "green";
                tmp.sideColor = "#7FFF00";
                tmp.topColor = "#66CD00";
                xaxiosdata.push(datesetX);

                dataplot.push(tmp);
                // responseData.push(tmp);
              } else if (Inrange == "Low") {
                // console.log(dt[i], "Low");
                datesetX.date = moment(dt[i], "DD/MM/YYYY").format(
                  "DD MMM YYYY"
                );
                datesetX.forsoring = moment(dt[i]).format("DD/MM/YYYY");

                // tmp.date = moment(dt[i], "DD/MM/YYYY").format("DD MMM YYYY");
                tmp.date = moment(dt[i]).format("DD/MM/YYYY");
                tmp.value = value;
                tmp.svg = {
                  fill: "indianred"
                };
                giftedchartdata.label = moment(dt[i], "DD/MM/YYYY").format(
                  "DD MMM YYYY"
                );
                giftedchartdata.value = value;
                tmp.label = moment(dt[i], "DD/MM/YYYY").format("DD MMM YY");
                // giftedchartdata.value = value;

                tmp.frontColor = "indianred";
                tmp.sideColor = "#CC6666";
                tmp.topColor = "#CD5C5C";
                giftedchartdata.frontColor = "indianred";
                xaxiosdata.push(datesetX);

                dataplot.push(tmp);
                // responseData.push(tmp);
              } else {
                datesetX.date = moment(dt[i], "DD/MM/YYYY").format(
                  "DD MMM YYYY"
                );
                datesetX.forsoring = moment(dt[i]).format("DD/MM/YYYY");

                // tmp.date = moment(dt[i], "DD/MM/YYYY").format("DD MMM YYYY");
                tmp.date = moment(dt[i]).format("DD/MM/YYYY");

                tmp.value = value;
                tmp.svg = {
                  fill: "red"
                };
                tmp.label = moment(dt[i], "DD/MM/YYYY").format("DD MMM YY");

                tmp.frontColor = "red";
                tmp.sideColor = "#B8OFOA";
                tmp.topColor = "#CA3433";
                giftedchartdata.label = moment(dt[i], "DD/MM/YYYY").format(
                  "DD MMM YYYY"
                );
                giftedchartdata.value = value;

                giftedchartdata.frontColor = "red";
                xaxiosdata.push(datesetX);
                // changed thisfor gifted chart the data requirement is different
                dataplot.push(tmp);
                // dataplot.push(giftedchartdata);
              }

              i++;
            }
            const desendingsortarrydata = dataplot.sort(function (a, b) {
              return new Date(b.label) - new Date(a.label);
            });
            const xaxiosorting = xaxiosdata.sort(function (a, b) {
              return new Date(b.date) - new Date(a.date);
            });
            console.log(
              desendingsortarrydata,
              "desendingsortarrydata******Yaxiosdata"
            );
            // temp.data = dataplot;
            // new changes soreted the data
            temp.data = desendingsortarrydata;

            temp.xaxiosdata = xaxiosorting;
            temp.yaxios = Yaxiosdata;
            temp.min = RefArray[0];
            temp.max = RefArray[1];

            responseData.push(temp);
          });

          this.setState({
            allgraphdata: xaxiosdata,
            min: RefArray[0],
            max: RefArray[1],
            Yaxis: Yaxiosdata,
            plotGraph: dataplot,
            isLoading: false,
            paginationLoading: false,
            searchLoading: false,
            refreshing: false,
            newcomplexgraph: responseData,
            from: ""
          });
        } else {
          // Toast.show(response.data.Msg);
          this.setState({
            isLoading: false,
            paginationLoading: false,
            searchLoading: false,
            refreshing: false,
            reportDetailArr: [],
            subReportDetails: [],
            subReportGraphData: []
          });
        }
      } catch (error) {
        console.log(error);
        Toast.show("Something Went Wrong, Please Try Again Later");

        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false,
          reportDetailArr: [],
          subReportDetails: [],
          subReportGraphData: []
        });
      }
    }
  }

  DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );

  renderTitle = (item) => {
    return (
      <View style={{ marginVertical: 20 }}>
        <Text
          style={{
            color: "black",
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center"
          }}
        >
          {item.Analyte} {item.Subanalyte}
          {/* {"\n"}
          {item.Subanalyte} */}
        </Text>
        <Text
          style={{
            flex: 1,
            fontSize: 15,
            textAlign: "center",
            // textAlign: "left",
            marginLeft: 20,
            marginBottom: 10,
            marginRight: 10,
            marginTop: 20
          }}
        >
          {"Reference Range: " + item.min + "-" + item.max}
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 24
            // backgroundColor: 'yellow',
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: "indianred",
                marginRight: 8
              }}
            />
            <Text
              style={{
                // width: 60,
                // height: 16,
                color: "indianred"
              }}
            >
              Low
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: "green",
                marginRight: 8
              }}
            />
            <Text
              style={{
                // width: 60,
                // height: 16,
                color: "green"
              }}
            >
              Normal
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: "red",
                marginRight: 8
              }}
            />
            <Text
              style={{
                // width: 60,
                // height: 16,
                color: "red"
              }}
            >
              High
            </Text>
          </View>
        </View>
      </View>
    );
  };
  render() {
    console.log(
      "!!!!!!!!!%%^%^^%^/////",
      JSON.stringify(this.state.newcomplexgraph),
      "%%%^^^^^"
    );

    return (
      <Container>
        <CustomeHeader
          title="Report Detail"
          headerId={1}
          navigation={this.props.navigation}
        />
        <Loader loading={this.state.isLoading} />

        <ScrollView>
          <View style={styles.graphcontainer}>
            {this.state.newcomplexgraph.map((item, index) => (
              <View
                style={[
                  {
                    paddingBottom: 40,
                    // borderRadius: 10,
                    backgroundColor: "white",

                    margin: 10
                  }
                ]}
                key={index}
              >
                {this.renderTitle(item)}
                <BarChart
                  // yAxisTextStyle={{fontSize: 13, marginLeft: 10}}
                  data={item.data}
                  showFractionalValue
                  initialSpacing={10}
                  spacing={70}
                  showYAxisIndices
                  autoShiftLabels
                  showXAxisIndices
                  rulesType={"line"}
                  rulesColor={"lightgray"}
                  rotateLabel
                  labelsExtraHeight={20}
                  // isAnimated
                  height={210}
                  // isThreeD
                  // side="right"
                  // roundedTop
                  // roundedBottom={true}
                  // width={Dimensions.get("window").width - 50}
                  showScrollIndicator
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    //padding: 0,
    marginLeft: Platform.OS === "ios" ? 15 : 0,
    marginRight: Platform.OS === "ios" ? 15 : 0,
    marginTop: Platform.OS === "ios" ? 10 : 0,
    marginBottom: Platform.OS === "ios" ? 2 : 0,
    //borderRadius:Platform.OS==="ios"?5:0,
    backgroundColor: "white",
    elevation: 2
  },

  graphcontainer: {
    flex: 1,
    flexDirection: "column",
    marginLeft: Platform.OS === "ios" ? 15 : 0,
    marginRight: Platform.OS === "ios" ? 15 : 0,
    marginTop: Platform.OS === "ios" ? 15 : 0,
    marginBottom: Platform.OS === "ios" ? 2 : 0
    // backgroundColor: "#F7F7F7",
    // elevation: 2
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
