import React, { Component } from "react";
import axios from "axios";

import Toast from "react-native-tiny-toast";
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
import ImageLoad from "react-native-image-placeholder";
import AsyncStorage from "@react-native-community/async-storage";

import CustomeHeader from "../../appComponents/CustomeHeader";
import MyReportRow from "../../appComponents/MyReportRow";
import Loader from "../../appComponents/loader";
import NoDataAvailable from "../../appComponents/NoDataAvailable";
import PaginationLoading from "../../appComponents/PaginationLoading";
import moment from "moment";
const Rijndael = require("rijndael-js");
global.Buffer = global.Buffer || require("buffer").Buffer;
const padder = require("pkcs7-padding");
import Constants from "../../utils/Constants";
class TechnicinanRegisteredUsers extends Component {
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
      refreshing: false,
      scannedmobileno: 0,
      userid: 0,
      orgid: 0
    };
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    AsyncStorage.getItem(Constants.ORG_ID).then((id) => {
      this.setState({ orgid: Number(JSON.parse(id)) });
    });
    this.setState(
      {
        pageNo: 1,
        isLoading: true,
        AllReportList: [],
        PendingRequestList: [],
        searchString: ""
      },
      () => {
        this.getSuggestedTest("");
      }
    );
  };

  componentDidMount = async () => {
    // console.log('componentDidMount==============================');
    AsyncStorage.getItem(Constants.ORG_ID).then((id) => {
      this.setState({ orgid: Number(JSON.parse(id)) });
    });

    this.setState(
      {
        isLoading: true,
        AllReportList: [],
        PendingRequestList: [],
        searchString: ""
      },
      () => {
        this.getSuggestedTest("");
        // this.getManualPunchReport('');
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
  OpenReportDetail = (index) => {
    let labinfo = this.state.AllReportList[index];
    this.props.navigation.navigate("RegUserViewDetails", {
      labinfo: labinfo
    });
  };

  AddReportDetail = (index) => {
    let labinfo = this.state.AllReportList[index];
    let scannedmobileno = this.Decrypt(labinfo.Mobile);
    this.props.navigation.navigate("TechAddreport", {
      refresh: "",
      orgid: this.state.orgid,
      usernm: scannedmobileno
    });
  };
  removeDuplicatePrescription = (datalist) => {
    // console.log('.../../Prescription',datalist);
    return datalist.filter(function (a) {
      return !this[a.UserId] && (this[a.UserId] = true);
    }, Object.create(null));
  };

  getSuggestedTest = async (empty) => {
    try {
      let response = await axios.post(Constants.GET_REG_LIST, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString
      });

      this.setState({ isLoading: false });
      if (response.data.Status) {
        let responseData = this.state.AllReportList;

        // let responseData = [];
        this.setState({ loading: false });

        response.data.MyDetails.map((item) => {
          responseData.push(item);
        });

        this.setState({
          AllReportList: this.removeDuplicatePrescription(responseData),
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      } else {
        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      }
    } catch (errors) {
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
    // console.log('======', val);
    this.setState(
      { searchString: val, AllReportList: [], pageNo: 1, searchLoading: true },
      () => {
        this.getSuggestedTest(true);
      }
    );
  };

  onRefresh = async () => {
    this.setState(
      {
        refreshing: true,
        AllReportList: [],
        PendingRequestList: [],
        pageNo: 1
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
          //width: "95%",
          backgroundColor: "gray",
          marginLeft: 20,
          marginRight: 15
        }}
      />
    );
  };

  backbtnPress = () => {
    this.props.navigation.goBack();
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
  render() {
    const { data, isLoading } = this.state;
    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="Registered User"
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
                source={require("../../../icons/search.png")}
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
                  <View style={{ flex: 1 }} key={index}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        backgroundColor: "white"
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => this.OpenReportDetail(index)}
                      >
                        <View style={styles.container}>
                          <View style={styles.photo}>
                            {/* registered */}
                            <Image
                              // source={require("../../../icons/Profile-33.png")}
                              source={require("../../../icons/registered.png")}
                              style={styles.photo}
                              // placeholderSource={require("../../../icons/Profile-33.png")}
                              placeholderSource={require("../../../icons/registered.png")}
                              placeholderStyle={styles.placeholder}
                            // borderRadius={20}
                            />
                          </View>

                          <View style={styles.container_text}>
                            <View style={styles.titlesubview}>
                              <View style={styles.DRnamesubview}>
                                <Text style={styles.title}>
                                  {item.FullName}
                                </Text>
                              </View>
                            </View>

                            <View style={styles.Mobilesubview}>
                              <Text style={styles.description}>
                                {this.Decrypt(item.Mobile)}
                              </Text>
                            </View>

                            <View style={styles.emailsubview}>
                              <TouchableOpacity
                                style={styles.touchable}
                              ></TouchableOpacity>
                              <Text style={styles.description}>
                                {this.Decrypt(item.EmailId)}
                              </Text>

                              <View style={styles.sharebtnview}>
                                <TouchableOpacity
                                  style={styles.SuggestTesttouch}
                                  onPress={() => this.OpenReportDetail(index)}
                                >
                                  <Text style={styles.suggestbtnTitle}>
                                    View
                                  </Text>
                                </TouchableOpacity>
                              </View>
                              <View
                                style={{
                                  ...styles.sharebtnview,
                                  ...{
                                    marginLeft: 10,
                                    marginRight: 5,
                                    marginBottom: 10
                                  }
                                }}
                              >
                                <TouchableOpacity
                                  style={styles.SuggestTesttouch}
                                  onPress={() => this.AddReportDetail(index)}
                                >
                                  <Text style={styles.suggestbtnTitle}>
                                    Add
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        </View>
                        {/* <View
                          style={{
                            height: 0.5,
                            backgroundColor: "#d8d8d8",
                            // backgroundColor: 'gray',
                            marginLeft: 15,
                            marginRight: 10,
                            marginTop: 5,
                            padding: 0.5
                          }}
                        ></View> */}
                      </TouchableOpacity>
                    </View>
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
                <NoDataAvailable onPressRefresh={this.onRefresh} />
              ) : null}
            </View>
          </View>
        </View>
      </Container>
    );
  }
}
export default TechnicinanRegisteredUsers;
const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white"
  },
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
    marginTop: 8,
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
    height: 60,
    width: 60,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "white",
    shadowOpacity: 0.7,
    elevation: 5,
    borderWidth: 0,
    // borderRadius: 20,
    marginTop: 5
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
