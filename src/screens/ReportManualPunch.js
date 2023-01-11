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
  BackHandler,
  PermissionsAndroid,
  Alert
} from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { CommonActions } from "@react-navigation/native";
import Constants from "../utils/Constants";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import moment from "moment";
import CustomeHeader from "../appComponents/CustomeHeader";
import axios from "axios";
import DatePicker from "react-native-datepicker";
import Modal from "react-native-modal";
import TestListRow from "../appComponents/TestListRow";
import PaginationLoading from "../appComponents/PaginationLoading";
// import ImagePicker from 'react-native-image-picker';
import Toast from "react-native-tiny-toast";
import { ListItem } from "native-base";
var resultValueFlag = "";
import ImagePicker from "react-native-image-crop-picker";
import DateTimePicker from "react-native-modal-datetime-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { launchImageLibrary } from "react-native-image-picker";
function IsvalueBetweenRange(RefArray, value) {
  let ref1 = RefArray[0];
  let ref2 = RefArray[1];
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
export default class ReportManualPunch extends React.Component {
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
      orgid: 0
    };
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // this.retriveData();
    if (nextProp.route.params.orgid != undefined) {
      this.setState(
        {
          orgid: nextProp.route.params.orgid,
          AllTestListTechnician: []
        },
        () => { }
      );
    }
  };

  componentDidMount = () => {
    // this.retriveData();
    if (this.props.route.params.orgid != undefined) {
      this.setState(
        {
          orgid: this.props.route.params.orgid,
          AllTestListTechnician: []
        },
        () => { }
      );
    }
  };
  // new changes for technician role when he uplaod records

  getSuggestedTest = async (empty) => {
    try {
      // let response = await axios.post(Constants.GET_TESTLIST, {
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
    try {
      let response = await axios.post(Constants.MANUAL_REPORTPUNCH, {
        LabName: this.state.labName,
        DoctorId: 0,
        TestId: this.state.selectedId,
        Testdate: this.state.bookingdate
      });
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
            // this.GetReportValuesAPI();
            this.BookAppointments();
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
    try {
      // let response = await axios.post(
      //   Constants.GET_REPORTVALUE + "=" + this.state.BookingId,
      //   {}
      // );
      //new
      // let response = await axios.post(
      //   Constants.GET_REPORTVALUES_UPDATED_ANALYTE_SUBANALYTE +
      //     "=" +
      //     this.state.selectedId,
      //   // this.state.BookingId,
      //   {}
      // );
      //  GET_REPORTVALUES_REFRANGE_PERRESULT
      // new for ref ranfe per results

      let response = await axios.post(
        Constants.GET_REPORTVALUES_REFRANGE_PERRESULT +
        "=" +
        this.state.selectedId,
        // this.state.BookingId,
        {}
      );
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
    } catch (errors) {
      // Toast.show(errors.Error);
      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        searchLoading: false,
        refreshing: false,
        isErr: true
      });
      // console.log(errors, '@@@@@Erroes ');
    }
  };

  chooseFile = async () => {
    var options = {
      title: "Select Image",

      storageOptions: {
        skipBackup: true,
        path: "images",
        saveToPhotos: true,
        privateDirectory: true,
        includeBase64: true
      }
    };
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Howzu App needs  permission"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({ isPrescription: false }, () => {
          setTimeout(() => {
            launchImageLibrary(options, (response) => {
              if (response.didCancel) {
                console.log("User cancelled image picker");
              } else if (response.error) {
                console.log("ImagePicker Error: ", response.error);
              } else {
                if (response.assets.fileSize > 5000000) {
                  Toast.show("Please select image size upto 5MB");
                } else {
                  prescriptionPic = [];
                  prescriptionPic.push({
                    uri: response.assets[0]
                      ? response.assets[0].uri
                      : response.uri,
                    type: response.assets[0]
                      ? response.assets[0].type
                      : response.type,
                    name: response.assets[0]
                      ? response.assets[0].fileName
                      : response.fileName
                  });

                  this.setState(
                    {
                      // isLoading: true,
                      prescriptionPic: prescriptionPic,
                      prescriptionUri: response.assets[0]
                        ? response.assets[0].uri
                        : response.uri,
                      prescriptionName: prescriptionPic[0].name
                    },
                    () => {
                      // this.uploadPrescription();
                    }
                  );
                }
              }
            });
          }, 500);
        });
      } else {
      }
    } else {
      this.setState({ isPrescription: false }, () => {
        setTimeout(() => {
          launchImageLibrary(options, (response) => {
            if (response.didCancel) {
              console.log("User cancelled image picker");
            } else if (response.error) {
              console.log("ImagePicker Error: ", response.error);
            } else {
              if (response.assets.fileSize > 5000000) {
                Toast.show("Please select image size upto 5MB");
              } else {
                let prescriptionPic = [];
                prescriptionPic.push({
                  uri: response.assets[0]
                    ? response.assets[0].uri
                    : response.uri,
                  type: response.assets[0]
                    ? response.assets[0].type
                    : response.type,
                  name: response.assets[0]
                    ? response.assets[0].fileName
                    : response.fileName
                });

                this.setState(
                  {
                    // isLoading: true,
                    prescriptionPic: prescriptionPic,
                    prescriptionUri: response.assets[0]
                      ? response.assets[0].uri
                      : response.uri,
                    prescriptionName: prescriptionPic[0].name
                  },
                  () => {
                    // this.uploadPrescription();
                  }
                );
              }
            }
          });
        }, 500);
      });
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

    // let form = new FormData();

    // form.append("", {
    //   name: this.state.prescriptionPic[0].name,
    //   uri:
    //     Platform.OS === "android"
    //       ? this.state.prescriptionPic[0].uri
    //       : "file://" + this.state.prescriptionPic[0].uri,
    //   type: this.state.prescriptionPic[0].type,
    // });

    // axios({
    //   method: "post",
    //   url: Constants.UPLOAD_REPORTIMG,
    //   data: form,
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "multipart/form-data",
    //   },
    //   onUploadProgress(progressEvent) {
    //     // console.log({ progressEvent });
    //     that.setState({
    //       size: progressEvent.total,
    //       progresss: progressEvent.loaded / progressEvent.total,
    //     });
    //   },
    // })
    //   .then((response) => {
    //     // console.log(' else  response data =================', response.data);
    //     var responseObj = JSON.parse(response.data);
    //     // console.log(' else  response Path =================', responseObj.Path);

    //     if (responseObj.Status) {
    //       if (this.state.isother) {
    //         this.setState({ ReportPath: responseObj.Path });
    //         this.BookAppointments();
    //       } else {
    //         let responseData = [];
    //         this.state.AnalyteTempList.map((item) => {
    //           (item.ReportPath = responseObj.Path),
    //             delete item["InterpretationList"];
    //           responseData.push(item);
    //         });
    //         this.setState(
    //           {
    //             AnalyteTempList: responseData,
    //           },
    //           () => {
    //             this.BookAppointments();
    //           }
    //         );
    //       }
    //       // console.log('ImagePath responseData==============', responseData);
    //     } else {
    //       this.setState({ isUploading: false, isLoading: false });
    //       Toast.show(responseObj.data.Msg);
    //       // console.log(" else  response =================", responseObj);
    //     }
    //   })
    //   .catch((e) => {
    //     // console.log("error response=================", e);
    //   });
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
          (temp.BookingId = this.state.BookingId);
        // item.ReportPath = '',
        responseData.push(item);
      });
      try {
        let response = await axios.post(Constants.ADD_REPORT, {
          AnalyteDetails: responseData, //this.state.AnalyteTempList,
          Notes: this.state.addressinput
        });
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
        // as per the new api
        this.GetReportValuesAPI();
        // this.ReportManualPunchAPI();  old api
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
      pageNo: 1
    });
    this.getSuggestedTest();

    // console.log("&&*&*&*&****", this.state.isModalVisible);
    // }
  };

  togglePicker = (resultarray, index) => {
    /// this.setState({isModalVisible: !this.state.isModalVisible});
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

  takePhotoFromCamera = () => {
    this.setState({ isPrescription: false }, () => {
      setTimeout(() => {
        ImagePicker.openCamera({
          size: 5000000,
          cropping: false
        })
          .then((response) => {
            if (response.size > 5000000) {
              Toast.show("Please select image size upto 5MB");
            } else {
              // console.log(response, "from camera");
              let prescriptionPic = [];
              prescriptionPic.push({
                uri: response.path,
                type: response.mime,
                // name: response.fileName,
                name: response.path.slice(response.path.lastIndexOf("/") + 1)
              });

              this.setState(
                {
                  prescriptionPic: prescriptionPic,
                  prescriptionUri: response.uri,
                  prescriptionName: prescriptionPic[0].name
                },
                () => {
                  // this.uploadPrescription();
                }
              );
            }
          })
          .catch((err) => {
            // console.log("err", err);
            alert(err, "alert messaeg");
            this.setState({
              prescriptionPic: "",
              prescriptionUri: "",
              prescriptionName: ""
            });
            // console.log(err, "Camera ERRor ");
          });
      }, 500);
    });
  };

  choosePhotoFromLibrary = () => {
    this.setState({ isPrescription: false }, () => {
      setTimeout(() => {
        ImagePicker.openPicker({
          // width: 500,
          // height: 500,
          cropping: false,
          size: 5000000
        })
          .then((response) => {
            if (response.size > 5000000) {
              Toast.show("Please select image size upto 5MB");
            } else {
              // console.log(response, "from libary");
              let prescriptionPic = [];
              prescriptionPic.push({
                uri: response.path,
                type: response.mime,
                // name: response.fileName,
                name: response.path.slice(response.path.lastIndexOf("/") + 1)
              });

              this.setState(
                {
                  prescriptionPic: prescriptionPic,
                  prescriptionUri: response.uri,
                  prescriptionName: prescriptionPic[0].name
                },
                () => {
                  // this.uploadPrescription();
                }
              );
            }
          })
          .catch((err) => {
            // console.log("err", err);
            alert(err, "alert messaeg");
            this.setState({
              prescriptionPic: "",
              prescriptionUri: "",
              prescriptionName: ""
            });
          });
      }, 500);
    });
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
    // this.setState(
    //   {
    //     searchString: val,
    //     AllTestList: [],
    //     pageNo: 1,
    //     searchLoading: true,
    //   },
    //   () => {
    //     this.getSuggestedTest(true);
    //   }
    // );
  };

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
        // let AnalyteList = [...this.state.AnalyteList];
        // let filledAnalyteList = [...this.state.filledAnalyteList];

        // AnalyteList[index] = {
        //   ...AnalyteList[index],
        //   Result: item.Result
        // };
        // filledAnalyteList[index] = {
        //   ...AnalyteList[index],
        //   Result: item.Resultr
        // };
        // this.setState({
        //   AnalyteList,
        //   Result: item.Result,
        //   filledAnalyteList
        //   // pickerVisible: !this.state.pickerVisible
        // });
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
    // console.log(
    //   "onPressSubmit response=================",
    //   this.state.testName,
    //   this.state.isother
    // );

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
    //  else if (this.state.BookingId == "" && this.state.isother == false) {
    //   Toast.show("BookingId not generate");
    // }
    //  else if (this.state.prescriptionName == "") {
    //   Toast.show("Upload Report Picture");
    // }
    else {
      let responseData = [];
      let iszero = "";
      let filtered;
      other = [];

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
    this.setState({ isPrescription: false }, () => { });
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
  componentWillUnmount = () => {
    // this.backHandler.remove();
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
      const values = [...this.state.otherreportdetails];
      values[i].Value = event;
      this.setState({ otherreportdetails: values });
    }
  };
  handleChangeParamname = (i, event) => {
    const values = [...this.state.otherreportdetails];
    values[i].ParameterName = event;
    this.setState({ otherreportdetails: values });
  };
  handleChangeResult = (i, event) => {
    const values = [...this.state.otherreportdetails];
    values[i].Result = event;
    this.setState({ otherreportdetails: values });
  };
  handleChangeUnit = (i, event) => {
    const values = [...this.state.otherreportdetails];
    values[i].Unit = event;
    this.setState({ otherreportdetails: values });
  };
  handleChangeMin = (i, event) => {
    if (isNaN(event)) {
      Toast.show("Please enter only number in minimum range");
    } else {
      const values = [...this.state.otherreportdetails];
      values[i].MinRange = event;
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
  render() {
    // console.log(this.state.otherreportdetails, "other ---====");
    const screenWidth = Math.round(Dimensions.get("window").width);
    return (
      <View style={styles.MainContainer}>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="My Reports"
          headerId={1}
          navigation={this.props.navigation}
        />
        {/* For   CAMERA  */}

        {/* <Modal isVisible={this.state.isPrescription}>
          <View
            style={{
              flexDirection: "column",
              width: "80%",
              height: "25%",
              backgroundColor: "white",
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                backgroundColor: "white",
                marginTop: 10,
                marginLeft: 0,
                marginRight: 0,
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={this.takePhotoFromCamera}>
                <Text style={{ textAlign: "center", fontSize: 16, margin: 10 }}>
                  Take Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={this.checkPermission}

                onPress={this.choosePhotoFromLibrary}
              >
                <Text
                  style={{ textAlign: "center", fontSize: 15, margin: 10 }}
                  numberOfLines={1}
                >
                  Choose From Library
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                // onPress={this.checkPermission}

                onPress={this.chooseFile}
              >
                <Text
                  style={{ textAlign: "center", fontSize: 15, margin: 10 }}
                  numberOfLines={1}
                >
                  Choose From Gallery
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.ClosePOPup}>
                <Text style={{ textAlign: "center", fontSize: 15, margin: 10 }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal> */}

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
                    source={require("../../icons/search.png")}
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
                    source={require("../../icons/CLOSE2.png")}
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
              <Image
                source={require("../../icons/search.png")}
                style={{ height: 20, width: 0, marginLeft: 10, marginTop: 10 }}
              />
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
                    // backgroundColor: "#F5F5F5",
                    borderRadius: 20,
                    height: 40,
                    borderColor: "gray",
                    flexDirection: "row"
                    // shadowOffset: { width: 0, height: 2 },
                    // shadowColor: "gray",
                    // shadowOpacity: 0.7,
                    // elevation: 5,
                  }}
                >
                  <Image
                    source={require("../../icons/search.png")}
                    style={{
                      height: 20,
                      width: 0,
                      marginLeft: 10,
                      marginTop: 10
                    }}
                  />
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
                          source={require("../../icons/CLOSE2.png")}
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
                        flex: 1,
                        justifyContent: "center",
                        // marginTop: 10,
                        marginLeft: 15
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
                          this.handleChangeParamname(id, val)
                        }
                        value={field.ParameterName}
                        underlineColorAndroid="transparent"
                        placeholder="Enter Parameter Name"
                        allowFontScaling={false}
                      />
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
                        flex: 1,
                        justifyContent: "center",
                        marginTop: 10,
                        marginLeft: 15,
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
                        onChangeText={(val) => this.handleChangeMin(id, val)}
                        value={field.MinRange}
                        underlineColorAndroid="transparent"
                        placeholder="Minimum"
                        keyboardType={"numeric"}
                        allowFontScaling={false}
                      />
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          // marginTop: 10,
                          marginLeft: 15
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
                          onChangeText={(val) => this.handleChangeMax(id, val)}
                          value={field.MaxRange}
                          underlineColorAndroid="transparent"
                          placeholder="Maximun"
                          allowFontScaling={false}
                        />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          // marginTop: 10,
                          marginLeft: 15
                        }}
                      >
                        <TextInput
                          style={{
                            textAlign: "left",
                            flex: 1,

                            fontSize: 15,
                            marginLeft: 19
                          }}
                          onChangeText={(val) => this.handleChangeUnit(id, val)}
                          value={field.Unit}
                          underlineColorAndroid="transparent"
                          placeholder="Enter Unit"
                          allowFontScaling={false}
                        />
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
                        flex: 1,
                        justifyContent: "center",
                        marginTop: 10,
                        marginLeft: 15
                      }}
                    >
                      <TextInput
                        style={{
                          textAlign: "left",
                          flex: 1,

                          fontSize: 15,
                          marginLeft: 19
                        }}
                        onChangeText={(val) => this.handleChangevalue(id, val)}
                        value={field.Value}
                        underlineColorAndroid="transparent"
                        placeholder="Enter Value"
                        keyboardType={"numeric"}
                        allowFontScaling={false}
                      />
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
                        flex: 1,
                        justifyContent: "center",
                        marginTop: 10,
                        marginLeft: 15
                      }}
                    >
                      <TextInput
                        style={{
                          textAlign: "left",
                          flex: 1,

                          fontSize: 15,
                          marginLeft: 19
                        }}
                        onChangeText={(val) => this.handleChangeResult(id, val)}
                        value={field.Result}
                        underlineColorAndroid="transparent"
                        placeholder="Enter Result"
                        allowFontScaling={false}
                      />
                    </View>
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
            ))
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

          {/* <Text
            style={{
              marginTop: 20,
              fontSize: 14,
              marginLeft: 15,
              fontWeight: "bold",
            }}
          >
            Upload Report
          </Text>

          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 60,
              backgroundColor: "lightgray",
              marginRight: 15,
              marginLeft: 15,
              marginTop: 8,
              borderRadius: 5,
              flexDirection: "row",
            }}
            // onPress={this.chooseFile.bind(this)}
            onPress={() => {
              this.setState({ isPrescription: true });
            }}
          >
            <Image
              source={require("../../icons/Upload-image-here.png")}
              style={{
                height: 30,
                width: 30,
                margin: 10,
                justifyContent: "center",
                alignSelf: "center",
              }}
            />
            <Text style={{ color: "gray", fontSize: 18 }}>
              Upload Report here
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              textAlign: "center",
              backgroundColor: "white",
              alignContent: "center",
              margin: 5,
              color: "darkgray",
              fontSize: 12,
            }}
          >
            {this.state.prescriptionName}
          </Text>
   */}
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
