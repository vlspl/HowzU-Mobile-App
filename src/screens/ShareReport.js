import React, { Component } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
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
const Rijndael = require("rijndael-js");
global.Buffer = global.Buffer || require("buffer").Buffer;

export default class SharedReport extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      pageNo: 1,
      searchString: "",
      SharedReportDoclist: [],
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      typingTimeout: 0,
      isLoadingSecond: false,
      typing: true
    };
  }

  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return !this[a.DoctorId] && (this[a.DoctorId] = true);
    }, Object.create(null));
  };

  OpenBookTest = (index) => {
    let doctinfo = this.state.SharedReportDoclist[index];
    // console.log("index====================================", index, doctinfo);
    this.props.navigation.navigate("SharedDoctorList", { docinfo: doctinfo });
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   " Share Report componentWillReceiveProps==============================",
    //   nextProp
    // );
    this.setState(
      { isLoading: true, SharedReportDoclist: [], pageNo: 1 },
      () => {
        this.getSharedRepDocList("");
      }
    );
  };

  componentDidMount = async () => {
    // console.log("componentDidMount==============================");
    this.setState(
      { isLoading: true, SharedReportDoclist: [], pageNo: 1 },
      () => {
        this.getSharedRepDocList("");
      }
    );
  };

  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  getSharedRepDocList = async (empty) => {
    if (empty) {
      // console.log("**************")
      this.setState({ SharedReportDoclist: [] });
    }
    try {
      let response = await axios.post(Constants.GET_SHAREDREPORT_DOCLIST, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString
      });
      // console.log('GET_SHAREDREPORT_DOCLIST==============', response.data);
      this.setState({ loading: false });

      if (response.data.Status) {
        if (this.state.searchString) {
          this.setState({ SharedReportDoclist: [] });
        }
        let responseData = this.state.SharedReportDoclist;

        response.data.DoctorList.map((item) => {
          responseData.push(item);
        });

        this.setState({
          SharedReportDoclist: this.removeDuplicate(responseData),
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
        this.getSharedRepDocList();
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
  onChangeTextClick = async (val) => {
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
            SharedReportDoclist: [],
            pageNo: 1,
            searchLoading: true
          },
          () => {
            this.getSharedRepDocList(true);
          }
        );
      }, 1000)
    });
  };

  onRefresh = async () => {
    this.setState({ SharedReportDoclist: [], refreshing: true }, () => {
      this.getSharedRepDocList();
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

  //handling onPress action
  getListViewItem = (item) => {
    Alert.alert(item.key, item.title);
  };

  render() {
    const { navigate } = this.props.navigation;
    const { data, isLoading } = this.state;

    return (
      <Container>
        <Loader loading={this.state.isLoading} />
        <CustomeHeader title="Doctors" navigation={this.props.navigation} />

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

          <View style={{ flex: 1 }}>
            <ScrollView
              onScroll={({ nativeEvent }) => {
                if (this.isCloseToBottom(nativeEvent)) {
                  this.callpagination();
                }
              }}
            >
              {this.state.SharedReportDoclist.map((item, index) => (
                <View style={{ flex: 1, flexDirection: "column" }}>
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
                      <View style={styles.titlesubview}>
                        <View style={styles.DRnamesubview}>
                          <Text style={styles.title}>{item.DoctorName}</Text>
                        </View>

                        <View style={styles.sharebtnview}>
                          <TouchableOpacity style={styles.SuggestTesttouch}>
                            <Image style={styles.Icons} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.Mobilesubview}>
                        <TouchableOpacity style={styles.touchable}>
                          <Image
                            source={require("../../icons/call.png")}
                            //source = {{uri:'https://reactnative.dev/img/tiny_logo.png'}}
                            style={styles.Iconcall}
                          />
                        </TouchableOpacity>
                        {/* <Text style={styles.description}>9890000000</Text> */}
                        <Text style={styles.description}>
                          {this.Decrypt(item.Mobile)}
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
                          <TouchableOpacity style={styles.touchable}>
                            <Image
                              source={require("../../icons/email-1.png")}
                              //source = {{uri:'https://reactnative.dev/img/tiny_logo.png'}}
                              style={styles.Iconsemail}
                            />
                          </TouchableOpacity>

                          {/* <Text style={styles.email}>test@gmail.com</Text> */}
                          <Text style={styles.email} numberOfLines={1}>
                            {this.Decrypt(item.EmailId)}
                          </Text>
                        </View>

                        <View style={styles.Reportview}>
                          <TouchableOpacity
                            style={styles.SuggestTesttouch}
                            onPress={() => this.OpenBookTest(index)}
                          >
                            <Image
                              source={require("../../icons/view.png")}
                              //source = {{uri:'https://reactnative.dev/img/tiny_logo.png'}}
                              style={styles.eyeicon}
                            />

                            <Text style={styles.suggestbtnTitle}>
                              View Reports
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      height: 0.5,
                      backgroundColor: "gray",
                      marginLeft: 15,
                      marginRight: 10,
                      marginTop: 5
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
            {this.state.SharedReportDoclist.length <= 0 &&
            !this.state.isLoading &&
            !this.state.searchLoading &&
            !this.state.refreshing ? (
              <NoDataAvailable
                onPressRefresh={this.onRefresh}
                source={require("../../icons/sharedreportnodata.jpg")}
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
    backgroundColor: "white",
    justifyContent: "center"
  },
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 5,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10,
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
    marginLeft: 15,
    justifyContent: "center",
    backgroundColor: "white"
  },
  description: {
    fontSize: 13,
    marginTop: 2,
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
    height: 60,
    width: 60,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "gray",
    shadowOpacity: 0.7,
    marginLeft: 5,
    // elevation: 5,
    borderWidth: 0,
    borderRadius: 34
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
    flexDirection: "row"
    //marginTop:5
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
    marginTop: 10
  }
});
