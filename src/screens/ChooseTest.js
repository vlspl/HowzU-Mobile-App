import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl
} from "react-native";
import { Container } from "native-base";
// import { ScrollView } from 'react-native-gesture-handler';
import CustomeHeader from "../appComponents/CustomeHeader";
import axios from "axios";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import TestListRow from "../appComponents/TestListRow";
import Toast from "react-native-tiny-toast";
import PaginationLoading from "../appComponents/PaginationLoading";

export default class ChooseTest extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      selectedIds: [],
      selectedtestprices: [],
      AllTestList: [],
      pageNo: 1,
      searchString: "",
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      typingTimeout: 0,
      isLoadingSecond: false,
      typing: true,
      LabId: 0,
      labinfo: [],
      data: []
    };
    // console.log('constructort==============================');
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   " ALL TEST list componentWillReceiveProps==============================",
    //   nextProp
    // );
    this.setState(
      {
        selectedIds: [],
        selectedtestprices: [],
        isLoading: true,
        AllTestList: [],
        pageNo: 1,
        searchString: "",
        LabId: nextProp.route.params.labinfo.Labid,
        labinfo: nextProp.route.params.labinfo
      },
      () => {
        this.getSuggestedTest("");
      }
    );
  };

  handleSelectionMultiple = (id, price, testname) => {
    // console.log(
    //   "All test List",
    //   this.state.data,
    //   "All test List handel selection multiple==============================",

    //   this.state.selectedIds
    // );

    var selectedIds = [...this.state.selectedIds]; // clone state
    var data = [...this.state.data];

    // var seletedTest = this.state.AllTestList[index];
    var selectedtestprices = [...this.state.selectedtestprices];
    var totalprice = 0;
    // console.log(data, "@@@@@@@@@.//././");
    // console.log("$$$$$$$", selectedIds);
    if (selectedIds.includes(id)) {
      selectedIds = selectedIds.filter((_id) => _id !== id);
      data = data.filter((testid) => {
        // console.log(testid.id);
        testid.id !== id;
      });
    } else {
      selectedIds.push(id);

      selectedtestprices.push(price);
      let temp = {};
      temp.id = id;
      temp.price = price;
      temp.TestName = testname;
      data.push(temp);
      //   totalprice += price;
      //   console.log(totalprice, "////else inside", id);
    }
    this.setState({ selectedIds, data });
    // console.log(totalprice, "////ePrcie inside");
  };

  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return !this[a.TestId] && (this[a.TestId] = true);
    }, Object.create(null));
  };

  componentDidMount() {
    // console.log(this.props, "choose ");
    this.setState(
      {
        selectedIds: [],
        selectedtestprices: [],
        isLoading: true,
        pageNo: 1,
        AllTestList: [],
        LabId: this.props.route.params.labinfo.Labid,
        labinfo: this.props.route.params.labinfo
      },
      () => {
        this.getSuggestedTest("");
      }
    );
  }

  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  getSuggestedTest = async (empty) => {
    // console.log(this.state.searchString, "Searching srtin ", this.state.LabId);

    try {
      let response = await axios.post(Constants.GET_TESTLIST_FOR_BOOKING, {
        LabId: this.state.LabId,
        pageNumber: this.state.pageNo,
        // pageSize: Constants.PER_PAGE_RECORD,
        pageSize: 20,
        Searching: this.state.searchString
      });

      this.setState({ isLoading: false });

      if (response.data.Status) {
        let responseData = this.state.AllTestList;

        response.data.TestList.map((item) => {
          responseData.push(item);
        });

        this.setState({
          AllTestList: this.removeDuplicate(responseData),
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
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        searchLoading: false,
        refreshing: false
      });
      console.log(errors);
    }
  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    if (contentSize.height < 665) {
    }

    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 5;
  };

  callpagination = async () => {
    // console.log("Pagination of test list ");
    this.setState(
      {
        paginationLoading: true,
        pageNo: this.state.pageNo + 1
      },
      () => {
        this.getSuggestedTest();
      }
    );
  };

  onChangeTextClick = (val) => {
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
            AllTestList: [],
            pageNo: 1,
            searchLoading: true,
            refreshing: true
          },
          () => {
            this.getSuggestedTest(true);
          }
        );
      }, 1000)
    });
  };

  onRefresh = async () => {
    // console.log("refreshing the data");
    this.setState(
      {
        refreshing: true,
        AllTestList: []
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
          backgroundColor: "gray",
          marginLeft: 20,
          marginRight: 15
        }}
      />
    );
  };

  onComeBackAgain = () => {
    // console.log(
    //   "===================================Come back again user profile",
    //   this.props.navigation.pop(1)
    // );

    this.setState(
      {
        userDetails: [],
        isLoading: true
      },
      () => {
        this.getProfileDetail();
      }
    );
    var role = AsyncStorage.getItem(Constants.ACCOUNT_ROLE);
  };

  //handling onPress action
  OpenCheckStatus = () => {
    //Alert.alert(item.key,item.title);

    // console.log("*****ProcProceed callllllll==============================");
    const myObjStr = this.state.selectedIds.toString();

    const bookinginfo = [];
    var temp = this.state.labinfo;
    // temp.Testids = myObjStr;
    let totalamount = 0;
    let totaltestids = "";
    let totaltestprices = "";
    let totaltestnames = "";
    temp.Testcount = myObjStr.split(",").length;
    this.state.data.map((subitem) => {
      //   console.log(subitem, "./././././/.@@");
      let temptests = {};

      totalamount = Number(subitem.price) + totalamount;
      totaltestids = subitem.id + "," + totaltestids;
      totaltestprices = subitem.price + "," + totaltestprices;
      totaltestnames = subitem.TestName + "," + totaltestnames;
    });
    temp.Total = totalamount;
    temp.Testids = totaltestids;
    temp.Testidprices = totaltestprices;
    temp.Testnames = totaltestnames;
    temp.LabId = temp.Labid;

    temp.LabName = this.state.labinfo.Labname;

    bookinginfo.push(temp);

    this.props.navigation.navigate("BookAppointment", {
      labinfo: this.state.labinfo,
      from: "manually"
    });
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
              {this.state.AllTestList.map((item, index) => (
                <View key={index}>
                  <TestListRow
                    testname={item.TestName}
                    profile={item.ProfileName}
                    price={item.Price}
                    checkboximg={
                      this.state.selectedIds.includes(item.TestId)
                        ? require("../../icons/checkbox.png")
                        : require("../../icons/checkbox_1.png")
                    }
                    onPress={() =>
                      this.handleSelectionMultiple(
                        item.TestId,
                        item.Price,
                        item.TestName
                      )
                    }
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

          {this.state.AllTestList.length <= 0 &&
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
  },
  image: {
    height: 22,
    width: 22,
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: 5
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
