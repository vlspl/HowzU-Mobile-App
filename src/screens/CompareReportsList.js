import React, { Component } from "react";
//import CustomListview from './Screen/DoctorList'
import axios from "axios";
import Constants from "../utils/Constants";
// import { ScrollView } from 'react-native-gesture-handler';
import Toast from "react-native-tiny-toast";
import ImageLoad from "react-native-image-placeholder";

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
  RefreshControl,
  BackHandler,
  ScrollView
} from "react-native";
import { Container } from "native-base";

import CustomeHeader from "../appComponents/CustomeHeader";
import MyReportRow from "../appComponents/MyReportRow";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import PaginationLoading from "../appComponents/PaginationLoading";
import moment from "moment";
import ActionButton from "react-native-action-button";

class CompareReportsList extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      headerId: 2,
      pageNo: 1,
      searchString: "",
      AllReportList: [],
      PendingRequestList: [],
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false
    };
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    this.setState(
      {
        pageNo: 1,
        isLoading: true,
        AllReportList: [],
        PendingRequestList: [],
        searchString: ""
      },
      () => {
        this.getRports("");
      }
    );
  };

  componentDidMount = async () => {
    // console.log('componentDidMount==============================');
    this.setState(
      {
        isLoading: true,
        AllReportList: [],
        PendingRequestList: [],
        searchString: ""
      },
      () => {
        this.getRports("");
      }
    );
  };

  OpenReportDetail = (index) => {
    let labinfo = this.state.AllReportList[index];
    // Bar graph
    this.props.navigation.navigate("CompareMyReportGraphscreen", {
      labinfo: labinfo
    });
    // Line Graph
    // this.props.navigation.navigate("TrenGraph", {
    //   labinfo: labinfo
    // });
  };

  getRports = async (empty) => {
    if (empty) {
      //  console.log("**************");
      this.setState({ AllLabList: [] });
    }
    try {
      let response = await axios.post(Constants.GET_COMPAREREPORTLIST, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString
      });
      let oldreportlist = await axios.post(
        Constants.GET_COMPARE_OLDREPORT_LIST,
        {
          pageNumber: this.state.pageNo,
          pageSize: Constants.PER_PAGE_RECORD,
          Searching: this.state.searchString
        }
      );

      this.setState({ isLoading: false });
      if (response.data.Status) {
        let responseData = this.state.AllReportList;
        // let responseData = [];

        if (oldreportlist.data.Status) {
          oldreportlist.data.ReportData.map((item) => {
            let temp = {};
            temp = item;
            responseData.push(item);
          });
        }

        response.data.ReportList.map((item) => {
          let temp = {};
          temp = item;
          temp.Flag = "";
          // temp.formatedTestDate = moment(item.ReportDate).format("DD/MM/YYYY");
          responseData.push(item);
        });

        let remove = this.removeDuplicatePrescription(responseData);
        // console.log("remove", remove);
        this.setState({
          AllReportList: this.removeDuplicatePrescription(responseData),
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      } else {
        if (oldreportlist.data.Status) {
          let responseData = this.state.AllReportList;
          oldreportlist.data.ReportData.map((item) => {
            let temp = {};
            temp = item;
            responseData.push(item);
          });

          this.setState({
            AllReportList: this.removeDuplicatePrescription(
              desendingsortarrydata
            ),
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
      }
    } catch (errors) {
      ///Toast.show(errors)

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
        this.getRports();
      }
    );
  };

  onChangeTextClick = async (val) => {
    // console.log('======', val);
    this.setState(
      { searchString: val, AllReportList: [], pageNo: 1, searchLoading: true },
      () => {
        this.getRports(true);
      }
    );
  };

  onRefresh = async () => {
    this.setState(
      {
        refreshing: true,
        AllReportList: [],
        PendingRequestList: [],
        pageNo: 1,
        searchString: ""
      },
      () => {
        this.getRports();
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

  removeDuplicatePrescription = (datalist) => {
    var newArray = [];
    var lookupObject = {};

    for (let i = 0; i < datalist.length; i++) {
      lookupObject[datalist[i].TestName] = datalist[i];
    }
    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }

    return newArray;
  };
  backbtnPress = () => {
    this.props.navigation.goBack();
  };

  render() {
    const { data, isLoading } = this.state;

    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="Trend Analysis"
          headerId={2}
          onPressback={this.backbtnPress}
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
                backgroundColor: "#F5F5F5",
                borderRadius: 20,
                height: 40,
                flexDirection: "row",
                shadowOffset: { width: 0, height: 2 },
                shadowColor: "gray",
                shadowOpacity: 0.9,
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
                style={{ flex: 1, margin: 0 }}
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
                {this.state.AllReportList.map((item, index) => (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      backgroundColor: "white"
                    }}
                    key={index}
                  >
                    <View style={styles.container}>
                      <View style={styles.photo}>
                        <ImageLoad
                          source={require("../../icons/tests-1.png")}
                          style={styles.photo}
                          placeholderSource={require("../../icons/tests-1.png")}
                          placeholderStyle={styles.placeholder}
                          borderRadius={30}
                        />
                      </View>

                      <View style={styles.container_text}>
                        <View style={styles.emailsubview}>
                          <View style={styles.titlesubview}>
                            <View style={styles.DRnamesubview}>
                              <Text style={styles.title}>{item.TestName}</Text>
                            </View>
                          </View>

                          <View style={styles.sharebtnview}>
                            <TouchableOpacity
                              style={styles.SuggestTesttouch}
                              onPress={() => this.OpenReportDetail(index)}
                            >
                              <Text style={styles.suggestbtnTitle}>
                                View Graph
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        height: 0.5,
                        backgroundColor: "#d8d8d8",
                        marginLeft: 15,
                        marginRight: 10,
                        marginTop: 5,
                        padding: 0.5
                      }}
                    ></View>
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
              {this.state.AllReportList.length <= 0 &&
                this.state.PendingRequestList.length <= 0 &&
                !this.state.isLoading &&
                !this.state.searchLoading &&
                !this.state.refreshing ? (
                <NoDataAvailable
                  onPressRefresh={this.onRefresh}
                  // source={require("../../icons/trendanyalysisnodata.jpg")}
                  source={require("../../icons/nodatafoundreport.jpg")}
                />
              ) : null}
            </View>
          </View>
        </View>
      </Container>
    );
  }
}

export default CompareReportsList;
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
    // elevation: 2,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    flexDirection: "row",
    // backgroundColor: 'gray',
    marginRight: 10,
    marginLeft: 10,
    fontWeight: "bold"
  },
  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 10,
    padding: 5,
    justifyContent: "center"
    // backgroundColor: "red",
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
    height: 60,
    width: 60,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "gray",
    shadowOpacity: 0.7,
    elevation: 5,
    borderWidth: 0,
    borderRadius: 30
  },
  placeholder: {
    height: 60,
    width: 60,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "white",
    shadowOpacity: 0.7,
    borderWidth: 0,
    borderRadius: 30
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
    // marginTop: 0,
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
    // alignSelf: "auto",

    justifyContent: "space-between",
    alignContent: "flex-end",
    marginTop: 0
    // backgroundColor: "yellow",
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
