import React, { Component } from "react";
//import CustomListview from './Screen/DoctorList'
import axios from "axios";
import Constants from "../utils/Constants";
import { ScrollView } from "react-native-gesture-handler";

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
} from "react-native";
import { Container } from "native-base";
import Toast from "react-native-tiny-toast";
import CustomeHeader from "../appComponents/CustomeHeader";
import MyReportRow from "../appComponents/MyReportRow";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import PaginationLoading from "../appComponents/PaginationLoading";
import moment from "moment";

export default class PatientSharedReport extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      pageNo: 1,
      searchString: "",
      AllReportList: [],
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      patientid: "",
      typingTimeout: 0,
      isLoadingSecond: false,
      typing: true,
    };

    // this.hardwarebBackAction = this.hardwarebBackAction.bind(this);
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   '=======Patient Shared Report  componentWillReceiveProps==============================',
    //   nextProp.route.params.patientid
    // );
    //this.setState({selectedtestId: nextProp.route.params.testids });

    this.setState(
      {
        pageNo: 1,
        patientid: nextProp.route.params.patientid,
        isLoading: true,
        AllReportList: [],
      },
      () => {
        this.getSuggestedTest("");
      }
    );
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
  };

  hardwarebBackAction = () => {
    this.props.navigation.navigate("MyPatients");
    return true;
  };

  componentDidMount = async () => {
    // console.log(
    //   "=======Patient Shared Report componentDidMount==============================",
    //   this.props.route.params.patientid
    // );
    this.setState(
      {
        isLoading: true,
        patientid: this.props.route.params.patientid,
        AllReportList: [],
      },
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
  OpenReportDetail = (index) => {
    let labinfo = this.state.AllReportList[index];
    console.log("index====================================", index, labinfo);
    let temp = {};
    temp = labinfo;
    temp.PatientId = this.state.patientid;
    // My Report Graph screen same screen handle for patient and doc wit 2 diff api
    this.props.navigation.navigate("MyReportGraphscreen", {
      labinfo: labinfo,
      // userId: this.state.patientid,
      from: "Doctor",
    });
  };

  getSuggestedTest = async (empty) => {
    if (empty) {
      // console.log("**************");
      this.setState({ AllReportList: [] });
    }
    try {
      // let response = await axios.post(Constants.GET_REPORTLIST, {

      let response = await axios.get(
        Constants.GET_REPORT_LIST_SHARED_WITH_DOC + this.state.patientid
      );
      let oldreportlist = await axios.get(
        Constants.GET_OLDREPORT_LIST_SHARED_WITH_DOC + this.state.patientid
      );
      // console.log(
      //   "Get List of patients doc dash data==============",
      //   response.data
      // );
      this.setState({ isLoading: false });

      if (response.data.Status) {
        let responseData = this.state.AllReportList;

        if (oldreportlist.data.Status) {
          oldreportlist.data.TestList.map((olditem) => {
            responseData.push(olditem);
          });
        }
        response.data.TestList.map((item) => {
          responseData.push(item);
        });

        const desendingsortarrydata = responseData.sort(function (a, b) {
          a = a.TestDate.split("/");
          b = b.TestDate.split("/");
          return b[2] - a[2] || b[1] - a[1] || b[0] - a[0];
        });
        this.setState({
          AllReportList: this.removeDuplicate(desendingsortarrydata),
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false,
        });
      } else {
        let responseData = this.state.AllReportList;

        if (oldreportlist.data.Status) {
          oldreportlist.data.TestList.map((olditem) => {
            responseData.push(olditem);
          });
          const desendingsortarrydata = responseData.sort(function (a, b) {
            a = a.TestDate.split("/");
            b = b.TestDate.split("/");
            return b[2] - a[2] || b[1] - a[1] || b[0] - a[0];
          });
          this.setState({
            AllReportList: this.removeDuplicate(desendingsortarrydata),
            isLoading: false,
            paginationLoading: false,
            searchLoading: false,
            refreshing: false,
          });
        } else {
          this.setState({
            isLoading: false,
            paginationLoading: false,
            searchLoading: false,
            refreshing: false,
          });
        }
      }
    } catch (errors) {
      Toast.show("Something Went Wrong, Please Try Again Later");

      ///Toast.show(errors)

      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        refreshing: false,
      });
      // console.log(errors);
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
    // console.log("======", val);
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
            AllReportList: [],
            pageNo: 1,
            searchLoading: true,
            refreshing: true,
          },
          () => {
            this.getSuggestedTest(true);
          }
        );
      }, 1000),
    });
  };

  onRefresh = async () => {
    this.setState({ refreshing: true, AllReportList: [], pageNo: 1 }, () => {
      this.getSuggestedTest();
    });
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          //width: "95%",
          backgroundColor: "gray",
          marginLeft: 20,
          marginRight: 15,
        }}
      />
    );
  };

  render() {
    const { data, isLoading } = this.state;

    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          headerId={1}
          title="Patient Reports "
          navigation={this.props.navigation}
        />

        <View style={{ flex: 1, flexDirection: "column" }}>
          <View
            style={{
              height: 60,
              backgroundColor: "white",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
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
                elevation: 5,
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
                  fontSize: 15,
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
                onScroll={({ nativeEvent }) => {
                  if (this.isCloseToBottom(nativeEvent)) {
                    this.callpagination();
                  }
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                    //colors='red'
                  />
                }
              >
                {this.state.AllReportList.map((item, index) => (
                  <MyReportRow
                    index={index}
                    labname={item.LabName}
                    testname={item.TestName}
                    TestSubtitle={item.TestDate}
                    // TestSubtitle={moment(item.TestDate).format(
                    //   ' DD MM YY, hh:mm A'
                    // )}
                    onPressCheckStatus={() => this.OpenReportDetail(index)}
                  ></MyReportRow>
                ))}

                <View>
                  {this.state.paginationLoading ? <PaginationLoading /> : null}
                </View>
                <View style={{ flex: 1, height: 100 }}>
                  {this.state.searchLoading ? (
                    <Loader loading={this.state.isLoading} />
                  ) : null}
                </View>
              </ScrollView>
              {this.state.AllReportList.length <= 0 &&
              !this.state.isLoading &&
              !this.state.searchLoading &&
              !this.state.refreshing ? (
                <NoDataAvailable onPressRefresh={this.onRefresh} />
              ) : null}
            </View>
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
    backgroundColor: "white",
    justifyContent: "center",
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
    elevation: 2,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    flexDirection: "row",
    // backgroundColor: 'gray',
    marginRight: 10,
    fontWeight: "bold",
  },
  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    padding: 5,
    justifyContent: "center",
    backgroundColor: "white",
  },
  description: {
    fontSize: 12,
    //marginTop: 4,
    padding: 2,
    color: "gray",
    marginLeft: 2,
    flex: 1,
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
    fontWeight: "bold",
  },
  photo: {
    height: 68,
    width: 68,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "gray",
    shadowOpacity: 0.7,
    elevation: 5,
    borderWidth: 0,
    borderRadius: 34,
  },
  email: {
    fontSize: 12,
    //fontStyle: 'italic',
    marginTop: 3,
    color: "gray",
    marginLeft: 4,
    // alignSelf: 'flex-end',

    // backgroundColor: 'gray',
  },
  image: {
    height: 22,
    width: 22,
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: 5,

    // justifyContent: 'center'
  },
  touchable: {
    alignItems: "center",
    justifyContent: "center",
  },

  SuggestTesttouch: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  titlesubview: {
    flex: 1,
    flexDirection: "row",
    //alignSelf: 'flex-end',
    // backgroundColor: 'green',
  },

  DRnamesubview: {
    flex: 1,
    flexDirection: "row",
    //alignSelf: 'flex-end',
    backgroundColor: "white",
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
    borderRadius: 11,
  },

  Mobilesubview: {
    flex: 1,
    flexDirection: "row",
    marginTop: 5,
    // alignSelf: 'flex-end',
    // backgroundColor:'yellow'
  },
  Icons: {
    height: 15,
    width: 15,
    marginTop: 2,
  },

  emailsubview: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    justifyContent: "space-between",
    alignContent: "flex-end",
    marginTop: 4,
    // backgroundColor:'yellow'
  },

  DoctorProfile: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignContent: "flex-end",
    textAlign: "right",
    color: "gray",
    fontSize: 11,
  },

  Separator: {
    height: 0.5,
    backgroundColor: "gray",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10,
  },
});
