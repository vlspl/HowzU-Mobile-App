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
  RefreshControl,
  BackHandler,
  ScrollView,
  PermissionsAndroid,
  Platform
} from "react-native";
import { Container } from "native-base";
// import { ScrollView } from 'react-native-gesture-handler';
import CustomeHeader from "../appComponents/CustomeHeader";
import AppointmentRow from "../appComponents/AppointmentRow";
import axios from "axios";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import PaginationLoading from "../appComponents/PaginationLoading";
import PrescritionAppointment from "../appComponents/PrescritionAppointment";
import {
  NavigationContainer,
  CommonActions,
  StackActions
} from "@react-navigation/native";
import moment from "moment";
import Toast from "react-native-tiny-toast";
import RNFetchBlob from "rn-fetch-blob";

class Appointments extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      pageNo: 1,
      searchString: "",
      AllMyAppointment: [],
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      typingTimeout: 0,
      isLoadingSecond: false,
      typing: true,
      PendingRequestList: []
    };

    // console.log('constructort==============================');
  }

  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return (
        !this[a.BookLabId] &&
        (this[a.BookLabId] = true) &&
        !this[a.BookLabId] &&
        (this[a.BookLabId] = true)
      );
    }, Object.create(null));
  };

  removeDuplicatePrescription = (datalist) => {
    // console.log('.../../Prescription',datalist);
    return datalist.filter(function (a) {
      return !this[a.BookLabId] && (this[a.BookLabId] = true);
    }, Object.create(null));
  };
  componentDidMount = async () => {
    // console.log('componentDidMount==============================');

    this.setState(
      {
        isLoading: true,
        AllLabList: [],
        pageNo: 1,
        searchString: "",
        PendingRequestList: [],
        AllMyAppointment: []
      },
      () => {
        this.getSuggestedTest();
        // this.getTestBookedbyPrescritopn();
      }
    );
    // if (
    //   this.props.route.params != undefined &&
    //   this.props.route.params.from == 'Pay'
    // ) {
    //   console.log(
    //     'Appoitnmeehsj componentDidMount=============================='
    //   );

    //   this.backHandler = BackHandler.addEventListener(
    //     'hardwareBackPress',
    //     this.hardwarebBackAction
    //   );
    // }
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
  };

  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   ' Appointment componentWillReceiveProps==============================',
    //   nextProp
    // );

    this.setState(
      {
        pageNo: 1,
        isLoading: true,
        AllMyAppointment: [],
        searchString: "",

        PendingRequestList: []
      },
      () => {
        // this.getTestBookedbyPrescritopn();
        this.getSuggestedTest();
      }
    );
  };

  getSuggestedTest = async (empty) => {
    try {
      let response = await axios.post(Constants.GET_MY_APPOINTMENTS, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString
      });
      let prescritionresponse = await axios.post(
        Constants.GET_PRESCRIPTION_APPOINTMENT_LIST,
        {
          pageNumber: this.state.pageNo,
          pageSize: Constants.PER_PAGE_RECORD,
          Searching: this.state.searchString
        }
      );

      console.log("data==============", response.data);

      this.setState({ isLoading: false });

      if (response.data.Status) {
        let prescritionresponseData = this.state.PendingRequestList;
        let responseData = this.state.AllMyAppointment;

        if (prescritionresponse.data.Status) {
          prescritionresponse.data.AppointmentList.map((item) => {
            prescritionresponseData.push(item);
          });
        }

        response.data.AppointmentList.map((item) => {
          responseData.push(item);
        });

        this.setState({
          PendingRequestList: this.removeDuplicatePrescription(
            prescritionresponseData
          ),
          AllMyAppointment: this.removeDuplicatePrescription(responseData),
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      } else {
        let prescritionresponseData = this.state.PendingRequestList;

        if (prescritionresponse.data.Status) {
          prescritionresponse.data.AppointmentList.map((item) => {
            prescritionresponseData.push(item);
          });
          this.setState({
            PendingRequestList: this.removeDuplicatePrescription(
              prescritionresponseData
            ),
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

  // need to make changes waiting for api
  getTestBookedbyPrescritopn = async (empty) => {
    try {
      let response = await axios.post(
        Constants.GET_PRESCRIPTION_APPOINTMENT_LIST,
        {
          pageNumber: this.state.pageNo,
          pageSize: Constants.PER_PAGE_RECORD,
          Searching: this.state.searchString
        }
      );

      // console.log(
      //   'Pending list prescription booked test datadata==============',
      //   response.data
      // );

      this.setState({ isLoading: false });

      if (response.data.Status) {
        let responseData = this.state.PendingRequestList;

        response.data.AppointmentList.map((item) => {
          responseData.push(item);
        });

        this.setState({
          PendingRequestList: this.removeDuplicatePrescription(responseData),
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

      console.log(errors);
    }
  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 5;
  };

  callpagination = async () => {
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

  onChangeTextClick = async (val) => {
    // console.log("======", val);
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
            AllMyAppointment: [],
            pageNo: 1,
            searchLoading: true,
            refreshing: true
          },
          () => {
            this.getSuggestedTest();
          }
        );
      }, 1000)
    });
  };

  onRefresh = async () => {
    this.setState(
      {
        refreshing: true,
        AllMyAppointment: [],
        pageNo: 1
      },
      () => {
        this.getSuggestedTest("");
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

  OpenBookAppointment = (index) => {
    // this.backHandler.remove();
    let info = this.state.AllMyAppointment[index];

    // console.log("index====================================", index, info);
    let bookingid = info.BookLabId;

    this.props.navigation.navigate("CheckStatus", { bookingid: bookingid });
  };

  OpenPrescritionBookAppointment = (index) => {
    // this.backHandler.remove();
    let info = this.state.PendingRequestList[index];

    // console.log("index====================================", index, info);
    let bookingid = info.BookLabId;

    this.props.navigation.navigate("CheckStatus", { bookingid: bookingid });
  };
  //handling onPress action
  OpenCheckStatus = (item) => {
    //Alert.alert(item.key,item.title);
    //this.props.navigation.navigate("CheckStatus")
    // this.backHandler.remove();
    this.props.navigation.navigate("CheckStatus", {
      bookingid: response.data.BookingId
    });
  };

  checkPermission = async (img) => {
    this.setState({ isLoading: true });
    // console.log(img, "img");
    // Function to check the platform
    // If iOS then start downloading
    // If Android then ask for permission

    if (Platform.OS === "ios") {
      this.downloadImage(img);
      // this.actualDownload(img);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission Required",
            message: "App needs access to your storage to download Photos"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Once user grant the permission start downloading
          console.log("Storage Permission Granted.");
          this.downloadImage(img);
          // this.actualDownload(img);
        } else {
          // If permission denied then show alert
          alert("Storage Permission Not Granted");
        }
      } catch (err) {
        Toast.show("Something Went Wrong, Please Try Again Later");

        // To handle permission related exception
        console.warn(err);
      }
    }
  };

  getExtention = (filename) => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };
  downloadImage = (img) => {
    console.log(img, "to downlaod");
    // Main function to download the image

    // To add the time suffix in filename
    let date = new Date();
    // Image URL which we want to download
    let image_URL =
      "https://visionarylifescience.com/images/prescription/" + img;
    // Getting the extention of the file
    let ext = this.getExtention(image_URL);
    ext = "." + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          "/image_" +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: "Image"
      }
    };
    config(options)
      .fetch("GET", image_URL)
      .then((res) => {
        this.setState({ isLoading: false });
        // Showing alert after successful downloading
        console.log("res -> ", JSON.stringify(res));
        if (Platform.OS === "ios") {
          console.log("os ios ");
          RNFetchBlob.fs.writeFile(
            PictureDir +
              "/image_" +
              Math.floor(date.getTime() + date.getSeconds() / 2) +
              ext,
            res.data,
            "base64"
          );
          RNFetchBlob.ios.previewDocument(
            PictureDir +
              "/image_" +
              Math.floor(date.getTime() + date.getSeconds() / 2) +
              ext
          );
        } else {
          alert("Image Downloaded Successfully.");
        }
      })
      .catch((err) => {
        Toast.show("Something Went Wrong, Please Try Again Later");

        this.setState({ isLoading: false });
      });
  };

  actualDownload = (img) => {
    let date = new Date();
    // Image URL which we want to download
    let image_URL =
      "https://visionarylifescience.com/images/prescription/" + img;
    // Getting the extention of the file
    let ext = this.getExtention(image_URL);
    ext = "." + ext[0];
    const { dirs } = RNFetchBlob.fs;
    const dirToSave =
      Platform.OS == "ios" ? dirs.DocumentDir : dirs.DownloadDir;
    const configfb = {
      fileCache: true,
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      // title: pdfInfo.pdf,
      path:
        dirToSave +
        "/image_" +
        Math.floor(date.getTime() + date.getSeconds() / 2) +
        ext
      // path: `${dirToSave}/${pdfInfo.pdf}`,
    };
    const configOptions = Platform.select({
      ios: {
        fileCache: configfb.fileCache,
        // title: configfb.title,
        path: configfb.path,
        appendExt: ext
      },
      android: configfb
    });

    // console.log("The file saved to 23233", configfb, dirs);

    RNFetchBlob.config(configOptions)
      .fetch("GET", image_URL)
      .then((res) => {
        console.log(res, "======///downlaod complete ");
        this.setState({ isLoading: false });
        if (Platform.OS === "ios") {
          console.log("os ios ");
          RNFetchBlob.fs.writeFile(configfb.path, res.data, "base64");
          RNFetchBlob.ios.previewDocument(configfb.path);
        } else {
          alert("Image Downloaded Successfully.");
        }
        // console.log("The file saved to ", res);
      })
      .catch((e) => {
        this.setState({ isLoading: false });
        Toast.show(e.message);
        console.log("The file saved to ERROR", e.message);
      });
  };

  backbtnPress = () => {
    this.props.navigation.goBack();
    // this.props.navigation.navigate('PatientDashboard', {
    //   refresh: 'refresh',
    // });
  };
  hardwarebBackAction = () => {
    // console.log(
    //   "*******************+++++++++++++++===========AppointmetsHardware back Pressed"
    // );
    this.props.navigation.dispatch(
      StackActions.push("Drawer", { refresh: "refresh" })
    );
    // this.props.navigation.navigate('PatientDashboard', {
    //   refresh: 'refresh',
    // });
    return true;
  };

  render() {
    const { data, isLoading } = this.state;

    return (
      <Container>
        <CustomeHeader
          title="Appointments"
          headerId={2}
          onPressback={this.backbtnPress}
          navigation={this.props.navigation}
          onpress={this.OpenCheckStatus}
        />
        <Loader loading={this.state.isLoading} />

        <View
          style={{ flex: 1, flexDirection: "column", backgroundColor: "white" }}
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
                {this.state.searchLoading == false &&
                this.state.searchString == "" &&
                this.state.PendingRequestList.length != 0 ? (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      backgroundColor: "#003484"
                    }}
                  >
                    <Text
                      style={{
                        margin: 10,
                        marginLeft: 15,
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "white"
                      }}
                    >
                      Pending Approval
                    </Text>
                    <View
                      style={{
                        height: 0.5,
                        backgroundColor: "gray",
                        marginRight: 5,
                        marginTop: 5,
                        marginLeft: 15
                      }}
                    ></View>
                  </View>
                ) : null}
                {this.state.searchLoading == false &&
                  this.state.searchString == "" &&
                  this.state.PendingRequestList.map((item, index) => (
                    <View key={index}>
                      <PrescritionAppointment
                        index={index}
                        testname={"Prescription Uploaded"}
                        Hospital={item.LabName}
                        img={item.PrescriptionImage}
                        status={item.BookStatus}
                        // BookingDate={item.TestDate + ' ' + item.TimeSlot}
                        BookingDate={
                          moment(item.TestDate, "DD/MM/YYYY").format(
                            " DD MMMM YY"
                          ) +
                          "  " +
                          item.TimeSlot
                        }
                        TestSubtitle={"#" + item.BookLabId}
                        // onDownlaod={
                        //   () => this.checkPermission(item.PrescriptionImage)
                        //   // this.downlaodPrescrition(item.PrescriptionImage)
                        // }
                        onDownlaod={
                          () => this.checkPermission(item.PrescriptionImage)
                          // this.downlaodPrescrition(item.PrescriptionImage)
                        }
                        onPressCheckStatus={() =>
                          this.OpenPrescritionBookAppointment(index)
                        }
                      ></PrescritionAppointment>
                    </View>
                  ))}
                {this.state.AllMyAppointment.length != 0 ? (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      backgroundColor: "#003484"
                    }}
                  >
                    <Text
                      style={{
                        margin: 10,
                        marginLeft: 15,
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "white"
                      }}
                    >
                      My Appointments
                    </Text>
                    <View
                      style={{
                        height: 0.5,
                        backgroundColor: "gray",
                        marginRight: 5,
                        marginTop: 5,
                        marginLeft: 15
                      }}
                    ></View>
                  </View>
                ) : null}
                {this.state.AllMyAppointment.map((item, index) => (
                  <View key={index}>
                    <AppointmentRow
                      index={index}
                      testname={
                        item.TestProfileName == ""
                          ? "Prescription Uploaded"
                          : item.TestProfileName
                      }
                      Hospital={item.LabName}
                      status={item.BookStatus}
                      // BookingDate={item.TestDate + ' ' + item.TimeSlot}
                      BookingDate={
                        moment(item.TestDate, "DD/MM/YYYY").format(
                          " DD MMMM YY"
                        ) +
                        "  " +
                        item.TimeSlot
                      }
                      TestSubtitle={"#" + item.BookLabId}
                      onPressCheckStatus={() => this.OpenBookAppointment(index)}
                    ></AppointmentRow>
                  </View>
                ))}

                <View>
                  {this.state.paginationLoading ? <PaginationLoading /> : null}
                </View>
                <View style={{ flex: 1, height: 10 }}>
                  {this.state.searchLoading ? (
                    <Loader loading={this.state.isLoading} />
                  ) : null}
                </View>
              </ScrollView>
              {this.state.AllMyAppointment.length <= 0 &&
              this.state.PendingRequestList.length <= 0 &&
              !this.state.isLoading &&
              !this.state.searchLoading &&
              !this.state.refreshing ? (
                // <NoDataAvailable onPressRefresh={this.onRefresh} />
                <View
                  style={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center"
                    // margin: 10
                  }}
                >
                  <Image
                    source={require("../../icons/nodataAppointment.jpeg")}
                    style={{
                      height: 300,
                      width: "100%"
                    }}
                  />
                  <TouchableOpacity onPress={this.onRefresh}>
                    {/* <Text style={{ color: 'green' ,backgroundColor:'white'}}>click to refresh</Text> */}
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </Container>
    );
  }
}

export default Appointments;
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
