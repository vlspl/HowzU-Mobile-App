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
  Dimensions,
  TextInput,
  RefreshControl,
  Platform,
  Alert,
  BackHandler
} from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { CommonActions } from "@react-navigation/native";
import Constants from "../../utils/Constants";
import Loader from "../../appComponents/loader";

import moment from "moment";
import CustomeHeader from "../../appComponents/CustomeHeader";
import axios from "axios";

import Modal from "react-native-modal";
import TestListRow from "../../appComponents/TestListRow";
import PaginationLoading from "../../appComponents/PaginationLoading";

import Toast from "react-native-tiny-toast";
import { ListItem } from "native-base";
var resultValueFlag = "";
import DateTimePicker from "react-native-modal-datetime-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NoDataAvailable from "../../appComponents/NoDataAvailable";

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
function IsvalueBetweenSubAnaRefRange(RefArray, value) {
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
export default class TechnicianAddReport extends React.Component {
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
      AllTestListTechnician: [],
      orgid: 0,
      AllLabList: [],
      token: "",
      mobile: 0,
      BMI_Weight: 0,
      BMI_Height: 0,
      BMI_Result: "",
      BMI_Value: 0
    };
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // this.retriveData();
    if (nextProp.route.params.orgid != undefined) {
      this.setState(
        {
          orgid: nextProp.route.params.orgid,
          AllLabList: [],
          token: "",
          mobile: nextProp.route.params.usernm,
          isLoading: true
        },
        () => {
          this.getLabNames();
          this.getScannedUserTOken();
        }
      );
    }
  };

  componentDidMount = () => {
    // this.retriveData();
    if (this.props.route.params.orgid != undefined) {
      this.setState(
        {
          orgid: this.props.route.params.orgid,
          AllLabList: [],
          token: "",
          mobile: this.props.route.params.usernm,
          isLoading: true
        },
        () => {
          this.getLabNames();
          this.getScannedUserTOken();
        }
      );
    }
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.hardwarebBackAction
    );
  };
  // new changes for technician role when he uplaod records
  getLabNames = async () => {
    let formatdate = moment().format("DD/MM/YYYY");
    let labName;

    if (this.state.orgid != 0) {
      try {
        let response = await axios.get(
          Constants.ENTERPRSE_LABLIST + this.state.orgid
        );
        labName = response.data.LabList[0].LabName;
        this.setState({ loading: false, labName: labName });
        if (response.data.Status) {
          let responseData = this.state.AllTestList;

          response.data.LabList.map((item) => {
            responseData.push(item);
          });

          this.setState({
            labName: labName,
            AllLabList: responseData,
            isLoading: false,
            paginationLoading: false,
            searchLoading: false,
            refreshing: false,
            bookingdate: formatdate,
            labName: response.data.LabList[0].LabName
          });
        } else {
          //Toast.show(response.data.Msg)
          this.setState({
            isLoading: false,
            paginationLoading: false,
            searchLoading: false,
            refreshing: false,
            bookingdate: formatdate
          });
        }
      } catch (errors) {
        ///Toast.show(errors)

        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
        // console.log(errors);
      }
    }
  };

  getSuggestedTest = async (empty) => {
    if (this.state.orgid != 0) {
      try {
        // let response = await axios.post(Constants.GET_TESTLIST, {
        let response = await axios.get(
          Constants.ENTERPRSE_LABTESTLIST + this.state.orgid
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
    }
  };

  getScannedUserTOken = async () => {
    try {
      let response = await axios.post(Constants.GET_SIGNIN, {
        Username: this.state.mobile,
        // Password: 1,
        Password: "Vls@123#!@"
      });
      this.setState({
        token: response.data.Token
      });
    } catch (err) {
      this.setState({ loading: false });
      Toast.show("Something Went Wrong, Please Try Again Later");
    }
  };
  ReportManualPunchAPI = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + this.state.token);
    myHeaders.append("Content-Type", "application/json");

    var raw = {
      LabName: this.state.labName,
      DoctorId: 0,
      TestId: this.state.selectedId,
      Testdate: this.state.bookingdate
    };
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: "follow"
    };

    fetch(Constants.MANUAL_REPORTPUNCH, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.Status) {
          this.setState(
            {
              // AllTestList: this.removeDuplicate(responseData),
              isLoading: true,
              BookingId: response.BookingId,
              ReportId: response.ReportId,
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
          Toast.show(response.Msg);
          this.setState({
            isLoading: false,
            paginationLoading: false,
            searchLoading: false,
            refreshing: false
          });
        }
      })
      .catch((error) => console.log("error", error));
    // try {
    //   let response = await axios.post(Constants.MANUAL_REPORTPUNCH, {
    //     LabName: this.state.labName,
    //     DoctorId: 0,
    //     TestId: this.state.selectedId,
    //     Testdate: this.state.bookingdate
    //   });
    //   console.log("data==============", response.data);
    //   // this.setState({ isLoading: false });

    //   if (response.data.Status) {
    //     this.setState(
    //       {
    //         // AllTestList: this.removeDuplicate(responseData),
    //         isLoading: true,
    //         BookingId: response.data.BookingId,
    //         ReportId: response.data.ReportId,
    //         refreshing: false,
    //         AnalyteTempList: [],
    //         AnalyteList: [],
    //         ismanualpunchapicalled: true
    //       },
    //       () => {
    //         this.GetReportValuesAPI();
    //       }
    //     );
    //   } else {
    //     Toast.show(response.data.Msg);
    //     this.setState({
    //       isLoading: false,
    //       paginationLoading: false,
    //       searchLoading: false,
    //       refreshing: false
    //     });
    //   }
    // } catch (errors) {
    //   Toast.show(response.data.Msg);
    //   this.setState({
    //     isLoading: false,
    //     paginationLoading: false,
    //     searchLoading: false,
    //     searchLoading: false,
    //     refreshing: false
    //   });
    //   // console.log(errors, 'errors');
    // }
  };

  GetReportValuesAPI = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + this.state.token);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow"
    };
    fetch(
      Constants.GET_REPORTVALUES_REFRANGE_PERRESULT +
      "=" +
      this.state.selectedId,
      // this.state.BookingId,
      requestOptions
    )
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if (response.Status) {
          let responseData = this.state.AnalyteList;

          response.AnalyteList.map((item) => {
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

          this.setState({
            AnalyteList: responseData,
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
            refreshing: false
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  uploadPrescription = () => {
    var that = this;
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
    var myHeaders = new Headers();
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + this.state.token);
    myHeaders.append("Content-Type", "application/json");
    let responseData = [];

    this.state.AnalyteTempList.map((item) => {
      let temp = {};
      temp = item;
      (temp.ReportId = this.state.ReportId),
        (temp.TestId = this.state.selectedId),
        (temp.BookingId = this.state.BookingId),
        // item.ReportPath = '',
        responseData.push(item);
    });
    var raw = {
      AnalyteDetails: responseData,
      Notes: this.state.addressinput
    };

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: "follow"
    };
    fetch(Constants.ADD_REPORT, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.Status) {
          this.setState({
            isLoading: false,
            AllTestList: [],
            selectedId: 0,
            AnalyteList: [],
            InterpretationList: [],
            AnalyteTempList: [],
            BookingId: "",
            ReportId: "",
            testName: "",
            Notes: "",
            BMI_Weight: 0,
            BMI_Height: 0,
            BMI_Result: "",
            BMI_Value: 0
          });
          Toast.show(response.Msg);

          // this.props.navigation.dispatch(
          //   CommonActions.reset({
          //     index: 1,
          //     routes: [
          //       {
          //         name: "Drawer",
          //         params: { refresh: true }
          //       }
          //     ]
          //   })
          // );
        } else {
          Toast.show(response.Msg);
          this.setState({ isLoading: false });
        }
      })
      .catch((error) => console.log("error", error));
    // try {
    //   let response = await axios.post(Constants.ADD_REPORT, {
    //     AnalyteDetails: this.state.AnalyteTempList,
    //     Notes: this.state.addressinput
    //   });
    //   console.log("normal report data==============", response.data);
    //   this.setState({ isLoading: false });

    //   if (response.data.Status) {
    //     this.setState({ isLoading: false });
    //     Toast.show(response.data.Msg);

    //     this.props.navigation.dispatch(
    //       CommonActions.reset({
    //         index: 1,
    //         routes: [
    //           {
    //             name: "Drawer",
    //             params: { refresh: true }
    //           },
    //           {
    //             name: "MyReports",
    //             params: { refresh: true }
    //           }
    //         ]
    //       })
    //     );
    //   } else {
    //     Toast.show(response.data.Msg);
    //     this.setState({ isLoading: false });
    //   }
    // } catch (errors) {
    //   ///Toast.show(errors)

    //   this.setState({ isLoading: false });
    //   // console.log(errors);
    // }
  };

  handleSelectionMultiple = (testid, testname) => {
    // console.log("TestID==============================", testid);
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
    if (this.state.labName == "") {
      Toast.show("Please enter Labname");
    } else if (this.state.bookingdate == "") {
      Toast.show("Please select the report date");
    } else {
      // this.setState({ isModalVisible: !this.state.isModalVisible,AllTestList: []},()=>{
      this.setState({
        selectedIds: [],
        isLoading: true,
        AllTestList: [],
        Searching: "",
        pageNo: 1
      });
      this.getSuggestedTest();

      // console.log("&&*&*&*&****", this.state.isModalVisible);
    }
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
    this.setState({ isModalVisible: false, searchString: "" });
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

  // onChangeTextValueDiscription = async (val, index) => {
  //   // console.log("======", val);

  //   let AnalyteList = [...this.state.AnalyteList];
  //   let filledAnalyteList = [...this.state.filledAnalyteList];

  //   AnalyteList[index] = { ...AnalyteList[index], Value: val };
  //   filledAnalyteList[index] = { ...AnalyteList[index], Value: val };

  //   // console.log(AnalyteList, "filled value //////*****ana");
  //   // console.log(filledAnalyteList, ".filed value ...?????fileed");

  //   this.setState({ AnalyteList, filledAnalyteList });
  // };
  onChangeTextValueDiscription = async (val, index, resultlist) => {
    resultlist.map((item) => {
      let ReferenceRange =
        item.FemaleRange == "" ? item.MaleRange : item.FemaleRange;
      var RefArray = ReferenceRange.split("-");
      let result = IsvalueBetweenSubAnaRefRange(RefArray, val + "");
      if (result == "Yes") {
        this.setState({ resultIndex: index }, () => {
          this.onpickervalueselected(item);
        });
      }
    });

    let AnalyteList = [...this.state.AnalyteList];
    let filledAnalyteList = [...this.state.filledAnalyteList];

    AnalyteList[index] = { ...AnalyteList[index], Value: val };
    filledAnalyteList[index] = { ...AnalyteList[index], Value: val };

    // console.log(AnalyteList, "filled value //////*****ana");
    // console.log(filledAnalyteList, ".filed value ...?????fileed");

    this.setState({ AnalyteList, filledAnalyteList });
  };
  BMIonChangeTextValueDiscription = (val, nm) => {
    if (nm == "Weight") {
      this.setState({ BMI_Weight: val }, () => {
        this.calculate();
      });
    }
    if (nm == "Height") {
      this.setState({ BMI_Height: val }, () => {
        this.calculate();
      });
    }
  };
  calculate = () => {
    if (this.state.BMI_Height != 0 && this.state.BMI_Weight != 0) {
      // let addzeros = this.addZeroes(this.state.BMI_Height);
      // console.log("Addzerso", addzeros);
      let height = this.state.BMI_Height.split(".");
      let heght0 = height[0] * (30.48).toFixed(2);
      let height1 = 0;
      if (height[1] != undefined) {
        height1 = height[1] * (2.54).toFixed(2);
      } else {
        height1 = 0;
      }

      let bmiheight = heght0 + height1;
      var result =
        (parseFloat(this.state.BMI_Weight) /
          (parseFloat(bmiheight) * parseFloat(bmiheight))) *
        10000;
      result = parseFloat(result.toFixed(2));

      this.setState({ BMI_Value: result });

      if (result < 18.5) {
        this.setState({ BMI_Result: "Underweight" });
      } else if (result >= 18.5 && result < 25) {
        this.setState({ BMI_Result: "Normal weight" });
      } else if (result >= 25 && result < 30) {
        this.setState({ BMI_Result: "Overweight" });
      } else if (result >= 30) {
        this.setState({ BMI_Result: "Obese" });
      }
    }
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

  addZeroes = (num) => {
    var num = Number(num);
    // If not a number, return 0
    if (isNaN(num)) {
      return 0;
    }
    // If there is no decimal, or the decimal is less than 2 digits, toFixed
    if (
      String(num).split(".").length < 2 ||
      String(num).split(".")[1].length < 1
    ) {
      num = num.toFixed(2);
    }
    // Return the number
    return num;
  };

  onPressSubmit = () => {

    if (this.state.labName == "") {
      Toast.show("Please enter Lab Name");
    } else if (!isNaN(this.state.labName)) {
      Toast.show("Please enter only alphabets in Lab Name");
    } else if (this.state.bookingdate == "") {
      Toast.show("Please select date");
    } else if (this.state.testName == "") {
      Toast.show("Please Select Test");
    }
    // else if (this.state.BookingId == "" && this.state.isother == false) {
    //   Toast.show("BookingId not generate");
    // }
    else {
      let responseData = [];
      let iszero = "";
      let filtered;

      filtered = this.state.filledAnalyteList.filter((x) => x != null);
      if (filtered.length <= this.state.AnalyteList.length) {
        for (const item of this.state.AnalyteList) {
          if (item.AnalyteName == "BMI") {
            let height = this.state.BMI_Height.split(".");
            let heght0 = height[0] * (30.48).toFixed(2);
            let height1 = 0;
            if (height[1] != undefined) {
              height1 = height[1] * (2.54).toFixed(2);
            } else {
              height1 = 0;
            }

            let bmiheight = heght0 + height1;
            var result =
              (parseFloat(this.state.BMI_Weight) /
                (parseFloat(bmiheight) * parseFloat(bmiheight))) *
              10000;
            result = parseFloat(result.toFixed(2));
            item.Value = result;
            if (result < 18.5) {
              item.Result = "Underweight";
            } else if (result >= 18.5 && result < 25) {
              item.Result = "Normal weight";
            } else if (result >= 25 && result < 30) {
              item.Result = "Overweight";
            } else if (result >= 30) {
              item.Result = "Obese";
            }
            responseData.push(item);
          } else {
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
                  Toast.show(
                    "Please select the result for " + item.AnalyteName
                  );
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
      }
      //

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
                    // this.ReportManualPunchAPI();
                    this.uploadPrescription();
                  }
                }
              ]
            );
          }
        );
      }
      //
    }
  };

  // Modal

  ClosePOPup = () => {
    // console.log('ClosePOPup=================');
    this.setState({ isPrescription: false }, () => { });
  };

  hardwarebBackAction = () => {
    this.props.navigation.navigate("Scanner", { refreshing: true });
    // this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    this.backHandler.remove();
  };

  onpickervalueselected = (value) => {
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
        this.setState({
          AnalyteList,
          pickerVisible: false,
          Result: this.state.selectPicker,
          filledAnalyteList
        });
      }
    );
  };
  QRCode = () => {
    this.props.navigation.navigate("Scanner", { refreshing: true });
  };
  backbtnPress = () => {
    this.props.navigation.goBack();
  };

  render() {
    const screenWidth = Math.round(Dimensions.get("window").width);
    return (
      <View style={styles.MainContainer}>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="My Reports"
          headerId={3}
          Qricon={require("../../../icons/Scanncode.png")}
          navigation={this.props.navigation}
          onPressQR={() => this.QRCode()}
          onPressback={this.backbtnPress}
        />

        <Modal isVisible={this.state.isModalVisible} style={{ margin: 0 }}>
          <Loader loading={this.state.isLoading} />
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
                  <Image
                    source={require("../../../icons/search.png")}
                    style={{
                      height: 20,
                      width: 20,
                      marginLeft: 10,
                      marginTop: 10
                    }}
                  />
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
                    placeholder="Search test name.."
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
                    source={require("../../../icons/CLOSE2.png")}
                    style={{
                      height: 35,
                      width: 35,
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
                            ? require("../../../icons/radio-on.png")
                            : require("../../../icons/radio-off.png")
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
                    <NoDataAvailable />
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
              <Image
                source={require("../../../icons/search.png")}
                style={{ height: 20, width: 0, marginLeft: 10, marginTop: 10 }}
              />
              {/* <TextInput
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
              /> */}
              <Text
                style={{
                  textAlign: "left",
                  flex: 1,
                  color: "black",
                  fontSize: 15,
                  textAlignVertical: "center",
                  marginLeft: 12,
                  marginTop: 10
                }}
              >
                {this.state.labName}
              </Text>
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
            date
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
              // onPress={() => {
              //   this.state.ismanualpunchapicalled
              //     ? this.setState({ isShowDataPicker: false })
              //     : this.setState({
              //         isShowDataPicker: true
              //       });
              // }}
              style={{ justifyContent: "center" }}
            >
              <Image
                source={require("../../../icons/date-of-birth.png")}
                style={{
                  height: 20,
                  width: 20,
                  marginRight: 18,
                  justifyContent: "center",
                  alignSelf: "center"
                }}
              />
              {/* {this.state.isShowDataPicker ? this.renderModalPicekr() : null} */}
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
              // onPress={() =>
              //   this.state.ismanualpunchapicalled
              //     ? this.setState({ isShowDataPicker: false })
              //     : this.setState({
              //         isShowDataPicker: true
              //       })
              // }
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
                source={require("../../../icons/drop-arrow.png")}
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

          {this.state.testName != "BODY MASS INDEX" ? (
            <>
              {this.state.AnalyteList.map((item, index) => (
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
                    {/* new changes */}

                    {/* Old  */}
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
                          source={require("../../../icons/drop-arrow.png")}
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
                        this.onChangeTextValueDiscription(
                          val,
                          index,
                          item.InterpretationList
                        )
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
              ))}
            </>
          ) : (
            <>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  margin: 15,
                  backgroundColor: "#F7F7F7"
                }}
              >
                <Text style={{ margin: 5, fontSize: 16, color: "blue" }}>
                  {"Weight In KG"}
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

                <TextInput
                  style={{
                    flex: 1,
                    marginLeft: 10,
                    marginTop: 10,
                    fontSize: 14
                  }}
                  keyboardType={"numeric"}
                  value={this.state.BMI_Weight}
                  underlineColorAndroid="transparent"
                  placeholder="Enter Weight"
                  // onChangeText={(val) =>
                  //   this.onChangeTextValueDiscription(val, index)
                  // }
                  // onChangeText={(val) => this.setState({ BMI_Weight: val })}
                  onChangeText={(val) =>
                    this.BMIonChangeTextValueDiscription(val, "Weight")
                  }
                  allowFontScaling={false}
                />

                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 0,
                    marginRight: 0,
                    marginTop: 5
                  }}
                ></View>
                {/* <View style={{ height: 20 }}></View> */}
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  margin: 15,
                  backgroundColor: "#F7F7F7"
                }}
              >
                <Text style={{ margin: 5, fontSize: 16, color: "blue" }}>
                  {"Height In FEET"}
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

                <TextInput
                  style={{
                    flex: 1,
                    marginLeft: 10,
                    marginTop: 10,
                    fontSize: 14
                  }}
                  keyboardType={"numeric"}
                  value={this.state.BMI_Height}
                  underlineColorAndroid="transparent"
                  placeholder="Enter Weight"
                  // onChangeText={(val) =>
                  //   this.onChangeTextValueDiscription(val, index)
                  // }
                  // onChangeText={(val) => this.setState({ BMI_Height: val })}
                  onChangeText={(val) =>
                    this.BMIonChangeTextValueDiscription(val, "Height")
                  }
                  allowFontScaling={false}
                />

                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 0,
                    marginRight: 0,
                    marginTop: 5
                  }}
                ></View>
                {/* <View style={{ height: 20 }}></View> */}
              </View>
              {this.state.BMI_Weight != 0 && this.state.BMI_Height != 0 && (
                <>
                  {this.state.AnalyteList.map((item, index) => (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        margin: 15
                        // backgroundColor: "#F7F7F7"
                      }}
                    >
                      <Text style={{ margin: 5, fontSize: 14, color: "blue" }}>
                        {"BMI Is"}
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
                        <Text style={{ margin: 5, fontSize: 14 }}>
                          {this.state.BMI_Value}
                        </Text>
                        <Text style={{ flex: 1, margin: 5, fontSize: 14 }}>
                          {"Result:" + this.state.BMI_Result}
                        </Text>
                      </View>

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
                  ))}
                </>
              )}
            </>
          )}
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
              marginLeft: 15
            }}
          >
            <TextInput
              style={{ flex: 1, backgroundColor: "white" }}
              value={this.state.addressinput}
              onChangeText={(text) => this.setState({ addressinput: text })}
              multiline={true}
              underlineColorAndroid="transparent"
              placeholder="Enter your note here..."
              returnKeyType="done"
              blurOnSubmit={true}
              allowFontScaling={false}
            />
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
                    source={require("../../../icons/CLOSE2.png")}
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
