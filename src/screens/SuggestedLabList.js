import React, { Component } from "react";
//import CustomListview from './Screen/DoctorList'

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
  RefreshControl,
  ScrollView,
  BackHandler,
} from "react-native";
import { Container } from "native-base";
import axios from "axios";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import LablistComp from "../appComponents/LablistComp";
import CustomeHeader from "../appComponents/CustomeHeader";
import Toast from "react-native-tiny-toast";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import PaginationLoading from "../appComponents/PaginationLoading";
const Rijndael = require("rijndael-js");
//const bufferFrom = require('buffer-from')
global.Buffer = global.Buffer || require("buffer").Buffer;
import { CommonActions } from "@react-navigation/native";

var TestID = "";
var Testcount = "";
var PatientID = "";
var PatientName = "";
var temparray = [];

export default class SuggestedLabList extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      pageNo: 1,
      searchString: "",
      AllLabList: [],
      TempLabList: [],
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      selectedtestId: [],
      testIdsStr: "",
      testcount: "",
      patientinfo: [],
    };
  }

  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    this.backHandler.remove();
  };
  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return !this[a.Labid] && (this[a.Labid] = true);
    }, Object.create(null));
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   " LAB LIST componentWillReceiveProps==============================",
    //   typeof nextProp.route.params.testids
    // );

    // TestID = nextProp.route.params.testids;
    PatientID = nextProp.route.params.Patientinfo.UserId;
    PatientName = nextProp.route.params.Patientinfo.PatientName;
    temparray = [];
    //this.setState({testIdsStr: nextProp.route.params.testids });
    // Testcount = nextProp.route.params.testids.split(",").length;
    // console.log("test  LIST testIdsStr ==============================", TestID);
    // console.log(
    //   "test  LIST patientId ==============================",
    //   PatientID
    // );
    // console.log(
    //   "test  LIST PatientName ==============================",
    //   PatientName
    // );

    // this.setState({testcount: count});
    this.setState({ isLoading: true, AllLabList: [] }, () => {
      this.getLabList();
    });
    // this.getLabList();
  };

  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.hardwarebBackAction
    );
    // console.log(
    //   "LAB LIST componentDidMount==============================",
    //   this.props.route.params
    // );

    // TestID = this.props.route.params.testids;
    PatientID = this.props.route.params.Patientinfo.UserId;
    PatientName = this.props.route.params.Patientinfo.PatientName;
    temparray = [];
    //this.setState({testIdsStr: nextProp.route.params.testids });
    // Testcount = this.props.route.params.testids.split(",").length;
    // console.log("test  LIST testIdsStr ==============================", TestID);
    // console.log(
    //   "test  LIST patientId ==============================",
    //   PatientID
    // );
    // console.log(
    //   "test  LIST PatientName ==============================",
    //   PatientName
    // );

    this.setState({ isLoading: true, AllLabList: [] }, () => {
      this.getLabList();
    });
  };

  Decrypt = (encryptStr) => {
    const cipher = new Rijndael("1234567890abcder", "cbc");
    const plaintext = Buffer.from(
      cipher.decrypt(new Buffer(encryptStr, "base64"), 128, "1234567890abcder")
    );
    // console.log(
    //   "Decrypt  ====================================",
    //   plaintext.toString()
    // );
    return plaintext.toString();
  };

  getLabList = async (empty) => {
    try {
      // changed the flow
      // let response = await axios.post(Constants.GET_LABLIST, {
      //   TestList: TestID,
      //   TestCount: Testcount,
      //   pageNumber: this.state.pageNo,
      //   pageSize: Constants.PER_PAGE_RECORD,
      //   Searching: this.state.searchString,
      // });

      let response = await axios.post(Constants.GET_LABLIST_FOR_BOOKING, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString,
      });
      // console.log("data LABLIST ==============", response.data.LabList);
      this.setState({ isLoading: false });

      if (response.data.Status) {
        let responseData = this.state.AllLabList;

        response.data.LabList.map((item) => {
          //   console.log(item);
          responseData.push(item);
        });

        this.setState({
          AllLabList: this.removeDuplicate(responseData),
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
    } catch (errors) {
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
        this.getLabList();
      }
    );
  };

  onChangeTextClick = async (val) => {
    // console.log("======", val);
    this.setState(
      { searchString: val, AllLabList: [], pageNo: 1, searchLoading: true },
      () => {
        temparray = [];
        this.getLabList(true);
      }
    );
  };

  onRefresh = async () => {
    this.setState({ refreshing: true, AllLabList: [], pageNo: 1 }, () => {
      temparray = [];
      this.getLabList();
    });
  };

  testSuggestToPatient = async (labId) => {
    this.setState({ isLoading: true });
    // console.log("PatientID ======", PatientID);
    // console.log("labId ======", labId);
    // console.log("TestID ======", TestID);

    try {
      let response = await axios.post(Constants.TESTSUGGEST_PATIENT, {
        PatientId: PatientID,
        LabId: labId,
        TestId: TestID,
      });
      // console.log("data==============", response.data);
      this.setState({ isLoading: false });

      if (response.data.Status) {
        Toast.show(response.data.Msg);
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            key: 0,
            routes: [
              {
                name: "Drawer",
              },
              {
                name: "MyPatients",
                params: { refresh: "refresh" },
              },
            ],
          })
        );
        // this.props.navigation.navigate('MyPatients', {
        //   refresh: 'refresh',
        // });
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
  };

  OpenBookAppointment = (index) => {
    let labinfo = this.state.AllLabList[index];
    let LabId = labinfo.Labid;
    // console.log(
    //   "navigating to book appoint====================================",
    //   index,
    //   labinfo,
    //   "000000",
    //   labinfo.Labid
    // );
    this.props.navigation.navigate("SuggestTestList", {
      labinfo: labinfo,
      PatientID: PatientID,
      PatientName: PatientName,
    });
  };
  //handling onPress action
  // OpenBookAppointment = (index) => {
  //   let labinfo = this.state.AllLabList[index];
  //   //this.testSuggestToPatient(labinfo.LabId)
  //   console.log("index====================================", index, labinfo);
  //   let labname = "Lab Name: " + labinfo.LabName;
  //   Alert.alert(
  //     "Are you sure you want suggest test to " + PatientName,
  //     labname,

  //     // "Patient Name:",'afadfgsgsfg',
  //     [
  //       {
  //         text: "Cancel",
  //         onPress: () => console.log("Cancel Pressed"),
  //         style: "cancel",
  //       },
  //       { text: "OK", onPress: () => this.testSuggestToPatient(labinfo.LabId) },
  //     ],
  //     { cancelable: false }
  //   );

  //   //this.props.navigation.navigate("BookAppointment",{'labinfo':labinfo,'from':'manually'})
  // };

  render() {
    return (
      <Container>
        <CustomeHeader
          title="Lab List"
          headerId={1}
          navigation={this.props.navigation}
        />
        <Loader loading={this.state.isLoading} />

        <View
          style={{ flex: 1, flexDirection: "column", backgroundColor: "red" }}
        >
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
                backgroundColor: "white",
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
                {this.state.AllLabList.map((item, index) => {
                  return (
                    <View key={index}>
                      <LablistComp
                        index={index}
                        lablogo={{ uri: Constants.LAB_LOGO + item.LabLogo }}
                        labname={item.Labname}
                        //   price={"Rs. " + item.Total}
                        address={item.LabAddress}
                        phone={this.Decrypt(item.LabContact)}
                        btntitle={"Choose Test"}
                        onPress={() => this.OpenBookAppointment(index)}
                      ></LablistComp>
                    </View>
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
              </ScrollView>
              {this.state.AllLabList.length <= 0 &&
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
  },
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 3,
    marginLeft: 10,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 2,
    borderRadius: 5,
    backgroundColor: "white",
    elevation: 2,
  },
});
