import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Container } from "native-base";
import Toast from "react-native-tiny-toast";
import CustomeHeader from "../appComponents/CustomeHeader";
import axios from "axios";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import moment from "moment";
import call from "react-native-phone-call";
const Rijndael = require("rijndael-js");
global.Buffer = global.Buffer || require("buffer").Buffer;
const padder = require("pkcs7-padding");

var bookingid = "";

const CheckstatusItem = (props) => (
  <View
    style={{
      flexDirection: "row",
      // height: 70,
      backgroundColor: "white",
      width: 320
    }}
  >
    <View
      style={{
        height: 70,
        width: 25,
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "white"
        // backgroundColor: 'red',
      }}
    >
      <Image
        source={require("../../icons/tick-1.png")}
        style={{ height: 22, width: 22, marginTop: 10 }}
      />
      <View
        style={{
          height: 63,
          width: 1,
          marginTop: 0,
          backgroundColor: "green",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center"
        }}
      ></View>
    </View>
    <View
      style={{
        flexDirection: "column",
        padding: 0,
        marginLeft: 15,
        marginRight: 5,
        backgroundColor: "white",

        width: 300
      }}
    >
      <View
        style={{
          flex: 1
        }}
      >
        <Text
          style={{
            // flex: 1,
            margin: 0,
            fontSize: 15,
            fontWeight: "bold",
            color: "black"
            // backgroundColor: 'red',
          }}
        >
          {props.statusname}
        </Text>
        <Text
          style={{
            // flex: 1,
            margin: 0,
            color: "gray",
            backgroundColor: "white"
          }}
        >
          {props.date}
        </Text>
      </View>

      {props.reports.length > 0 && props.statusname == "Report generated" && (
        <View
          style={{
            padding: 0,

            paddingTop: 20
          }}
        >
          {props.reports.map((item, index) => (
            <>
              {item.ApprovalStatus == "Approved" ? (
                <>
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <TouchableOpacity
                      onPress={() => props.OpenReportDetail(index)}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <Image
                          source={require("../../icons/viewreport.png")}
                          style={styles.reportIcon}
                        />
                        <Text
                          style={{
                            fontSize: 11,
                            marginLeft: 5,
                            paddingRight: 0,
                            color: "blue",
                            textAlign: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "500",
                            color: "midnightblue",
                            textDecorationLine: "underline"
                          }}
                          numberOfLines={2}
                        >
                          View Report
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{ fontSize: 10, marginLeft: 0 }}
                    numberOfLines={2}
                  >
                    {index + 1}
                    {")."}
                    {item.TestName}
                  </Text>
                </>
              ) : (
                <>
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <View style={{ flexDirection: "row" }}>
                      <Image
                        source={require("../../icons/closered.png")}
                        style={{
                          height: 10,
                          width: 10,

                          paddingLeft: 2,
                          marginTop: 5
                        }}
                      />
                      <Text
                        style={
                          // styles.suggestbtnTitle,
                          {
                            fontSize: 11,
                            marginLeft: 5,
                            paddingRight: 0,
                            color: "blue",
                            textAlign: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "500",
                            color: "red",
                            textDecorationLine: "underline"
                          }
                        }
                        numberOfLines={2}
                      >
                        Report rejected by lab
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{ fontSize: 10, marginLeft: 0 }}
                    numberOfLines={2}
                  >
                    {index + 1}
                    {")."} {item.TestName}
                  </Text>
                  <Text
                    style={{ fontSize: 10, marginLeft: 10, marginTop: 5 }}
                    numberOfLines={2}
                  >
                    Lab Comments:
                    {item.Comment}
                  </Text>
                </>
              )}

              <View
                style={{
                  height: 0.5,
                  marginLeft: 15,
                  marginRight: 15,
                  marginBottom: 0
                }}
              ></View>
            </>
          ))}
        </View>
      )}
    </View>
  </View>
);

