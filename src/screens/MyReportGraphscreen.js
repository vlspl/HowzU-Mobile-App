import React, { Component } from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  Dimensions,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Container, Toast } from "native-base";
import CustomeHeader from "../appComponents/CustomeHeader";
import axios from "axios";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import ReportAnalyteCard from "../appComponents/ReportAnalyteCard";
import moment from "moment";
import Speedometer from "react-native-speedometer-chart";
import WebView from "react-native-webview";
const Rijndael = require("rijndael-js");
global.Buffer = global.Buffer || require("buffer").Buffer;
const padder = require("pkcs7-padding");

function getMinValue(RefArray, value) {
  var ref1 = RefArray[0];
  var ref2 = RefArray[1];
  // console.log('ref1==============================', ref1);
  // console.log('ref2==============================', ref2);
  if (parseFloat(value).toFixed(2) <= parseFloat(ref1).toFixed(2)) {
    // return parseFloat(value);
    return parseFloat(ref1).toFixed(2);
  } else {
    return parseFloat(ref1).toFixed(2);
  }
}

function getMaxValue(RefArray, value) {
  let ref1 = RefArray[0];
  let ref2 = RefArray[1];
  // console.log(
  //   "ref1==============================",
  //   ref1,
  //   "parseFloat(ref1)",
  //   parseFloat(ref1).toFixed(2)
  // );
  // console.log(
  //   "ref2==============================",
  //   ref2,
  //   "parseFloat(ref2)",
  //   parseFloat(ref2)
  // );
  if (parseFloat(value).toFixed(2) >= parseFloat(ref2).toFixed(2)) {
    // return parseFloat(value);
    return parseFloat(ref2).toFixed(2);
  } else {
    return parseFloat(ref2).toFixed(2);
  }
}

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
  } else {
    return "No";
  }
}
function IsRefFangvalueZero(RefArray, value) {
  let ref1 = RefArray[0];
  let ref2 = RefArray[1];
  // console.log("ref1==============================", ref1);
  // console.log("ref2==============================", ref2);
  // console.log("value==============================", value);

  if (
    parseFloat(value) == parseFloat(ref1) &&
    parseFloat(value) == parseFloat(ref2)
  ) {
    return "Yes";
  } else {
    return "No";
  }
}

