import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  TextInput,
  RefreshControl,
  Platform,
  Alert
} from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { CommonActions } from "@react-navigation/native";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import moment from "moment";
import CustomeHeader from "../appComponents/CustomeHeader";
import axios from "axios";
import Modal from "react-native-modal";
import TestListRow from "../appComponents/TestListRow";
import PaginationLoading from "../appComponents/PaginationLoading";
import Toast from "react-native-tiny-toast";
import { ListItem } from "native-base";
var resultValueFlag = "";
import DateTimePicker from "react-native-modal-datetime-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Voice from "@react-native-voice/voice";
import wordsToNumbers from "words-to-numbers";
function IsvalueBetweenRange(RefArray, value) {
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
export default class ReportManualPunchWithVoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activebtn: "FEET",
      isErr: false,
      isLoading: false,
      pageNo: 1,
      searchString: "",
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      selectedIds: [],
      AllTestList: [],
      AnalyteList: [],
      AnalyteTempList: [],
      resultArray: [],
      InterpretationList: [],
      selectedId: 0,
      testName: "",
      bookingdate: "",
      labName: "",

      BookingId: "",
      ReportId: "",
      pickerVisible: false,
      selectPicker: "",
      resultIndex: 0,

      prescriptionName: "",
      prescriptionPic: [],
      progess: 0,
      prescriptionUri: null,

      addressinput: "",
      isShowDataPicker: false,
      date: "2016-05-15",
      showPickerCheck: false,
      isDatePickerVisible: false,
      typingTimeout: 0,
      isLoadingSecond: false,
      typing: true,
      isPrescription: false,
      filledAnalyteList: [],
      otherreportdetails: [],
      isother: false,
      othertestname: "",
      ReportPath: "",
      ismanualpunchapicalled: false,
      // voce
      started: "",
      end: "",
      isstarted: false,
      pitch: "",
      error: "",
      partialResults: [],
      results: [],
      speech: "",
      inputname: "",
      isAnalyteList: false,
      idtohernm: "",
      valothernm: ""
    };
    Voice.onSpeechStart = this.onSpeechStartHandler.bind(this);
    Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
    Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
  }

  onSpeechStartHandler = (e) => {
    console.log("onSpeechStartHandler: ", e);
  };
  onSpeechEndHandler = (e) => {
    console.log("onSpeechEndHandler: ", e);
  };
  onSpeechResultsHandler = (e) => {
    console.log("onSpeechResultsHandler: ", e, "input", this.state.inputname);
    let sen = e.value[0];
    if (this.state.inputname == "selecttest") {
      this.setState(
        {
          speech: sen,
          // isstarted: false,
          searchString: sen
        },
        () => {
          this.onChangeTextClick(sen);
        }
      );
    } else if (this.state.inputname == "note") {
      this.setState({
        speech: sen,
        // isstarted: false,
        addressinput: sen
      });
    } else if (this.state.inputname == "testname") {
      this.setState({
        speech: sen,
        // isstarted: false,
        othertestname: sen
      });
    } else if (this.state.inputname == "otherparamnm") {
      let id = this.state.idtohernm;
      let val = this.state.valothernm;
      console.log(
        id,
        "other input to handle id",
        this.state.otherreportdetails
      );
      this.setState(
        {
          speech: sen
          // isstarted: false
        },
        () => {
          this.handleChangeParamname(id, sen);
        }
      );
    } else if (this.state.inputname == "othermin") {
      let id = this.state.idtohernm;
      let val = this.state.valothernm;
      let wordtonum = wordsToNumbers(sen);
      console.log(wordtonum, "numsjs");
      this.setState(
        {
          speech: sen
          // isstarted: false
        },
        () => {
          this.handleChangeMin(id, sen);
        }
      );
    } else if (this.state.inputname == "othermax") {
      let id = this.state.idtohernm;
      let val = this.state.valothernm;
      let wordtonum = wordsToNumbers(sen);
      console.log(
        id,
        "other input to handle id",
        this.state.otherreportdetails
      );
      this.setState(
        {
          speech: sen
          // isstarted: false
        },
        () => {
          this.handleChangeMax(id, wordtonum);
        }
      );
    } else if (this.state.inputname == "otherunit") {
      let id = this.state.idtohernm;
      let val = this.state.valothernm;
      console.log(
        id,
        "other input to handle id",
        this.state.otherreportdetails
      );
      this.setState(
        {
          speech: sen
          // isstarted: false
        },
        () => {
          this.handleChangeUnit(id, sen);
        }
      );
    } else if (this.state.inputname == "otherval") {
      let id = this.state.idtohernm;
      let val = this.state.valothernm;
      let wordtonum = wordsToNumbers(sen);
      console.log(
        id,
        "other input to handle id",
        this.state.otherreportdetails
      );
      this.setState(
        {
          speech: sen
          // isstarted: false
        },
        () => {
          this.handleChangevalue(id, wordtonum);
        }
      );
    } else if (this.state.inputname == "otherres") {
      let id = this.state.idtohernm;
      let val = this.state.valothernm;
      console.log(
        id,
        "other input to handle id",
        this.state.otherreportdetails
      );
      this.setState(
        {
          speech: sen
          // isstarted: false
        },
        () => {
          this.handleChangeResult(id, sen);
        }
      );
    } else {
      this.setState({
        speech: sen,
        // isstarted: false,
        labName: sen
      });
    }
    // setTimeout(() => {
    //   this._destroyRecognizer();
    // }, 6000);
  };
  stopRecording = async () => {
    try {
      this.setState({
        isstarted: false
      });
      await Voice.stop();
    } catch (error) {
      console.log("error raised", error);
    }
  };
  _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    this.setState({
      partialResults: [],
      results: [],
      speech: "",
      inputname: "",

      idtohernm: "",
      valothernm: "",
      started: "",
      end: "",
      isstarted: false,
      pitch: "",
      error: ""
    });
  };
  getSuggestedTest = async (empty) => {
    console.log(this.state.pageNo, "this.state.pageno");

    try {
      let response = await axios.post(
        Constants.GET_REPORT_MANUAL_PUCH_TEST_LIST,
        {
          pageNumber: this.state.pageNo,
          pageSize: 20,
          // pageSize: Constants.PER_PAGE_RECORD,
          Searching: this.state.searchString
        }
      );

      this.setState({ isLoading: false });
      this.setState({ isModalVisible: true });
      if (response.data.Status) {
        let responseData = this.state.AllTestList;
        this.setState({ isModalVisible: true });
        response.data.TestList.map((item) => {
          responseData.push(item);
        });

        this.setState({
          AllTestList: this.removeDuplicate(responseData),
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
    } catch (errors) {
      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        searchLoading: false,
        refreshing: false,
        isModalVisible: false
      });
      // console.log(errors);
    }
  };

  ReportManualPunchAPI = async () => {
    console.log("this.state.labName ===================", this.state.labName);
    console.log(
      "this.state.selectedId ===================",
      this.state.bookingdate
    );
    console.log("this.state.testid ===================", this.state.selectedId);

    try {
      let response = await axios.post(Constants.MANUAL_REPORTPUNCH, {
        LabName: this.state.labName,
        DoctorId: 0,
        TestId: this.state.selectedId,
        Testdate: this.state.bookingdate
      });
      console.log("data==============", response.data);
      // this.setState({ isLoading: false });

      if (response.data.Status) {
        this.setState(
          {
            // AllTestList: this.removeDuplicate(responseData),
            isLoading: true,
            BookingId: response.data.BookingId,
            ReportId: response.data.ReportId,
            refreshing: false,
            // AnalyteTempList: [],
            // AnalyteList: [],
            ismanualpunchapicalled: true
          },
          () => {
            this.BookAppointments();
            // this.GetReportValuesAPI();
          }
        );
      } else {
        Toast.show(response.data.Msg);
        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      }
    } catch (errors) {
      Toast.show(response.data.Msg);
      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        searchLoading: false,
        refreshing: false
      });
      // console.log(errors, 'errors');
    }
  };

  GetReportValuesAPI = async () => {
    console.log(
      "this.state.BookingId ===================",
      this.state.BookingId
    );

    try {
      // let response = await axios.post(
      //   Constants.GET_REPORTVALUE + "=" + this.state.BookingId,
      //   {}
      // );
      //new
      let response = await axios.post(
        Constants.GET_REPORTVALUES_UPDATED_ANALYTE_SUBANALYTE +
          "=" +
          this.state.selectedId,
        // this.state.BookingId,
        {}
      );
      // console.log(
      //   "GET_REPORTVALUE==============",
      //   JSON.stringify(response.data)
      // );
      // this.setState({ isLoading: false });

      // console.log(response, 'Get report values');
      if (response.data.Status) {
        let responseData = this.state.AnalyteList;

        response.data.AnalyteList.map((item) => {
          // console.log(
          //   '****************GET_REPORTVALUE==============*************',
          //   item
          // );
          let temp = {};
          temp = item;
          let ReferenceRange =
            item.FemaleRange == "" ? item.MaleRange : item.FemaleRange;
          (temp.ReportId = this.state.ReportId),
            (temp.TestId = this.state.selectedId),
            (temp.Result = ""),
            (temp.Value = ""),
            (temp.BookingId = this.state.BookingId),
            (temp.ReferenceRange = ReferenceRange);
          var RefArray = ReferenceRange.split("-");
          temp.iszero = IsvalueBetweenRange(RefArray, "0");

          // item.ReportPath = '',
          responseData.push(item);
        });

        // console.log("responseData==============", JSON.stringify(responseData));

        this.setState({
          AnalyteList: responseData,
          isAnalyteList: true,
          InterpretationList: responseData.InterpretationList,
          isLoading: false,
          refreshing: false
        });
      } else {
        Toast.show(response.data.Msg);
        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false,
          isAnalyteList: false
        });
      }
    } catch (errors) {
      // Toast.show(errors.Error);
      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        searchLoading: false,
        refreshing: false,
        isErr: true,
        isAnalyteList: false
      });
      // console.log(errors, '@@@@@Erroes ');
    }
  };

  RemoveMethod(key) {
    const AnalyteTempList = { ...this.state.AnalyteTempList };
    delete AnalyteTempList[key];
    this.setState(
      {
        AnalyteTempList: AnalyteTempList
      },
      () => {
        this.BookAppointments();
      }
    );
  }

  BookAppointments = async () => {
    console.log(
      "AnalyteTempList APi data  =================",
      this.state.AnalyteTempList
    );

    if (this.state.isother) {
      try {
        let response = await axios.post(
          Constants.ADD_OLD_REPORT_MANUALPUCNCHING,
          {
            TestName: this.state.othertestname,
            RefDoctor: "",
            TestDate: this.state.bookingdate,
            ReportPath: this.state.ReportPath,
            Notes: this.state.addressinput,
            LabName: this.state.labName,
            ParameterDetails: this.state.AnalyteTempList
          }
        );
        console.log("data==============", response.data);

        if (response.data.Status) {
          this.setState({ isLoading: false });
          Toast.show(response.data.Msg);

          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: "Drawer",
                  params: { refresh: true }
                },
                {
                  name: "MyReports",
                  params: { refresh: true }
                }
              ]
            })
          );
        } else {
          this.setState({ isLoading: false });
          Toast.show(response.data.Msg);
        }
      } catch (errors) {
        Toast.show("Something went wrong.try again later");

        this.setState({ isLoading: false });
        // console.log(errors);
      }
    } else {
      let responseData = [];
      this.state.AnalyteTempList.map((item) => {
        let temp = {};
        temp = item;
        (temp.ReportId = this.state.ReportId),
          (temp.TestId = this.state.selectedId),
          (temp.BookingId = this.state.BookingId),
          (temp.ReferenceRange = ReferenceRange);

        responseData.push(item);
      });
      try {
        let response = await axios.post(Constants.ADD_REPORT, {
          AnalyteDetails: responseData, //this.state.AnalyteTempList,
          Notes: this.state.addressinput
        });
        console.log("normal report data==============", response.data);
        this.setState({ isLoading: false });

        if (response.data.Status) {
          this.setState({ isLoading: false });
          Toast.show(response.data.Msg);

          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: "Drawer",
                  params: { refresh: true }
                },
                {
                  name: "MyReports",
                  params: { refresh: true }
                }
              ]
            })
          );
        } else {
          Toast.show(response.data.Msg);
          this.setState({ isLoading: false });
        }
      } catch (errors) {
        ///Toast.show(errors)

        this.setState({ isLoading: false });
        // console.log(errors);
      }
    }
  };

  handleSelectionMultiple = (testid, testname) => {
    console.log("TestID==============================", testid);
    this.setState(
      {
        selectedId: testid,
        testName: testname,
        isother: false,
        othertestname: "",
        Searching: "",
        otherreportdetails: [],
        AnalyteTempList: [],
        AnalyteList: []
      },
      () => {
        this.DismissModal();
        this.GetReportValuesAPI();
        // this.ReportManualPunchAPI();
      }
    );
  };
  handleSelectionOther = (testname) => {
    // console.log("TestID==============================", testid);
    this.setState(
      {
        isother: true,
        testName: testname,
        AnalyteTempList: [],
        AnalyteList: [],
        selectedId: 0,
        Searching: ""
      },
      () => {
        this.DismissModal();
      }
    );
  };

  toggleModal = () => {
    // if (this.state.labName == "") {
    //   Toast.show("Please enter Labname");
    // } else if (this.state.bookingdate == "") {
    //   Toast.show("Please select the report date");
    // } else {
    // this.setState({ isModalVisible: !this.state.isModalVisible,AllTestList: []},()=>{
    this.setState({
      selectedIds: [],
      isLoading: true,
      AllTestList: [],
      Searching: "",
      pageNo: 1,
      inputname: "selecttest"
    });

    this.getSuggestedTest();
    // this._startRecognizing();

    // console.log("&&*&*&*&****", this.state.isModalVisible);
    // }
  };

  togglePicker = (resultarray, index) => {
    /// this.setState({isModalVisible: !this.state.isModalVisible});
    // console.log('resultarray==============================', resultarray);
    // console.log('index==============================', index);

    //this.getSuggestedTest('');
    this.setState({
      pickerVisible: !this.state.pickerVisible,
      resultArray: resultarray,
      resultIndex: index
    });
  };

  DismissModal = () => {
    this.setState(
      {
        isstarted: false,
        searchString: "",
        isModalVisible: false
      },
      () => {
        this.onSpeechEndHandler();
      }
    );
  };

  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return !this[a.TestId] && (this[a.TestId] = true);
    }, Object.create(null));
  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 5;
  };

  callpagination = async () => {
    this.setState(
      {
        paginationLoading: true,
        pageNo: this.state.pageNo + 1
      },
      () => {
        this.getSuggestedTest();
      }
    );
  };

  onChangeTextClick = async (val) => {
    // console.log('======', val);
    this.setState({ isLoadingSecond: true });
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState({
      searchString: val,
      typing: false,
      typingTimeout: setTimeout(() => {
        this.setState(
          {
            searchString: val,
            AllTestList: [],
            pageNo: 1,
            searchLoading: true,
            refreshing: true
          },
          () => {
            this.getSuggestedTest(true);
          }
        );
      }, 1000)
    });
  };

  onChangeTextValueDiscription = async (val, index) => {
    // console.log("======", val);

    let AnalyteList = [...this.state.AnalyteList];
    let filledAnalyteList = [...this.state.filledAnalyteList];

    AnalyteList[index] = { ...AnalyteList[index], Value: val };
    filledAnalyteList[index] = { ...AnalyteList[index], Value: val };

    // console.log(AnalyteList, "filled value //////*****ana");
    // console.log(filledAnalyteList, ".filed value ...?????fileed");

    this.setState({ AnalyteList, filledAnalyteList });
  };

  onRefresh = async () => {
    this.setState(
      {
        refreshing: true,
        AllTestList: [],
        searchString: "",
        pageNo: 1
      },
      () => {
        this.getSuggestedTest();
      }
    );
  };

  onValueChange(value) {
    //  console.log(value, "selected picker value ");
    this.setState(
      {
        selectPicker: value
      },
      () => {
        let AnalyteList = [...this.state.AnalyteList];
        AnalyteList[this.state.resultIndex] = {
          ...AnalyteList[this.state.resultIndex],
          Result: this.state.selectPicker
        };
        this.setState({
          AnalyteList,
          pickerVisible: !this.state.pickerVisible
        });
      }
    );
  }

  onPressSubmit = () => {
    console.log(
      "onPressSubmit response=================",
      this.state.testName,
      this.state.isother
    );

    if (this.state.labName == "") {
      Toast.show("Please enter Lab Name");
    } else if (!isNaN(this.state.labName)) {
      Toast.show("Please enter only alphabets in Lab Name");
    } else if (this.state.bookingdate == "") {
      Toast.show("Please select date");
    } else if (this.state.testName == "") {
      Toast.show("Please Select Test");
    } else if (
      this.state.testName == "Other" &&
      this.state.othertestname == ""
    ) {
      Toast.show("Please Enter Test Name");
    } else if (
      this.state.testName == "Other" &&
      this.state.othertestname != "" &&
      !isNaN(this.state.othertestname)
    ) {
      Toast.show("Please Enter only alphabets in Test Name");
    } else if (
      this.state.testName == "Other" &&
      this.state.otherreportdetails.length <= 0
    ) {
      // console.log(this.state.otherreportdetails.length, "len otegr records ");
      Toast.show("Please Add Record Details");
    }
    // else if (this.state.BookingId == "" && this.state.isother == false) {
    //   Toast.show("BookingId not generate");
    // }
    //  else if (this.state.prescriptionName == "") {
    //   Toast.show("Upload Report Picture");
    // }
    else {
      let responseData = [];
      let iszero = "";
      let filtered;
      //  other = [];

      filtered = this.state.filledAnalyteList.filter((x) => x != null);
      if (this.state.otherreportdetails.length > 0) {
        // console.log(
        //   this.state.otherreportdetails,
        //   "------this.state.otherreportdetails"
        // );
        for (const item of this.state.otherreportdetails) {
          // console.log(item, "------=====+++");

          if (
            item.Result == "" &&
            item.Value == "" &&
            item.MaxRange == "" &&
            item.MinRange == "" &&
            item.ParameterName == "" &&
            item.Unit == ""
          ) {
            resultValueFlag = "";
            responseData = [];
            iszero = "No";
          } else if (item.ParameterName == "") {
            Toast.show("Please enter ParameterName");
            resultValueFlag = "ParameterName";
            break;
          } else if (item.ParameterName != "" && !isNaN(item.ParameterName)) {
            Toast.show("Please enter only alphabets in ParameterName");
            resultValueFlag = "ParameterName";
            break;
          } else if (item.MinRange == "") {
            Toast.show("Please enter MinRange");
            resultValueFlag = "MinRange";
            break;
          } else if (item.MaxRange == "") {
            Toast.show("Please enter MaxRange");
            resultValueFlag = "MaxRange";
            break;
          } else if (item.Unit == "") {
            Toast.show("Please enter Unit");
            resultValueFlag = "Unit";
            break;
          } else if (item.Unit != "" && !isNaN(item.Unit)) {
            Toast.show("Please enter only alphabets in Unit");
            resultValueFlag = "Unit";
            break;
          } else if (item.Result == "") {
            Toast.show("Please enter  Result");
            resultValueFlag = "Result";
            break;
          } else if (item.Result != "" && !isNaN(item.Result)) {
            Toast.show("Please enter only alphabets in Result");
            resultValueFlag = "Result";
            break;
          } else if (
            item.Value == "" &&
            item.MinRange != "" &&
            item.MaxRange != ""
          ) {
            Toast.show("Please enter Value");
            resultValueFlag = "Value";
            break;
          } else if (
            item.ParameterName != "" &&
            item.MinRange != "" &&
            item.MaxRange != "" &&
            item.Result != "" &&
            item.Value != "" &&
            item.Unit != ""
          ) {
            // console.log(
            //   "other report details Result Value found  ==============",
            //   item.Value,
            //   item.Result
            // );
            responseData.push(item);
          }
        }
      }
      if (filtered.length <= this.state.AnalyteList.length) {
        for (const item of this.state.AnalyteList) {
          // console.log(item, "------=====+++");
          if (item.iszero == "Yes") {
            if (item.Result == "") {
              resultValueFlag = "";
              responseData = [];
              iszero = "Yes";
            } else if (item.Result == "" && item.iszero == "Yes") {
              if (item.iszero == "No") {
                Toast.show("Please select Result for " + item.SubAnalyteName);
              }
              responseData = [];
              resultValueFlag = "result";
              break;
            } else if (item.Result != "" && item.iszero == "Yes") {
              // console.log(
              //   "for zeros Result Value found  ==============",
              //   item.Value,
              //   item.Result
              // );
              responseData.push(item);
            }
          } else {
            if (item.Result == "" && item.Value == "") {
              resultValueFlag = "";
              responseData = [];
              iszero = "No";
            } else if (item.Result != "" && item.Value == "") {
              if (item.iszero == "No") {
                Toast.show(
                  "Please Fill the Value description, Where Result is selected for " +
                    item.AnalyteName
                );
              }
              responseData = [];
              resultValueFlag = "value";
              break;
            } else if (item.Result == "" && item.Value != "") {
              if (item.iszero == "No") {
                Toast.show(
                  "Please select the result, Where Value description is filled for " +
                    item.AnalyteName
                );
              } else {
                Toast.show("Please select the result for " + item.AnalyteName);
              }
              responseData = [];
              resultValueFlag = "result";

              break;
            } else if (item.Result != "" && item.Value != "") {
              // console.log(
              //   "Result Value found  ==============",
              //   item.Value,
              //   item.Result
              // );
              responseData.push(item);
            }
          }
        }
      }

      // console.log(" AnalyteList==============", this.state.AnalyteList.length);
      if (
        responseData.length < this.state.AnalyteList.length &&
        this.state.isother == false
      ) {
        if (resultValueFlag == "" && iszero == "No") {
          Toast.show("Please fill result and value description");
        } else if (resultValueFlag == "" && iszero == "Yes") {
          Toast.show("Please select result ");
        }
      } else {
        if (
          responseData.length < this.state.otherreportdetails.length &&
          this.state.isother
        ) {
          if (resultValueFlag == "") {
            Toast.show("Please Fill the Record Details");
          }
        } else {
          // console.log("else else after isother true ");
          //For other Deails
          this.setState(
            {
              AnalyteTempList: responseData
            },
            () => {
              Alert.alert(
                "Please verify your information",
                "Are you sure the details entered by you are correct as specified in your medical reports?",
                [
                  {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  {
                    text: "Yes",
                    onPress: () => {
                      this.setState({ isLoading: true });
                      this.uploadPrescription();
                    }
                  }
                ]
              );
            }
          );
        }
      }
    }
  };

  uploadPrescription = () => {
    var that = this;

    if (this.state.isother) {
      this.BookAppointments();
    } else {
      let responseData = [];
      this.state.AnalyteTempList.map((item) => {
        (item.ReportPath = ""), delete item["InterpretationList"];
        responseData.push(item);
      });
      this.setState(
        {
          AnalyteTempList: responseData
        },
        () => {
          this.ReportManualPunchAPI();
          // this.BookAppointments();
        }
      );
    }
  };
  //

  //
  // Modal

  showDateTimePicker = () => {
    // console.log('os d msnens@@@@@')
    this.setState({ isShowDataPicker: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isShowDataPicker: false });
  };

  handleDatePicked = (date) => {
    // let formatdate = moment(currentDate).format('hh:mm A');
    let formatdate = moment(date).format("DD/MM/YYYY");

    this.setState({
      bookingdate: formatdate,
      isShowDataPicker: false
    });
    // console.log("A date has been picked: ", date);
    this.hideDateTimePicker();
  };
  renderModalPicekr = () => {
    // console.log("modal date picker");
    return (
      <DateTimePicker
        isVisible={this.state.isShowDataPicker}
        onConfirm={this.handleDatePicked}
        onCancel={this.hideDateTimePicker}
        maximumDate={new Date()}
        display="spinner"
      />
    );
  };
  onChange = (event, selectedDate) => {
    // console.log(selectedDate, '@@@@@selected Date');

    if (event.type == "set") {
      const currentDate = selectedDate || date;

      let formatdate = moment(currentDate).format("DD/MM/YYYY");
      // .replace(/\-/g, '/');

      this.setState({
        bookingdate: formatdate,
        isShowDataPicker: false
        // selectedtimeslot: '',
      });
    } else {
      this.setState({
        isShowDataPicker: false
      });
    }
  };
  ClosePOPup = () => {
    // console.log('ClosePOPup=================');
    this.setState({ isPrescription: false }, () => {});
  };

  showPicker = () => {
    if (this.state.showPickerCheck) {
      this.setState({ showPickerCheck: false });
    } else {
      this.setState({ showPickerCheck: true });
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
                mode="date"
                is24Hour={true}
                display="default"
                dateFormat="day month year"
                onChange={this.onChange}
              />
            )}
      </>
    );
  };
  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };

  onpickervalueselected = (value) => {
    // console.log(value.Result, "selected value");
    this.setState(
      {
        selectPicker: value.Result
      },
      () => {
        let AnalyteList = [...this.state.AnalyteList];
        let filledAnalyteList = [...this.state.filledAnalyteList];
        AnalyteList[this.state.resultIndex] = {
          ...AnalyteList[this.state.resultIndex],
          Result: this.state.selectPicker
        };
        filledAnalyteList[this.state.resultIndex] = {
          ...AnalyteList[this.state.resultIndex],
          Result: this.state.selectPicker
        };
        // console.log(AnalyteList, "//////*****ana");
        // console.log(filledAnalyteList, "....?????fileed");
        this.setState({
          AnalyteList,
          pickerVisible: false,
          Result: this.state.selectPicker,
          filledAnalyteList
        });
      }
    );
  };
  //other options
  handleChangevalue = (i, event) => {
    if (isNaN(event)) {
      Toast.show("Please enter only number");
    } else {
      console.log(event);
      const values = [...this.state.otherreportdetails];
      console.log(values[i], "////........");
      values[i].Value = event;
      this.setState({ otherreportdetails: values });
    }
  };

  onMicPressForOtherReportOption = async (id, input) => {
    console.log(" onMicPress=========///////?????stratr recognisinf ");

    this.setState(
      {
        inputname: input,
        isstarted: true,
        idtohernm: id
      },
      () => {
        this._startRecognizing();
      }
    );
  };
  handleChangeParamname = (i, event) => {
    console.log("@>?>?", i, event);
    const values = [...this.state.otherreportdetails];
    values[i].ParameterName = event;
    console.log(values, "handle param name");
    this.setState({ otherreportdetails: values });
    // this._destroyRecognizer();
  };
  handleChangeResult = (i, event) => {
    const values = [...this.state.otherreportdetails];
    values[i].Result = event;
    this.setState({ otherreportdetails: values });
    // this._destroyRecognizer();
  };
  handleChangeUnit = (i, event) => {
    const values = [...this.state.otherreportdetails];
    values[i].Unit = event;
    this.setState({ otherreportdetails: values });
    // this._destroyRecognizer();
  };
  handleChangeMin = (i, event) => {
    console.log(event, "////to hanlde min values ");
    let convertonum = wordsToNumbers(event);
    console.log(event, "////to hanlde min values ", convertonum);

    if (isNaN(convertonum)) {
      Toast.show("Please enter only number in minimum range");
    } else {
      console.log("////handle min", i, event);
      const values = [...this.state.otherreportdetails];
      values[i].MinRange = convertonum;
      this.setState({ otherreportdetails: values });
    }
  };
  handleChangeMax = (i, event) => {
    if (isNaN(event)) {
      Toast.show("Please enter only number in maximum range");
    } else {
      const values = [...this.state.otherreportdetails];
      values[i].MaxRange = event;
      this.setState({ otherreportdetails: values });
      // this._destroyRecognizer();
    }
  };
  handleAdd = () => {
    // console.log("add presed");
    const values = [...this.state.otherreportdetails];
    values.push({
      ParameterName: "",
      Value: "",
      Result: "",
      MinRange: "",
      MaxRange: "",
      Unit: ""
    });
    this.setState({ otherreportdetails: values });
  };

  handleRemove = (i) => {
    const values = [...this.state.otherreportdetails];
    values.splice(i, 1);
    this.setState({ otherreportdetails: values });
  };
  _startRecognizing = async () => {
    console.log(" =========///////?????stratr recognisinf ");
    this.setState({
      started: "",
      end: "",

      pitch: "",
      error: "",
      partialResults: [],
      results: []
    });
    try {
      await Voice.start("en-US");
    } catch (e) {
      console.error(e);
    }
  };
  onMicPress = async (inputname) => {
    console.log(" onMicPress=========///////?????stratr recognisinf ");

    if (this.state.inputname == "selecttest") {
      this.setState(
        {
          inputname: inputname,
          isstarted: true
        },
        () => {
          this._startRecognizing();
        }
      );
    } else {
      this.setState(
        {
          inputname: inputname,
          isstarted: true
        },
        () => {
          this._startRecognizing();
        }
      );
    }
  };

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  renderVoiceModal = () => {
    return (
      <Modal isVisible={this.state.isstarted}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            borderRadius: 10,
            borderWidth: 0.1
          }}
        >
          <View
            style={{
              height: "50%",
              width: "100%",
              backgroundColor: "white",
              flexDirection: "column",
              borderRadius: 10
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                flexDirection: "column",
                borderRadius: 0
              }}
            >
              <TouchableOpacity
                style={{
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginTop: 20,
                  marginBottom: 0
                }}
                onPress={this.DismissModal.bind(this)}
              >
                <Image
                  source={require("../../icons/CLOSE2.png")}
                  style={{
                    height: 25,
                    width: 25,
                    marginRight: 15,
                    // margin: 15,
                    marginTop: 0
                  }}
                />
              </TouchableOpacity>
            </View>
            {/* <Image
            source={require("../../icons/logo-icon.png")}
            style={{
              height: 40,
              width: 40,
              marginTop: 10,
              justifyContent: "center",
              alignSelf: "center"
            }}
          /> */}

            <Text
              style={{
                marginTop: 10,
                fontSize: 20,
                fontWeight: "bold",
                color: "gray",
                textAlign: "center"
              }}
            >
              Speak
            </Text>
            {/* <View
            style={{
              height: 0.5,
              backgroundColor: "gray",
              marginRight: 5,
              marginTop: 8
            }}
          ></View> */}
            <View
              style={{
                backgroundColor: "white",
                flexDirection: "column",
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                style={{
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginTop: 10,
                  marginBottom: 0
                }}
                onPress={this.DismissModal.bind(this)}
              >
                <Image
                  // source={require("../../icons/microphone_ui_animation.gif")}
                  source={require("../../icons/speackanim.gif")}
                  // source={require("../../icons/microphone_ui_animation1sized.gif")}
                  style={{
                    height: 100,
                    width: 100,
                    marginRight: 15,

                    marginTop: 30
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  render() {
    console.log(
      this.state.isAnalyteList == true || this.state.isother == true,
      "other ---====",
      "this.state.isAnalyteList",
      this.state.isAnalyteList,
      "this.state.isother",
      this.state.isother
    );
    const screenWidth = Math.round(Dimensions.get("window").width);
    return (
      <View style={styles.MainContainer}>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="My Reports"
          headerId={1}
          navigation={this.props.navigation}
        />
        {/* <View
          style={{
            height: 60,
            backgroundColor: "white",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 15,
            marginLeft: 15
          }}
        >
          <View
            style={{
              flex: 1,
              borderWidth: 0.5,
              borderRadius: 20,
              height: 40,
              borderColor: "gray",
              flexDirection: "row"
            }}
          >
            <TextInput
              value={this.state.labName}
              placeholder="your text"
              style={{
                textAlign: "left",
                flex: 1,
                // paddingLeft: 5,
                fontSize: 15,
                marginLeft: 12
              }}
              onChangeText={(text) => this.setState({ labName: text })}
            />
            <View
              style={{
                height: 25,
                width: 1,
                marginTop: 8,
                marginBottom: 8,
                marginRight: 10,
                backgroundColor: "lightgray"
              }}
            ></View>
            {this.state.isstarted ? (
              <>
                <ActivityIndicator size="large" color="blue" />
                <TouchableOpacity
                  onPress={this.stopRecording}
                  style={{
                    height: 20,
                    width: 20,
                    marginRight: 18,
                    justifyContent: "center",
                    alignSelf: "center"
                  }}
                >
                  <Image
                    source={require("../../icons/stopvoice.png")}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={() => this.onMicPress("labname")}
                style={{
                  height: 20,
                  width: 20,
                  marginRight: 18,
                  justifyContent: "center",
                  alignSelf: "center"
                }}
              >
                <Image
                  source={require("../../icons/micoldreport.png")}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View> */}
        {/* <TouchableOpacity
          style={{
            alignSelf: "center",
            marginTop: 24,
            backgroundColor: "red",
            padding: 8,
            borderRadius: 4
          }}
          onPress={this.stopRecording}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Stop</Text>
        </TouchableOpacity> */}

        {/* {this.state.isstarted ? this.renderVoiceModal() : null} */}
        <Modal isVisible={this.state.isModalVisible} style={{ margin: 0 }}>
          <Loader loading={this.state.isLoading} />
          {/* {this.state.isstarted ? this.renderVoiceModal() : null} */}
          {this.state.isLoading == false && (
            <View
              style={{
                flex: 1,
                backgroundColor: "white"
              }}
            >
              <View
                style={{
                  marginTop: 20,
                  height: 60,
                  backgroundColor: "white",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    flex: 0.9,
                    backgroundColor: "#F5F5F5",
                    borderRadius: 20,
                    height: 40,
                    flexDirection: "row",
                    shadowOffset: { width: 0, height: 2 },
                    shadowColor: "gray",
                    shadowOpacity: 0.7,
                    elevation: 5
                  }}
                >
                  {this.state.isstarted &&
                  this.state.inputname == "selecttest" ? (
                    <>
                      <ActivityIndicator size="large" color="#3062ae" />
                      <TouchableOpacity
                        onPress={this.stopRecording}
                        style={{
                          height: 20,
                          width: 20,
                          marginRight: 18,
                          justifyContent: "center",
                          alignSelf: "center"
                        }}
                      >
                        <Image
                          source={require("../../icons/stopvoice.png")}
                          style={{ width: 20, height: 20 }}
                        />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.onMicPress("selecttest")}
                      // onPress={this._startRecognizing}
                      style={{
                        height: 20,
                        width: 20,
                        marginRight: 18,
                        justifyContent: "center",
                        alignSelf: "center"
                      }}
                    >
                      <Image
                        source={require("../../icons/micoldreport.png")}
                        style={{
                          height: 20,
                          width: 20,
                          marginLeft: 10
                          // marginTop: 10
                        }}
                      />
                    </TouchableOpacity>
                  )}

                  <TextInput
                    style={{
                      textAlign: "left",
                      flex: 1,
                      paddingLeft: 10,
                      fontSize: 15
                    }}
                    onChangeText={(val) => this.onChangeTextClick(val)}
                    value={this.state.searchString}
                    underlineColorAndroid="transparent"
                    placeholder="press speaker to enter test name.."
                    allowFontScaling={false}
                  />
                </View>

                <TouchableOpacity
                  style={{
                    height: 35,
                    width: 35,
                    marginRight: 5,
                    marginLeft: 5,
                    justifyContent: "center",
                    alignSelf: "center"
                  }}
                  onPress={this.DismissModal}
                >
                  <Image
                    source={require("../../icons/CLOSE2.png")}
                    style={{
                      height: 20,
                      width: 20,
                      padding: 5,
                      // marginRight: 10,
                      justifyContent: "center",
                      alignSelf: "center"
                    }}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.containermain}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  onScroll={({ nativeEvent }) => {
                    if (this.isCloseToBottom(nativeEvent)) {
                      this.callpagination();
                    }
                  }}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this.onRefresh}
                    />
                  }
                >
                  {this.state.AllTestList.map((item, index) => {
                    return (
                      <TestListRow
                        testname={item.TestName}
                        profile={item.ProfileName}
                        checkboximg={
                          this.state.selectedId == item.TestId
                            ? require("../../icons/radio-on.png")
                            : require("../../icons/radio-off.png")
                        }
                        onPress={() =>
                          this.handleSelectionMultiple(
                            item.TestId,
                            item.TestName
                          )
                        }
                      ></TestListRow>
                    );
                  })}

                  <View>
                    {this.state.paginationLoading ? (
                      <PaginationLoading />
                    ) : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    {this.state.searchLoading ? (
                      <Loader loading={this.state.isLoading} />
                    ) : null}
                  </View>
                </ScrollView>
                <View
                  style={{
                    flex: 20,
                    width: "100%",
                    height: "20%",
                    marginTop: -10
                  }}
                >
                  {this.state.AllTestList.length <= 0 &&
                  !this.state.isLoading &&
                  !this.state.searchLoading &&
                  !this.state.refreshing ? (
                    <>
                      <TouchableOpacity
                        onPress={() => this.handleSelectionOther("Other")}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            color: "#000",
                            marginLeft: 20
                          }}
                        >
                          Other
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => this.handleSelectionOther("Other")}
                      >
                        <View style={styles.container_textother}>
                          <View style={styles.titlesubview}>
                            <View style={styles.DRnamesubview}>
                              {/* <Text style={styles.title}>other</Text> */}
                            </View>
                            <TouchableOpacity
                              style={{
                                flex: 0.1,
                                justifyContent: "flex-end",
                                alignItems: "flex-end",
                                marginRight: 3
                              }}
                              onPress={() => {
                                // console.log("other pressed ");
                                this.handleSelectionOther("Other");
                              }}
                            >
                              <Image
                                // source={require("../../icons/radio-off.png")}
                                source={
                                  this.state.isother == true
                                    ? require("../../icons/radio-on.png")
                                    : require("../../icons/radio-off.png")
                                }
                                style={{
                                  height: 20,
                                  width: 20,
                                  marginRight: 10,
                                  alignSelf: "flex-end",
                                  alignContent: "stretch"
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View
                          style={{
                            height: 0.5,
                            backgroundColor: "#d8d8d8",

                            marginLeft: 20,
                            marginRight: 3,
                            marginTop: 10,
                            padding: 0.5
                          }}
                        ></View>
                      </TouchableOpacity>
                    </>
                  ) : null}
                </View>
              </View>
            </View>
          )}
        </Modal>

        <KeyboardAwareScrollView
          onKeyboardWillShow={(frames) => {
            console.log("Keyboard event", frames);
          }}
          enableOnAndroid={true}
        >
          <View
            style={{
              height: 60,
              backgroundColor: "white",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                flex: 0.9,
                backgroundColor: "#F5F5F5",
                borderRadius: 20,
                height: 40,
                flexDirection: "row",
                shadowOffset: { width: 0, height: 2 },
                shadowColor: "gray",
                shadowOpacity: 0.7,
                elevation: 5
              }}
            >
              <TextInput
                style={{
                  textAlign: "left",
                  flex: 1,

                  fontSize: 15,
                  marginLeft: 12
                }}
                editable={this.state.ismanualpunchapicalled ? false : true}
                onChangeText={(val) => this.setState({ labName: val })}
                value={this.state.labName}
                underlineColorAndroid="transparent"
                placeholder="Enter Lab Name.."
                allowFontScaling={false}
              />
              <View
                style={{
                  height: 25,
                  width: 1,
                  marginTop: 8,
                  marginBottom: 8,
                  marginRight: 10,
                  backgroundColor: "lightgray"
                }}
              ></View>
              {this.state.isstarted && this.state.inputname == "labname" ? (
                <>
                  <ActivityIndicator size="large" color="#3062ae" />
                  <TouchableOpacity
                    onPress={this.stopRecording}
                    style={{
                      height: 20,
                      width: 20,
                      marginRight: 18,
                      justifyContent: "center",
                      alignSelf: "center"
                    }}
                  >
                    <Image
                      source={require("../../icons/stopvoice.png")}
                      style={{ width: 20, height: 20 }}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={() => this.onMicPress("labname")}
                  style={{
                    height: 20,
                    width: 20,
                    marginRight: 18,
                    justifyContent: "center",
                    alignSelf: "center"
                  }}
                >
                  <Image
                    source={require("../../icons/micoldreport.png")}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
              )}
              {/* <TouchableOpacity
                    onPress={() => this.onMicPress("labname")}
                    // onPress={this._startRecognizing}
                    style={{
                      height: 20,
                      width: 20,
                      marginRight: 18,
                      justifyContent: "center",
                      alignSelf: "center"
                    }}
                  >
                    <Image
                      source={require("../../icons/micoldreport.png")}
                      style={{
                        height: 20,
                        width: 20
                      }}
                    />
                  </TouchableOpacity> */}
            </View>
          </View>

          <Text
            style={{
              marginTop: 10,
              fontSize: 14,
              marginLeft: 15,
              fontWeight: "bold"
            }}
          >
            Select date
          </Text>
          <View
            style={{
              height: 40,
              backgroundColor: "white",
              marginRight: 15,
              marginLeft: 15,

              marginTop: 10,
              borderRadius: 25,
              borderColor: "gray",
              borderWidth: 0.5,
              flexDirection: "row-reverse"
            }}
          >
            <TouchableOpacity
              // onPress={() => this.onMicPress("bookingdate")}
              onPress={() => {
                this.state.ismanualpunchapicalled
                  ? this.setState({ isShowDataPicker: false })
                  : this.setState({
                      isShowDataPicker: true
                    });
              }}
              style={{ justifyContent: "center" }}
            >
              <Image
                // source={require("../../icons/micoldreport.png")}
                source={require("../../icons/date-of-birth.png")}
                style={{
                  height: 20,
                  width: 20,
                  marginRight: 18,
                  justifyContent: "center",
                  alignSelf: "center"
                }}
              />
              {this.state.isShowDataPicker ? this.renderModalPicekr() : null}
            </TouchableOpacity>
            <View
              style={{
                height: 25,
                width: 1,
                marginTop: 8,
                marginBottom: 8,
                marginRight: 10,
                backgroundColor: "lightgray"
              }}
            ></View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                marginLeft: 12
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  this.state.ismanualpunchapicalled
                    ? this.setState({ isShowDataPicker: false })
                    : this.setState({
                        isShowDataPicker: true
                      })
                }
              >
                {this.state.bookingdate != "" ? (
                  <Text
                    style={{
                      marginLeft: 12,
                      color: "black",
                      alignSelf: "stretch"
                    }}
                  >
                    {this.state.bookingdate}
                  </Text>
                ) : (
                  <Text
                    style={{
                      marginLeft: 12,
                      color: "gray",
                      alignSelf: "stretch"
                    }}
                  >
                    Date of Booking
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Select Test */}
          <Text
            style={{
              marginTop: 20,
              fontSize: 14,
              marginLeft: 15,
              fontWeight: "bold"
            }}
          >
            Select test
          </Text>

          <View
            style={{
              height: 40,
              backgroundColor: "white",
              marginRight: 15,
              marginLeft: 15,

              marginTop: 15,
              borderRadius: 20,
              borderColor: "gray",
              borderWidth: 0.5,
              flexDirection: "row-reverse"
            }}
          >
            <TouchableOpacity
              style={{
                height: 20,
                width: 20,
                marginRight: 18,
                justifyContent: "center",
                alignSelf: "center"
              }}
              onPress={this.toggleModal}
            >
              <Image
                // source={require("../../icons/micoldreport.png")}
                source={require("../../icons/drop-arrow.png")}
                style={{
                  height: 18,
                  width: 18,
                  marginRight: 0,
                  justifyContent: "center",
                  alignSelf: "center"
                }}
              />
            </TouchableOpacity>

            <View
              style={{
                height: 25,
                width: 1,
                marginTop: 8,
                marginBottom: 8,
                marginRight: 10,
                backgroundColor: "lightgray"
              }}
            ></View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",

                marginLeft: 12
              }}
            >
              <TouchableOpacity onPress={this.toggleModal}>
                {this.state.testName != "" ? (
                  <Text
                    style={{
                      marginLeft: 12,
                      color: "black",
                      alignSelf: "stretch"
                    }}
                  >
                    {this.state.testName}
                  </Text>
                ) : (
                  <>
                    <Text
                      style={{
                        marginLeft: 12,
                        color: "gray",
                        alignSelf: "stretch"
                      }}
                    >
                      Select Test
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
          {this.state.isAnalyteList == true || this.state.isother == true ? (
            <>
              {this.state.isother && (
                <>
                  <View
                    style={{
                      height: 60,
                      backgroundColor: "white",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 15,
                      marginLeft: 15
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        borderWidth: 0.5,
                        borderRadius: 20,
                        height: 40,
                        borderColor: "gray",
                        flexDirection: "row"
                      }}
                    >
                      <TextInput
                        style={{
                          textAlign: "left",
                          flex: 1,
                          // paddingLeft: 5,
                          fontSize: 15,
                          marginLeft: 12
                        }}
                        value={this.state.othertestname}
                        onChangeText={(text) =>
                          this.setState({ othertestname: text })
                        }
                        underlineColorAndroid="transparent"
                        placeholder="Enter Test Name"
                        allowFontScaling={false}
                      />
                      <View
                        style={{
                          height: 25,
                          width: 1,
                          marginTop: 8,
                          marginBottom: 8,
                          marginRight: 10,
                          backgroundColor: "lightgray"
                        }}
                      ></View>
                      {this.state.isstarted &&
                      this.state.inputname == "testname" ? (
                        <>
                          <ActivityIndicator size="large" color="#3062ae" />
                          <TouchableOpacity
                            onPress={this.stopRecording}
                            style={{
                              height: 20,
                              width: 20,
                              marginRight: 18,
                              justifyContent: "center",
                              alignSelf: "center"
                            }}
                          >
                            <Image
                              source={require("../../icons/stopvoice.png")}
                              style={{ width: 20, height: 20 }}
                            />
                          </TouchableOpacity>
                        </>
                      ) : (
                        <TouchableOpacity
                          onPress={() => this.onMicPress("testname")}
                          // onPress={this._startRecognizing}
                          style={{
                            height: 20,
                            width: 20,
                            marginRight: 18,
                            justifyContent: "center",
                            alignSelf: "center"
                          }}
                        >
                          <Image
                            source={require("../../icons/micoldreport.png")}
                            style={{
                              height: 20,
                              width: 20
                            }}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </>
              )}
              {this.state.AnalyteList.length <= 0 && this.state.isother ? (
                <>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column"
                      // margin: 15,
                    }}
                  >
                    <View
                      style={{
                        height: 40,
                        backgroundColor: "white",
                        marginRight: 15,
                        //  / marginLeft: 15,
                        marginLeft: 10,
                        marginTop: 10,
                        flexDirection: "row-reverse"
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          this.handleAdd();
                        }}
                        style={{ justifyContent: "center" }}
                      >
                        {/* chnage this icon later */}
                        <Image
                          source={require("../../icons/add.png")}
                          style={{
                            height: 40,
                            width: 40,
                            marginRight: 10,
                            marginLeft: 5,
                            justifyContent: "center",
                            alignSelf: "center"
                          }}
                        />
                      </TouchableOpacity>

                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          marginLeft: 1
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            this.handleAdd();
                          }}
                        >
                          <Text
                            style={{
                              // marginLeft: 12,
                              // color: "black",
                              alignSelf: "stretch",
                              fontWeight: "bold",
                              fontSize: 15
                            }}
                          >
                            Add Record Details
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  {this.state.otherreportdetails.map((field, id) => {
                    return (
                      <>
                        <View
                          style={{
                            // height: 40,
                            backgroundColor: "white",
                            marginRight: 15,
                            marginLeft: 15,
                            // marginLeft: 8,
                            marginTop: 20,

                            flexDirection: "row-reverse"
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              this.handleRemove(id);
                            }}
                            style={{ justifyContent: "center" }}
                          >
                            <Image
                              source={require("../../icons/close.png")}
                              style={{
                                height: 30,
                                width: 30,
                                marginRight: 10,
                                justifyContent: "center",
                                alignSelf: "center"
                              }}
                            />
                          </TouchableOpacity>

                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              marginLeft: 8
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                this.handleRemove(id);
                              }}
                            >
                              <Text
                                style={{
                                  // fontWeight: "bold",
                                  fontSize: 15,
                                  // alignSelf: "stretch",
                                  marginLeft: 12
                                }}
                              >
                                Parameter Name
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* Enter param nae */}
                        <View
                          style={{
                            height: 60,
                            backgroundColor: "white",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 25,
                            marginLeft: 25,
                            marginTop: 10
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              borderWidth: 0.5,
                              borderRadius: 20,
                              height: 40,
                              borderColor: "gray",
                              flexDirection: "row"
                            }}
                          >
                            <TextInput
                              style={{
                                textAlign: "left",
                                flex: 1,
                                marginLeft: 12,
                                fontSize: 15,
                                marginLeft: 19
                              }}
                              onChangeText={(val) =>
                                this.handleChangeParamname(id, val)
                              }
                              value={field.ParameterName}
                              underlineColorAndroid="transparent"
                              placeholder="Enter Parameter Name"
                              allowFontScaling={false}
                            />
                            <View
                              style={{
                                height: 25,
                                width: 1,
                                marginTop: 8,
                                marginBottom: 8,
                                marginRight: 10,
                                backgroundColor: "lightgray"
                              }}
                            ></View>
                            {this.state.isstarted &&
                            this.state.inputname == "otherparamnm" ? (
                              <>
                                <ActivityIndicator
                                  size="large"
                                  color="#3062ae"
                                />
                                <TouchableOpacity
                                  onPress={this.stopRecording}
                                  style={{
                                    height: 20,
                                    width: 20,
                                    marginRight: 18,
                                    justifyContent: "center",
                                    alignSelf: "center"
                                  }}
                                >
                                  <Image
                                    source={require("../../icons/stopvoice.png")}
                                    style={{ width: 20, height: 20 }}
                                  />
                                </TouchableOpacity>
                              </>
                            ) : (
                              <TouchableOpacity
                                // onPress={() => this.onMicPress("othertestparamname")}
                                onPress={() =>
                                  this.onMicPressForOtherReportOption(
                                    id,
                                    "otherparamnm"
                                  )
                                }
                                style={{
                                  height: 20,
                                  width: 20,
                                  marginRight: 18,
                                  justifyContent: "center",
                                  alignSelf: "center"
                                }}
                              >
                                <Image
                                  source={require("../../icons/micoldreport.png")}
                                  style={{
                                    height: 20,
                                    width: 20
                                  }}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            marginLeft: 18
                          }}
                        >
                          <Text
                            style={{
                              marginTop: 10,
                              fontSize: 14,
                              marginLeft: 15
                              // fontWeight: "bold",
                            }}
                          >
                            Reference Range
                          </Text>
                        </View>
                        <View
                          style={{
                            height: 60,
                            backgroundColor: "white",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 15,
                            marginLeft: 15
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              marginTop: 10,
                              marginLeft: 15,
                              flexDirection: "row",
                              borderRadius: 20,
                              height: 40,
                              borderWidth: 0.5
                            }}
                          >
                            <TextInput
                              style={{
                                textAlign: "left",
                                flex: 1,

                                fontSize: 15,
                                marginLeft: 19
                              }}
                              onChangeText={(val) =>
                                this.handleChangeMin(id, val)
                              }
                              value={field.MinRange}
                              underlineColorAndroid="transparent"
                              placeholder="Min"
                              keyboardType={"numeric"}
                              allowFontScaling={false}
                            />
                            {/* <TouchableOpacity
                              // onPress={() => this.onMicPress("testname")}
                              onPress={() =>
                                this.onMicPressForOtherReportOption(
                                  id,
                                  "othermin"
                                )
                              }
                              style={{
                                height: 20,
                                width: 20,
                                marginRight: 18,
                                justifyContent: "center",
                                alignSelf: "center"
                              }}
                            >
                              <Image
                                source={require("../../icons/micoldreport.png")}
                                style={{
                                  height: 20,
                                  width: 20
                                }}
                              />
                            </TouchableOpacity> */}
                          </View>
                          <View
                            // style={{
                            //   flex: 1,
                            //   justifyContent: "center",
                            //   // marginTop: 10,
                            //   marginLeft: 15
                            // }}
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              marginTop: 10,
                              marginLeft: 7,
                              flexDirection: "row",
                              borderRadius: 20,
                              height: 40,
                              borderWidth: 0.5
                            }}
                          >
                            <TextInput
                              style={{
                                textAlign: "left",
                                flex: 1,

                                fontSize: 15,
                                marginLeft: 19
                              }}
                              keyboardType={"numeric"}
                              onChangeText={(val) =>
                                this.handleChangeMax(id, val)
                              }
                              value={field.MaxRange}
                              underlineColorAndroid="transparent"
                              placeholder="Max"
                              allowFontScaling={false}
                            />
                            {/* <TouchableOpacity
                              onPress={() =>
                                this.onMicPressForOtherReportOption(
                                  id,
                                  "othermax"
                                )
                              }
                              style={{
                                height: 20,
                                width: 20,
                                marginRight: 18,
                                justifyContent: "center",
                                alignSelf: "center"
                              }}
                            >
                              <Image
                                source={require("../../icons/micoldreport.png")}
                                style={{
                                  height: 20,
                                  width: 20
                                }}
                              />
                            </TouchableOpacity> */}
                          </View>
                          <View
                            // style={{
                            //   flex: 1,
                            //   justifyContent: "center",
                            //   // marginTop: 10,
                            //   marginLeft: 15
                            // }}
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              marginTop: 10,
                              marginLeft: 7,
                              flexDirection: "row",
                              borderRadius: 20,
                              height: 40,
                              borderWidth: 0.5
                            }}
                          >
                            <TextInput
                              style={{
                                textAlign: "left",
                                flex: 1,

                                fontSize: 15,
                                marginLeft: 19
                              }}
                              onChangeText={(val) =>
                                this.handleChangeUnit(id, val)
                              }
                              value={field.Unit}
                              underlineColorAndroid="transparent"
                              placeholder="Unit"
                              allowFontScaling={false}
                            />
                            {/* <TouchableOpacity
                              onPress={() =>
                                this.onMicPressForOtherReportOption(
                                  id,
                                  "otherunit"
                                )
                              }
                              style={{
                                height: 20,
                                width: 20,
                                marginRight: 18,
                                justifyContent: "center",
                                alignSelf: "center"
                              }}
                            >
                              <Image
                                source={require("../../icons/micoldreport.png")}
                                style={{
                                  height: 20,
                                  width: 20
                                }}
                              />
                            </TouchableOpacity> */}
                          </View>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            marginLeft: 18
                          }}
                        >
                          <Text
                            style={{
                              marginTop: 10,
                              fontSize: 14,
                              marginLeft: 15
                              // fontWeight: "bold",
                            }}
                          >
                            Value
                          </Text>
                        </View>
                        <View
                          style={{
                            height: 60,
                            backgroundColor: "white",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 15,
                            marginLeft: 15
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              borderWidth: 0.5,
                              borderRadius: 20,
                              height: 40,
                              borderColor: "gray",
                              flexDirection: "row"
                            }}
                          >
                            <TextInput
                              style={{
                                textAlign: "left",
                                flex: 1,

                                fontSize: 15,
                                marginLeft: 19
                              }}
                              onChangeText={(val) =>
                                this.handleChangevalue(id, val)
                              }
                              value={field.Value}
                              underlineColorAndroid="transparent"
                              placeholder="Enter Value"
                              keyboardType={"numeric"}
                              allowFontScaling={false}
                            />
                            {/* <TouchableOpacity
                              onPress={() =>
                                this.onMicPressForOtherReportOption(
                                  id,
                                  "otherval"
                                )
                              }
                              style={{
                                height: 20,
                                width: 20,
                                marginRight: 18,
                                justifyContent: "center",
                                alignSelf: "center"
                              }}
                            >
                              <Image
                                source={require("../../icons/micoldreport.png")}
                                style={{
                                  height: 20,
                                  width: 20
                                }}
                              />
                            </TouchableOpacity> */}
                          </View>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            marginLeft: 18
                          }}
                        >
                          <Text
                            style={{
                              marginTop: 10,
                              fontSize: 14,
                              marginLeft: 15
                              // fontWeight: "bold",
                            }}
                          >
                            Result
                          </Text>
                        </View>
                        <View
                          style={{
                            height: 60,
                            backgroundColor: "white",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 15,
                            marginLeft: 15
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              borderWidth: 0.5,
                              borderRadius: 20,
                              height: 40,
                              borderColor: "gray",
                              flexDirection: "row"
                            }}
                          >
                            <TextInput
                              style={{
                                textAlign: "left",
                                flex: 1,

                                fontSize: 15,
                                marginLeft: 19
                              }}
                              onChangeText={(val) =>
                                this.handleChangeResult(id, val)
                              }
                              value={field.Result}
                              underlineColorAndroid="transparent"
                              placeholder="Enter Result"
                              allowFontScaling={false}
                            />
                            <View
                              style={{
                                height: 25,
                                width: 1,
                                marginTop: 8,
                                marginBottom: 8,
                                marginRight: 10,
                                backgroundColor: "lightgray"
                              }}
                            ></View>
                            {this.state.isstarted &&
                            this.state.inputname == "otherres" ? (
                              <>
                                <ActivityIndicator
                                  size="large"
                                  color="#3062ae"
                                />
                                <TouchableOpacity
                                  onPress={this.stopRecording}
                                  style={{
                                    height: 20,
                                    width: 20,
                                    marginRight: 18,
                                    justifyContent: "center",
                                    alignSelf: "center"
                                  }}
                                >
                                  <Image
                                    source={require("../../icons/stopvoice.png")}
                                    style={{ width: 20, height: 20 }}
                                  />
                                </TouchableOpacity>
                              </>
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  this.onMicPressForOtherReportOption(
                                    id,
                                    "otherres"
                                  )
                                }
                                style={{
                                  height: 20,
                                  width: 20,
                                  marginRight: 18,
                                  justifyContent: "center",
                                  alignSelf: "center"
                                }}
                              >
                                <Image
                                  source={require("../../icons/micoldreport.png")}
                                  style={{
                                    height: 20,
                                    width: 20
                                  }}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                        <View
                          style={{
                            height: 0.5,
                            backgroundColor: "gray",
                            marginRight: 5,
                            marginTop: 8,
                            marginLeft: 5
                          }}
                        ></View>
                      </>
                    );
                  })}
                </>
              ) : (
                this.state.AnalyteList.map((item, index) => (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      margin: 15,
                      backgroundColor: "#F7F7F7"
                    }}
                  >
                    <Text style={{ margin: 5, fontSize: 16, color: "blue" }}>
                      {item.AnalyteName}
                    </Text>
                    <View
                      style={{
                        height: 0.5,
                        backgroundColor: "gray",
                        marginLeft: 0,
                        marginRight: 0,
                        marginTop: 5
                      }}
                    ></View>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <Text style={{ flex: 1, margin: 5, fontSize: 14 }}>
                        {"Subanalyte:" + item.SubAnalyteName}
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          margin: 5,
                          justifyContent: "flex-end",
                          fontSize: 14
                        }}
                      >
                        {"Specimen:" + item.Specimen}
                      </Text>
                    </View>
                    {item.iszero == "No" && (
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <Text style={{ flex: 1, margin: 5, fontSize: 14 }}>
                          {"Range:" + item.ReferenceRange}
                        </Text>
                      </View>
                    )}
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <Text style={{ flex: 1, margin: 5, fontSize: 14 }}>
                        {"Method:" + item.MethodName}
                      </Text>

                      <View
                        style={{
                          height: 20,
                          width: 120,
                          backgroundColor: "white",
                          marginRight: 5,
                          marginLeft: 5,

                          marginTop: 5,
                          borderRadius: 10,
                          borderColor: "gray",
                          borderWidth: 0.5,
                          flexDirection: "row-reverse"
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            height: 20,
                            width: 20,
                            marginRight: 8,
                            justifyContent: "center",
                            alignSelf: "center"
                          }}
                          onPress={() =>
                            this.togglePicker(item.InterpretationList, index)
                          }
                        >
                          <Image
                            source={require("../../icons/drop-arrow.png")}
                            style={{
                              height: 10,
                              width: 10,
                              marginRight: 0,
                              justifyContent: "center",
                              alignSelf: "center"
                            }}
                          />
                        </TouchableOpacity>

                        <View
                          style={{
                            height: 20,
                            width: 1,
                            marginTop: 0,
                            marginBottom: 0,
                            marginRight: 5,
                            backgroundColor: "lightgray"
                          }}
                        ></View>

                        <TouchableOpacity
                          style={{
                            flex: 1,
                            backgroundColor: "white",
                            marginLeft: 20
                          }}
                          onPress={() =>
                            this.togglePicker(item.InterpretationList, index)
                          }
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              margin: 1
                            }}
                            numberOfLines={1}
                          >
                            {item.Result ? item.Result : "Result "}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {item.iszero == "No" && (
                      <TextInput
                        style={{
                          flex: 1,
                          marginLeft: 10,
                          marginTop: 10,
                          fontSize: 14
                        }}
                        keyboardType={"numeric"}
                        value={item.Value}
                        underlineColorAndroid="transparent"
                        placeholder="Value description"
                        onChangeText={(val) =>
                          this.onChangeTextValueDiscription(val, index)
                        }
                        allowFontScaling={false}
                      />
                    )}
                    <View
                      style={{
                        height: 0.5,
                        backgroundColor: "gray",
                        marginLeft: 0,
                        marginRight: 0,
                        marginTop: 5
                      }}
                    ></View>
                    <View style={{ height: 20 }}></View>
                  </View>
                ))
              )}
            </>
          ) : null}
          <></>

          <Text
            style={{
              marginTop: 20,
              fontSize: 14,
              marginLeft: 15,
              fontWeight: "bold"
            }}
          >
            Notes
          </Text>

          <View
            style={{
              height: 60,
              backgroundColor: "white",
              marginRight: 15,
              marginTop: 10,
              borderRadius: 20,
              borderColor: "gray",
              borderWidth: 0.5,
              padding: 8,
              marginLeft: 15,
              flexDirection: "row"
            }}
          >
            <TextInput
              style={{ flex: 1, backgroundColor: "white", marginLeft: 12 }}
              value={this.state.addressinput}
              onChangeText={(text) => this.setState({ addressinput: text })}
              multiline={true}
              underlineColorAndroid="transparent"
              placeholder="Enter your note here..."
              returnKeyType="done"
              blurOnSubmit={true}
              allowFontScaling={false}
            />
            <View
              style={{
                height: 25,
                width: 1,
                marginTop: 8,
                marginBottom: 8,
                marginRight: 10,
                backgroundColor: "lightgray"
              }}
            ></View>
            {this.state.isstarted && this.state.inputname == "note" ? (
              <>
                <ActivityIndicator size="large" color="#3062ae" />
                <TouchableOpacity
                  onPress={this.stopRecording}
                  style={{
                    height: 20,
                    width: 20,
                    marginRight: 18,
                    justifyContent: "center",
                    alignSelf: "center"
                  }}
                >
                  <Image
                    source={require("../../icons/stopvoice.png")}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={() => this.onMicPress("note")}
                style={{
                  height: 20,
                  width: 20,
                  marginRight: 18,
                  justifyContent: "center",
                  alignSelf: "center"
                }}
              >
                <Image
                  source={require("../../icons/micoldreport.png")}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            )}
            {/* <TouchableOpacity
              onPress={() => this.onMicPress("note")}
              style={{
                height: 20,
                width: 20,
                marginRight: 10,
                justifyContent: "center",
                alignSelf: "center"
              }}
            >
              <Image
                source={require("../../icons/micoldreport.png")}
                style={{
                  height: 20,
                  width: 20
                }}
              />
            </TouchableOpacity> */}
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: "#1B2B34",
              marginTop: 20,
              marginBottom: 20,
              borderRadius: 20,
              marginLeft: 15,
              marginRight: 15,
              height: 40,
              justifyContent: "center",
              shadowOffset: { width: 2, height: 3 },
              elevation: 5,
              shadowColor: "gray",
              shadowOpacity: 0.9
            }}
            onPress={this.onPressSubmit}
          >
            <Text
              style={{
                textAlign: "center",
                alignSelf: "center",
                fontSize: 18,
                color: "white",
                fontWeight: "bold"
              }}
            >
              SUBMIT
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>

        <Modal isVisible={this.state.pickerVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            <View
              style={{
                // height: "60%",
                width: "100%",
                backgroundColor: "white",
                flexDirection: "column",
                borderRadius: 0
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  flexDirection: "column",
                  borderRadius: 0
                }}
              >
                <TouchableOpacity
                  style={{
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginTop: 10,
                    marginBottom: 0
                  }}
                  onPress={() => this.setState({ pickerVisible: false })}
                >
                  <Image
                    source={require("../../icons/CLOSE2.png")}
                    style={{
                      height: 25,
                      width: 25,
                      marginRight: 15,

                      marginTop: 0
                    }}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginRight: 5,
                  marginTop: 8
                }}
              ></View>
              <ScrollView
                alwaysBounceVertical={true}
                showsHorizontalScrollIndicator={false}
                style={{
                  backgroundColor: "white",
                  marginTop: 0,
                  paddingHorizontal: 0
                }}
              >
                {this.state.resultArray.map((item) => (
                  <ListItem onPress={() => this.onpickervalueselected(item)}>
                    <Text>{item.Result}</Text>
                  </ListItem>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    paddingTop: 0,
    backgroundColor: "white"
    //zIndex:0,
    //position: 'absolute'
  },
  containermain: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "white"
  },
  container: {
    flex: 1,
    // paddingTop: 40,
    alignItems: "center"
  },
  picker: {
    height: 50,
    width: "80%",
    // color: '#344953',
    justifyContent: "center"
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
  //other
  containerother: {
    flex: 1,
    flexDirection: "column",
    padding: 3,
    marginLeft: Platform.OS === "ios" ? 15 : 0,
    marginRight: Platform.OS === "ios" ? 5 : 0,
    marginTop: Platform.OS === "ios" ? 5 : 0,
    marginBottom: Platform.OS === "ios" ? 2 : 0,
    borderRadius: Platform.OS === "ios" ? 5 : 0,
    backgroundColor: "white",
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  container_textother: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    padding: 0,
    // justifyContent: "center",
    backgroundColor: "white"
  },
  titlesubview: {
    flex: 1,
    flexDirection: "row"
    //alignSelf: 'flex-end',
    // backgroundColor: 'green',
  },

  DRnamesubview: {
    flex: 1,
    flexDirection: "row",
    //alignSelf: 'flex-end',
    backgroundColor: "white"
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    flexDirection: "row",
    // backgroundColor: 'gray',
    marginRight: 10,
    marginLeft: 3
    // fontWeight: 'bold'
  }
});
