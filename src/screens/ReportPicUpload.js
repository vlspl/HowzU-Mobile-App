import React from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  BackHandler,
  PermissionsAndroid,
} from "react-native";

import Constants from "../utils/Constants";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import CustomeHeader from "../appComponents/CustomeHeader";
import axios from "axios";
import Modal from "react-native-modal";
import Toast from "react-native-tiny-toast";
import { CommonActions } from "@react-navigation/native";
import ImagePicker from "react-native-image-crop-picker";
import { launchImageLibrary } from "react-native-image-picker";

export default class ReportPicUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activebtn: "FEET",

      isLoading: false,
      pageNo: 1,
      searchString: "",
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      selectedIds: [],

      prescriptionName: "",
      prescriptionPic: [],
      progess: 0,
      prescriptionUri: null,
      imagePath: "",
      addressinput: "",
      isPrescription: false,
    };
  }

  uploadPrescription = () => {
    var that = this;

    this.setState({ isUploading: true });
    let form = new FormData();

    //if (this.state.prescriptionPic.length>0) {
    form.append("", {
      name: this.state.prescriptionPic[0].name,
      uri:
        Platform.OS === "android"
          ? this.state.prescriptionPic[0].uri
          : "file://" + this.state.prescriptionPic[0].uri,
      // uri:  Platform.OS === "android" ? this.state.prescriptionPic[0].uri : this.state.prescriptionPic[0].uri.replace("file://", ""),
      // uri: 'file://' + this.state.prescriptionPic[0].uri,
      type: this.state.prescriptionPic[0].type,
    });
    //}
    axios({
      method: "post",
      url: Constants.UPLOAD_REPORTIMG,
      data: form,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress(progressEvent) {
        // console.log(progressEvent, "uplade ");
        that.setState({
          size: progressEvent.total,
          progresss: progressEvent.loaded / progressEvent.total,
        });
      },
    })
      .then((response) => {
        // console.log(" else  response data =================", response.data);
        var responseObj = JSON.parse(response.data);
        // console.log(" else  response Path =================", responseObj.Path);

        if (responseObj.Status) {
          this.setState(
            { imagePath: responseObj.Path, isUploading: true },
            () => {
              this.BookAppointments();
            }
          );
        } else {
          this.setState({ isUploading: false, isLoading: false });
          Toast.show(responseObj.data.Msg);
          // console.log(" else  response =================", responseObj);
        }
      })
      .catch((e) => {
        Toast.show("Something Went Wrong, Please Try Again Later");
        this.setState({ isUploading: false, isLoading: false });

        console.log("error response=================", e);
      });
  };

  RemoveMethod(key) {
    const AnalyteTempList = { ...this.state.AnalyteTempList };
    delete AnalyteTempList[key];
    this.setState(
      {
        AnalyteTempList: AnalyteTempList,
      },
      () => {
        this.BookAppointments();
      }
    );
  }

  BookAppointments = async () => {
    // console.log(
    //   "AnalyteTempList APi data  =================",
    //   this.state.imagePath
    // );

    try {
      let response = await axios.get(
        Constants.UPLOAD_REPORTPUNCH + this.state.imagePath,
        {}
      );
      this.setState({ isLoading: false });

      if (response.data.Status) {
        this.setState({ isLoading: false });
        Toast.show(response.data.Msg);
        // console.log(this.props, "book appoitmner");

        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: "Drawer",
                params: { refresh: true },
              },
              {
                name: "MyReports",
                params: { refresh: true },
              },
            ],
          })
        );
      } else {
        Toast.show(response.data.Msg);
        this.setState({ isLoading: false });
      }
    } catch (errors) {
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ isLoading: false });
      console.log(errors);
    }
  };

  onPressLifestyle = () => {
    //Alert.alert(item.key,item.title);
    // console.log("calllllllllllll response=================", this.props);
    this.props.navigation.navigate("LifeDisorderTestList");
  };

  onPressMyDoctor = () => {
    // console.log("onPressMyDoctor=================");
    this.props.navigation.navigate("MyDoctors");
  };

  onPressMyReport = () => {
    // console.log("onPressMyDoctor=================");
    this.props.navigation.navigate("MyReports");
  };

  onPressAppointment = () => {
    console.log("onPressMyDoctor=================");
    this.props.navigation.navigate("Appointments");
  };

  handleMyHealth = (index) => {
    let info = this.state.myhealthlist[index];
    // console.log(
    //   " handleMyHealth index====================================",
    //   index,
    //   info
    // );
    this.props.navigation.navigate("Myhealthgraph", { info: info });
  };

  handleRecentTest = (index) => {
    let info = this.state.recenttestlist[index];
    // console.log(
    //   " handleRecentTest index====================================",
    //   index,
    //   info
    // );
    let bookingid = info.BookingId;

    this.props.navigation.navigate("CheckStatus", { bookingid: bookingid });
  };

  handleUpcommingTest = (index) => {
    let info = this.state.Upcommingtestlist[index];
    // console.log(
    //   " handleUpcommingTest index====================================",
    //   index,
    //   info
    // );
    let bookingid = info.BookingId;

    this.props.navigation.navigate("CheckStatus", { bookingid: bookingid });
  };

  handleSelectionMultiple = (testid, testname) => {
    // console.log("TestID==============================", testid);
    this.setState(
      {
        selectedId: testid,
        testName: testname,
      },
      () => {
        this.DismissModal();
        this.ReportManualPunchAPI();
      }
    );
  };

  handleLifeStyleDisorder = (index) => {
    // console.log("TestID==============================");

    let info = this.state.lifestyledisorder[index];

    // console.log(
    //   " disorder index====================================",
    //   index,
    //   info
    // );

    this.props.navigation.navigate("LifeDisorderTestList", { disorder: info });
  };

  componentDidMount() {
    // console.log(
    //   "componentDidMount FOCUSSSSSSSS=====TestLIST==============================",
    //   this.props.route
    // );
    this.setState(
      {
        selectedIds: [],
        isLoading: false,
      },
      () => {}
    );
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   " ALL TEST list componentWillReceiveProps==============================",
    //   nextProp.route
    // );
    this.setState(
      {
        selectedIds: [],
        isLoading: false,
        AllTestList: [],
      },
      () => {}
    );
  };
  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };

  toggleModal = () => {
    /// this.setState({isModalVisible: !this.state.isModalVisible});

    this.getSuggestedTest("");
    this.setState({ isModalVisible: !this.state.isModalVisible });
    // this.setState(
    //     {
    //       selectedIds: [],
    //       isLoading: true,
    //       AllTestList: [],
    //       //isModalVisible: !this.state.isModalVisible
    //     },
    //     () => {
    //       this.getSuggestedTest('');
    //     }
    //   );
  };

  togglePicker = (resultarray, index) => {
    /// this.setState({isModalVisible: !this.state.isModalVisible});
    // console.log('resultarray==============================', resultarray);
    // console.log('index==============================', index);

    //this.getSuggestedTest('');
    this.setState({
      pickerVisible: !this.state.pickerVisible,
      resultArray: resultarray,
      resultIndex: index,
    });
    // this.setState(
    //     {
    //       selectedIds: [],
    //       isLoading: true,
    //       AllTestList: [],
    //       //isModalVisible: !this.state.isModalVisible
    //     },
    //     () => {
    //       this.getSuggestedTest('');
    //     }
    //   );
  };

  DismissModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return !this[a.TestId] && (this[a.TestId] = true);
    }, Object.create(null));
  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 5;
  };

  callpagination = async () => {
    this.setState(
      {
        paginationLoading: true,
        pageNo: this.state.pageNo + 1,
      },
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
        AllTestList: [],
        pageNo: 1,
        searchLoading: true,
      },
      () => {
        this.getSuggestedTest(true);
      }
    );
  };

  onChangeTextValueDiscription = async (val) => {
    // console.log("======", val);

    // this.setState(
    //   {
    //     searchString: val,
    //     AllTestList: [],
    //     pageNo: 1,
    //     searchLoading: true,
    //   },
    //   () => {
    //     this.getSuggestedTest(true);
    //   }
    // );

    // this.setState({
    //     selectPicker : value
    // }, () =>{
    let AnalyteList = [...this.state.AnalyteList];
    AnalyteList[this.state.resultIndex] = {
      ...AnalyteList[this.state.resultIndex],
      Value: val,
    };
    this.setState({ AnalyteList });
    //});
  };

  onRefresh = async () => {
    this.setState(
      {
        refreshing: true,
        AllTestList: [],
        searchString: "",
        pageNo: 1,
      },
      () => {
        this.getSuggestedTest();
      }
    );
  };

  onValueChange(value) {
    this.setState(
      {
        selectPicker: value,
      },
      () => {
        let AnalyteList = [...this.state.AnalyteList];
        AnalyteList[this.state.resultIndex] = {
          ...AnalyteList[this.state.resultIndex],
          Result: this.state.selectPicker,
        };
        this.setState({
          AnalyteList,
          pickerVisible: !this.state.pickerVisible,
        });
      }
    );
  }

  onPressSubmit = () => {
    // console.log('onPressSubmit response=================');

    if (this.state.labName == "") {
      Toast.show("Please enter Lab Name");
    } else if (this.state.bookingdate == "") {
      Toast.show("Please select date");
    } else if (this.state.testName == "") {
      Toast.show("Please Select Test");
    } else if (this.state.BookingId == "") {
      Toast.show("BookingId not generate");
    } else {
      this.setState({ isLoading: true });
      //this.BookAppointments();
      this.uploadPrescription();
    }
  };
  takePhotoFromCamera = () => {
    this.setState({ isPrescription: false }, () => {
      setTimeout(() => {
        ImagePicker.openCamera({
          // compressImageMaxWidth: 300,
          // compressImageMaxHeight: 300,
          // cropping: true,
          // compressImageQuality: 1,
          size: 5000000,
          mediaType: "photo",
        })
          .then((response) => {
            if (response.size > 5000000) {
              Toast.show("Please select image size upto 5MB");
            } else {
              // console.log(response, "from camera");
              let prescriptionPic = [];
              prescriptionPic.push({
                uri: response.path,
                type: response.mime,
                // name: response.fileName,
                name: response.path.slice(response.path.lastIndexOf("/") + 1),
              });

              this.setState(
                {
                  prescriptionPic: prescriptionPic,
                  prescriptionUri: response.uri,
                  prescriptionName: prescriptionPic[0].name,
                },
                () => {
                  // this.uploadPrescription();
                }
              );
            }
          })
          .catch((err) => {
            // Toast.show("Something Went Wrong, Please Try Again Later");

            // console.log("err", err);
            alert(err, "alert messaeg");
            this.setState({
              prescriptionPic: "",
              prescriptionUri: "",
              prescriptionName: "",
            });
            // console.log(err, "Camera ERRor ");
          });
      }, 500);
    });
  };

  choosePhotoFromLibrary = () => {
    this.setState({ isPrescription: false }, () => {
      setTimeout(() => {
        ImagePicker.openPicker({
          // width: 300,
          // height: 300,
          // cropping: true,
          // compressImageQuality: 1,
          size: 5000000,
          mediaType: "photo",
        })
          .then((response) => {
            if (response.size > 5000000) {
              Toast.show("Please select image size upto 5MB");
            } else {
              // console.log(response, "from libary");
              let prescriptionPic = [];
              prescriptionPic.push({
                uri: response.path,
                type: response.mime,
                // name: response.fileName,
                name: response.path.slice(response.path.lastIndexOf("/") + 1),
              });

              this.setState(
                {
                  prescriptionPic: prescriptionPic,
                  prescriptionUri: response.uri,
                  prescriptionName: prescriptionPic[0].name,
                },
                () => {
                  // this.uploadPrescription();
                }
              );
            }
          })
          .catch((err) => {
            // console.log("err", err);
            alert(err, "alert messaeg");
            this.setState({
              prescriptionPic: "",
              prescriptionUri: "",
              prescriptionName: "",
            });
          });
      });
    }),
      500;
  };

  chooseFile = async () => {
    var options = {
      title: "Select Image",

      storageOptions: {
        skipBackup: true,
        path: "images",
        saveToPhotos: true,
        privateDirectory: true,
        includeBase64: true,
      },
    };
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Howzu App needs  permission",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");

        this.setState({ isPrescription: false }, () => {
          setTimeout(() => {
            launchImageLibrary(options, (response) => {
              console.log("Response = @@@@@@@@@@@@@ ", response);

              if (response.didCancel) {
                console.log("User cancelled image picker");
              } else if (response.error) {
                console.log("ImagePicker Error: ", response.error);
              } else {
                if (response.size > 5000000) {
                  Toast.show("Please select image size upto 5MB");
                } else {
                  let prescriptionPic = [];
                  prescriptionPic.push({
                    uri: response.assets[0]
                      ? response.assets[0].uri
                      : response.uri,
                    type: response.assets[0]
                      ? response.assets[0].type
                      : response.type,
                    name: response.assets[0]
                      ? response.assets[0].fileName
                      : response.fileName,
                  });

                  this.setState(
                    {
                      // isLoading: true,
                      prescriptionPic: prescriptionPic,
                      prescriptionUri: response.assets[0]
                        ? response.assets[0].uri
                        : response.uri,
                      prescriptionName: prescriptionPic[0].name,
                    },
                    () => {
                      // this.uploadPrescription();
                    }
                  );
                }
              }
            });
          }, 500);
        });
      } else {
      }
    } else {
      this.setState({ isPrescription: false }, () => {
        setTimeout(() => {
          launchImageLibrary(options, (response) => {
            console.log("Response = @@@@@@@@@@@@@ ", response);

            if (response.didCancel) {
              console.log("User cancelled image picker");
            } else if (response.error) {
              console.log("ImagePicker Error: ", response.error);
            } else {
              console.log(
                response.assets[0].uri,
                "Loging the res ======",
                response.assets[0].type,
                response.assets[0].fileName,
                response.assets
              );
              if (response.size > 5000000) {
                Toast.show("Please select image size upto 5MB");
              } else {
                let prescriptionPic = [];
                prescriptionPic.push({
                  uri: response.assets[0]
                    ? response.assets[0].uri
                    : response.uri,
                  type: response.assets[0]
                    ? response.assets[0].type
                    : response.type,
                  name: response.assets[0]
                    ? response.assets[0].fileName
                    : response.fileName,
                });

                console.log(prescriptionPic, "prescritopn pic");
                this.setState(
                  {
                    // isLoading: true,
                    prescriptionPic: prescriptionPic,
                    prescriptionUri: response.assets[0]
                      ? response.assets[0].uri
                      : response.uri,
                    prescriptionName: prescriptionPic[0].name,
                  },
                  () => {
                    // this.uploadPrescription();
                  }
                );
              }
            }
          });
        }, 500);
      });
    }
  };
  ClosePOPup = () => {
    // console.log("ClosePOPup=================");
    this.setState({ isPrescription: false }, () => {});
  };

  render() {
    const screenWidth = Math.round(Dimensions.get("window").width);
    /// const navigation = useNavigation();
    var valuee = "";
    return (
      <View style={styles.MainContainer}>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="Upload Reports"
          headerId={1}
          navigation={this.props.navigation}
        />
        {/* For   CAMERA  */}
        <Modal isVisible={this.state.isPrescription} style={{ margin: 0 }}>
          <View
            style={{
              flexDirection: "column",
              width: "80%",
              height: "25%",
              backgroundColor: "white",
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                backgroundColor: "white",
                marginTop: 10,
                marginLeft: 0,
                marginRight: 0,
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={this.takePhotoFromCamera}>
                <Text style={{ textAlign: "center", fontSize: 16, margin: 10 }}>
                  Take Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.choosePhotoFromLibrary}>
                <Text
                  style={{ textAlign: "center", fontSize: 15, margin: 10 }}
                  numberOfLines={1}
                >
                  Choose From Library
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.chooseFile}>
                <Text
                  style={{ textAlign: "center", fontSize: 15, margin: 10 }}
                  numberOfLines={1}
                >
                  Choose From Gallery
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.ClosePOPup}>
                <Text style={{ textAlign: "center", fontSize: 15, margin: 10 }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <ScrollView
          alwaysBounceVertical={true}
          showsHorizontalScrollIndicator={false}
          style={{ backgroundColor: "white", marginTop: 0 }}
        >
          <Text
            style={{
              marginTop: 20,
              fontSize: 14,
              marginLeft: 15,
              fontWeight: "bold",
            }}
          >
            Upload Report
          </Text>

          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 60,
              backgroundColor: "lightgray",
              marginRight: 15,
              marginLeft: 15,
              marginTop: 8,
              borderRadius: 5,
              flexDirection: "row",
            }}
            onPress={() => {
              this.setState({ isPrescription: true });
            }}
          >
            <Image
              source={require("../../icons/Upload-image-here.png")}
              style={{
                height: 30,
                width: 30,
                margin: 10,
                justifyContent: "center",
                alignSelf: "center",
              }}
            />
            <Text style={{ color: "gray", fontSize: 18 }}>
              Upload Report here
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              textAlign: "center",
              backgroundColor: "white",
              alignContent: "center",
              margin: 5,
              color: "darkgray",
              fontSize: 12,
            }}
          >
            {this.state.prescriptionName}
          </Text>

          {this.state.prescriptionName != "" ? (
            <TouchableOpacity
              style={{
                backgroundColor: "#1B2B34",
                marginTop: 20,
                marginBottom: 20,
                borderRadius: 20,
                marginLeft: 15,
                marginRight: 15,
                height: 40,
                justifyContent: "center",
                shadowOffset: { width: 2, height: 3 },
                elevation: 5,
                shadowColor: "gray",
                shadowOpacity: 0.9,
              }}
              onPress={this.onPressSubmit}
            >
              <Text
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                  fontSize: 18,
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                SUBMIT
              </Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    paddingTop: 0,
    backgroundColor: "white",
    //zIndex:0,
    //position: 'absolute'
  },

  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    marginLeft: 5,
    justifyContent: "center",
    backgroundColor: "white",
  },

  Separator: {
    height: 0.5,
    backgroundColor: "gray",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10,
  },
});
