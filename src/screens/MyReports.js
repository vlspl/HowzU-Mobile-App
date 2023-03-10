import React, { Component } from "react";
//import CustomListview from './Screen/DoctorList'
import axios from "axios";
import Constants from "../utils/Constants";
// import { ScrollView } from 'react-native-gesture-handler';
import Toast from "react-native-tiny-toast";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  BackHandler,
  ScrollView
} from "react-native";
import { Container } from "native-base";

import CustomeHeader from "../appComponents/CustomeHeader";
import MyReportRow from "../appComponents/MyReportRow";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import PaginationLoading from "../appComponents/PaginationLoading";
import moment from "moment";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import VoicerecordIcon from "react-native-vector-icons/MaterialIcons";

class MyReports extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      headerId: 2,
      pageNo: 1,
      searchString: "",
      AllReportList: [],
      PendingRequestList: [],
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false
    };
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   " Appointment componentWillReceiveProps==============================",
    //   nextProp
    // );
    //this.setState({selectedtestId: nextProp.route.params.testids });

    this.setState(
      {
        pageNo: 1,
        isLoading: true,
        AllReportList: [],
        PendingRequestList: [],
        searchString: ""
      },
      () => {
        this.getSuggestedTest("");
        // this.getManualPunchReport("");
      }
    );
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
  };

  componentDidMount = async () => {
    // console.log('componentDidMount==============================');
    this.setState(
      {
        isLoading: true,
        AllReportList: [],
        PendingRequestList: [],
        searchString: ""
      },
      () => {
        this.getSuggestedTest("");
        // this.getManualPunchReport('');
      }
    );
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
  };
  hardwarebBackAction = () => {
    // this.props.navigation.popToTop();
    // this.props.navigation.navigate('PatientDashboard', {
    //   headerId: this.state.headerId,
    // });
    // this.props.navigation.goBack();
    // return true;
    this.props.navigation.navigate("PatientDashboard", {
      refresh: "refresh"
    });
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  // OpenReportDetail = (item) => {
  //   //Alert.alert(item.key,item.title);
  //   this.props.navigation.navigate("MyReportGraphscreen");
  //   console.log("OpenReportDetail calllll==============================");
  // };

  OpenReportDetail = (index) => {
    let labinfo = this.state.AllReportList[index];
    // let pendingReportinfo = this.state.PendingRequestList[index];

    // console.log(
    //   "====================================Open report details",
    //   index,
    //   labinfo

    //   // this.state.AllReportList
    // );
    if (labinfo.ReportId > 0) {
      // console.log("****$$$$%%%%5");
      this.props.navigation.navigate("MyReportGraphscreen", {
        labinfo: labinfo
      });
    } else {
      Toast.show("Not  approved");
    }
  };

  PendingReportDetail = (index) => {
    // let labinfo = this.state.AllReportList[index];
    let pendingReportinfo = this.state.PendingRequestList[index];

    // console.log(
    //   'index====================================',
    //   index,
    //   // labinfo.ReportId,
    //   'Lab info',
    //   pendingReportinfo,
    //   'this.state.AllReportlist',
    //   this.state.PendingRequestList[index],
    //   'report details',
    //   this.state.AllReportList
    // );
    Toast.show("Waiting for approval");

    // if (pendingReportinfo.ReportId > 0) {
    //   this.props.navigation.navigate('MyReportGraphscreen', {
    //     ReportId: pendingReportinfo.ReportId,
    //   });
    // } else {
    //  }
  };

  onBackAgain = () => {
    // console.log(
    //   'My Reports ===================================Come back again user profile',
    //   this.props.navigation.pop(1)
    // );

    this.setState(
      { pageNo: 1, isLoading: true, AllReportList: [], PendingRequestList: [] },
      () => {
        this.getSuggestedTest("");
        // this.getManualPunchReport("");
      }
    );
    // this.setState(
    //   {
    //     userDetails: [],
    //     isLoading: true,
    //   },
    //   () => {
    //     this.getProfileDetail();
    //   }
    // );
    var role = AsyncStorage.getItem(Constants.ACCOUNT_ROLE);
    this.props.navigation.reset("PatientDashboard", {
      refresh: "refresh",
      role: role
    });
  };

  OpenManualPunch = (item) => {
    //Alert.alert(item.key,item.title);
    // this.props.navigation.navigate("ChooseUploadReport");
    this.props.navigation.navigate("ReportManualPunch", {
      refresh: ""
    });
  };

  getManualPunchReport = async (empty) => {
    try {
      let response = await axios.post(Constants.GET_MANUALREPORTLIST, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString
      });
      // console.log('getManualPunchReport ==============', response.data);
      this.setState({ isLoading: false });

      if (response.data.Status) {
        //  this.state.PendingRequestList
        let responseData = [];

        response.data.LabList.map((item) => {
          responseData.push(item);
        });

        this.setState({
          PendingRequestList: responseData,
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
      ///Toast.show(errors)

      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        refreshing: false
      });
      console.log(errors);
    }
  };
  removeDuplicatePrescription = (datalist) => {
    // console.log('.../../Prescription',datalist);
    return datalist.filter(function (a) {
      return !this[a.ReportId] && (this[a.ReportId] = true);
    }, Object.create(null));
  };

  getSuggestedTest = async (empty) => {
    try {
      let response = await axios.post(Constants.GET_REPORTLIST, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString
      });
      let oldreportlist = await axios.post(Constants.GET_OLDREPORT_LIST, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString
      });
      // console.log(
      //   "GETreport data==============",
      //   JSON.stringify(response.data)
      // );

      // console.log(
      //   "GET_OLDREPORT_LISTMy report data==============",
      //   JSON.stringify(oldreportlist.data)
      // );
      this.setState({ isLoading: false });
      if (response.data.Status) {
        let responseData = this.state.AllReportList;

        if (oldreportlist.data.Status) {
          oldreportlist.data.LabList.map((item) => {
            let temp = {};
            temp = item;
            temp.formatedTestDate = moment(item.TestDate).format("DD/MM/YYYY");
            responseData.push(item);
          });
        }
        // let responseData = [];
        this.setState({ loading: false });

        response.data.ReportList.map((item) => {
          let temp = {};
          temp = item;
          temp.Flag = "";
          temp.formatedTestDate = moment(item.ReportDate).format("DD/MM/YYYY");
          responseData.push(item);
        });

        const desendingsortarrydata = responseData.sort(function (a, b) {
          // '01/03/2014'.split('/')
          // gives ["01", "03", "2014"]
          a = a.formatedTestDate.split("/");
          b = b.formatedTestDate.split("/");
          return b[2] - a[2] || b[1] - a[1] || b[0] - a[0];
        });
        // console.log(desendingsortarrydata, "======my reports");
        this.setState({
          AllReportList: this.removeDuplicatePrescription(
            desendingsortarrydata
          ),
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      } else {
        let responseData = this.state.AllReportList;
        if (oldreportlist.data.Status) {
          oldreportlist.data.LabList.map((item) => {
            let temp = {};
            temp = item;
            temp.formatedTestDate = moment(item.TestDate).format("DD/MM/YYYY");
            responseData.push(item);
          });
          const desendingsortarrydata = responseData.sort(function (a, b) {
            a = a.formatedTestDate.split("/");
            b = b.formatedTestDate.split("/");
            return b[2] - a[2] || b[1] - a[1] || b[0] - a[0];
          });
          this.setState({
            AllReportList: this.removeDuplicatePrescription(
              desendingsortarrydata
            ),
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
      }
    } catch (errors) {
      ///Toast.show(errors)

      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        refreshing: false
      });
      console.log(errors);
    }
  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 5;
  };

  callpagination = async () => {
    this.setState(
      { paginationLoading: true, pageNo: this.state.pageNo + 1 },
      () => {
        this.getSuggestedTest();
      }
    );
  };

  onChangeTextClick = async (val) => {
    // console.log('======', val);
    this.setState(
      { searchString: val, AllReportList: [], pageNo: 1, searchLoading: true },
      () => {
        this.getSuggestedTest(true);
      }
    );
  };

  onRefresh = async () => {
    this.setState(
      {
        refreshing: true,
        AllReportList: [],
        PendingRequestList: [],
        pageNo: 1
      },
      () => {
        this.getSuggestedTest();
        // this.getManualPunchReport();
      }
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          //width: "95%",
          backgroundColor: "gray",
          marginLeft: 20,
          marginRight: 15
        }}
      />
    );
  };

  backbtnPress = () => {
    this.props.navigation.goBack();
    // this.props.navigation.navigate('PatientDashboard', {
    //   // refresh: 'refresh',
    // });
  };

  render() {
    const { data, isLoading } = this.state;
    console.log(this.state.isLoading, "this.state.isLoading my reports ===");

    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="My Reports"
          headerId={2}
          onPressback={this.backbtnPress}
          navigation={this.props.navigation}
        />

        <View style={{ flex: 1, flexDirection: "column" }}>
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
                shadowOpacity: 0.9,
                elevation: 5
              }}
            >
              <Image
                source={require("../../icons/search.png")}
                style={{ height: 20, width: 20, marginLeft: 10, marginTop: 10 }}
              />
              <TextInput
                style={{
                  textAlign: "left",
                  flex: 1,
                  paddingLeft: 5,
                  fontSize: 15
                }}
                onChangeText={(val) => this.onChangeTextClick(val)}
                value={this.state.searchString}
                underlineColorAndroid="transparent"
                placeholder="Search.."
                allowFontScaling={false}
              />
            </View>
          </View>
          <View style={styles.containermain}>
            <View style={{ flex: 1 }}>
              <ScrollView
                style={{ flex: 1, margin: 0 }}
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
                {/* {this.state.PendingRequestList.length != 0 ? (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      backgroundColor: "#003484",
                    }}
                  >
                    <Text
                      style={{
                        margin: 10,
                        marginLeft: 15,
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      Pending Approval
                    </Text>
                    <View
                      style={{
                        height: 0.5,
                        backgroundColor: "gray",
                        marginRight: 5,
                        marginTop: 5,
                        marginLeft: 15,
                      }}
                    ></View>
                  </View>
                ) : null}
                {this.state.PendingRequestList.map((item, index) => {
                  return (
                    <MyReportRow
                      labname={
                        item.LabName == "" ? item.ReportPath : item.LabName
                      }
                      testname={item.TestName == "" ? "" : item.TestName}
                      TestSubtitle={moment(item.Date).format(
                        " DD MMM YY, hh:mm A"
                      )}
                      btnShow="no"
                      onPressCheckStatus={() => this.PendingReportDetail(index)}
                    ></MyReportRow>
                  );
                })} */}

                {/* {this.state.AllReportList.length != 0 ? (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      backgroundColor: "#003484",
                    }}
                  >
                    <Text
                      style={{
                        margin: 10,
                        marginLeft: 15,
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      My Reports
                    </Text>
                    <View
                      style={{
                        height: 0.5,
                        backgroundColor: "gray",
                        marginRight: 5,
                        marginTop: 5,
                        marginLeft: 15,
                      }}
                    ></View>
                  </View>
                ) : null} */}

                {this.state.AllReportList.map((item, index) => (
                  <View style={{ flex: 1 }} key={index}>
                    <MyReportRow
                      labname={item.LabName == "" ? "" : item.LabName}
                      testname={item.TestName}
                      // TestSubtitle={moment(item.TestDate).format(
                      //   " DD MMM YY, hh:mm A"
                      // )}
                      TestSubtitle={item.formatedTestDate}
                      btnShow="yes"
                      onPressCheckStatus={() => this.OpenReportDetail(index)}
                    ></MyReportRow>
                  </View>
                ))}

                <View>
                  {this.state.paginationLoading ? <PaginationLoading /> : null}
                </View>
                <View style={{ flex: 1 }}>
                  {this.state.searchLoading ? (
                    <Loader loading={this.state.isLoading} />
                  ) : null}
                </View>
              </ScrollView>
              {this.state.AllReportList.length <= 0 &&
              this.state.PendingRequestList.length <= 0 &&
              !this.state.isLoading &&
              !this.state.searchLoading &&
              !this.state.refreshing ? (
                <NoDataAvailable
                  onPressRefresh={this.onRefresh}
                  source={require("../../icons/nodatamyreport.png")}

                  // source={require("../../icons/nodatafoundreport.jpeg")}
                />
              ) : // <View
              //   style={{
              //     height: "100%",
              //     width: "100%",
              //     backgroundColor: "white",
              //     alignItems: "center",
              //     justifyContent: "center",
              //     marginTop: 0
              //     // margin: 10
              //   }}
              // >
              //   <Image
              //     source={require("../../icons/nodatafoundreport.jpeg")}
              //     style={{
              //       height: 300,
              //       width: "100%"
              //     }}
              //   />
              //   <TouchableOpacity onPress={this.onRefresh}>
              //     {/* <Text style={{ color: "green", backgroundColor: "white" }}>
              //       click to refresh
              //     </Text> */}
              //   </TouchableOpacity>
              // </View>
              null}
            </View>
          </View>
        </View>

        <ActionButton
          useNativeDriver={true}
          buttonColor="#275BB4"
          style={{ marginRight: 50 }}
        >
          <ActionButton.Item
            useNativeDriver={true}
            buttonColor="#275BB4"
            title="Upload Manually"
            onPress={() =>
              this.props.navigation.navigate("ReportManualPunch", {
                refresh: ""
              })
            }
          >
            <Icon name="reader" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            useNativeDriver={true}
            buttonColor="#275BB4"
            title="Upload with Voice"
            onPress={() => {
              this.props.navigation.navigate("ReportPunchWithVoice", {
                refresh: ""
              });
            }}
          >
            <VoicerecordIcon
              useNativeDriver={true}
              name="surround-sound"
              style={styles.actionButtonIcon}
            />
          </ActionButton.Item>
        </ActionButton>
      </Container>
    );
  }
}
export default MyReports;
const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white"
  },
  containermain: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "white",
    justifyContent: "center"
  },
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 3,
    marginLeft: 15,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 2,
    borderRadius: 5,
    backgroundColor: "white",
    elevation: 2
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    flexDirection: "row",
    // backgroundColor: 'gray',
    marginRight: 10,
    fontWeight: "bold"
  },
  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    padding: 5,
    justifyContent: "center",
    backgroundColor: "white"
  },
  description: {
    fontSize: 12,
    //marginTop: 4,
    padding: 2,
    color: "gray",
    marginLeft: 2,
    flex: 1
    /// backgroundColor: 'gray',
  },
  suggestbtnTitle: {
    // flex:1,
    fontSize: 9,
    marginRight: 0,
    paddingRight: 0,
    color: "white",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
  },
  photo: {
    height: 68,
    width: 68,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "gray",
    shadowOpacity: 0.7,
    elevation: 5,
    borderWidth: 0,
    borderRadius: 34
  },
  email: {
    fontSize: 12,
    //fontStyle: 'italic',
    marginTop: 3,
    color: "gray",
    marginLeft: 4
    // alignSelf: 'flex-end',

    // backgroundColor: 'gray',
  },
  image: {
    height: 22,
    width: 22,
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: 5

    // justifyContent: 'center'
  },
  touchable: {
    alignItems: "center",
    justifyContent: "center"
  },

  SuggestTesttouch: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
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
  sharebtnview: {
    flex: 0.3,
    flexDirection: "row",
    //alignSelf: 'flex-end',
    height: 22,
    //width: 150,
    //marginTop : 0,
    // paddingTop: 0,
    backgroundColor: "#003484",
    borderRadius: 11
  },

  Mobilesubview: {
    flex: 1,
    flexDirection: "row",
    marginTop: 5
    // alignSelf: 'flex-end',
    // backgroundColor:'yellow'
  },
  Icons: {
    height: 15,
    width: 15,
    marginTop: 2
  },

  emailsubview: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    justifyContent: "space-between",
    alignContent: "flex-end",
    marginTop: 4
    // backgroundColor:'yellow'
  },

  DoctorProfile: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignContent: "flex-end",
    textAlign: "right",
    color: "gray",
    fontSize: 11
  },

  Separator: {
    height: 0.5,
    backgroundColor: "gray",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10
  }
});
