import React, { Component } from "react";
//import CustomListview from './Screen/DoctorList'
import axios from "axios";
import Constants from "../utils/Constants";

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl
} from "react-native";
import { Container } from "native-base";

import CustomeHeader from "../appComponents/CustomeHeader";
import SharedReportRow from "../appComponents/SharedReportRow";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import PaginationLoading from "../appComponents/PaginationLoading";
import moment from "moment";
import Toast from "react-native-tiny-toast";

export default class ReportSharedToDoc extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      pageNo: 1,
      selectedId: "",
      selectedIds: [],
      oldreports: [],
      oldreportselecteIds: [],
      selectedIdswithflag: [],
      searchString: "",
      AllReportList: [],
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      DoctorId: 0,
      docinfo: {},
      isclikedviewreport: false
    };
  }

  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   " Appointment componentWillReceiveProps==============================",
    //   nextProp.route.params.doctorid
    // );
    //this.setState({selectedtestId: nextProp.route.params.testids });

    this.setState(
      {
        pageNo: 1,
        isLoading: true,
        AllReportList: [],
        DoctorId: nextProp.route.params.doctorid,
        docinfo: nextProp.route.params.docinfo.info,
        isclikedviewreport: false
      },
      () => {
        this.getSuggestedTest("");
      }
    );
  };

  componentDidMount = async () => {
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
    // console.log("componentDidMount==============================", this.props);
    this.setState(
      {
        isLoading: true,
        AllReportList: [],
        DoctorId: this.props.route.params.doctorid,
        docinfo: this.props.route.params.docinfo,
        isclikedviewreport: false
      },
      () => {
        this.getSuggestedTest("");
      }
    );
  };

  handleSelectionMultiple = (id, flag) => {
    // console.log("Shard report id ==============================", id);
    var selectedIds = [...this.state.selectedIds]; // clone state
    var selectedIdswithflag = [...this.state.selectedIdswithflag];
    // console.log(",,,..,..,,.", selectedIds);
    if (selectedIds.includes(id)) {
      // console.log("Inside if /////", id);
      selectedIds = selectedIds.filter((_id) => _id !== id);
      selectedIdswithflag = selectedIdswithflag.filter(
        (selctedid) => selctedid.id != id
      );
    } else {
      let temp = {};
      temp.id = id;
      temp.flag = flag;
      selectedIdswithflag.push(temp);
      selectedIds.push(id);
    }
    this.setState({ selectedIds, selectedIdswithflag });
    // console.log(selectedIdswithflag, "Flag");
  };
  OpenReportDetail = (index) => {
    let labinfo = this.state.AllReportList[index];
    // console.log("index====================================", index, labinfo);
    this.props.navigation.navigate("MyReportGraphscreen", {
      ReportId: labinfo.ReportId,
      labinfo: labinfo
    });
  };

  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return !this[a.ReportId] && (this[a.ReportId] = true);
    }, Object.create(null));
  };

  sharePress = () => {
    this.setState({ isLoading: true });
    this.shareReportCall();
  };

  oldreporsharePress = () => {
    this.setState({ isLoading: true });
    this.oldReportshare();
  };

  oldReportshare = async () => {
    // console.log("DoctorId ==============", this.state.DoctorId);
    // console.log(
    //   "selectedIds ==============",
    //   this.state.oldreportselecteIds.toString(),
    //   "this.state",
    //   this.state.selectedIdswithflag
    // );

    try {
      let response = await axios.post(Constants.Add_OLDSHAREREPORT, {
        DoctorId: Number(this.state.DoctorId),
        ReportId: this.state.oldreportselecteIds.toString()
      });
      // console.log("data==============", response.data);
      // this.setState({ isLoading: false });

      if (response.data.Status) {
        Toast.show(response.data.Msg);
        this.setState(
          { refreshing: true, AllReportList: [], pageNo: 1, oldreports: [] },
          () => {
            this.getSuggestedTest();
          }
        );
      } else {
        Toast.show(response.data.Msg);
        this.setState({ isLoading: false });
      }
    } catch (errors) {
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ isLoading: false });
      console.log(errors);
    }
  };
  shareReportCall = async () => {
    console.log("DoctorId ==============", this.state.DoctorId);
    console.log(
      "selectedIds ==============",
      this.state.selectedIds.toString(),
      "this.state",
      this.state.selectedIdswithflag
    );
    let normalids = [],
      oldreportids = [];
    const myObjStr = this.state.selectedIds.toString();
    const withfalg = this.state.selectedIdswithflag.toString();
    // console.log("with ", myObjStr);
    this.state.selectedIdswithflag.map((item) => {
      if (item.flag == "OldReport") {
        oldreportids.push(item.id);
      } else {
        normalids.push(item.id);
      }
    });
    // console.log(normalids, "///", oldreportids);
    let tonormaids = normalids.toString();
    let oldids = oldreportids.toString();
    if (normalids.length > 0 && oldreportids.length > 0) {
      this.setState({ isLoading: true });
      try {
        let response = await axios.post(Constants.Add_SHAREREPORT, {
          DoctorId: Number(this.state.DoctorId),
          ReportId: tonormaids
        });
        let oldrepots = await axios.post(Constants.Add_OLDSHAREREPORT, {
          DoctorId: Number(this.state.DoctorId),
          ReportId: oldids
        });

        // console.log("data==============", response.data);
        this.setState({ isLoading: false });

        if (response.data.Status && oldrepots.data.Status) {
          Toast.show(response.data.Msg);
          this.setState(
            { refreshing: true, AllReportList: [], pageNo: 1 },
            () => {
              this.getSuggestedTest();
            }
          );
        } else {
          Toast.show(response.data.Msg);
          this.setState({ isLoading: false });
        }
      } catch (errors) {
        ///Toast.show(errors)
        Toast.show("Something Went Wrong, Please Try Again Later");

        this.setState({ isLoading: false });
        console.log(errors);
      }
    } else if (normalids.length == 0 && oldreportids.length > 0) {
      this.setState({ isLoading: true });
      try {
        // let response = await axios.post(Constants.Add_SHAREREPORT, {
        //   DoctorId: Number(this.state.DoctorId),
        //   ReportId: normalids,
        // });
        let oldrepots = await axios.post(Constants.Add_OLDSHAREREPORT, {
          DoctorId: Number(this.state.DoctorId),
          ReportId: oldids
        });

        // console.log("data==============", response.data);
        this.setState({ isLoading: false });

        if (oldrepots.data.Status) {
          Toast.show(oldrepots.data.Msg);
          this.setState(
            { refreshing: true, AllReportList: [], pageNo: 1 },
            () => {
              this.getSuggestedTest();
            }
          );
        } else {
          Toast.show(oldrepots.data.Msg);
          this.setState({ isLoading: false });
        }
      } catch (errors) {
        ///Toast.show(errors)
        Toast.show("Something Went Wrong, Please Try Again Later");

        this.setState({ isLoading: false });
        console.log(errors);
      }
    }
    if (normalids.length > 0 && oldreportids.length == 0) {
      console.log("::://///slddsk");
      this.setState({ isLoading: true });
      try {
        let response = await axios.post(Constants.Add_SHAREREPORT, {
          DoctorId: Number(this.state.DoctorId),
          ReportId: tonormaids
        });

        this.setState({ isLoading: false });

        if (response.data.Status) {
          Toast.show(response.data.Msg);
          this.setState(
            { refreshing: true, AllReportList: [], pageNo: 1 },
            () => {
              this.getSuggestedTest();
            }
          );
        } else {
          Toast.show(response.data.Msg);
          this.setState({ isLoading: false });
        }
      } catch (errors) {
        Toast.show("Something Went Wrong, Please Try Again Later");

        this.setState({ isLoading: false });
        console.log(errors);
      }
    }
  };

  getSuggestedTest = async (empty) => {
    try {
      //  "http://endpoint.visionarylifescience.com/Patient/MyUnsharedReportReportList",

      let response = await axios.post(Constants.MY_UNSHARED_REPORTLIST, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString,
        DoctorId: this.state.DoctorId
      });
      let oldreportresponse = await axios.post(
        Constants.PATIENT_OLD_UNSHAREDR_REPORTLIST,
        {
          pageNumber: this.state.pageNo,
          pageSize: Constants.PER_PAGE_RECORD,
          Searching: this.state.searchString,
          DoctorId: this.state.DoctorId
        }
      );
      // console.log("data==============", response.data);
      // console.log("old data==============", oldreportresponse.data);

      this.setState({ loading: false });

      if (response.data.Status) {
        let responseData = this.state.AllReportList;
        let oldreportsdata = this.state.oldreports;
        // let temp = {};

        if (oldreportresponse.data.Status) {
          // responseData = this.state.AllReportList;
          let temp = {};
          oldreportresponse.data.ReportList.map((item) => {
            // console.log(
            //   item,
            //   ";;;;;;",
            //   moment(item.TestDate).format("DD/MM/YYYY"),
            //   ">>>>>>>>>oldreportresponse"
            // );
            temp = item;
            temp.newTestDate = moment(item.TestDate).format("DD/MM/YYYY");

            oldreportsdata.push(item);
            responseData.push(temp);
          });
        }
        response.data.ReportList.map((item) => {
          let temp1 = {};
          // console.log(
          //   moment(item.TestDate).format("DD/MM/YYYY"),
          //   "---------------****&&&&&&normal reports"
          // );
          temp1 = item;
          temp1.newTestDate = moment(item.TestDate).format("DD/MM/YYYY");

          temp1.Flag = "";
          responseData.push(temp1);
          // responseData.push(item);
        });

        const desendingsortarrydata = responseData.sort(function (a, b) {
          a = a.newTestDate.split("/");
          b = b.newTestDate.split("/");
          return b[2] - a[2] || b[1] - a[1] || b[0] - a[0];
        });
        // console.log("[[[[[[", desendingsortarrydata);
        this.setState({
          AllReportList: this.removeDuplicate(desendingsortarrydata),
          // oldreports: this.removeDuplicate(oldreportsdata),
          // AllReportList: this.removeDuplicate(responseData),
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      } else {
        let responseData = this.state.AllReportList;
        let temp = {};
        if (oldreportresponse.data.Status) {
          // responseData = this.state.AllReportList;

          oldreportresponse.data.ReportList.map((item) => {
            temp = item;
            temp.newTestDate = moment(item.TestDate).format("DD/MM/YYYY");

            responseData.push(temp);
            // responseData.push(item);
          });
          const desendingsortarrydata = responseData.sort(function (a, b) {
            // '01/03/2014'.split('/')
            // gives ["01", "03", "2014"]
            a = a.newTestDate.split("/");
            b = b.newTestDate.split("/");
            // a = moment(a.TestDate).format("DD MMM YY, hh:mm A");
            // b = moment(b.TestDate).format("DD MMM YY, hh:mm A");

            return b[2] - a[2] || b[1] - a[1] || b[0] - a[0];
          });
          this.setState({
            // oldreports: this.removeDuplicate(responseData),
            // AllReportList: this.removeDuplicate(responseData),
            AllReportList: this.removeDuplicate(desendingsortarrydata),

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
      Toast.show("Something went wrong,try again later");

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
    // console.log("======", val);
    this.setState(
      { searchString: val, AllReportList: [], pageNo: 1, searchLoading: true },
      () => {
        this.getSuggestedTest(true);
      }
    );
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
          marginRight: 15
        }}
      />
    );
  };
  viewReports = () => {
    // console.log(
    //   "Add btn press ==============================",
    //   this.state.docinfo
    // );

    // if(this.state.isclikedviewreport==false){
    this.setState({ isclikedviewreport: true });
    this.props.navigation.navigate("SharedDoctorList", {
      docinfo: this.state.docinfo
    });
    // }

    // navigat
    // this.addDoctoMyList();
  };

  render() {
    //  console.log(this.state.docinfo, "Reports shared ");
    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="My Reports"
          headerId={1}
          rightTitle="View Reports"
          navigation={this.props.navigation}
          onPressRight={this.viewReports}
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
                {/* {this.state.searchLoading == false &&
                this.state.searchString == "" &&
                this.state.oldreports.length != 0 ? (
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
                      Other Reports
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
                {this.state.oldreports.map((item, index) => (
                  <SharedReportRow
                    testname={item.TestName}
                    TestSubtitle={moment(item.TestDate).format(
                      "DD MMM YY, hh:mm A"
                    )}
                    viewreport={"Details"}
                    onPressCheckStatus={() => this.OpenReportDetail(index)}
                    checkbox={
                      this.state.oldreportselecteIds.includes(item.ReportId)
                        ? require("../../icons/checkbox.png")
                        : require("../../icons/checkbox_1.png")
                    }
                    onPress={() =>
                      this.handleSelectionMultiple(item.ReportId, item.Flag)
                    }
                  ></SharedReportRow>
                ))} */}

                {/* {this.state.searchLoading == false &&
                this.state.searchString == "" &&
                this.state.AllReportList.length != 0 ? (
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
                      Reports
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
                  <SharedReportRow
                    testname={item.TestName}
                    TestSubtitle={moment(item.TestDate).format("DD/MM/YYYY")}
                    // TestSubtitle={moment(item.TestDate).format("DD MMM YYYY ")}
                    viewreport={"Details"}
                    onPressCheckStatus={() => this.OpenReportDetail(index)}
                    checkbox={
                      this.state.selectedIds.includes(item.ReportId)
                        ? require("../../icons/checkbox.png")
                        : require("../../icons/checkbox_1.png")
                    }
                    onPress={() =>
                      this.handleSelectionMultiple(item.ReportId, item.Flag)
                    }
                  ></SharedReportRow>
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
          {this.state.selectedIds != "" &&
          this.state.oldreportselecteIds == "" ? (
            <TouchableOpacity onPress={this.sharePress}>
              <View
                style={{
                  backgroundColor: "#275BB4",
                  height: 45,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    color: "white",
                    fontWeight: "bold"
                  }}
                >
                  Share Report
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
          {this.state.oldreportselecteIds != "" &&
          this.state.selectedIds == "" ? (
            <TouchableOpacity onPress={this.oldreporsharePress}>
              <View
                style={{
                  backgroundColor: "#275BB4",
                  height: 45,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    color: "white",
                    fontWeight: "bold"
                  }}
                >
                  Share Report
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
          {this.state.oldreportselecteIds != "" &&
          this.state.selectedIds != "" ? (
            <View
              style={{
                backgroundColor: "#275BB4",
                height: 45,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  color: "red",
                  fontWeight: "bold"
                }}
              >
                Please select the report from the same list
              </Text>
            </View>
          ) : null}
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
