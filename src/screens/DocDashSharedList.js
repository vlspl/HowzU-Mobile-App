import React, { PureComponent } from "react";
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
  ScrollView,
  BackHandler,
  RefreshControl
} from "react-native";
import { Container } from "native-base";
//import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from "@react-native-community/async-storage";
import CustomeHeader from "../appComponents/CustomeHeader";
//import AppointmentRow from '../appComponents/AppointmentRow';
import PaginationLoading from "../appComponents/PaginationLoading";
import SharedReportCountDoc from "../appComponents/SharedReportCountDoc";
import DocDashAllSuggestRow from "../appComponents/DocDashAllSuggestRow";
import Constants from "../utils/Constants";
//import AsyncStorage from '@react-native-community/async-storage';
import Toast from "react-native-tiny-toast";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import moment from "moment";

import axios from "axios";

export default class DocDashSharedList extends PureComponent {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      pageNo: 1,
      searchString: "",
      AllSharedReportList: [],
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      typingTimeout: 0,
      isLoadingSecond: false,
      typing: true
    };

    // console.log('constructort==============================');
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   " DocDashShared Report componentWillReceiveProps==============================",
    //   nextProp
    // );
    //this.setState({selectedtestId: nextProp.route.params.testids });

    // console.log(
    //   " DocDashShared Report componentDidMount=============================="
    // );
    this.setState(
      { pageNo: 1, isLoading: true, AllSharedReportList: [] },
      () => {
        this.getSuggestedTest("");
      }
    );
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
  };

  componentDidMount = async () => {
    // console.log("componentDidMount==============================");
    this.setState(
      { isLoading: true, AllSharedReportList: [], pageNo: 1 },
      () => {
        this.getSuggestedTest("");
      }
    );
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
  };

  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return !this[a.ReportId] && (this[a.ReportId] = true);
    }, Object.create(null));
  };

  getSuggestedTest = async (empty) => {
    try {
      let response = await axios.post(Constants.DOCDASH_ALLSHAREREPORT, {
        pageNumber: this.state.pageNo,
        pageSize: 20,
        Searching: this.state.searchString
      });
      let oldreportresponse = await axios.post(
        Constants.DOCDASH_ALLSHARED_OLDREPORT,
        {
          pageNumber: this.state.pageNo,
          pageSize: 20,
          Searching: this.state.searchString
        }
      );
      // console.log("All Shared Report data==============", response.data);
      // console.log(
      //   "Old Shared Report data==============",
      //   oldreportresponse.data
      // );

      if (response.data.Status) {
        let responseData = this.state.AllSharedReportList;
        // let responseData = [];

        response.data.ReportList.map((item) => {
          // console.log(item, "doc dash shared list");
          responseData.push(item);
        });

        if (oldreportresponse.data.Status) {
          // let responseData = this.state.AllSharedReportList;

          oldreportresponse.data.ReportList.map((item) => {
            // console.log(item, "doc dash shared list");
            responseData.push(item);
          });
        }

        const sortedArray = responseData.sort(
          (a, b) =>
            moment(b.SharedDate).format("YYYYMMDD") -
            moment(a.SharedDate).format("YYYYMMDD")
        );
        // console.log(sortedArray, "==========report shared ");
        this.setState({
          AllSharedReportList: this.removeDuplicate(sortedArray),
          // AllSharedReportList:responseData,
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      } else {
        if (oldreportresponse.data.Status) {
          let responseData = this.state.AllSharedReportList;
          let desendingsortarrydata;
          oldreportresponse.data.ReportList.map((item) => {
            // console.log(item, "doc dash shared list");
            responseData.push(item);
          });
          // desendingsortarrydata = responseData.sort(function (a, b) {
          //   a = moment(a.SharedDate).format("DD MMM YY, hh:mm A");
          //   b = moment(b.SharedDate).format("DD MMM YY, hh:mm A");
          //   // a = a.TestDate.split("/");
          //   // b = b.TestDate.split("/");
          //   return b[2] - a[2] || b[1] - a[1] || b[0] - a[0];
          // });
          const sortedArray = responseData.sort(
            (a, b) =>
              moment(b.SharedDate).format("YYYYMMDD") -
              moment(a.SharedDate).format("YYYYMMDD")
          );
          this.setState({
            AllSharedReportList: this.removeDuplicate(sortedArray),
            // AllSharedReportList:responseData,
            isLoading: false,
            paginationLoading: false,
            searchLoading: false,
            refreshing: false
          });
        } else {
          //Toast.show(response.data.Msg)
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
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        refreshing: false
      });
      //  console.log(errors);
    }
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
    //  console.log("======", val);
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
            AllSharedReportList: [],
            pageNo: 1,
            searchLoading: true,
            // isLoading: true,
            refreshing: true
          },
          () => {
            this.getSuggestedTest(true);
          }
        );
      }, 1000)
    });
  };

  onRefresh = async () => {
    this.setState(
      {
        refreshing: true,
        AllSharedReportList: [],
        pageNo: 1
      },
      () => {
        this.getSuggestedTest();
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

  hardwarebBackAction = () => {
    this.props.navigation.navigate("PatientDashboard", { refresh: "true" });
    // this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  handleSelectionMultiple = (index) => {
    // console.log("TestID==============================");
    var dict = {}; // create an empty array

    dict = this.state.AllSharedReportList[index];
    let testprices = dict["TestPrice"];
    var sum = 0;
    var pricearr = testprices.split(",");
    pricearr.forEach(function (obj) {
      sum += Number(obj);
    });

    // console.log("Total Price ==============================", dict);

    ///dict.set("Total", sum);
    dict["Total"] = sum;
    // console.log("Total Price ==============================", dict);

    //console.log('index====================================',index,dict)

    this.props.navigation.navigate("BookAppointment", {
      labinfo: dict,
      from: "suggested"
    });
  };

  //handling onPress action
  // OpenCheckStatus = (item) => {
  //   //Alert.alert(item.key,item.title);
  //   this.props.navigation.navigate('CheckStatus');
  // };
  backbtnPress = () => {
    var role = AsyncStorage.getItem(Constants.ACCOUNT_ROLE);
    this.props.navigation.navigate("PatientDashboard", {
      refresh: "refresh",
      role: role
    });
  };

  OpenReportDetail = (index) => {
    let labinfo = this.state.AllSharedReportList[index];
    // let pendingReportinfo = this.state.PendingRequestList[index];

    // console.log(
    //   "====================================Open report details",
    //   index,

    //   labinfo
    // );
    if (labinfo.ReportId > 0) {
      this.props.navigation.navigate("MyReportGraphscreen", {
        // ReportId: labinfo.ReportId,
        // userId: labinfo.PatientId,
        from: "Doctor",
        // viewcomment: false,
        labinfo: labinfo,
        viewedit: false
      });
    }
  };

  render() {
    return (
      <Container>
        <Loader loading={this.state.isLoading} />
        <CustomeHeader
          title="Shared Report"
          headerId={2}
          navigation={this.props.navigation}
          onPressback={this.backbtnPress}
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
                backgroundColor: "white",
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

          <View style={{ flex: 1 }}>
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
              {this.state.AllSharedReportList.map((item, index) => (
                <SharedReportCountDoc
                  ProfilePic={item.PatientPic}
                  testname={item.PatientName}
                  teststatus="Complete"
                  date={item.TestName}
                  date1={moment(item.SharedDate).format("DD MMMM YY")}
                  lablogo={require("../../icons/tests-1.png")}
                  OpenReportDetail={() => this.OpenReportDetail(index)}
                ></SharedReportCountDoc>
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
            {this.state.AllSharedReportList.length <= 0 &&
            !this.state.isLoading &&
            !this.state.searchLoading &&
            !this.state.refreshing ? (
              <NoDataAvailable onPressRefresh={this.onRefresh} />
            ) : null}
          </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  containermain: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "white"
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
