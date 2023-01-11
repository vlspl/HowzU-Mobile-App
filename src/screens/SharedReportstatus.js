import React, { Component } from "react";
//import CustomListview from './Screen/DoctorList'
import axios from "axios";
import Constants from "../utils/Constants";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-tiny-toast";
import moment from "moment";

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
import CustomeHeader from "../appComponents/CustomeHeader";
import MyReportRow from "../appComponents/MyReportRow";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import PaginationLoading from "../appComponents/PaginationLoading";
import AsyncStorage from "@react-native-community/async-storage";
import ImageLoad from "react-native-image-placeholder";

var status = "";
var updatestatus = "";
export default class SharedReportstatus extends Component {
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
      status: "",
      selectedId: "",
      SharedReportId: "",
      loadedPage: 0,
      selectedIds: [],
      selectedIdswithflag: [],
    };

    // console.log("constructort==============================");
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   " Shared Report componentWillReceiveProps==============================",
    //   nextProp.route.params.status
    // );
    status = nextProp.route.params.status;
    // this.setState({ isLoading: true, AllReportList: [], pageNo: 1 });
    // this.getReportList('');
    this.setState(
      { isLoading: true, AllReportList: [], pageNo: 1, selectedIds: [] },
      () => {
        this.getReportList("");
      }
    );
  };

  componentDidMount = () => {
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
    // console.log(
    //   "*******Shared Report componentDidMount==============================",
    //   this.props.route.params.status
    // );
    status = this.props.route.params.status;
    this.setState(
      { isLoading: true, AllReportList: [], pageNo: 1, selectedIds: [] },
      () => {
        this.getReportList("");
      }
    );
    // this.setState({ isLoading: true });
    // this.getReportList('');
  };

  // OpenReportDetail = (item) => {
  //   //Alert.alert(item.key,item.title);
  //   this.props.navigation.navigate('MyReportGraphscreen');
  //   console.log('OpenReportDetail calllll==============================');
  // };

  removeDuplicate = (datalist) => {
    // console.log(
    //   "remove duplicate ",
    //   datalist.filter(function (a) {
    //     !this[a.ReportId] && (this[a.ReportId] = true);
    //   }, Object.create(null))
    // );
    filtered = datalist.filter(function (a) {
      if (!this[a.ReportId]) {
        this[a.ReportId] = true;
        return true;
      }
    }, Object.create(null));

    // console.log(filtered, "duplicate///////");
    return datalist.filter(function (a) {
      return !this[a.ReportId] && (this[a.ReportId] = true);
    }, Object.create(null));
  };

  //ReportId

  // handleSelectionMultiple = (id) => {
  //   console.log("Shard report id ==============================", id);
  //   var selectedIds = [...this.state.selectedIds]; // clone state
  //   if (selectedIds.includes(id.SharedReportId))
  //     selectedIds = selectedIds.filter((_id) => _id !== id);
  //   else selectedIds.push(id);
  //   this.setState({ selectedIds, selectedId: id.ReportId });
  //   // if (this.state.selectedId == id.ReportId) {
  //   //   this.setState({ selectedId: '' });
  //   // } else {
  //   //   this.setState({
  //   //     selectedId: id.ReportId,
  //   //     SharedReportId: id.SharedReportId,
  //   //   });
  //   // }
  // };

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
    console.log(selectedIdswithflag, "Flag");
  };

  updateStatus = async (empty) => {
    this.setState({ isLoading: true });

    // console.log(
    //   "selectedId ",
    //   this.state.selectedId,
    //   "selectedId array",
    //   this.state.selectedIds
    // );
    let normalids = [],
      oldreportids = [];
    const myObjStr = this.state.selectedIds.toString();
    this.state.selectedIdswithflag.map((item) => {
      if (item.flag == "OldReport") {
        oldreportids.push(item.id);
      } else {
        normalids.push(item.id);
      }
    });
    let tonormaids = normalids.toString();
    let oldids = oldreportids.toString();
    // console.log(tonormaids, "-----normal ids");
    // console.log(oldids, "=====old ids");
    if (normalids.length > 0 && oldreportids.length > 0) {
      this.setState({ isLoading: true });
      try {
        let response = await axios.post(Constants.DOCDASH_UPDATEREPORTSTATUS, {
          ReportId: tonormaids,
          Status: updatestatus,
        });
        let oldrepots = await axios.post(
          Constants.DOCDASH_UPDATE_OLDREPORTSTATUS,
          {
            Status: updatestatus,
            ReportId: oldids,
          }
        );

        // console.log("data==============", response.data);
        this.setState({ isLoading: false });

        if (response.data.Status && oldrepots.data.Status) {
          Toast.show(response.data.Msg);
          this.setState(
            { refreshing: true, AllReportList: [], pageNo: 1 },
            () => {
              this.getReportList();
              this.props.navigation.navigate("PatientDashboard", {
                refresh: true,
              });
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
    } else if (normalids.length == 0 && oldreportids.length > 0) {
      this.setState({ isLoading: true });
      try {
        let oldrepots = await axios.post(
          Constants.DOCDASH_UPDATE_OLDREPORTSTATUS,
          {
            Status: updatestatus,
            ReportId: oldids,
          }
        );

        // console.log("data==============", response.data);
        this.setState({ isLoading: false });

        if (oldrepots.data.Status) {
          Toast.show(oldrepots.data.Msg);
          this.setState(
            { refreshing: true, AllReportList: [], pageNo: 1 },
            () => {
              this.getReportList();
              this.props.navigation.navigate("PatientDashboard", {
                refresh: true,
              });
            }
          );
        } else {
          Toast.show(oldrepots.data.Msg);
          this.setState({ isLoading: false });
        }
      } catch (errors) {
        Toast.show("Something Went Wrong, Please Try Again Later");

        ///Toast.show(errors)

        this.setState({ isLoading: false });
        console.log(errors);
      }
    } else if (normalids.length > 0 && oldreportids.length == 0) {
      this.setState({ isLoading: true });
      try {
        let response = await axios.post(Constants.DOCDASH_UPDATEREPORTSTATUS, {
          ReportId: tonormaids,
          Status: updatestatus,
        });

        this.setState({ isLoading: false });

        if (response.data.Status) {
          Toast.show(response.data.Msg);
          this.setState(
            { refreshing: true, AllReportList: [], pageNo: 1 },
            () => {
              this.getReportList();
              this.props.navigation.navigate("PatientDashboard", {
                refresh: true,
              });
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
    //DOCDASH_UPDATEREPORTSTATUS integrate here
    // try {
    //   let response = await axios.post(Constants.DOCDASH_UPDATEREPORTSTATUS, {
    //     // ReportId: this.state.selectedId,
    //     // change to below
    //     // ReportId: this.state.SharedReportId,
    //     ReportId: myObjStr,
    //     Status: updatestatus,
    //   });

    //   // console.log('Updated report statusdata==============', response.data);
    //   this.setState({ loading: false });

    //   if (response.data.Status) {
    //     Toast.show(response.data.Msg);
    //     this.getReportList();
    //     this.props.navigation.navigate("PatientDashboard", { refresh: true });
    //   } else {
    //     Toast.show(response.data.Msg);
    //     this.setState({ isLoading: false });
    //   }
    // } catch (errors) {
    //   ///Toast.show(errors)

    //   this.setState({ isLoading: false });

    //   console.log(errors);
    // }
  };

  getReportList = async (empty) => {
    // console.log(
    //   "pageNumber:",
    //   this.state.pageNo,
    //   " pageSize:",
    //   Constants.PER_PAGE_RECORD,
    //   "Searching:",
    //   this.state.searchString,
    //   "loaded page:",
    //   this.state.loadedPage
    // );
    if (empty) {
      // console.log("**************")
      this.setState({ AllReportList: [] });
    }

    try {
      let response = await axios.post(Constants.DOCDASH_STATUSSHAREREPORT, {
        Status: status,
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString,
      });
      let oldreportresponse = await axios.post(
        Constants.DOCDASH_OLDSTATUSSHAREREPORT,
        {
          Status: status,
          pageNumber: this.state.pageNo,
          pageSize: Constants.PER_PAGE_RECORD,
          Searching: this.state.searchString,
        }
      );
      // console.log(
      //   "data==============",
      //   response.data,
      //   response.data.TotalCount
      // );
      // console.log("000000000data==============", oldreportresponse.data.Status);
      this.setState({
        loading: false,
        loadedPage: response.data.CurrentPage,
      });

      if (response.data.Status) {
        let responseData = this.state.AllReportList;
        // let responseData = [];
        if (oldreportresponse.data.Status) {
          oldreportresponse.data.ReportList.map((old) => {
            responseData.push(old);
          });
        }
        response.data.ReportList.map((item) => {
          responseData.push(item);
        });
        // const desendingsortarrydata = responseData.sort(function (a, b) {
        //   a = a.TestDate.split("/");
        //   b = b.TestDate.split("/");
        //   return b[2] - a[2] || b[1] - a[1] || b[0] - a[0];
        // });

        const sortedArray = responseData.sort(
          (a, b) =>
            moment(b.SharedDate).format("YYYYMMDD") -
            moment(a.SharedDate).format("YYYYMMDD")
        );

        // console.log(sortedArray, "=====sorted");
        this.setState({
          AllReportList: this.removeDuplicate(sortedArray),
          // chaned
          // AllReportList: responseData,
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false,
        });
      } else {
        if (oldreportresponse.data.Status) {
          let responseData = this.state.AllReportList;

          oldreportresponse.data.ReportList.map((old) => {
            responseData.push(old);
          });
          const sortedArray = responseData.sort(
            (a, b) =>
              moment(b.SharedDate).format("YYYYMMDD") -
              moment(a.SharedDate).format("YYYYMMDD")
          );
          this.setState({
            AllReportList: this.removeDuplicate(sortedArray),
            // chaned
            // AllReportList: responseData,
            isLoading: false,
            paginationLoading: false,
            searchLoading: false,
            refreshing: false,
          });
        } else {
          //Toast.show(response.data.Msg)
          this.setState({
            isLoading: false,
            paginationLoading: false,
            searchLoading: false,
            refreshing: false,
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
        refreshing: false,
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
        this.getReportList();
      }
    );
  };

  onChangeTextClick = async (val) => {
    // console.log("======", val);
    this.setState(
      { searchString: val, AllReportList: [], pageNo: 1, searchLoading: true },
      () => {
        this.getReportList(true);
      }
    );
  };

  onRefresh = async () => {
    this.setState({ refreshing: true, AllReportList: [], pageNo: 1 }, () => {
      this.getReportList();
    });
  };

  onPending = () => {
    // console.log("onPending=================");
    updatestatus = "Pending";
    const myObjStr = this.state.selectedIds.toString();
    if (this.state.selectedIds.length == 0) {
      Toast.show("Please Select Test");
    } else {
      this.setState({ selectedId: myObjStr });
      this.updateStatus();
    }
  };

  onHolding = () => {
    // console.log("onHolding=================");
    updatestatus = "On Hold";
    // console.log("*****ProcProceed callllllll==============================");
    const myObjStr = this.state.selectedIds.toString();

    // console.log(
    //   "&&&&&Proceed Report status updare  ==============================",
    //   myObjStr,
    //   typeof myObjStr
    // );
    if (this.state.selectedIds.length == 0) {
      Toast.show("Please Select Test");
    } else {
      this.setState({ selectedId: myObjStr });
      this.updateStatus();
    }
  };

  onComplete = () => {
    updatestatus = "Complete";
    const myObjStr = this.state.selectedIds.toString();
    if (this.state.selectedIds.length == 0) {
      Toast.show("Please Select Test");
    } else {
      this.setState({ selectedId: myObjStr });
      this.updateStatus();
    }
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

  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  backbtnPress = () => {
    var role = AsyncStorage.getItem(Constants.ACCOUNT_ROLE);
    this.props.navigation.navigate("PatientDashboard", {
      refresh: "refresh",
      role: role,
    });
  };

  OpenReportDetail = (index) => {
    let labinfo = this.state.AllReportList[index];
    // let pendingReportinfo = this.state.PendingRequestList[index];

    // console.log(
    //   "====================================Open report details",
    //   index,
    //   labinfo.ReportId,

    //   "...",
    //   labinfo
    // );
    if (labinfo.ReportId > 0) {
      this.props.navigation.navigate("MyReportGraphscreen", {
        ReportId: labinfo.ReportId,
        labinfo: labinfo,
        from: "Doctor",
      });
    }
  };
  render() {
    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="Reports Status"
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
                shadowOpacity: 0.7,
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
                {this.state.AllReportList.map((item, index) => (
                  <View
                    style={{
                      flex: 1,
                      padding: 1,
                      marginLeft: 5,
                      marginRight: 5,
                      marginTop: 10,
                      marginBottom: 5,
                      // borderRadius: 5,
                      backgroundColor: "white",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.OpenReportDetail(index)}
                    >
                      <View style={styles.container}>
                        <View
                          // style={styles.photo}
                          style={{
                            height: 50,
                            width: 50,
                            borderRadius: 25,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 10,
                          }}
                        >
                          <ImageLoad
                            source={{
                              uri: Constants.PROFILE_PIC + item.ProfilePic,
                            }}
                            // style={styles.photo}
                            style={{
                              height: 50,
                              width: 50,
                              borderRadius: 25,
                            }}
                            placeholderSource={require("../../icons/Placeholder.png")}
                            placeholderStyle={{
                              height: 50,
                              width: 50,
                              borderRadius: 25,
                            }}
                            borderRadius={25}
                          />
                        </View>
                        <View style={styles.container_text}>
                          <View style={styles.titlesubview}>
                            <View
                              style={[
                                styles.DRnamesubview,
                                { flexDirection: "column" },
                              ]}
                            >
                              <Text style={styles.title} numberOfLines={1}>
                                {item.PatientName}
                              </Text>
                            </View>

                            <View style={styles.sharebtnview}>
                              <TouchableOpacity
                                style={styles.SuggestTesttouch}
                                onPress={
                                  () =>
                                    this.handleSelectionMultiple(
                                      item.SharedReportId,
                                      item.Flag
                                    )
                                  // this.handleSelectionMultiple(item)
                                }
                              >
                                <Image
                                  source={
                                    // this.state.selectedId == item.ReportId
                                    this.state.selectedIds.includes(
                                      item.SharedReportId
                                    )
                                      ? require("../../icons/checkbox.png")
                                      : require("../../icons/checkbox_1.png")
                                  }
                                  //source = {{uri:'https://reactnative.dev/img/tiny_logo.png'}}
                                  style={styles.Icons}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <View style={styles.DRnamesubview}>
                            <Image
                              source={require("../../icons/tests-1.png")}
                              style={styles.Icons}
                            />
                            <Text style={styles.description}>
                              {item.TestName}
                            </Text>
                          </View>
                          <View style={styles.Mobilesubview}>
                            <TouchableOpacity style={styles.touchable}>
                              <Image
                                source={require("../../icons/calenadr.png")}
                                //source = {{uri:'https://reactnative.dev/img/tiny_logo.png'}}
                                style={styles.Icons}
                              />
                            </TouchableOpacity>
                            <Text style={styles.description}>
                              {moment(item.SharedDate).format(
                                "DD MMMM YY, hh:mm A"
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <View
                      style={{
                        height: 0.5,
                        backgroundColor: "lightgray",
                        marginLeft: 15,
                        marginRight: 15,
                        marginTop: 2,
                        padding: 0.5,
                      }}
                    ></View>
                  </View>
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
        {/* {this.state.selectedId != '' && status == 'Pending' ? ( */}
        {this.state.selectedIds.length != 0 && status == "Pending" ? (
          <View
            style={{
              height: 50,
              backgroundColor: "white",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              marginLeft: 0,
              marginRight: 0,
            }}
          >
            <TouchableOpacity
              style={{
                height: 50,
                width: "50%",
                backgroundColor: "#275BB4",
                justifyContent: "center",
              }}
              onPress={this.onHolding}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 15,
                  color: "white",
                }}
              >
                Mark as On Hold
              </Text>
            </TouchableOpacity>
            <View
              style={{ height: 50, width: 1, backgroundColor: "white" }}
            ></View>

            <TouchableOpacity
              style={{
                height: 50,
                width: "50%",
                backgroundColor: "#275BB4",
                justifyContent: "center",
              }}
              onPress={this.onComplete}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 15,
                  color: "white",
                }}
              >
                Mark as Complete
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* {this.state.selectedId != '' && status == 'On Hold' ? ( */}
        {this.state.selectedIds.length != 0 && status == "On Hold" ? (
          <View
            style={{
              height: 50,
              backgroundColor: "white",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              marginLeft: 0,
              marginRight: 0,
            }}
          >
            <TouchableOpacity
              style={{
                height: 50,
                width: "50%",
                backgroundColor: "#275BB4",
                justifyContent: "center",
              }}
              onPress={this.onPending}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 15,
                  color: "white",
                }}
              >
                Mark as Pending
              </Text>
            </TouchableOpacity>
            <View
              style={{ height: 50, width: 1, backgroundColor: "white" }}
            ></View>

            <TouchableOpacity
              style={{
                height: 50,
                width: "50%",
                backgroundColor: "#275BB4",
                justifyContent: "center",
              }}
              onPress={this.onComplete}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 15,
                  color: "white",
                }}
              >
                Mark as Complete
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* {this.state.selectedId != '' && status == 'Complete' ? ( */}
        {this.state.selectedIds.length != 0 && status == "Complete" ? (
          <View
            style={{
              height: 50,
              backgroundColor: "white",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              marginLeft: 0,
              marginRight: 0,
            }}
          >
            <TouchableOpacity
              style={{
                height: 50,
                width: "50%",
                backgroundColor: "#275BB4",
                justifyContent: "center",
              }}
              onPress={this.onHolding}
            // onPress={this.onComplete}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 15,
                  color: "white",
                }}
              >
                Mark as On Hold
              </Text>
            </TouchableOpacity>
            <View
              style={{ height: 50, width: 1, backgroundColor: "white" }}
            ></View>
            <TouchableOpacity
              style={{
                height: 50,
                width: "50%",
                backgroundColor: "#275BB4",
                justifyContent: "center",
              }}
              onPress={this.onPending}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 15,
                  color: "white",
                }}
              >
                Mark as Pending
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
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
    // elevation: 2,
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
    //  backgroundColor: '#003484',
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
    height: 18,
    width: 18,
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
