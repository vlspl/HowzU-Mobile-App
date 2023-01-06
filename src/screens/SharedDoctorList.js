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
  ScrollView,
  RefreshControl,
  BackHandler
} from "react-native";
import { Container } from "native-base";

import CustomeHeader from "../appComponents/CustomeHeader";
import axios from "axios";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import Toast from "react-native-tiny-toast";
import PaginationLoading from "../appComponents/PaginationLoading";
import ImageLoad from "react-native-image-placeholder";
import moment from "moment";
import SharedReportRow from "../appComponents/SharedReportRow";
const Rijndael = require("rijndael-js");
global.Buffer = global.Buffer || require("buffer").Buffer;

var docID = "";
var docName = "";
var docImg = "";
var docEmail = "";
var docMobile = "";
export default class SharedDoctorList extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      selectedId: "",
      AllreportList: [],
      pageNo: 1,
      searchString: "",
      docId: "",
      docName: "",
      docEmail: "",
      docPhone: "",
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      selectedIdswithflag: [],
      selectedIds: []
    };
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          //width: "92%",
          backgroundColor: "gray",
          marginLeft: 15,
          marginRight: 15
        }}
      />
    );
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(nextProp, "Next Props ");
    // console.log(" suggest TEST list componentWillReceiveProps==============================",nextProp.route.params.docinfo.DoctorId);
    // console.log(" suggest TEST list componentWillReceiveProps==============================",nextProp.route.params.docinfo.DoctorName);
    this.setState({ docId: "", docName: "" });

    docID = nextProp.route.params.docinfo.DoctorId;
    docName = nextProp.route.params.docinfo.DoctorName;
    docImg = nextProp.route.params.docinfo.ProfilePic;
    docMobile = nextProp.route.params.docinfo.Mobile;
    docEmail = nextProp.route.params.docinfo.EmailId;
    //this.setState({docId: nextProp.route.params.docinfo.DoctorId,docName:nextProp.route.params.docinfo.DoctorName});
    //this.setState({patientId: nextProp.route.params.Patientinfo.UserId});

    this.setState(
      {
        selectedId: "",
        isLoading: true,
        AllreportList: [],
        selectedIdswithflag: [],
        selectedIds: []
      },
      () => {
        this.getSharedReport("");
      }
    );
  };

  // handleSelectionMultiple = (id) => {
  //   console.log("TestID==============================", id);

  //   if (this.state.selectedId == id) {
  //     this.setState({ selectedId: "" });
  //   } else {
  //     this.setState({ selectedId: id });
  //   }
  // };
  handleSelectionMultiple = (id, flag) => {
    console.log("Shard report id ==============================", id, flag);
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

  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return !this[a.SharedReportId] && (this[a.SharedReportId] = true);
    }, Object.create(null));
  };

  componentDidMount() {
    docID = this.props.route.params.docinfo.DoctorId;
    docName = this.props.route.params.docinfo.DoctorName;
    docImg = this.props.route.params.docinfo.ProfilePic;
    docMobile = this.props.route.params.docinfo.Mobile;
    docEmail = this.props.route.params.docinfo.EmailId;

    this.setState({
      isLoading: true,
      AllreportList: [],
      selectedIds: [],
      selectedIdswithflag: []
    });
    this.getSharedReport("");
    /// console.log("componentDidMount FOCUSSSSSSSS=====TestLIST==============================");
  }

  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  //handling onPress action
  getListViewItem = (item) => {
    Alert.alert(item.key, item.title);
  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 5;
  };

  callpagination = async () => {
    this.setState(
      { paginationLoading: true, pageNo: this.state.pageNo + 1 },
      () => {
        this.getSharedReport();
      }
    );
    // await this.setState({ })
  };

  onRefresh = async () => {
    this.setState(
      { refreshing: true, AllreportList: [], searchString: "", pageNo: 1 },
      () => {
        this.getSharedReport();
      }
    );
  };

  unsharePress = () => {
    this.setState({ isLoading: true });
    this.UnshareReportCall();
  };

  UnshareReportCall = async () => {
    console.log("bookingid ==============");
    let normalids = [],
      oldreportids = [];
    const myObjStr = this.state.selectedIds.toString();
    const withfalg = this.state.selectedIdswithflag.toString();
    this.state.selectedIdswithflag.map((item) => {
      if (item.flag == "OldReport") {
        oldreportids.push(item.id);
      } else {
        normalids.push(item.id);
      }
    });
    let tonormaids = normalids.toString();
    let oldids = oldreportids.toString();

    if (normalids.length > 0 && oldreportids.length > 0) {
      this.setState({ isLoading: true });
      try {
        let response = await axios.post(Constants.PATIENT_UNSHAREDREPORT, {
          ReportId: tonormaids
        });
        let oldrepots = await axios.post(Constants.PATIENT_UNSHARED_OLDREPORT, {
          ReportId: oldids
        });
        this.setState({ isLoading: false });

        if (response.data.Status && oldrepots.data.Status) {
          Toast.show(response.data.Msg);
          this.setState(
            {
              refreshing: true,
              selectedIds: [],
              selectedIdswithflag: [],
              AllReportList: [],
              pageNo: 1,
              isLoading: true,
              AllreportList: []
            },
            () => {
              this.getSharedReport();
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
        let oldrepots = await axios.post(Constants.PATIENT_UNSHARED_OLDREPORT, {
          ReportId: oldids
        });
        this.setState({ isLoading: false });

        if (oldrepots.data.Status) {
          Toast.show(oldrepots.data.Msg);
          this.setState(
            {
              refreshing: true,
              AllReportList: [],
              pageNo: 1,
              selectedIds: [],
              selectedIdswithflag: [],
              AllreportList: []
            },
            () => {
              this.getSharedReport();
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
    } else if (normalids.length > 0 && oldreportids.length == 0) {
      this.setState({ isLoading: true });
      try {
        let response = await axios.post(Constants.PATIENT_UNSHAREDREPORT, {
          ReportId: tonormaids
        });

        this.setState({ isLoading: false });

        if (response.data.Status) {
          Toast.show(response.data.Msg);
          this.setState(
            {
              refreshing: true,
              AllReportList: [],
              pageNo: 1,
              selectedIds: [],
              selectedIdswithflag: [],
              AllreportList: []
            },
            () => {
              this.getSharedReport();
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

  Decrypt = (encryptStr) => {
    const cipher = new Rijndael("1234567890abcder", "cbc");
    const plaintext = Buffer.from(
      cipher.decrypt(new Buffer(encryptStr, "base64"), 128, "1234567890abcder")
    );
    // console.log(
    //   'Decrypt  ====================================',
    //   plaintext.toString()
    // );
    return plaintext.toString();
  };

  getSharedReport = async () => {
    // this.setState({ isLoading: true,AllreportList: []  })
    // console.log("docId ======", docID);
    // console.log("docName ======", docName);

    try {
      let response = await axios.post(Constants.PATIENT_SHAREDREPORT, {
        DoctorId: docID,
        pageNumber: this.state.pageNo,
        pageSize: 10,
        Searching: ""
      });
      // PATIENT_SHARED_OLDREPORT
      let oldreportresponse = await axios.post(
        Constants.PATIENT_SHARED_OLDREPORT,
        {
          DoctorId: docID,
          pageNumber: this.state.pageNo,
          pageSize: 10,
          Searching: ""
        }
      );
      console.log("../../data==============", response.data);
      console.log("old data==============", oldreportresponse.data);

      this.setState({ isLoading: false });

      if (response.data.Status) {
        // Toast.show(response.data.Msg);
        let responseData = this.state.AllreportList;

        if (oldreportresponse.data.Status) {
          let temp = {};
          oldreportresponse.data.ReportList.map((item) => {
            temp = item;
            temp.newTestDate = moment(item.TestDate).format("DD/MM/YYYY");

            // oldreportsdata.push(item);
            responseData.push(temp);
          });
        }
        response.data.ReportList.map((item) => {
          // console.log(item, "normal");
          let temp1 = {};
          temp1 = item;
          temp1.newTestDate = moment(item.Date).format("DD/MM/YYYY");

          responseData.push(temp1);
        });
        const desendingsortarrydata = responseData.sort(function (a, b) {
          a = a.newTestDate.split("/");
          b = b.newTestDate.split("/");
          return b[2] - a[2] || b[1] - a[1] || b[0] - a[0];
        });
        this.setState({
          AllreportList: this.removeDuplicate(desendingsortarrydata),
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      } else {
        if (oldreportresponse.data.Status) {
          let responseData = this.state.AllreportList;

          let temp = {};
          oldreportresponse.data.ReportList.map((item) => {
            // console.log(
            //   item,
            //   ";;;;;;",
            //   moment(item.TestDate).format("DD MMM YY, hh:mm A"),
            //   ">>>>>>>>>oldreportresponse"
            // );
            temp = item;
            temp.newTestDate = moment(item.TestDate).format("DD/MM/YYYY");

            // oldreportsdata.push(item);
            responseData.push(temp);
          });
          const desendingsortarrydata = responseData.sort(function (a, b) {
            a = a.newTestDate.split("/");
            b = b.newTestDate.split("/");
            return b[2] - a[2] || b[1] - a[1] || b[0] - a[0];
          });
          this.setState({
            AllreportList: this.removeDuplicate(desendingsortarrydata),
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
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        refreshing: false
      });

      console.log(errors);
    }
  };

  backbtnPress = () => {
    // var role = AsyncStorage.getItem(Constants.ACCOUNT_ROLE);
    this.props.navigation.navigate("ShareReport", {
      refresh: true
    });
  };
  render() {
    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="Shared Reports"
          headerId={1}
          navigation={this.props.navigation}
        />
        {/* <CustomeHeader
          title="Shared Reports"
          headerId={2}
          navigation={this.props.navigation}
          onPressback={this.backbtnPress}
        /> */}

        <View style={{ flexDirection: "column", flex: 1 }}>
          <View style={{ flexDirection: "row", backgroundColor: "white" }}>
            <View
              style={{
                flex: 1,
                height: 90,
                flexDirection: "row",
                padding: 5,
                marginLeft: 15,
                marginRight: 15,
                marginTop: 6,
                marginBottom: 6,
                borderRadius: 5,
                backgroundColor: "white"
              }}
            >
              <View
                style={{
                  height: 68,
                  width: 68,

                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <View style={styles.photo}>
                  <ImageLoad
                    source={{ uri: Constants.PROFILE_PIC + docImg }}
                    style={styles.photo}
                    placeholderSource={require("../../icons/Placeholder.png")}
                    placeholderStyle={styles.placeholder}
                    borderRadius={34}
                  ></ImageLoad>
                </View>
              </View>
              <View style={styles.container_text}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    backgroundColor: "white",
                    height: 70
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      backgroundColor: "white",
                      height: 50
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 16,
                        color: "#000",
                        flexDirection: "row",
                        marginRight: 10,
                        fontWeight: "bold",
                        height: 50
                      }}
                    >
                      {docName}
                    </Text>
                  </View>
                  <View style={styles.sharebtnview}>
                    <TouchableOpacity style={styles.SuggestTesttouch}>
                      <Image style={styles.Icons} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ flex: 1, flexDirection: "row", paddingTop: 0 }}>
                  <TouchableOpacity style={styles.touchable}>
                    <Image
                      source={require("../../icons/call.png")}
                      style={{ height: 15, width: 15, marginTop: 0 }}
                    />
                  </TouchableOpacity>
                  <Text style={styles.description}>
                    {this.Decrypt(docMobile)}
                  </Text>
                </View>
                <View style={styles.emailsubview}>
                  <View
                    style={{
                      backgroundColor: "white",
                      flexDirection: "row",
                      flex: 1
                    }}
                  >
                    <TouchableOpacity style={styles.touchable}>
                      <Image
                        source={require("../../icons/email-1.png")}
                        //source = {{uri:'https://reactnative.dev/img/tiny_logo.png'}}
                        style={styles.Iconsemail}
                      />
                    </TouchableOpacity>

                    <Text style={styles.email}>{this.Decrypt(docEmail)}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              height: 0.5,
              marginLeft: 15,
              marginRight: 15,
              marginBottom: 0,
              backgroundColor: "gray",
              padding: 0.5
            }}
          ></View>

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
                  // colors='red'
                />
              }
            >
              {this.state.AllreportList.map((item, index) => {
                return (
                  <SharedReportRow
                    testname={item.TestName}
                    TestSubtitle={item.newTestDate}
                    // TestSubtitle={moment(item.TestDate).format("DD/MM/YYYY")}
                    // TestSubtitle={moment(item.TestDate).format("DD MMM YYYY ")}
                    // viewreport={"Details"}
                    // onPressCheckStatus={() => this.OpenReportDetail(index)}
                    checkbox={
                      this.state.selectedIds.includes(item.SharedReportId)
                        ? require("../../icons/checkbox.png")
                        : require("../../icons/checkbox_1.png")
                    }
                    onPress={() =>
                      this.handleSelectionMultiple(
                        item.SharedReportId,
                        item.Flag
                      )
                    }
                  ></SharedReportRow>
                  // <View style={{ flex: 1, flexDirection: "column" }}>
                  //   <TouchableOpacity
                  //     // style={styles.SuggestTesttouch}
                  //     onPress={() =>
                  //       this.handleSelectionMultiple(
                  //         item.SharedReportId,
                  //         item.Flag
                  //       )
                  //     }
                  //   >
                  //     <View style={styles.container}>
                  //       <View
                  //         style={{ height: 50, width: 50, borderRadius: 25 }}
                  //       >
                  //         <Image
                  //           source={require("../../icons/tests-1.png")}
                  //           style={{ height: 50, width: 50, borderRadius: 25 }}
                  //         />
                  //       </View>
                  //       <View style={styles.container_text}>
                  //         <View style={styles.titlesubview}>
                  //           <View style={styles.DRnamesubview}>
                  //             <Text style={styles.title}>{item.TestName}</Text>
                  //           </View>
                  //           <View style={styles.sharebtnview}>
                  //             <TouchableOpacity
                  //               style={styles.SuggestTesttouch}
                  //               onPress={() =>
                  //                 this.handleSelectionMultiple(
                  //                   item.SharedReportId,
                  //                   item.Flag
                  //                 )
                  //               }
                  //             >
                  //               <Image
                  //                 source={
                  //                   this.state.selectedId == item.SharedReportId
                  //                     ? require("../../icons/checkbox.png")
                  //                     : require("../../icons/checkbox_1.png")
                  //                 }
                  //                 style={styles.Icons}
                  //               />
                  //             </TouchableOpacity>
                  //           </View>
                  //         </View>
                  //         <View style={styles.Mobilesubview}>
                  //           <TouchableOpacity style={styles.touchable}>
                  //             <Image
                  //               source={require("../../icons/calenadr.png")}
                  //               //source = {{uri:'https://reactnative.dev/img/tiny_logo.png'}}
                  //               style={styles.Icons}
                  //             />
                  //           </TouchableOpacity>
                  //           <Text style={styles.description}>
                  //             {moment(item.Date).format(" DD MMMM YY hh:mm A")}
                  //           </Text>
                  //         </View>
                  //       </View>
                  //     </View>
                  //   </TouchableOpacity>
                  //   <View
                  //     style={{
                  //       height: 0.5,
                  //       backgroundColor: "lightgray",
                  //       marginLeft: 15,
                  //       marginRight: 15,
                  //       marginTop: 2,
                  //       padding: 0.5,
                  //     }}
                  //   ></View>
                  // </View>
                );
              })}

              <View>
                {this.state.paginationLoading ? <PaginationLoading /> : null}
              </View>
              <View style={{ flex: 1, height: 100 }}>
                {this.state.searchLoading ? (
                  <Loader loading={this.state.isLoading} />
                ) : null}
              </View>
              {this.state.AllreportList.length <= 0 &&
              !this.state.isLoading &&
              !this.state.searchLoading &&
              !this.state.refreshing ? (
                <NoDataAvailable onPressRefresh={this.onRefresh} />
              ) : null}
            </ScrollView>
          </View>
          {this.state.selectedIds != "" ? (
            <TouchableOpacity onPress={this.unsharePress}>
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
                  Unshare Report
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  containermain: {
    flex: 1,
    marginTop: 1,
    backgroundColor: "white",
    flexDirection: "column"
  },
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 5,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 6,
    marginBottom: 6,
    borderRadius: 5,
    backgroundColor: "white"
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
    marginLeft: 20,
    justifyContent: "center",
    backgroundColor: "white"
  },
  description: {
    fontSize: 13,
    marginTop: 4,
    color: "#595858",
    marginLeft: 6
    /// backgroundColor: 'gray',
  },
  suggestbtnTitle: {
    // flex:1,
    fontSize: 9,
    marginLeft: 5,
    paddingRight: 0,
    color: "white",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
  },
  photo: {
    height: 60,
    width: 60,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "white",
    shadowOpacity: 0.7,
    borderWidth: 0,
    borderRadius: 34
    // height: 60,
    // width: 60,
    // borderWidth: 0,
    // borderRadius: 34,
  },
  email: {
    fontSize: 13,
    //fontStyle: 'italic',
    marginTop: 4,
    color: "#595858",
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
    //flex:1,
    height: 20,
    marginTop: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end"
  },

  titlesubview: {
    flex: 1,
    flexDirection: "row",
    //alignSelf: 'flex-end',
    backgroundColor: "white"
  },

  DRnamesubview: {
    flex: 1,
    flexDirection: "row",
    //alignSelf: 'flex-end',
    backgroundColor: "white"
  },
  sharebtnview: {
    //flex: 0.15,
    //flexDirection: 'row',
    alignSelf: "flex-start",
    height: 22,
    width: 22,
    marginTop: 0
    // paddingTop: 0,
    // backgroundColor: '#003484',
    // borderRadius: 11
  },

  Reportview: {
    //flex: 0.40,
    flexDirection: "row",
    alignSelf: "flex-end",
    height: 22,
    width: 100,
    marginLeft: 10,
    // paddingTop: 0,
    backgroundColor: "#003484",
    borderRadius: 11
  },

  Mobilesubview: {
    flex: 1,
    flexDirection: "row",
    marginTop: 2
    // alignSelf: 'flex-end',
  },
  Icons: {
    height: 18,
    width: 18,
    marginTop: 0,
    paddingTop: 0
  },
  Iconsemail: {
    height: 15,
    width: 15,
    marginTop: 0
  },

  eyeicon: {
    height: 15,
    width: 15,
    marginTop: 0,
    paddingLeft: 2
  },

  emailsubview: {
    flex: 1,
    flexDirection: "row",
    // alignSelf: 'flex-end',
    //justifyContent: 'space-between',
    // alignContent: 'flex-end',
    //marginTop:4,
    backgroundColor: "white"
  },

  DoctorProfile: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignContent: "flex-end",
    textAlign: "right",
    color: "black",
    fontSize: 11
  },

  Separator: {
    height: 0.5,
    backgroundColor: "gray",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10
  },
  placeholder: {
    height: 60,
    width: 60,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "white",
    shadowOpacity: 0.7,
    borderWidth: 0,
    borderRadius: 34
    // elevation: 5,
  }
});
