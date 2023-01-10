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
  TextInput,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  BackHandler
} from "react-native";
import { Container } from "native-base";
import axios from "axios";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import LablistComp from "../appComponents/LablistComp";
import CustomeHeader from "../appComponents/CustomeHeader";
import PaginationLoading from "../appComponents/PaginationLoading";
const Rijndael = require("rijndael-js");
//const bufferFrom = require('buffer-from')
global.Buffer = global.Buffer || require("buffer").Buffer;
var TestID = "";
var Testcount = "";
var temparray = [];

export default class LabListScreen extends Component {
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
      isLoadingSecond: false,
      typingTimeout: 0,
      typing: true
    };
  }

  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return !this[a.LabId] && (this[a.LabId] = true);
    }, Object.create(null));
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   " LAB LIST componentWillReceiveProps==============================",
    //   nextProp.route.params.testids,
    //   "Next props=====",
    //   nextProp
    // );

    TestID = nextProp.route.params.testids;
    temparray = [];
    //this.setState({testIdsStr: nextProp.route.params.testids });
    Testcount = nextProp.route.params.testids.split(",").length;
    // console.log("test  LIST testIdsStr ==============================", TestID);
    // console.log(
    //   "test  LIST Testcount ==============================",
    //   Testcount
    // );

    // this.setState({testcount: count});
    this.setState(
      { isLoading: true, AllLabList: [], searchString: "", pageNo: 1 },
      () => {
        this.getLabList();
      }
    );
  };

  componentDidMount = () => {
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
    // console.log(
    //   "LAB LIST componentDidMount==============================",
    //   this.props.route.params.testids,
    //   "props=====",
    //   this.props
    // );
    temparray = [];
    TestID = this.props.route.params.testids;
    //this.setState({testIdsStr: nextProp.route.params.testids });
    Testcount = this.props.route.params.testids.split(",").length;
    // console.log("test  LIST testIdsStr ==============================", TestID);
    // console.log(
    //   "test  LIST Testcount ==============================",
    //   Testcount
    // );
    this.setState(
      { isLoading: true, AllLabList: [], searchString: "", pageNo: 1 },
      () => {
        this.getLabList();
      }
    );
  };

  getLabList = async (empty) => {
    if (empty) {
      //  console.log("**************");
      this.setState({ AllLabList: [] });
    }
    try {
      let response = await axios.post(Constants.GET_LABLIST, {
        TestList: TestID,
        TestCount: Testcount,
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString
      });
      // console.log(
      //   "data LABLIST ==============",
      //   "response data",
      //   response.data,
      //   "lablist data->",
      //   response.data.LabList,
      //   this.state.pageNo
      // );
      this.setState({ isLoading: false });

      if (response.data.Status) {
        //let responseData = this.state.AllLabList
        // console.log("data LABLIST ==============");
        // let temparray = [];
        response.data.LabList.map((item) => {
          // console.log(item, "mapping lablist item");
          let temp = {};
          temp.LabId = item.LabId;
          temp.LabName = item.LabName;
          temp.LabAddress = item.LabAddress;
          temp.LabContact = item.LabContact;
          temp.LabLocation = item.LabLocation;
          temp.LabLogo = item.LabLogo;
          temp.LabEmailId = item.LabEmailId;
          temp.LabOnlinePayment = item.LabOnlinePayment;
          temp.Total = 0;
          temp.Testids = "";
          temp.Testidprices = "";
          temp.Testnames = "";
          let totalamount = 0;
          let totaltestids = "";
          let totaltestprices = 0;
          let totaltestnames = "";

          item.TestDetailList.map((subitem) => {
            let price = subitem.Price == null ? 0 : subitem.Price;

            totalamount = Number(price) + totalamount;
            totaltestids = subitem.TestId + "," + totaltestids;
            totaltestprices = price + "," + totaltestprices;
            totaltestnames = subitem.TestName + "," + totaltestnames;
          });

          temp.Total = totalamount;
          temp.Testids = totaltestids;
          temp.Testidprices = totaltestprices;
          temp.Testnames = totaltestnames;

          temparray.push(temp);
        });

        this.setState({
          AllLabList: this.removeDuplicate(temparray),
          // AllLabList: temparray,
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
    // console.log("Pagination lab list screen ");
    this.setState(
      { paginationLoading: true, pageNo: this.state.pageNo + 1 },
      () => {
        this.getLabList();
      }
    );
  };

  onChangeTextClick = async (val) => {
    temparray = [];
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
            AllLabList: [],
            pageNo: 1,
            searchLoading: true
          },
          () => {
            this.getLabList(true);
          }
        );
      }, 1000)
    });
  };

  onRefresh = async () => {
    temparray = [];
    this.setState(
      { refreshing: true, AllLabList: [], pageNo: 1, searchString: "" },
      () => {
        this.getLabList();
      }
    );
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

  onComeBackAgain = () => {
    // console.log(
    //   "===================================Come back again user profile",
    //   this.props.navigation.pop(1)
    // );
    // this.setState(
    //   {
    //     userDetails: [],
    //     isLoading: true,
    //   },
    //   () => {
    //     this.getProfileDetail();
    //   }
    // );
    // var role = AsyncStorage.getItem(Constants.ACCOUNT_ROLE);
    // this.props.navigation.reset('PatientDashboard', {
    //   refresh: 'refresh',
    //   role: role,
    // });
  };

  //handling onPress action
  OpenBookAppointment = (index) => {
    let labinfo = this.state.AllLabList[index];
    this.props.navigation.navigate("BookAppointment", {
      labinfo: labinfo,
      from: "manually"
      // comeback: this.onComeBackAgain,
    });
  };

  hardwarebBackAction = () => {
    // console.log(this.props, "**************LAblist screen");
    this.props.route.params.oncomeback();
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };

  render() {
    const { data, isLoading } = this.state;

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
              alignItems: "center"
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
                  />
                }
              >
                {this.state.AllLabList.map((item, index) => {
                  return (
                    <LablistComp
                      index={index}
                      lablogo={{ uri: Constants.LAB_LOGO + item.LabLogo }}
                      labname={item.LabName}
                      price={"Rs. " + item.Total}
                      address={item.LabAddress}
                      phone={this.Decrypt(item.LabContact)}
                      btntitle={"Book Test"}
                      onPress={() => this.OpenBookAppointment(index)}
                    ></LablistComp>
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
    backgroundColor: "white"
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
    elevation: 2
  }
});
