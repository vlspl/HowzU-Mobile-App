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
import AsyncStorage from "@react-native-community/async-storage";
import CustomeHeader from "../appComponents/CustomeHeader";
import PaginationLoading from "../appComponents/PaginationLoading";

import TestListRow from "../appComponents/TestListRow";

import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";

import axios from "axios";
import Constants from "../utils/Constants";
let id;
export default class OrganizationTest extends PureComponent {
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
      refreshing: false,
      orgid: 0,
      selectedIds: []
    };
    //  /   this.retriveData();
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // this.retriveData();
    this.setState(
      {
        isLoading: true,
        AllSuggetstedTest: [],
        orgid: nextProp.route.params.orgid
      },
      () => {
        this.getSuggestedTest("");
      }
    );
  };

  retriveData = () => {
    let id;
    AsyncStorage.getItem(Constants.ORG_ID).then((val) => {
      id = Number(JSON.parse(val));
      //   console.log(val, "././././././././", id, parseInt(val));
      this.setState({ orgid: id });
    });
  };
  componentDidMount = () => {
    // this.retriveData();
    this.setState(
      {
        isLoading: true,
        orgid: this.props.route.params.orgid,
        AllSuggetstedTest: []
      },
      () => {
        this.getSuggestedTest();
        //   console.log("oooooooooo", id, this.state.orgid);
      }
    );
  };

  getSuggestedTest = async () => {
    //  "http://endpoint.visionarylifescience.com/Enterprise/EnterPriseLabTestList/"
    if (this.state.orgid != 0) {
      try {
        let response = await axios.get(
          Constants.ENTERPRSE_LABTESTLIST + this.state.orgid
        );
        // http://endpoint.visionarylifesciences.in/Enterprise/EnterPriseLabTestList/42
        // console.log("./.?????org Suggested test==============", response.data);
        this.setState({ loading: false });

        if (response.data.Status) {
          let responseData = this.state.AllSuggetstedTest;

          response.data.TestList.map((item) => {
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

        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
        // console.log(errors);
      }
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
    // console.log("======", val);
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

  //   handleSelectionMultiple = (index) => {
  //     console.log("TestID==============================");
  //     var dict = {}; // create an empty array

  //     dict = this.state.AllSuggetstedTest[index];
  //     let testprices = dict["TestPrice"];
  //     var sum = 0;
  //     var pricearr = testprices.split(",");
  //     pricearr.forEach(function (obj) {
  //       sum += Number(obj);
  //     });

  //     console.log("Total Price ==============================", dict);

  //     ///dict.set("Total", sum);
  //     dict["Total"] = sum;
  //     console.log("Total Price ==============================", dict);

  //     //console.log('index====================================',index,dict)

  //     this.props.navigation.navigate("BookAppointment", {
  //       labinfo: dict,
  //       from: "suggested",
  //     });
  //   };

  //handling onPress action
  handleSelectionMultiple = (id) => {
    // console.log(
    //   "All test List handel selection multiple==============================",
    //   id
    // );

    var selectedIds = [...this.state.selectedIds]; // clone state

    // console.log("$$$$$$$", selectedIds);
    if (selectedIds.includes(id)) {
      // console.log("Inside if /////", id);
      selectedIds = selectedIds.filter((_id) => _id !== id);
    } else {
      selectedIds.push(id);
      // console.log("////else inside", id);
    }
    this.setState({ selectedIds });
  };
  OpenCheckStatus = (item) => {
    //Alert.alert(item.key,item.title);
    // this.props.navigation.navigate("CheckStatus");

    const myObjStr = this.state.selectedIds.toString();
    if (this.state.selectedIds.length == 0) {
      Toast.show("Please Select Test");
    } else {
      this.props.navigation.navigate("LabListScreen", {
        testids: myObjStr
        // comeback: this.onComeBackAgain,
      });
    }
  };

  render() {
    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="Test List"
          headerId={1}
          navigation={this.props.navigation}
        />

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
                paddingLeft: 10,
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
              {this.state.AllSuggetstedTest.map((item, index) => (
                <View key={index}>
                  <TestListRow
                    testname={item.TestName}
                    profile={item.ProfileName}
                    checkboximg={
                      this.state.selectedIds.includes(item.TestId)
                        ? require("../../icons/checkbox.png")
                        : require("../../icons/checkbox_1.png")
                    }
                    onPress={() => this.handleSelectionMultiple(item.TestId)}
                  ></TestListRow>
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
          </View>

          {this.state.AllSuggetstedTest.length <= 0 &&
            !this.state.isLoading &&
            !this.state.searchLoading &&
            !this.state.refreshing ? (
            <NoDataAvailable onPressRefresh={this.onRefresh} />
          ) : null}
        </View>

        <TouchableOpacity
          style={{
            height: 50,
            backgroundColor: "#275BB4",
            marginBottom: 0,
            alignContent: "center",
            alignItems: "center",
            flexDirection: "row"
          }}
          onPress={this.OpenCheckStatus}
        >
          {this.state.selectedIds.length != 0 ? (
            <Text
              style={{
                color: "white",
                fontSize: 16,
                textAlign: "left",
                marginLeft: 10
              }}
            >
              {this.state.selectedIds.length + " Item Selected"}
            </Text>
          ) : null}

          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 20,
              textAlign: "left",
              marginLeft: 20
            }}
          >
            Proceed
          </Text>
        </TouchableOpacity>
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
