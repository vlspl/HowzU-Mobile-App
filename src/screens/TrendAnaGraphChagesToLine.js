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
const Rijndael = require("rijndael-js");
global.Buffer = global.Buffer || require("buffer").Buffer;
const padder = require("pkcs7-padding");

const screenWidth = Math.round(Dimensions.get("window").width);
const { StatusBarManager } = NativeModules;
let Data = [
  {
    Analyte: "Blood Sugar",
    Subanalyte: "Fasting",
    sampleData: [
      {
        seriesName: "series3",
        data: [
          { x: " ", y: 0 },
          { x: "2018-02-01", y: 20 },
          { x: "2018-02-02", y: 100 }
          // { x: "2018-02-03", y: 140 },
          // { x: "2018-02-04", y: 550 },
          // { x: "2018-02-05", y: 40 }
        ],
        color: "yellow"
      },
      {
        seriesName: "series1",
        data: [
          { x: " ", y: 0 },
          { x: "2018-02-01", y: 30 }
          // { x: "2018-02-02", y: 200 }
          // { x: "2018-02-03", y: 170 },
          // { x: "2018-02-04", y: 250 },
          // { x: "2018-02-05", y: 10 }
        ],
        color: "#297AB1"
      }
    ],
    min: "70.00",
    max: "105.00"
  }
];

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