const UnCheckstatusItem = (props) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      // height: 70,
      backgroundColor: "white",
      width: 300
    }}
  >
    <View
      style={{
        height: 70,
        width: 25,
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "white"
      }}
    >
      <Image
        source={require("../../icons/tick-11.png")}
        style={{ height: 22, width: 22, marginTop: 10 }}
      />
      <View
        style={{
          height: 63,
          width: 1,
          marginTop: 0,
          backgroundColor: "gray",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center"
        }}
      ></View>
    </View>
    <View
      style={{
        flexDirection: "column",
        padding: 0,
        marginLeft: 15,
        marginRight: 5,
        width: 300
      }}
    >
      <View
        style={{
          flex: 1,
          margin: 5
        }}
      >
        <Text
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: "bold",
            color: "gray",
            backgroundColor: "white"
          }}
        >
          {props.statusname}
        </Text>
        <Text style={{ margin: 0, color: "gray", backgroundColor: "white" }}>
          {props.date}
        </Text>
      </View>

      {props.reports.length > 0 && props.statusname == "Report generated" && (
        <>
          <View
            style={{
              padding: 0,

              paddingTop: 20
            }}
          >
            {props.reports.map((item, index) => (
              <>
                {/* <View style={{ flexDirection: "row", marginTop: 10 }}> */}
                {item.ApprovalStatus == "Approved" ? (
                  <>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                      <TouchableOpacity
                        onPress={() => props.OpenReportDetail(index)}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <Image
                            source={require("../../icons/viewreport.png")}
                            style={styles.reportIcon}
                          />
                          <Text
                            style={{
                              fontSize: 11,
                              marginLeft: 5,
                              paddingRight: 0,
                              color: "blue",
                              textAlign: "center",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "500",
                              color: "midnightblue",
                              textDecorationLine: "underline"
                            }}
                            numberOfLines={2}
                          >
                            View Report
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={{ fontSize: 10, marginLeft: 0 }}
                      numberOfLines={2}
                    >
                      {index + 1}
                      {")."} {item.TestName}
                    </Text>
                  </>
                ) : (
                  <>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                      <View style={{ flexDirection: "row" }}>
                        <Image
                          source={require("../../icons/closered.png")}
                          // style={styles.reportIcon}
                          style={{
                            height: 10,
                            width: 10,
                            // marginTop: 0,
                            paddingLeft: 2,
                            marginTop: 5
                          }}
                        />
                        <Text
                          style={
                            // styles.suggestbtnTitle,
                            {
                              fontSize: 11,
                              marginLeft: 5,
                              paddingRight: 0,
                              color: "blue",
                              textAlign: "center",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "500",
                              color: "red",
                              textDecorationLine: "underline"
                            }
                          }
                          numberOfLines={2}
                        >
                          Report rejected by lab
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{ fontSize: 10, marginLeft: 0, marginTop: 5 }}
                      numberOfLines={2}
                    >
                      {index + 1}
                      {")."} {item.TestName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        marginLeft: 0,
                        marginTop: 5,
                        marginLeft: 10
                      }}
                      numberOfLines={2}
                    >
                      Lab Comments:
                      {item.Comment}
                    </Text>
                  </>
                )}

                <View
                  style={{
                    height: 0.5,
                    marginLeft: 15,
                    marginRight: 15,
                    marginBottom: 0
                  }}
                ></View>
              </>
            ))}
          </View>
        </>
      )}
    </View>
  </View>
);

