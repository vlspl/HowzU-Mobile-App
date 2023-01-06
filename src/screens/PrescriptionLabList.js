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
  ActivityIndicator,
  ScrollView,
  RefreshControl,
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

export default class PrescriptionLabList extends Component {
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
      typingTimeout: 0,
      isLoadingSecond: false,
      typing: true,
    };
  }

  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return !this[a.Labid] && (this[a.Labid] = true);
    }, Object.create(null));
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   'Pescription Lab List  LAB LIST componentWillReceiveProps=============================='
    //   //typeof nextProp.route.params.testids
    // );

    // this.setState({testcount: count});
    this.setState(
      { isLoading: true, AllLabList: [], pageNo: 1, searchString: "" },
      () => {
        this.getLabList();
      }
    );
  };

  componentDidMount = () => {
    // console.log(
    //   '####Prescrition LAB LIST componentDidMount=============================='
    //   // this.props.route.params.testids
    // );

    this.setState(
      { isLoading: true, AllLabList: [], pageNo: 1, searchString: "" },
      () => {
        this.getLabList();
      }
    );
  };

  getLabList = async () => {
    try {
      let response = await axios.post(Constants.GET_PRESCRIPLABLIST, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString,
      });
      // console.log(
      //   'data LABLIST For prescrition to book appoi ==============',
      //   response.data.LabList
      // );
      this.setState({ isLoading: false });

      if (response.data.Status) {
        let responseData = this.state.AllLabList;
        //let responseData = this.state.AllReportList;

        response.data.LabList.map((item) => {
          responseData.push(item);
        });

        this.setState({
          // AllLabList: responseData,
          AllLabList: this.removeDuplicate(responseData),
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false,
        });
      } else {
        Toast.show(response.data.Msg);

        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false,
        });
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
        this.getLabList();
      }
    );
  };

  onChangeTextClick = async (val) => {
    // console.log('======', val);

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
            searchLoading: true,
            refreshing: true,
          },
          () => {
            this.getLabList();
          }
        );
      }, 1000),
    });
    // this.setState(
    //   { searchString: val, AllLabList: [], pageNo: 1, searchLoading: true },
    //   () => {
    //     this.getLabList();
    //   }
    // );
  };

  onRefresh = async () => {
    this.setState({ refreshing: true, AllLabList: [], pageNo: 1 }, () => {
      this.getLabList();
    });
  };

  //handling onPress action
  OpenBookAppointment = (index) => {
    let labinfo = this.state.AllLabList[index];
    // console.log('index====================================', index, labinfo);
    this.props.navigation.navigate("PrescriptionBookAppoint", {
      labinfo: labinfo,
      from: "manually",
    });
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

  render() {
    return (
      <Container>
        <CustomeHeader
          title="Lab List "
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
                    //colors='red'
                  />
                }
              >
                {this.state.AllLabList.map((item, index) => {
                  return (
                    <View key={index}>
                      <LablistComp
                        lablogo={{ uri: Constants.LAB_LOGO + item.LabLogo }}
                        labname={item.Labname}
                        address={item.LabAddress}
                        phone={this.Decrypt(item.LabContact)}
                        onPress={() => this.OpenBookAppointment(index)}
                        btntitle="Book Test"
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
