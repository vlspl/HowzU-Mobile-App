import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  RefreshControl,
  BackHandler
} from "react-native";

import { Container } from "native-base";

import CustomeHeader from "../appComponents/CustomeHeader";
import axios from "axios";
import Constants from "../utils/Constants";
import ImageLoad from "react-native-image-placeholder";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import PaginationLoading from "../appComponents/PaginationLoading";
import ActionButton from "react-native-action-button";
const Rijndael = require("rijndael-js");
global.Buffer = global.Buffer || require("buffer").Buffer;
import Toast from "react-native-tiny-toast";
export default class MyPatients extends Component {
  constructor(props) {
    super(props);

    //setting default state
    this.state = {
      isLoading: false,
      pageNo: 1,
      searchString: "",
      AllMyPatients: [],
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      typingTimeout: 0,
      isLoadingSecond: false,
      typing: true
    };
    // this.hardwarebBackAction = this.hardwarebBackAction.bind(this);
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   " Appointment componentWillReceiveProps==============================",
    //   nextProp
    // );
    //this.setState({selectedtestId: nextProp.route.params.testids });

    this.setState(
      { pageNo: 1, isLoading: true, AllMyPatients: [], searchString: "" },
      () => {
        this.getPatientlist("");
      }
    );
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
  };

  hardwarebBackAction = () => {
    this.props.navigation.navigate("PatientDashboard", { refresh: "true" });
    // this.props.navigation.goBack();
    return true;
  };

  componentDidMount = async () => {
    // console.log("*******componentDidMount==============================");
    this.setState(
      { isLoading: true, pageNo: 1, AllMyPatients: [], searchString: "" },
      () => {
        this.getPatientlist("");
      }
    );
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
  };

