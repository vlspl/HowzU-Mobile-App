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
  ActivityIndicator,
  BackHandler,
  Dimensions,
  ScrollView,
  TextInput,
  RefreshControl,
  ImageBackground,
  Button
} from "react-native";
import Modal from "react-native-modal";
import { Container } from "native-base";
import CustomeHeader from "../appComponents/CustomeHeader";
import axios from "axios";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import Toast from "react-native-tiny-toast";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";
import RecentTestCard from "../appComponents/RecentTestCard";
import FilterForm from "../appComponents/FilterForm";
import { Header, Body, Left, Right, Icon, Input } from "native-base";
import TestListRow from "../appComponents/TestListRow";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import CalendarStrip from "react-native-calendar-strip";

const Rijndael = require("rijndael-js");
//const bufferFrom = require('buffer-from')
global.Buffer = global.Buffer || require("buffer").Buffer;
const padder = require("pkcs7-padding");
const screenWidth = Math.round(Dimensions.get("window").width);
let datesWhitelist = [
  {
    start: moment(),
    end: moment().add(15, "days") // total 4 days enabled
  }
];
export default class VaccineScreen extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      selectedIds: [],
      userDetails: [],
      pageNo: 1,
      searchString: "",
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      activebtn: "report",
      isDatePickerVisible: false,
      VaccinationdatabyPIN: [],
      databyDistrict: [],
      isModalVisible: false,
      gender: ["Male", "Female"],
      checked: 0,
      checkedvalue: "18-44",
      dose: "Paid",
      VaccinesType: "any",
      typingTimeout: 0,
      isLoadingSecond: false,
      typing: true,
      AllTestList: [],
      role: "patient",
      activebtrole: "",
      pincode: 411016,
      age: "",
      selectedDate: new Date()
    };
  }

  retrieveData = () => {
    AsyncStorage.getItem(Constants.ACCOUNT_ROLE).then((value) => {
      let valuelowrcase;
      if (value) {
        valuelowrcase = value.toLowerCase();
        this.setState({ role: valuelowrcase });
        this.setState({
          isLoading: false
        });
      }
    });
  };
  componentDidMount = () => {
    this.setState({ isLoading: true }, () => {
      this.retrieveData();
      if (this.state.role != "") {
        this.getProfile();
        // this.databyPIN();
      }
    });
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    this.setState({ isLoading: true }, () => {
      this.retrieveData();
      if (this.state.role != "") {
        this.getProfile();
        // this.databyPIN();
      }
    });

    // this.getProfile();
  };
  async getProfile() {
    if (this.state.role == "doctor") {
      try {
        const response = await axios.get(Constants.GET_DOCTOR_PROFILE);
        this.setState({ isloading: false });

        let responseData = [];

        response.data.MyDetails.map((item) => {
          let formatdate = moment(item.DOB, "DD/MM/YYYY").format("MM/DD/YYYY");
          let responseData = [];
          let age = 0;
          let picode;
          let dob = new Date(formatdate);

          var month_diff = Date.now() - dob.getTime();
          var age_dt = new Date(month_diff);
          var year = age_dt.getUTCFullYear();

          age = Math.abs(year - 1970);

          if (age < 45) {
            age = "18-44";
          } else {
            age = " 45+ years";
          }
          picode = item.Pincode; //411016; //item.Pincode;
          responseData.push(item);
        });

        this.setState(
          {
            userProfileDetails: responseData,
            age: age,
            pincode: picode,
            isLoading: false
          },
          () => {
            this.databyPIN(
              picode,
              age,
              this.state.selectedDate,
              this.state.dose,
              this.state.VaccinesType
            );
          }
        );
      } catch (error) {
        this.setState({ isloading: false });
        // console.log(error);
      }
    } else {
      try {
        const response = await axios.get(Constants.GET_USERPROFILE);
        let responseData = [];
        let age = 0;
        let picode;
        let date = moment().format("DD/MM/YYYY");
        response.data.MyDetails.map((item) => {
          let formatdate = moment(item.DOB, "DD/MM/YYYY").format("MM/DD/YYYY");

          let dob = new Date(formatdate);

          var month_diff = Date.now() - dob.getTime();
          var age_dt = new Date(month_diff);
          var year = age_dt.getUTCFullYear();

          age = Math.abs(year - 1970);

          if (age < 45) {
            age = "18-44";
          } else {
            age = " 45+ years";
          }
          picode = item.Pincode; //411016; //item.Pincode;
          responseData.push(item);
        });
        // console.log("********>>>>>", response.data);
        this.setState(
          {
            userProfileDetails: responseData,
            age: age,
            pincode: picode,
            isLoading: false
          },
          () => {
            this.databyPIN(
              picode,
              age,
              this.state.selectedDate,
              this.state.dose,
              this.state.VaccinesType
            );
          }
        );
      } catch (err) {
        this.setState({ isloading: false });
        console.log(err);
      }
    }
  }
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  resetData = () => {
    this.setState({
      checkedvalue: "18-44",
      dose: 1,
      VaccinesType: "any",
      searchString: ""
    });
  };
  applyFiltering = () => {
    this.setState(
      {
        isModalVisible: !this.state.isModalVisible,
        pincode:
          this.state.searchString != ""
            ? this.state.searchString
            : this.state.pincode,
        age: this.state.checkedvalue
      },
      () => {
        this.databyPIN(
          this.state.pincode,
          this.state.age,
          this.state.selectedDate,
          this.state.dose,
          this.state.VaccinesType
        );
      }
    );
  };
  Decrypt = (encryptStr) => {
    // console.log(encryptStr, 'user proifle ');
    if (encryptStr) {
      const cipher = new Rijndael("1234567890abcder", "cbc");
      const plaintext = Buffer.from(
        cipher.decrypt(
          new Buffer(encryptStr, "base64"),
          128,
          "1234567890abcder"
        )
      );
      const decrypted = padder.unpad(plaintext, 32);
      const clearText = decrypted.toString("utf8");

      return clearText.toString();
    } else return "";
  };

  backbtnPress = () => {
    this.props.navigation.goBack();
  };

  handleChange(text) {
    if (isNaN(text)) {
      Toast.show("Please enter only number");
    } else {
      this.setState({ searchString: text });
    }
  }

  Filterdata = (datalist, date, age, dose, VaccineType) => {
    let vacctype = VaccineType.toUpperCase();

    let agebyspit = age.split("-");

    let result;
    if (agebyspit[0] == 18 && VaccineType == "any") {
      result = datalist.filter(function (a) {
        result = a.sessions.filter(
          (itm) =>
            itm.date == date &&
            itm.min_age_limit >= 18 &&
            itm.max_age_limit <= 44 &&
            a.fee_type == dose
        );
        if (result.length == 0) {
          return false;
        }
        a.sessions = result;
        return true;
      });
      return result;
    } else if (agebyspit[0] != 18 && VaccineType == "any") {
      result = datalist.filter(function (a) {
        result = a.sessions.filter(
          (itm) =>
            itm.date == date && itm.min_age_limit >= 45 && a.fee_type == dose
        );
        if (result.length == 0) {
          return false;
        }
        a.sessions = result;
        return true;
      });
      return result;
    } else if (agebyspit[0] == 18 && VaccineType != "any") {
      result = datalist.filter(function (a) {
        result = a.sessions.filter(
          (itm) =>
            itm.date == date &&
            itm.min_age_limit >= 18 &&
            itm.max_age_limit <= 44 &&
            a.fee_type == dose &&
            itm.vaccine == vacctype
        );
        if (result.length == 0) {
          return false;
        }
        a.sessions = result;
        return true;
      });
      return result;
    } else if (agebyspit[0] != 18 && VaccineType != "any") {
      result = datalist.filter(function (a) {
        result = a.sessions.filter(
          (itm) =>
            itm.date == date &&
            itm.min_age_limit >= 45 &&
            a.fee_type == dose &&
            itm.vaccine == vacctype
        );
        if (result.length == 0) {
          return false;
        }
        a.sessions = result;
        return true;
      });
      return result;
    }
  };

  onDateSelected = (date) => {
    // console.log(" onDateSelected ==============================", date);

    // this.setState({ selectedDate: date.format('YYYY-MM-DD')});
    this.setState(
      {
        selectedDate: date.format("YYYY-MM-DD"),
        // selectedDoseDate: date.format("DD-MM-YYYY").toString(),
        // medicationInfo: [],
        isLoading: true
      },
      () => {
        this.databyPIN(
          this.state.pincode,
          this.state.age,
          date,
          this.state.dose,
          this.state.VaccinesType
        );
      }
    );
  };
  databyPIN = async (pincode, age, dt, dose, VaccineType) => {
    let date = moment(dt).format("DD-MM-YYYY");

    try {
      // let pincode = this.state.userDetails[0]["Pincode"];
      // console.log(pincode, "pincode");
      let response = await axios.get(
        "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?" +
        "pincode=" +
        this.state.pincode +
        "&date=" +
        date
      );
      this.setState({ isLoading: false });

      if (response.data.centers.length > 0) {
        let data = this.Filterdata(
          response.data.centers,
          date,
          age,
          dose,
          VaccineType
        );

        this.setState({
          VaccinationdatabyPIN: data
        });
      } else {
        this.setState({
          VaccinationdatabyPIN: response.data.centers
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="Vaccination"
          headerId={2}
          navigation={this.props.navigation}
          onPressback={this.backbtnPress}
        />
        <Modal
          isVisible={this.state.isModalVisible}
          style={{ margin: 0, backgroundColor: "white" }}
        >
          <View style={{ flex: 1 }}>
            <Header
              androidStatusBarColor="#275BB4"
              noShadow
              style={{ backgroundColor: "#275BB4" }}
            >
              <ImageBackground
                source={require("../../icons/bg-all.png")}
                style={{
                  width: screenWidth,
                  height: "100%",
                  flexDirection: "row"
                }}
                resizeMode="contain"
              >
                <Left>
                  <TouchableOpacity
                    onPress={this.toggleModal}
                    style={{ padding: 5 }}
                  >
                    <Image
                      style={{ height: 50, width: 50 }}
                      source={require("../../icons/newclose.png")}
                    ></Image>
                  </TouchableOpacity>
                </Left>

                <Body>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: "bold"
                      }}
                    >
                      Filter By
                    </Text>
                  </View>
                </Body>
                <Right></Right>
              </ImageBackground>
            </Header>

            <View style={styles.textSign}>
              <Text
                style={[styles.textSign, { color: "blue", marginBottom: 10 }]}
              ></Text>
            </View>
            {/* modal header comepted */}
            <ScrollView
              alwaysBounceVertical={true}
              showsHorizontalScrollIndicator={false}
              style={{
                flex: 1,
                backgroundColor: "white",
                marginTop: 0,
                paddingHorizontal: 15,
                marginBottom: 1
              }}
            >
              <View
                style={{
                  flex: 0.2,
                  padding: 8,
                  margin: 10,
                  backgroundColor: "#fff",

                  borderWidth: 1,
                  borderColor: "lightgray",
                  shadowOffset: { width: 2, height: 2 },
                  shadowColor: "lightgray",
                  shadowOpacity: 0.8,
                  borderRadius: 5,
                  elevation: 5
                }}
              >
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 14,
                    marginLeft: 15,
                    fontWeight: "bold"
                  }}
                >
                  Pincode
                </Text>
                <View
                  style={{
                    height: 60,

                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    margin: 10
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: "#F5F5F5",
                      borderRadius: 20,
                      height: 50,
                      flexDirection: "row",
                      shadowOffset: { width: 0, height: 2 },
                      shadowColor: "gray",
                      shadowOpacity: 0.7,
                      elevation: 5
                    }}
                  >
                    <TextInput
                      style={{
                        textAlign: "left",
                        flex: 1,
                        paddingLeft: 10,
                        fontSize: 15
                      }}
                      onChangeText={(val) => this.handleChange(val)}
                      value={this.state.searchString}
                      underlineColorAndroid="transparent"
                      placeholder="Search pincode "
                      maxLength={6}
                      allowFontScaling={false}
                    />
                  </View>
                </View>

                {/* search by district */}

                {/* <View style={styles.containermain}>
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
                        testname={item.state_name}
                        // profile={item.ProfileName}
                        checkboximg={
                          this.state.selectedId == item.TestId
                            ? require("../../icons/radio-on.png")
                            : require("../../icons/radio-off.png")
                        }
                        onPress={() =>
                          this.handleSelectionMultiple(
                            item.state_id,
                            item.state_name
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
              </View> */}

                {/* Age Group */}
              </View>
              <View
                style={{
                  flex: 0.5,
                  padding: 10,
                  margin: 10,
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "lightgray",
                  shadowOffset: { width: 2, height: 2 },
                  shadowColor: "lightgray",
                  shadowOpacity: 0.8,
                  borderRadius: 5,
                  elevation: 5
                }}
              >
                <Text
                  style={{
                    marginTop: 20,
                    fontSize: 14,
                    marginLeft: 15,
                    fontWeight: "bold"
                  }}
                >
                  Age Group
                </Text>
                <View
                  style={{
                    height: 60,
                    width: "100%",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      height: 40,
                      width: "90%",

                      // backgroundColor: "#f4f4f4",
                      flexDirection: "row",
                      alignItems: "center",
                      borderRadius: 50,
                      // borderWidth: 1,
                      marginTop: 10
                    }}
                  >
                    {this.state.checkedvalue == "18-44" ? (
                      <TouchableOpacity
                        style={{
                          height: 40,
                          width: "50%",
                          backgroundColor: "#275BB4",
                          // backgroundColor: "#1d303f",
                          borderRadius: 15,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        onPress={() => this.setState({ checkedvalue: "18-44" })}
                      >
                        <Text style={{ fontSize: 14, color: "white" }}>
                          18-44 years
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#f4f4f4",
                          height: "100%",
                          width: "50%",

                          borderRadius: 50,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        onPress={() => this.setState({ checkedvalue: "18-44" })}
                      >
                        <Text style={{ fontSize: 14, color: "#1d303f" }}>
                          18-44 years
                        </Text>
                      </TouchableOpacity>
                    )}

                    {this.state.checkedvalue == "45+" ? (
                      <TouchableOpacity
                        style={{
                          height: 40,
                          width: "50%",
                          backgroundColor: "#275BB4",
                          // backgroundColor: "#1d303f",
                          borderRadius: 15,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        onPress={() => this.setState({ checkedvalue: "45+" })}
                      >
                        <Text style={{ fontSize: 14, color: "white" }}>
                          45+ years
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#f4f4f4",
                          height: "100%",
                          width: "50%",

                          borderRadius: 50,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        onPress={() => this.setState({ checkedvalue: "45+" })}
                      >
                        <Text style={{ fontSize: 14, color: "#1d303f" }}>
                          45+ years
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/*  */}

                {/* <Text
                style={{
                  marginTop: 20,
                  fontSize: 14,
                  marginLeft: 15,
                  fontWeight: "bold",
                }}
              >
                Dose Type
              </Text>
              <View
                style={{
                  height: 60,
                  width: "100%",
                  flexDirection: "column",
                  alignItems: "center",
                  // backgroundColor: "#F7F7F7",
                }}
              >
                <View
                  style={{
                    height: 40,
                    width: "90%",
                    // backgroundColor: 'red',
                    backgroundColor: "#f4f4f4",
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 50,
                    borderWidth: 1,
                    marginTop: 10,
                    // marginLeft: 10,
                    // marginRight: 10,
                  }}
                >
                  {this.state.dose == "1" ? (
                    <TouchableOpacity
                      style={{
                        height: 40,
                        width: "50%",

                        backgroundColor: "#1d303f",
                        borderRadius: 15,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => this.setState({ dose: "1" })}
                    >
                      <Text style={{ fontSize: 14, color: "white" }}>
                        First Dose
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#f4f4f4",
                        height: "100%",
                        width: "50%",

                        borderRadius: 50,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => this.setState({ dose: "1" })}
                    >
                      <Text style={{ fontSize: 14, color: "#1d303f" }}>
                        First Dose
                      </Text>
                    </TouchableOpacity>
                  )}

                  {this.state.dose == "2" ? (
                    <TouchableOpacity
                      style={{
                        height: 40,
                        width: "50%",

                        backgroundColor: "#1d303f",
                        borderRadius: 15,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => this.setState({ dose: "2" })}
                    >
                      <Text style={{ fontSize: 14, color: "white" }}>
                        Second Dose
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#f4f4f4",
                        height: "100%",
                        width: "50%",

                        borderRadius: 50,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => this.setState({ dose: "2" })}
                    >
                      <Text style={{ fontSize: 14, color: "#1d303f" }}>
                        Second Dose
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View> */}
                {/*  */}

                {/* Cost  */}

                <Text
                  style={{
                    marginTop: 20,
                    fontSize: 14,
                    marginLeft: 15,
                    fontWeight: "bold"
                  }}
                >
                  Cost
                </Text>
                <View
                  style={{
                    height: 60,
                    width: "100%",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      height: 40,
                      width: "90%",
                      // backgroundColor: "red",
                      // backgroundColor: "#275BB4",
                      flexDirection: "row",
                      alignItems: "center",

                      borderRadius: 50,
                      // borderWidth: 1,
                      marginTop: 10,
                      // marginLeft: 10,
                      // marginRight: 10,
                      margin: 10
                    }}
                  >
                    {this.state.dose == "Free" ? (
                      <TouchableOpacity
                        style={{
                          height: 40,
                          width: "50%",

                          backgroundColor: "#275BB4",
                          borderRadius: 15,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        onPress={() => this.setState({ dose: "Free" })}
                      >
                        <Text style={{ fontSize: 14, color: "white" }}>
                          Free
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#f4f4f4",
                          height: "100%",
                          width: "50%",
                          borderRadius: 50,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        onPress={() => this.setState({ dose: "Free" })}
                      >
                        <Text style={{ fontSize: 14, color: "#1d303f" }}>
                          Free
                        </Text>
                      </TouchableOpacity>
                    )}

                    {this.state.dose == "Paid" ? (
                      <TouchableOpacity
                        style={{
                          height: 40,
                          width: "50%",
                          backgroundColor: "#275BB4",
                          borderRadius: 15,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        onPress={() => this.setState({ dose: "Paid" })}
                      >
                        <Text style={{ fontSize: 14, color: "white" }}>
                          Paid
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#f4f4f4",
                          height: "100%",
                          width: "50%",
                          borderRadius: 50,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        onPress={() => this.setState({ dose: "Paid" })}
                      >
                        <Text style={{ fontSize: 14, color: "#1d303f" }}>
                          Paid
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <Text
                  style={{
                    marginTop: 20,
                    fontSize: 14,
                    marginLeft: 15,
                    fontWeight: "bold"
                  }}
                >
                  Vaccines
                </Text>
                <View
                  style={{
                    height: 60,
                    width: "100%",
                    flexDirection: "column",
                    alignItems: "center"
                    // backgroundColor: "#F7F7F7",
                    // marginLeft: 10,
                    // marginRight: 20,
                  }}
                >
                  <View
                    style={{
                      height: 40,
                      width: "90%",
                      // backgroundColor: 'red',
                      // backgroundColor: "#f4f4f4",
                      flexDirection: "row",
                      alignItems: "center",
                      // borderRadius: 50,
                      // borderWidth: 1,
                      marginTop: 10
                      // marginLeft: 10,
                      // marginRight: 10,
                    }}
                  >
                    {this.state.VaccinesType == "any" ? (
                      <TouchableOpacity
                        style={{
                          height: 40,
                          width: "33.33%",
                          backgroundColor: "#275BB4",
                          // backgroundColor: "#1d303f",
                          borderRadius: 15,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        onPress={() => this.setState({ VaccinesType: "any" })}
                      >
                        <Text style={{ fontSize: 14, color: "white" }}>
                          Any
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#f4f4f4",
                          height: "100%",
                          width: "33.33%",

                          borderRadius: 50,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        onPress={() => this.setState({ VaccinesType: "any" })}
                      >
                        <Text style={{ fontSize: 14, color: "#1d303f" }}>
                          Any
                        </Text>
                      </TouchableOpacity>
                    )}

                    {this.state.VaccinesType == "covishield" ? (
                      <TouchableOpacity
                        style={{
                          height: 40,
                          width: "33.33%",
                          backgroundColor: "#275BB4",
                          // backgroundColor: "#1d303f",
                          borderRadius: 15,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        onPress={() =>
                          this.setState({ VaccinesType: "covishield" })
                        }
                      >
                        <Text style={{ fontSize: 14, color: "white" }}>
                          Covishield
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#f4f4f4",
                          height: "100%",
                          width: "33.33%",
                          borderRadius: 50,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        onPress={() =>
                          this.setState({ VaccinesType: "covishield" })
                        }
                      >
                        <Text style={{ fontSize: 14, color: "#1d303f" }}>
                          Covishield
                        </Text>
                      </TouchableOpacity>
                    )}
                    {this.state.VaccinesType == "covaxin" ? (
                      <TouchableOpacity
                        style={{
                          height: 40,
                          width: "33.33%",
                          backgroundColor: "#275BB4",
                          // backgroundColor: "#1d303f",
                          borderRadius: 15,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        onPress={() =>
                          this.setState({ VaccinesType: "covaxin" })
                        }
                      >
                        <Text style={{ fontSize: 14, color: "white" }}>
                          Covaxin
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#f4f4f4",
                          height: "100%",
                          width: "33.33%",

                          borderRadius: 50,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        onPress={() =>
                          this.setState({ VaccinesType: "covaxin" })
                        }
                      >
                        <Text style={{ fontSize: 14, color: "#1d303f" }}>
                          Covaxin
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>

          <View
            style={{
              flex: 0.1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "white",
              height: 60,
              marginBottom: 0,
              margin: 10
            }}
          >
            <View style={{ height: 60, width: 100, backgroundColor: "white" }}>
              <Button
                title=" Reset"
                onPress={this.resetData}
                color="#2e62ae"
              ></Button>
            </View>
            <View style={{ height: 60, width: 100 }}>
              <Button
                title=" Apply"
                onPress={this.applyFiltering}
                color="#2e62ae"
              ></Button>
            </View>
          </View>
        </Modal>

        {/* <View style={{ flex: 1, flexDirection: "column" }}> */}
        {/* <View
            style={{
              height: 60,
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 40,
                width: "90%",

                flexDirection: "row",
                alignItems: "center",

                marginTop: 10,
              }}
            > */}
        {/* {this.state.activebtn == "report" ? (
                <TouchableOpacity
                  style={{
                    height: 40,
                    width: "50%",

                    justifyContent: "center",
                    alignItems: "center",
                    borderBottomWidth: 1,
                  }}
                  onPress={() => this.setState({ activebtn: "report" })}
                >
                  <Text style={{ fontSize: 14, color: "#1d303f" }}>
                    Search by PIN
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    height: "100%",
                    width: "50%",

                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => this.setState({ activebtn: "report" })}
                >
                  <Text style={{ fontSize: 14, color: "#1d303f" }}>
                    Search by PIN
                  </Text>
                </TouchableOpacity>
              )} */}

        {/* {this.state.activebtn == "graph" ? (
                <TouchableOpacity
                  style={{
                    height: 40,
                    width: "50%",

                    justifyContent: "center",
                    alignItems: "center",
                    borderBottomWidth: 1,
                  }}
                  onPress={() => this.setState({ activebtn: "graph" })}
                >
                  <Text style={{ fontSize: 14, color: "#1d303f" }}>
                    Search by District
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    height: "100%",
                    width: "50%",

                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => this.setState({ activebtn: "graph" })}
                >
                  <Text style={{ fontSize: 14, color: "#1d303f" }}>
                    Search by District
                  </Text>
                </TouchableOpacity>
              )} */}
        {/* </View>
          </View> */}
        {/* </View> */}
        {/* {this.state.activebtn == "report" &&
        this.state.activebtn != "graphdata" &&
        this.state.isLoading == false ? (
          <> */}
        <View
          style={{
            flex: 13,
            flexDirection: "column",
            marginTop: 8
            // margin: 10,
          }}
        >
          <View
            style={{
              height: 60,
              backgroundColor: "white",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              margin: 7
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "#F5F5F5",
                borderRadius: 20,
                height: 50,
                flexDirection: "row",
                shadowOffset: { width: 0, height: 2 },
                shadowColor: "gray",
                shadowOpacity: 0.7,
                elevation: 5
              }}
            >
              <TouchableOpacity
                style={{
                  height: 40,
                  width: "20%",
                  backgroundColor: "gray",
                  justifyContent: "center",
                  alignItems: "center",

                  borderRadius: 20,
                  margin: 5,
                  marginTop: 5
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "#1d303f"
                  }}
                >
                  {this.state.pincode}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 40,
                  width: "30%",
                  backgroundColor: "gray",
                  justifyContent: "center",
                  alignItems: "center",

                  borderRadius: 20,
                  margin: 5,
                  marginTop: 5
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "#1d303f"
                  }}
                >
                  {this.state.age}
                  {"Years"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 40,
                  width: "30%",
                  backgroundColor: "gray",
                  justifyContent: "center",
                  alignItems: "center",

                  borderRadius: 20,
                  margin: 5,
                  marginTop: 5
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "#1d303f"
                  }}
                >
                  {this.state.VaccinesType}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.setState({ isModalVisible: true });
                }}
              >
                <Image
                  source={require("../../icons/editt2222.png")}
                  style={{
                    height: 20,
                    width: 20,
                    marginLeft: 10,
                    marginTop: 10,
                    marginRight: 10
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <CalendarStrip
            scrollable
            style={{ height: 80, paddingTop: 0, paddingBottom: 10, padding: 7 }}
            calendarColor={"#275BB4"}
            startingDate={moment(new Date())}
            calendarHeaderStyle={{ color: "white" }}
            headerText={moment(
              this.state.selectedDate,
              "YYYY-MM-DDTHH: mm: ss"
            ).format("DD MMM YY")}
            dateNumberStyle={{ color: "white" }}
            dateNameStyle={{ color: "white" }}
            iconContainer={{ flex: 0.1, color: "white" }}
            daySelectionAnimation={{
              type: "background",
              duration: 200,
              borderWidth: 1,
              borderHighlightColor: "white"
            }}
            highlightDateNumberStyle={{ color: "yellow" }}
            highlightDateNameStyle={{ color: "yellow" }}
            onDateSelected={this.onDateSelected}
            selectedDate={this.state.selectedDate}
            calendarHeaderPosition={"below"}
            calendarHeaderFormat={"DD MMM YY"}
            iconLeft={require("../../icons/back.png")}
            iconLeftStyle={{ height: 20, width: 40, color: "#fff" }}
            iconRight={require("../../icons/1.png")}
            iconRightStyle={{ height: 20, width: 40, color: "#fff" }}
            datesWhitelist={datesWhitelist}
            shouldAllowFontScaling={false}
          />

          <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, margin: 0 }}>
              {this.state.VaccinationdatabyPIN.length <= 0 ? (
                <View style={{ flex: 1, justifyContent: "center" }}>
                  {/* <NoDataAvailable onPressRefresh={this.onRefresh} /> */}
                  <View
                    style={{
                      height: "100%",
                      width: "100%",
                      backgroundColor: "white",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Image
                      source={require("../../icons/nodatfoundnew.png")}
                      style={{
                        height: 350,
                        width: 250,
                        resizeMode: "cover",
                        backgroundColor: "white"
                      }}
                    />

                    <Text
                      style={{
                        color: "gray",
                        backgroundColor: "white",
                        marginLeft: 50,
                        marginRight: 50,
                        marginTop: -115,
                        fontSize: 20
                      }}
                    >
                      No vaccines available in any centers for the selected
                      locations
                    </Text>
                  </View>
                </View>
              ) : (
                <>
                  {this.state.VaccinationdatabyPIN.map((item, index) => (
                    <View style={{ flex: 1 }} key={index}>
                      <View style={styles.MyhealthcardView}>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <View
                            style={{ flex: 0.75, backgroundColor: "white" }}
                          >
                            <View style={styles.container_text}>
                              <View style={styles.titlesubview}>
                                <View style={styles.DRnamesubview}>
                                  <Text style={styles.title}>{item.name}</Text>
                                  <Text
                                    style={[
                                      styles.title,
                                      { fontSize: 12, color: "blue" }
                                    ]}
                                  >
                                    {item.fee_type}
                                  </Text>
                                </View>
                              </View>
                              <View style={styles.Mobilesubview}>
                                <Text style={styles.description}>
                                  {item.address +
                                    " " +
                                    item.district_name +
                                    " " +
                                    item.state_name +
                                    " ," +
                                    item.pincode}
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
                                  <Text
                                    style={[styles.email, { fontSize: 12 }]}
                                  >
                                    {item.vaccine_fees[0].vaccine}
                                    {":"}
                                  </Text>
                                  <Text
                                    style={[styles.email, { fontSize: 12 }]}
                                  >
                                    {`\u20B9 ${item.vaccine_fees[0].fee}`}
                                  </Text>
                                </View>
                              </View>

                              {/* age */}
                              <View style={styles.emailsubview}>
                                {item.sessions.length > 0 ? (
                                  <>
                                    <View
                                      style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        width: "100%"
                                      }}
                                    >
                                      <View
                                        style={{
                                          flex: 1,
                                          flexDirection: "row"
                                        }}
                                      >
                                        <TouchableOpacity
                                          style={{
                                            height: 40,
                                            width: "50%",
                                            // backgroundColor: "#275BB4",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginLeft: 0,
                                            // borderRadius: 20,
                                            margin: 5,
                                            marginTop: 5
                                          }}
                                        >
                                          <Text
                                            style={[
                                              styles.email,
                                              {
                                                fontSize: 14,
                                                color: "#998fa2"
                                              }
                                            ]}
                                          >
                                            {"Dose 1 "}
                                            <Text
                                              style={[
                                                styles.email,
                                                {
                                                  fontSize: 14,
                                                  color: "#048604"
                                                }
                                              ]}
                                            >
                                              {
                                                item.sessions[0]
                                                  .available_capacity_dose1
                                              }
                                            </Text>
                                          </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                          style={{
                                            height: 40,
                                            width: "50%",
                                            // backgroundColor: "#275BB4",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginLeft: 0,
                                            // borderRadius: 20,
                                            margin: 5,
                                            marginTop: 5
                                          }}
                                        >
                                          <Text
                                            style={[
                                              styles.email,
                                              {
                                                fontSize: 14,
                                                color: "#998fa2"
                                              }
                                            ]}
                                          >
                                            {"Dose 2  "}
                                            <Text
                                              style={[
                                                styles.email,
                                                {
                                                  fontSize: 14,
                                                  color: "#048604"
                                                }
                                              ]}
                                            >
                                              {
                                                item.sessions[0]
                                                  .available_capacity_dose2
                                              }
                                            </Text>
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  </>
                                ) : null}
                              </View>
                              {/* <View style={styles.emailsubview}>
                                {item.sessions.length > 0
                                  ? item.sessions.map((sess, ind) => (
                                      <>
                                        <View
                                          style={{
                                            flex: 1,
                                            flexDirection: "row",
                                            width: "100%"
                                          }}
                                          key={ind}
                                        >
                                          <View
                                            style={{
                                              flex: 1,
                                              flexDirection: "row"
                                            }}
                                            key={ind}
                                          >
                                            <TouchableOpacity
                                              style={{
                                                height: 40,
                                                width: "50%",
                                                // backgroundColor: "#275BB4",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginLeft: 0,
                                                // borderRadius: 20,
                                                margin: 5,
                                                marginTop: 5
                                              }}
                                            >
                                              <Text
                                                style={[
                                                  styles.email,
                                                  {
                                                    fontSize: 14,
                                                    color: "#998fa2"
                                                  }
                                                ]}
                                              >
                                                {"Dose 1 "}
                                                <Text
                                                  style={[
                                                    styles.email,
                                                    {
                                                      fontSize: 14,
                                                      color: "#048604"
                                                    }
                                                  ]}
                                                >
                                                  {
                                                    sess.available_capacity_dose1
                                                  }
                                                </Text>
                                              </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                              style={{
                                                height: 40,
                                                width: "50%",
                                                // backgroundColor: "#275BB4",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginLeft: 0,
                                                // borderRadius: 20,
                                                margin: 5,
                                                marginTop: 5
                                              }}
                                            >
                                              <Text
                                                style={[
                                                  styles.email,
                                                  {
                                                    fontSize: 14,
                                                    color: "#998fa2"
                                                  }
                                                ]}
                                              >
                                                {"Dose 2  "}
                                                <Text
                                                  style={[
                                                    styles.email,
                                                    {
                                                      fontSize: 14,
                                                      color: "#048604"
                                                    }
                                                  ]}
                                                >
                                                  {
                                                    sess.available_capacity_dose2
                                                  }
                                                </Text>
                                              </Text>
                                            </TouchableOpacity>
                                          </View>
                                        </View>
                                      </>
                                    ))
                                  : null}
                              </View> */}
                            </View>
                          </View>

                          <View
                            style={{
                              flex: 0.25,
                              backgroundColor: "white",
                              alignItems: "center"
                            }}
                          >
                            <View
                              style={{
                                borderColor: "lightgray",

                                marginTop: 4,
                                overflow: "hidden"
                              }}
                            >
                              <TouchableOpacity
                                style={styles.touchable}
                                onPress={() =>
                                  this.props.navigation.navigate(
                                    "VaccinationCertificate",
                                    {
                                      from: ""
                                    }
                                  )
                                }
                              >
                                <Image
                                  style={{
                                    height: 60,
                                    width: 60,
                                    // shadowColor: "#fff",
                                    backgroundColor: "#fff",
                                    marginLeft: 5
                                  }}
                                  // source={props.lablogo}
                                  source={require("../../icons/forword.png")}
                                />
                              </TouchableOpacity>
                            </View>
                            <View
                              style={{
                                flex: 1,
                                alignContent: "center",
                                justifyContent: "center"
                              }}
                            ></View>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </>
              )}
              {/* {this.state.VaccinationdatabyPIN.map((item, index) => (
                    <View style={{ flex: 1 }} key={index}>
                      <View style={styles.MyhealthcardView}>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <View
                            style={{ flex: 0.75, backgroundColor: "white" }}
                          >
                            <View style={styles.container_text}>
                              <View style={styles.titlesubview}>
                                <View style={styles.DRnamesubview}>
                                  <Text style={styles.title}>{item.name}</Text>
                                  <Text
                                    style={[
                                      styles.title,
                                      { fontSize: 12, color: "blue" },
                                    ]}
                                  >
                                    {item.fee_type}
                                  </Text>
                                </View>
                              </View>
                              <View style={styles.Mobilesubview}>
                                <Text style={styles.description}>
                                  {item.address +
                                    " " +
                                    item.district_name +
                                    " " +
                                    item.state_name +
                                    " ," +
                                    item.pincode}
                                </Text>
                              </View>

                              <View style={styles.emailsubview}>
                                <View
                                  style={{
                                    backgroundColor: "white",
                                    flexDirection: "row",
                                    flex: 1,
                                  }}
                                >
                                  <Text
                                    style={[styles.email, { fontSize: 12 }]}
                                  >
                                    {item.vaccine_fees[0].vaccine}
                                    {":"}
                                  </Text>
                                  <Text
                                    style={[styles.email, { fontSize: 12 }]}
                                  >
                                    {`\u20B9 ${item.vaccine_fees[0].fee}`}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>

                          <View
                            style={{
                              flex: 0.25,
                              backgroundColor: "white",
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={{
                                borderColor: "lightgray",

                                marginTop: 4,
                                overflow: "hidden",
                                shadowOffset: { width: 1, height: 3 },
                                shadowColor: "gray",
                                shadowOpacity: 0.8,
                              }}
                            >
                              <TouchableOpacity
                                style={styles.touchable}
                                onPress={() =>
                                  this.props.navigation.navigate(
                                    "VaccinationCertificate"
                                  )
                                }
                              >
                                <Image
                                  style={{ height: 50, width: 50 }}
                                  // source={props.lablogo}
                                  source={require("../../icons/forword.png")}
                                />
                              </TouchableOpacity>
                            </View>
                            <View
                              style={{
                                flex: 1,
                                alignContent: "center",
                                justifyContent: "center",
                              }}
                            ></View>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))} */}
            </ScrollView>
          </View>
        </View>
      </Container>
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
  btn: {
    flexDirection: "row",
    alignItems: "center"
  },
  radio: {
    flexDirection: "row"
  },
  img: {
    height: 20,
    width: 20,
    marginHorizontal: 5
  },
  Horizontalcard: {
    flex: 1,
    flexDirection: "column",
    padding: 10,
    margin: 10,
    backgroundColor: "white",
    width: 145,
    height: 145,
    borderWidth: 1,
    borderColor: "lightgray",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "lightgray",
    shadowOpacity: 0.9,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5
    // justifyContent:'center',
  },
  imageThumbnail: {
    // alignItems: 'center',
    //justifyContent:'center',
    margin: 5,
    height: 80,
    width: 80
    //padding: 10,
    //backgroundColor: 'red',
  },

  MyhealthcardView: {
    flex: 1,
    flexDirection: "row",
    padding: 8,
    margin: 10,
    backgroundColor: "white",
    // width: 300,
    // height: 90,
    borderWidth: 1,
    borderColor: "lightgray",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "lightgray",
    shadowOpacity: 0.8,
    borderRadius: 5,
    elevation: 5
    //alignItems: 'center',
    // justifyContent:'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    flexDirection: "row",
    // backgroundColor: 'gray',
    marginRight: 10
    //fontWeight: 'bold'
  },
  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    marginLeft: 5,
    justifyContent: "center",
    backgroundColor: "white"
  },
  description: {
    fontSize: 13,
    marginTop: 4,
    color: "#595858",
    marginLeft: 5
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
    fontSize: 11,
    //fontStyle: 'italic',
    marginTop: 6,
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
    flex: 1,
    flexDirection: "row",
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
    flex: 0.15,
    flexDirection: "row",
    alignSelf: "flex-end"
    // height: 32,
    /// width: 30,
    //marginTop : 0,
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
    marginTop: 5
    // alignSelf: 'flex-end',
  },
  Icons: {
    height: 22,
    width: 22,
    marginTop: 0
  },
  Iconcall: {
    height: 15,
    width: 15,
    marginTop: 0
  },
  Iconsemail: {
    height: 15,
    width: 15,
    marginTop: 4
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
  container: {
    flex: 1,
    flexDirection: "column",
    //padding: 0,
    marginLeft: Platform.OS === "ios" ? 15 : 0,
    marginRight: Platform.OS === "ios" ? 15 : 0,
    marginTop: Platform.OS === "ios" ? 10 : 0,
    marginBottom: Platform.OS === "ios" ? 2 : 0,
    //borderRadius:Platform.OS==="ios"?5:0,
    backgroundColor: "white",
    elevation: 2
  },

  graphcontainer: {
    flex: 1,
    flexDirection: "column",
    marginLeft: Platform.OS === "ios" ? 15 : 0,
    marginRight: Platform.OS === "ios" ? 15 : 0,
    marginTop: Platform.OS === "ios" ? 10 : 0,
    marginBottom: Platform.OS === "ios" ? 2 : 0,
    backgroundColor: "#F7F7F7",
    elevation: 2
  }
});
