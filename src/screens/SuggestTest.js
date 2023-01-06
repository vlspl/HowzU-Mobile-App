import React, { PureComponent } from "react";
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
  ScrollView,
  RefreshControl,
  BackHandler
} from "react-native";
import { Container } from "native-base";
import Toast from "react-native-tiny-toast";
import CustomeHeader from "../appComponents/CustomeHeader";
import PaginationLoading from "../appComponents/PaginationLoading";

import SuggestRow from "../appComponents/SuggestRow";
import Constants from "../utils/Constants";

import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import moment from "moment";

import axios from "axios";

export default class SuggestTest extends PureComponent {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      pageNo: 1,
      searchString: "",
      AllSuggetstedTest: [],
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false
    };

    // console.log("constructort==============================");
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   " Suggested Test componentWillReceiveProps==============================",
    //   nextProp
    // );
    //this.setState({selectedtestId: nextProp.route.params.testids });

    // console.log("componentDidMount==============================");
    this.setState({ pageNo: 1 });

    this.setState({ isLoading: true, AllSuggetstedTest: [] }, () => {
      this.getSuggestedTest("");
    });
  };

  componentDidMount = async () => {
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
    // console.log("componentDidMount==============================");
    this.setState({ isLoading: true, AllSuggetstedTest: [] }, () => {
      this.getSuggestedTest("");
    });
  };

  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  getSuggestedTest = async (empty) => {
    // if(empty)
    // {
    //     // console.log("**************")
    //     this.setState({AllSuggetstedTest:[]})
    // }
    try {
      let response = await axios.post(Constants.GET_SUGGESTED_TEST, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString
      });
      // console.log("data Suggested test==============", response.data);
      this.setState({ loading: false });

      if (response.data.Status) {
        let responseData = this.state.AllSuggetstedTest;

        response.data.SuggestTestList.map((item) => {
          responseData.push(item);
        });

        this.setState({
          AllSuggetstedTest: responseData,
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
    this.setState(
      {
        searchString: val,
        AllSuggetstedTest: [],
        pageNo: 1,
        searchLoading: true,
        isLoading: true
      },
      () => {
        this.getSuggestedTest(true);
      }
    );
  };

  onRefresh = async () => {
    this.setState(
      { refreshing: true, AllSuggetstedTest: [], pageNo: 1, searchString: "" },
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

  handleSelectionMultiple = (index) => {
    console.log("TestID==============================");
    var dict = {}; // create an empty array

    dict = this.state.AllSuggetstedTest[index];
    let testprices = dict["TestPrice"];
    var sum = 0;
    var pricearr = testprices.split(",");
    pricearr.forEach(function (obj) {
      sum += Number(obj);
    });

    dict["Total"] = sum;
    this.props.navigation.navigate("BookAppointment", {
      labinfo: dict,
      from: "suggested"
    });
  };

  //handling onPress action
  OpenCheckStatus = (item) => {
    //Alert.alert(item.key,item.title);
    this.props.navigation.navigate("CheckStatus");
  };

  render() {
    return (
      <Container>
        <Loader loading={this.state.isLoading} />
        <CustomeHeader
          title="Suggested  Tests "
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
              {this.state.AllSuggetstedTest.map((item, index) => (
                <SuggestRow
                  testname={item.TestName}
                  Hospital={item.LabName}
                  status={item.status}
                  BookingDate={moment(item.RecommendedDate).format(
                    " DD MMM YY, hh:mm A"
                  )}
                  TestSubtitle={item.DoctorName}
                  onPressCheckStatus={() => this.handleSelectionMultiple(index)}
                ></SuggestRow>
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
            {this.state.AllSuggetstedTest.length <= 0 &&
            !this.state.isLoading &&
            !this.state.searchLoading &&
            !this.state.refreshing ? (
              <NoDataAvailable
                onPressRefresh={this.onRefresh}
                source={require("../../icons/suggestedtestnodata.png")}
              />
            ) : null}
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