  componentWillUnmount = () => {
    // this.backHandler.remove();
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

  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return !this[a.UserId] && (this[a.UserId] = true);
    }, Object.create(null));
  };

  getPatientlist = async (empty) => {
    // console.log(this.state.pageNo);
    // console.log(Constants.PER_PAGE_RECORD);
    // console.log(this.state.searchString);

    if (empty) {
      // console.log("**************");
      this.setState({ AllMyPatients: [] });
    }
    try {
      let response = await axios.post(Constants.GET_PATIENT_LIST, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString
      });
      console.log("GET_PATIENT_LIST  data==============", response.data);

      this.setState({ isLoading: false });
      if (response.data.Status) {
        // this.state.AllMyPatients = [
        //   ...this.state.AllMyPatients,
        //   ...response.data.DoctorList,
        // ];

        // let responseData = [];
        let responseData = this.state.AllMyPatients;
        this.setState({ isLoading: false });
        response.data.PatientList.map((item) => {
          responseData.push(item);
        });

        this.setState({
          // AllMyPatients: responseData,
          AllMyPatients: this.removeDuplicate(responseData),
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
      { paginationLoading: true, pageNo: this.state.pageNo + 1 },
      () => {
        this.getPatientlist();
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
            AllMyPatients: [],
            pageNo: 1,
            searchLoading: true,
            refreshing: true
          },
          () => {
            this.getPatientlist();
          }
        );
      }, 1000)
    });
  };

  onRefresh = async () => {
    this.setState({ refreshing: true, pageNo: 1, AllMyPatients: [] }, () => {
      this.getPatientlist();
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

  OpenBookTest = (index) => {
    let patientinfo = this.state.AllMyPatients[index];
    // console.log(
    //   "index====================================",
    //   index,
    //   patientinfo
    // );
    this.props.navigation.navigate("SuggestedLabList", {
      Patientinfo: patientinfo
    });
    // this.props.navigation.navigate("LabListForBooking", {
    //   Patientinfo: patientinfo,
    //   // .UserId,
    //   // patientname: patientinfo.PatientName,
    // });
  };

  //handling onPress action
  OpenAllReport = (index) => {
    //Alert.alert(item.key,item.title);
    //this.props.navigation.navigate("PatientSharedReport");
    let patientinfo = this.state.AllMyPatients[index];
    // console.log(
    //   "index====================================",
    //   index,
    //   patientinfo
    // );
    this.props.navigation.navigate("PatientSharedReport", {
      patientid: patientinfo.UserId
    });
  };

  OpenAllPatient = (index) => {
    // this.props.navigation.navigate("AllPatientList");
    this.props.navigation.navigate("ChooseAddPatient");
  };

  static navigationOptions = {
    title: "Home",
    headerStyle: {
      backgroundColor: "#003484"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  //handling onPress action
  getListViewItem = (item) => {
    Alert.alert(item.key, item.title);
  };

  static navigationOptions = {
    title: "Home",
    headerStyle: {
      backgroundColor: "#003484"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };
  backbtnPress = () => {
    this.props.navigation.goBack();

    // var role = AsyncStorage.getItem(Constants.ACCOUNT_ROLE);
    // this.props.navigation.navigate('PatientDashboard', {
    //   refresh: 'refresh',
    // });
  };

  render() {
    console.log(this.state.isLoading, "isLoading");
    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="My Patients"
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
                backgroundColor: "#F5F5F5",
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

          <View style={styles.containermain}>
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
                />
              }
            >
              {this.state.AllMyPatients.map((item, index) => (
                <View key={index}>
                  <View style={styles.container}>
                    <View style={styles.photo}>
                      <ImageLoad
                        source={{
                          uri: Constants.PROFILE_PIC + item.ProfilePic
                        }}
                        style={styles.photo}
                        placeholderSource={require("../../icons/Placeholder.png")}
                        placeholderStyle={styles.placeholder}
                        borderRadius={34}
                      />
                    </View>
                    <View style={styles.container_text}>
                      <View style={styles.DRnamesubview}>
                        <Text style={styles.title}>{item.PatientName}</Text>
                      </View>
                      <View style={styles.Mobilesubview}>
                        <Image
                          source={require("../../icons/call.png")}
                          style={styles.Iconcall}
                        />
                        <Text
                          style={{
                            marginLeft: 3,
                            marginRight: 10,
                            marginTop: 5,
                            color: "#A9A9A9",
                            fontSize: 14
                          }}
                        >
                          {this.Decrypt(item.Mobile)}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "flex-end"
                      }}
                    >
                      <View style={styles.sharebtnview}>
                        <TouchableOpacity style={styles.SuggestTesttouch}>
                          <Image style={styles.Icons} />
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-end",
                          justifyContent: "flex-end"
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => this.OpenBookTest(index)}
                        >
                          <Text style={styles.endTextName}>Suggest Test</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => this.OpenAllReport(index)}
                        >
                          <Text style={styles.endTextName}>Reports</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      height: 0.5,
                      // backgroundColor: 'gray',
                      marginLeft: 15,
                      marginRight: 10,
                      marginTop: 10,
                      backgroundColor: "#d8d8d8",
                      padding: 0.5
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
            {this.state.AllMyPatients.length <= 0 &&
            !this.state.isLoading &&
            !this.state.searchLoading &&
            !this.state.refreshing ? (
              <NoDataAvailable onPressRefresh={this.onRefresh} />
            ) : null}
          </View>
        </View>
        <ActionButton buttonColor="#275BB4" onPress={this.OpenAllPatient} />
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
    padding: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: "white"
    //elevation: 2,
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

    marginLeft: 12,
    justifyContent: "center",
    backgroundColor: "white"
  },
  description: {
    fontSize: 15,
    color: "#595858",
    marginBottom: 25,
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
  endTextName: {
    // flex:1,

    marginTop: 10,
    marginRight: 10,
    marginBottom: 5,
    color: "#003484",
    fontSize: 11,
    fontWeight: "bold"
  },
  header: {
    // flex:1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 5,
    fontSize: 22,
    fontWeight: "bold",
    color: "#003484"
  },

  photo: {
    height: 60,
    width: 60,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "gray",
    shadowOpacity: 0.7,
    marginLeft: 5,
    borderWidth: 0,
    borderRadius: 34
    // elevation: 5,
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
  },
  email: {
    fontSize: 13,
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
    justifyContent: "flex-end",
    marginEnd: 15
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
    backgroundColor: "white",
    marginLeft: 10
  },
  sharebtnview: {
    flex: 0.15,
    flexDirection: "row",
    alignSelf: "flex-start"
    //height: 32,
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
    marginBottom: 10

    // alignSelf: 'flex-end',
  },
  Icons: {
    height: 20,
    width: 20,
    marginTop: 0
  },
  IconsHeader: {
    height: 20,
    width: 20,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  Iconcall: {
    height: 18,
    width: 18,
    marginTop: 5,
    marginLeft: 10
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
    marginTop: 5
  }
});

// patientt