export default class MyReportGraphscreen extends Component {
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
      testid: "",
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
      Link: ""
    };

    // this.hardwarebBackAction = this.hardwarebBackAction.bind(this);
    // console.log('constructort==============================');
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    console.log(
      " Report detail componentWillReceiveProps==============================",
      nextProp.route.params.labinfo
      // nextProp.route.params.userId
    );

    if (nextProp.route.params.from == "Doctor") {
      this.setState(
        {
          isLoading: true,
          reportDetailArr: [],
          subReportDetails: [],
          subReportGraphData: [],
          ReportId: nextProp.route.params.labinfo.ReportId,
          UserId: nextProp.route.params.labinfo.PatientId,
          from: nextProp.route.params.from,
          activebtn: "report",
          allgraphdata: [],
          from: "Doctor",
          commentmodal: false,
          doccomment: "",
          status: nextProp.route.params.labinfo.Status,
          editcommetn: nextProp.route.params.viewedit,
          flag: nextProp.route.params.labinfo.Flag,
          Link:
            nextProp.route.params.labinfo.Flag == "OldReport"
              ? `https://www.visionarylifescience.com/viewOLDReport.aspx?ReportId=`
              : `https://visionarylifescience.com/mViewReport.aspx?reportId=`
        },
        () => {
          this.DocViewReportDetail();
        }
      );
    } else {
      this.setState(
        {
          isLoading: true,
          reportDetailArr: [],
          subReportDetails: [],
          subReportGraphData: [],
          ReportId: nextProp.route.params.labinfo.ReportId,
          activebtn: "report",
          allgraphdata: [],
          from:
            nextProp.route.params.from != undefined
              ? nextProp.route.params.from
              : "Patient",
          commentmodal: false,
          doccomment: "",
          status: nextProp.route.params.labinfo.Status,
          flag: nextProp.route.params.labinfo.Flag,
          Familymemberid:
            nextProp.route.params.Familymemberid != undefined
              ? nextProp.route.params.Familymemberid
              : 0,
          Link:
            nextProp.route.params.labinfo.Flag == "OldReport"
              ? `https://www.visionarylifescience.com/viewOLDReport.aspx?ReportId=`
              : `https://visionarylifescience.com/mViewReport.aspx?reportId=`
        },
        () => {
          this.ReportDetailCall();
        }
      );
    }
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
    console.log(
      "Report detail componentDidMount==============================",
      this.props.route.params

      // this.props.route.params.userId
    );

    if (this.props.route.params.from == "Doctor") {
      this.setState(
        {
          isLoading: true,
          reportDetailArr: [],
          subReportDetails: [],
          subReportGraphData: [],
          ReportId: this.props.route.params.labinfo.ReportId,
          UserId: this.props.route.params.labinfo.PatientId,
          from: this.props.route.params.from,
          activebtn: "report",
          from: "Doctor",
          flag: this.props.route.params.labinfo.Flag,
          status: this.props.route.params.labinfo.Status,
          editcommetn: this.props.route.params.viewedit,
          Link:
            this.props.route.params.labinfo.Flag == "OldReport"
              ? `https://www.visionarylifescience.com/viewOLDReport.aspx?ReportId=`
              : `https://visionarylifescience.com/mViewReport.aspx?reportId=`
        },
        () => {
          this.DocViewReportDetail();
        }
      );
    } else {
      this.setState(
        {
          isLoading: true,
          reportDetailArr: [],
          subReportDetails: [],
          subReportGraphData: [],
          flag: this.props.route.params.labinfo.Flag,
          Link:
            this.props.route.params.labinfo.Flag == "OldReport"
              ? `https://www.visionarylifescience.com/viewOLDReport.aspx?ReportId=`
              : `https://visionarylifescience.com/mViewReport.aspx?reportId=`,
          ReportId: this.props.route.params.labinfo.ReportId,
          from:
            this.props.route.params.from != undefined
              ? this.props.route.params.from
              : "Patient",
          activebtn: "report",
          // from: "Patient",
          status: this.props.route.params.labinfo.Status,
          Familymemberid:
            this.props.route.params.Familymemberid != undefined
              ? this.props.route.params.Familymemberid
              : 0
        },
        () => {
          this.ReportDetailCall();
        }
      );
    }
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
  };

  onPressSubmit = async () => {
    // console.log("../../****", this.state.ReportId, this.state.docnote.length);
    if (!isNaN(this.state.docnote)) {
      Toast.show({ text: "Please enter only character" });
    } else if (this.state.docnote == "") {
      Toast.show({ text: "Please enter youre comment" });
    }
    // else if (this.state.docnote != "") {
    //   Toast.show({ text: "Please enter minimum 100 character comment" });
    // }
    else {
      this.setState({ isLoading: true });
      if (this.state.flag == "OldReport") {
        try {
          const response = await axios.post(
            Constants.DOC_ADD_COMMENT_TO_OLDREPORTS,
            {
              ReportId: this.state.ReportId,
              Note: this.state.docnote
            }
          );
          // console.log("OldResponse data =======", response.data);

          this.setState({ isLoading: false });
          if (response.data.Status) {
            Toast.show({ text: response.data.Msg });
            this.props.navigation.navigate("SharedReportstatus");
          } else {
            Toast.show({ text: response.data.Msg });
          }
        } catch (error) {
          Toast.show({ text: "Something Went Wrong, Please Try Again Later" });

          this.setState({
            isLoading: false
          });

          console.log(error);
        }
      } else {
        try {
          const response = await axios.post(Constants.DOC_ADD_COMMENT, {
            ReportId: this.state.ReportId,
            Note: this.state.docnote
          });
          // console.log("Response data =======", response.data);

          this.setState({ isLoading: false });
          if (response.data.Status) {
            Toast.show({ text: response.data.Msg });
            this.props.navigation.navigate("SharedReportstatus");

            // this.props.n
          } else {
            Toast.show({ text: response.data.Msg });
          }
        } catch (error) {
          Toast.show({ text: "Something Went Wrong, Please Try Again Later" });

          this.setState({
            isLoading: false
          });

          console.log(error);
        }
      }
    }
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
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

  addCommentDoc = () => {
    // console.log("@!@!@!@!@!@Coomentnejkntke", this.state.commentmodal);
    this.setState({ commentmodal: true });
    // console.log(
    //   "Afetr press@!@!@!@!@!@Coomentnejkntke",
    //   this.state.commentmodal
    // );
  };
  // PAtient can view his own Report
  async ReportDetailCall() {
    console.log("ReportId", this.state.ReportId);
    this.setState({ isLoading: true }); //OldReport
    if (this.state.flag == "OldReport") {
      if (this.state.from == "FamilyMember") {
        try {
          const response = await axios.post(
            Constants.FAMILYMEBER_VIEW_OLD_REPORT_DETAIL,
            {
              Familymemberid: this.state.Familymemberid,
              Reportid: this.state.ReportId
            }
          );

          // console.log(response.data, "oldfamily meber ==report details call");

          this.setState({ isLoading: false });
          if (response.data.Status) {
            let responseData = this.state.reportDetailArr;
            let subresponseData = this.state.subReportDetails;
            let graphData = this.state.subReportGraphData;
            // let docnote = this.state.doccomment;
            let docnote = [];

            response.data.ReportData.map((subitem) => {
              let reportdetails = {};
              reportdetails.LabName = response.data.LabName;
              reportdetails.TestDate = response.data.TestDate;

              reportdetails.ReportCreatedAt = subitem.CreatedDate;
              reportdetails.Note_Comment = response.data.Notes;

              response.data.DocNote.map((note) => {
                let temp = {};
                temp.Createddate = note.Createddate;
                temp.Note = note.DoctorComment;
                docnote.push(temp);
                // console.log(note, "note $$%%%%%&&&&&", docnote);
              });

              let temp = {};
              temp.Analyte = "Parameter";
              temp.Subanalyte = subitem.ParameterName;
              let refrange = subitem.MinRange + "-" + subitem.MaxRange;
              temp.ReferenceRange = refrange;
              // console.log(temp.ReferenceRange, "-------====");
              let res = this.Decrypt(subitem.Result);
              temp.Result = subitem.Result;

              let value = this.Decrypt(subitem.Value);
              temp.Value = subitem.Value;
              var RefArray = refrange.split("-");
              let minvalue = getMinValue(RefArray, value);
              // console.log("minvalue=======", minvalue);
              let maxvalue = getMaxValue(RefArray, value);
              // console.log("maxvalue=======", maxvalue);
              temp.Minvalue = minvalue;
              temp.Maxvalue = maxvalue;
              let Inrange = IsvalueBetweenRange(RefArray, value);
              // console.log(Inrange, "Inrange");
              let iszero = IsRefFangvalueZero(RefArray, 0);
              temp.iszero = iszero;

              if (iszero == "Yes") {
                if (res == "Normal" || res == "Negative") {
                  temp.internalColor = "green";
                  temp.outerColor = "green";
                } else if (
                  res == "A+" ||
                  res == "A +" ||
                  res == "A positive" ||
                  res == "A-" ||
                  res == "A -" ||
                  res == "A negative" ||
                  res == "AB+" ||
                  res == "AB +" ||
                  res == "AB positive" ||
                  res == "AB-" ||
                  res == "AB -" ||
                  res == "AB negative" ||
                  res == "B+" ||
                  res == "B +" ||
                  res == "B positive" ||
                  res == "B-" ||
                  res == "B -" ||
                  res == "B negative" ||
                  res == " O+" ||
                  res == "O +" ||
                  res == "O positive" ||
                  res == "O-" ||
                  res == "O -" ||
                  res == "O negative"
                ) {
                  temp.internalColor = "green";
                  temp.outerColor = "green";
                } else if (
                  res == "Abnormal" ||
                  res == "High" ||
                  res == "Positive" ||
                  res == "Positive" ||
                  this.Decrypt(subitem.Result) == "Positive"
                ) {
                  temp.internalColor = "red";
                  temp.outerColor = "red";
                } else if (res == "Low" || res == "Inconclusive") {
                  temp.internalColor = "yellow";
                  temp.outerColor = "yellow";
                } else {
                  // console.log(res == "Positive");
                  temp.internalColor = "gray";
                  temp.outerColor = "gray";
                }
                // console.log(res, "normal rerkewo");
              } else if (Inrange == "Yes" && iszero == "No") {
                // console.log("==============?????????not zero ");
                if (Inrange == "Yes") {
                  temp.internalColor = "green";
                }
              } else if (Inrange == "No" && iszero == "No") {
                temp.internalColor = "#ff0000";
              }
              responseData.push(reportdetails);
              graphData.push(temp);
              subresponseData.push(temp);
            });
            // console.log('subReportGraphData===========', graphData);
            this.setState({
              reportDetailArr: responseData,
              subReportDetails: subresponseData,
              subReportGraphData: graphData,
              doccomment: docnote,
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
        } catch (error) {
          Toast.show({ text: "Something Went Wrong, Please Try Again Later" });

          this.setState({
            isLoading: false,
            paginationLoading: false,
            searchLoading: false,
            refreshing: false,
            reportDetailArr: [],
            subReportDetails: [],
            subReportGraphData: []
          });

          console.log(error);
        }
      } else {
        // console.log("else old report ReportId====", this.state.ReportId);

        try {
          const response = await axios.get(
            Constants.OLD_REPORT_DETAIL + this.state.ReportId
          );

          // console.log(response.data, "////''''old==report details call");

          this.setState({ isLoading: false });
          if (response.data.Status) {
            let responseData = this.state.reportDetailArr;
            let subresponseData = this.state.subReportDetails;
            let graphData = this.state.subReportGraphData;
            // let docnote = this.state.doccomment;
            let docnote = [];

            response.data.ReportData.map((subitem) => {
              let reportdetails = {};
              reportdetails.LabName = response.data.LabName;
              reportdetails.TestDate = response.data.TestDate;
              reportdetails.ReportCreatedAt = subitem.CreatedDate;
              reportdetails.Note_Comment = response.data.Notes;
              response.data.DocNote.map((note) => {
                let temp = {};
                temp.Createddate = note.Createddate;
                temp.Note = note.DoctorComment;
                // temp.name = "sonali";
                docnote.push(temp);
                // console.log(note, "note $$%%%%%&&&&&", docnote);
              });

              let temp = {};
              temp.Analyte = "Parameter";
              temp.Subanalyte = subitem.ParameterName;
              let refrange = subitem.MinRange + "-" + subitem.MaxRange;
              temp.ReferenceRange = refrange;
              // console.log(temp.ReferenceRange, "-------====");
              let res = this.Decrypt(subitem.Result);
              temp.Result = subitem.Result;
              // console.log(subitem.Result, "//////");
              let value = this.Decrypt(subitem.Value);
              temp.Value = subitem.Value;
              var RefArray = refrange.split("-");
              let minvalue = getMinValue(RefArray, value);
              // console.log("minvalue=======", minvalue);
              let maxvalue = getMaxValue(RefArray, value);
              // console.log("maxvalue=======", maxvalue);
              temp.Minvalue = minvalue;
              temp.Maxvalue = maxvalue;
              let Inrange = IsvalueBetweenRange(RefArray, value);
              console.log(Inrange, "Inrange");
              let iszero = IsRefFangvalueZero(RefArray, 0);
              temp.iszero = iszero;
              // console.log(
              //   "IsvalueBetweenRange=======",
              //   Inrange,
              //   "iszero",
              //   iszero
              // );
              if (iszero == "Yes") {
                if (res == "Normal" || res == "Negative") {
                  temp.internalColor = "green";
                  temp.outerColor = "green";
                } else if (
                  res == "A+" ||
                  res == "A +" ||
                  res == "A positive" ||
                  res == "A-" ||
                  res == "A -" ||
                  res == "A negative" ||
                  res == "AB+" ||
                  res == "AB +" ||
                  res == "AB positive" ||
                  res == "AB-" ||
                  res == "AB -" ||
                  res == "AB negative" ||
                  res == "B+" ||
                  res == "B +" ||
                  res == "B positive" ||
                  res == "B-" ||
                  res == "B -" ||
                  res == "B negative" ||
                  res == " O+" ||
                  res == "O +" ||
                  res == "O positive" ||
                  res == "O-" ||
                  res == "O -" ||
                  res == "O negative"
                ) {
                  temp.internalColor = "green";
                  temp.outerColor = "green";
                } else if (
                  res == "Abnormal" ||
                  res == "High" ||
                  res == "Positive"
                ) {
                  temp.internalColor = "red";
                  temp.outerColor = "red";
                } else if (res == "Low" || res == "Inconclusive") {
                  temp.internalColor = "yellow";
                  temp.outerColor = "yellow";
                } else {
                  temp.internalColor = "gray";
                  temp.outerColor = "gray";
                }
                // console.log(res, "normal rerkewo");
              } else if (Inrange == "Yes" && iszero == "No") {
                // console.log("==============?????????not zero ");
                if (Inrange == "Yes") {
                  temp.internalColor = "green";
                }
              } else if (Inrange == "No" && iszero == "No") {
                temp.internalColor = "#ff0000";
              }
              responseData.push(reportdetails);
              graphData.push(temp);
              subresponseData.push(temp);
            });
            // console.log("subReportGraphData===========", subresponseData);
            this.setState({
              reportDetailArr: responseData,
              subReportDetails: subresponseData,
              subReportGraphData: graphData,
              doccomment: docnote,
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
        } catch (error) {
          Toast.show({ text: "Something Went Wrong, Please Try Again Later" });

          this.setState({
            isLoading: false,
            paginationLoading: false,
            searchLoading: false,
            refreshing: false,
            reportDetailArr: [],
            subReportDetails: [],
            subReportGraphData: []
          });

          console.log(error);
        }
      }
    } else {
      try {
        const response = await axios.get(
          Constants.REPORT_DETAIL + this.state.ReportId
        );

        this.setState({ isLoading: false });
        if (response.data.Status) {
          //Toast.show(response.data.Msg)
          let responseData = this.state.reportDetailArr;
          let subresponseData = this.state.subReportDetails;
          let graphData = this.state.subReportGraphData;
          let docnote = [];
          // let docnote=this.state.doccomment
          let test;
          response.data.DocNote.map((note) => {
            // console.log(note, "note to push");
            docnote.push(note);
          });

          response.data.ReportList.map((item) => {
            test = item.TestId;
            responseData.push(item);

            item.SubReportList.map((subitem) => {
              // console.log(subitem, 'subreop list');
              // subresponseData.push(subitem);

              let temp = {};
              temp = subitem;
              temp.Analyte = subitem.Analyte;
              temp.ReferenceRange = subitem.ReferenceRange;
              let res = this.Decrypt(subitem.Result);
              temp.Result = subitem.Result;
              let value = this.Decrypt(subitem.Value);
              temp.Value = subitem.Value;

              var RefArray = subitem.ReferenceRange.split("-");
              let minvalue = getMinValue(RefArray, value);
              // console.log("minvalue=======", minvalue);
              let maxvalue = getMaxValue(RefArray, value);
              // console.log("maxvalue=======", maxvalue);
              temp.Minvalue = minvalue;
              temp.Maxvalue = maxvalue;
              let Inrange = IsvalueBetweenRange(RefArray, value);
              let iszero = IsRefFangvalueZero(RefArray, 0);
              temp.iszero = iszero;
              // console.log('IsvalueBetweenRange=======', Inrange);
              if (iszero == "Yes") {
                if (res == "Normal" || res == "Negative") {
                  temp.internalColor = "green";
                  temp.outerColor = "green";
                } else if (
                  res == "A+" ||
                  res == "A +" ||
                  res == "A positive" ||
                  res == "A-" ||
                  res == "A -" ||
                  res == "A negative" ||
                  res == "AB+" ||
                  res == "AB +" ||
                  res == "AB positive" ||
                  res == "AB-" ||
                  res == "AB -" ||
                  res == "AB negative" ||
                  res == "B+" ||
                  res == "B +" ||
                  res == "B positive" ||
                  res == "B-" ||
                  res == "B -" ||
                  res == "B negative" ||
                  res == " O+" ||
                  res == "O +" ||
                  res == "O positive" ||
                  res == "O-" ||
                  res == "O -" ||
                  res == "O negative"
                ) {
                  temp.internalColor = "green";
                  temp.outerColor = "green";
                } else if (
                  res == "Abnormal" ||
                  res == "High" ||
                  res == "Positive"
                ) {
                  temp.internalColor = "red";
                  temp.outerColor = "red";
                } else if (res == "Low" || res == "Inconclusive") {
                  temp.internalColor = "yellow";
                  temp.outerColor = "yellow";
                } else {
                  temp.internalColor = "gray";
                  temp.outerColor = "gray";
                }
                // console.log(res, "normal rerkewo");
              } else if (Inrange == "Yes" && iszero == "No") {
                if (Inrange == "Yes") {
                  temp.internalColor = "green";
                }
              } else if (Inrange == "No" && iszero == "No") {
                temp.internalColor = "#ff0000";
              }
              subresponseData.push(temp);

              graphData.push(temp);
            });
          });
          // console.log(subresponseData, "***");
          this.setState({
            reportDetailArr: responseData,
            subReportDetails: subresponseData,
            subReportGraphData: graphData,
            isLoading: false,
            paginationLoading: false,
            searchLoading: false,
            refreshing: false,
            testid: test,
            doccomment: docnote,
            from: ""
          });
          if (this.state.testid != "") {
            this.ReportGraphData();
          }
        } else {
          Toast.show(response.data.Msg);
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
        Toast.show({ text: "Something Went Wrong, Please Try Again Later" });

        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false,
          reportDetailArr: [],
          subReportDetails: [],
          subReportGraphData: []
        });

        console.log(error);
      }
    }
  }

  async ReportGraphData() {
    // console.log('test id ====', this.state.testid);
    this.setState({ isLoading: true });
    //  "http://endpoint.visionarylifescience.com/TestBooking/ReportDetilsForGraph?TestId=" +

    try {
      const response = await axios.get(
        Constants.REPORT_DETAILS_FORGRAPH + this.state.testid
      );
      // console.log('Graph data data =======', response.data);
      let barlables = [];
      let bardata = [];

      this.setState({ isLoading: false });
      if (response.data.Status) {
        //Toast.show(response.data.Msg)
        responseMain = [];
        for (const plotdata of response.data.ReportData) {
          if (this.Decrypt(plotdata.Value) > 1) {
            // console.log(this.Decrypt(plotdata.Value), 'amklmdam');
            barlables.push(plotdata.TestDate);
            bardata.push(parseInt(this.Decrypt(plotdata.Value)));
          }
        }
        // response.data.ReportData.map((item) => {
        //   // responseData.push(subitem);
        // });
        let tempp = {
          labels: barlables,
          datasets: [
            {
              data: bardata,
              strokeWidth: 2
            }
          ]
        };
        let responseMain;
        // tempp.seriesName = 'series1';
        // tempp.color = '#297AB1';
        // tempp.data = responseData;
        responseMain.push(tempp);
        // console.log(
        //   '=======GraphData===========',
        //   barlables,
        //   bardata,
        //   'temppp',
        //   tempp
        // );

        this.setState({
          chartData: tempp,
          allgraphdata: responseMain,
          data: barlables,
          datasets: bardata,
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      } else {
        // Toast.show({text:response.data.Msg});
        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false,
          allgraphdata: []
        });
      }
    } catch (error) {
      Toast.show({ text: "Something Went Wrong, Please Try Again Later" });

      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        refreshing: false,
        allgraphdata: []
      });

      console.log(error);
    }
  }

  // Doctor view the patient reports shared by patient
  async DocViewReportDetail() {
    // console.log(
    //   "Doc view ReportId====",
    //   this.state.ReportId,
    //   "userId====",
    //   this.state.UserId,
    //   "flag",
    //   this.state.flag
    // );
    this.setState({ isLoading: true });
    if (this.state.flag == "OldReport") {
      try {
        const response = await axios.post(Constants.DOC_VIEW_OLDREPORT, {
          UserId: this.state.UserId,
          ReportId: this.state.ReportId
        });

        // console.log("Doctor view Report data ======= Coment", response.data);

        this.setState({ isLoading: false });
        if (response.data.Status) {
          //Toast.show(response.data.Msg)
          let responseData = this.state.reportDetailArr;
          let subresponseData = this.state.subReportDetails;
          let graphData = this.state.subReportGraphData;
          let docnote = this.state.doccomment;
          response.data.ReportData.map((subitem) => {
            let reportdetails = {};
            reportdetails.LabName = response.data.LabName;
            reportdetails.TestDate = response.data.TestDate;
            reportdetails.ReportCreatedAt = subitem.CreatedDate;
            reportdetails.Note_Comment = response.data.Notes;

            response.data.DocNote.map((note) => {
              let temp = {};
              temp = note;
              temp.Createddate = note.Createddate;
              temp.Note = note.DoctorComment;
              docnote.push(temp);
            });

            responseData.push(reportdetails);

            // subresponseData.push(subitem);

            let temp = {};
            temp.Analyte = "Parameter";
            temp.Subanalyte = subitem.ParameterName;
            let refrange = subitem.MinRange + "-" + subitem.MaxRange;
            temp.ReferenceRange = refrange;
            // console.log(temp.ReferenceRange, "-------====");
            let res = this.Decrypt(subitem.Result);
            temp.Result = subitem.Result;
            let value = this.Decrypt(subitem.Value);
            temp.Value = subitem.Value;
            var RefArray = refrange.split("-");
            let minvalue = getMinValue(RefArray, value);
            // console.log("minvalue=======", minvalue);
            let maxvalue = getMaxValue(RefArray, value);
            // console.log("maxvalue=======", maxvalue);
            temp.Minvalue = minvalue;
            temp.Maxvalue = maxvalue;
            let Inrange = IsvalueBetweenRange(RefArray, value);
            let iszero = IsRefFangvalueZero(RefArray, 0);
            temp.iszero = iszero;
            // console.log(
            //   "IsvalueBetweenRange=======",
            //   Inrange,
            //   "iszero",
            //   iszero
            // );
            if (iszero == "Yes") {
              if (res == "Normal" || res == "Negative") {
                temp.internalColor = "green";
                temp.outerColor = "green";
              } else if (
                res == "Abnormal" ||
                res == "High" ||
                res == "Positive"
              ) {
                temp.internalColor = "red";
                temp.outerColor = "red";
              } else if (res == "Low" || res == "Inconclusive") {
                temp.internalColor = "yellow";
                temp.outerColor = "yellow";
              } else if (
                res == "A+" ||
                res == "A +" ||
                res == "A positive" ||
                res == "A-" ||
                res == "A -" ||
                res == "A negative" ||
                res == "AB+" ||
                res == "AB +" ||
                res == "AB positive" ||
                res == "AB-" ||
                res == "AB -" ||
                res == "AB negative" ||
                res == "B+" ||
                res == "B +" ||
                res == "B positive" ||
                res == "B-" ||
                res == "B -" ||
                res == "B negative" ||
                res == " O+" ||
                res == "O +" ||
                res == "O positive" ||
                res == "O-" ||
                res == "O -" ||
                res == "O negative"
              ) {
                temp.internalColor = "green";
                temp.outerColor = "green";
              } else {
                temp.internalColor = "gray";
                temp.outerColor = "gray";
              }
              // console.log(res, "normal rerkewo");
            } else if (Inrange == "Yes" && iszero == "No") {
              if (Inrange == "Yes") {
                temp.internalColor = "green";
              }
              // else {
              //   temp.internalColor = "#ff0000";
              // }
            } else if (Inrange == "No" && iszero == "No") {
              temp.internalColor = "#ff0000";
            }
            graphData.push(temp);
            subresponseData.push(temp);
          });
          // console.log('subReportGraphData===========', graphData);
          this.setState({
            reportDetailArr: responseData,
            subReportDetails: subresponseData,
            subReportGraphData: graphData,
            doccomment: docnote,
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
            refreshing: false,
            editcommetn: false
          });
        }
      } catch (error) {
        Toast.show({ text: "Something Went Wrong, Please Try Again Later" });

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
        const response = await axios.post(Constants.DOC_VIEWREPORT, {
          UserId: this.state.UserId,
          ReportId: this.state.ReportId
        });
        // console.log(
        //   "Doctor view Report data/////... ======= Coment",
        //   JSON.stringify(response.data)
        // );

        this.setState({ isLoading: false });
        if (response.data.Status) {
          //Toast.show(response.data.Msg)
          let responseData = this.state.reportDetailArr;
          let subresponseData = this.state.subReportDetails;
          let graphData = this.state.subReportGraphData;
          let docnote = this.state.doccomment;

          response.data.DocNote.map((note) => {
            docnote.push(note);
          });
          response.data.ReportList.map((item) => {
            responseData.push(item);

            item.SubReportList.map((subitem) => {
              // console.log(subitem, "-----");

              let temp = {};
              temp = subitem;
              temp.Analyte = subitem.Analyte;
              temp.Subanalyte = subitem.Subanalyte;
              temp.ReferenceRange = subitem.ReferenceRange;
              let res = this.Decrypt(subitem.Result);
              temp.Result = subitem.Result;
              let value = this.Decrypt(subitem.Value);
              temp.Value = subitem.Value;

              var RefArray = subitem.ReferenceRange.split("-");
              let minvalue = getMinValue(RefArray, value);
              // console.log("minvalue=======", minvalue);
              let maxvalue = getMaxValue(RefArray, value);
              // console.log("maxvalue=======", maxvalue);
              temp.Minvalue = minvalue;
              temp.Maxvalue = maxvalue;
              let Inrange = IsvalueBetweenRange(RefArray, value);
              let iszero = IsRefFangvalueZero(RefArray, 0);
              temp.iszero = iszero;
              // console.log("IsvalueBetweenRange=======", iszero);
              if (iszero == "Yes") {
                if (res == "Normal" || res == "Negative") {
                  temp.internalColor = "green";
                  temp.outerColor = "green";
                } else if (
                  res == "Abnormal" ||
                  res == "High" ||
                  res == "Positive"
                ) {
                  temp.internalColor = "red";
                  temp.outerColor = "red";
                } else if (res == "Low" || res == "Inconclusive") {
                  temp.internalColor = "yellow";
                  temp.outerColor = "yellow";
                } else if (
                  res == "A+" ||
                  res == "A +" ||
                  res == "A positive" ||
                  res == "A-" ||
                  res == "A -" ||
                  res == "A negative" ||
                  res == "AB+" ||
                  res == "AB +" ||
                  res == "AB positive" ||
                  res == "AB-" ||
                  res == "AB -" ||
                  res == "AB negative" ||
                  res == "B+" ||
                  res == "B +" ||
                  res == "B positive" ||
                  res == "B-" ||
                  res == "B -" ||
                  res == "B negative" ||
                  res == " O+" ||
                  res == "O +" ||
                  res == "O positive" ||
                  res == "O-" ||
                  res == "O -" ||
                  res == "O negative"
                ) {
                  temp.internalColor = "green";
                  temp.outerColor = "green";
                } else {
                  temp.internalColor = "gray";
                  temp.outerColor = "gray";
                }
                // console.log(res, "normal rerkewo");
              } else if (Inrange == "Yes" && iszero == "No") {
                if (Inrange == "Yes") {
                  temp.internalColor = "green";
                }
                // else {
                //   temp.internalColor = "#ff0000";
                // }
              } else if (Inrange == "No" && iszero == "No") {
                temp.internalColor = "#ff0000";
              }
              // subresponseData.push(subitem);
              subresponseData.push(temp);
              graphData.push(temp);
            });
          });
          // console.log("subReportGraphData===========", graphData);
          this.setState({
            reportDetailArr: responseData,
            subReportDetails: subresponseData,
            subReportGraphData: graphData,
            doccomment: docnote,
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
            refreshing: false,
            editcommetn: false
          });
        }
      } catch (error) {
        Toast.show({ text: "Something Went Wrong, Please Try Again Later" });

        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });

        console.log(error);
      }
    }
  }

  DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
  LoadingIndicatorView() {
    return <Loader loading={this.state.isLoading} />;
  }

  render() {
    return (
      <Container>
        <CustomeHeader
          title="Report Detail"
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
              // marginLeft: 10,
              // marginRight: 20,
            }}
          >
            <View
              style={{
                height: 40,
                width: "90%",
                // backgroundColor: 'red',
                backgroundColor: "#f4f4f4",
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 50,
                borderWidth: 1,
                marginTop: 10
                // marginLeft: 10,
                // marginRight: 10,
              }}
            >
              {this.state.activebtn == "report" ? (
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
                  onPress={() => this.setState({ activebtn: "report" })}
                >
                  <Text style={{ fontSize: 14, color: "white" }}>Report</Text>
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
                  onPress={() => this.setState({ activebtn: "report" })}
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
                paddingTop: 0,
                backgroundColor: "white"
              }}
            >
              <WebView
                style={{ flex: 1 }}
                originWhitelist={["*"]}
                allowFileAccessFromFileURLs
                allowFileAccess={true}
                source={{
                  // uri: "http://visionarylifesciences.com/privacy-policy.html",
                  uri: this.state.Link + this.state.ReportId
                }}
                renderLoading={this.LoadingIndicatorView}
              />

              {/* <KeyboardAwareScrollView enableOnAndroid={true}>
                {this.state.reportDetailArr.length <= 0 ? null : (
                  <View style={styles.container}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        backgroundColor: "white"
                      }}
                    >
                      <View
                        style={{ flex: 1, flexDirection: "row", marginTop: 5 }}
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
                          Lab Name:
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
                          {this.state.reportDetailArr[0].LabName}
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
                          source={require("../../icons/mobile-number.png")}
                          style={{ height: 16, width: 15, marginLeft: 5 }}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            paddingTop: 2,
                            color: "gray",
                            marginLeft: 10,
                            //width: 65,
                            width: 75,
                            textAlign: "left",
                            backgroundColor: "white"
                          }}
                          numberOfLines={1}
                        >
                          Lab Contact:
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
                            // flex: 1,
                            fontSize: 12,
                            marginTop: 0,
                            color: "black",
                            marginRight: 10,
                            marginLeft: -50,
                            textAlign: "right",
                            padding: 2
                          }}
                        >
                          {this.Decrypt(
                            this.state.reportDetailArr[0].LabContact
                          )}
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
                      style={{ flex: 1, flexDirection: "row", marginTop: 5 }}
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
                        {this.state.reportDetailArr[0].TestDate}
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
                      style={{ flex: 1, flexDirection: "row", marginTop: 5 }}
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
                        Report Created On:
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
                        {moment(
                          this.state.reportDetailArr[0].ReportCreatedAt
                        ).format("DD/MM/YYYY")}
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
                      style={{ flex: 1, flexDirection: "row", marginTop: 5 }}
                    >
                      <Image
                        source={require("../../icons/my-doctors.png")}
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
                      >
                        Doctor:
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
                        {this.state.reportDetailArr[0].DoctorName}
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
                        flexDirection: "column",
                        marginTop: 5,
                        backgroundColor: "white"
                      }}
                    >
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
                        Comment:
                      </Text>
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
                        {this.state.reportDetailArr[0].Note_Comment}
                      </Text>
                    </View>
                    <View
                      style={{
                        height: 0.5,
                        backgroundColor: "lightgray",
                        marginTop: 5
                      }}
                    ></View>

                    {this.state.doccomment.length > 0 && (
                      <>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "column",
                            marginTop: 5,
                            backgroundColor: "white"
                          }}
                        >
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
                            {this.state.doccomment.length > 0
                              ? "Doctor Comment"
                              : null}
                          </Text>
                          {this.state.doccomment.map((item, index) => (
                            <View key={index} style={{ flexDirection: "row" }}>
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
                                {moment(item.Createddate).format("DD/MM/YY")}
                              </Text>

                              <Text
                                style={{
                                  flex: 1,
                                  fontSize: 12,
                                  marginTop: 10,
                                  color: "black",
                                  marginRight: 5,
                                  textAlign: "right",
                                  backgroundColor: "white",
                                  padding: 2
                                }}
                              >
                                {item.Note}
                              </Text>
                            </View>
                          ))}
                        </View>

                        <View
                          style={{
                            height: 0.5,
                            backgroundColor: "lightgray",
                            marginTop: 5
                          }}
                        ></View>
                      </>
                    )}
                  </View>
                )}

                {this.state.subReportDetails.map((item, index) => (
                  <View key={index}>
                    <ReportAnalyteCard
                      analyte={item.Analyte}
                      subanalyte={item.Subanalyte}
                      specimen={item.Specimen}
                      value={this.Decrypt(item.Value)}
                      iszero={item.iszero}
                      range={item.ReferenceRange}
                      // result={'NA'}
                      result={this.Decrypt(item.Result)}
                      method={item.Method}
                    ></ReportAnalyteCard>
                  </View>
                ))}

                {this.state.from == "Doctor" &&
                  this.state.from != undefined &&
                  this.state.status != undefined &&
                  this.state.status == "Pending" &&
                  this.state.editcommetn != false && (
                    <>
                      <View style={{}}>
                        <View
                          style={{
                            height: 60,
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
                            style={{ flex: 1, backgroundColor: "white" }}
                            onChangeText={(text) =>
                              this.setState({ docnote: text })
                            }
                            multiline={true}
                            underlineColorAndroid="transparent"
                            placeholder="Enter your comment here..."
                            returnKeyType="done"
                            blurOnSubmit={true}
                            maxLength={200}
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
              </KeyboardAwareScrollView> */}
            </View>
          ) : (
            this.state.isLoading == false &&
            this.state.activebtn == "graph" && (
              <ScrollView
                alwaysBounceVertical={true}
                showsHorizontalScrollIndicator={false}
                style={{ backgroundColor: "#F7F7F7", marginTop: 0 }}
              >
                <View style={styles.graphcontainer}>
                  {this.state.subReportGraphData.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "white",
                        marginTop: 15
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          backgroundColor: "white",
                          marginLeft: 10,
                          marginRight: 10
                        }}
                      >
                        {item.Subanalyte != "" ? (
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 14,
                              textAlign: "center",
                              margin: 10,
                              backgroundColor: "white",
                              color: "gray"
                            }}
                          >
                            {item.Analyte} / {item.Subanalyte}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 14,
                              textAlign: "center",
                              margin: 10,
                              backgroundColor: "white",
                              color: "gray"
                            }}
                          >
                            {item.Analyte}
                          </Text>
                        )}
                      </View>

                      {item.iszero == "No" && (
                        <Speedometer
                          value={parseFloat(this.Decrypt(item.Value))}
                          totalValue={item.Maxvalue}
                          size={250}
                          percentSize={0.6}
                          outerColor="#d3d3d3"
                          internalColor={item.internalColor}
                          showIndicator={true}
                        />
                      )}
                      {item.iszero == "Yes" && (
                        <Speedometer
                          value={parseFloat(this.Decrypt(item.Value))}
                          size={250}
                          percentSize={0.6}
                          outerColor={item.outerColor}
                          internalColor={item.internalColor}
                          showText
                          text={"Result:" + this.Decrypt(item.Result)}
                          labelStyle={{ color: "blue" }}
                          showIndicator={true}
                        />
                      )}

                      {item.iszero == "No" && (
                        <>
                          <View
                            style={{
                              flex: 3,
                              justifyContent: "center",
                              alignItems: "center",
                              flexDirection: "row"
                            }}
                          >
                            <Text
                              style={{
                                flex: 1,
                                textAlign: "center",

                                fontSize: 15
                              }}
                            >
                              {"Value:" + this.Decrypt(item.Value)}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              // backgroundColor: "red",
                              marginLeft: 10,
                              marginRight: 10,
                              marginTop: 10
                            }}
                          >
                            <Text
                              style={{
                                flex: 1,
                                fontSize: 15,
                                textAlign: "left",
                                marginLeft: 10
                              }}
                            >
                              {"Min Range: " + item.Minvalue}
                            </Text>
                            <Text
                              style={{
                                flex: 1,
                                fontSize: 14,
                                textAlign: "right"

                                // color: "gray",
                                // marginLeft: 50,
                              }}
                            >
                              {"Max Range:" + item.Maxvalue}
                            </Text>
                          </View>

                          <Text
                            style={{
                              flex: 1,
                              fontSize: 15,
                              textAlign: "left",
                              marginLeft: 10
                              // backgroundColor: "white",
                              // color: "gray",
                              // marginLeft: 50,
                            }}
                          >
                            {"Result:" + this.Decrypt(item.Result)}
                          </Text>
                        </>
                      )}
                    </View>
                  ))}
                </View>
              </ScrollView>
            )
          )}
        </View>
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
    marginTop: Platform.OS === "ios" ? 10 : 0,
    marginBottom: Platform.OS === "ios" ? 2 : 0,
    backgroundColor: "#F7F7F7",
    elevation: 2
  }
});