function findMaxArrayLenght(data1, data2, data3) {
  console.log(data1, data2, data3);
  let arra1 = data1;
  let arra2 = data2;
  let arra3 = data3;
  let lar = data1;
  console.log(lar > data2);
  if (lar < data2) {
    console.log("lar > data2");
    lar = data2;
  } else if (lar < data3) {
    console.log("else lar > data3");
    lar = data3;
  }
  console.log(lar, "lar");
  return lar;
}
export default class TrendAnagraphScreen extends React.Component {
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
  }

  OpenDrawer = () => {
    this.props.navigation.goBack();
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
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
  };

  componentDidMount = async () => {
    // this.retrieveData();
    // console.log(" HEAlth componentDidMount==============================");
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

  // unique = linedata.reduce(function (a, b) {
  //   console.log(a, "------", b);
  //   if (a.indexOf(b) < 0) a.push(b);
  //   return a;
  // }, []);
  removeDuplicate = (datalist) => {
    console.log(datalist.sampleData, "datalist");

    // return datalist.filter((item) => (item.y == 0 ? false : ids.push(item.id)));
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

  async ReportDetailCall() {
    console.log(
      "///////////////////////this.state.flag",
      this.state.flag == "OldReport"
    );
    this.setState({ isLoading: true }); //OldReport
    if (this.state.flag == "OldReport") {
      try {
        const response = await axios.post(Constants.COMPARE_OLDREPORTGRAPH, {
          ParameterName: this.state.testname
        });
        console.log(response.data, "my tend grapj  data ");

        this.setState({ isLoading: false });
        if (response.data.Status) {
          let responseData = [];
          let responseData1 = [];
          let responseData2 = [];
          let responseMain = [];
          let reports = [];

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
              let datesetX2 = {};
              let datesetX3 = {};

              values.push(value);

              if (Inrange == "Yes") {
                datesetX.x = moment(dt[i], "DD/MM/YYYY").format("DD MMM YYYY");
                datesetX.y = value;
                responseData.push(datesetX);
              } else if (Inrange == "Low") {
                datesetX2.x = moment(dt[i], "DD/MM/YYYY").format("DD MMM YYYY");
                datesetX2.y = value;
                responseData1.push(datesetX2);
              } else {
                datesetX3.x = moment(dt[i], "DD/MM/YYYY").format("DD MMM YYYY");
                datesetX3.y = value;
                responseData2.push(datesetX3);
              }

              i++;
            }

            let tempp = {};
            let tempp2 = {};
            let tempp3 = {};
            let dummy = {};
            dummy.x = " ";
            dummy.y = 100;
            const newAray = [];
            newAray.push(dummy);

            const combinew = newAray.concat(responseData);
            const newseries1 = newAray.concat(responseData1);
            const newseries2 = newAray.concat(responseData2);

            tempp.seriesName = "series1";
            tempp.color = "#297AB1";
            tempp.data = combinew;
            tempp2.seriesName = "series2";
            tempp2.color = "#297AB1";
            tempp3.data = newseries1;
            tempp3.seriesName = "series2";
            tempp3.color = "#297AB1";
            tempp3.data = newseries2;
            responseMain.push(tempp);
            responseMain.push(tempp2);
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

          // console.log(
          //   "&&&&&============= response main",
          //   JSON.stringify(reports)
          // );

          this.setState({
            newcomplexgraph: responseMain,
            isLoading: false,
            paginationLoading: false,
            searchLoading: false,
            refreshing: false,
            min: RefArray[0],
            max: RefArray[1],
            from: ""
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
          let AllDatedataplot = [];
          let dataplot = [];
          let dataplot2 = [];
          let dataplot3 = [];
          var values = [];

          var RefArray = [];

          let dt = [];

          response.data.ReportData.map((element, index) => {
            dataplot = [];
            dataplot2 = [];
            dataplot3 = [];
            console.log(
              "dataplot",
              dataplot,
              "dataplot2",
              dataplot2,
              "dataplot3",
              dataplot3
            );
            refrange = "";
            RefArray = [];

            refrange = element.Female != "" ? element.Female : element.Male;
            RefArray = refrange.split("-");

            console.log(element, "subanlyet==");
            dt = element.TestDate.split(",");
            console.log(dt, "after splic test dteag==");
            let temp = {};
            let linedata = [];
            temp.Analyte = element.Analyte;
            temp.Subanalyte = element.SubAnalyte;
            values = [];
            for (let i = 0; i < dt.length; i++) {
              console.log(dt[i], "==========/////date ", element);
              let yaxios = Number(this.Decrypt(dt[i + 1]));
              let value = isNaN(yaxios) ? 0 : yaxios;

              let Inrange = IsvalueBetweenRange(RefArray, value);

              let tmp = {};
              let tmp1 = {};
              let cnt = 0;

              values.push(value);
              console.log("////", Inrange);
              tmp1.y = 0;
              tmp1.x = moment(dt[i], "DD/MM/YYYY").format("DD MMM YY");
              AllDatedataplot.push(tmp1);

              if (Inrange == "Yes") {
                tmp.y = value;
                tmp.x = moment(dt[i], "DD/MM/YYYY").format("DD MMM YY");
                dataplot.push(tmp);
              } else if (Inrange == "Low") {
                tmp.y = value;
                tmp.x = moment(dt[i], "DD/MM/YYYY").format("DD MMM YY");
                dataplot2.push(tmp);
              } else if (Inrange == "No") {
                tmp.y = value;
                tmp.x = moment(dt[i], "DD/MM/YYYY").format("DD MMM YY");
                dataplot3.push(tmp);
              } else {
              }

              i++;
            }
            console.log(index, "element map index");
            let dummy = {};
            dummy.x = " ";
            dummy.y = 0;
            const newAray = [];
            newAray.push(dummy);
            // if (index == 0) {
            const data1 = dataplot.unshift(newAray);
            const data2 = dataplot2.unshift(newAray);
            const data3 = dataplot3.unshift(newAray);
            // }
            console.log(lognestlen, "lognestlen");
            console.log(data1, data2, data3);
            let lognestlen = findMaxArrayLenght(data1, data2, data3);

            if (dataplot.length > 1) {
              console.log(dataplot.flat(), "////*****dataplot");
              let un = dataplot; //this.removeDuplicate(dataplot);
              console.log(un.flat(), "first array 1 if////*****dataplot");

              let data = [
                {
                  seriesName: "series1",
                  data: un.flat(),
                  color: "green"
                }
              ];
              linedata.push(data);
            }
            if (dataplot3.length > 1) {
              console.log(dataplot3, "dataplot3");
              let un = dataplot3; // this.removeDuplicate(dataplot3);
              console.log(un.flat(), "3rd array if////*****dataplot");

              let data3 = [
                {
                  seriesName: "series3",
                  data: un.flat(),
                  color: "#DC143C"
                }
              ];
              linedata.push(data3);
            }
            if (dataplot2.length > 1) {
              console.log(dataplot2, "dataplot2");
              let un = dataplot2; //this.removeDuplicate(dataplot2);
              console.log(un.flat(), "2nd array  if////*****dataplot");

              let data2 = [
                {
                  seriesName: "series2",
                  data: un.flat(),
                  color: "indianred"
                }
              ];
              linedata.push(data2);
            }
            if (AllDatedataplot.length > 1) {
              console.log(AllDatedataplot, "all data plots");
              let un = AllDatedataplot; //this.removeDuplicate(dataplot2);
              console.log(un.flat(), "2nd array  if////*****dataplot");

              let data4 = [
                {
                  seriesName: "series4",
                  data: un.flat(),
                  color: "#fff"
                }
              ];
              linedata.push(data4);
            }
            let sortdata = linedata.flat().sort(function (a, b) {
              console.log(b.data.length, "----", a.data.length);
              return b.data.length - a.data.length;
            });

            temp.sampleData = sortdata.flat();

            temp.min = RefArray[0];
            temp.max = RefArray[1];

            responseData.push(temp);
          });
          console.log(
            JSON.stringify(responseData),
            "desendingsortarrydata******Yaxiosdata"
          );

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
    // else {
    //   try {
    //     console.log(this.state.testid, "test id ");
    //     const response = await axios.get(
    //       Constants.COMPARE_REPORTGRAPH + "TestId=" + this.state.testid
    //     );

    //     console.log(">>><<<<<<", response.data, "for the lab reports ");
    //     this.setState({ isLoading: false });
    //     if (response.data.Status) {
    //       let responseData = [];

    //       let Yaxiosdata = [];

    //       let responseData1 = [];
    //       let responseData2 = [];
    //       let responseMain = [];
    //       let refrange = "";
    //       let xaxiosdata = [];
    //       let dataplot = [];
    //       let dataplot2 = [];
    //       let dataplot3 = [];
    //       var values = [];

    //       var RefArray = [];

    //       let dt = [];

    //       let dummy = {};

    //       response.data.ReportData.map((element) => {
    //         refrange = "";
    //         RefArray = [];
    //         dataplot = [];
    //         Yaxiosdata = [];
    //         xaxiosdata = [];
    //         let tempp = {};
    //         let tempp2 = {};
    //         let tempp3 = {};
    //         refrange = element.Female != "" ? element.Female : element.Male;
    //         RefArray = refrange.split("-");
    //         // console.log(RefArray, "RefArray");

    //         // console.log(element, "////subanlyet==");
    //         dt = element.TestDate.split(",");
    //         // console.log(dt, "after splic test dteag==");

    //         values = [];
    //         for (let i = 0; i < dt.length; i++) {
    //           let datesetX = {};
    //           let datesetX2 = {};
    //           let datesetX3 = {};
    //           console.log(dt[i], "==========/////date ");
    //           let yaxios = Number(this.Decrypt(dt[i + 1]));
    //           let value = isNaN(yaxios) ? 0 : yaxios;

    //           let Inrange = IsvalueBetweenRange(RefArray, value);

    //           values.push(value);
    //           let minvalue = Math.min.apply(null, values);
    //           let maxvalue = Math.max.apply(null, values);

    //           if (Inrange == "Yes") {
    //             datesetX.x = moment(dt[i], "DD/MM/YYYY").format("DD MMM YYYY");
    //             datesetX.y = value;

    //             responseData.push(datesetX);
    //           } else if (Inrange == "Low") {
    //             datesetX2.x = moment(dt[i], "DD/MM/YYYY").format("DD MMM YYYY");
    //             datesetX2.y = value;
    //             responseData1.push(datesetX2);
    //           } else {
    //             datesetX3.x = moment(dt[i], "DD/MM/YYYY").format("DD MMM YYYY");
    //             datesetX3.y = value;
    //             responseData2.push(datesetX3);
    //           }
    //           i++;
    //         }
    //         tempp.Analyte = element.Analyte;
    //         tempp.Subanalyte = element.SubAnalyte;
    //         tempp.data = responseData;
    //         tempp.min = RefArray[0];
    //         tempp.max = RefArray[1];
    //         tempp2.Analyte = element.Analyte;
    //         tempp2.Subanalyte = element.SubAnalyte;
    //         tempp2.min = RefArray[0];
    //         tempp2.max = RefArray[1];

    //         tempp2.data = responseData1;
    //         tempp3.Analyte = element.Analyte;
    //         tempp3.Subanalyte = element.SubAnalyte;
    //         tempp3.data = responseData2;

    //         tempp3.min = RefArray[0];
    //         tempp3.max = RefArray[1];
    //         dataplot.push(tempp);
    //         dataplot.push(tempp2);
    //         dataplot.push(tempp3);
    //       });

    //       dummy.x = " ";
    //       dummy.y = 100;
    //       const newAray = [];
    //       newAray.push(dummy);
    //       // console.log(
    //       //   "responseData",
    //       //   responseData,
    //       //   "responseData1",
    //       //   responseData1,
    //       //   "responseData2",
    //       //   responseData2,
    //       //   "@@@@@@@@@######/////grapj dara"
    //       // );

    //       console.log(
    //         "========temppresponseData",
    //         dataplot,
    //         "responseData1",
    //         dataplot2,
    //         "responseData2",
    //         dataplot3,
    //         "@@@@@@@@@######/////grapj dara"
    //       );
    //       // if (responseData.length > 1) {
    //       //   const combinew = newAray.concat(responseData);
    //       //   tempp.sampleData = [
    //       //     {
    //       //       seriesName: "series1",
    //       //       data: combinew,
    //       //       color: "green"
    //       //     }
    //       //   ];

    //       //   responseMain.push(tempp);
    //       // } else if (responseData1.length > 1) {
    //       //   const newseries1 = newAray.concat(responseData1);

    //       //   tempp2.sampleData = [
    //       //     {
    //       //       seriesName: "series2",
    //       //       data: newseries1,
    //       //       color: "indianred"
    //       //     }
    //       //   ];

    //       //   responseMain.push(tempp2);
    //       // } else if (responseData2.length > 1) {
    //       //   const newseries2 = newAray.concat(responseData2);
    //       //   tempp3.sampleData = [
    //       //     {
    //       //       seriesName: "series3",
    //       //       data: newseries2,
    //       //       color: "red"
    //       //     }
    //       //   ];

    //       //   responseMain.push(tempp3);
    //       // }

    //       console.log(
    //         "&&&&&=============  Blood Pressure  response main",
    //         JSON.stringify(responseMain)
    //       );

    //       this.setState({
    //         allgraphdata: xaxiosdata,
    //         min: RefArray[0],
    //         max: RefArray[1],
    //         Yaxis: Yaxiosdata,
    //         plotGraph: dataplot,
    //         isLoading: false,
    //         paginationLoading: false,
    //         searchLoading: false,
    //         refreshing: false,
    //         newcomplexgraph: responseMain,
    //         from: ""
    //       });
    //     } else {
    //       // Toast.show(response.data.Msg);
    //       this.setState({
    //         isLoading: false,
    //         paginationLoading: false,
    //         searchLoading: false,
    //         refreshing: false,
    //         reportDetailArr: [],
    //         subReportDetails: [],
    //         subReportGraphData: []
    //       });
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     Toast.show("Something Went Wrong, Please Try Again Later");

    //     this.setState({
    //       isLoading: false,
    //       paginationLoading: false,
    //       searchLoading: false,
    //       refreshing: false,
    //       reportDetailArr: [],
    //       subReportDetails: [],
    //       subReportGraphData: []
    //     });
    //   }
    // }
  }

  renderTitle = (item) => {
    // console.log(item, "redner title");
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
            title="Report Detail"
            headerId={1}
            navigation={this.props.navigation}
          />
          <Loader loading={this.state.isLoading} />
          <ScrollView>
            <View style={styles.graphcontainer}>
              {this.state.newcomplexgraph.map((item, index) => (
                <>
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
                  </View>
                  <View style={[styles.MyhealthcardView, { marginTop: 20 }]}>
                    <PureChart
                      type={"line"}
                      data={item.sampleData}
                      width={"100%"}
                      height={310}
                      showEvenNumberXaxisLabel={true}
                      customValueRenderer={(index, point) => {
                        console.log(index, "index", point);
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
                              {point.y}
                            </Text>
                          </View>
                        );
                      }}
                    />
                  </View>
                </>
              ))}
            </View>
          </ScrollView>
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