export default class CheckStatus extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      eventarray: [],
      labname: "",
      testnames: "",
      testdate: "",
      bookingstatus: "",
      customeventarr: [],
      clickcount: 0,
      labcontact: "",
      bookingdate: "",
      timeslot: "",
      AppoinmentComment: ""
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
    // console.log(
    //   "Check status componentWillReceiveProps==============================",
    //   nextProp
    // );

    bookingid = nextProp.route.params.bookingid;
    this.setState({ isLoading: true, clickcount: 0 }, () => {
      this.CheckStatuscall();
    });
  };

  onPressRefresh = () => {
    this.setState({ isLoading: true }, () => {
      this.CheckStatuscall();
    });
  };

  componentDidMount = () => {
    bookingid = this.props.route.params.bookingid;
    this.setState({ isLoading: true }, () => {
      this.CheckStatuscall();
    });
  };

  CheckStatuscall = async () => {
    try {
      let response = await axios.post(Constants.TEST_STATUS + bookingid, {});
      // console.log(response.data.ReportArray, "//////Reporewcnbs ");

      this.setState({ isLoading: false });
      if (response.data.Status) {
        let temp = {};
        let res = [];
        // temp = response.data.ReportArray;
        response.data.ReportArray.map((item) => {
          temp = item;
          temp.Flag = "";
          res.push(temp);
        });
        this.setState({
          isLoading: false,
          bookingstatus: response.data.Bookstatus,
          labname: response.data.LabName,
          testnames: response.data.TestName,
          // testdate: response.data.BookingDate,
          testdate: response.data.TestDate,
          bookingdate: response.data.BookingDate,
          timeslot: response.data.TimeSlot,
          labcontact:
            response.data.Labcontact != null
              ? response.data.Labcontact != ""
                ? this.Decrypt(response.data.Labcontact)
                : ""
              : "",
          // testdate: response.data.TestDate,
          customeventarr: response.data.EventArray,
          reports: res,
          // reports: response.data.ReportArray,
          AppoinmentComment: response.data.AppoinmentComment
        });
      } else {
        // console.log(response.data.Msg);
        // Toast.show(response.data.Msg);
        this.setState({ isLoading: false });
      }
    } catch (errors) {
      Toast.show("Something went wrong,try again later");
      // Toast.show("Network Error,please try again later");
      this.setState({ isLoading: false });
      // console.log(errors, ".../.../../");
    }
  };

  Decrypt = (encryptStr) => {
    const cipher = new Rijndael("1234567890abcder", "cbc");
    const plaintext = Buffer.from(
      cipher.decrypt(new Buffer(encryptStr, "base64"), 128, "1234567890abcder")
    );
    const decrypted = padder.unpad(plaintext, 32);
    const clearText = decrypted.toString("utf8");
    // console.log(
    //   'Decrypt  ====================================',
    //   clearText,
    //   plaintext
    // );

    return clearText.toString();
  };
  backbtnPress = () => {
    this.props.navigation.goBack();
    // this.props.navigation.navigate('Appointments', {});
  };

  OpenReportDetail = (index) => {
    let labinfo = this.state.reports[index];
    // console.log(
    //   "====================================Open report details",
    //   index,
    //   labinfo
    // );
    if (labinfo.ReportId > 0) {
      this.props.navigation.navigate("MyReportGraphscreen", {
        ReportId: labinfo.ReportId,
        labinfo: labinfo
      });
    }
  };

  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  makeCalltoLab = () => {
    if (this.state.labcontact.length != 10) {
      alert("Please enter correct contact number");
      return;
    }

    const args = {
      number: this.state.labcontact,
      prompt: true
    };
    // Make a call
    call(args).catch(console.error);
  };
  render() {
    // console.log(this.state.isLoading, "dnskfndskfnsd");
    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          headerId={1}
          // onPressback={this.backbtnPress}
          title="Track Booking "
          navigation={this.props.navigation}
        />

        <View
          style={{ flexDirection: "column", flex: 1, backgroundColor: "white" }}
        >
          {this.state.isLoading == false && this.state.labname != "" && (
            <>
              <ScrollView>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    padding: 5,
                    marginLeft: 10,
                    marginRight: 10,
                    marginTop: 10,
                    marginBottom: 6
                  }}
                >
                  <View
                    style={{
                      height: 68,
                      width: 68,
                      shadowOffset: { width: 3, height: 3 },
                      shadowColor: "gray",
                      elevation: 5,
                      shadowOpacity: 0.7,
                      borderWidth: 0,
                      borderRadius: 34,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Image
                      source={require("../../icons/lab-1.png")}
                      style={{
                        height: 68,
                        width: 68,
                        borderWidth: 0,
                        borderRadius: 34
                      }}
                    />
                  </View>

                  <View style={styles.container_text}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        backgroundColor: "white"
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          backgroundColor: "white"
                        }}
                      >
                        <Text
                          style={{
                            flex: 1,
                            fontSize: 16,
                            color: "#000",
                            flexDirection: "row",
                            // marginRight: 10,
                            fontWeight: "bold"
                          }}
                        >
                          {this.state.labname}
                        </Text>
                      </View>
                      <View style={styles.sharebtnview}>
                        <TouchableOpacity style={styles.SuggestTesttouch}>
                          {this.state.bookingstatus == "Confirmed" && (
                            <Text
                              style={{
                                paddingRight: 0,
                                textAlign: "right",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                color: "midnightblue",

                                color: "green",
                                fontSize: 13
                              }}
                            >
                              {this.state.bookingstatus}
                            </Text>
                          )}
                          {this.state.bookingstatus == "Awaiting" && (
                            <Text
                              style={{
                                justifyContent: "flex-end",
                                flex: 1,
                                marginLeft: 5,
                                color: "orange",
                                fontSize: 13
                              }}
                            >
                              {" "}
                              {this.state.bookingstatus}
                            </Text>
                          )}
                          {this.state.bookingstatus == "Canceled" && (
                            <>
                              <Text
                                style={{
                                  flex: 1,
                                  color: "red",
                                  fontSize: 13,
                                  justifyContent: "flex-end"
                                }}
                              >
                                {" "}
                                {this.state.bookingstatus}
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                    {this.state.labcontact != "" && (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          marginTop: 7,
                          paddingTop: 0
                        }}
                      >
                        <TouchableOpacity
                          style={styles.touchable}
                          onPress={this.makeCalltoLab}
                        >
                          <Image
                            source={require("../../icons/call.png")}
                            style={{
                              height: 15,
                              width: 15
                              // marginTop: 1,
                              // marginLeft: 10,
                            }}
                          />
                        </TouchableOpacity>

                        <Text
                          style={{
                            marginLeft: 3,
                            marginRight: 10,
                            marginBottom: 5,
                            color: "#A9A9A9",
                            fontSize: 13.5
                          }}
                        >
                          {this.state.labcontact}
                        </Text>
                      </View>
                    )}
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        marginTop: 7,
                        paddingTop: 0
                      }}
                    >
                      <TouchableOpacity style={styles.touchable}>
                        <Image
                          source={require("../../icons/lab.png")}
                          style={{ height: 15, width: 15 }}
                        />
                      </TouchableOpacity>
                      <Text style={styles.description}>
                        {/* we are taking booking date and then changed to test date and froat also changesd */}
                        {/* {moment(this.state.testdate).format(
                        ' DD MMM YY, hh:mm A'
                      )} */}
                        {moment(this.state.testdate, "DD/MM/YYYY").format(
                          " DD MMM YYYY"
                        )}
                        ,{this.state.timeslot}
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
                        <Text style={styles.email}>{this.state.testnames}</Text>
                      </View>

                      <View style={styles.Reportview}>
                        <TouchableOpacity
                          style={styles.SuggestTesttouch}
                          onPress={this.onPressRefresh}
                        >
                          <Text style={styles.suggestbtnTitle}>Refresh</Text>
                        </TouchableOpacity>
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
                {this.state.bookingstatus == "Canceled" && (
                  <View
                    style={{
                      // flex: 0.1,
                      flex: 1,
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      flexDirection: "row",
                      marginLeft: 15,
                      marginRight: 5,
                      marginTop: 20,
                      marginBottom: 5
                    }}
                  >
                    <Text
                      style={{
                        color: "gray",
                        fontSize: 13,
                        fontWeight: "bold"
                        // color: "black",
                      }}
                    >
                      {this.state.AppoinmentComment != null
                        ? "Lab Comment: "
                        : null}
                    </Text>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        // flexDirection: "row",

                        marginRight: 5

                        // marginBottom: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: "red",
                          fontSize: 13,
                          marginRight: 15
                        }}
                      >
                        {this.state.AppoinmentComment != null
                          ? this.state.AppoinmentComment
                          : null}
                      </Text>
                    </View>
                  </View>
                )}
                {this.state.bookingstatus != "Canceled" && (
                  <View
                    style={{
                      flexDirection: "column",
                      padding: 0,
                      marginLeft: 15,
                      marginRight: 5,
                      marginTop: 20,
                      marginBottom: 5,
                      //   height: 600,
                      width: 320
                    }}
                  >
                    {this.state.customeventarr.map((item, index) =>
                      item.IsActive ? (
                        <View key={index}>
                          <CheckstatusItem
                            index={index}
                            statusname={item.Name}
                            date={
                              (item.Name === "Payment Details"
                                ? "Rs. " + item.Amount + " paid on "
                                : "") +
                              (item.Name === "Test Schedule"
                                ? (item.Date != null
                                  ? moment(item.Date).format(" DD MMM YY") +
                                  " at "
                                  : "") + item.Timeslot
                                : item.Date != null
                                  ? moment(item.Date).format(
                                    " DD MMM YY , hh:mm A"
                                  )
                                  : "")
                            }
                            reports={this.state.reports}
                            OpenReportDetail={(i) => this.OpenReportDetail(i)}
                          ></CheckstatusItem>
                        </View>
                      ) : (
                        <View key={index}>
                          <UnCheckstatusItem
                            index={index}
                            statusname={item.Name}
                            date={
                              item.Date != null
                                ? moment(item.Date).format(
                                  " DD MMMM YY, hh:mm A"
                                )
                                : ""
                            }
                            reports={this.state.reports}
                            OpenReportDetail={(i) => this.OpenReportDetail(i)}
                          ></UnCheckstatusItem>
                        </View>
                      )
                    )}
                  </View>
                )}
              </ScrollView>
            </>
          )}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  containermain: {
    flex: 1,
    marginTop: 1,
    backgroundColor: "white"
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
    marginLeft: 20,
    justifyContent: "center",
    backgroundColor: "white"
  },
  description: {
    fontSize: 13,
    marginTop: 0,
    color: "#595858",
    marginLeft: 6
    /// backgroundColor: 'gray',
  },
  suggestbtnTitle: {
    // flex:1,
    fontSize: 11,
    marginLeft: 5,
    paddingRight: 0,
    color: "blue",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "midnightblue"
  },
  photo: {
    height: 54,
    width: 54,
    //shadowOffset: { width: 3, height: 3 },
    //shadowColor: 'gray',
    // shadowOpacity: 0.7,

    borderWidth: 0,
    borderRadius: 27
  },
  email: {
    fontSize: 11,
    //fontStyle: 'italic',
    marginTop: 6,
    color: "gray",
    marginLeft: 0
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
    flex: 0.4,
    // flexDirection: 'row',
    // alignSelf: 'flex-end',
    height: 22,
    width: 72,
    marginTop: 0
    // justifyContent: 'flex-end',
    // alignItems: 'flex-end',
  },

  Reportview: {
    flex: 0.3,
    flexDirection: "row",
    alignSelf: "flex-end",
    height: 22,
    width: 70,
    marginRight: 10,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    // paddingTop: 0,
    //backgroundColor: '#003484',
    borderRadius: 11
  },
  reportIcon: {
    height: 15,
    width: 15,
    // marginTop: 0,
    paddingLeft: 2
    // marginTop: 10,
  },

  Mobilesubview: {
    flex: 1,
    flexDirection: "row",
    marginTop: 2
    // alignSelf: 'flex-end',
  },
  Icons: {
    height: 22,
    width: 22,
    marginTop: 0,
    paddingTop: 0
  },
  Iconsemail: {
    height: 15,
    width: 15,
    marginTop: 6
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
  }
});
