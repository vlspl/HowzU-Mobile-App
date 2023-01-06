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
  RefreshControl
} from "react-native";
import Constants from "../utils/Constants";
import DocDashTabs from "../appComponents/DocDashTabs";
import DocDashSuggestTest from "../appComponents/DocDashSuggestTest";
import DocDashSharedReport from "../appComponents/DocDashSharedReport";
import axios from "axios";
import moment from "moment";
const Rijndael = require("rijndael-js");
import Loader from "../appComponents/loader";
global.Buffer = global.Buffer || require("buffer").Buffer;
import Toast from "react-native-tiny-toast";

export default class DoctordashboardComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportstatus: [],
      patientcount: [],
      pendingcount: "",
      onhold: "",
      complete: "",
      patientno: "",
      suggestedno: "",
      sharedno: "",
      sharedreportlist: [],
      suggestedtestlist: []
    };
  }

  componentDidMount = () => {
    // console.log('===========Doc Dash Component', this.props);
    // this.props.remove();
    this.GetDashboardAPicall();
  };

  componentWillUnmount() {
    this.GetDashboardAPicall();
    // this._unsubscribe();
  }
  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   ' Doc Dash  UNSAFE_componentWillReceiveProps ==============================',
    //   nextProp
    // );

    this.GetDashboardAPicall();
  };

  OpenReportDetail = (index) => {
    let labinfo = this.state.sharedreportlist[index];
    // let pendingReportinfo = this.state.PendingRequestList[index];

    //  console.log (
    //     '====================================Open report details',
    //     index,
    //     labinfo.ReportId,

    //     this.state.sharedreportlist
    //   );
    if (labinfo.ReportId > 0) {
      this.props.navigation.navigate("MyReportGraphscreen", {
        ReportId: labinfo.ReportId,
        from: "Doctor",
        labinfo: labinfo,
        viewedit: true
      });
    } else {
    }
  };

  onPressMyPatients = () => {
    // console.log('on PressMyPatients=================');
    this.props.navigation.navigate("MyPatients", { refresh: true });
  };

  Decrypt = (encryptStr) => {
    const cipher = new Rijndael("1234567890abcder", "cbc");
    const plaintext = Buffer.from(
      cipher.decrypt(new Buffer(encryptStr, "base64"), 128, "1234567890abcder")
    );

    return plaintext.toString();
  };
  onPressMySuggested = () => {
    // console.log('on Doc Suggested Test=================');
    this.props.navigation.navigate("DocDashSuggestedList");
  };

  onPressMyShared = () => {
    // console.log('on PressMyDoctor=================');
    this.props.navigation.navigate("DocDashSharedList", { refresh: true });
  };

  // Onpress Pending
  onPending = () => {
    // console.log('On pending status=================');
    //this.props.navigation.navigate("ShareReportstatus")
    this.props.navigation.navigate("SharedReportstatus", { status: "Pending" });
  };
  onHolding = () => {
    // console.log('On holdstatus=================');
    this.props.navigation.navigate("SharedReportstatus", { status: "On Hold" });
  };

  onComplete = () => {
    // console.log("ShareReportstatus=================");
    this.props.navigation.navigate("SharedReportstatus", {
      status: "Complete"
    });
  };

  async GetDashboardAPicall() {
    // console.log("GetDashboardAPicall =================");

    let DOC_REPORTSTATUS = Constants.DOC_REPORTSTATUS;
    let DOCDASH_COUNT = Constants.DOCDASH_COUNT; //It shows only counts
    let DOCDASH_SHAREREPORT = Constants.DOCDASH_SHAREREPORT;
    let DOCDASH_SUGGESTTEST = Constants.DOCDASH_SUGGESTTEST;
    let OLDDOCDASH_SHAREREPORT = Constants.DOCDASH_OLDSHAREREPORT_FORDASH;

    const requestOne = axios.get(DOC_REPORTSTATUS);
    const requestTwo = axios.get(DOCDASH_COUNT);
    const requestThree = axios.get(DOCDASH_SHAREREPORT);
    const requestFourth = axios.get(DOCDASH_SUGGESTTEST);

    const requestFifth = axios.get(OLDDOCDASH_SHAREREPORT);

    axios
      .all([requestOne, requestTwo, requestThree, requestFourth, requestFifth])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          const responesThree = responses[2];
          const responesFourth = responses[3];
          const responesFifth = responses[4];

          // console.log(responses, '*****all responses');
          // console.log(
          //   '1 st DOC_REPORTSTATUS =================',
          //   responseOne.data
          // );
          // console.log('2 st DOCDASH_COUNT =================', responseTwo.data);
          // console.log(
          //   '3 st DOCDASH_SHAREREPORT =================',
          //   responesThree.data
          // );
          // console.log(
          //   '4 st DOCDASH_SUGGESTTEST =================',
          //   responesFourth.data
          // );
          // console.log(
          //   "5 st GET_SUGGESTED_TEST =================",
          //   responesFifth.data
          // );
          this.setState({
            isLoading: false,
            refreshing: false,
            searchLoading: false
          });

          if (responseOne.data.Status) {
            // {"PendingReport":"0","OnHoldReport":"0","CompleteReport":"0","Status":true,"Msg":"Success"}
            // console.log('1 st response=================', responseOne.data);

            this.setState({
              pendingcount: responseOne.data.PendingReport,
              onhold: responseOne.data.OnHoldReport,
              complete: responseOne.data.CompleteReport
            });
          } else {
            // console.log('1 st response=================', responseOne.data.Msg);
          }

          if (responseTwo.data.Status) {
            ///{"PatientCount":"2","SharedReportCount":"0","SuggestedTestCount":"0","Status":true,"Msg":"Success"}
            // console.log('2 st response=================', responsetwo.data);

            this.setState({
              patientno: responseTwo.data.PatientCount,
              sharedno: responseTwo.data.SharedReportCount,
              suggestedno: responseTwo.data.SuggestedTestCount
            });
          } else {
            // console.log('2 st response=================', responsetwo.data.Msg);
          }
          // console.log(responesThree.data, 'Response shred report data');
          if (responesThree.data.Status) {
            // let responseData = this.state.sharedreportlist;

            let responseData = [];

            // console.log(
            //   "****************Shared =================",
            //   responesThree.data
            // );

            responesThree.data.ReportList.map((item) => {
              //console.log(item, "-----------");
              let tempp = {};
              tempp = item;
              // tempp.dateforsorting = moment(item.SharedDate).format(
              //   "DD/MM/YYYY"
              // );
              responseData.push(item);
            });

            if (responesFifth.data.Status) {
              responesFifth.data.ReportList.map((item) => {
                // console.log(item, "oldy-----------");
                let temp = {};
                temp = item;
                temp.Mobile = item.PatientMobile;
                temp.RecommendedDate = item.SharedDate;

                responseData.push(temp);
              });
            }
            // console.log(
            //   "****************Shared report st response=================",
            //   // responesThree.data,
            //   "reponsde data",
            //   responesFifth.data
            // );

            const sortedArray = responseData.sort(
              (a, b) =>
                moment(b.SharedDate).format("YYYYMMDD") -
                moment(a.SharedDate).format("YYYYMMDD")
            );
            // console.log(sortedArray);
            // console.log("*****desendin", sortedArray);
            this.setState({ sharedreportlist: sortedArray });
          } else {
            // console.log(
            //   "else shared report  response=================",
            //   responesThree.data.Msg
            // );
            let responseData = [];
            if (responesFifth.data.Status) {
              responesFifth.data.ReportList.map((item) => {
                //  console.log(item, "oldy-----------");
                let temp = {};
                temp = item;
                temp.Mobile = item.PatientMobile;
                temp.RecommendedDate = item.SharedDate;

                responseData.push(temp);
              });
              const sortedArray = responseData.sort(
                (a, b) =>
                  moment(b.SharedDate).format("YYYYMMDD") -
                  moment(a.SharedDate).format("YYYYMMDD")
              );
              this.setState({ sharedreportlist: sortedArray });
            } else {
              this.setState({ sharedreportlist: [] });
            }
          }

          if (responesFourth.data.Status) {
            // let responseData = this.state.suggestedtestlist;
            let responseData = [];

            responesFourth.data.SuggestTestList.map((item) => {
              responseData.push(item);
            });
            // console.log('4 st response=================', responesFourth.data);

            this.setState({ suggestedtestlist: responseData });
          } else {
            // console.log(
            //   '4 st response=================',
            //   responesFourth.data.Msg
            // );
            // this.setState({ suggestedtestlist: [] });
          }
        })
      )
      .catch((errors) => {
        // Toast.show("Something Went Wrong, Please Try Again Later");

        console.log(errors);
      });
  }
  onRefresh = async () => {
    this.setState({ refreshing: true, pageNo: 1, AllMyPatients: [] }, () => {
      this.GetDashboardAPicall();
    });
  };

  render() {
    const screenWidth = Math.round(Dimensions.get("window").width);
    // console.log(this.state.isLoading, 'doc comp render ');
    return (
      <View style={styles.MainContainer}>
        <Loader loading={this.state.isLoading} />

        <ScrollView
          alwaysBounceVertical={true}
          showsHorizontalScrollIndicator={false}
          style={{ backgroundColor: "white", marginTop: 0 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <View
            style={{
              flex: 3,
              flexDirection: "row",
              backgroundColor: "white",
              marginLeft: 5,
              marginRight: 0,
              padding: 0,
              height: screenWidth / 3,
              width: screenWidth - 10
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                width: screenWidth / 3,
                height: screenWidth / 3,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  height: screenWidth / 3 - 20,
                  width: screenWidth / 3 - 20,
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: "lightgray",
                  shadowOffset: { width: 2, height: 2 },
                  shadowColor: "lightgray",
                  shadowOpacity: 0.9,
                  borderRadius: 10,
                  margin: 10,
                  elevation: 5
                }}
              >
                <TouchableOpacity style={{ flex: 1 }} onPress={this.onPending}>
                  <View
                    style={{
                      flex: 0.95,
                      backgroundColor: "white",
                      justifyContent: "center",
                      borderTopRightRadius: 10,
                      borderTopLeftRadius: 10
                    }}
                  >
                    <Text
                      style={{
                        backgroundColor: "white",
                        alignSelf: "center",
                        fontSize: 40,
                        color: "#ffc200"
                      }}
                    >
                      {this.state.pendingcount}
                    </Text>
                    <Text
                      style={{
                        backgroundColor: "white",
                        alignSelf: "center",
                        fontSize: 14,
                        paddingTop: 5
                      }}
                    >
                      Pending
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0.05,
                      backgroundColor: "#ffc200",
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      marginBottom: 0
                    }}
                  ></View>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                width: screenWidth / 3,
                height: screenWidth / 3,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  height: screenWidth / 3 - 20,
                  width: screenWidth / 3 - 20,
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: "lightgray",
                  shadowOffset: { width: 2, height: 2 },
                  shadowColor: "lightgray",
                  shadowOpacity: 0.9,
                  borderRadius: 10,
                  margin: 10,
                  elevation: 5
                }}
              >
                <TouchableOpacity style={{ flex: 1 }} onPress={this.onHolding}>
                  <View
                    style={{
                      flex: 0.95,
                      backgroundColor: "white",
                      justifyContent: "center",
                      borderTopRightRadius: 10,
                      borderTopLeftRadius: 10
                    }}
                  >
                    <Text
                      style={{
                        backgroundColor: "white",
                        alignSelf: "center",
                        fontSize: 40,
                        color: "#ce0000"
                      }}
                    >
                      {this.state.onhold}
                    </Text>
                    <Text
                      style={{
                        backgroundColor: "white",
                        alignSelf: "center",
                        fontSize: 14,
                        paddingTop: 5
                      }}
                    >
                      On Hold
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0.05,
                      backgroundColor: "#ce0000",
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      marginBottom: 0
                    }}
                  ></View>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                width: screenWidth / 3,
                height: screenWidth / 3,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  height: screenWidth / 3 - 20,
                  width: screenWidth / 3 - 20,
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: "lightgray",
                  shadowOffset: { width: 2, height: 2 },
                  shadowColor: "lightgray",
                  shadowOpacity: 0.9,
                  borderRadius: 10,
                  margin: 10,
                  elevation: 5
                }}
              >
                <TouchableOpacity style={{ flex: 1 }} onPress={this.onComplete}>
                  <View
                    style={{
                      flex: 0.95,
                      backgroundColor: "white",
                      justifyContent: "center",
                      borderTopRightRadius: 10,
                      borderTopLeftRadius: 10
                    }}
                  >
                    <Text
                      style={{
                        backgroundColor: "white",
                        alignSelf: "center",
                        fontSize: 40,
                        color: "#00dd15"
                      }}
                    >
                      {this.state.complete}
                    </Text>
                    <Text
                      style={{
                        backgroundColor: "white",
                        alignSelf: "center",
                        fontSize: 14,
                        paddingTop: 5
                      }}
                    >
                      Complete
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0.05,
                      backgroundColor: "#00dd15",
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      marginBottom: 0
                    }}
                  ></View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "lightgray",
              alignContent: "center",
              justifyContent: "center",
              marginLeft: 10,
              marginRight: 15
            }}
          ></View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ backgroundColor: "transparent" }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: "transparent",
                marginLeft: 5
              }}
            >
              <DocDashTabs
                title="My Patients"
                img={require("../../icons/Shared-Report.png")}
                count={this.state.patientno}
                onPress={this.onPressMyPatients}
              ></DocDashTabs>
              <DocDashTabs
                title="Suggested tests"
                img={require("../../icons/Suggested-Test.png")}
                count={this.state.suggestedno}
                onPress={this.onPressMySuggested}
              ></DocDashTabs>
              <DocDashTabs
                title="Shared Reports"
                img={require("../../icons/Shared-Report.png")}
                count={this.state.sharedno}
                onPress={this.onPressMyShared}
              ></DocDashTabs>
            </View>
          </ScrollView>

          <View
            style={{
              flex: 1,
              height: 20,
              backgroundColor: "transparent",
              alignContent: "center",
              justifyContent: "center",
              marginTop: 8
            }}
          >
            <Text
              style={{
                textAlign: "left",
                backgroundColor: "transparent",
                fontSize: 14,
                fontWeight: "bold",
                marginLeft: 20,
                color: "#1c1c1c"
              }}
            >
              Shared Report
            </Text>
          </View>

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ backgroundColor: "transparent" }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: "transparent",
                marginLeft: 10
              }}
            >
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ backgroundColor: "transparent" }}
                onScroll={({ nativeEvent }) => {}}
              >
                {this.state.sharedreportlist.map((item, index) => (
                  <View key={index}>
                    <DocDashSharedReport
                      index={index}
                      patientname={item.PatientName}
                      mobile={this.Decrypt(item.Mobile)}
                      email={item.TestName}
                      date={moment(item.SharedDate).format(
                        "MMM DD YYYY hh:mm A"
                      )}
                      // date={item.RecommendedDate}
                      OpenReportDetail={() => this.OpenReportDetail(index)}
                    ></DocDashSharedReport>
                  </View>
                ))}
              </ScrollView>

              {this.state.sharedreportlist.length <= 0 &&
              !this.state.isLoading &&
              !this.state.searchLoading &&
              !this.state.refreshing ? (
                <Text
                  style={{
                    flex: 1,
                    margin: 10,
                    color: "gray",
                    textAlign: "left"
                  }}
                >
                  No Data Available in Shared Report!
                </Text>
              ) : null}
            </View>
          </ScrollView>

          <View
            style={{
              flex: 1,
              height: 20,
              backgroundColor: "transparent",
              alignContent: "center",
              justifyContent: "center",
              marginTop: 8
            }}
          >
            <Text
              style={{
                textAlign: "left",
                backgroundColor: "transparent",
                fontSize: 14,
                fontWeight: "bold",
                marginLeft: 22
              }}
            >
              Suggested Tests
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: "transparent",
              marginLeft: 10
            }}
          >
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ backgroundColor: "transparent" }}
              onScroll={({ nativeEvent }) => {}}
            >
              {this.state.suggestedtestlist.map((item, index) => (
                <View key={index}>
                  <DocDashSuggestTest
                    index={index}
                    testname={item.PatientName}
                    labname={item.LabName}
                    teststatus="Complete"
                    date={item.TestName}
                    date1={item.RecommendedDate}
                    lablogo={require("../../icons/Heart.png")}
                  ></DocDashSuggestTest>
                </View>
              ))}
            </ScrollView>
          </View>
          {this.state.suggestedtestlist.length <= 0 &&
          !this.state.isLoading &&
          !this.state.searchLoading &&
          !this.state.refreshing ? (
            <Text
              style={{ flex: 1, margin: 20, color: "gray", textAlign: "left" }}
            >
              No Data Available in Suggested Test!
            </Text>
          ) : null}

          <View
            style={{
              flex: 1,
              height: 25,
              backgroundColor: "transparent",
              alignContent: "center",
              justifyContent: "center",
              marginTop: 10
            }}
          ></View>
        </ScrollView>
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
  }
});
