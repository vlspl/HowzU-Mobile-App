import React, { Component } from "react";
import axios from "axios";
import Constants from "../../utils/Constants";
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

import CustomeHeader from "../../appComponents/CustomeHeader";
import MyReportRow from "../../appComponents/MyReportRow";
import Loader from "../../appComponents/loader";
import NoDataAvailable from "../../appComponents/NoDataAvailable";
import PaginationLoading from "../../appComponents/PaginationLoading";
import moment from "moment";

class TechnicianReport extends Component {
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
      refreshing: false,
      repId: 0
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

  DeldReportDetail = (index) => {
    let labinfo = this.state.AllReportList[index];

    console.log("/////****$$$$%%%%5", labinfo.ReportId);

    this.setState({ repId: labinfo.ReportId }, () => {
      //this.updateRequestStatus();
      Alert.alert(
        "Are you sure you want to Remove this Member",
        "",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => this.deleteRep() }
        ],
        { cancelable: false }
      );
    });
  };

  async deleteRep() {
    console.log("requestId====", this.state.repId);
    this.setState({ isLoading: true });
    try {
      const response = await axios.post(
        Constants.DEL_TESTREP_BY_TECH + "ReportId=" + this.state.repId
      );
      console.log("response=======", response.data);
      this.setState({ isLoading: false });
      if (response.data.Status) {
        //Toast.show(response.data.Msg)

        // console.log(response.data.Msg);
        Toast.show(response.data.Msg);
        this.setState({ pageNo: 1, isLoading: true, AllReportList: [] }, () => {
          this.getSuggestedTest();
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
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        refreshing: false
      });

      console.log(error, "//////");
    }
  }
  OpenReportDetail = (index) => {
    let labinfo = this.state.AllReportList[index];

    if (labinfo.ReportId > 0) {
      // console.log("****$$$$%%%%5");
      this.props.navigation.navigate("TechView", {
        labinfo: labinfo
      });
    } else {
      Toast.show("Not  approved");
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
      let response = await axios.post(Constants.TECH_TEST_DONELIST, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString
      });

      this.setState({ isLoading: false });
      if (response.data.Status) {
        let responseData = this.state.AllReportList;

        // let responseData = [];
        this.setState({ loading: false });

        response.data.MyDetails.map((item) => {
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
  };

  render() {
    const { data, isLoading } = this.state;
    console.log(this.state.isLoading, "this.state.isLoading my reports ===");

    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="Test Done"
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
                source={require("../../../icons/search.png")}
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
                {this.state.AllReportList.map((item, index) => (
                  <View style={{ flex: 1 }} key={index}>
                    {/* <MyReportRow
                      labname={item.patientName == "" ? "" : item.patientName}
                      testname={item.TestName}
                      TestSubtitle={item.formatedTestDate}
                      btnShow="yes"
                      onPressCheckStatus={() => this.OpenReportDetail(index)}
                    ></MyReportRow> */}

                    <View style={{ flex: 1 }} key={index}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "column",
                          backgroundColor: "white"
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => this.OpenReportDetail(index)}
                        >
                          <View style={styles.container}>
                            <View style={styles.photo}>
                              {/* registered */}
                              <Image
                                source={require("../../../icons/tests-1.png")}
                                style={styles.photo}
                              />
                            </View>

                            <View style={styles.container_text}>
                              <View style={styles.titlesubview}>
                                <View style={styles.DRnamesubview}>
                                  <Text style={styles.title}>
                                    {item.patientName}
                                  </Text>
                                </View>
                              </View>

                              <View style={styles.Mobilesubview}>
                                <Text style={styles.description}>
                                  {item.TestName}
                                </Text>
                              </View>

                              <View style={styles.emailsubview}>
                                <TouchableOpacity style={styles.touchable}>
                                  <Image
                                    source={require("../../../icons/calenadr.png")}
                                    style={{ height: 15, width: 15 }}
                                  />
                                </TouchableOpacity>
                                <Text style={styles.description}>
                                  {item.formatedTestDate}
                                </Text>

                                <View style={styles.sharebtnview}>
                                  <TouchableOpacity
                                    style={styles.SuggestTesttouch}
                                    onPress={() => this.OpenReportDetail(index)}
                                  >
                                    <Text style={styles.suggestbtnTitle}>
                                      Detail
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                                <View
                                  style={{
                                    ...styles.sharebtnview,
                                    ...{
                                      marginLeft: 10,
                                      marginRight: 5,
                                      marginBottom: 10
                                    }
                                  }}
                                >
                                  <TouchableOpacity
                                    style={styles.SuggestTesttouch}
                                    onPress={() => this.DeldReportDetail(index)}
                                  >
                                    <Text style={styles.suggestbtnTitle}>
                                      Delete
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
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
                <NoDataAvailable onPressRefresh={this.onRefresh} />
              ) : null}
            </View>
          </View>
        </View>
      </Container>
    );
  }
}
export default TechnicianReport;
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
